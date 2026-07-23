import { useState } from 'react';
import { Menu, X, Globe, ShieldCheck, Lock, Sun, Moon } from 'lucide-react';
import { Language, SiteTexts } from '../types';
import logoImg from '../assets/images/chaurasiya_logo_1784519579895.jpg';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onTrackAction: (actionName: string) => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  siteTexts: SiteTexts;
}

export default function Navigation({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  onTrackAction,
  isAdmin,
  onOpenAdminModal,
  theme,
  toggleTheme,
  siteTexts,
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

  const logoUrl = siteTexts.logoUrl || logoImg;
  const logoText = lang === 'en' ? siteTexts.logoTextEn : siteTexts.logoTextNe;
  const logoSub = lang === 'en' ? siteTexts.logoSubEn : siteTexts.logoSubNe;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-teal-100 dark:border-slate-800 shadow-sm transition-colors duration-200" id="nav-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleTabChange('history')}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center border border-teal-100 dark:border-slate-800 shadow-sm transition-all group-hover:scale-105">
                <img src={logoUrl} alt="Chaurasiya Samaj Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-teal-900 dark:text-teal-100 leading-tight">
                  {logoText}
                </h1>
                <p className="text-[11px] font-bold text-teal-600 dark:text-emerald-400 tracking-wider">
                  {logoSub}
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
                  className={`px-3 py-2 text-xs font-bold tracking-wide rounded-lg uppercase transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-emerald-400'
                  }`}
                >
                  {item.label[lang]}
                </button>
              );
            })}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="ml-3 flex items-center gap-1 px-3 py-2 text-xs font-bold bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-200 rounded-lg border border-teal-200 dark:border-slate-700 hover:bg-teal-100 dark:hover:bg-slate-700 transition-all uppercase cursor-pointer"
              title="Switch Language / भाषा परिवर्तन गर्नुहोस्"
            >
              <Globe className="w-4 h-4 text-teal-600 dark:text-emerald-400" />
              <span>{lang === 'en' ? 'नेपाली' : 'English'}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-slate-700 hover:bg-teal-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-600" />}
            </button>

            {/* Admin Login Button */}
            <button
              onClick={onOpenAdminModal}
              className={`ml-2 flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold rounded-lg border transition-all uppercase shadow-sm cursor-pointer ${
                isAdmin
                  ? 'bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-800'
                  : 'bg-teal-900 dark:bg-slate-950 text-teal-100 border-teal-800 dark:border-slate-900 hover:bg-teal-950 dark:hover:bg-black'
              }`}
              title={isAdmin ? 'Admin Active' : 'Admin Login'}
            >
              {isAdmin ? <ShieldCheck className="w-4 h-4 text-emerald-300" /> : <Lock className="w-3.5 h-3.5 text-teal-300" />}
              <span>{isAdmin ? (lang === 'en' ? 'Admin Active' : 'प्रशासक सक्रिय') : (lang === 'en' ? 'Admin Login' : 'प्रशासक लगइन')}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden gap-1.5">
            {/* Theme Toggle in Mobile Header */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-slate-700 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-600" />}
            </button>

            {/* Language Switcher in Mobile Header */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-200 rounded-lg border border-teal-200 dark:border-slate-700 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
              <span>{lang === 'en' ? 'ने' : 'EN'}</span>
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-teal-100 dark:border-slate-800 py-3 px-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label[lang]}
                </button>
              );
            })}

            {/* Separators & Mobile Legal Links inside the mobile menu drawer */}
            <div className="border-t border-teal-50 dark:border-slate-800/80 my-2 pt-2">
              <button
                onClick={() => handleTabChange('privacy')}
                className={`block w-full text-left px-4 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                  currentTab === 'privacy' ? 'text-teal-700 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
              </button>
              <button
                onClick={() => handleTabChange('terms')}
                className={`block w-full text-left px-4 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                  currentTab === 'terms' ? 'text-teal-700 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400 hover:bg-teal-50 dark:hover:bg-slate-800'
                }`}
              >
                {lang === 'en' ? 'Terms of Service' : 'सेवाका सर्तहरू'}
              </button>
            </div>

            {/* Admin Login option directly in mobile menu list */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAdminModal();
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-black border-t border-teal-100 dark:border-slate-800 mt-2 transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-emerald-50 dark:bg-slate-950 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-teal-50 dark:bg-slate-950 text-teal-950 dark:text-teal-200 border border-teal-100 dark:border-slate-800'
              }`}
            >
              <span className="flex items-center gap-2">
                {isAdmin ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-teal-700 dark:text-teal-400" />}
                {isAdmin ? (lang === 'en' ? 'Admin Panel: Active' : 'प्रशासक प्यानल: सक्रिय') : (lang === 'en' ? 'Admin Portal Login' : 'प्रशासक पोर्टल लगइन')}
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
