/**
 * resumeValidator.ts
 * 이력서 및 경력 증명 서류 파일 검증 유틸리티
 */

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

// 명시적으로 이력서가 아닌 것으로 감지할 거부 확장자 목록
const NON_RESUME_EXTENSIONS = new Set([
  // 소스코드 및 스크립트 파일
  'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'h', 'hpp', 
  'html', 'htm', 'css', 'scss', 'sass', 'json', 'xml', 'yaml', 'yml',
  'sh', 'bat', 'ps1', 'cmd', 'sql', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'kts',
  'vue', 'svelte', 'config', 'env', 'gitignore', 'lock',
  // 실행 파일 및 시스템 파일
  'exe', 'msi', 'bin', 'dll', 'sys', 'dat', 'db', 'sqlite', 'iso', 'apk', 'app',
  // 압축 파일
  'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz',
  // 미디어 파일 (단순 음성/영상)
  'mp3', 'wav', 'aac', 'flac', 'mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'
]);

// 허용 가능한 일반 문서/이력서 확장자 목록
const ALLOWED_RESUME_EXTENSIONS = new Set([
  'pdf', 'doc', 'docx', 'hwp', 'hwpx', 'txt', 'rtf', 'pages', 'odt', 'jpg', 'jpeg', 'png'
]);

// 파일 이름에 들어있는 경우 이력서가 아닌 것으로 감지할 비-이력서 키워드 (데일리스크럼, 디자인시스템, 회의록 등)
const NON_RESUME_FILENAME_KEYWORDS = [
  '데일리스크럼', 'daily-scrum', 'dailyscrum', '회의록', '업무일지', '스크럼', 
  'design-clay', 'design-system', '디자인시스템', '디자인가이드', '기획서', 'prd',
  'sprint', '스프린트', '학습노트', 'qa관련', 'qa', 'presentation', '발표자료'
];

// 이력서 키워드 목록 (텍스트 파일 검증용)
const RESUME_KEYWORDS = [
  '이력서', '경력', '학력', '자기소개', '프로젝트', '직무', '성과', '자격증', '포트폴리오',
  'resume', 'cv', 'curriculum vitae', 'experience', 'education', 'skills', 'work', 'project', 'career'
];

// 코드/설정/프로젝트 기록 파일 패턴 (텍스트 파일 검증용)
const CODE_PATTERNS = [
  /^\s*(import|export|from)\s+['"]/m,
  /^\s*(const|let|var|function|class|interface|type)\s+[a-zA-Z_$]/m,
  /^\s*(public|private|protected)\s+(class|void|int|string)/m,
  /^\s*(def|class)\s+[a-zA-Z_$].*:/m,
  /^\s*<\!DOCTYPE\s+html>/i,
  /^\s*\{[\s\S]*"name"\s*:\s*[\s\S]*\}/m, // JSON structure
  /^\s*package\s+[a-zA-Z_$.]+;/m
];

// 회의록 / 데일리스크럼 / 디자인 명세서 등 프로젝트 서류 패턴
const PROJECT_DOC_PATTERNS = [
  /\[Daily\s*Scrum\]/i,
  /오늘의\s*진행률/i,
  /오늘\s*완료한\s*일/i,
  /어제\s*한\s*일/i,
  /Clay-design-analysis/i,
  /design-analysis/i,
  /colors:\s*\n\s*primary:/i
];

/**
 * 동기적 파일 확장자 및 파일명 검사
 */
export function checkFileExtension(file: File): ValidationResult {
  const fileName = file.name;
  const lowerFileName = fileName.toLowerCase();
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (!ext || ext === fileName.toLowerCase()) {
    return {
      isValid: false,
      reason: `확장자가 없는 파일은 이력서로 등록할 수 없습니다.`
    };
  }

  // 1. 파일명 기반 데일리스크럼 / 디자인시스템 / 회의록 / PRD 감지
  for (const keyword of NON_RESUME_FILENAME_KEYWORDS) {
    if (lowerFileName.includes(keyword)) {
      return {
        isValid: false,
        reason: `'${fileName}'은(는) 이력서가 아닌 프로젝트 서류(데일리스크럼/디자인 가이드/회의록/기획서 등)입니다.`
      };
    }
  }

  if (NON_RESUME_EXTENSIONS.has(ext)) {
    return {
      isValid: false,
      reason: `'.${ext}' 형식의 파일(소스코드, 실행파일, 압축파일 등)은 이력서가 아닙니다.`
    };
  }

  if (!ALLOWED_RESUME_EXTENSIONS.has(ext)) {
    return {
      isValid: false,
      reason: `'.${ext}' 확장자는 이력서로 지원하지 않는 파일 형식입니다.`
    };
  }

  return { isValid: true };
}

/**
 * 텍스트 파일의 내용이 이력서인지 검증
 */
export function checkTextContent(textContent: string): ValidationResult {
  if (!textContent || textContent.trim().length === 0) {
    return {
      isValid: false,
      reason: '내용이 없는 빈 텍스트 파일입니다.'
    };
  }

  // 프로젝트 문서/데일리스크럼/디자인가이드 패턴 감지
  for (const pattern of PROJECT_DOC_PATTERNS) {
    if (pattern.test(textContent)) {
      return {
        isValid: false,
        reason: '데일리스크럼 업무기록, 회의록 또는 디자인 가이드 문서로 감지되었습니다. 이력서 서류가 아닙니다.'
      };
    }
  }

  // 코드 패턴 감지
  for (const pattern of CODE_PATTERNS) {
    if (pattern.test(textContent)) {
      return {
        isValid: false,
        reason: '소스코드나 구문 설정 파일은 이력서가 아닙니다.'
      };
    }
  }

  // 텍스트 파일인 경우 이력서 관련 키워드 확인 (단, 너무 짧지 않다면 최소 1개 이상 키워드 포함 또는 문서 특성)
  const lowerText = textContent.toLowerCase();
  const hasKeyword = RESUME_KEYWORDS.some((kw) => lowerText.includes(kw));

  // 텍스트 길이가 100자 이상인데 이력서 키워드가 하나도 없다면 비-이력서로 처리
  if (textContent.trim().length > 100 && !hasKeyword) {
    return {
      isValid: false,
      reason: '이력서/경력 관련 핵심 내용(경력, 학력, 프로젝트, Resume 등)이 포함되어 있지 않습니다.'
    };
  }

  return { isValid: true };
}

/**
 * 파일 및 내용을 최종 검증하는 비동기 함수
 */
export async function validateResumeFile(file: File): Promise<ValidationResult> {
  // 1. 확장자 1차 검사
  const extResult = checkFileExtension(file);
  if (!extResult.isValid) {
    return extResult;
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  // 2. 텍스트 또는 마크다운 파일인 경우 2차 내용 검사
  if (file.type.includes('text') || ext === 'txt' || ext === 'md') {
    try {
      const textContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.onerror = (err) => reject(err);
        reader.readAsText(file);
      });

      const contentResult = checkTextContent(textContent);
      if (!contentResult.isValid) {
        return contentResult;
      }
    } catch (e) {
      console.warn('Text validation skipped due to read error', e);
    }
  }

  return { isValid: true };
}
