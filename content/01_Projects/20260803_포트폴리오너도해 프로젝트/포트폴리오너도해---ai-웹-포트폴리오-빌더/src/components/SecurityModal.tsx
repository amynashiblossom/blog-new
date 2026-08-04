import React from 'react';
import { ShieldCheck, EyeOff, Lock, Database, Search, X, CheckCircle2 } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FFFAF0] border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#0A0A0A] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-white border-2 border-slate-900 rounded-full hover:bg-rose-100 transition-colors"
        >
          <X className="w-5 h-5 text-slate-800" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#2EB0A6] border-2 border-slate-900 rounded-2xl text-white shadow-[3px_3px_0px_0px_#0A0A0A]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Zero Data Retention Verified
            </div>
            <h2 className="text-2xl font-black text-slate-900">포트폴리오너도해 3단계 대외비 보안 체계</h2>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mb-6 font-medium">
          과거 프로젝트의 매출 수치, 고객 지표, 내부 영업비밀 유출 걱정 없이 안심하고 포트폴리오 초안을 완성하실 수 있도록 3중 데이터 보안 시스템을 제공합니다.
        </p>

        {/* 3 Step Cards */}
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#FF4D8B] text-white rounded-xl font-bold text-sm border border-slate-900">
                1단계
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <EyeOff className="w-4 h-4 text-[#FF4D8B]" />
                  <h3 className="font-bold text-slate-900 text-base">클라이언트 실시간 마스킹 (Client-Side Masking)</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  매출액, 영업이익, 고객 개인정보 등 민감한 수치를 원클릭으로 <span className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">₩[대외비]</span> 또는 블러(Blur) 처리합니다. 외부 발행 웹 포트폴리오에서도 보안 토글 ON/OFF가 지원됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#2EB0A6] text-white rounded-xl font-bold text-sm border border-slate-900">
                2단계
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-[#2EB0A6]" />
                  <h3 className="font-bold text-slate-900 text-base">AI 모델 미학습 (Zero Data Retention)</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  사용자가 작성한 경험 블록 및 JD 진단 텍스트는 <span className="font-bold text-slate-800">AI 모델 학습 데이터로 절대로 저장되거나 활용되지 않으며</span>, 분석 직후 메모리에서 즉시 폐기됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#B8A4ED] text-slate-900 rounded-xl font-bold text-sm border border-slate-900">
                3단계
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-[#B8A4ED]" />
                  <h3 className="font-bold text-slate-900 text-base">비밀번호 보호 & SEO 자동 수집 차단</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  웹 포트폴리오 URL에 <span className="font-bold text-slate-800">채용 담당자 전용 비밀번호</span>를 설정할 수 있습니다. 또한 모든 발행 페이지에 <span className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs text-rose-600 font-semibold">noindex, nofollow</span> 메타 태그가 자동 적용되어 Google/Naver 검색 노출을 완벽히 차단합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2EB0A6] text-white font-bold text-sm rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#0A0A0A] transition-all"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
