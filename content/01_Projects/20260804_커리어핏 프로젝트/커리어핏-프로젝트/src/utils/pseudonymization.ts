// Client-side Pseudonymization & De-pseudonymization Utility
// 3-Tier Data Privacy Engine according to PRIVACY_MASKING_POLICY.md (v8.4):
// 1. Direct PII: Masked/Dropped ([USER_NAME], [PHONE], [EMAIL], [ADDRESS], [RESIDENT_ID], [LINK])
// 2. Indirect PII: Tokenized/Generalized ([UNIVERSITY], [AGE_REMOVED], [GENDER_REMOVED])
// 3. Business-Sensitive Info: Pseudonymized & Locally Mapped ([회사A], [시스템A], [수치A])

export interface PseudonymizationResult {
  pseudonymizedText: string;
  mappingTable: Record<string, string>; // e.g. { "[회사A]": "A기업", "[시스템B]": "ERP", "[수치C]": "120억" }
  reverseMappingTable: Record<string, string>; // e.g. { "A기업": "[회사A]", ... }
  logs: string[];
}

/**
 * Client-Side 3-Tier Pseudonymization Engine
 * Transforms Direct PII, Indirect PII, and Business-Sensitive Info safely.
 */
export function pseudonymizeText(rawText: string): PseudonymizationResult {
  if (!rawText || typeof rawText !== 'string') {
    return { pseudonymizedText: rawText || '', mappingTable: {}, reverseMappingTable: {}, logs: [] };
  }

  const logs: string[] = [];
  const mappingTable: Record<string, string> = {};
  const reverseMappingTable: Record<string, string> = {};

  let companyIndex = 0;
  let systemIndex = 0;
  let numberIndex = 0;

  const getCompanyToken = () => `[회사${String.fromCharCode(65 + companyIndex++)}]`; // [회사A], [회사B]...
  const getSystemToken = () => `[시스템${String.fromCharCode(65 + systemIndex++)}]`; // [시스템A], [시스템B]...
  const getNumberToken = () => `[수치${String.fromCharCode(65 + numberIndex++)}]`; // [수치A], [수치B]...

  let processed = rawText;

  // ----------------------------------------------------------------------
  // Tier 1: Direct PII Filtering & Masking (Email, Phone, Resident ID, Address, Links)
  // ----------------------------------------------------------------------
  // Email
  processed = processed.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  // Phone numbers (010-1234-5678, 02-123-4567, etc.)
  processed = processed.replace(/(?:01[016789]|02|0[3-9][0-9])[-.\s]?\d{3,4}[-.\s]?\d{4}/g, '[PHONE]');
  // Resident Registration Numbers
  processed = processed.replace(/\d{6}[-~]?\d{7}/g, '[RESIDENT_ID]');
  // URLs & Links (LinkedIn, SNS, etc.)
  processed = processed.replace(/https?:\/\/[^\s]+/g, '[LINK]');
  // Address patterns (e.g., 서울특별시 강남구 테헤란로 123)
  processed = processed.replace(/(?:서울|경기|인천|부산|대구|광주|대전|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주)(?:특별자치|광역시|도)?\s+[가-힣]+(?:시|군|구)\s+[가-힣0-9\s-]+(?:로|길|동)\s*\d*/g, '[ADDRESS]');

  // ----------------------------------------------------------------------
  // Tier 2: Indirect PII Tokenization & Bias Removal (University, Age, Gender)
  // ----------------------------------------------------------------------
  // University / School names (e.g., XX대학교, XX대)
  processed = processed.replace(/[가-힣]{2,10}(?:대학교|대학원|여자대학교)/g, '[UNIVERSITY]');
  // Age & Birth year (e.g., 30세, 1995년생)
  processed = processed.replace(/(?:\b19\d{2}|\b20\d{2})년생|\b\d{2}세/g, '[AGE_REMOVED]');
  // Gender (e.g., 남성, 여성, (남), (여))
  processed = processed.replace(/\b(남성|여성)\b|\((?:남|여)\)/g, '[GENDER_REMOVED]');

  // ----------------------------------------------------------------------
  // Tier 3: Business-Sensitive Info Pseudonymization (Company, System, Revenue/Numbers)
  // ----------------------------------------------------------------------
  // 1. Detect Company Names
  // e.g., "A기업", "B회사", "(주)OOO", "주식회사 OOO", "OO전자", "OO테크", "OO솔루션", "OO시스템", "OO그룹"
  const companyRegex = /(?:\(주\)|주식회사\s*)?[A-Za-z0-9가-힣]+(?:기업|회사|전자|테크|솔루션|시스템즈|시스템|랩스|그룹|인터내셔널|바이오|소프트|Inc|Corp|Ltd)\b|[A-Za-z0-9가-힣]기업/g;
  const companyMatches = Array.from(new Set(processed.match(companyRegex) || []));

  for (const match of companyMatches) {
    if (!reverseMappingTable[match] && !match.startsWith('[')) {
      const token = getCompanyToken();
      mappingTable[token] = match;
      reverseMappingTable[match] = token;
    }
  }

  // 2. Detect Internal Systems / Products
  // e.g., "ERP", "CRM", "MES", "SCM", "EMR", "DW", "WMS", "POS", "KMS", "HRIS", "EHR", "PLM"
  const systemRegex = /(?:^|[^A-Za-z0-9])(ERP|CRM|MES|SCM|EMR|DW|WMS|POS|KMS|HRIS|EHR|PLM|SAP|Oracle)(?=[^A-Za-z0-9]|$)/gi;
  let sysMatch;
  while ((sysMatch = systemRegex.exec(processed)) !== null) {
    const matchStr = sysMatch[1];
    if (matchStr && !reverseMappingTable[matchStr]) {
      const token = getSystemToken();
      mappingTable[token] = matchStr;
      reverseMappingTable[matchStr] = token;
    }
  }

  // 3. Detect Revenue & Financial Metrics / Numbers
  // e.g., "120억", "120억원", "5000만원", "100만달러", "30%", "150억 원"
  const numberRegex = /\d+(?:\.\d+)?\s*(?:억|천만|만|조|달러|원|%)/g;
  const numberMatches = Array.from(new Set(processed.match(numberRegex) || []));

  for (const match of numberMatches) {
    if (!reverseMappingTable[match]) {
      const token = getNumberToken();
      mappingTable[token] = match;
      reverseMappingTable[match] = token;
    }
  }

  // Apply replacement to form pseudonymized text
  // Sort reverse keys by length descending to replace longer matches first
  const sortedOriginals = Object.keys(reverseMappingTable).sort((a, b) => b.length - a.length);

  for (const original of sortedOriginals) {
    const token = reverseMappingTable[original];
    // Global replace
    const escaped = original.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    processed = processed.replace(new RegExp(escaped, 'g'), token);
  }

  // Log details
  logs.push('==================================================');
  logs.push('🛡️ [Pseudonymization] 클라이언트 사이드 가명화 및 PII 마스킹 처리 완료');
  logs.push(`- 이력서 원문: "${rawText.slice(0, 100)}${rawText.length > 100 ? '...' : ''}"`);
  logs.push(`- 가명화/마스킹 변환 텍스트: "${processed.slice(0, 100)}${processed.length > 100 ? '...' : ''}"`);
  logs.push('- 🔑 매핑 테이블 (오직 로컬 브라우저에만 보관, 서버 미전송):');
  Object.entries(mappingTable).forEach(([token, original]) => {
    logs.push(`  • ${token} ↔ ${original}`);
  });
  logs.push('==================================================');

  // Print nicely to browser developer console
  console.group('%c🛡️ [CareerFit Pseudonymization] 클라이언트 사이드 비식별화 처리', 'color: #10B981; font-weight: bold;');
  console.log('%c[원문 텍스트]', 'color: #6B7280;', rawText);
  console.log('%c[가명화 및 PII 마스킹 후 AI 전송 텍스트]', 'color: #3B82F6; font-weight: bold;', processed);
  console.log('%c[로컬 매핑 테이블 (서버 미전송)]', 'color: #F59E0B;', mappingTable);
  console.groupEnd();

  return {
    pseudonymizedText: processed,
    mappingTable,
    reverseMappingTable,
    logs
  };
}

/**
 * Client-Side De-pseudonymization Engine
 * Reverses token placeholders back to original text using local mapping table.
 */
export function depseudonymizeText(pseudonymizedText: string, mappingTable: Record<string, string>): string {
  if (!pseudonymizedText || typeof pseudonymizedText !== 'string' || !mappingTable || Object.keys(mappingTable).length === 0) {
    return pseudonymizedText;
  }

  let restored = pseudonymizedText;
  const sortedTokens = Object.keys(mappingTable).sort((a, b) => b.length - a.length);

  for (const token of sortedTokens) {
    const original = mappingTable[token];
    const escaped = token.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    restored = restored.replace(new RegExp(escaped, 'g'), original);
  }

  return restored;
}

/**
 * Recursively de-pseudonymize objects/arrays/strings returned from AI API
 */
export function depseudonymizeObject<T>(data: T, mappingTable: Record<string, string>): T {
  if (!data || !mappingTable || Object.keys(mappingTable).length === 0) {
    return data;
  }

  if (typeof data === 'string') {
    return depseudonymizeText(data, mappingTable) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map(item => depseudonymizeObject(item, mappingTable)) as unknown as T;
  }

  if (typeof data === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = depseudonymizeObject(value, mappingTable);
    }
    return result as T;
  }

  return data;
}

