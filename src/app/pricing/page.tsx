import type { Metadata } from "next";
import { CTA, Container, Eyebrow } from "@/components/ui";
import { FadeIn, SplitReveal } from "@/components/Reveal";
import Pricing from "@/components/pricing/Pricing";
import Faq from "@/components/pricing/Faq";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <main>
      <section className="pt-36 md:pt-44">
        <Container>
          <div className="text-center">
            <FadeIn>
              <Eyebrow className="justify-center">Pricing</Eyebrow>
            </FadeIn>
            <SplitReveal
              as="h1"
              immediate
              delay={0.15}
              text={"Clarity at\n*any size.*"}
              className="font-serif mt-6 text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.92]"
            />
            <FadeIn delay={0.5} className="mx-auto mt-6 max-w-[440px] text-[17px] text-muted">
              <p>Start free. Upgrade when Mindly becomes part of how you think.</p>
            </FadeIn>
          </div>
          <div className="mt-14">
            <Pricing />
          </div>
        </Container>
      </section>
      <section className="py-24 md:py-36">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <SplitReveal text={"Questions,\n*answered.*"} className="font-serif mt-6 text-[clamp(2.6rem,6vw,5rem)] leading-[0.95]" />
          </div>
          <Faq />
        </Container>
      </section>
      <CTA />
    </main>
  );
}
