const https = require('https');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.NOTION_API_KEY;
const parentPageId = '3b4770eedc5b80c8a0cbc38534ebd428';

function formatUuid(id) {
  let clean = id.replace(/-/g, '').trim();
  if (clean.length === 32) {
    return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
  }
  return clean;
}

const targetParentId = formatUuid(parentPageId);

const blocks = [
  // 1. 프로젝트 개요 (Callout)
  {
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: '💡 프로젝트 개요: 채용 공고(LinkedIn 등) 정보와 사용자 이력서를 분석하여 AI 기반 맞춤형 커리어 진단 및 이력서/포트폴리오 피드백을 제공하는 올인원 이직/커리어 핏 서비스'
          }
        }
      ],
      icon: { emoji: '🚀' },
      color: 'blue_background'
    }
  },
  { object: 'block', type: 'divider', divider: {} },

  // 2. 완료된 것
  {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [{ type: 'text', text: { content: '✅ 완료된 것' } }],
      color: 'green'
    }
  },
  {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [{ type: 'text', text: { content: 'Next.js 기반 웹 애플리케이션 프레임워크 셋업 및 메인 UI 구축' } }]
    }
  },
  {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [{ type: 'text', text: { content: '노션 API 연동 및 환경 변수 보안 처리 (.env / Git ignore)' } }]
    }
  },
  {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [{ type: 'text', text: { content: 'LinkedIn 링크 복사 및 입력 안내 가이드 UI/모달 구현' } }]
    }
  },
  {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [{ type: 'text', text: { content: 'Vercel 자동 배포 파이프라인 구축 및 프로덕션 환경 셋업' } }]
    }
  },

  // 3. 진행 중인 것
  {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [{ type: 'text', text: { content: '🔨 진행 중인 것' } }],
      color: 'orange'
    }
  },
  {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [{ type: 'text', text: { content: '노션 대시보드 및 데일리 스크럼 자동화 스크립트 연동 고도화' } }]
    }
  },
  {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [{ type: 'text', text: { content: '채용 정보 텍스트 추출 및 이력서 매칭 AI 프롬프트엔지니어링' } }]
    }
  },

  // 4. 막힌 것 / 고민
  {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [{ type: 'text', text: { content: '🚧 막힌 것 / 고민' } }],
      color: 'red'
    }
  },
  {
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: [
        {
          type: 'text',
          text: { content: '외부 채용 웹사이트(LinkedIn 등)의 보안/CORS 제한으로 라이브 웹 크롤링 한계 → 사용자 직접 입력 및 툴팁 가이드 제공 방안으로 UX 완화 중' }
        }
      ],
      icon: { emoji: '⚠️' },
      color: 'red_background'
    }
  },

  // 5. 다음에 할 것
  {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [{ type: 'text', text: { content: '📋 다음에 할 것 (우선순위순)' } }],
      color: 'purple'
    }
  },
  {
    object: 'block',
    type: 'to_do',
    to_do: {
      rich_text: [{ type: 'text', text: { content: '1순위: 이력서 PDF/텍스트 업로드 및 공고 맞춤 분석 리포트 생성 로직 개발' } }],
      checked: false
    }
  },
  {
    object: 'block',
    type: 'to_do',
    to_do: {
      rich_text: [{ type: 'text', text: { content: '2순위: 노션 데일리 스크럼 자동 생성을 위한 npm / CLI 스크립트 명령어 등록' } }],
      checked: false
    }
  },
  {
    object: 'block',
    type: 'to_do',
    to_do: {
      rich_text: [{ type: 'text', text: { content: '3순위: 커리어 진단 결과 보고서 PDF 내보내기 기능 구현' } }],
      checked: false
    }
  },

  // 6. 스코프 변경 기록
  {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [{ type: 'text', text: { content: '🔄 스코프 변경 기록' } }],
      color: 'gray'
    }
  },
  {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [
        { type: 'text', text: { content: '2026-08-05: ' }, annotations: { bold: true } },
        { type: 'text', text: { content: 'LinkedIn 실시간 파싱 제한 대응으로 링크 복사 안내 가이드 UX 도입 (안정성 확보)' } }
      ]
    }
  },
  {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: {
      rich_text: [
        { type: 'text', text: { content: '2026-08-06: ' }, annotations: { bold: true } },
        { type: 'text', text: { content: '프로젝트 현황 관리를 데이터베이스 표 1개 행에서 독립 대시보드 메인 페이지 구조로 전면 전환' } }
      ]
    }
  },

  { object: 'block', type: 'divider', divider: {} },

  // 7. 하위 섹션 구획
  {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [{ type: 'text', text: { content: '📁 하위 기록 및 세부 자료' } }],
      color: 'blue'
    }
  }
];

function makeNotionRequest(pathUrl, method, payload) {
  return new Promise((resolve, reject) => {
    const data = payload ? JSON.stringify(payload) : '';
    const options = {
      hostname: 'api.notion.com',
      port: 443,
      path: pathUrl,
      method: method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject({ statusCode: res.statusCode, body: json });
          }
        } catch (e) {
          reject({ statusCode: res.statusCode, body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log(`🚀 독립 대시보드 페이지 생성 시도 (Parent Page ID: ${targetParentId})...`);

  try {
    // 1. 대시보드 메인 페이지 생성
    const mainPagePayload = {
      parent: { page_id: targetParentId },
      icon: { emoji: '📊' },
      cover: { type: 'external', external: { url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80' } },
      properties: {
        title: { title: [{ text: { content: '[커리어핏] 프로젝트 개발/기획 대시보드' } }] }
      },
      children: blocks
    };

    const mainRes = await makeNotionRequest('/v1/pages', 'POST', mainPagePayload);
    console.log('✅ 메인 대시보드 페이지 생성 완료!');
    console.log('📄 Main Dashboard URL:', mainRes.url);

    // 2. 하위 페이지 생성: 📝 날짜별 개발 기록
    const devLogPayload = {
      parent: { page_id: mainRes.id },
      icon: { emoji: '📝' },
      properties: {
        title: { title: [{ text: { content: '📝 날짜별 개발 기록' } }] }
      },
      children: [
        {
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: [{ type: 'text', text: { content: '날짜별 상세 기능 구현 및 커밋/변경 사항 기록 공간입니다.' } }],
            icon: { emoji: '📌' }
          }
        },
        {
          object: 'block',
          type: 'heading_3',
          heading_3: { rich_text: [{ type: 'text', text: { content: '2026-08-06 (목)' } }] }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: { rich_text: [{ type: 'text', text: { content: '독립 대시보드 페이지 노션 API 연동 및 자동화 구축' } }] }
        }
      ]
    };
    const devLogRes = await makeNotionRequest('/v1/pages', 'POST', devLogPayload);
    console.log('✅ 하위 페이지 "📝 날짜별 개발 기록" 생성 완료:', devLogRes.url);

    // 3. 하위 페이지 생성: 📣 데일리 스크럼 자료
    const scrumPayload = {
      parent: { page_id: mainRes.id },
      icon: { emoji: '📣' },
      properties: {
        title: { title: [{ text: { content: '📣 데일리 스크럼 자료' } }] }
      },
      children: [
        {
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: [{ type: 'text', text: { content: '매일 아침/저녁 작성하는 데일리 스크럼 아카이브 공간입니다.' } }],
            icon: { emoji: '💬' }
          }
        }
      ]
    };
    const scrumRes = await makeNotionRequest('/v1/pages', 'POST', scrumPayload);
    console.log('✅ 하위 페이지 "📣 데일리 스크럼 자료" 생성 완료:', scrumRes.url);

  } catch (err) {
    console.error('❌ 대시보드 생성 실패:', JSON.stringify(err, null, 2));
  }
}

run();
