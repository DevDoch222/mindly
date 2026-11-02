"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Icon } from "../Icons";

const PLANS = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    blurb: "For getting your thoughts out of your head.",
    features: ["Unlimited notes", "Voice capture (30 min / mo)", "2 devices", "Daily focus list"],
  },
  {
    name: "Pro",
    monthly: 9,
    yearly: 7,
    blurb: "For people who think for a living.",
    features: ["Everything in Free", "Smart spaces & auto-organise", "Unlimited voice capture", "Focus mode & soundscapes", "All integrations"],
    featured: true,
  },
  {
    name: "Teams",
    monthly: 16,
    yearly: 13,
    blurb: "Shared clarity for small teams.",
    features: ["Everything in Pro", "Shared spaces", "Team plans & reviews", "Admin & SSO", "Priority support"],
  },
];

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const [yearly, setYearly] = useState(true);
  const prices = useRef<Record<string, { v: number }>>({});

  // Prices roll to their new value when the billing period flips.
  useGSAP(
    () => {
      ref.current!.querySelectorAll<HTMLElement>("[data-price]").forEach((el) => {
        const plan = PLANS.find((p) => p.name === el.dataset.price)!;
        const target = yearly ? plan.yearly : plan.monthly;
        const o = (prices.current[plan.name] ??= { v: target });
        if (prefersReducedMotion()) {
          o.v = target;
          el.textContent = String(target);
          return;
        }
        gsap.to(o, { v: target, duration: 0.8, ease: "expo.out", onUpdate: () => {
            el.textContent = String(Math.round(o.v));
          },
        });
        gsap.fromTo(el, { yPercent: yearly ? 30 : -30, opacity: 0.4 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
      });
    },
    { dependencies: [yearly], scope: ref },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".plan-card", { y: 80, opacity: 0, rotateX: -15, duration: 1.3, ease: "expo.out", stagger: 0.12, delay: 0.9 });
    },
    { scope: ref },
  );

  const spotlight = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref}>
      <div className="flex justify-center">
        <div className="relative flex rounded-full border border-line bg-white/60 p-1 text-sm">
          <span
            className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
              yearly ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button onClick={() => setYearly(false)} className={`relative z-10 w-32 rounded-full py-2.5 transition-colors ${yearly ? "" : "text-white"}`}>
            Monthly
          </button>
          <button onClick={() => setYearly(true)} className={`relative z-10 w-32 rounded-full py-2.5 transition-colors ${yearly ? "text-white" : ""}`}>
            Yearly <span className="opacity-60">−20%</span>
          </button>
        </div>
      </div>

      <div className="mt-14 grid gap-5 [perspective:1400px] lg:grid-cols-3">
        {PLANS.map((p) => (
          <article
            key={p.name}
            onPointerMove={spotlight}
            className={`plan-card spotlight flex flex-col rounded-[32px] p-8 md:p-10 ${p.featured ? "dark bg-ink text-white lg:-translate-y-4" : "paper-card"}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{p.name}</h3>
              {p.featured && <span className="rounded-full bg-[#d9f26b] px-3 py-1 text-xs font-medium text-ink">Most popular</span>}
            </div>
            <p className={`mt-2 text-sm ${p.featured ? "text-white/60" : "text-muted"}`}>{p.blurb}</p>
            <p className="font-serif mt-10 flex items-baseline gap-1 overflow-hidden text-7xl leading-none">
              $<span data-price={p.name} className="inline-block">{yearly ? p.yearly : p.monthly}</span>
              <span className={`ml-1 font-sans text-sm ${p.featured ? "text-white/50" : "text-muted"}`}>/ month</span>
            </p>
            <ul className="mt-10 space-y-3 text-[15px]">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${p.featured ? "bg-white/15" : "bg-ink/5"}`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                      <path d="M2 5.2l2 2 4-4.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/get-the-app"
              className={`btn mt-auto justify-center pt-3.5 ${p.featured ? "bg-white text-ink hover:bg-white/85" : "btn-dark"} !mt-10`}
            >
              {p.monthly === 0 ? "Start for free" : `Choose ${p.name}`} <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
