import React, { useState } from 'react';
import { Search, UserCheck, Shield, BookOpen, MapPin, Phone, Mail, CheckCircle2, UserPlus } from 'lucide-react';
import { Language, Member } from '../types';
import { boardMembers } from '../data/communityData';

interface DirectorySectionProps {
  lang: Language;
  onAddMember: (member: Omit<Member, 'id'>) => void;
  onTrackAction: (actionName: string) => void;
}

export default function DirectorySection({ lang, onAddMember, onTrackAction }: DirectorySectionProps) {
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

  const filteredMembers = boardMembers.filter((m) => {
    const matchesSearch =
      m.name[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.address[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.bio && m.bio[lang].toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCat = selectedCat === 'all' || m.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleNominateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomineeNameEn || !nomineeNameNe || !nomineeRoleEn || !nomineeRoleNe) return;

    const newNominee: Omit<Member, 'id'> = {
      name: { en: nomineeNameEn, ne: nomineeNameNe },
      role: { en: nomineeRoleEn, ne: nomineeRoleNe },
      category: nomineeCat,
      phone: nomineePhone,
      email: nomineeEmail,
      address: { en: nomineeAddrEn || 'Nepal', ne: nomineeAddrNe || 'नेपाल' },
      bio: { en: nomineeBioEn || 'Nominated Community Member', ne: nomineeBioNe || 'मनोनित सामुदायिक सदस्य' },
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    };

    onAddMember(newNominee);
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
        <button
          onClick={() => {
            setShowNominateForm(!showNominateForm);
            onTrackAction('Toggle Nominate Member Form');
          }}
          className="w-full md:w-auto px-5 py-3.5 bg-teal-700 hover:bg-teal-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4 text-teal-300" />
          {t.nominateBtn[lang]}
        </button>
      </section>

      {/* Nominate Member Profile Form Modal/Accordion */}
      {showNominateForm && (
        <section className="bg-teal-50/50 border border-teal-200 p-6 sm:p-8 rounded-2xl shadow-inner space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="border-b border-teal-200 pb-4">
            <h3 className="text-xl font-bold text-teal-950 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-teal-700" />
              {t.formTitle[lang]}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{t.formSub[lang]}</p>
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
              <div className="pt-4 mt-4 border-t border-teal-50 flex justify-end">
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
