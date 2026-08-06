# 📝 [2026-08-06] 개발 기록

## 💡 주요 업데이트 및 구현 내역

### 1. LinkedIn 공고 복사 가이드 UI 상시 노출 & JD 텍스트 붙여넣기 권장 배너 구축
- **배경**: 일부 채용 플랫폼의 보안 정책으로 인해 URL 직접 스크래핑 시 403/CORS 실패가 발생하는 경우 대응.
- **작업 내용**:
  - `JobScraperModal.tsx`에 "JD 텍스트 직접 붙여넣기 추천" 안내 배너 상시 표시.
  - LinkedIn 링크 복사 2단계 가이드 카드(`public/linkedin-guide.png` 활용)를 모달 상단에 영구 렌더링하도록 UI 개선.
  - 예시 URL 버튼 클릭 시 실제 작동 가능한 링크드인 예시 URL 입력 처리.

### 2. 노션 SDK 연동 자동화 스크립트 구축 (`scripts/post-to-notion.ts`)
- **작업 내용**:
  - `@notionhq/client` 패키지를 활용해 `.env`의 `NOTION_API_KEY`, `NOTION_DATABASE_ID`로 데이터 자동 전송 스크립트 작성.
  - 마크다운 파서(`markdownToBlocks`) 구현으로 마크다운 문서(#, ##, - [ ], - bullet, > callout 등)를 노션 블록으로 변환.
  - Database 전송 실패 시 일반 Page parent-id 상위 호환 fallback 로직 구현.

### 3. Vercel 배포 및 Express 포트 파싱 안정화
- **작업 내용**:
  - `server.ts`의 `process.env.PORT` 타입 변환(`Number(PORT)`)으로 Vercel/로컬 환경 실행 오류 해결.
  - Vercel CLI 및 프로덕션 환경과의 동기화 처리.

### 4. PM Review Agent Skill 구축 (`.agents/skills/pm-review/SKILL.md`)
- **작업 내용**:
  - 서비스 리뷰 요구 시 시니어 PM 시각에서 UX/기획/비즈니스 임팩트를 분석할 수 있는 에이전트 스킬 체계화.

---

## 🎯 검증 및 테스트 결과
- `cmd /c npx tsx scripts/post-to-notion.ts` 명령을 통해 노션에 최신 현황 및 개발 기록 페이지 자동 업로드 완료.
- 모달 UI 렌더링 정상 동작 확인 및 노션 페이지 URL 생성 확인.
