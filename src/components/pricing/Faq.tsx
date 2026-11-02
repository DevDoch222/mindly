"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const FAQ = [
  { q: "Is Mindly really free?", a: "Yes. The Free plan has no time limit and covers unlimited notes on two devices. Upgrade only when you want the extras." },
  { q: "Can I switch plans later?", a: "Anytime. Upgrades take effect immediately and downgrades apply at the end of your billing period." },
  { q: "Is my data private?", a: "Your notes are end-to-end encrypted. We can't read them, and we never sell or train on your data." },
  { q: "Does it work offline?", a: "Fully. Mindly stores everything locally first and syncs the moment you're back online." },
  { q: "Do you offer student discounts?", a: "Students and educators get Pro at 50% off. Verify with your school email on the Get the app page." },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ref.current!.querySelectorAll<HTMLElement>(".faq-body").forEach((el, i) => {
        gsap.to(el, { height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0, duration: 0.6, ease: "expo.out" });
      });
    },
    { dependencies: [open], scope: ref },
  );

  return (
    <div ref={ref} className="divide-y divide-line border-y border-line">
      {FAQ.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-6 py-7 text-left"
            aria-expanded={open === i}
          >
            <span className="font-serif text-2xl md:text-3xl">{f.q}</span>
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-xl transition-transform duration-500 ${
                open === i ? "rotate-45 bg-ink text-white" : ""
              }`}
            >
              +
            </span>
          </button>
          <div className="faq-body h-0 overflow-hidden opacity-0">
            <p className="max-w-[640px] pb-8 text-muted md:text-lg">{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
