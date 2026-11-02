import Link from "next/link";
import { Container } from "@/components/ui";
import RotatingBadge from "@/components/hero/RotatingBadge";

export default function NotFound() {
  return (
    <main>
      <Container className="flex min-h-[90vh] flex-col items-center justify-center pt-24 text-center">
        <RotatingBadge />
        <h1 className="font-serif mt-8 text-[clamp(4rem,14vw,11rem)] leading-none">
          Lost in <em>thought.</em>
        </h1>
        <p className="mt-6 max-w-[380px] text-muted">This page wandered off. Let&apos;s get you back somewhere clearer.</p>
        <Link href="/" className="btn btn-dark mt-10">
          Back home
        </Link>
      </Container>
    </main>
  );
}
