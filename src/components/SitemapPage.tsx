import React from 'react';
import { Map, Globe, ArrowUpRight, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface SitemapPageProps {
  lang: Language;
  onNavigate: (tab: string) => void;
}

export default function SitemapPage({ lang, onNavigate }: SitemapPageProps) {
  const sections = [
    {
      title: lang === 'en' ? 'Main Platform Pages' : 'मुख्य प्लेटफर्म पृष्ठहरू',
      desc: lang === 'en' ? 'Primary navigation portals for community members' : 'सामुदायिक सदस्यहरूको लागि मुख्य पोर्टलहरू',
      links: [
        { id: 'home', name: lang === 'en' ? 'Homepage & Live Feed' : 'गृहपृष्ठ तथा ताजा गतिविधि', path: '/' },
        { id: 'directory', name: lang === 'en' ? 'Members Directory & Executive Committee' : 'सदस्य निर्देशिका तथा कार्यसमिति', path: '/?tab=directory' },
        { id: 'matrimonial', name: lang === 'en' ? 'Matrimonial Portal (Groom & Bride)' : 'वैवाहिक जोडी सेवा पोर्टल', path: '/?tab=matrimonial' },
        { id: 'events', name: lang === 'en' ? 'Community Events & Programs' : 'कार्यक्रम तथा पात्रो', path: '/?tab=events' },
        { id: 'membership-donation', name: lang === 'en' ? 'Join & Support (Membership, Volunteer, Welfare)' : 'सहभागिता (सदस्यता, स्वयंसेवक, कल्याण कोष)', path: '/?tab=membership-donation' },
        { id: 'abhishek-bio', name: lang === 'en' ? 'Abhishek Kumar Chaurasiya (Executive Profile)' : 'अभिषेक कुमार चौरसिया (कार्यकारी प्रोफाइल)', path: '/?page=abhishek' },
      ],
    },
    {
      title: lang === 'en' ? 'About Chaurasiya Samaj' : 'हाम्रो बारेमा',
      desc: lang === 'en' ? 'Mission, vision, core objectives and leadership history' : 'उद्देश्य, दूरदृष्टि, र इतिहास',
      links: [
        { id: 'about-vision', name: lang === 'en' ? 'Vision' : 'दूरदृष्टि', path: '/?tab=about-vision' },
        { id: 'about-mission', name: lang === 'en' ? 'Mission & Core Values' : 'लक्ष्य तथा मूल्य मान्यता', path: '/?tab=about-mission' },
        { id: 'about-objectives', name: lang === 'en' ? 'Key Objectives' : 'प्रमुख उद्देश्यहरू', path: '/?tab=about-objectives' },
        { id: 'about-history', name: lang === 'en' ? 'History & Evolution' : 'इतिहास र विकास', path: '/?tab=about-history' },
      ],
    },
    {
      title: lang === 'en' ? 'Culture, Gallery & Transparency' : 'संस्कृति, ग्यालरी र पारदर्शिता',
      desc: lang === 'en' ? 'Heritage documentation, media archives and audited reports' : 'परम्परा, मिडिया एल्बम र अडिट प्रतिवेदन',
      links: [
        { id: 'our-heritage', name: lang === 'en' ? 'Our Heritage (Paan Tradition & Identity)' : 'हाम्रो सम्पदा (पान परम्परा र पहिचान)', path: '/?tab=our-heritage' },
        { id: 'albums-gallery', name: lang === 'en' ? 'Journey Albums & Photo Gallery' : 'यात्रा एल्बम तथा तस्बिर ग्यालरी', path: '/?tab=albums-gallery' },
        { id: 'notices-gallery', name: lang === 'en' ? 'Official Notices & Press Releases' : 'सूचना तथा प्रेस विज्ञप्ति', path: '/?tab=notices-gallery' },
        { id: 'transparency', name: lang === 'en' ? 'Audited Reports & Legal Documents' : 'लेखापरीक्षण प्रतिवेदन र कानुनी कागजात', path: '/?tab=transparency' },
        { id: 'privacy', name: lang === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति', path: '/?tab=privacy' },
        { id: 'terms', name: lang === 'en' ? 'Terms of Service' : 'सेवाका सर्तहरू', path: '/?tab=terms' },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-teal-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-xs font-extrabold uppercase tracking-wider">
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'en' ? 'Site Architecture & Directory' : 'सामाग्री नक्सा'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            {lang === 'en' ? 'Website Sitemap' : 'वेबसाइट सामाग्री नक्सा'}
          </h1>
          <p className="text-teal-100 text-sm sm:text-base font-normal leading-relaxed">
            {lang === 'en'
              ? 'Comprehensive view of all public pages, community modules, and crawler endpoints for search engines like Googlebot and Bingbot.'
              : 'खोज इन्जिनहरू र प्रयोगकर्ताहरूका लागि सबै पृष्ठहरू र सुविधाहरूको विस्तृत सूची।'}
          </p>
        </div>
      </div>

      {/* XML Feed Endpoint Box */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-bold text-base text-teal-950 dark:text-teal-50 flex items-center gap-2">
              {lang === 'en' ? 'Crawler XML Sitemap Endpoint' : 'एक्सएमएल साइटम्याप एक्सपोर्ट'}
              <span className="inline-block px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold rounded-md">LIVE</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-mono">
              https://csnepal.org/sitemap.xml
            </p>
          </div>
        </div>
        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-teal-800 hover:bg-teal-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          <span>{lang === 'en' ? 'View XML Feed' : 'एक्सएमएल हेर्नुहोस्'}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Sitemap Links Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-black text-teal-950 dark:text-teal-100 pb-2 border-b dark:border-slate-800">
                {sec.title}
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                {sec.desc}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {sec.links.map((link) => (
                <a
                  key={link.id}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(link.id);
                  }}
                  className="p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl text-left text-xs font-medium text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate pr-2">{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
