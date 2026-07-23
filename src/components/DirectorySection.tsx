import React, { useState } from 'react';
import { Search, UserCheck, Shield, BookOpen, MapPin, Phone, Mail, CheckCircle2, UserPlus, Trash2, Plus, Sparkles, Edit, Save, X } from 'lucide-react';
import { Language, Member } from '../types';
import { boardMembers as initialBoardMembers } from '../data/communityData';

interface DirectorySectionProps {
  lang: Language;
  onAddMember: (member: Member) => Promise<void>;
  onTrackAction: (actionName: string) => void;
  isAdmin?: boolean;
  membersList?: Member[];
  onDeleteMember?: (id: string) => void;
}

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
  const [selectedCat, setSelectedCat] = useState<'all' | 'chief' | 'secretary' | 'board' | 'general'>('all');
  
  // Nominate member state
  const [showNominateForm, setShowNominateForm] = useState(false);
  const [nomineeNameEn, setNomineeNameEn] = useState('');
  const [nomineeNameNe, setNomineeNameNe] = useState('');
  const [nomineeRoleEn, setNomineeRoleEn] = useState('');
  const [nomineeRoleNe, setNomineeRoleNe] = useState('');
  const [nomineeCat, setNomineeCat] = useState<'chief' | 'secretary' | 'board' | 'general'>('general');
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
  const [editCat, setEditCat] = useState<'chief' | 'secretary' | 'board' | 'general'>('general');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddrEn, setEditAddrEn] = useState('');
  const [editAddrNe, setEditAddrNe] = useState('');
  const [editBioEn, setEditBioEn] = useState('');
  const [editBioNe, setEditBioNe] = useState('');
  const [editPhotoBase64, setEditPhotoBase64] = useState<string>('');
  const [editPhotoName, setEditPhotoName] = useState<string>('');
  const [editUploadProgress, setEditUploadProgress] = useState<boolean>(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert(lang === 'en' ? 'File is too large! Maximum size allowed is 1MB.' : 'फाइल धेरै ठूलो छ! अधिकतम स्वीकृत आकार १MB हो।');
        return;
      }
      setPhotoName(file.name);
      setUploadProgress(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoBase64(reader.result as string);
        setUploadProgress(false);
      };
      reader.onerror = () => {
        setUploadProgress(false);
        alert(lang === 'en' ? 'Failed to read photo file.' : 'फोटो फाइल पढ्न असफल भयो।');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert(lang === 'en' ? 'File is too large! Maximum size allowed is 1MB.' : 'फाइल धेरै ठूलो छ! अधिकतम स्वीकृत आकार १MB हो।');
        return;
      }
      setEditPhotoName(file.name);
      setEditUploadProgress(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhotoBase64(reader.result as string);
        setEditUploadProgress(false);
      };
      reader.onerror = () => {
        setEditUploadProgress(false);
        alert(lang === 'en' ? 'Failed to read photo file.' : 'फोटो फाइल पढ्न असफल भयो।');
      };
      reader.readAsDataURL(file);
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
      avatarUrl: editPhotoBase64 ? '' : editingMember.avatarUrl,
      photoBase64: editPhotoBase64 || undefined,
      photoName: editPhotoName || undefined,
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
      <section className="bg-gradient-to-br from-white to-teal-50/40 p-8 rounded-2xl border border-teal-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black text-teal-950">
            {t.title[lang]}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {t.subTitle[lang]}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setShowNominateForm(!showNominateForm);
              onTrackAction('Toggle Nominate Member Form');
            }}
            className="w-full md:w-auto px-5 py-3.5 bg-teal-700 hover:bg-teal-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4 text-teal-300" />
            {lang === 'en' ? 'Add Member' : 'सदस्य थप्नुहोस्'}
          </button>
        )}
      </section>

      {/* Edit Member Profile Form (Only for Admin) */}
      {isAdmin && editingMember && (
        <section className="bg-teal-50 border-2 border-emerald-500 p-6 sm:p-8 rounded-2xl shadow-lg space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="border-b border-emerald-500 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-teal-950 flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-600 animate-pulse" />
                {lang === 'en' ? 'Edit Member Profile' : 'सदस्य प्रोफाइल सम्पादन गर्नुहोस्'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'en' ? `Editing details for ${editingMember.name.en}` : `${editingMember.name.ne} का विवरणहरू सम्पादन गर्दै`}
              </p>
            </div>
            <button
              onClick={() => setEditingMember(null)}
              className="p-1.5 bg-gray-200/50 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Full Name (English) *</label>
              <input
                type="text"
                required
                value={editNameEn}
                onChange={(e) => setEditNameEn(e.target.value)}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">पूरा नाम (नेपाली) *</label>
              <input
                type="text"
                required
                value={editNameNe}
                onChange={(e) => setEditNameNe(e.target.value)}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Designated Role (English) *</label>
              <input
                type="text"
                required
                value={editRoleEn}
                onChange={(e) => setEditRoleEn(e.target.value)}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">भूमिका / पद (नेपाली) *</label>
              <input
                type="text"
                required
                value={editRoleNe}
                onChange={(e) => setEditRoleNe(e.target.value)}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Category Committee *</label>
              <select
                value={editCat}
                onChange={(e) => setEditCat(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
              >
                <option value="chief">Chief Leaders (मुख्य नेतृत्व)</option>
                <option value="secretary">Secretariat (सचिवालय)</option>
                <option value="board">Board Advisors (सल्लाहकार बोर्ड)</option>
                <option value="general">General Member (साधारण सदस्य)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Phone Number (WhatsApp)</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Email Address</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Address (English)</label>
              <input
                type="text"
                value={editAddrEn}
                onChange={(e) => setEditAddrEn(e.target.value)}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">ठेगाना (नेपाली)</label>
              <input
                type="text"
                value={editAddrNe}
                onChange={(e) => setEditAddrNe(e.target.value)}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-700">Biography (English)</label>
              <textarea
                value={editBioEn}
                onChange={(e) => setEditBioEn(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-gray-700">जीवनी (नेपाली)</label>
              <textarea
                value={editBioNe}
                onChange={(e) => setEditBioNe(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Photo Upload Field for Editing */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-teal-950 block mb-1">
                {lang === 'en' ? "Update Profile Photo" : "प्रोफाइल फोटो अपडेट गर्नुहोस्"}
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-teal-300 border-dashed rounded-xl bg-white hover:bg-teal-50/20 transition-all">
                <div className="space-y-1 text-center">
                  {editPhotoBase64 ? (
                    <div className="flex flex-col items-center space-y-2">
                      <img
                        src={editPhotoBase64}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-teal-600 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs text-teal-800 font-semibold">{editPhotoName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditPhotoBase64('');
                          setEditPhotoName('');
                        }}
                        className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[10px] font-bold uppercase transition-colors"
                      >
                        Remove New Photo
                      </button>
                    </div>
                  ) : (
                    <>
                      {editingMember.avatarUrl && (
                        <div className="flex flex-col items-center space-y-2 mb-2">
                          <img
                            src={editingMember.avatarUrl}
                            alt="Current"
                            className="w-16 h-16 rounded-full object-cover border border-teal-100 shadow-inner"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[10px] text-gray-400 font-semibold">Current Profile Photo</span>
                        </div>
                      )}
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="edit-photo-upload"
                          className="relative cursor-pointer bg-white rounded-md font-bold text-teal-700 hover:text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
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
                    <div className="text-xs text-teal-600 font-medium animate-pulse mt-2">
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
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Nominate Member Profile Form Modal/Accordion */}
      {isAdmin && showNominateForm && (
        <section className="bg-teal-50/50 border border-teal-200 p-6 sm:p-8 rounded-2xl shadow-inner space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="border-b border-teal-200 pb-4">
            <h3 className="text-xl font-bold text-teal-950 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-700" />
              {lang === 'en' ? 'Add New Member Profile' : 'नयाँ सदस्य थप्नुहोस्'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {lang === 'en' ? 'Fill out the form below to publish this member directly to the directory.' : 'डाइरेक्टरीमा प्रकाशित गर्न तलको फारम भर्नुहोस्।'}
            </p>
          </div>

          {formSuccess ? (
            <div className="p-4 bg-teal-100 border border-teal-300 rounded-xl flex items-start gap-3 text-teal-900 font-semibold text-sm animate-in zoom-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>{t.formSuccessMsg[lang]}</div>
            </div>
          ) : (
            <form onSubmit={handleNominateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Full Name (English) *</label>
                <input
                  type="text"
                  required
                  value={nomineeNameEn}
                  onChange={(e) => setNomineeNameEn(e.target.value)}
                  placeholder="e.g., Sunil Chaurasiya"
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">पूरा नाम (नेपाली) *</label>
                <input
                  type="text"
                  required
                  value={nomineeNameNe}
                  onChange={(e) => setNomineeNameNe(e.target.value)}
                  placeholder="जस्तै, सुनिल चौरसिया"
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Designated Role (English) *</label>
                <input
                  type="text"
                  required
                  value={nomineeRoleEn}
                  onChange={(e) => setNomineeRoleEn(e.target.value)}
                  placeholder="e.g., District Secretary Coordinator"
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">भूमिका / पद (नेपाली) *</label>
                <input
                  type="text"
                  required
                  value={nomineeRoleNe}
                  onChange={(e) => setNomineeRoleNe(e.target.value)}
                  placeholder="जस्तै, जिल्ला सचिव संयोजक"
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Category Committee *</label>
                <select
                  value={nomineeCat}
                  onChange={(e) => setNomineeCat(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                >
                  <option value="chief">Chief Leaders (मुख्य नेतृत्व)</option>
                  <option value="secretary">Secretariat (सचिवालय)</option>
                  <option value="board">Board Advisors (सल्लाहकार बोर्ड)</option>
                  <option value="general">General Member (साधारण सदस्य)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Phone Number (WhatsApp)</label>
                <input
                  type="text"
                  value={nomineePhone}
                  onChange={(e) => setNomineePhone(e.target.value)}
                  placeholder="e.g., +977-9800000000"
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={nomineeEmail}
                  onChange={(e) => setNomineeEmail(e.target.value)}
                  placeholder="nominee@gmail.com"
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Address (English)</label>
                <input
                  type="text"
                  value={nomineeAddrEn}
                  onChange={(e) => setNomineeAddrEn(e.target.value)}
                  placeholder="e.g., Birgunj, Nepal"
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Biography/Profile Introduction (Bilingual)</label>
                <textarea
                  value={nomineeBioEn}
                  onChange={(e) => setNomineeBioEn(e.target.value)}
                  placeholder="Write a brief intro bio about their professional background and community services."
                  rows={2}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Photo Upload Field */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-teal-950 block mb-1">
                  {lang === 'en' ? "Profile Photo (Optional)" : "प्रोफाइल फोटो (वैकल्पिक)"}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-teal-300 border-dashed rounded-xl bg-white hover:bg-teal-50/20 transition-all">
                  <div className="space-y-1 text-center">
                    {photoBase64 ? (
                      <div className="flex flex-col items-center space-y-2">
                        <img
                          src={photoBase64}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-teal-600 shadow-md"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs text-teal-800 font-semibold">{photoName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoBase64('');
                            setPhotoName('');
                          }}
                          className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-[10px] font-bold uppercase transition-colors"
                        >
                          {lang === 'en' ? 'Remove Photo' : 'फोटो हटाउनुहोस्'}
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-10 w-10 text-teal-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label
                            htmlFor="photo-upload"
                            className="relative cursor-pointer bg-white rounded-md font-bold text-teal-700 hover:text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
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
                          <p className="pl-1">{lang === 'en' ? 'or click' : 'वा क्लिक गर्नुहोस्'}</p>
                        </div>
                        <p className="text-xs text-gray-400">{lang === 'en' ? 'PNG, JPG, GIF up to 1MB' : 'PNG, JPG, GIF अधिकतम १MB सम्म'}</p>
                      </>
                    )}
                    {uploadProgress && (
                      <div className="text-xs text-teal-600 font-medium animate-pulse mt-2">
                        {lang === 'en' ? 'Processing file...' : 'फाइल प्रक्रियामा छ...'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-800 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all"
                >
                  Confirm and Lodge Nomination
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* Interactive Controls & Filters */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-teal-600/60" />
            <input
              type="text"
              placeholder={t.searchLabel[lang]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-teal-100 rounded-xl text-sm focus:outline-none focus:border-teal-500 shadow-sm text-teal-900"
            />
          </div>

          {/* Role Filters */}
          <div className="md:col-span-7 flex flex-wrap gap-1.5 justify-start md:justify-end items-center">
            {([
              { key: 'all', label: t.cat_all },
              { key: 'chief', label: t.cat_chief },
              { key: 'secretary', label: t.cat_secretary },
              { key: 'board', label: t.cat_board },
              { key: 'general', label: t.cat_general },
            ] as const).map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedCat(cat.key);
                  onTrackAction(`Filter directory by ${cat.key}`);
                }}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedCat === cat.key
                    ? 'bg-teal-800 text-white shadow-sm'
                    : 'bg-white text-teal-800 hover:bg-teal-50 border border-teal-100'
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
              className="bg-white border border-teal-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-200 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Card visual highlight accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-teal-700 group-hover:bg-emerald-500 transition-colors" />

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-teal-50 border-2 border-teal-200 shrink-0">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name[lang]}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-teal-700 bg-teal-100">
                        {member.name[lang].charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-teal-950 group-hover:text-teal-700 transition-colors">
                      {member.name[lang]}
                    </h3>
                    <p className="text-xs font-bold text-teal-600/90 uppercase tracking-wide flex items-center gap-1 mt-0.5">
                      <Shield className="w-3.5 h-3.5 text-teal-500" />
                      {member.role[lang]}
                    </p>
                    <span className="inline-block mt-1.5 text-[9px] font-black bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded uppercase">
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
                  <p className="text-gray-600 text-xs leading-relaxed border-t border-teal-50/50 pt-3">
                    {member.bio[lang]}
                  </p>
                )}

                {/* Contact items */}
                <div className="space-y-1.5 pt-2 text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-600/70 shrink-0" />
                    <span>{member.address[lang]}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-teal-600/70 shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
                      <Mail className="w-3.5 h-3.5 text-teal-600/70 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Button Action */}
              <div className="pt-4 mt-4 border-t border-teal-50 flex items-center justify-between">
                {isAdmin && onDeleteMember ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartEdit(member)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-[11px] font-bold rounded-lg transition-colors"
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
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold rounded-lg transition-colors"
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
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold tracking-wide rounded-lg uppercase transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {t.contactBtn[lang]}
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-teal-50/20 border border-dashed border-teal-200 rounded-2xl text-gray-500">
            No community profiles match your criteria.
          </div>
        )}
      </section>
    </div>
  );
}
