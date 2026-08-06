const https = require('https');
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
  console.log(`🚀 Node native https로 노션 API 호출 시도 (Target ID: ${targetId})...`);
  
  // 1. 데이터베이스 생성/조회 시도
  try {
    const payload = {
      parent: { database_id: targetId },
      properties: {
        '이름': { title: [{ text: { content: '[커리어핏] 개발/기획 현황' } }] },
      },
      children: blocks,
    };
    const res = await makeNotionRequest('/v1/pages', 'POST', payload);
    console.log('✅ 데이터베이스 하위 페이지 생성 성공!');
    console.log('📄 Page URL:', res.url);
    return;
  } catch (err) {
    console.log('ℹ️ DB 생성 실패/일반페이지 전환 시도 중...', err.body ? err.body.message : err);
  }

  // 2. 일반 페이지 하위 생성 시도
  try {
    const payload = {
      parent: { page_id: targetId },
      properties: {
        title: { title: [{ text: { content: '[커리어핏] 개발/기획 현황' } }] },
      },
      children: blocks,
    };
    const res = await makeNotionRequest('/v1/pages', 'POST', payload);
    console.log('✅ 일반 페이지 하위 생성 성공!');
    console.log('📄 Page URL:', res.url);
  } catch (err) {
    console.error('❌ 최종 생성 실패:', JSON.stringify(err, null, 2));
  }
}

run();
