"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Flip } from "gsap/Flip";
import { APPS, monogram, type Category } from "./data";

gsap.registerPlugin(Flip);

const FILTERS: ("All" | Category)[] = ["All", "Productivity", "Communication", "Storage", "Focus"];

/** Filterable grid — cards glide to their new spots with GSAP Flip when the filter changes. */
export default function AppGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const flipState = useRef<Flip.FlipState | null>(null);

  const choose = (f: (typeof FILTERS)[number]) => {
    if (f === filter) return;
    flipState.current = Flip.getState(ref.current!.querySelectorAll(".app-card"));
    setFilter(f);
  };

  useGSAP(
    () => {
      if (!flipState.current) return;
      if (prefersReducedMotion()) {
        flipState.current = null;
        return;
      }
      Flip.from(flipState.current, {
        duration: 0.7,
        ease: "expo.out",
        absolute: true,
        stagger: 0.02,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.8, duration: 0.4 }),
      });
      flipState.current = null;
    },
    { dependencies: [filter], scope: ref },
  );

  return (
    <div ref={ref}>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => choose(f)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
              filter === f ? "border-ink bg-ink text-white" : "border-line hover:border-ink/40"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {APPS.map((app) => (
          <div
            key={app.name}
            data-flip-id={app.name}
            className={`app-card paper-card group flex items-start gap-4 rounded-[24px] p-5 transition-shadow hover:shadow-xl ${
              filter === "All" || app.cat === filter ? "" : "hidden"
            }`}
          >
            <span
              className="font-serif flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"
              style={{ background: app.color }}
            >
              {monogram(app.name)}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-medium">
                {app.name}
                <span className="rounded-full bg-bg-soft px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">{app.cat}</span>
              </p>
              <p className="mt-1 text-sm text-muted">{app.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
