import React, { useState } from 'react';
import { UserProfile, ExperienceBlock, PortfolioTheme, CatAvatarStyle } from '../types';
import { SmilingCatMascot } from './SmilingCatMascot';
import { PortfolioWebPreview } from './PortfolioWebPreview';
import { encodePortfolioData, createSharedPortfolioApi } from '../lib/storage';
import {
  Wand2,
  Save,
  ShieldCheck,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Download,
  User,
  Palette,
  Eye,
  Sparkles,
  CheckCircle2,
  Plus,
  X,
  Layers,
  HelpCircle
} from 'lucide-react';

interface PortfolioBuilderViewProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  blocks: ExperienceBlock[];
  onToggleTop3Block: (id: string) => void;
  onUpdateBlockThumbnail?: (blockId: string, newUrl: string) => void;
}

export const PortfolioBuilderView: React.FC<PortfolioBuilderViewProps> = ({
  profile,
  setProfile,
  blocks,
  onToggleTop3Block,
  onUpdateBlockThumbnail,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'theme' | 'preview'>('profile');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [generatedShareUrl, setGeneratedShareUrl] = useState('');
  const [isCreatingShare, setIsCreatingShare] = useState(false);

  // Competency Tag Input State
  const [newTagInput, setNewTagInput] = useState('');

  const selectedBlocks = blocks.filter((b) => b.selectedForPortfolio);

  const handleCopyShareLink = async () => {
    setIsCreatingShare(true);
    setShareModalOpen(true);
    try {
      const url = await createSharedPortfolioApi(profile, blocks);
      setGeneratedShareUrl(url);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2500);
      }
    } catch (err) {
      console.warn('Share API generation warning:', err);
    } finally {
      setIsCreatingShare(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleSavePortfolio = () => {
    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 3000);
  };

  const handleAddCompetencyTag = () => {
    if (!newTagInput.trim()) return;
    setProfile((prev) => ({
      ...prev,
      catPersona: {
        ...prev.catPersona,
        competencies: [...prev.catPersona.competencies, newTagInput.trim()],
      },
    }));
    setNewTagInput('');
  };

  const handleRemoveCompetencyTag = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      catPersona: {
        ...prev.catPersona,
        competencies: prev.catPersona.competencies.filter((_, i) => i !== index),
      },
    }));
  };

  const catStylesList: { id: CatAvatarStyle; name: string; desc: string }[] = [
    { id: 'artist', name: '아티스트 베레모 고양이 (기본)', desc: '감각적인 핑크 베레모와 팔레트가 인상적인 마스코트' },
    { id: 'classic', name: '클래식 귀여운 고양이', desc: '깔끔하고 귀여운 심플 고양이 마스코트' },
    { id: 'techie', name: '테키 안경 고양이', desc: '개발/분석 역량이 돋보이는 고글 타입' },
    { id: 'executive', name: '넥타이 수트 고양이', desc: '경영진 및 PM 리더십 스타일' },
  ];

  const themesList: { id: PortfolioTheme; name: string; bg: string; color: string; desc: string }[] = [
    { id: 'cream', name: 'Warm Cream (웜 크림)', bg: 'bg-[#FFFAF0]', color: 'border-slate-900', desc: '따뜻한 크림 바탕과 선명한 컬러 카드' },
    { id: 'emerald', name: 'Tech Emerald (에메랄드)', bg: 'bg-[#0F2926]', color: 'border-emerald-400', desc: '기술 블로그 스타일의 다크 에메랄드' },
    { id: 'serif', name: 'Serif Editorial (에디토리얼)', bg: 'bg-[#F9F6F0]', color: 'border-stone-800', desc: '감각적인 매거진 포맷' },
    { id: 'dark', name: 'Dark Luxury (다크 럭셔리)', bg: 'bg-slate-950', color: 'border-slate-700', desc: '몰입감 높은 프리미엄 다크 테마' },
    { id: 'navy', name: 'Navy Corporate (네이비 서류)', bg: 'bg-[#0B132B]', color: 'border-slate-600', desc: '신뢰감을 주는 비즈니스 네이비' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Controls Header Bar */}
      <div className="p-4 bg-white border-2 border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_#0A0A0A] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF4D8B] text-white text-xs font-black rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#0A0A0A] mb-1">
            <Wand2 className="w-3.5 h-3.5" /> 포트폴리오 빌더 (Portfolio Builder)
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {profile.name}님의 퍼스널 웹 포트폴리오
          </h2>
        </div>

        {/* Action Button Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Masking Toggle */}
          <button
            onClick={() =>
              setProfile((prev) => ({ ...prev, isConfidentialMasked: !prev.isConfidentialMasked }))
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
              profile.isConfidentialMasked
                ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-[2px_2px_0px_0px_#0A0A0A]'
                : 'bg-white text-slate-700 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A]'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            {profile.isConfidentialMasked ? '영업비밀 마스킹 ON' : '영업비밀 마스킹 OFF'}
          </button>

          {/* Copy URL */}
          <button
            onClick={handleCopyShareLink}
            className="px-3.5 py-2 bg-white text-slate-900 font-extrabold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] hover:bg-slate-50 transition-all flex items-center gap-1.5"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedUrl ? 'URL 복사완료!' : '공유 URL 복사'}
          </button>

          {/* Save Portfolio */}
          <button
            onClick={handleSavePortfolio}
            className="px-4 py-2 bg-[#2EB0A6] text-white font-black text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0A0A0A] transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> 포트폴리오 저장하기
          </button>
        </div>
      </div>

      {savedSuccessMsg && (
        <div className="p-3 bg-emerald-100 border-2 border-slate-900 rounded-2xl text-emerald-900 font-black text-xs flex items-center gap-2 shadow-[2px_2px_0px_0px_#0A0A0A] animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>포트폴리오 구성 및 테마 설정이 성공적으로 저장되었습니다!</span>
        </div>
      )}

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-2">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded-2xl text-xs font-black border-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'profile'
              ? 'bg-[#2EB0A6] text-white border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A]'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
          }`}
        >
          <User className="w-4 h-4" /> 1. 프로필 & 대표 구성
        </button>

        <button
          onClick={() => setActiveSubTab('theme')}
          className={`px-4 py-2 rounded-2xl text-xs font-black border-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'theme'
              ? 'bg-[#FF4D8B] text-white border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A]'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
          }`}
        >
          <Palette className="w-4 h-4" /> 2. 테마 & 스타일
        </button>

        <button
          onClick={() => setActiveSubTab('preview')}
          className={`px-4 py-2 rounded-2xl text-xs font-black border-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'preview'
              ? 'bg-[#B8A4ED] text-slate-900 border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A]'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
          }`}
        >
          <Eye className="w-4 h-4" /> 3. 웹 포트폴리오 미리보기
        </button>
      </div>

      {/* Subtab 1: Profile & Composition */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          {/* Smiling Cat Mascot Persona Customizer */}
          <div className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_#0A0A0A] space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2EB0A6]" />
              <h3 className="font-black text-slate-900 text-base">웃는 고양이 브랜드 페르소나 설정</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cat Avatar Style Picker */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-2">
                  마스코트 스타일 선택
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {catStylesList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setProfile((prev) => ({
                          ...prev,
                          catPersona: { ...prev.catPersona, style: cat.id },
                        }))
                      }
                      className={`p-3 rounded-2xl border-2 text-left transition-all ${
                        profile.catPersona.style === cat.id
                          ? 'bg-[#FFF2E8] border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A]'
                          : 'bg-slate-50 border-slate-300 hover:border-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <SmilingCatMascot size="sm" style={cat.id} />
                        <span className="font-black text-xs text-slate-900">{cat.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slogan & Quote Editor */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    퍼스널 대표 한 줄 슬로건 *
                  </label>
                  <textarea
                    rows={2}
                    value={profile.catPersona.slogan}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        catPersona: { ...prev.catPersona, slogan: e.target.value },
                      }))
                    }
                    placeholder="예: 데이터 기반 문제 정의와 유저 스토리텔링으로 서비스 성장을 만드는 PM"
                    className="w-full p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    웃는 고양이 아바타 대사 (Speech Bubble)
                  </label>
                  <input
                    type="text"
                    value={profile.catPersona.catQuote}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        catPersona: { ...prev.catPersona, catQuote: e.target.value },
                      }))
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Competency Chips */}
            <div className="pt-4 border-t border-slate-200">
              <label className="block text-xs font-extrabold text-slate-700 mb-2">
                핵심 역량 태그/칩 (최대 6개)
              </label>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                {profile.catPersona.competencies.map((chip, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-900 font-extrabold text-xs rounded-full border border-slate-900 flex items-center gap-1.5 shadow-[1px_1px_0px_0px_#0A0A0A]"
                  >
                    #{chip}
                    <button
                      onClick={() => handleRemoveCompetencyTag(idx)}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="예: A/B테스트 설계"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCompetencyTag()}
                  className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
                <button
                  onClick={handleAddCompetencyTag}
                  className="px-3 py-2 bg-slate-900 text-white font-black text-xs rounded-xl"
                >
                  태그 추가
                </button>
              </div>
            </div>
          </div>

          {/* User Info Form */}
          <div className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_#0A0A0A] space-y-4">
            <h3 className="font-black text-slate-900 text-base">기본 정보 설정</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">이름</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">직무 타이틀</label>
                <input
                  type="text"
                  value={profile.roleTitle}
                  onChange={(e) => setProfile((prev) => ({ ...prev, roleTitle: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">이메일</label>
                <input
                  type="text"
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={profile.githubUrl}
                  onChange={(e) => setProfile((prev) => ({ ...prev, githubUrl: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">블로그 / 브런치 URL</label>
                <input
                  type="text"
                  value={profile.blogUrl}
                  onChange={(e) => setProfile((prev) => ({ ...prev, blogUrl: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={profile.linkedinUrl}
                  onChange={(e) => setProfile((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Top 3 Representative Projects Selection Checklist */}
          <div className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_#0A0A0A] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  대표 3개 프로젝트 선별 ({selectedBlocks.length} / 3)
                </h3>
                <p className="text-xs text-slate-600 font-semibold">
                  포트폴리오에 노출될 가장 자신 있는 3개 프로젝트를 체크하세요.
                </p>
              </div>

              {selectedBlocks.length === 3 && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-300">
                  ✓ 대표 3개 구성 완료!
                </span>
              )}
            </div>

            <div className="space-y-2">
              {blocks.map((block) => (
                <label
                  key={block.id}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    block.selectedForPortfolio
                      ? 'bg-[#FFF2E8] border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A]'
                      : 'bg-slate-50 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={block.selectedForPortfolio}
                      onChange={() => onToggleTop3Block(block.id)}
                      className="w-5 h-5 text-[#2EB0A6] rounded border-slate-900 focus:ring-0"
                    />
                    <div>
                      <span className="font-black text-xs text-slate-900 block">
                        {block.notionSpec.projectName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        {block.notionSpec.company} · 기여도 {block.notionSpec.contributionRate}%
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-[#238C84]">
                    {block.notionSpec.keyOutcome}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Theme & Style */}
      {activeSubTab === 'theme' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_#0A0A0A] space-y-4">
            <h3 className="font-black text-slate-900 text-base">웹 포트폴리오 테마 팔레트 선택</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themesList.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() =>
                    setProfile((prev) => ({ ...prev, selectedTheme: theme.id }))
                  }
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${theme.bg} ${
                    profile.selectedTheme === theme.id
                      ? 'border-slate-900 ring-4 ring-[#2EB0A6] shadow-[4px_4px_0px_0px_#0A0A0A]'
                      : 'border-slate-300 hover:border-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-black text-sm text-slate-900">{theme.name}</h4>
                    {profile.selectedTheme === theme.id && (
                      <span className="w-3 h-3 rounded-full bg-[#2EB0A6]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mb-3">{theme.desc}</p>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                    <span className="w-6 h-6 rounded-lg bg-[#FFF2E8] border border-slate-900" />
                    <span className="w-6 h-6 rounded-lg bg-[#2EB0A6] border border-slate-900" />
                    <span className="w-6 h-6 rounded-lg bg-[#FF4D8B] border border-slate-900" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Live Preview */}
      {activeSubTab === 'preview' && (
        <PortfolioWebPreview
          profile={profile}
          selectedBlocks={selectedBlocks}
          isMaskedGlobal={profile.isConfidentialMasked}
          onUpdateBlockThumbnail={onUpdateBlockThumbnail}
        />
      )}

      {/* Share Link Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[8px_8px_0px_0px_#0A0A0A] space-y-4">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-rose-100 rounded-full border border-slate-900 transition-colors"
            >
              <X className="w-4 h-4 text-slate-800" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#2EB0A6] text-white rounded-xl border border-slate-900">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">퍼스널 웹 포트폴리오 공유 URL</h3>
                <p className="text-xs text-slate-600 font-medium">채용 담당자에게 전달할 수 있는 전용 웹 링크입니다.</p>
              </div>
            </div>

            <div className="p-3 bg-[#FFFAF0] border-2 border-slate-900 rounded-2xl space-y-3">
              <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                <span>공유 URL 주소</span>
                <span className="text-[10px] text-teal-700 font-bold">✨ 내가 작성한 데이터 100% 실시간 반영</span>
              </label>

              {isCreatingShare ? (
                <div className="p-3 bg-white border border-slate-300 rounded-xl text-center text-xs font-bold text-slate-600 animate-pulse">
                  고유 공유 URL 링크를 생성 중입니다...
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedShareUrl || `${window.location.origin}?view=portfolio`}
                      className="flex-1 px-3 py-2 bg-white text-xs font-mono font-bold text-slate-900 border border-slate-300 rounded-xl select-all"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(generatedShareUrl);
                          setCopiedUrl(true);
                          setTimeout(() => setCopiedUrl(false), 2000);
                        } catch {
                          setCopiedUrl(true);
                        }
                      }}
                      className="px-3.5 py-2 bg-[#2EB0A6] text-white font-extrabold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] flex items-center gap-1 shrink-0"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedUrl ? '복사됨!' : '복사'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href={generatedShareUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 bg-[#FFF2E8] hover:bg-[#FFE5D4] text-slate-900 font-black text-xs rounded-xl border-2 border-slate-900 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#2EB0A6]" />
                      새 창에서 URL 열기
                    </a>
                    <button
                      onClick={handlePrintPDF}
                      className="py-2 px-3 bg-amber-100 hover:bg-amber-200 text-slate-900 font-black text-xs rounded-xl border-2 border-slate-900 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-700" />
                      PDF로 저장 / 인쇄
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 대외비 보안 마스킹 상태: {profile.isConfidentialMasked ? 'ON (보안 유지)' : 'OFF'}
              </span>
              <button
                onClick={() => setShareModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white font-black text-xs rounded-xl border border-slate-900"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
