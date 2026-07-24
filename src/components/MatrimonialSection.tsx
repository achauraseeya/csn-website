import React, { useState } from 'react';
import { Heart, UserCheck, ShieldCheck, Search, Plus, Filter, Phone, Mail, MapPin, Briefcase, GraduationCap, X, CheckCircle2, Lock, Sparkles, Download, Eye } from 'lucide-react';
import { Language, MatrimonialProfile } from '../types';
import { formatNumber } from '../utils/mediaUrl';

interface MatrimonialSectionProps {
  lang: Language;
  profiles: MatrimonialProfile[];
  onAddProfile: (profile: MatrimonialProfile) => void;
  isAdmin?: boolean;
  onOpenAdminDashboard?: () => void;
  onTrackAction: (actionName: string) => void;
}

export default function MatrimonialSection({
  lang,
  profiles,
  onAddProfile,
  isAdmin = false,
  onOpenAdminDashboard,
  onTrackAction,
}: MatrimonialSectionProps) {
  const [filterGender, setFilterGender] = useState<'all' | 'groom' | 'bride'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [interestSentId, setInterestSentId] = useState<string | null>(null);

  // Registration Form State
  const [formGender, setFormGender] = useState<'groom' | 'bride'>('groom');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(25);
  const [dob, setDob] = useState('');
  const [height, setHeight] = useState('5\'6"');
  const [gotraSubcaste, setGotraSubcaste] = useState('Kashyap / Chaurasiya');
  const [qualification, setQualification] = useState('');
  const [occupation, setOccupation] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [currentCityDistrict, setCurrentCityDistrict] = useState('Birgunj, Parsa');
  const [nativePlace, setNativePlace] = useState('Parsa, Nepal');
  const [fatherName, setFatherName] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [familyType, setFamilyType] = useState('Nuclear');
  const [partnerExpectations, setPartnerExpectations] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Filter logic
  const approvedOrAdminProfiles = profiles.filter(p => isAdmin || p.status === 'approved');

  const filteredProfiles = approvedOrAdminProfiles.filter(p => {
    if (filterGender !== 'all' && p.lookingFor !== filterGender) return false;
    if (districtFilter && !p.currentCityDistrict.toLowerCase().includes(districtFilter.toLowerCase()) && !p.nativePlace?.toLowerCase().includes(districtFilter.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.qualification.toLowerCase().includes(q) ||
        p.occupation.toLowerCase().includes(q) ||
        p.currentCityDistrict.toLowerCase().includes(q) ||
        p.gotraSubcaste?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !guardianPhone || !qualification || !occupation) {
      alert(lang === 'en' ? 'Please fill in all required fields.' : 'कृपया सबै आवश्यक विवरणहरू भरूहोस्।');
      return;
    }

    const newProfile: MatrimonialProfile = {
      id: `matrimony-${Date.now()}`,
      lookingFor: formGender,
      fullName,
      age: Number(age) || 24,
      dob,
      height,
      gotraSubcaste,
      qualification,
      occupation,
      monthlyIncome,
      currentCityDistrict,
      nativePlace,
      fatherName,
      fatherOccupation,
      familyType,
      partnerExpectations,
      guardianName,
      guardianPhone,
      guardianEmail,
      photoUrl: photoUrl.trim() || (formGender === 'groom' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' 
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddProfile(newProfile);
    onTrackAction(`Submitted Matrimonial Profile: ${fullName}`);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsRegisterModalOpen(false);
      // Reset form
      setFullName('');
      setQualification('');
      setOccupation('');
      setGuardianName('');
      setGuardianPhone('');
    }, 3000);
  };

  const handleSendInterest = (id: string) => {
    setInterestSentId(id);
    setTimeout(() => {
      setInterestSentId(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-rose-950 via-teal-950 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-rose-900/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-black uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            {lang === 'en' ? 'Chaurasiya Matrimonial Portal' : 'चौरसिया वैवाहिक सेवा पोर्टल'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {lang === 'en' ? 'Connecting Hearts within Chaurasiya Samaj' : 'चौरसिया समाजभित्र जोडी मिलाउने सेवा'}
          </h1>
          <p className="text-teal-100 text-sm sm:text-base font-medium leading-relaxed">
            {lang === 'en'
              ? 'A dedicated, verified, and culturally aligned matchmaking platform connecting eligible grooms (वर) and brides (वधू) with family background verification.'
              : 'योग्‍य वर र वधूका लागि पारिवारिक विश्वास र पहिचानका साथ चौरसिया समुदायभित्र समर्पित, प्रमाणित र सुरक्षित वैवाहिक सेवा पोर्टल।'}
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              {lang === 'en' ? 'Register Bride / Groom Profile' : 'वर / वधू प्रोफाइल दर्ता गर्नुहोस्'}
            </button>
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold text-teal-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {lang === 'en' ? 'Verified Guardian Contacts & Admin Oversight' : 'प्रमाणित अभिभावक सम्पर्क र एडमिन निगरानी'}
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Gender Filter Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setFilterGender('all')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterGender === 'all'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-teal-900'
              }`}
            >
              {lang === 'en' ? 'All Profiles' : 'सबै प्रोफाइल'} ({approvedOrAdminProfiles.length})
            </button>
            <button
              onClick={() => setFilterGender('groom')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterGender === 'groom'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-rose-600'
              }`}
            >
              👨 {lang === 'en' ? 'Groom (वर)' : 'वर (Groom)'}
            </button>
            <button
              onClick={() => setFilterGender('bride')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterGender === 'bride'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-rose-600'
              }`}
            >
              👩 {lang === 'en' ? 'Bride (वधू)' : 'वधू (Bride)'}
            </button>
          </div>

          {/* Search Inputs */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto flex-grow max-w-xl">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search by name, education, profession...' : 'नाम, शिक्षा, पेशाबाट खोज्नुहोस्...'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-gray-900 dark:text-white"
              />
            </div>
            <input
              type="text"
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              placeholder={lang === 'en' ? 'District / City...' : 'जिल्ला / सहर...'}
              className="w-32 sm:w-40 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </section>

      {/* Profiles Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-teal-100 dark:border-slate-800 space-y-4">
          <Heart className="w-12 h-12 text-rose-300 mx-auto" />
          <h3 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">
            {lang === 'en' ? 'No Matrimonial Profiles Found' : 'कुनै वैवाहिक प्रोफाइल फेला परेन'}
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {lang === 'en' ? 'Be the first to register a profile or adjust your search filters.' : 'पहिलो प्रोफाइल दर्ता गर्नुहोस् वा फिल्टरहरू समायोजन गर्नुहोस्।'}
          </p>
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl text-xs"
          >
            {lang === 'en' ? 'Register New Profile' : 'नयाँ प्रोफाइल दर्ता गर्नुहोस्'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map(profile => (
            <div
              key={profile.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Card Photo & Top Badge */}
              <div className="relative h-60 bg-teal-900 overflow-hidden">
                <img
                  src={profile.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                  alt={profile.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${profile.lookingFor === 'groom' ? 'bg-indigo-600' : 'bg-rose-600'}`}>
                    {profile.lookingFor === 'groom' ? 'वर (Groom)' : 'वधू (Bride)'}
                  </span>
                  {profile.status === 'approved' && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3" />
                      {lang === 'en' ? 'Verified' : 'प्रमाणित'}
                    </span>
                  )}
                  {profile.status === 'pending' && isAdmin && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-white">
                      Pending Admin
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-xl font-black truncate">
                    {formatNumber(profile.fullName, lang)}
                  </h3>
                  <p className="text-xs text-rose-200 font-bold flex items-center gap-2">
                    <span>{formatNumber(profile.age, lang)} {lang === 'en' ? 'Years' : 'वर्ष'}</span>
                    <span>•</span>
                    <span>{profile.height || '5\'6"'}</span>
                    <span>•</span>
                    <span>{profile.gotraSubcaste || 'Chaurasiya'}</span>
                  </p>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-5 flex-grow space-y-3 text-xs text-gray-700 dark:text-gray-300 font-medium">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{formatNumber(profile.qualification, lang)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{formatNumber(profile.occupation, lang)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{formatNumber(profile.currentCityDistrict, lang)}</span>
                </div>

                {profile.partnerExpectations && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] text-gray-600 dark:text-gray-400 italic line-clamp-2">
                    "{formatNumber(profile.partnerExpectations, lang)}"
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-teal-50/50 dark:bg-slate-800/50 border-t border-teal-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedProfile(profile)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 text-teal-900 dark:text-teal-100 rounded-xl font-bold text-xs hover:bg-teal-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-600" />
                  {lang === 'en' ? 'Full Details' : 'पूरा विवरण'}
                </button>

                <button
                  onClick={() => handleSendInterest(profile.id)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  {interestSentId === profile.id ? (lang === 'en' ? 'Sent!' : 'पठाइयो!') : (lang === 'en' ? 'Express Interest' : 'इच्छा व्यक्त गर्नुहोस्')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Profile View Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-teal-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-64 bg-slate-950">
              <img src={selectedProfile.photoUrl} alt={selectedProfile.fullName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 text-white space-y-1">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${selectedProfile.lookingFor === 'groom' ? 'bg-indigo-600' : 'bg-rose-600'}`}>
                  {selectedProfile.lookingFor === 'groom' ? 'वर (Groom)' : 'वधू (Bride)'}
                </span>
                <h2 className="text-3xl font-black">{formatNumber(selectedProfile.fullName, lang)}</h2>
                <p className="text-xs text-rose-200 font-bold">
                  {formatNumber(selectedProfile.age, lang)} yrs • {selectedProfile.height} • {selectedProfile.gotraSubcaste}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-xs text-gray-700 dark:text-gray-300 font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase font-black">{lang === 'en' ? 'Education' : 'शिक्षा'}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{formatNumber(selectedProfile.qualification, lang)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase font-black">{lang === 'en' ? 'Occupation' : 'पेशा / रोजगार'}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{formatNumber(selectedProfile.occupation, lang)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase font-black">{lang === 'en' ? 'Current City/District' : 'हालको सहर/जिल्ला'}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatNumber(selectedProfile.currentCityDistrict, lang)}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase font-black">{lang === 'en' ? 'Native Place' : 'मूल घर / स्थान'}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatNumber(selectedProfile.nativePlace || 'Parsa', lang)}</span>
                </div>
              </div>

              {/* Family Background */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-teal-950 dark:text-teal-100 text-sm">{lang === 'en' ? 'Family Details' : 'पारिवारिक विवरण'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div><strong>{lang === 'en' ? 'Father:' : 'बुबा:'}</strong> {formatNumber(selectedProfile.fatherName || 'Chaurasiya Family', lang)} ({selectedProfile.fatherOccupation || 'Business/Agriculture'})</div>
                  <div><strong>{lang === 'en' ? 'Family Structure:' : 'परिवार:'}</strong> {selectedProfile.familyType || 'Nuclear'}</div>
                </div>
              </div>

              {/* Expectations */}
              {selectedProfile.partnerExpectations && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-teal-950 dark:text-teal-100 text-sm">{lang === 'en' ? 'Partner Expectations' : 'जीवनसाथी अपेक्षा'}</h4>
                  <p className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 rounded-xl leading-relaxed">
                    {formatNumber(selectedProfile.partnerExpectations, lang)}
                  </p>
                </div>
              )}

              {/* Guardian Contact Box */}
              <div className="p-4 bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] text-teal-800 dark:text-teal-300 font-black uppercase">{lang === 'en' ? 'Verified Guardian Contact' : 'प्रमाणित अभिभावक सम्पर्क'}</span>
                  <span className="font-extrabold text-teal-950 dark:text-white text-sm">{selectedProfile.guardianName}</span>
                  <span className="block text-xs font-mono text-teal-700 dark:text-teal-300">{formatNumber(selectedProfile.guardianPhone, lang)}</span>
                </div>
                <a
                  href={`tel:${selectedProfile.guardianPhone}`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Call Guardian' : 'अभिभावकलाई कल गर्नुहोस्'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal Form */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-teal-100 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-teal-950 dark:text-teal-100 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                  {lang === 'en' ? 'Register Matrimonial Profile' : 'वर / वधू प्रोफाइल दर्ता फारम'}
                </h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">
                  {lang === 'en' ? 'Fill out candidate details for Chaurasiya Samaj verification' : 'चौरसिया समाज प्रमाणीकरणका लागि उम्मेदवार विवरणहरू भर्नुहोस्'}
                </p>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSubmitted ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h4 className="text-2xl font-black text-teal-950 dark:text-teal-100">
                  {lang === 'en' ? 'Profile Submitted Successfully!' : 'प्रोफाइल सफलतापूर्वक दर्ता भयो!'}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium max-w-md mx-auto">
                  {lang === 'en'
                    ? 'Our admin team (csnepalwebsite@gmail.com) will review the guardian contact and activate the profile shortly.'
                    : 'हाम्रो एडमिन टोलीले अभिभावकको सम्पर्क प्रमाणीकरण गरी चाँडै प्रोफाइल सक्रिय गर्नेछ।'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProfile} className="space-y-4 text-xs font-semibold">
                {/* Looking for selection */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormGender('groom')}
                    className={`p-3 rounded-2xl border-2 font-black transition-all flex items-center justify-center gap-2 ${
                      formGender === 'groom'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200'
                        : 'border-slate-200 text-gray-500'
                    }`}
                  >
                    👨 {lang === 'en' ? 'Looking for Groom (वर)' : 'वर (Groom)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormGender('bride')}
                    className={`p-3 rounded-2xl border-2 font-black transition-all flex items-center justify-center gap-2 ${
                      formGender === 'bride'
                        ? 'border-rose-600 bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200'
                        : 'border-slate-200 text-gray-500'
                    }`}
                  >
                    👩 {lang === 'en' ? 'Looking for Bride (वधू)' : 'वधू (Bride)'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Candidate Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Chaurasiya"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-1">Age *</label>
                      <input
                        type="number"
                        required
                        min={18}
                        max={70}
                        value={age}
                        onChange={e => setAge(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-1">Height</label>
                      <input
                        type="text"
                        value={height}
                        onChange={e => setHeight(e.target.value)}
                        placeholder="5'7&quot;"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Highest Qualification *</label>
                    <input
                      type="text"
                      required
                      value={qualification}
                      onChange={e => setQualification(e.target.value)}
                      placeholder="e.g. B.E. Computer Science / MBBS"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Occupation / Employer *</label>
                    <input
                      type="text"
                      required
                      value={occupation}
                      onChange={e => setOccupation(e.target.value)}
                      placeholder="e.g. Software Engineer / Bank Officer"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Current City / District *</label>
                    <input
                      type="text"
                      required
                      value={currentCityDistrict}
                      onChange={e => setCurrentCityDistrict(e.target.value)}
                      placeholder="Birgunj, Parsa"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Gotra / Subcaste</label>
                    <input
                      type="text"
                      value={gotraSubcaste}
                      onChange={e => setGotraSubcaste(e.target.value)}
                      placeholder="Kashyap"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Guardian Name *</label>
                    <input
                      type="text"
                      required
                      value={guardianName}
                      onChange={e => setGuardianName(e.target.value)}
                      placeholder="Parent or Guardian Name"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Guardian Phone (WhatsApp) *</label>
                    <input
                      type="text"
                      required
                      value={guardianPhone}
                      onChange={e => setGuardianPhone(e.target.value)}
                      placeholder="+977-9800000000"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Photo URL (Optional)</label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={e => setPhotoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 dark:text-gray-300 mb-1">Partner Expectations & Notes</label>
                    <textarea
                      rows={2}
                      value={partnerExpectations}
                      onChange={e => setPartnerExpectations(e.target.value)}
                      placeholder="e.g. Looking for educated professional from Chaurasiya community..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold"
                  >
                    {lang === 'en' ? 'Cancel' : 'रद्द गर्नुहोस्'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 shadow-md"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    {lang === 'en' ? 'Submit Matrimonial Profile' : 'प्रोफाइल बुझाउनुहोस्'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
