import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Edit, Save, X, Sparkles } from 'lucide-react';
import { Language, SiteTexts } from '../types';

interface PrivacySectionProps {
  lang: Language;
  isAdmin: boolean;
  siteTexts: SiteTexts;
  onUpdateSiteTexts: (texts: Partial<SiteTexts>) => Promise<void>;
  onTrackAction: (actionName: string) => void;
}

export default function PrivacySection({
  lang,
  isAdmin,
  siteTexts,
  onUpdateSiteTexts,
  onTrackAction,
}: PrivacySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [privacyEn, setPrivacyEn] = useState(siteTexts.privacyEn);
  const [privacyNe, setPrivacyNe] = useState(siteTexts.privacyNe);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if prop changes
  useEffect(() => {
    setPrivacyEn(siteTexts.privacyEn);
    setPrivacyNe(siteTexts.privacyNe);
  }, [siteTexts]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateSiteTexts({
        privacyEn,
        privacyNe,
      });
      setSaveSuccess(true);
      setIsEditing(false);
      onTrackAction('Save Privacy Policy via Admin');
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
          <Shield className="w-48 h-48" />
        </div>
        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-400/10 border border-teal-300/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {lang === 'en' ? 'Data Security & Trust' : 'डाटा सुरक्षा र विश्वास'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {lang === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
          </h1>
          <p className="text-teal-100 text-sm sm:text-base max-w-2xl font-light">
            {lang === 'en'
              ? 'Learn how Chaurasiya Samaj Nepal protects, manages, and respects your personal details and directory listings.'
              : 'चौरसिया समाज नेपालले तपाईंको व्यक्तिगत विवरण र निर्देशिका सूचीहरूलाई कसरी सुरक्षित, व्यवस्थापन र सम्मान गर्छ भन्ने बारे जान्नुहोस्।'}
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
                    {isSaving ? 'Saving...' : 'Save Privacy Policy'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setPrivacyEn(siteTexts.privacyEn);
                      setPrivacyNe(siteTexts.privacyNe);
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
                  Edit Privacy Policy
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
            <h2 className="text-lg font-bold text-teal-950 dark:text-teal-50">Edit Privacy Policy Content</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update English and Nepali versions. Changes sync instantly to database.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-black text-teal-950 dark:text-teal-300 uppercase tracking-wider block">Privacy Policy (English)</label>
              <textarea
                value={privacyEn}
                onChange={(e) => setPrivacyEn(e.target.value)}
                rows={12}
                className="w-full p-3 bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 border border-teal-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-teal-950 dark:text-teal-300 uppercase tracking-wider block">Privacy Policy (Nepali)</label>
              <textarea
                value={privacyNe}
                onChange={(e) => setPrivacyNe(e.target.value)}
                rows={12}
                className="w-full p-3 bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 border border-teal-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-teal-950 dark:text-teal-50 flex items-center gap-2 border-b border-teal-50 dark:border-slate-800 pb-4">
            <Shield className="w-6 h-6 text-emerald-600" />
            {lang === 'en' ? 'Information We Collect & Safeguard' : 'हामीले संकलन र संरक्षण गर्ने जानकारी'}
          </h2>
          <div className="text-gray-700 dark:text-gray-300 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {lang === 'en' ? privacyEn : privacyNe}
          </div>
        </section>
      )}
    </div>
  );
}
