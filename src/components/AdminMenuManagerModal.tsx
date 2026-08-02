import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, MoveUp, MoveDown, ExternalLink, Link2, LayoutGrid, Check, RotateCcw, FolderPlus, Compass, Settings, CheckCircle, ArrowRight } from 'lucide-react';
import { Language, NavMenuItem, NavSubMenuItem } from '../types';

interface AdminMenuManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  navMenus: NavMenuItem[];
  onSaveNavMenus: (menus: NavMenuItem[]) => void;
  onResetDefaultMenus: () => void;
}

export default function AdminMenuManagerModal({
  isOpen,
  onClose,
  lang,
  navMenus,
  onSaveNavMenus,
  onResetDefaultMenus,
}: AdminMenuManagerModalProps) {
  const [menus, setMenus] = useState<NavMenuItem[]>(navMenus);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(navMenus[0]?.id || null);

  // Form states for creating a new Top-Level Main Menu
  const [menuFormLabelEn, setMenuFormLabelEn] = useState('');
  const [menuFormLabelNe, setMenuFormLabelNe] = useState('');
  const [menuFormLinkType, setMenuFormLinkType] = useState<'tab' | 'url' | 'dropdown'>('dropdown');
  const [menuFormTarget, setMenuFormTarget] = useState('');
  const [menuFormOpenInNewTab, setMenuFormOpenInNewTab] = useState(false);

  // Form states for adding a Submenu to selected menu
  const [isAddingSubmenu, setIsAddingSubmenu] = useState(false);
  const [subLabelEn, setSubLabelEn] = useState('');
  const [subLabelNe, setSubLabelNe] = useState('');
  const [subLinkType, setSubLinkType] = useState<'tab' | 'url'>('tab');
  const [subTarget, setSubTarget] = useState('');
  const [subOpenInNewTab, setSubOpenInNewTab] = useState(false);

  // Form states for EDITING an existing Submenu
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editSubLabelEn, setEditSubLabelEn] = useState('');
  const [editSubLabelNe, setEditSubLabelNe] = useState('');
  const [editSubLinkType, setEditSubLinkType] = useState<'tab' | 'url'>('tab');
  const [editSubTarget, setEditSubTarget] = useState('');
  const [editSubOpenInNewTab, setEditSubOpenInNewTab] = useState(false);

  // Success alert
  const [savedAlert, setSavedAlert] = useState(false);

  if (!isOpen) return null;

  const currentSelectedMenu = menus.find((m) => m.id === selectedMenuId) || menus[0];

  const handleSaveAll = () => {
    onSaveNavMenus(menus);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleResetDefaults = () => {
    if (window.confirm(lang === 'en' ? 'Reset all navigation menus to original default configuration?' : 'के तपाईं सबै नेभिगेसन मेनुहरू सुरुवाती ढाँचामा फर्काउन चाहनुहुन्छ?')) {
      onResetDefaultMenus();
      onClose();
    }
  };

  // Add new Top-Level Menu
  const handleAddMainMenu = () => {
    if (!menuFormLabelEn.trim() && !menuFormLabelNe.trim()) {
      alert(lang === 'en' ? 'Please enter menu title' : 'कृपया मेनु शीर्षक प्रविष्ट गर्नुहोस्');
      return;
    }

    const newId = `custom-menu-${Date.now()}`;
    const newMenu: NavMenuItem = {
      id: newId,
      label: {
        en: menuFormLabelEn.trim() || menuFormLabelNe.trim(),
        ne: menuFormLabelNe.trim() || menuFormLabelEn.trim(),
      },
      linkType: menuFormLinkType,
      target: menuFormLinkType !== 'dropdown' ? menuFormTarget.trim() : undefined,
      openInNewTab: menuFormLinkType === 'url' ? menuFormOpenInNewTab : false,
      subItems: menuFormLinkType === 'dropdown' ? [] : undefined,
      isCustom: true,
    };

    const updated = [...menus, newMenu];
    setMenus(updated);
    setSelectedMenuId(newId);
    setMenuFormLabelEn('');
    setMenuFormLabelNe('');
    setMenuFormTarget('');
  };

  // Delete Main Menu
  const handleDeleteMainMenu = (menuId: string) => {
    if (menus.length <= 1) {
      alert(lang === 'en' ? 'At least one menu is required' : 'कमसेकम एउटा मेनु आवश्यक छ');
      return;
    }
    if (window.confirm(lang === 'en' ? 'Delete this main menu?' : 'यो मुख्य मेनु हटाउनुहुन्छ?')) {
      const updated = menus.filter((m) => m.id !== menuId);
      setMenus(updated);
      if (selectedMenuId === menuId) {
        setSelectedMenuId(updated[0]?.id || null);
      }
    }
  };

  // Move Main Menu Up/Down
  const handleMoveMainMenu = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= menus.length) return;
    const updated = [...menus];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setMenus(updated);
  };

  // Add Submenu to current menu
  const handleAddSubmenu = () => {
    if (!currentSelectedMenu) return;
    if (!subLabelEn.trim() && !subLabelNe.trim()) {
      alert(lang === 'en' ? 'Please enter submenu title' : 'कृपया उप-मेनु शीर्षक हाल्नुहोस्');
      return;
    }
    if (!subTarget.trim()) {
      alert(lang === 'en' ? 'Please specify link target or URL' : 'कृपया लिङ्क वा URL प्रविष्ट गर्नुहोस्');
      return;
    }

    const newSub: NavSubMenuItem = {
      id: `sub-${Date.now()}`,
      label: {
        en: subLabelEn.trim() || subLabelNe.trim(),
        ne: subLabelNe.trim() || subLabelEn.trim(),
      },
      linkType: subLinkType,
      target: subTarget.trim(),
      openInNewTab: subLinkType === 'url' ? subOpenInNewTab : false,
    };

    const updated = menus.map((m) => {
      if (m.id === currentSelectedMenu.id) {
        const existingSubs = m.subItems || [];
        return {
          ...m,
          linkType: 'dropdown' as const,
          subItems: [...existingSubs, newSub],
        };
      }
      return m;
    });

    setMenus(updated);
    setSubLabelEn('');
    setSubLabelNe('');
    setSubTarget('');
    setIsAddingSubmenu(false);
  };

  // Start Editing a Submenu
  const handleStartEditSubmenu = (sub: NavSubMenuItem) => {
    setEditingSubId(sub.id);
    setEditSubLabelEn(sub.label.en);
    setEditSubLabelNe(sub.label.ne);
    setEditSubLinkType(sub.linkType);
    setEditSubTarget(sub.target);
    setEditSubOpenInNewTab(sub.openInNewTab || false);
  };

  // Save Submenu Edits
  const handleSaveSubmenuEdits = (subId: string) => {
    if (!currentSelectedMenu) return;
    if (!editSubLabelEn.trim() && !editSubLabelNe.trim()) {
      alert(lang === 'en' ? 'Please enter submenu title' : 'कृपया उप-मेनु शीर्षक हाल्नुहोस्');
      return;
    }

    const updated = menus.map((m) => {
      if (m.id === currentSelectedMenu.id && m.subItems) {
        return {
          ...m,
          subItems: m.subItems.map((s) => {
            if (s.id === subId) {
              return {
                ...s,
                label: {
                  en: editSubLabelEn.trim() || editSubLabelNe.trim(),
                  ne: editSubLabelNe.trim() || editSubLabelEn.trim(),
                },
                linkType: editSubLinkType,
                target: editSubTarget.trim(),
                openInNewTab: editSubLinkType === 'url' ? editSubOpenInNewTab : false,
              };
            }
            return s;
          }),
        };
      }
      return m;
    });

    setMenus(updated);
    setEditingSubId(null);
  };

  // Delete Submenu
  const handleDeleteSubmenu = (menuId: string, subId: string) => {
    if (window.confirm(lang === 'en' ? 'Remove this submenu?' : 'यो उप-मेनु हटाउनुहुन्छ?')) {
      const updated = menus.map((m) => {
        if (m.id === menuId && m.subItems) {
          return {
            ...m,
            subItems: m.subItems.filter((s) => s.id !== subId),
          };
        }
        return m;
      });
      setMenus(updated);
    }
  };

  // Move Submenu Up/Down
  const handleMoveSubmenu = (menuId: string, index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = menus.map((m) => {
      if (m.id === menuId && m.subItems) {
        if (newIndex < 0 || newIndex >= m.subItems.length) return m;
        const subList = [...m.subItems];
        const temp = subList[index];
        subList[index] = subList[newIndex];
        subList[newIndex] = temp;
        return { ...m, subItems: subList };
      }
      return m;
    });
    setMenus(updated);
  };

  // Quick preset tab targets
  const presetTabTargets = [
    { key: 'home', nameEn: 'Home Page', nameNe: 'गृहपृष्ठ' },
    { key: 'about-vision', nameEn: 'Vision & Goals', nameNe: 'दूरदृष्टि' },
    { key: 'about-mission', nameEn: 'Mission', nameNe: 'लक्ष्य तथा उद्देश्य' },
    { key: 'about-objectives', nameEn: 'Objectives', nameNe: 'प्रमुख उद्देश्यहरू' },
    { key: 'about-history', nameEn: 'History & Leadership', nameNe: 'इतिहास र नेतृत्व' },
    { key: 'our-heritage', nameEn: 'Our Heritage', nameNe: 'हाम्रो सम्पदा' },
    { key: 'directory', nameEn: 'Member Directory', nameNe: 'सदस्य निर्देशिका' },
    { key: 'notices-gallery', nameEn: 'News & Notices', nameNe: 'समाचार तथा सूचनाहरू' },
    { key: 'events', nameEn: 'Events & Campaigns', nameNe: 'कार्यक्रमहरू' },
    { key: 'family-connectivity', nameEn: 'Family Connectivity', nameNe: 'वंशावली सम्बन्ध' },
    { key: 'membership-form', nameEn: 'Membership Registration', nameNe: 'सदस्यता फारम' },
    { key: 'volunteer-form', nameEn: 'Volunteer Registration', nameNe: 'स्वयंसेवक फारम' },
    { key: 'donate-guesthouse', nameEn: 'Guest House Donation', nameNe: 'अतिथि गृह दान' },
    { key: 'donate-events', nameEn: 'Events Donation', nameNe: 'कार्यक्रम सहयोग दान' },
    { key: 'albums-gallery', nameEn: 'Photo Gallery', nameNe: 'फोटो ग्यालरी' },
    { key: 'matrimonial', nameEn: 'Matrimonial Portal', nameNe: 'वैवाहिक पोर्टल' },
    { key: 'renowned-people', nameEn: 'Renowned People', nameNe: 'प्रख्यात व्यक्तित्व' },
    { key: 'privacy', nameEn: 'Privacy Policy', nameNe: 'गोपनीयता नीति' },
    { key: 'terms', nameEn: 'Terms of Service', nameNe: 'सेवाका सर्तहरू' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-teal-100 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-teal-100 dark:border-slate-800 bg-gradient-to-r from-teal-900 via-teal-850 to-teal-800 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30 text-emerald-300">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
                <span>{lang === 'en' ? 'Navigation Menu & Submenu Editor' : 'नेभिगेसन मेनु तथा उप-मेनु सम्पादक'}</span>
              </h2>
              <p className="text-xs text-teal-200/90 font-medium">
                {lang === 'en'
                  ? 'Add new main menus, edit title texts, assign custom page links/URLs, and manage submenus.'
                  : 'मुख्य मेनु तथा उप-मेनुहरू थप्नुहोस्, शीर्षक, लिङ्क तथा सम्पादन गर्नुहोस्।'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-teal-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Saved Alert Banner */}
        {savedAlert && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between shadow-inner animate-in fade-in duration-150">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {lang === 'en' ? 'Navigation menus & submenus successfully saved and updated!' : 'नेभिगेसन मेनु तथा उप-मेनुहरू सफलतापुर्वक अपडेट भयो!'}
            </span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Top-Level Menus List & Add Main Menu */}
          <div className="lg:col-span-5 space-y-5 border-r-0 lg:border-r border-teal-100 dark:border-slate-800 lg:pr-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-teal-950 dark:text-teal-100 uppercase tracking-wider flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-teal-600 dark:text-emerald-400" />
                {lang === 'en' ? '1. Main Navigation Menus' : '१. मुख्य मेनु सूची'}
              </h3>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-slate-800 text-teal-800 dark:text-emerald-400">
                {menus.length} {lang === 'en' ? 'Menus' : 'मेनुहरू'}
              </span>
            </div>

            {/* List of Main Menus */}
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {menus.map((menu, idx) => {
                const isSelected = menu.id === selectedMenuId;
                const subCount = menu.subItems?.length || 0;
                return (
                  <div
                    key={menu.id}
                    onClick={() => {
                      setSelectedMenuId(menu.id);
                      setEditingSubId(null);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-slate-800/90 border-teal-500 dark:border-emerald-500 shadow-xs ring-2 ring-teal-500/20'
                        : 'bg-white dark:bg-slate-900 border-teal-100 dark:border-slate-800 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-teal-100 dark:bg-slate-700 text-teal-800 dark:text-teal-200 text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <p className="text-xs font-bold text-teal-950 dark:text-white truncate">
                          {menu.label[lang] || menu.label.en}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">
                          {menu.linkType === 'dropdown'
                            ? `${subCount} ${lang === 'en' ? 'Submenu Items' : 'उप-मेनुहरू'}`
                            : menu.linkType === 'url'
                            ? `URL: ${menu.target || 'Not Set'}`
                            : `Tab Key: ${menu.target || 'Not Set'}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveMainMenu(idx, 'up');
                        }}
                        disabled={idx === 0}
                        className="p-1 rounded text-gray-400 hover:text-teal-700 disabled:opacity-30 cursor-pointer"
                        title="Move Menu Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveMainMenu(idx, 'down');
                        }}
                        disabled={idx === menus.length - 1}
                        className="p-1 rounded text-gray-400 hover:text-teal-700 disabled:opacity-30 cursor-pointer"
                        title="Move Menu Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMainMenu(menu.id);
                        }}
                        className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        title="Delete Menu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Top-Level Menu Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-teal-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-black text-teal-900 dark:text-teal-200 uppercase tracking-wide flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-500" />
                {lang === 'en' ? 'Add New Top Main Menu' : 'नयाँ मुख्य मेनु थप्नुहोस्'}
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">English Title</label>
                  <input
                    type="text"
                    value={menuFormLabelEn}
                    onChange={(e) => setMenuFormLabelEn(e.target.value)}
                    placeholder="e.g. Projects"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Nepali Title</label>
                  <input
                    type="text"
                    value={menuFormLabelNe}
                    onChange={(e) => setMenuFormLabelNe(e.target.value)}
                    placeholder="उदा: योजनाहरू"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Menu Type & Behavior</label>
                <select
                  value={menuFormLinkType}
                  onChange={(e) => setMenuFormLinkType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white"
                >
                  <option value="dropdown">Dropdown Menu (Has Submenu items inside)</option>
                  <option value="tab">Direct Internal Page Tab</option>
                  <option value="url">Direct External Link / URL</option>
                </select>
              </div>

              {menuFormLinkType !== 'dropdown' && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
                      {menuFormLinkType === 'url' ? 'External URL (e.g. https://...)' : 'Internal Target Tab Key'}
                    </label>
                    <input
                      type="text"
                      value={menuFormTarget}
                      onChange={(e) => setMenuFormTarget(e.target.value)}
                      placeholder={menuFormLinkType === 'url' ? 'https://example.com' : 'e.g. events, directory, matrimonial'}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white"
                    />
                  </div>

                  {menuFormLinkType === 'tab' && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="text-[10px] text-gray-400 font-bold w-full">Quick Preset Tabs:</span>
                      {presetTabTargets.slice(0, 6).map((preset) => (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => setMenuFormTarget(preset.key)}
                          className="px-2 py-0.5 text-[10px] bg-teal-100/70 dark:bg-slate-800 text-teal-800 dark:text-emerald-300 rounded font-bold hover:bg-teal-200 cursor-pointer"
                        >
                          {preset.nameEn}
                        </button>
                      ))}
                    </div>
                  )}

                  {menuFormLinkType === 'url' && (
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={menuFormOpenInNewTab}
                        onChange={(e) => setMenuFormOpenInNewTab(e.target.checked)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>Open link in new browser tab</span>
                    </label>
                  )}
                </div>
              )}

              <button
                onClick={handleAddMainMenu}
                className="w-full py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {lang === 'en' ? 'Add Main Menu' : 'मुख्य मेनु थप्नुहोस्'}
              </button>
            </div>
          </div>

          {/* Right Column: Manage Selected Menu Properties & Submenus */}
          <div className="lg:col-span-7 space-y-5">
            {currentSelectedMenu ? (
              <>
                {/* Main Menu Properties Editor Box */}
                <div className="bg-teal-50/70 dark:bg-slate-800/60 p-4 rounded-xl border border-teal-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-teal-100 dark:border-slate-700 pb-2">
                    <h3 className="text-xs sm:text-sm font-black text-teal-950 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Settings className="w-4 h-4 text-teal-600" />
                      {lang === 'en' ? `2. Selected Menu: "${currentSelectedMenu.label[lang] || currentSelectedMenu.label.en}"` : `२. छनोट मेनु सम्पादन: "${currentSelectedMenu.label[lang] || currentSelectedMenu.label.ne}"`}
                    </h3>
                  </div>

                  {/* Main Menu Title Edit (English & Nepali) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">English Title</label>
                      <input
                        type="text"
                        value={currentSelectedMenu.label.en}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMenus((prev) =>
                            prev.map((m) =>
                              m.id === currentSelectedMenu.id
                                ? { ...m, label: { ...m.label, en: val } }
                                : m
                            )
                          );
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-teal-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Nepali Title</label>
                      <input
                        type="text"
                        value={currentSelectedMenu.label.ne}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMenus((prev) =>
                            prev.map((m) =>
                              m.id === currentSelectedMenu.id
                                ? { ...m, label: { ...m.label, ne: val } }
                                : m
                            )
                          );
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-teal-950 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Menu Type & Target Link Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Behavior Type</label>
                      <select
                        value={currentSelectedMenu.linkType}
                        onChange={(e) => {
                          const newType = e.target.value as 'dropdown' | 'tab' | 'url';
                          setMenus((prev) =>
                            prev.map((m) =>
                              m.id === currentSelectedMenu.id
                                ? {
                                    ...m,
                                    linkType: newType,
                                    subItems: newType === 'dropdown' ? (m.subItems || []) : undefined,
                                  }
                                : m
                            )
                          );
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-teal-950 dark:text-white"
                      >
                        <option value="dropdown">Dropdown (Holds Submenus)</option>
                        <option value="tab">Internal Page Tab</option>
                        <option value="url">External Web Link / URL</option>
                      </select>
                    </div>

                    {currentSelectedMenu.linkType !== 'dropdown' && (
                      <div>
                        <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
                          {currentSelectedMenu.linkType === 'url' ? 'External URL' : 'Target Page Tab Key'}
                        </label>
                        <input
                          type="text"
                          value={currentSelectedMenu.target || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMenus((prev) =>
                              prev.map((m) =>
                                m.id === currentSelectedMenu.id
                                  ? { ...m, target: val }
                                  : m
                              )
                            );
                          }}
                          placeholder={currentSelectedMenu.linkType === 'url' ? 'https://...' : 'e.g. events, directory'}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-teal-950 dark:text-white"
                        />
                      </div>
                    )}
                  </div>

                  {currentSelectedMenu.linkType === 'tab' && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold w-full">Quick Preset Page Options:</span>
                      {presetTabTargets.map((preset) => (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => {
                            setMenus((prev) =>
                              prev.map((m) =>
                                m.id === currentSelectedMenu.id ? { ...m, target: preset.key } : m
                              )
                            );
                          }}
                          className={`px-2 py-0.5 text-[10px] rounded font-bold transition-all cursor-pointer ${
                            currentSelectedMenu.target === preset.key
                              ? 'bg-teal-700 text-white'
                              : 'bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 text-teal-900 dark:text-emerald-300 hover:bg-teal-100'
                          }`}
                        >
                          {preset.nameEn}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentSelectedMenu.linkType === 'url' && (
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={currentSelectedMenu.openInNewTab || false}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setMenus((prev) =>
                            prev.map((m) =>
                              m.id === currentSelectedMenu.id ? { ...m, openInNewTab: checked } : m
                            )
                          );
                        }}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>Open link in new browser tab when clicked</span>
                    </label>
                  )}
                </div>

                {/* Submenus Management Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-teal-900 dark:text-teal-200 uppercase tracking-wide flex items-center gap-1.5">
                      <FolderPlus className="w-4 h-4 text-emerald-500" />
                      {lang === 'en' ? 'Submenus inside this Menu' : 'यस मेनु भित्रका उप-मेनुहरू'}
                    </h4>

                    <button
                      onClick={() => {
                        setIsAddingSubmenu(!isAddingSubmenu);
                        setEditingSubId(null);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {lang === 'en' ? 'Add Submenu' : 'उप-मेनु थप्नुहोस्'}
                    </button>
                  </div>

                  {/* Add Submenu Inline Form */}
                  {isAddingSubmenu && (
                    <div className="p-4 bg-emerald-50/80 dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-150">
                      <h5 className="text-xs font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                        <Plus className="w-4 h-4 text-emerald-600" />
                        {lang === 'en' ? 'Create New Submenu' : 'नयाँ उप-मेनु विवरण'}
                      </h5>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">English Submenu Title</label>
                          <input
                            type="text"
                            value={subLabelEn}
                            onChange={(e) => setSubLabelEn(e.target.value)}
                            placeholder="e.g. Leadership Team"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Nepali Submenu Title</label>
                          <input
                            type="text"
                            value={subLabelNe}
                            onChange={(e) => setSubLabelNe(e.target.value)}
                            placeholder="उदा: नेतृत्व समूह"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Link Behavior</label>
                          <select
                            value={subLinkType}
                            onChange={(e) => setSubLinkType(e.target.value as any)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white"
                          >
                            <option value="tab">Internal Website Page / Tab</option>
                            <option value="url">External Web Link / URL</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
                            {subLinkType === 'url' ? 'External URL (https://...)' : 'Internal Tab Key'}
                          </label>
                          <input
                            type="text"
                            value={subTarget}
                            onChange={(e) => setSubTarget(e.target.value)}
                            placeholder={subLinkType === 'url' ? 'https://...' : 'e.g. directory, events'}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white"
                          />
                        </div>
                      </div>

                      {subLinkType === 'tab' && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          <span className="text-[10px] text-gray-500 font-bold w-full">Quick Preset Page Options:</span>
                          {presetTabTargets.map((preset) => (
                            <button
                              key={preset.key}
                              type="button"
                              onClick={() => setSubTarget(preset.key)}
                              className="px-2 py-0.5 text-[10px] bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 text-emerald-900 dark:text-emerald-300 rounded font-bold hover:bg-emerald-100 cursor-pointer"
                            >
                              {preset.nameEn}
                            </button>
                          ))}
                        </div>
                      )}

                      {subLinkType === 'url' && (
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={subOpenInNewTab}
                            onChange={(e) => setSubOpenInNewTab(e.target.checked)}
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span>Open link in new browser tab when clicked</span>
                        </label>
                      )}

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setIsAddingSubmenu(false)}
                          className="px-3 py-1.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddSubmenu}
                          className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Confirm Add Submenu
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submenus List with Edit & Order controls */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {currentSelectedMenu.subItems && currentSelectedMenu.subItems.length > 0 ? (
                      currentSelectedMenu.subItems.map((sub, sIdx) => {
                        const isEditingThisSub = editingSubId === sub.id;

                        if (isEditingThisSub) {
                          return (
                            <div key={sub.id} className="p-4 bg-teal-50 dark:bg-slate-800 rounded-xl border-2 border-teal-500 space-y-3 shadow-md animate-in fade-in duration-150">
                              <h5 className="text-xs font-black text-teal-950 dark:text-emerald-400 flex items-center justify-between">
                                <span>Editing Submenu #{sIdx + 1}</span>
                                <button
                                  onClick={() => setEditingSubId(null)}
                                  className="text-gray-400 hover:text-gray-600 text-xs"
                                >
                                  Cancel
                                </button>
                              </h5>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">English Title</label>
                                  <input
                                    type="text"
                                    value={editSubLabelEn}
                                    onChange={(e) => setEditSubLabelEn(e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Nepali Title</label>
                                  <input
                                    type="text"
                                    value={editSubLabelNe}
                                    onChange={(e) => setEditSubLabelNe(e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white font-bold"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Link Type</label>
                                  <select
                                    value={editSubLinkType}
                                    onChange={(e) => setEditSubLinkType(e.target.value as any)}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white"
                                  >
                                    <option value="tab">Internal Page Tab</option>
                                    <option value="url">External Web Link / URL</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
                                    {editSubLinkType === 'url' ? 'External URL (https://...)' : 'Internal Tab Key'}
                                  </label>
                                  <input
                                    type="text"
                                    value={editSubTarget}
                                    onChange={(e) => setEditSubTarget(e.target.value)}
                                    placeholder={editSubLinkType === 'url' ? 'https://...' : 'e.g. events, directory'}
                                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-teal-950 dark:text-white font-bold"
                                  />
                                </div>
                              </div>

                              {editSubLinkType === 'tab' && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  <span className="text-[10px] text-gray-500 font-bold w-full">Presets:</span>
                                  {presetTabTargets.map((preset) => (
                                    <button
                                      key={preset.key}
                                      type="button"
                                      onClick={() => setEditSubTarget(preset.key)}
                                      className={`px-2 py-0.5 text-[10px] rounded font-bold transition-all ${
                                        editSubTarget === preset.key
                                          ? 'bg-teal-700 text-white'
                                          : 'bg-white dark:bg-slate-900 border text-teal-900 dark:text-emerald-300 hover:bg-teal-100'
                                      }`}
                                    >
                                      {preset.nameEn}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {editSubLinkType === 'url' && (
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer pt-1">
                                  <input
                                    type="checkbox"
                                    checked={editSubOpenInNewTab}
                                    onChange={(e) => setEditSubOpenInNewTab(e.target.checked)}
                                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                  />
                                  <span>Open link in new browser tab</span>
                                </label>
                              )}

                              <div className="flex justify-end gap-2 pt-1">
                                <button
                                  onClick={() => setEditingSubId(null)}
                                  className="px-3 py-1.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-bold"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveSubmenuEdits(sub.id)}
                                  className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Update Submenu</span>
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={sub.id}
                            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-slate-800 flex items-center justify-between gap-2 hover:border-teal-300 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <span className="text-teal-600 dark:text-emerald-400 font-bold text-xs">
                                {sIdx + 1}.
                              </span>
                              <div className="truncate">
                                <p className="text-xs font-bold text-teal-950 dark:text-white truncate">
                                  {sub.label[lang] || sub.label.en}
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1 truncate">
                                  {sub.linkType === 'url' ? (
                                    <>
                                      <ExternalLink className="w-3 h-3 text-rose-500 shrink-0" />
                                      <span className="truncate">{sub.target}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Link2 className="w-3 h-3 text-teal-500 shrink-0" />
                                      <span>Tab key: {sub.target}</span>
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleStartEditSubmenu(sub)}
                                className="p-1.5 rounded-lg text-teal-700 dark:text-emerald-400 hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Edit Submenu Title & Link"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleMoveSubmenu(currentSelectedMenu.id, sIdx, 'up')}
                                disabled={sIdx === 0}
                                className="p-1 rounded text-gray-400 hover:text-teal-700 disabled:opacity-30 cursor-pointer"
                                title="Move Submenu Up"
                              >
                                <MoveUp className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleMoveSubmenu(currentSelectedMenu.id, sIdx, 'down')}
                                disabled={sIdx === currentSelectedMenu.subItems!.length - 1}
                                className="p-1 rounded text-gray-400 hover:text-teal-700 disabled:opacity-30 cursor-pointer"
                                title="Move Submenu Down"
                              >
                                <MoveDown className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteSubmenu(currentSelectedMenu.id, sub.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Remove Submenu"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {lang === 'en'
                            ? 'No submenus configured for this menu yet. Click "Add Submenu" above to create one.'
                            : 'यस मेनुमा हाल कुनै उप-मेनु छैन। उप-मेनु थप्न माथिको बटन थिच्नुहोस्।'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-400">
                {lang === 'en' ? 'Select a menu from the left to edit submenus.' : 'सम्पादन गर्न देब्रेबाट मेनु छान्नुहोस्।'}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-teal-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Reset to Default Navigation' : 'मूल मेनुमा पुनर्स्थापित गर्नुहोस्'}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-700 cursor-pointer w-full sm:w-auto"
            >
              {lang === 'en' ? 'Close' : 'बन्द गर्नुहोस्'}
            </button>
            <button
              onClick={handleSaveAll}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'en' ? 'Save & Apply Navigation' : 'नेभिगेसन सेभ गर्नुहोस्'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
