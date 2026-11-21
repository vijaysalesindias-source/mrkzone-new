import React from 'react';

// Compact Amazon.in wordmark matching the supplied reference: lowercase
// "amazon.in", with the .in suffix aligned to the lower text baseline.
export default function AmazonLogo({ variant = 'white', className = 'h-8' }) {
  const isWhite = variant === 'white';
  const textColor = isWhite ? '#ffffff' : '#111827';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 132 40"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="amazon.in"
      >
        <text
          x="3"
          y="26"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="800"
          fontSize="29"
          letterSpacing="-1.25"
          fill={textColor}
        >
          amazon
        </text>
        <text
          x="98"
          y="29"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="18"
          letterSpacing="-0.2"
          fill={textColor}
        >
          .in
        </text>
        <path
          d="M 13 30 C 34 39, 69 38, 86 28"
          stroke="#ff9900"
          strokeWidth="3.1"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M 83 24 L 91 28 L 82 31 Z" fill="#ff9900" />
      </svg>
    </div>
  );
}
