"use client";

import { useSubscribe } from "@/lib/useSubscribe";

export default function SubscribeForm({
  buttonText = "Subscribe",
  successText = "You're in. Watch your inbox.",
  placeholder = "Your email",
  dark = false,
}: {
  buttonText?: string;
  successText?: string;
  placeholder?: string;
  dark?: boolean;
}) {
  const { email, setEmail, status, errorMsg, subscribe } = useSubscribe();

  if (status === "success") {
    return (
      <p className={`font-mono text-sm ${dark ? "text-background/70" : ""}`}>
        {successText}
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={status === "loading"}
          className={
            dark
              ? "flex-1 border border-background/20 bg-transparent px-5 py-4 font-mono text-sm text-background outline-none transition-colors placeholder:text-background/30 focus:border-background/50 disabled:opacity-50"
              : "flex-1 border border-border bg-transparent px-5 py-4 font-mono text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-foreground disabled:opacity-50"
          }
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={
            dark
              ? "bg-background px-10 py-4 font-mono text-sm font-semibold text-foreground transition-colors hover:bg-background/90 disabled:opacity-50"
              : "bg-foreground px-10 py-4 font-mono text-sm font-semibold text-background transition-colors hover:bg-foreground/80 disabled:opacity-50"
          }
        >
          {status === "loading" ? "..." : buttonText}
        </button>
      </form>
      {status === "error" && (
        <p className={`mt-3 font-mono text-xs ${dark ? "text-red-400" : "text-red-500"}`}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}
