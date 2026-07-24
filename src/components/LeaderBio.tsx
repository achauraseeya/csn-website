import React, { useState } from 'react';
import { Mail, Phone, MapPin, Briefcase, Award, GraduationCap, Compass, ArrowLeft, Edit, Save, X, Facebook, Twitter, Linkedin, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Language, Member } from '../types';
import { boardMembers } from '../data/communityData';
import { formatNumber } from '../utils/mediaUrl';

interface LeaderBioProps {
  lang: Language;
  leaderId: string | null;
  members?: Member[];
  membersList?: Member[];
  onTrackAction: (actionName: string) => void;
  onNavigate?: (tab: string) => void;
  isAdmin?: boolean;
  onUpdateMember?: (updated: Member) => void;
}

export default function LeaderBio({
  lang,
  leaderId,
  members = [],
  membersList = [],
  onTrackAction,
  onNavigate,
  isAdmin = false,
  onUpdateMember
}: LeaderBioProps) {
  // Combine custom members list and board members
  const effectiveMembers = members.length > 0 ? members : membersList;
  const allMembers = [...effectiveMembers, ...boardMembers];
  const foundMember = allMembers.find(m => m.id === leaderId) || membersList[0] || boardMembers[0];

  const [leader, setLeader] = useState<Member>(foundMember);
  const [isEditing, setIsEditing] = useState(false);
  const [msgSubmitted, setMsgSubmitted] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');

  // Edit form state
  const [editNameEn, setEditNameEn] = useState(leader?.name?.en || '');
  const [editNameNe, setEditNameNe] = useState(leader?.name?.ne || '');
  const [editRoleEn, setEditRoleEn] = useState(leader?.role?.en || '');
  const [editRoleNe, setEditRoleNe] = useState(leader?.role?.ne || '');
  const [editBioEn, setEditBioEn] = useState(leader?.bio?.en || '');
  const [editBioNe, setEditBioNe] = useState(leader?.bio?.ne || '');
  const [editEduEn, setEditEduEn] = useState(leader?.education?.en || '');
  const [editEduNe, setEditEduNe] = useState(leader?.education?.ne || '');
  const [editVisionEn, setEditVisionEn] = useState(leader?.vision?.en || '');
  const [editVisionNe, setEditVisionNe] = useState(leader?.vision?.ne || '');
  const [editEmail, setEditEmail] = useState(leader?.email || '');
  const [editPhone, setEditPhone] = useState(leader?.phone || '');
  const [editAddressEn, setEditAddressEn] = useState(leader?.address?.en || '');
  const [editAddressNe, setEditAddressNe] = useState(leader?.address?.ne || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(leader?.avatarUrl || '');
  const [editTermPeriod, setEditTermPeriod] = useState(leader?.termPeriod || '2025 - 2028');

  React.useEffect(() => {
    if (foundMember) {
      setLeader(foundMember);
      setEditNameEn(foundMember.name?.en || '');
      setEditNameNe(foundMember.name?.ne || '');
      setEditRoleEn(foundMember.role?.en || '');
      setEditRoleNe(foundMember.role?.ne || '');
      setEditBioEn(foundMember.bio?.en || '');
      setEditBioNe(foundMember.bio?.ne || '');
      setEditEduEn(foundMember.education?.en || 'Higher Education Degree');
      setEditEduNe(foundMember.education?.ne || 'उच्च शिक्षा डिग्री');
      setEditVisionEn(foundMember.vision?.en || 'Dedicated to modernizing agriculture, expanding youth IT scholarships, and upholding cultural heritage.');
      setEditVisionNe(foundMember.vision?.ne || 'कृषिको आधुनिकीकरण, युवा सूचना प्रविधि छात्रवृत्ति विस्तार र सांस्कृतिक सम्पदाको संरक्षणमा समर्पित।');
      setEditEmail(foundMember.email || 'contact@chaurasiyasamaj.org.np');
      setEditPhone(foundMember.phone || '+977-9812345678');
      setEditAddressEn(foundMember.address?.en || 'Parsa, Madhesh Pradesh, Nepal');
      setEditAddressNe(foundMember.address?.ne || 'पर्सा, मधेश प्रदेश, नेपाल');
      setEditAvatarUrl(foundMember.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400');
      setEditTermPeriod(foundMember.termPeriod || '2025 - 2028');
    }
  }, [foundMember, leaderId]);

  if (!leader) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {lang === 'en' ? 'Leadership Profile Not Found' : 'नेतृत्व प्रोफाइल फेला परेन'}
        </h2>
        {onNavigate && (
          <button
            onClick={() => onNavigate('directory')}
            className="px-4 py-2 bg-teal-700 text-white font-bold rounded-lg hover:bg-teal-800 transition-colors"
          >
            {lang === 'en' ? 'Back to Directory' : 'निर्देशिकामा फर्कनुहोस्'}
          </button>
        )}
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Member = {
      ...leader,
      name: { en: editNameEn, ne: editNameNe },
      role: { en: editRoleEn, ne: editRoleNe },
      bio: { en: editBioEn, ne: editBioNe },
      education: { en: editEduEn, ne: editEduNe },
      vision: { en: editVisionEn, ne: editVisionNe },
      email: editEmail,
      phone: editPhone,
      address: { en: editAddressEn, ne: editAddressNe },
      avatarUrl: editAvatarUrl,
      termPeriod: editTermPeriod,
    };
    setLeader(updated);
    if (onUpdateMember) {
      onUpdateMember(updated);
    }
    setIsEditing(false);
    alert(lang === 'en' ? 'Profile updated successfully!' : 'प्रोफाइल सफलतापूर्वक अद्यावधिक गरियो!');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    setMsgSubmitted(true);
    setTimeout(() => {
      setMsgSubmitted(false);
      setMsgText('');
      setSenderName('');
      setSenderContact('');
    }, 4000);
  };

  // Generate fallback data if fields are missing
  const displayBio = leader.bio?.[lang] || (lang === 'en' 
    ? `${leader.name.en} serves as ${leader.role.en} for Chaurasiya Samaj Nepal. With years of experience in community welfare, agriculture promotion, and social activism, they work tirelessly to unite members across Madhesh Province and beyond.`
    : `${leader.name.ne} चौरसिया समाज नेपालका ${leader.role.ne} हुनुहुन्छ। सामुदायिक कल्याण, कृषि प्रवर्धन र सामाजिक अभियानमा वर्षौंको अनुभवका साथ, उहाँ मधेश प्रदेश र बाहिरका सदस्यहरूलाई गोलबन्द गर्न निरन्तर कार्यरत हुनुहुन्छ।`);

  const displayEdu = leader.education?.[lang] || (lang === 'en' ? 'Bachelor Degree & Public Administration Training' : 'स्नातक तह तथा सार्वजनिक प्रशासन तालिम');
  const displayVision = leader.vision?.[lang] || (lang === 'en'
    ? 'To create a self-sustaining, digitized, and culturally vibrant Chaurasiya community with equal opportunities in education, pan (betel leaf) farming innovation, and leadership.'
    : 'शिक्षा, पान खेती नवीनता र नेतृत्वमा समान अवसरहरू सहितको आत्मनिर्भर, डिजिटलाइज्ड र सांस्कृतिक रूपमा जीवन्त चौरसिया समुदायको निर्माण गर्ने।');

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {onNavigate && (
          <button
            onClick={() => onNavigate('directory')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-800 text-teal-900 dark:text-teal-100 rounded-xl font-bold text-xs hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-teal-600" />
            {lang === 'en' ? 'Back to Committee Directory' : 'समिति निर्देशिकामा फर्कनुहोस्'}
          </button>
        )}

        {isAdmin && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            {lang === 'en' ? 'Edit Official Profile (Admin)' : 'अधिकारी प्रोफाइल सम्पादन (एडमिन)'}
          </button>
        )}
      </div>

      {/* Main Hero Header Card */}
      <section className="bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative z-10">
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-4 border-emerald-400/40 shadow-2xl shrink-0 bg-teal-900">
            <img src={leader.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'} alt={leader.name[lang]} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-4 flex-grow">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                {leader.role[lang]}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {formatNumber(leader.name[lang], lang)}
              </h1>
              <p className="text-teal-200 text-sm font-semibold mt-1">
                {lang === 'en' ? 'Chaurasiya Samaj Nepal Central Executive' : 'चौरसिया समाज नेपाल केन्द्रीय कार्यसमिति'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-teal-100 pt-2 border-t border-teal-800/60">
              {leader.email && (
                <a href={`mailto:${leader.email}`} className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  {leader.email}
                </a>
              )}
              {leader.phone && (
                <a href={`tel:${leader.phone}`} className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  {formatNumber(leader.phone, lang)}
                </a>
              )}
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {formatNumber(leader.address[lang], lang)}
              </div>
              <div className="px-2.5 py-0.5 rounded-md bg-teal-900/80 border border-teal-700 text-emerald-300 font-mono">
                {lang === 'en' ? 'Term:' : 'कार्यकाल:'} {formatNumber(leader.termPeriod || '2025 - 2028', lang)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Edit Modal / Panel */}
      {isEditing && (
        <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-emerald-500 shadow-2xl animate-in zoom-in-95 duration-200 space-y-6">
          <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
            <h3 className="text-xl font-black text-teal-950 dark:text-teal-100 flex items-center gap-2">
              <Edit className="w-5 h-5 text-emerald-600" />
              {lang === 'en' ? 'Edit Member Profile Details' : 'सदस्य प्रोफाइल विवरणहरू सम्पादन गर्नुहोस्'}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Name (English)</label>
              <input
                type="text"
                value={editNameEn}
                onChange={e => setEditNameEn(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Name (Nepali)</label>
              <input
                type="text"
                value={editNameNe}
                onChange={e => setEditNameNe(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Role/Designation (English)</label>
              <input
                type="text"
                value={editRoleEn}
                onChange={e => setEditRoleEn(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Role/Designation (Nepali)</label>
              <input
                type="text"
                value={editRoleNe}
                onChange={e => setEditRoleNe(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Biography (English)</label>
              <textarea
                rows={3}
                value={editBioEn}
                onChange={e => setEditBioEn(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Biography (Nepali)</label>
              <textarea
                rows={3}
                value={editBioNe}
                onChange={e => setEditBioNe(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Education (English)</label>
              <input
                type="text"
                value={editEduEn}
                onChange={e => setEditEduEn(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Education (Nepali)</label>
              <input
                type="text"
                value={editEduNe}
                onChange={e => setEditEduNe(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Vision Statement (English)</label>
              <input
                type="text"
                value={editVisionEn}
                onChange={e => setEditVisionEn(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Vision Statement (Nepali)</label>
              <input
                type="text"
                value={editVisionNe}
                onChange={e => setEditVisionNe(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Address (English)</label>
              <input
                type="text"
                value={editAddressEn}
                onChange={e => setEditAddressEn(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Avatar / Photo URL</label>
              <input
                type="text"
                value={editAvatarUrl}
                onChange={e => setEditAvatarUrl(e.target.value)}
                className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100"
              >
                {lang === 'en' ? 'Cancel' : 'रद्द गर्नुहोस्'}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                {lang === 'en' ? 'Save Changes' : 'परिवर्तनहरू बचत गर्नुहोस्'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Biography & Vision */}
        <div className="md:col-span-2 space-y-8">
          {/* Biography */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-teal-950 dark:text-teal-100 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-600" />
              {lang === 'en' ? 'Official Biography & Leadership Journey' : 'आधिकारिक जीवनी तथा नेतृत्व यात्रा'}
            </h2>
            <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-medium space-y-3 whitespace-pre-line">
              {formatNumber(displayBio, lang)}
            </div>
          </section>

          {/* Strategic Vision */}
          <section className="bg-teal-50/60 dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-teal-950 dark:text-teal-100 flex items-center gap-2">
              <Compass className="w-6 h-6 text-emerald-600" />
              {lang === 'en' ? 'Vision & Key Priorities' : 'दूरदृष्टि र मुख्य प्राथमिकताहरू'}
            </h2>
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-teal-100/80 dark:border-slate-800 text-gray-800 dark:text-gray-200 text-sm sm:text-base font-semibold leading-relaxed">
              "{formatNumber(displayVision, lang)}"
            </div>
          </section>

          {/* Direct Contact Form to Leader */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-teal-950 dark:text-teal-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              {lang === 'en' ? `Send Message to ${leader.name.en}` : `${leader.name.ne} लाई सन्देश पठाउनुहोस्`}
            </h3>

            {msgSubmitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl flex items-center gap-3 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                {lang === 'en' ? 'Your message has been dispatched successfully! The executive office will review it.' : 'तपाईंको सन्देश सफलतापूर्वक पठाइयो! कार्यकारी कार्यालयले यसको समीक्षा गर्नेछ।'}
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'Your Full Name' : 'तपाईंको पूरा नाम'}
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'Phone or Email' : 'फोन वा इमेल'}
                    value={senderContact}
                    onChange={e => setSenderContact(e.target.value)}
                    className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder={lang === 'en' ? 'Type your query or suggestion here...' : 'यहाँ तपाईंको जिज्ञासा वा सुझाव टाइप गर्नुहोस्...'}
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-md transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Send Message' : 'सन्देश पठाउनुहोस्'}
                </button>
              </form>
            )}
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Education & Credentials */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-base font-black text-teal-950 dark:text-teal-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              {lang === 'en' ? 'Education & Qualification' : 'शिक्षा तथा योग्यता'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">
              {formatNumber(displayEdu, lang)}
            </p>
          </div>

          {/* Quick Contact & Office */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-4 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <h3 className="text-base font-black text-teal-950 dark:text-teal-100">
              {lang === 'en' ? 'Official Details' : 'आधिकारिक विवरण'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase font-black">{lang === 'en' ? 'Location' : 'स्थान'}</span>
                  <span>{formatNumber(leader.address[lang], lang)}</span>
                </div>
              </div>
              {leader.phone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-black">{lang === 'en' ? 'Phone' : 'फोन'}</span>
                    <span>{formatNumber(leader.phone, lang)}</span>
                  </div>
                </div>
              )}
              {leader.email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-black">{lang === 'en' ? 'Email' : 'इमेल'}</span>
                    <span>{leader.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
