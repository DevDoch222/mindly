import { Icon } from "../Icons";

export default function RotatingBadge({ className = "" }: { className?: string }) {
  const text = "A MORE FOCUSED YOU • EVERYDAY • ";
  return (
    <div className={`relative h-[104px] w-[104px] ${className}`}>
      <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="8.4" letterSpacing="2.1" fill="currentColor">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <Icon name="spark" className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
