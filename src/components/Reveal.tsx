"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Splits text into masked words that rise into place when scrolled into view. */
export function SplitReveal({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.05,
  immediate = false,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const words = ref.current!.querySelectorAll(".word-mask > span");
      gsap.from(words, {
        yPercent: 115,
        rotate: 4,
        duration: 1.1,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: immediate ? undefined : { trigger: ref.current, start: "top 88%" },
      });
    },
    { scope: ref },
  );

  // "*word*" renders italic, so headlines can mix roman and italic like the hero.
  const lines = text.split("\n");
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((w, wi) => {
            const italic = w.startsWith("*") && w.endsWith("*");
            return (
              <span key={wi} className="word-mask">
                <span className={italic ? "italic" : ""}>{italic ? w.slice(1, -1) : w}</span>
                {wi < line.split(" ").length - 1 ? " " : ""}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/** Fades and lifts its children into view (optionally staggered across [data-reveal] children). */
export function FadeIn({
  children,
  className = "",
  y = 40,
  delay = 0,
  stagger = 0,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const items = stagger ? ref.current!.querySelectorAll("[data-reveal]") : [ref.current];
      gsap.from(items, {
        y,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        delay,
        stagger,
        scrollTrigger: { trigger: ref.current, start: "top 88%" },
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Words light up one after another as the paragraph scrolls through the viewport. */
export function ScrubText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const words = ref.current!.querySelectorAll("span");
      if (prefersReducedMotion()) {
        gsap.set(words, { opacity: 1 });
        return;
      }
      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
    },
    { scope: ref },
  );
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => {
        const italic = w.startsWith("*") && w.endsWith("*");
        return (
          <span key={i} className={italic ? "font-serif italic" : ""}>
            {italic ? w.slice(1, -1) : w}{" "}
          </span>
        );
      })}
    </p>
  );
}
