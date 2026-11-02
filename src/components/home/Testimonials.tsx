import Image from "next/image";
import { Container, Eyebrow } from "../ui";
import { SplitReveal } from "../Reveal";

const QUOTES = [
  { q: "My brain finally has a home. I stopped losing ideas in five different apps.", n: "Daniel R.", r: "Product designer", a: "/images/avatar-1.jpg" },
  { q: "Focus mode is the first thing I open every morning. It's quietly changed how I work.", n: "Leo M.", r: "Writer", a: "/images/avatar-2.jpg" },
  { q: "It feels less like software and more like a calm room I can step into.", n: "Theo K.", r: "Founder", a: "/images/avatar-3.jpg" },
  { q: "Plans that actually move. I ship side projects now instead of collecting them.", n: "Sami A.", r: "Developer", a: "/images/avatar-4.jpg" },
  { q: "Beautiful, fast, and it gets out of the way. Exactly what I wanted.", n: "Marco B.", r: "Photographer", a: "/images/avatar-5.jpg" },
];

export default function Testimonials() {
  const row = (reverse: boolean) => (
    <div className="marquee overflow-hidden py-2">
      <div className="marquee-track gap-4 pr-4" style={{ ["--marquee-speed" as string]: "55s", animationDirection: reverse ? "reverse" : "normal" }}>
        {[...QUOTES, ...QUOTES].map((t, i) => (
          <figure key={i} className="paper-card w-[320px] shrink-0 rounded-[24px] p-6 md:w-[380px]">
            <blockquote className="font-serif text-[22px] leading-snug">“{t.q}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Image src={t.a} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              <span>
                <span className="block text-sm font-medium">{t.n}</span>
                <span className="block text-xs text-muted">{t.r}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );

  return (
    <section className="overflow-hidden py-24 md:py-32">
      <Container className="mb-14">
        <Eyebrow>Loved by thinkers</Eyebrow>
        <SplitReveal text={"Quiet minds,\n*loud results.*"} className="font-serif mt-6 text-[clamp(2.6rem,6vw,5rem)] leading-[0.95]" />
      </Container>
      {row(false)}
      {row(true)}
    </section>
  );
}
