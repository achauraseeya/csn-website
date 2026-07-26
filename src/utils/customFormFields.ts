import { saveFileToGithub, apiFetch } from './githubDb';

export type FormId = 'membership' | 'volunteer' | 'matrimonial' | 'contact' | 'add-member' | 'donation' | 'event_volunteer';

export interface CustomFormField {
  id: string;
  formId: FormId;
  label: { en: string; ne: string };
  fieldType: 'text' | 'number' | 'textarea' | 'select';
  required: boolean;
  options?: string[]; // for select type
}

const STORAGE_KEY = 'csn_custom_form_fields_v1';
const GITHUB_FILE_NAME = 'custom_form_fields.json';

export function getCustomFormFields(formId: FormId): CustomFormField[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: CustomFormField[] = JSON.parse(raw);
    return all.filter(f => f.formId === formId);
  } catch {
    return [];
  }
}

export async function syncCustomFormFieldsFromGithub(): Promise<CustomFormField[]> {
  try {
    const cloud = await apiFetch<CustomFormField[]>('/api/custom-fields', GITHUB_FILE_NAME, []);
    if (cloud && Array.isArray(cloud)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloud));
      return cloud;
    }
  } catch (e) {
    console.warn('Failed to sync custom form fields from GitHub:', e);
  }
  return [];
}

export function saveCustomFormField(field: CustomFormField): CustomFormField[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: CustomFormField[] = raw ? JSON.parse(raw) : [];
    const existingIndex = all.findIndex(f => f.id === field.id);
    let updated: CustomFormField[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = field;
    } else {
      updated = [...all, field];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    saveFileToGithub(GITHUB_FILE_NAME, updated, `Update custom form field ${field.id}`).catch(() => {});
    return updated.filter(f => f.formId === field.formId);
  } catch {
    return [];
  }
}

export function deleteCustomFormField(fieldId: string, formId: FormId): CustomFormField[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: CustomFormField[] = JSON.parse(raw);
    const updated = all.filter(f => f.id !== fieldId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    saveFileToGithub(GITHUB_FILE_NAME, updated, `Delete custom form field ${fieldId}`).catch(() => {});
    return updated.filter(f => f.formId === formId);
  } catch {
    return [];
  }
}
