import type { ZodiacSign } from "@/lib/horoscope/types";

const PATHS: Record<ZodiacSign, string> = {
  belier: "M12 2c0 0-4 6-4 10a4 4 0 1 0 8 0c0-4-4-10-4-10z M8 18h8",
  taureau: "M8 14a4 4 0 0 0 8 0v-2a4 4 0 0 0-8 0v2z M12 6v4 M9 4c0 2 1.5 3 3 3s3-1 3-3",
  gemeaux: "M8 4h8M8 12h8M8 20h8 M6 4v16M18 4v16",
  cancer: "M8 12a4 4 0 0 1 8 0 M6 10c-2 0-3 1.5-3 3s1.5 3 3 3 M18 10c2 0 3 1.5 3 3s-1.5 3-3 3",
  lion: "M12 3c-3 0-5 2-5 5 0 2 1 3.5 2.5 4.5C8 14 7 16 7 18c0 2.8 2.2 5 5 5s5-2.2 5-5c0-2-1-4-2.5-5.5C16 11.5 17 10 17 8c0-3-2-5-5-5z",
  vierge: "M12 4v16 M8 8c0-2 1.8-4 4-4s4 2 4 4c0 3-2 4-4 6s-4 3-4 6",
  balance: "M6 8h12 M6 16h12 M12 8v8 M9 5l3-2 3 2 M9 19l3 2 3-2",
  scorpion: "M8 12a4 4 0 0 1 8 0 M6 10c-2 0-3 1.5-3 3s1.5 3 3 3 M18 10c2 0 3 1.5 3 3s-1.5 3-3 3 M12 16v4 M10 20h4",
  sagittaire: "M8 16l8-8 M14 8h4v4 M6 18l4-4",
  capricorne: "M8 16V8c0-2 2-4 4-4s4 2 4 4v8 M12 16c-2 0-4 2-4 4h8c0-2-2-4-4-4",
  verseau: "M8 8c2-2 4-2 6 0s4 2 6 0 M8 16c2-2 4-2 6 0s4 2 6 0 M6 6v12 M18 6v12",
  poissons: "M6 12c0-3 2.5-6 6-6s6 3 6 6-2.5 6-6 6-6-3-6-6z M6 12H4 M18 12h2 M8 10l-2-2 M16 10l2-2 M8 14l-2 2 M16 14l2 2",
};

interface ZodiacIconProps {
  sign: ZodiacSign;
  size?: number;
  className?: string;
}

export function ZodiacIcon({ sign, size = 64, className = "" }: ZodiacIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={PATHS[sign]} />
    </svg>
  );
}
