import { ExperienceBlock, UserProfile, PortfolioCommunityReference } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "김냥냥",
  roleTitle: "서비스 기획자 / PM (Product Manager)",
  jobCategory: "pm",
  email: "nyangnyang.pm@you-too.kr",
  phone: "010-9876-5432",
  githubUrl: "https://github.com/nyang-pm",
  blogUrl: "https://brunch.co.kr/@nyang-pm",
  linkedinUrl: "https://linkedin.com/in/nyang-pm",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  catPersona: {
    style: "artist",
    primaryColor: "#2EB0A6",
    slogan: "데이터 기반 문제 정의와 유저 스토리텔링으로 서비스 성장을 만드는 PM",
    catQuote: "야옹! 딱딱한 이력서는 가라! 나 김냥냥의 핵심 프로젝트 3개로 진짜 실력을 보여줄게!",
    competencies: ["유저 데이터 분석", "Agile & Scrum", "Figma 와이어프레임", "A/B 테스트 설계", "지표 개선 (Retention +35%)"]
  },
  selectedTheme: "cream",
  viewMode: "bento",
  isConfidentialMasked: false,
  accessLevel: "public"
};

export const SAMPLE_EXPERIENCE_BLOCKS: ExperienceBlock[] = [
  {
    id: "block-pm-1",
    jobCategory: "pm",
    notionSpec: {
      projectName: "커머스 플랫폼 이탈률 개선 및 결제 UX 개편",
      client: "내부 서비스 (B2C 커머스)",
      company: "(주)냥냥컴퍼니 스타트업",
      period: "2025.02 ~ 2025.07 (6개월)",
      contributionRate: 85,
      role: "리드 PM (PO)",
      keyOutcome: "장바구니 이탈률 42% -> 24% 감소, 결제 전환율(CVR) +28% 상승"
    },
    fiveCards: {
      card1_cover: {
        thumbnailUrl: "https://images.unsplash.com/photo-1556742049-0a670f4a45cb?w=800&auto=format&fit=crop&q=80",
        keyVisualDescription: "한 화면 간편 결제 슬라이딩 팝업 UI & 이탈 방지 쿠폰 팝업",
        tagline: "복잡한 4단계 결제 과정을 단 1초 One-Click 간편 결제 흐름으로 재설계"
      },
      card2_research: {
        context: "월 방문 유저 12만 명 규모의 B2C 패션 커머스에서 장바구니 유저의 68%가 결제 완료 전 이탈하는 심각한 병목 현상 발생.",
        targetUser: "2030 모바일 쇼핑 유저 (결제 입력 과정에서 번거로움을 느끼고 타사로 이탈)",
        problemDefinition: "가입 주소 입력 및 카드 인증 단계가 4단계나 필요하여 결제 피로도 극대화.",
        hypothesis: "원클릭 결제 수단 우선 배치 및 이탈 감지 시 실시간 할인 혜택 제공 시 CVR이 20% 이상 증가할 것이다."
      },
      card3_solutionAction1: {
        title: "Action 1: 결제 뎁스 4단계 -> 1단계 원클릭 축소",
        actionDetail: "사용자 유저 테스트(UT 12회) 결과를 바탕으로 자주 쓰는 간편결제(카카오페이, 토스페이, 덤카드)를 최상단에 자동 고정 배치.",
        techOrFrameworkUsed: "Mixpanel 이벤트 트래킹, Figma 와이어프레임, Amplitude Funnel Analysis"
      },
      card4_solutionAction2: {
        title: "Action 2: 결제 페이지 이탈 의도 실시간 감지 트리거",
        actionDetail: "뒤로가기 버튼 클릭 시 '지금 결제 시 2,000원 즉시 할인' 팝업 노출 및 세션 타임머 5분 제한 기능 적용.",
        keyDecisionPoint: "개발팀과 협의하여 백엔드 API 추가 없이 프론트엔드 쿠폰 토큰 발급으로 3일 만에 빠른 배포 완료."
      },
      card5_impact: {
        quantitativeMetrics: [
          { label: "장바구니 이탈률", value: "24.2%", changePercentage: "-17.8%p" },
          { label: "결제 전환율(CVR)", value: "8.9%", changePercentage: "+28.4%" },
          { label: "월 매출 상승액 (대외비)", value: "₩[대외비]천만 원", changePercentage: "+34.5%" }
        ],
        beforeAfter: {
          beforeTitle: "기존: 4개 페이지를 거치는 지루한 결제 폼",
          beforeDescription: "배송지 입력 -> 카드사 선택 -> CVC 번호 입력 -> ARS 인증 팝업",
          afterTitle: "개편: 1-Click 바텀시트 생체인증 결제",
          afterDescription: "상품 페이지에서 바로 카카오/토스 원클릭으로 1.2초 만에 주문 완료"
        },
        chartData: [
          { label: "1주차", before: 42, after: 38 },
          { label: "2주차", before: 41, after: 31 },
          { label: "3주차", before: 43, after: 26 },
          { label: "4주차", before: 42, after: 24 }
        ],
        qualitativeFeedback: "경영진 및 고객 CS 리포트에서 '결제가 정말 빨라져서 쇼핑 만족도가 극대화되었다'는 호평 다수 수집."
      }
    },
    star: {
      situation: "자사 커머스 앱의 결제 단계 이탈률이 42%에 달하여 마케팅 비용 대비 CVR이 극도로 낮았습니다.",
      task: "이탈 원인을 정밀 분석하고, 결제 흐름 UX를 개편하여 CVR을 20% 이상 끌어올리는 과제 수립.",
      action: "UT 수행, Mixpanel 퍼널 분석, 원클릭 바텀시트 결제 UI 설계 및 이탈 감지 실시간 오퍼 트리거 개발 총괄.",
      result: "결제 이탈률 24% 감소, 전체 CVR 28.4% 상승, 월 신규 주문건수 3,500건 돌파 달성."
    },
    skills: ["Mixpanel", "Figma", "User Research", "Agile/Scrum", "A/B Testing"],
    demoUrl: "https://demo.you-too.kr/commerce-pay",
    isMasked: true,
    maskedFields: ["월 매출 상승액 (대외비)", "notionSpec.client"],
    selectedForPortfolio: true,
    createdAt: "2025-07-10",
    updatedAt: "2025-08-01"
  },
  {
    id: "block-dev-2",
    jobCategory: "dev",
    notionSpec: {
      projectName: "실시간 대용량 로그 분석 & 대시보드 시스템 구축",
      client: "금융/핀테크 고도화 프로젝트",
      company: "(주)냥냥테크 엔지니어링",
      period: "2024.09 ~ 2025.01 (5개월)",
      contributionRate: 90,
      role: "풀스택 / 백엔드 리드 개발자",
      keyOutcome: "TPS 12,000건 실시간 처리, 검색 쿼리 응답속도 2.8초 -> 120ms 단축"
    },
    fiveCards: {
      card1_cover: {
        thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
        keyVisualDescription: "WebSocket 기반 실시간 차트 & Elasticsearch 로그 필터링 대시보드 UI",
        tagline: "초당 1만 건 이상 쏟아지는 트랜잭션 로그를 지연 없이 실시간 감지 및 가시화"
      },
      card2_research: {
        context: "기존 RDBMS 단일 서버 구조로 일 5,000만 건 이상 쌓이는 트랜잭션 로그 조회 시 DB 락(Lock) 및 타임아웃 장애 빈발.",
        targetUser: "사내 보안관제팀 및 서비스 운영 모니터링 엔지니어",
        problemDefinition: "1일 이상 지난 과거 데이터 검색 시 최대 5초 이상 소요되며, 실시간 이상징후 알림 불가.",
        hypothesis: "Kafka + Elasticsearch 인덱싱 파이프라인 도입 및 WebSocket 스트리밍 적용 시 100ms 내 실시간 모니터링이 가능할 것이다."
      },
      card3_solutionAction1: {
        title: "Action 1: Kafka 기반 분산 분동 큐 & Elasticsearch 아키텍처 재설계",
        actionDetail: "트래픽 폭주 시에도 백프레셔(Backpressure)를 제어할 수 있도록 Kafka 파티셔닝 구조 파이프라인 구현.",
        techOrFrameworkUsed: "TypeScript, Node.js, Express, Kafka, Elasticsearch, Redis, React, Tailwind"
      },
      card4_solutionAction2: {
        title: "Action 2: Redis 캐싱 & 인덱싱 최적화로 쿼리 latency 95% 감축",
        actionDetail: "자주 조회되는 최근 1시간 관제 집계 데이터를 Redis In-Memory에 3초 단위 캐싱 파이프라인 구성.",
        keyDecisionPoint: "Elasticsearch 데이터 수명주기(ILM) 설정으로 30일 경과 콜드 데이터 자동 압축 보관 처리."
      },
      card5_impact: {
        quantitativeMetrics: [
          { label: "최대 처리 트래픽 (TPS)", value: "12,400 TPS", changePercentage: "+310%" },
          { label: "평균 쿼리 응답 속도", value: "120ms", changePercentage: "-95.7%" },
          { label: "서버 인프라 비용 절감", value: "₩[영업비밀]만 원/월", changePercentage: "-42%" }
        ],
        beforeAfter: {
          beforeTitle: "기존: Postgres SQL Like 검색 (2.8s)",
          beforeDescription: "대용량 테이블 풀 스캔으로 인하여 CPU 점유율 98% 폭증 및 타임아웃 발생",
          afterTitle: "개편: ES Sharding + WebSocket (120ms)",
          afterDescription: "실시간 비동기 이벤트 스트림으로 0.1초 만에 이상 로그 팝업 알림"
        },
        chartData: [
          { label: "10K TPS", before: 2800, after: 120 },
          { label: "20K TPS", before: 5400, after: 145 },
          { label: "30K TPS", before: 9100, after: 190 }
        ],
        qualitativeFeedback: "운영팀 모니터링 타임아웃 장애 0건 달성 및 사내 기술 블로그 우수 아키텍처 사례 선정."
      }
    },
    star: {
      situation: "일 5천만 건 이상의 금융 로그 모니터링 시 DB 병목으로 모니터링 화면이 정지되는 문제 발생.",
      task: "TPS 1만 이상을 견디는 분산 아키텍처를 구축하고 쿼리 속도를 200ms 이하로 줄이는 시스템 개편.",
      action: "Kafka, Elasticsearch, Redis 캐싱 파이프라인 구축 및 React WebSocket 실시간 파이 차트 UI 개발.",
      result: "TPS 12,400 달성, 쿼리 반응속도 2.8초에서 120ms로 단축, 서버 인프라 유지비용 42% 감축."
    },
    skills: ["TypeScript", "Node.js", "Kafka", "Elasticsearch", "Redis", "React", "WebSocket"],
    demoUrl: "https://github.com/eunhyuk-pm/realtime-log-dashboard",
    isMasked: false,
    selectedForPortfolio: true,
    createdAt: "2025-02-15",
    updatedAt: "2025-07-28"
  },
  {
    id: "block-design-3",
    jobCategory: "design",
    notionSpec: {
      projectName: "글로벌 B2B SaaS 디자인 시스템 (Design System) 정립 및 컴포넌트 라이브러리 구축",
      client: "북미/한국 B2B 서비스",
      company: "(주)냥냥디자인 스튜디오",
      period: "2024.05 ~ 2024.11 (7개월)",
      contributionRate: 100,
      role: "리드 UI/UX 디자이너",
      keyOutcome: "디자이너-개발자 스펙 작업 시간 60% 단축, 화면 일관성 점수 98점 달성"
    },
    fiveCards: {
      card1_cover: {
        thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
        keyVisualDescription: "Figma 토큰 & React Tailwind 매핑 컴포넌트 120종 세트",
        tagline: "다크모드 & 멀티 브랜드 지원을 위한 토큰화 기반의 확장 가능한 B2B 디자인 시스템"
      },
      card2_research: {
        context: "팀 크기가 커짐에 따라 디자이너마다 버튼 라운드, 칼라 값, 마진 간격이 다르게 작업되어 디자인 부채 극심.",
        targetUser: "사내 디자이너 8명 & 프론트엔드 개발자 12명",
        problemDefinition: "신규 페이지 제작 시 매번 중복 컴포넌트를 코딩하여 신규 기능 커스텀 배포에만 평균 3주 소요.",
        hypothesis: "원자적 디자인(Atomic Design) 원칙에 따른 Figma 변수 토큰 및 React Storybook 구축 시 스펙 소통이 50% 줄어들 것이다."
      },
      card3_solutionAction1: {
        title: "Action 1: Figma Variables & Color/Spacing 토큰 수립",
        actionDetail: "Brand, Neutral, Semantic, Dark Mode의 4단계 칼라 토큰 및 4px/8px 수치 기반의 격자 그리드 시스템 정의.",
        techOrFrameworkUsed: "Figma, Storybook, Tailwind CSS, Tokens Studio, React"
      },
      card4_solutionAction2: {
        title: "Action 2: 개발팀과 1:1 매핑되는 React 스토리북 라이브러리 싱크",
        actionDetail: "Figma 컴포넌트명이 React props와 100% 동일하도록 네이밍 규칙 통일 및 accessibility (WCAG AA) 준수.",
        keyDecisionPoint: "Button, Modal, Input, Toast 등 42개 코어 컴포넌트에 대한 접근성 키보드 내비게이션 완벽 지원."
      },
      card5_impact: {
        quantitativeMetrics: [
          { label: "신규 페이지 개발 기간", value: "3.5일", changePercentage: "-68%" },
          { label: "UI 스펙 소통 오류 건수", value: "월 2건 이하", changePercentage: "-84%" },
          { label: "디자인 시스템 적용률", value: "98.5%", changePercentage: "+100%" }
        ],
        beforeAfter: {
          beforeTitle: "기존: 제각각의 버튼과 드롭다운 스타일",
          beforeDescription: "동일한 확인 버튼인데 라운드 4px, 8px, 12px가 혼용되고 레드 칼라도 5가지 존재",
          afterTitle: "개편: 토큰 1개로 전체 다크모드/브랜드 스위칭",
          afterDescription: "Single Source of Truth 확보로 버튼 클릭 하나로 전사 UI 리브랜딩 가능"
        },
        chartData: [
          { label: "버튼 컴포넌트", before: 18, after: 1 },
          { label: "컬러 토큰", before: 64, after: 16 },
          { label: "폰트 사이즈", before: 24, after: 8 }
        ],
        qualitativeFeedback: "개발팀 리더 인터뷰: '스토리북에서 바로 코드 복사해서 쓸 수 있어 생산성이 역대급으로 향상되었습니다.'"
      }
    },
    star: {
      situation: "제품군 확장에 따른 디자이너와 개발자 간 UI 불일치 및 개발 지연 현상 발생.",
      task: "Figma와 React를 연결하는 전사 표준 B2B SaaS 디자인 시스템 구축 과제 진행.",
      action: "Atomic Design 기반 Figma 토큰 정립, WCAG AA 접근성 검증, Storybook 컴포넌트 라이브러리 제작.",
      result: "신규 화면 제작 소요시간 3.5일로 감축, 화면 디자인 일관성 98.5% 확보."
    },
    skills: ["Figma", "Design System", "Storybook", "UI/UX Design", "Accessibility"],
    demoUrl: "https://figma.com/@you-too-design-system",
    isMasked: false,
    selectedForPortfolio: true,
    createdAt: "2024-11-20",
    updatedAt: "2025-06-12"
  },
  {
    id: "block-mkt-4",
    jobCategory: "marketing",
    notionSpec: {
      projectName: "퍼포먼스 마케팅 ROAS 450% 달성 및 바이럴 캠페인",
      client: "자사 D2C 뷰티/헬스 브랜드",
      company: "(주)너도마케팅 랩",
      period: "2025.01 ~ 2025.05 (5개월)",
      contributionRate: 95,
      role: "리드 퍼포먼스 마케터",
      keyOutcome: "월 마케팅 집행액 5천만 원 기준 ROAS 180% -> 460% 수직 상승"
    },
    fiveCards: {
      card1_cover: {
        thumbnailUrl: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&auto=format&fit=crop&q=80",
        keyVisualDescription: "Shorts/Reels 숏폼 소재 50종 및 Meta/Kakao 광고 머신러닝 소재 테스트",
        tagline: "소비자 공감형 숏폼 카피라이팅과 고효율 타겟팅 머신러닝으로 ROAS 2.5배 경신"
      },
      card2_research: {
        context: "기존 인스타그램 피드 이미지 광고의 CTR이 0.8% 이하로 정체되고 CAC(고객 획득 비용)가 상승하는 위기 발생.",
        targetUser: "2030 피부 고민 남녀 (문제 해결형 바이럴 콘텐츠에 민감하게 반응)",
        problemDefinition: "제품의 원료나 기술 스펙을 나열하는 진부한 텍스트 카피가 유저의 시선을 끌지 못함.",
        hypothesis: "실제 유저의 Before/After 솔직 후기 스타일의 15초 숏폼 소재 배치 시 CTR 3.0% 이상 달성 가능할 것이다."
      },
      card3_solutionAction1: {
        title: "Action 1: 숏폼 A/B 테스팅 프레임워크 (후킹 3초 법칙)",
        actionDetail: "영상 첫 3초의 메시지를 '피부과 가기 전 꼭 봐야 할 1가지'로 설정하고 총 40개 변형 소재 오디션 집행.",
        techOrFrameworkUsed: "Meta Ads Manager, Kakao Moment, GA4, TikTok Ads, Canva"
      },
      card4_solutionAction2: {
        title: "Action 2: 랜딩페이지 CVR 리타게팅 맞춤 오퍼 설계",
        actionDetail: "광고 소재 클릭 유저에게 맞춤형 3,000원 쿠폰 팝업을 연결하여 결제 유입 퍼널 연결성 강화.",
        keyDecisionPoint: "광고 소재 카피와 랜딩페이지 첫 헤드카피의 키워드를 100% 동일하게 매칭하여 이탈률 최소화."
      },
      card5_impact: {
        quantitativeMetrics: [
          { label: "평균 ROAS", value: "462%", changePercentage: "+282%p" },
          { label: "광고 클릭률 (CTR)", value: "3.85%", changePercentage: "+3.05%p" },
          { label: "고객 획득 비용 (CAC)", value: "₩12,400", changePercentage: "-58%" }
        ],
        beforeAfter: {
          beforeTitle: "기존: 예쁜 제품 이미지 피드 광고",
          beforeDescription: "CTR 0.8%, ROAS 180%, 획득 비용 29,000원",
          afterTitle: "개편: 공감 유발 15s 숏폼 UGC 소재",
          afterDescription: "CTR 3.85%, ROAS 462%, 획득 비용 12,400원"
        },
        chartData: [
          { label: "1월", before: 180, after: 210 },
          { label: "2월", before: 180, after: 310 },
          { label: "3월", before: 180, after: 420 },
          { label: "4월", before: 180, after: 462 }
        ],
        qualitativeFeedback: "매출 목표 조기 달성으로 대표이사 감사 포상 및 사내 우수 캠페인 선정."
      }
    },
    star: {
      situation: "기존 퍼포먼스 광고 효율 저하로 CAC 상승 및 ROAS 정체 현상 발생.",
      task: "ROAS 300% 이상 달성을 목표로 숏폼 콘텐츠 중심의 퍼포먼스 마케팅 구조 개편.",
      action: "3초 후킹 카피 A/B 테스트 40종 집행, GA4 랜딩 퍼널 매칭, 머신러닝 타겟팅 오버홀.",
      result: "ROAS 462% 경신, CTR 3.85% 상승, CAC 58% 감축."
    },
    skills: ["Performance Marketing", "Meta Ads", "GA4", "Copywriting", "ROAS Optimization"],
    demoUrl: "https://instagram.com/you-too-marketing",
    isMasked: false,
    selectedForPortfolio: false,
    createdAt: "2025-05-30",
    updatedAt: "2025-07-15"
  }
];

export const SAMPLE_COMMUNITY_REFERENCES: PortfolioCommunityReference[] = [
  {
    id: "ref-1",
    title: "토스/네이버 지원용 3년차 서비스 기획자 B2C 포트폴리오",
    authorName: "이민우",
    authorRole: "PO / 서비스 기획자",
    jobCategory: "pm",
    likesCount: 342,
    viewCount: 4210,
    catAvatarStyle: "classic",
    theme: "emerald",
    slogan: "가설 검증과 데이터 기반 결제 전환율 28% 개선 사례 중심",
    featuredBlockTitles: ["커머스 결제 UX 개편", "B2C 앱 온보딩 Funnel 최적화", "AI 자동 가계부 서비스 MVP"],
    thumbnailUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80",
    tags: ["PM", "이탈률개선", "A/B테스트", "5장프레임워크"]
  },
  {
    id: "ref-2",
    title: "대용량 분산 시스템 & 실시간 트래픽 백엔드 개발자 웹 포트폴리오",
    authorName: "박준형",
    authorRole: "백엔드 리드 엔지니어",
    jobCategory: "dev",
    likesCount: 512,
    viewCount: 6890,
    catAvatarStyle: "techie",
    theme: "dark",
    slogan: "TPS 12,000건을 지연 없이 처리하는 Node.js & Kafka 아키텍트",
    featuredBlockTitles: ["실시간 대용량 로그 대시보드", "분산 결제 서버 멱등성 보장", "GraphQL API 게이트웨이 구축"],
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    tags: ["개발자", "TPS12K", "Kafka", "Elasticsearch", "TechTheme"]
  },
  {
    id: "ref-3",
    title: "글로벌 B2B SaaS Figma 디자인 시스템 & 스토리북 완벽 정립",
    authorName: "최수아",
    authorRole: "Senior UI/UX Designer",
    jobCategory: "design",
    likesCount: 289,
    viewCount: 3840,
    catAvatarStyle: "artist",
    theme: "serif",
    slogan: "디자이너와 개발자 소통시간 60% 감축한 Atomic Design System",
    featuredBlockTitles: ["B2B SaaS 토큰 디자인 시스템", "글로벌 대시보드 다크모드 UX", "모바일 바이럴 브랜딩 키비주얼"],
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
    tags: ["디자인", "Storybook", "Figma", "AtomicDesign"]
  },
  {
    id: "ref-4",
    title: "ROAS 460% 경신! 숏폼 콘텐츠 중심 퍼포먼스 마케터 웹 슬라이드",
    authorName: "정유진",
    authorRole: "퍼포먼스 / 그로스 마케터",
    jobCategory: "marketing",
    likesCount: 198,
    viewCount: 2950,
    catAvatarStyle: "executive",
    theme: "cream",
    slogan: "3초 후킹 카피라이팅과 랜딩 퍼널 연결로 고객 획득 비용 58% 감축",
    featuredBlockTitles: ["뷰티 브랜드 ROAS 450% 퍼포먼스", "GA4 유저 코호트 이탈 분석", "TikTok 숏폼 바이럴 캠페인"],
    thumbnailUrl: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=600&auto=format&fit=crop&q=80",
    tags: ["마케팅", "ROAS", "MetaAds", "GA4", "그로스"]
  }
];

export const CAT_QUOTES = [
  "냐옹! 포트폴리오 첫 작성이 막막하다구? 걱정 마, 내가 5장 프레임워크로 딱딱 잡아줄게!",
  "골치 아픈 영업비밀과 대외비 수치는 원클릭 마스킹(Blur)으로 완벽 보안! 맘 편히 작성해봐!",
  "지원하려는 채용 공고(JD)를 붙여넣어봐! AI가 너의 스펙 중 최고의 3개를 추천해줄게!",
  "이력서처럼 딱딱한 텍스트 나열은 이제 그만! 시각적 표지와 성과 슬라이더로 합격율 상승!",
  "너도 할 수 있어! 포트폴리오너도해와 함께 3분 만에 멋진 웹 포트폴리오 완성!"
];
