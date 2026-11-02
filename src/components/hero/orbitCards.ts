export type OrbitCard =
  | { kind: "ui"; title: string; sub: string; accent: string; icon: "focus" | "idea" | "plan" | "reflect" }
  | { kind: "img"; src: string; alt: string };

export const ORBIT_CARDS: OrbitCard[] = [
  { kind: "ui", title: "Focus", sub: "Deep work, bigger results.", accent: "#d9f26b", icon: "focus" },
  { kind: "img", src: "/images/card-mountain.jpg", alt: "Snowy mountain peak" },
  { kind: "ui", title: "Ideas", sub: "Capture everything.", accent: "#c3b4ff", icon: "idea" },
  { kind: "img", src: "/images/card-moon.jpg", alt: "Full moon" },
  { kind: "ui", title: "Plan", sub: "Turn ideas into action.", accent: "#ffb98f", icon: "plan" },
  { kind: "img", src: "/images/card-peak-moon.jpg", alt: "Crescent moon over a ridge" },
  { kind: "ui", title: "Reflect", sub: "Notice what matters.", accent: "#a6e6d4", icon: "reflect" },
  { kind: "img", src: "/images/card-lunar.jpg", alt: "Lunar surface" },
];
