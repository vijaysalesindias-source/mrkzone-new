import React from 'react';

/**
 * BrandLogo - Renders authentic, razor-sharp vector logos for featured official brands.
 * Never fails due to external CDN blocks, 404s, 429 rate limits, or network failures.
 */
export default function BrandLogo({ slug, name, className = 'h-7 w-auto' }) {
  const normalizedSlug = (slug || name || '').toLowerCase().trim();

  switch (normalizedSlug) {
    case 'apple':
      return (
        <svg viewBox="0 0 170 170" className={className} fill="currentColor">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14.01-6.1-9.5-10.88-20.08-14.34-31.75-3.46-11.67-5.19-22.39-5.19-32.17 0-14.88 3.73-27.02 11.2-36.42 7.46-9.4 16.89-14.19 28.27-14.36 4.91 0 10.45 1.3 16.63 3.9 6.18 2.6 10.23 4.02 12.16 4.25 2.33-.46 6.58-1.96 12.74-4.51 6.16-2.55 11.51-3.69 16.06-3.42 12.98.76 23.36 5.48 31.13 14.16-11.33 6.84-16.84 16.3-16.53 28.37.31 9.4 4.06 17.26 11.25 23.59 7.19 6.33 15.66 9.87 25.4 10.63-2.3 7.07-5.06 14.02-8.29 20.85zM119.22 33.06c0-6.75 2.45-13.25 7.36-19.51 4.9-6.26 11.08-10.45 18.52-12.55.54 1.2.82 2.4.82 3.6 0 6.64-2.52 13.1-7.56 19.39-5.04 6.29-11.2 10.36-18.49 12.21-.22-1.09-.44-2.14-.65-3.14z"/>
        </svg>
      );

    case 'samsung':
      return (
        <svg viewBox="0 0 160 40" className={className} fill="none">
          <ellipse cx="80" cy="20" rx="76" ry="17" transform="rotate(-7 80 20)" fill="#1428A0" />
          <text
            x="80"
            y="26"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="'Arial Black', 'Helvetica Neue', sans-serif"
            fontWeight="900"
            fontSize="16"
            letterSpacing="2.5"
          >
            SAMSUNG
          </text>
        </svg>
      );

    case 'sony':
      return (
        <svg viewBox="0 0 140 32" className={className} fill="none">
          <text
            x="70"
            y="24"
            textAnchor="middle"
            fill="#111827"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontWeight="bold"
            fontSize="26"
            letterSpacing="5"
          >
            SONY
          </text>
        </svg>
      );

    case 'boat':
      return (
        <svg viewBox="0 0 120 36" className={className} fill="none">
          <text
            x="8"
            y="28"
            fill="#111827"
            fontFamily="'Montserrat', 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize="26"
            letterSpacing="-1.5"
          >
            bo
          </text>
          {/* Distinctive boAt red sail */}
          <path d="M 62 4 L 54 28 L 70 28 Z" fill="#E50914" />
          <path d="M 62 10 L 58 24 L 66 24 Z" fill="#FFFFFF" />
          <text
            x="72"
            y="28"
            fill="#111827"
            fontFamily="'Montserrat', 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize="26"
            letterSpacing="-0.5"
          >
            t
          </text>
        </svg>
      );

    case 'oneplus':
      return (
        <svg viewBox="0 0 150 36" className={className} fill="none">
          <rect x="2" y="3" width="30" height="30" rx="4" fill="#EB0029" />
          <text x="14" y="24" textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="19">1</text>
          <text x="24" y="14" textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="12">+</text>
          <text
            x="40"
            y="24"
            fill="#111827"
            fontFamily="'Arial', 'Helvetica Neue', sans-serif"
            fontWeight="800"
            fontSize="17"
            letterSpacing="0.8"
          >
            ONEPLUS
          </text>
        </svg>
      );

    case 'asus':
      return (
        <svg viewBox="0 0 130 36" className={className} fill="none">
          <text
            x="65"
            y="27"
            textAnchor="middle"
            fill="#00539B"
            fontFamily="'Arial Black', Impact, sans-serif"
            fontWeight="900"
            fontSize="26"
            letterSpacing="3"
          >
            ASUS
          </text>
          <line x1="8" y1="18" x2="122" y2="18" stroke="#FFFFFF" strokeWidth="2.5" />
        </svg>
      );

    case 'nike':
      return (
        <svg viewBox="0 0 100 40" className={className} fill="currentColor">
          <path d="M12 28 C 30 34, 52 35, 70 20 C 82 10, 93 2, 97 0 C 90 9, 74 27, 50 34 C 33 39, 20 38, 12 28 Z" fill="#111827" />
        </svg>
      );

    case 'philips':
      return (
        <svg viewBox="0 0 130 36" className={className} fill="none">
          <text
            x="65"
            y="26"
            textAnchor="middle"
            fill="#0B5ED7"
            fontFamily="'Arial Black', 'Helvetica Neue', sans-serif"
            fontWeight="900"
            fontSize="20"
            letterSpacing="2.2"
          >
            PHILIPS
          </text>
        </svg>
      );

    default:
      return (
        <span className="text-xs font-bold text-gray-800 tracking-wider uppercase">
          {name || slug}
        </span>
      );
  }
}
