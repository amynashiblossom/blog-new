import React, { useState } from 'react';
import { ShieldCheck, Lock, EyeOff, ChevronRight } from 'lucide-react';
import { SecurityModal } from './SecurityModal';

export const SecurityBanner: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#A4D4C5]/30 border-y-2 border-slate-900 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-800">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#2EB0A6] text-white rounded-full border border-slate-900 text-[11px] font-bold shadow-[1px_1px_0px_0px_#0A0A0A]">
              <ShieldCheck className="w-3.5 h-3.5" /> AI 미학습 (Zero Data Retention) 검증 뱃지
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-700">
              <EyeOff className="w-3.5 h-3.5 text-[#2EB0A6]" /> 클라이언트 실시간 원클릭 마스킹(Blur) 지원
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-700">
              <Lock className="w-3.5 h-3.5 text-[#FF4D8B]" /> SEO 수집 차단 (noindex) 기본 적용
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 text-[#238C84] hover:text-slate-900 font-bold underline underline-offset-2 transition-colors"
          >
            3단계 보안 체계 상세보기 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <SecurityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
