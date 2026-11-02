import Link from "next/link";
import { SplitReveal, FadeIn } from "./Reveal";
import Magnetic from "./Magnetic";
import { Icon } from "./Icons";

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.22em] text-muted ${className}`}>
      <span className="h-px w-8 bg-ink/30" />
      {children}
    </p>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 md:px-10 ${className}`}>{children}</div>;
}

/** Big serif page header used on every inner page. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <Container className="pb-16 pt-36 md:pb-24 md:pt-48">
      <FadeIn>
        <Eyebrow>{eyebrow}</Eyebrow>
      </FadeIn>
      <SplitReveal
        as="h1"
        immediate
        delay={0.15}
        text={title}
        className="font-serif mt-6 max-w-[14ch] text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.92]"
      />
      <FadeIn delay={0.5} className="mt-8 max-w-[520px] text-[17px] leading-relaxed text-muted">
        <p>{intro}</p>
      </FadeIn>
    </Container>
  );
}

export function Marquee({ items, speed = 30, className = "" }: { items: string[]; speed?: number; className?: string }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="font-serif px-8 text-[clamp(2.4rem,6vw,5rem)] italic">{t}</span>
          <Icon name="spark" className="h-5 w-5 shrink-0" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div className="marquee-track" style={{ ["--marquee-speed" as string]: `${speed}s` }}>
        {row}
        {row}
      </div>
    </div>
  );
}

export function CTA() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <Container className="relative text-center">
        <Eyebrow className="justify-center">Start today</Eyebrow>
        <SplitReveal
          text={"Make room\nfor *what matters.*"}
          className="font-serif mx-auto mt-6 text-[clamp(3rem,9vw,7.5rem)] leading-[0.92]"
        />
        <FadeIn delay={0.2} className="mt-10 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <Link href="/get-the-app" className="btn btn-dark">
              Get started free <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/pricing" className="btn btn-light">
              See pricing
            </Link>
          </Magnetic>
        </FadeIn>
      </Container>
    </section>
  );
}
