"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Something went wrong. Try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Check your connection.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-border bg-card p-10 md:p-16">
        <p className="font-mono text-sm">You&apos;re in. Watch your inbox.</p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card p-10 md:p-16">
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
        Raw Notes
      </p>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
        Unfiltered thinking on business, marketing, and human nature.
      </h3>
      <p className="mt-3 text-sm text-muted">
        No schedule. No fluff. Just honest notes when I have something worth saying.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          disabled={status === "loading"}
          className="flex-1 border border-border bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-foreground disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-foreground px-8 py-3 font-mono text-sm font-semibold text-background transition-colors hover:bg-foreground/80 disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 font-mono text-xs text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}
