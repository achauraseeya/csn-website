import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Shield, BookOpen, MapPin, Phone, Mail, CheckCircle2, UserPlus, Trash2, Plus, Sparkles, Edit, Save, X } from 'lucide-react';
import { Language, Member } from '../types';
import { boardMembers as initialBoardMembers } from '../data/communityData';
import { formatNumber } from '../utils/mediaUrl';
import { AdminCategoryManagerModal } from './AdminCategoryManagerModal';
import { getMemberCategories, MemberCategory } from '../utils/memberCategories';
import { getCustomFormFields, CustomFormField } from '../utils/customFormFields';

interface DirectorySectionProps {
  lang: Language;
  onAddMember: (member: Member) => Promise<void>;
  onTrackAction: (actionName: string) => void;
  isAdmin?: boolean;
  membersList?: Member[];
  onDeleteMember?: (id: string) => void;
}

import { compressImageToBase64 } from '../utils/imageUtils';

export default function DirectorySection({
  lang,
  onAddMember,
  onTrackAction,
  isAdmin = false,
  membersList = initialBoardMembers,
  onDeleteMember,
}: DirectorySectionProps) {
  const members = membersList.length > 0 ? membersList : initialBoardMembers;
  const [searchTerm, setSearchTerm] = useState('');
  const [memberCats, setMemberCats] = useState<MemberCategory[]>(() => getMemberCategories());
  const [selectedCat, setSelectedCat] = useState<string>('all');
  
  // Custom fields
  const [customFields, setCustomFields] = useState<CustomFormField[]>(() => getCustomFormFields('membership'));
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});

  const refreshCategories = () => {
    setMemberCats(getMemberCategories());
  };

  // Nominate member state
  const [showNominateForm, setShowNominateForm] = useState(false);
  const [nomineeNameEn, setNomineeNameEn] = useState('');
  const [nomineeNameNe, setNomineeNameNe] = useState('');
  const [nomineeRoleEn, setNomineeRoleEn] = useState('');
  const [nomineeRoleNe, setNomineeRoleNe] = useState('');
  const [nomineeCat, setNomineeCat] = useState<string>('general');
  const [nomineePhone, setNomineePhone] = useState('');
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [nomineeAddrEn, setNomineeAddrEn] = useState('');
  const [nomineeAddrNe, setNomineeAddrNe] = useState('');
  const [nomineeBioEn, setNomineeBioEn] = useState('');
  const [nomineeBioNe, setNomineeBioNe] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [photoName, setPhotoName] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);

  // Editing state
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editNameEn, setEditNameEn] = useState('');
  const [editNameNe, setEditNameNe] = useState('');
  const [editRoleEn, setEditRoleEn] = useState('');
  const [editRoleNe, setEditRoleNe] = useState('');
  const [editCat, setEditCat] = useState<string>('general');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddrEn, setEditAddrEn] = useState('');
  const [editAddrNe, setEditAddrNe] = useState('');
  const [editBioEn, setEditBioEn] = useState('');
  const [editBioNe, setEditBioNe] = useState('');
  const [editPhotoBase64, setEditPhotoBase64] = useState<string>('');
  const [editPhotoName, setEditPhotoName] = useState<string>('');
  const [editUploadProgress, setEditUploadProgress] = useState<boolean>(false);

  // Back button handling for popstate
  useEffect(() => {
    const handlePopState = () => {
      if (editingMember) {
        setEditingMember(null);
      } else if (showNominateForm) {
        setShowNominateForm(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [editingMember, showNominateForm]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(lang === 'en' ? 'File is too large! Maximum size allowed is 2MB.' : 'फाइल धेरै ठूलो छ! अधिकतम स्वीकृत आकार २MB हो।');
        return;
      }
      setPhotoName(file.name);
      setUploadProgress(true);
      try {
        const base64 = await compressImageToBase64(file, 500);
        setPhotoBase64(base64);
      } catch (err) {
        alert(lang === 'en' ? 'Failed to read photo file.' : 'फोटो फाइल पढ्न असफल भयो।');
      } finally {
        setUploadProgress(false);
      }
    }
  };

  const handleEditPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(lang === 'en' ? 'File is too large! Maximum size allowed is 2MB.' : 'फाइल धेरै ठूलो छ! अधिकतम स्वीकृत आकार २MB हो।');
        return;
      }
      setEditPhotoName(file.name);
      setEditUploadProgress(true);
      try {
        const base64 = await compressImageToBase64(file, 500);
        setEditPhotoBase64(base64);
      } catch (err) {
        alert(lang === 'en' ? 'Failed to read photo file.' : 'फोटो फाइल पढ्न असफल भयो।');
      } finally {
        setEditUploadProgress(false);
      }
    }
  };

  const handleStartEdit = (member: Member) => {
    setEditingMember(member);
    setEditNameEn(member.name.en);
    setEditNameNe(member.name.ne);
    setEditRoleEn(member.role.en);
    setEditRoleNe(member.role.ne);
    setEditCat(member.category);
    setEditPhone(member.phone || '');
    setEditEmail(member.email || '');
    setEditAddrEn(member.address.en);
    setEditAddrNe(member.address.ne);
    setEditBioEn(member.bio ? member.bio.en : '');
    setEditBioNe(member.bio ? member.bio.ne : '');
    setEditPhotoBase64('');
    setEditPhotoName('');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editNameEn || !editNameNe || !editRoleEn || !editRoleNe) return;

    const updatedMember: Member = {
      ...editingMember,
      name: { en: editNameEn, ne: editNameNe },
      role: { en: editRoleEn, ne: editRoleNe },
      category: editCat,
      phone: editPhone,
      email: editEmail,
      address: { en: editAddrEn || 'Nepal', ne: editAddrNe || 'नेपाल' },
      bio: { en: editBioEn || 'Community Member', ne: editBioNe || 'सामुदायिक सदस्य' },
      avatarUrl: editPhotoBase64 || editingMember.avatarUrl || '',
      photoBase64: editPhotoBase64 || editingMember.photoBase64 || undefined,
      photoName: editPhotoName || editingMember.photoName || undefined,
    };

    await onAddMember(updatedMember);
    setEditingMember(null);
    onTrackAction(`Edit member profile: ${editNameEn}`);
  };

  const t = {
    title: { en: 'Esteemed Members & Leadership Directory', ne: 'प्रतिष्ठित सदस्य र नेतृत्व निर्देशिका' },
    subTitle: {
      en: 'Meet our executive committee, national secretaries, and core community coordinators dedicated to the samaj.',
      ne: 'समाजमा समर्पित हाम्रा कार्यकारी समिति, राष्ट्रिय सचिवहरू र प्रमुख सामुदायिक संयोजकहरूलाई भेट्नुहोस्।',
    },
    searchLabel: { en: 'Search by Name, Role, or Address...', ne: 'नाम, भूमिका वा ठेगानाद्वारा खोज्नुहोस्...' },
    nominateBtn: { en: 'Submit Member Profile Nomination', ne: 'सदस्य प्रोफाइल मनोनयन पेश गर्नुहोस्' },
    cat_all: { en: 'All Roles', ne: 'सबै भूमिकाहरू' },
    cat_chief: { en: 'Chief Leaders', ne: 'मुख्य नेतृत्व' },
    cat_secretary: { en: 'Secretariat', ne: 'सचिवालय' },
    cat_board: { en: 'Board Advisers', ne: 'सल्लाहकार बोर्ड' },
    cat_general: { en: 'General Members', ne: 'साधारण सदस्यहरू' },
    contactBtn: { en: 'Contact Directly', ne: 'सिधा सम्पर्क गर्नुहोस्' },
    formTitle: { en: 'Nominate Community Member Profile', ne: 'सामुदायिक सदस्य प्रोफाइल मनोनयन गर्नुहोस्' },
    formSub: {
      en: 'Nominate outstanding community members, social workers, or secretaries to be listed in the official directory. Review is led by Abhishek Kumar Chaurasiya.',
      ne: 'आधिकारिक निर्देशिकामा सूचीकृत हुनका लागि उत्कृष्ट समुदायका सदस्यहरू, सामाजिक कार्यकर्ताहरू वा सचिवहरूलाई मनोनयन गर्नुहोस्। समीक्षा अभिषेक कुमार चौरसियाको नेतृत्वमा हुनेछ।',
    },
    formSuccessMsg: {
      en: 'Nomination submitted successfully to the executive council committee! Verification initiated.',
      ne: 'कार्यकारी परिषद् समितिमा मनोनयन सफलतापूर्वक दर्ता गरियो! प्रमाणीकरण सुरु भयो।',
    },
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.address[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.bio && m.bio[lang].toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCat = selectedCat === 'all' || m.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleNominateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomineeNameEn || !nomineeNameNe || !nomineeRoleEn || !nomineeRoleNe) return;

    const newNominee: Member = {
      id: `m-nom-${Date.now()}`,
      name: { en: nomineeNameEn, ne: nomineeNameNe },
      role: { en: nomineeRoleEn, ne: nomineeRoleNe },
      category: nomineeCat,
      phone: nomineePhone,
      email: nomineeEmail,
      address: { en: nomineeAddrEn || 'Nepal', ne: nomineeAddrNe || 'नेपाल' },
      bio: { en: nomineeBioEn || 'Nominated Community Member', ne: nomineeBioNe || 'मनोनित सामुदायिक सदस्य' },
      avatarUrl: photoBase64 ? '' : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      photoBase64: photoBase64 || undefined,
      photoName: photoName || undefined,
    };

    await onAddMember(newNominee);
    setFormSuccess(true);
    onTrackAction(`Nominate member: ${nomineeNameEn}`);

    setTimeout(() => {
      setFormSuccess(false);
      setShowNominateForm(false);
      // Reset form fields
      setNomineeNameEn('');
      setNomineeNameNe('');
      setNomineeRoleEn('');
      setNomineeRoleNe('');
      setNomineeCat('general');
      setNomineePhone('');
      setNomineeEmail('');
      setNomineeAddrEn('');
      setNomineeAddrNe('');
      setNomineeBioEn('');
      setNomineeBioNe('');
      setPhotoBase64('');
      setPhotoName('');
    }, 5000);
  };

  return (
    <div className="space-y-10">
      {/* Directory Intro */}
      <section className="bg-gradient-to-br from-white to-teal-50/40 dark:from-slate-900 dark:to-slate-800/80 p-8 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black text-teal-950 dark:text-teal-100">
            {t.title[lang]}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            {t.subTitle[lang]}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setShowNominateForm(!showNominateForm);
              onTrackAction('Toggle Nominate Member Form');
            }}
            className="w-full md:w-auto px-5 py-3.5 bg-teal-700 dark:bg-emerald-600 hover:bg-teal-600 dark:hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-teal-300" />
            {lang === 'en' ? 'Add Member' : 'सदस्य थप्नुहोस्'}
          </button>
        )}
      </section>

      {/* Admin Committee Categories Manager */}
      {isAdmin && (
        <AdminCategoryManagerModal
          lang={lang}
          isAdmin={isAdmin}
          onCategoriesUpdated={refreshCategories}
        />
      )}

      {/* Edit Member Profile Form Modal (Only for Admin) */}
      {isAdmin && editingMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center min-h-screen overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 text-gray-900 dark:text-white my-auto max-h-[92vh] flex flex-col w-full max-w-2xl sm:max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 space-y-4 sm:space-y-6 animate-in zoom-in-95 duration-200 overflow-y-auto">
            <div className="border-b border-emerald-500 pb-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold text-teal-950 dark:text-teal-100 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  {lang === 'en' ? 'Edit Member Profile' : 'सदस्य प्रोफाइल सम्पादन गर्नुहोस्'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {lang === 'en' ? `Editing details for ${editingMember.name.en}` : `${editingMember.name.ne} का विवरणहरू सम्पादन गर्दै`}
                </p>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Full Name (English) *</label>
                <input
                  type="text"
                  required
                  value={editNameEn}
                  onChange={(e) => setEditNameEn(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">पूरा नाम (नेपाली) *</label>
                <input
                  type="text"
                  required
                  value={editNameNe}
                  onChange={(e) => setEditNameNe(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Designated Role (English) *</label>
                <input
                  type="text"
                  required
                  value={editRoleEn}
                  onChange={(e) => setEditRoleEn(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">भूमिका / पद (नेपाली) *</label>
                <input
                  type="text"
                  required
                  value={editRoleNe}
                  onChange={(e) => setEditRoleNe(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Category Committee *</label>
                <select
                  value={editCat}
                  onChange={(e) => setEditCat(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                >
                  {memberCats.map((cat) => (
                    <option key={cat.id} value={cat.code} className="dark:bg-slate-900 text-gray-900 dark:text-white">
                      {cat.label[lang]} {cat.feeInfo ? `(${cat.feeInfo})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Phone Number (WhatsApp)</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Address (English)</label>
                <input
                  type="text"
                  value={editAddrEn}
                  onChange={(e) => setEditAddrEn(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">ठेगाना (नेपाली)</label>
                <input
                  type="text"
                  value={editAddrNe}
                  onChange={(e) => setEditAddrNe(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Biography (English)</label>
                <textarea
                  value={editBioEn}
                  onChange={(e) => setEditBioEn(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">जीवनी (नेपाली)</label>
                <textarea
                  value={editBioNe}
                  onChange={(e) => setEditBioNe(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Photo Upload Field for Editing */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-teal-950 dark:text-teal-100 block mb-1">
                  {lang === 'en' ? "Update Profile Photo" : "प्रोफाइल फोटो अपडेट गर्नुहोस्"}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-teal-300 dark:border-slate-700 border-dashed rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-teal-50/20 transition-all">
                  <div className="space-y-1 text-center">
                    {editPhotoBase64 ? (
                      <div className="flex flex-col items-center space-y-2">
                        <img
                          src={editPhotoBase64}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-teal-600 shadow-md"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs text-teal-800 dark:text-teal-200 font-semibold">{editPhotoName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditPhotoBase64('');
                            setEditPhotoName('');
                          }}
                          className="px-2.5 py-1 bg-red-100 dark:bg-red-950/60 hover:bg-red-200 dark:hover:bg-red-900 text-red-700 dark:text-red-300 rounded text-[10px] font-bold uppercase transition-colors"
                        >
                          Remove New Photo
                        </button>
                      </div>
                    ) : (
                      <>
                        {(editingMember.photoBase64 || editingMember.avatarUrl) && (
                          <div className="flex flex-col items-center space-y-2 mb-2">
                            <img
                              src={editingMember.photoBase64 || editingMember.avatarUrl}
                              alt="Current"
                              className="w-16 h-16 rounded-full object-cover border border-teal-100 dark:border-slate-700 shadow-inner"
                              referrerPolicy="no-referrer"
                            />
                            <span className="text-[10px] text-gray-400 font-semibold">Current Profile Photo</span>
                          </div>
                        )}
                        <div className="flex text-sm text-gray-600 dark:text-gray-300 justify-center">
                          <label
                            htmlFor="edit-photo-upload"
                            className="relative cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md font-bold text-teal-700 dark:text-emerald-400 hover:text-teal-600"
                          >
                            <span>{lang === 'en' ? 'Upload a new photo' : 'नयाँ फोटो अपलोड गर्नुहोस्'}</span>
                            <input
                              id="edit-photo-upload"
                              name="edit-photo-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleEditPhotoChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 1MB</p>
                      </>
                    )}
                    {editUploadProgress && (
                      <div className="text-xs text-teal-600 dark:text-emerald-400 font-medium animate-pulse mt-2">
                        Processing file...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={editUploadProgress}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-6 py-3 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nominate / Add Member Profile Form Modal (Only for Admin) */}
      {isAdmin && showNominateForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center min-h-screen overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-800 text-gray-900 dark:text-white my-auto max-h-[92vh] flex flex-col w-full max-w-2xl sm:max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 space-y-4 sm:space-y-6 animate-in zoom-in-95 duration-200 overflow-y-auto">
            <div className="border-b border-teal-200 dark:border-slate-800 pb-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold text-teal-950 dark:text-teal-100 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-700 dark:text-emerald-400" />
                  {lang === 'en' ? 'Add New Member Profile' : 'नयाँ सदस्य थप्नुहोस्'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {lang === 'en' ? 'Fill out the form below to publish this member directly to the directory.' : 'डाइरेक्टरीमा प्रकाशित गर्न तलको फारम भर्नुहोस्।'}
                </p>
              </div>
              <button
                onClick={() => setShowNominateForm(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess ? (
              <div className="p-4 bg-teal-100 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-800 rounded-xl flex items-start gap-3 text-teal-900 dark:text-teal-200 font-semibold text-sm animate-in zoom-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>{t.formSuccessMsg[lang]}</div>
              </div>
            ) : (
              <form onSubmit={handleNominateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Full Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={nomineeNameEn}
                    onChange={(e) => setNomineeNameEn(e.target.value)}
                    placeholder="e.g., Sunil Chaurasiya"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">पूरा नाम (नेपाली) *</label>
                  <input
                    type="text"
                    required
                    value={nomineeNameNe}
                    onChange={(e) => setNomineeNameNe(e.target.value)}
                    placeholder="जस्तै, सुनिल चौरसिया"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Designated Role (English) *</label>
                  <input
                    type="text"
                    required
                    value={nomineeRoleEn}
                    onChange={(e) => setNomineeRoleEn(e.target.value)}
                    placeholder="e.g., District Secretary Coordinator"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">भूमिका / पद (नेपाली) *</label>
                  <input
                    type="text"
                    required
                    value={nomineeRoleNe}
                    onChange={(e) => setNomineeRoleNe(e.target.value)}
                    placeholder="जस्तै, जिल्ला सचिव संयोजक"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Category Committee *</label>
                  <select
                    value={nomineeCat}
                    onChange={(e) => setNomineeCat(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  >
                    {memberCats.map((cat) => (
                      <option key={cat.id} value={cat.code} className="dark:bg-slate-900 text-gray-900 dark:text-white">
                        {cat.label[lang]} {cat.feeInfo ? `(${cat.feeInfo})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Phone Number (WhatsApp)</label>
                  <input
                    type="text"
                    value={nomineePhone}
                    onChange={(e) => setNomineePhone(e.target.value)}
                    placeholder="e.g., +977-9800000000"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                  <input
                    type="email"
                    value={nomineeEmail}
                    onChange={(e) => setNomineeEmail(e.target.value)}
                    placeholder="nominee@gmail.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Address (English)</label>
                  <input
                    type="text"
                    value={nomineeAddrEn}
                    onChange={(e) => setNomineeAddrEn(e.target.value)}
                    placeholder="e.g., Birgunj, Nepal"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Biography/Profile Introduction (Bilingual)</label>
                  <textarea
                    value={nomineeBioEn}
                    onChange={(e) => setNomineeBioEn(e.target.value)}
                    placeholder="Write a brief intro bio about their professional background and community services."
                    rows={2}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Photo Upload Field */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-teal-950 dark:text-teal-100 block mb-1">
                    {lang === 'en' ? "Profile Photo (Optional)" : "प्रोफाइल फोटो (वैकल्पिक)"}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-teal-300 dark:border-slate-700 border-dashed rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-teal-50/20 transition-all">
                    <div className="space-y-1 text-center">
                      {photoBase64 ? (
                        <div className="flex flex-col items-center space-y-2">
                          <img
                            src={photoBase64}
                            alt="Preview"
                            className="w-20 h-20 rounded-full object-cover border-2 border-teal-600 shadow-md"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-xs text-teal-800 dark:text-teal-200 font-semibold">{photoName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoBase64('');
                              setPhotoName('');
                            }}
                            className="px-2.5 py-1 bg-red-100 dark:bg-red-950/60 hover:bg-red-200 text-red-700 dark:text-red-300 rounded text-[10px] font-bold uppercase transition-colors"
                          >
                            {lang === 'en' ? 'Remove Photo' : 'फोटो हटाउनुहोस्'}
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex text-sm text-gray-600 dark:text-gray-300 justify-center">
                            <label
                              htmlFor="photo-upload"
                              className="relative cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md font-bold text-teal-700 dark:text-emerald-400 hover:text-teal-600"
                            >
                              <span>{lang === 'en' ? 'Upload a photo' : 'फोटो अपलोड गर्नुहोस्'}</span>
                              <input
                                id="photo-upload"
                                name="photo-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handlePhotoChange}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-400">{lang === 'en' ? 'PNG, JPG, GIF up to 1MB' : 'PNG, JPG, GIF अधिकतम १MB सम्म'}</p>
                        </>
                      )}
                      {uploadProgress && (
                        <div className="text-xs text-teal-600 dark:text-emerald-400 font-medium animate-pulse mt-2">
                          {lang === 'en' ? 'Processing file...' : 'फाइल प्रक्रियामा छ...'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-teal-800 hover:bg-teal-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Confirm and Lodge Nomination
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNominateForm(false)}
                    className="px-6 py-3 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Interactive Controls & Filters */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-teal-600/60 dark:text-emerald-400/60" />
            <input
              type="text"
              placeholder={t.searchLabel[lang]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-teal-100 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-teal-500 shadow-sm text-teal-900 dark:text-teal-100 placeholder:text-gray-400"
            />
          </div>

          {/* Role Filters */}
          <div className="md:col-span-7 flex flex-wrap gap-1.5 justify-start md:justify-end items-center">
            <button
              onClick={() => {
                setSelectedCat('all');
                onTrackAction('Filter directory by all');
              }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-teal-800 dark:bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-slate-700 border border-teal-100 dark:border-slate-700'
              }`}
            >
              {t.cat_all[lang]}
            </button>
            {memberCats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCat(cat.code);
                  onTrackAction(`Filter directory by ${cat.code}`);
                }}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedCat === cat.code
                    ? 'bg-teal-800 dark:bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-slate-700 border border-teal-100 dark:border-slate-700'
                }`}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-900 border border-teal-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-200 dark:hover:border-slate-700 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Card visual highlight accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-700 dark:bg-emerald-600 group-hover:bg-emerald-500 transition-colors" />

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-teal-50 dark:bg-slate-800 border-2 border-teal-200 dark:border-slate-700 shrink-0">
                    {member.photoBase64 || member.avatarUrl ? (
                      <img
                        src={member.photoBase64 || member.avatarUrl}
                        alt={member.name[lang]}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-teal-700 dark:text-emerald-400 bg-teal-100 dark:bg-slate-800">
                        {member.name[lang].charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-teal-950 dark:text-teal-100 group-hover:text-teal-700 dark:group-hover:text-emerald-400 transition-colors">
                      {formatNumber(member.name[lang], lang)}
                    </h3>
                    <p className="text-xs font-bold text-teal-600/90 dark:text-emerald-400/90 uppercase tracking-wide flex items-center gap-1 mt-0.5">
                      <Shield className="w-3.5 h-3.5 text-teal-500 dark:text-emerald-400" />
                      {formatNumber(member.role[lang], lang)}
                    </p>
                    <span className="inline-block mt-1.5 text-[9px] font-black bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-slate-700 px-2 py-0.5 rounded uppercase">
                      {member.category === 'chief'
                        ? 'Presidency'
                        : member.category === 'secretary'
                        ? 'Secretariat'
                        : member.category === 'board'
                        ? 'Advisory Board'
                        : 'General Council'}
                    </span>
                  </div>
                </div>

                {/* Bio text */}
                {member.bio && (
                  <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed border-t border-teal-50/50 dark:border-slate-800 pt-3">
                    {formatNumber(member.bio[lang], lang)}
                  </p>
                )}

                {/* Contact items */}
                <div className="space-y-1.5 pt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-600/70 dark:text-emerald-400/70 shrink-0" />
                    <span>{formatNumber(member.address[lang], lang)}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-teal-600/70 dark:text-emerald-400/70 shrink-0" />
                      <span>{formatNumber(member.phone, lang)}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
                      <Mail className="w-3.5 h-3.5 text-teal-600/70 dark:text-emerald-400/70 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Button Action */}
              <div className="pt-4 mt-4 border-t border-teal-50 dark:border-slate-800 flex items-center justify-between">
                {isAdmin && onDeleteMember ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartEdit(member)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 text-teal-700 dark:text-emerald-300 text-[11px] font-bold rounded-lg transition-colors"
                      title="Edit Member"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove "${member.name[lang]}" from the directory?`)) {
                          onDeleteMember(member.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-[11px] font-bold rounded-lg transition-colors"
                      title="Delete Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                ) : <div />}

                <a
                  href={member.email ? `mailto:${member.email}` : '#'}
                  onClick={() => onTrackAction(`Click Contact Member: ${member.name[lang]}`)}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 text-teal-800 dark:text-teal-200 text-[11px] font-bold tracking-wide rounded-lg uppercase transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {t.contactBtn[lang]}
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-teal-50/20 dark:bg-slate-800/20 border border-dashed border-teal-200 dark:border-slate-800 rounded-2xl text-gray-500 dark:text-gray-400">
            No community profiles match your criteria.
          </div>
        )}
      </section>
    </div>
  );
}
