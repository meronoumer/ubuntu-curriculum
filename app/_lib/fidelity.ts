// Session fidelity tracking — CLIENT-ONLY (uses localStorage).
//
// Fidelity measures whether a facilitator completed steps as designed.
// This file keeps the feature lightweight and beginner-friendly.

export type SkipReason = "time" | "materials" | "not_relevant" | "other";

export type StepFidelityRecord = {
  stepIndex: number;
  stepTitle: string;
  required: boolean;
  completed: boolean;
  skipped: boolean;
  skipReason?: SkipReason;
  adaptationNote?: string;
  sensitiveDiscussion: boolean;
  startedAt: string;
  completedAt: string;
};

export type SessionFidelityRecord = {
  sessionId: string;
  steps: StepFidelityRecord[];
  fidelityScore: number;
  savedAt: string;
};

const STORAGE_PREFIX = "uf_fidelity_";

function storageKey(sessionId: string) {
  return `${STORAGE_PREFIX}${sessionId}`;
}

export function computeFidelityScore(records: StepFidelityRecord[]): number {
  if (records.length === 0) return 100;
  const completed = records.filter((record) => record.completed).length;
  return Math.round((completed / records.length) * 100);
}

export function fidelityLabel(score: number): "Poor" | "Fair" | "Good" {
  if (score >= 70) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

export function fidelityColour(score: number): { bg: string; text: string } {
  const label = fidelityLabel(score);

  if (label === "Good") {
    return {
      bg: "bg-green-100",
      text: "text-green-700",
    };
  }

  if (label === "Fair") {
    return {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
    };
  }

  return {
    bg: "bg-red-100",
    text: "text-red-700",
  };
}

export function fidelityStatus(score: number) {
  const label = fidelityLabel(score);
  const color =
    label === "Good" ? "green" : label === "Fair" ? "yellow" : "red";

  return { label, color };
}

export function saveFidelity(
  sessionId: string,
  steps: StepFidelityRecord[]
): SessionFidelityRecord {
  const record: SessionFidelityRecord = {
    sessionId,
    steps,
    fidelityScore: computeFidelityScore(steps),
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(storageKey(sessionId), JSON.stringify(record));
  } catch {
    // localStorage may not be available in some environments.
  }

  return record;
}

export function loadFidelity(sessionId: string): SessionFidelityRecord | null {
  try {
    const raw = localStorage.getItem(storageKey(sessionId));
    if (!raw) return null;
    return JSON.parse(raw) as SessionFidelityRecord;
  } catch {
    return null;
  }
}

export function clearFidelity(sessionId: string): void {
  try {
    localStorage.removeItem(storageKey(sessionId));
  } catch {
    // ignore localStorage errors
  }
}