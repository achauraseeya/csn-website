import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Settings, X, Check, FileQuestion, Edit2, EyeOff, Eye, Sparkles } from 'lucide-react';
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
  defaultOpen?: boolean;
}

const standardFieldsMap: Record<FormId, { key: string; labelEn: string; labelNe: string }[]> = {
  membership: [
    { key: 'membership-name', labelEn: 'Full Name', labelNe: 'पूरा नाम' },
    { key: 'membership-phone', labelEn: 'Phone Number', labelNe: 'फोन नम्बर' },
    { key: 'membership-email', labelEn: 'Email Address', labelNe: 'इमेल ठेगाना' },
    { key: 'membership-address', labelEn: 'Address / District', labelNe: 'ठेगाना / जिल्ला' },
    { key: 'membership-occupation', labelEn: 'Occupation', labelNe: 'पेशा' },
    { key: 'membership-type', labelEn: 'Membership Category', labelNe: 'सदस्यता वर्ग' },
    { key: 'membership-duration', labelEn: 'Duration', labelNe: 'अवधि' },
    { key: 'membership-payment-method', labelEn: 'Payment Method', labelNe: 'भुक्तानी विधि' },
    { key: 'membership-payment-ref', labelEn: 'Payment Reference', labelNe: 'भुक्तानी सन्दर्भ' },
  ],
  volunteer: [
    { key: 'volunteer-name', labelEn: 'Full Name', labelNe: 'पूरा नाम' },
    { key: 'volunteer-phone', labelEn: 'Phone Number', labelNe: 'फोन नम्बर' },
    { key: 'volunteer-email', labelEn: 'Email Address', labelNe: 'इमेल ठेगाना' },
    { key: 'volunteer-address', labelEn: 'Address / Location', labelNe: 'ठेगाना / स्थान' },
    { key: 'volunteer-interests', labelEn: 'Areas of Interest', labelNe: 'रुचिका क्षेत्रहरू' },
    { key: 'volunteer-availability', labelEn: 'Availability', labelNe: 'उपलब्धता' },
    { key: 'volunteer-notes', labelEn: 'Notes / Motivation', labelNe: 'कैफियत / प्रेरणा' },
  ],
  donation: [
    { key: 'donation-name', labelEn: 'Donor Full Name', labelNe: 'दाताको पूरा नाम' },
    { key: 'donation-phone', labelEn: 'Donor Phone / Mobile', labelNe: 'दाताको फोन / मोबाइल' },
    { key: 'donation-email', labelEn: 'Donor Email Address', labelNe: 'दाताको इमेल ठेगाना' },
    { key: 'donation-address', labelEn: 'Donor Address / District', labelNe: 'दाताको ठेगाना / जिल्ला' },
    { key: 'donation-cause', labelEn: 'Target Cause / Dedicated Fund', labelNe: 'दानको उद्देश्य / कोष' },
    { key: 'donation-pan', labelEn: 'PAN / Citizenship No (Optional)', labelNe: 'स्थायी लेखा नं / नागरिकता' },
    { key: 'donation-presets', labelEn: 'Preset Amount Buttons (NPR)', labelNe: 'पूर्वनिर्धारित रकम बटनहरू' },
    { key: 'donation-custom-amount', labelEn: 'Custom Amount Input', labelNe: 'इच्छित रकम प्रविष्टि' },
    { key: 'donation-bank-info', labelEn: 'Bank Wire & QR Info Box', labelNe: 'बैंक तथा क्युआर जानकारी' },
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
  defaultOpen = false,
}: AdminFormFieldEditorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [fields, setFields] = useState<CustomFormField[]>(() => getCustomFormFields(formId));
  const [hiddenFields, setHiddenFields] = useState<string[]>(() => getHiddenStandardFields());

  useEffect(() => {
    setFields(getCustomFormFields(formId));
    setHiddenFields(getHiddenStandardFields());
  }, [formId]);

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
    setIsOpen(true);
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

  const activeStandardList = standardFieldsMap[formId] || [];

  return (
    <div className="my-4 p-4 sm:p-5 bg-teal-50/90 dark:bg-slate-900/90 border-2 border-dashed border-teal-300 dark:border-teal-700/60 rounded-2xl shadow-sm text-slate-900 dark:text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-teal-950 dark:text-teal-200">
          <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === 'en' ? 'Form Field & Custom Questions Manager' : 'फारम क्षेत्र तथा थप प्रश्न सम्पादक'}</span>
          <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-extrabold shadow-sm">
            {fields.length} {lang === 'en' ? 'Custom' : 'थप'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
            isOpen 
              ? 'bg-slate-800 hover:bg-slate-700 text-white' 
              : 'bg-emerald-500 hover:bg-emerald-400 text-teal-950'
          }`}
        >
          {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isOpen ? (lang === 'en' ? 'Close Field Editor' : 'सम्पादक बन्द गर्नुहोस्') : (lang === 'en' ? 'Manage & Edit Form Fields' : 'फारम क्षेत्रहरू सम्पादन गर्नुहोस्')}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-teal-200 dark:border-slate-800 space-y-5 text-xs animate-in fade-in duration-200">
          {/* Toggle Default/Standard Fields */}
          {activeStandardList.length > 0 && (
            <div className="space-y-3 p-4 bg-white dark:bg-slate-950 border border-teal-200 dark:border-slate-800 rounded-2xl shadow-inner">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-teal-950 dark:text-teal-200 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                  <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{lang === 'en' ? 'Standard Form Fields (Show / Hide / Delete from View)' : 'डिफल्ट फारम क्षेत्रहरू (देखाउनुहोस् / हटाउनुहोस्)'}</span>
                </h5>
                <span className="text-[10px] text-slate-500 font-medium">
                  {lang === 'en' ? 'Check = Active | Uncheck = Hidden' : 'चेक = सक्रिय | अनचेक = लुकाइएको'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'en' 
                  ? 'Uncheck any field below to immediately remove it from the public form view. Checked fields remain active.' 
                  : 'सार्वजनिक फारमबाट हटाउन कुनै पनि क्षेत्र अनचेक गर्नुहोस्। चेक गरिएका क्षेत्रहरू फारममा सक्रिय रहनेछन्।'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                {activeStandardList.map(sf => {
                  const isVisible = !hiddenFields.includes(sf.key);
                  return (
                    <label 
                      key={sf.key} 
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                        isVisible
                          ? 'bg-teal-50/70 dark:bg-teal-950/30 border-teal-300 dark:border-teal-800/60 text-teal-950 dark:text-teal-100 font-bold shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-70 line-through'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => {
                          const updated = toggleHiddenStandardField(sf.key);
                          setHiddenFields(updated);
                          if (onFieldsUpdated) onFieldsUpdated();
                        }}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                      />
                      <span className="truncate text-xs">
                        {lang === 'en' ? sf.labelEn : sf.labelNe}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Existing Custom Fields List */}
          {fields.length > 0 && (
            <div className="space-y-2.5 p-4 bg-white dark:bg-slate-950 border border-teal-200 dark:border-slate-800 rounded-2xl">
              <h5 className="font-extrabold text-teal-950 dark:text-teal-200 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{lang === 'en' ? 'Active Custom Questions / Fields' : 'सक्रिय थप प्रश्नहरू / क्षेत्रहरू'} ({fields.length}):</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {fields.map(f => (
                  <div key={f.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm">
                    <div className="min-w-0">
                      <p className="font-black text-slate-900 dark:text-white truncate text-xs">
                        {f.label[lang] || f.label.en}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Type: <span className="font-bold text-teal-600 dark:text-teal-400">{f.fieldType}</span> {f.required ? '• Required' : '• Optional'}
                      </p>
                      {f.options && f.options.length > 0 && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          Options: {f.options.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(f)}
                        className="p-2 bg-teal-100 hover:bg-teal-200 text-teal-900 dark:bg-slate-800 dark:text-teal-300 rounded-xl transition-colors cursor-pointer"
                        title="Edit question details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(f.id)}
                        className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl transition-colors cursor-pointer"
                        title="Delete question permanently"
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
          <form onSubmit={handleSaveField} className="bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/50 dark:border-emerald-500/30 space-y-4 shadow-sm">
            <div className="flex items-center justify-between font-black text-teal-950 dark:text-teal-200">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide">
                <FileQuestion className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {editingFieldId
                    ? (lang === 'en' ? 'Edit Existing Question / Field' : 'प्रश्न सम्पादन गर्नुहोस्')
                    : (lang === 'en' ? '➕ Add New Custom Question to Form' : '➕ फारममा नयाँ प्रश्न थप्नुहोस्')}
                </span>
              </div>
              {editingFieldId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-rose-600 hover:underline font-extrabold cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Question Label (English) *
                </label>
                <input
                  type="text"
                  required
                  value={labelEn}
                  onChange={e => setLabelEn(e.target.value)}
                  placeholder="e.g. In Honor / Memory Of, Dedicated Purpose..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Question Label (Nepali)
                </label>
                <input
                  type="text"
                  value={labelNe}
                  onChange={e => setLabelNe(e.target.value)}
                  placeholder="उदा. कसैको स्मृतिमा / विशेष उद्देश्य..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Input Field Type
                </label>
                <select
                  value={fieldType}
                  onChange={e => setFieldType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
                >
                  <option value="text">Short Text (Single Line)</option>
                  <option value="textarea">Paragraph / Multi-line Text</option>
                  <option value="number">Numeric Number</option>
                  <option value="select">Dropdown Selection Menu</option>
                  <option value="radio">Radio Buttons (Choose 1)</option>
                  <option value="multiselect">Multi-select Checkbox List</option>
                  <option value="checkbox">Single Yes/No Checkbox</option>
                  <option value="date">Date Picker</option>
                  <option value="email">Email Address</option>
                  <option value="phone">Phone / Mobile</option>
                  <option value="file">File / Receipt Image Upload</option>
                  <option value="url">Website / Social URL</option>
                </select>
              </div>

              {(fieldType === 'select' || fieldType === 'radio' || fieldType === 'multiselect') && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Options (comma-separated values) *
                  </label>
                  <input
                    type="text"
                    required
                    value={optionsStr}
                    onChange={e => setOptionsStr(e.target.value)}
                    placeholder="Option 1, Option 2, Option 3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={required}
                  onChange={e => setRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  {lang === 'en' ? 'Mandatory / Required Field' : 'अनिवार्य क्षेत्र'}
                </span>
              </label>

              <div className="flex items-center gap-2">
                {editingFieldId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider"
                >
                  <Check className="w-4 h-4" />
                  {editingFieldId
                    ? (lang === 'en' ? 'Update Field' : 'अद्यावधिक गर्नुहोस्')
                    : (lang === 'en' ? 'Save New Field' : 'नयाँ क्षेत्र बचत गर्नुहोस्')}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

