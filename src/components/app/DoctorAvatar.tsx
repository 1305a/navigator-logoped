export function DoctorAvatar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      role="img"
      aria-label="Фотография врача"
    >
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="80" fill="url(#bg-grad)" />
      <circle cx="80" cy="66" r="28" fill="#e7c2a1" />
      <path
        d="M52 58c0-18 13-30 28-30s28 12 28 30c0 4-1 8-2 11-2-2-4-4-7-4-2-6-8-10-19-10s-17 4-19 10c-3 0-5 2-7 4-1-3-2-7-2-11Z"
        fill="#5b4636"
      />
      <path
        d="M30 150c4-26 24-42 50-42s46 16 50 42"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M30 150c4-26 24-42 50-42s46 16 50 42"
        fill="var(--primary)"
        opacity="0.15"
      />
      <rect x="68" y="118" width="24" height="14" rx="4" fill="#fff" opacity="0.9" />
    </svg>
  );
}
