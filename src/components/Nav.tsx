"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Magnetic from "./Magnetic";
import { gsap } from "@/lib/gsap";

export const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/integrations", label: "Integrations" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pillRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const menuRef = useRef<HTMLDivElement>(null);

  const target = hovered ?? NAV_LINKS.find((l) => pathname.startsWith(l.href))?.href ?? null;

  // Slide the highlight pill under the hovered (or current) link.
  useLayoutEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const el = target ? linkRefs.current[target] : null;
    if (!el) {
      gsap.to(pill, { opacity: 0, duration: 0.25 });
      return;
    }
    gsap.to(pill, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [target]);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > 200 && y > last && !open);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      gsap.set(menu, { display: "flex" });
      gsap.fromTo(menu, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "expo.out" });
      gsap.fromTo(
        menu.querySelectorAll("[data-menu-item]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "expo.out", delay: 0.1 },
      );
    } else {
      gsap.to(menu, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.5,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(menu, { display: "none" });
        },
      });
    }
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 transition-all duration-500 md:px-10 ${
            scrolled ? "md:py-3" : "md:py-6"
          }`}
        >
          <Link href="/" className="relative z-10 text-[22px] font-semibold tracking-tight" aria-label="Mindly home">
            Mindly<sup className="ml-px text-[11px] font-normal">°</sup>
          </Link>

          <nav
            className={`relative hidden items-center rounded-full border border-line p-1 transition-all duration-500 md:flex ${
              scrolled ? "bg-white/70 shadow-[0_10px_30px_-15px_rgba(0,0,0,.25)] backdrop-blur-xl" : "bg-white/40"
            }`}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              ref={pillRef}
              className="absolute left-0 top-1 bottom-1 rounded-full bg-white opacity-0 shadow-[0_2px_10px_rgba(0,0,0,.08)]"
            />
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                ref={(el) => {
                  linkRefs.current[l.href] = el;
                }}
                onMouseEnter={() => setHovered(l.href)}
                className="relative z-10 rounded-full px-4 py-2 text-[13px] font-medium text-ink/80 transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <Magnetic className="hidden md:inline-block">
              <Link href="/get-the-app" className="btn btn-dark !py-2.5 !text-[13px]">
                Get the app
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </Link>
            </Magnetic>
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full bg-ink md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={`h-px w-4 bg-white transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-4 bg-white transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        className="fixed inset-0 z-40 hidden flex-col justify-between bg-bg px-5 pb-10 pt-28 md:!hidden"
      >
        <nav className="flex flex-col">
          {[{ href: "/", label: "Home" }, ...NAV_LINKS].map((l) => (
            <span key={l.href} className="line-mask border-b border-line py-3">
              <Link
                data-menu-item
                href={l.href}
                className={`font-serif block text-[44px] leading-none ${pathname === l.href ? "italic" : ""}`}
              >
                {l.label}
              </Link>
            </span>
          ))}
        </nav>
        <Link href="/get-the-app" className="btn btn-dark justify-center">
          Get the app ↗
        </Link>
      </div>
    </>
  );
}
