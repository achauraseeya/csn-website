import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Edit, Save, X, ExternalLink, ShieldCheck, Heart, Leaf, MapPin, Upload } from 'lucide-react';
import { Language } from '../types';
import { uploadImageToGithub, apiFetch, saveFileToGithub } from '../utils/githubDb';

interface HeritageData {
  title: { en: string; ne: string };
  subtitle: { en: string; ne: string };
  originTitle: { en: string; ne: string };
  originContent: { en: string; ne: string };
  paanTitle: { en: string; ne: string };
  paanContent: { en: string; ne: string };
  cultureTitle: { en: string; ne: string };
  cultureContent: { en: string; ne: string };
  timeline: { year: string; title: { en: string; ne: string }; desc: { en: string; ne: string } }[];
  imageUrl: string;
  bloggerPageUrl: string;
}

const defaultHeritageData: HeritageData = {
  title: {
    en: 'Sacred Heritage & History of the Chaurasiya Caste',
    ne: 'चौरासिया जातिको पवित्र सम्पदा र इतिहास',
  },
  subtitle: {
    en: 'Tracing our ancient roots, agricultural mastery in betel vine cultivation, and cultural dignity in Nepal and Madhesh.',
    ne: 'हाम्रो प्राचीन जरा, पान खेतीको कृषि विशेषज्ञता, र नेपाल तथा मधेशमा सांस्कृतिक स्वाभिमान।',
  },
  originTitle: {
    en: '1. Ancient Origins & Gotra Lineage',
    ne: '१. प्राचीन उत्पत्ति र गोत्र परम्परा',
  },
  originContent: {
    en: 'The Chaurasiya community (traditionally associated with Barai, Tamboli, and Kashyap / Nagavanshi lineages) holds an esteemed history dating back thousands of years. The name Chaurasiya is rooted in the numerical ancient administrative cluster "Chaurasi" (84 villages), denoting an influential confederation of agricultural masters skilled in cultivating sacred Betel Leaves (Paan).',
    ne: 'चौरासिया समुदाय (परम्परागत रूपमा बरई, तमोली र काश्यप/नागवंशी वंशसँग जोडिएको) हजारौँ वर्ष पुरानो प्रतिष्ठित इतिहास बोकेको समुदाय हो। चौरासिया शब्दको उत्पत्ति ८४ (चौरासी) गाउँको प्राचीन प्रशासनिक समूहबाट भएको हो, जसले पवित्र पान खेतीमा पारंगत कृषकहरूको प्रभावशाली संगठनलाई जनाउँछ।',
  },
  paanTitle: {
    en: '2. The Sacred Art of Betel Leaf (Paan) Cultivation',
    ne: '२. पवित्र पान खेतीको कृषि कला',
  },
  paanContent: {
    en: 'For generations across the fertile plains of Nepal Terai (Parsa, Bara, Rautahat, Sarlahi, Dhanusha, Mahottari, Siraha, Saptari, Morang, Nawalparasi, and Kapilvastu), Chaurasiya families have been the traditional custodians of Bareja (Betel Vine Conservatories). Cultivating betel leaves requires immense devotion, scientific moisture control, and organic soil management.',
    ne: 'नेपालको तराई (पर्सा, बारा, रौतहट, सर्लाही, धनुषा, महोत्तरी, सिरहा, सप्तरी, मोरङ, नवलपरासी र कपिलवस्तु) का उर्वर भूमिहरूमा पुस्ताौँदेखि चौरासिया परिवारहरू बरैजा (पानको भीट) का संरक्षक रहँदै आएका छन्। पान खेतीका लागि अत्यधिक समर्पण, वैज्ञानिक आर्द्रता नियन्त्रण र जैविक माटो व्यवस्थापन आवश्यक पर्दछ।',
  },
  cultureTitle: {
    en: '3. Cultural Festivals, Unity & Modern Progression',
    ne: '३. सांस्कृतिक चाडपर्व, एकता र आधुनिक प्रगति',
  },
  cultureContent: {
    en: 'Chaurasiyas celebrate vibrant festivals including Nag Panchami, Chhath Puja, Vishwakarma Puja, and Holi with great fervor. Today, while maintaining deep respect for agricultural roots, Chaurasiya youth excel across software engineering, medicine, civil service, law, education, and international diplomacy.',
    ne: 'चौरासिया समाजले नाग पञ्चमी, छठ पूजा, विश्वकर्मा पूजा र होली लगायतका चाडपर्वहरू हर्षोल्लासका साथ मनाउँछन्। आज कृषि परम्पराको सम्मान गर्दै चौरासिया युवाहरू सफ्टवेयर इन्जिनियरिङ, चिकित्सा, निजामती सेवा, कानून, शिक्षा र अन्तर्राष्ट्रिय क्षेत्रमा उत्कृष्ट प्रदर्शन गरिरहेका छन्।',
  },
  timeline: [
    {
      year: 'Vedic Era',
      title: { en: 'Mentions of Nagavanshi Betel Cultivators', ne: 'नागवंशी पान कृषकहरूको उल्लेख' },
      desc: {
        en: 'Historical references to betel leaf offering (Tambula) in ancient Sanskrit scriptures as a symbol of hospitality.',
        ne: 'प्राचीन संस्कृत ग्रन्थहरूमा आतिथ्यको प्रतीकको रूपमा पान अर्पण (ताम्बुल) को ऐतिहासिक उल्लेख।',
      },
    },
    {
      year: '18th Century',
      title: { en: 'Settlements in Central Terai of Nepal', ne: 'नेपालको मध्य तराईमा बसोबास' },
      desc: {
        en: 'Establishment of fertile Bareja plantations supplying premium betel leaves across Nepal and Northern India.',
        ne: 'नेपाल र उत्तरी भारतभर प्रिमियम पान आपूर्ति गर्ने उर्वर बरैजा खेतीहरूको स्थापना।',
      },
    },
    {
      year: 'Modern Era',
      title: { en: 'National Federation & Digital Integration', ne: 'राष्ट्रिय महासंघ र डिजिटल एकीकरण' },
      desc: {
        en: 'Forming Chaurasiya Samaj Nepal to unify members, support farmers, and digitally document community directory.',
        ne: 'सदस्यहरूलाई एकताबद्ध गर्न, कृषकहरूलाई सहयोग गर्न र समुदायको निर्देशिकालाई डिजिटल रूपमा दस्तावेज गर्न चौरासिया समाज नेपालको स्थापना।',
      },
    },
  ],
  imageUrl: 'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?auto=format&fit=crop&q=80&w=1200',
  bloggerPageUrl: 'https://csnepalwebsite.blogspot.com/p/our-heritage.html',
};

interface OurHeritagePageProps {
  lang: Language;
  isAdmin: boolean;
  onTrackAction: (actionName: string) => void;
}

import { compressImageToBase64 } from '../utils/imageUtils';

export default function OurHeritagePage({ lang, isAdmin, onTrackAction }: OurHeritagePageProps) {
  const [heritageData, setHeritageData] = useState<HeritageData>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_our_heritage_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultHeritageData, ...parsed };
      }
    } catch (e) {}
    return defaultHeritageData;
  });

  // Fetch online GitHub heritage data on mount
  useEffect(() => {
    apiFetch<HeritageData>('/api/our-heritage', 'our_heritage.json', defaultHeritageData)
      .then((cloudData) => {
        if (cloudData && typeof cloudData === 'object' && cloudData.title) {
          const merged = { ...defaultHeritageData, ...cloudData };
          setHeritageData(merged);
          try {
            localStorage.setItem('chaurasiya_our_heritage_data', JSON.stringify(merged));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  // Admin edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitleEn, setEditTitleEn] = useState('');
  const [editTitleNe, setEditTitleNe] = useState('');
  const [editSubtitleEn, setEditSubtitleEn] = useState('');
  const [editSubtitleNe, setEditSubtitleNe] = useState('');
  const [editOriginEn, setEditOriginEn] = useState('');
  const [editOriginNe, setEditOriginNe] = useState('');
  const [editPaanEn, setEditPaanEn] = useState('');
  const [editPaanNe, setEditPaanNe] = useState('');
  const [editCultureEn, setEditCultureEn] = useState('');
  const [editCultureNe, setEditCultureNe] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editBloggerUrl, setEditBloggerUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const openEditModal = () => {
    setEditTitleEn(heritageData.title.en);
    setEditTitleNe(heritageData.title.ne);
    setEditSubtitleEn(heritageData.subtitle.en);
    setEditSubtitleNe(heritageData.subtitle.ne);
    setEditOriginEn(heritageData.originContent.en);
    setEditOriginNe(heritageData.originContent.ne);
    setEditPaanEn(heritageData.paanContent.en);
    setEditPaanNe(heritageData.paanContent.ne);
    setEditCultureEn(heritageData.cultureContent.en);
    setEditCultureNe(heritageData.cultureContent.ne);
    setEditImageUrl(heritageData.imageUrl);
    setEditBloggerUrl(heritageData.bloggerPageUrl);
    setIsEditModalOpen(true);
  };

  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: HeritageData = {
      ...heritageData,
      title: { en: editTitleEn, ne: editTitleNe },
      subtitle: { en: editSubtitleEn, ne: editSubtitleNe },
      originContent: { en: editOriginEn, ne: editOriginNe },
      paanContent: { en: editPaanEn, ne: editPaanNe },
      cultureContent: { en: editCultureEn, ne: editCultureNe },
      imageUrl: editImageUrl || heritageData.imageUrl,
      bloggerPageUrl: editBloggerUrl || heritageData.bloggerPageUrl,
    };

    setHeritageData(updated);
    localStorage.setItem('chaurasiya_our_heritage_data', JSON.stringify(updated));
    saveFileToGithub('our_heritage.json', updated, 'Admin edited Our Heritage page data').catch(() => {});
    setIsEditModalOpen(false);
    onTrackAction('Admin edited Our Heritage page');
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const base64 = await compressImageToBase64(file, 500);
      try {
        const githubUrl = await uploadImageToGithub(
          `heritage_photo_${Date.now()}.jpg`,
          base64,
          'Update Our Heritage cover image'
        );
        setEditImageUrl(githubUrl);
      } catch (err) {
        setEditImageUrl(base64);
      } finally {
        setIsUploading(false);
      }
    } catch (err) {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 text-white rounded-3xl py-12 px-6 sm:px-12 shadow-xl border-b-8 border-emerald-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_40%)]" />
        
        <div className="relative max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              {lang === 'en' ? 'Cultural Legacy & Lineage' : 'सांस्कृतिक विरासत र वंश'}
            </span>

            {isAdmin && (
              <button
                onClick={openEditModal}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                <span>{lang === 'en' ? 'Edit Heritage Page' : 'सम्पदा पृष्ठ सम्पादन'}</span>
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-teal-50">
            {heritageData.title[lang]}
          </h1>
          <p className="text-sm sm:text-base text-teal-200 font-bold max-w-3xl leading-relaxed">
            {heritageData.subtitle[lang]}
          </p>
        </div>
      </section>

      {/* Grid: Main Historical Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Origin */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-teal-950 dark:text-teal-100 border-b border-teal-50 dark:border-slate-800 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-700 dark:text-emerald-400" />
              {heritageData.originTitle[lang]}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
              {heritageData.originContent[lang]}
            </p>
          </div>

          {/* Section 2: Betel Leaf */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-teal-950 dark:text-teal-100 border-b border-teal-50 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              {heritageData.paanTitle[lang]}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
              {heritageData.paanContent[lang]}
            </p>
          </div>

          {/* Section 3: Culture & Today */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-teal-950 dark:text-teal-100 border-b border-teal-50 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              {heritageData.cultureTitle[lang]}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
              {heritageData.cultureContent[lang]}
            </p>
          </div>
        </div>

        {/* Right Sidebar: Cover Image & Timeline */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-teal-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <img
              src={heritageData.imageUrl}
              alt="Chaurasiya Heritage"
              className="w-full h-56 object-cover"
            />
            <div className="p-5 space-y-2">
              <h3 className="font-bold text-teal-950 dark:text-teal-100 text-sm">
                {lang === 'en' ? 'Traditional Betel Conservatory (Bareja)' : 'परम्परागत पानको भीट (बरैजा)'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {lang === 'en'
                  ? 'Cultivating sacred betel leaves in humidity-controlled straw structures.'
                  : 'आर्द्रता नियन्त्रित खरको घरभित्र पवित्र पान खेती गर्ने प्राचीन कला।'}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-teal-950 dark:text-teal-100 text-sm uppercase tracking-wide border-b border-teal-50 dark:border-slate-800 pb-2">
              {lang === 'en' ? 'Heritage Timeline' : 'सम्पदाको ऐतिहासिक समयरेखा'}
            </h3>

            <div className="space-y-4">
              {heritageData.timeline.map((item, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-emerald-500 space-y-1">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {item.year}
                  </span>
                  <h4 className="font-bold text-xs text-teal-950 dark:text-teal-100">
                    {item.title[lang]}
                  </h4>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.desc[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>

      {/* Admin Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-teal-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-teal-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-teal-950 dark:text-teal-100">
                Edit Our Heritage Page
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
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={editTitleEn}
                    onChange={(e) => setEditTitleEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Title (नेपाली)</label>
                  <input
                    type="text"
                    required
                    value={editTitleNe}
                    onChange={(e) => setEditTitleNe(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Origins & Lineage Content (English)</label>
                <textarea
                  rows={3}
                  value={editOriginEn}
                  onChange={(e) => setEditOriginEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Origins & Lineage Content (नेपाली)</label>
                <textarea
                  rows={3}
                  value={editOriginNe}
                  onChange={(e) => setEditOriginNe(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Paan Cultivation Content (English)</label>
                <textarea
                  rows={3}
                  value={editPaanEn}
                  onChange={(e) => setEditPaanEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Paan Cultivation Content (नेपाली)</label>
                <textarea
                  rows={3}
                  value={editPaanNe}
                  onChange={(e) => setEditPaanNe(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">Cover Image URL / GitHub Repo Upload</label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="url"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm"
                  />
                  <label className="flex items-center gap-2 px-4 py-2 bg-teal-800 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Blogger Page URL</label>
                <input
                  type="url"
                  value={editBloggerUrl}
                  onChange={(e) => setEditBloggerUrl(e.target.value)}
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
