export function isUnspecifiedDeadline(dueDateStr?: string): boolean {
  if (!dueDateStr) return true;
  const lower = dueDateStr.toLowerCase().trim();
  if (
    lower.includes('until') ||
    lower.includes('filled') ||
    lower.includes('상시') ||
    lower.includes('채용시') ||
    lower.includes('미정') ||
    lower.includes('tbd') ||
    lower.includes('open') ||
    lower.includes('rolling')
  ) {
    return true;
  }
  return false;
}

export function formatDueDateLabel(dueDateStr?: string): string {
  if (isUnspecifiedDeadline(dueDateStr)) {
    return '데드라인 미정 (상시/채용시 마감)';
  }
  return dueDateStr || '데드라인 미정 (상시/채용시 마감)';
}

export function getDDayLabel(dueDateStr?: string): { text: string; isUrgent: boolean; isUnspecified: boolean } {
  if (isUnspecifiedDeadline(dueDateStr)) {
    return { text: '데드라인 미정', isUrgent: false, isUnspecified: true };
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dueDateStr!);
    if (isNaN(target.getTime())) {
      return { text: '데드라인 미정', isUrgent: false, isUnspecified: true };
    }
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: '마감됨', isUrgent: false, isUnspecified: false };
    if (diffDays === 0) return { text: 'D-DAY', isUrgent: true, isUnspecified: false };
    if (diffDays <= 3) return { text: `D-${diffDays}`, isUrgent: true, isUnspecified: false };
    return { text: `D-${diffDays}`, isUrgent: false, isUnspecified: false };
  } catch {
    return { text: '데드라인 미정', isUrgent: false, isUnspecified: true };
  }
}
