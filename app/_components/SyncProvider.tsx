"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { syncPendingReports, loadPendingReports } from "@/app/_lib/reports";

// ─── Context ──────────────────────────────────────────────────────────────────

type SyncState = {
  pending: number;     // reports not yet uploaded
  syncing: boolean;    // upload in-flight
  lastSynced: Date | null;
  triggerSync: () => void;
};

const SyncContext = createContext<SyncState>({
  pending: 0,
  syncing: false,
  lastSynced: null,
  triggerSync: () => {},
});

export function useSyncStatus() {
  return useContext(SyncContext);
}

// ─── Banner ───────────────────────────────────────────────────────────────────

function SyncBanner() {
  const { pending, syncing, lastSynced, triggerSync } = useSyncStatus();

  if (syncing) {
    return (
      <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 text-center text-xs text-indigo-600">
        Syncing reports…
      </div>
    );
  }

  if (pending > 0) {
    return (
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-between text-xs text-amber-700">
        <span>
          {pending} report{pending !== 1 ? "s" : ""} waiting to sync
        </span>
        <button
          onClick={triggerSync}
          className="font-semibold underline underline-offset-2 hover:text-amber-900"
        >
          Sync now
        </button>
      </div>
    );
  }

  if (lastSynced) {
    return (
      <div className="bg-green-50 border-b border-green-100 px-4 py-1.5 text-center text-xs text-green-600">
        All reports synced
      </div>
    );
  }

  // No pending reports and never synced this session — nothing to show
  return null;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  function refreshPendingCount() {
    try {
      setPending(loadPendingReports().length);
    } catch {
      setPending(0);
    }
  }

  const runSync = useCallback(async () => {
    if (syncing || !navigator.onLine) return;
    setSyncing(true);
    try {
      const synced = await syncPendingReports();
      if (synced > 0) setLastSynced(new Date());
      refreshPendingCount();
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  // Count pending on first render
  useEffect(() => {
    refreshPendingCount();
  }, []);

  // Run sync on mount (if online) and whenever the browser comes back online
  useEffect(() => {
    runSync();

    function handleOnline() {
      refreshPendingCount();
      runSync();
    }

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  // runSync is stable across renders — including it here is correct
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SyncContext.Provider
      value={{ pending, syncing, lastSynced, triggerSync: runSync }}
    >
      <SyncBanner />
      {children}
    </SyncContext.Provider>
  );
}
