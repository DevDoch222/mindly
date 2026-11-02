"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Container, Eyebrow } from "./ui";
import { SplitReveal } from "./Reveal";

const DAY = [
  { time: "07:30", t: "Morning brief", d: "Mindly surfaces your three priorities and yesterday's loose ends." },
  { time: "09:00", t: "Deep work", d: "Focus mode on. Notifications off. One task, a soft timer, nothing else." },
  { time: "13:15", t: "Capture on the go", d: "A voice note on your walk lands neatly in the right space." },
  { time: "16:40", t: "Plan tomorrow", d: "Turn the afternoon's ideas into tomorrow's first steps." },
  { time: "21:00", t: "Reflect", d: "Two quiet minutes to see what moved. Then close the laptop." },
];

/** A vertical timeline whose line draws itself as you scroll; each stop lights up as the line reaches it. */
export default function DayTimeline() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".tl-line",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".tl-list", start: "top 60%", end: "bottom 60%", scrub: true } },
      );
      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.2 },
          {
            opacity: 1,
            scrollTrigger: { trigger: item, start: "top 62%", end: "top 45%", scrub: true },
          },
        );
        gsap.fromTo(
          item.querySelector(".tl-dot"),
          { scale: 0.4, backgroundColor: "#f4f2ee" },
          { scale: 1, backgroundColor: "#0e0e0e", scrollTrigger: { trigger: item, start: "top 62%", end: "top 55%", scrub: true } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="py-24 md:py-36">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>A day with Mindly</Eyebrow>
          <SplitReveal text={"From first coffee\nto *lights out.*"} className="font-serif mt-6 text-[clamp(2.6rem,6vw,5rem)] leading-[0.95]" />
        </div>
        <div className="tl-list relative pl-10">
          <span className="absolute bottom-0 left-[7px] top-0 w-px bg-line" />
          <span className="tl-line absolute bottom-0 left-[7px] top-0 w-px origin-top bg-ink" />
          {DAY.map((d) => (
            <div key={d.time} className="tl-item relative pb-16 last:pb-0">
              <span className="tl-dot absolute -left-10 top-2 h-[15px] w-[15px] rounded-full border border-ink" />
              <p className="text-sm text-muted">{d.time}</p>
              <h3 className="font-serif mt-1 text-4xl md:text-5xl">{d.t}</h3>
              <p className="mt-3 max-w-[440px] text-muted md:text-lg">{d.d}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
