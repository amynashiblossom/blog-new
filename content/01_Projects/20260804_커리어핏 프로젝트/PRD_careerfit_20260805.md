# 📄 [PRD] 커리어핏 (CareerFit) - AI JD 스크랩 및 서류 매칭 진단 플랫폼

## 1. 개요 및 배경 (Overview)
- 제품명: 커리어핏 (CareerFit)
- 서비스 컨셉: AI 모델 학습에 내 민감한 개인 이력서 데이터를 제공하지 않고, 채용공고(JD) URL/텍스트와 내 서류(이력서·경력기술서)를 1:1로 실시간 정밀 비교하여 역량 일치도와 보완점을 진단하는 맞춤형 지원 관리 플랫폼.
- 핵심 가치:
  - Zero-Training Privacy: 개인 이력서 데이터가 외부 AI 학습 데이터셋으로 유출 및 저장되지 않는 보안 중심 구조.
  - Smart Scraper: 채용공고 URL(링크드인, 원티드, 사람인 등) 또는 텍스트만 붙여넣으면 회사명, 직무, 주요 업무, 필수/우대조건, 마감일을 자동으로 구조화.
  - Actionable Gap Analysis: 강점 일치 항목과 보완이 필요한 공백(Gap) 항목, 그리고 자소서/면접용 추천 키워드를 즉시 제시.

---

## 2. 페인포인트와 해결하고자 하는 문제 (Problem & Solution)

### 2.1 페인포인트 (Pain Points)
1. AI 모델 학습 불안감: 시중의 AI 채용 서비스 이용 시 개인적이고 민감한 경력 정보와 이력서가 AI 모델의 재학습(Training) 데이터로 쓰일까 봐 불안함.
2. 복잡한 공고 분석: 채용 사이트마다 서식이 달라 핵심 업무(Tasks), 필수 자격요건(Requirements), 우대사항(Preferred)을 일일이 읽고 정리하는 데 시간이 오래 걸림.
3. 불명확한 서류 적합도: 특정 채용공고에 내 경력이 얼마나 부합하는지, 어떤 역량 문구가 부족하고 면접에서 무엇을 보완해야 하는지 객관적인 평가 기준이 없음.

### 2.2 해결 방안 (Solutions)
1. 비학습형 실시간 프롬프트 파싱: Gemini API의 세션 기반 실시간 파싱 방식을 적용하여 개인 데이터 저장/재학습 위험을 차단.
2. 1-Click Smart JD Extractor: 원티드/사람인/링크드인 등 지원 공고 URL이나 텍스트를 붙여넣으면 AI가 즉시 업무, 필수조건, 선호요건을 깔끔히 파싱.
3. 1:1 역량 일치 & 약점 보완 리포트: 좌측엔 JD 상세 내용, 우측엔 내 서류와의 일치 항목과 보완점, 자소서 반영 팁을 나란히 제공.
4. 드래그앤드롭 서류 관리 및 삭제: 매칭 분석에 사용된 이력서/경력기술서 파일을 칩 형태 및 휴지통 버튼으로 직관적으로 확인하고 즉시 삭제/재분석 가능.

---

## 3. 사용자 여정 (User Journey)
1. 내 이력서 등록 및 설정
   - 사용자 입사지원 기본 정보 입력 및 PDF/Word/TXT 이력서·경력기술서 파일 업로드.
2. 공고(JD) 스크랩
   - 상단 공고(JD) 붙여넣기 스크랩 클릭.
   - 링크드인 예시 URL(`https://www.linkedin.com/jobs/view/4445699622/`) 또는 직무 공고 텍스트 입력 후 분석 진행.
3. 공고와 매칭 (보드 View) 확인
   - 공고와 매칭 메뉴에서 스크랩한 공고를 지원 상태별(관심 공고, 서류 준비 중, 지원 완료 등)로 한눈에 확인.
4. JD 상세 분석 & 역량 진단
   - 공고 카드를 클릭하여 팝업 오픈.
   - 좌측: 공고 주요 업무(Tasks), 필수 자격요건(Requirements), 우대 및 선호요건(Preferred) 및 전체 원문 확인.
   - 우측: 내 서류와의 매칭률(%), 강점 일치 항목, 보완 필요 약점, 추천 액션 플랜 확인.
5. 첨부 서류 관리 & 재분석
   - 매칭 분석에 사용된 첨부 서류 옆의 휴지통 버튼을 클릭하여 불필요한 서류를 즉시 삭제하고 자동 재분석 진행.

---

## 4. 정보 구조 (IA: Information Architecture)
```text
[커리어핏 (CareerFit)]
├── GNV (상단 네비게이션)
│   ├── 서비스 로고 & 브랜딩 (CareerFit)
│   ├── [공고와 매칭] (지원 상태 카테고리 보드)
│   ├── [D-Day 타임라인] (서류/면접 일정 관리)
│   ├── [AI 역량매칭 진단] (전체 공고 통합 역량 매칭 분석)
│   └── [+ 공고(JD) 붙여넣기 스크랩] (스마트 JD 추출 모달)
│
├── 공고와 매칭 (Main Dashboard)
│   ├── 검색 및 직무/마감일 필터
│   └── 컬럼별 공고 카드 (관심 공고 / 서류 준비 중 / 지원 완료 / 서류 합격)
│       └── [공고 상세 모달]
│           ├── Left: JD 구조화 정보 (회사명, 직무, 업무내용, 필수요건, 우대사항, 원문)
│           ├── Right: AI 역량 매칭 분석 (매칭 점수, 일치점, 부족한 점, 보완 가이드)
│           └── Bottom: 매칭에 사용된 첨부 서류 칩 & 휴지통 삭제 기능
│
├── D-Day 타임라인 (Timeline View)
│   ├── 월별/주별 마감 예정 공고 캘린더
│   └── D-Day 및 상시채용/데드라인 미정 표기
│
└── AI 역량매칭 진단 (Match Report View)
    ├── 전체 스크랩 공고별 서류 매칭 스코어 요약
    └── 종합 커리어 약점 분석 및 키워드 추천
```

---

## 5. 디자인 시스템 & UX/UI 가이드라인 (Design)

### 5.1 컬러 팔레트 (Color Palette)
- Primary Accent: `#2EB0A6` (커리어핏 시그니처 틸 그린 - 신뢰감과 청량감 제공)
- Primary Hover: `#228B83`
- Background Canvas: `#FFFDF7` / `#FAF5E8` (눈이 편안한 따뜻한 웜 샌드/아이보리 톤)
- Border Neutral: `#EAE5DC` (은은한 가벼운 1px 테두리)
- Text Main: `#0A0A0A` (고대비 가독성 블랙)
- Text Sub: `#6A6A6A` (보조 설명 텍스트)
- Highlight Badges:
  - 필수 자격요건: Blue 계열 (`bg-blue-50`, `text-blue-900`, `border-blue-200`)
  - 우대/선호요건: Emerald 계열 (`bg-emerald-50`, `text-emerald-900`, `border-emerald-200`)
  - URL 예시/안내: Amber 계열 (`bg-amber-50`, `text-amber-950`, `border-amber-200`)

### 5.2 타이포그래피 (Typography)
- Display Header: Plus Jakarta Sans, Bold 18~22px
- Section Heading: SemiBold 14~16px
- Body Text**: Regular 13~14px (Line-height 1.6)
- Micro Badge / Label: Bold 10~11px (단일 라인 줄바꿈 방지)

### 5.3 UI 컴포넌트 원칙
- Responsive Layout: 데스크톱과 모바일 모드 모두 수평 스크롤 방지 및 카드 자동 재배치.
- Tactile Feedback: 버튼 및 클릭 요소 hover/active 애니메이션과 그림자 효과 적용.
- Clean Hierarchy: 중첩 카드 제거 및 충분한 여백(Spacing) 확보.

---

## 6. 예외 처리 (Error Handling & Edge Cases)

| 상황 (Edge Case) | 원인 | 예외 처리 및 UI/UX 대응 |
| :--- | :--- | :--- |
| URL 스크랩 실패/차단 | CORS 정책 또는 로그인 필요 페이지 | AI 파서가 수집 가능한 메타데이터 기반으로 기본틀을 생성하고, 사용자에게 "JD 직접 붙여넣기" 탭 유도 안내 |
| 마감일 미명시 | "채용시 마감", "상시 채용" 등 | 마감일을 데드라인 미정 (상시/채용시 마감)으로 표준화 처리하여 D-Day 오류 방지 |
| 서류 미첨부 상태 분석 | 이력서 파일이 없는 상태 | 기본 프로필 텍스트를 기반으로 1차 진단 후, "이력서/경력기술서 파일(PDF/Word)을 추가하면 더 정밀한 매칭이 가능합니다" 안내 노출 |
| 첨부 서류 전체 삭제 | 매칭 분석 서류 휴지통 삭제 시 | 삭제 즉시 해당 서류를 목록에서 제외하고, 나머지 남아있는 서류 기반으로 AI 매칭 스코어를 자동 재계산 및 갱신 |

---

## 7. 보안 및 개인정보 보호 (Security & Privacy)
1. In-Memory & Ephemeral Session Processing
   - 업로드된 이력서 파일 및 텍스트 데이터는 파싱 및 매칭 진단 즉시 메모리상에서만 처리되며, AI 모델의 재학습(Fine-tuning / RAG Training Data)에 활용되지 않습니다.
2. Server-Side API Key Hiding
   - Gemini API Key는 클라이언트 브라우저에 직접 노출되지 않고, 백엔드 Express 서버(`/api/*`)를 통해서만 안전하게 호출됩니다.
3. Granular File Revocation
   - 매칭에 사용된 첨부 서류는 언제든지 사용자가 휴지통 삭제 버튼을 통해 개별적으로 즉시 제거할 수 있습니다.

---

## 8. 기타 기술 사양 및 성공 지표 (Tech Specs & KPIs)

### 8.1 기술 아키텍처 (Tech Stack)
- Frontend: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- Backend: Node.js, Express, esbuild
- AI Engine: `@google/genai` (Gemini 3.6 Flash 모델 기반 구조화 파싱 및 역량 매칭)

### 8.2 성공 지표 (KPIs)
- JD 스크랩 성공률: URL 및 텍스트 파싱 성공률 > 95%
- 서류 매칭 만족도: AI 매칭 진단 리포트 유용성 점수 > 4.5/5.0
- 평균 지원 준비 시간 절감: 공고 분석 및 자소서 키워드 도출 시간 60분 → 10분 단축
