"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Container } from "../ui";

const STATS = [
  { value: 50, suffix: "k+", label: "Creators thinking clearer" },
  { value: 2.4, suffix: "M", label: "Ideas captured", decimals: 1 },
  { value: 38, suffix: "%", label: "More deep-work time*" },
  { value: 4.9, suffix: "", label: "Average app rating", decimals: 1 },
];

export default function Stats() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".stat-num", ref.current).forEach((el) => {
        const end = parseFloat(el.dataset.value!);
        const decimals = parseInt(el.dataset.decimals || "0");
        if (prefersReducedMotion()) {
          el.textContent = end.toFixed(decimals);
          return;
        }
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 2.2,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => {
            el.textContent = o.v.toFixed(decimals);
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="border-y border-line py-16 md:py-20">
      <Container className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="border-l border-line pl-5 md:pl-8">
            <p className="font-serif text-[clamp(3rem,6vw,5rem)] leading-none">
              <span className="stat-num" data-value={s.value} data-decimals={s.decimals ?? 0}>
                0
              </span>
              <em>{s.suffix}</em>
            </p>
            <p className="mt-3 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </Container>
      <Container>
        <p className="mt-10 text-xs text-muted/70">*Self-reported by users after 30 days. Concept data for this portfolio piece.</p>
      </Container>
    </section>
  );
}
