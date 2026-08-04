import React, { useState } from 'react';
import { ScrapedJobPosting } from '../types/job';
import { Link2, Sparkles, Loader2, Plus, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';

interface JobScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: ScrapedJobPosting) => void;
}

export const JobScraperModal: React.FC<JobScraperModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Extracted Preview Data State
  const [scrapedPreview, setScrapedPreview] = useState<Partial<ScrapedJobPosting> | null>(null);

  if (!isOpen) return null;

  const handleScrapeUrl = async () => {
    if (!inputUrl.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/jobs/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '공고 데이터를 파싱하는 중 오류가 발생했습니다.');
      }

      setScrapedPreview(data.job);
    } catch (err: any) {
      console.error('Failed to scrape job:', err);
      setErrorMsg(err.message || '공고 URL을 읽어오는 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!scrapedPreview) return;

    const newJob: ScrapedJobPosting = {
      id: `job-${Date.now()}`,
      url: inputUrl || scrapedPreview.url || 'https://www.wanted.co.kr',
      platform: (scrapedPreview.platform as any) || 'wanted',
      companyName: scrapedPreview.companyName || '회사명 입력',
      jobTitle: scrapedPreview.jobTitle || '채용 공고 제목',
      location: scrapedPreview.location || '서울',
      deadline: scrapedPreview.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      dDay: scrapedPreview.dDay ?? 7,
      status: 'interest',
      mainTasks: scrapedPreview.mainTasks || ['주요 업무 내역'],
      qualifications: scrapedPreview.qualifications || ['자격 요건'],
      preferences: scrapedPreview.preferences || ['우대 사항'],
      techStack: scrapedPreview.techStack || ['React', 'TypeScript'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddJob(newJob);
    setScrapedPreview(null);
    setInputUrl('');
    onClose();
  };

  const handlePresetSelect = (url: string) => {
    setInputUrl(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              URL 한 줄로 채용공고 스크랩
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              원티드, 링크드인, 사람인 등 채용공고 URL만 입력하면 AI가 공고 정보를 자동 파싱합니다.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              채용공고 URL 입력
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://www.wanted.co.kr/wd/198273 또는 https://www.linkedin.com/jobs/..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={handleScrapeUrl}
                disabled={isLoading || !inputUrl.trim()}
                className="flex items-center space-x-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>파싱 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>공고 분석하기</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          {!scrapedPreview && (
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
              <span className="text-xs text-slate-400 block mb-2 font-medium">
                💡 빠른 테스트용 예시 공고 URL
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handlePresetSelect('https://www.wanted.co.kr/wd/198273')}
                  className="text-xs bg-slate-800/80 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-300 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors"
                >
                  [원티드] 토스 Frontend Developer
                </button>
                <button
                  onClick={() => handlePresetSelect('https://www.linkedin.com/jobs/view/9928172')}
                  className="text-xs bg-slate-800/80 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-300 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors"
                >
                  [링크드인] 쿠팡 Product Manager
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Scraped Result Preview Card */}
          {scrapedPreview && (
            <div className="bg-slate-950 border border-indigo-500/40 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 uppercase border border-indigo-500/30">
                    {scrapedPreview.platform || 'Wanted'}
                  </span>
                  <h3 className="font-bold text-white text-base">
                    {scrapedPreview.companyName}
                  </h3>
                </div>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 파싱 성공
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-100">
                  {scrapedPreview.jobTitle}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  📍 {scrapedPreview.location} | 📅 마감일: {scrapedPreview.deadline} (D-{scrapedPreview.dDay})
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-indigo-400 font-semibold">주요 업무:</span>{' '}
                  {(scrapedPreview.mainTasks || []).join(' / ')}
                </div>
                <div>
                  <span className="text-indigo-400 font-semibold">자격 요건:</span>{' '}
                  {(scrapedPreview.qualifications || []).join(' / ')}
                </div>
                <div>
                  <span className="text-indigo-400 font-semibold">필수 기술:</span>{' '}
                  {(scrapedPreview.techStack || []).join(', ')}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleConfirmAdd}
                  className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>내 스크랩북 서재에 추가</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
