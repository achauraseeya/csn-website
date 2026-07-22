import React, { useState } from 'react';
import { X, FileText, Calendar, Link2, Sparkles, CheckCircle2, ShieldCheck, Globe } from 'lucide-react';
import { Language, Notice } from '../types';
import { extractGoogleDriveId } from '../utils/mediaUrl';

interface AddNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddNotice: (notice: Notice) => void;
}

export default function AddNoticeModal({
  isOpen,
  onClose,
  lang,
  onAddNotice,
}: AddNoticeModalProps) {
  const [titleEn, setTitleEn] = useState('');
  const [titleNe, setTitleNe] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentNe, setContentNe] = useState('');
  const [category, setCategory] = useState<'notice' | 'work' | 'press'>('notice');
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().split('T')[0]);
  const [driveFileUrl, setDriveFileUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() && !titleNe.trim()) {
      alert(lang === 'en' ? 'Please enter a title for the notice.' : 'कृपया सूचनाको शीर्षक राख्नुहोस्।');
      return;
    }

    const finalTitleEn = titleEn.trim() || titleNe.trim();
    const finalTitleNe = titleNe.trim() || titleEn.trim();
    const finalContentEn = contentEn.trim() || contentNe.trim();
    const finalContentNe = contentNe.trim() || contentEn.trim();

    const newNotice: Notice = {
      id: `notice-${Date.now()}`,
      title: { en: finalTitleEn, ne: finalTitleNe },
      content: { en: finalContentEn, ne: finalContentNe },
      category,
      date: dateStr || new Date().toISOString().split('T')[0],
      driveFileUrl: driveFileUrl.trim() || undefined,
    };

    onAddNotice(newNotice);

    // Reset fields
    setTitleEn('');
    setTitleNe('');
    setContentEn('');
    setContentNe('');
    setCategory('notice');
    setDriveFileUrl('');

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden border border-teal-100 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-teal-50 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-900 text-teal-300 flex items-center justify-center shadow-inner">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-teal-950">
                {lang === 'en' ? 'Add Community Notice (Admin Only)' : 'समुदाय सूचना थप्नुहोस् (प्रशासक)'}
              </h3>
              <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">
                Official Chaurasiya Bulletin & Document Publishing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-teal-950 rounded-full hover:bg-teal-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-teal-950 mb-1">
                {lang === 'en' ? 'Notice Category' : 'सूचना विधा'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-teal-50/50 border border-teal-200 rounded-xl text-xs font-bold text-teal-950 focus:outline-none focus:border-teal-600"
              >
                <option value="notice">📌 Bulletin / Notice (सूचना)</option>
                <option value="work">🌱 Current Work (सञ्चालित कार्यहरू)</option>
                <option value="press">📰 Press Release (प्रेस विज्ञप्ति)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-950 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>{lang === 'en' ? 'Publishing Date' : 'प्रकाशन मिति'}</span>
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-teal-50/50 border border-teal-200 rounded-xl text-xs font-semibold text-teal-950 focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Title Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-teal-950 mb-1">
                {lang === 'en' ? 'Notice Title (English)' : 'सूचना शीर्षक (अंग्रेजी)'}
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Free Health Camp Announcement 2026"
                className="w-full px-3.5 py-2.5 bg-white border border-teal-200 rounded-xl text-xs font-semibold text-teal-950 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-950 mb-1">
                {lang === 'en' ? 'Notice Title (Nepali)' : 'सूचना शीर्षक (नेपाली)'}
              </label>
              <input
                type="text"
                value={titleNe}
                onChange={(e) => setTitleNe(e.target.value)}
                placeholder="उदा. निःशुल्क स्वास्थ्य शिविर सम्बन्धी सूचना"
                className="w-full px-3.5 py-2.5 bg-white border border-teal-200 rounded-xl text-xs font-semibold text-teal-950 focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Description Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-teal-950 mb-1">
                {lang === 'en' ? 'Content Details (English)' : 'सूचना विवरण (अंग्रेजी)'}
              </label>
              <textarea
                rows={3}
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                placeholder="Detailed information regarding the community notice..."
                className="w-full p-3 bg-white border border-teal-200 rounded-xl text-xs font-medium text-teal-950 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-950 mb-1">
                {lang === 'en' ? 'Content Details (Nepali)' : 'सूचना विवरण (नेपाली)'}
              </label>
              <textarea
                rows={3}
                value={contentNe}
                onChange={(e) => setContentNe(e.target.value)}
                placeholder="सामुदायिक सूचनाको विस्तृत जानकारी..."
                className="w-full p-3 bg-white border border-teal-200 rounded-xl text-xs font-medium text-teal-950 focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Google Drive Document Link Section */}
          <div className="bg-emerald-500/10 p-4 rounded-2xl border-2 border-emerald-500/40 space-y-2">
            <label className="block text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'en' ? 'Google Drive Attachment File Link' : 'गुगल ड्राइभ फाइल/कागजात लिङ्क'}</span>
            </label>

            <p className="text-[11px] text-emerald-900 font-medium leading-relaxed">
              {lang === 'en'
                ? 'Attach a Google Drive share link for notice PDF/documents. Visitors can view and download the official document directly from the website!'
                : 'सूचनाको PDF/कागजातको लागि गुगल ड्राइभ सेयर लिङ्क राख्नुहोस्। आगन्तुकहरूले आधिकारिक कागजात वेबसाइटबाट सिधै हेर्न वा डाउनलोड गर्न सक्नेछन्!'}
            </p>

            <input
              type="url"
              value={driveFileUrl}
              onChange={(e) => setDriveFileUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/1A2B3C4D5E.../view?usp=sharing"
              className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-950 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 shadow-sm"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {lang === 'en' ? 'Cancel' : 'रद्द गर्नुहोस्'}
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'en' ? 'Publish Notice Online' : 'सूचना अनलाइन प्रकाशित गर्नुहोस्'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
