import React, { useState } from 'react';
import { UserProfile, ExperienceBlock, PortfolioViewMode } from '../types';
import { SmilingCatMascot } from './SmilingCatMascot';
import { CaseStudyModal } from './CaseStudyModal';
import { RecommendedSlideView } from './RecommendedSlideView';
import { CardKeyVisualDropZone } from './CardKeyVisualDropZone';
import { DeviceFrameMockup } from './DeviceFrameMockup';

import {
  ExternalLink,
  Mail,
  Phone,
  Github,
  Globe,
  Linkedin,
  ShieldCheck,
  EyeOff,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  LayoutGrid,
  Presentation,
  FileText
} from 'lucide-react';

interface PortfolioWebPreviewProps {
  profile: UserProfile;
  selectedBlocks: ExperienceBlock[];
  isMaskedGlobal: boolean;
  onUpdateBlockThumbnail?: (blockId: string, newUrl: string) => void;
}

export const PortfolioWebPreview: React.FC<PortfolioWebPreviewProps> = ({
  profile,
  selectedBlocks,
  isMaskedGlobal,
  onUpdateBlockThumbnail,
}) => {
  const [viewMode, setViewMode] = useState<PortfolioViewMode>(profile.viewMode || 'bento');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeCaseStudyBlock, setActiveCaseStudyBlock] = useState<ExperienceBlock | null>(null);

  const themeStyles: Record<string, { bg: string; cardBg: string; text: string; accent: string; border: string }> = {
    cream: { bg: 'bg-[#FFFAF0]', cardBg: 'bg-white', text: 'text-slate-900', accent: '#2EB0A6', border: 'border-slate-900' },
    emerald: { bg: 'bg-[#0F2926]', cardBg: 'bg-[#183E3A]', text: 'text-emerald-50', accent: '#2EB0A6', border: 'border-emerald-400' },
    serif: { bg: 'bg-[#F9F6F0]', cardBg: 'bg-white', text: 'text-stone-900', accent: '#8B5CF6', border: 'border-stone-800' },
    dark: { bg: 'bg-slate-950', cardBg: 'bg-slate-900', text: 'text-slate-100', accent: '#FF4D8B', border: 'border-slate-700' },
    navy: { bg: 'bg-[#0B132B]', cardBg: 'bg-[#1C2541]', text: 'text-slate-100', accent: '#6FFFE9', border: 'border-slate-600' }
  };

  const currentTheme = themeStyles[profile.selectedTheme] || themeStyles['cream'];

  const renderMaskable = (text: string, isSensitive = false) => {
    if ((isMaskedGlobal || profile.isConfidentialMasked) && isSensitive) {
      return <span className="filter blur-xs select-none bg-slate-300 px-1 py-0.5 rounded font-mono text-slate-800">₩[대외비 보호]</span>;
    }
    return text;
  };

  return (
    <div className={`min-h-screen p-4 sm:p-8 rounded-3xl border-2 ${currentTheme.border} ${currentTheme.bg} transition-all`}>
      
      {/* Top Floating View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 p-3 bg-white/80 backdrop-blur border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-900">🎛️ 뷰 레이아웃 선택:</span>
          <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
            (방문 채용담당자가 선호하는 방식으로 전환 가능)
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-300">
          <button
            onClick={() => setViewMode('bento')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
              viewMode === 'bento'
                ? 'bg-[#2EB0A6] text-white shadow-[2px_2px_0px_0px_#0A0A0A]'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> 웹 벤토 갤러리
          </button>

          <button
            onClick={() => setViewMode('pitchdeck')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
              viewMode === 'pitchdeck'
                ? 'bg-[#FF4D8B] text-white shadow-[2px_2px_0px_0px_#0A0A0A]'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" /> 피치덱 슬라이드 (16:9)
          </button>

          <button
            onClick={() => setViewMode('document')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
              viewMode === 'document'
                ? 'bg-[#B8A4ED] text-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A]'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> 클래식 서류
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className={`p-6 sm:p-10 ${currentTheme.cardBg} border-2 border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_#0A0A0A] mb-8 overflow-hidden`}>
        {/* Top Award / Institution Badges Cluster */}
        {profile.awardBadges && profile.awardBadges.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {profile.awardBadges.map((badge, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-slate-900 text-amber-300 font-black text-xs rounded-xl border border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] flex items-center gap-1.5"
              >
                🏆 {badge}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Bio & Persona */}
          <div className="lg:col-span-7 space-y-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="p-2 bg-[#FFF2E8] border-2 border-slate-900 rounded-3xl shadow-[3px_3px_0px_0px_#0A0A0A] shrink-0">
                <SmilingCatMascot
                  size="xl"
                  style={profile.catPersona.style}
                  primaryColor={profile.catPersona.primaryColor || currentTheme.accent}
                  showBubble
                  quote={profile.catPersona.catQuote}
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2EB0A6] text-white text-xs font-black rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#0A0A0A] mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> {profile.roleTitle}
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                  {profile.name}
                </h1>

                <p className="text-sm sm:text-base font-bold text-slate-700 max-w-xl leading-relaxed">
                  "{profile.catPersona.slogan}"
                </p>
              </div>
            </div>

            {/* Competency Chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              {profile.catPersona.competencies.map((chip, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 text-slate-800 font-extrabold text-xs rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#0A0A0A]"
                >
                  #{chip}
                </span>
              ))}
            </div>

            {/* Impact Metric Badges (Visual Badges) */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A]">
                <span className="text-[10px] font-bold text-emerald-100 block uppercase">
                  {profile.heroMetric1 || '구매 전환율 (CVR)'}
                </span>
                <span className="text-xl font-black tracking-tight">
                  {profile.heroMetric1Val || '+35.2%'}
                </span>
              </div>

              <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A]">
                <span className="text-[10px] font-bold text-indigo-100 block uppercase">
                  {profile.heroMetric2 || '평균 기여도'}
                </span>
                <span className="text-xl font-black tracking-tight">
                  {profile.heroMetric2Val || '85%'}
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="px-3 py-1.5 bg-white text-slate-900 font-extrabold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] flex items-center gap-1.5 hover:bg-slate-50"
                >
                  <Mail className="w-3.5 h-3.5 text-[#2EB0A6]" /> {profile.email}
                </a>
              )}
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-900 text-white font-extrabold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Key Visual Device Mockup with Floating Stickers */}
          <div className="lg:col-span-5 flex justify-center">
            <DeviceFrameMockup
              frameStyle={profile.coverFrameStyle || 'macbook'}
              imageUrl={profile.coverImageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80'}
              floatingStickers={profile.floatingStickers}
              alt={`${profile.name} Portfolio Key Visual`}
            />
          </div>

        </div>

        {/* Process Flow Steps Bar */}
        {profile.processSteps && profile.processSteps.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-slate-900/20">
            <span className="text-[11px] font-black text-slate-500 block mb-2 uppercase tracking-wider">
              📊 프로젝트 리서치 & 개발 프로세스 (Research Process Flow)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {profile.processSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-3 py-1.5 bg-white text-slate-900 font-extrabold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#2EB0A6] text-white text-[10px] font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    {step}
                  </span>
                  {idx < profile.processSteps!.length - 1 && (
                    <span className="text-slate-400 font-black text-xs">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </section>



      {/* VIEW MODE 1: Bento Grid Gallery */}
      {viewMode === 'bento' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2EB0A6]" /> 대표 프로젝트 (5장 규격 스토리텔링)
            </h2>
            <span className="text-xs font-bold text-slate-500">카드를 클릭하여 상세 5장 케이스 스터디 보기</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedBlocks.map((block, idx) => (
              <div
                key={block.id}
                onClick={() => setActiveCaseStudyBlock(block)}
                className={`group cursor-pointer p-5 ${currentTheme.cardBg} border-2 border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#0A0A0A] transition-all flex flex-col justify-between`}
              >
                <div>
                  {/* Interactive Drag & Drop Key Visual Cover Card */}
                  <CardKeyVisualDropZone
                    blockId={block.id}
                    thumbnailUrl={block.fiveCards.card1_cover.thumbnailUrl}
                    badgeText={`PROJECT 0${idx + 1}`}
                    onUpdateThumbnail={onUpdateBlockThumbnail}
                    className="h-44"
                  />

                  {/* Notion Spec Info */}
                  <span className="text-xs font-black text-[#238C84] block mb-1">
                    {renderMaskable(block.notionSpec.company)} · {block.notionSpec.period}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mb-2 line-clamp-2">
                    {renderMaskable(block.notionSpec.projectName)}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-4">
                    "{block.fiveCards.card1_cover.tagline}"
                  </p>
                </div>

                <div>
                  {/* Key Outcome Highlight Badge */}
                  <div className="p-3 bg-[#FFFAF0] border-2 border-slate-900 rounded-xl mb-3">
                    <span className="text-[10px] font-bold text-slate-500 block mb-0.5">핵심 성과 (Outcome)</span>
                    <span className="text-xs font-black text-slate-900">
                      {renderMaskable(block.notionSpec.keyOutcome, true)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-extrabold text-[#2EB0A6] group-hover:translate-x-1 transition-transform">
                    <span>5장 케이스 스터디 열기</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VIEW MODE 2: Pitchdeck 16:9 Slides */}
      {viewMode === 'pitchdeck' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Presentation className="w-5 h-5 text-[#FF4D8B]" /> 피치덱 16:9 슬라이드 프리젠테이션
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeSlideIndex === 0}
                className="p-2 bg-white border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0A0A0A] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black text-slate-800">
                {activeSlideIndex + 1} / {selectedBlocks.length}
              </span>
              <button
                onClick={() => setActiveSlideIndex((prev) => Math.min(selectedBlocks.length - 1, prev + 1))}
                disabled={activeSlideIndex === selectedBlocks.length - 1}
                className="p-2 bg-white border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#0A0A0A] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {selectedBlocks[activeSlideIndex] && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700">
                  슬라이드 0{activeSlideIndex + 1}: {selectedBlocks[activeSlideIndex].notionSpec.projectName}
                </span>
                <button
                  onClick={() => setActiveCaseStudyBlock(selectedBlocks[activeSlideIndex])}
                  className="px-3 py-1.5 bg-[#2EB0A6] text-white font-extrabold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] flex items-center gap-1"
                >
                  상세 5장 케이스 스터디 열기 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <RecommendedSlideView
                mainTitle={selectedBlocks[activeSlideIndex].notionSpec.role || '사용성 평가'}
                headline={selectedBlocks[activeSlideIndex].notionSpec.keyOutcome || '과업 완료 시간 30% 단축'}
                subDescription={selectedBlocks[activeSlideIndex].fiveCards.card1_cover.tagline || 'MVP 인터페이스 비교 평가 결과 및 사용성 향상'}
                imageUrl={selectedBlocks[activeSlideIndex].fiveCards.card1_cover.thumbnailUrl}
                beforeImageUrl={selectedBlocks[activeSlideIndex].fiveCards.card5_impact.beforeAfter?.beforeImageUrl}
                afterImageUrl={selectedBlocks[activeSlideIndex].fiveCards.card5_impact.beforeAfter?.afterImageUrl}
                beforeTitle={selectedBlocks[activeSlideIndex].fiveCards.card5_impact.beforeAfter?.beforeTitle}
                afterTitle={selectedBlocks[activeSlideIndex].fiveCards.card5_impact.beforeAfter?.afterTitle}
                metrics={[
                  { label: '기여도', value: `${selectedBlocks[activeSlideIndex].notionSpec.contributionRate}%` },
                  { label: '기간', value: selectedBlocks[activeSlideIndex].notionSpec.period },
                  { label: '주요 성과', value: selectedBlocks[activeSlideIndex].notionSpec.keyOutcome }
                ]}
              />
            </div>
          )}
        </section>
      )}

      {/* VIEW MODE 3: Classic Document Layout */}
      {viewMode === 'document' && (
        <section className="space-y-6 max-w-4xl mx-auto bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_#0A0A0A]">
          <h2 className="text-xl font-black text-slate-900 pb-3 border-b-2 border-slate-900">
            📄 핵심 경험 및 프로젝트 명세서
          </h2>

          <div className="space-y-8">
            {selectedBlocks.map((block, idx) => (
              <div key={block.id} className="space-y-3 pb-6 border-b border-slate-200 last:border-b-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">
                    {idx + 1}. {renderMaskable(block.notionSpec.projectName)}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{block.notionSpec.period}</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs space-y-1 font-medium">
                  <p><strong>발주처/소속:</strong> {renderMaskable(block.notionSpec.client, true)} | <strong>근무처:</strong> {block.notionSpec.company}</p>
                  <p><strong>역할/기여도:</strong> {block.notionSpec.role} ({block.notionSpec.contributionRate}%)</p>
                  <p><strong>주요 성과:</strong> {renderMaskable(block.notionSpec.keyOutcome, true)}</p>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed font-medium pl-2 border-l-2 border-[#2EB0A6]">
                  <p className="mb-1"><strong>Action:</strong> {block.star.action}</p>
                  <p><strong>Result:</strong> {block.star.result}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Case Study Detailed Modal */}
      <CaseStudyModal
        block={activeCaseStudyBlock}
        isOpen={!!activeCaseStudyBlock}
        onClose={() => setActiveCaseStudyBlock(null)}
        isMaskedGlobal={isMaskedGlobal || profile.isConfidentialMasked}
      />
    </div>
  );
};
