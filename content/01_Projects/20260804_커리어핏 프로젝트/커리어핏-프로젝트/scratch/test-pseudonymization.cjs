const rawText = "홍길동 (010-1234-5678, user@example.com, 서울시 강남구 테헤란로 123, 1995년생, 남성, 한국대학교 출신) - A기업 ERP 고도화 프로젝트에서 연간 매출 120억 달성에 기여";

function pseudonymizeText(rawText) {
  const mappingTable = {};
  const reverseMappingTable = {};

  let companyIndex = 0;
  let systemIndex = 0;
  let numberIndex = 0;

  const getCompanyToken = () => `[회사${String.fromCharCode(65 + companyIndex++)}]`;
  const getSystemToken = () => `[시스템${String.fromCharCode(65 + systemIndex++)}]`;
  const getNumberToken = () => `[수치${String.fromCharCode(65 + numberIndex++)}]`;

  let processed = rawText;

  // Tier 1: Direct PII
  processed = processed.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  processed = processed.replace(/(?:01[016789]|02|0[3-9][0-9])[-.\s]?\d{3,4}[-.\s]?\d{4}/g, '[PHONE]');
  processed = processed.replace(/\d{6}[-~]?\d{7}/g, '[RESIDENT_ID]');
  processed = processed.replace(/https?:\/\/[^\s]+/g, '[LINK]');
  processed = processed.replace(/(?:서울|경기|인천|부산|대구|광주|대전|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주)(?:특별자치|광역시|도)?\s+[가-힣]+(?:시|군|구)\s+[가-힣0-9\s-]+(?:로|길|동)\s*\d*/g, '[ADDRESS]');

  // Tier 2: Indirect PII
  processed = processed.replace(/[가-힣]{2,10}(?:대학교|대학원|여자대학교)/g, '[UNIVERSITY]');
  processed = processed.replace(/(?:\b19\d{2}|\b20\d{2})년생|\b\d{2}세/g, '[AGE_REMOVED]');
  processed = processed.replace(/\b(남성|여성)\b|\((?:남|여)\)/g, '[GENDER_REMOVED]');

  // Tier 3: Business-Sensitive Info
  const companyRegex = /(?:\(주\)|주식회사\s*)?[A-Za-z0-9가-힣]+(?:기업|회사|전자|테크|솔루션|시스템즈|시스템|랩스|그룹|인터내셔널|바이오|소프트|Inc|Corp|Ltd)\b|[A-Za-z0-9가-힣]기업/g;
  const companyMatches = Array.from(new Set(processed.match(companyRegex) || []));

  for (const match of companyMatches) {
    if (!reverseMappingTable[match] && !match.startsWith('[')) {
      const token = getCompanyToken();
      mappingTable[token] = match;
      reverseMappingTable[match] = token;
    }
  }

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

  const numberRegex = /\d+(?:\.\d+)?\s*(?:억|천만|만|조|달러|원|%)/g;
  const numberMatches = Array.from(new Set(processed.match(numberRegex) || []));

  for (const match of numberMatches) {
    if (!reverseMappingTable[match]) {
      const token = getNumberToken();
      mappingTable[token] = match;
      reverseMappingTable[match] = token;
    }
  }

  const sortedOriginals = Object.keys(reverseMappingTable).sort((a, b) => b.length - a.length);
  for (const original of sortedOriginals) {
    const token = reverseMappingTable[original];
    processed = processed.replace(new RegExp(original.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), token);
  }

  return { pseudonymizedText: processed, mappingTable };
}

function depseudonymizeText(pseudonymizedText, mappingTable) {
  let restored = pseudonymizedText;
  for (const [token, original] of Object.entries(mappingTable)) {
    restored = restored.replace(new RegExp(token.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), original);
  }
  return restored;
}

console.log("----------------------------------------");
console.log("원문:", rawText);
const res = pseudonymizeText(rawText);
console.log("가명화 및 PII 마스킹 텍스트:", res.pseudonymizedText);
console.log("매핑 테이블:", res.mappingTable);

const restored = depseudonymizeText(res.pseudonymizedText, res.mappingTable);
console.log("경영민감정보 원문 역매핑 복원 결과:", restored);
console.log("가명화 복원 검증 결과:", restored.includes("A기업") && restored.includes("ERP") && restored.includes("120억") ? "✅ 성공 (Pass)" : "❌ 실패 (Fail)");
console.log("Direct/Indirect PII 마스킹 검증 결과:", res.pseudonymizedText.includes("[PHONE]") && res.pseudonymizedText.includes("[EMAIL]") && res.pseudonymizedText.includes("[UNIVERSITY]") ? "✅ 성공 (Pass)" : "❌ 실패 (Fail)");
console.log("----------------------------------------");
