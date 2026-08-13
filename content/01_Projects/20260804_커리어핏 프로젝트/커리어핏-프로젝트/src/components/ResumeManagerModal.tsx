import React, { useState, useRef } from 'react';
import { UserResume, ResumeFile } from '../types';
import { X, Save, Plus, Trash2, FileText, UploadCloud, FileCheck, CheckCircle2, FileCode, AlertCircle, FileSpreadsheet, Eye, ExternalLink } from 'lucide-react';

interface ResumeManagerModalProps {
  isOpen: boolean;
  userResume: UserResume;
  onClose: () => void;
  onSaveResume: (updatedResume: UserResume) => void;
}

export const ResumeManagerModal: React.FC<ResumeManagerModalProps> = ({
  isOpen,
  userResume,
  onClose,
  onSaveResume
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(userResume.title);
  const [summary, setSummary] = useState(userResume.summary);
  const [experienceYears, setExperienceYears] = useState(userResume.experienceYears);
  const [skills, setSkills] = useState<string[]>(userResume.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [portfolioSummary, setPortfolioSummary] = useState(userResume.portfolioSummary);
  const [attachedFiles, setAttachedFiles] = useState<ResumeFile[]>(userResume.attachedFiles || []);
  
  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Helper for human-readable file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Handle files processing
  const handleProcessFiles = (filesList: FileList | File[]) => {
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    let addedCount = 0;
    const newResumeFiles: ResumeFile[] = [];

    filesArray.forEach((file) => {
      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const fileExt = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      
      const newFileObj: ResumeFile = {
        id: fileId,
        name: file.name,
        size: formatFileSize(file.size),
        type: fileExt,
        uploadedAt: new Date().toISOString().split('T')[0]
      };

      // Read text content if plain text/markdown
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const textContent = e.target?.result as string;
          if (textContent) {
            newFileObj.extractedText = textContent;
            // Optionally auto-append or set summary if empty
            if (!summary.trim()) {
              setSummary(textContent.substring(0, 500) + (textContent.length > 500 ? '...' : ''));
            }
          }
        };
        reader.readAsText(file);
      } else {
        newFileObj.extractedText = `[${file.name}] 서류 파싱 등록 완료 (${newFileObj.size}). 이력서/경력증명서 첨부됨.`;
      }

      newResumeFiles.push(newFileObj);
      addedCount++;
    });

    setAttachedFiles((prev) => [...prev, ...newResumeFiles]);
    setUploadMessage(`${addedCount}개 서류가 정상적으로 첨부 및 저장되었습니다.`);
    setTimeout(() => setUploadMessage(null), 4000);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (idToRemove: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== idToRemove));
  };

  const handleSave = () => {
    onSaveResume({
      title,
      summary,
      experienceYears: Number(experienceYears) || 0,
      skills,
      portfolioSummary,
      lastUpdated: new Date().toISOString().split('T')[0],
      attachedFiles
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FFFDF7] w-full max-w-3xl rounded-2xl border border-[#EAE5DC] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-[#EAE5DC] bg-[#FAF5E8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2EB0A6] text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0A0A0A]">내 이력서 / 경력증명서 관리</h2>
              <p className="text-xs text-[#6A6A6A]">이력서, 경력증명서, 포트폴리오 서류를 드래그하여 바로 등록 및 관리하세요.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6A6A6A] hover:text-[#0A0A0A] hover:bg-black/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* 저장된 내 서류/공고 확인 안내 카드 */}
          <div className="p-4 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-start gap-3 text-xs">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-sm">
              💡
            </div>
            <div className="flex-1 space-y-1 text-amber-950">
              <h4 className="font-bold text-xs text-amber-950">
                저장된 내 서류/공고 확인 안내
              </h4>
              <p className="text-amber-900 leading-relaxed font-medium">
                작성하신 데이터는 현재 사용 중이신 브라우저에 안전하게 보관됩니다.
              </p>
              <p className="text-amber-900 leading-relaxed font-medium">
                언제든 북마크해두시거나{' '}
                <a
                  href="https://careerfit-app-ten.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-amber-900 hover:text-amber-700 inline-flex items-center gap-0.5"
                >
                  https://careerfit-app-ten.vercel.app/
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
                {' '}주소로 직접 접속하시면 저장해두신 공고와 분석 결과를 다시 확인하실 수 있습니다.
              </p>
              <p className="text-amber-800/80 text-[11px] pt-0.5 font-normal">
                (※ 다른 브라우저나 기기, 시크릿 모드로 접속 시에는 로컬 저장소가 달라져 보이지 않을 수 있습니다.)
              </p>
            </div>
          </div>

          {/* Drag & Drop File Upload Zone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0A0A0A] flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-[#2EB0A6]" />
                이력서 & 경력증명서 서류 파일 끌어다 놓기 (Drag & Drop)
              </label>
              <span className="text-[11px] text-[#6A6A6A]">PDF, Word, TXT, HWP, 이미지 지원</span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#2EB0A6] bg-[#E6F7F5] scale-[1.01] shadow-lg'
                  : 'border-[#2EB0A6]/40 bg-[#FAF5E8]/60 hover:bg-[#E6F7F5]/40 hover:border-[#2EB0A6]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && handleProcessFiles(e.target.files)}
                multiple
                accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.hwp"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${
                  isDragging ? 'bg-[#2EB0A6] text-white scale-110' : 'bg-[#E6F7F5] text-[#2EB0A6]'
                }`}>
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0A0A0A]">
                    {isDragging ? '여기에 서류를 놓으세요!' : '이력서 및 경력증명서를 이 곳에 끌어다 놓으세요'}
                  </p>
                  <p className="text-xs text-[#6A6A6A] mt-0.5">
                    또는 클릭하여 파일(PDF, Word, TXT)을 지정하세요
                  </p>
                </div>
              </div>
            </div>

            {uploadMessage && (
              <div className="mt-2.5 p-2.5 bg-[#E6F7F5] border border-[#2EB0A6]/40 rounded-xl text-xs text-[#2EB0A6] font-bold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{uploadMessage}</span>
              </div>
            )}

            {/* Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-bold text-[#0A0A0A]">등록된 첨부 서류 ({attachedFiles.length}건):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {attachedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 bg-white border border-[#EAE5DC] rounded-xl flex items-center justify-between shadow-2xs hover:border-[#2EB0A6] transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#E6F7F5] text-[#2EB0A6] font-bold text-xs flex items-center justify-center shrink-0">
                          {file.type}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0A0A0A] truncate">{file.name}</p>
                          <p className="text-[10px] text-[#6A6A6A]">{file.size} • {file.uploadedAt}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {file.extractedText && (
                          <button
                            type="button"
                            onClick={() => setPreviewText(previewText === file.extractedText ? null : (file.extractedText || null))}
                            className="p-1.5 text-[#6A6A6A] hover:text-[#2EB0A6] rounded-md transition-colors"
                            title="내용 보기"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-1.5 text-[#6A6A6A] hover:text-red-600 rounded-md transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewText && (
              <div className="mt-2.5 p-3 bg-white border border-[#2EB0A6]/30 rounded-xl text-xs text-[#3A3A3A] relative">
                <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#EAE5DC]">
                  <span className="font-bold text-[#2EB0A6] flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> 서류 내용 원본 텍스트
                  </span>
                  <button onClick={() => setPreviewText(null)} className="text-[#6A6A6A] hover:text-[#0A0A0A]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">{previewText}</p>
              </div>
            )}
          </div>
          
          <hr className="border-[#EAE5DC]" />

          {/* Resume Title & Exp */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
                이력서 프로필 헤드라인:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 3년차 테크 PM 및 프론트엔드 엔지니어"
                className="w-full px-3 py-2 bg-white border border-[#EAE5DC] rounded-xl text-sm font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#2EB0A6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
                경력 연차 (년):
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#EAE5DC] rounded-xl text-sm font-semibold text-[#0A0A0A] focus:outline-none focus:border-[#2EB0A6]"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
              핵심 자기소개 / 경력 요약:
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="주요 강점과 커리어 방향성을 입력해 주세요..."
              className="w-full p-3 bg-white border border-[#EAE5DC] rounded-xl text-xs text-[#0A0A0A] focus:outline-none focus:border-[#2EB0A6] resize-none"
            />
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
              보유 핵심 역량 & 기술 스택 태그:
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="예: React, TypeScript, GA4, A/B테스트, SQL, 지급결제"
                className="flex-1 px-3 py-2 bg-white border border-[#EAE5DC] rounded-xl text-xs text-[#0A0A0A] focus:outline-none focus:border-[#2EB0A6]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 bg-[#2EB0A6] hover:bg-[#228B83] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> 추가
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 bg-[#FAF5E8] rounded-xl border border-[#EAE5DC] min-h-[50px]">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white border border-[#2EB0A6]/40 text-[#2EB0A6] font-bold text-xs rounded-lg flex items-center gap-1 shadow-2xs"
                >
                  <span>✓ {skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio Summary */}
          <div>
            <label className="block text-xs font-bold text-[#0A0A0A] mb-1">
              포트폴리오 대표 성과 & 수치적 결과:
            </label>
            <textarea
              rows={3}
              value={portfolioSummary}
              onChange={(e) => setPortfolioSummary(e.target.value)}
              placeholder="예: 결제 퍼널 개선으로 이탈율 18% 감소, 신규 유저 활성화 A/B 테스트 진행..."
              className="w-full p-3 bg-white border border-[#EAE5DC] rounded-xl text-xs text-[#0A0A0A] focus:outline-none focus:border-[#2EB0A6] resize-none"
            />
          </div>

          {/* 경영민감정보 보안 고지 */}
          <div className="p-3 bg-[#FAF5E8] border border-[#EAE5DC] rounded-xl text-[11px] text-[#6A6A6A] leading-relaxed flex items-start gap-2">
            <span className="text-sm mt-0.5">🔒</span>
            <div>
              <p className="font-semibold text-[#0A0A0A]">경영민감정보 및 데이터 보안 고지</p>
              <p>
                작성하신 경영민감정보 및 이력서 데이터는 커리어핏 외부 서버에 저장되지 않으며, 암호화되어 오직 사용자의 로컬 브라우저(스토리지)에만 안전하게 보관됩니다.
                <span className="block mt-1 text-[#8A5B00] font-medium">* 다만 커리어핏과 무관하게 Gemini 자체적으로 정보를 수집/활용하려고 하는 경우 커리어핏 서비스에 책임이 없음을 고지합니다.</span>
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAE5DC] bg-[#FAF5E8] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#6A6A6A] hover:text-[#0A0A0A]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#2EB0A6] hover:bg-[#228B83] text-white font-bold text-xs rounded-xl shadow-md shadow-[#2EB0A6]/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>이력서 & 서류 정보 저장</span>
          </button>
        </div>

      </div>
    </div>
  );
};
