import React from 'react';
import { 
  BookmarkCheck, 
  Kanban, 
  Calendar, 
  FileText, 
  Sparkles, 
  PlusCircle, 
  Search,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';
import { JobPost } from '../types';

interface NavbarProps {
  activeTab: 'kanban' | 'timeline' | 'resume' | 'match';
  setActiveTab: (tab: 'kanban' | 'timeline' | 'resume' | 'match') => void;
  onOpenScraper: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  jobsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenScraper,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  jobsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#000000]/10 transition-all">
      {/* KRDS Government Digital Service Standard Top Bar */}
      <div className="bg-[#1D2029] text-white text-[11px] py-1 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="px-1.5 py-0.5 bg-[#2EB0A6] text-white text-[10px] font-bold rounded">KRDS & Apple HIG</span>
          <span className="text-[#A0A5B5] hidden sm:inline">대한민국 디지털 UI/UX 표준 가이드라인 및 Apple HIG 준수</span>
          <span className="text-[#2EB0A6] font-medium ml-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EB0A6] animate-pulse"></span>
            로컬 브라우저 자동 저장 활성화
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Service Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer group shrink-0" onClick={() => setActiveTab('kanban')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2EB0A6] flex items-center justify-center text-white shadow-md shadow-[#2EB0A6]/20 group-hover:scale-105 transition-transform shrink-0">
              <BookmarkCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg text-[#0A0A0A] tracking-tight whitespace-nowrap">커리어핏</span>
                <span className="px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full bg-[#E6F7F5] text-[#2EB0A6] border border-[#2EB0A6]/30 hidden xs:inline-block">
                  CareerFit
                </span>
              </div>
              <p className="text-[11px] text-[#6A6A6A] hidden xl:block">JD 붙여넣기 스마트 스크랩 & AI 이력서 매칭</p>
            </div>
          </div>

          {/* Navigation Views - Responsive Nav Tabs (지원 칸반보드, D-DAY 타임라인, AI역량매칭진단, 내 이력서프로필) */}
          <nav className="hidden md:flex items-center p-1 bg-[#F4F2EC] rounded-xl border border-[#EAE5DC] max-w-full overflow-x-auto scrollbar-none" aria-label="메인 메뉴">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB0A6] ${
                activeTab === 'kanban'
                  ? 'bg-[#2EB0A6] text-white shadow-xs'
                  : 'text-[#5A5A5A] hover:text-[#0A0A0A] hover:bg-white/50'
              }`}
            >
              <Kanban className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>공고와 매칭</span>
              <span className={`px-1.5 py-0.2 text-[10px] sm:text-xs rounded-full font-bold ${activeTab === 'kanban' ? 'bg-white/20 text-white' : 'bg-[#EAE5DC] text-[#3A3A3A]'}`}>
                {jobsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB0A6] ${
                activeTab === 'timeline'
                  ? 'bg-[#2EB0A6] text-white shadow-xs'
                  : 'text-[#5A5A5A] hover:text-[#0A0A0A] hover:bg-white/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>D-Day 타임라인</span>
            </button>

            <button
              onClick={() => setActiveTab('match')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EB0A6] ${
                activeTab === 'match'
                  ? 'bg-[#2EB0A6] text-white shadow-xs'
                  : 'text-[#5A5A5A] hover:text-[#0A0A0A] hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span>AI 역량매칭 진단</span>
            </button>
          </nav>

          {/* Action Button - Gemini AI Integration & Primary Action */}
          <div className="flex items-center gap-2 shrink-0 relative">
            <div className="px-3 py-1.5 bg-gradient-to-r from-[#E6F7F5] to-amber-50 border border-[#2EB0A6]/40 rounded-xl flex items-center gap-2 text-xs font-bold text-[#2EB0A6] shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#2EB0A6] shrink-0" />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-extrabold text-[#2EB0A6] flex items-center gap-1">
                  🔒 외부 AI 학습을 차단하는 1회성 API 연동 기반의 실시간 갭(Gap) 진단
                </span>
                <span className="text-[10px] text-[#555555] font-normal" title="학습 미반영 파이프라인 처리하나 Gemini 프로바이더 단의 자체 반영 건은 책임지지 않습니다">
                  (※ 구글 모델 학습 미반영 파이프라인 처리 / Gemini 자체 반영 건 책임 제외)
                </span>
              </div>
              <span className="lg:hidden text-xs font-bold">🔒 1회성 AI 갭(Gap) 진단</span>
            </div>

            <button
              onClick={onOpenScraper}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2EB0A6] hover:bg-[#228B83] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#2EB0A6]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2EB0A6] whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline">공고(JD) 붙여넣기 스크랩</span>
              <span className="xs:hidden">JD 스크랩</span>
            </button>
          </div>

        </div>

        {/* Search & Filter Bar */}
        <div className="py-2.5 border-t border-[#EAE5DC]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6A6A6A]" />
            <input
              type="text"
              placeholder="회사명, 직무, 기술 키워드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#EAE5DC] rounded-lg text-sm text-[#0A0A0A] placeholder-[#6A6A6A] focus:outline-none focus:border-[#2EB0A6] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-[#6A6A6A] flex items-center gap-1 shrink-0 whitespace-nowrap">
              <SlidersHorizontal className="w-3.5 h-3.5" /> 상태 필터:
            </span>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors shrink-0 whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-[#2EB0A6] text-white font-medium'
                  : 'bg-white border border-[#EAE5DC] text-[#3A3A3A] hover:bg-[#FAF5E8]'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilterStatus('interested')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors shrink-0 whitespace-nowrap ${
                filterStatus === 'interested'
                  ? 'bg-[#2EB0A6] text-white font-medium'
                  : 'bg-white border border-[#EAE5DC] text-[#3A3A3A] hover:bg-[#FAF5E8]'
              }`}
            >
              관심공고
            </button>
            <button
              onClick={() => setFilterStatus('preparing')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors shrink-0 whitespace-nowrap ${
                filterStatus === 'preparing'
                  ? 'bg-[#2EB0A6] text-white font-medium'
                  : 'bg-white border border-[#EAE5DC] text-[#3A3A3A] hover:bg-[#FAF5E8]'
              }`}
            >
              서류 준비 중
            </button>
            <button
              onClick={() => setFilterStatus('applied')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors shrink-0 whitespace-nowrap ${
                filterStatus === 'applied'
                  ? 'bg-[#2EB0A6] text-white font-medium'
                  : 'bg-white border border-[#EAE5DC] text-[#3A3A3A] hover:bg-[#FAF5E8]'
              }`}
            >
              지원 완료
            </button>
            <button
              onClick={() => setFilterStatus('interview')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors shrink-0 whitespace-nowrap ${
                filterStatus === 'interview'
                  ? 'bg-[#2EB0A6] text-white font-medium'
                  : 'bg-white border border-[#EAE5DC] text-[#3A3A3A] hover:bg-[#FAF5E8]'
              }`}
            >
              면접 진행
            </button>
            <button
              onClick={() => setFilterStatus('passed')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors shrink-0 whitespace-nowrap ${
                filterStatus === 'passed'
                  ? 'bg-[#2EB0A6] text-white font-medium'
                  : 'bg-white border border-[#EAE5DC] text-[#3A3A3A] hover:bg-[#FAF5E8]'
              }`}
            >
              최종 합격
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#EAE5DC] text-xs">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'kanban' ? 'text-[#2EB0A6] font-bold' : 'text-[#6A6A6A]'}`}
          >
            <Kanban className="w-5 h-5" />
            <span>공고랑 매칭</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'timeline' ? 'text-[#2EB0A6] font-bold' : 'text-[#6A6A6A]'}`}
          >
            <Calendar className="w-5 h-5" />
            <span>타임라인</span>
          </button>
          <button
            onClick={() => setActiveTab('match')}
            className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'match' ? 'text-[#2EB0A6] font-bold' : 'text-[#6A6A6A]'}`}
          >
            <Sparkles className="w-5 h-5" />
            <span>AI 진단</span>
          </button>
        </div>

      </div>
    </header>
  );
};
