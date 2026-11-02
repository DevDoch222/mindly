"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Container, Eyebrow } from "../ui";
import { SplitReveal } from "../Reveal";
import { Icon } from "../Icons";

/**
 * The cards here "arrive" from the hero ring: as the section scrolls in, each one
 * flies from the top-centre of the screen, spinning, and settles into the grid.
 */
export default function FeatureBento() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const grid = ref.current!.querySelector<HTMLElement>(".bento-grid")!;
      const cards = gsap.utils.toArray<HTMLElement>(".bento-card", grid);
      const gr = grid.getBoundingClientRect();
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const dx = gr.left + gr.width / 2 - (r.left + r.width / 2);
        gsap.fromTo(
          card,
          {
            x: dx * 0.9,
            y: -380 - i * 40,
            rotateY: i % 2 ? 70 : -70,
            rotateZ: (i % 2 ? 1 : -1) * 12,
            scale: 0.35,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: grid,
              start: `top ${105 - i * 4}%`,
              end: "top 35%",
              scrub: 1.2,
            },
          },
        );
      });

      // Tilt each card toward the cursor.
      if (!window.matchMedia("(hover: hover)").matches) return;
      cards.forEach((card) => {
        const inner = card.querySelector<HTMLElement>(".bento-inner")!;
        const rx = gsap.quickTo(inner, "rotateX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(inner, "rotateY", { duration: 0.6, ease: "power3.out" });
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          rx(-py * 8);
          ry(px * 10);
          card.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
          card.style.setProperty("--my", `${(py + 0.5) * 100}%`);
        });
        card.addEventListener("pointerleave", () => {
          rx(0);
          ry(0);
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative py-24 md:py-36">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow>What Mindly does</Eyebrow>
            <SplitReveal
              text={"One calm space\nfor a *busy mind.*"}
              className="font-serif mt-6 text-[clamp(2.6rem,6vw,5rem)] leading-[0.95]"
            />
          </div>
          <Link href="/features" className="btn btn-light self-start md:self-auto">
            Explore all features <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>

        <div className="bento-grid mt-14 grid gap-4 [perspective:1400px] md:grid-cols-6 md:grid-rows-[300px_300px]">
          <BentoCard className="md:col-span-4" accent="#c3b4ff" icon="idea" title="Capture in a breath" text="Type, speak or snap. Mindly turns half-formed thoughts into clean notes before they slip away.">
            <div className="pointer-events-none absolute -bottom-6 right-6 hidden w-[52%] space-y-2 md:block">
              {["Book idea: memory as architecture", "Call Sam about the studio", "What if onboarding was a story?"].map((t, i) => (
                <div key={t} className="glass rounded-2xl px-4 py-3 text-sm" style={{ transform: `translateX(${i * 18}px)` }}>
                  {t}
                </div>
              ))}
            </div>
          </BentoCard>
          <BentoCard className="md:col-span-2" accent="#d9f26b" icon="focus" title="Focus mode" text="Silence the noise. One task, one timer, one calm screen.">
            <div className="pointer-events-none absolute bottom-6 right-6 flex h-20 w-20 items-center justify-center rounded-full border border-ink/10">
              <span className="font-serif text-2xl">25:00</span>
            </div>
          </BentoCard>
          <BentoCard className="md:col-span-2" dark accent="#ffb98f" icon="plan" title="Plans that move" text="Turn any note into a step-by-step plan in one tap." />
          <BentoCard className="overflow-hidden md:col-span-4" image="/images/card-peak-moon.jpg" accent="#a6e6d4" icon="sync" title="Everywhere you think" text="Phone, laptop, tablet. Your mind stays in sync — even offline." />
        </div>
      </Container>
    </section>
  );
}

function BentoCard({
  className = "",
  title,
  text,
  icon,
  accent,
  dark,
  image,
  children,
}: {
  className?: string;
  title: string;
  text: string;
  icon: "idea" | "focus" | "plan" | "sync";
  accent: string;
  dark?: boolean;
  image?: string;
  children?: React.ReactNode;
}) {
  const light = !dark && !image;
  return (
    <div className={`bento-card min-h-[260px] [transform-style:preserve-3d] ${className}`}>
      <div
        className={`bento-inner spotlight relative h-full overflow-hidden rounded-[28px] p-7 md:p-8 ${
          light ? "paper-card" : "dark bg-ink text-white"
        }`}
      >
        {image && (
          <>
            <Image src={image} alt="" fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        )}
        <div className="relative z-10 flex h-full max-w-[340px] flex-col">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-ink" style={{ background: accent }}>
            <Icon name={icon} className="h-5 w-5" />
          </span>
          <h3 className="mt-auto pt-10 text-2xl font-medium tracking-tight">{title}</h3>
          <p className={`mt-2 text-[15px] leading-relaxed ${light ? "text-muted" : "text-white/65"}`}>{text}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
