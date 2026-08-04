import React from 'react';
import { ScrapedJobPosting } from '../types/job';
import { Clock, Calendar, ExternalLink, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface JobTimelineViewProps {
  jobs: ScrapedJobPosting[];
  onOpenMatchModal: (job: ScrapedJobPosting) => void;
}

export const JobTimelineView: React.FC<JobTimelineViewProps> = ({ jobs, onOpenMatchModal }) => {
  // Sort jobs by dDay ascending (urgent first)
  const sortedJobs = [...jobs].sort((a, b) => (a.dDay ?? 999) - (b.dDay ?? 999));

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">마감일 D-Day 타임라인</h3>
            <p className="text-xs text-slate-400">
              마감일이 얼마 남지 않은 공고 순으로 서류 작성 및 지원 준비 우선순위를 관리합니다.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {sortedJobs.map((job) => {
            const isUrgent = (job.dDay ?? 99) <= 3;

            return (
              <div
                key={job.id}
                className={`bg-slate-950 border ${
                  isUrgent ? 'border-red-500/40 bg-red-950/10' : 'border-slate-800'
                } rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-700`}
              >
                {/* D-Day badge & Company */}
                <div className="flex items-center space-x-3">
                  <div
                    className={`px-3 py-2 rounded-xl text-center font-extrabold text-sm shrink-0 border ${
                      isUrgent
                        ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    D-{job.dDay ?? 'N/A'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400">
                        {job.companyName}
                      </span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                        {job.platform.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {job.jobTitle}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> 마감일: {job.deadline || '상시 채용'}
                    </p>
                  </div>
                </div>

                {/* Match score & CTA */}
                <div className="flex items-center space-x-3 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">AI 매칭률</span>
                    <span className="text-sm font-extrabold text-purple-400">
                      {job.matchScore ? `${job.matchScore}% FIT` : '미진단'}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenMatchModal(job)}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>서류 핏 진단</span>
                  </button>

                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
                    title="원문 공고 이동"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
