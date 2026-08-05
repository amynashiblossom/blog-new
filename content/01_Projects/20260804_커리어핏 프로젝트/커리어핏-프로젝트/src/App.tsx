import React, { useState, useEffect } from 'react';
import { JobPost, ApplicationStatus, UserResume } from './types';
import { SAMPLE_JOB_POSTS, INITIAL_USER_RESUME } from './data/mockJobs';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { TimelineView } from './components/TimelineView';
import { AIMatchReport } from './components/AIMatchReport';
import { JobScraperModal } from './components/JobScraperModal';
import { JobDetailModal } from './components/JobDetailModal';
import { ResumeManagerModal } from './components/ResumeManagerModal';
import { 
  Plus, 
  Sparkles, 
  BookmarkCheck, 
  Calendar, 
  BrainCircuit, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

export default function App() {
  // Load Jobs from localStorage or fallback to SAMPLE_JOB_POSTS
  const [jobs, setJobs] = useState<JobPost[]>(() => {
    try {
      const saved = localStorage.getItem('jd_archive_jobs_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load jobs from localStorage', e);
    }
    return SAMPLE_JOB_POSTS;
  });

  // User Resume State
  const [userResume, setUserResume] = useState<UserResume>(() => {
    try {
      const saved = localStorage.getItem('jd_archive_resume_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load resume from localStorage', e);
    }
    return INITIAL_USER_RESUME;
  });

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'kanban' | 'timeline' | 'resume' | 'match'>('kanban');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals
  const [isScraperOpen, setIsScraperOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jd_archive_jobs_v1', JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to save jobs to localStorage', e);
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem('jd_archive_resume_v1', JSON.stringify(userResume));
    } catch (e) {
      console.error('Failed to save resume to localStorage', e);
    }
  }, [userResume]);

  // Handlers
  const handleAddJob = (jobData: Omit<JobPost, 'id' | 'scrapedAt'>) => {
    const newJob: JobPost = {
      ...jobData,
      id: `job-${Date.now()}`,
      scrapedAt: new Date().toISOString().split('T')[0]
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  const handleStatusChange = (jobId: string, newStatus: ApplicationStatus) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleUpdateMemo = (jobId: string, newMemo: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, memo: newMemo } : j))
    );
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => (prev ? { ...prev, memo: newMemo } : null));
    }
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(null);
    }
  };

  const handleAnalyzeMatch = async (jobToAnalyze: JobPost, customResume?: UserResume) => {
    try {
      const targetResume = customResume || userResume;
      const response = await fetch('/api/analyze-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: jobToAnalyze,
          userResume: targetResume
        })
      });

      const json = await response.json();
      if (json.success && json.data) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobToAnalyze.id ? { ...j, matchAnalysis: json.data } : j
          )
        );
        if (selectedJob && selectedJob.id === jobToAnalyze.id) {
          setSelectedJob((prev) => (prev ? { ...prev, matchAnalysis: json.data } : null));
        }
      }
    } catch (error) {
      console.error('Match analysis failed:', error);
    }
  };

  // Filter Jobs based on Search & Status Filter
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.keywords && job.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'passed'
        ? job.status === 'passed' || job.status === 'failed'
        : job.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col text-[#0A0A0A]">
      
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScraper={() => setIsScraperOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        jobsCount={filteredJobs.length}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Metric Summary Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-white rounded-2xl border border-[#EAE5DC] shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6A6A6A] block">아카이빙 총 공고</span>
              <span className="text-2xl font-black text-[#0A0A0A]">{jobs.length}건</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E6F7F5] text-[#2EB0A6] flex items-center justify-center font-bold">
              <BookmarkCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#EAE5DC] shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6A6A6A] block">서류 준비 / 지원 진행</span>
              <span className="text-2xl font-black text-amber-600">
                {jobs.filter((j) => j.status === 'preparing' || j.status === 'applied').length}건
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#EAE5DC] shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6A6A6A] block">면접 및 합격</span>
              <span className="text-2xl font-black text-[#2EB0A6]">
                {jobs.filter((j) => j.status === 'interview' || j.status === 'passed').length}건
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E6F7F5] text-[#2EB0A6] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#EAE5DC] shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6A6A6A] block">평균 이력서 매칭율</span>
              <span className="text-2xl font-black text-[#2EB0A6]">
                {Math.round(
                  jobs.reduce((acc, curr) => acc + (curr.matchAnalysis?.matchScore || 80), 0) /
                    Math.max(1, jobs.length)
                )}%
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E6F7F5] text-[#2EB0A6] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Dynamic Views */}
        {activeTab === 'kanban' && (
          <KanbanBoard
            jobs={filteredJobs}
            onSelectJob={(job) => setSelectedJob(job)}
            onStatusChange={handleStatusChange}
            onDeleteJob={handleDeleteJob}
            onOpenScraper={() => setIsScraperOpen(true)}
            onAnalyzeMatch={handleAnalyzeMatch}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            jobs={filteredJobs}
            onSelectJob={(job) => setSelectedJob(job)}
            onOpenScraper={() => setIsScraperOpen(true)}
          />
        )}

        {(activeTab === 'match' || activeTab === 'resume') && (
          <AIMatchReport
            jobs={filteredJobs}
            userResume={userResume}
            onSelectJob={(job) => setSelectedJob(job)}
            onAnalyzeMatch={handleAnalyzeMatch}
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-[#FAF5E8] border-t border-[#EAE5DC] text-center text-xs text-[#6A6A6A]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0A0A0A]">커리어핏 (CareerFit)</span>
            <span>•</span>
            <span>스마트 JD 붙여넣기 스크랩북 & AI 이력서 매칭 플랫폼</span>
          </div>
          <p>© 2026 커리어핏 (CareerFit). Powered by Gemini AI.</p>
        </div>
      </footer>

      {/* Modals */}
      <JobScraperModal
        isOpen={isScraperOpen}
        onClose={() => setIsScraperOpen(false)}
        onAddJob={handleAddJob}
      />

      <JobDetailModal
        job={selectedJob}
        userResume={userResume}
        onClose={() => setSelectedJob(null)}
        onStatusChange={handleStatusChange}
        onUpdateMemo={handleUpdateMemo}
        onDeleteJob={handleDeleteJob}
        onAnalyzeMatch={handleAnalyzeMatch}
        onSaveResume={(updated) => setUserResume(updated)}
      />

      <ResumeManagerModal
        isOpen={isResumeModalOpen}
        userResume={userResume}
        onClose={() => setIsResumeModalOpen(false)}
        onSaveResume={(updated) => setUserResume(updated)}
      />

    </div>
  );
}
