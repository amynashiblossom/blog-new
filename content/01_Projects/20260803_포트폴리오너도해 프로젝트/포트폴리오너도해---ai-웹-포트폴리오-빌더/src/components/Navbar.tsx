import React from 'react';
import { JobCategory } from '../types';
import { SmilingCatMascot } from './SmilingCatMascot';
import {
  LayoutDashboard,
  FolderKanban,
  Wand2,
  BrainCircuit,
  Users,
  ShieldCheck,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: JobCategory;
  setSelectedCategory: (cat: JobCategory) => void;
  onOpenSecurityModal: () => void;
  onOpenOnboardingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  onOpenSecurityModal,
  onOpenOnboardingModal,
}) => {
  const categoryLabels: Record<JobCategory, { name: string; badgeColor: string }> = {
    pm: { name: '기획 / PM (Product Manager)', badgeColor: 'bg-[#B8A4ED] text-slate-900' },
    dev: { name: '개발 (Software Engineer)', badgeColor: 'bg-[#2EB0A6] text-white' },
    design: { name: '디자인 (UI/UX Design)', badgeColor: 'bg-[#FF4D8B] text-white' },
    marketing: { name: '마케팅 (Growth & Performance)', badgeColor: 'bg-[#FFB084] text-slate-900' },
    general: { name: '기타 / 공통 (General Role)', badgeColor: 'bg-[#E8B94A] text-slate-900' },
  };

  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'vault', label: '경험 보관함', icon: FolderKanban },
    { id: 'builder', label: '포트폴리오 빌더', icon: Wand2, highlight: true },
    { id: 'ai-diagnosis', label: 'AI 역량 진단', icon: BrainCircuit },
    { id: 'community', label: '커뮤니티', icon: Users },
  ];

  return (
    <header className="bg-[#FFFAF0] border-b-2 border-slate-900 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="p-1 bg-[#FFF2E8] border-2 border-slate-900 rounded-2xl shadow-[2px_2px_0px_0px_#0A0A0A] group-hover:scale-105 transition-transform">
                <SmilingCatMascot size="sm" style="artist" primaryColor="#2EB0A6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight">
                    포트폴리오<span className="text-[#2EB0A6]">너도해</span>
                  </h1>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold hidden sm:block">
                  직군별 5장 규격 웹 포트폴리오 초안 빌더
                </p>
              </div>
            </button>

            {/* Global Job Category Selector Dropdown */}
            <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l-2 border-slate-300">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">직군 프레임워크:</span>
              <div className="relative inline-block">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as JobCategory)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-white border-2 border-slate-900 rounded-xl text-xs font-extrabold text-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] cursor-pointer hover:bg-slate-50 focus:outline-none"
                >
                  {Object.entries(categoryLabels).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-700 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-2">
            {/* Start Guide Button */}
            <button
              onClick={onOpenOnboardingModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFB084] text-slate-900 font-black text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0A0A0A] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span className="hidden sm:inline">3분 완성</span> 가이드
            </button>

            {/* Security Modal Button */}
            <button
              onClick={onOpenSecurityModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A4D4C5] text-slate-900 font-extrabold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0A0A0A] transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-800" />
              <span className="hidden sm:inline">보안 체계</span>
            </button>
          </div>
        </div>

        {/* Category Mobile Selector */}
        <div className="flex lg:hidden items-center justify-between py-2 border-t border-slate-200">
          <span className="text-xs font-bold text-slate-600">선택 직군:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as JobCategory)}
            className="px-2.5 py-1 bg-white border border-slate-900 rounded-lg text-xs font-extrabold text-slate-900"
          >
            {Object.entries(categoryLabels).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm whitespace-nowrap transition-all border-2 ${
                  isActive
                    ? 'bg-[#2EB0A6] text-white border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A]'
                    : item.highlight
                    ? 'bg-[#FF4D8B]/10 text-[#FF4D8B] border-[#FF4D8B]/40 hover:bg-[#FF4D8B]/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                <span>{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#FF4D8B] animate-ping" />
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
