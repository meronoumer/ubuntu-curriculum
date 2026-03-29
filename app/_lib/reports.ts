export type Report = {
  id: string;
  sessionId: string;
  sessionTitle: string;
  submittedAt: string;   // ISO datetime string
  attendees: number;
  engagement: number;    // 1–5
  highlights: string;
  challenges: string;
  notes: string;
};

const STORAGE_KEY = "uf_reports";

export function loadReports(): Report[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Report[];
  } catch {
    return [];
  }
}

export function saveReport(report: Omit<Report, "id" | "submittedAt">): Report {
  const full: Report = {
    ...report,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  try {
    const existing = loadReports();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, full]));
  } catch {
    // localStorage unavailable — silently degrade
  }
  return full;
}
