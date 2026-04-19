import Link from "next/link";
import { MOCK_SESSIONS, MOCK_STEPS, type SessionStatus } from "@/app/_lib/mock-data";
import { getSupabaseServerClient, fetchSessions } from "@/app/_lib/supabase-server";
import type { DbSession } from "@/app/_lib/supabase";

// ─── Shared display type ──────────────────────────────────────────────────────
// Normalises DbSession and the mock Session shape into one flat object
// so SessionCard doesn't need to care where the data came from.

type DisplaySession = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  assignedTo: string;
  status: SessionStatus;
  totalSteps: number;
};

function fromDb(s: DbSession): DisplaySession {
  const steps = s.template_id ? (MOCK_STEPS[s.template_id] ?? []) : [];
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    date: s.date,
    location: s.location,
    assignedTo: s.assigned_to,
    status: s.status as SessionStatus,
    totalSteps: steps.length,
  };
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<SessionStatus, string> = {
  "upcoming":    "bg-[#EDE4D3] text-[#7A5C3E]",
  "in-progress": "bg-[#D9B44A]/20 text-[#7A5C3E]",
  "completed":   "bg-[#1F4D3A]/10 text-[#1F4D3A]",
};

const STATUS_LABELS: Record<SessionStatus, string> = {
  "upcoming":    "Upcoming",
  "in-progress": "In Progress",
  "completed":   "Completed",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Session card ─────────────────────────────────────────────────────────────

function SessionCard({ session }: { session: DisplaySession }) {
  const isCompleted = session.status === "completed";

  return (
    <Link
      href={`/sessions/${session.id}`}
      className="block rounded-2xl bg-white border border-[#EDE4D3] p-4 hover:border-[#1F4D3A]/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-[#1F2937] text-sm leading-snug">
          {session.title}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[session.status]}`}
        >
          {STATUS_LABELS[session.status]}
        </span>
      </div>

      <p className="mt-1.5 text-xs text-[#1F2937]/50 line-clamp-2">
        {session.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#1F2937]/40">
        <span>{formatDate(session.date)}</span>
        <span>{session.location}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#1F2937]/40">
        {session.totalSteps > 0 && <span>{session.totalSteps} steps</span>}
        {isCompleted ? (
          <span className="text-[#1F4D3A] font-medium">Done ✓</span>
        ) : (
          <span className="text-[#7A5C3E] font-medium">Open →</span>
        )}
      </div>
    </Link>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({ label, sessions }: { label: string; sessions: DisplaySession[] }) {
  if (sessions.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7A5C3E]">
        {label}
      </h2>
      {sessions.map((s) => <SessionCard key={s.id} session={s} />)}
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SessionsPage() {
  // Try to load real sessions for the current user from Supabase.
  // Falls back to mock data when Supabase is not configured.
  let sessions: DisplaySession[];

  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email ?? "";

    // Admins see all sessions; facilitators see only their assigned sessions
    const isAdmin = user?.user_metadata?.role === "admin";
    const dbSessions = await fetchSessions();

    if (dbSessions !== null) {
      const filtered = isAdmin
        ? dbSessions
        : dbSessions.filter((s) => s.assigned_to === userEmail);
      sessions = filtered.map(fromDb);
    } else {
      // fetchSessions returned null (error) — fall back to mock
      sessions = MOCK_SESSIONS.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        date: s.date,
        location: s.location,
        assignedTo: s.facilitator,
        status: s.status,
        totalSteps: s.totalSteps,
      }));
    }
  } else {
    // Supabase not configured — show mock sessions
    sessions = MOCK_SESSIONS.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      date: s.date,
      location: s.location,
      assignedTo: s.facilitator,
      status: s.status,
      totalSteps: s.totalSteps,
    }));
  }

  const active    = sessions.filter((s) => s.status === "in-progress");
  const upcoming  = sessions.filter((s) => s.status === "upcoming");
  const completed = sessions.filter((s) => s.status === "completed");

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-[#1F2937]">Sessions</h1>

      {sessions.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#EDE4D3] p-12 text-center">
          <p className="text-sm text-[#1F2937]/40">
            No sessions assigned to you yet. Contact your program manager.
          </p>
        </div>
      )}

      <Section label="In Progress" sessions={active} />
      <Section label="Upcoming"    sessions={upcoming} />
      <Section label="Completed"   sessions={completed} />
    </div>
  );
}
