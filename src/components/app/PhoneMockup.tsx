"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Icon } from "../Icons";

/** A CSS-built phone that tilts toward the cursor and cycles through app screens. */
export default function PhoneMockup() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current!;
      const phone = el.querySelector<HTMLElement>(".phone")!;

      gsap.from(phone, { y: 200, rotateX: 40, rotateZ: -10, opacity: 0, duration: 1.8, ease: "expo.out", delay: 1 });
      gsap.from(".phone-chip", { scale: 0, opacity: 0, duration: 1, ease: "back.out(2)", stagger: 0.15, delay: 1.8 });

      const screens = gsap.utils.toArray<HTMLElement>(".screen");
      gsap.set(screens.slice(1), { xPercent: 100 });
      const tl = gsap.timeline({ repeat: -1, delay: 2.5 });
      screens.forEach((s, i) => {
        const next = screens[(i + 1) % screens.length];
        tl.to(s, { xPercent: -100, duration: 0.9, ease: "expo.inOut" }, "+=2.2")
          .fromTo(next, { xPercent: 100 }, { xPercent: 0, duration: 0.9, ease: "expo.inOut" }, "<");
      });

      const rx = gsap.quickTo(phone, "rotateX", { duration: 1.2, ease: "power3.out" });
      const ry = gsap.quickTo(phone, "rotateY", { duration: 1.2, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        rx(-((e.clientY / window.innerHeight) * 2 - 1) * 10);
        ry(((e.clientX / window.innerWidth) * 2 - 1) * 18);
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative mx-auto flex h-[600px] w-full max-w-[460px] items-center justify-center [perspective:1400px]">
      <div className="phone relative h-[560px] w-[275px] rounded-[48px] bg-ink p-3 shadow-[0_60px_100px_-30px_rgba(0,0,0,.55)] [transform-style:preserve-3d]">
        <div className="relative h-full w-full overflow-hidden rounded-[38px] bg-bg">
          <span className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-ink" />
          {/* Screen 1: today */}
          <div className="screen absolute inset-0 px-5 pt-14">
            <p className="text-xs text-muted">Good morning</p>
            <p className="font-serif text-3xl">Today&apos;s focus</p>
            <div className="mt-5 space-y-2.5">
              {[
                ["Finish essay draft", "#c3b4ff"],
                ["Review Q3 roadmap", "#ffb98f"],
                ["30 min reading", "#a6e6d4"],
              ].map(([t, c], i) => (
                <div key={t} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 text-sm shadow-sm">
                  <span className="h-4 w-4 rounded-full border-2" style={{ borderColor: c, background: i === 0 ? c : "transparent" }} />
                  {t}
                </div>
              ))}
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl">
              <Image src="/images/card-mountain.jpg" alt="" width={240} height={140} className="h-32 w-full object-cover" />
            </div>
          </div>
          {/* Screen 2: focus */}
          <div className="screen absolute inset-0 flex flex-col items-center justify-center bg-ink text-white">
            <div className="relative h-44 w-44">
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#d9f26b" strokeWidth="2.5" strokeDasharray="190 283" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-5xl">18:42</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Deep work</span>
              </div>
            </div>
            <p className="mt-8 text-sm text-white/60">Essay draft</p>
          </div>
          {/* Screen 3: capture */}
          <div className="screen absolute inset-0 px-5 pt-14">
            <p className="font-serif text-3xl">Capture</p>
            <div className="mt-6 flex h-40 items-center justify-center gap-1 rounded-3xl bg-white shadow-sm">
              {Array.from({ length: 22 }).map((_, i) => (
                <span key={i} className="w-1 animate-pulse rounded-full bg-ink" style={{ height: `${12 + Math.abs(Math.sin(i * 1.3)) * 60}px`, animationDelay: `${i * 0.07}s` }} />
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">&ldquo;What if the onboarding felt like a story instead of a form…&rdquo;</p>
          </div>
        </div>
      </div>

      <div className="phone-chip glass absolute left-0 top-24 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm md:-left-6">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d9f26b]">
          <Icon name="focus" className="h-4 w-4" />
        </span>
        Focus started
      </div>
      <div className="phone-chip glass absolute bottom-28 right-0 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm md:-right-6">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c3b4ff]">
          <Icon name="idea" className="h-4 w-4" />
        </span>
        Idea saved
      </div>
    </div>
  );
}
