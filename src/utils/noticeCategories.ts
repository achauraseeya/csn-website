import { saveFileToGithub, apiFetch } from './githubDb';

export interface NoticeCategory {
  id: string;
  code: string;
  label: { en: string; ne: string };
}

const STORAGE_KEY = 'csn_notice_categories_v1';
const GITHUB_FILE_NAME = 'notice_categories.json';

export const DEFAULT_NOTICE_CATEGORIES: NoticeCategory[] = [
  { id: 'cat-notice', code: 'notice', label: { en: 'Bulletin / Notice', ne: 'सूचना' } },
  { id: 'cat-work', code: 'work', label: { en: 'Current Work', ne: 'सञ्चालित कार्यहरू' } },
  { id: 'cat-press', code: 'press', label: { en: 'Press Release', ne: 'प्रेस विज्ञप्ति' } },
];

export function getNoticeCategories(): NoticeCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTICE_CATEGORIES));
      return DEFAULT_NOTICE_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_NOTICE_CATEGORIES;
  }
}

export async function syncNoticeCategoriesFromGithub(): Promise<NoticeCategory[]> {
  try {
    const cloud = await apiFetch<NoticeCategory[]>('/api/notice-categories', GITHUB_FILE_NAME, DEFAULT_NOTICE_CATEGORIES);
    if (cloud && Array.isArray(cloud) && cloud.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloud));
      return cloud;
    }
  } catch (e) {
    console.warn('Failed to sync notice categories from GitHub:', e);
  }
  return DEFAULT_NOTICE_CATEGORIES;
}

export function saveNoticeCategory(category: NoticeCategory): NoticeCategory[] {
  try {
    const existing = getNoticeCategories();
    const index = existing.findIndex(c => c.id === category.id);
    let updated: NoticeCategory[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = category;
    } else {
      updated = [...existing, category];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    saveFileToGithub(GITHUB_FILE_NAME, updated, `Update notice category ${category.id}`).catch(() => {});
    return updated;
  } catch {
    return DEFAULT_NOTICE_CATEGORIES;
  }
}

export function deleteNoticeCategory(id: string): NoticeCategory[] {
  try {
    const existing = getNoticeCategories();
    const updated = existing.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    saveFileToGithub(GITHUB_FILE_NAME, updated, `Delete notice category ${id}`).catch(() => {});
    return updated;
  } catch {
    return DEFAULT_NOTICE_CATEGORIES;
  }
}
