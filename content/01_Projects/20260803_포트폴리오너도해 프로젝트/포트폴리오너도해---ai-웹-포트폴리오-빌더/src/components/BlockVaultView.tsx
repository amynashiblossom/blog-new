import React, { useState } from 'react';
import { ExperienceBlock, JobCategory, NotionTableSpec, FiveCardStructure } from '../types';
import { ImageDragDropZone } from './ImageDragDropZone';
import { RecommendedSlideView } from './RecommendedSlideView';
import {
  Plus,
  Search,
  Filter,
  EyeOff,
  CheckCircle2,
  Trash2,
  Edit3,
  Wand2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  X,
  Layers,
  HelpCircle,
  AlertTriangle,
  Upload,
  Image
} from 'lucide-react';

interface BlockVaultViewProps {
  blocks: ExperienceBlock[];
  selectedCategory: JobCategory;
  onAddBlock: (block: ExperienceBlock) => void;
  onUpdateBlock: (block: ExperienceBlock) => void;
  onDeleteBlock: (id: string) => void;
  onToggleTop3: (id: string) => void;
  isAddModalOpenInitially?: boolean;
}

export const BlockVaultView: React.FC<BlockVaultViewProps> = ({
  blocks,
  selectedCategory,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onToggleTop3,
  isAddModalOpenInitially = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially);
  const [editingBlock, setEditingBlock] = useState<ExperienceBlock | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<JobCategory>(selectedCategory);
  const [projectName, setProjectName] = useState('');
  const [client, setClient] = useState('');
  const [company, setCompany] = useState('');
  const [period, setPeriod] = useState('');
  const [contributionRate, setContributionRate] = useState<number>(80);
  const [role, setRole] = useState('');
  const [keyOutcome, setKeyOutcome] = useState('');

  // STAR State
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');

  // 5 Card extra state
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80');
  const [beforeImageUrl, setBeforeImageUrl] = useState('');
  const [afterImageUrl, setAfterImageUrl] = useState('');
  const [beforeTitle, setBeforeTitle] = useState('개편 전 (Existing UI)');
  const [afterTitle, setAfterTitle] = useState('개편 후 (Redesigned UI)');
  const [tagline, setTagline] = useState('');
  const [problemDef, setProblemDef] = useState('');
  const [metric1Label, setMetric1Label] = useState('핵심 지표 개선율');
  const [metric1Val, setMetric1Val] = useState('+28.4%');
  const [isMasked, setIsMasked] = useState(false);
  const [demoUrl, setDemoUrl] = useState('');

  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [rawTextForAi, setRawTextForAi] = useState('');
  const [aiMaskingAlert, setAiMaskingAlert] = useState<string | null>(null);

  // Handle local file upload to Base64
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageState: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하를 권장합니다.');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageState(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setEditingBlock(null);
    setFormCategory(selectedCategory);
    setProjectName('');
    setClient('');
    setCompany('');
    setPeriod('');
    setContributionRate(80);
    setRole('');
    setKeyOutcome('');
    setSituation('');
    setTask('');
    setAction('');
    setResult('');
    setThumbnailUrl('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80');
    setBeforeImageUrl('');
    setAfterImageUrl('');
    setBeforeTitle('개편 전 (Existing UI)');
    setAfterTitle('개편 후 (Redesigned UI)');
    setTagline('');
    setProblemDef('');
    setIsMasked(false);
    setDemoUrl('');
    setRawTextForAi('');
    setAiMaskingAlert(null);
    setIsModalOpen(true);
  };

  const openEditModal = (b: ExperienceBlock) => {
    setEditingBlock(b);
    setFormCategory(b.jobCategory);
    setProjectName(b.notionSpec.projectName);
    setClient(b.notionSpec.client);
    setCompany(b.notionSpec.company);
    setPeriod(b.notionSpec.period);
    setContributionRate(b.notionSpec.contributionRate);
    setRole(b.notionSpec.role);
    setKeyOutcome(b.notionSpec.keyOutcome);
    setSituation(b.star.situation);
    setTask(b.star.task);
    setAction(b.star.action);
    setResult(b.star.result);
    setThumbnailUrl(b.fiveCards.card1_cover.thumbnailUrl);
    setBeforeImageUrl(b.fiveCards.card5_impact.beforeAfter?.beforeImageUrl || '');
    setAfterImageUrl(b.fiveCards.card5_impact.beforeAfter?.afterImageUrl || '');
    setBeforeTitle(b.fiveCards.card5_impact.beforeAfter?.beforeTitle || '개편 전 (Existing UI)');
    setAfterTitle(b.fiveCards.card5_impact.beforeAfter?.afterTitle || '개편 후 (Redesigned UI)');
    setTagline(b.fiveCards.card1_cover.tagline);
    setProblemDef(b.fiveCards.card2_research.problemDefinition);
    setIsMasked(b.isMasked);
    setDemoUrl(b.demoUrl || '');
    setAiMaskingAlert(null);
    setIsModalOpen(true);
  };

  // Run AI Refine
  const handleAiRefine = async () => {
    if (!rawTextForAi.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/refine-star', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: rawTextForAi, jobCategory: formCategory }),
      });
      const data = await res.json();
      if (data.notionSpec) {
        setProjectName(data.notionSpec.projectName || projectName);
        setClient(data.notionSpec.client || client);
        setCompany(data.notionSpec.company || company);
        setPeriod(data.notionSpec.period || period);
        setContributionRate(data.notionSpec.contributionRate || contributionRate);
        setRole(data.notionSpec.role || role);
        setKeyOutcome(data.notionSpec.keyOutcome || keyOutcome);
      }
      if (data.star) {
        setSituation(data.star.situation || situation);
        setTask(data.star.task || task);
        setAction(data.star.action || action);
        setResult(data.star.result || result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Run AI Real-time Masking Scan
  const handleScanMasking = async () => {
    const combinedText = `${projectName} ${client} ${company} ${keyOutcome} ${result}`;
    try {
      const res = await fetch('/api/ai/suggest-masking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: combinedText, projectTitle: projectName }),
      });
      const data = await res.json();
      if (data.hasSensitiveData) {
        setAiMaskingAlert(`[보안 감지] ${data.detectedItems?.join(', ')} 정보가 감지되었습니다. 원클릭 대외비 마스킹을 적용하세요.`);
        setIsMasked(true);
      } else {
        setAiMaskingAlert('안전합니다: 대외비 특수 기밀 수치가 감지되지 않았습니다.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = () => {
    if (!projectName.trim()) return;

    const newNotionSpec: NotionTableSpec = {
      projectName,
      client: client || '자사 주관',
      company: company || '회사 / 조직',
      period: period || '2025.01 ~ 2025.06',
      contributionRate,
      role: role || '담당자',
      keyOutcome: keyOutcome || '핵심 성과 달성',
    };

    const newFiveCards: FiveCardStructure = {
      card1_cover: {
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        keyVisualDescription: `${projectName} 핵심 인터페이스 및 결과물`,
        tagline: tagline || `${projectName} 성과 중심 프로세스 개편`
      },
      card2_research: {
        context: situation || '기존 서비스의 비효율 및 지표 저하 현상이 발생하여 개편 착수.',
        targetUser: '주요 서비스 타깃 유저',
        problemDefinition: problemDef || task || '핵심 유저 경험 및 프로세스의 병목',
        hypothesis: '신규 솔루션 및 아키텍처 적용 시 전환율 및 효율성이 상승할 것이다.'
      },
      card3_solutionAction1: {
        title: `Action 1: ${role || '주요 과제'} 솔루션 실행`,
        actionDetail: action || '핵심 기능 개발 및 실행 총괄',
        techOrFrameworkUsed: 'Agile, Figma, React, TypeScript'
      },
      card4_solutionAction2: {
        title: 'Action 2: 성능 및 프로세스 최적화',
        actionDetail: '운영 프로세스 효율화 및 팀 소통 스펙 싱크',
        keyDecisionPoint: '최단 기간 내 배포를 위한 가성비 높은 기능 우선순위 선정'
      },
      card5_impact: {
        quantitativeMetrics: [
          { label: metric1Label, value: metric1Val, changePercentage: '+25%' },
          { label: '주요 성과', value: keyOutcome, changePercentage: '달성' }
        ],
        beforeAfter: (beforeImageUrl || afterImageUrl) ? {
          beforeTitle: beforeTitle || '개편 전',
          beforeDescription: '기존 프로세스 / 병목 화면',
          afterTitle: afterTitle || '개편 후',
          afterDescription: '개선된 UX / 주요 성과 화면',
          beforeImageUrl,
          afterImageUrl
        } : undefined,
        qualitativeFeedback: result || '조직 내 우수 프로젝트 사례로 선정되어 대표이사 포상 수여.'
      }
    };

    if (editingBlock) {
      const updated: ExperienceBlock = {
        ...editingBlock,
        jobCategory: formCategory,
        notionSpec: newNotionSpec,
        fiveCards: newFiveCards,
        star: { situation, task, action, result },
        isMasked,
        demoUrl,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onUpdateBlock(updated);
    } else {
      const created: ExperienceBlock = {
        id: `block-${Date.now()}`,
        jobCategory: formCategory,
        notionSpec: newNotionSpec,
        fiveCards: newFiveCards,
        star: { situation, task, action, result },
        skills: ['Agile', 'STAR', 'SpecForm'],
        isMasked,
        demoUrl,
        selectedForPortfolio: blocks.filter((b) => b.selectedForPortfolio).length < 3,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      onAddBlock(created);
    }

    setIsModalOpen(false);
  };

  const filteredBlocks = blocks.filter((b) => {
    const matchesSearch =
      b.notionSpec.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.notionSpec.keyOutcome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || b.jobCategory === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2EB0A6] text-white text-xs font-black rounded-full border border-slate-900 mb-1">
            <Layers className="w-3.5 h-3.5" /> 경험 보관함 (Experience Vault)
          </div>
          <h2 className="text-2xl font-black text-slate-900">노션 표 스펙 폼 & 경험 데이터베이스</h2>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            `프로젝트명 : 발주처 : 근무처 : 기간 : 기여도 : 역할 : 주요성과` 로 내 경험을 구조화하세요.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#2EB0A6] text-white font-black text-xs sm:text-sm rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#0A0A0A] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> 새 경험 블록 작성하기
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="프로젝트명, 주요성과 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {['all', 'pm', 'dev', 'design', 'marketing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all border ${
                categoryFilter === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_#2EB0A6]'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? '전체' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Block Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBlocks.map((block) => {
          return (
            <div
              key={block.id}
              className={`p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-[5px_5px_0px_0px_#0A0A0A] relative flex flex-col justify-between transition-all ${
                block.selectedForPortfolio ? 'ring-2 ring-[#FF4D8B]' : ''
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#2EB0A6] text-white font-extrabold text-[11px] rounded-lg border border-slate-900 uppercase">
                      {block.jobCategory}
                    </span>
                    {block.isMasked && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-md border border-amber-300 flex items-center gap-1">
                        <EyeOff className="w-3 h-3 text-amber-700" /> 대외비 마스킹
                      </span>
                    )}
                  </div>

                  {/* Top 3 Toggle Checkbox */}
                  <button
                    onClick={() => onToggleTop3(block.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
                      block.selectedForPortfolio
                        ? 'bg-[#FF4D8B] text-white border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A]'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:border-slate-900'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {block.selectedForPortfolio ? '대표 3개 선정됨' : '대표 3개에 포함'}
                  </button>
                </div>

                {/* Title */}
                <h3 className="font-black text-slate-900 text-base mb-2">
                  {block.notionSpec.projectName}
                </h3>

                {/* Notion Spec Table Box */}
                <div className="p-3 bg-[#FFFAF0] border-2 border-slate-900 rounded-xl text-xs space-y-1.5 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 font-bold">발주처:</span>{' '}
                      <span className="font-extrabold text-slate-900">{block.notionSpec.client}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold">근무처:</span>{' '}
                      <span className="font-extrabold text-slate-900">{block.notionSpec.company}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 font-bold">기간:</span>{' '}
                      <span className="font-extrabold text-slate-900">{block.notionSpec.period}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold">기여도:</span>{' '}
                      <span className="font-black text-[#238C84]">{block.notionSpec.contributionRate}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">참여역할:</span>{' '}
                    <span className="font-extrabold text-slate-900">{block.notionSpec.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">주요성과:</span>{' '}
                    <span className="font-black text-slate-900">{block.notionSpec.keyOutcome}</span>
                  </div>
                </div>

                {/* STAR Brief */}
                <div className="text-xs text-slate-600 space-y-1 mb-4 font-medium">
                  <p><strong className="text-slate-900">Situation:</strong> {block.star.situation.slice(0, 60)}...</p>
                  <p><strong className="text-slate-900">Action:</strong> {block.star.action.slice(0, 60)}...</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-400">
                  {block.updatedAt} 수정됨
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(block)}
                    className="p-2 bg-slate-100 text-slate-800 rounded-xl border border-slate-300 hover:bg-slate-200 font-bold text-xs flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> 편집
                  </button>
                  <button
                    onClick={() => onDeleteBlock(block.id)}
                    className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-200 hover:bg-rose-100 font-bold text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notion Spec & STAR Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#FFFAF0] border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_#0A0A0A] max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 bg-white border-2 border-slate-900 rounded-full hover:bg-rose-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-800" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              {editingBlock ? '경험 블록 수정' : '새 경험 블록 추가'} (노션 표 스펙 폼)
            </h3>
            <p className="text-xs text-slate-600 font-semibold mb-6">
              IT 표준 `프로젝트명 : 발주처 : 근무처 : 기간 : 기여도 : 참여역할 : 주요성과` 양식 입력
            </p>

            {/* AI Assistant Quick Generator Input */}
            <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A] mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#2EB0A6]" />
                <h4 className="font-black text-xs sm:text-sm text-slate-900">AI 스마트 입력 도우미</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#B8A4ED] text-slate-900 rounded-full">Gemini AI</span>
              </div>
              <textarea
                rows={2}
                placeholder="자유로운 메모나 이전 이력서를 그대로 붙여넣고 [AI 노션표 변환]을 눌러보세요..."
                value={rawTextForAi}
                onChange={(e) => setRawTextForAi(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white mb-2"
              />
              <button
                onClick={handleAiRefine}
                disabled={isAiLoading || !rawTextForAi.trim()}
                className="px-4 py-2 bg-[#2EB0A6] text-white font-extrabold text-xs rounded-xl border border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] disabled:opacity-50 flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                {isAiLoading ? 'AI가 노션 표 스펙 구조화 중...' : 'AI 노션 표 스펙으로 자동 구조화'}
              </button>
            </div>

            {/* Form Fields Grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">직군 분류</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as JobCategory)}
                    className="w-full p-2.5 bg-white border-2 border-slate-900 rounded-xl text-xs font-extrabold text-slate-900"
                  >
                    <option value="pm">기획 / PM (Product Manager)</option>
                    <option value="dev">개발 (Software Engineer)</option>
                    <option value="design">디자인 (UI/UX Design)</option>
                    <option value="marketing">마케팅 (Performance & Growth)</option>
                    <option value="general">기타 / 공통</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">프로젝트명 *</label>
                  <input
                    type="text"
                    placeholder="예: 커머스 결제 이탈률 개선 및 UX 개편"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full p-2.5 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Notion Table Spec Items */}
              <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A] space-y-3">
                <h4 className="font-extrabold text-xs text-slate-700">노션 표 메타 항목 (Notion Spec Metadata)</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">발주처 / 클라이언트</label>
                    <input
                      type="text"
                      placeholder="예: 자사 서비스 (B2C)"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">근무처 / 소속</label>
                    <input
                      type="text"
                      placeholder="예: (주)너도컴퍼니"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">기간</label>
                    <input
                      type="text"
                      placeholder="예: 2025.02 ~ 2025.07 (6개월)"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">참여 기여도 (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={contributionRate}
                      onChange={(e) => setContributionRate(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">참여 역할</label>
                    <input
                      type="text"
                      placeholder="예: 리드 PM / PO"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">주요 성과 요약</label>
                    <input
                      type="text"
                      placeholder="예: 결제 이탈률 42% -> 24% 감소"
                      value={keyOutcome}
                      onChange={(e) => setKeyOutcome(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* STAR Framework Inputs */}
              <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A] space-y-3">
                <h4 className="font-extrabold text-xs text-slate-700">STAR 구조화 (Situation, Task, Action, Result)</h4>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Situation (배경 및 위기 상황)</label>
                  <textarea
                    rows={2}
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="프로젝트 시작 당시의 문제와 배경..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Action (주요 시도 및 본인의 핵심 기여)</label>
                  <textarea
                    rows={2}
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    placeholder="문제를 해결하기 위해 어떤 액션을 취했는지 상세히 기재..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Result (정량 수치 및 정성 결과)</label>
                  <textarea
                    rows={2}
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="최종 달성한 수치 및 조직 변화..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>

              {/* Visual Assets Direct Drag & Drop Upload Panel */}
              <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-[#2EB0A6]" />
                    <h4 className="font-extrabold text-xs text-slate-900">
                      추천 장표 시각화 자료 직접 업로드 (드래그 앤 드롭)
                    </h4>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#FFF2E8] text-slate-800 rounded-md border border-slate-900">
                    이미지 파일 끌어다 놓기 가능
                  </span>
                </div>

                {/* 1. Drag & Drop Zone for Main Visualization / Cover Slide Image */}
                <div className="space-y-3">
                  <ImageDragDropZone
                    label="1. 메인 시각화 자료 (메인 타이틀/설명 장표에 표시)"
                    subLabel="추천 장표 하단 메인 이미지로 표시됩니다"
                    imageUrl={thumbnailUrl}
                    onImageChange={(url) => setThumbnailUrl(url)}
                    placeholderText="시각화 장표 이미지를 끌어다 업로드하세요 (또는 클릭)"
                  />

                  {/* Text URL Option */}
                  <input
                    type="text"
                    placeholder="또는 시각화 이미지 웹 URL 입력..."
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                {/* 2. Before / After Comparison Drag & Drop Zones */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <span className="block text-[11px] font-bold text-slate-700">
                    2. Before / After UX 비교 시각화 (선택 입력)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Before Box */}
                    <div className="p-3 bg-rose-50/50 border-2 border-rose-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-rose-700">🔴 개편 전 (Before)</span>
                      </div>

                      <input
                        type="text"
                        placeholder="라벨 (예: 사용성 평가 전 기존 UI)"
                        value={beforeTitle}
                        onChange={(e) => setBeforeTitle(e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                      />

                      <ImageDragDropZone
                        label=""
                        imageUrl={beforeImageUrl}
                        onImageChange={(url) => setBeforeImageUrl(url)}
                        aspectRatio="video"
                        placeholderText="개편 전 이미지를 이 곳에 끌어놓으세요"
                      />
                    </div>

                    {/* After Box */}
                    <div className="p-3 bg-emerald-50/50 border-2 border-emerald-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-emerald-800">🟢 개편 후 (After)</span>
                      </div>

                      <input
                        type="text"
                        placeholder="라벨 (예: 과업 완료 시간 30% 단축 UX)"
                        value={afterTitle}
                        onChange={(e) => setAfterTitle(e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                      />

                      <ImageDragDropZone
                        label=""
                        imageUrl={afterImageUrl}
                        onImageChange={(url) => setAfterImageUrl(url)}
                        aspectRatio="video"
                        placeholderText="개편 후 이미지를 이 곳에 끌어놓으세요"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Live Preview of the Recommended Slide Layout right inside Modal */}
                <div className="pt-3 border-t-2 border-slate-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#FF4D8B]" />
                      실시간 추천 장표 미리보기 (Slide Preview)
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      상단 메인 타이틀 + 설명 + 하단 시각화 구조
                    </span>
                  </div>

                  <RecommendedSlideView
                    mainTitle={role || '사용성 평가'}
                    headline={keyOutcome || '과업 완료 시간 30% 단축'}
                    subDescription={tagline || problemDef || 'MVP 인터페이스 비교 평가 결과 및 사용성 20% 향상'}
                    imageUrl={thumbnailUrl}
                    beforeImageUrl={beforeImageUrl}
                    afterImageUrl={afterImageUrl}
                    beforeTitle={beforeTitle}
                    afterTitle={afterTitle}
                    metrics={[
                      { label: metric1Label || '완료 시간', value: metric1Val || '-30%', changePercentage: '단축' },
                      { label: '핵심 성과', value: keyOutcome || '만족도 4.2점', changePercentage: '달성' }
                    ]}
                  />
                </div>
              </div>

              {/* Real-time Extracted Keyword Preview Bar */}
              <div className="p-4 bg-[#FFF2E8] border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2EB0A6]" /> 내가 작성한 내용 기반 AI 도출 키워드 시각화
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">실시간 추출 중</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    projectName && projectName,
                    role && role,
                    keyOutcome && keyOutcome,
                    ...((action + ' ' + result).match(/(\d+%|\d+억|\d+만|Agile|Figma|React|TypeScript|SQL|GA4|Mixpanel|A\/B테스트|CVR|이탈률|개선|상승)/gi) || [])
                  ]
                    .filter(Boolean)
                    .slice(0, 8)
                    .map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white text-slate-900 font-extrabold text-[11px] rounded-lg border border-slate-900 shadow-[1px_1px_0px_0px_#0A0A0A]"
                      >
                        ⚡ {kw}
                      </span>
                    ))}
                  {(!projectName && !keyOutcome && !action) && (
                    <span className="text-[11px] font-medium text-slate-500 italic">
                      위 입력란에 프로젝트 내용, 성과, Action을 입력하면 AI 키워드가 실시간 시각화됩니다.
                    </span>
                  )}
                </div>
              </div>

              {/* Confidential Security Masking Panel */}
              <div className="p-4 bg-amber-50 border-2 border-slate-900 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                  <div>
                    <h5 className="font-black text-xs text-slate-900">대외비 & 영업비밀 실시간 마스킹</h5>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      매출 수치, 내부 매출액을 외부 발행 시 `[대외비]`로 자동 블러 처리
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleScanMasking}
                    className="px-3 py-1.5 bg-white text-slate-900 font-extrabold text-xs rounded-xl border border-slate-900 shadow-[1px_1px_0px_0px_#0A0A0A]"
                  >
                    대외비 감지 스캔
                  </button>

                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-900">
                    <input
                      type="checkbox"
                      checked={isMasked}
                      onChange={(e) => setIsMasked(e.target.checked)}
                      className="w-4 h-4 text-[#2EB0A6] rounded focus:ring-0"
                    />
                    <span>마스킹 ON</span>
                  </label>
                </div>
              </div>

              {aiMaskingAlert && (
                <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>{aiMaskingAlert}</span>
                </div>
              )}
            </div>

            {/* Modal Bottom Save */}
            <div className="mt-6 pt-4 border-t-2 border-slate-900 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-white text-slate-800 font-bold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A]"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-[#2EB0A6] text-white font-black text-xs sm:text-sm rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#0A0A0A] transition-all"
              >
                경험 블록 저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
