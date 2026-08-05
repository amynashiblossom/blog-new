import { JobPost, UserResume } from '../types';

export const INITIAL_USER_RESUME: UserResume = {
  title: "3년차 테크 프로덕트 매니저 & 프론트엔드 엔지니어 이혜원",
  summary: "사용자 데이터 분석과 신규 서비스 기획, React/TypeScript 기반 웹 서비스 개발 역량을 함께 갖춘 3년차 풀스택 PM/엔지니어입니다.",
  skills: [
    "React", "TypeScript", "Next.js", "Tailwind CSS", "A/B 테스트",
    "GA4", "SQL", "지급결제", "Figma", "사용자 경험(UX) 개선", "지표 산출"
  ],
  experienceYears: 3,
  portfolioSummary: "지급결제 연동 유저 이탈율 18% 감소, 신규 구독 모델 론칭으로 MRR +25% 달성. A/B 테스트 기반 퍼널 최적화 경험 다수 보유.",
  lastUpdated: new Date().toISOString().split('T')[0]
};

export const SAMPLE_JOB_POSTS: JobPost[] = [
  {
    id: "job-toss-01",
    companyName: "토스 (비바리퍼블리카)",
    title: "Frontend Developer (토스페이 플랫폼)",
    position: "프론트엔드 개발자",
    status: "preparing",
    dueDate: "2026-08-15",
    tasks: [
      "토스 앱 내 결제/송금 서비스 프론트엔드 아키텍처 설계 및 구축",
      "대규모 결제 트래픽을 처리하는 고성능 웹뷰 애플리케이션 개발",
      "UX 디자인 및 백엔드 팀과 협업하여 단절 없는 결제 경험 설계"
    ],
    requirements: [
      "React, TypeScript 기반 3년 이상의 실무 개발 경험",
      "웹 성능 최적화 및 브라우저 랜더링 라이프사이클에 대한 깊은 이해",
      "복잡한 비동기 상태 관리 및 결제 모듈 연동 경험"
    ],
    preferred: [
      "PG사/지급결제 시스템 서비스 연동 및 운영 경험",
      "Micro Frontend 및 Design System 구축 경험",
      "데이터 기반 A/B 테스트 및 사용자 지표 개선 경험"
    ],
    keywords: ["React", "TypeScript", "지급결제", "웹 성능 최적화", "디자인시스템", "A/B 테스트"],
    originalUrl: "https://toss.im/careers/job/12345",
    location: "서울 강남구 테헤란로",
    salary: "채용 시 협의 (최상위 대우)",
    scrapedAt: "2026-08-01",
    rawText: `[토스 (비바리퍼블리카)] Frontend Developer (토스페이 플랫폼)

■ 조직 소개
토스페이 플랫폼 팀은 2,000만 명이 넘는 토스 사용자들이 매일 경험하는 온라인 결제/송금 시스템을 구축하고 개선합니다.
단 1초 만에 결제가 이루어지는 최고의 UX를 위해 웹 성능 최적화, 결제 모듈 가동률 99.99%를 목표로 일하고 있습니다.

■ 주요 업무 (Tasks)
- 토스 앱 내 결제/송금 서비스 프론트엔드 아키텍처 설계 및 구축
- 대규모 결제 트래픽을 처리하는 고성능 웹뷰 애플리케이션 개발
- UX 디자인 및 백엔드 팀과 협업하여 단절 없는 결제 경험 설계
- 모바일 웹 환경에서의 메모리 최적화 및 Lighthouse 점수 개선

■ 자격 요건 (Requirements)
- React, TypeScript 기반 3년 이상의 실무 개발 경험
- 웹 성능 최적화 및 브라우저 랜더링 라이프사이클에 대한 깊은 이해
- 복잡한 비동기 상태 관리 및 결제 모듈 연동 경험
- 데이터 흐름 추적 및 브라우저 호환성/웹뷰 문제 해결 능력을 보유하신 분

■ 우대 사항 (Preferred)
- PG사/지급결제 시스템 서비스 연동 및 운영 경험
- Micro Frontend 및 Design System 구축 경험
- 데이터 기반 A/B 테스트 및 사용자 지표 개선 경험

■ 지원 안내
- 근무지: 서울시 강남구 테헤란로 142 아크플레이스
- 마감일: 2026-08-15`,
    memo: "자기소개서 항목 중 '결제 이탈율 개선 사례' 강조해서 적기. 1차 인터뷰 대비 코딩테스트 준비 필요.",
    matchAnalysis: {
      matchScore: 92,
      summary: "지원자의 지급결제 연동 경험 및 React/TypeScript 역량이 공고의 핵심 요건과 90% 이상 일치합니다.",
      matchedKeywords: ["React", "TypeScript", "지급결제", "A/B 테스트"],
      missingKeywords: ["Micro Frontend", "Design System"],
      resumeImprovementTips: [
        "포트폴리오에 '결제 연동 이탈율 18% 감소' 경험을 가장 상단 헤드라인으로 강조하세요.",
        "디자인시스템 협업 경험이나 공통 컴포넌트 라이브러리 제작 사례가 있다면 보완하면 완벽합니다."
      ],
      interviewPrepQuestions: [
        "지급결제 처리 중 네트워크 오류 발생 시 멱등성을 보장하기 위해 프론트엔드에서 어떤 처리를 하셨나요?",
        "웹뷰 환경에서 초기 로딩 속도를 줄이기 위해 시도했던 성능 최적화 경험을 설명해주세요."
      ]
    }
  },
  {
    id: "job-daangn-02",
    companyName: "당근",
    title: "Product Manager (당근페이/중고거래 서비스)",
    position: "프로덕트 매니저 (PM)",
    status: "interested",
    dueDate: "2026-08-10",
    tasks: [
      "당근 중고거래 퍼널 개선 및 신규 유저 활성화 기획",
      "데이터 분석(GA4, Amplitude)을 통한 문제 정의 및 가설 검증",
      "엔지니어 및 디자이너와 협업하여 스프린트 주도 및 배포"
    ],
    requirements: [
      "IT 서비스 PM/PO 경력 2년 이상",
      "SQL 기반 유저 행동 데이터 직접 추출 및 시각화 가능자",
      "사용자 문제 정의부터 개선 결과 검증까지 경험하신 분"
    ],
    preferred: [
      "C2C 커머스 및 핀테크/결제 도메인 경험자",
      "개발 직무 경험이 있거나 엔지니어링 이해도가 높으신 분",
      "A/B 테스트 설계 및 통계적 유의성 검증 경험자"
    ],
    keywords: ["PM", "A/B 테스트", "GA4", "SQL", "사용자 경험(UX) 개선", "핀테크"],
    originalUrl: "https://team.daangn.com/jobs/67890",
    location: "서울 서초구 강남대로",
    salary: "연봉 6,500만 원 이상",
    scrapedAt: "2026-08-02",
    rawText: `[당근] Product Manager (당근페이/중고거래 서비스)

■ 서비스 소개
당근은 3,800만 사용자가 함께하는 지역 기반 라이프스타일 옴니 플랫폼입니다.
당근 중고거래 및 당근페이는 이웃 간의 따뜻한 연결과 가치 있는 커머스 경험을 혁신하고 있습니다.

■ 주요 업무 (Tasks)
- 당근 중고거래 퍼널 개선 및 신규 유저 활성화 기획
- 데이터 분석(GA4, Amplitude)을 통한 문제 정의 및 가설 검증
- 엔지니어 및 디자이너와 협업하여 스프린트 주도 및 배포

■ 자격 요건 (Requirements)
- IT 서비스 PM/PO 경력 2년 이상
- SQL 기반 유저 행동 데이터 직접 추출 및 시각화 가능자
- 사용자 문제 정의부터 개선 결과 검증까지 경험하신 분

■ 우대 사항 (Preferred)
- C2C 커머스 및 핀테크/결제 도메인 경험자
- 개발 직무 경험이 있거나 엔지니어링 이해도가 높으신 분
- A/B 테스트 설계 및 통계적 유의성 검증 경험자

■ 근무 환경
- 근무지: 서울 서초구 강남대로 (신논현역 인근)`,
    memo: "당근 중고거래 직접 사용 후 개선점 3가지 아이디어 노션에 정리해둠.",
    matchAnalysis: {
      matchScore: 85,
      summary: "개발 이해도와 A/B 테스트, GA4/SQL 데이터 역량이 요구사항과 잘 맞습니다.",
      matchedKeywords: ["PM", "A/B 테스트", "GA4", "SQL", "사용자 경험(UX) 개선"],
      missingKeywords: ["C2C 커머스", "Amplitude"],
      resumeImprovementTips: [
        "개발 커리어와 PM 역량이 결합된 '테크니컬 PM' 프레임으로 이력서를 정돈하세요.",
        "GA4 지표 산출과 SQL 추출 사례를 구체적 수치와 함께 언급하세요."
      ],
      interviewPrepQuestions: [
        "개발자에서 PM 역할을 수행할 때 의견 충돌을 해결한 대표적인 경험이 있나요?",
        "당근 중고거래 지표 중 하나가 급감했을 때 원인을 추적하는 접근법을 말해보세요."
      ]
    }
  },
  {
    id: "job-naver-03",
    companyName: "네이버",
    title: "AI & Web Application Engineer",
    position: "AI 풀스택 엔지니어",
    status: "applied",
    dueDate: "2026-08-20",
    tasks: [
      "생성형 AI 모델(HyperCLOVA X, Gemini) 기반 서비스 API 개발 및 웹 서비스 구축",
      "대용량 트래픽에 견디는 백엔드 및 인터랙티브 웹 UI 구현",
      "AI 에이전트 워크플로우 최적화"
    ],
    requirements: [
      "Modern Web Framework (React, Node.js) 숙련자",
      "RESTful API & GraphQL 백엔드 설계 및 개발 경험",
      "LLM API 연동 및 프롬프트 엔지니어링 이해도"
    ],
    preferred: [
      "Express, Python 기반 AI 파이프라인 개발 경험",
      "대규모 트래픽 서비스 분산 처리 경험",
      "클라우드(GCP, AWS) 환경 구축 경험"
    ],
    keywords: ["React", "Node.js", "Express", "TypeScript", "LLM", "API"],
    originalUrl: "https://recruit.navercorp.com/naver/job/detail/2026",
    location: "경기 성남시 분당구 NAVER 1784",
    salary: "채용 시 협의",
    scrapedAt: "2026-07-28",
    rawText: `[네이버] AI & Web Application Engineer

■ 조직 소개
네이버 AI 기술 구현 팀은 HyperCLOVA X 및 최신 생성형 AI 모델을 실제 서비스에 이식하고 가치있는 사용자 경험을 만드는 풀스택 웹엔지니어링 팀입니다.

■ 주요 업무 (Tasks)
- 생성형 AI 모델(HyperCLOVA X, Gemini) 기반 서비스 API 개발 및 웹 서비스 구축
- 대용량 트래픽에 견디는 백엔드 및 인터랙티브 웹 UI 구현
- AI 에이전트 워크플로우 최적화 및 렌더링 프레임워크 개발

■ 자격 요건 (Requirements)
- Modern Web Framework (React, Node.js) 숙련자
- RESTful API & GraphQL 백엔드 설계 및 개발 경험
- LLM API 연동 및 프롬프트 엔지니어링 이해도

■ 우대 사항 (Preferred)
- Express, Python 기반 AI 파이프라인 개발 경험
- 대규모 트래픽 서비스 분산 처리 경험
- 클라우드(GCP, AWS) 환경 구축 경험`,
    memo: "7/28 서류 제출 완료. 1차 서류 합격 발표 대기 중.",
    matchAnalysis: {
      matchScore: 88,
      summary: "React 및 Express 기반 웹 풀스택 연동과 LLM API 활용 능력이 네이버 AI 팀의 방향성과 일치합니다.",
      matchedKeywords: ["React", "TypeScript", "Node.js", "Express"],
      missingKeywords: ["HyperCLOVA X", "Python 파이프라인"],
      resumeImprovementTips: [
        "Gemini API나 OpenAI API 활용 프로젝트 경험을 강조하여 첨부하세요."
      ],
      interviewPrepQuestions: [
        "LLM 응답 스트리밍(Server-Sent Events) 구현 시 브라우저 측 메모리 관리 노하우는 무엇인가요?"
      ]
    }
  },
  {
    id: "job-coupang-04",
    companyName: "쿠팡 (Coupang)",
    title: "Staff Frontend Engineer (결제 및 주문 시스템)",
    position: "시니어 프론트엔드 엔지니어",
    status: "interview",
    dueDate: "2026-08-08",
    tasks: [
      "쿠팡 1초 결제 및 체크아웃 프론트엔드 시스템 설계",
      "글로벌 대규모 트래픽 처리 및 99.99% 가동률 유지",
      "웹 퍼포먼스 및 에러 트래킹 자동화"
    ],
    requirements: [
      "5년 이상의 프론트엔드 개발 경험",
      "대규모 결제 시스템 또는 e-Commerce 플랫폼 개발 경험"
    ],
    preferred: [
      "영어 커뮤니케이션 가능자",
      "주도적으로 기술 아키텍처를 개선한 경험"
    ],
    keywords: ["React", "TypeScript", "지급결제", "웹 성능 최적화", "아키텍처"],
    originalUrl: "https://rocketeer.coupang.com/jobs/9988",
    location: "서울 송파구 올림픽로 (잠실 타워)",
    salary: "연봉 8,000만 원 이상 + RSU",
    scrapedAt: "2026-07-25",
    memo: "8/8 화상 1차 기술 면접 예정 (시스템 아키텍처 및 코딩 인터뷰 질문 준비)",
    matchAnalysis: {
      matchScore: 78,
      summary: "지급결제 관련 기술 역량은 훌륭하나 요구 경력(5년) 대비 현재 3년차로 추가적인 성과 입증이 필요합니다.",
      matchedKeywords: ["React", "TypeScript", "지급결제", "웹 성능 최적화"],
      missingKeywords: ["5년 이상 경력", "글로벌 커뮤니케이션"],
      resumeImprovementTips: [
        "연차의 아쉬움을 극복할 수 있는 대규모 트래픽 성과(결제 수치, 이탈율 개선)를 최상단에 배치하세요."
      ],
      interviewPrepQuestions: [
        "체크아웃 과정에서 네트워크 단절 시 사용자의 중복 결제를 방지하기 위한 이중 장치는?"
      ]
    }
  },
  {
    id: "job-oliveyoung-05",
    companyName: "CJ 올리브영",
    title: "Growth Lead & 서비스 기획자",
    position: "그로스 PM",
    status: "passed",
    dueDate: "2026-07-20",
    tasks: [
      "올리브영 옴니채널 고객 데이터 기반 리텐션 및 재구매율 증대 기획",
      "개인화 추천 및 프로모션 퍼널 A/B 테스트 진행"
    ],
    requirements: [
      "데이터 분석 및 그로스 경험 3년 이상",
      "GA4, SQL, CRM 툴 활용 능력"
    ],
    preferred: [
      "커머스 버티컬 영역 서비스 기획 경험자"
    ],
    keywords: ["A/B 테스트", "GA4", "SQL", "지표 산출"],
    originalUrl: "https://recruit.cj.net/oliveyoung",
    location: "서울 용산구 한강대로",
    salary: "회사 내규에 따름",
    scrapedAt: "2026-07-10",
    memo: "최종 합격통보 받음! 입사일 연기 및 처우 협의 진행 중.",
    matchAnalysis: {
      matchScore: 95,
      summary: "데이터 기반 퍼널 개선 및 A/B 테스트 성과가 올리브영 그로스 팀 가이드라인과 매우 잘 매칭되었습니다.",
      matchedKeywords: ["A/B 테스트", "GA4", "SQL", "지표 산출"],
      missingKeywords: [],
      resumeImprovementTips: ["합격 축하드립니다!"],
      interviewPrepQuestions: []
    }
  }
];
