import { MOCK_SESSIONS } from "@/app/_lib/mock-data";
import ReportForm from "./_components/ReportForm";

export default async function ReportPage(props: PageProps<"/report">) {
  const { sessionId } = await props.searchParams as { sessionId?: string };

  // Only pre-select if the id actually exists in our data
  const preselected =
    MOCK_SESSIONS.some((s) => s.id === sessionId) ? (sessionId ?? null) : null;

  return <ReportForm sessions={MOCK_SESSIONS} preselectedSessionId={preselected} />;
}
