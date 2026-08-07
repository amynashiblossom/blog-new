export type ApplicationStatus = 'interested' | 'preparing' | 'applied' | 'interview' | 'passed' | 'failed';

export interface MatchAnalysis {
  matchScore: number; // 0 ~ 100
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedPoints?: string[]; // 공고 전체 내용과 내 이력서/경력기술서 간 일치하는 부분
  improvementPoints?: string[]; // 공고 전체 내용 대비 내 서류에서 개선이 필요한 부분
  resumeImprovementTips: string[];
  interviewPrepQuestions: string[];
}

export interface CustomSchedule {
  id: string;
  title: string; // 예: "1차 면접", "과제 제출" 등
  date: string;  // YYYY-MM-DD
}

export interface JobPost {
  id: string;
  companyName: string;
  companyLogoUrl?: string;
  title: string;
  position: string;
  status: ApplicationStatus;
  dueDate: string; // YYYY-MM-DD
  isDeadlineFlexible?: boolean;
  tasks: string[];
  requirements: string[];
  preferred: string[];
  keywords: string[];
  originalUrl: string;
  location?: string;
  salary?: string;
  scrapedAt: string;
  memo?: string;
  rawText?: string; // 공고 전체 원문 텍스트 전체 보존
  matchAnalysis?: MatchAnalysis;
  customSchedules?: CustomSchedule[];
}

export interface ResumeFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  extractedText?: string;
}

export interface UserResume {
  title: string;
  summary: string;
  skills: string[];
  experienceYears: number;
  portfolioSummary: string;
  lastUpdated: string;
  attachedFiles?: ResumeFile[];
}
