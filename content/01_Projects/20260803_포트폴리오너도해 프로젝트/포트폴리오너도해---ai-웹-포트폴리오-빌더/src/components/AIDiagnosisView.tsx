import React, { useState, useMemo } from 'react';
import { JobCategory, ExperienceBlock, JDAnalysisResult, ExtractedKeyword } from '../types';
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Wand2,
  FileSearch,
  Check,
  Tag,
  Layers,
  BarChart3,
  Search,
  Eye
} from 'lucide-react';

interface AIDiagnosisViewProps {
  selectedCategory: JobCategory;
  blocks: ExperienceBlock[];
  onApplyTailoredSlogan: (slogan: string) => void;
}

export const AIDiagnosisView: React.FC<AIDiagnosisViewProps> = ({
  selectedCategory,
  blocks,
  onApplyTailoredSlogan,
}) => {
  const [jdText, setJdText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<JDAnalysisResult | null>(null);
  const [copiedSlogan, setCopiedSlogan] = useState(false);
  const [selectedKeywordCategory, setSelectedKeywordCategory] = useState<string>('all');
  const [inspectBlockId, setInspectBlockId] = useState<string>(blocks[0]?.id || '');

  const sampleJdText = `[모집 직무: 핀테크/커머스 리드 서비스 기획자 (PM/PO)]
- 자격 요건:
  1. B2C 또는 B2B 서비스 기획 및 관리 경력 2년 이상
  2. 유저 데이터 분석(Mixpanel, Amplitude, GA4)에 기반한 문제 정의 및 가설 검증 경험
  3. 결제/주문/온보딩 퍼널 CVR 개선 및 이탈률 감소 성과 보유자
  4. Agile/Scrum 환경에서 개발자 및 디자이너와 원활한 스펙 소통 능력
- 우대 사항:
  - A/B 테스트 설계 및 통계적 유의성 검증 경험자
  - 원클릭 결제 및 결제 지연 타임아웃 장애 해결 경험 우대`;

  // Local extraction directly from blocks if analysisResult hasn't run yet
  const localExtractedKeywords = useMemo<ExtractedKeyword[]>(() => {
    const keywords: ExtractedKeyword[] = [];
    const jdUpper = jdText.toUpperCase();

    blocks.forEach((b) => {
      const pTitle = b.notionSpec?.projectName || '프로젝트';
      const text = `
        ${pTitle} ${b.notionSpec?.role} ${b.notionSpec?.keyOutcome}
        ${b.star?.situation} ${b.star?.task} ${b.star?.action} ${b.star?.result}
        ${(b.skills || []).join(' ')}
      `;

      // Match tech & frameworks
      const techTerms = ['Agile', 'Scrum', 'Figma', 'React', 'TypeScript', 'Python', 'SQL', 'A/B 테스트', 'GA4', 'Mixpanel', 'Amplitude', 'Notion', 'Slack', 'Jira', 'CVR', '이탈률', '결제 퍼널', 'Design System'];
      techTerms.forEach((term) => {
        if (text.toLowerCase().includes(term.toLowerCase())) {
          keywords.push({
            keyword: term,
            sourceProjectTitle: pTitle,
            category: term.includes('CVR') || term.includes('이탈률') ? 'metric' : 'tech',
            isMatchedWithJD: jdText.trim() !== '' && jdUpper.includes(term.toUpperCase()),
            frequency: 1,
          });
        }
      });

      // Match quantitative outcomes
      if (b.notionSpec?.keyOutcome) {
        const matches = b.notionSpec.keyOutcome.match(/(\d+%|\d+억|\d+만|CVR|이탈률|상승|개선|감소)/g);
        if (matches) {
          matches.forEach((m) => {
            keywords.push({
              keyword: `${m} (${b.notionSpec.keyOutcome.slice(0, 15)}...)`,
              sourceProjectTitle: pTitle,
              category: 'metric',
              isMatchedWithJD: jdText.trim() !== '' && jdUpper.includes(m.toUpperCase()),
              frequency: 1,
            });
          });
        }
      }
    });

    // Deduplicate
    const unique = new Map<string, ExtractedKeyword>();
    keywords.forEach((k) => {
      const key = `${k.keyword}_${k.sourceProjectTitle}`;
      if (!unique.has(key)) unique.set(key, k);
    });
    return Array.from(unique.values());
  }, [blocks, jdText]);

  const activeKeywords = analysisResult?.extractedUserKeywords || localExtractedKeywords;

  const filteredKeywords = useMemo(() => {
    if (selectedKeywordCategory === 'all') return activeKeywords;
    return activeKeywords.filter((k) => k.category === selectedKeywordCategory);
  }, [activeKeywords, selectedKeywordCategory]);

  const inspectedBlock = useMemo(() => {
    return blocks.find((b) => b.id === inspectBlockId) || blocks[0];
  }, [blocks, inspectBlockId]);

  const handleRunAnalysis = async () => {
    if (!jdText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: jdText,
          jobCategory: selectedCategory,
          experienceBlocks: blocks,
        }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_#0A0A0A]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2EB0A6] text-white text-xs font-black rounded-full border border-slate-900 shadow-[1px_1px_0px_0px_#0A0A0A] mb-2">
          <BrainCircuit className="w-3.5 h-3.5" /> AI 경험 데이터 키워드 추출 & 공고(JD) 매칭
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          작성한 경험 원문 기반 AI 키워드 시각화 & 공고 진단
        </h2>
        <p className="text-xs text-slate-600 font-semibold mt-1">
          사용자가 실제로 작성한 노션 표 스펙 및 STAR 문장에서 핵심 역량·성과 키워드를 도출하고, 목표 채용 공고(JD)와의 매칭률을 시각화합니다.
        </p>
      </div>

      {/* Visualized Keywords extracted directly from user's written text */}
      <div className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_#0A0A0A] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2EB0A6]" />
              <h3 className="text-lg font-black text-slate-900">
                실제 작성 내용 기반 AI 도출 키워드 맵
              </h3>
              <span className="px-2.5 py-0.5 bg-[#FFF2E8] text-slate-900 font-extrabold text-xs rounded-full border border-slate-900">
                총 {activeKeywords.length}개 키워드 도출됨
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              각 키워드 칩에는 출처가 된 프로젝트명과 부합 여부가 태그로 표시됩니다.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: '전체' },
              { id: 'tech', label: '기술/도구' },
              { id: 'metric', label: '정량 성과' },
              { id: 'domain', label: '직무/도메인' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedKeywordCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
                  selectedKeywordCategory === tab.id
                    ? 'bg-[#2EB0A6] text-white border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A]'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Keyword Chips Cloud */}
        {filteredKeywords.length === 0 ? (
          <div className="p-8 text-center text-xs font-bold text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            작성하신 경험 블록에서 추출된 해당 분류 키워드가 없습니다.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 pt-2">
            {filteredKeywords.map((kw, idx) => {
              const categoryColors =
                kw.category === 'metric'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                  : kw.category === 'tech'
                  ? 'bg-sky-100 text-sky-900 border-sky-400'
                  : 'bg-purple-100 text-purple-900 border-purple-400';

              return (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-2xl border-2 text-xs font-black shadow-[2px_2px_0px_0px_#0A0A0A] flex flex-col gap-1 transition-transform hover:scale-105 ${categoryColors}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 opacity-70" />
                    <span>{kw.keyword}</span>
                    {kw.isMatchedWithJD && (
                      <span className="ml-1 px-1.5 py-0.5 bg-emerald-600 text-white text-[10px] rounded-md font-bold">
                        ✓ JD 부합
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold opacity-75 truncate max-w-[180px]">
                    📍 {kw.sourceProjectTitle}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Text Inspector: Highlight user's written text with extracted AI keywords */}
      {inspectedBlock && (
        <div className="p-6 bg-[#FFFAF0] border-2 border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_#0A0A0A] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#238C84]" />
              <div>
                <h3 className="text-base font-black text-slate-900">
                  작성 원문 텍스트 내 AI 키워드 시각화 검수
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  프로젝트를 선택하여 내가 적은 문장과 AI가 감지한 키워드를 확인하세요.
                </p>
              </div>
            </div>

            {/* Select Block Dropdown */}
            <select
              value={inspectBlockId}
              onChange={(e) => setInspectBlockId(e.target.value)}
              className="p-2 bg-white border-2 border-slate-900 rounded-xl text-xs font-black text-slate-900 max-w-xs"
            >
              {blocks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.notionSpec?.projectName}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#2EB0A6] uppercase">
                {inspectedBlock.jobCategory} · {inspectedBlock.notionSpec?.projectName}
              </span>
              <span className="text-xs font-extrabold text-slate-600">
                기여도 {inspectedBlock.notionSpec?.contributionRate}% | {inspectedBlock.notionSpec?.role}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs space-y-2">
              <p className="text-slate-800 font-semibold">
                <strong>💡 주요성과 요약:</strong> {inspectedBlock.notionSpec?.keyOutcome}
              </p>
              <p className="text-slate-700 font-medium">
                <strong>🎯 STAR Action:</strong> {inspectedBlock.star?.action}
              </p>
              <p className="text-slate-700 font-medium">
                <strong>📈 STAR Result:</strong> {inspectedBlock.star?.result}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input JD Section */}
      <div className="p-6 bg-[#FFFAF0] border-2 border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_#0A0A0A] space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-black text-slate-900 text-sm flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-[#2EB0A6]" /> 목표 채용 공고 (Job Description) 붙여넣기
          </label>
          <button
            onClick={() => setJdText(sampleJdText)}
            className="text-xs font-bold text-[#238C84] hover:underline"
          >
            샘플 공고 예시 채우기
          </button>
        </div>

        <textarea
          rows={5}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="지원하고자 하는 기업의 자격요건, 담당업무, 우대사항 텍스트를 그대로 붙여넣으세요..."
          className="w-full p-4 bg-white border-2 border-slate-900 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />

        <div className="flex justify-end">
          <button
            onClick={handleRunAnalysis}
            disabled={isLoading || !jdText.trim()}
            className="px-6 py-3 bg-[#2EB0A6] text-white font-black text-xs sm:text-sm rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#0A0A0A] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Gemini AI 공고 매칭 분석 중...' : 'AI 공고 매칭 진단 실행하기'}
          </button>
        </div>
      </div>

      {/* Diagnosis Results Section */}
      {analysisResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Score & Summary Banner */}
          <div className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_#0A0A0A] flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center justify-center p-6 bg-[#2EB0A6] text-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_#0A0A0A] shrink-0 w-36 h-36">
              <span className="text-3xl font-black">{analysisResult.matchScore}%</span>
              <span className="text-[11px] font-bold mt-1 text-emerald-100">JD 매칭 점수</span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 공고 매칭 결과 리포트
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                "작성하신 경험 내용과 채용 공고 간 부합도가 매우 높습니다!"
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {analysisResult.overallSummary}
              </p>
            </div>
          </div>

          {/* Keywords Matched vs Missing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Matched Keywords */}
            <div className="p-5 bg-emerald-50 border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
              <h4 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 내 작성글에서 도출 & 부합된 핵심 키워드
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white text-emerald-900 font-extrabold text-xs rounded-full border border-emerald-300 shadow-[1px_1px_0px_0px_#0A0A0A]"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords Report */}
            <div className="p-5 bg-rose-50 border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A]">
              <h4 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-1.5 text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600" /> 추가 보완 권장 키워드
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white text-rose-900 font-extrabold text-xs rounded-full border border-rose-300 shadow-[1px_1px_0px_0px_#0A0A0A]"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tailored Slogan Suggestion */}
          {analysisResult.tailoredSloganSuggestion && (
            <div className="p-5 bg-[#FFF2E8] border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_#0A0A0A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black text-slate-500 block mb-1">
                  💡 작성 성과 기반 공고 맞춤 추천 헤드라인 슬로건
                </span>
                <p className="font-black text-sm text-slate-900">
                  "{analysisResult.tailoredSloganSuggestion}"
                </p>
              </div>

              <button
                onClick={() => {
                  onApplyTailoredSlogan(analysisResult.tailoredSloganSuggestion);
                  setCopiedSlogan(true);
                  setTimeout(() => setCopiedSlogan(false), 2500);
                }}
                className="px-4 py-2 bg-[#2EB0A6] text-white font-extrabold text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] shrink-0 flex items-center gap-1.5"
              >
                {copiedSlogan ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                {copiedSlogan ? '프로필에 적용완료!' : '프로필 슬로건에 바로 적용'}
              </button>
            </div>
          )}

          {/* Block Recommendations */}
          <div className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_#0A0A0A] space-y-4">
            <h3 className="font-black text-slate-900 text-base">
              추천 프로젝트 & 서류 보완 가이드
            </h3>

            <div className="space-y-3">
              {analysisResult.recommendations.map((rec, i) => (
                <div key={i} className="p-4 bg-[#FFFAF0] border-2 border-slate-900 rounded-2xl text-xs space-y-1">
                  <span className="font-black text-slate-900 block text-sm">
                    프로젝트 추천 #{i + 1}
                  </span>
                  <p className="text-slate-700 font-medium"><strong>추천 이유:</strong> {rec.reason}</p>
                  <p className="text-[#238C84] font-extrabold"><strong>보완 가이드:</strong> {rec.suggestedEnhancement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
