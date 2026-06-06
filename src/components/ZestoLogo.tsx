import React from 'react'

export const ZestoLogo: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  return (
    <svg 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Soft coral to orange/pinkish-orange gradient */}
        <linearGradient id="zestoLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFA68A" />
          <stop offset="50%" stop-color="#FF5A36" />
          <stop offset="100%" stop-color="#D93D1B" />
        </linearGradient>
        {/* Drop shadow glow */}
        <filter id="zestoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#FF5A36" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* High-fidelity SVG path representing the overlapping Z ribbon icon */}
      <path 
        d="M25 45C25 32 37 20 52 20H85C97 20 102 29 93 37L55 71C49 76 53 82 61 82H87C99 82 105 94 95 100C88 104 80 104 73 104H35C23 104 18 95 27 87L65 53C71 48 67 42 59 42H43C33 42 25 37 25 45Z" 
        fill="url(#zestoLogoGrad)"
        filter="url(#zestoGlow)"
      />
    </svg>
  )
}
