import React, { useState, useEffect } from 'react';
import { X, Sparkles, Facebook, Twitter, Instagram, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Language, SiteTexts } from '../types';

interface EditFooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  siteTexts: SiteTexts;
  onUpdateSiteTexts: (texts: Partial<SiteTexts>) => Promise<void>;
}

export default function EditFooterModal({
  isOpen,
  onClose,
  lang,
  siteTexts,
  onUpdateSiteTexts,
}: EditFooterModalProps) {
  const [activeTab, setActiveTab] = useState<'branding' | 'socials' | 'contact'>('branding');

  // Input States
  const [taglineEn, setTaglineEn] = useState('');
  const [taglineNe, setTaglineNe] = useState('');
  const [footerAboutEn, setFooterAboutEn] = useState('');
  const [footerAboutNe, setFooterAboutNe] = useState('');
  const [socialFb, setSocialFb] = useState('');
  const [socialTw, setSocialTw] = useState('');
  const [socialIg, setSocialIg] = useState('');
  const [footerAddressEn, setFooterAddressEn] = useState('');
  const [footerAddressNe, setFooterAddressNe] = useState('');
  const [footerPhone, setFooterPhone] = useState('');
  const [footerEmail, setFooterEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when opened
  useEffect(() => {
    if (isOpen) {
      setTaglineEn(siteTexts.taglineEn || '');
      setTaglineNe(siteTexts.taglineNe || '');
      setFooterAboutEn(siteTexts.footerAboutEn || '');
      setFooterAboutNe(siteTexts.footerAboutNe || '');
      setSocialFb(siteTexts.socialFb || '');
      setSocialTw(siteTexts.socialTw || '');
      setSocialIg(siteTexts.socialIg || '');
      setFooterAddressEn(siteTexts.footerAddressEn || '');
      setFooterAddressNe(siteTexts.footerAddressNe || '');
      setFooterPhone(siteTexts.footerPhone || '');
      setFooterEmail(siteTexts.footerEmail || '');
    }
  }, [isOpen, siteTexts]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateSiteTexts({
        taglineEn: taglineEn.trim(),
        taglineNe: taglineNe.trim(),
        footerAboutEn: footerAboutEn.trim(),
        footerAboutNe: footerAboutNe.trim(),
        socialFb: socialFb.trim(),
        socialTw: socialTw.trim(),
        socialIg: socialIg.trim(),
        footerAddressEn: footerAddressEn.trim(),
        footerAddressNe: footerAddressNe.trim(),
        footerPhone: footerPhone.trim(),
        footerEmail: footerEmail.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <section className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-teal-100 dark:border-slate-800 shadow-2xl flex flex-col my-8 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-teal-50 dark:border-slate-800 shrink-0 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-900 text-teal-300 flex items-center justify-center shadow-inner">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-teal-950 dark:text-teal-50">
                {lang === 'en' ? 'Edit Footer & Social Settings' : 'फुटर र सामाजिक मिडिया विवरणहरू'}
              </h3>
              <p className="text-[11px] font-bold text-teal-600 dark:text-emerald-400 uppercase tracking-wider">
                {lang === 'en' ? 'Update global footer branding, socials & contact' : 'वेबसाइटको मुख्य फुटर र सामाजिक संजाल लिङ्कहरू सम्पादन गर्नुहोस्'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-teal-950 dark:hover:text-white rounded-full hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 py-2 bg-teal-50/50 dark:bg-slate-950/50 border-b border-teal-50 dark:border-slate-800 shrink-0 flex gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'branding'
                ? 'bg-teal-900 text-teal-50 shadow-md'
                : 'text-teal-800 dark:text-teal-300 hover:bg-teal-100/50 dark:hover:bg-slate-800'
            }`}
          >
            {lang === 'en' ? 'Branding & About' : 'ब्रान्डिङ र बारेमा'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('socials')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'socials'
                ? 'bg-teal-900 text-teal-50 shadow-md'
                : 'text-teal-800 dark:text-teal-300 hover:bg-teal-100/50 dark:hover:bg-slate-800'
            }`}
          >
            {lang === 'en' ? 'Social Media Links' : 'सामाजिक लिङ्कहरू'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-teal-900 text-teal-50 shadow-md'
                : 'text-teal-800 dark:text-teal-300 hover:bg-teal-100/50 dark:hover:bg-slate-800'
            }`}
          >
            {lang === 'en' ? 'Contact Info' : 'सम्पर्क जानकारी'}
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">
                    Footer Tagline (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={taglineEn}
                    onChange={(e) => setTaglineEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-teal-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">
                    Footer Tagline (Nepali) *
                  </label>
                  <input
                    type="text"
                    required
                    value={taglineNe}
                    onChange={(e) => setTaglineNe(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">
                  Footer About Text (English) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={footerAboutEn}
                  onChange={(e) => setFooterAboutEn(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-medium text-teal-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">
                  Footer About Text (Nepali) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={footerAboutNe}
                  onChange={(e) => setFooterAboutNe(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-medium text-teal-950 dark:text-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'socials' && (
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">
                  <Facebook className="w-3.5 h-3.5 text-blue-600" />
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={socialFb}
                  onChange={(e) => setSocialFb(e.target.value)}
                  placeholder="https://facebook.com/your-samaj"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-teal-950 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">
                  <Twitter className="w-3.5 h-3.5 text-sky-400" />
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  value={socialTw}
                  onChange={(e) => setSocialTw(e.target.value)}
                  placeholder="https://twitter.com/your-samaj"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-teal-950 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={socialIg}
                  onChange={(e) => setSocialIg(e.target.value)}
                  placeholder="https://instagram.com/your-samaj"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-teal-950 dark:text-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    Office Address (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={footerAddressEn}
                    onChange={(e) => setFooterAddressEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-teal-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    Office Address (Nepali) *
                  </label>
                  <input
                    type="text"
                    required
                    value={footerAddressNe}
                    onChange={(e) => setFooterAddressNe(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    Office Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={footerPhone}
                    onChange={(e) => setFooterPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-teal-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">
                    <Mail className="w-3.5 h-3.5 text-emerald-500" />
                    Office Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-teal-950 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800 shrink-0 sticky bottom-0 bg-white dark:bg-slate-900 z-10 pb-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              {lang === 'en' ? 'Cancel' : 'रद्द गर्नुहोस्'}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSaving ? (lang === 'en' ? 'Saving...' : 'बचत हुँदैछ...') : (lang === 'en' ? 'Save Changes' : 'बचत गर्नुहोस्')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
