import React from 'react';
import { X, Map, Globe, CheckCircle2, ArrowUpRight, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onNavigate: (tab: string) => void;
}

export function SitemapModal({ isOpen, onClose, lang, onNavigate }: SitemapModalProps) {
  if (!isOpen) return null;

  const sections = [
    {
      title: lang === 'en' ? 'Main Pages' : 'मुख्य पृष्ठहरू',
      links: [
        { id: 'home', name: lang === 'en' ? 'Homepage' : 'गृहपृष्ठ' },
        { id: 'directory', name: lang === 'en' ? 'Members Directory & Executive Committee' : 'सदस्य निर्देशिका तथा कार्यसमिति' },
        { id: 'matrimonial', name: lang === 'en' ? 'Matrimonial Portal (Groom & Bride)' : 'वैवाहिक जोडी सेवा पोर्टल' },
        { id: 'events', name: lang === 'en' ? 'Community Events & Calendar' : 'कार्यक्रम तथा पात्रो' },
        { id: 'membership-donation', name: lang === 'en' ? 'Join & Support (Membership, Volunteer, Welfare)' : 'सहभागिता (सदस्यता, स्वयंसेवक, कल्याण कोष)' },
        { id: 'abhishek-bio', name: lang === 'en' ? 'Abhishek Kumar Chaurasiya (Executive Profile)' : 'अभिषेक कुमार चौरसिया (कार्यकारी प्रोफाइल)' },
      ],
    },
    {
      title: lang === 'en' ? 'About Chaurasiya Samaj' : 'हाम्रो बारेमा',
      links: [
        { id: 'about-vision', name: lang === 'en' ? 'Vision' : 'दूरदृष्टि' },
        { id: 'about-mission', name: lang === 'en' ? 'Mission & Core Values' : 'लक्ष्य तथा मूल्य मान्यता' },
        { id: 'about-objectives', name: lang === 'en' ? 'Key Objectives' : 'प्रमुख उद्देश्यहरू' },
        { id: 'about-history', name: lang === 'en' ? 'History & Evolution' : 'इतिहास र विकास' },
      ],
    },
    {
      title: lang === 'en' ? 'Culture, Heritage & Transparency' : 'संस्कृति, सम्पदा र पारदर्शिता',
      links: [
        { id: 'our-heritage', name: lang === 'en' ? 'Our Heritage (Paan Tradition & Identity)' : 'हाम्रो सम्पदा (पान परम्परा र पहिचान)' },
        { id: 'albums-gallery', name: lang === 'en' ? 'Journey Albums & Photo Gallery' : 'यात्रा एल्बम तथा तस्बिर ग्यालरी' },
        { id: 'notices-gallery', name: lang === 'en' ? 'Official Notices & Press Releases' : 'सूचना तथा प्रेस विज्ञप्ति' },
        { id: 'transparency', name: lang === 'en' ? 'Audited Reports & Legal Documents' : 'लेखापरीक्षण प्रतिवेदन र कानुनी कागजात' },
        { id: 'privacy', name: lang === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति' },
        { id: 'terms', name: lang === 'en' ? 'Terms of Service' : 'सेवाका सर्तहरू' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-teal-100 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-2xl">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-teal-950 dark:text-teal-100">
                {lang === 'en' ? 'Sitemap & Architecture' : 'सामाग्री नक्सा (Sitemap)'}
              </h3>
              <p className="text-xs text-gray-500 font-semibold">
                {lang === 'en' ? 'Structured view of all pages and crawler endpoints' : 'सबै पृष्ठहरू र सर्च इन्जिन इन्डेक्स नक्सा'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* XML Link for Search Engine Crawlers */}
        <div className="p-4 bg-teal-50 dark:bg-slate-800/80 rounded-2xl border border-teal-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-extrabold text-teal-950 dark:text-teal-100">
                {lang === 'en' ? 'Search Engine XML Sitemap Endpoint' : 'सर्च इन्जिन क्रोलर एक्सएमएल'}
              </p>
              <p className="text-[11px] text-teal-700 dark:text-teal-300 font-mono">
                /sitemap.xml (Googlebot / Bingbot Ready)
              </p>
            </div>
          </div>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1 shrink-0 shadow-sm"
          >
            <span>XML</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Categories Grid */}
        <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-1">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                {sec.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sec.links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigate(link.id);
                      onClose();
                    }}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 rounded-xl text-left text-xs font-bold text-gray-800 dark:text-gray-200 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate">{link.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-teal-900 text-white font-bold rounded-xl text-xs hover:bg-teal-800 cursor-pointer"
          >
            {lang === 'en' ? 'Close Sitemap' : 'नक्सा बन्द गर्नुहोस्'}
          </button>
        </div>
      </div>
    </div>
  );
}
