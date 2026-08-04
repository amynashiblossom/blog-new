import React, { useState, useEffect } from 'react';
import { ScrapedJobPosting, PrivateResumeData, ApplicationStatus } from '../types/job';
import { loadStoredJobs, saveStoredJobs, loadStoredPrivateResume, saveStoredPrivateResume } from '../lib/jobStorage';
import { JobKanbanBoard } from './JobKanbanBoard';
import { JobTimelineView } from './JobTimelineView';
import { JobScraperModal } from './JobScraperModal';
import { JobMatchAnalysisModal } from './JobMatchAnalysisModal';
import { PrivateResumeModal } from './PrivateResumeModal';
import { Plus, ShieldCheck, Sparkles, LayoutGrid, Clock, Lock, FileText } from 'lucide-react';

export const JobArchiveView: React.FC = () => {
  const [jobs, setJobs] = useState<ScrapedJobPosting[]>([]);
  const [resume, setResume] = useState<PrivateResumeData>(loadStoredPrivateResume());
  const [viewMode, setViewMode] = useState<'kanban' | 'timeline'>('kanban');

  // Modals
  const [isScraperOpen, setIsScraperOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedJobForMatch, setSelectedJobForMatch] = useState<ScrapedJobPosting | null>(null);

  useEffect(() => {
    const loaded = loadStoredJobs();
    setJobs(loaded);
  }, []);

  const handleUpdateStatus = (jobId: string, newStatus: ApplicationStatus) => {
    const updated = jobs.map((j) =>
      j.id === jobId ? { ...j, status: newStatus, updatedAt: new Date().toISOString() } : j
    );
    setJobs(updated);
    saveStoredJobs(updated);
  };

  const handleDeleteJob = (jobId: string) => {
    const updated = jobs.filter((j) => j.id !== jobId);
    setJobs(updated);
    saveStoredJobs(updated);
  };

  const handleAddJob = (newJob: ScrapedJobPosting) => {
    const updated = [newJob, ...jobs];
    setJobs(updated);
    saveStoredJobs(updated);
  };

  const handleSavePrivateResume = (updatedResume: PrivateResumeData) => {
    setResume(updatedResume);
    saveStoredPrivateResume(updatedResume);
  };

  const handleUpdateJobMatch = (
    jobId: string,
    matchScore: number,
    matchReason: string,
    skillGaps: string[]
  ) => {
    const updated = jobs.map((j) =>
      j.id === jobId ? { ...j, matchScore, matchReason, skillGaps, updatedAt: new Date().toISOString() } : j
    );
    setJobs(updated);
    saveStoredJobs(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl relative z-10 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> JobArchive AI
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> 개인정보 비저장 방식
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            스마트 채용공고 스크랩북 & AI 서류 핏(Fit) 분석
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            원티드, 링크드인, 사람인 등 공고 URL을 한 줄로 스크랩하고 지원 상태를 관할하세요. 내 이력서 텍스트는 서버 DB 저장을 거치지 않고 안전하게 핏(Fit) 점수와 갭 분석을 수행합니다.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsScraperOpen(true)}
              className="flex items-center space-x-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-indigo-600/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>URL로 채용공고 추가</span>
            </button>

            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-2xl text-xs sm:text-sm transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>내 서류 설정 (비저장)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar: Switch View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              viewMode === 'kanban'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>지원 현황 칸반 보드 ({jobs.length})</span>
          </button>

          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              viewMode === 'timeline'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>마감일 D-Day 타임라인</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>등록된 내 서류: <strong className="text-white">{resume.title || '설정됨'}</strong></span>
        </div>
      </div>

      {/* Main View Mode Content */}
      {viewMode === 'kanban' ? (
        <JobKanbanBoard
          jobs={jobs}
          onUpdateStatus={handleUpdateStatus}
          onDeleteJob={handleDeleteJob}
          onOpenMatchModal={(job) => setSelectedJobForMatch(job)}
        />
      ) : (
        <JobTimelineView
          jobs={jobs}
          onOpenMatchModal={(job) => setSelectedJobForMatch(job)}
        />
      )}

      {/* Modals */}
      <JobScraperModal
        isOpen={isScraperOpen}
        onClose={() => setIsScraperOpen(false)}
        onAddJob={handleAddJob}
      />

      <PrivateResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        currentResume={resume}
        onSave={handleSavePrivateResume}
      />

      <JobMatchAnalysisModal
        isOpen={!!selectedJobForMatch}
        onClose={() => setSelectedJobForMatch(null)}
        job={selectedJobForMatch}
        resume={resume}
        onUpdateJobMatch={handleUpdateJobMatch}
      />
    </div>
  );
};
