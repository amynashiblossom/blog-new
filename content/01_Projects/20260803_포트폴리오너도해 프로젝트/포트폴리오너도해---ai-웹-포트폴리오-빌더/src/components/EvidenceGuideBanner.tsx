import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, ChevronDown, ChevronUp, ShieldCheck, HelpCircle } from 'lucide-react';

export const EvidenceGuideBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 border-b-2 border-slate-900 text-slate-950 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Core Banner Headline */}
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-1.5 bg-slate-950 text-amber-400 rounded-xl shrink-0 border border-amber-300/40">
              <Lightbulb className="w-4 h-4 animate-pulse" />
            </div>

            <div className="truncate">
              <span className="text-xs sm:text-sm font-black text-slate-950 tracking-tight block sm:inline mr-2">
                🔥 합격 포트폴리오의 1번 법칙: "모든 프로젝트는 '왜 그렇게 만들었는지' 근거 중심으로 작성해야 합니다!"
              </span>
              <span className="text-[11px] font-bold text-slate-900 hidden md:inline">
                (단순 기능 나열 ❌ → 문제 정의/데이터/의사결정 이유 ⭕)
              </span>
            </div>
          </div>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs rounded-xl border border-slate-900 flex items-center gap-1 shrink-0 transition-colors shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{isExpanded ? '3대 근거 가이드 접기' : '3대 근거 가이드 보기'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Detailed 3-Step Rationale Guide Box */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-950/20 grid grid-cols-1 md:grid-cols-3 gap-2.5 animate-in fade-in duration-200">
            <div className="p-2.5 bg-white/90 backdrop-blur rounded-xl border border-slate-900/40 text-xs text-slate-900 space-y-0.5 shadow-sm">
              <div className="font-black text-amber-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                1. 문제 정의 근거 (Why Problem)
              </div>
              <p className="text-[11px] font-semibold text-slate-700">
                단순 직감이 아니라 유저 불편 데이터, 이탈률(+40%), 피드백 등 객관적 증거 제시
              </p>
            </div>

            <div className="p-2.5 bg-white/90 backdrop-blur rounded-xl border border-slate-900/40 text-xs text-slate-900 space-y-0.5 shadow-sm">
              <div className="font-black text-indigo-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                2. 솔루션 선택 이유 (Why Solution)
              </div>
              <p className="text-[11px] font-semibold text-slate-700">
                왜 다른 대안(A안) 대신 이 방식(B안)을 채택했는지 기술적/기획적 타당성 설명
              </p>
            </div>

            <div className="p-2.5 bg-white/90 backdrop-blur rounded-xl border border-slate-900/40 text-xs text-slate-900 space-y-0.5 shadow-sm">
              <div className="font-black text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                3. 성과 & 검증 데이터 (Why Impact)
              </div>
              <p className="text-[11px] font-semibold text-slate-700">
                숫자로 증명된 구체적 지표 (전환율 CVR +35.2%, 작업 속도 2.4배 향상 등)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
