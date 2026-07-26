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

export function saveCustomFormField(field: CustomFormField): CustomFormField[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: CustomFormField[] = raw ? JSON.parse(raw) : [];
    const updated = [...all, field];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
    return updated.filter(f => f.formId === formId);
  } catch {
    return [];
  }
}
