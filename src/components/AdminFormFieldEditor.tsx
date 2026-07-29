import React, { useState } from 'react';
import { Plus, Trash2, Settings, X, Check, FileQuestion, Edit2, EyeOff, Eye } from 'lucide-react';
import { Language } from '../types';
import {
  FormId,
  CustomFormField,
  CustomFieldType,
  getCustomFormFields,
  saveCustomFormField,
  deleteCustomFormField,
  getHiddenStandardFields,
  toggleHiddenStandardField,
} from '../utils/customFormFields';

interface AdminFormFieldEditorProps {
  formId: FormId;
  lang: Language;
  isAdmin: boolean;
  onFieldsUpdated?: () => void;
}

const standardFieldsMap: Record<FormId, { key: string; label: string }[]> = {
  membership: [
    { key: 'membership-name', label: 'Full Name' },
    { key: 'membership-phone', label: 'Phone Number' },
    { key: 'membership-email', label: 'Email Address' },
    { key: 'membership-address', label: 'Address / District' },
    { key: 'membership-occupation', label: 'Occupation' },
    { key: 'membership-type', label: 'Membership Category' },
    { key: 'membership-duration', label: 'Duration' },
    { key: 'membership-payment-method', label: 'Payment Method' },
    { key: 'membership-payment-ref', label: 'Payment Reference' },
  ],
  volunteer: [
    { key: 'volunteer-name', label: 'Full Name' },
    { key: 'volunteer-phone', label: 'Phone Number' },
    { key: 'volunteer-email', label: 'Email Address' },
    { key: 'volunteer-address', label: 'Address / Location' },
    { key: 'volunteer-interests', label: 'Areas of Interest' },
    { key: 'volunteer-availability', label: 'Availability' },
    { key: 'volunteer-notes', label: 'Notes / Motivation' },
  ],
  donation: [
    { key: 'donation-name', label: 'Donor Name' },
    { key: 'donation-phone', label: 'Donor Phone' },
    { key: 'donation-presets', label: 'Preset Amount Buttons' },
    { key: 'donation-custom-amount', label: 'Custom Amount Input' },
    { key: 'donation-bank-info', label: 'Bank Wire & QR Info Box' },
  ],
  matrimonial: [],
  contact: [],
  'add-member': [],
  event_volunteer: []
};

export function AdminFormFieldEditor({
  formId,
  lang,
  isAdmin,
  onFieldsUpdated,
}: AdminFormFieldEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<CustomFormField[]>(() => getCustomFormFields(formId));
  const [hiddenFields, setHiddenFields] = useState<string[]>(() => getHiddenStandardFields());

  // Editing state
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  // New field or edit form state
  const [labelEn, setLabelEn] = useState('');
  const [labelNe, setLabelNe] = useState('');
  const [fieldType, setFieldType] = useState<CustomFieldType>('text');
  const [required, setRequired] = useState(false);
  const [optionsStr, setOptionsStr] = useState('');

  if (!isAdmin) return null;

  const handleStartEdit = (field: CustomFormField) => {
    setEditingFieldId(field.id);
    setLabelEn(field.label.en);
    setLabelNe(field.label.ne || field.label.en);
    setFieldType(field.fieldType);
    setRequired(field.required);
    setOptionsStr(field.options ? field.options.join(', ') : '');
  };

  const handleCancelEdit = () => {
    setEditingFieldId(null);
    setLabelEn('');
    setLabelNe('');
    setFieldType('text');
    setRequired(false);
    setOptionsStr('');
  };

  const handleSaveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelEn.trim()) return;

    const savedField: CustomFormField = {
      id: editingFieldId || `field-${Date.now()}`,
      formId,
      label: {
        en: labelEn.trim(),
        ne: labelNe.trim() || labelEn.trim(),
      },
      fieldType,
      required,
      options: (fieldType === 'select' || fieldType === 'radio' || fieldType === 'multiselect') ? optionsStr.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    };

    const updated = saveCustomFormField(savedField);
    setFields(updated);
    handleCancelEdit();
    if (onFieldsUpdated) onFieldsUpdated();
  };

  const handleDelete = (fieldId: string) => {
    const updated = deleteCustomFormField(fieldId, formId);
    setFields(updated);
    if (onFieldsUpdated) onFieldsUpdated();
  };

  return (
    <div className="my-4 p-4 bg-teal-50/80 dark:bg-slate-800/80 border-2 border-dashed border-teal-300 dark:border-slate-700 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-teal-900 dark:text-teal-100 font-extrabold text-xs uppercase tracking-wider">
          <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === 'en' ? 'Admin Form Customizer' : 'प्रशासक फारम सम्पादक'}</span>
          <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] font-bold">
            {fields.length} {lang === 'en' ? 'Custom Questions' : 'थप प्रश्नहरू'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {isOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {isOpen ? (lang === 'en' ? 'Close Editor' : 'सम्पादक बन्द गर्नुहोस्') : (lang === 'en' ? 'Manage Custom Fields' : 'थप प्रश्नहरू व्यवस्थापन गर्नुहोस्')}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-teal-200 dark:border-slate-700 space-y-4 text-xs">
          {/* Toggle Default/Standard Fields */}
          {standardFieldsMap[formId] && standardFieldsMap[formId].length > 0 && (
            <div className="space-y-2 p-3 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-800 rounded-xl">
              <h5 className="font-bold text-teal-950 dark:text-teal-100 uppercase tracking-wide flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'en' ? 'Manage Default Form Fields (Show/Hide)' : 'डिफल्ट फारम क्षेत्रहरू व्यवस्थापन गर्नुहोस्'}</span>
              </h5>
              <p className="text-[10px] text-slate-500 font-medium">
                {lang === 'en' 
                  ? 'Uncheck a field to hide/remove it from the form (effectively deleting it from display).' 
                  : 'फारमबाट हटाउन वा लुकाउन अनचेक गर्नुहोस्।'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {standardFieldsMap[formId].map(sf => {
                  const isVisible = !hiddenFields.includes(sf.key);
                  return (
                    <label key={sf.key} className="flex items-center gap-2 p-2 rounded-lg border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => {
                          const updated = toggleHiddenStandardField(sf.key);
                          setHiddenFields(updated);
                          if (onFieldsUpdated) onFieldsUpdated();
                        }}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 select-none truncate">
                        {sf.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Existing Fields List */}
          {fields.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-bold text-teal-950 dark:text-teal-100 uppercase tracking-wide">
                {lang === 'en' ? 'Active Custom Questions' : 'सक्रिय थप प्रश्नहरू'}:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fields.map(f => (
                  <div key={f.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-sm">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">
                        {f.label[lang] || f.label.en}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        Type: {f.fieldType} {f.required ? '• Required' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(f)}
                        className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-slate-800 dark:text-teal-300 rounded-lg transition-colors cursor-pointer"
                        title="Edit field"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(f.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 rounded-lg transition-colors cursor-pointer"
                        title="Delete field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add or Edit Field Form */}
          <form onSubmit={handleSaveField} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-teal-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between font-bold text-teal-900 dark:text-teal-100">
              <div className="flex items-center gap-1.5">
                <FileQuestion className="w-4 h-4 text-emerald-500" />
                <span>
                  {editingFieldId
                    ? (lang === 'en' ? 'Edit Question Details' : 'प्रश्न सम्पादन गर्नुहोस्')
                    : (lang === 'en' ? 'Add New Question to Form' : 'फारममा नयाँ प्रश्न थप्नुहोस्')}
                </span>
              </div>
              {editingFieldId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-[11px] text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Question Label (English) *
                </label>
                <input
                  type="text"
                  required
                  value={labelEn}
                  onChange={e => setLabelEn(e.target.value)}
                  placeholder="e.g. Passport / Citizenship No"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Question Label (Nepali)
                </label>
                <input
                  type="text"
                  value={labelNe}
                  onChange={e => setLabelNe(e.target.value)}
                  placeholder="उदा. नागरिकता नम्बर"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Input Type
                </label>
                <select
                  value={fieldType}
                  onChange={e => setFieldType(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-bold font-sans text-gray-950 dark:text-white"
                >
                  <option value="text">Short Text</option>
                  <option value="number">Number</option>
                  <option value="textarea">Paragraph Text</option>
                  <option value="select">Dropdown Menu</option>
                  <option value="checkbox">Checkbox (Yes/No)</option>
                  <option value="date">Date Picker</option>
                  <option value="email">Email Input</option>
                  <option value="phone">Phone Input</option>
                  <option value="radio">Radio Buttons</option>
                  <option value="file">File/Image Upload</option>
                  <option value="time">Time Picker</option>
                  <option value="url">URL/Web Link</option>
                  <option value="password">Password Input</option>
                  <option value="multiselect">Checkbox List (Multi-Select)</option>
                </select>
              </div>

              {(fieldType === 'select' || fieldType === 'radio' || fieldType === 'multiselect') && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Options (comma-separated list)
                  </label>
                  <input
                    type="text"
                    value={optionsStr}
                    onChange={e => setOptionsStr(e.target.value)}
                    placeholder="Option 1, Option 2, Option 3"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-medium text-gray-950 dark:text-white"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={required}
                  onChange={e => setRequired(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {lang === 'en' ? 'Mark as Required field' : 'अनिवार्य क्षेत्र'}
                </span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                {editingFieldId
                  ? (lang === 'en' ? 'Update Field' : 'अद्यावधिक गर्नुहोस्')
                  : (lang === 'en' ? 'Save New Field' : 'क्षेत्र बचत गर्नुहोस्')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
