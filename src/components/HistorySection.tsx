import React, { useState, useEffect } from 'react';
import { BookOpen, Map, Users, ChevronRight, ChevronLeft, Leaf, PlayCircle, ArrowRight, Bell, Calendar, Image as ImageIcon, Eye, Download, X, Film, Play, Sparkles, MapPin, ShieldCheck, Lock, Trash2, Plus, ExternalLink } from 'lucide-react';
import { Album, Language, Notice } from '../types';
import { communityHistory, impactStats, galleryItems, boardMembers, notices as defaultNotices, blogPosts } from '../data/communityData';
import { journeyAlbums as defaultJourneyAlbums } from '../data/albumsData';
import AlbumDetail from './AlbumDetail';
import { extractGoogleDriveId } from '../utils/mediaUrl';

interface HistorySectionProps {
  lang: Language;
  onNavigate: (tabId: string) => void;
  onTrackAction: (actionName: string) => void;
  onSelectLeader: (id: string) => void;
  onSelectPost?: (post: any) => void;
  onSelectAlbum?: (albumId: string) => void;
  albums?: Album[];
  onOpenUploadModal?: () => void;
  isAdmin?: boolean;
  onOpenAdminModal?: () => void;
  onDeleteAlbum?: (albumId: string) => void;
  onOpenAddNoticeModal?: () => void;
  onDeleteNotice?: (id: string) => void;
  noticesList?: Notice[];
}

interface BloggerPost {
  id: string;
  title: { en: string; ne: string };
  excerpt: { en: string; ne: string };
  date: string;
  author: string;
  imageUrl: string;
  link: string;
  tags?: string[];
}

export default function HistorySection({ 
  lang, 
  onNavigate, 
  onTrackAction, 
  onSelectLeader, 
  onSelectPost,
  onSelectAlbum,
  albums = defaultJourneyAlbums,
  onOpenUploadModal,
  isAdmin = false,
  onOpenAdminModal,
  onDeleteAlbum,
  onOpenAddNoticeModal,
  onDeleteNotice,
  noticesList = defaultNotices,
}: HistorySectionProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);
  const [viewPdfNoticeId, setViewPdfNoticeId] = useState<string | null>(null);
  const [livePosts, setLivePosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchBloggerPosts = async () => {
      try {
        // Assume default feeds path if running inside Blogger
        const feedUrl = '/feeds/posts/default?alt=json';
        const res = await fetch(feedUrl);
        if (!res.ok) throw new Error('Not on blogger');
        
        const data = await res.json();
        const entries = data.feed.entry || [];
        
        const parsedPosts = entries.slice(0, 3).map((entry: any) => {
          const contentStr = entry.content?.$t || entry.summary?.$t || '';
          
          // Extract first image
          const imgMatch = contentStr.match(/<img[^>]+src="([^">]+)"/i);
          const imageUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800';
          
          // Clean HTML for excerpt
          const stripped = contentStr.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + '...';
          
          const link = entry.link.find((l: any) => l.rel === 'alternate')?.href || '#';
          const tags = entry.category ? entry.category.map((c: any) => c.term) : [];
          
          return {
            id: entry.id.$t,
            title: {
              en: entry.title.$t,
              ne: entry.title.$t
            },
            excerpt: {
              en: stripped,
              ne: stripped
            },
            content: {
              en: contentStr,
              ne: contentStr
            },
            date: new Date(entry.published.$t).toLocaleDateString(),
            author: entry.author?.[0]?.name?.$t || 'Admin',
            imageUrl,
            link,
            tags
          };
        });
        
        if (parsedPosts.length > 0) {
          setLivePosts(parsedPosts);
        } else {
          setLivePosts(blogPosts as unknown as BloggerPost[]);
        }
      } catch (err) {
        // Fallback for localhost / github pages viewing
        setLivePosts(blogPosts as unknown as BloggerPost[]);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchBloggerPosts();
  }, []);

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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bell className="w-8 h-8 text-teal-600" />
            <h3 className="text-2xl sm:text-3xl font-black text-teal-950 uppercase tracking-tight">
              {lang === 'en' ? 'Community Notices' : 'सामुदायिक सूचनाहरू'}
            </h3>
          </div>

          {/* Admin Add Notice Button ONLY visible when logged in as admin */}
          {isAdmin && onOpenAddNoticeModal && (
            <button
              onClick={onOpenAddNoticeModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'en' ? '+ Add Community Notice' : '+ सूचना थप्नुहोस्'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {noticesList.slice(0, 4).map((notice) => (
            <div key={notice.id} className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden hover:shadow-md transition-shadow">
              <div 
                className="p-6 cursor-pointer hover:bg-teal-50/50 transition-colors"
                onClick={() => {
                  setExpandedNoticeId(prev => prev === notice.id ? null : notice.id);
                  setViewPdfNoticeId(null);
                  onTrackAction(`Toggled notice expansion: ${notice.title.en || notice.title.ne}`);
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
                  {notice.title[lang] || notice.title.en}
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {notice.content[lang] || notice.content.en}
                </p>
              </div>
              
              {expandedNoticeId === notice.id && (
                <div className="px-6 pb-6 pt-3 bg-teal-50/40 border-t border-teal-100 space-y-4">
                  {/* Attached Google Drive File Link */}
                  {(notice.driveFileUrl || notice.fileUrl) && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-600 text-white rounded-lg">📄</span>
                        <div>
                          <span className="font-extrabold block text-emerald-900">
                            {lang === 'en' ? 'Google Drive Attached Document' : 'गुगल ड्राइभ संलग्न कागजात'}
                          </span>
                          <span className="text-[11px] text-emerald-700">
                            {notice.driveFileUrl || notice.fileUrl}
                          </span>
                        </div>
                      </div>

                      <a
                        href={notice.driveFileUrl || notice.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg shadow-sm transition-all flex items-center gap-1 shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Open in Google Drive ↗' : 'गुगल ड्राइभमा खोल्नुहोस् ↗'}</span>
                      </a>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <button 
                        onClick={() => {
                          setViewPdfNoticeId(prev => prev === notice.id ? null : notice.id);
                          onTrackAction(`Toggled view PDF: ${notice.title.en || notice.title.ne}`);
                        }}
                        className="text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        {viewPdfNoticeId === notice.id ? <X className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {viewPdfNoticeId === notice.id 
                          ? (lang === 'en' ? 'Close Preview' : 'पूर्वावलोकन बन्द गर्नुहोस्') 
                          : (lang === 'en' ? 'View Document Preview' : 'कागजात पूर्वावलोकन हेर्नुहोस्')}
                      </button>

                      {(notice.driveFileUrl || notice.fileUrl) ? (
                        <a 
                          href={notice.driveFileUrl || notice.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => onTrackAction(`Opened notice file: ${notice.title.en}`)}
                          className="text-xs font-bold text-teal-800 bg-white border border-teal-200 hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5 text-teal-600" />
                          {lang === 'en' ? 'Download / View File' : 'फाइल डाउनलोड / हेर्नुहोस्'}
                        </a>
                      ) : (
                        <a 
                          href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                          target="_blank"
                          download={`Notice_${notice.date}.pdf`}
                          onClick={() => onTrackAction(`Downloaded notice: ${notice.title.en}`)}
                          className="text-xs font-bold text-teal-800 bg-white border border-teal-200 hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5 text-teal-600" />
                          {lang === 'en' ? 'Download PDF' : 'PDF डाउनलोड गर्नुहोस्'}
                        </a>
                      )}
                    </div>

                    {/* Admin Delete Notice Action */}
                    {isAdmin && onDeleteNotice && (
                      <button
                        onClick={() => {
                          if (confirm(lang === 'en' ? 'Are you sure you want to delete this notice?' : 'के तपाईं निश्चित रूपमा यो सूचना हटाउन चाहनुहुन्छ?')) {
                            onDeleteNotice(notice.id);
                          }
                        }}
                        className="text-xs font-extrabold text-red-600 hover:text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Delete Notice (Admin)' : 'सूचना हटाउनुहोस्'}</span>
                      </button>
                    )}
                  </div>
                  
                  {viewPdfNoticeId === notice.id && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-teal-200 shadow-inner bg-slate-900">
                      {(() => {
                        const rawUrl = notice.driveFileUrl || notice.fileUrl;
                        const driveId = rawUrl ? extractGoogleDriveId(rawUrl) : null;
                        const embedUrl = driveId 
                          ? `https://drive.google.com/file/d/${driveId}/preview`
                          : (rawUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf#toolbar=0");

                        return (
                          <iframe 
                            src={embedUrl} 
                            className="w-full h-[400px]"
                            title={notice.title.en || notice.title.ne}
                          />
                        );
                      })()}
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
          {loadingPosts ? (
            <div className="col-span-1 md:col-span-3 text-center py-12 text-teal-600 font-bold animate-pulse">
              {lang === 'en' ? 'Loading latest posts from Blogger...' : 'ब्लगरबाट पछिल्लो पोस्टहरू लोड गर्दैछ...'}
            </div>
          ) : livePosts.map((post) => (
            <a 
              key={post.id} 
              href={post.link || '#'}
              target="_top"
              onClick={(e) => {
                if (!post.link || post.link === '#') {
                  e.preventDefault();
                  alert(lang === 'en' ? 'Full blog posts are available on our official Blogger site.' : 'पूर्ण ब्लग पोस्टहरू हाम्रो आधिकारिक ब्लगर साइटमा उपलब्ध छन्।');
                } else {
                  onTrackAction(`Read live blog post: ${post.title.en || post.title.ne}`);
                }
              }}
              className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden hover:shadow-md transition-shadow group block cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title[lang] || post.title.en} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between text-xs font-bold text-teal-600 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {post.author}</span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.tags.slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h4 className="text-xl font-bold text-teal-950 mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
                  {post.title[lang] || post.title.en}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                  {post.excerpt[lang] || post.excerpt.en}
                </p>
                <div 
                  className="text-sm font-bold text-teal-700 group-hover:text-teal-900 inline-flex items-center gap-1 transition-colors mt-auto"
                >
                  {lang === 'en' ? 'Read More' : 'थप पढ्नुहोस्'} <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Glimpses to Our Journey Albums Section */}
      <section className="space-y-8 py-8 border-t border-teal-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider border border-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Photo & Video Gallery
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-teal-950 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <ImageIcon className="w-8 h-8 text-teal-600" />
              {t.photoGallery[lang]}
            </h3>
            <p className="text-sm text-gray-600 font-medium max-w-2xl">
              {lang === 'en' 
                ? 'Browse interactive media albums capturing healthcare camps, cultural expos, youth workshops, and community events.'
                : 'स्वास्थ्य शिविर, सांस्कृतिक मेला, युवा कार्यशाला र सामुदायिक कार्यक्रमहरू समेटिएका अन्तरक्रियात्मक मिडिया एल्बमहरू हेर्नुहोस्।'}
            </p>
          </div>

          {/* Upload Journey Post button ONLY visible after central admin login */}
          {isAdmin && onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="px-5 py-2.5 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>
                {lang === 'en' ? '+ Upload Journey Post' : '+ मिडिया पोस्ट थप्नुहोस्'}
              </span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.slice(0, 3).map((album) => {
            const photosCount = album.mediaItems.filter(i => i.type === 'photo').length;
            const videosCount = album.mediaItems.filter(i => i.type === 'video').length;

            return (
              <div
                key={album.id}
                onClick={() => {
                  if (onSelectAlbum) {
                    onSelectAlbum(album.id);
                  } else {
                    onNavigate('albums');
                  }
                  onTrackAction(`Open Album Dedicated Page: ${album.title.en}`);
                }}
                className="bg-white rounded-3xl border border-teal-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col"
              >
                {/* Cover Preview Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-teal-950">
                  <img
                    src={album.coverUrl}
                    alt={album.title[lang]}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Count Badges */}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-bold text-teal-300 flex items-center gap-1 border border-white/10">
                      <ImageIcon className="w-3 h-3 text-teal-400" /> {photosCount} {lang === 'en' ? 'Photos' : 'फोटो'}
                    </span>
                    {videosCount > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 backdrop-blur-md text-[11px] font-bold text-amber-300 flex items-center gap-1 border border-amber-500/30">
                        <Film className="w-3 h-3 text-amber-400" /> {videosCount} {lang === 'en' ? 'Videos' : 'भिडियो'}
                      </span>
                    )}
                  </div>

                  {isAdmin && onDeleteAlbum ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(lang === 'en' ? 'Are you sure you want to delete this journey post?' : 'के तपाईं निश्चित रूपमा यो मिडिया पोस्ट हटाउन चाहनुहुन्छ?')) {
                          onDeleteAlbum(album.id);
                        }
                      }}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all z-10 flex items-center gap-1 text-xs font-bold"
                      title="Delete Post (Admin)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="absolute top-3 right-3 p-2.5 rounded-full bg-emerald-500 text-gray-950 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Album Description & Info */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-bold text-teal-600 mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {album.date}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {album.location[lang]}</span>
                        </div>
                        <h4 className="text-lg font-extrabold text-teal-950 group-hover:text-teal-700 transition-colors line-clamp-2">
                          {album.title[lang]}
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm mt-2 line-clamp-2 font-medium leading-relaxed">
                          {album.description[lang]}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-teal-50 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {album.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-black text-teal-700 group-hover:text-emerald-600 inline-flex items-center gap-1 uppercase tracking-wider">
                          {lang === 'en' ? 'Open Album' : 'एल्बम खोल्नुहोस्'} <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

        {/* View All Button below albums */}
        <div className="text-center pt-4">
          <button
            onClick={() => {
              onNavigate('albums-gallery');
              onTrackAction('Navigated to View All Albums');
            }}
            className="px-8 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            {lang === 'en' ? 'View All Journey Albums' : 'सबै यात्रा एल्बमहरू हेर्नुहोस्'}
            <ArrowRight className="w-4 h-4" />
          </button>
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
