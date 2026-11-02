import type { Metadata } from "next";
import { CTA, Container, Eyebrow } from "@/components/ui";
import { FadeIn, SplitReveal } from "@/components/Reveal";
import OrbitHub from "@/components/integrations/OrbitHub";
import AppGrid from "@/components/integrations/AppGrid";

export const metadata: Metadata = { title: "Integrations" };

export default function IntegrationsPage() {
  return (
    <main>
      <section className="overflow-hidden pt-32 md:pt-40">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <FadeIn>
              <Eyebrow>Integrations</Eyebrow>
            </FadeIn>
            <SplitReveal
              as="h1"
              immediate
              delay={0.15}
              text={"Plays well\nwith *your tools.*"}
              className="font-serif mt-6 text-[clamp(3.2rem,8vw,7rem)] leading-[0.92]"
            />
            <FadeIn delay={0.5} className="mt-8 max-w-[440px] text-[17px] leading-relaxed text-muted">
              <p>Mindly sits at the centre of your workflow. Pull ideas in from anywhere, push plans out to where work happens.</p>
            </FadeIn>
          </div>
          <OrbitHub />
        </Container>
      </section>
      <section className="py-24 md:py-32">
        <Container>
          <SplitReveal text={"Every *connection.*"} className="font-serif mb-10 text-[clamp(2.6rem,6vw,5rem)] leading-[0.95]" />
          <AppGrid />
        </Container>
      </section>
      <CTA />
    </main>
  );
}
