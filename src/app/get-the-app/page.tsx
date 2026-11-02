import type { Metadata } from "next";
import { Container, Eyebrow, Marquee } from "@/components/ui";
import { FadeIn, SplitReveal } from "@/components/Reveal";
import PhoneMockup from "@/components/app/PhoneMockup";
import SendLink from "@/components/app/SendLink";
import Magnetic from "@/components/Magnetic";
import { AvatarStack } from "@/components/hero/Hero";

export const metadata: Metadata = { title: "Get the app" };

const STORES = [
  { label: "Download for", name: "iPhone & iPad" },
  { label: "Get it for", name: "Android" },
  { label: "Download for", name: "Mac & Windows" },
];

export default function GetTheAppPage() {
  return (
    <main>
      <section className="overflow-hidden pb-20 pt-32 md:pt-40">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <FadeIn>
              <Eyebrow>Get the app</Eyebrow>
            </FadeIn>
            <SplitReveal
              as="h1"
              immediate
              delay={0.15}
              text={"Your clearer mind,\n*in your pocket.*"}
              className="font-serif mt-6 text-[clamp(3.2rem,8vw,6.8rem)] leading-[0.92]"
            />
            <FadeIn delay={0.5} stagger={0.1} className="mt-10 space-y-8">
              <p data-reveal className="max-w-[440px] text-[17px] text-muted">
                Free on every device. Your notes sync instantly and stay end-to-end encrypted.
              </p>
              <div data-reveal className="flex flex-wrap gap-3">
                {STORES.map((s) => (
                  <Magnetic key={s.name} strength={0.25}>
                    <a href="#download" className="flex items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-white transition-colors hover:bg-[#2a2a2a]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                        <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14" />
                      </svg>
                      <span className="leading-tight">
                        <span className="block text-[10px] text-white/60">{s.label}</span>
                        <span className="block text-sm font-medium">{s.name}</span>
                      </span>
                    </a>
                  </Magnetic>
                ))}
              </div>
              <div data-reveal id="download" className="max-w-[460px] scroll-mt-32">
                <p className="mb-3 text-sm text-muted">Or we&apos;ll email you a download link:</p>
                <SendLink />
              </div>
              <div data-reveal className="flex items-center gap-4">
                <AvatarStack size={36} />
                <p className="text-sm text-muted">
                  <span className="font-medium text-ink">4.9 ★</span> from 12,000+ reviews
                </p>
              </div>
            </FadeIn>
          </div>
          <PhoneMockup />
        </Container>
      </section>
      <Marquee items={["iPhone", "Android", "Mac", "Windows", "Web", "iPad"]} speed={24} className="border-y border-line bg-ink py-6 text-white" />
      <div className="h-24" />
    </main>
  );
}
