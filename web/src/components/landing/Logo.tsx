"use client";

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={`relative ${small ? "h-5 w-5" : "h-6 w-6"}`} aria-hidden>
      <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="url(#g)"
          opacity="0.9"
        />
        <path
          d="M8 12h8M12 8v8"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">Nursy</span>
    </div>
  );
}
