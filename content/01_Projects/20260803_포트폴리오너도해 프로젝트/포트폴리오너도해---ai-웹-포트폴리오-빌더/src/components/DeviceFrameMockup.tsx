import React from 'react';
import { CoverFrameStyle } from '../types';

interface DeviceFrameMockupProps {
  frameStyle?: CoverFrameStyle;
  imageUrl?: string;
  alt?: string;
  floatingStickers?: string[];
  className?: string;
}

export const DeviceFrameMockup: React.FC<DeviceFrameMockupProps> = ({
  frameStyle = 'macbook',
  imageUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
  alt = 'Key Visual Screenshot',
  floatingStickers = ['너무 화나! 😤', '깜짝이야! ⚡', '불안해 💦', '행복해요 🥰', 'CVR +35.2% 📈'],
  className = ''
}) => {
  // 1. Handheld iPhone with Floating Speech Bubble Reaction Stickers (Reference Screenshot 2 Style)
  if (frameStyle === 'handheld_iphone') {
    const stickerColors = [
      'bg-amber-500 text-white',
      'bg-emerald-500 text-white',
      'bg-indigo-600 text-white',
      'bg-rose-500 text-white',
      'bg-purple-600 text-white'
    ];

    return (
      <div className={`relative mx-auto w-full max-w-sm py-4 ${className}`}>
        {/* Floating Speech Bubble Reaction Chips */}
        {floatingStickers.slice(0, 5).map((sticker, idx) => {
          const positions = [
            'top-2 -right-4 rotate-6',
            'top-16 -left-6 -rotate-6',
            'bottom-28 -left-8 rotate-3',
            'top-36 -right-8 -rotate-3',
            'bottom-8 -right-4 rotate-12'
          ];
          const posClass = positions[idx % positions.length];
          const colorClass = stickerColors[idx % stickerColors.length];

          return (
            <div
              key={idx}
              className={`absolute ${posClass} ${colorClass} px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-[3px_3px_0px_0px_#0A0A0A] border-2 border-slate-900 z-30 transition-transform duration-300 hover:scale-110`}
            >
              {sticker}
            </div>
          );
        })}

        {/* Handheld Device Container */}
        <div className="relative mx-auto w-60 sm:w-64 aspect-[9/19] bg-slate-950 rounded-[3.2rem] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.5)] border-4 border-slate-700 z-10 overflow-hidden">
          {/* Dynamic Island Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
          </div>
          {/* Screen Content */}
          <div className="w-full h-full rounded-[2.3rem] overflow-hidden bg-slate-900 relative group">
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. Lifestyle MacBook (Reference Screenshot 1 Right Style)
  if (frameStyle === 'lifestyle_macbook') {
    return (
      <div className={`relative mx-auto w-full max-w-xl rounded-3xl overflow-hidden p-6 bg-gradient-to-br from-amber-900/90 via-slate-900 to-indigo-950 text-white border-2 border-slate-900 shadow-[8px_8px_0px_0px_#0A0A0A] ${className}`}>
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
        
        {/* Angle MacBook Wrapper */}
        <div className="relative z-10 bg-slate-900/90 rounded-2xl p-2.5 border border-slate-700/60 shadow-2xl backdrop-blur-md">
          <div className="rounded-xl overflow-hidden bg-slate-950 aspect-[16/10] relative group">
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="h-2 bg-slate-400 rounded-b-md mt-1" />
        </div>
      </div>
    );
  }

  if (frameStyle === 'iphone') {
    return (
      <div className={`relative mx-auto w-56 sm:w-64 aspect-[9/19] bg-slate-900 rounded-[3rem] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-slate-700/80 ${className}`}>
        {/* Dynamic Island Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2">
          <div className="w-2 h-2 rounded-full bg-slate-800" />
        </div>
        {/* Screen */}
        <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-slate-950 relative group">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    );
  }

  if (frameStyle === 'glass') {
    return (
      <div className={`relative rounded-3xl p-3 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden ${className}`}>
        <div className="rounded-2xl overflow-hidden aspect-video bg-slate-950 relative group">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    );
  }

  if (frameStyle === 'banner') {
    return (
      <div className={`relative rounded-2xl overflow-hidden border-2 border-slate-900 shadow-[6px_6px_0px_0px_#0A0A0A] aspect-[21/9] bg-slate-900 ${className}`}>
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Default: MacBook Pro Studio Frame (Reference Screenshot 1 Left Style)
  return (
    <div className={`relative mx-auto max-w-xl w-full ${className}`}>
      {/* MacBook Top Display Lid */}
      <div className="bg-slate-900 rounded-t-2xl p-2.5 sm:p-3 pb-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] border-2 border-b-0 border-slate-800 relative">
        {/* Camera Dot */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-800" />
        
        {/* Screen Container */}
        <div className="rounded-t-xl overflow-hidden bg-slate-950 aspect-[16/10] relative group">
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* MacBook Bottom Base Hinge */}
      <div className="relative bg-gradient-to-b from-slate-300 to-slate-400 h-3 sm:h-4 rounded-b-xl border-t border-slate-400 shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex items-center justify-center">
        {/* Center Notch Opening */}
        <div className="w-16 sm:w-20 h-1.5 bg-slate-500 rounded-b-md" />
      </div>
    </div>
  );
};
