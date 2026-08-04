import React, { useState } from 'react';
import { ScrapedJobPosting, ApplicationStatus } from '../types/job';
import { Sparkles, Calendar, ExternalLink, Trash2, ChevronRight, ChevronLeft, Target, Clock, AlertCircle } from 'lucide-react';

interface JobKanbanBoardProps {
  jobs: ScrapedJobPosting[];
  onUpdateStatus: (jobId: string, newStatus: ApplicationStatus) => void;
  onDeleteJob: (jobId: string) => void;
  onOpenMatchModal: (job: ScrapedJobPosting) => void;
}

const COLUMNS: Array<{ id: ApplicationStatus; title: string; color: string; badgeBg: string }> = [
  { id: 'interest', title: '💡 관심 공고', color: 'border-slate-700', badgeBg: 'bg-slate-800 text-slate-300' },
  { id: 'preparing', title: '📝 서류 작성 중', color: 'border-indigo-500/40', badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { id: 'applied', title: '🚀 지원 완료', color: 'border-blue-500/40', badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'interview', title: '🎯 면접 진행', color: 'border-purple-500/40', badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'accepted', title: '🏆 최종 합격', color: 'border-emerald-500/40', badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
];

export const JobKanbanBoard: React.FC<JobKanbanBoardProps> = ({
  jobs,
  onUpdateStatus,
  onDeleteJob,
  onOpenMatchModal,
}) => {
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);

  const getJobsByStatus = (status: ApplicationStatus) => {
    return jobs.filter((j) => j.status === status);
  };

  const handleDragStart = (jobId: string) => {
    setDraggedJobId(jobId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: ApplicationStatus) => {
    if (draggedJobId) {
      onUpdateStatus(draggedJobId, status);
      setDraggedJobId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-6">
      {COLUMNS.map((col) => {
        const columnJobs = getJobsByStatus(col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(col.id)}
            className={`bg-slate-900/90 border ${col.color} rounded-2xl p-4 min-h-[520px] flex flex-col justify-between shadow-lg backdrop-blur-md`}
          >
            {/* Column Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  {col.title}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${col.badgeBg}`}>
                  {columnJobs.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3">
                {columnJobs.length === 0 ? (
                  <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400 my-4">
                    공고 카드를 이곳으로 Drag & Drop 하세요
                  </div>
                ) : (
                  columnJobs.map((job) => (
                    <div
                      key={job.id}
                      draggable
                      onDragStart={() => handleDragStart(job.id)}
                      className="bg-slate-950 hover:border-slate-700 border border-slate-800/90 rounded-xl p-3.5 shadow-md space-y-3 cursor-grab active:cursor-grabbing transition-all hover:scale-[1.01]"
                    >
                      {/* Company & D-Day Badge */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 block truncate max-w-[120px]">
                            {job.companyName}
                          </span>
                          <h4 className="font-bold text-white text-xs mt-0.5 line-clamp-1">
                            {job.jobTitle}
                          </h4>
                        </div>
                        {job.dDay !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold shrink-0 ${
                              job.dDay <= 3
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            D-{job.dDay}
                          </span>
                        )}
                      </div>

                      {/* AI Match Score Badge */}
                      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
                        <div className="flex items-center space-x-1.5">
                          <Target className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-slate-300 text-[11px] font-medium">AI Fit</span>
                        </div>
                        {job.matchScore ? (
                          <span className="font-bold text-purple-300 text-xs">
                            {job.matchScore}%
                          </span>
                        ) : (
                          <button
                            onClick={() => onOpenMatchModal(job)}
                            className="text-[10px] text-purple-400 hover:text-purple-300 underline font-medium"
                          >
                            진단하기
                          </button>
                        )}
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1">
                        {(job.techStack || []).slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-slate-800/80 text-slate-400 text-[10px] rounded border border-slate-700/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-white flex items-center gap-1 text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" /> 원문 공고
                        </a>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => onOpenMatchModal(job)}
                            title="AI 핏 분석"
                            className="p-1 hover:text-purple-300 rounded hover:bg-slate-800"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteJob(job.id)}
                            title="삭제"
                            className="p-1 hover:text-red-400 rounded hover:bg-slate-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
