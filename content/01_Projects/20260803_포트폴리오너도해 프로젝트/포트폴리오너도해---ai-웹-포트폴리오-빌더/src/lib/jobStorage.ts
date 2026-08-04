import { ScrapedJobPosting, PrivateResumeData } from '../types/job';

const JOBS_STORAGE_KEY = 'jobarchive_saved_jobs_v1';
const RESUME_STORAGE_KEY = 'jobarchive_private_resume_v1';

export const INITIAL_SAMPLE_JOBS: ScrapedJobPosting[] = [
  {
    id: 'job-sample-1',
    url: 'https://www.wanted.co.kr/wd/198273',
    platform: 'wanted',
    companyName: '토스 (비바리퍼블리카)',
    jobTitle: 'Frontend Developer (포트폴리오/웹 빌더 팀)',
    location: '서울 강남구',
    deadline: '2026-08-10',
    dDay: 6,
    status: 'preparing',
    mainTasks: [
      '웹 기반 포트폴리오 에디터 및 캔버스 UI 개발',
      '사용자 경험(UX) 최적화 및 렌더링 성능 개선',
      'Design System 컴포넌트 개발 및 유지보수'
    ],
    qualifications: [
      'React, TypeScript 개발 경력 3년 이상 또는 그에 준하는 역량',
      '상태 관리 및 복잡한 인터랙티브 UI 개발 경험',
      '웹 성능 측정 및 Lighthouse 점수 개선 성과 보유자'
    ],
    preferences: [
      'TailwindCSS 및 Canvas / SVG 제어 경험',
      'A/B 테스트 및 퍼널 데이터 기반 서비스 개선 경험'
    ],
    techStack: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'Vite'],
    matchScore: 94,
    matchReason: 'React/TypeScript 기반 포트폴리오 웹 서비스 구축 경험 및 성능 최적화 성과가 요구사항과 94% 일치함',
    skillGaps: ['Next.js 실무 적용 사례 구체화 필요'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'job-sample-2',
    url: 'https://www.linkedin.com/jobs/view/9928172',
    platform: 'linkedin',
    companyName: '쿠팡 (Coupang)',
    jobTitle: 'Product Manager (User Growth)',
    location: '서울 송파구',
    deadline: '2026-08-07',
    dDay: 3,
    status: 'interest',
    mainTasks: [
      '신규 가입 유저 온보딩 퍼널 CVR(전환율) 개선',
      'GA4 / Amplitude 기반 유저 행동 패턴 데이터 분석',
      '개발 및 디자인 팀과의 스크럼 스프린트 리딩'
    ],
    qualifications: [
      'IT 서비스 PM/PO 경력 2년 이상',
      '데이터 기반 가설 수립 및 A/B 테스트 정량 성과 보유자',
      'SQL 활용 능력 및 퍼널 데이터 추출 가능자'
    ],
    preferences: [
      'E-commerce 또는 N잡/매칭 서비스 기획 경험',
      'Growth Hacking 지표 관리 경험'
    ],
    techStack: ['GA4', 'Amplitude', 'SQL', 'A/B Test', 'Figma'],
    matchScore: 88,
    matchReason: 'A/B 테스트 퍼널 개선 및 데이터 기반 UX 분석 경험이 직무 요구사항과 잘 부합함',
    skillGaps: ['SQL 데이터베이스 직접 쿼리 경험 작성 필요'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_SAMPLE_RESUME: PrivateResumeData = {
  title: '프론트엔드 & AI 웹 서비스 개발 이력서',
  summary: 'React, TypeScript, Node.js 기반의 풀스택 웹 앱 개발 및 AI 기반 사용자 경험(UX) 최적화에 강점을 가진 3년 차 개발자입니다.',
  techSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'TailwindCSS', 'Vite', 'Gemini AI', 'A/B 테스트'],
  experienceHighlights: [
    {
      projectName: '포트폴리오너도해 — AI 웹 포트폴리오 빌더',
      role: '리드 프론트엔드 & 백엔드 개발자',
      outcome: '로딩 속도 40% 개선 및 AI 기반 STAR 경험 블록 매핑 파이프라인 구축',
      description: 'Notion API/MCP 연동 모달 개발, 디바이스 프레임 목업 렌더링, Gemini API 기반 포트폴리오 자동 세공 로직 개발'
    }
  ],
  rawResumeText: `프론트엔드 및 AI 서비스 개발자. React 19, TypeScript, Express를 주 스택으로 사용하며, 사용자 중심의 인터랙티브 웹 앱 제작에 깊은 관심이 있습니다. A/B 테스트 기반 퍼널 CVR 개선 경험 및 Notion API/MCP 연동 경험 보유.`,
  updatedAt: new Date().toISOString()
};

export const loadStoredJobs = (): ScrapedJobPosting[] => {
  try {
    const raw = localStorage.getItem(JOBS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_JOBS));
      return INITIAL_SAMPLE_JOBS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load jobs from storage:', e);
    return INITIAL_SAMPLE_JOBS;
  }
};

export const saveStoredJobs = (jobs: ScrapedJobPosting[]) => {
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.error('Failed to save jobs to storage:', e);
  }
};

export const loadStoredPrivateResume = (): PrivateResumeData => {
  try {
    const raw = localStorage.getItem(RESUME_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_RESUME));
      return INITIAL_SAMPLE_RESUME;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load private resume:', e);
    return INITIAL_SAMPLE_RESUME;
  }
};

export const saveStoredPrivateResume = (resume: PrivateResumeData) => {
  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
  } catch (e) {
    console.error('Failed to save private resume:', e);
  }
};
