import React, { useState, useEffect } from 'react';
import { BookOpen, Map, Users, ChevronRight, ChevronLeft, Leaf, PlayCircle, ArrowRight, Bell, Calendar, Image as ImageIcon, Eye, Download, X } from 'lucide-react';
import { Language } from '../types';
import { communityHistory, impactStats, galleryItems, boardMembers, notices, blogPosts } from '../data/communityData';

interface HistorySectionProps {
  lang: Language;
  onNavigate: (tabId: string) => void;
  onTrackAction: (actionName: string) => void;
  onSelectLeader: (id: string) => void;
}

export default function HistorySection({ lang, onNavigate, onTrackAction, onSelectLeader }: HistorySectionProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);
  const [viewPdfNoticeId, setViewPdfNoticeId] = useState<string | null>(null);

  const nextImage = () => {
    setCurrentImageIdx((prev) => (prev + 1) % galleryItems.length);
  };

  const prevImage = () => {
    setCurrentImageIdx((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = {
    heroSub: {
      en: 'A dedicated social platform preserving betel leaf culture & serving humanity across Nepal.',
      ne: 'नेपालभर पान संस्कृतिको संरक्षण र मानव सेवामा समर्पित एक सामाजिक मञ्च।',
    },
    ctaButton: { en: 'Join Our Community', ne: 'हाम्रो समुदायमा सामेल हुनुहोस्' },
    bloggerBannerButton: { en: 'Blogger XML Layout', ne: 'ब्लगर XML लेआउट' },
    missionHeader: { en: 'Vision & Impact', ne: 'दृष्टिकोण र प्रभाव' },
    impactHeader: { en: 'Our Ongoing Impact', ne: 'हाम्रो निरन्तर प्रभाव' },
    photoGallery: { en: 'Glimpses of Our Journey', ne: 'हाम्रो यात्राको झलक' },
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white rounded-3xl py-16 px-6 sm:px-12 lg:px-20 shadow-2xl border-b-8 border-emerald-500">
        {/* Background Slider */}
        {galleryItems.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentImageIdx ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={item.imageUrl} 
              alt="" 
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-950/95 via-teal-900/50 to-transparent" />
          </div>
        ))}
        
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-emerald-500 rounded-full blur-3xl opacity-20 z-0" />
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 animate-bounce text-teal-400" />
            Jay Paan Dev • जय पान देव
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-teal-50 drop-shadow-xl">
            {communityHistory.title[lang]}
          </h1>
          <p className="text-lg sm:text-xl text-teal-50 max-w-2xl font-light leading-relaxed drop-shadow-lg">
            {t.heroSub[lang]}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => {
                onNavigate('membership-donation');
                onTrackAction('Click Join Today in Hero');
              }}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-extrabold shadow-lg transition-all transform hover:-translate-y-1 flex items-center gap-2 text-sm uppercase"
            >
              {t.ctaButton[lang]} <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onNavigate('blogger-exporter');
                onTrackAction('Click Get Blogger XML in Hero');
              }}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold transition-all text-sm uppercase"
            >
              {t.bloggerBannerButton[lang]}
            </button>
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-teal-100">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-950 mb-8 flex items-center gap-3">
          <PlayCircle className="w-7 h-7 text-emerald-500" />
          {t.photoGallery[lang]}
        </h2>
        <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden bg-gray-100 group shadow-inner">
          <img 
            src={galleryItems[currentImageIdx].imageUrl}
            alt={galleryItems[currentImageIdx].title[lang]}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
            <h3 className="text-xl sm:text-3xl font-bold mb-2 shadow-sm">{galleryItems[currentImageIdx].title[lang]}</h3>
            <p className="text-teal-50 text-sm sm:text-base max-w-2xl font-medium">{galleryItems[currentImageIdx].description[lang]}</p>
          </div>
          
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 right-4 flex gap-2">
            {galleryItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentImageIdx ? 'bg-emerald-400 w-6' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Intro & History Content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <BookOpen className="w-32 h-32 text-teal-900" />
            </div>
            <h3 className="text-xl font-extrabold text-teal-950 mb-4 border-b-2 border-emerald-500 inline-block pb-1">
              {communityHistory.title[lang]}
            </h3>
            <p className="text-gray-700 leading-relaxed font-medium text-[15px]">
              {communityHistory.introduction[lang]}
            </p>
          </div>
          
          <div className="bg-teal-50 p-8 rounded-3xl shadow-sm border border-teal-100 relative">
            <div className="absolute -top-4 -left-4 bg-emerald-500 p-3 rounded-full text-white shadow-lg">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-teal-900 mb-4 ml-6">
              {communityHistory.thePaanStoryTitle[lang]}
            </h3>
            <p className="text-teal-800 leading-relaxed font-medium text-[15px]">
              {communityHistory.thePaanStory[lang]}
            </p>
          </div>
        </div>

        {/* Vision & Mission sidebar card */}
        <div className="lg:col-span-5">
          <div className="bg-teal-900 text-white p-8 rounded-3xl shadow-lg border-t-8 border-emerald-400 h-full flex flex-col justify-center relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 bg-teal-800 rounded-full w-40 h-40 opacity-50 blur-2xl" />
             <div className="relative z-10">
                <h3 className="text-2xl font-black text-emerald-300 mb-4 flex items-center gap-2">
                  <Map className="w-6 h-6" />
                  {t.missionHeader[lang]}
                </h3>
                <p className="text-teal-50 text-[15px] leading-relaxed font-medium">
                  {communityHistory.mission[lang]}
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="space-y-8">
        <h3 className="text-2xl sm:text-3xl font-black text-teal-950 text-center uppercase tracking-tight">
          {t.impactHeader[lang]}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactStats.map((stat, idx) => {
            const icons = [Users, Leaf, BookOpen];
            const Icon = icons[idx % icons.length];
            return (
              <div key={stat.id} className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100 hover:shadow-md transition-shadow text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-emerald-600">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-black text-teal-950 tracking-tight">
                  {stat.value}
                </div>
                <div>
                  <h4 className="font-extrabold text-teal-700 uppercase text-xs tracking-wider mb-2">
                    {stat.label[lang]}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.desc[lang]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Notices Section */}
      <section className="space-y-8 py-8">
        <h3 className="text-2xl sm:text-3xl font-black text-teal-950 text-center uppercase tracking-tight flex items-center justify-center gap-2">
          <Bell className="w-8 h-8 text-teal-600" />
          {lang === 'en' ? 'Community Notices' : 'सामुदायिक सूचनाहरू'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden hover:shadow-md transition-shadow">
              <div 
                className="p-6 cursor-pointer hover:bg-teal-50/50 transition-colors"
                onClick={() => {
                  setExpandedNoticeId(prev => prev === notice.id ? null : notice.id);
                  setViewPdfNoticeId(null);
                  onTrackAction(`Toggled notice expansion: ${notice.title.en}`);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-teal-600 font-bold">
                    <Calendar className="w-4 h-4" />
                    {notice.date}
                  </div>
                  <ChevronRight className={`w-5 h-5 text-teal-400 transition-transform ${expandedNoticeId === notice.id ? 'rotate-90' : ''}`} />
                </div>
                <h4 className="text-xl font-bold text-teal-950 mb-2">
                  {notice.title[lang]}
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {notice.content[lang]}
                </p>
              </div>
              
              {expandedNoticeId === notice.id && (
                <div className="px-6 pb-6 pt-2 bg-teal-50/30 border-t border-teal-50">
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={() => {
                        setViewPdfNoticeId(prev => prev === notice.id ? null : notice.id);
                        onTrackAction(`Toggled view PDF: ${notice.title.en}`);
                      }}
                      className="text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                    >
                      {viewPdfNoticeId === notice.id ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {viewPdfNoticeId === notice.id ? (lang === 'en' ? 'Close PDF' : 'PDF बन्द गर्नुहोस्') : (lang === 'en' ? 'View PDF' : 'PDF हेर्नुहोस्')}
                    </button>
                    <a 
                      href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                      target="_blank"
                      download={`Notice_${notice.date}.pdf`}
                      onClick={() => onTrackAction(`Downloaded notice: ${notice.title.en}`)}
                      className="text-sm font-bold text-teal-700 bg-white border border-teal-200 hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      {lang === 'en' ? 'Download PDF' : 'PDF डाउनलोड गर्नुहोस्'}
                    </a>
                  </div>
                  
                  {viewPdfNoticeId === notice.id && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-teal-200 shadow-inner bg-gray-100">
                      <iframe 
                        src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf#toolbar=0" 
                        className="w-full h-[400px]"
                        title={notice.title.en}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              onNavigate('notices-gallery');
              onTrackAction('Navigated to view all notices');
            }}
            className="text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 shadow-sm"
          >
            {lang === 'en' ? 'View All Notices' : 'सबै सूचनाहरू हेर्नुहोस्'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Blog Section */}
      <section className="space-y-8 py-8">
        <h3 className="text-2xl sm:text-3xl font-black text-teal-950 text-center uppercase tracking-tight flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-teal-600" />
          {lang === 'en' ? 'Latest Blog Posts' : 'पछिल्लो ब्लग पोस्टहरू'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title[lang]} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs font-bold text-teal-600 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {post.author}</span>
                </div>
                <h4 className="text-xl font-bold text-teal-950 mb-2 line-clamp-2">
                  {post.title[lang]}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt[lang]}
                </p>
                <button 
                  onClick={() => {
                    onTrackAction(`Read blog post: ${post.title.en}`);
                    alert(lang === 'en' ? 'Full blog posts are available on our official Blogger site. Please visit our Blogger portal.' : 'पूर्ण ब्लग पोस्टहरू हाम्रो आधिकारिक ब्लगर साइटमा उपलब्ध छन्। कृपया हाम्रो ब्लगर पोर्टल भ्रमण गर्नुहोस्।');
                  }}
                  className="text-sm font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 transition-colors"
                >
                  {lang === 'en' ? 'Read More' : 'थप पढ्नुहोस्'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="space-y-8 py-8">
        <h3 className="text-2xl sm:text-3xl font-black text-teal-950 text-center uppercase tracking-tight flex items-center justify-center gap-2">
          <ImageIcon className="w-8 h-8 text-teal-600" />
          {t.photoGallery[lang]}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.slice(0, 3).map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden shadow-sm aspect-video cursor-pointer">
              <img 
                src={item.imageUrl} 
                alt={item.title[lang]} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-teal-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h4 className="text-white font-bold text-sm sm:text-base">
                  {item.title[lang]}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership & Key Figures */}
      <section className="space-y-8 py-8">
        <h3 className="text-2xl sm:text-3xl font-black text-teal-950 text-center uppercase tracking-tight">
          {lang === 'en' ? 'Our Leadership' : 'हाम्रो नेतृत्व'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {['1', 'vc1'].map((id) => {
            const member = boardMembers.find(m => m.id === id);
            if (!member) return null;
            return (
              <div key={member.id} className="bg-white rounded-3xl p-6 shadow-sm border border-teal-100 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-100 group-hover:border-emerald-400 transition-colors">
                  <img src={member.avatarUrl} alt={member.name[lang]} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-extrabold text-teal-950 text-lg">{member.name[lang]}</h4>
                  <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-2">{member.role[lang]}</p>
                </div>
                <button
                  onClick={() => {
                    onSelectLeader(member.id);
                    onNavigate('leader-bio');
                    onTrackAction(`Viewed profile of ${member.name.en}`);
                  }}
                  className="mt-auto text-sm font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-6 py-2 rounded-full transition-colors flex items-center gap-1"
                >
                  {lang === 'en' ? 'View Profile' : 'प्रोफाइल हेर्नुहोस्'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="text-center pt-2">
          <button
            onClick={() => {
              onNavigate('directory');
              onTrackAction('Navigated to Members Directory');
            }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Users className="w-5 h-5" />
            {lang === 'en' ? 'View All Members' : 'सबै सदस्यहरू हेर्नुहोस्'}
          </button>
        </div>
      </section>

    </div>
  );
}
