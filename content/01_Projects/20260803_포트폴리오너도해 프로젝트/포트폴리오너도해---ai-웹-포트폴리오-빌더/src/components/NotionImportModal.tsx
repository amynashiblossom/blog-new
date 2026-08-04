import React, { useState, useEffect } from 'react';
import { ExperienceBlock, JobCategory } from '../types';
import {
  X,
  Database,
  Key,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface NotionImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBlock: (block: ExperienceBlock) => void;
  selectedCategory: JobCategory;
}

interface NotionPageItem {
  id: string;
  title: string;
  url: string;
  createdTime: string;
}

export const NotionImportModal: React.FC<NotionImportModalProps> = ({
  isOpen,
  onClose,
  onImportBlock,
  selectedCategory
}) => {
  const [apiKey, setApiKey] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [singlePageId, setSinglePageId] = useState('');
  const [jobCategory, setJobCategory] = useState<JobCategory>(selectedCategory);

  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [importingPageId, setImportingPageId] = useState<string | null>(null);
  const [fetchedPages, setFetchedPages] = useState<NotionPageItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('notion_api_key') || '';
    const savedDb = localStorage.getItem('notion_database_id') || '';
    setApiKey(savedKey);
    setDatabaseId(savedDb);
    setJobCategory(selectedCategory);
  }, [isOpen, selectedCategory]);

  if (!isOpen) return null;

  const handleFetchDatabase = async () => {
    if (!apiKey.trim()) {
      setErrorMsg('노션 API Key (Integration Secret Token)를 입력해주세요.');
      return;
    }
    if (!databaseId.trim()) {
      setErrorMsg('노션 Database ID 또는 URL을 입력해주세요.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoadingDb(true);

    try {
      // Save for user convenience
      localStorage.setItem('notion_api_key', apiKey.trim());
      localStorage.setItem('notion_database_id', databaseId.trim());

      const res = await fetch('/api/notion/fetch-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          databaseId: databaseId.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || '노션 데이터베이스 조회 실패');
      }

      setFetchedPages(data.pages || []);
      setSuccessMsg(`성공적으로 ${data.pages.length}개의 노션 문서를 불러왔습니다!`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '노션 데이터베이스 연결 실패');
    } finally {
      setIsLoadingDb(false);
    }
  };

  const handleImportPage = async (pageId: string) => {
    setImportingPageId(pageId);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/notion/import-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          pageId,
          jobCategory
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.block) {
        throw new Error(data.message || data.error || '노션 페이지 변환 실패');
      }

      onImportBlock(data.block);
      setSuccessMsg(`'${data.block.notionSpec.projectName}' 항목이 경험 블록에 성공적으로 추가되었습니다!`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '노션 문서 변환 중 오류가 발생했습니다.');
    } finally {
      setImportingPageId(null);
    }
  };

  const handleDirectSinglePageImport = async () => {
    if (!singlePageId.trim()) {
      setErrorMsg('가져올 노션 페이지 ID 또는 URL을 입력해주세요.');
      return;
    }
    await handleImportPage(singlePageId.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
              <Database className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                노션(Notion) MCP 연동 & 데이터 가져오기
                <span className="text-xs bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/20 font-medium">
                  AI Auto-Struct
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                노션 프로젝트 노트를 AI가 분석하여 포트폴리오 STAR 경험 블록으로 자동 생성합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Messages */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">오류: </span>
                {errorMsg}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Configuration Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" />
                1. 노션 API 설정 (Notion Integration)
              </h4>
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showGuide ? '가이드 접기' : 'API Key 발급 가이드'}
              </button>
            </div>

            {/* Guide Accordion */}
            {showGuide && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-slate-700 space-y-2">
                <p className="font-semibold text-indigo-900">💡 노션 API 연동 3단계 가이드:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>
                    <a
                      href="https://www.notion.so/my-integrations"
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 underline font-medium inline-flex items-center gap-0.5"
                    >
                      노션 내 API 개발자 페이지 <ExternalLink className="w-3 h-3" />
                    </a>
                    로 이동하여 '새 API 통합 생성'을 진행합니다.
                  </li>
                  <li>발급받은 <strong>API 통합 시크릿 토큰(secret_...)</strong>을 아래 API Key 란에 입력합니다.</li>
                  <li>가져올 노션 데이터베이스/페이지의 우측 상단 <strong>[...]메뉴 → [연동하기/Integration]</strong>에서 만든 통합 앱을 추가 허용합니다.</li>
                </ol>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  노션 API Key (Integration Secret Token)
                </label>
                <input
                  type="password"
                  placeholder="secret_xxxxxxxxxxxxxxxx..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  노션 Database ID 또는 DB URL
                </label>
                <input
                  type="text"
                  placeholder="https://notion.so/... 또는 32자리 ID"
                  value={databaseId}
                  onChange={(e) => setDatabaseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">생성할 직군:</span>
                <select
                  value={jobCategory}
                  onChange={(e) => setJobCategory(e.target.value as JobCategory)}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-800 outline-none"
                >
                  <option value="PM/PO">PM/PO</option>
                  <option value="서비스기획자">서비스기획자</option>
                  <option value="프론트엔드">프론트엔드</option>
                  <option value="백엔드">백엔드</option>
                  <option value="UI/UX 디자이너">UI/UX 디자이너</option>
                  <option value="그로스마케터">그로스마케터</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleFetchDatabase}
                disabled={isLoadingDb}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                {isLoadingDb ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    DB 동기화 중...
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    데이터베이스 문서 목록 검색
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Direct Single Page Section */}
          <div className="p-4 border border-dashed border-slate-300 rounded-2xl bg-white space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              또는 특정 노션 단일 페이지 URL/ID 직접 가져오기
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="노션 페이지 URL 또는 Page ID"
                value={singlePageId}
                onChange={(e) => setSinglePageId(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleDirectSinglePageImport}
                disabled={importingPageId === singlePageId}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
              >
                {importingPageId === singlePageId ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                )}
                AI 변환 가져오기
              </button>
            </div>
          </div>

          {/* Fetched Pages List */}
          {fetchedPages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-600" />
                  검색된 노션 데이터베이스 문서 ({fetchedPages.length}개)
                </h4>
                <span className="text-[11px] text-slate-500">
                  클릭 시 AI가 STAR 양식으로 변환하여 경험 블록에 추가합니다.
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {fetchedPages.map((page) => {
                  const isImporting = importingPageId === page.id;
                  return (
                    <div
                      key={page.id}
                      className="p-3.5 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-between transition-all shadow-sm hover:shadow"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <h5 className="text-xs font-bold text-slate-800 truncate">
                            {page.title}
                          </h5>
                          <p className="text-[11px] text-slate-400">
                            생성일: {new Date(page.createdTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleImportPage(page.id)}
                        disabled={isImporting}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 border border-indigo-200"
                      >
                        {isImporting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            AI 분석 중...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            경험 블록 추가
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>🔒 노션 API Key는 브라우저 내부(LocalStorage)에만 안전하게 보관됩니다.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
