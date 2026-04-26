import { notFound } from "next/navigation";
import { MOCK_SESSIONS, MOCK_STEPS, type Session } from "@/app/_lib/mock-data";
import { fetchSession } from "@/app/_lib/supabase-server";
import type { DbSession } from "@/app/_lib/supabase";
import SessionPlayer from "./_components/SessionPlayer";

function normalizeStatus(
  status: string | null | undefined
): Session["status"] {
  if (status === "in-progress") return "in-progress";
  if (status === "completed") return "completed";
  return "upcoming";
}

// Convert a Supabase session into the Session shape SessionPlayer expects.
// Steps always come from MOCK_STEPS (keyed by template_id).
function dbToSession(s: DbSession): Session {
  const steps = s.template_id ? (MOCK_STEPS[s.template_id] ?? []) : [];

  return {
    id: s.id,
    title: s.title,
    description: s.description ?? "No description provided yet.",
    date: s.date,
    location: s.location ?? "Location not set",
    facilitator: s.assigned_to ?? s.facilitator_email ?? "Unassigned",
    status: normalizeStatus(s.status),
    totalSteps: steps.length,
  };
}

export default async function SessionPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Try to find a real session in Supabase.
  const dbSession = await fetchSession(id);

  if (dbSession) {
    // Real session found — use Supabase data, look up steps by template_id.
    const session = dbToSession(dbSession);
    const steps = dbSession.template_id
      ? (MOCK_STEPS[dbSession.template_id] ?? [])
      : [];

    if (steps.length === 0) {
      // Session exists but has no curriculum template assigned.
      return (
        <div className="py-16 text-center space-y-2">
          <p className="text-sm font-medium text-[#1F2937]">{session.title}</p>
          <p className="text-sm text-[#1F2937]/50">
            No curriculum template has been assigned to this session yet. Contact your program manager.
          </p>
        </div>
      );
    }

    return (
      <SessionPlayer
        session={session}
        steps={steps}
        sessionDbId={dbSession.id}
        initialStatus={normalizeStatus(dbSession.status)}
      />
    );
  }

  // 2. Fall back to mock data (demo mode / Supabase not configured).
  const mockSession = MOCK_SESSIONS.find((s) => s.id === id);
  const mockSteps = MOCK_STEPS[id];

  if (!mockSession || !mockSteps) notFound();

  return (
    <SessionPlayer
      session={mockSession}
      steps={mockSteps}
    />
  );
}