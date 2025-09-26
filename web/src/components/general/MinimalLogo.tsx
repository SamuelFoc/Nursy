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
  const size = small ? "h-5 w-5" : "h-7 w-7";
  const gradientId = "iqs-logo-gradient";

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="relative inline-flex items-center gap-2"
    >
      {/* Symbol */}
      <svg
        viewBox="0 0 24 24"
        className={`${size}`}
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f3f4f6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
        </defs>
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
        <path
          d="M8 12h8M12 8v8"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Futuristic wordmark */}
      <span
        className={`tracking-widest font-semibold bg-gradient-to-b from-gray-100 to-gray-500 bg-clip-text text-transparent select-none ${
          small ? "text-sm" : "text-lg"
        }`}
      >
        IQS
      </span>
    </Link>
  );
}
