# [PRD] 커리어핏 (CareerFit) - AI 기반 공고 스크랩 & 서류 역량 매칭 서비스

## 1. 프로젝트 개요 (Project Overview)
- **제품명**: 커리어핏 (CareerFit)
- **서비스 목적**: 구직자가 채용 공고(JD) URL 또는 텍스트를 스크랩하면, AI가 주요 업무·필수 자격요건·선호 요건을 구체화하여 정밀 분석하고, 구직자의 이력서/경력기술서와 비교하여 매칭률, 강점, 보완점 및 맞춤형 개선안을 즉시 제공하는 채용 보조 서비스입니다.

---

## 2. 핵심 변경 및 요구사항 반영 내역 (Key Features & Updates)

### 2.1. 채용 공고(JD) 스크랩 및 파싱 고도화
- **URL 및 텍스트 파싱 일원화**: URL(링크드인, 원티드, 사람인 등) 및 직접 붙여넣은 텍스트 모두에서 동일하게 공고 전체 상세 내용을 추출 및 보존합니다.
- **구체적인 3대 요소 자동 분류**:
  - **주요 업무 (Tasks & Responsibilities)**: 생략 없이 공고 내 R&R 항목을 목록 형태로 상세 파싱
  - **필수 자격요건 (Requirements)**: 학력, 경력, 필수 기술 스택 및 자격증 항목 상세 추출
  - **우대 및 선호요건 (Preferred)**: 우대 기술, 도메인 경험 및 우대사항 추출
- **사용자 편의성 가이드**:
  - URL 입력란 상단에 링크드인 예시 URL (`https://www.linkedin.com/jobs/view/4445699622/`) 안내 및 원클릭 예시 URL 자동 입력 버튼 제공.

### 2.2. 메뉴 명칭 및 구조 최적화
- 기존 **"지원 칸반 보드"** 명칭을 **"공고와 매칭"**으로 직관적으로 변경.
- GNB(상단 네비게이션) 메뉴 레이아웃 정리: 중복되던 메뉴를 정리하고 **[공고와 매칭]**, **[D-DAY 타임라인]**, **[AI 역량매칭 진단]** 중심의 명확한 사용자 동선 제공.

### 2.3. 공고 상세 및 서류 매칭 인터페이스 (좌: 공고 / 우: 서류 매칭)
- **2-Column 매칭 뷰**:
  - **좌측**: 스크랩한 채용공고의 주요 업무, 필수 자격요건, 우대사항 및 원문 전체 정보.
  - **우측**: 사용자 서류(이력서/경력기술서) 기반 AI 매칭 리포트 (매칭 점수, 일치하는 역량, 부족한 자격요건, 보완 가이드).
- **첨부 서류 삭제 (휴지통 버튼) 기능**:
  - 매칭 분석에 사용된 첨부 서류 태그 옆에 휴지통(<Trash2>) 아이콘 추가.
  - 특정 서류를 삭제하면 남아있는 서류를 기반으로 AI 공고 매칭을 즉시 자동 재분석.

---

## 3. 주요 사용자 흐름 (User Flow)

1. **공고 스크랩**:
   - 상단 [공고 스크랩하기] 버튼 클릭
   - 채용 공고 URL(예: `https://www.linkedin.com/jobs/view/4445699622/`)을 입력하거나 JD 텍스트 직접 입력
2. **공고와 매칭 탭 이동**:
   - 관심 공고 카드 선택 시 좌측에는 JD 전체 상세 내용, 우측에는 내 서류와의 역량 매칭 리포트가 출현
3. **첨부 서류 관리**:
   - 매칭 분석 영역에서 불필요한 서류는 휴지통 아이콘을 눌러 개별 삭제
   - 삭제 즉시 최신 서류 기준으로 AI 매칭 분석 갱신

---

## 4. 기술 아키텍처 (Technical Architecture)

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express (Cloud Run Container 환경)
- **AI Engine**: `@google/genai` (Gemini 3.6 Flash 기반 JSON 파싱 및 역량 매칭)
- **주요 API**:
  - `POST /api/scrape-jd`: URL/텍스트를 입력받아 AI가 `companyName`, `title`, `position`, `dueDate`, `tasks`, `requirements`, `preferred`, `keywords`, `fullRawText` 구조체 반환

---

## 5. 파일 구조 (Key Component Structure)

- `server.ts`: Express API 서버 및 Gemini AI JD 파서/매칭 로직
- `src/components/Navbar.tsx`: 네비게이션 바 ("공고와 매칭" 명칭 및 메뉴 구조)
- `src/components/JobScraperModal.tsx`: JD URL 및 텍스트 스크랩 모달 (링크드인 URL 가이드 포함)
- `src/components/JobDetailModal.tsx`: 좌측 공고 상세 / 우측 AI 매칭 분석 뷰 및 첨부서류 휴지통 삭제 기능
- `src/components/AIMatchReport.tsx`: 매칭점수, 일치사항, 부족한 부분 분석 리포트 컴포넌트
