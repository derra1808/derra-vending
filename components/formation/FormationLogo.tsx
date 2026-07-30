import Image from "next/image";
import Link from "next/link";

interface FormationLogoProps {
  size?: number;
  showText?: boolean;
  href?: string;
}

export function FormationLogo({
  size = 44,
  showText = true,
  href = "/formation",
}: FormationLogoProps) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <span
        className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/logo.png"
          alt="Derra Vending"
          fill
          className="object-cover object-center"
          sizes={`${size}px`}
          priority
        />
      </span>
      {showText && (
        <span
          className="hidden text-[11px] font-medium tracking-[0.22em] sm:inline"
          style={{ color: "var(--d-cream)" }}
        >
          DERRA VENDING
        </span>
      )}
    </Link>
  );
}

export function FormationBackground() {
  return (
    <div className="formation-bg-logo" aria-hidden="true">
      <Image
        src="/brand/logo.png"
        alt=""
        width={480}
        height={480}
        className="formation-bg-logo-img"
        sizes="480px"
      />
    </div>
  );
}