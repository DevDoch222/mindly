"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const LABELS: Record<string, string> = {
  "/": "Mindly°",
  "/features": "Features",
  "/how-it-works": "How it works",
  "/integrations": "Integrations",
  "/pricing": "Pricing",
  "/get-the-app": "Get the app",
};

/** Re-mounts on every navigation: a dark curtain with the page name sweeps up to reveal the page. */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(curtain.current, { display: "none" });
      return;
    }
    const tl = gsap.timeline();
    tl.from(".curtain-label", { yPercent: 110, duration: 0.6, ease: "expo.out" })
      .to(".curtain-label", { yPercent: -110, duration: 0.5, ease: "expo.in" }, "+=0.15")
      .to(curtain.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "-=0.2")
      // Opacity only: a transform here would break ScrollTrigger pins inside the page.
      .from(content.current, { opacity: 0, duration: 0.8, ease: "power2.out" }, "<0.25")
      .set(curtain.current, { display: "none" });
  });

  return (
    <>
      <div
        ref={curtain}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-ink text-white"
        style={{ clipPath: "inset(0 0 0% 0)" }}
        aria-hidden
      >
        <span className="line-mask">
          <span className="curtain-label font-serif block text-[clamp(3rem,10vw,8rem)] italic">
            {LABELS[pathname] ?? "Mindly°"}
          </span>
        </span>
      </div>
      <div ref={content}>{children}</div>
    </>
  );
}
