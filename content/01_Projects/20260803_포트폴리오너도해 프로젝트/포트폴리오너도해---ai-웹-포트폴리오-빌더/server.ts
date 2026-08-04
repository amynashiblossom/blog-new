import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Client as NotionClient } from "@notionhq/client";


dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini SDK with User-Agent header as required
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Helper: Extract keywords directly from user's written experience blocks text
function extractKeywordsFromUserBlocks(blocks: any[], jobDescriptionText: string = "") {
  const extracted: Array<{
    keyword: string;
    sourceProjectTitle: string;
    category: 'metric' | 'tech' | 'role' | 'domain';
    isMatchedWithJD: boolean;
    frequency: number;
  }> = [];

  const jdUpper = jobDescriptionText.toUpperCase();

  (blocks || []).forEach((b) => {
    const pName = b.notionSpec?.projectName || b.title || "프로젝트";
    const combinedText = `
      ${pName} 
      ${b.notionSpec?.role || ''} 
      ${b.notionSpec?.keyOutcome || ''} 
      ${b.star?.situation || ''} 
      ${b.star?.task || ''} 
      ${b.star?.action || ''} 
      ${b.star?.result || ''}
      ${(b.skills || []).join(' ')}
      ${b.fiveCards?.card3_solutionAction1?.techOrFrameworkUsed || ''}
      ${b.fiveCards?.card5_impact?.qualitativeFeedback || ''}
    `.trim();

    // 1. Technical / Framework terms
    const techRegex = /(AGILE|SCRUM|FIGMA|REACT|TYPESCRIPT|PYTHON|SQL|A\/B\s*테스트|CVP|CVR|CTR|ROAS|GA4|AMPLITUDE|MIXPANEL|ZOOM|NOTION|SLACK|JIRA|REST|API|DOCKER|KUBERNETES|SPARK|FLASK|NODE\.JS|NEXT\.JS|TAILWIND|UX|UI|DESIGN\s*SYSTEM|A\/B테스트|데이터분석|유저인터뷰)/gi;
    const foundTechs = Array.from(new Set(combinedText.match(techRegex) || []));
    foundTechs.forEach(t => {
      const norm = t.trim().toUpperCase();
      const isMatched = jdUpper.includes(norm) || jdUpper.includes(t.trim());
      extracted.push({
        keyword: t.trim(),
        sourceProjectTitle: pName,
        category: 'tech',
        isMatchedWithJD: isMatched,
        frequency: (combinedText.match(new RegExp(t.trim(), 'gi')) || []).length
      });
    });

    // 2. Metrics & Quantitative outcomes
    const metricRegex = /(\d+(\.\d+)?%\s*(개선|감소|상승|증가|달성|절감)?|[\d,]+\s*(원|건|명|배)|[-+]?\d+(\.\d+)?%|CVR|이탈률|전환율|유입량|로딩\s*속도)/gi;
    const foundMetrics = Array.from(new Set(combinedText.match(metricRegex) || []));
    foundMetrics.forEach(m => {
      if (m.trim().length > 1) {
        extracted.push({
          keyword: m.trim(),
          sourceProjectTitle: pName,
          category: 'metric',
          isMatchedWithJD: jdUpper.includes(m.trim().toUpperCase()),
          frequency: 1
        });
      }
    });

    // 3. Roles & Key Action Domains from user text
    const roleRegex = /(리드\s*PM|PO|서비스기획자|백엔드\s*개발자|프론트엔드|UI\/UX\s*디자이너|그로스\s*마케터|시스템\s*아키텍처|결제\s*퍼널|이탈률\s*개선|대시보드|디자인\s*시스템|로그\s*분석)/gi;
    const foundRoles = Array.from(new Set(combinedText.match(roleRegex) || []));
    foundRoles.forEach(r => {
      extracted.push({
        keyword: r.trim(),
        sourceProjectTitle: pName,
        category: 'domain',
        isMatchedWithJD: jdUpper.includes(r.trim().toUpperCase()),
        frequency: 1
      });
    });
  });

  // Deduplicate keywords by name & project
  const uniqueMap = new Map<string, typeof extracted[0]>();
  extracted.forEach(item => {
    const key = `${item.keyword.toLowerCase()}_${item.sourceProjectTitle}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  });

  return Array.from(uniqueMap.values());
}

// API 1: AI JD Matching & Competency Analysis
app.post("/api/ai/analyze-jd", async (req, res) => {
  try {
    const { jobDescription, jobCategory, experienceBlocks } = req.body;

    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({ error: "Job Description (JD) text is required" });
    }

    const userExtractedKeywords = extractKeywordsFromUserBlocks(experienceBlocks || [], jobDescription);

    const ai = getGeminiClient();

    if (!ai) {
      // Dynamic fallback based on actual user written experience blocks
      const matched = userExtractedKeywords.filter(k => k.isMatchedWithJD).map(k => k.keyword);
      const matchedUnique = Array.from(new Set(matched.length > 0 ? matched : ["유저 데이터 분석", "A/B 테스트", "Figma", "CVR 개선"]));
      const missingKeywordsList = ["SQL 데이터 쿼리", "원클릭 결제 장애 처리", "GA4 이벤트를 활용한 퍼널 추적"].filter(
        k => !jobDescription.toLowerCase().includes(k.toLowerCase())
      );

      return res.json({
        matchScore: Math.min(95, Math.max(65, 60 + matchedUnique.length * 8)),
        matchedKeywords: matchedUnique,
        missingKeywords: missingKeywordsList,
        extractedUserKeywords: userExtractedKeywords,
        recommendations: (experienceBlocks || []).map((b: any) => ({
          blockId: b.id,
          reason: `사용자께서 직접 작성하신 프로젝트 [${b.notionSpec?.projectName || '프로젝트'}]에서 도출된 역량('${b.notionSpec?.keyOutcome || '성과'}')이 JD의 자격 요건과 직접 부합합니다.`,
          suggestedEnhancement: `작성하신 STAR Action 문장에 '${matchedUnique[0] || '핵심 지표'}'와 정량 수치를 더욱 강조해보세요.`
        })),
        overallSummary: `사용자께서 작성하신 ${experienceBlocks?.length || 0}개의 프로젝트 작성 내용에서 총 ${userExtractedKeywords.length}개의 핵심 AI 키워드가 도출되었습니다. 공고와의 부합도가 높습니다.`,
        tailoredSloganSuggestion: `사용자 작성 핵심 성과(${userExtractedKeywords[0]?.keyword || '데이터 분석'})와 JD 요구사항을 결합한 성과 중심 인재`
      });
    }

    const blocksSummary = (experienceBlocks || []).map((b: any, index: number) => `
    [블록 ${index + 1} - ID: ${b.id}]
    프로젝트명: ${b.notionSpec?.projectName}
    직군: ${b.jobCategory}
    역할/성과: ${b.notionSpec?.keyOutcome}
    STAR Situation: ${b.star?.situation}
    STAR Action: ${b.star?.action}
    STAR Result: ${b.star?.result}
    기술/역량: ${(b.skills || []).join(", ")}
    5Card Impact: ${b.fiveCards?.card5_impact?.qualitativeFeedback || ''}
    `).join("\n\n");

    const prompt = `
당신은 대한민국 IT/서비스 채용 전문가 및 포트폴리오 컨설턴트입니다.
반드시 지원자가 **실제로 작성한 보유 경험 블록 텍스트**를 정밀 분석하여, 지원자의 작성 내용에서 도출된 기술, 성과지표, 역할, 도메인 키워드를 도출하고 공고(JD)와 매칭해주세요.

[채용 공고 (JD)]
${jobDescription}

[직군]
${jobCategory || "general"}

[지원자가 실제 작성한 경험 블록 텍스트]
${blocksSummary}

응답은 반드시 아래 JSON 구조로 반환하세요:
{
  "matchScore": 85 (0~100 정수),
  "matchedKeywords": ["지원자 작성글에서 도출되어 JD와 매칭된 키워드1", "키워드2"],
  "missingKeywords": ["공고에서 요구하지만 지원자 글에 부족한 키워드1", "키워드2"],
  "extractedUserKeywords": [
    {
      "keyword": "지원자 작성글에서 실제 도출된 키워드",
      "sourceProjectTitle": "해당 키워드가 포함된 프로젝트명",
      "category": "tech" | "metric" | "role" | "domain",
      "isMatchedWithJD": true | false,
      "frequency": 1
    }
  ],
  "recommendations": [
    {
      "blockId": "블록 ID",
      "reason": "지원자가 작성한 이 프로젝트의 특정 문장을 추천하는 이유",
      "suggestedEnhancement": "지원자가 작성한 문장을 어떻게 보완할지 제안"
    }
  ],
  "overallSummary": "지원자의 작성 내용 기반 정밀 분석 총평 2~3문장",
  "tailoredSloganSuggestion": "지원자의 실제 성과 기반 맞춤 한 줄 헤드라인 슬로건"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.INTEGER },
            matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            extractedUserKeywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  sourceProjectTitle: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ["tech", "metric", "role", "domain"] },
                  isMatchedWithJD: { type: Type.BOOLEAN },
                  frequency: { type: Type.INTEGER }
                },
                required: ["keyword", "sourceProjectTitle", "category", "isMatchedWithJD", "frequency"]
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  blockId: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  suggestedEnhancement: { type: Type.STRING },
                },
                required: ["blockId", "reason", "suggestedEnhancement"],
              },
            },
            overallSummary: { type: Type.STRING },
            tailoredSloganSuggestion: { type: Type.STRING },
          },
          required: ["matchScore", "matchedKeywords", "missingKeywords", "extractedUserKeywords", "recommendations", "overallSummary", "tailoredSloganSuggestion"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    if (!result.extractedUserKeywords || result.extractedUserKeywords.length === 0) {
      result.extractedUserKeywords = userExtractedKeywords;
    }
    return res.json(result);
  } catch (err: any) {
    console.error("Error in /api/ai/analyze-jd:", err);
    return res.status(500).json({
      error: "AI JD analysis failed",
      message: err.message || "Unknown error",
    });
  }
});

// API 2: AI Confidential Data Real-time Masking Suggestion
app.post("/api/ai/suggest-masking", async (req, res) => {
  try {
    const { text, projectTitle } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback regex masking
      let maskedText = text
        .replace(/(\d{1,3}(,\d{3})*|\d+)\s*(만|억|천만|백만)?\s*원/g, "₩[대외비]")
        .replace(/(매출|영업이익|CAC|ROAS|TPS)\s*[:=]?\s*[\d,.]+/gi, "$1: [대외비]");

      return res.json({
        hasSensitiveData: maskedText !== text,
        suggestedMaskedText: maskedText,
        detectedItems: ["매출/금액 수치", "내부 고객 지표"],
        securityAdvice: "금액 및 영업비밀성 지표에 블러 마스킹 [대외비]가 적용되었습니다."
      });
    }

    const prompt = `
당신은 기업 보안 및 영업비밀 마스킹 AI입니다.
다음 텍스트에서 대외비(매출액, 영업이익, 고객 개인정보, 비밀 프로젝트 코드명, 특허 수치, 구체적 계약 금액)가 포함되어 있는지 검출하고, 
외부에 공개해도 법적으로 안전하도록 마스킹(예: '₩[대외비]', '[고객사]', '[대외비 지표]') 처리된 텍스트를 JSON으로 출력하세요.

프로젝트명: ${projectTitle || '미정'}
원본 텍스트:
${text}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasSensitiveData: { type: Type.BOOLEAN },
            suggestedMaskedText: { type: Type.STRING },
            detectedItems: { type: Type.ARRAY, items: { type: Type.STRING } },
            securityAdvice: { type: Type.STRING },
          },
          required: ["hasSensitiveData", "suggestedMaskedText", "detectedItems", "securityAdvice"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (err: any) {
    console.error("Error in /api/ai/suggest-masking:", err);
    return res.status(500).json({ error: "AI masking suggestion failed", message: err.message });
  }
});

// API 3: AI Refine Raw Input into Notion Spec + STAR Format
app.post("/api/ai/refine-star", async (req, res) => {
  try {
    const { rawText, jobCategory } = req.body;

    if (!rawText || typeof rawText !== "string") {
      return res.status(400).json({ error: "rawText is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        notionSpec: {
          projectName: "AI 자동 구조화 프로젝트",
          client: "내부 주관",
          company: "자사 / 프로젝트",
          period: "2025.01 ~ 2025.06",
          contributionRate: 90,
          role: `${jobCategory || 'PM'} 담당자`,
          keyOutcome: "핵심 지표 25% 개선 및 공정 효율화 달성"
        },
        star: {
          situation: rawText.slice(0, 100) || "기존 시스템의 비효율 및 유저 이탈 문제 발생.",
          task: "문제 원인을 파악하고 직군에 적합한 솔루션 도입 과제 수립.",
          action: "데이터 분석, 유저 인터뷰, 신규 기능 설계 및 배포 프로세스 총괄.",
          result: "핵심 지표 25% 상승 및 안정적 시스템 정착 달성."
        }
      });
    }

    const prompt = `
당신은 IT/서비스 직군별 포트폴리오 에디터입니다.
사용자가 거칠게 입력한 경험 메모/이력서를 분석하여 
1) 노션 표 스펙 폼 (프로젝트명, 발주처, 근무처, 기간, 기여도, 참여역할, 주요성과)
2) STAR 구조 (Situation, Task, Action, Result)로 정교하게 다듬어주세요.

직군: ${jobCategory || 'general'}
사용자 작성 원문:
${rawText}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            notionSpec: {
              type: Type.OBJECT,
              properties: {
                projectName: { type: Type.STRING },
                client: { type: Type.STRING },
                company: { type: Type.STRING },
                period: { type: Type.STRING },
                contributionRate: { type: Type.INTEGER },
                role: { type: Type.STRING },
                keyOutcome: { type: Type.STRING },
              },
              required: ["projectName", "client", "company", "period", "contributionRate", "role", "keyOutcome"],
            },
            star: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING },
                task: { type: Type.STRING },
                action: { type: Type.STRING },
                result: { type: Type.STRING },
              },
              required: ["situation", "task", "action", "result"],
            },
          },
          required: ["notionSpec", "star"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (err: any) {
    console.error("Error in /api/ai/refine-star:", err);
    return res.status(500).json({ error: "AI refinement failed", message: err.message });
  }
});

// --- NOTION API INTEGRATION ENDPOINTS ---

function cleanNotionId(str: string): string {
  if (!str) return "";
  const cleaned = str.trim();
  const match = cleaned.match(/([a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
  if (match) {
    return match[1].replace(/-/g, "");
  }
  return cleaned.replace(/-/g, "");
}

function extractTitleFromNotionPage(page: any): string {
  if (!page || !page.properties) return "Untitled Notion Page";
  for (const key of Object.keys(page.properties)) {
    const prop = page.properties[key];
    if (prop.type === "title" && prop.title && prop.title.length > 0) {
      return prop.title.map((t: any) => t.plain_text).join("");
    }
  }
  return "Untitled Notion Page";
}

function extractTextFromNotionBlocks(blocks: any[]): string {
  const lines: string[] = [];
  for (const block of blocks) {
    const type = block.type;
    if (type && block[type]?.rich_text) {
      const text = block[type].rich_text.map((t: any) => t.plain_text).join("");
      if (text) {
        lines.push(text);
      }
    }
  }
  return lines.join("\n");
}

// 1. Fetch Notion Database Pages
app.post("/api/notion/fetch-database", async (req, res) => {
  try {
    const { apiKey, databaseId } = req.body;
    const token = apiKey || process.env.NOTION_API_KEY;
    if (!token) {
      return res.status(400).json({ error: "Notion API Key (Integration Secret) is required." });
    }
    const cleanDbId = cleanNotionId(databaseId || process.env.NOTION_DATABASE_ID || "");
    if (!cleanDbId) {
      return res.status(400).json({ error: "Notion Database ID is required." });
    }

    const notion = new NotionClient({ auth: token });
    const response = await (notion as any).databases.query({
      database_id: cleanDbId,
      page_size: 50,
    });


    const pages = response.results.map((page: any) => {
      const title = extractTitleFromNotionPage(page);
      return {
        id: page.id,
        title,
        url: page.url,
        createdTime: page.created_time,
        lastEditedTime: page.last_edited_time,
      };
    });

    return res.json({ success: true, count: pages.length, pages });
  } catch (err: any) {
    console.error("Error fetching Notion database:", err);
    return res.status(500).json({
      error: "Failed to fetch Notion database",
      message: err.message || "Ensure your Integration token has access to this database.",
    });
  }
});

// 2. Import Notion Page and Refine into Experience Block
app.post("/api/notion/import-page", async (req, res) => {
  try {
    const { apiKey, pageId, jobCategory } = req.body;
    const token = apiKey || process.env.NOTION_API_KEY;
    if (!token) {
      return res.status(400).json({ error: "Notion API Key is required." });
    }
    const cleanId = cleanNotionId(pageId);
    if (!cleanId) {
      return res.status(400).json({ error: "Valid Notion Page ID is required." });
    }

    const notion = new NotionClient({ auth: token });

    // Retrieve Page and Blocks
    const page: any = await notion.pages.retrieve({ page_id: cleanId });
    const title = extractTitleFromNotionPage(page);

    const blocksResponse = await notion.blocks.children.list({ block_id: cleanId });
    const pageText = extractTextFromNotionBlocks(blocksResponse.results);
    const combinedContent = `제목: ${title}\n\n내용:\n${pageText}`;

    // Use Gemini AI to structure into ExperienceBlock
    const ai = getGeminiClient();
    let notionSpec = {
      projectName: title,
      client: "내부 프로젝트",
      company: "자체 프로젝트",
      period: "2024",
      contributionRate: 80,
      role: "프로젝트 작성자",
      keyOutcome: title,
    };

    let star = {
      situation: pageText.slice(0, 200) || "노션 문서 기반 과제 분석",
      task: "노션 문서 기반 해결 과제 정의",
      action: "노션 문서 내 실행 내용 작성",
      result: "노션 문서 기반 성과 측정",
    };

    let tagline = title;
    let problemDefinition = pageText.slice(0, 150);

    if (ai) {
      try {
        const prompt = `
당신은 취업 및 이직용 웹 포트폴리오 빌더 AI 시스템입니다.
다음은 사용자의 노션(Notion) 문서에서 가져온 프로젝트 기록 데이터입니다:

=== 노션 원문 데이터 ===
${combinedContent}

이 데이터를 바탕으로 사용자의 포트폴리오 카드에 입력될 
1) notionSpec (projectName, client, company, period, contributionRate, role, keyOutcome)
2) STAR 기법 항목 (situation, task, action, result)
3) tagline (핵심 한줄 요약)
4) problemDefinition (문제 정의)
를 추출하여 JSON 형식으로 작성해주세요.
        `;

        const aiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                notionSpec: {
                  type: Type.OBJECT,
                  properties: {
                    projectName: { type: Type.STRING },
                    client: { type: Type.STRING },
                    company: { type: Type.STRING },
                    period: { type: Type.STRING },
                    contributionRate: { type: Type.NUMBER },
                    role: { type: Type.STRING },
                    keyOutcome: { type: Type.STRING },
                  },
                  required: ["projectName", "client", "company", "period", "contributionRate", "role", "keyOutcome"],
                },
                star: {
                  type: Type.OBJECT,
                  properties: {
                    situation: { type: Type.STRING },
                    task: { type: Type.STRING },
                    action: { type: Type.STRING },
                    result: { type: Type.STRING },
                  },
                  required: ["situation", "task", "action", "result"],
                },
                tagline: { type: Type.STRING },
                problemDefinition: { type: Type.STRING },
              },
              required: ["notionSpec", "star", "tagline", "problemDefinition"],
            },
          },
        });

        const parsed = JSON.parse(aiResponse.text || "{}");
        if (parsed.notionSpec) notionSpec = parsed.notionSpec;
        if (parsed.star) star = parsed.star;
        if (parsed.tagline) tagline = parsed.tagline;
        if (parsed.problemDefinition) problemDefinition = parsed.problemDefinition;
      } catch (aiErr) {
        console.warn("AI parsing skipped, using fallback extraction:", aiErr);
      }
    }

    const generatedBlock = {
      id: `notion_blk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      jobCategory: jobCategory || "PM/PO",
      isTop3: false,
      isMasked: false,
      notionSpec,
      star,
      fiveCards: {
        card1_cover: {
          tagline,
          thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        },
        card2_research: {
          problemDefinition,
          targetAudience: "노션 연동 유저",
          userInsight: "노션 문서 기반 데이터 자동 가져오기",
        },
        card3_solutionAction1: {
          title: "노션 통합 해결책 실행",
          description: star.action,
          techOrFrameworkUsed: "Notion API / AI Integration",
        },
        card4_solutionAction2: {
          title: "주요 과제 해결 과정",
          description: star.task,
          frameworks: ["Notion", "Gemini AI"],
        },
        card5_impact: {
          quantitativeMetrics: [
            { label: "노션 연동 가공 완료", value: "100%" },
          ],
          qualitativeFeedback: star.result,
        },
      },
    };

    return res.json({ success: true, block: generatedBlock });
  } catch (err: any) {
    console.error("Error importing Notion page:", err);
    return res.status(500).json({
      error: "Failed to import Notion page",
      message: err.message || "Failed to fetch page blocks from Notion API.",
    });
  }
});


// Server-side store for shared portfolios
const sharedPortfoliosStore = new Map<string, { profile: any; blocks: any; createdAt: number }>();

// API 3: Save Portfolio Data for Share Link
app.post("/api/portfolio/share", (req, res) => {
  try {
    const { profile, blocks } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "Profile data is required" });
    }
    const shareId = `p_${Math.random().toString(36).substring(2, 10)}`;
    sharedPortfoliosStore.set(shareId, {
      profile,
      blocks: blocks || [],
      createdAt: Date.now(),
    });
    return res.json({ shareId, shareUrl: `/p/${shareId}` });
  } catch (err: any) {
    console.error("Error saving share portfolio:", err);
    return res.status(500).json({ error: "Failed to create share link" });
  }
});

// API 4: Get Shared Portfolio Data by shareId
app.get("/api/portfolio/share/:shareId", (req, res) => {
  try {
    const { shareId } = req.params;
    const data = sharedPortfoliosStore.get(shareId);
    if (!data) {
      return res.status(404).json({ error: "Shared portfolio not found or expired" });
    }
    return res.json(data);
  } catch (err: any) {
    console.error("Error retrieving shared portfolio:", err);
    return res.status(500).json({ error: "Failed to retrieve shared portfolio" });
  }
});

// SPA routing fallback for /p/* share links
app.get("/p/*", (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    return res.sendFile(path.join(distPath, "index.html"));
  }
  next();
});

// Start Express Server with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio You-Too Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
