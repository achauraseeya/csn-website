export interface MemberCategory {
  id: string;
  code: string;
  label: { en: string; ne: string };
  feeInfo?: string;
}

const STORAGE_KEY = 'csn_member_categories_v1';

export const DEFAULT_MEMBER_CATEGORIES: MemberCategory[] = [
  { id: 'cat-chief', code: 'chief', label: { en: 'Chief Leaders', ne: 'मुख्य नेतृत्व' }, feeInfo: 'NPR 25,000' },
  { id: 'cat-secretary', code: 'secretary', label: { en: 'Secretariat', ne: 'सचिवालय' }, feeInfo: 'NPR 15,000' },
  { id: 'cat-board', code: 'board', label: { en: 'Board Advisers', ne: 'सल्लाहकार बोर्ड' }, feeInfo: 'NPR 20,000' },
  { id: 'cat-general', code: 'general', label: { en: 'General Members', ne: 'साधारण सदस्यहरू' }, feeInfo: 'NPR 1,000' },
  { id: 'cat-life', code: 'life', label: { en: 'Life Members', ne: 'आजीवन सदस्यहरू' }, feeInfo: 'NPR 11,000' },
  { id: 'cat-patron', code: 'patron', label: { en: 'Patron / Donor Members', ne: 'संरक्षक सदस्यहरू' }, feeInfo: 'NPR 51,000' },
];

export function getMemberCategories(): MemberCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MEMBER_CATEGORIES));
      return DEFAULT_MEMBER_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MEMBER_CATEGORIES;
  }
}

export function saveMemberCategory(category: MemberCategory): MemberCategory[] {
  try {
    const existing = getMemberCategories();
    const index = existing.findIndex(c => c.id === category.id);
    let updated: MemberCategory[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = category;
    } else {
      updated = [...existing, category];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_MEMBER_CATEGORIES;
  }
}

export function deleteMemberCategory(id: string): MemberCategory[] {
  try {
    const existing = getMemberCategories();
    const updated = existing.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_MEMBER_CATEGORIES;
  }
}
