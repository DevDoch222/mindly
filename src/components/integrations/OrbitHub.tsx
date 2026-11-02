"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { APPS, monogram } from "./data";

const RINGS = [
  { r: 0.3, apps: APPS.slice(0, 4), speed: 40 },
  { r: 0.48, apps: APPS.slice(4, 10), speed: -60 },
];

/**
 * Mindly at the centre with apps orbiting on two counter-rotating rings.
 * Badges counter-spin so their labels stay upright; the whole system tilts toward the cursor.
 */
export default function OrbitHub() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tweens: gsap.core.Tween[] = [];
      RINGS.forEach((ring, i) => {
        const dur = Math.abs(ring.speed);
        const dir = Math.sign(ring.speed);
        tweens.push(gsap.to(`.ring-${i}`, { rotate: 360 * dir, duration: dur, repeat: -1, ease: "none" }));
        tweens.push(gsap.to(`.ring-${i} .hub-badge`, { rotate: -360 * dir, duration: dur, repeat: -1, ease: "none" }));
      });

      const el = ref.current!;
      const tilt = el.querySelector<HTMLElement>(".hub-tilt")!;
      const rx = gsap.quickTo(tilt, "rotateX", { duration: 1, ease: "power3.out" });
      const ry = gsap.quickTo(tilt, "rotateY", { duration: 1, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        rx(-((e.clientY - r.top) / r.height - 0.5) * 20);
        ry(((e.clientX - r.left) / r.width - 0.5) * 20);
      };
      const enter = () => tweens.forEach((t) => gsap.to(t, { timeScale: 0.15, duration: 0.6 }));
      const leave = () => {
        rx(0);
        ry(0);
        tweens.forEach((t) => gsap.to(t, { timeScale: 1, duration: 0.6 }));
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);

      gsap.from(".hub-badge-wrap", { scale: 0, opacity: 0, duration: 1.2, ease: "back.out(1.7)", stagger: 0.06, delay: 1.2 });
      gsap.from(".hub-ring-line", { scale: 0.6, opacity: 0, duration: 1.6, ease: "expo.out", stagger: 0.15, delay: 1 });

      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[640px] [perspective:1200px]">
      <div className="hub-tilt absolute inset-0 [transform-style:preserve-3d]">
        {RINGS.map((ring, i) => (
          <div
            key={`line-${i}`}
            className="hub-ring-line absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ink/15"
            style={{ width: `${ring.r * 200}%`, height: `${ring.r * 200}%` }}
          />
        ))}
        {RINGS.map((ring, i) => (
          <div key={i} className={`ring-${i} absolute inset-0`}>
            {ring.apps.map((app, j) => {
              const a = (j / ring.apps.length) * Math.PI * 2;
              return (
                <div
                  key={app.name}
                  className="hub-badge-wrap absolute"
                  style={{ left: `${50 + Math.cos(a) * ring.r * 100}%`, top: `${50 + Math.sin(a) * ring.r * 100}%` }}
                >
                  <div className="hub-badge -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-white text-ink shadow-[0_15px_30px_-12px_rgba(0,0,0,.3)] transition-transform duration-300 hover:scale-125 md:h-[72px] md:w-[72px]"
                      style={{ background: app.color }}
                      title={app.name}
                    >
                      <span className="font-serif text-xl md:text-2xl">{monogram(app.name)}</span>
                      <span className="hidden text-[9px] font-medium md:block">{app.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[32px] bg-ink text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] md:h-36 md:w-36">
          <span className="absolute inset-0 animate-ping rounded-[32px] bg-ink/20 [animation-duration:3s]" />
          <span className="text-xl font-semibold tracking-tight md:text-2xl">
            Mindly<sup className="text-xs font-normal">°</sup>
          </span>
        </div>
      </div>
    </div>
  );
}
