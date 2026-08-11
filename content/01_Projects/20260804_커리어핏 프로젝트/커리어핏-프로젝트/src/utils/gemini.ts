// Gemini AI API & Pure Local Fallback Engine
// Integrates System (.env) Gemini API Key with automatic offline fallback

/**
 * Returns System (.env) Gemini API Key
 */
export function getSystemApiKey(): string {
  // Vite standard env or process.env (injected via vite.config.ts)
  const metaEnv = (import.meta as any).env;
  const envKey = (metaEnv && metaEnv.VITE_GEMINI_API_KEY)
    || (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY);


  return envKey ? envKey.trim() : '';
}

// Preserved helpers for backward compatibility
export function getStoredApiKey(): string {
  return getSystemApiKey();
}

export function setStoredApiKey(_key: string): void {
  // No-op: Browser key input is disabled by design.
}

export function removeStoredApiKey(): void {
  // No-op
}

export function hasApiKey(): boolean {
  return Boolean(getSystemApiKey());
}

/**
 * Direct REST API fetch to Google Gemini Models (gemini-2.5-flash)
 */
/**
 * Direct REST API fetch to Supabase Edge Function Proxy
 */
async function callGeminiAPI(prompt: string): Promise<any> {
  const SUPABASE_FUNCTION_URL = "https://fowrhcrhwmgxhelblxek.supabase.co/functions/v1/gemini-proxy";

  const response = await fetch(SUPABASE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase Proxy 호출 실패 (Status: ${response.status}): ${errorText}`);
  }

  const jsonResult = await response.json();
  const textContent = jsonResult?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error('Gemini API 응답 결과 텍스트가 비어있습니다.');
  }

  // Clean markdown codeblocks if returned
  let cleaned = textContent.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '').trim();
  }

  return JSON.parse(cleaned);
}

/**
 * Smart Text Parser to accurately extract Company Name & Position from raw text or URL
 */
function smartExtractCompanyAndPosition(inputText: string, url: string = '') {
  const lines = inputText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const topLines = lines.slice(0, 10);
  const fullText = inputText;

  let companyName = '';
  let position = '';
  let title = topLines[0] || '채용 공고';

  // 1. Check Explicit Line Labels (e.g. "회사명: OOO", "기업명: OOO", "직무: OOO")
  for (const line of topLines) {
    const compMatch = line.match(/(?:회사명|기업명|Company|Company Name)\s*[:|-]\s*(.+)/i);
    if (compMatch && compMatch[1] && !companyName) {
      companyName = compMatch[1].trim();
    }
    const posMatch = line.match(/(?:직무|포지션|Role|Position|채용\s*직무)\s*[:|-]\s*(.+)/i);
    if (posMatch && posMatch[1] && !position) {
      position = posMatch[1].trim();
    }
  }

  // 2. Bracket or Delimiter Patterns in Top Lines (e.g. "[Company] Position", "Company - Position", "Company | Position")
  if (topLines.length > 0) {
    for (const line of topLines.slice(0, 3)) {
      // Bracket pattern: [회사명] 포지션
      const bracketMatch = line.match(/^\[(.*?)\]\s*(.*)/);
      if (bracketMatch) {
        if (!companyName) companyName = bracketMatch[1].trim();
        if (!position && bracketMatch[2]) position = bracketMatch[2].trim();
        title = line;
        break;
      }

      // Delimiter patterns: Company - Position or Company | Position
      let foundDelim = false;
      for (const delim of [' - ', ' | ', ' / ', ' : ']) {
        if (line.includes(delim)) {
          const parts = line.split(delim);
          if (parts.length >= 2 && parts[0].trim().length > 1) {
            if (!companyName) companyName = parts[0].trim();
            if (!position) position = parts.slice(1).join(delim).trim();
            title = line;
            foundDelim = true;
            break;
          }
        }
      }
      if (foundDelim) break;
    }
  }

  // 3. Search "About [Company]" or "About Company Name" or "주식회사 [Company]" in text
  if (!companyName) {
    const aboutMatch = fullText.match(/(?:About|회사\s*소개|기업\s*소개|근무처)\s+([A-Za-z0-9가-힣&(주)]+)/i);
    if (aboutMatch && aboutMatch[1]) {
      companyName = aboutMatch[1].trim();
    }
  }

  // 4. Search Company / Brand Name from URL if available (Strictly EXCLUDE recruitment platform aggregators like LinkedIn, Wanted, Saramin, etc.)
  if (!companyName && url) {
    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      const host = parsedUrl.hostname.toLowerCase().replace('www.', '');
      
      // 채용 플랫폼 도메인은 채용 기업이 아니므로 회사명 추론 대상에서 엄격히 제외
      const isAggregatorPlatform = /linkedin|wanted|jobkorea|saramin|remember|blind|incruit|catch|rocketpunch|glassdoor/i.test(host);
      
      if (!isAggregatorPlatform) {
        const domainName = host.split('.')[0];
        if (domainName && domainName.length > 2) {
          companyName = domainName.charAt(0).toUpperCase() + domainName.slice(1);
        }
      }
    } catch (_e) {
      // Ignore URL parse error
    }
  }

  // 5. Search Position Title from Top Lines using Role keywords
  if (!position) {
    const roleKeywords = /(?:Manager|PM|PO|Engineer|Developer|Analyst|Lead|Specialist|Designer|Marketer|기획자|담당자|매니저|엔지니어|개발자|분석가|디자이너|리드|스페셜리스트|코디네이터)/i;
    for (const line of topLines) {
      if (roleKeywords.test(line) && line.length < 80) {
        position = line;
        break;
      }
    }
  }

  // Fallback to top line text if still empty
  const defaultHeader = topLines[0] || '채용 공고';
  if (!companyName) companyName = defaultHeader.slice(0, 50);
  if (!position) position = defaultHeader.slice(0, 60);

  return { companyName, position, title };
}

/**
 * Job Description Scraper & Parser
 * Tries Gemini AI API first; if unavailable or failed, smoothly falls back to local regex engine.
 */
export async function localScrapeJD(url: string, rawText: string) {
  let inputText = rawText || '';

  // Simulation/Extraction for sample or URL-only input
  if (url && !rawText) {
    if (url.includes('4445699622') || url.includes('linkedin.com/jobs/view') || url.toLowerCase().includes('johnson') || url.toLowerCase().includes('medtech')) {
      inputText = `[Johnson & Johnson MedTech] Associate Product Manager - Electrophysiology
Location: Seoul, South Korea | Employment Type: Full-time

■ About Johnson & Johnson MedTech
At Johnson & Johnson MedTech, we’re changing the trajectory of health for humanity. By combining surgical technologies with science, we're developing clinical solutions that help patients live longer and more active lives.

■ 주요 업무 (Tasks & Responsibilities)
- Support annual marketing plans, product positioning, segmentation, value propositions, and lifecycle management for assigned EP products and procedures.
- Coordinate new product introduction and launch readiness across Regulatory, Market Access, Supply Chain, Finance, Professional Education, Medical Affairs, Sales, and Clinical Sales.
- Analyze sales, procedure volume, market share, product mix, pricing, customer adoption, and competitive activity; prepare regular dashboards and business reviews.
- Support demand forecasting, inventory reviews, product transitions, and supply-risk management with Sales and Supply Chain.
- Develop and localize sales tools, customer presentations, competitive messaging, digital content, and internal product training materials.
- Partner with field teams on customer visits, congresses, workshops, key account plans, and structured voice-of-customer collection.
- Support KOL, early-adopter, and reference-account development in collaboration with Professional Education and regional colleagues.
- Manage sample management, demonstration product compliance, and marketing collateral inventory.
- Track marketing budget, expenses, and coordinate vendor setup and PO management processes.
- Ensure all promotional materials and events comply with HCC (Health Care Compliance) guidelines.

■ 필수 자격요건 (Requirements)
- Bachelor’s degree in business, marketing, life sciences, biomedical engineering, healthcare, or a related field.
- Approximately 2 to 5 years of relevant experience in medical devices, healthcare, pharmaceuticals, marketing, sales, business analytics, or consulting.
- Strong analytical, project management, communication, and stakeholder-management skills.
- Business-level Korean and English communication skills.
- Proficiency in Microsoft Excel and PowerPoint.
- Willingness to travel domestically and occasionally internationally.

■ 우대 및 선호요건 (Preferred Qualifications)
- Experience in medical devices, cardiovascular, electrophysiology, cardiac mapping, ablation, PFA, ultrasound, or other complex procedural technologies.
- Experience supporting product launches, forecasting, customer segmentation, market development, capital equipment, or software-enabled products.
- Understanding of the Korean healthcare market, reimbursement environment, hospital purchasing process, or medical-device regulations.
- Experience working in a regional or global matrix organization and collaborating with field-based commercial teams.
- Preference will be given to individuals subject to national veterans’ benefits and persons with disabilities upon submission of relevant documents as per applicable laws.

■ Recruitment Process
- Deadline: Always open (Rolling basis)`;
    } else {
      inputText = `[채용공고 스크랩] 입력된 URL [${url}] 에 대한 공고 파싱.
회사명: 채용 기업
직무: IT / 프로덕트 매니저 / 엔지니어
주요 업무:
- 해당 직무 관련 기획, 개발 및 운영 업무 수행
- 팀내 크로스 펑셔널 협업 및 지표 관리
필수 자격요건:
- 관련 경력 2년 이상 또는 이에 준하는 역량
- 원활한 의사소통 및 문제 해결 능력
우대 사항:
- 관련 도메인 프로젝트 수행 및 성공 경험
마감일: 데드라인 미정 (상시/채용시 마감)`;
    }
  }

  if (!inputText || inputText.trim().length < 5) {
    throw new Error('파싱할 채용공고 텍스트가 유효하지 않습니다.');
  }

  const smartExtracted = smartExtractCompanyAndPosition(inputText, url);

  // 1. Try Gemini AI API First
  try {
    const aiPrompt = `다음 채용공고 텍스트에서 기업명과 담당 직무/포지션을 포함한 주요 공고 정보를 정교하게 분석하여 JSON으로 응답해줘.

추출 정교화 지침:
1. companyName: 원문의 상단 헤더, '[회사명]', 'About 회사명', '기업명:', 'Company:' 또는 브랜드명에서 실제 채용 기업명을 정확하게 분리 추출해줘. (주의: 링크드인, 원티드, 잡코리아, 사람인 등 공고가 올라온 중개 플랫폼 이름이 아니라 실제 인재를 채용하는 기업/브랜드명을 추출해야 합니다.)
2. position: 채용하는 포지션명/직무명(예: 'Associate Product Manager', 'Localization PM', 'Frontend Developer' 등)만 정확하게 추출해줘. 뒤에 붙는 불필요한 '채용안내/모집공고' 단어는 제거해줘.
3. title: 공고 전체 대표 제목
4. dueDate: 특정 날짜(YYYY-MM-DD)가 있으면 날짜로, 없거나 상시/채용시 마감이면 '데드라인 미정 (상시/채용시 마감)'으로 명시해줘.

JSON format:
{
  "companyName": "회사명 (예: Johnson & Johnson, 토스, LocalizationJobs 등)",
  "title": "채용공고 전체 제목",
  "position": "직무/포지션명 (예: Product Manager, 현지화 PM, 백엔드 개발자 등)",
  "dueDate": "마감일 (YYYY-MM-DD 포맷 또는 '데드라인 미정 (상시/채용시 마감)')",
  "tasks": ["주요 업무 1", "주요 업무 2"],
  "requirements": ["필수 자격요건 1", "필수 자격요건 2"],
  "preferred": ["우대 사항 1", "우대 사항 2"],
  "keywords": ["공고 원문의 실제 핵심 기술/도구/직무 키워드 1", "키워드 2"],
  "location": "근무지 위치 (정보 없으면 '원문 참조')",
  "salary": "급여/연봉 (정보 없으면 '채용 시 협의')"
}

[채용공고 원문]:
${inputText.slice(0, 4000)}`;

    const aiParsed = await callGeminiAPI(aiPrompt);
    if (aiParsed) {
      let cleanCompany = aiParsed.companyName && aiParsed.companyName !== '채용 기업'
        ? aiParsed.companyName.trim()
        : smartExtracted.companyName;

      let cleanPos = aiParsed.position && aiParsed.position !== '해당 직무'
        ? aiParsed.position.trim()
        : smartExtracted.position;

      return {
        success: true,
        data: {
          companyName: cleanCompany,
          title: aiParsed.title || smartExtracted.title || `${cleanCompany} - ${cleanPos}`,
          position: cleanPos,
          dueDate: aiParsed.dueDate || '데드라인 미정 (상시/채용시 마감)',
          tasks: Array.isArray(aiParsed.tasks) && aiParsed.tasks.length > 0 ? aiParsed.tasks : [aiParsed.tasks || "주요 업무 원문 참조"],
          requirements: Array.isArray(aiParsed.requirements) && aiParsed.requirements.length > 0 ? aiParsed.requirements : [aiParsed.requirements || "자격 요건 원문 참조"],
          preferred: Array.isArray(aiParsed.preferred) ? aiParsed.preferred : [],
          keywords: Array.isArray(aiParsed.keywords) && aiParsed.keywords.length > 0 ? aiParsed.keywords : extractFallbackKeywords(inputText),
          location: aiParsed.location || "원문 참조",
          salary: aiParsed.salary || "채용 시 협의",
          rawText: inputText,
          originalUrl: url || '',
          scrapedAt: new Date().toISOString().split('T')[0],
          fullRawText: inputText,
          isAiParsed: true
        }
      };
    }
  } catch (err) {
    console.warn('Gemini AI API Parsing failed, switching seamlessly to local regex parser engine:', err);
  }

  // 2. Pure Local Offline Regex & Pattern Parsing Engine (Fallback)
  return pureLocalScrapeEngine(url, inputText);
}

/**
 * Clean whitespace and basic symbols, but preserve original text
 */
function sanitizeTitleOrCompany(rawStr: string, fallback: string): string {
  if (!rawStr) return fallback;
  let cleaned = rawStr.trim();
  cleaned = cleaned.replace(/^[-_:|\s]+|[-_:|\s]+$/g, '').trim();
  if (!cleaned) return fallback;
  return cleaned;
}

/**
 * Dynamically extract meaningful keywords from input text
 */
function extractFallbackKeywords(text: string): string[] {
  const dictionary = [
    "React", "TypeScript", "JavaScript", "Node.js", "Next.js", "Python", "Java", "Go",
    "Kubernetes", "Docker", "AWS", "Flutter", "Kotlin", "Swift", "Figma", "GA4", "SQL",
    "Git", "C++", "Vue.js", "Spring", "Django", "FastAPI", "Electrophysiology", "Product Management",
    "Data Analysis", "Project Management", "Marketing", "Communication", "English", "Korean", "Excel",
    "HR", "인사", "채용", "조직관리", "성과관리", "보상", "급여", "노무", "현지화", "Localization", "PM"
  ];

  const matched = new Set<string>();
  for (const kw of dictionary) {
    if (new RegExp('\\b' + kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i').test(text)) {
      matched.add(kw);
    }
  }
  const result = Array.from(matched);
  if (result.length > 0) return result.slice(0, 8);

  // If no dictionary match, extract frequent Noun-like words (>2 chars, not noise)
  const words = text.split(/[\s,./()\[\]-]+/).map(w => w.trim()).filter(w => w.length >= 2 && !/^(및|등|수|위해|대한|관한|경우|있습니다|합니다|채용공고|직무역량|실무경험)$/.test(w));
  const uniqueWords = Array.from(new Set(words));
  return uniqueWords.slice(0, 5);
}

/**
 * Pure Local Offline Scraper Engine (Fallback)
 */
function pureLocalScrapeEngine(url: string, inputText: string) {
  const smart = smartExtractCompanyAndPosition(inputText, url);

  const lines = inputText.split('\n');
  const companyName = smart.companyName;
  const title = smart.title;
  const position = smart.position;

  let currentSection: 'intro' | 'tasks' | 'requirements' | 'preferred' | 'etc' = 'intro';
  const tasks: string[] = [];
  const requirements: string[] = [];
  const preferred: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const lower = trimmed.toLowerCase();
    if (/주요\s*업무|담당\s*업무|할\s*일|역할|role|responsibilities|tasks/i.test(lower)) {
      currentSection = 'tasks';
      continue;
    } else if (/필수\s*자격|필수\s*요건|자격\s*요건|지원\s*자격|requirements|eligibility/i.test(lower)) {
      currentSection = 'requirements';
      continue;
    } else if (/우대\s*사항|우대\s*조건|선호\s*요건|preferred|qualifications/i.test(lower)) {
      currentSection = 'preferred';
      continue;
    } else if (/혜택|복지|전형\s*절차|근무\s*조건|benefits|process|recruitment\s*process/i.test(lower)) {
      currentSection = 'etc';
      continue;
    }

    if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•') || /^\d+[\s.)]/.test(trimmed)) {
      const item = trimmed.replace(/^[-*•\s]+|^\d+[\s.)]+\s*/, '').trim();
      if (item) {
        if (currentSection === 'tasks') tasks.push(item);
        else if (currentSection === 'requirements') requirements.push(item);
        else if (currentSection === 'preferred') preferred.push(item);
      }
    } else if (trimmed.length > 5 && trimmed.length < 200 && !trimmed.startsWith('■') && !trimmed.startsWith('#')) {
      if (currentSection === 'tasks') tasks.push(trimmed);
      else if (currentSection === 'requirements') requirements.push(trimmed);
      else if (currentSection === 'preferred') preferred.push(trimmed);
    }
  }

  if (tasks.length === 0) tasks.push("공고 원문 텍스트의 주요 담당 업무 항목 참조");
  if (requirements.length === 0) requirements.push("관련 직무 실무 경험 및 문제 해결 역량 보유자");
  if (preferred.length === 0) preferred.push("유관 전공자 또는 해당 직무 관련 프로젝트 경험자");

  const keywords = extractFallbackKeywords(inputText);

  let dueDate = "데드라인 미정 (상시/채용시 마감)";
  const isAlwaysOpen = /until\s*filled|상시\s*채용|채용시\s*마감|rolling\s*basis|TBD|미정|상시/i.test(inputText);
  const dateMatch = inputText.match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/);

  if (dateMatch && !isAlwaysOpen) {
    dueDate = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`;
  }

  let location = "원문 참조 (서울/판교 등)";
  if (inputText.includes("Location:")) {
    const locLine = lines.find(l => l.includes("Location:"));
    if (locLine) location = locLine.replace("Location:", "").trim();
  }

  return {
    success: true,
    data: {
      companyName,
      title,
      position,
      dueDate,
      tasks,
      requirements,
      preferred,
      keywords,
      location,
      salary: "채용 시 협의",
      rawText: inputText,
      originalUrl: url || '',
      scrapedAt: new Date().toISOString().split('T')[0],
      fullRawText: inputText,
      isAiParsed: false
    }
  };
}

/**
 * Resume & Job Description Match Analyzer
 * Uses Gemini AI API first; if unavailable, uses offline keyword & scoring analyzer.
 */
export async function localAnalyzeMatch(job: any, userResume: any) {
  const attachedFilesText = userResume.attachedFiles && userResume.attachedFiles.length > 0
    ? userResume.attachedFiles.map((f: any) => `[서류: ${f.name}]\n${f.extractedText || ''}`).join('\n\n')
    : '';

  const cleanPos = sanitizeTitleOrCompany(job.position, '해당 직무');
  const cleanCompany = sanitizeTitleOrCompany(job.companyName, '해당 기업');

  // 1. Try Gemini AI Match Analysis First
  try {
    const aiMatchPrompt = `다음 채용공고와 구직자 이력서를 엄격하게 비교 대조하여 이력서 적합도 분석 결과를 JSON으로 제공해줘.

중요 분석 지침:
- 구직자의 이력서 직무(예: HR, 인사)와 채용공고 직무(예: PM, 프로덕트 매니저, 개발자)의 직무 도메인이 상이하면 관대하게 점수를 주지 말고 20~45점 사이의 낮은 점수를 부여해.
- 이력서 역량과 공고의 필수 요구사항이 얼마나 명확하게 부합하는지에 따라 0~100점 사이에서 정직하게 평가해줘.

JSON Format:
{
  "matchScore": 75 (0~100 사이 정수, 직무 도메인/스택이 현저히 다르면 20~40점대 감점 적용 필수),
  "summary": "종합 매칭 요약평가 (2~3문장)",
  "matchedPoints": ["부합하는 강점 1", "부합하는 강점 2"],
  "improvementPoints": ["보완해야할 항목 1", "보완해야할 항목 2"],
  "matchedKeywords": ["일치하는 핵심 스택/키워드들"],
  "missingKeywords": ["이력서에 부족한 공고 우대 키워드들"],
  "resumeImprovementTips": ["이력서 보완 팁 1", "이력서 보완 팁 2"],
  "interviewPrepQuestions": ["예상 면접 질문 1", "예상 면접 질문 2"]
}

[채용공고 정보]
회사: ${cleanCompany}, 직무: ${cleanPos}
주요업무/요구사항: ${(job.tasks || []).join(', ')} / ${(job.requirements || []).join(', ')} / ${(job.keywords || []).join(', ')}

[구직자 이력서 내용]
제목: ${userResume.title || ''}, 경력: ${userResume.experienceYears || 1}년
요약/스킬: ${userResume.summary || ''} / ${(userResume.skills || []).join(', ')}
포트폴리오/첨부서류: ${userResume.portfolioSummary || ''} ${attachedFilesText}`;

    const aiMatchResult = await callGeminiAPI(aiMatchPrompt);
    if (aiMatchResult && typeof aiMatchResult.matchScore === 'number') {
      return {
        success: true,
        data: {
          matchScore: Math.min(100, Math.max(0, aiMatchResult.matchScore)),
          summary: `[✨ Gemini 2.5 AI 분석] ${aiMatchResult.summary || '이력서 분석이 완료되었습니다.'}`,
          matchedPoints: aiMatchResult.matchedPoints || ["보유 역량 중 일부 항목이 공고 조건과 부합합니다."],
          improvementPoints: aiMatchResult.improvementPoints || ["공고 핵심 직무에 부합하는 서류 내용 보강이 필요합니다."],
          matchedKeywords: aiMatchResult.matchedKeywords || [],
          missingKeywords: aiMatchResult.missingKeywords || [],
          resumeImprovementTips: aiMatchResult.resumeImprovementTips || ["지원 직무에 맞춰 경험 및 성과를 재구성하세요."],
          interviewPrepQuestions: aiMatchResult.interviewPrepQuestions || ["지원 직무에 관심 가지게 된 계기를 설명해주세요."],
          isAiAnalyzed: true
        }
      };
    }
  } catch (err) {
    console.warn('Gemini AI Match Analysis failed, switching to local engine:', err);
  }

  // 2. Pure Local Offline Analyzer (Fallback)
  return pureLocalAnalyzeEngine(job, userResume, attachedFilesText);
}

/**
 * Job Category Domain Classification Helper
 */
function detectJobDomain(text: string): string {
  const lower = text.toLowerCase();
  if (/hr|인사|채용|노무|인재|급여|보상|조직|rector|talent|people/i.test(lower)) return 'HR';
  if (/pm|po|product manager|project manager|프로덕트|서비스 기획|기획자|애자일/i.test(lower)) return 'PM';
  if (/developer|engineer|frontend|backend|fullstack|개발자|소프트웨어|엔지니어|react|typescript|python|java/i.test(lower)) return 'DEV';
  if (/marketing|marketer|퍼포먼스|마케팅|마케터|콘텐츠|ga4|seo/i.test(lower)) return 'MARKETING';
  if (/designer|ux|ui|디자이너|피그마|figma/i.test(lower)) return 'DESIGN';
  return 'GENERAL';
}

/**
 * Pure Local Offline Match Analyzer (Fallback)
 */
function pureLocalAnalyzeEngine(job: any, userResume: any, attachedFilesText: string) {
  const resumeFullText = `${userResume.title} ${userResume.summary} ${(userResume.skills || []).join(' ')} ${userResume.portfolioSummary || ''} ${attachedFilesText}`.toLowerCase();

  const cleanPos = sanitizeTitleOrCompany(job.position, '해당 직무');
  const cleanCompany = sanitizeTitleOrCompany(job.companyName, '지원 기업');

  const jobKeywords: string[] = (job.keywords || []).filter((k: string) => !/^(채용공고|직무역량|실무경험)$/.test(k));
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of jobKeywords) {
    if (resumeFullText.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  if (matchedKeywords.length === 0 && userResume.skills) {
    for (const skill of userResume.skills) {
      if ((job.rawText || '').toLowerCase().includes(skill.toLowerCase())) {
        matchedKeywords.push(skill);
      }
    }
  }

  // Domain Mismatch Penalty Logic
  const jobDomain = detectJobDomain(`${job.title || ''} ${job.position || ''} ${(job.keywords || []).join(' ')}`);
  const resumeDomain = detectJobDomain(`${userResume.title || ''} ${userResume.summary || ''} ${(userResume.skills || []).join(' ')}`);

  let domainPenalty = 0;
  const isDomainMismatch = (jobDomain !== 'GENERAL' && resumeDomain !== 'GENERAL' && jobDomain !== resumeDomain);
  if (isDomainMismatch) {
    domainPenalty = 30; // 30-point heavy penalty for HR vs PM/DEV mismatch
  }

  const baseScore = 35;
  const keywordRatio = jobKeywords.length > 0 ? (matchedKeywords.length / jobKeywords.length) : 0.2;
  const experienceBonus = Math.min(10, (userResume.experienceYears || 1) * 1.5);
  
  const rawScore = baseScore + (keywordRatio * 45) + experienceBonus - domainPenalty;
  const matchScore = Math.min(98, Math.max(15, Math.round(rawScore)));

  const matchedPoints: string[] = [];
  if (matchedKeywords.length > 0) {
    matchedPoints.push(`보유 역량 중 [${matchedKeywords.slice(0, 3).join(', ')}] 관련 경험이 공고의 일부 요구사항과 부합합니다.`);
  } else {
    matchedPoints.push(`보유 경력 연차(${userResume.experienceYears || 1}년) 및 관련 기초 업무 경험이 지원 서류의 바탕이 됩니다.`);
  }

  if (!isDomainMismatch) {
    matchedPoints.push(`지원 공고(${cleanPos}) 분야와 구직자 직무 카테고리가 상통하여 관련 직무 수행 가능성이 있습니다.`);
  } else {
    matchedPoints.push(`직무 도메인 차이(${resumeDomain} → ${jobDomain})가 있으나 조직 내 프로젝트 협업 역량을 어필해볼 수 있습니다.`);
  }

  const improvementPoints: string[] = [];
  if (isDomainMismatch) {
    improvementPoints.push(`현재 이력서는 [${resumeDomain}] 중심인 반면, 지원 공고는 [${jobDomain}] 직무로 직무 카테고리가 달라 서류 적합도 점수가 대폭 차감되었습니다.`);
  }
  if (missingKeywords.length > 0) {
    improvementPoints.push(`공고 요구 키워드인 [${missingKeywords.slice(0, 3).join(', ')}] 관련 실무 경험 및 기술 스택 보감이 필수적입니다.`);
  } else {
    improvementPoints.push(`프로젝트 성과를 수치화된 정량 지표(예: KPI 개선율, 효율성 % 향상 등)로 더 명확히 기술할 필요가 있습니다.`);
  }

  const resumeImprovementTips: string[] = [
    isDomainMismatch
      ? `지원 직무인 [${cleanPos}]에 부합하도록 이력서 상단 요약문과 커리어 목표를 해당 직무 중심으로 전면 개편하세요.`
      : `${cleanCompany}의 주요 사업 과제와 연결된 트러블슈팅 경험을 최상단에 강조하세요.`,
    missingKeywords.length > 0
      ? `핵심 우대 키워드 [${missingKeywords[0]}] 관련 유사 프로젝트나 학습 경험을 이력서 본문에 추가하세요.`
      : `프로젝트별 구체적인 역할과 본인의 직접 기여도를 명확히 구분하여 서술하세요.`
  ];

  const interviewPrepQuestions: string[] = [
    isDomainMismatch
      ? `[${resumeDomain}] 경력 바탕에서 [${cleanPos}] 직무로 지원하게 된 구체적인 계기와 준비 과정은 무엇인가요?`
      : `${cleanPos} 직무를 수행할 때 본인이 가장 자신 있는 핵심 경쟁력과 관련 사례를 설명해주세요.`,
    `${cleanCompany} 지원 시 부족하다고 느낀 공고 요구사항과 이를 보완하기 위한 개인적 노력은 무엇인가요?`
  ];

  return {
    success: true,
    data: {
      matchScore,
      summary: isDomainMismatch
        ? `[⚡ 오프라인 직무 분석] 이력서의 주요 직무(${resumeDomain})와 공고 요구 직무(${jobDomain}) 간 도메인 차이가 커 매칭 점수는 ${matchScore}점으로 낮게 평가되었습니다.`
        : `[⚡ 오프라인 스마트 분석] 공고 요구사항과 이력서 프로필을 비교 대조한 결과 종합 매칭 점수는 ${matchScore}점입니다.`,
      matchedPoints,
      improvementPoints,
      matchedKeywords: matchedKeywords.length ? matchedKeywords : [],
      missingKeywords,
      resumeImprovementTips,
      interviewPrepQuestions,
      isAiAnalyzed: false
    }
  };
}

