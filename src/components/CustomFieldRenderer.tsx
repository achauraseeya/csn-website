import React from 'react';
import { Language } from '../types';
import { CustomFormField } from '../utils/customFormFields';

interface CustomFieldRendererProps {
  field: CustomFormField;
  value: string;
  onChange: (val: string) => void;
  lang: Language;
  theme?: 'light' | 'dark';
}

export function CustomFieldRenderer({
  field,
  value,
  onChange,
  lang,
  theme = 'light',
}: CustomFieldRendererProps) {
  const isDark = theme === 'dark';

  const labelClasses = isDark
    ? "block text-xs font-bold text-teal-300 mb-1"
    : "block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1";

  const inputClasses = isDark
    ? "w-full p-3 bg-teal-900/60 border border-teal-800 text-sm text-white rounded-xl focus:outline-none focus:border-emerald-400"
    : "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50";

  const checkboxLabelClasses = isDark
    ? "text-sm text-teal-100 cursor-pointer"
    : "text-sm text-slate-700 dark:text-slate-300 cursor-pointer";

  const radioLabelClasses = isDark
    ? "text-sm text-teal-200"
    : "text-sm text-slate-700 dark:text-slate-300";

  switch (field.fieldType) {
    case 'textarea':
      return (
        <div className="w-full">
          <label className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </label>
          <textarea
            required={field.required}
            rows={2}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          />
        </div>
      );

    case 'select':
      return (
        <div className="w-full">
          <label className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </label>
          <select
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClasses} font-semibold`}
          >
            <option value="" className={isDark ? "bg-teal-950" : "bg-white"}>
              {lang === 'en' ? 'Select option...' : 'विकल्प चयन गर्नुहोस्...'}
            </option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt} className={isDark ? "bg-teal-950" : "bg-white"}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case 'checkbox':
      return (
        <div className="w-full flex items-center gap-2.5 pt-2">
          <input
            id={field.id}
            type="checkbox"
            checked={value === 'Yes'}
            onChange={(e) => onChange(e.target.checked ? 'Yes' : 'No')}
            required={field.required && value !== 'Yes'}
            className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500/50"
          />
          <label htmlFor={field.id} className={`${checkboxLabelClasses} font-semibold`}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </label>
        </div>
      );

    case 'date':
      return (
        <div className="w-full">
          <label className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </label>
          <input
            type="date"
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          />
        </div>
      );

    case 'email':
      return (
        <div className="w-full">
          <label className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </label>
          <input
            type="email"
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="example@domain.com"
            className={inputClasses}
          />
        </div>
      );

    case 'phone':
      return (
        <div className="w-full">
          <label className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </label>
          <input
            type="tel"
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="+977-XXXXXXXXXX"
            className={inputClasses}
          />
        </div>
      );

    case 'radio': {
      const opts = field.options && field.options.length > 0 ? field.options : ['Yes', 'No'];
      return (
        <div className="w-full space-y-1.5">
          <span className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </span>
          <div className="flex flex-wrap gap-4 pt-1">
            {opts.map((opt, i) => {
              const radioId = `${field.id}-${i}`;
              return (
                <label key={opt} htmlFor={radioId} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    id={radioId}
                    type="radio"
                    name={field.id}
                    required={field.required && !value}
                    checked={value === opt}
                    onChange={() => onChange(opt)}
                    className="text-teal-600 focus:ring-teal-500/50"
                  />
                  <span className={`${radioLabelClasses} font-semibold`}>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      );
    }

    case 'file':
      return (
        <div className="w-full">
          <label className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </label>
          <input
            type="file"
            required={field.required && !value}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  onChange(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className={inputClasses}
          />
          {value && value.startsWith('data:') && (
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 truncate">
              ✓ File loaded (ready to send)
            </div>
          )}
        </div>
      );

    case 'time':
      return (
        <div className="w-full">
          <label className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </label>
          <input
            type="time"
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          />
        </div>
      );

    case 'url':
      return (
        <div className="w-full">
          <label className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </label>
          <input
            type="url"
            required={field.required}
            value={value}
            placeholder="https://example.com"
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          />
        </div>
      );

    case 'password':
      return (
        <div className="w-full">
          <label className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </label>
          <input
            type="password"
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          />
        </div>
      );

    case 'multiselect': {
      const opts = field.options && field.options.length > 0 ? field.options : ['Option A', 'Option B'];
      const selectedList = value ? value.split(', ') : [];
      const handleToggle = (opt: string) => {
        let newList: string[];
        if (selectedList.includes(opt)) {
          newList = selectedList.filter(o => o !== opt);
        } else {
          newList = [...selectedList, opt];
        }
        onChange(newList.join(', '));
      };
      return (
        <div className="w-full space-y-1.5">
          <span className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </span>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {opts.map((opt, i) => {
              const chkId = `${field.id}-multichk-${i}`;
              const isChecked = selectedList.includes(opt);
              return (
                <label key={opt} htmlFor={chkId} className="flex items-center gap-2 cursor-pointer p-2 bg-slate-100/50 dark:bg-slate-800/40 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                  <input
                    id={chkId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(opt)}
                    className="rounded text-teal-600 focus:ring-teal-500/50"
                  />
                  <span className={`${radioLabelClasses} font-semibold truncate`}>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      );
    }

    default: // 'text' or 'number'
      return (
        <div className="w-full">
          <label className={labelClasses}>
            {field.label[lang] || field.label.en} {field.required && '*'}
          </label>
          <input
            type={field.fieldType === 'number' ? 'number' : 'text'}
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClasses}
          />
        </div>
      );
  }
}
