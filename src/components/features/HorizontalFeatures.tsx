"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const PANELS = [
  { n: "01", t: "Capture", d: "Every thought, the moment it arrives — typed, spoken or snapped.", img: "/images/card-mountain.jpg", accent: "#c3b4ff" },
  { n: "02", t: "Organise", d: "Mindly groups related ideas automatically, so nothing gets lost.", img: "/images/card-lunar.jpg", accent: "#a6e6d4" },
  { n: "03", t: "Focus", d: "A distraction-free mode with timers, soundscapes and one task at a time.", img: "/images/card-moon.jpg", accent: "#d9f26b" },
  { n: "04", t: "Plan", d: "Break big ideas into small steps. Mindly suggests the next one.", img: "/images/card-peak-moon.jpg", accent: "#ffb98f" },
  { n: "05", t: "Reflect", d: "See your week as a story — what you thought, made and finished.", img: "/images/card-crescent.jpg", accent: "#f2c4e6" },
];

/** Vertical scroll drives a horizontal track; each panel's image parallaxes inside it. */
export default function HorizontalFeatures() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = ref.current!.querySelector<HTMLElement>(".h-track")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const move = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".h-panel").forEach((panel) => {
          gsap.fromTo(
            panel.querySelector(".h-img"),
            { xPercent: -12 },
            {
              xPercent: 12,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: move, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.from(panel.querySelector(".h-title"), {
            yPercent: 100,
            ease: "expo.out",
            duration: 1,
            scrollTrigger: { trigger: panel, containerAnimation: move, start: "left 75%" },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="overflow-hidden md:h-screen">
      <div className="h-track flex flex-col gap-5 px-5 md:h-full md:flex-row md:items-center md:gap-8 md:px-[8vw]">
        {PANELS.map((p) => (
          <article key={p.n} className="h-panel relative flex h-[520px] w-full shrink-0 flex-col overflow-hidden rounded-[32px] bg-ink text-white md:h-[72vh] md:w-[min(78vw,980px)] md:flex-row">
            <div className="relative h-[45%] overflow-hidden md:h-full md:w-1/2">
              <div className="h-img absolute -inset-x-[15%] inset-y-0">
                <Image src={p.img} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover opacity-85" />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-7 md:p-12">
              <span className="flex items-center gap-3 text-sm text-white/50">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.accent }} />
                {p.n} / 05
              </span>
              <span className="line-mask mt-auto">
                <h2 className="h-title font-serif block text-[clamp(3.4rem,7vw,6.5rem)] leading-none italic">{p.t}</h2>
              </span>
              <p className="mt-5 max-w-[380px] text-white/65 md:text-lg">{p.d}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
