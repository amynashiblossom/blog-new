import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SecurityBanner } from './components/SecurityBanner';
import { EvidenceGuideBanner } from './components/EvidenceGuideBanner';

import { SecurityModal } from './components/SecurityModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PortfolioWebPreview } from './components/PortfolioWebPreview';
import { CaseStudyModal } from './components/CaseStudyModal';

import { DashboardView } from './components/DashboardView';
import { BlockVaultView } from './components/BlockVaultView';
import { PortfolioBuilderView } from './components/PortfolioBuilderView';
import { AIDiagnosisView } from './components/AIDiagnosisView';
import { CommunityView } from './components/CommunityView';
import { JobArchiveView } from './components/JobArchiveView';
import { ExternalLink, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

import {
  INITIAL_USER_PROFILE,
  SAMPLE_EXPERIENCE_BLOCKS,
  SAMPLE_COMMUNITY_REFERENCES
} from './data/mockData';

import {
  loadStoredProfile,
  saveStoredProfile,
  loadStoredBlocks,
  saveStoredBlocks,
  decodePortfolioData,
  fetchSharedPortfolioApi
} from './lib/storage';

import {
  JobCategory,
  ExperienceBlock,
  UserProfile,
  PortfolioCommunityReference
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>('pm');
  
  const [profile, setProfile] = useState<UserProfile>(loadStoredProfile);
  const [blocks, setBlocks] = useState<ExperienceBlock[]>(loadStoredBlocks);
  const [isLoadingShared, setIsLoadingShared] = useState<boolean>(false);

  const [sharedSelectedBlock, setSharedSelectedBlock] = useState<ExperienceBlock | null>(null);

  // Handle URL share link loading on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('shareId');
    const pd = urlParams.get('pd');

    // 1. Direct short shareId from server
    let pathShareId = '';
    if (window.location.pathname.startsWith('/p/')) {
      pathShareId = window.location.pathname.replace('/p/', '');
    }
    const targetShareId = shareId || pathShareId;

    if (targetShareId) {
      setIsLoadingShared(true);
      setActiveTab('shared-portfolio');
      fetchSharedPortfolioApi(targetShareId)
        .then((data) => {
          if (data) {
            setProfile(data.profile);
            setBlocks(data.blocks.map(b => ({ ...b, selectedForPortfolio: true })));
          }
        })
        .finally(() => setIsLoadingShared(false));
    } else if (pd) {
      // 2. Query param fallback
      const decoded = decodePortfolioData(pd);
      if (decoded) {
        setProfile(decoded.profile);
        setBlocks(decoded.blocks.map(b => ({ ...b, selectedForPortfolio: true })));
        setActiveTab('shared-portfolio');
      }
    } else if (window.location.search.includes('view=portfolio')) {
      setActiveTab('shared-portfolio');
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveStoredBlocks(blocks);
  }, [blocks]);

  // Modals state (Do NOT open onboarding modal automatically if entering via share link)
  const isShareMode = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/p/') || 
    window.location.search.includes('shareId=') ||
    window.location.search.includes('pd=') ||
    window.location.search.includes('view=portfolio')
  );

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(!isShareMode);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [isAddBlockVaultModalOpen, setIsAddBlockVaultModalOpen] = useState<boolean>(false);

  // Filter blocks by selectedCategory if needed
  const handleCategorySelect = (category: JobCategory) => {
    setSelectedCategory(category);
    // Automatically adjust cat persona if needed
    if (category === 'dev') {
      setProfile((prev) => ({
        ...prev,
        catPersona: { ...prev.catPersona, style: 'techie' },
      }));
    } else if (category === 'design') {
      setProfile((prev) => ({
        ...prev,
        catPersona: { ...prev.catPersona, style: 'artist' },
      }));
    } else if (category === 'pm') {
      setProfile((prev) => ({
        ...prev,
        catPersona: { ...prev.catPersona, style: 'classic' },
      }));
    }
  };

  // Toggle Top 3 Portfolio Selection
  const handleToggleTop3Block = (id: string) => {
    setBlocks((prev) => {
      const target = prev.find((b) => b.id === id);
      if (!target) return prev;

      // If already selected, allow unselect
      if (target.selectedForPortfolio) {
        return prev.map((b) => (b.id === id ? { ...b, selectedForPortfolio: false } : b));
      }

      // Check current selected count (limit max 3)
      const currentSelectedCount = prev.filter((b) => b.selectedForPortfolio).length;
      if (currentSelectedCount >= 3) {
        alert('대표 프로젝트는 최대 3개까지만 선택 가능합니다. 기존 선택 프로젝트를 먼저 해제하세요!');
        return prev;
      }

      return prev.map((b) => (b.id === id ? { ...b, selectedForPortfolio: true } : b));
    });
  };

  // Add / Edit / Delete Blocks
  const handleAddBlock = (newBlock: ExperienceBlock) => {
    setBlocks((prev) => [newBlock, ...prev]);
  };

  const handleUpdateBlock = (updatedBlock: ExperienceBlock) => {
    setBlocks((prev) => prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)));
  };

  const handleUpdateBlockThumbnail = (blockId: string, newThumbnailUrl: string) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              fiveCards: {
                ...b.fiveCards,
                card1_cover: {
                  ...b.fiveCards.card1_cover,
                  thumbnailUrl: newThumbnailUrl,
                },
              },
            }
          : b
      )
    );
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Import Community Template
  const handleImportTemplate = (ref: PortfolioCommunityReference) => {
    // Generate new template block
    const newTemplateBlock: ExperienceBlock = {
      id: `imported-${Date.now()}`,
      jobCategory: ref.jobCategory,
      notionSpec: {
        projectName: `${ref.authorName} 레퍼런스: ${ref.featuredBlockTitles[0] || '합격 프로젝트'}`,
        client: 'B2C 서비스',
        company: ref.authorRole,
        period: '2025.01 ~ 2025.06',
        contributionRate: 85,
        role: ref.authorRole,
        keyOutcome: '주요 지표 200% 이상 턴어라운드 성과',
      },
      fiveCards: {
        card1_cover: {
          thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
          keyVisualDescription: `${ref.authorName} 합격 레퍼런스 메인 표지`,
          tagline: ref.slogan,
        },
        card2_research: {
          context: '레퍼런스 프로젝트 배경 및 연구 데이터 구조화',
          targetUser: '핵심 서비스 유저',
          problemDefinition: '핵심 병목 구간 발견',
          hypothesis: '5장 규격화 가설 실행',
        },
        card3_solutionAction1: {
          title: 'Action 1: 솔루션 개발 및 구축',
          actionDetail: '전략적 이탈율 방지 프로세스 구축',
          techOrFrameworkUsed: 'Agile, Figma, React',
        },
        card4_solutionAction2: {
          title: 'Action 2: 성능 최적화 및 A/B 검증',
          actionDetail: '통계적 유의미 결과 확보',
          keyDecisionPoint: '핵심 유저 경험 최우선 순위 선정',
        },
        card5_impact: {
          quantitativeMetrics: [
            { label: '핵심 지표 개선', value: '+140%', changePercentage: '달성' },
          ],
          qualitativeFeedback: '조직 우수 사례로 선정 및 스케일업 달성.',
        },
      },
      star: {
        situation: '기존 서비스의 지표 정체',
        task: '단기간 내 전환율 극대화',
        action: '규격화 5장 스토리라인 구축',
        result: '최고 성과 경신',
      },
      skills: ref.tags,
      isMasked: true,
      selectedForPortfolio: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setBlocks((prev) => [newTemplateBlock, ...prev]);
  };

  // Branch Matrix Selection Action
  const handleSelectBranchPath = (pathId: string) => {
    if (pathId === 'jd-matching-quick') {
      setActiveTab('diagnosis');
    } else {
      setActiveTab('builder');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF2E8] font-sans text-slate-900 selection:bg-[#2EB0A6] selection:text-white flex flex-col">
      {/* Zero Retention & Confidential Security Banner */}
      <SecurityBanner onOpenDetails={() => setIsSecurityModalOpen(true)} />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
      />

      {/* Rationale-based Portfolio Guide Banner (Always Visible across all tabs) */}
      <EvidenceGuideBanner />


      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'shared-portfolio' && (
          <div className="space-y-6">
            {isLoadingShared ? (
              <div className="p-12 bg-white border-2 border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_#0A0A0A] text-center space-y-3">
                <div className="w-8 h-8 border-4 border-[#2EB0A6] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-base font-black text-slate-900">공유된 포트폴리오 데이터를 불러오는 중입니다...</h3>
                <p className="text-xs text-slate-500 font-medium">잠시만 기다려주세요.</p>
              </div>
            ) : (
              <>
                {/* Top Share Context Banner */}
                <div className="p-4 bg-gradient-to-r from-[#2EB0A6] to-teal-700 text-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-black text-sm sm:text-base">
                          {profile.name} 님의 퍼스널 웹 포트폴리오 (공유 페이지)
                        </h2>
                        <span className="px-2 py-0.5 bg-emerald-800/80 text-emerald-100 font-extrabold text-[10px] rounded-full border border-emerald-400">
                          LIVE
                        </span>
                      </div>
                      <p className="text-xs text-teal-100 font-medium">
                        {profile.jobCategory.toUpperCase()} · 5장 규격 웹 케이스 스터디 포트폴리오
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        window.history.pushState({}, '', window.location.pathname);
                        setActiveTab('builder');
                      }}
                      className="px-3.5 py-2 bg-white text-slate-900 font-black text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] flex items-center justify-center gap-1.5 w-full sm:w-auto hover:bg-amber-50 transition-colors"
                    >
                      나도 포트폴리오 만들기
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Standalone Web Portfolio Preview */}
                <PortfolioWebPreview
                  profile={profile}
                  selectedBlocks={blocks.filter((b) => b.selectedForPortfolio)}
                  onOpenCaseStudy={(block) => setSharedSelectedBlock(block)}
                  isMaskedGlobal={profile.isConfidentialMasked}
                  onUpdateBlockThumbnail={handleUpdateBlockThumbnail}
                />
              </>
            )}

            {/* Shared Case Study Modal */}
            {sharedSelectedBlock && (
              <CaseStudyModal
                isOpen={!!sharedSelectedBlock}
                onClose={() => setSharedSelectedBlock(null)}
                block={sharedSelectedBlock}
                isMaskedGlobal={profile.isConfidentialMasked}
              />
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            blocks={blocks}
            selectedCategory={selectedCategory}
            onNavigateTab={setActiveTab}
            onAddBlockModal={() => {
              setActiveTab('vault');
              setIsAddBlockVaultModalOpen(true);
            }}
            onSelectBranchPath={handleSelectBranchPath}
          />
        )}

        {activeTab === 'vault' && (
          <BlockVaultView
            blocks={blocks}
            selectedCategory={selectedCategory}
            onAddBlock={handleAddBlock}
            onUpdateBlock={handleUpdateBlock}
            onDeleteBlock={handleDeleteBlock}
            onToggleTop3={handleToggleTop3Block}
            isAddModalOpenInitially={isAddBlockVaultModalOpen}
          />
        )}

        {activeTab === 'builder' && (
          <PortfolioBuilderView
            profile={profile}
            setProfile={setProfile}
            blocks={blocks}
            onToggleTop3Block={handleToggleTop3Block}
            onUpdateBlockThumbnail={handleUpdateBlockThumbnail}
          />
        )}

        {activeTab === 'diagnosis' && (
          <AIDiagnosisView
            selectedCategory={selectedCategory}
            blocks={blocks}
            onApplyTailoredSlogan={(slogan) => {
              setProfile((prev) => ({
                ...prev,
                catPersona: { ...prev.catPersona, slogan },
              }));
              setActiveTab('builder');
            }}
          />
        )}

        {activeTab === 'community' && (
          <CommunityView
            references={SAMPLE_COMMUNITY_REFERENCES}
            onImportTemplate={handleImportTemplate}
          />
        )}

        {activeTab === 'job-archive' && (
          <JobArchiveView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-slate-900 bg-[#FFFAF0] py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 text-sm">포트폴리오너도해</span>
            <span>· 구직자를 위한 직군 특화 5장 규격 포트폴리오 빌더</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSecurityModalOpen(true)} className="hover:underline text-slate-900 font-bold">
              Zero Data Retention 보안정책
            </button>
            <button onClick={() => setIsOnboardingOpen(true)} className="hover:underline text-[#238C84] font-bold">
              스타트 가이드
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onStartBuilder={() => setActiveTab('builder')}
      />

      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
}
