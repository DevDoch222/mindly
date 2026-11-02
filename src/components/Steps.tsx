"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Container, Eyebrow } from "./ui";
import { Icon } from "./Icons";

const STEPS = [
  {
    title: "Capture",
    text: "Drop in anything — a voice memo on a walk, a link, a 2am idea. Mindly catches it in under a second.",
  },
  {
    title: "Organise",
    text: "Mindly reads your notes and quietly groups them into spaces, so related ideas find each other.",
  },
  {
    title: "Focus",
    text: "Pick what matters today. Focus mode hides everything else and keeps you in deep work.",
  },
];

/** Pinned, scroll-driven walkthrough on desktop; a simple stacked list on mobile. */
export default function Steps({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const texts = gsap.utils.toArray<HTMLElement>(".step-text");
        const visuals = gsap.utils.toArray<HTMLElement>(".step-visual");
        const nums = gsap.utils.toArray<HTMLElement>(".step-num");
        gsap.set([...texts.slice(1), ...visuals.slice(1)], { autoAlpha: 0 });
        gsap.set(nums.slice(1), { yPercent: 100 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".steps-pin",
            start: "top top",
            end: `+=${STEPS.length * 90}%`,
            pin: true,
            scrub: 1,
          },
        });
        tl.to(".step-progress", { scaleY: 1, ease: "none", duration: STEPS.length - 1 }, 0);
        for (let i = 1; i < STEPS.length; i++) {
          const at = i - 0.6;
          tl.to(texts[i - 1], { autoAlpha: 0, y: -50, duration: 0.4 }, at)
            .fromTo(texts[i], { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.25)
            .to(nums[i - 1], { yPercent: -100, duration: 0.5 }, at)
            .fromTo(nums[i], { yPercent: 100 }, { yPercent: 0, duration: 0.5 }, at)
            .to(visuals[i - 1], { autoAlpha: 0, scale: 0.85, rotateY: -25, duration: 0.5 }, at)
            .fromTo(visuals[i], { autoAlpha: 0, scale: 1.1, rotateY: 25 }, { autoAlpha: 1, scale: 1, rotateY: 0, duration: 0.5 }, at + 0.15);
        }
        tl.to({}, { duration: 0.4 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative">
      <div className="steps-pin lg:flex lg:h-screen lg:items-center">
        <Container className="py-24 lg:py-0">
          <div className="mb-12 lg:mb-10">
            <Eyebrow>{compact ? "How it works" : "Three steps"}</Eyebrow>
          </div>

          {/* Desktop: pinned stage */}
          <div className="hidden grid-cols-[auto_1fr_1.1fr] items-center gap-14 lg:grid">
            <div className="relative h-[60vh] w-px bg-line">
              <span className="step-progress absolute inset-0 origin-top scale-y-0 bg-ink" />
            </div>
            <div>
              <div className="font-serif relative h-[1em] overflow-hidden text-[9rem] leading-none italic">
                {STEPS.map((_, i) => (
                  <span key={i} className="step-num absolute inset-0">
                    0{i + 1}
                  </span>
                ))}
              </div>
              <div className="relative mt-8 h-[220px]">
                {STEPS.map((s) => (
                  <div key={s.title} className="step-text absolute inset-0">
                    <h3 className="font-serif text-6xl">{s.title}</h3>
                    <p className="mt-5 max-w-[420px] text-lg leading-relaxed text-muted">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[520px] [perspective:1200px]">
              {[CaptureVisual, OrganiseVisual, FocusVisual].map((V, i) => (
                <div key={i} className="step-visual absolute inset-0">
                  <V />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile / tablet: stacked */}
          <div className="space-y-16 lg:hidden">
            {STEPS.map((s, i) => {
              const V = [CaptureVisual, OrganiseVisual, FocusVisual][i];
              return (
                <div key={s.title}>
                  <p className="font-serif text-6xl italic">0{i + 1}</p>
                  <h3 className="font-serif mt-2 text-5xl">{s.title}</h3>
                  <p className="mt-4 text-muted">{s.text}</p>
                  <div className="relative mt-8 h-[360px]">
                    <V />
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </div>
    </section>
  );
}

function Frame({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`relative h-full overflow-hidden rounded-[32px] p-6 md:p-8 ${dark ? "bg-ink text-white" : "paper-card"}`}>
      {children}
    </div>
  );
}

function CaptureVisual() {
  return (
    <Frame>
      <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
        <Icon name="wave" className="h-5 w-5" />
        <span className="text-sm text-muted">What&apos;s on your mind?</span>
        <span className="ml-auto h-5 w-px animate-pulse bg-ink" />
      </div>
      <div className="mt-6 space-y-3">
        {[
          ["Voice memo", "Rethink the morning routine — less phone", "#c3b4ff"],
          ["Link", "Article: the architecture of attention", "#a6e6d4"],
          ["Idea", "A newsletter about slow productivity", "#d9f26b"],
          ["Photo", "Whiteboard from Tuesday's session", "#ffb98f"],
        ].map(([k, t, c], i) => (
          <div key={t} className="float flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm" style={{ animationDelay: `${-i * 1.3}s` }}>
            <span className="h-8 w-8 shrink-0 rounded-xl" style={{ background: c }} />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted">{k}</p>
              <p className="text-sm font-medium">{t}</p>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function OrganiseVisual() {
  const groups = [
    { name: "Work", c: "#ffb98f", items: ["Q3 roadmap", "Hiring notes", "Pitch deck v2"] },
    { name: "Writing", c: "#c3b4ff", items: ["Newsletter #12", "Essay draft"] },
    { name: "Life", c: "#a6e6d4", items: ["Morning routine", "Trip to Lisbon", "Books to read"] },
  ];
  return (
    <Frame>
      <div className="grid h-full grid-cols-3 gap-3">
        {groups.map((g, gi) => (
          <div key={g.name} className="rounded-2xl bg-bg-soft/70 p-3">
            <p className="mb-3 flex items-center gap-2 text-xs font-medium">
              <span className="h-2 w-2 rounded-full" style={{ background: g.c }} />
              {g.name}
            </p>
            <div className="space-y-2">
              {g.items.map((it, i) => (
                <div key={it} className="float rounded-xl bg-white p-3 text-[12px] shadow-sm" style={{ animationDelay: `${-(gi + i) * 0.9}s` }}>
                  {it}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function FocusVisual() {
  return (
    <Frame dark>
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative h-56 w-56">
          <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full [animation-duration:60s]">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="#d9f26b" strokeWidth="1.5" strokeDasharray="200 289" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-6xl">18:42</span>
            <span className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">Deep work</span>
          </div>
        </div>
        <p className="mt-8 text-white/60">Writing: Essay draft</p>
      </div>
    </Frame>
  );
}
