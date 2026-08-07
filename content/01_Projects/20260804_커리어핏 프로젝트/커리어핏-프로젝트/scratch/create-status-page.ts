import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.NOTION_API_KEY;
const rawTargetId = '33b3770eedc5b80668256ff3a44a2eb62';

function formatUuid(id: string): string {
  let clean = id.replace(/-/g, '').trim();
  if (clean.length === 33 && clean.startsWith('33b')) {
    clean = clean.substring(1);
  }
  if (clean.length === 34 && clean.startsWith('3b3b')) {
    clean = clean.substring(2);
  }
  if (clean.length === 32) {
    return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
  }
  return clean;
}

const targetId = formatUuid(rawTargetId);
console.log('Formatted target UUID:', targetId);

const notion = new Client({ auth: apiKey });

async function withRetry<T>(fn: () => Promise<T>, retries = 5, delay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      console.log(`[Retry ${i + 1}/${retries}] Attempt failed (${err.message}). Retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw lastError;
}

async function run() {
  const titleText = '[커리어핏] 개발/기획 현황';

  const children: any[] = [
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: '구직자가 채용 공고(JD) URL 또는 텍스트를 스크랩하면 AI가 주요 업무·필수 요건·우대 요건을 정밀 분류하고, 이력서/경력기술서와 비교하여 역량 매칭점수 및 보완 가이드를 제공하는 채용 보조 서비스입니다.',
            },
          },
        ],
      },
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '✅ 완료된 것' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: 'JD URL(링크드인, 원티드, 사람인 등) 및 텍스트 파싱 일원화 / 3대 핵심 요소(주요 업무, 필수 자격요건, 우대사항) 자동 분류 구현 (server.ts, api/index.ts)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '링크드인 이미지 가이드 카드 상시 노출 및 원클릭 예시 URL 자동 입력 UI 고도화 (JobScraperModal.tsx, public/linkedin-guide.png)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: 'GNB 네비게이션 메뉴 명칭 변경 ("지원 칸반 보드" → "공고와 매칭") 및 직관적 사용자 동선 구축 (Navbar.tsx)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '2-Column 인터페이스 구축 (좌측: 공고 원문 및 상세 / 우측: AI 역량 매칭 진단 리포트) (JobDetailModal.tsx, AIMatchReport.tsx)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '첨부 서류 휴지통 삭제 기능 및 서류 변경 시 AI 매칭점수 자동 재분석 로직 구현 (JobDetailModal.tsx)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: 'Gemini 3.6 Flash 모델 기반 JSON 응답 구조화 및 역량 진단 백엔드 엔진 연동' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: 'Vercel CLI 배포 환경 세팅, 포트 처리 보완 및 .env 환경 변수 보안 처리 (vercel.json, server.ts)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '시니어 PM 관점 서비스 리뷰 Agent Skill 구축 (.agents/skills/pm-review/SKILL.md)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '노션 SDK 연동 자동화 스크립트 작성 및 현황 페이지/데일리 스크럼 자동 전송 체계 구축 (scripts/post-to-notion.ts)' } }],
      },
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🔨 진행 중인 것' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: 'D-DAY 타임라인 컴포넌트 및 마감일 데이터 연동 고도화' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: 'AI 진단 리포트 PDF/텍스트 다운로드 기능 개발' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '노션 API를 활용한 데일리 스크럼 자동 작성 CLI 툴 패키징' } }],
      },
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🚧 막힌 것 / 고민' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          { type: 'text', text: { content: '외부 채용 사이트(링크드인 등)의 보안 정책 강화로 인한 URL 자동 스크래핑 제약\n  👉 (해결/방향): 모달 내 \'JD 텍스트 직접 붙여넣기\' 권장 안내 배너 및 LinkedIn 2-Step 이미지 가이드 카드를 상시 노출하여 유저 입력 실패 방지 UX 구축' } },
        ],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          { type: 'text', text: { content: '노션 API 전송 시 데이터베이스(Database)와 일반 페이지(Page) 간 parent-id 차이로 인한 validation_error\n  👉 (해결/방향): post-to-notion.ts 내 catch fallback 로직을 구현하여 일반 노션 페이지 하위 서브페이지 생성으로 자동 전환되도록 처리' } },
        ],
      },
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '📋 다음에 할 것 (우선순위순)' } }],
      },
    },
    {
      object: 'block',
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [{ type: 'text', text: { content: 'D-DAY 타임라인에 스크랩된 채용 공고 마감일 자동 반영 및 D-Day 카운트다운 구현' } }],
      },
    },
    {
      object: 'block',
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [{ type: 'text', text: { content: '역량 매칭 점수가 낮은 자격요건에 대해 맞춤형 이력서/자소서 수정 문장 추천 기능 개발' } }],
      },
    },
    {
      object: 'block',
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [{ type: 'text', text: { content: 'AI 매칭 진단 결과 리포트 PDF/Text 저장 및 공유 기능 추가' } }],
      },
    },
    {
      object: 'block',
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: [{ type: 'text', text: { content: '모바일/태블릿 해상도 맞춤 반응형 UI/UX 정밀 테스트 및 레이아웃 보완' } }],
      },
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '🔄 스코프 변경 기록 (날짜 + 이유)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '2026-08-06: 링크드인 공고 복사 가이드 상시 카드 배치 및 텍스트 직접 입력 권장 안내 배너 추가 (이유: 채용 사이트 보안 정책으로 URL 스크래핑 실패율이 증가함에 따라 사용자의 복사-붙여넣기 성공률을 극대화)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '2026-08-06: "지원 칸반 보드" 메뉴명을 "공고와 매칭"으로 변경하고 2-Column 매칭 뷰 중심 개편 (이유: 채용공고 원문과 서류 매칭 결과를 동시에 비교할 때의 직관성 및 가독성 극대화)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '2026-08-06: 첨부 서류 휴지통 삭제 기능 및 즉시 AI 자동 재분석 로직 추가 (이유: 특정 이력서/경력기술서 포함 여부에 따른 매칭점수 변화를 사용자가 즉각 확인하도록 개선)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '2026-08-05: 공고 입력 모달 내 링크드인 예시 URL 안내 및 원클릭 입력 버튼 배치 (이유: 사용자가 잘못된 URL 형식을 입력해 발생하는 파싱 에러 사전 차단)' } }],
      },
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '📝 날짜별 개발 기록 (하위 페이지)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '2026-08-04: 커리어핏 프로젝트 초기 구축 (Vite + React + Express + Gemini 3.6 Flash 연동)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '2026-08-05: 링크드인 JD 스크랩 가이드 UI 개선, Vercel 배포 연동, 노션 데일리 스크럼 스크립트 작성' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '2026-08-06: PM 리뷰 Agent Skill 추가, LinkedIn 2-Step 이미지 가이드 상시 노출 카드 추가, 노션 개발/기획 현황 최신화 및 하위 개발기록 페이지 연동' } }],
      },
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: '📣 데일리 스크럼 자료 (하위 페이지)' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '2026-08-06: [2026-08-06] 데일리 스크럼 생성 및 노션 전송 완료' } }],
      },
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: '노션 데일리 스크럼 자동화 스크립트 (scripts/post-to-notion.ts) 연동 및 자동 업로드 테스트 완료' } }],
      },
    },
  ];

  let createdPage: any;

  // 1. Try Database parent
  try {
    const dbInfo: any = await withRetry(() => notion.databases.retrieve({ database_id: targetId }));
    let titlePropName = 'Title';
    if (dbInfo && dbInfo.properties) {
      for (const [name, prop] of Object.entries(dbInfo.properties)) {
        if ((prop as any).type === 'title') {
          titlePropName = name;
          break;
        }
      }
    }
    console.log(`Matched Database Title Property: '${titlePropName}'`);

    createdPage = await withRetry(() =>
      notion.pages.create({
        parent: { database_id: targetId },
        properties: {
          [titlePropName]: {
            title: [{ text: { content: titleText } }],
          },
        },
        children: children,
      })
    );
    console.log('✅ Created as Database Row/Item!');
  } catch (err: any) {
    console.log(`Database parent attempt note: ${err.message}`);
    // 2. Try Page parent fallback
    createdPage = await withRetry(() =>
      notion.pages.create({
        parent: { page_id: targetId },
        properties: {
          title: {
            title: [{ text: { content: titleText } }],
          },
        },
        children: children,
      })
    );
    console.log('✅ Created as Sub-page under Page!');
  }

  console.log('🎉 Notion Page URL:', createdPage.url);

  // 하위 페이지 생성
  try {
    const parentPageId = createdPage.id;
    console.log('Creating child sub-pages under:', parentPageId);

    const devLogPage = await withRetry(() =>
      notion.pages.create({
        parent: { page_id: parentPageId },
        properties: {
          title: {
            title: [{ text: { content: '📝 [2026-08-06] 개발/기획 상세 기록' } }],
          },
        },
        children: [
          {
            object: 'block',
            type: 'heading_2',
            heading_2: { rich_text: [{ type: 'text', text: { content: '주요 구현 및 변경사항' } }] },
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '링크드인 복사 가이드 상시 안내 카드 UI 개선 및 원클릭 복사 예시 버튼 고도화' } }] },
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '첨부 서류 휴지통 삭제 및 매칭점수 자동 재계산 기능 연동' } }] },
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'PM 리뷰 Agent Skill 추가 (.agents/skills/pm-review/SKILL.md)' } }] },
          },
        ],
      })
    );
    console.log('✅ Child Page 1 created:', (devLogPage as any).url);

    const scrumPage = await withRetry(() =>
      notion.pages.create({
        parent: { page_id: parentPageId },
        properties: {
          title: {
            title: [{ text: { content: '📣 [2026-08-06] 데일리 스크럼' } }],
          },
        },
        children: [
          {
            object: 'block',
            type: 'heading_2',
            heading_2: { rich_text: [{ type: 'text', text: { content: '스크럼 내용' } }] },
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '어제 한 일: 노션 SDK 연동 및 Vercel 환경 세팅' } }] },
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '오늘 할 일: LinkedIn 2-Step 가이드 UI 고도화 및 PM 리뷰 스킬 작성' } }] },
          },
          {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '해결 과제: 링크드인 URL 스크래핑 제약 UX 보완' } }] },
          },
        ],
      })
    );
    console.log('✅ Child Page 2 created:', (scrumPage as any).url);

  } catch (childErr: any) {
    console.warn('⚠️ Child page creation warning:', childErr.message);
  }
}

run().catch((e) => {
  console.error('Run Exception:', e);
});
