import React, { useState } from 'react';
import { 
  X, 
  Link, 
  FileText, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Globe, 
  Building2, 
  Calendar, 
  Briefcase, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { JobPost } from '../types';

interface JobScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: Omit<JobPost, 'id' | 'scrapedAt'>) => void;
}

export const JobScraperModal: React.FC<JobScraperModalProps> = ({
  isOpen,
  onClose,
  onAddJob
}) => {
  const [tab, setTab] = useState<'text' | 'url'>('text');
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parsed Preview
  const [parsedData, setParsedData] = useState<Partial<JobPost> | null>(null);

  if (!isOpen) return null;

  const handlePresetTextSelect = (sampleText: string, sampleUrl: string) => {
    setRawText(sampleText);
    setUrl(sampleUrl);
    setTab('text');
    // Auto-trigger parse for convenience
    handleScrape(sampleUrl, sampleText);
  };

  const handleScrape = async (overrideUrl?: string, overrideText?: string) => {
    const targetUrl = overrideUrl !== undefined ? overrideUrl : url;
    const targetText = overrideText !== undefined ? overrideText : rawText;

    if (!targetUrl.trim() && !targetText.trim()) {
      setError('채용공고 URL 또는 공고 텍스트를 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setParsedData(null);

    try {
      const response = await fetch('/api/scrape-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl.trim(),
          rawText: targetText.trim()
        })
      });

      const resText = await response.text();
      let json: any = {};
      try {
        json = JSON.parse(resText);
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(`서버 응답 오류가 발생했습니다 (HTTP ${response.status}). Vercel 환경변수(GEMINI_API_KEY) 설정 및 서버 로그를 확인해 주세요.`);
        }
        throw new Error('응답 데이터를 파싱하지 못했습니다.');
      }

      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || `공고 파싱 처리 중 오류가 발생했습니다 (HTTP ${response.status}).`);
      }

      setParsedData(json.data);
    } catch (err: any) {
      setError(err.message || '공고 파싱 도중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!parsedData) return;

    onAddJob({
      companyName: parsedData.companyName || '새 스크랩 기업',
      title: parsedData.title || '채용공고',
      position: parsedData.position || '직무 미지정',
      status: 'interested',
      dueDate: parsedData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      tasks: parsedData.tasks || [],
      requirements: parsedData.requirements || [],
      preferred: parsedData.preferred || [],
      keywords: parsedData.keywords || [],
      originalUrl: parsedData.originalUrl || url || '',
      location: parsedData.location || '서울',
      salary: parsedData.salary || '채용 시 협의',
      rawText: parsedData.rawText || rawText || `[${parsedData.companyName || '스크랩 공고'}] ${parsedData.title || '채용공고'}

■ 주요 업무
${(parsedData.tasks || []).map(t => '- ' + t).join('\n')}

■ 자격 요건
${(parsedData.requirements || []).map(r => '- ' + r).join('\n')}

■ 우대 사항
${(parsedData.preferred || []).map(p => '- ' + p).join('\n')}`,
      memo: '스마트 URL 스크랩 완료. 원문 공고가 내려가더라도 아카이브에서 확인할 수 있습니다.'
    });

    // Reset and Close
    setUrl('');
    setRawText('');
    setParsedData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FFFDF7] w-full max-w-2xl rounded-2xl border border-[#EAE5DC] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#EAE5DC] bg-[#FAF5E8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2EB0A6] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0A0A0A]">커리어핏 - JD 텍스트 붙여넣기 스마트 스크랩</h2>
              <p className="text-xs text-[#6A6A6A]">공고 본문(JD)을 긁어와 붙여넣으면 Gemini AI가 핵심 역량, 마감일, 직무 분석을 진행합니다.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#6A6A6A] hover:text-[#0A0A0A] hover:bg-black/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">

          {/* Always Visible Recommendation Banner */}
          <div className="p-3.5 bg-[#FAF5E8] border-2 border-amber-300 rounded-xl text-xs font-bold text-amber-950 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-base">📌</span>
              <span>안정적인 공고 분석을 위해 <strong className="text-amber-900 underline underline-offset-2">JD 텍스트를 컴퓨터상에서 직접 긁어붙이시는 것을 추천드립니다!</strong></span>
            </div>
            {tab === 'url' && (
              <button
                onClick={() => setTab('text')}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-extrabold transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                텍스트 붙여넣기로 이동 ➔
              </button>
            )}
          </div>

          {/* Preset Buttons for Quick Testing */}
          <div className="bg-[#E6F7F5]/60 border border-[#2EB0A6]/30 p-3 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#2EB0A6]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 fill-current text-[#2EB0A6]" />
                <span>[1클릭 테스트] 원클릭 공고 스크랩 샘플:</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const sampleUrl = 'https://www.linkedin.com/jobs/view/4445699622/';
                  setUrl(sampleUrl);
                  setTab('url');
                  handleScrape(sampleUrl, '');
                }}
                className="px-2.5 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>링크드인 URL 스크랩 예시 (J&J MedTech)</span>
              </button>
              <button
                onClick={() => handlePresetTextSelect(
                  `[토스] 프론트엔드 엔지니어 (Frontend Engineer)
주요업무:
- 토스 앱 내 금융 서비스 웹뷰 및 대고객 프론트엔드 제품 개발
- React, TypeScript, Next.js 기반의 고성능 웹 애플리케이션 설계
- 디자인 시스템 및 공통 라이브러리 제작 및 라이브 서비스 성능 최적화
자격요건:
- React, TypeScript 개발 경력 3년 이상 또는 이에 준하는 역량
- 상태 관리 (Zustand, React Query 등) 및 웹 성능 최적화 경험
- 백엔드 개발자, 디자이너, PO와의 원활한 협업 능력
우대사항:
- 대규모 트래픽 서비스 운영 경험
- Web Vitals 최적화 및 Lighthouse 스코어 개선 경험
마감일: 2026-08-31`,
                  'https://toss.im/careers'
                )}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-[#2EB0A6]/40 hover:bg-[#2EB0A6] hover:text-white rounded-lg text-[#0A0A0A] transition-all shadow-xs cursor-pointer"
              >
                토스 FE 공고 붙여넣기
              </button>
              <button
                onClick={() => handlePresetTextSelect(
                  `[당근] 프로덕트 매니저 (Product Manager)
주요업무:
- 당근 중고거래 및 지역 커뮤니티 신규 기능 기획 및 유저 지표 분석
- A/B 테스트 설계 및 데이터 기반 사용자 경험 개선
- 엔지니어, 디자이너 스쿼드 리딩 및 로드맵 수립
자격요건:
- IT 프로덕트 PM/PO 경력 2년 이상
- SQL 분석 및 데이터 파이프라인 이해도 보유
우대사항:
- C2C 커머스 또는 수천만 MAU 서비스 경험
마감일: 2026-08-25`,
                  'https://team.daangn.com'
                )}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-[#2EB0A6]/40 hover:bg-[#2EB0A6] hover:text-white rounded-lg text-[#0A0A0A] transition-all shadow-xs cursor-pointer"
              >
                당근 PM 공고 붙여넣기
              </button>
              <button
                onClick={() => handlePresetTextSelect(
                  `[네이버] AI 모델링 / 데이터 엔지니어
주요업무:
- HyperCLOVA X 모델 튜닝 및 LLM 응용 서비스 개발
- Python, PyTorch, CUDA 기반 분산 학습 및 서빙 엔진 파이프라인
자격요건:
- PyTorch 및 MLOps 시스템 구축 경험
- LLM RAG 및 Prompt Engineering 경험자
마감일: 2026-09-10`,
                  'https://recruit.navercorp.com'
                )}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-[#2EB0A6]/40 hover:bg-[#2EB0A6] hover:text-white rounded-lg text-[#0A0A0A] transition-all shadow-xs cursor-pointer"
              >
                네이버 AI 공고 붙여넣기
              </button>
            </div>
          </div>

          {/* Input Tabs */}
          <div className="flex border-b border-[#EAE5DC]">
            <button
              onClick={() => setTab('text')}
              className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                tab === 'text'
                  ? 'border-[#2EB0A6] text-[#2EB0A6]'
                  : 'border-transparent text-[#6A6A6A] hover:text-[#0A0A0A]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>공고 텍스트(JD) 직접 붙여넣기 (추천 ⭐)</span>
            </button>
            <button
              onClick={() => setTab('url')}
              className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                tab === 'url'
                  ? 'border-[#2EB0A6] text-[#2EB0A6]'
                  : 'border-transparent text-[#6A6A6A] hover:text-[#0A0A0A]'
              }`}
            >
              <Link className="w-4 h-4" />
              <span>채용공고 URL 입력 (보조)</span>
            </button>
          </div>

          {/* Input Fields */}
          {tab === 'text' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#3A3A3A]">
                  채용 사이트에서 복사한 공고 내용(JD)을 붙여넣거나, 공고 파일(TXT, PDF)을 끌어다 놓으세요:
                </label>
                <span className="text-[11px] text-[#2EB0A6] font-medium">드래그 앤 드롭 지원</span>
              </div>
              <textarea
                rows={6}
                placeholder="채용 공고의 회사명, 주요 업무, 자격 요건, 우대 사항, 마감일 등의 텍스트를 복사하여 붙여넣거나 파일/텍스트를 끌어다 놓으세요..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        setRawText(ev.target.result as string);
                      }
                    };
                    reader.readAsText(file);
                  } else {
                    const text = e.dataTransfer.getData('text');
                    if (text) setRawText(text);
                  }
                }}
                className="w-full p-3.5 bg-white border border-[#EAE5DC] hover:border-[#2EB0A6] rounded-xl text-sm text-[#0A0A0A] focus:outline-none focus:border-[#2EB0A6] transition-colors resize-none shadow-inner"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleScrape()}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-[#2EB0A6] hover:bg-[#228B83] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Gemini AI 공고 자동 분석 시작</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Permanent Visible LinkedIn Guide Image Card */}
              <div className="bg-[#FAF5E8] border border-[#EAE5DC] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0A0A0A] flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#2EB0A6]" />
                    <span>LinkedIn 채용공고 [링크 복사] 가져오는 법 (상시 가이드)</span>
                  </span>
                  <button
                    onClick={() => {
                      setUrl('https://www.linkedin.com/jobs/view/4445699622/');
                    }}
                    className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-md font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    링크드인 예시 URL 채우기
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="relative rounded-lg overflow-hidden border border-[#EAE5DC] shadow-xs bg-white">
                    <img 
                      src="/linkedin-guide.png" 
                      alt="LinkedIn 링크 복사 가이드" 
                      className="w-full h-auto object-cover max-h-40"
                    />
                  </div>
                  <div className="space-y-1.5 text-xs text-[#3A3A3A]">
                    <p className="font-bold text-[#0A0A0A]">📋 링크 복사 2단계:</p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px]">
                      <li>공고 오른쪽 상단 <strong className="text-[#0A0A0A]">··· (더보기)</strong> 버튼 클릭</li>
                      <li>메뉴에서 <strong className="text-[#2EB0A6] bg-[#E6F7F5] px-1 py-0.5 rounded">🔗 링크 복사</strong> 클릭 후 아래에 붙여넣기</li>
                    </ol>
                    <p className="text-[10px] text-[#6A6A6A] pt-1">
                      * 취업 플랫폼 보안 정책에 따라 URL 분석 실패 시 <strong>'JD 텍스트 직접 붙여넣기'</strong>를 권장합니다.
                    </p>
                  </div>
                </div>
              </div>

              <label className="block text-xs font-semibold text-[#3A3A3A]">
                채용 사이트 URL:
              </label>
              <div className="relative">
                <Globe className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6A6A6A]" />
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/jobs/view/4445699622/ 또는 채용공고 URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                  className="w-full pl-10 pr-28 py-3 bg-white border border-[#EAE5DC] rounded-xl text-sm text-[#0A0A0A] focus:outline-none focus:border-[#2EB0A6] transition-colors shadow-xs"
                />
                <button
                  onClick={() => handleScrape()}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#2EB0A6] hover:bg-[#228B83] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>분석하기</span>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Loading Animation State */}
          {isLoading && (
            <div className="py-8 text-center bg-[#FAF5E8] rounded-xl border border-dashed border-[#2EB0A6]/40 animate-pulse">
              <Loader2 className="w-8 h-8 text-[#2EB0A6] animate-spin mx-auto mb-2" />
              <p className="text-sm font-bold text-[#0A0A0A]">Gemini AI가 채용공고 구조화 분석 중입니다...</p>
              <p className="text-xs text-[#6A6A6A] mt-1">회사명, 지원 직무, 마감일, 필수 역량 키워드를 추출하는 중입니다.</p>
            </div>
          )}

          {/* Parsed Result Preview Card */}
          {parsedData && !isLoading && (
            <div className="bg-white border-2 border-[#2EB0A6] rounded-2xl p-5 space-y-4 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#EAE5DC] pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2EB0A6]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AI 자동 추출 완성</span>
                </div>
                <span className="text-xs text-[#6A6A6A]">내 서재 영구 보관용</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs font-semibold text-[#6A6A6A] block">회사명</span>
                  <input
                    type="text"
                    value={parsedData.companyName || ''}
                    onChange={(e) => setParsedData({ ...parsedData, companyName: e.target.value })}
                    className="w-full font-bold text-[#0A0A0A] border-b border-[#EAE5DC] focus:border-[#2EB0A6] focus:outline-none py-0.5"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#6A6A6A] block">공고 제목</span>
                  <input
                    type="text"
                    value={parsedData.title || ''}
                    onChange={(e) => setParsedData({ ...parsedData, title: e.target.value })}
                    className="w-full font-bold text-[#0A0A0A] border-b border-[#EAE5DC] focus:border-[#2EB0A6] focus:outline-none py-0.5"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#6A6A6A] block">포지션 / 직무</span>
                  <input
                    type="text"
                    value={parsedData.position || ''}
                    onChange={(e) => setParsedData({ ...parsedData, position: e.target.value })}
                    className="w-full text-[#0A0A0A] border-b border-[#EAE5DC] focus:border-[#2EB0A6] focus:outline-none py-0.5"
                  />
                </div>

                <div>
                  <span className="text-xs font-semibold text-[#6A6A6A] block">마감일 (D-Day 연동)</span>
                  <input
                    type="date"
                    value={parsedData.dueDate || ''}
                    onChange={(e) => setParsedData({ ...parsedData, dueDate: e.target.value })}
                    className="w-full text-[#0A0A0A] border-b border-[#EAE5DC] focus:border-[#2EB0A6] focus:outline-none py-0.5"
                  />
                </div>
              </div>

              {/* Parsed Keywords */}
              {parsedData.keywords && parsedData.keywords.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-[#6A6A6A] block mb-1">자동 추출된 핵심 기술/역량 키워드:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedData.keywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-0.5 bg-[#E6F7F5] text-[#2EB0A6] font-semibold text-xs rounded-full border border-[#2EB0A6]/30">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks, Requirements, Preferred Previews */}
              <div className="space-y-2 text-xs">
                {parsedData.tasks && parsedData.tasks.length > 0 && (
                  <div className="bg-[#FAF5E8] p-3 rounded-xl border border-[#EAE5DC]">
                    <span className="font-bold text-[#0A0A0A] block mb-1">■ 주요 업무 ({parsedData.tasks.length}개)</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[#3A3A3A]">
                      {parsedData.tasks.map((task, idx) => (
                        <li key={idx}>{task}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {parsedData.requirements && parsedData.requirements.length > 0 && (
                  <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200">
                    <span className="font-bold text-blue-900 block mb-1">■ 필수 자격요건 ({parsedData.requirements.length}개)</span>
                    <ul className="list-disc list-inside space-y-0.5 text-blue-950 font-medium">
                      {parsedData.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {parsedData.preferred && parsedData.preferred.length > 0 && (
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-1">■ 우대 및 선호요건 ({parsedData.preferred.length}개)</span>
                    <ul className="list-disc list-inside space-y-0.5 text-emerald-950">
                      {parsedData.preferred.map((pref, idx) => (
                        <li key={idx}>{pref}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#EAE5DC] bg-[#FAF5E8] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#6A6A6A] hover:text-[#0A0A0A] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!parsedData}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all flex items-center gap-2 ${
              parsedData
                ? 'bg-[#2EB0A6] hover:bg-[#228B83] shadow-md shadow-[#2EB0A6]/30 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <span>스마트 아카이빙 저장하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
