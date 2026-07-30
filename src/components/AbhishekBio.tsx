import React, { useState, useEffect } from 'react';
import { Mail, Phone, Github, Linkedin, Facebook, Instagram, Award, BookOpen, Cpu, ShieldCheck, Heart, Edit, Save, X, ExternalLink, Upload, Globe, Calendar, Share2, Check } from 'lucide-react';
import { Language } from '../types';
import { designerProfile as defaultDesignerProfile } from '../data/communityData';
import { uploadImageToGithub, apiFetch, saveFileToGithub } from '../utils/githubDb';
import { compressImageToBase64 } from '../utils/imageUtils';

interface AbhishekBioProps {
  lang: Language;
  onTrackAction: (actionName: string) => void;
  isAdmin?: boolean;
  onUpdateAvatar?: (url: string) => void;
}

export default function AbhishekBio({ lang, onTrackAction, isAdmin = false, onUpdateAvatar }: AbhishekBioProps) {
  const [copiedShare, setCopiedShare] = useState(false);

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
      linkedin: profileData?.linkedin || 'https://www.linkedin.com/in/achaurasiya',
      facebook: profileData?.facebook || 'https://www.facebook.com/achaurasiya',
      instagram: profileData?.instagram || 'https://www.instagram.com/achauraseeya',
      websiteUrl: profileData?.websiteUrl || 'https://www.achaurasiya.com.np',
      avatarUrl: profileData?.avatarUrl || '/abhishek_profile.jpg',
      skills: profileData?.skills || defaultDesignerProfile.skills,
      quoteEn: profileData?.quoteEn || '"Technology holds the power to simplify grassroots community work. By building fast, accessible portals, we elevate traditional agriculture and unite our people under one digital roof."',
      quoteNe: profileData?.quoteNe || '"प्रविधिले तल्लो तहका सामुदायिक कार्यहरूलाई सरलीकरण गर्ने शक्ति राख्छ। द्रुत र पहुँचयोग्य पोर्टलहरू निर्माण गरेर, हामी परम्परागत कृषि र हाम्रो समाजलाई एकै थलोमा जोड्छौँ।"',
      portalTextEn: profileData?.portalTextEn || 'Discover complete software projects, research papers, and technical blogs at www.achaurasiya.com.np',
      portalTextNe: profileData?.portalTextNe || 'www.achaurasiya.com.np मा सम्पूर्ण सफ्टवेयर परियोजनाहरू, अनुसन्धान पत्रहरू र ब्लगहरू हेर्नुहोस्।',
      contributions: profileData?.contributions || [
        {
          title: { en: 'Engineer', ne: 'ईन्जिनियर' },
          desc: {
            en: 'Ministry of Infrastructure Development, Nepal',
            ne: 'पूर्वाधार विकास मन्त्रालय'
          },
          year: '2022 - Present'
        },
        {
          title: { en: 'M.Tech (Structural Engineering)', ne: 'M. Tech (स्ट्रक्चरल ईन्जिनियरिङ्ग)' },
          desc: {
            en: 'IIT Bombay',
            ne: 'भारतीय प्रौद्योगिकी संस्थान बम्बई'
          },
          year: '2020 - 2022'
        },
        {
          title: { en: 'B.E. (Civil Engineering)', ne: 'B.E. (सिभिल ईन्जिनियरिङ्ग)' },
          desc: {
            en: 'Ramaiah Institute of Technology',
            ne: 'रमैया इन्स्टिच्युट अफ टेक्नोलोजी'
          },
          year: '2015 - 2019'
        },
      ]
    };
  });

  // Fetch official profile data from GitHub repository on mount
  useEffect(() => {
    apiFetch<any>('/api/abhishek-profile', 'abhishek_profile.json', null)
      .then((cloudProfile) => {
        if (cloudProfile && typeof cloudProfile === 'object' && cloudProfile.name) {
          const updatedProfile = {
            name: cloudProfile.name || defaultDesignerProfile.name,
            title: cloudProfile.title || 'General Secretary, CTO & Chief Digital Designer of Chaurasiya Samaj Nepal',
            subtitleNe: cloudProfile.subtitleNe || 'महासचिव, सीटीओ र चौरसिया समाज नेपालका प्रमुख डिजिटल डिजाइनर',
            bioEn: cloudProfile.bioEn || defaultDesignerProfile.bio.en,
            bioNe: cloudProfile.bioNe || defaultDesignerProfile.bio.ne,
            education: cloudProfile.education || defaultDesignerProfile.education,
            university: cloudProfile.university || 'Tribhuvan University, Nepal',
            email: cloudProfile.email || defaultDesignerProfile.email,
            phone: cloudProfile.phone || defaultDesignerProfile.phone || '+977-9800000000',
            github: cloudProfile.github || 'https://github.com/achauraseeya',
            linkedin: cloudProfile.linkedin || 'https://www.linkedin.com/in/achaurasiya',
            facebook: cloudProfile.facebook || 'https://www.facebook.com/achaurasiya',
            instagram: cloudProfile.instagram || 'https://www.instagram.com/achauraseeya',
            websiteUrl: cloudProfile.websiteUrl || 'https://www.achaurasiya.com.np',
            avatarUrl: cloudProfile.avatarUrl || '/abhishek_profile.jpg',
            skills: Array.isArray(cloudProfile.skills) ? cloudProfile.skills : defaultDesignerProfile.skills,
            quoteEn: cloudProfile.quoteEn || '"Technology holds the power to simplify grassroots community work. By building fast, accessible portals, we elevate traditional agriculture and unite our people under one digital roof."',
            quoteNe: cloudProfile.quoteNe || '"प्रविधिले तल्लो तहका सामुदायिक कार्यहरूलाई सरलीकरण गर्ने शक्ति राख्छ। द्रुत र पहुँचयोग्य पोर्टलहरू निर्माण गरेर, हामी परम्परागत कृषि र हाम्रो समाजलाई एकै थलोमा जोड्छौँ।"',
            portalTextEn: cloudProfile.portalTextEn || 'Discover complete software projects, research papers, and technical blogs at www.achaurasiya.com.np',
            portalTextNe: cloudProfile.portalTextNe || 'www.achaurasiya.com.np मा सम्पूर्ण सफ्टवेयर परियोजनाहरू, अनुसन्धान पत्रहरू र ब्लगहरू हेर्याउनुहोस्।',
            contributions: Array.isArray(cloudProfile.contributions) ? cloudProfile.contributions : []
          };
          setProfile(updatedProfile);
          if (onUpdateAvatar) {
            onUpdateAvatar(updatedProfile.avatarUrl);
          }
          try {
            localStorage.setItem('chaurasiya_abhishek_profile_data', JSON.stringify(updatedProfile));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, [isAdmin, onUpdateAvatar]);

  // Dynamic Search Engine Meta Tags & JSON-LD Structured Data Injection for SEO Crawlers
  useEffect(() => {
    const origTitle = document.title;
    document.title = "Abhishek Kumar Chaurasiya - Structural Engineer & Public Sector Professional | Chaurasiya Samaj Nepal";

    const shareUrl = `${window.location.origin}/?page=abhishek`;

    // Helper to set or create meta tag
    const setMetaTag = (attr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('name', 'description', 'Official executive biography and professional profile of Er. Abhishek Kumar Chaurasiya - Structural Engineer at Ministry of Infrastructure Development Nepal, M.Tech IIT Bombay.');
    setMetaTag('name', 'keywords', 'Abhishek Kumar Chaurasiya, Abhishek Chaurasiya, Er. Abhishek Chaurasiya, Structural Engineer Nepal, IIT Bombay, MSRIT, Ministry of Infrastructure Development, Chaurasiya Samaj Nepal');
    setMetaTag('name', 'author', 'Abhishek Kumar Chaurasiya');
    setMetaTag('property', 'og:title', 'Abhishek Kumar Chaurasiya - Structural Engineer & Public Sector Professional');
    setMetaTag('property', 'og:description', 'Official biography of Er. Abhishek Kumar Chaurasiya. Structural Engineer at Ministry of Infrastructure Development, Nepal. M.Tech IIT Bombay.');
    setMetaTag('property', 'og:image', profile.avatarUrl);
    setMetaTag('property', 'og:url', shareUrl);
    setMetaTag('property', 'og:type', 'profile');
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', 'Abhishek Kumar Chaurasiya - Engineer Profile');
    setMetaTag('name', 'twitter:description', 'Official executive profile of Er. Abhishek Kumar Chaurasiya, M.Tech IIT Bombay.');
    setMetaTag('name', 'twitter:image', profile.avatarUrl);

    // Canonical link tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', shareUrl);

    // Schema.org JSON-LD Script for Search Engine Crawlers
    const schemaId = 'abhishek-person-schema';
    let schemaScript = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Abhishek Kumar Chaurasiya",
      "alternateName": ["Abhishek Chaurasiya", "Er. Abhishek Kumar Chaurasiya"],
      "jobTitle": "Engineer (Structural Engineering)",
      "worksFor": {
        "@type": "GovernmentOrganization",
        "name": "Ministry of Infrastructure Development, Nepal"
      },
      "alumniOf": [
        {
          "@type": "EducationalOrganization",
          "name": "Indian Institute of Technology Bombay (IIT Bombay)"
        },
        {
          "@type": "EducationalOrganization",
          "name": "Ramaiah Institute of Technology"
        }
      ],
      "url": shareUrl,
      "sameAs": [
        "https://www.linkedin.com/in/achaurasiya",
        "https://www.facebook.com/achaurasiya",
        "https://www.instagram.com/achauraseeya",
        "https://github.com/achauraseeya"
      ],
      "email": ["contact@achaurasiya.com.np", "abhishek.chaurasiya@nepal.gov.np"],
      "telephone": "+977-9818471605",
      "image": profile.avatarUrl,
      "description": "Er. Abhishek Kumar Chaurasiya is a Structural Engineer and public sector professional specializing in earthquake engineering, structural analysis, resilient infrastructure, and sustainable urban development in Nepal."
    };

    schemaScript.text = JSON.stringify(schemaData);

    return () => {
      document.title = origTitle;
      const scriptToRemove = document.getElementById(schemaId);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [profile]);

  const handleShareProfile = async () => {
    const shareUrl = `${window.location.origin}/?page=abhishek`;
    const shareTitle = 'Abhishek Kumar Chaurasiya - Official Profile';
    const shareText = 'Official executive profile of Er. Abhishek Kumar Chaurasiya - Structural Engineer, Ministry of Infrastructure Development, Nepal.';

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onTrackAction('Share Abhishek profile via Web Share API');
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
      onTrackAction('Copy Abhishek profile share link');
    } catch (err) {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

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
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editFacebook, setEditFacebook] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editWebsiteUrl, setEditWebsiteUrl] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editContributions, setEditContributions] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const t = {
    title: { en: `Our Architect: ${profile.name}`, ne: `हाम्रो वास्तुकार: ${profile.name}` },
    aboutMe: { en: 'Executive Biography', ne: 'कार्यकारी जीवनी' },
    skillsTitle: { en: 'Technical Expertise', ne: 'प्राविधिक विशेषज्ञता' },
    eduTitle: { en: 'Academic Foundation', ne: 'शैक्षिक पृष्ठभूमि' },
    contactTitle: { en: 'Get In Touch', ne: 'सम्पर्क गर्नुहोस्' },
    contributions: { en: 'Life Journey', ne: 'जीवन यात्रा' },
    officialWeb: { en: 'Visit Official Personal Website', ne: 'अभिषेकको आधिकारिक वेबसाइट' },
  };

  const contributionsList = [
    {
      title: { en: 'Engineer', ne: 'ईन्जिनियर' },
      desc: {
        en: 'Ministry of Infrastructure Development, Nepal',
        ne: 'पूर्वाधार विकास मन्त्रालय'
      },
      year: '2022 - Present'
    },
    {
      title: { en: 'M.Tech (Structural Engineering)', ne: 'M. Tech (स्ट्रक्चरल ईन्जिनियरिङ्ग)' },
      desc: {
        en: 'IIT Bombay',
        ne: 'भारतीय प्रौद्योगिकी संस्थान बम्बई'
      },
      year: '2020 - 2022'
    },
    {
      title: { en: 'B.E. (Civil Engineering)', ne: 'B.E. (सिभिल ईन्जिनियरिङ्ग)' },
      desc: {
        en: 'Ramaiah Institute of Technology',
        ne: 'रमैया इन्स्टिच्युट अफ टेक्नोलोजी'
      },
      year: '2015 - 2019'
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
    setEditLinkedin(profile.linkedin || 'https://www.linkedin.com/in/achaurasiya');
    setEditFacebook(profile.facebook || 'https://www.facebook.com/achaurasiya');
    setEditInstagram(profile.instagram || 'https://www.instagram.com/achauraseeya');
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
      linkedin: editLinkedin,
      facebook: editFacebook,
      instagram: editInstagram,
      websiteUrl: editWebsiteUrl,
      avatarUrl: editAvatarUrl || profile.avatarUrl,
      skills: updatedSkills.length > 0 ? updatedSkills : profile.skills,
      contributions: editContributions.length > 0 ? editContributions : profile.contributions,
    };

    setProfile(updatedProfile);
    localStorage.setItem('chaurasiya_abhishek_profile_data', JSON.stringify(updatedProfile));
    saveFileToGithub('abhishek_profile.json', updatedProfile, 'Update Abhishek profile data').catch(() => {});
    if (onUpdateAvatar) {
      onUpdateAvatar(updatedProfile.avatarUrl);
    }
    setIsEditModalOpen(false);
    onTrackAction('Admin edited Abhishek profile');
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const base64 = await compressImageToBase64(file, 500);
      try {
        // Upload photo to GitHub Repo
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
    } catch (err) {
      setIsUploading(false);
    }
  };

  const canEdit = isAdmin || (typeof window !== 'undefined' && localStorage.getItem('csn_admin_authenticated') === 'true');

  return (
    <article itemScope itemType="https://schema.org/Person" className="space-y-12 animate-in fade-in duration-300">
      {/* Bio Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 text-white rounded-3xl py-12 px-6 sm:px-12 shadow-xl border-b-8 border-emerald-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_40%)]" />
        
        <div className="relative max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar frame */}
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-teal-400 bg-white shadow-xl shrink-0 relative group">
              <img
                src={profile.avatarUrl}
                alt="Abhishek Kumar Chaurasiya"
                itemProp="image"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {canEdit && (
                <button
                  onClick={openEditModal}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer text-xs font-bold gap-1"
                  title="Change Photo / Edit Profile"
                >
                  <Edit className="w-5 h-5 text-amber-300" />
                  <span>{lang === 'en' ? 'Edit Photo' : 'फोटो फेर्नुहोस्'}</span>
                </button>
              )}
            </div>

            <div className="space-y-3 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
                Volunteer
              </span>
              <h1 itemProp="name" className="text-3xl sm:text-4xl font-black tracking-tight text-teal-50">
                {profile.name}
              </h1>
              <p itemProp="jobTitle" className="text-sm sm:text-base text-teal-200 font-bold max-w-2xl">
                {lang === 'en' ? profile.title : profile.subtitleNe}
              </p>
            </div>
          </div>

          {/* Action Buttons: Edit Profile (Admin) & Share Profile */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {canEdit && (
              <button
                onClick={openEditModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
                title="Edit Executive Profile (Admin)"
              >
                <Edit className="w-4 h-4 text-slate-950" />
                <span>{lang === 'en' ? 'Edit Profile' : 'प्रोफाइल सम्पादन'}</span>
              </button>
            )}
            <button
              onClick={handleShareProfile}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer"
              title="Share Profile Link"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'en' ? 'Link Copied!' : 'लिङ्क कपी भयो!'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'en' ? 'Share Profile' : 'प्रोफाइल सेयर गर्नुहोस्'}</span>
                </>
              )}
            </button>
          </div>
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
            <div className="space-y-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
              {(lang === 'en' ? profile.bioEn : profile.bioNe)
                ? (lang === 'en' ? profile.bioEn : profile.bioNe)
                    .split('\n')
                    .map((para: string, idx: number) => {
                      const trimmed = para.trim();
                      if (!trimmed) return null;
                      return <p key={idx}>{trimmed}</p>;
                    })
                : null}
            </div>

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
              {(profile.contributions && profile.contributions.length > 0 ? profile.contributions : contributionsList).map((contrib: any, i: number) => {
                const yearText = contrib.year || (i === 0 ? '2022 - Present' : i === 1 ? '2020 - 2022' : '2015 - 2019');
                return (
                  <div key={i} className="space-y-2 p-4 bg-teal-50/30 dark:bg-slate-800/50 rounded-xl border border-teal-100/60 dark:border-slate-700 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-teal-900 dark:text-teal-100 text-xs sm:text-sm uppercase tracking-wide">
                        {contrib.title[lang] || contrib.title['en']}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                        {contrib.desc[lang] || contrib.desc['en']}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-teal-700 dark:text-emerald-400 tracking-wider flex items-center gap-1.5 pt-3 border-t border-teal-100/50 dark:border-slate-700 mt-4">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
                      {yearText}
                    </span>
                  </div>
                );
              })}
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
              {profile.email && profile.email.split(',').map((em: string, idx: number) => {
                const cleanEmail = em.trim();
                if (!cleanEmail) return null;
                return (
                  <a
                    key={idx}
                    href={`mailto:${cleanEmail}`}
                    onClick={() => onTrackAction(`Contact Abhishek via Email (${cleanEmail})`)}
                    className="flex items-center gap-2.5 p-2 bg-teal-950/40 rounded-lg hover:bg-teal-950 transition-all cursor-pointer break-all"
                  >
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{cleanEmail}</span>
                  </a>
                );
              })}

              {profile.phone && (
                <div className="flex items-center gap-2.5 p-2 bg-teal-950/40 rounded-lg">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              )}

              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onTrackAction('Open Abhishek LinkedIn')}
                  className="flex items-center gap-2.5 p-2 bg-teal-950/40 rounded-lg hover:bg-teal-950 transition-all cursor-pointer"
                >
                  <Linkedin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profile.linkedin.replace('https://', '')}</span>
                </a>
              )}

              {profile.facebook && (
                <a
                  href={profile.facebook}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onTrackAction('Open Abhishek Facebook')}
                  className="flex items-center gap-2.5 p-2 bg-teal-950/40 rounded-lg hover:bg-teal-950 transition-all cursor-pointer"
                >
                  <Facebook className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profile.facebook.replace('https://', '')}</span>
                </a>
              )}

              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onTrackAction('Open Abhishek Instagram')}
                  className="flex items-center gap-2.5 p-2 bg-teal-950/40 rounded-lg hover:bg-teal-950 transition-all cursor-pointer"
                >
                  <Instagram className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profile.instagram.replace('https://', '')}</span>
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
                  Life Journey (3 Items)
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
                    <div>
                      <input
                        type="text"
                        placeholder="Year / Period (e.g. 2022 - Present)"
                        value={contrib.year || ''}
                        onChange={(e) => {
                          const updated = [...editContributions];
                          updated[idx].year = e.target.value;
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email(s)</label>
                  <input
                    type="text"
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={editFacebook}
                    onChange={(e) => setEditFacebook(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
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
    </article>
  );
}
