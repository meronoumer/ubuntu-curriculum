"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/app/_lib/supabase";

type Status = "idle" | "loading" | "done" | "error";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setStatus("loading");

    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMsg("Authentication is not configured.");
      setStatus("error");
      return;
    }

    // The recovery token from the email link is picked up automatically by the
    // Supabase client from the URL hash (#access_token=...&type=recovery).
    // updateUser() uses that token to authorise the password change.
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }

    setStatus("done");

    // Give the user a moment to read the confirmation, then send them to login.
    setTimeout(() => router.push("/login"), 2500);
  }

  // ── Success state ─────────────────────────────────────────────────────────────
  if (status === "done") {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "var(--color-cream)" }}
      >
        <div className="w-full max-w-sm text-center space-y-4">
          <div
            className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: "var(--color-beige)", color: "var(--color-green)" }}
          >
            ✓
          </div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-green)" }}>
            Password updated
          </h1>
          <p className="text-sm" style={{ color: "var(--color-brown)" }}>
            Your new password has been saved. Redirecting you to sign in…
          </p>
        </div>
      </main>
    );
  }

  // ── Update form ───────────────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      <div className="w-full max-w-sm space-y-6">

        {/* Header */}
        <div className="text-center space-y-1">
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--color-green)" }}
          >
            Choose a new password
          </h1>
          <p className="text-sm" style={{ color: "var(--color-brown)" }}>
            Enter and confirm your new password below.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border p-6 space-y-4"
          style={{ borderColor: "var(--color-beige)" }}
        >
          {errorMsg && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text)" }}
            >
              New password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-beige)" }}
            />
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text)" }}
            >
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your new password"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "var(--color-beige)" }}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-green)" }}
          >
            {status === "loading" ? "Saving…" : "Update password"}
          </button>
        </form>

      </div>
    </main>
  );
}
