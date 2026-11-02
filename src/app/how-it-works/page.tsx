import type { Metadata } from "next";
import { PageHeader, CTA, Marquee } from "@/components/ui";
import Steps from "@/components/Steps";
import DayTimeline from "@/components/DayTimeline";

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <main>
      <PageHeader
        eyebrow="How it works"
        title={"Simple by *design.*"}
        intro="Three steps, no setup. Capture what's on your mind, let Mindly organise it, and spend your energy on what matters."
      />
      <Steps />
      <Marquee items={["No setup", "No clutter", "No noise", "Just clarity"]} speed={26} className="border-y border-line py-6" />
      <DayTimeline />
      <CTA />
    </main>
  );
}
