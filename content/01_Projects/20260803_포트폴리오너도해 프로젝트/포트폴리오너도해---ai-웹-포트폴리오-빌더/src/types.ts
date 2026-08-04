export type JobCategory = 'pm' | 'dev' | 'design' | 'marketing' | 'general';

export interface NotionTableSpec {
  projectName: string;
  client: string; // 발주처 / 수주처 / 소속
  company: string; // 근무처 / 주관
  period: string; // 기간 (예: 2025.03 ~ 2025.08)
  contributionRate: number; // 기여도 (%)
  role: string; // 참여역할
  keyOutcome: string; // 주요성과
}

export interface FiveCardStructure {
  // Card 1: 시각적 표지 (Visual Cover)
  card1_cover: {
    thumbnailUrl: string;
    keyVisualDescription: string;
    tagline: string;
  };
  // Card 2: 리서치 / 문제 정의 (Research & Context)
  card2_research: {
    context: string;
    targetUser: string;
    problemDefinition: string;
    hypothesis: string;
  };
  // Card 3 & 4: 핵심 내용 및 솔루션 (Content & Solution)
  card3_solutionAction1: {
    title: string;
    actionDetail: string;
    techOrFrameworkUsed: string;
  };
  card4_solutionAction2: {
    title: string;
    actionDetail: string;
    keyDecisionPoint: string;
  };
  // Card 5: 시각화 성과 (Visualized Impact)
  card5_impact: {
    quantitativeMetrics: {
      label: string;
      value: string;
      changePercentage?: string;
    }[];
    beforeAfter?: {
      beforeTitle: string;
      beforeDescription: string;
      afterTitle: string;
      afterDescription: string;
      beforeImageUrl?: string;
      afterImageUrl?: string;
    };
    chartData?: {
      label: string;
      before: number;
      after: number;
    }[];
    qualitativeFeedback: string;
  };
}

export interface ExperienceBlock {
  id: string;
  jobCategory: JobCategory;
  notionSpec: NotionTableSpec;
  fiveCards: FiveCardStructure;
  star: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  skills: string[];
  demoUrl?: string;
  isMasked: boolean; // Whether confidential data is masked by default
  maskedFields?: string[]; // Field names that contain sensitive data
  selectedForPortfolio: boolean; // Selected in top 3
  createdAt: string;
  updatedAt: string;
}

export type CatAvatarStyle = 'classic' | 'techie' | 'artist' | 'executive';

export interface SmilingCatPersona {
  style: CatAvatarStyle;
  primaryColor: string;
  slogan: string;
  catQuote: string;
  competencies: string[];
}

export type PortfolioTheme = 'cream' | 'emerald' | 'serif' | 'dark' | 'navy';

export type PortfolioViewMode = 'bento' | 'pitchdeck' | 'document';

export interface UserProfile {
  name: string;
  roleTitle: string;
  jobCategory: JobCategory;
  email: string;
  phone: string;
  githubUrl: string;
  blogUrl: string;
  linkedinUrl: string;
  avatarUrl: string;
  catPersona: SmilingCatPersona;
  selectedTheme: PortfolioTheme;
  customAccentColor?: string;
  viewMode: PortfolioViewMode;
  isConfidentialMasked: boolean;
  accessLevel: 'public' | 'password' | 'private';
  accessPassword?: string;
}

export interface ExtractedKeyword {
  keyword: string;
  sourceProjectTitle: string;
  category: 'metric' | 'tech' | 'role' | 'domain';
  isMatchedWithJD: boolean;
  frequency: number;
}

export interface JDAnalysisResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  extractedUserKeywords?: ExtractedKeyword[];
  recommendations: {
    blockId: string;
    reason: string;
    suggestedEnhancement: string;
  }[];
  overallSummary: string;
  tailoredSloganSuggestion: string;
}

export interface PortfolioCommunityReference {
  id: string;
  title: string;
  authorName: string;
  authorRole: string;
  jobCategory: JobCategory;
  likesCount: number;
  viewCount: number;
  catAvatarStyle: CatAvatarStyle;
  theme: PortfolioTheme;
  slogan: string;
  featuredBlockTitles: string[];
  thumbnailUrl: string;
  tags: string[];
}
