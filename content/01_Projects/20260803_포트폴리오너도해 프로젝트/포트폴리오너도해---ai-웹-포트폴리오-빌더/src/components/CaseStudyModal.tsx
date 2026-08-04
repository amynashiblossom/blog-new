import React, { useState } from 'react';
import { ExperienceBlock } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { RecommendedSlideView } from './RecommendedSlideView';
import { X, CheckCircle, ExternalLink, ShieldAlert, Sparkles, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

interface CaseStudyModalProps {
  block: ExperienceBlock | null;
  isOpen: boolean;
  onClose: () => void;
  isMaskedGlobal: boolean;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  block,
  isOpen,
  onClose,
  isMaskedGlobal
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  if (!isOpen || !block) return null;

  const isMasked = isMaskedGlobal || block.isMasked;

  const renderMaskable = (text: string, isSensitiveField = false) => {
    if (!text || text.trim() === '') {
      return <span className="text-slate-400 font-normal italic text-xs">(미작성 항목)</span>;
    }
    if (isMasked && isSensitiveField) {
      return <span className="filter blur-xs select-none bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-700">₩[대외비 보호]</span>;
    }
    return text;
  };

  const cardsList = [
    { title: "Card 1: 시각적 표지", subtitle: "Project Visual Cover" },
    { title: "Card 2: 리서치 / 문제", subtitle: "Context & Target Problem" },
    { title: "Card 3: 주요 시도 (Action 1)", subtitle: "Core Solution & Tech" },
    { title: "Card 4: 주요 시도 (Action 2)", subtitle: "Execution & Decision" },
    { title: "Card 5: 시각화 성과", subtitle: "Quantified Impact & Metrics" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FFFAF0] border-2 border-slate-900 rounded-3xl p-5 sm:p-8 shadow-[8px_8px_0px_0px_#0A0A0A] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-white border-2 border-slate-900 rounded-full hover:bg-rose-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-slate-800" />
        </button>

        {/* Header */}
        <div className="pr-12 mb-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-3 py-1 bg-[#2EB0A6] text-white font-extrabold text-xs rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#0A0A0A]">
              5장 프로젝트 규격 케이스 스터디
            </span>
            {isMasked && (
              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full border border-amber-300 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" /> 대외비 블러 마스킹 적용 중
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {renderMaskable(block.notionSpec.projectName)}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            {renderMaskable(block.notionSpec.company)} · {renderMaskable(block.notionSpec.role)} · {block.notionSpec.period}
          </p>
        </div>

        {/* Card Tab Controls 1~5 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none border-b border-slate-200">
          {cardsList.map((card, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCardIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 ${
                activeCardIndex === idx
                  ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_#2EB0A6]'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
              }`}
            >
              {card.title}
            </button>
          ))}
        </div>

        {/* Card Content Area */}
        <div className="min-h-[320px]">
          {/* Card 1: Visual Cover */}
          {activeCardIndex === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div className="relative w-full h-64 sm:h-80 rounded-2xl border-2 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_#0A0A0A]">
                <img
                  src={block.fiveCards.card1_cover.thumbnailUrl}
                  alt="Cover Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent p-6 flex flex-col justify-end text-white">
                  <div className="text-xs font-bold text-[#A4D4C5] mb-1">KEY VISUAL</div>
                  <h3 className="text-lg sm:text-2xl font-black text-white mb-2">
                    "{block.fiveCards.card1_cover.tagline}"
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
                    {block.fiveCards.card1_cover.keyVisualDescription}
                  </p>
                </div>
              </div>

              {/* Notion Spec Summary Table */}
              <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">발주처 / 소속</span>
                  <span className="font-black text-slate-900">{renderMaskable(block.notionSpec.client, true)}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">참여 기여도</span>
                  <span className="font-black text-[#238C84] text-sm">{block.notionSpec.contributionRate}%</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">프로젝트 기간</span>
                  <span className="font-black text-slate-900">{block.notionSpec.period}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block mb-0.5">핵심 성과 요약</span>
                  <span className="font-black text-slate-900">{renderMaskable(block.notionSpec.keyOutcome, true)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Research & Context */}
          {activeCardIndex === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
                <h4 className="font-black text-slate-900 text-sm mb-2 text-[#2EB0A6]">1. 문제 배경 (Context)</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {renderMaskable(block.fiveCards.card2_research.context, true)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-[#FFB084]/20 border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
                  <h4 className="font-black text-slate-900 text-sm mb-2 text-amber-900">2. 타깃 유저 (Target)</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {block.fiveCards.card2_research.targetUser}
                  </p>
                </div>

                <div className="p-5 bg-[#FF4D8B]/10 border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
                  <h4 className="font-black text-slate-900 text-sm mb-2 text-[#FF4D8B]">3. 문제 정의 (Problem)</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {renderMaskable(block.fiveCards.card2_research.problemDefinition, true)}
                  </p>
                </div>
              </div>

              <div className="p-5 bg-[#B8A4ED]/20 border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
                <h4 className="font-black text-slate-900 text-sm mb-2 text-purple-900">4. 핵심 가설 (Hypothesis)</h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium italic">
                  "{block.fiveCards.card2_research.hypothesis}"
                </p>
              </div>
            </div>
          )}

          {/* Card 3: Action 1 */}
          {activeCardIndex === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-6 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
                <span className="px-3 py-1 bg-[#2EB0A6] text-white font-extrabold text-xs rounded-full border border-slate-900 mb-3 inline-block">
                  솔루션 시도 1
                </span>
                <h3 className="text-lg font-black text-slate-900 mb-3">
                  {block.fiveCards.card3_solutionAction1.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 font-medium">
                  {renderMaskable(block.fiveCards.card3_solutionAction1.actionDetail, true)}
                </p>

                <div className="pt-3 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block mb-1">활용 스택 & 프레임워크:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {block.fiveCards.card3_solutionAction1.techOrFrameworkUsed.split(',').map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-800 font-extrabold text-xs rounded-lg border border-slate-300">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card 4: Action 2 */}
          {activeCardIndex === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-6 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
                <span className="px-3 py-1 bg-[#FF4D8B] text-white font-extrabold text-xs rounded-full border border-slate-900 mb-3 inline-block">
                  솔루션 시도 2
                </span>
                <h3 className="text-lg font-black text-slate-900 mb-3">
                  {block.fiveCards.card4_solutionAction2.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 font-medium">
                  {renderMaskable(block.fiveCards.card4_solutionAction2.actionDetail, true)}
                </p>

                <div className="p-4 bg-amber-50 border-2 border-slate-900 rounded-xl">
                  <span className="text-xs font-black text-amber-900 block mb-1">💡 의사결정 모먼트 (Key Decision Point):</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {block.fiveCards.card4_solutionAction2.keyDecisionPoint}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Card 5: Visual Impact & Metrics (추천 장표 레이아웃) */}
          {activeCardIndex === 4 && (
            <div className="space-y-5 animate-fade-in">
              {/* Recommended Slide View Layout */}
              <RecommendedSlideView
                mainTitle={block.notionSpec.role || '사용성 평가'}
                headline={block.notionSpec.keyOutcome || '과업 완료 시간 30% 단축'}
                subDescription={block.fiveCards.card1_cover.tagline || 'MVP 인터페이스 비교 평가 결과 및 사용자 만족도 개선'}
                imageUrl={block.fiveCards.card1_cover.thumbnailUrl}
                beforeImageUrl={block.fiveCards.card5_impact.beforeAfter?.beforeImageUrl}
                afterImageUrl={block.fiveCards.card5_impact.beforeAfter?.afterImageUrl}
                beforeTitle={block.fiveCards.card5_impact.beforeAfter?.beforeTitle || '개편 전'}
                afterTitle={block.fiveCards.card5_impact.beforeAfter?.afterTitle || '개편 후'}
                metrics={block.fiveCards.card5_impact.quantitativeMetrics.map(m => ({
                  label: m.label,
                  value: m.value,
                  changePercentage: m.changePercentage
                }))}
              />

              {/* Quantified Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {block.fiveCards.card5_impact.quantitativeMetrics.map((m, i) => (
                  <div key={i} className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A]">
                    <span className="text-xs font-bold text-slate-500 block mb-1">{m.label}</span>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                      {renderMaskable(m.value, true)}
                    </div>
                    {m.changePercentage && (
                      <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded-md border border-emerald-300">
                        {m.changePercentage}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Qualitative Feedback if present */}
              {block.fiveCards.card5_impact.qualitativeFeedback && block.fiveCards.card5_impact.qualitativeFeedback.trim() !== '' && (
                <div className="p-4 bg-[#A4D4C5]/30 border-2 border-slate-900 rounded-2xl">
                  <span className="text-xs font-black text-teal-900 block mb-1">💬 정성적 피드백 / 조직 기여:</span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    "{block.fiveCards.card5_impact.qualitativeFeedback}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Navigation */}
        <div className="mt-6 pt-4 border-t-2 border-slate-900 flex items-center justify-between gap-2">
          <button
            onClick={() => setActiveCardIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeCardIndex === 0}
            className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl border-2 border-slate-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-[2px_2px_0px_0px_#0A0A0A]"
          >
            <ChevronLeft className="w-4 h-4" /> 이전 카드
          </button>

          <span className="text-xs font-extrabold text-slate-600">
            {activeCardIndex + 1} / {cardsList.length} 카드
          </span>

          <button
            onClick={() => setActiveCardIndex((prev) => Math.min(cardsList.length - 1, prev + 1))}
            disabled={activeCardIndex === cardsList.length - 1}
            className="px-4 py-2 bg-[#2EB0A6] text-white font-bold text-xs rounded-xl border-2 border-slate-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-[2px_2px_0px_0px_#0A0A0A]"
          >
            다음 카드 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
