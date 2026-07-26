import React, { useState, useEffect } from 'react';
import { Target, Compass, CheckCircle2, History, Edit, Save, X, ExternalLink, Image as ImageIcon, Upload, Sparkles, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { uploadImageToGithub, apiFetch, saveFileToGithub } from '../utils/githubDb';

export type AboutSubsectionId = 'about-vision' | 'about-mission' | 'about-objectives' | 'about-history';

interface AboutSectionData {
  id: AboutSubsectionId;
  title: { en: string; ne: string };
  subtitle: { en: string; ne: string };
  badge: { en: string; ne: string };
  content: { en: string; ne: string };
  points: { en: string[]; ne: string[] };
  imageUrl: string;
  bloggerPageUrl: string;
}

const defaultAboutData: Record<AboutSubsectionId, AboutSectionData> = {
  'about-vision': {
    id: 'about-vision',
    title: {
      en: 'Our Vision for Chaurasiya Samaj Nepal',
      ne: 'चौरसिया समाज नेपालको दूरदृष्टि',
    },
    subtitle: {
      en: 'Building a synchronized, prosperous, and culturally vibrant community across Nepal.',
      ne: 'नेपालभर एकताबद्ध, समृद्ध र सांस्कृतिक रूपमा जीवन्त समुदायको निर्माण।',
    },
    badge: { en: 'Strategic Vision 2030', ne: 'दीर्घकालीन रणनीति २०८५' },
    content: {
      en: 'Our vision is to empower every Chaurasiya family in Nepal with modern digital connectivity, economic sustainability, educational scholarships, and healthcare accessibility while upholding our sacred centuries-old cultural heritage and agricultural roots in betel leaf (paan) cultivation.',
      ne: 'नेपालका प्रत्येक चौरसिया परिवारलाई आधुनिक डिजिटल पहुँच, आर्थिक आत्मनिर्भरता, शैक्षिक छात्रवृत्ति र स्वास्थ्य सुविधा प्रदान गर्दै हाम्रो पवित्र शताब्दीयौँ पुरानो सांस्कृतिक सम्पदा र पान खेतीको परम्परालाई संरक्षण गर्नु हाम्रो मुख्य दूरदृष्टि हो।',
    },
    points: {
      en: [
        'Complete digital indexing and verification of all Chaurasiya households across 77 districts.',
        'Economic empowerment of traditional betel vine farmers through modern technology and cold-warning networks.',
        'Establishing community centers and educational funds in every province of Nepal.',
        'Promoting youth innovation, leadership development, and matrimonial support.',
      ],
      ne: [
        'नेपालका ७७ वटै जिल्लाका सबै चौरसिया परिवारहरूको पूर्ण डिजिटल दर्ता र प्रमाणीकरण।',
        'आधुनिक प्रविधि र चिसो चेतावनी प्रणाली मार्फत परम्परागत पान कृषकहरूको आर्थिक सशक्तिकरण।',
        'नेपालका प्रत्येक प्रदेशमा सामुदायिक भवन र शैक्षिक अक्षयकोषको स्थापना।',
        'युवा नवीनता, नेतृत्व विकास र वैवाहिक सहयोग प्रवर्द्धन।',
      ],
    },
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
    bloggerPageUrl: 'https://csnepalwebsite.blogspot.com/p/vision.html',
  },
  'about-mission': {
    id: 'about-mission',
    title: {
      en: 'Our Mission & Core Purpose',
      ne: 'हाम्रो लक्ष्य तथा मुख्य उद्देश्य',
    },
    subtitle: {
      en: 'Uniting grassroots voices, advancing welfare, and ensuring organizational transparency.',
      ne: 'तल्लो तहका आवाजहरूलाई एकताबद्ध गर्दै, जनकल्याण प्रवर्द्धन र संस्थागत पारदर्शिता सुनिश्चित गर्ने।',
    },
    badge: { en: 'Executive Mission', ne: 'कार्यकारी लक्ष्य' },
    content: {
      en: 'Our mission is to construct a non-profit, transparent, and inclusive umbrella organization that advocates for the rights, socio-economic advancement, and cultural dignity of the Chaurasiya community in Nepal.',
      ne: 'हाम्रो लक्ष्य नेपालमा चौरसिया समुदायको अधिकार, सामाजिक-आर्थिक उन्नति र सांस्कृतिक स्वाभिमानको वकालत गर्ने एक गैर-नाफामूलक, पारदर्शी र समावेशी छाता संगठनको निर्माण गर्नु हो।',
    },
    points: {
      en: [
        'Bridge rural farmers and urban youth through structured municipal and district chapters.',
        'Deploy real-time disaster alerts, agricultural advisory, and emergency relief funds.',
        'Provide structured matrimonial and social networking services with privacy safeguards.',
        'Safeguard traditional craftsmanship and paan cultivation knowledge for future generations.',
      ],
      ne: [
        'व्यवस्थित नगर र जिल्ला शाखाहरू मार्फत ग्रामीण कृषकहरू र सहरी युवाहरूलाई जोड्ने।',
        'वास्तविक समयको विपद् चेतावनी, कृषि परामर्श र आपत्कालीन राहत कोष परिचालन।',
        'गोपनीयता सुरक्षा सहित व्यवस्थित वैवाहिक र सामाजिक सञ्जाल सेवाहरू प्रदान गर्ने।',
        'भावी पुस्ताका लागि परम्परागत पान खेतीको ज्ञान र सीपको संरक्षण गर्ने।',
      ],
    },
    imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1200',
    bloggerPageUrl: 'https://csnepalwebsite.blogspot.com/p/mission.html',
  },
  'about-objectives': {
    id: 'about-objectives',
    title: {
      en: 'Key Objectives & Action Directives',
      ne: 'प्रमुख उद्देश्यहरू तथा कार्य योजनाहरू',
    },
    subtitle: {
      en: 'Clear target benchmarks driving social progress, education, and welfare.',
      ne: 'सामाजिक प्रगति, शिक्षा र कल्याणलाई अगाडि बढाउने स्पष्ट लक्ष्यहरू।',
    },
    badge: { en: 'Strategic Objectives', ne: 'रणनीतिक उद्देश्यहरू' },
    content: {
      en: 'Chaurasiya Samaj Nepal operates with well-defined short-term and long-term objectives aimed at upliftment, educational scholarships, preservation of rights, and institutional strength.',
      ne: 'चौरसिया समाज नेपालले उन्नति, शैक्षिक छात्रवृत्ति, अधिकार संरक्षण र संस्थागत मजबुतीका लागि स्पष्ट अल्पकालीन र दीर्घकालीन उद्देश्यहरूका साथ काम गर्दछ।',
    },
    points: {
      en: [
        '1. Establish verified district committees in key provinces including Madhesh, Bagmati, and Lumbini.',
        '2. Provide annual merit and hardship scholarships to high-performing Chaurasiya students.',
        '3. Organize healthcare, blood donation, and eye treatment camps in rural Terai districts.',
        '4. Maintain a free public digital archives of documents, historical notices, and photo records.',
      ],
      ne: [
        '१. मधेश, बागमती र लुम्बिनी लगायतका प्रमुख प्रदेशहरूमा प्रमाणित जिल्ला समितिहरू गठन गर्ने।',
        '२. जेहेन्दार र विपन्न चौरसिया विद्यार्थीहरूलाई वार्षिक छात्रवृत्ति प्रदान गर्ने।',
        '३. तराईका ग्रामीण जिल्लाहरूमा स्वास्थ्य, रक्तदान र आँखा शिविर सञ्चालन गर्ने।',
        '४. कागजात, ऐतिहासिक सूचना र फोटोहरूको नि:शुल्क सार्वजनिक डिजिटल सङ्ग्रह कायम राख्ने।',
      ],
    },
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    bloggerPageUrl: 'https://csnepalwebsite.blogspot.com/p/objectives.html',
  },
  'about-history': {
    id: 'about-history',
    title: {
      en: 'History & Evolution of Chaurasiya Samaj Nepal',
      ne: 'चौरसिया समाज नेपालको इतिहास र विकास क्रम',
    },
    subtitle: {
      en: 'From local village agricultural cooperatives to a registered national federation.',
      ne: 'स्थानीय गाउँका कृषि सहकारीदेखि दर्ता भई राष्ट्रिय महासंघसम्मको यात्रा।',
    },
    badge: { en: 'Institutional Heritage', ne: 'संस्थागत इतिहास' },
    content: {
      en: 'The formal organization of Chaurasiya Samaj Nepal began as a grassroots movement among betel vine cultivators in Parsa and Bara districts to protect their harvests and support one another in times of grief and celebration. Over decades, this collective grew into a fully registered national NGO promoting unity and progress.',
      ne: 'चौरसिया समाज नेपालको औपचारिक संगठनको सुरुवात पर्सा र बारा जिल्लाका पान खेती गर्ने कृषकहरूबाट भएको थियो। आपत्-विपत् र उत्सवहरूमा एक-अर्कालाई सहयोग गर्न सुरु भएको यो अभियान दशकौँपछि एक सशक्त राष्ट्रिय सामाजिक संस्थामा रूपान्तरित भएको हो।',
    },
    points: {
      en: [
        '1995: Initial district gatherings of Chaurasiya elders in Birgunj, Parsa.',
        '2008: Formation of central coordination committees across Madhesh Province.',
        '2014: Official NGO registration with Government of Nepal (Reg. 12345/071).',
        '2024: Launch of the digital central database, mobile alert systems, and Blogger XML integration.',
      ],
      ne: [
        '१९९५: वीरगञ्ज, पर्सामा चौरसिया अगुवाहरूको प्रारम्भिक जिल्ला भेला।',
        '२००८: मधेश प्रदेशका जिल्लाहरूमा केन्द्रीय समन्वय समितिको गठन।',
        '२०१४: नेपाल सरकारमा सामाजिक संस्थाको रूपमा औपचारिक दर्ता (दर्ता नं. १२३४५/०७१)।',
        '२०२४: डिजिटल केन्द्रीय डाटाबेस, मोबाइल अलर्ट प्रणाली र ब्लगर XML को शुभारम्भ।',
      ],
    },
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1200',
    bloggerPageUrl: 'https://csnepalwebsite.blogspot.com/p/history.html',
  },
};

interface AboutSectionPageProps {
  currentTab: string;
  onNavigate: (tabId: string) => void;
  lang: Language;
  isAdmin: boolean;
  onTrackAction: (actionName: string) => void;
}

export default function AboutSectionPage({
  currentTab,
  onNavigate,
  lang,
  isAdmin,
  onTrackAction,
}: AboutSectionPageProps) {
  // Load data from localStorage or fallback
  const [sectionsData, setSectionsData] = useState<Record<AboutSubsectionId, AboutSectionData>>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_about_sections_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultAboutData, ...parsed };
      }
    } catch (e) {}
    return defaultAboutData;
  });

  // Fetch online server about sections on mount so ALL devices get updated content
  useEffect(() => {
    apiFetch<Record<AboutSubsectionId, AboutSectionData>>('/api/about-sections', 'about_sections.json', defaultAboutData)
      .then((cloudData) => {
        if (cloudData && typeof cloudData === 'object' && Object.keys(cloudData).length > 0) {
          setSectionsData((prev) => {
            const merged = { ...prev, ...cloudData };
            try {
              localStorage.setItem('chaurasiya_about_sections_data', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  // Active subsection fallback
  const activeSubsectionId: AboutSubsectionId = (
    currentTab === 'about-vision' || currentTab === 'about-mission' || currentTab === 'about-objectives' || currentTab === 'about-history'
      ? currentTab
      : 'about-vision'
  ) as AboutSubsectionId;

  const currentData = sectionsData[activeSubsectionId] || defaultAboutData['about-vision'];

  // Admin edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitleEn, setEditTitleEn] = useState('');
  const [editTitleNe, setEditTitleNe] = useState('');
  const [editSubtitleEn, setEditSubtitleEn] = useState('');
  const [editSubtitleNe, setEditSubtitleNe] = useState('');
  const [editContentEn, setEditContentEn] = useState('');
  const [editContentNe, setEditContentNe] = useState('');
  const [editPointsEn, setEditPointsEn] = useState('');
  const [editPointsNe, setEditPointsNe] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editBloggerUrl, setEditBloggerUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const openEditModal = () => {
    setEditTitleEn(currentData.title.en);
    setEditTitleNe(currentData.title.ne);
    setEditSubtitleEn(currentData.subtitle.en);
    setEditSubtitleNe(currentData.subtitle.ne);
    setEditContentEn(currentData.content.en);
    setEditContentNe(currentData.content.ne);
    setEditPointsEn(currentData.points.en.join('\n'));
    setEditPointsNe(currentData.points.ne.join('\n'));
    setEditImageUrl(currentData.imageUrl);
    setEditBloggerUrl(currentData.bloggerPageUrl);
    setIsEditModalOpen(true);
  };

  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPointsEn = editPointsEn.split('\n').filter(p => p.trim().length > 0);
    const updatedPointsNe = editPointsNe.split('\n').filter(p => p.trim().length > 0);

    const updatedData: AboutSectionData = {
      ...currentData,
      title: { en: editTitleEn, ne: editTitleNe },
      subtitle: { en: editSubtitleEn, ne: editSubtitleNe },
      content: { en: editContentEn, ne: editContentNe },
      points: { en: updatedPointsEn, ne: updatedPointsNe },
      imageUrl: editImageUrl || currentData.imageUrl,
      bloggerPageUrl: editBloggerUrl || currentData.bloggerPageUrl,
    };

    const nextSections = {
      ...sectionsData,
      [activeSubsectionId]: updatedData,
    };

    setSectionsData(nextSections);
    localStorage.setItem('chaurasiya_about_sections_data', JSON.stringify(nextSections));
    saveFileToGithub('about_sections.json', nextSections, `Admin edited About section ${activeSubsectionId}`).catch(() => {});
    setIsEditModalOpen(false);
    onTrackAction(`Admin edited ${activeSubsectionId}`);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const githubUrl = await uploadImageToGithub(
            `about_${activeSubsectionId}_${Date.now()}.jpg`,
            base64,
            `Update image for ${activeSubsectionId}`
          );
          setEditImageUrl(githubUrl);
        } catch (err) {
          // Fallback to raw base64 or object URL if GitHub is disabled
          setEditImageUrl(base64);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploading(false);
    }
  };

  const subsectionsList: { id: AboutSubsectionId; label: { en: string; ne: string }; icon: any }[] = [
    { id: 'about-vision', label: { en: 'Vision', ne: 'दूरदृष्टि' }, icon: Compass },
    { id: 'about-mission', label: { en: 'Mission', ne: 'लक्ष्य तथा उद्देश्य' }, icon: Target },
    { id: 'about-objectives', label: { en: 'Objectives', ne: 'प्रमुख उद्देश्यहरू' }, icon: CheckCircle2 },
    { id: 'about-history', label: { en: 'History', ne: 'इतिहास र विकास' }, icon: History },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Subsection Tabs Header */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {subsectionsList.map((sub) => {
            const IconComp = sub.icon;
            const isActive = activeSubsectionId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onNavigate(sub.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 dark:bg-emerald-700 text-white shadow-sm scale-[1.02]'
                    : 'bg-teal-50/60 dark:bg-slate-800 text-teal-900 dark:text-teal-100 hover:bg-teal-100 dark:hover:bg-slate-700'
                }`}
              >
                <IconComp className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{sub.label[lang]}</span>
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <button
            onClick={openEditModal}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>{lang === 'en' ? 'Edit Section (Admin)' : 'सम्पादन गर्नुहोस् (प्रशासक)'}</span>
          </button>
        )}
      </div>

      {/* Main Subsection Card */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-md overflow-hidden">
        {/* Banner with image background */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-teal-950">
          <img
            src={currentData.imageUrl}
            alt={currentData.title[lang]}
            className="w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 max-w-4xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {currentData.badge[lang]}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {currentData.title[lang]}
            </h1>
            <p className="text-xs sm:text-sm text-teal-200 font-medium">
              {currentData.subtitle[lang]}
            </p>
          </div>
        </div>

        {/* Body Content & Highlights */}
        <div className="p-6 sm:p-10 space-y-8">
          <div className="bg-teal-50/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-teal-100 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-teal-950 dark:text-teal-100 border-b border-teal-100 dark:border-slate-700 pb-2">
              {lang === 'en' ? 'Executive Overview' : 'कार्यकारी सार संक्षेप'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
              {currentData.content[lang]}
            </p>
          </div>

          {/* Key Bullet Points */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-teal-950 dark:text-teal-100 border-b border-teal-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              {lang === 'en' ? 'Core Pillars & Action Directives' : 'मुख्य स्तम्भहरू र कार्य योजनाहरू'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentData.points[lang].map((pt, idx) => (
                <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-teal-100 dark:border-slate-700 shadow-sm flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                    {pt}
                  </p>
                </div>
              ))}
            </div>
          </div>


        </div>
      </section>

      {/* Admin Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-teal-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-teal-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-teal-950 dark:text-teal-100">
                  {lang === 'en' ? `Edit ${currentData.title.en}` : `सम्पादन गर्नुहोस्: ${currentData.title.ne}`}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdits} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitleEn}
                    onChange={(e) => setEditTitleEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Title (नेपाली)
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitleNe}
                    onChange={(e) => setEditTitleNe(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Subtitle (English)
                  </label>
                  <input
                    type="text"
                    value={editSubtitleEn}
                    onChange={(e) => setEditSubtitleEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Subtitle (नेपाली)
                  </label>
                  <input
                    type="text"
                    value={editSubtitleNe}
                    onChange={(e) => setEditSubtitleNe(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Main Overview / Description (English)
                </label>
                <textarea
                  rows={3}
                  value={editContentEn}
                  onChange={(e) => setEditContentEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Main Overview / Description (नेपाली)
                </label>
                <textarea
                  rows={3}
                  value={editContentNe}
                  onChange={(e) => setEditContentNe(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Bullet Points (English - One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={editPointsEn}
                    onChange={(e) => setEditPointsEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Bullet Points (नेपाली - प्रति लाइन एक)
                  </label>
                  <textarea
                    rows={4}
                    value={editPointsNe}
                    onChange={(e) => setEditPointsNe(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Image & Upload */}
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Header Image URL or File Upload
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                  <label className="flex items-center gap-2 px-4 py-2 bg-teal-800 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-teal-700 transition-colors shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Blogger URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Blogger Page URL
                </label>
                <input
                  type="url"
                  value={editBloggerUrl}
                  onChange={(e) => setEditBloggerUrl(e.target.value)}
                  placeholder="https://csnepalwebsite.blogspot.com/p/vision.html"
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-mono"
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
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
