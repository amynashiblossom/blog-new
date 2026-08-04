export type ApplicationStatus = 'interest' | 'preparing' | 'applied' | 'interview' | 'accepted' | 'rejected';

export interface ScrapedJobPosting {
  id: string;
  url: string;
  platform: 'wanted' | 'linkedin' | 'saramin' | 'jobkorea' | 'other';
  companyName: string;
  jobTitle: string;
  location?: string;
  deadline?: string; // YYYY-MM-DD
  dDay?: number; // Days remaining (e.g., 3 means D-3)
  status: ApplicationStatus;
  
  // Job detail sections
  mainTasks: string[];
  qualifications: string[];
  preferences: string[];
  techStack: string[];
  
  // AI match score cache if calculated
  matchScore?: number;
  matchReason?: string;
  skillGaps?: string[];
  
  createdAt: string; // ISO date string
  updatedAt: string;
}

export interface PrivateResumeData {
  title: string;
  summary: string;
  techSkills: string[];
  experienceHighlights: Array<{
    projectName: string;
    role: string;
    outcome: string;
    description: string;
  }>;
  rawResumeText: string;
  updatedAt: string;
}

export interface JobMatchAnalysisResult {
  jobId: string;
  matchScore: number; // 0 to 100
  matchingKeywords: string[];
  skillGaps: string[];
  strengthsSummary: string;
  improvementTips: string[];
}
