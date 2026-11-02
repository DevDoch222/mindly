"use client";

import { useState } from "react";

/** Email capture with client-side validation and an animated success state (no backend — portfolio demo). */
export default function SendLink() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "sending" | "sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState("error");
      return;
    }
    setState("sending");
    window.setTimeout(() => setState("sent"), 900);
  };

  if (state === "sent") {
    return (
      <div className="paper-card flex items-center gap-3 rounded-full px-6 py-4 text-sm">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d9f26b]">✓</span>
        Link on its way to <strong className="font-medium">{email}</strong>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div
        className={`flex rounded-full border bg-white p-1.5 transition-colors ${state === "error" ? "border-red-400" : "border-line focus-within:border-ink/40"}`}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="you@email.com"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
        />
        <button type="submit" disabled={state === "sending"} className="btn btn-dark !py-2.5 disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Send me the link"}
        </button>
      </div>
      {state === "error" && <p className="mt-2 pl-4 text-sm text-red-500">Please enter a valid email address.</p>}
    </form>
  );
}
