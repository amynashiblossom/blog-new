import { UserProfile, ExperienceBlock } from '../types';
import { INITIAL_USER_PROFILE, SAMPLE_EXPERIENCE_BLOCKS } from '../data/mockData';

const STORAGE_KEYS = {
  PROFILE: 'you_too_user_profile_v2',
  BLOCKS: 'you_too_experience_blocks_v1',
};

export const loadStoredProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return INITIAL_USER_PROFILE;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load stored profile:', err);
    return INITIAL_USER_PROFILE;
  }
};

export const saveStoredProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
};

export const loadStoredBlocks = (): ExperienceBlock[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BLOCKS);
    if (!raw) return SAMPLE_EXPERIENCE_BLOCKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return SAMPLE_EXPERIENCE_BLOCKS;
  } catch (err) {
    console.error('Failed to load stored blocks:', err);
    return SAMPLE_EXPERIENCE_BLOCKS;
  }
};

export const saveStoredBlocks = (blocks: ExperienceBlock[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
  } catch (err) {
    console.error('Failed to save blocks:', err);
  }
};

export const encodePortfolioData = (profile: UserProfile, blocks: ExperienceBlock[]): string => {
  try {
    const selectedBlocks = blocks.filter((b) => b.selectedForPortfolio);
    const payload = {
      p: profile,
      b: selectedBlocks,
    };
    const jsonStr = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(jsonStr);
    let binString = '';
    bytes.forEach((byte) => (binString += String.fromCharCode(byte)));
    return encodeURIComponent(btoa(binString));
  } catch (err) {
    console.error('Failed to encode portfolio data:', err);
    return '';
  }
};

export const decodePortfolioData = (
  encodedStr: string
): { profile: UserProfile; blocks: ExperienceBlock[] } | null => {
  try {
    const rawB64 = decodeURIComponent(encodedStr);
    const binString = atob(rawB64);
    const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.p && Array.isArray(parsed.b)) {
      return { profile: parsed.p, blocks: parsed.b };
    }
    return null;
  } catch (err) {
    console.error('Failed to decode portfolio data:', err);
    return null;
  }
};

export const createSharedPortfolioApi = async (
  profile: UserProfile,
  blocks: ExperienceBlock[]
): Promise<string> => {
  try {
    const selectedBlocks = blocks.filter((b) => b.selectedForPortfolio);
    const res = await fetch('/api/portfolio/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, blocks: selectedBlocks }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.shareId) {
        return `${window.location.origin}/p/${data.shareId}?shareId=${data.shareId}`;
      }
    }
  } catch (err) {
    console.warn('API share creation warning, fallback to URL parameter:', err);
  }

  // Fallback to URL base64 param if backend fails
  const encodedData = encodePortfolioData(profile, blocks);
  const nameSlug = encodeURIComponent(profile.name.toLowerCase().replace(/\s+/g, '-'));
  return `${window.location.origin}/p/${nameSlug}?pd=${encodedData}`;
};

export const fetchSharedPortfolioApi = async (
  shareId: string
): Promise<{ profile: UserProfile; blocks: ExperienceBlock[] } | null> => {
  try {
    const res = await fetch(`/api/portfolio/share/${shareId}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.profile) {
        return { profile: data.profile, blocks: data.blocks || [] };
      }
    }
  } catch (err) {
    console.error('Failed to fetch shared portfolio from server:', err);
  }
  return null;
};

