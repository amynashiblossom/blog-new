import React, { useState } from 'react';
import { PortfolioCommunityReference, JobCategory, ExperienceBlock } from '../types';
import { SmilingCatMascot } from './SmilingCatMascot';
import {
  Users,
  Heart,
  Eye,
  Sparkles,
  Copy,
  Check,
  Filter,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface CommunityViewProps {
  references: PortfolioCommunityReference[];
  onImportTemplate: (ref: PortfolioCommunityReference) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  references,
  onImportTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = references.filter(
    (ref) => selectedCategory === 'all' || ref.jobCategory === selectedCategory
  );

  const handleCopy = (ref: PortfolioCommunityReference) => {
    onImportTemplate(ref);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_#0A0A0A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2EB0A6] text-white text-xs font-black rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#0A0A0A] mb-1">
            <Users className="w-3.5 h-3.5" /> 합격 레퍼런스 커뮤니티 (Community)
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            합격 포트폴리오 갤러리 & 템플릿 복사
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-1">
            토스, 네이버, 당근, 쿠팡 합격자의 직군별 5장 규격 포트폴리오 템플릿을 탐색하고 내 보관함으로 복사해보세요.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-500 shrink-0" />
        {['all', 'pm', 'dev', 'design', 'marketing'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all border-2 ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_#2EB0A6]'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {cat === 'all' ? '전체 직군' : cat}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((ref) => {
          const isCopied = copiedId === ref.id;
          return (
            <div
              key={ref.id}
              className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_#0A0A0A] flex flex-col justify-between"
            >
              <div>
                {/* Header Info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <SmilingCatMascot size="sm" style={ref.catAvatarStyle} />
                    <div>
                      <span className="font-black text-xs text-slate-900 block">{ref.authorName}님</span>
                      <span className="text-[10px] text-slate-500 font-bold">{ref.authorRole}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-extrabold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> {ref.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {ref.viewCount}
                    </span>
                  </div>
                </div>

                {/* Title & Slogan */}
                <h3 className="font-black text-slate-900 text-base mb-1">{ref.title}</h3>
                <p className="text-xs text-slate-600 font-bold mb-4">"{ref.slogan}"</p>

                {/* Featured Block Titles */}
                <div className="p-3 bg-[#FFFAF0] border-2 border-slate-900 rounded-2xl mb-4 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">포함 대표 프로젝트 3개:</span>
                  {ref.featuredBlockTitles.map((bt, idx) => (
                    <div key={idx} className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2EB0A6]" />
                      <span>{bt}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ref.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-extrabold text-[11px] rounded-md border border-slate-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Copy Button */}
              <button
                onClick={() => handleCopy(ref)}
                className={`w-full py-2.5 rounded-xl text-xs font-black border-2 transition-all flex items-center justify-center gap-2 ${
                  isCopied
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                    : 'bg-[#2EB0A6] text-white border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_#0A0A0A]'
                }`}
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                {isCopied ? '내 보관함으로 템플릿 복사완료!' : '이 포트폴리오 템플릿 내 보관함으로 복사하기'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
