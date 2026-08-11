# [PRD] 커리어핏 (CareerFit) - AI 기반 공고 스크랩 & 서류 역량 매칭 및 스케줄링 통합 플랫폼 (v7.0)

## 📄 개정 이력 (Revision History)

| 버전 | 개정일자 | 주요 변경 및 개편 내용 |
|:---:|:---:|---|
| **v1.0** | 2026-08-04 | Node.js Express 백엔드 및 Gemini AI 파서 초기 구축 |
| **v2.0** | 2026-08-05 | 브라우저 중심 Pure SPA 구조 전환 및 LocalStorage 기본 데이터 연동 |
| **v3.0** | 2026-08-06 | 2-Column 매칭 뷰(좌: 공고 / 우: 서류분석) 도입 및 첨부서류 개별 휴지통 삭제 기능 추가 |
| **v4.0** | 2026-08-07 | Gemini 2.5 REST API 연동, 오프라인 Fallback 엔진, 커스텀 전형 타임라인 및 이력서 XOR 암호화 |
| **v5.0** | 2026-08-08 | API Key 유출 완벽 차단을 위한 Supabase Edge Function (`gemini-proxy`) 서버 사이드 프록시 도입 및 PII 개인정보 자동 마스킹 처리 |
| **v6.0** | 2026-08-08 | [약관 회피 & 범용 AI 대비 보안 차별화] 텍스트 직접 복사·붙여넣기(Paste) 중심 메인 UX 전환, B2C 개인 생산성 도구 정체성 확립, Claude/ChatGPT 직접 입력 대비 PII 마스킹·Zero-Training 보안 명분 재정립 |
| **v6.1** | 2026-08-08 | 모바일(폰) UI/UX 최적화: 하단 네비게이션 탭 3개 통일(`공고랑 매칭`, `타임라인`, `AI진단`), 상태 필터 라벨 명칭 정제(`관심공고`) 및 텍스트 줄바꿈 방지(`whitespace-nowrap`) |
| **v6.2** | 2026-08-08 | 칸반보드 UI/UX 최적화: `관심공고` 컬럼 가로 너비 확장, 컬럼 헤더 내 '공고 스크랩' 전용 버튼 배치, 텍스트·아이콘 줄바꿈/축소 방지(`shrink-0`, `whitespace-nowrap`) 적용 |
| **v7.0** | 2026-08-10 | JD 스크랩 노이즈 정제(`회사 로고`, 이미지 alt 필터링), 더미 키워드 전면 개편, 직무 도메인 분류기(`detectJobDomain`) 및 이종 직무 간(HR ↔ PM 등) 감점 페널티(-30점) 도입으로 정직한 적합도 평가 체계 구축 |
| **v7.1** | 2026-08-10 | [JD 공고 파서 원문 보존 & 대체어 제거] 파싱 시 과도한 필터링으로 인한 무의미한 대체어('채용 기업', '해당 직무') 강제 전환 문제 수정. 불확실하더라도 원문 첫 줄 및 상단 문구를 기본 제목/회사명/직무로 보존하고 상시 채용 기본값 미정 처리를 안정화. |
| **v7.2** | 2026-08-10 | [지능형 공고 파서 & 중개 플랫폼 예외 제약 강화] 5단계 스마트 추출 엔진(`smartExtractCompanyAndPosition`) 도입으로 회사명/직무명 인식 정확도 극대화. 링크드인, 원티드, 잡코리아, 사람인 등 구인 중개 플랫폼 도메인은 기업명 추론 대상에서 엄격히 제외하도록 예외 차단 로직 적용. |
| **v7.3** | 2026-08-11 | [기능 명세 명확화 & 보안 규격 정제] 외부 AI 학습을 차단하는 1회성 API 연동 기반의 실시간 갭(Gap) 진단 (※ 입력 데이터는 구글 모델 학습에 활용되지 않도록 파이프라인 처리) 기능 명세 추가 및 뱃지/명세 정정 반영. |
| **v7.4** | 2026-08-11 | [보안 명세 & 책임 한계 고지] '외부 AI 학습을 차단하는 1회성 API 연동 기반의 실시간 갭(Gap) 진단' 명세 명확화 및 Gemini 프로바이더 단의 자체 학습 반영 건에 대한 서비스 책임 한계(Disclaimer) 문구 반영. |
| **v7.5** | **2026-08-11** | **[경영민감정보 로컬 암호화 보관 및 Gemini 자체 수집 책임한계 고지 반영] 경영민감정보 및 이력서 데이터의 로컬 암호화 저장 고지 및 Gemini 자체 수집/활용 시 서비스 책임한계(Disclaimer) 고지 문구 반영.** |
| **v7.6** | **2026-08-11** | **[Vercel CLI 프로덕션 배포 파이프라인 및 로컬 데이터 암호화 워크플로우 명세 보완] Vercel 자동 배포 연동 및 브라우저 로컬 암호화(XOR+Base64) 보관 프로세스와 보안 데이터 흐름 시각화 명세 수록.** |



---

## 1. 프로젝트 개요 (Project Overview)

- **제품명**: 커리어핏 (CareerFit)
- **서비스 목적**: 구직자가 채용 공고(JD)를 **사적으로 수집·분석·스케줄링하는 100% B2C 개인용 생산성 대시보드(Productivity Tool)**입니다. 구직자가 공고 텍스트를 직접 복사·붙여넣거나 URL을 입력하면, **Google Gemini 2.5 AI**가 주요 업무·필수 자격요건·우대사항을 구체화하여 정밀 파싱하고, 구직자의 이력서/경력기술서와 대조하여 매칭 점수, 맞춤형 강점, 보완점, 서류 작성 팁 및 예상 면접 질문을 제공합니다.
- **v6.0 핵심 개편 및 전략적 명분 (Strategic Why & Privacy)**:
  1. **플랫폼 약관 충돌 회피 (텍스트 직접 복사·붙여넣기 메인 UX)**:
     - 채용 플랫폼 HTML을 자동 크롤링하는 방식은 무단 파싱/약관 위반 마찰 위험이 있습니다.
     - 커리어핏은 구직자가 사적 개인 이용 목적으로 직접 공고 텍스트를 복사하여 서비스에 붙여넣는(Paste) 형태를 **메인(Primary) UX**로 삼아 법적·기술적 약관 이슈를 완벽히 회피합니다. (URL 파싱은 보조 지원)
  2. **B2C 개인용 Productivity Tool 정체성 정의**:
     - 커리어핏은 공고를 제3자에게 재배포하거나 채용을 중개하는 플랫폼이 아니라, Notion이나 Obsidian처럼 **"구직자 개인이 본인의 지원 현황과 일정을 모아 정돈하는 100% 사적 개인 대시보드"**로 정의하여 크롤링 제재 및 법적 위험을 원천 차단합니다.
  3. **범용 AI(Claude, ChatGPT 등) 직접 입력 대비 압도적 보안 및 UX 차별화 (Why 재정립)**:
     - **범용 AI 웹 서비스 직접 입력의 문제점**: 구직자가 Claude, ChatGPT 등의 웹 챗봇에 이력서를 직접 업로드/복사하면, 연락처·이메일 등 민감 개인정보(PII)가 텍스트 그대로 전송되고 모델 학습 데이터로 활용될 보안 위험이 있으며, 공고 대조 결과를 타임라인 캘린더나 매칭 대시보드로 체계화할 수 없습니다.
     - **커리어핏만의 보안 차별성 및 책임 한계 고지**:
       - 🛡️ **PII 자동 마스킹**: Supabase Edge Function 프록시가 이메일, 전화번호 등 민감한 개인정보를 마스킹(`[이메일]`, `[연락처]`) 처리 후 AI 모델로 전송합니다.
       - 🔒 **외부 AI 학습 차단 1회성 API 연동 기반 실시간 갭(Gap) 진단**: 챗봇 서비스와 달리 1회성 API 호출 파이프라인으로 모델 재학습 데이터 활용을 차단합니다. *(※ 입력 데이터는 구글 모델 학습에 활용되지 않도록 파이프라인 처리(학습 미반영)하나, Gemini 등 외부 LLM 프로바이더 단에서 자체적으로 반영하게 된 부분에 대해서는 본 서비스에서 책임을 지지 않습니다.)*
       - 🔑 **로컬 암호화 보관소**: 이력서 원문은 사용자 브라우저(`localStorage`)에만 XOR + Base64로 암호화되어 보관됩니다.
  4. **파편화된 채용 전형의 단일 타임라인 통합 관리**:
     - 여러 채용 공고와 1/2차 면접, 과제 제출 등 커스텀 일정을 단 하나의 '월간 타임라인 캘린더'로 모아서 효율적으로 트래킹합니다.
  5. **Zero Trust Security (Supabase Edge Function Proxy)**:
     - Gemini API Key를 Deno 런타임 기반의 Supabase Edge Function (`gemini-proxy`) Secrets으로 은닉 관리하여 클라이언트 API Key 노출을 원천 차단합니다.

---

## 2. 주요 기능 및 상세 명세 (Key Features & Specifications)

### 2.1. 약관 안전 텍스트 복사 중심 입력 & 하이브리드 파서 UX (`src/components/JobScraperModal.tsx`)
- **메인 입력 UX (Primary)**:
  - '공고 텍스트 직접 복사·붙여넣기(Paste)'를 기본 메인 탭으로 배치.
  - 유저가 구인 사이트에서 드래그하여 복사한 raw 텍스트를 붙여넣으면 Gemini 2.5 AI가 주요 업무 / 필수 자격요건 / 우대사항 / 마감일 / 기업명 / 직무를 자동으로 추출 및 정규화 구조화.
- **보조 입력 UX (Secondary)**:
  - '공고 URL 입력'을 보조 옵션으로 제공하여 로컬 및 백업 엔진으로 파싱 지원.
- **하이브리드 지원**:
  - 1차: Supabase `gemini-proxy` 기반 Gemini 2.5 AI 구조화 파싱 (`isAiParsed: true`).
  - 2차 (Fallback): 네트워크 단절 또는 API 장애 발생 시 0.1초 만에 `pureLocalScrapeEngine` 로컬 정규식 엔진으로 무중단 자동 전환.

### 2.2. Supabase Edge Function 기반 보안 AI 프록시 (`supabase/functions/gemini-proxy`)
- **보안 엔드포인트**: `POST https://<project-ref>.supabase.co/functions/v1/gemini-proxy`
- **보안 매커니즘**:
  - `GEMINI_API_KEY`는 Supabase Dashboard Secrets에서만 관리되며 클라이언트 번들에 절대로 노출되지 않습니다.
  - 요청 데이터 본문의 PII(이메일, 연락처, 외부링크 등)를 정규식 검사로 자동 마스킹(`[이메일]`, `[연락처]`) 후 AI 모델로 안전 전송.
  - CORS 보안 설정으로 인가된 앱 요청만 중계 처리.

### 2.3. 공고 상세 & 서류 매칭 인터페이스 (2-Column View)
- **좌측 Column**: 채용공고 기본 정보, 구체화된 3대 요소(주요 업무 / 필수 자격 / 우대사항), 키워드 태그 및 원문 텍스트.
- **우측 Column**: 외부 AI 학습을 차단하는 1회성 API 연동 기반의 실시간 갭(Gap) 진단 (※ 입력 데이터는 구글 모델 학습에 활용되지 않도록 파이프라인 처리/학습 미반영하나, Gemini 자체 정책에 의해 반영되는 부분에 대해서는 서비스에서 책임을 지지 않습니다) 및 AI 매칭 리포트 (매칭 점수, 부합하는 강점, 보완할 점, 추천 작성 팁, 예상 면접 질문).
- **첨부 서류 개별 삭제 (휴지통 기능)**:
  - 첨부 서류 태그 옆 휴지통 아이콘 클릭 시 해당 서류를 즉시 제외하고 남은 서류 기준 AI 매칭 리포트 자동 재계산.

### 2.4. 통합 커스텀 전형 일정 관리 및 D-Day 타임라인 (`src/components/TimelineView.tsx`)
- 공고별 커스텀 전형(1차 면접, 과제 제출, 2차 면접 등) CRUD 지원.
- 여러 채용 플랫폼에서 수집한 공고의 공식 마감일(🔴 마감)과 개인 전형 일정(📅 일정)을 단일 월간 타임라인 캘린더에서 테마 칩으로 동시 트래킹.

### 2.5. Claude/ChatGPT 대비 '노-학습 / PII 마스킹' 로컬 보안 서류고 (`src/utils/crypto.ts`)
- 구직자의 이력서 프로필 및 경영민감 경력기술서 원문이 `localStorage` (`jd_archive_resume_v1`)에 저장될 때 XOR + Base64 암호화(`ENC_V1_...`) 처리.
- Claude/ChatGPT 등 범용 AI 웹 서비스와 달리 개인 정보(이메일/전화번호) PII 자동 마스킹 후 API를 호출하며, AI 모델 재학습 이용 0% 보장.
- **경영민감정보 및 데이터 보안 고지 표기**: 이력서 등록 모달(`ResumeManagerModal.tsx`) 및 스크랩 모달(`JobScraperModal.tsx`) 하단에 *"경영민감정보 및 이력서 데이터는 외부 서버에 절대 저장되지 않으며, 암호화되어 오직 사용자의 로컬 브라우저(스토리지)에만 안전하게 보관됩니다"*라는 보안 명세를 명확히 고지하여 사용자 안심과 데이터 주권 보증.

### 2.6. 모바일(폰) 웹 반응형 UI/UX 최적화 (`src/components/Navbar.tsx`)
- **하단 네비게이션 탭 정리**: 모바일 접속 시 PC 화면과 동일하게 `공고랑 매칭`, `타임라인`, `AI진단` 3개 버튼만 노출하여 중복 탭(`내 이력서`) 제거 및 직관적 동선 확보.
- **상태 필터 텍스트 줄바꿈 방지**: 모바일 화면 폭에서 `관심 공고` 텍스트가 줄바꿈되는 현상을 방지하고자 `관심공고`로 라벨을 단일화하고 `whitespace-nowrap` 스타일을 적용하여 매끄러운 가로 스크롤 칩 UI 구현.

### 2.7. 칸반보드 대시보드 UI/UX 최적화 (`src/components/KanbanBoard.tsx`)
- **관심공고 컬럼 가로 너비 확장**: 공고 수집 단계의 높은 카드 밀도를 고려해 '관심공고' 컬럼을 비대칭 확장(`flex-[1.35]`, `min-w-[270px]`)하여 가독성 증대.
- **컬럼 헤더 직관적 공고 스크랩 CTA 배치**: 관심공고 컬럼 헤더에 '+ 공고 스크랩' 전용 버튼을 배치하여 모달 진입 접근성 향상.
### 2.8. JD 파싱 노이즈 정제 및 직무 도메인 감점 매칭 엔진 (`src/utils/gemini.ts`)
- **지능형 기업명/직무명 5단계 스마트 추출 파서 (`smartExtractCompanyAndPosition`) (v7.2)**:
  - 1) `회사명: OOO`, `기업명: OOO`, `Company: OOO`, `직무: OOO`, `Position: OOO`, `Role: OOO` 명시적 라벨 정밀 추출.
  - 2) `[회사명] 직무명`, `회사명 - 직무명`, `회사명 | 직무명`, `회사명 / 직무명` 구문/브래킷 패턴 자동 분리.
  - 3) `About [회사명]`, `주식회사 [회사명]`, `근무처 [회사명]` 소개문 브랜드 추적.
  - 4) `PM`, `Product Manager`, `Frontend`, `Developer`, `Engineer`, `Analyst`, `Marketer`, `기획자`, `매니저`, `담당자`, `리드`, `스페셜리스트` 등 직무 키워드 스캐닝을 통한 포지션 타겟팅.
- **채용 중개 플랫폼 도메인 엄격 제외 보안 규칙 (v7.2)**:
  - `linkedin.com`, `wanted.co.kr`, `jobkorea.co.kr`, `saramin.co.kr`, `remember.co.kr`, `blind.com`, `incruit.com`, `glassdoor.com` 등 공고 중개 포털 도메인은 **기업명 추론 대상에서 엄격히 제외**하여, 중개 사이트 이름이 채용 기업명으로 잘못 설정되는 오류를 원천 차단.
  - 기업 자체 직속 브랜드 채용 도메인(예: `careers.kakao.com`, `toss.im`)일 경우에만 브랜드명 추론 참고용으로 동작.
- **원문 상단 텍스트 보존 및 무의미 대체어 방지 (v7.1)**:
  - 공고 파싱 시 `sanitizeTitleOrCompany` 및 `pureLocalScrapeEngine`에서 과도한 노이즈 삭제로 인해 유효 문자열이 소실되어 `"채용 기업"`, `"해당 직무"` 등의 딱딱한 대체 문구로 덮어씌워지던 현상을 제거.
  - 불확실하거나 복합적인 텍스트라도 공고 원문의 상단 첫 줄 문장을 제목/회사명/직무명으로 최대한 보존하여 유연하고 자연스럽게 파싱 결과를 산출.
  - 마감일 파싱 시 상시/채용시 마감 문구가 있는 경우 `"데드라인 미정 (상시/채용시 마감)"` 문구를 명확하게 유지하도록 파싱 로직 보장.
- **더미 키워드 전면 개편**: `[채용공고, 직무역량, 실무경험]` 등의 단순 대체어 대신 공고 원문에서 실제로 사용된 주요 직무/기술 단어를 동적 추출하여 가이드 추천 문구의 정교함 극대화.
- **직무 도메인 분류기 (`detectJobDomain`) 및 불일치 감점 페널티**:
  - HR, PM, DEV, 마케팅, 디자인 등 직무 카테고리를 분류.
  - 이력서 직무와 공고 직무의 도메인이 상이한 경우(예: HR ↔ PM/개발) 30점 상당의 감점 페널티를 적용하고 최소 점수 제한(60점 하한선)을 제거하여 20~30점대의 정직한 매칭 리포트 산출.
  - Gemini AI 호출 시에도 직무 도메인 상이 시 엄격 감점 평가 지시문 반영.


---

## 3. 기술 아키텍처 (Technical Architecture)

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Deployment & Hosting**: Vercel Production Pipeline (`vercel.json`, Vercel CLI)
- **Security & Proxy Backend**: Supabase Edge Functions (Deno Runtime, TypeScript)
- **AI Engine**: Google Gemini 2.5 Flash (`gemini-2.5-flash`)
- **Data Encryption**: XOR + Base64 Encrypted Browser LocalStorage (Pure Local Privacy, Prefix: `ENC_V1_`)

---

## 4. 시스템 아키텍처 및 데이터 흐름도 (Data Flow Diagram)

```mermaid
graph TD
    User([사용자]) -->|1. [메인] JD 텍스트 직접 복사·붙여넣기 / [보조] URL 입력| ScraperModal[JobScraperModal.tsx]
    ScraperModal -->|2. localScrapeJD 호출| GeminiUtil[src/utils/gemini.ts]
    
    subgraph Security & Privacy Proxy Layer
        GeminiUtil -->|3. POST prompt & text| SupabaseProxy[Supabase Edge Function: gemini-proxy]
        SupabaseProxy -->|4. PII 마스킹 & Secrets Key 사용| GeminiAPI[Google Gemini 2.5 API]
        GeminiAPI -->|5-A. 파싱/매칭 JSON 응답| SupabaseProxy
        SupabaseProxy -->|6. JSON 결과 전달| GeminiUtil
        
        GeminiAPI -.->|5-B. 통신 장애/Quota 초과 시| LocalFallback[Pure Local Engine]
        LocalFallback -->|Fallback JSON| GeminiUtil
    end

    GeminiUtil -->|7. 구조화 데이터 저장| AppState[App.tsx State]
    
    User -->|8. 이력서 등록/수정 (Claude/ChatGPT 대비 PII 마스킹 & AI 학습 0%)| ResumeModal[ResumeManagerModal.tsx]
    ResumeModal -->|9. encryptLocalData| Crypto[src/utils/crypto.ts]
    Crypto -->|10. ENC_V1_ Encrypted Local Storage| LocalStorage[(Browser LocalStorage)]

    User -->|11. 멀티 플랫폼 공고 커스텀 일정 통합| DetailModal[JobDetailModal.tsx]
    DetailModal & LocalStorage -->|12. 통합 월간 일정 트래킹| TimelineView[TimelineView.tsx]

    AppState & LocalStorage -->|13. localAnalyzeMatch| MatchReport[AIMatchReport.tsx]
    MatchReport -->|14. 2-Column AI 매칭 리포트 출력| User
```

---

## 5. 주요 코드 파일 명세 (Key Component Structure)

1. **[prd.md](file:///c:/Users/amy%20hyewon%20lee/blog-new/content/01_Projects/20260804_커리어핏%20프로젝트/커리어핏-프로젝트/prd.md) [MODIFY]**
   - v6.0~v7.6 개정 반영: 플랫폼 약관 충돌 회피 전략, 텍스트 복사 중심 메인 UX, B2C 개인 생산성 도구 정체성, Claude/ChatGPT 대비 PII 마스킹·Zero-Training 명정립, 로컬 데이터 암호화 및 Vercel 배포 명세 수록.
2. **[src/components/JobScraperModal.tsx](file:///c:/Users/amy%20hyewon%20lee/blog-new/content/01_Projects/20260804_커리어핏%20프로젝트/커리어핏-프로젝트/src/components/JobScraperModal.tsx)**
   - 공고 텍스트 직접 복사·붙여넣기(Paste) 탭을 메인 UX로 제공하며, Gemini 2.5 AI가 주요 업무/자격요건/우대사항 정규화 파싱.
3. **[supabase/functions/gemini-proxy/index.ts](file:///c:/Users/amy%20hyewon%20lee/blog-new/content/01_Projects/20260804_커리어핏%20프로젝트/커리어핏-프로젝트/supabase/functions/gemini-proxy/index.ts)**
   - Supabase Edge Function Deno 서버 코드. `GEMINI_API_KEY` Secrets 활용, PII 자동 마스킹 및 Gemini REST API 보안 중계.
4. **[src/utils/gemini.ts](file:///c:/Users/amy%20hyewon%20lee/blog-new/content/01_Projects/20260804_커리어핏%20프로젝트/커리어핏-프로젝트/src/utils/gemini.ts)**
   - Supabase Edge Function 엔드포인트 호출 및 무중단 로컬 Fallback 파싱/분석 유틸리티.
5. **[src/utils/crypto.ts](file:///c:/Users/amy%20hyewon%20lee/blog-new/content/01_Projects/20260804_커리어핏%20프로젝트/커리어핏-프로젝트/src/utils/crypto.ts)**
   - 이력서 및 경력기술서 `localStorage` 저장 시 XOR + Base64 암호화/복호화 (`ENC_V1_...`) 담당.
6. **[src/components/TimelineView.tsx](file:///c:/Users/amy%20hyewon%20lee/blog-new/content/01_Projects/20260804_커리어핏%20프로젝트/커리어핏-프로젝트/src/components/TimelineView.tsx)**
   - 멀티 플랫폼 공고의 마감일과 커스텀 전형 일정을 단일 월간 타임라인 캘린더 상에 테마 칩으로 동시 표시.
7. **[src/components/KanbanBoard.tsx](file:///c:/Users/amy%20hyewon%20lee/blog-new/content/01_Projects/20260804_커리어핏%20프로젝트/커리어핏-프로젝트/src/components/KanbanBoard.tsx)**
   - 칸반보드 5개 상태 컬럼 관리, 관심공고 비대칭 넓이 확장 및 공고 스크랩 CTA 헤더 통합 UI 제공.
8. **[vercel.json](file:///c:/Users/amy%20hyewon%20lee/blog-new/content/01_Projects/20260804_커리어핏%20프로젝트/커리어핏-프로젝트/vercel.json) [NEW]**
   - Vercel 프로덕션 SPA 라우팅 및 빌드 출력 디렉토리(`dist`) 매핑 설정 파일.


