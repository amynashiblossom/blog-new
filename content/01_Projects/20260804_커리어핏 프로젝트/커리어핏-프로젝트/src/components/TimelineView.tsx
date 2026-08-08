import React, { useState } from 'react';
import { JobPost } from '../types';
import { getDDayLabel, formatDueDateLabel, isUnspecifiedDeadline } from '../utils/dateUtils';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  Building2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  MapPin,
  List
} from 'lucide-react';

interface TimelineViewProps {
  jobs: JobPost[];
  onSelectJob: (job: JobPost) => void;
  onOpenScraper: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  jobs,
  onSelectJob,
  onOpenScraper
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');

  // Compute D-Days
  const getDDayText = (dueDateStr: string) => {
    return getDDayLabel(dueDateStr).text;
  };

  // Sort jobs by due date (unspecified deadlines go to bottom)
  const sortedJobs = [...jobs].sort((a, b) => {
    if (isUnspecifiedDeadline(a.dueDate) && !isUnspecifiedDeadline(b.dueDate)) return 1;
    if (!isUnspecifiedDeadline(a.dueDate) && isUnspecifiedDeadline(b.dueDate)) return -1;
    return new Date(a.dueDate || '2099-12-31').getTime() - new Date(b.dueDate || '2099-12-31').getTime();
  });

  // Filter urgent D-3 jobs
  const urgentJobs = jobs.filter((j) => {
    return getDDayLabel(j.dueDate).isUrgent;
  });

  return (
    <div className="space-y-6">
      
      {/* Urgent D-3 Closing Alert Banner */}
      {urgentJobs.length > 0 && (
        <div className="bg-gradient-to-r from-red-500/10 via-amber-500/10 to-[#2EB0A6]/10 border-2 border-red-500/40 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-md animate-bounce">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#0A0A0A] flex items-center gap-2">
                  <span>마감 직전 긴급 공고 알림</span>
                  <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full font-extrabold">
                    {urgentJobs.length}건
                  </span>
                </h3>
                <p className="text-xs text-[#6A6A6A] mt-0.5">
                  D-3 이내로 다가온 관심/서류작성 공고입니다. 서류 제출 상태를 확인하세요!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {urgentJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="bg-white p-3.5 rounded-xl border border-red-200 hover:border-red-500 cursor-pointer transition-all shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-red-600 block mb-0.5">
                    {getDDayText(job.dueDate)} ({job.dueDate})
                  </span>
                  <h4 className="font-bold text-sm text-[#0A0A0A] line-clamp-1">{job.title}</h4>
                  <span className="text-xs text-[#6A6A6A]">{job.companyName}</span>
                </div>
                <span className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded-lg font-bold border border-red-200">
                  확인
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Switch View Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#EAE5DC] shadow-xs">
        <div>
          <h2 className="text-base font-bold text-[#0A0A0A] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2EB0A6]" />
            <span>채용공고 마감 타임라인 & 타임스케줄</span>
          </h2>
          <p className="text-xs text-[#6A6A6A]">D-Day 우선순위별로 일정을 한눈에 파악하세요.</p>
        </div>

        <div className="flex items-center p-1 bg-[#FAF5E8] rounded-xl border border-[#EAE5DC]">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'timeline'
                ? 'bg-[#2EB0A6] text-white shadow-xs'
                : 'text-[#6A6A6A] hover:text-[#0A0A0A]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>타임라인 뷰</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'calendar'
                ? 'bg-[#2EB0A6] text-white shadow-xs'
                : 'text-[#6A6A6A] hover:text-[#0A0A0A]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>월별 캘린더 뷰</span>
          </button>
        </div>
      </div>

      {/* Timeline List Mode */}
      {viewMode === 'timeline' && (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#2EB0A6]/40">
          {sortedJobs.map((job) => {
            const dInfo = getDDayLabel(job.dueDate);
            const formattedDate = formatDueDateLabel(job.dueDate);

            return (
              <div key={job.id} className="relative group">
                {/* Circle Marker */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-4 w-4 h-4 rounded-full border-2 transition-transform group-hover:scale-125 ${
                    dInfo.isUrgent
                      ? 'bg-red-500 border-white shadow-md shadow-red-500/50 ring-2 ring-red-300'
                      : dInfo.isUnspecified
                      ? 'bg-amber-400 border-white shadow-md'
                      : 'bg-[#2EB0A6] border-white shadow-md shadow-[#2EB0A6]/40'
                  }`}
                />

                <div
                  onClick={() => onSelectJob(job)}
                  className={`clay-card p-5 bg-white rounded-2xl border transition-all cursor-pointer ${
                    dInfo.isUrgent
                      ? 'border-red-300 hover:border-red-500'
                      : 'border-[#EAE5DC] hover:border-[#2EB0A6]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#2EB0A6] bg-[#E6F7F5] px-2.5 py-1 rounded-full border border-[#2EB0A6]/30">
                        {job.companyName}
                      </span>
                      <span className="text-xs font-semibold text-[#6A6A6A]">
                        {formattedDate}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full w-fit ${
                        dInfo.isUrgent
                          ? 'bg-red-500 text-white animate-pulse'
                          : dInfo.isUnspecified
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-[#E6F7F5] text-[#2EB0A6] border border-[#2EB0A6]/30'
                      }`}
                    >
                      {dInfo.text}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0A0A0A] mb-1 group-hover:text-[#2EB0A6] transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-xs text-[#6A6A6A] mb-3">
                    {job.position} {job.location && `• ${job.location}`}
                  </p>

                  {/* Tasks Snippet */}
                  {job.tasks && job.tasks.length > 0 && (
                    <div className="bg-[#FAF5E8] p-3 rounded-xl text-xs text-[#3A3A3A] mb-3 border border-[#EAE5DC]">
                      <span className="font-bold text-[#0A0A0A] block mb-1">주요 업무 요약:</span>
                      <p className="line-clamp-2">{job.tasks.join(' / ')}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#EAE5DC]">
                    <div className="flex items-center gap-1.5 text-[#6A6A6A]">
                      <span>현재 지원 상태:</span>
                      <span className="font-bold text-[#0A0A0A]">
                        {job.status === 'interested' && '관심공고'}
                        {job.status === 'preparing' && '서류 준비 중'}
                        {job.status === 'applied' && '지원 완료'}
                        {job.status === 'interview' && '면접 진행'}
                        {job.status === 'passed' && '최종 합격'}
                        {job.status === 'failed' && '불합격'}
                      </span>
                    </div>

                    {job.matchAnalysis && (
                      <div className="flex items-center gap-1 font-bold text-[#2EB0A6]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI 매칭 {job.matchAnalysis.matchScore}%</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Calendar Grid Mode */}
      {viewMode === 'calendar' && (
        <div className="bg-white p-6 rounded-2xl border border-[#EAE5DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-[#0A0A0A]">2026년 8월 채용 마감 일정표</h3>
            <span className="text-xs text-[#6A6A6A]">날짜별 스크랩 공고 현황</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#6A6A6A] pb-2 border-b border-[#EAE5DC]">
            <div className="text-red-500">일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div className="text-blue-500">토</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayJobs = jobs.filter((j) => j.dueDate === dateStr);
              const daySchedules = jobs.flatMap((j) =>
                (j.customSchedules || [])
                  .filter((s) => s.date === dateStr)
                  .map((s) => ({ job: j, schedule: s }))
              );

              const hasEvent = dayJobs.length > 0 || daySchedules.length > 0;
              const eventCount = dayJobs.length + daySchedules.length;
              const isSunday = dayNum % 7 === 2;
              const isSaturday = dayNum % 7 === 1;

              return (
                <div
                  key={dayNum}
                  className={`min-h-[110px] p-1.5 border rounded-xl flex flex-col justify-between transition-all ${
                    hasEvent
                      ? 'border-[#2EB0A6] bg-[#E6F7F5]/30'
                      : 'border-[#EAE5DC] bg-[#FAF5E8]/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-bold ${
                        isSunday ? 'text-red-500' : isSaturday ? 'text-blue-500' : 'text-[#0A0A0A]'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {eventCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] bg-[#2EB0A6] text-white font-bold rounded-full">
                        {eventCount}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 my-1 overflow-hidden flex-1">
                    {/* 마감일 공고 */}
                    {dayJobs.map((j) => (
                      <div
                        key={`due-${j.id}`}
                        onClick={() => onSelectJob(j)}
                        className="bg-red-50 hover:bg-red-500 hover:text-white p-1 rounded border border-red-200 text-[10px] font-bold text-red-700 truncate cursor-pointer transition-colors"
                        title={`[마감] ${j.companyName} - ${j.title}`}
                      >
                        🔴 마감: {j.companyName}
                      </div>
                    ))}

                    {/* 커스텀 전형 일정 */}
                    {daySchedules.map(({ job: j, schedule: s }) => (
                      <div
                        key={`sched-${s.id}`}
                        onClick={() => onSelectJob(j)}
                        className="bg-blue-50 hover:bg-blue-500 hover:text-white p-1 rounded border border-blue-200 text-[10px] font-bold text-blue-700 truncate cursor-pointer transition-colors"
                        title={`[${s.title}] ${j.companyName} - ${j.title}`}
                      >
                        📅 {s.title}: {j.companyName}
                      </div>
                    ))}
                  </div>

                  <div />
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
