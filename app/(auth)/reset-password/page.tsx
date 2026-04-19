"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/app/_lib/supabase";

type Status = "idle" | "loading" | "sent" | "error";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMsg("Authentication is not configured.");
      setStatus("error");
      return;
    }

    // redirectTo must be allowlisted in Supabase → Authentication → URL Configuration
    const redirectTo = `${window.location.origin}/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  // ── Confirmation state ────────────────────────────────────────────────────────
  if (status === "sent") {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "var(--color-cream)" }}
      >
        <div className="w-full max-w-sm space-y-6 text-center">
          <div
            className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: "var(--color-beige)", color: "var(--color-green)" }}
          >
            ✓
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-green)" }}>
              Check your email
            </h1>
            <p className="text-sm" style={{ color: "var(--color-brown)" }}>
              We sent a password reset link to{" "}
              <span className="font-medium" style={{ color: "var(--color-text)" }}>
                {email}
              </span>
              . Click the link in that email to choose a new password.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-block text-xs hover:underline"
            style={{ color: "var(--color-brown)" }}
          >
            ← Back to sign in
          </Link>
        </div>
      </main>
    );
  }

  // ── Request form ──────────────────────────────────────────────────────────────
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
            Reset password
          </h1>
          <p className="text-sm" style={{ color: "var(--color-brown)" }}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border p-6 space-y-4"
          style={{ borderColor: "var(--color-beige)" }}
        >
          {status === "error" && errorMsg && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text)" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
            {status === "loading" ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="text-xs hover:underline"
            style={{ color: "var(--color-brown)" }}
          >
            ← Back to sign in
          </Link>
        </div>

      </div>
    </main>
  );
}
