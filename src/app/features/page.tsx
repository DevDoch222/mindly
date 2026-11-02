import type { Metadata } from "next";
import { PageHeader, CTA, Container, Eyebrow } from "@/components/ui";
import { FadeIn, SplitReveal } from "@/components/Reveal";
import HorizontalFeatures from "@/components/features/HorizontalFeatures";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = { title: "Features" };

const SMALL = [
  { t: "Voice capture", d: "Talk it out. Mindly transcribes and tidies as you speak.", i: "wave" as const },
  { t: "Smart spaces", d: "Notes cluster themselves into spaces you never had to set up.", i: "idea" as const },
  { t: "Daily focus", d: "Three priorities a day. Nothing more, nothing less.", i: "focus" as const },
  { t: "Plans from notes", d: "Turn any idea into steps, deadlines and reminders.", i: "plan" as const },
  { t: "Evening reflect", d: "A two-minute wind-down that shows what moved today.", i: "reflect" as const },
  { t: "Sync everywhere", d: "Instant sync with end-to-end encryption on every device.", i: "sync" as const },
];

export default function FeaturesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Features"
        title={"Everything your\nmind *needs.*"}
        intro="Mindly is a calm, focused home for your thoughts. Here's what's inside — scroll sideways through the core of it."
      />
      <HorizontalFeatures />
      <section className="py-24 md:py-36">
        <Container>
          <Eyebrow>And the little things</Eyebrow>
          <SplitReveal text={"Details that make\nit feel *effortless.*"} className="font-serif mt-6 text-[clamp(2.6rem,6vw,5rem)] leading-[0.95]" />
          <FadeIn stagger={0.08} className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {SMALL.map((f) => (
              <div key={f.t} data-reveal className="group bg-bg p-8 transition-colors duration-500 hover:bg-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                  <Icon name={f.i} className="h-5 w-5" />
                </span>
                <h3 className="mt-10 text-xl font-medium tracking-tight">{f.t}</h3>
                <p className="mt-2 text-muted">{f.d}</p>
              </div>
            ))}
          </FadeIn>
        </Container>
      </section>
      <CTA />
    </main>
  );
}
