import React from 'react';
import { CatAvatarStyle } from '../types';

interface SmilingCatMascotProps {
  style?: CatAvatarStyle;
  primaryColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  quote?: string;
  showBubble?: boolean;
  className?: string;
}

export const SmilingCatMascot: React.FC<SmilingCatMascotProps> = ({
  style = 'artist',
  primaryColor = '#2EB0A6',
  size = 'md',
  quote,
  showBubble = false,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const getAccessory = () => {
    switch (style) {
      case 'techie':
        return (
          // Tech Glasses
          <g>
            <rect x="22" y="38" width="22" height="14" rx="4" fill="#1E293B" stroke="#0A0A0A" strokeWidth="2" />
            <rect x="56" y="38" width="22" height="14" rx="4" fill="#1E293B" stroke="#0A0A0A" strokeWidth="2" />
            <line x1="44" y1="44" x2="56" y2="44" stroke="#0A0A0A" strokeWidth="3" />
            <line x1="12" y1="42" x2="22" y2="42" stroke="#0A0A0A" strokeWidth="2.5" />
            <line x1="78" y1="42" x2="88" y2="42" stroke="#0A0A0A" strokeWidth="2.5" />
            {/* Glare */}
            <line x1="25" y1="41" x2="32" y2="41" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <line x1="59" y1="41" x2="66" y2="41" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case 'artist':
        return (
          // Artist Beret Hat & Palette (Default Style)
          <g>
            {/* Beret Hat Body */}
            <path
              d="M 22 28 C 22 10, 72 8, 78 22 C 82 28, 64 34, 22 28 Z"
              fill="#FF4D8B"
              stroke="#0A0A0A"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Beret Stalk */}
            <path
              d="M 50 13 C 50 7, 54 7, 54 11"
              stroke="#0A0A0A"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="50" cy="9" r="3" fill="#FF4D8B" stroke="#0A0A0A" strokeWidth="1.5" />
            
            {/* Cute Mini Painter's Palette */}
            <g transform="translate(68, 56) rotate(-10)">
              <ellipse cx="10" cy="8" rx="9" ry="7" fill="#FFF2E8" stroke="#0A0A0A" strokeWidth="2" />
              <circle cx="6" cy="6" r="1.5" fill="#FF4D8B" />
              <circle cx="10" cy="5" r="1.5" fill="#2EB0A6" />
              <circle cx="13" cy="8" r="1.5" fill="#E8B94A" />
              <circle cx="8" cy="11" r="1.8" fill="#0A0A0A" />
            </g>
          </g>
        );
      case 'executive':
        return (
          // Executive Collar & Star Badge (No Bowtie/Ribbon)
          <g>
            <polygon points="36,74 50,78 64,74 50,86" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="2" />
            <polygon points="50,78 54,88 50,94 46,88" fill="#2EB0A6" stroke="#0A0A0A" strokeWidth="1.5" />
          </g>
        );
      case 'classic':
      default:
        return (
          // Clean Cute Bell Collar (No Bowtie/Ribbon)
          <g>
            <path d="M 32 74 Q 50 82 68 74" stroke="#FF4D8B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="78" r="4.5" fill="#E8B94A" stroke="#0A0A0A" strokeWidth="1.5" />
            <circle cx="50" cy="78" r="1.2" fill="#0A0A0A" />
          </g>
        );
    }
  };

  return (
    <div className={`relative inline-flex items-center group ${className}`}>
      {/* Speech Bubble */}
      {showBubble && quote && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A] z-20 text-xs text-slate-800 font-medium text-center animate-bounce-short">
          <span>{quote}</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-slate-900" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-7 border-transparent border-t-white" />
        </div>
      )}

      {/* SVG Mascot */}
      <svg
        className={`${sizeMap[size]} transition-transform duration-300 group-hover:scale-105 filter drop-shadow-md`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="50" cy="92" rx="36" ry="6" fill="#0A0A0A" opacity="0.12" />

        {/* Clean Pointed Cat Ears (No Rainbow) */}
        <polygon points="20,40 12,12 42,26" fill={primaryColor} stroke="#0A0A0A" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="24,36 18,19 38,26" fill="#FFB084" />

        <polygon points="80,40 88,12 58,26" fill={primaryColor} stroke="#0A0A0A" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="76,36 82,19 62,26" fill="#FFB084" />

        {/* Cat Head */}
        <circle cx="50" cy="52" r="36" fill="#FFF2E8" stroke="#0A0A0A" strokeWidth="3.5" />

        {/* Rosy Blushing Cheeks */}
        <circle cx="27" cy="58" r="7" fill="#FF4D8B" opacity="0.4" />
        <circle cx="73" cy="58" r="7" fill="#FF4D8B" opacity="0.4" />

        {/* Happy Curved Eyes ^ ^ */}
        <path d="M 28 46 Q 35 37 42 46" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 58 46 Q 65 37 72 46" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Cute Pink Nose */}
        <polygon points="50,53 45,49 55,49" fill="#FF4D8B" stroke="#0A0A0A" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Big Happy Smile Mouth :3 with Little Tongue */}
        <path d="M 50 53 Q 44 63 36 57" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 50 53 Q 56 63 64 57" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 47 58 Q 50 63 53 58 Z" fill="#FF4D8B" />

        {/* Whiskers */}
        <line x1="9" y1="51" x2="23" y2="53" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
        <line x1="7" y1="59" x2="21" y2="58" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />

        <line x1="91" y1="51" x2="77" y2="53" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />
        <line x1="93" y1="59" x2="79" y2="58" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" />

        {/* Cute Paws */}
        <ellipse cx="36" cy="85" rx="7" ry="5" fill="#FFF2E8" stroke="#0A0A0A" strokeWidth="2.5" />
        <ellipse cx="64" cy="85" rx="7" ry="5" fill="#FFF2E8" stroke="#0A0A0A" strokeWidth="2.5" />

        {/* Accessory */}
        {getAccessory()}
      </svg>
    </div>
  );
};
