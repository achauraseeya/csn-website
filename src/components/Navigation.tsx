import { useState } from 'react';
import { Menu, X, Globe, Leaf } from 'lucide-react';
import { Language } from '../types';
import logoImg from '../assets/images/chaurasiya_logo_1784519579895.jpg';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onTrackAction: (actionName: string) => void;
}

export default function Navigation({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  onTrackAction,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'history', label: { en: 'Our Heritage', ne: 'हाम्रो सम्पदा' } },
    { id: 'albums-gallery', label: { en: 'Journey Albums', ne: 'यात्रा एल्बमहरू' } },
    { id: 'notices-gallery', label: { en: 'Notices & Gallery', ne: 'सूचना र ग्यालरी' } },
    { id: 'directory', label: { en: 'Members Directory', ne: 'सदस्य निर्देशिका' } },
    { id: 'events', label: { en: 'Events & Calendar', ne: 'कार्यक्रम र पात्रो' } },
    { id: 'membership-donation', label: { en: 'Join & Support', ne: 'सहभागिता र सहयोग' } },
    { id: 'blogger-exporter', label: { en: 'Blogger Exporter', ne: 'ब्लगर एक्सपोर्टर' } },
    { id: 'analytics', label: { en: 'Analytics', ne: 'एनालिटिक्स' } },
  ];

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
    onTrackAction(`Navigate to ${tabId}`);
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ne' : 'en';
    setLang(nextLang);
    onTrackAction(`Toggle language to ${nextLang.toUpperCase()}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-sm" id="nav-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleTabChange('history')}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center border border-teal-100 shadow-sm transition-all group-hover:scale-105">
                <img src={logoImg} alt="Chaurasiya Samaj Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-teal-900 leading-tight">
                  Chaurasiya Samaj
                </h1>
                <p className="text-[11px] font-bold text-teal-600 tracking-wider">
                  Nepal • चौरसिया समाज नेपाल
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`px-3 py-2 text-xs font-bold tracking-wide rounded-lg uppercase transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-teal-900 hover:bg-teal-50 hover:text-teal-700'
                  }`}
                >
                  {item.label[lang]}
                </button>
              );
            })}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="ml-4 flex items-center gap-1 px-3 py-2 text-xs font-bold bg-teal-50 text-teal-800 rounded-lg border border-teal-200 hover:bg-teal-100 transition-all uppercase"
              title="Switch Language / भाषा परिवर्तन गर्नुहोस्"
            >
              <Globe className="w-4 h-4 text-teal-600" />
              <span>{lang === 'en' ? 'नेपाली' : 'English'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleLanguage}
              className="mr-2 flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-teal-50 text-teal-800 rounded-lg border border-teal-200"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'ने' : 'EN'}</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-teal-900 hover:bg-teal-50 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-teal-100 py-3 px-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-teal-900 hover:bg-teal-50'
                  }`}
                >
                  {item.label[lang]}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
