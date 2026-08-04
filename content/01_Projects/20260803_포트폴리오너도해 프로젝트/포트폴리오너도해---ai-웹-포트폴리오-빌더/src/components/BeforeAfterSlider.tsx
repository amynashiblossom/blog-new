import React, { useState } from 'react';
import { ArrowLeftRight, Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeTitle: string;
  beforeDescription: string;
  afterTitle: string;
  afterDescription: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeTitle,
  beforeDescription,
  afterTitle,
  afterDescription,
  beforeImageUrl,
  afterImageUrl,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const defaultBeforeImg = "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80";
  const defaultAfterImg = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80";

  const imgBefore = beforeImageUrl || defaultBeforeImg;
  const imgAfter = afterImageUrl || defaultAfterImg;

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#0A0A0A] overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF4D8B]" />
          <h4 className="font-extrabold text-sm text-slate-900">Before & After 시각적 개편 성과</h4>
        </div>
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <ArrowLeftRight className="w-3.5 h-3.5" /> 슬라이더를 밀어 비교해보세요
        </span>
      </div>

      {/* Interactive Visual Comparison Container */}
      <div className="relative w-full h-56 sm:h-64 rounded-xl border-2 border-slate-900 overflow-hidden select-none">
        {/* AFTER Image (Background) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={imgAfter}
            alt="After State"
            className="w-full h-full object-cover filter contrast-105"
          />
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#2EB0A6] text-white font-black text-xs rounded-lg border border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A]">
            AFTER (개편 후)
          </div>
        </div>

        {/* BEFORE Image (Clipped Foreground) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={imgBefore}
            alt="Before State"
            className="w-full h-full object-cover filter grayscale contrast-120"
            style={{ width: '100%', maxWidth: 'none' }}
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-800 text-white font-black text-xs rounded-lg border border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A]">
            BEFORE (개편 전)
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white border-x border-slate-900 cursor-ew-resize z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A]">
            <ArrowLeftRight className="w-4 h-4 text-slate-900" />
          </div>
        </div>

        {/* Invisible Range Slider Overlay */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />
      </div>

      {/* Description Grid Below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-200">
        <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
          <div className="text-xs font-bold text-slate-500 mb-1">BEFORE (기존)</div>
          <div className="font-extrabold text-xs text-slate-900 mb-1">{beforeTitle}</div>
          <p className="text-[11px] text-slate-600 leading-normal">{beforeDescription}</p>
        </div>

        <div className="p-3 bg-[#2EB0A6]/10 border border-[#2EB0A6]/30 rounded-xl">
          <div className="text-xs font-bold text-[#238C84] mb-1">AFTER (개편)</div>
          <div className="font-extrabold text-xs text-slate-900 mb-1">{afterTitle}</div>
          <p className="text-[11px] text-slate-700 leading-normal">{afterDescription}</p>
        </div>
      </div>
    </div>
  );
};
