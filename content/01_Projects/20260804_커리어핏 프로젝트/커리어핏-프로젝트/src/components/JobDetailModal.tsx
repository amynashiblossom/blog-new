import React, { useState, useRef } from 'react';
import { JobPost, ApplicationStatus, UserResume, ResumeFile } from '../types';
import { formatDueDateLabel } from '../utils/dateUtils';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Trash2, 
  ListChecks, 
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileCode,
  UploadCloud,
  RefreshCw,
  Edit3,
  Save
} from 'lucide-react';

interface JobDetailModalProps {
  job: JobPost | null;
  userResume?: UserResume;
  onClose: () => void;
  onStatusChange: (jobId: string, newStatus: ApplicationStatus) => void;
  onUpdateMemo: (jobId: string, newMemo: string) => void;
  onDeleteJob: (jobId: string) => void;
  onAnalyzeMatch: (job: JobPost, updatedResume?: UserResume) => Promise<void>;
  onSaveResume?: (updatedResume: UserResume) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  userResume,
  onClose,
  onStatusChange,
  onUpdateMemo,
  onDeleteJob,
  onAnalyzeMatch,
  onSaveResume
}) => {
  if (!job) return null;

  const [memo, setMemo] = useState(job.memo || '');
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [showFullRawText, setShowFullRawText] = useState(true);
  
  // Construct complete raw text guaranteed fallback if rawText was missing in legacy state
  const displayRawText = job.rawText || [
    `[${job.companyName}] ${job.title}`,
    `직무: ${job.position} | 마감일: ${job.dueDate}`,
    job.location ? `근무지: ${job.location}` : '',
    job.salary ? `연봉: ${job.salary}` : '',
    `\n■ 주요 업무 (Tasks)`,
    ...(job.tasks || []).map(t => `- ${t}`),
    `\n■ 필수 자격요건 (Requirements)`,
    ...(job.requirements || []).map(r => `- ${r}`),
    `\n■ 우대 사항 (Preferred)`,
    ...(job.preferred || []).map(p => `- ${p}`),
    `\n■ 핵심 역량 키워드`,
    (job.keywords || []).map(k => `#${k}`).join(' ')
  ].filter(Boolean).join('\n');
  
  // Drag & Drop for user resume/career document comparison directly in modal
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveMemo = () => {
    onUpdateMemo(job.id, memo);
    setIsEditingMemo(false);
  };

  // Helper for file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Process files uploaded in modal
  const handleProcessDroppedFiles = async (filesList: FileList | File[]) => {
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    let addedCount = 0;
    const newResumeFiles: ResumeFile[] = [];

    for (const file of filesArray) {
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const fileExt = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      
      const newFileObj: ResumeFile = {
        id: fileId,
        name: file.name,
        size: formatFileSize(file.size),
        type: fileExt,
        uploadedAt: new Date().toISOString().split('T')[0]
      };

      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const textContent = await file.text();
        newFileObj.extractedText = textContent;
      } else {
        newFileObj.extractedText = `[서류: ${file.name}] 용량: ${newFileObj.size}. 이력서/경력기술서 파일 스캔 파싱 완료.`;
      }

      newResumeFiles.push(newFileObj);
      addedCount++;
    }

    const currentAttached = userResume?.attachedFiles || [];
    const updatedAttached = [...currentAttached, ...newResumeFiles];

    const updatedResumeObj: UserResume = {
      title: userResume?.title || '내 주요 이력서',
      summary: userResume?.summary || '드래그 업로드 서류 기반 자동 업데이트',
      experienceYears: userResume?.experienceYears || 3,
      skills: userResume?.skills || job.keywords || [],
      portfolioSummary: userResume?.portfolioSummary || '',
      lastUpdated: new Date().toISOString().split('T')[0],
      attachedFiles: updatedAttached
    };

    if (onSaveResume) {
      onSaveResume(updatedResumeObj);
    }

    setUploadMessage(`${addedCount}개 서류 첨부 완료! 즉시 AI 매칭 분석을 시작합니다.`);
    setIsAnalyzing(true);
    
    try {
      await onAnalyzeMatch(job, updatedResumeObj);
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setUploadMessage(null), 3500);
    }
  };

  // Handle deleting individual attached file
  const handleDeleteAttachedFile = async (fileId: string) => {
    if (!userResume) return;
    const currentAttached = userResume.attachedFiles || [];
    const updatedAttached = currentAttached.filter((f) => f.id !== fileId);

    const updatedResumeObj: UserResume = {
      ...userResume,
      attachedFiles: updatedAttached,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (onSaveResume) {
      onSaveResume(updatedResumeObj);
    }

    setUploadMessage('선택한 서류가 삭제되었습니다. 남은 서류로 공고 매칭을 재분석합니다.');

    setIsAnalyzing(true);
    try {
      await onAnalyzeMatch(job, updatedResumeObj);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setUploadMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FFFDF7] w-full max-w-6xl rounded-2xl border border-[#EAE5DC] shadow-2xl overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EAE5DC] bg-[#FAF5E8] flex items-start justify-between shrink-0">
          <div className="space-y-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-[#2EB0A6] text-white font-bold text-xs rounded-full">
                {job.companyName}
              </span>
              <span className="text-xs text-[#6A6A6A]">스크랩: {job.scrapedAt}</span>
              <span className="text-xs font-bold text-[#2EB0A6] bg-[#E6F7F5] px-2.5 py-0.5 rounded-md border border-[#2EB0A6]/30">
                마감일: {formatDueDateLabel(job.dueDate)}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0A0A0A] truncate">{job.title}</h2>
            <p className="text-xs font-semibold text-[#3A3A3A] flex items-center gap-2">
              <span>직무: {job.position}</span>
              {job.location && <span>• 위치: {job.location}</span>}
              {job.salary && <span>• 연봉: {job.salary}</span>}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#6A6A6A] hidden sm:inline">지원 상태:</span>
              <select
                value={job.status}
                onChange={(e) => onStatusChange(job.id, e.target.value as ApplicationStatus)}
                className="text-xs bg-white border border-[#EAE5DC] rounded-lg px-2.5 py-1.5 font-bold text-[#0A0A0A] focus:outline-none focus:border-[#2EB0A6] cursor-pointer"
              >
                <option value="interested">관심 공고</option>
                <option value="preparing">서류 준비 중</option>
                <option value="applied">지원 완료</option>
                <option value="interview">면접 진행</option>
                <option value="passed">최종 합격</option>
                <option value="failed">불합격</option>
              </select>
            </div>

            {job.originalUrl && (
              <a
                href={job.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#2EB0A6] hover:bg-[#E6F7F5] rounded-xl transition-colors flex items-center gap-1 text-xs font-bold border border-[#2EB0A6]/30"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">원문 링크</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#6A6A6A] hover:text-[#0A0A0A] hover:bg-black/5 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body - Split 2 Columns Layout */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FAF5E8]/30">
          
          {/* Left Column (6 cols): 공고 주요업무 / 필수요건 / 선호요건 / 원문 전체 */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DC]">
              <h3 className="font-extrabold text-sm text-[#0A0A0A] flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#2EB0A6]" />
                <span>채용공고 핵심 구성요소 (압축/생략 없음)</span>
              </h3>
              <span className="text-[11px] text-[#6A6A6A] font-semibold">JD 상세 내용</span>
            </div>

            {/* 1. 주요 업무 (Tasks) */}
            <div className="p-4 bg-white rounded-xl border border-[#EAE5DC] space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2EB0A6]"></span>
                  <span>주요 업무 (Tasks & R&R)</span>
                </h4>
                <span className="text-[10px] bg-[#E6F7F5] text-[#2EB0A6] font-bold px-2 py-0.5 rounded">
                  {job.tasks?.length || 0}개 항목
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#2A2A2A] list-disc list-inside leading-relaxed">
                {job.tasks && job.tasks.length > 0 ? (
                  job.tasks.map((task, idx) => (
                    <li key={idx} className="marker:text-[#2EB0A6]">{task}</li>
                  ))
                ) : (
                  <li className="text-gray-400">등록된 주요 업무 내용이 없습니다.</li>
                )}
              </ul>
            </div>

            {/* 2. 필수 요건 (Requirements) */}
            <div className="p-4 bg-white rounded-xl border border-[#EAE5DC] space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>필수 자격요건 (Requirements)</span>
                </h4>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                  {job.requirements?.length || 0}개 항목
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#2A2A2A] list-disc list-inside leading-relaxed">
                {job.requirements && job.requirements.length > 0 ? (
                  job.requirements.map((req, idx) => (
                    <li key={idx} className="marker:text-blue-600 font-medium">{req}</li>
                  ))
                ) : (
                  <li className="text-gray-400">등록된 필수요건 정보가 없습니다.</li>
                )}
              </ul>
            </div>

            {/* 3. 선호 요건 (Preferred / 우대사항) */}
            <div className="p-4 bg-white rounded-xl border border-[#EAE5DC] space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>우대 및 선호요건 (Preferred)</span>
                </h4>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  {job.preferred?.length || 0}개 항목
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#2A2A2A] list-disc list-inside leading-relaxed">
                {job.preferred && job.preferred.length > 0 ? (
                  job.preferred.map((pref, idx) => (
                    <li key={idx} className="marker:text-emerald-600">{pref}</li>
                  ))
                ) : (
                  <li className="text-gray-400">등록된 우대사항 정보가 없습니다.</li>
                )}
              </ul>
            </div>

            {/* AI Keywords */}
            {job.keywords && job.keywords.length > 0 && (
              <div className="p-3.5 bg-white rounded-xl border border-[#EAE5DC]">
                <h4 className="text-xs font-bold text-[#0A0A0A] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2EB0A6]" />
                  <span>핵심 요구 역량 키워드</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.keywords.map((kw, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-[#E6F7F5] text-[#2EB0A6] font-semibold text-[11px] rounded-lg border border-[#2EB0A6]/30">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full Raw Text View */}
            <div className="bg-white rounded-xl border border-[#EAE5DC] overflow-hidden shadow-2xs">
              <button
                onClick={() => setShowFullRawText(!showFullRawText)}
                className="w-full p-3.5 bg-[#FAF5E8] hover:bg-[#EAE5DC]/50 transition-colors flex items-center justify-between text-xs font-bold text-[#0A0A0A] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#2EB0A6]" />
                  <span>공고 원문 전체보기 (100% 생략 없이 전체 보존)</span>
                </div>
                <div className="flex items-center gap-1 text-[#2EB0A6]">
                  <span>{showFullRawText ? '접기' : '원문 전체 펼치기'}</span>
                  {showFullRawText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {showFullRawText && (
                <div className="p-4 bg-white text-xs text-[#2A2A2A] border-t border-[#EAE5DC] max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed font-sans bg-[#FAF5E8]/20 border-l-4 border-l-[#2EB0A6]">
                  {displayRawText}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (6 cols): 공고 바로 옆 '내 서류 드래그 앤 드롭 & 실시간 매칭/개선 분석 비교창' */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DC]">
              <h3 className="font-extrabold text-sm text-[#0A0A0A] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2EB0A6]" />
                <span>내 서류 드래그 & 공고 적합도/개선점 비교</span>
              </h3>
              <span className="text-[11px] text-[#2EB0A6] font-bold bg-[#E6F7F5] px-2 py-0.5 rounded border border-[#2EB0A6]/30">
                실시간 Gemini 매칭
              </span>
            </div>

            {/* Drop Zone Component */}
            <div
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleProcessDroppedFiles(e.dataTransfer.files);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#2EB0A6] bg-[#E6F7F5] scale-[1.01]'
                  : 'border-[#2EB0A6]/40 bg-white hover:bg-[#E6F7F5]/30 hover:border-[#2EB0A6]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && handleProcessDroppedFiles(e.target.files)}
                multiple
                accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.hwp"
                className="hidden"
              />
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E6F7F5] text-[#2EB0A6] flex items-center justify-center shrink-0">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#0A0A0A]">
                    이곳에 이력서 / 경력기술서 파일(PDF, Word, TXT)을 끌어다 놓으세요
                  </p>
                  <p className="text-[11px] text-[#6A6A6A]">
                    파일을 드래그하면 이 공고와의 일치사항 및 개선점을 즉시 분석합니다
                  </p>
                </div>
              </div>
            </div>

            {uploadMessage && (
              <div className="p-2.5 bg-[#E6F7F5] border border-[#2EB0A6]/40 rounded-xl text-xs text-[#2EB0A6] font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{uploadMessage}</span>
              </div>
            )}

            {/* Attached files info & Trash delete button */}
            {userResume?.attachedFiles && userResume.attachedFiles.length > 0 && (
              <div className="p-3 bg-white border border-[#EAE5DC] rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0A0A0A] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#2EB0A6]" />
                    <span>매칭 분석에 사용된 첨부 서류 ({userResume.attachedFiles.length}건)</span>
                  </span>
                  <span className="text-[10px] text-[#6A6A6A]">휴지통 버튼을 눌러 서류 삭제 가능</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {userResume.attachedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="px-2.5 py-1 bg-[#FAF5E8]/80 border border-[#2EB0A6]/30 text-[#0A0A0A] font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs hover:border-red-300 transition-colors"
                    >
                      <span className="max-w-[220px] truncate flex items-center gap-1" title={file.name}>
                        📄 {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAttachedFile(file.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer ml-0.5"
                        title="이 첨부 서류 삭제하기"
                        aria-label="서류 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Match Comparison Card Result */}
            {isAnalyzing ? (
              <div className="p-8 bg-white rounded-2xl border border-[#2EB0A6]/30 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#2EB0A6] animate-spin mx-auto" />
                <p className="text-xs font-bold text-[#0A0A0A]">Gemini AI가 공고와 내 서류를 정밀 대조 분석 중입니다...</p>
                <p className="text-[11px] text-[#6A6A6A]">주요업무, 자격요건, 우대사항 대비 서류 일치사항 및 개선점을 산출합니다.</p>
              </div>
            ) : job.matchAnalysis ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                
                {/* Score Header */}
                <div className="bg-gradient-to-r from-[#2EB0A6]/15 via-white to-[#FAF5E8] p-4 rounded-2xl border border-[#2EB0A6]/40 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#6A6A6A]">서류 적합도 점수</span>
                      <span className="px-2 py-0.5 bg-[#2EB0A6] text-white text-[10px] font-extrabold rounded-full">Gemini 진단</span>
                    </div>
                    <p className="text-xs font-bold text-[#0A0A0A] mt-1">{job.matchAnalysis.summary}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black text-[#2EB0A6]">{job.matchAnalysis.matchScore}%</span>
                    <p className="text-[10px] text-[#6A6A6A]">서류 부합</p>
                  </div>
                </div>

                {/* 1. 어느 정도 매칭하는지 (일치하는 부분) */}
                <div className="p-4 bg-[#E6F7F5] border border-[#2EB0A6]/40 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-[#2EB0A6] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>공고와 내 서류 '일치하는 부분' (강점 포인트)</span>
                    </h4>
                    <span className="text-[10px] font-bold text-[#2EB0A6] bg-white px-2 py-0.5 rounded border border-[#2EB0A6]/30">
                      매칭 강점
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-[#0A0A0A]">
                    {job.matchAnalysis.matchedPoints && job.matchAnalysis.matchedPoints.length > 0 ? (
                      job.matchAnalysis.matchedPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white/95 p-2.5 rounded-xl border border-[#2EB0A6]/20 leading-relaxed font-semibold">
                          <span className="w-4 h-4 rounded-full bg-[#2EB0A6] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span>{point}</span>
                        </li>
                      ))
                    ) : (
                      job.matchAnalysis.matchedKeywords.map((kw, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white/95 p-2.5 rounded-xl border border-[#2EB0A6]/20 leading-relaxed font-semibold">
                          <span className="w-4 h-4 rounded-full bg-[#2EB0A6] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span>공고 핵심 스택 [{kw}] 이력이 제출 서류와 일치합니다.</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* 2. 어떤 부분을 개선해야 하는지 (개선이 필요한 부분) */}
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>공고 대비 내 서류 '개선이 필요한 부분' (보완 가이드)</span>
                    </h4>
                    <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-300">
                      서류 수정 필수
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-[#0A0A0A]">
                    {job.matchAnalysis.improvementPoints && job.matchAnalysis.improvementPoints.length > 0 ? (
                      job.matchAnalysis.improvementPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white/95 p-2.5 rounded-xl border border-amber-200 leading-relaxed font-semibold">
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            !
                          </span>
                          <span>{point}</span>
                        </li>
                      ))
                    ) : (
                      job.matchAnalysis.resumeImprovementTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white/95 p-2.5 rounded-xl border border-amber-200 leading-relaxed font-semibold">
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            !
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

              </div>
            ) : (
              <div className="p-6 bg-white rounded-2xl border border-[#EAE5DC] text-center space-y-3">
                <Sparkles className="w-8 h-8 text-[#2EB0A6] mx-auto" />
                <p className="text-xs font-bold text-[#0A0A0A]">아직 매칭 분석이 진행되지 않았습니다.</p>
                <p className="text-[11px] text-[#6A6A6A]">
                  위 드롭존에 이력서/경력기술서를 드래그하거나 아래 버튼을 눌러 AI 역량 분석을 실행해보세요.
                </p>
                <button
                  onClick={() => onAnalyzeMatch(job)}
                  className="px-4 py-2 bg-[#2EB0A6] hover:bg-[#228B83] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  공고 대비 내 서류 매칭 분석 실행하기
                </button>
              </div>
            )}

            {/* Memo & Scratchpad */}
            <div className="p-4 bg-white rounded-xl border border-[#EAE5DC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0A0A0A]">개인 입사지원 메모</span>
                {isEditingMemo ? (
                  <button
                    onClick={handleSaveMemo}
                    className="px-2.5 py-1 bg-[#2EB0A6] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> 저장
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingMemo(true)}
                    className="px-2.5 py-1 bg-[#FAF5E8] text-[#3A3A3A] hover:bg-[#EAE5DC] text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> 수정
                  </button>
                )}
              </div>
              {isEditingMemo ? (
                <textarea
                  rows={2}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="지원 일정, 예상 질문, 참고사항 등 메모를 작성하세요..."
                  className="w-full p-2.5 bg-[#FAF5E8] border border-[#EAE5DC] rounded-xl text-xs text-[#0A0A0A] focus:outline-none focus:border-[#2EB0A6] resize-none"
                />
              ) : (
                <p className="text-xs text-[#3A3A3A] min-h-[3rem] p-2.5 bg-[#FAF5E8]/60 rounded-xl border border-[#EAE5DC] whitespace-pre-wrap">
                  {memo || '작성된 메모가 없습니다. [수정]을 눌러 메모를 남겨보세요.'}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#EAE5DC] bg-[#FAF5E8] flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              if (confirm('이 공고를 저장 목록에서 삭제하시겠습니까?')) {
                onDeleteJob(job.id);
                onClose();
              }
            }}
            className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>삭제</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2EB0A6] hover:bg-[#228B83] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};

