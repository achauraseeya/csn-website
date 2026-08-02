import React, { useState } from 'react';
import { Users, Search, Heart, Share2, Plus, Sparkles, MapPin, CheckCircle2, BookOpen, Send, Phone, Mail, UserCheck } from 'lucide-react';
import { Language } from '../types';

interface FamilyConnectivitySectionProps {
  lang: Language;
  onTrackAction: (actionName: string) => void;
  isAdmin?: boolean;
}

interface FamilyBranch {
  id: string;
  familyHead: string;
  gotra: string;
  kuldevta: string;
  ancestralVillage: string;
  district: string;
  contactPerson: string;
  phone: string;
  email: string;
  membersCount: number;
  description: string;
}

const INITIAL_FAMILIES: FamilyBranch[] = [
  {
    id: 'f1',
    familyHead: 'Late Pt. Ram Sunder Chaurasiya',
    gotra: 'Kashyap',
    kuldevta: 'Shri Biseshwar Mahadev & Kuldevi Samay Mai',
    ancestralVillage: 'Bahuwarwa',
    district: 'Parsa',
    contactPerson: 'Shri Rameshwar Chaurasiya',
    phone: '+977-9855012345',
    email: 'rameshwar.family@chaurasiyasamaj.org.np',
    membersCount: 42,
    description: 'Traditional Betel/Pan cultivators and educators originating from Parsa Bahuwarwa. Connected branches across Birgunj, Kathmandu, and Lalitpur.',
  },
  {
    id: 'f2',
    familyHead: 'Late Shri Mahadev Bhagat Chaurasiya',
    gotra: 'Bharadwaj',
    kuldevta: 'Shri Mahavir Subham Sthan',
    ancestralVillage: 'Kalaiya',
    district: 'Bara',
    contactPerson: 'Er. Abhishek Chaurasiya',
    phone: '+977-9801234567',
    email: 'abhishek.family@chaurasiyasamaj.org.np',
    membersCount: 28,
    description: 'Prominent community lineage involved in trade, engineering, and social welfare in Bara district and Janakpur region.',
  },
  {
    id: 'f3',
    familyHead: 'Late Sitaram Chaurasiya',
    gotra: 'Sandilya',
    kuldevta: 'Shri Jagannath Dev',
    ancestralVillage: 'Gaur',
    district: 'Rautahat',
    contactPerson: 'Dr. Sunita Chaurasiya',
    phone: '+977-9845098765',
    email: 'sunita.family@chaurasiyasamaj.org.np',
    membersCount: 35,
    description: 'Lineage of healthcare professionals and farmers rooted in Gaur, Rautahat with extended relatives in Sarlahi and Morang.',
  },
];

export default function FamilyConnectivitySection({
  lang,
  onTrackAction,
}: FamilyConnectivitySectionProps) {
  const [families, setFamilies] = useState<FamilyBranch[]>(INITIAL_FAMILIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedGotra, setSelectedGotra] = useState<string>('All');

  // Request/Register Family Branch Form
  const [showRegModal, setShowRegModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formGotra, setFormGotra] = useState('Kashyap');
  const [formKuldevta, setFormKuldevta] = useState('');
  const [formVillage, setFormVillage] = useState('');
  const [formDistrict, setFormDistrict] = useState('Parsa');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const districts = ['All', 'Parsa', 'Bara', 'Rautahat', 'Sarlahi', 'Dhanusha', 'Morang', 'Kathmandu'];
  const gotras = ['All', 'Kashyap', 'Bharadwaj', 'Sandilya', 'Vashistha', 'Gautam'];

  const filteredFamilies = families.filter((f) => {
    const matchesSearch =
      f.familyHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.ancestralVillage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.gotra.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || f.district === selectedDistrict;
    const matchesGotra = selectedGotra === 'All' || f.gotra === selectedGotra;
    return matchesSearch && matchesDistrict && matchesGotra;
  });

  const handleSubmitFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;

    const newBranch: FamilyBranch = {
      id: `f_${Date.now()}`,
      familyHead: formName,
      gotra: formGotra,
      kuldevta: formKuldevta || 'Shri Kuldevta Sthan',
      ancestralVillage: formVillage || 'Nepal',
      district: formDistrict,
      contactPerson: formName,
      phone: formPhone,
      email: formEmail,
      membersCount: 1,
      description: formDesc || 'Newly registered family branch in Chaurasiya Samaj Nepal genealogy network.',
    };

    setFamilies([newBranch, ...families]);
    setFormSubmitted(true);
    onTrackAction('Register Family Branch');

    setTimeout(() => {
      setFormSubmitted(false);
      setShowRegModal(false);
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormDesc('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Banner / Header */}
      <div className="bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-teal-800/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {lang === 'en' ? 'Chaurasiya Vanshawali & Family Network' : 'चौरसिया वंशवृक्ष तथा परिवार सञ्जाल'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {lang === 'en' ? 'Family Connectivity Portal' : 'परिवार सम्बन्ध र वंशावली पोर्टल'}
          </h1>
          <p className="text-sm sm:text-base text-teal-100 font-medium leading-relaxed">
            {lang === 'en'
              ? 'Unite extended family branches, discover ancestral roots (Vanshawali), verify Gotra/Kuldevta heritage, and stay connected with Chaurasiya families across Nepal and worldwide.'
              : 'आफ्नो वंशवृक्ष, पुर्खाको मूल थलो, गोत्र तथा कुलदेवताको पहिचान गर्दै नेपालभर तथा विदेशमा रहेका चौरसिया परिवारहरूसँग आत्मीय सम्बन्ध स्थापित गर्नुहोस्।'}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowRegModal(true);
                onTrackAction('Open Register Family Branch Modal');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black rounded-xl shadow-md transition-all flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'en' ? 'Register Your Family Lineage' : 'आफ्नो परिवार दर्ता गर्नुहोस्'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-teal-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'en' ? 'Search by head name, village, gotra...' : 'खोजी गर्नुहोस्: नाम, गाउँ, गोत्र...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span>{lang === 'en' ? 'District:' : 'जिल्ला:'}</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-teal-900 dark:text-teal-200"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span>{lang === 'en' ? 'Gotra:' : 'गोत्र:'}</span>
              <select
                value={selectedGotra}
                onChange={(e) => setSelectedGotra(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-teal-900 dark:text-teal-200"
              >
                {gotras.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Family Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFamilies.map((fam) => (
          <div
            key={fam.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-teal-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    {fam.gotra} Gotra
                  </span>
                  <h3 className="text-base font-extrabold text-teal-950 dark:text-teal-50 mt-1">
                    {fam.familyHead}
                  </h3>
                </div>
                <div className="shrink-0 px-2 py-1 bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-[11px] font-bold">
                  {fam.membersCount} {lang === 'en' ? 'Members' : 'सदस्यहरू'}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>
                    {fam.ancestralVillage}, {fam.district}
                  </span>
                </p>
                <p className="flex items-center gap-1.5 text-xs text-teal-800 dark:text-emerald-400 font-bold">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>Kuldevta: {fam.kuldevta}</span>
                </p>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {fam.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{lang === 'en' ? 'Contact Representative' : 'सम्पर्क व्यक्ति'}</p>
                <p className="font-bold text-gray-900 dark:text-gray-100">{fam.contactPerson}</p>
              </div>

              <div className="flex items-center gap-1.5">
                {fam.phone && (
                  <a
                    href={`tel:${fam.phone}`}
                    className="p-2 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-emerald-400 hover:bg-teal-100 transition-colors"
                    title={fam.phone}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                )}
                {fam.email && (
                  <a
                    href={`mailto:${fam.email}`}
                    className="p-2 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-emerald-400 hover:bg-teal-100 transition-colors"
                    title={fam.email}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-teal-100 dark:border-slate-800 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowRegModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-teal-950 dark:text-teal-50">
                {lang === 'en' ? 'Register Family Lineage' : 'आफ्नो पारिवारिक वंशवृक्ष दर्ता'}
              </h2>
              <p className="text-xs text-gray-500">
                {lang === 'en'
                  ? 'Submit your family details to get listed in Chaurasiya Samaj Nepal family directory.'
                  : 'चौरसिया समाज नेपाल परिवार निर्देशिकामा सूचीकृत हुन विवरण भर्नुहोस्।'}
              </p>
            </div>

            {formSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-teal-950 dark:text-teal-50">
                  {lang === 'en' ? 'Family Registered Successfully!' : 'परिवार सफलपूर्वक दर्ता भयो!'}
                </h3>
                <p className="text-xs text-gray-500">
                  {lang === 'en' ? 'Thank you for connecting with Chaurasiya Samaj Nepal.' : 'चौरसिया समाज नेपालसँग जोडिनुभएकोमा धन्यवाद।'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFamily} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-teal-950 dark:text-teal-100 mb-1">
                    {lang === 'en' ? 'Family Head / Contact Name *' : 'परिवार प्रमुख / सम्पर्क नाम *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Pt. Ram Kumar Chaurasiya"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-teal-950 dark:text-teal-100 mb-1">
                      {lang === 'en' ? 'Gotra' : 'गोत्र'}
                    </label>
                    <select
                      value={formGotra}
                      onChange={(e) => setFormGotra(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      {gotras.filter((g) => g !== 'All').map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-teal-950 dark:text-teal-100 mb-1">
                      {lang === 'en' ? 'District' : 'जिल्ला'}
                    </label>
                    <select
                      value={formDistrict}
                      onChange={(e) => setFormDistrict(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      {districts.filter((d) => d !== 'All').map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-teal-950 dark:text-teal-100 mb-1">
                      {lang === 'en' ? 'Ancestral Village' : 'पुर्ख्यौली गाउँ'}
                    </label>
                    <input
                      type="text"
                      value={formVillage}
                      onChange={(e) => setFormVillage(e.target.value)}
                      placeholder="e.g. Bahuwarwa"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-teal-950 dark:text-teal-100 mb-1">
                      {lang === 'en' ? 'Kuldevta' : 'कुलदेवता'}
                    </label>
                    <input
                      type="text"
                      value={formKuldevta}
                      onChange={(e) => setFormKuldevta(e.target.value)}
                      placeholder="e.g. Shri Samay Mai"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-teal-950 dark:text-teal-100 mb-1">
                      {lang === 'en' ? 'Phone Number *' : 'फोन नम्बर *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+977-98..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-teal-950 dark:text-teal-100 mb-1">
                      {lang === 'en' ? 'Email Address' : 'इमेल'}
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-teal-950 dark:text-teal-100 mb-1">
                    {lang === 'en' ? 'Brief Family History / Description' : 'छोटो पारिवारिक विवरण'}
                  </label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Brief description of family lineage, occupation, connected relatives..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md transition-all uppercase tracking-wider text-xs cursor-pointer"
                >
                  {lang === 'en' ? 'Submit Family Registration' : 'परिवार विवरण पठाउनुहोस्'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
