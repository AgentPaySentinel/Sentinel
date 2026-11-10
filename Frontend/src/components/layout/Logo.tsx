import { cn } from "../../utils/cn";

/**
 * AgentPay Sentinel shield logo. Pure inline SVG (no asset fetch).
 *
 * The mark is a shield with a keyhole, conveying security / surveillance of
 * agent payments. Brand-blue fill with a darker keyhole for contrast.
 */
export interface LogoProps {
  className?: string;
  /** Accessible label for screen readers. Omit for decorative use. */
  title?: string;
}

export function Logo({ className, title }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("h-7 w-7", className)}
      fill="none"
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M12 2.2 4.5 5v5.6c0 4.5 3 8.3 7.5 9.7 4.5-1.4 7.5-5.2 7.5-9.7V5L12 2.2Z"
        fill="#1d4ed8"
      />
      <path
        d="M12 2.2 4.5 5v5.6c0 4.5 3 8.3 7.5 9.7 4.5-1.4 7.5-5.2 7.5-9.7V5L12 2.2Z"
        fill="url(#sentinel-shield-sheen)"
        opacity="0.5"
      />
      {/* Keyhole */}
      <circle cx="12" cy="10.2" r="2.1" fill="#060912" />
      <path d="M11.1 11.4h1.8l.5 4.1a1.2 1.2 0 0 1-2.8 0l.5-4.1Z" fill="#060912" />
      <defs>
        <linearGradient
          id="sentinel-shield-sheen"
          x1="4.5"
          y1="2"
          x2="19.5"
          y2="20.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60a5fa" stopOpacity="0.7" />
          <stop offset="0.55" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
