"use client";

import Link from "next/link";
import { useRef } from "react";
import { NAV_LINKS } from "./Nav";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".footer-letter", {
        yPercent: 100,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: { trigger: ".footer-word", start: "top 95%" },
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink text-white">
      <div className="mx-auto max-w-[1240px] px-5 pt-20 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-4xl leading-tight md:text-5xl">
              Less chaos.
              <br />
              <em>More clarity.</em>
            </p>
            <Link href="/get-the-app" className="btn mt-8 bg-white text-ink hover:bg-white/85">
              Get started free →
            </Link>
          </div>
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/40">Product</p>
            <ul className="space-y-2.5 text-white/80">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/get-the-app" className="transition-colors hover:text-white">
                  Download
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/40">About this site</p>
            <p className="text-sm leading-relaxed text-white/60">
              A portfolio project — Mindly is a concept product. Built with Next.js, GSAP and Lenis. Photography from
              Unsplash. Visual direction inspired by a Mindly concept shot found on Dribbble.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-word mx-auto mt-16 flex max-w-[1240px] select-none justify-center overflow-hidden px-5 md:px-10">
        {"Mindly°".split("").map((c, i) => (
          <span key={i} className="footer-letter font-serif inline-block text-[27vw] leading-[0.8] md:text-[22vw]">
            {c}
          </span>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1240px] justify-between border-t border-white/10 px-5 py-6 text-xs text-white/40 md:px-10">
        <span>© {new Date().getFullYear()} Mindly concept</span>
        <span>A more focused you, every day.</span>
      </div>
    </footer>
  );
}
