import React, { useState, useEffect } from 'react';
import { Mail, Phone, Github, Award, BookOpen, Cpu, ShieldCheck, Heart, Edit, Save, X, ExternalLink, Upload, Globe } from 'lucide-react';
import { Language } from '../types';
import { designerProfile as defaultDesignerProfile } from '../data/communityData';
import { uploadImageToGithub, apiFetch, saveFileToGithub } from '../utils/githubDb';

interface AbhishekBioProps {
  lang: Language;
  onTrackAction: (actionName: string) => void;
  isAdmin?: boolean;
}

export default function AbhishekBio({ lang, onTrackAction, isAdmin = false }: AbhishekBioProps) {
  // Local profile state persisted in localStorage
  const [profile, setProfile] = useState(() => {
    let profileData: any = null;
    try {
      const saved = localStorage.getItem('chaurasiya_abhishek_profile_data');
      if (saved) {
        profileData = JSON.parse(saved);
      }
    } catch (e) {}
    return {
      name: profileData?.name || defaultDesignerProfile.name,
      title: profileData?.title || 'General Secretary, CTO & Chief Digital Designer of Chaurasiya Samaj Nepal',
      subtitleNe: profileData?.subtitleNe || 'महासचिव, सीटीओ र चौरसिया समाज नेपालका प्रमुख डिजिटल डिजाइनर',
      bioEn: profileData?.bioEn || defaultDesignerProfile.bio.en,
      bioNe: profileData?.bioNe || defaultDesignerProfile.bio.ne,
      education: profileData?.education || defaultDesignerProfile.education,
      university: profileData?.university || 'Tribhuvan University, Nepal',
      email: profileData?.email || defaultDesignerProfile.email,
      phone: profileData?.phone || defaultDesignerProfile.phone || '+977-9800000000',
      github: profileData?.github || 'https://github.com/achauraseeya',
      websiteUrl: profileData?.websiteUrl || 'https://www.achaurasiya.com.np',
      avatarUrl: profileData?.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      skills: profileData?.skills || defaultDesignerProfile.skills,
      quoteEn: profileData?.quoteEn || '"Technology holds the power to simplify grassroots community work. By building fast, accessible portals, we elevate traditional agriculture and unite our people under one digital roof."',
      quoteNe: profileData?.quoteNe || '"प्रविधिले तल्लो तहका सामुदायिक कार्यहरूलाई सरलीकरण गर्ने शक्ति राख्छ। द्रुत र पहुँचयोग्य पोर्टलहरू निर्माण गरेर, हामी परम्परागत कृषि र हाम्रो समाजलाई एकै थलोमा जोड्छौँ।"',
      portalTextEn: profileData?.portalTextEn || 'Discover complete software projects, research papers, and technical blogs at www.achaurasiya.com.np',
      portalTextNe: profileData?.portalTextNe || 'www.achaurasiya.com.np मा सम्पूर्ण सफ्टवेयर परियोजनाहरू, अनुसन्धान पत्रहरू र ब्लगहरू हेर्नुहोस्।',
      contributions: profileData?.contributions || [
        {
          title: { en: 'Centralized Member Database Deployed', ne: 'केन्द्रीकृत सदस्य डाटाबेस' },
          desc: {
            en: 'Designed and deployed a responsive cloud directory to organize and verify community members, preventing fraud.',
            ne: 'समुदायका सदस्यहरूलाई व्यवस्थित र प्रमाणित गर्न एक उत्तरदायी क्लाउड निर्देशिका डिजाइन र तैनात गर्नुभयो।',
          },
        },
        {
          title: { en: 'Blogger.com Integration Engine', ne: 'ब्लगर एकीकरण इन्जिन' },
          desc: {
            en: 'Developed custom XML template compiler that generates secure blogger.com layouts for low-budget deployment.',
            ne: 'कम बजेटको प्रयोगका लागि सुरक्षित ब्लगर ढाँचाहरू उत्पन्न गर्ने अनुकूलन XML टेम्पलेट कम्पाइलर विकास गर्नुभयो।',
          },
        },
        {
          title: { en: 'Rural Farmers Mobile Support', ne: 'ग्रामीण किसान मोबाइल सहयोग' },
          desc: {
            en: 'Engineered notification portals so rural betel leaf (paan) farmers receive instant cold and storm warning bulletins.',
            ne: 'ग्रामीण पान उत्पादक कृषकहरूले तत्काल चिसो र आँधीबेहरीको चेतावनी बुलेटिनहरू प्राप्त गर्न सक्ने गरी सूचना पोर्टलको निर्माण गर्नुभयो।',
          },
        },
      ]
    };
  });

  // Fetch online server profile data on mount
  useEffect(() => {
    apiFetch<any>('/api/abhishek-profile', 'abhishek_profile.json', null)
      .then((cloudProfile) => {
        if (cloudProfile && typeof cloudProfile === 'object' && cloudProfile.name) {
          setProfile((prev: any) => {
            const merged = { ...prev, ...cloudProfile };
            try {
              localStorage.setItem('chaurasiya_abhishek_profile_data', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Admin edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitleNe, setEditSubtitleNe] = useState('');
  const [editBioEn, setEditBioEn] = useState('');
  const [editBioNe, setEditBioNe] = useState('');
  const [editQuoteEn, setEditQuoteEn] = useState('');
  const [editQuoteNe, setEditQuoteNe] = useState('');
  const [editPortalTextEn, setEditPortalTextEn] = useState('');
  const [editPortalTextNe, setEditPortalTextNe] = useState('');
  const [editEducation, setEditEducation] = useState('');
  const [editUniversity, setEditUniversity] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editContributions, setEditContributions] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const t = {
    title: { en: `Our Architect: ${profile.name}`, ne: `हाम्रो वास्तुकार: ${profile.name}` },
    aboutMe: { en: 'Executive Biography', ne: 'कार्यकारी जीवनी' },
    skillsTitle: { en: 'Technical Expertise & Craft', ne: 'प्राविधिक विशेषज्ञता र कला' },
    eduTitle: { en: 'Academic Foundation', ne: 'शैक्षिक पृष्ठभूमि' },
    contactTitle: { en: 'Get In Touch', ne: 'सम्पर्क गर्नुहोस्' },
    contributions: { en: 'Key Digital Contributions', ne: 'प्रमुख डिजिटल योगदानहरू' },
    officialWeb: { en: 'Visit Official Personal Website', ne: 'अभिषेकको आधिकारिक वेबसाइट' },
  };

  const contributionsList = [
    {
      title: { en: 'Centralized Member Database', ne: 'केन्द्रीकृत सदस्य डाटाबेस' },
      desc: {
        en: 'Designed and deployed a responsive cloud directory to organize and verify community members, preventing fraud.',
        ne: 'समुदायका सदस्यहरूलाई व्यवस्थित र प्रमाणित गर्न एक उत्तरदायी क्लाउड निर्देशिका डिजाइन र तैनात गर्नुभयो।',
      },
    },
    {
      title: { en: 'Blogger.com Integration Engine', ne: 'ब्लगर एकीकरण इन्जिन' },
      desc: {
        en: 'Developed custom XML template compiler that generates secure blogger.com layouts for low-budget deployment.',
        ne: 'कम बजेटको प्रयोगका लागि सुरक्षित ब्लगर ढाँचाहरू उत्पन्न गर्ने अनुकूलन XML टेम्पलेट कम्पाइलर विकास गर्नुभयो।',
      },
    },
    {
      title: { en: 'Rural Farmers Mobile Support', ne: 'ग्रामीण किसान मोबाइल सहयोग' },
      desc: {
        en: 'Engineered notification portals so rural betel leaf (paan) farmers receive instant cold and storm warning bulletins.',
        ne: 'ग्रामीण पान उत्पादक कृषकहरूले तत्काल चिसो र आँधीबेहरीको चेतावनी बुलेटिनहरू प्राप्त गर्न सक्ने गरी सूचना पोर्टलको निर्माण गर्नुभयो।',
      },
    },
  ];

  const openEditModal = () => {
    setEditName(profile.name);
    setEditTitle(profile.title);
    setEditSubtitleNe(profile.subtitleNe);
    setEditBioEn(profile.bioEn);
    setEditBioNe(profile.bioNe);
    setEditQuoteEn(profile.quoteEn || '');
    setEditQuoteNe(profile.quoteNe || '');
    setEditPortalTextEn(profile.portalTextEn || '');
    setEditPortalTextNe(profile.portalTextNe || '');
    setEditEducation(profile.education);
    setEditUniversity(profile.university || 'Tribhuvan University, Nepal');
    setEditEmail(profile.email);
    setEditPhone(profile.phone);
    setEditGithub(profile.github);
    setEditWebsiteUrl(profile.websiteUrl || 'https://www.achaurasiya.com.np');
    setEditAvatarUrl(profile.avatarUrl);
    setEditSkills(profile.skills.join(', '));
    setEditContributions(JSON.parse(JSON.stringify(profile.contributions || contributionsList)));
    setIsEditModalOpen(true);
  };

  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSkills = editSkills.split(',').map(s => s.trim()).filter(Boolean);

    const updatedProfile = {
      ...profile,
      name: editName,
      title: editTitle,
      subtitleNe: editSubtitleNe,
      bioEn: editBioEn,
      bioNe: editBioNe,
      quoteEn: editQuoteEn,
      quoteNe: editQuoteNe,
      portalTextEn: editPortalTextEn,
      portalTextNe: editPortalTextNe,
      education: editEducation,
      university: editUniversity,
      email: editEmail,
      phone: editPhone,
      github: editGithub,
      websiteUrl: editWebsiteUrl,
      avatarUrl: editAvatarUrl || profile.avatarUrl,
      skills: updatedSkills.length > 0 ? updatedSkills : profile.skills,
      contributions: editContributions.length > 0 ? editContributions : profile.contributions,
    };

    setProfile(updatedProfile);
    localStorage.setItem('chaurasiya_abhishek_profile_data', JSON.stringify(updatedProfile));
    saveFileToGithub('abhishek_profile.json', updatedProfile, 'Update Abhishek profile data').catch(() => {});
    setIsEditModalOpen(false);
    onTrackAction('Admin edited Abhishek profile');
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          // Upload photo to GitHub Repo (assets/uploads/abhishek_photo.jpg)
          const githubUrl = await uploadImageToGithub(
            `abhishek_profile_${Date.now()}.jpg`,
            base64,
            'Update Abhishek Chaurasiya profile photo'
          );
          setEditAvatarUrl(githubUrl);
        } catch (err) {
          setEditAvatarUrl(base64);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Bio Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 text-white rounded-3xl py-12 px-6 sm:px-12 shadow-xl border-b-8 border-emerald-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_40%)]" />
        
        <div className="relative max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar frame */}
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-teal-400 bg-white shadow-xl shrink-0 relative group">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
                Lead Architect &amp; CTO
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-teal-50">
                {profile.name}
              </h1>
              <p className="text-sm sm:text-base text-teal-200 font-bold max-w-2xl">
                {lang === 'en' ? profile.title : profile.subtitleNe}
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={openEditModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all shrink-0 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>{lang === 'en' ? 'Edit Profile' : 'प्रोफाइल सम्पादन'}</span>
            </button>
          )}
        </div>
      </section>

      {/* Grid: Bio Details & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Bio Text & Contributions */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-teal-950 dark:text-teal-100 border-b border-teal-50 dark:border-slate-800 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-700 dark:text-emerald-400" />
              {t.aboutMe[lang]}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
              {lang === 'en' ? profile.bioEn : profile.bioNe}
            </p>

            <div className="p-4 bg-teal-50/50 dark:bg-slate-800/80 rounded-xl border border-teal-100 dark:border-slate-700 flex gap-3 text-xs text-teal-900 dark:text-teal-200 leading-relaxed font-medium italic">
              <Heart className="w-5 h-5 text-teal-600 dark:text-emerald-400 shrink-0 mt-0.5 fill-teal-600/10" />
              {lang === 'en' ? profile.quoteEn : profile.quoteNe}
            </div>
          </div>

          {/* Contributions */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-teal-950 dark:text-teal-100 border-b border-teal-50 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-700 dark:text-emerald-400" />
              {t.contributions[lang]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(profile.contributions || contributionsList).map((contrib: any, i: number) => (
                <div key={i} className="space-y-2 p-4 bg-teal-50/30 dark:bg-slate-800/50 rounded-xl border border-teal-100/60 dark:border-slate-700 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-teal-900 dark:text-teal-100 text-xs sm:text-sm uppercase tracking-wide">
                      {contrib.title[lang] || contrib.title['en']}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                      {contrib.desc[lang] || contrib.desc['en']}
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-teal-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1 pt-3 border-t border-teal-100/50 dark:border-slate-700 mt-4">
                    <ShieldCheck className="w-3.5 h-3.5" /> Deployed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Technical Expertise & Contacts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tech stack */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-teal-950 dark:text-teal-100 text-sm uppercase tracking-wide border-b border-teal-50 dark:border-slate-800 pb-2">
              {t.skillsTitle[lang]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-emerald-300 text-xs font-bold rounded-lg border border-teal-100 dark:border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education background */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-extrabold text-teal-950 dark:text-teal-100 text-sm uppercase tracking-wide border-b border-teal-50 dark:border-slate-800 pb-2">
              {t.eduTitle[lang]}
            </h3>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-bold leading-relaxed">
              {profile.education}
            </p>
            <p className="text-[11px] text-teal-600 dark:text-emerald-400 font-bold uppercase tracking-wide">
              {profile.university || 'Tribhuvan University, Nepal'}
            </p>
          </div>

          {/* Contact Details */}
          <div className="bg-teal-900 text-white p-6 rounded-3xl shadow-md border-b-4 border-emerald-500 space-y-4">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wide border-b border-teal-800 pb-2">
              {t.contactTitle[lang]}
            </h3>

            <div className="space-y-3 text-xs text-teal-200">
              <a
                href={`mailto:${profile.email}`}
                onClick={() => onTrackAction('Contact Abhishek via Email')}
                className="flex items-center gap-2.5 p-2 bg-teal-950/40 rounded-lg hover:bg-teal-950 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profile.email}</span>
              </a>

              {profile.phone && (
                <div className="flex items-center gap-2.5 p-2 bg-teal-950/40 rounded-lg">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              )}

              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onTrackAction('Open Abhishek Github')}
                  className="flex items-center gap-2.5 p-2 bg-teal-950/40 rounded-lg hover:bg-teal-950 transition-all cursor-pointer"
                >
                  <Github className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profile.github.replace('https://', '')}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Call To Action Button: Official Website */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-teal-950 text-white p-8 rounded-3xl shadow-2xl border-2 border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {lang === 'en' ? 'Explore Abhishek Kumar Chaurasiya\'s Portfolio' : 'अभिषेक कुमार चौरसियाको व्यक्तिगत वेबसाइट'}
          </h2>
          <p className="text-xs sm:text-sm text-teal-200">
            {lang === 'en'
              ? (profile.portalTextEn || 'Discover complete software projects, research papers, and technical blogs at www.achaurasiya.com.np')
              : (profile.portalTextNe || 'www.achaurasiya.com.np मा सम्पूर्ण सफ्टवेयर परियोजनाहरू, अनुसन्धान पत्रहरू र ब्लगहरू हेर्नुहोस्।')}
          </p>
        </div>

        <a
          href={profile.websiteUrl || 'https://www.achaurasiya.com.np'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onTrackAction('Click Official Abhishek Website Link')}
          className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all scale-100 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
        >
          <span>{t.officialWeb[lang]}</span>
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      {/* Admin Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-teal-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-teal-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-teal-950 dark:text-teal-100">
                Edit Abhishek Chaurasiya Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdits} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Title (नेपाली)</label>
                <input
                  type="text"
                  required
                  value={editSubtitleNe}
                  onChange={(e) => setEditSubtitleNe(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Biography (English)</label>
                <textarea
                  rows={4}
                  value={editBioEn}
                  onChange={(e) => setEditBioEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Biography (नेपाली)</label>
                <textarea
                  rows={3}
                  value={editBioNe}
                  onChange={(e) => setEditBioNe(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                />
              </div>

              {/* Tagline / Quote Below Biography */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-teal-50/50 dark:bg-slate-800/50 rounded-xl border border-teal-100 dark:border-slate-700">
                <div>
                  <label className="block text-xs font-bold text-teal-900 dark:text-teal-200 mb-1">Tagline / Quote (English)</label>
                  <input
                    type="text"
                    value={editQuoteEn}
                    onChange={(e) => setEditQuoteEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-teal-900 dark:text-teal-200 mb-1">Tagline / Quote (नेपाली)</label>
                  <input
                    type="text"
                    value={editQuoteNe}
                    onChange={(e) => setEditQuoteNe(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              {/* Official Portal Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-emerald-50/50 dark:bg-slate-800/50 rounded-xl border border-emerald-100 dark:border-slate-700">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">Official Portal Text (English)</label>
                  <input
                    type="text"
                    value={editPortalTextEn}
                    onChange={(e) => setEditPortalTextEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">Official Portal Text (नेपाली)</label>
                  <input
                    type="text"
                    value={editPortalTextNe}
                    onChange={(e) => setEditPortalTextNe(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              {/* Key Digital Contributions Editing */}
              <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-extrabold text-teal-900 dark:text-teal-100 uppercase tracking-wide">
                  Key Digital Contributions (3 Items)
                </label>
                {editContributions.map((contrib, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="text-[10px] font-bold text-teal-600 dark:text-emerald-400 uppercase">
                      Contribution Item #{idx + 1}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Title (English)"
                        value={contrib.title?.en || ''}
                        onChange={(e) => {
                          const updated = [...editContributions];
                          updated[idx].title.en = e.target.value;
                          setEditContributions(updated);
                        }}
                        className="w-full p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs border border-gray-200 dark:border-slate-700"
                      />
                      <input
                        type="text"
                        placeholder="Title (नेपाली)"
                        value={contrib.title?.ne || ''}
                        onChange={(e) => {
                          const updated = [...editContributions];
                          updated[idx].title.ne = e.target.value;
                          setEditContributions(updated);
                        }}
                        className="w-full p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs border border-gray-200 dark:border-slate-700"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <textarea
                        rows={2}
                        placeholder="Description (English)"
                        value={contrib.desc?.en || ''}
                        onChange={(e) => {
                          const updated = [...editContributions];
                          updated[idx].desc.en = e.target.value;
                          setEditContributions(updated);
                        }}
                        className="w-full p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs border border-gray-200 dark:border-slate-700"
                      />
                      <textarea
                        rows={2}
                        placeholder="Description (नेपाली)"
                        value={contrib.desc?.ne || ''}
                        onChange={(e) => {
                          const updated = [...editContributions];
                          updated[idx].desc.ne = e.target.value;
                          setEditContributions(updated);
                        }}
                        className="w-full p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs border border-gray-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Photo Upload to GitHub */}
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Profile Photo URL or Upload to GitHub Repo
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="url"
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    placeholder="https://raw.githubusercontent.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                  <label className="flex items-center gap-2 px-4 py-2 bg-teal-800 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading to GitHub...' : 'Upload Photo'}</span>
                    <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Education Degree / Qualification</label>
                  <input
                    type="text"
                    value={editEducation}
                    onChange={(e) => setEditEducation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">University / Academic Institution</label>
                  <input
                    type="text"
                    value={editUniversity}
                    onChange={(e) => setEditUniversity(e.target.value)}
                    placeholder="Tribhuvan University, Nepal"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Official Website</label>
                <input
                  type="url"
                  value={editWebsiteUrl}
                  onChange={(e) => setEditWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">GitHub</label>
                  <input
                    type="url"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
