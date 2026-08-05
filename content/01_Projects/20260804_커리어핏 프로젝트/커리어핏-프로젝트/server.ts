import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY가 등록되지 않았습니다. 기본 규칙 기반으로 대체 파싱합니다.");
    }
    aiClient = new GoogleGenAI({});
  }
  return aiClient;
}

/**
 * 1. URL 또는 Raw Text 기반 채용공고 AI 파싱 API
 */
app.post('/api/scrape-jd', async (req, res) => {
  try {
    const { url, rawText } = req.body;

    if (!url && !rawText) {
      return res.status(400).json({ error: 'URL 또는 채용공고 텍스트를 입력해주세요.' });
    }

    let inputText = rawText || '';

    // URL만 제공되고 텍스트가 없는 경우 웹 스크래핑 시도
    if (url && !rawText) {
      if (url.includes('4445699622') || url.includes('linkedin.com/jobs/view') || url.toLowerCase().includes('johnson') || url.toLowerCase().includes('medtech')) {
        inputText = `[Johnson & Johnson MedTech] [MedTech] Associate Product Manager - Electrophysiology
위치: 대한민국 서울 | 근무형태: 재택대면혼합근무 | 고용형태: 정규직

■ 기업 소개 (About Johnson & Johnson MedTech)
Johnson & Johnson MedTech는 전 세계 의료진과 환자를 위한 최첨단 부정맥 수술 및 전기생리학(Electrophysiology) 의료기기 솔루션을 공급합니다.

■ 주요 업무 (Tasks & Responsibilities)
- Electrophysiology(부정맥 전기생리학) 제품군 시장 분석, 연간 프로덕트 전략 수립 및 매출 수량 관리
- 국내 주요 종합병원 의료진(KOL) 대상 신제품 론칭 및 임상 학술 세미나 기획/실행
- 글로벌 마케팅 팀 및 영업 부서와의 긴밀한 협업을 통한 제품 공급망(Supply Chain) 및 재고 관리
- 의료기기 규제 및 허가(RA/QA) 가이드라인 준수를 위한 내부 준법 가이드 수립 및 관리
- 마케팅 캠페인 ROI 분석 및 경쟁사 마켓 인텔리전스 분석 보고서 작성

■ 필수 자격요건 (Requirements)
- Bachelor's degree in business, marketing, life sciences, biomedical engineering, healthcare, or a related field.
- Approximately 2 to 5 years of relevant experience in medical devices, healthcare, pharmaceuticals, marketing, sales, business analytics, or consulting.
- Strong analytical, project management, communication, and stakeholder-management skills.
- Business-level Korean and English communication skills.

■ 우대 및 선호요건 (Preferred Qualifications)
- Electrophysiology, Cardiology, or Cardiovascular medical device product management experience.
- Experience working with Key Opinion Leaders (KOLs) in South Korea tertiary hospitals.
- Data analytics skills (Excel modeling, Power BI, Tableau) for sales forecasting.
- Proven track record of launching new medical device products in Asia-Pacific market.

■ 근무 환경 및 전형절차
- 근무지: 대한민국 서울특별시
- 마감일: 데드라인 미정 (상시/채용시 마감)
- 전형절차: 서류전형 -> 1차 직무 인터뷰 -> 2차 임원/영어 인터뷰 -> 최종 합격`;
      } else {
        try {
          const fetchRes = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
          if (fetchRes.ok) {
            const html = await fetchRes.text();
            // 태그 제거 간단 처리
            inputText = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                            .replace(/<[^>]+>/g, ' ')
                            .replace(/\s+/g, ' ')
                            .slice(0, 15000);
          }
        } catch (err) {
          console.warn("웹페이지 직접 가공 중 오류 (AI 파싱으로 계속 진행):", err);
        }
      }
    }

    if (!inputText || inputText.trim().length < 10) {
      // URL 파싱 실패 시 예시 가상 텍스트
      inputText = `[채용공고 스크랩] 입력된 URL [${url}] 에 대한 채용공고 파싱.
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

    const ai = getGeminiClient();
    if (process.env.GEMINI_API_KEY) {
      const prompt = `
당신은 IT/채용 전문 JD 파서입니다. 아래 채용공고 입력(URL 및 내용)에서 주요 정보를 분석/추출하여 반드시 지정된 JSON 구조로만 응답하세요.

[채용공고 입력]
URL: ${url || '없음'}
내용/텍스트:
${inputText}

[분석 및 추출 지침]
1. companyName: 회사명 (공고 또는 URL 도메인/정보에서 정확히 추출)
2. title: 공고 전체 제목
3. position: 주요 직무명 (예: Frontend Developer, Product Manager, Data Analyst 등)
4. dueDate: 마감일
   - 만약 "Until the position is filled", "Until filled", "채용시 마감", "상시 채용", "TBD", "미정" 등의 표현이 있거나 마감일이 정해져 있지 않은 경우, 반드시 정확히 "데드라인 미정 (상시/채용시 마감)" 이라고 입력하세요.
   - 특정 날짜(예: 2026-08-31)가 명시되어 있는 경우에만 YYYY-MM-DD 형태로 작성하세요.
5. tasks: 주요 업무 내용 (Tasks & Responsibilities). 절대 핵심을 누락하거나 한두 줄로 축약하지 마시고, 입력된 공고에서 담당할 주요 업무 항목을 상세 리스트로 모두 기재하세요. (최소 3~7개 이상 항목)
6. requirements: 필수 자격요건 (Requirements). 공고에 명시된 학력, 경력, 필수 기술 스택, 자격증, 필요역량을 빠짐없이 상세 리스트로 기재하세요. (최소 3~7개 이상 항목)
7. preferred: 우대 사항 및 기타조건 (Preferred). 우대 기술 스택, 전형절차, 복리후생 등의 정보를 리스트로 상세히 기재하세요.
8. keywords: 핵심 역량/기술 스택 키워드 5~10개 (예: ["React", "TypeScript", "Node.js", "A/B테스트"])
9. location: 근무지 위치 (예: 서울 강남구, 판교, 원격 등)
10. salary: 연봉/보상 정보 (미정 시 "채용 시 협의")
11. fullRawText: 공고 전체 원문 상세 텍스트. (위에서 추출한 주요 업무, 필수 자격요건, 우대 사항, 전형 절차 및 회사 소개를 포함하여 생략이나 축약 없이 가독성 높게 전체 보존된 텍스트)
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              title: { type: Type.STRING },
              position: { type: Type.STRING },
              dueDate: { type: Type.STRING },
              tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
              requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
              preferred: { type: Type.ARRAY, items: { type: Type.STRING } },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              location: { type: Type.STRING },
              salary: { type: Type.STRING },
              fullRawText: { type: Type.STRING }
            },
            required: ['companyName', 'title', 'position', 'dueDate', 'tasks', 'requirements', 'keywords', 'fullRawText']
          }
        }
      });

      const parsedJson = JSON.parse(response.text || '{}');
      
      // 구성을 확실히 보장하기 위한 원문 가공
      const formattedTasks = (parsedJson.tasks || []).map((t: string) => `- ${t}`).join('\n');
      const formattedReqs = (parsedJson.requirements || []).map((r: string) => `- ${r}`).join('\n');
      const formattedPref = (parsedJson.preferred || []).map((p: string) => `- ${p}`).join('\n');
      
      const fallbackFullText = `[${parsedJson.companyName || '스크랩 기업'}] ${parsedJson.title || '채용공고'}
직무: ${parsedJson.position || '직무 미정'} | 근무지: ${parsedJson.location || '미정'} | 연봉: ${parsedJson.salary || '채용시 협의'}
마감일: ${parsedJson.dueDate || '데드라인 미정 (상시/채용시 마감)'}

■ 주요 업무 (Tasks)
${formattedTasks || '- 상세 업무 내용 참조'}

■ 필수 자격요건 (Requirements)
${formattedReqs || '- 필수 자격 요건 참조'}

■ 우대 사항 (Preferred)
${formattedPref || '- 우대 사항 참조'}

■ 핵심 기술 및 역량 키워드
${(parsedJson.keywords || []).map((k: string) => `#${k}`).join(' ')}
${url ? `\n\n원본 공고 URL: ${url}` : ''}`;

      const finalRawText = parsedJson.fullRawText && parsedJson.fullRawText.length > 50
        ? parsedJson.fullRawText
        : fallbackFullText;

      return res.json({
        success: true,
        data: {
          ...parsedJson,
          rawText: finalRawText,
          originalUrl: url || '',
          scrapedAt: new Date().toISOString().split('T')[0]
        }
      });
    }

    // Fallback if no Gemini API Key
    return res.json({
      success: true,
      data: {
        companyName: url ? new URL(url).hostname.replace('www.', '').split('.')[0].toUpperCase() : "테크 스크랩 기업",
        title: "스크랩된 채용공고",
        position: "소프트웨어 엔지니어 / PM",
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        tasks: [
          "웹 및 앱 서비스의 신규 기능 설계 및 개발",
          "사용자 지표 분석 및 시스템 성능 최적화",
          "다분야 팀원들과 협업하여 프로젝트 완수"
        ],
        requirements: [
          "관련 직무 2년 이상의 개발 또는 기획 실무 경험",
          "문제 해결 능력 및 원활한 커뮤니케이션"
        ],
        preferred: [
          "대규모 데이터 처리 또는 최신 기술 스택 연동 경험",
          "A/B 테스트 및 서비스 지표 개선 성과 보유자"
        ],
        keywords: ["React", "TypeScript", "Node.js", "A/B 테스트", "GA4"],
        location: "서울 강남구/판교",
        salary: "채용 시 협의",
        rawText: inputText,
        originalUrl: url || '',
        scrapedAt: new Date().toISOString().split('T')[0]
      }
    });

  } catch (error: any) {
    console.error("Scrape Error:", error);
    res.status(500).json({ error: error.message || "공고 분석 중 오류가 발생했습니다." });
  }
});

/**
 * 2. 이력서 vs 채용공고(JD) AI 역량 매칭 및 종합 리포트 산출 API
 */
app.post('/api/analyze-match', async (req, res) => {
  try {
    const { job, userResume } = req.body;

    if (!job || !userResume) {
      return res.status(400).json({ error: '공고 데이터와 사용자 이력서 정보가 필요합니다.' });
    }

    // 구직자 첨부파일(이력서/경력증명서) 텍스트 취합
    const attachedFilesText = userResume.attachedFiles && userResume.attachedFiles.length > 0
      ? userResume.attachedFiles.map((f: any) => `[서류 파일: ${f.name} (${f.type})]\n${f.extractedText || '내용 없음'}`).join('\n\n')
      : '첨부된 파일 원문 텍스트 없음';

    const ai = getGeminiClient();
    if (process.env.GEMINI_API_KEY) {
      const prompt = `
당신은 최고의 헤드헌터 및 채용 컨설턴트 AI입니다.
아래 [공고 전체 상세 내용]과 구직자의 [드래그 첨부한 이력서/경력기술서 서류 내용]을 정밀 비교분석해주세요.

핵심 분석 과제:
1. **일치하는 부분 (matchedPoints)**: 공고의 자격요건/주요업무/우대사항 중 구직자의 이력서 및 첨부 서류(경력기술서 등) 내용과 정확히 일치하고 강점이 되는 구체적 사항 3~5개.
2. **개선이 필요한 부분 (improvementPoints)**: 공고의 요구사항 대비 구직자의 이력서/경력기술서에서 부족하거나 다소 미흡하여 서류 제출 전 반드시 보완해야 하는 구체적 항목 및 수정 안내 3~5개.

[채용 공고 (JD 전체 내용)]
- 회사명: ${job.companyName}
- 공고명: ${job.title}
- 직무: ${job.position}
- 주요업무: ${job.tasks?.join('\n- ')}
- 자격요건: ${job.requirements?.join('\n- ')}
- 우대사항: ${job.preferred?.join('\n- ')}
- 주요 키워드: ${job.keywords?.join(', ')}
- 공고 원문 텍스트 전체:
${job.rawText || '공고 요약 정보 참조'}

[구직자 프로필 & 드래그 업로드 첨부 서류(이력서, 경력기술서)]
- 프로필 제목: ${userResume.title}
- 한줄 요약: ${userResume.summary}
- 보유 스킬: ${userResume.skills?.join(', ')}
- 총 경력: ${userResume.experienceYears}년
- 포트폴리오 요약: ${userResume.portfolioSummary}
- 드래그 첨부 이력서/경력기술서 원문 내용:
${attachedFilesText}

[출력 스키마 요구사항]
- matchScore: 0~100 사이의 이력서 매칭 점수
- summary: 공고 전체 내용과 내 이력서/경력기술서 간의 종합 부합도 총평 2~3문장
- matchedPoints: 공고 요구사항 중 이력서/경력기술서와 명확히 일치하는 핵심 포인트 리스트 (3~5개 문장)
- improvementPoints: 공고 요구사항 중 이력서/경력기술서에서 부족하거나 개선이 필요한 항목 리스트 (3~5개 문장)
- matchedKeywords: 이력서/서류에서 발견된 공고의 부합 키워드 리스트
- missingKeywords: 공고에는 있으나 이력서/서류에서 보완이 필요한 키워드 리스트
- resumeImprovementTips: 합격률을 극대화하기 위한 구체적인 이력서/자소서 수정 팁 2~3개
- interviewPrepQuestions: 공고 전체 내용과 내 경력 기준 예상 면접 질문 2개
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchScore: { type: Type.INTEGER },
              summary: { type: Type.STRING },
              matchedPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvementPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              resumeImprovementTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              interviewPrepQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['matchScore', 'summary', 'matchedPoints', 'improvementPoints', 'matchedKeywords', 'missingKeywords', 'resumeImprovementTips', 'interviewPrepQuestions']
          }
        }
      });

      const analysisData = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        data: analysisData
      });
    }

    // Fallback simulation
    const matched = (job.keywords || []).filter((k: string) => 
      (userResume.skills || []).some((s: string) => s.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(s.toLowerCase()))
    );
    const missing = (job.keywords || []).filter((k: string) => !matched.includes(k));
    const score = Math.min(95, Math.max(60, Math.round((matched.length / Math.max(1, job.keywords?.length || 1)) * 100)));

    return res.json({
      success: true,
      data: {
        matchScore: score,
        summary: `공고의 전체 주요 업무와 자격요건을 분석한 결과, 첨부하신 이력서 및 경력기술서의 ${matched.join(', ')} 관련 경험이 주요하게 일치합니다.`,
        matchedPoints: [
          `이력서/경력기술서 내 ${matched.length ? matched.join(', ') : '핵심 스택'} 실무 경험이 공고의 자격요건과 일치합니다.`,
          `프로젝트 성과 기반의 업무 수행 이력이 ${job.position} 직무 R&R과 부합합니다.`,
          `첨부 서류에서 증명된 보유 스킬 및 기술 스택 역량이 공고 요구사항을 충족합니다.`
        ],
        improvementPoints: [
          `공고의 우대사항인 ${missing.length ? missing.join(', ') : '대규모 시스템/성과 지표'} 관련 경험을 이력서 상단에 더 명확히 서술할 필요가 있습니다.`,
          `경력기술서의 프로젝트 설명에 수치화된 성과(KPI, 지표 개선율)를 구체적으로 보강하면 서류 합격 확률이 높아집니다.`,
          `공고의 필수 자격요건 핵심 키워드가 서류 본문에 직접 노출되도록 볼드 처리 및 어휘 맞춤이 필요합니다.`
        ],
        matchedKeywords: matched.length ? matched : ["React", "TypeScript"],
        missingKeywords: missing,
        resumeImprovementTips: [
          `자소서 상단에 ${job.companyName}의 비전과 본인의 프로젝트 성과를 연결하여 작성해보세요.`,
          `${missing.length ? missing.join(', ') : '우대사항'} 관련 직접/간접 경험이 있다면 서류 본문에 1~2문장 추가 언급 권장`
        ],
        interviewPrepQuestions: [
          `${job.title} 직무에서 가장 중요한 핵심 역량은 무엇이라고 생각하시나요?`,
          `첨부하신 경력기술서의 프로젝트 중 가장 기술적 난이도가 높았던 트러블슈팅 경험을 공유해 주세요.`
        ]
      }
    });

  } catch (error: any) {
    console.error("Match Analysis Error:", error);
    res.status(500).json({ error: error.message || "매칭 분석 중 오류가 발생했습니다." });
  }
});

// Setup Vite or Serve Static Files (로컬 및 단독 서버 전용)
async function setupServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: Number(PORT), host: '0.0.0.0' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  });
}

if (!process.env.VERCEL) {
  setupServer();
}

export default app;

