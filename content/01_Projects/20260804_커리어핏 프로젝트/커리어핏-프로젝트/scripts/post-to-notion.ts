import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// .env 로드
dotenv.config();

const apiKey = process.env.NOTION_API_KEY;
const rawDatabaseId = process.env.NOTION_DATABASE_ID || '';

if (!apiKey || !rawDatabaseId) {
  console.error('❌ 에러: .env 파일에 NOTION_API_KEY 또는 NOTION_DATABASE_ID가 설정되어 있지 않습니다.');
  process.exit(1);
}

function formatUuid(id: string): string {
  let clean = id.replace(/-/g, '').trim();
  // 34글자이고 3b가 중복 붙은 경우 예외 정제
  if (clean.length === 34 && clean.startsWith('3b3b')) {
    clean = clean.substring(2);
  }
  if (clean.length === 32) {
    return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
  }
  return clean;
}

const databaseId = formatUuid(rawDatabaseId);
const notion = new Client({ auth: apiKey });

/**
 * 마크다운 텍스트를 단순화된 노션 블록 배열로 변환
 */
function markdownToBlocks(markdownText: string) {
  const lines = markdownText.split('\n');
  const blocks: any[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: [{ type: 'text', text: { content: trimmed.replace('# ', '') } }] },
      });
    } else if (trimmed.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: trimmed.replace('## ', '') } }] },
      });
    } else if (trimmed.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: { rich_text: [{ type: 'text', text: { content: trimmed.replace('### ', '') } }] },
      });
    } else if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- [x] ')) {
      const checked = trimmed.startsWith('- [x] ');
      const content = trimmed.replace(/- \[[ x]\] /, '');
      blocks.push({
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: [{ type: 'text', text: { content } }],
          checked,
        },
      });
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.replace(/^[-*]\s+/, '');
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: [{ type: 'text', text: { content } }] },
      });
    } else if (trimmed.startsWith('> ')) {
      const content = trimmed.replace(/^>\s+/, '');
      blocks.push({
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [{ type: 'text', text: { content } }],
          icon: { emoji: '💡' },
        },
      });
    } else {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ type: 'text', text: { content: trimmed } }] },
      });
    }
  }

  return blocks;
}

async function main() {
  const args = process.argv.slice(2);
  let title = args[0];
  let content = args[1];
  const fileArgIndex = args.indexOf('--file');

  if (fileArgIndex !== -1 && args[fileArgIndex + 1]) {
    const filePath = path.resolve(args[fileArgIndex + 1]);
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf-8');
    }
  }

  if (!title) {
    const today = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();
    const session = hour < 12 ? '오전' : '오후';
    title = `${hour < 12 ? '☀️' : '🌙'} [Daily Scrum] ${today} (${session})`;
  }

  if (!content) {
    console.error('❌ 에러: 데일리 스크럼 내용(본문)이 입력되지 않았습니다.');
    console.log('사용법: npx tsx scripts/post-to-notion.ts "<제목>" "<마크다운 내용>"');
    console.log('또는: npx tsx scripts/post-to-notion.ts "<제목>" --file <마크다운파일경로>');
    process.exit(1);
  }

  console.log(`🚀 노션 데이터베이스/페이지(ID: ${databaseId.slice(0, 8)}...)에 등록 시도 중...`);

  const blocks = markdownToBlocks(content);
  let newPage;

  try {
    // 1. 데이터베이스 메타데이터 조회
    const dbInfo: any = await notion.databases.retrieve({ database_id: databaseId });
    let titlePropKey = 'Title';
    
    if (dbInfo && dbInfo.properties) {
      for (const [propName, propValue] of Object.entries(dbInfo.properties)) {
        if ((propValue as any).type === 'title') {
          titlePropKey = propName;
          break;
        }
      }
    }

    console.log(`💡 감지된 제목 속성명: '${titlePropKey}'`);

    // 2. 데이터베이스 내에 페이지(행) 생성
    newPage = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        [titlePropKey]: {
          title: [{ text: { content: title } }],
        },
      },
      children: blocks,
    });
  } catch (err: any) {
    if (err.message?.includes('is a page, not a database') || err.code === 'validation_error' || err.code === 'object_not_found') {
      console.log(`ℹ️ 페이지 ID로 감지되거나 DB 조회 실패 (${err.message}). 하위 서브 페이지로 생성을 시도합니다...`);
      newPage = await notion.pages.create({
        parent: { page_id: databaseId },
        properties: {
          title: {
            title: [{ text: { content: title } }],
          },
        },
        children: blocks,
      });
    } else {
      throw err;
    }
  }

  console.log('✅ 성공적으로 노션에 페이지가 생성되었습니다!');
  console.log(`📄 페이지 URL: ${(newPage as any).url}`);
}

main().catch((err) => {
  console.error('❌ 노션 등록 중 오류가 발생했습니다:', err.message);
  process.exit(1);
});
