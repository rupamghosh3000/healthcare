import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = 'h-8 w-auto' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 48"
      fill="none"
      className={className}
      aria-label="CareConnect Logo"
    >
      <rect x="2" y="6" width="36" height="36" rx="12" fill="#0A0F1D" />
      <path
        d="M26 18C24.5 15.5 21.5 14 18 14C12.477 14 8 18.477 8 24C8 29.523 12.477 34 18 34C21.5 34 24.5 32.5 26 30"
        stroke="#00D2D3"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="20" cy="24" r="3.5" fill="#00D2D3" />
      <circle cx="27" cy="18" r="2.5" fill="#38BDF8" />
      <text
        x="48"
        y="29"
        fontFamily="'Space Grotesk', -apple-system, sans-serif"
        fontSize="19"
        fontWeight="700"
        fill="#0A0F1D"
        letterSpacing="-0.02em"
      >
        CareConnect
      </text>
      <circle cx="152" cy="22" r="3" fill="#00D2D3" />
    </svg>
  );
};
