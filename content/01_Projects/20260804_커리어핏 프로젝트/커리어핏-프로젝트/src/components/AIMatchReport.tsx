import React, { useState } from 'react';
import { JobPost, UserResume } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  HelpCircle, 
  RefreshCw, 
  ArrowRight, 
  Zap, 
  Building2, 
  TrendingUp,
  BrainCircuit,
  Award
} from 'lucide-react';

interface AIMatchReportProps {
  jobs: JobPost[];
  userResume: UserResume;
  onSelectJob: (job: JobPost) => void;
  onAnalyzeMatch: (job: JobPost) => Promise<void>;
  onOpenResumeModal: () => void;
}

export const AIMatchReport: React.FC<AIMatchReportProps> = ({
  jobs,
  userResume,
  onSelectJob,
  onAnalyzeMatch,
  onOpenResumeModal
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const handleRunAnalysis = async () => {
    if (!activeJob) return;
    setIsAnalyzing(true);
    try {
      await onAnalyzeMatch(activeJob);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500 bg-gray-100 border-gray-300';
    if (score >= 85) return 'text-[#2EB0A6] bg-[#E6F7F5] border-[#2EB0A6]/40';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-300';
    return 'text-red-600 bg-red-50 border-red-300';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Profile Summary Header */}
      <div className="bg-gradient-to-r from-[#2EB0A6]/15 via-[#FFFDF7] to-[#FAF5E8] p-6 rounded-2xl border border-[#2EB0A6]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2EB0A6] text-white flex items-center justify-center shrink-0 shadow-md">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-[#0A0A0A] text-lg">{userResume.title}</span>
              <span className="px-2.5 py-0.5 text-xs bg-[#2EB0A6] text-white font-bold rounded-full">
                {userResume.experienceYears}년차 프로필
              </span>
              {userResume.attachedFiles && userResume.attachedFiles.length > 0 && (
                <span className="px-2.5 py-0.5 text-xs bg-emerald-600 text-white font-bold rounded-full flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  첨부 서류 {userResume.attachedFiles.length}건
                </span>
              )}
            </div>
            <p className="text-xs text-[#6A6A6A] max-w-2xl">{userResume.summary}</p>
            
            {/* User Skills Pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {userResume.skills.map((skill, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-white border border-[#2EB0A6]/40 text-[#2EB0A6] font-semibold text-xs rounded-full">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenResumeModal}
          className="px-4 py-2.5 bg-white hover:bg-[#E6F7F5] text-[#0A0A0A] border border-[#2EB0A6]/40 font-bold text-xs rounded-xl transition-all shrink-0 flex items-center gap-2 shadow-2xs hover:scale-105 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-[#2EB0A6]" />
          <span>서류 드래그 업로드 & 이력서 관리</span>
        </button>
      </div>

      {/* Main Analysis Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Job Selector List */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-[#EAE5DC] space-y-3 shadow-2xs">
          <h3 className="font-bold text-sm text-[#0A0A0A] px-1 flex items-center justify-between">
            <span>스크랩한 채용공고 목록</span>
            <span className="text-xs text-[#6A6A6A] font-normal">{jobs.length}개 저장됨</span>
          </h3>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {jobs.map((job) => {
              const isSelected = job.id === activeJob?.id;
              const match = job.matchAnalysis;

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E6F7F5] border-[#2EB0A6] shadow-2xs'
                      : 'bg-white border-[#EAE5DC] hover:border-[#2EB0A6]/60 hover:bg-[#FAF5E8]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#6A6A6A] flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {job.companyName}
                    </span>

                    {match ? (
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full border ${getScoreColor(match.matchScore)}`}>
                        {match.matchScore}% 매칭
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-500 rounded-full">
                        진단 필요
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-[#0A0A0A] line-clamp-1 mb-1">
                    {job.title}
                  </h4>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.keywords.slice(0, 3).map((kw, i) => (
                      <span key={i} className="px-1.5 py-0.2 bg-white text-[#3A3A3A] text-[10px] rounded border border-[#EAE5DC]">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Match Report Details */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#EAE5DC] shadow-xs space-y-6">
          {activeJob ? (
            <>
              {/* Selected Job Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#EAE5DC] pb-4">
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-xs font-bold text-[#2EB0A6] bg-[#E6F7F5] px-2.5 py-1 rounded-full">
                    {activeJob.companyName}
                  </span>
                  <h2 className="text-xl font-extrabold text-[#0A0A0A] mt-2 leading-snug">{activeJob.title}</h2>
                  <p className="text-xs text-[#6A6A6A] mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>{activeJob.position}</span>
                    <span>•</span>
                    <span>마감일: {activeJob.dueDate}</span>
                  </p>
                </div>

                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="self-start sm:mt-0.5 px-4 py-2.5 bg-[#2EB0A6] hover:bg-[#228B83] text-white font-bold text-xs rounded-xl shadow-md shadow-[#2EB0A6]/20 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{activeJob.matchAnalysis ? 'Gemini AI 재분석 실행' : 'Gemini AI 역량 진단 실행'}</span>
                </button>
              </div>

              {/* Match Score Gauge Card */}
              {activeJob.matchAnalysis ? (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Score & Summary Banner */}
                  <div className="bg-[#FAF5E8] p-5 rounded-2xl border border-[#EAE5DC] flex flex-col sm:flex-row items-center gap-5">
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="46"
                          stroke="#EAE5DC"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="46"
                          stroke="#2EB0A6"
                          strokeWidth="10"
                          strokeDasharray={289}
                          strokeDashoffset={289 - (289 * activeJob.matchAnalysis.matchScore) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-black text-[#0A0A0A]">{activeJob.matchAnalysis.matchScore}%</span>
                        <span className="text-[10px] text-[#6A6A6A] font-bold">적합도</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <Award className="w-5 h-5 text-[#2EB0A6]" />
                        <h3 className="font-bold text-base text-[#0A0A0A]">이력서-JD 역량 매칭 종합 진단</h3>
                      </div>
                      <p className="text-xs text-[#3A3A3A] leading-relaxed">
                        {activeJob.matchAnalysis.summary}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Matching Analysis: Matched Points vs Improvement Points */}
                  <div className="space-y-4">
                    
                    {/* 1. Matched Points (일치하는 부분) */}
                    <div className="bg-[#E6F7F5] border border-[#2EB0A6]/40 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-extrabold text-[#2EB0A6]">
                          <CheckCircle2 className="w-5 h-5 shrink-0" />
                          <span>공고 전체 내용과 내 이력서/경력기술서 '일치하는 부분'</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#2EB0A6] bg-white px-2.5 py-0.5 rounded-full border border-[#2EB0A6]/30">
                          강점 분석
                        </span>
                      </div>
                      
                      <ul className="space-y-2 text-xs text-[#0A0A0A]">
                        {activeJob.matchAnalysis.matchedPoints && activeJob.matchAnalysis.matchedPoints.length > 0 ? (
                          activeJob.matchAnalysis.matchedPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-[#2EB0A6]/20 shadow-2xs leading-relaxed">
                              <span className="w-5 h-5 rounded-full bg-[#2EB0A6] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="font-semibold">{point}</span>
                            </li>
                          ))
                        ) : (
                          activeJob.matchAnalysis.matchedKeywords.map((kw, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-[#2EB0A6]/20 shadow-2xs leading-relaxed">
                              <span className="w-5 h-5 rounded-full bg-[#2EB0A6] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="font-semibold">공고의 핵심 요구사항 [{kw}] 역량이 첨부된 이력서 및 보유 기술과 일치합니다.</span>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>

                    {/* 2. Improvement Points (개선이 필요한 부분) */}
                    <div className="bg-amber-50 border border-amber-300 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-extrabold text-amber-800">
                          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                          <span>공고 전체 내용 대비 내 서류 '개선이 필요한 부분'</span>
                        </div>
                        <span className="text-[11px] font-bold text-amber-800 bg-white px-2.5 py-0.5 rounded-full border border-amber-300">
                          서류 보완 필수
                        </span>
                      </div>

                      <ul className="space-y-2 text-xs text-[#0A0A0A]">
                        {activeJob.matchAnalysis.improvementPoints && activeJob.matchAnalysis.improvementPoints.length > 0 ? (
                          activeJob.matchAnalysis.improvementPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-amber-200 shadow-2xs leading-relaxed">
                              <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                !
                              </span>
                              <span className="font-semibold">{point}</span>
                            </li>
                          ))
                        ) : (
                          activeJob.matchAnalysis.resumeImprovementTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-amber-200 shadow-2xs leading-relaxed">
                              <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                !
                              </span>
                              <span className="font-semibold">{tip}</span>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>

                  </div>

                  {/* Keyword Breakdown: Matched vs Missing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Matched Keywords */}
                    <div className="p-4 bg-[#E6F7F5]/60 border border-[#2EB0A6]/30 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#2EB0A6]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>부합하는 키워드 ({activeJob.matchAnalysis.matchedKeywords.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {activeJob.matchAnalysis.matchedKeywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white text-[#2EB0A6] font-bold text-xs rounded-lg border border-[#2EB0A6]/40 shadow-2xs">
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>보완 필요 키워드 ({activeJob.matchAnalysis.missingKeywords.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {activeJob.matchAnalysis.missingKeywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white text-amber-700 font-bold text-xs rounded-lg border border-amber-300 shadow-2xs">
                            ! {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Gemini Custom Resume Tips */}
                  {activeJob.matchAnalysis.resumeImprovementTips && activeJob.matchAnalysis.resumeImprovementTips.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-[#EAE5DC] space-y-2">
                      <h4 className="font-bold text-xs text-[#0A0A0A] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#2EB0A6]" />
                        <span>이 공고 전용 서류/자기소개서 작성 팁 (Gemini AI 코칭)</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-[#3A3A3A]">
                        {activeJob.matchAnalysis.resumeImprovementTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-[#FAF5E8] p-2.5 rounded-lg border border-[#EAE5DC]">
                            <span className="font-bold text-[#2EB0A6] shrink-0">Tip {idx + 1}.</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Interview Prep Questions */}
                  {activeJob.matchAnalysis.interviewPrepQuestions && activeJob.matchAnalysis.interviewPrepQuestions.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-[#EAE5DC] space-y-2">
                      <h4 className="font-bold text-xs text-[#0A0A0A] flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#2EB0A6]" />
                        <span>1차 면접 예상 질문 가이드</span>
                      </h4>
                      <div className="space-y-2 text-xs">
                        {activeJob.matchAnalysis.interviewPrepQuestions.map((q, idx) => (
                          <div key={idx} className="p-3 bg-[#E6F7F5]/40 border border-[#2EB0A6]/20 rounded-lg text-[#0A0A0A]">
                            <span className="font-bold text-[#2EB0A6] block mb-0.5">질문 {idx + 1}.</span>
                            <p>{q}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="py-16 text-center bg-[#FAF5E8] rounded-2xl border border-dashed border-[#EAE5DC] space-y-3">
                  <Sparkles className="w-10 h-10 text-[#2EB0A6] mx-auto animate-bounce" />
                  <h3 className="font-bold text-base text-[#0A0A0A]">AI 매칭 진단 리포트 생성</h3>
                  <p className="text-xs text-[#6A6A6A] max-w-md mx-auto">
                    Gemini AI가 해당 채용공고의 필수 역량 키워드와 본인의 이력서를 정밀 대조하여 매칭 점수 및 서류 보완점을 도출합니다.
                  </p>
                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="px-5 py-2.5 bg-[#2EB0A6] hover:bg-[#228B83] text-white font-bold text-xs rounded-xl shadow-md shadow-[#2EB0A6]/25 transition-all inline-flex items-center gap-2"
                  >
                    <span>지금 AI 진단 실행하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </>
          ) : (
            <div className="py-12 text-center text-[#6A6A6A] text-sm">
              분석할 채용공고를 선택해 주세요.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
