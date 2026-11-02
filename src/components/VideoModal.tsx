"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { Icon } from "./Icons";

const SCENES = [
  { word: "Capture.", line: "Every thought, the moment it arrives.", icon: "idea" as const },
  { word: "Organise.", line: "Notes find their place on their own.", icon: "plan" as const },
  { word: "Focus.", line: "One calm space for deep work.", icon: "focus" as const },
  { word: "Reflect.", line: "See how far your ideas have come.", icon: "reflect" as const },
];

/** A short animated "product film" rendered live — no video file needed. */
export default function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !ref.current) return;
    const el = ref.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(".vm-panel", { y: 60, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: "expo.out" });

      const tl = gsap.timeline({ repeat: -1, delay: 0.4 });
      gsap.utils.toArray<HTMLElement>(".vm-scene").forEach((scene) => {
        const word = scene.querySelector(".vm-word");
        const rest = scene.querySelectorAll(".vm-rest");
        tl.set(scene, { autoAlpha: 1 })
          .fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out" })
          .fromTo(rest, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out" }, "<0.2")
          .to(scene.querySelector(".vm-progress"), { scaleX: 1, duration: 2.4, ease: "none" }, "<")
          .to(word, { yPercent: -110, duration: 0.6, ease: "expo.in" })
          .to(rest, { opacity: 0, duration: 0.4 }, "<")
          .set(scene, { autoAlpha: 0 })
          .set(scene.querySelector(".vm-progress"), { scaleX: 0 });
      });
    }, el);

    return () => {
      window.removeEventListener("keydown", onKey);
      ctx.revert();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={ref}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Mindly product film"
      data-lenis-prevent
    >
      <div
        className="vm-panel relative aspect-video w-full max-w-[960px] overflow-hidden rounded-[28px] bg-[#0f0f0f] text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(60%_80%_at_70%_30%,#3a3a3a,transparent)]" />
        {SCENES.map((s, i) => (
          <div key={i} className="vm-scene invisible absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <span className="vm-rest mb-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 md:h-14 md:w-14">
              <Icon name={s.icon} className="h-6 w-6" />
            </span>
            <span className="line-mask">
              <span className="vm-word font-serif block text-[clamp(3rem,11vw,8rem)] leading-[0.95] italic">{s.word}</span>
            </span>
            <p className="vm-rest mt-3 text-white/60 md:text-lg">{s.line}</p>
            <span className="mt-6 block h-px w-full bg-white/15">
              <span className="vm-progress block h-px w-full origin-left scale-x-0 bg-white" />
            </span>
          </div>
        ))}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/20"
          aria-label="Close video"
        >
          ×
        </button>
      </div>
    </div>,
    document.body,
  );
}
