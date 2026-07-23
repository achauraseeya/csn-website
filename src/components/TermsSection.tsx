import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Edit, Save, X, Sparkles } from 'lucide-react';
import { Language, SiteTexts } from '../types';

interface TermsSectionProps {
  lang: Language;
  isAdmin: boolean;
  siteTexts: SiteTexts;
  onUpdateSiteTexts: (texts: Partial<SiteTexts>) => Promise<void>;
  onTrackAction: (actionName: string) => void;
}

export default function TermsSection({
  lang,
  isAdmin,
  siteTexts,
  onUpdateSiteTexts,
  onTrackAction,
}: TermsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [termsEn, setTermsEn] = useState(siteTexts.termsEn);
  const [termsNe, setTermsNe] = useState(siteTexts.termsNe);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if prop changes
  useEffect(() => {
    setTermsEn(siteTexts.termsEn);
    setTermsNe(siteTexts.termsNe);
  }, [siteTexts]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateSiteTexts({
        termsEn,
        termsNe,
      });
      setSaveSuccess(true);
      setIsEditing(false);
      onTrackAction('Save Terms of Service via Admin');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-teal-900 to-emerald-900 dark:from-teal-950 dark:to-emerald-950 text-white p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <FileText className="w-48 h-48" />
        </div>
        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-400/10 border border-teal-300/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {lang === 'en' ? 'Community Rules & Guidelines' : 'समुदाय नियम र दिशानिर्देशहरू'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {lang === 'en' ? 'Terms of Service' : 'सेवाका सर्तहरू'}
          </h1>
          <p className="text-teal-100 text-sm sm:text-base max-w-2xl font-light">
            {lang === 'en'
              ? 'Read the mutual rules, directory guidelines, and platform expectations for Chaurasiya Samaj Nepal.'
              : 'चौरसिया समाज नेपालका लागि साझा नियमहरू, निर्देशिका दिशानिर्देशहरू, र प्लेटफर्म अपेक्षाहरू पढ्नुहोस्।'}
          </p>

          {isAdmin && (
            <div className="pt-4 flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-teal-950 text-xs font-extrabold rounded-xl uppercase transition-all shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Terms'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setTermsEn(siteTexts.termsEn);
                      setTermsNe(siteTexts.termsNe);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-xl uppercase transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-teal-900 hover:bg-teal-50 text-xs font-extrabold rounded-xl uppercase transition-all shadow-md cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  Edit Terms of Service
                </button>
              )}

              {saveSuccess && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                  <CheckCircle className="w-4 h-4" /> Saved Successfully!
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {isEditing ? (
        <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-md space-y-6">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-teal-950 dark:text-teal-50">Edit Terms of Service Content</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update English and Nepali versions. Changes sync instantly to database.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-black text-teal-950 dark:text-teal-300 uppercase tracking-wider block">Terms of Service (English)</label>
              <textarea
                value={termsEn}
                onChange={(e) => setTermsEn(e.target.value)}
                rows={12}
                className="w-full p-3 bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 border border-teal-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-teal-950 dark:text-teal-300 uppercase tracking-wider block">Terms of Service (Nepali)</label>
              <textarea
                value={termsNe}
                onChange={(e) => setTermsNe(e.target.value)}
                rows={12}
                className="w-full p-3 bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 border border-teal-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-teal-950 dark:text-teal-50 flex items-center gap-2 border-b border-teal-50 dark:border-slate-800 pb-4">
            <FileText className="w-6 h-6 text-emerald-600" />
            {lang === 'en' ? 'Rules of Platform Interaction' : 'प्लेटफर्म अन्तरक्रियाका नियमहरू'}
          </h2>
          <div className="text-gray-700 dark:text-gray-300 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {lang === 'en' ? termsEn : termsNe}
          </div>
        </section>
      )}
    </div>
  );
}
