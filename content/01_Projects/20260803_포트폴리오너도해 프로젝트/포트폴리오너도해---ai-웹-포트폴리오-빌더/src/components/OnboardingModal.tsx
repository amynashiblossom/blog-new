import React from 'react';
import { SmilingCatMascot } from './SmilingCatMascot';
import { X, Sparkles, CheckCircle2, ShieldCheck, Wand2, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBuilder: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartBuilder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FFFAF0] border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#0A0A0A] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-white border-2 border-slate-900 rounded-full hover:bg-rose-100 transition-colors"
        >
          <X className="w-5 h-5 text-slate-800" />
        </button>

        {/* Hero Section */}
        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <SmilingCatMascot size="lg" style="artist" primaryColor="#2EB0A6" showBubble quote="야옹! 3분 만에 나만의 웹 포트폴리오를 만들어보자!" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            포트폴리오너도해 스타트 가이드
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
            딱딱한 나열식 이력서는 그만! 스토리텔링과 시각적 성과가 살아있는 초안 만들기
          </p>
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-[#2EB0A6] text-white font-black text-xs flex items-center justify-center border border-slate-900">1</span>
              <h3 className="font-extrabold text-sm text-slate-900">직군 프레임워크 선택</h3>
            </div>
            <p className="text-xs text-slate-600">
              기획/PM, 개발, 디자인, 마케팅 등 직군을 선택하면 맞춤 가이드가 설정됩니다.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-[#FF4D8B] text-white font-black text-xs flex items-center justify-center border border-slate-900">2</span>
              <h3 className="font-extrabold text-sm text-slate-900">노션 표 스펙 폼 작성</h3>
            </div>
            <p className="text-xs text-slate-600">
              `프로젝트명 : 발주처 : 기간 : 기여도 : 성과` 표준 양식에 내 경력을 빠르게 정리합니다.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-[#B8A4ED] text-slate-900 font-black text-xs flex items-center justify-center border border-slate-900">3</span>
              <h3 className="font-extrabold text-sm text-slate-900">대표 프로젝트 3개 선정</h3>
            </div>
            <p className="text-xs text-slate-600">
              가장 매칭률 높은 대표 3개 프로젝트를 자동 선별하여 5장 카드로 스토리라인을 구성합니다.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-[#FFB084] text-slate-900 font-black text-xs flex items-center justify-center border border-slate-900">4</span>
              <h3 className="font-extrabold text-sm text-slate-900">원클릭 대외비 마스킹 & 발행</h3>
            </div>
            <p className="text-xs text-slate-600">
              영업비밀은 Blur 처리하고 나만의 퍼스널 웹 URL로 발행하여 공유할 수 있습니다.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-slate-900">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#2EB0A6]" />
            <span>AI 미학습 & Zero Data Retention 보안 적용</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onStartBuilder();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#2EB0A6] text-white font-black text-sm rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#0A0A0A] transition-all flex items-center justify-center gap-2"
          >
            <Wand2 className="w-4 h-4" /> 지금 바로 포트폴리오 만들기 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
