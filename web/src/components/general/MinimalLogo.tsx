"use client";
import Link from "next/link";

export function MinimalLogo({
  small = false,
  href = "/",
  ariaLabel = "IQS — Back to home",
}: {
  small?: boolean;
  href?: string;
  ariaLabel?: string;
}) {
  const size = small ? "h-5 w-5" : "h-7 w-7"; // slightly larger by default
  const gradientId = "iqs-logo-gradient";

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center justify-center ${size}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-full w-full"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {/* Rounded futuristic square */}
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="6"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.5"
        />
        {/* Abstract cross/plus for queueing symbol */}
        <path
          d="M8 12h8M12 8v8"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">IQS</span>
    </Link>
  );
}
