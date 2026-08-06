const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.NOTION_API_KEY;
const rawDatabaseId = process.env.NOTION_DATABASE_ID || '3b3770eedc5b80668256ff3a44a2eb62';

function formatUuid(id) {
  let clean = id.replace(/-/g, '').trim();
  if (clean.length === 34 && clean.startsWith('3b3b')) {
    clean = clean.substring(2);
  }
  if (clean.length === 32) {
    return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
  }
  return clean;
}

const targetId = formatUuid(rawDatabaseId);
const devStatusText = fs.readFileSync(path.join(__dirname, '../dev-status.md'), 'utf-8');

function markdownToBlocks(markdownText) {
  const lines = markdownText.split('\n');
  const blocks = [];

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

const blocks = markdownToBlocks(devStatusText);

// 1. 데이터베이스 타겟 curl
const payloadDb = {
  parent: { database_id: targetId },
  properties: {
    Title: { title: [{ text: { content: '[커리어핏] 개발/기획 현황' } }] },
  },
  children: blocks,
};

// 2. 일반 페이지 타겟 curl
const payloadPage = {
  parent: { page_id: targetId },
  properties: {
    title: { title: [{ text: { content: '[커리어핏] 개발/기획 현황' } }] },
  },
  children: blocks,
};

fs.writeFileSync(path.join(__dirname, 'payload_db.json'), JSON.stringify(payloadDb, null, 2), 'utf-8');
fs.writeFileSync(path.join(__dirname, 'payload_page.json'), JSON.stringify(payloadPage, null, 2), 'utf-8');

console.log('🚀 curl 사용 노션 API 호출 시도...');

try {
  const curlCmd = `curl -4 -s -X POST "https://api.notion.com/v1/pages" -H "Authorization: Bearer ${apiKey}" -H "Notion-Version: 2022-06-28" -H "Content-Type: application/json" -d @"${path.join(__dirname, 'payload_db.json').replace(/\\/g, '/')}"`;
  const res = execSync(curlCmd, { encoding: 'utf-8' });
  const json = JSON.parse(res);
  if (json.object === 'page') {
    console.log('🎉 데이터베이스 항목 생성 성공!');
    console.log('📄 Page URL:', json.url);
    process.exit(0);
  } else {
    console.log('ℹ️ DB 생성 응답 메시지:', json.message || json);
  }
} catch (e) {
  console.log('DB 전송 시도 경고:', e.message);
}

try {
  const curlCmd = `curl -4 -s -X POST "https://api.notion.com/v1/pages" -H "Authorization: Bearer ${apiKey}" -H "Notion-Version: 2022-06-28" -H "Content-Type: application/json" -d @"${path.join(__dirname, 'payload_page.json').replace(/\\/g, '/')}"`;
  const res = execSync(curlCmd, { encoding: 'utf-8' });
  const json = JSON.parse(res);
  if (json.object === 'page') {
    console.log('🎉 일반 페이지 하위 생성 성공!');
    console.log('📄 Page URL:', json.url);
    process.exit(0);
  } else {
    console.log('❌ 노션 API 실패 응답:', JSON.stringify(json, null, 2));
  }
} catch (e) {
  console.error('❌ curl 호출 실패:', e.message);
}
