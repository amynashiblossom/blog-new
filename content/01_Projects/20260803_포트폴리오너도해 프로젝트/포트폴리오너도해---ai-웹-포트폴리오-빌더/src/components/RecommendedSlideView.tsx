import React, { useState } from 'react';
import { Maximize2, Sparkles, Image as ImageIcon } from 'lucide-react';

interface RecommendedSlideViewProps {
  mainTitle?: string;
  headline?: string;
  subDescription?: string;
  imageUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  beforeTitle?: string;
  afterTitle?: string;
  metrics?: { label: string; value: string; changePercentage?: string }[];
  className?: string;
}

export const RecommendedSlideView: React.FC<RecommendedSlideViewProps> = ({
  mainTitle = '사용성 평가',
  headline = '과업 완료 시간 30% 단축',
  subDescription = 'MVP 인터페이스 비교 평가 결과 및 사용자 정성 조사 분석',
  imageUrl,
  beforeImageUrl,
  afterImageUrl,
  beforeTitle = '개편 전',
  afterTitle = '개편 후',
  metrics = [],
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'beforeAfter'>('main');

  const displayImageUrl = imageUrl || afterImageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className={`w-full bg-[#0A0A0C] text-white p-6 sm:p-8 rounded-3xl border-2 border-slate-800 shadow-[8px_8px_0px_0px_#1E293B] ${className}`}>
      
      {/* Upper Title Section (메인 타이틀 & 설명 / 헤드라인) */}
      <div className="mb-6 space-y-2 border-b border-slate-800/80 pb-5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2EB0A6]/20 border border-[#2EB0A6]/40 rounded-full text-[#38D0C3] text-xs font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#38D0C3]" />
            {mainTitle || '추천 장표 레이아웃'}
          </div>

          {(beforeImageUrl || afterImageUrl) && (
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('main')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'main' ? 'bg-[#2EB0A6] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                메인 시각화
              </button>
              <button
                onClick={() => setActiveTab('beforeAfter')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTab === 'beforeAfter' ? 'bg-[#FF4D8B] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Before / After 비교
              </button>
            </div>
          )}
        </div>

        <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          {headline || '과업 완료 시간 30% 단축'}
        </h3>

        {subDescription && (
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            {subDescription}
          </p>
        )}
      </div>

      {/* Metrics Row if present */}
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {metrics.map((m, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 block">{m.label}</span>
              <span className="text-lg font-black text-white">{m.value}</span>
              {m.changePercentage && (
                <span className="ml-2 text-xs font-bold text-emerald-400">({m.changePercentage})</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lower Visualization Section (시각화 슬라이드 장표 영역) */}
      <div className="relative w-full rounded-2xl border-2 border-slate-800 bg-slate-950/90 overflow-hidden group shadow-2xl">
        {activeTab === 'main' ? (
          <div className="relative w-full flex items-center justify-center p-2 min-h-[280px] sm:min-h-[380px]">
            <img
              src={displayImageUrl}
              alt="Visualization Slide"
              className="w-full h-auto max-h-[500px] object-contain rounded-xl"
            />

            {/* Expand / Zoom Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="absolute top-4 right-4 p-2.5 bg-slate-900/80 hover:bg-slate-800 text-white rounded-xl border border-slate-700 backdrop-blur opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-xs font-bold shadow-lg"
            >
              <Maximize2 className="w-4 h-4 text-[#38D0C3]" />
              전체 화면으로 확대
            </button>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-black text-rose-400 block px-2 py-1 bg-rose-950/50 border border-rose-800/50 rounded-lg w-fit">
                🔴 {beforeTitle || '개편 전 (Before)'}
              </span>
              <div className="w-full h-64 rounded-xl border border-slate-800 overflow-hidden bg-slate-900">
                {beforeImageUrl ? (
                  <img src={beforeImageUrl} alt="Before" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 text-xs">
                    <ImageIcon className="w-6 h-6 mb-1" /> 이미지 미등록
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black text-emerald-400 block px-2 py-1 bg-emerald-950/50 border border-emerald-800/50 rounded-lg w-fit">
                🟢 {afterTitle || '개편 후 (After)'}
              </span>
              <div className="w-full h-64 rounded-xl border border-slate-800 overflow-hidden bg-slate-900">
                {afterImageUrl ? (
                  <img src={afterImageUrl} alt="After" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 text-xs">
                    <ImageIcon className="w-6 h-6 mb-1" /> 이미지 미등록
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Full View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex flex-col items-center justify-center">
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl p-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-sm font-black text-white">{headline}</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
              >
                닫기 ✕
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-auto p-2">
              <img src={displayImageUrl} alt="Enlarged Visual" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
