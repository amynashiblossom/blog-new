import React from 'react';
import { ExperienceBlock, UserProfile, JobCategory } from '../types';
import { SmilingCatMascot } from './SmilingCatMascot';
import {
  FolderKanban,
  CheckCircle2,
  ShieldCheck,
  BrainCircuit,
  Wand2,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Sparkles,
  Layers,
  Calendar,
  Lock,
  EyeOff
} from 'lucide-react';

interface DashboardViewProps {
  profile: UserProfile;
  blocks: ExperienceBlock[];
  selectedCategory: JobCategory;
  onNavigateTab: (tab: string) => void;
  onAddBlockModal: () => void;
  onSelectBranchPath: (pathType: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  blocks,
  selectedCategory,
  onNavigateTab,
  onAddBlockModal,
  onSelectBranchPath,
}) => {
  const selectedCount = blocks.filter((b) => b.selectedForPortfolio).length;
  const maskedCount = blocks.filter((b) => b.isMasked).length;
  const totalBlocks = blocks.length;

  const onboardingBranches = [
    {
      id: 'junior-pm',
      title: '신입/준주니어 기획자',
      subtitle: '이탈률 개선 & CVR 5장 프레임워크',
      color: 'bg-[#B8A4ED]',
      textColor: 'text-slate-900',
      badge: '기획 / PM',
      desc: '장바구니 이탈률, A/B 테스트, 와이어프레임을 5장 규격 카드로 정리'
    },
    {
      id: 'developer-star',
      title: '개발자 (백엔드/풀스택)',
      subtitle: 'TPS 12,000건 대용량 시스템 STAR',
      color: 'bg-[#2EB0A6]',
      textColor: 'text-white',
      badge: '개발자',
      desc: 'Kafka, Elasticsearch, 쿼리 응답속도 120ms 단축 성과 시각화'
    },
    {
      id: 'designer-system',
      title: 'UI/UX 디자이너',
      subtitle: 'Figma 디자인 시스템 시각적 표지',
      color: 'bg-[#FF4D8B]',
      textColor: 'text-white',
      badge: '디자인',
      desc: '컴포넌트 스토리북 120종 및 Before/After 화면 슬라이더 배치'
    },
    {
      id: 'marketer-roas',
      title: '퍼포먼스 마케터',
      subtitle: 'ROAS 450% 경신 & 숏폼 지표',
      color: 'bg-[#FFB084]',
      textColor: 'text-slate-900',
      badge: '마케팅',
      desc: 'Meta Ads, CAC 감축, 3초 후킹 카피 A/B 테스트 정량 성과'
    },
    {
      id: 'career-resume',
      title: '경력 이력서 웹 전환',
      subtitle: '텍스트 나열 이력서 -> 웹 벤토 갤러리',
      color: 'bg-[#E8B94A]',
      textColor: 'text-slate-900',
      badge: '경력자',
      desc: '수년 간 쌓인 이력서 텍스트를 원클릭으로 웹 시각화 표지로 변환'
    },
    {
      id: 'jd-matching-quick',
      title: '채용 공고 (JD) 맞춤',
      subtitle: '목표 기업 공고 기반 대표 3개 선별',
      color: 'bg-[#A4D4C5]',
      textColor: 'text-slate-900',
      badge: '공고 맞춤',
      desc: '지원 회사 JD를 입력하여 필수 요구 키워드를 포함한 프로젝트 추천'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Hero Banner with Smiling Cat */}
      <div className="bg-[#FFF2E8] border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0A0A0A] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-1 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A] shrink-0">
              <SmilingCatMascot
                size="lg"
                style={profile.catPersona.style}
                primaryColor={profile.catPersona.primaryColor}
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2EB0A6] text-white text-xs font-black rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#0A0A0A] mb-2">
                <Sparkles className="w-3.5 h-3.5" /> 포트폴리오너도해 대시보드
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                반가워, <span className="text-[#2EB0A6]">{profile.name}</span>님! 🐾
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1 max-w-xl">
                "{profile.catPersona.slogan}"
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={onAddBlockModal}
              className="px-4 py-2.5 bg-white text-slate-900 font-black text-xs sm:text-sm rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#0A0A0A] transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#2EB0A6]" /> 새 경험 블록 추가
            </button>

            <button
              onClick={() => onNavigateTab('builder')}
              className="px-5 py-2.5 bg-[#2EB0A6] text-white font-black text-xs sm:text-sm rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#0A0A0A] transition-all flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" /> 포트폴리오 빌더 실행 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">총 경험 블록</span>
            <FolderKanban className="w-4 h-4 text-[#2EB0A6]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalBlocks}개</div>
          <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
            노션 표 스펙 폼 보관
          </span>
        </div>

        {/* Stat 2 */}
        <div className="p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">대표 선택 프로젝트</span>
            <CheckCircle2 className="w-4 h-4 text-[#FF4D8B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {selectedCount} <span className="text-sm font-bold text-slate-500">/ 3개</span>
          </div>
          <span className="text-[11px] font-semibold text-[#FF4D8B] mt-1 block">
            {selectedCount === 3 ? '대표 3개선정 완료!' : '대표 프로젝트 3개 선정 필요'}
          </span>
        </div>

        {/* Stat 3 */}
        <div className="p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">대외비 마스킹</span>
            <EyeOff className="w-4 h-4 text-[#B8A4ED]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{maskedCount}개</div>
          <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
            원클릭 보안 적용 중
          </span>
        </div>

        {/* Stat 4 */}
        <div className="p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">JD 매칭 진단</span>
            <BrainCircuit className="w-4 h-4 text-[#FFB084]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">85%</div>
          <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
            target JD 추천 준비 완료
          </span>
        </div>
      </div>

      {/* 6 Onboarding Branch Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">맞춤 온보딩 진입 경로 (Branch Matrix)</h3>
            <p className="text-xs text-slate-600 font-semibold">
              본인의 직업 상황 및 직군에 맞는 가이드를 선택하여 포트폴리오 작성을 시작하세요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {onboardingBranches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => onSelectBranchPath(branch.id)}
              className="p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0A0A0A] transition-all text-left flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 text-xs font-black rounded-lg border border-slate-900 ${branch.color} ${branch.textColor}`}>
                    {branch.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-black text-slate-900 text-base mb-1">{branch.title}</h4>
                <p className="text-xs font-bold text-[#238C84] mb-2">{branch.subtitle}</p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{branch.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline / Recent Experience Blocks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">최근 경험 블록 타임라인</h3>
            <p className="text-xs text-slate-600 font-semibold">
              노션 표 스펙 양식으로 정돈된 경험 블록들입니다.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('vault')}
            className="text-xs font-bold text-[#2EB0A6] hover:underline"
          >
            경험 보관함 전체보기 →
          </button>
        </div>

        <div className="space-y-3">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="p-4 sm:p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#FFF2E8] border-2 border-slate-900 rounded-xl text-slate-900 shrink-0 mt-0.5">
                  <Layers className="w-5 h-5 text-[#2EB0A6]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-extrabold text-xs text-slate-500 uppercase">
                      [{block.jobCategory.toUpperCase()}]
                    </span>
                    <span className="font-black text-sm text-slate-900">
                      {block.notionSpec.projectName}
                    </span>
                    {block.selectedForPortfolio && (
                      <span className="px-2 py-0.5 bg-[#FF4D8B] text-white font-extrabold text-[10px] rounded-full border border-slate-900">
                        대표 3개 선정
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {block.notionSpec.company} · {block.notionSpec.role} · 기여도 {block.notionSpec.contributionRate}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {block.notionSpec.period}
                </span>
                <button
                  onClick={() => onNavigateTab('vault')}
                  className="px-3 py-1.5 bg-[#FFFAF0] text-slate-900 font-bold text-xs rounded-xl border border-slate-900 hover:bg-slate-100"
                >
                  수정 / 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
