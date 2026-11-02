"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { ORBIT_CARDS, type OrbitCard } from "./orbitCards";
import RotatingBadge from "./RotatingBadge";
import Magnetic from "../Magnetic";
import VideoModal from "../VideoModal";
import { Icon } from "../Icons";

const AVATARS = ["/images/avatar-1.jpg", "/images/avatar-2.jpg", "/images/avatar-3.jpg", "/images/avatar-4.jpg"];

const CARD_SIZE = { ui: { w: 200, h: 96 }, img: { w: 124, h: 156 } };

// Ring geometry (desktop / mobile). Ring sits around the head, tilted so the front dips lower.
const RING = {
  desktop: { radius: 330, scale: 1, count: 8, portraitW: 560, ringY: 0.27 },
  mobile: { radius: 175, scale: 0.62, count: 6, portraitW: 340, ringY: 0.27 },
};
const RING_TILT_X = -13;
const RING_TILT_Z = -7;
const BASE_SPEED = 9; // degrees per second

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [video, setVideo] = useState(false);

  useGSAP(
    () => {
      const section = root.current!;
      const stageEl = stage.current!;
      const reduced = prefersReducedMotion();
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const cfg = mobile ? RING.mobile : RING.desktop;
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      const cards = gsap.utils.toArray<HTMLElement>(".orbit-card", stageEl).slice(0, cfg.count);
      gsap.utils.toArray<HTMLElement>(".orbit-card", stageEl).slice(cfg.count).forEach((c) => (c.style.display = "none"));
      const portrait = stageEl.querySelector<HTMLElement>(".hero-portrait")!;
      const depthEls = gsap.utils.toArray<HTMLElement>("[data-depth]", section);
      const paths = gsap.utils.toArray<SVGPathElement>(".hero-line", section);
      const dots = gsap.utils.toArray<SVGCircleElement>(".hero-dot", section);

      const s = {
        angle: 0,
        speed: 1,
        tiltX: 0,
        tiltY: 0,
        mx: 0,
        my: 0,
        intro: reduced ? 1 : 0,
        scroll: 0,
        hover: -1,
        scales: cards.map(() => 1),
      };

      // ---- Position the ring origin over the head ----
      let ringX = 0;
      let ringY = 0;
      const layout = () => {
        const pw = Math.min(cfg.portraitW, stageEl.clientWidth * 1.05);
        portrait.style.width = `${pw}px`;
        const ph = pw * (1719 / 1400);
        ringX = stageEl.clientWidth / 2;
        ringY = ph * cfg.ringY;
        cards.forEach((card) => {
          const size = card.dataset.kind === "ui" ? CARD_SIZE.ui : CARD_SIZE.img;
          card.style.width = `${size.w}px`;
          card.style.height = `${size.h}px`;
          card.style.left = `${ringX - size.w / 2}px`;
          card.style.top = `${ringY - size.h / 2}px`;
        });
        drawLines();
      };

      // ---- Curved connector lines from the side cards to the ring ----
      const lineLengths: number[] = [];
      const drawLines = () => {
        const sr = section.getBoundingClientRect();
        const st = stageEl.getBoundingClientRect();
        const anchors = gsap.utils.toArray<HTMLElement>("[data-line-anchor]", section);
        anchors.forEach((a, i) => {
          const path = paths[i];
          if (!path) return;
          const r = a.getBoundingClientRect();
          const side = a.dataset.lineAnchor === "left" ? -1 : 1;
          const x1 = r.left - sr.left + r.width / 2;
          // Start tucked under the card so its float/parallax never detaches the line.
          const y1 = r.bottom - sr.top - 40;
          const x2 = st.left - sr.left + ringX + side * cfg.radius * 0.95;
          const y2 = st.top - sr.top + ringY + 40;
          path.setAttribute(
            "d",
            `M ${x1} ${y1} C ${x1} ${y1 + (y2 - y1) * 0.9}, ${x2 - side * 120} ${y2 + 30}, ${x2} ${y2}`,
          );
          lineLengths[i] = path.getTotalLength();
          path.style.strokeDasharray = `${lineLengths[i]}`;
        });
      };

      layout();
      const ro = new ResizeObserver(layout);
      ro.observe(stageEl);

      // ---- Hover: pause the orbit and lift the card under the cursor ----
      const cleanups: (() => void)[] = [];
      if (canHover) {
        cards.forEach((card, i) => {
          const enter = () => (s.hover = i);
          const leave = () => s.hover === i && (s.hover = -1);
          card.addEventListener("pointerenter", enter);
          card.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            card.removeEventListener("pointerenter", enter);
            card.removeEventListener("pointerleave", leave);
          });
        });

        const onMove = (e: PointerEvent) => {
          s.mx = (e.clientX / window.innerWidth) * 2 - 1;
          s.my = (e.clientY / window.innerHeight) * 2 - 1;
        };
        const onLeave = () => {
          s.mx = 0;
          s.my = 0;
        };
        window.addEventListener("pointermove", onMove);
        document.documentElement.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          window.removeEventListener("pointermove", onMove);
          document.documentElement.removeEventListener("pointerleave", onLeave);
        });
      }

      // ---- The frame loop: orbit + parallax combined ----
      const render = (time: number, dt: number) => {
        const k = Math.min(dt / 16.67, 3); // frame-rate independent easing

        const targetSpeed = s.hover >= 0 ? 0.04 : 1 + s.scroll * 5;
        s.speed += (targetSpeed - s.speed) * 0.06 * k;
        if (!reduced) s.angle += BASE_SPEED * s.speed * (dt / 1000);

        // Ring tilt follows the cursor with a heavy lag.
        s.tiltX += (-s.my * 9 - s.tiltX) * 0.05 * k;
        s.tiltY += (s.mx * 16 - s.tiltY) * 0.05 * k;

        const introEase = s.intro;
        const radius = cfg.radius * (1 + (1 - introEase) * 1.6 + s.scroll * 1.4);
        const swirl = (1 - introEase) * -220;
        const fade = Math.max(0, Math.min(1, introEase * 1.4)) * Math.max(0, 1 - s.scroll * 1.3);

        cards.forEach((card, i) => {
          const theta = s.angle + swirl + (i * 360) / cards.length;
          const facing = Math.cos(((theta + s.tiltY) * Math.PI) / 180);
          const targetScale = s.hover === i ? 1.16 : 1;
          s.scales[i] += (targetScale - s.scales[i]) * 0.12 * k;

          card.style.transform =
            `perspective(1500px) rotateX(${s.tiltX}deg) rotateY(${s.tiltY}deg) ` +
            `rotateZ(${RING_TILT_Z}deg) rotateX(${RING_TILT_X}deg) rotateY(${theta}deg) ` +
            `translateZ(${radius}px) scale(${cfg.scale * s.scales[i]})`;
          card.style.zIndex = String(facing > 0 ? 30 + Math.round(facing * 10) : 10 + Math.round((facing + 1) * 9));
          card.style.opacity = String(fade * (facing > 0 ? 1 : 0.55 + (facing + 1) * 0.45));
          card.classList.toggle("is-back", facing < -0.05);
          card.classList.toggle("is-hover", s.hover === i);
        });

        // Layered parallax: each [data-depth] element drifts by its own amount.
        depthEls.forEach((el) => {
          const d = parseFloat(el.dataset.depth || "0");
          el.style.transform = `translate3d(${s.tiltY * d}px, ${-s.tiltX * d}px, 0)`;
        });

        // A small light travels along each connector line.
        dots.forEach((dot, i) => {
          const path = paths[i];
          const len = lineLengths[i];
          if (!path || !len) return;
          const t = ((time / 1000) * 0.12 + i * 0.5) % 1;
          const p = path.getPointAtLength(t * len);
          dot.setAttribute("cx", String(p.x));
          dot.setAttribute("cy", String(p.y));
        });
      };

      const tick = (time: number, dt: number) => render(time * 1000, dt);
      gsap.ticker.add(tick);
      render(0, 16);

      // ---- Intro sequence ----
      if (!reduced) {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hero-word > span", { yPercent: 115, rotate: 5, duration: 1.4, stagger: 0.07 }, 0.15)
          .from(".hero-fade", { y: 24, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.6)
          .fromTo(
            portrait,
            { opacity: 0, scale: 1.08, filter: "blur(24px)" },
            { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "power3.out" },
            0.3,
          )
          .to(s, { intro: 1, duration: 2.6, ease: "expo.out" }, 0.7)
          .from(".hero-side", { y: 40, opacity: 0, scale: 0.9, duration: 1.4, stagger: 0.12 }, 1.2)
          .fromTo(".hero-line", { strokeDashoffset: (i) => lineLengths[i] || 600 }, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" }, 1.5)
          .from(".hero-dot", { opacity: 0, duration: 0.6 }, 2.8)
          .from(".hero-corner", { opacity: 0, y: 20, duration: 1.2, stagger: 0.1 }, 1.6);
      }

      // ---- Scroll: ring unwraps outward, headline lifts away ----
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => (s.scroll = self.progress),
      });
      if (!reduced) {
        gsap.to(".hero-copy", {
          yPercent: -40,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "60% top", scrub: true },
        });
        gsap.to(portrait, {
          yPercent: 12,
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        });
      }

      return () => {
        gsap.ticker.remove(tick);
        ro.disconnect();
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden pt-28 md:pt-32">
      {/* Connector lines (desktop) */}
      <svg className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full lg:block" aria-hidden>
        {[0, 1].map((i) => (
          <g key={i}>
            <path className="hero-line" fill="none" stroke="rgba(14,14,14,.22)" strokeWidth="1" />
            <circle className="hero-dot" r="3" fill="#0e0e0e" />
          </g>
        ))}
      </svg>

      <div className="hero-copy relative z-[40] mx-auto max-w-[1240px] px-5 text-center md:px-10">
        <h1 className="font-serif text-[clamp(3rem,10.5vw,8.4rem)] leading-[0.92]">
          <span className="block">
            {"A clearer mind".split(" ").map((w, i) => (
              <span key={i} className="hero-word word-mask">
                <span>{w}&nbsp;</span>
              </span>
            ))}
          </span>
          <span className="block italic">
            {"for a brighter you.".split(" ").map((w, i) => (
              <span key={i} className="hero-word word-mask">
                <span>{w}&nbsp;</span>
              </span>
            ))}
          </span>
        </h1>
        <p className="hero-fade mx-auto mt-6 max-w-[440px] text-[15px] leading-relaxed text-muted md:text-[17px]">
          Mindly helps you capture ideas, organize your thoughts, and stay focused — all in one beautiful space.
        </p>
        <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <Link href="/get-the-app" className="btn btn-dark">
              Get started free <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </Magnetic>
          <Magnetic>
            <button onClick={() => setVideo(true)} className="btn btn-light">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white">
                <Icon name="play" className="ml-px h-3 w-3" />
              </span>
              Watch video
            </button>
          </Magnetic>
        </div>
      </div>

      {/* Rotating badge */}
      <div data-depth="-1.2" className="absolute right-6 top-28 z-[6] hidden xl:right-16 lg:block">
        <div className="hero-corner">
          <RotatingBadge />
        </div>
      </div>

      {/* Floating side cards (desktop) */}
      {/* Three layers each: parallax (data-depth) > intro (hero-side) > idle float — each owns its own transform. */}
      <div data-depth="2.2" className="absolute left-[4%] top-[34%] z-[45] hidden lg:block xl:left-[9%]">
        <div className="hero-side">
          <div className="float paper-card w-[200px] rounded-[26px] p-6" style={{ ["--r" as string]: "-4deg" }} data-line-anchor="left">
            <Icon name="wave" className="mb-8 h-6 w-6" />
            <p className="text-[19px] font-medium leading-tight tracking-tight">Turn thoughts into progress.</p>
            <p className="mt-3 text-[13px] leading-snug text-muted">Capture, organise and do more.</p>
          </div>
        </div>
      </div>
      <div data-depth="2.8" className="absolute right-[4%] top-[47%] z-[45] hidden lg:block xl:right-[9%]">
        <div className="hero-side">
          <div
            className="float paper-card w-[190px] rounded-[26px] p-6 [animation-delay:-3s]"
            style={{ ["--r" as string]: "5deg" }}
            data-line-anchor="right"
          >
            <AvatarStack size={30} />
            <p className="mt-5 text-[18px] font-medium leading-tight tracking-tight">Ideas, anytime, anywhere.</p>
            <p className="mt-3 text-[13px] leading-snug text-muted">Sync across all your devices.</p>
          </div>
        </div>
      </div>

      {/* Stage: portrait + orbiting cards */}
      <div ref={stage} className="relative z-[20] mx-auto mt-6 h-[430px] w-full max-w-[1240px] md:mt-0 md:h-[600px]">
        <div data-depth="-0.6" className="pointer-events-none absolute inset-x-0 top-0 z-[20] h-full">
          <div className="hero-portrait absolute left-1/2 top-0 -translate-x-1/2 will-change-transform">
            <Image
              src="/images/hero-portrait.png"
              alt="Calm person with eyes closed, face tilted upward"
              width={1400}
              height={1719}
              priority
              className="h-auto w-full select-none"
              draggable={false}
            />
          </div>
        </div>
        <div className="contents">
          {ORBIT_CARDS.map((card, i) => (
            <OrbitCardView key={i} card={card} />
          ))}
        </div>
        {/* Fade the portrait into the page at the bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[50] h-32 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Bottom corners (desktop) */}
      <div className="hero-corner absolute bottom-16 left-6 z-[45] hidden md:left-10 lg:block xl:left-16">
        <span className="mb-4 block h-px w-8 bg-ink/30" />
        <p className="text-[15px] leading-snug text-muted">
          Trusted by 50,000+
          <br />
          creators worldwide.
        </p>
        <div className="mt-4">
          <AvatarStack size={34} />
        </div>
      </div>
      <div className="hero-corner absolute bottom-16 right-6 z-[45] hidden items-end gap-4 lg:flex xl:right-16">
        <span className="mb-3 block h-px w-8 bg-ink/30" />
        <div>
          <Icon name="spark" className="mb-6 h-5 w-5" />
          <p className="text-[15px] leading-snug text-muted">
            Less chaos.
            <br />
            More clarity.
          </p>
        </div>
      </div>

      {/* Mobile: side cards become a swipeable row */}
      <div className="relative z-[55] -mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-10 lg:hidden [scrollbar-width:none]">
        <div className="hero-side paper-card min-w-[78%] snap-center rounded-[22px] p-5">
          <Icon name="wave" className="mb-4 h-5 w-5" />
          <p className="text-[17px] font-medium leading-tight">Turn thoughts into progress.</p>
          <p className="mt-2 text-[13px] text-muted">Capture, organise and do more.</p>
        </div>
        <div className="hero-side paper-card min-w-[78%] snap-center rounded-[22px] p-5">
          <AvatarStack size={26} />
          <p className="mt-4 text-[17px] font-medium leading-tight">Ideas, anytime, anywhere.</p>
          <p className="mt-2 text-[13px] text-muted">Sync across all your devices.</p>
        </div>
        <div className="hero-side paper-card min-w-[78%] snap-center rounded-[22px] p-5">
          <p className="text-[13px] text-muted">Trusted by 50,000+ creators worldwide.</p>
          <div className="mt-4">
            <AvatarStack size={30} />
          </div>
        </div>
      </div>

      <VideoModal open={video} onClose={() => setVideo(false)} />
    </section>
  );
}

function OrbitCardView({ card }: { card: OrbitCard }) {
  if (card.kind === "img") {
    return (
      <div className="orbit-card overflow-hidden border border-white/70 shadow-[0_20px_40px_-15px_rgba(0,0,0,.35)]" data-kind="img">
        <Image src={card.src} alt={card.alt} fill sizes="130px" className="object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/10" />
        <span className="glow" />
      </div>
    );
  }
  return (
    <div className="orbit-card glass" data-kind="ui">
      <div className="face-front flex h-full items-start gap-3 p-4">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-ink/80 shadow-[inset_0_1px_0_rgba(255,255,255,.7)]"
          style={{ background: card.accent }}
        >
          <Icon name={card.icon} className="h-[18px] w-[18px]" />
        </span>
        <div className="pt-0.5 text-left">
          <p className="text-[17px] font-medium leading-none tracking-tight">{card.title}</p>
          <p className="mt-2 text-[11.5px] leading-snug text-muted">{card.sub}</p>
        </div>
      </div>
      <span className="glow" />
    </div>
  );
}

export function AvatarStack({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center">
      {AVATARS.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={size}
          height={size}
          className="rounded-full border-2 border-white object-cover"
          style={{ marginLeft: i ? -size * 0.3 : 0, width: size, height: size }}
        />
      ))}
      <span
        className="flex items-center justify-center rounded-full border-2 border-white bg-white text-sm shadow-sm"
        style={{ marginLeft: -size * 0.3, width: size, height: size }}
      >
        +
      </span>
    </div>
  );
}
