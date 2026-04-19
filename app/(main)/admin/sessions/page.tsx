import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient, fetchSessions } from "@/app/_lib/supabase-server";
import type { DbSession } from "@/app/_lib/supabase";
import SessionForm from "./_components/SessionForm";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<DbSession["status"], string> = {
  upcoming:    "bg-[#EDE4D3] text-[#7A5C3E]",
  "in-progress": "bg-[#D9B44A]/20 text-[#7A5C3E]",
  completed:   "bg-[#1F4D3A]/10 text-[#1F4D3A]",
};

const STATUS_LABELS: Record<DbSession["status"], string> = {
  upcoming:    "Upcoming",
  "in-progress": "In Progress",
  completed:   "Completed",
};

export default async function AdminSessionsPage() {
  // Role guard (proxy already blocks non-admins, but double-check here)
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.user_metadata?.role !== "admin") {
      redirect("/sessions");
    }
  }

  const sessions = await fetchSessions();

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="text-xs text-[#7A5C3E]/60 hover:text-[#7A5C3E] transition-colors"
          >
            ← Admin dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-[#1F2937] mt-1">
            Manage Sessions
          </h1>
        </div>
      </div>

      {/* Create form */}
      <SessionForm />

      {/* Session list */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#7A5C3E]">
          {sessions === null
            ? "Supabase not configured — sessions unavailable"
            : `${sessions.length} session${sessions.length !== 1 ? "s" : ""} scheduled`}
        </p>

        {sessions === null || sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#EDE4D3] p-10 text-center text-sm text-[#1F2937]/40">
            {sessions === null
              ? "Connect Supabase to create and manage sessions."
              : "No sessions yet. Create one above."}
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-[#EDE4D3] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-[#1F2937]">{s.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[s.status]}`}>
                      {STATUS_LABELS[s.status]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 text-xs text-[#1F2937]/40">
                    <span>{formatDate(s.date)}</span>
                    <span>{s.location}</span>
                    <span>{s.assigned_to}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
