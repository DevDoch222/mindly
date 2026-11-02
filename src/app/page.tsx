import Hero from "@/components/hero/Hero";
import FeatureBento from "@/components/home/FeatureBento";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import Steps from "@/components/Steps";
import { ScrubText } from "@/components/Reveal";
import { Container, CTA, Marquee } from "@/components/ui";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee items={["Capture", "Organise", "Focus", "Plan", "Reflect"]} className="border-y border-line py-6" />
      <section className="py-28 md:py-44">
        <Container>
          <ScrubText
            text="Your mind wasn't built to hold everything. It was built to *think.* Mindly holds the rest — the ideas, the plans, the half-finished thoughts — so you can *breathe.*"
            className="mx-auto max-w-[1000px] text-center text-[clamp(1.9rem,4.4vw,3.6rem)] font-medium leading-[1.12] tracking-tight"
          />
        </Container>
      </section>
      <FeatureBento />
      <Stats />
      <Steps compact />
      <Testimonials />
      <CTA />
    </main>
  );
}
