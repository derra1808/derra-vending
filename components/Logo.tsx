import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-3 ${className}`}>
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/30 transition group-hover:ring-gold/60">
        <Image
          src="/brand/logo.png"
          alt="Derra Vending"
          fill
          className="object-cover"
          sizes="40px"
          priority
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-wide text-cream">
          Derra
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
          Vending
        </span>
      </div>
    </Link>
  );
}

export function LionMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path
        d="M24 8c-4 0-7 3-7 7 0 2 .5 4 1.5 5.5C16 22 14 25 14 28c0 5 4.5 9 10 9s10-4 10-9c0-3-2-6-4.5-7.5 1-1.5 1.5-3.5 1.5-5.5 0-4-3-7-7-7z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M18 14c-2 1-3 3-3 5M30 14c2 1 3 3 3 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="20" cy="24" r="1.5" fill="#0A0A0B" />
      <circle cx="28" cy="24" r="1.5" fill="#0A0A0B" />
      <path
        d="M22 29c1 1.5 3 1.5 4 0"
        stroke="#0A0A0B"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
