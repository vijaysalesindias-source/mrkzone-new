import React from 'react';

export default function AmazonPrimeBadge({ className = "h-3.5" }) {
  return (
    <span className={`inline-flex items-center select-none align-middle ${className}`}>
      <span className="inline-flex items-center text-[#00a8e1] font-black italic tracking-tighter">
        <svg
          className="w-3 h-3 text-[#00a8e1] mr-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-[11px] font-extrabold italic leading-none">prime</span>
      </span>
    </span>
  );
}
