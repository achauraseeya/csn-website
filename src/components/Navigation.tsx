import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Globe, ShieldCheck, Lock, Sun, Moon, ChevronDown, Home, Heart, UserPlus, Camera, Compass, ExternalLink, Link2 } from 'lucide-react';
import { Language, SiteTexts, NavMenuItem, NavSubMenuItem } from '../types';
import logoImg from '../assets/images/chaurasiya_logo_1784519579895.jpg';
import { removeImageWhiteBackground } from '../utils/imageUtils';

export const DEFAULT_NAV_MENUS: NavMenuItem[] = [
  {
    id: 'home',
    label: { en: 'Home', ne: 'गृहपृष्ठ' },
    linkType: 'tab',
    target: 'home',
  },
  {
    id: 'about',
    label: { en: 'About Us', ne: 'हाम्रो बारेमा' },
    linkType: 'dropdown',
    subItems: [
      { id: 'about-vision', label: { en: 'Vision & Goals', ne: 'दूरदृष्टि तथा लक्ष्य' }, linkType: 'tab', target: 'about-vision' },
      { id: 'about-mission', label: { en: 'Mission', ne: 'लक्ष्य तथा उद्देश्य' }, linkType: 'tab', target: 'about-mission' },
      { id: 'about-objectives', label: { en: 'Objectives', ne: 'प्रमुख उद्देश्यहरू' }, linkType: 'tab', target: 'about-objectives' },
      { id: 'about-history', label: { en: 'History & Leadership', ne: 'इतिहास र नेतृत्व' }, linkType: 'tab', target: 'about-history' },
      { id: 'our-heritage', label: { en: 'Our Heritage', ne: 'हाम्रो सम्पदा' }, linkType: 'tab', target: 'our-heritage' },
      { id: 'directory', label: { en: 'Member Directory', ne: 'सदस्य निर्देशिका' }, linkType: 'tab', target: 'directory' },
    ],
  },
  {
    id: 'news-events',
    label: { en: 'News & Events', ne: 'समाचार तथा कार्यक्रम' },
    linkType: 'dropdown',
    subItems: [
      { id: 'notices-gallery', label: { en: 'News & Notices', ne: 'समाचार तथा सूचनाहरू' }, linkType: 'tab', target: 'notices-gallery' },
      { id: 'events', label: { en: 'Events & Campaigns', ne: 'कार्यक्रम तथा अभियान' }, linkType: 'tab', target: 'events' },
      { id: 'family-connectivity', label: { en: 'Family Connectivity', ne: 'परिवार सम्बन्ध र वंशावली' }, linkType: 'tab', target: 'family-connectivity' },
    ],
  },
  {
    id: 'get-connected',
    label: { en: 'Get Connected', ne: 'जोडिनुहोस्' },
    linkType: 'dropdown',
    subItems: [
      { id: 'membership-form', label: { en: 'Membership Registration', ne: 'सदस्यता फारम' }, linkType: 'tab', target: 'membership-form' },
      { id: 'volunteer-form', label: { en: 'Volunteer Registration', ne: 'स्वयंसेवक फारम' }, linkType: 'tab', target: 'volunteer-form' },
    ],
  },
  {
    id: 'donate-us',
    label: { en: 'Donate Us', ne: 'दान गर्नुहोस्' },
    linkType: 'dropdown',
    subItems: [
      { id: 'donate-guesthouse', label: { en: 'Guest House Construction', ne: 'अतिथि गृह निर्माण दान' }, linkType: 'tab', target: 'donate-guesthouse' },
      { id: 'donate-events', label: { en: 'Events Donation', ne: 'कार्यक्रम सहयोग दान' }, linkType: 'tab', target: 'donate-events' },
    ],
  },
  {
    id: 'photo-gallery',
    label: { en: 'Photo Gallery', ne: 'फोटो ग्यालरी' },
    linkType: 'tab',
    target: 'albums-gallery',
  },
  {
    id: 'portals',
    label: { en: 'Portals', ne: 'पोर्टलहरू' },
    linkType: 'dropdown',
    subItems: [
      { id: 'matrimonial', label: { en: 'Matrimonial Portal', ne: 'वैवाहिक पोर्टल' }, linkType: 'tab', target: 'matrimonial' },
      { id: 'renowned-people', label: { en: 'Renowned People', ne: 'प्रख्यात व्यक्तित्वहरू' }, linkType: 'tab', target: 'renowned-people' },
    ],
  },
];

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onTrackAction: (actionName: string) => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onOpenMenuManager?: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  siteTexts: SiteTexts;
  pendingNotificationsCount?: number;
  navMenus?: NavMenuItem[];
}

export default function Navigation({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  onTrackAction,
  isAdmin,
  onOpenAdminModal,
  onOpenMenuManager,
  theme,
  toggleTheme,
  siteTexts,
  pendingNotificationsCount = 0,
  navMenus = DEFAULT_NAV_MENUS,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);

  const navRef = useRef<HTMLDivElement>(null);

  const closeAllDropdowns = () => {
    setActiveDropdownId(null);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
    closeAllDropdowns();
    onTrackAction(`Navigate to ${tabId}`);
  };

  const handleSubItemClick = (sub: NavSubMenuItem) => {
    if (sub.linkType === 'url') {
      if (sub.target.startsWith('http://') || sub.target.startsWith('https://')) {
        window.open(sub.target, sub.openInNewTab ? '_blank' : '_self');
      } else {
        window.location.href = sub.target;
      }
    } else {
      handleTabChange(sub.target);
    }
    setIsOpen(false);
    closeAllDropdowns();
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ne' : 'en';
    setLang(nextLang);
    onTrackAction(`Toggle language to ${nextLang.toUpperCase()}`);
  };

  const logoUrl = siteTexts.logoUrl || logoImg;
  const logoText = lang === 'en' ? siteTexts.logoTextEn : siteTexts.logoTextNe;
  const logoSub = lang === 'en' ? siteTexts.logoSubEn : siteTexts.logoSubNe;

  // Dynamically ensure white background is stripped so logo floats cleanly over header
  const [cleanLogoUrl, setCleanLogoUrl] = useState<string>(logoUrl);

  useEffect(() => {
    if (!logoUrl) return;
    if (logoUrl.startsWith('data:image/png;base64,')) {
      setCleanLogoUrl(logoUrl);
      return;
    }
    let isMounted = true;
    removeImageWhiteBackground(logoUrl, 195, 300)
      .then((processed) => {
        if (isMounted && processed) {
          setCleanLogoUrl(processed);
        }
      })
      .catch(() => {
        if (isMounted) setCleanLogoUrl(logoUrl);
      });
    return () => { isMounted = false; };
  }, [logoUrl]);

  return (
    <nav className="bg-white dark:bg-slate-900 transition-colors duration-200" id="nav-bar" ref={navRef}>
      {/* =========================================================================
          DESKTOP & TABLET VIEW (lg:block): 2-ROW INSTITUTIONAL BANNER & MENU BAR
          - Light Institutional Banner Canvas
          - Extreme Left: Official Logo (transparent PNG overlaying clean header)
          - Center: Institution Name & Subtitle & Location (Original Font Colors)
          - Extreme Right: 3D Nepal Flag on top, with Language, Theme & Admin buttons below it
         ========================================================================= */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border-b border-teal-100 dark:border-slate-800 py-3 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-6">
          
          {/* EXTREME LEFT: Transparent Logo overlaying pure white header */}
          <div
            className="flex items-center shrink-0 cursor-pointer group py-0.5"
            onClick={() => handleTabChange('home')}
            title={logoText}
          >
            <div className="h-20 lg:h-24 w-auto flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img
                src={cleanLogoUrl || logoUrl}
                alt="Chaurasiya Samaj Logo"
                className="h-full w-auto object-contain max-h-full"
              />
            </div>
          </div>

          {/* CENTER: Institution Name, Subheading & Location (Same font colors as Mobile View) */}
          <div
            className="flex-1 text-center px-2 cursor-pointer select-none min-w-0"
            onClick={() => handleTabChange('home')}
          >
            {/* Main Institution Name (Same as Mobile: text-teal-950 dark:text-teal-50) */}
            <h1 className="text-2xl lg:text-3.5xl font-black tracking-tight text-teal-950 dark:text-teal-50 leading-tight uppercase font-display">
              {logoText}
            </h1>

            {/* Subtitle / Executive Committee Line (Same as Mobile: text-teal-600 dark:text-emerald-400) */}
            <p className="text-sm lg:text-base font-black text-teal-600 dark:text-emerald-400 mt-0.5 tracking-tight">
              {logoSub}
            </p>

            {/* Location & Estd Tagline (Same as Mobile: text-teal-700 dark:text-emerald-300) */}
            <p className="text-xs font-extrabold text-teal-700 dark:text-emerald-300 mt-0.5 tracking-wider uppercase">
              {lang === 'en'
                ? (siteTexts.taglineEn || 'Kathmandu, Nepal | Estd: 2003 (२०६०)')
                : (siteTexts.taglineNe || 'काठमाडौँ, नेपाल | स्थापना: २०६० (Estd: 2003)')}
            </p>
          </div>

          {/* EXTREME RIGHT: 3D Nepal Flag on Top + Buttons Row Below It */}
          <div className="flex flex-col items-end shrink-0 gap-1.5">
            {/* Top Item: 3D Wavering Flag of Nepal */}
            <div
              className="flex items-center justify-end shrink-0 group cursor-pointer select-none"
              title="National Flag of Nepal / नेपालको राष्ट्रिय झण्डा"
            >
              {/* Gold Flagpole */}
              <div className="w-1 h-12 lg:h-14 bg-gradient-to-b from-amber-200 via-amber-500 to-amber-800 rounded-t-full shadow-md mr-0.5 z-10 shrink-0" />
              {/* 3D Fluttering Flag */}
              <div className="relative">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg"
                  alt="Flag of Nepal"
                  className="h-10 lg:h-12 w-auto max-w-none object-contain animate-wave-flag origin-left filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Bottom Row (Below Flag): Language, Theme, Admin Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Nepali / Language Switcher Button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-black bg-teal-50 dark:bg-slate-800 text-teal-900 dark:text-teal-100 rounded-lg border border-teal-200 dark:border-slate-700 hover:bg-teal-100 dark:hover:bg-slate-700 transition-all uppercase cursor-pointer shrink-0 shadow-2xs"
                title="Switch Language / भाषा परिवर्तन गर्नुहोस्"
              >
                <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
                <span>{lang === 'en' ? 'नेपाली' : 'English'}</span>
              </button>

              {/* Dark / Night Mode Button */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-900 dark:text-teal-100 border border-teal-200 dark:border-slate-700 hover:bg-teal-100 dark:hover:bg-slate-700 transition-all cursor-pointer shrink-0 shadow-2xs"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-600" />}
              </button>

              {/* Admin Menu Manager Shortcut */}
              {isAdmin && onOpenMenuManager && (
                <button
                  onClick={onOpenMenuManager}
                  className="p-1.5 rounded-lg bg-teal-800 dark:bg-slate-800 text-emerald-300 hover:text-white border border-teal-700 dark:border-slate-700 transition-all cursor-pointer shrink-0 shadow-2xs"
                  title={lang === 'en' ? 'Manage Menus & Submenus' : 'मेनु सम्पादक'}
                >
                  <Compass className="w-4 h-4 text-emerald-400 animate-pulse" />
                </button>
              )}

              {/* Admin Portal Button */}
              <button
                onClick={onOpenAdminModal}
                className={`relative p-1.5 rounded-lg border transition-all shadow-sm cursor-pointer shrink-0 ${
                  isAdmin
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-400 hover:from-emerald-700 hover:to-teal-800 ring-2 ring-emerald-400/30'
                    : 'bg-teal-900 dark:bg-slate-950 text-emerald-300 border-teal-700 dark:border-slate-800 hover:bg-teal-950 dark:hover:bg-black hover:text-white'
                }`}
                title={isAdmin ? (lang === 'en' ? 'Central Admin Operations' : 'केन्द्रीय प्रशासन') : (lang === 'en' ? 'Admin Portal Login' : 'प्रशासक लगइन')}
              >
                {isAdmin ? <ShieldCheck className="w-4 h-4 text-emerald-300 animate-pulse" /> : <Lock className="w-4 h-4 text-emerald-400" />}
                {pendingNotificationsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white shadow-md animate-pulse border-2 border-white dark:border-slate-900">
                    {pendingNotificationsCount > 9 ? '9+' : pendingNotificationsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP MAIN NAVIGATION MENU BAR */}
      <div className="hidden lg:block bg-teal-900 dark:bg-slate-950 text-white shadow-md border-y border-teal-800 dark:border-slate-800 py-1">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-center space-x-1 xl:space-x-2">
            {navMenus.map((menu) => {
              const isDropdown = menu.linkType === 'dropdown' && menu.subItems && menu.subItems.length > 0;
              const isMenuDropdownOpen = activeDropdownId === menu.id;

              const isSubActive = menu.subItems?.some(s => s.target === currentTab);
              const isMainActive = menu.target === currentTab || isSubActive;

              if (!isDropdown) {
                return (
                  <button
                    key={menu.id}
                    onClick={() => {
                      if (menu.linkType === 'url' && menu.target) {
                        window.open(menu.target, menu.openInNewTab ? '_blank' : '_self');
                      } else if (menu.target) {
                        handleTabChange(menu.target);
                      }
                    }}
                    className={`px-3 xl:px-4 py-2 text-xs xl:text-sm font-bold tracking-wider uppercase rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isMainActive
                        ? 'bg-amber-500 text-teal-950 shadow-md font-black'
                        : 'text-teal-100 hover:bg-teal-800 dark:hover:bg-slate-800 hover:text-amber-300'
                    }`}
                  >
                    {menu.id === 'home' && <Home className="w-4 h-4 shrink-0" />}
                    {menu.id === 'photo-gallery' && <Camera className="w-4 h-4 text-emerald-300 shrink-0" />}
                    <span className="whitespace-nowrap">{menu.label[lang] || menu.label.en}</span>
                  </button>
                );
              }

              return (
                <div key={menu.id} className="relative shrink-0">
                  <button
                    onClick={() => {
                      if (isMenuDropdownOpen) {
                        setActiveDropdownId(null);
                      } else {
                        setActiveDropdownId(menu.id);
                      }
                    }}
                    onMouseEnter={() => setActiveDropdownId(menu.id)}
                    className={`px-3 xl:px-4 py-2 text-xs xl:text-sm font-bold tracking-wider uppercase rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                      isMainActive
                        ? 'bg-amber-500 text-teal-950 shadow-md font-black'
                        : 'text-teal-100 hover:bg-teal-800 dark:hover:bg-slate-800 hover:text-amber-300'
                    }`}
                  >
                    {menu.id === 'get-connected' && <UserPlus className="w-4 h-4 text-emerald-300 shrink-0" />}
                    {menu.id === 'donate-us' && <Heart className="w-4 h-4 text-rose-300 fill-rose-300/20 shrink-0" />}
                    <span className="whitespace-nowrap">{menu.label[lang] || menu.label.en}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${isMenuDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Popup */}
                  {isMenuDropdownOpen && (
                    <div
                      onMouseLeave={() => setActiveDropdownId(null)}
                      className="absolute top-full left-0 mt-1 w-60 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-gray-800 dark:text-gray-100"
                    >
                      <div className="px-3.5 py-1.5 text-[10px] font-black text-teal-700 dark:text-emerald-400 uppercase tracking-wider border-b border-teal-50 dark:border-slate-800 mb-1">
                        {menu.label[lang] || menu.label.en}
                      </div>
                      {menu.subItems?.map((sub) => {
                        const isCurrentSubActive = currentTab === sub.target;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubItemClick(sub)}
                            className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                              isCurrentSubActive
                                ? 'bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-emerald-400 font-extrabold border-l-4 border-amber-500 pl-3'
                                : 'text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-emerald-400'
                            }`}
                          >
                            <span className="truncate">{sub.label[lang] || sub.label.en}</span>
                            {sub.linkType === 'url' && <ExternalLink className="w-3.5 h-3.5 text-rose-500 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW (lg:hidden): REVERTED EXACT ORIGINAL MOBILE HEADER BAR
          - Single clean compact bar
          - Left: Logo + Title
          - Right: Language Toggle, Theme Toggle, Admin & Hamburger Toggle
         ========================================================================= */}
      <div className="lg:hidden px-3 py-2 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-teal-100 dark:border-slate-800 text-teal-950 dark:text-white">
        {/* Mobile Left: Logo & Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer group py-0.5"
          onClick={() => handleTabChange('home')}
        >
          <div className="h-12 w-auto flex items-center justify-center shrink-0">
            <img src={cleanLogoUrl || logoUrl} alt="Chaurasiya Samaj Logo" className="h-full w-auto object-contain max-h-full" />
          </div>
          <div className="shrink-0 min-w-0">
            <h1 className="text-base xs:text-lg sm:text-xl font-black tracking-tight text-teal-950 dark:text-teal-50 leading-tight whitespace-nowrap">
              {logoText}
            </h1>
            <p className="text-xs font-extrabold text-teal-600 dark:text-emerald-400 tracking-wider whitespace-nowrap mt-0.5">
              {logoSub}
            </p>
          </div>
        </div>

        {/* Mobile Right: Utilities & Hamburger */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-slate-700 transition-all cursor-pointer"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-600" />}
          </button>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1 text-xs font-bold bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-200 rounded-lg border border-teal-200 dark:border-slate-700 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
            <span>{lang === 'en' ? 'ने' : 'EN'}</span>
          </button>

          <button
            onClick={onOpenAdminModal}
            className="p-1.5 rounded-lg bg-teal-900 text-emerald-300 border border-teal-700 transition-all cursor-pointer"
            title="Admin Login"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-teal-800 text-white hover:bg-teal-900 focus:outline-none cursor-pointer shadow-xs ml-0.5"
            title="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          MOBILE DRAWER NAVIGATION
         ========================================================================= */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-teal-100 dark:border-slate-800 py-3 px-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            {navMenus.map((menu) => {
              const isDropdown = menu.linkType === 'dropdown' && menu.subItems && menu.subItems.length > 0;
              const isExpanded = mobileExpandedId === menu.id;

              if (!isDropdown) {
                return (
                  <button
                    key={menu.id}
                    onClick={() => {
                      if (menu.linkType === 'url' && menu.target) {
                        window.open(menu.target, menu.openInNewTab ? '_blank' : '_self');
                      } else if (menu.target) {
                        handleTabChange(menu.target);
                      }
                    }}
                    className={`flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                      currentTab === menu.target
                        ? 'bg-amber-500 text-teal-950 shadow-xs'
                        : 'text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {menu.id === 'home' && <Home className="w-4 h-4" />}
                    <span>{menu.label[lang] || menu.label.en}</span>
                  </button>
                );
              }

              return (
                <div key={menu.id} className="border-b border-teal-50 dark:border-slate-800/80 pb-1 mb-1">
                  <button
                    onClick={() => setMobileExpandedId(isExpanded ? null : menu.id)}
                    className="flex items-center justify-between w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-teal-900 dark:text-teal-100 hover:bg-teal-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <span>{menu.label[lang] || menu.label.en}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="ml-4 pl-2 border-l-2 border-amber-400 dark:border-slate-700 space-y-1 mt-1">
                      {menu.subItems?.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubItemClick(sub)}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            currentTab === sub.target
                              ? 'bg-teal-800 text-white font-bold'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex items-center justify-between">
                            <span>{sub.label[lang] || sub.label.en}</span>
                            {sub.linkType === 'url' && <ExternalLink className="w-3 h-3 text-rose-500 ml-1" />}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Admin Controls in Mobile Menu */}
            <div className="pt-2 border-t border-teal-100 dark:border-slate-800 space-y-1">
              {isAdmin && onOpenMenuManager && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenMenuManager();
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'en' ? 'Manage Navigation Menus & Submenus' : 'मेनु र उप-मेनु व्यवस्थापन'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdminModal();
                }}
                className={`flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-lg text-sm font-black transition-all cursor-pointer ${
                  isAdmin
                    ? 'bg-emerald-50 dark:bg-slate-950 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900/50'
                    : 'bg-teal-50 dark:bg-slate-950 text-teal-950 dark:text-teal-200 border border-teal-100 dark:border-slate-800'
                }`}
              >
                {isAdmin ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-teal-700 dark:text-teal-400" />}
                <span>{isAdmin ? (lang === 'en' ? 'Admin Panel: Active' : 'प्रशासक प्यानल: सक्रिय') : (lang === 'en' ? 'Admin Portal Login' : 'प्रशासक लगइन')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
