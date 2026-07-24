import React, { useState } from 'react';
import { Plus, Trash2, Settings, X, Check, FileQuestion } from 'lucide-react';
import { Language } from '../types';
import {
  CustomFormField,
  getCustomFormFields,
  saveCustomFormField,
  deleteCustomFormField,
} from '../utils/customFormFields';

interface AdminFormFieldEditorProps {
  formId: 'membership' | 'volunteer' | 'matrimonial' | 'contact';
  lang: Language;
  isAdmin: boolean;
  onFieldsUpdated?: () => void;
}

export function AdminFormFieldEditor({
  formId,
  lang,
  isAdmin,
  onFieldsUpdated,
}: AdminFormFieldEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<CustomFormField[]>(() => getCustomFormFields(formId));

  // New field form state
  const [labelEn, setLabelEn] = useState('');
  const [labelNe, setLabelNe] = useState('');
  const [fieldType, setFieldType] = useState<'text' | 'number' | 'textarea' | 'select'>('text');
  const [required, setRequired] = useState(false);
  const [optionsStr, setOptionsStr] = useState('');

  if (!isAdmin) return null;

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelEn.trim()) return;

    const newField: CustomFormField = {
      id: `field-${Date.now()}`,
      formId,
      label: {
        en: labelEn.trim(),
        ne: labelNe.trim() || labelEn.trim(),
      },
      fieldType,
      required,
      options: fieldType === 'select' ? optionsStr.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    };

    const updated = saveCustomFormField(newField);
    setFields(updated);
    setLabelEn('');
    setLabelNe('');
    setOptionsStr('');
    setRequired(false);
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
          {isOpen ? (lang === 'en' ? 'Close Editor' : 'सम्पादक बन्द गर्नुहोस्') : (lang === 'en' ? '+ Add Custom Field' : '+ थप क्षेत्र थप्नुहोस्')}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-teal-200 dark:border-slate-700 space-y-4 text-xs">
          {/* Existing Fields List */}
          {fields.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-bold text-teal-950 dark:text-teal-100 uppercase tracking-wide">
                {lang === 'en' ? 'Active Custom Questions' : 'सक्रिय थप प्रश्नहरू'}:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fields.map(f => (
                  <div key={f.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">
                        {f.label[lang] || f.label.en}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        Type: {f.fieldType} {f.required ? '• Required' : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(f.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Field Form */}
          <form onSubmit={handleAddField} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-teal-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-teal-900 dark:text-teal-100">
              <FileQuestion className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'en' ? 'Add New Question to Form' : 'फारममा नयाँ प्रश्न थप्नुहोस्'}</span>
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
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-bold"
                >
                  <option value="text">Short Text</option>
                  <option value="number">Number</option>
                  <option value="textarea">Paragraph Text</option>
                  <option value="select">Dropdown Menu</option>
                </select>
              </div>

              {fieldType === 'select' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Dropdown Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={optionsStr}
                    onChange={e => setOptionsStr(e.target.value)}
                    placeholder="Option 1, Option 2, Option 3"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-medium"
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
                {lang === 'en' ? 'Save New Field' : 'क्षेत्र बचत गर्नुहोस्'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
