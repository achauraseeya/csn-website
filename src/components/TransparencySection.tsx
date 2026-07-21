import React from 'react';
import { Download, FileText, ShieldCheck, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { documents } from '../data/communityData';

interface TransparencySectionProps {
  lang: Language;
  onTrackAction: (actionName: string) => void;
}

export default function TransparencySection({ lang, onTrackAction }: TransparencySectionProps) {
  const t = {
    title: { en: 'Transparency & Downloads', ne: 'पारदर्शिता र डाउनलोडहरू' },
    sub: { 
      en: 'We believe in complete transparency. Access our financial audits, registration certificates, and organizational policies below.', 
      ne: 'हामी पूर्ण पारदर्शितामा विश्वास गर्छौं। हाम्रा वित्तीय लेखापरीक्षणहरू, दर्ता प्रमाणपत्रहरू, र संगठनात्मक नीतिहरू तल पहुँच गर्नुहोस्।' 
    },
    download: { en: 'Download', ne: 'डाउनलोड गर्नुहोस्' },
    certifications: { en: 'Our Certifications', ne: 'हाम्रा प्रमाणपत्रहरू' },
    documents: { en: 'Public Documents', ne: 'सार्वजनिक कागजातहरू' }
  };

  const certifications = [
    { title: { en: 'Registered NGO', ne: 'दर्ता भएको NGO' }, authority: { en: 'District Administration Office, Parsa', ne: 'जिल्ला प्रशासन कार्यालय, पर्सा' } },
    { title: { en: 'SWC Affiliated', ne: 'समाज कल्याण परिषद् आबद्ध' }, authority: { en: 'Social Welfare Council Nepal', ne: 'समाज कल्याण परिषद् नेपाल' } },
    { title: { en: 'Tax Cleared', ne: 'कर चुक्ता' }, authority: { en: 'Inland Revenue Department', ne: 'आन्तरिक राजस्व विभाग' } }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-500 pb-20">
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-8">
        <div className="inline-flex items-center justify-center p-4 bg-teal-50 rounded-full mb-4">
          <ShieldCheck className="w-12 h-12 text-teal-600" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {t.title[lang]}
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          {t.sub[lang]}
        </p>
      </section>

      {/* Certifications Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certifications.map((cert, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{cert.title[lang]}</h3>
              <p className="text-sm text-gray-500">{cert.authority[lang]}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Documents List */}
      <section className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{t.documents[lang]}</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={lang === 'en' ? 'Search documents...' : 'कागजातहरू खोज्नुहोस्...'} 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64"
            />
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {documents.map((doc) => (
            <div key={doc.id} className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{doc.title[lang]}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="px-2.5 py-0.5 bg-gray-100 rounded-full font-medium">{doc.category[lang]}</span>
                    <span>• {doc.year}</span>
                    <span>• {doc.type}</span>
                    <span>• {doc.size}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onTrackAction(`Downloaded ${doc.title.en}`)}
                className="w-full sm:w-auto px-6 py-3 bg-white border border-teal-200 text-teal-700 font-bold rounded-xl hover:bg-teal-50 hover:border-teal-300 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t.download[lang]}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
