import React, { useState } from 'react';
import { Settings, Plus, Edit, Trash2, X, Check, Tag } from 'lucide-react';
import { Language } from '../types';
import {
  MemberCategory,
  getMemberCategories,
  saveMemberCategory,
  deleteMemberCategory,
} from '../utils/memberCategories';

interface AdminCategoryManagerProps {
  lang: Language;
  isAdmin: boolean;
  onCategoriesUpdated?: () => void;
}

export function AdminCategoryManagerModal({
  lang,
  isAdmin,
  onCategoriesUpdated,
}: AdminCategoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<MemberCategory[]>(() => getMemberCategories());

  // Form state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [labelEn, setLabelEn] = useState('');
  const [labelNe, setLabelNe] = useState('');
  const [feeInfo, setFeeInfo] = useState('');

  if (!isAdmin) return null;

  const handleStartEdit = (cat: MemberCategory) => {
    setEditingCatId(cat.id);
    setLabelEn(cat.label.en);
    setLabelNe(cat.label.ne);
    setFeeInfo(cat.feeInfo || '');
  };

  const handleResetForm = () => {
    setEditingCatId(null);
    setLabelEn('');
    setLabelNe('');
    setFeeInfo('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelEn.trim()) return;

    const code = labelEn.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const catToSave: MemberCategory = {
      id: editingCatId || `cat-${Date.now()}`,
      code: editingCatId ? (categories.find(c => c.id === editingCatId)?.code || code) : code,
      label: {
        en: labelEn.trim(),
        ne: labelNe.trim() || labelEn.trim(),
      },
      feeInfo: feeInfo.trim() || undefined,
    };

    const updated = saveMemberCategory(catToSave);
    setCategories(updated);
    handleResetForm();
    if (onCategoriesUpdated) onCategoriesUpdated();
  };

  const handleDelete = (id: string) => {
    if (confirm(lang === 'en' ? 'Delete this member category/type?' : 'के तपाईं यो सदस्य प्रकार हटाउन चाहनुहुन्छ?')) {
      const updated = deleteMemberCategory(id);
      setCategories(updated);
      if (onCategoriesUpdated) onCategoriesUpdated();
    }
  };

  return (
    <div className="my-4 p-4 bg-emerald-50/80 dark:bg-slate-800/80 border-2 border-emerald-300 dark:border-slate-700 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-teal-950 dark:text-teal-100 font-extrabold text-xs uppercase tracking-wider">
          <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === 'en' ? 'Manage Member Types & Committee Dropdowns' : 'सदस्य प्रकार र समिति ड्रपडाउन व्यवस्थापन'}</span>
          <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
            {categories.length} {lang === 'en' ? 'Types Active' : 'प्रकारहरू'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          {isOpen ? <X className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
          {isOpen ? (lang === 'en' ? 'Close Manager' : 'प्रबन्धक बन्द गर्नुहोस्') : (lang === 'en' ? 'Edit Committee / Member Types' : 'सदस्य प्रकार सम्पादन गर्नुहोस्')}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-slate-700 space-y-4 text-xs">
          {/* Active Categories Grid */}
          <div className="space-y-2">
            <h5 className="font-bold text-teal-950 dark:text-teal-100 uppercase tracking-wide">
              {lang === 'en' ? 'Active Member Types & Committee Roles' : 'सक्रिय सदस्य प्रकारहरू'}:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {categories.map(c => (
                <div key={c.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white truncate">
                      {c.label[lang] || c.label.en}
                    </p>
                    <p className="text-[10px] text-teal-600 dark:text-emerald-400 font-semibold">
                      Code: <code className="bg-emerald-50 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-800 dark:text-emerald-300">{c.code}</code> {c.feeInfo ? `• Fee: ${c.feeInfo}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(c)}
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form to Add / Edit Category */}
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between font-bold text-teal-900 dark:text-teal-100">
              <span className="flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-500" />
                {editingCatId ? (lang === 'en' ? 'Edit Member Type' : 'सदस्य प्रकार सम्पादन') : (lang === 'en' ? 'Add New Member Type / Committee Role' : 'नयाँ सदस्य प्रकार थप्नुहोस्')}
              </span>
              {editingCatId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-[11px] font-bold text-gray-500 hover:text-gray-700 underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Type Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={labelEn}
                  onChange={e => setLabelEn(e.target.value)}
                  placeholder="e.g. Life Member or Executive Leader"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Type Name (Nepali)
                </label>
                <input
                  type="text"
                  value={labelNe}
                  onChange={e => setLabelNe(e.target.value)}
                  placeholder="उदा. आजीवन सदस्य"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Membership Fee (Optional)
                </label>
                <input
                  type="text"
                  value={feeInfo}
                  onChange={e => setFeeInfo(e.target.value)}
                  placeholder="e.g. NPR 11,000"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{editingCatId ? (lang === 'en' ? 'Update Category' : 'अद्यावधिक गर्नुहोस्') : (lang === 'en' ? 'Save Member Type' : 'प्रकार सुरक्षित गर्नुहोस्')}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
