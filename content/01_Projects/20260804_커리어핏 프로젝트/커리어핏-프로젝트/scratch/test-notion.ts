import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.NOTION_API_KEY;
const rawDatabaseId = process.env.NOTION_DATABASE_ID || '3b3770eedc5b800ba8a9e462f62eb112';

function formatUuid(id: string): string {
  let clean = id.replace(/-/g, '').trim();
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

async function test() {
  console.log('Testing ID:', databaseId);
  try {
    const db = await notion.databases.retrieve({ database_id: databaseId });
    console.log('DB Info:', JSON.stringify(db, null, 2));
  } catch (err: any) {
    console.error('DB retrieve error:', err);
    try {
      const pg = await notion.pages.retrieve({ page_id: databaseId });
      console.log('Page Info:', JSON.stringify(pg, null, 2));
    } catch (pErr: any) {
      console.error('Page retrieve error:', pErr);
    }
  }
}

test();
