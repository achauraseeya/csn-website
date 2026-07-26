import { useState, useRef, useEffect } from 'react';
import { Menu, X, Globe, ShieldCheck, Lock, Sun, Moon, ChevronDown, Home } from 'lucide-react';
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
  pendingNotificationsCount?: number;
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
  pendingNotificationsCount = 0,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isMobileAboutExpanded, setIsMobileAboutExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAboutDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const aboutSubItems = [
    { id: 'about-vision', label: { en: 'Vision', ne: 'दूरदृष्टि' } },
    { id: 'about-mission', label: { en: 'Mission', ne: 'लक्ष्य तथा उद्देश्य' } },
    { id: 'about-objectives', label: { en: 'Objectives', ne: 'प्रमुख उद्देश्यहरू' } },
    { id: 'about-history', label: { en: 'History', ne: 'इतिहास र विकास' } },
  ];

  const primaryMenuItems = [
    { id: 'directory', label: { en: 'Members Directory', ne: 'सदस्य निर्देशिका' } },
    { id: 'matrimonial', label: { en: 'Matrimonial', ne: 'वैवाहिक जोडी' } },
    { id: 'events', label: { en: 'Events & Calendar', ne: 'पात्रो' } },
    { id: 'membership-donation', label: { en: 'Join & Support', ne: 'सहभागिता' } },
  ];

  const secondaryMenuItems = [
    { id: 'our-heritage', label: { en: 'Our Heritage', ne: 'हाम्रो सम्पदा' } },
    { id: 'albums-gallery', label: { en: 'Journey Albums', ne: 'यात्रा एल्बमहरू' } },
    { id: 'notices-gallery', label: { en: 'Notices & Gallery', ne: 'सूचना र ग्यालरी' } },
    ...(isAdmin ? [
      { id: 'analytics', label: { en: 'Analytics', ne: 'एनालिटिक्स' } },
      { id: 'blogger-exporter', label: { en: 'Blogger XML Setup', ne: 'ब्लगर XML सेटअप' } }
    ] : []),
  ];

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
    setIsAboutDropdownOpen(false);
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

  const isAboutActive = currentTab.startsWith('about-') || currentTab === 'about';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-teal-100 dark:border-slate-800 shadow-sm transition-colors duration-200" id="nav-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & Brand */}
          {/* Logo & Brand Name */}
          <div className="flex items-center shrink-0 mr-4 lg:mr-8">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleTabChange('home')}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center border border-teal-100 dark:border-slate-800 shadow-sm transition-all group-hover:scale-105 shrink-0">
                <img src={logoUrl} alt="Chaurasiya Samaj Logo" className="w-full h-full object-cover" />
              </div>
              <div className="shrink-0 min-w-0">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-teal-900 dark:text-teal-100 leading-tight whitespace-nowrap">
                  {logoText}
                </h1>
                <p className="text-[10px] sm:text-[11px] font-bold text-teal-600 dark:text-emerald-400 tracking-wider whitespace-nowrap">
                  {logoSub}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-end min-w-0 overflow-x-auto no-scrollbar">
            {/* Home Item */}
            <button
              onClick={() => handleTabChange('home')}
              className={`px-2.5 py-2 text-xs font-bold tracking-wide rounded-lg uppercase transition-all duration-150 cursor-pointer flex items-center gap-1 shrink-0 ${
                currentTab === 'home' || currentTab === 'history'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-emerald-400'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Home' : 'गृहपृष्ठ'}</span>
            </button>

            {/* About Us Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                onMouseEnter={() => setIsAboutDropdownOpen(true)}
                className={`px-2.5 py-2 text-xs font-bold tracking-wide rounded-lg uppercase transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                  isAboutActive
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-emerald-400'
                }`}
              >
                <span>{lang === 'en' ? 'About Us' : 'हाम्रो बारेमा'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* About Sub-menu */}
              {isAboutDropdownOpen && (
                <div
                  onMouseLeave={() => setIsAboutDropdownOpen(false)}
                  className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1.5 text-[10px] font-black text-teal-600 dark:text-emerald-400 uppercase tracking-wider border-b border-teal-50 dark:border-slate-800 mb-1">
                    {lang === 'en' ? 'About Sections' : 'हाम्रो बारेमा उप-शीर्षकहरू'}
                  </div>
                  {aboutSubItems.map((sub) => {
                    const isSubActive = currentTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleTabChange(sub.id)}
                        className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                          isSubActive
                            ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-emerald-400 font-extrabold'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-emerald-400'
                        }`}
                      >
                        <span>{sub.label[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Primary Menu Items */}
            {primaryMenuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`px-2.5 py-2 text-xs font-bold tracking-wide rounded-lg uppercase transition-all duration-150 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-emerald-400'
                  }`}
                >
                  {item.label[lang]}
                </button>
              );
            })}

            {/* More Dropdown */}
            <div className="relative shrink-0" ref={moreDropdownRef}>
              <button
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                onMouseEnter={() => setIsMoreDropdownOpen(true)}
                className={`px-2.5 py-2 text-xs font-bold tracking-wide rounded-lg uppercase transition-all duration-150 cursor-pointer flex items-center gap-1 ${
                  secondaryMenuItems.some(item => item.id === currentTab)
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-emerald-400'
                }`}
              >
                <span>{lang === 'en' ? 'More' : 'थप'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Secondary Sub-menu */}
              {isMoreDropdownOpen && (
                <div
                  onMouseLeave={() => setIsMoreDropdownOpen(false)}
                  className="absolute top-full right-0 mt-1 w-52 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1.5 text-[10px] font-black text-teal-600 dark:text-emerald-400 uppercase tracking-wider border-b border-teal-50 dark:border-slate-800 mb-1">
                    {lang === 'en' ? 'Explore More' : 'थप विकल्पहरू'}
                  </div>
                  {secondaryMenuItems.map((sub) => {
                    const isSubActive = currentTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleTabChange(sub.id)}
                        className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                          isSubActive
                            ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-emerald-400 font-extrabold'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-emerald-400'
                        }`}
                      >
                        <span>{sub.label[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pinned Action Buttons: Language, Theme & Central Admin */}
            <div className="flex items-center shrink-0 space-x-1.5 ml-2 border-l border-teal-100 dark:border-slate-800 pl-2">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2.5 py-2 text-xs font-bold bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-200 rounded-lg border border-teal-200 dark:border-slate-700 hover:bg-teal-100 dark:hover:bg-slate-700 transition-all uppercase cursor-pointer shrink-0"
                title="Switch Language / भाषा परिवर्तन गर्नुहोस्"
              >
                <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
                <span>{lang === 'en' ? 'नेपाली' : 'English'}</span>
              </button>

              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-slate-700 hover:bg-teal-100 dark:hover:bg-slate-700 transition-all cursor-pointer shrink-0"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-600" />}
              </button>

              {/* Central Admin Login Button - Always Highlighted & Pinned */}
              <button
                onClick={onOpenAdminModal}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl border transition-all uppercase shadow-md cursor-pointer shrink-0 ${
                  isAdmin
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-400 hover:from-emerald-700 hover:to-teal-800 ring-2 ring-emerald-400/30'
                    : 'bg-teal-900 dark:bg-slate-950 text-emerald-300 border-teal-700 dark:border-slate-800 hover:bg-teal-950 dark:hover:bg-black hover:text-white'
                }`}
                title={isAdmin ? 'Central Admin Operations' : 'Admin Login'}
              >
                {isAdmin ? <ShieldCheck className="w-4 h-4 text-emerald-300 animate-pulse" /> : <Lock className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="whitespace-nowrap">{isAdmin ? (lang === 'en' ? 'Central Admin' : 'केन्द्रीय प्रशासन') : (lang === 'en' ? 'Admin Portal' : 'प्रशासक पोर्टल')}</span>
                {pendingNotificationsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow-md animate-pulse border-2 border-white dark:border-slate-900">
                    {pendingNotificationsCount > 9 ? '9+' : pendingNotificationsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu header controls */}
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
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-teal-100 dark:border-slate-800 py-3 px-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            {/* Home Item in Mobile */}
            <button
              onClick={() => handleTabChange('home')}
              className={`flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                currentTab === 'home' || currentTab === 'history'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{lang === 'en' ? 'Home' : 'गृहपृष्ठ'}</span>
            </button>

            {/* About Us Collapsible Section in Mobile */}
            <div className="border-y border-teal-50 dark:border-slate-800/80 my-1 py-1">
              <button
                onClick={() => setIsMobileAboutExpanded(!isMobileAboutExpanded)}
                className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  isAboutActive
                    ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-emerald-400'
                    : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{lang === 'en' ? 'About Us' : 'हाम्रो बारेमा'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileAboutExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isMobileAboutExpanded && (
                <div className="ml-4 pl-2 border-l-2 border-teal-200 dark:border-slate-700 space-y-1 mt-1">
                  {aboutSubItems.map((sub) => {
                    const isSubActive = currentTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleTabChange(sub.id)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-teal-700 text-white font-bold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {sub.label[lang]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Other Menu Items */}
            {[...primaryMenuItems, ...secondaryMenuItems].map((item) => {
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

            {/* Separators & Mobile Legal Links */}
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
