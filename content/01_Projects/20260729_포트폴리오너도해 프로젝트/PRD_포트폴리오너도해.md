# 📄 PRD (Product Requirement Document)

## 1. 제품 개요 (Product Overview)
- **제품명**: 포트폴리오너도해 (Clay AI 기반 커리어 선순환 플랫폼)
- **목적**: 일상의 프로젝트 성과와 경험을 경험 블록(Experience Block) 단위로 저장하고, AI를 활용해 채용 공고에 최적화된 웹 포트폴리오를 빠르게 구축 및 안전하게 공유하는 서비스.
- **디자인 컨셉**: Clay.com 스타일의 따뜻한 크림톤 캔버스(`#fffaf0`), 비비드 컬러 액센트 카드(Pink, Teal, Lavender, Ochre, Mint), 고대비 라운디드 카드 레이아웃.

---

## 2. 주요 핵심 기능 (Core Features)

### 2.1 🖼️ 시각적 웹 포트폴리오 & 3가지 뷰 스타일 (View Switcher)
1. **웹 벤토 갤러리 (Bento Grid View)**:
   - 프로젝트 대표 썸네일/화면 캡처, 성과 지표 칩, 기술 스택 태그 중심의 현대적 웹 갤러리 레이아웃.
   - 카테고리 필터(전체, 핵심 프로젝트, 성과 & 구조개선, 트러블슈팅)로 대화형 조회가 가능.
2. **피치덱 슬라이드 (16:9 Slide View)**:
   - 발표/PPT 스타일의 16:9 비율 슬라이드로 프로젝트를 한 장씩 감상하는 인터랙티브 슬라이드쇼.
3. **클래식 서류 뷰 (Classic Resume View)**:
   - 가독성이 우수한 전통적 이력서/경력기술서 포맷.

### 2.2 🔍 몰입형 케이스 스터디 상세 모달 (Case Study Detail)
- 프로젝트 카드를 클릭하면 **Problem (도전 과제)** → **Solution (기술적 솔루션)** → **Impact (정량적 성과)** → **Screenshots (화면 갤러리)** → **Live Demo (시연 링크)** 연결 구조의 모달 제공.

### 2.3 🛡️ 실시간 영업비밀 보호 마스킹 엔진 (Zero Data Retention)
- 매출액, 수치 지표, 내부 프로젝트 코드명, 이메일, URL 등 대외비 항목을 실시간 감지하여 `[REVENUE_1]`, `[CONFIDENTIAL_PROJECT_1]` 등의 플레이스홀더로 치환.
- 유저 상단 [영업비밀 보호 ON/OFF] 토글 버튼으로 공유용/내부용 즉시 전환.

### 2.4 👤 개인 브랜딩 히어로 & 사진/아바타 관리
- 프로필 이미지 URL 직접 입력 및 제공되는 샘플 아바타 4종 원클릭 선택 지원.
- 대표 한 줄 슬로건("10만 유저의 경험을 75% 개선한 3년차 프론트엔드 엔지니어") 설정.
- GitHub, 기술 블로그, LinkedIn, 이메일 라이브 연결 버튼 제공.

### 2.5 💾 포트폴리오 저장 및 데이터 영속성 (Storage & Persistence)
- **실시간 자동 저장 (Auto-save)**: 프로필, 슬로건, 경험 블록 선택, 테마 변경 시 `localStorage`에 자동 동기화.
- **수동 저장 버튼 (Manual Save)**: 포트폴리오 빌더 상단 [포트폴리오 저장하기] 버튼으로 즉시 저장 및 토스트 알림 확인.

---

## 3. 사용자 여정 (User Journey)
1. **대시보드 진입**: 6가지 맞춤 시작 경로(처음 작성 도우미, 경험 뼈대 생성, 10분 빠른 완성, 상시 커리어 기록, AI 진단, 기존 포폴 Import) 중 선택.
2. **경험 블록 기록 (Vault)**: 프로젝트 성과 작성 시 대표 썸네일 이미지 URL 및 시연 데모 링크 등록.
3. **포트폴리오 구성 (Builder)**: 프로필 사진 변경, 슬로건 수정, 포트폴리오에 포함할 경험 블록 체크박스 선택.
4. **미리보기 및 공유 (Preview/Share)**: Bento / Slide / Classic 뷰로 전환하며 결과물 확인 후 영업비밀 마스킹이 적용된 공개 URL 공유.

---

## 4. 기술 사양 (Technical Stack)
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Client-side `localStorage` with AES-256 Client Masking simulation
- **Server**: Express + Node.js (Port 3000)
