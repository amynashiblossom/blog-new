import React from 'react';
import { 
  JobPost, 
  ApplicationStatus 
} from '../types';
import { getDDayLabel, formatDueDateLabel } from '../utils/dateUtils';
import { 
  Heart, 
  FileEdit, 
  Send, 
  Users, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  MoreVertical, 
  Plus, 
  Calendar, 
  Building2,
  Trash2,
  ChevronRight,
  MapPin
} from 'lucide-react';

interface KanbanBoardProps {
  jobs: JobPost[];
  onSelectJob: (job: JobPost) => void;
  onStatusChange: (jobId: string, newStatus: ApplicationStatus) => void;
  onDeleteJob: (jobId: string) => void;
  onOpenScraper: () => void;
  onAnalyzeMatch: (job: JobPost) => void;
}

interface ColumnDef {
  key: ApplicationStatus;
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  badgeBg: string;
}

const COLUMNS: ColumnDef[] = [
  {
    key: 'interested',
    title: '관심 공고',
    icon: <Heart className="w-4 h-4 text-[#2EB0A6] shrink-0" />,
    colorClass: 'border-t-4 border-t-[#2EB0A6]',
    badgeBg: 'bg-[#E6F7F5] text-[#2EB0A6]'
  },
  {
    key: 'preparing',
    title: '서류 준비 중',
    icon: <FileEdit className="w-4 h-4 text-[#2EB0A6] shrink-0" />,
    colorClass: 'border-t-4 border-t-[#2EB0A6]',
    badgeBg: 'bg-[#E6F7F5] text-[#2EB0A6]'
  },
  {
    key: 'applied',
    title: '지원 완료',
    icon: <Send className="w-4 h-4 text-[#2EB0A6] shrink-0" />,
    colorClass: 'border-t-4 border-t-[#2EB0A6]',
    badgeBg: 'bg-[#E6F7F5] text-[#2EB0A6]'
  },
  {
    key: 'interview',
    title: '면접 진행',
    icon: <Users className="w-4 h-4 text-[#2EB0A6] shrink-0" />,
    colorClass: 'border-t-4 border-t-[#2EB0A6]',
    badgeBg: 'bg-[#E6F7F5] text-[#2EB0A6]'
  },
  {
    key: 'passed',
    title: '합격 / 결과',
    icon: <CheckCircle2 className="w-4 h-4 text-[#2EB0A6] shrink-0" />,
    colorClass: 'border-t-4 border-t-[#2EB0A6]',
    badgeBg: 'bg-[#E6F7F5] text-[#2EB0A6]'
  }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  jobs,
  onSelectJob,
  onStatusChange,
  onDeleteJob,
  onOpenScraper,
  onAnalyzeMatch
}) => {
  // Compute D-Day
  const getDDay = (dueDateStr: string) => {
    return getDDayLabel(dueDateStr).text;
  };

  const isUrgentDDay = (dueDateStr: string) => {
    return getDDayLabel(dueDateStr).isUrgent;
  };

  return (
    <div className="w-full overflow-x-auto pb-6 max-w-full rounded-2xl border border-[#EAE5DC]/60 bg-[#FAF5E8]/30 p-2 sm:p-3">
      <div className="flex gap-3 min-w-[1050px] xl:min-w-full">
        {COLUMNS.map((col) => {
          const colJobs = jobs.filter((j) => {
            if (col.key === 'passed') {
              return j.status === 'passed' || j.status === 'failed';
            }
            return j.status === col.key;
          });

          const isInterested = col.key === 'interested';

          return (
            <div
              key={col.key}
              className={`${
                isInterested ? 'flex-[1.35] min-w-[270px]' : 'flex-1 min-w-[220px]'
              } bg-[#FAF5E8]/60 border border-[#EAE5DC] rounded-2xl p-3 flex flex-col min-h-[650px] shadow-2xs transition-all`}
            >
              {/* Column Header */}
              <div className={`p-3 bg-white rounded-xl mb-3 border border-[#EAE5DC] ${col.colorClass} flex items-center justify-between gap-2 shadow-2xs shrink-0`}>
                <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                  {col.icon}
                  <h3 className="font-bold text-sm text-[#0A0A0A] whitespace-nowrap shrink-0">{col.title}</h3>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full shrink-0 ${col.badgeBg}`}>
                    {colJobs.length}
                  </span>
                </div>
                {isInterested && (
                  <button
                    onClick={onOpenScraper}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#2EB0A6] bg-[#E6F7F5] hover:bg-[#2EB0A6] hover:text-white rounded-lg transition-colors shrink-0 whitespace-nowrap"
                    title="새 공고 스크랩"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap shrink-0">공고 스크랩</span>
                  </button>
                )}
              </div>

              {/* Column Job Cards List */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colJobs.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#EAE5DC] rounded-xl text-[#6A6A6A] text-xs">
                    <span>공고가 없습니다</span>
                  </div>
                ) : (
                  colJobs.map((job) => {
                    const dDayText = getDDay(job.dueDate);
                    const urgent = isUrgentDDay(job.dueDate);

                    return (
                      <div
                        key={job.id}
                        className="clay-card p-4 bg-white rounded-xl border border-[#EAE5DC] cursor-pointer group hover:border-[#2EB0A6] relative transition-all"
                        onClick={() => onSelectJob(job)}
                      >
                        {/* Company & D-Day Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Building2 className="w-3.5 h-3.5 text-[#6A6A6A] shrink-0" />
                            <span className="text-xs font-bold text-[#3A3A3A] truncate">
                              {job.companyName}
                            </span>
                          </div>

                          {/* D-Day Tag */}
                          <span
                            className={`px-2 py-0.5 text-[11px] font-bold rounded-full shrink-0 flex items-center gap-1 ${
                              urgent
                                ? 'bg-red-500 text-white animate-pulse'
                                : dDayText.includes('D-')
                                ? 'bg-[#E6F7F5] text-[#2EB0A6] border border-[#2EB0A6]/30'
                                : 'bg-[#FAF5E8] text-[#6A6A6A]'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            {dDayText}
                          </span>
                        </div>

                        {/* Title & Position */}
                        <h4 className="font-bold text-sm text-[#0A0A0A] leading-snug mb-1 group-hover:text-[#2EB0A6] transition-colors line-clamp-2">
                          {job.title}
                        </h4>
                        
                        <p className="text-xs text-[#6A6A6A] mb-3 flex items-center gap-1">
                          <span>{job.position}</span>
                          {job.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-[#6A6A6A]" /> {job.location}</span>
                            </>
                          )}
                        </p>

                        {/* AI Match Score Pill */}
                        <div className="mb-3 flex items-center justify-between">
                          {job.matchAnalysis ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E6F7F5] border border-[#2EB0A6]/30 rounded-lg text-xs font-bold text-[#2EB0A6]">
                              <Sparkles className="w-3.5 h-3.5 text-[#2EB0A6]" />
                              <span>AI 매칭 {job.matchAnalysis.matchScore}%</span>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAnalyzeMatch(job);
                              }}
                              className="flex items-center gap-1 px-2 py-1 bg-[#FAF5E8] hover:bg-[#2EB0A6] hover:text-white border border-[#EAE5DC] text-[#6A6A6A] rounded-lg text-[11px] font-semibold transition-all"
                            >
                              <Sparkles className="w-3 h-3 text-[#2EB0A6]" />
                              <span>AI 매칭 분석 실행</span>
                            </button>
                          )}

                          {job.originalUrl && (
                            <a
                              href={job.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 text-[#6A6A6A] hover:text-[#0A0A0A] hover:bg-[#FAF5E8] rounded-md transition-colors"
                              title="원문 공고 보러가기"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        {/* Keywords Tag Cloud */}
                        {job.keywords && job.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {job.keywords.slice(0, 3).map((kw, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-[#FAF5E8] text-[#3A3A3A] text-[10px] font-medium rounded border border-[#EAE5DC]">
                                #{kw}
                              </span>
                            ))}
                            {job.keywords.length > 3 && (
                              <span className="text-[10px] text-[#6A6A6A] self-center">
                                +{job.keywords.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Status Move Action Selector */}
                        <div 
                          className="pt-2 border-t border-[#EAE5DC]/80 flex items-center justify-between text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[11px] text-[#6A6A6A] font-medium">상태 변경:</span>
                          <select
                            value={job.status}
                            onChange={(e) => onStatusChange(job.id, e.target.value as ApplicationStatus)}
                            className="text-xs bg-[#FAF5E8] border border-[#EAE5DC] rounded-lg px-2 py-1 text-[#0A0A0A] focus:outline-none focus:border-[#2EB0A6] cursor-pointer"
                          >
                            <option value="interested">관심공고</option>
                            <option value="preparing">서류 준비 중</option>
                            <option value="applied">지원 완료</option>
                            <option value="interview">면접 진행</option>
                            <option value="passed">최종 합격</option>
                            <option value="failed">불합격</option>
                          </select>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
