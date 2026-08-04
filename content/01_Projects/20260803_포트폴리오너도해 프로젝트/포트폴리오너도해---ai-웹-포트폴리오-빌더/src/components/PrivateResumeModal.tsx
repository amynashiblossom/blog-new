import React, { useState } from 'react';
import { PrivateResumeData } from '../types/job';
import { ShieldCheck, Lock, Save, Sparkles, CheckCircle2, X } from 'lucide-react';

interface PrivateResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResume: PrivateResumeData;
  onSave: (updated: PrivateResumeData) => void;
}

export const PrivateResumeModal: React.FC<PrivateResumeModalProps> = ({
  isOpen,
  onClose,
  currentResume,
  onSave,
}) => {
  const [title, setTitle] = useState(currentResume.title || '');
  const [summary, setSummary] = useState(currentResume.summary || '');
  const [skillsText, setSkillsText] = useState(
    (currentResume.techSkills || []).join(', ')
  );
  const [rawResumeText, setRawResumeText] = useState(
    currentResume.rawResumeText || ''
  );
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const skillsArray = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updated: PrivateResumeData = {
      ...currentResume,
      title,
      summary,
      techSkills: skillsArray,
      rawResumeText,
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    setIsSavedAlert(true);
    setTimeout(() => {
      setIsSavedAlert(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              내 서류 설정 (개인정보 비저장 방식)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              서버 DB에 영구 저장되지 않고, 오직 내 브라우저에만 암호화 보관됩니다.
            </p>
          </div>
        </div>

        {/* Security Banner */}
        <div className="mb-6 bg-slate-800/80 border border-emerald-500/30 rounded-xl p-4 flex items-start space-x-3">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-emerald-400">
              🔒 Privacy-First Zero-Training Security
            </p>
            <p>
              입력하신 이력서/포트폴리오 텍스트는 AI 모델 재학습(Training)에 사용되지 않으며, 공고 매칭 시 메모리상에서 일회성 계산만 수행됩니다.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              서류 타이틀
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 3년 차 프론트엔드 & AI 개발자 이력서"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              한 줄 요약 / 자기소개
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="예: React, TypeScript 기반 사용자 경험 최적화에 강점을 가진 개발자"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              보유 기술 스택 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="React, TypeScript, Node.js, Express, TailwindCSS, GA4, A/B 테스트"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              이력서 및 주요 성과 전체 텍스트 (Raw Resume Text)
            </label>
            <textarea
              rows={6}
              value={rawResumeText}
              onChange={(e) => setRawResumeText(e.target.value)}
              placeholder="이력서, 자기소개서, 프로젝트 경력 기술서 내용을 자유롭게 붙여넣으세요. AI가 채용공고의 자격요건과 자동으로 핏(Fit)을 계산합니다."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none leading-relaxed text-xs"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI 매칭 시 로컬 서류 데이터를 기반으로 부합도를 분석합니다.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              {isSavedAlert ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>보안 저장 완료!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>내 브라우저에 보안 저장</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
