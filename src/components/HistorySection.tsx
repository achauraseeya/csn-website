import React, { useState, useEffect } from 'react';
import { BookOpen, Map, Users, ChevronRight, ChevronLeft, Leaf, PlayCircle, ArrowRight, Bell, Calendar, Image as ImageIcon, Eye, Download, X, Film, Play, Sparkles, MapPin, ShieldCheck, Lock, Trash2, Plus, ExternalLink, Edit, Save } from 'lucide-react';
import { Album, Language, Notice, SiteTexts } from '../types';
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
  siteTexts: SiteTexts;
  onUpdateSiteTexts: (texts: Partial<SiteTexts>) => Promise<void>;
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
  siteTexts,
  onUpdateSiteTexts,
}: HistorySectionProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);
  const [viewPdfNoticeId, setViewPdfNoticeId] = useState<string | null>(null);
  const [livePosts, setLivePosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Editable site texts state
  const [isEditingTexts, setIsEditingTexts] = useState(false);
  const [editHeroTitleEn, setEditHeroTitleEn] = useState(siteTexts.heroTitleEn);
  const [editHeroTitleNe, setEditHeroTitleNe] = useState(siteTexts.heroTitleNe);
  const [editHeroSubEn, setEditHeroSubEn] = useState(siteTexts.heroSubEn);
  const [editHeroSubNe, setEditHeroSubNe] = useState(siteTexts.heroSubNe);
  const [editIntroEn, setEditIntroEn] = useState(siteTexts.introEn);
  const [editIntroNe, setEditIntroNe] = useState(siteTexts.introNe);
  const [editPaanStoryTitleEn, setEditPaanStoryTitleEn] = useState(siteTexts.paanStoryTitleEn);
  const [editPaanStoryTitleNe, setEditPaanStoryTitleNe] = useState(siteTexts.paanStoryTitleNe);
  const [editPaanStoryEn, setEditPaanStoryEn] = useState(siteTexts.paanStoryEn);
  const [editPaanStoryNe, setEditPaanStoryNe] = useState(siteTexts.paanStoryNe);
  const [editMissionTitleEn, setEditMissionTitleEn] = useState(siteTexts.missionTitleEn);
  const [editMissionTitleNe, setEditMissionTitleNe] = useState(siteTexts.missionTitleNe);
  const [editMissionEn, setEditMissionEn] = useState(siteTexts.missionEn);
  const [editMissionNe, setEditMissionNe] = useState(siteTexts.missionNe);

  // New customizable fields state
  const [editSliderBadgeEn, setEditSliderBadgeEn] = useState(siteTexts.sliderBadgeEn || 'Jay Paan Dev');
  const [editSliderBadgeNe, setEditSliderBadgeNe] = useState(siteTexts.sliderBadgeNe || 'जय पान देव');
  const [editLogoTextEn, setEditLogoTextEn] = useState(siteTexts.logoTextEn || 'Chaurasiya Samaj');
  const [editLogoTextNe, setEditLogoTextNe] = useState(siteTexts.logoTextNe || 'चौरसिया समाज');
  const [editLogoSubEn, setEditLogoSubEn] = useState(siteTexts.logoSubEn || 'Nepal');
  const [editLogoSubNe, setEditLogoSubNe] = useState(siteTexts.logoSubNe || 'चौरसिया समाज नेपाल');
  const [editLogoUrl, setEditLogoUrl] = useState(siteTexts.logoUrl || '');
  const [editTaglineEn, setEditTaglineEn] = useState(siteTexts.taglineEn || 'A dedicated social platform preserving betel leaf culture & serving humanity');
  const [editTaglineNe, setEditTaglineNe] = useState(siteTexts.taglineNe || 'पान संस्कृतिको संरक्षण र मानव सेवामा समर्पित एक सामाजिक संस्था');
  const [editImpactHeaderEn, setEditImpactHeaderEn] = useState(siteTexts.impactHeaderEn || 'Empowering & Transforming Lives');
  const [editImpactHeaderNe, setEditImpactHeaderNe] = useState(siteTexts.impactHeaderNe || 'सशक्तिकरण र जीवन परिवर्तन');
  const [editFooterAboutEn, setEditFooterAboutEn] = useState(siteTexts.footerAboutEn || 'We are dedicated to unifying community coordinators, supporting traditional cultivation, and providing essential healthcare and youth education programs.');
  const [editFooterAboutNe, setEditFooterAboutNe] = useState(siteTexts.footerAboutNe || 'हामी सामुदायिक संयोजकहरूलाई एकीकृत गर्न, परम्परागत खेतीलाई सहयोग गर्न र आवश्यक स्वास्थ्य सेवा र युवा शिक्षा कार्यक्रमहरू प्रदान गर्न समर्पित छौं।');
  const [editFooterAddressEn, setEditFooterAddressEn] = useState(siteTexts.footerAddressEn || 'Ghantaghar Path, Birgunj, Parsa, Madhesh Province, Nepal');
  const [editFooterAddressNe, setEditFooterAddressNe] = useState(siteTexts.footerAddressNe || 'घण्टाघर पथ, वीरगन्ज, पर्सा, मधेश प्रदेश, नेपाल');
  const [editFooterPhone, setEditFooterPhone] = useState(siteTexts.footerPhone || '+977-9812345678');
  const [editFooterEmail, setEditFooterEmail] = useState(siteTexts.footerEmail || 'achauraseeya@gmail.com');
  const [editSocialFb, setEditSocialFb] = useState(siteTexts.socialFb || 'https://facebook.com');
  const [editSocialTw, setEditSocialTw] = useState(siteTexts.socialTw || 'https://twitter.com');
  const [editSocialIg, setEditSocialIg] = useState(siteTexts.socialIg || 'https://instagram.com');

  const [editHeroImages, setEditHeroImages] = useState<any[]>(() => {
    try {
      if (siteTexts.heroImagesJson) {
        const parsed = JSON.parse(siteTexts.heroImagesJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [...galleryItems];
  });

  // State for adding a new hero slider image
  const [newSlideImage, setNewSlideImage] = useState('');
  const [newSlideTitleEn, setNewSlideTitleEn] = useState('');
  const [newSlideTitleNe, setNewSlideTitleNe] = useState('');
  const [newSlideDescEn, setNewSlideDescEn] = useState('');
  const [newSlideDescNe, setNewSlideDescNe] = useState('');
  const [uploadingSlide, setUploadingSlide] = useState(false);

  const [isSavingTexts, setIsSavingTexts] = useState(false);

  // File upload helper
  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const password = localStorage.getItem('chaurasiya_admin_password') || 'admin2026';
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${password}`,
              'x-admin-password': password
            },
            body: JSON.stringify({
              fileBase64: base64,
              fileName: file.name
            })
          });
          const data = await res.json();
          if (data.success && data.url) {
            resolve(data.url);
          } else {
            reject(new Error(data.error || 'Failed to upload'));
          }
        } catch (e: any) {
          reject(e);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    setEditHeroTitleEn(siteTexts.heroTitleEn);
    setEditHeroTitleNe(siteTexts.heroTitleNe);
    setEditHeroSubEn(siteTexts.heroSubEn);
    setEditHeroSubNe(siteTexts.heroSubNe);
    setEditIntroEn(siteTexts.introEn);
    setEditIntroNe(siteTexts.introNe);
    setEditPaanStoryTitleEn(siteTexts.paanStoryTitleEn);
    setEditPaanStoryTitleNe(siteTexts.paanStoryTitleNe);
    setEditPaanStoryEn(siteTexts.paanStoryEn);
    setEditPaanStoryNe(siteTexts.paanStoryNe);
    setEditMissionTitleEn(siteTexts.missionTitleEn);
    setEditMissionTitleNe(siteTexts.missionTitleNe);
    setEditMissionEn(siteTexts.missionEn);
    setEditMissionNe(siteTexts.missionNe);

    setEditSliderBadgeEn(siteTexts.sliderBadgeEn || 'Jay Paan Dev');
    setEditSliderBadgeNe(siteTexts.sliderBadgeNe || 'जय पान देव');
    setEditLogoTextEn(siteTexts.logoTextEn || 'Chaurasiya Samaj');
    setEditLogoTextNe(siteTexts.logoTextNe || 'चौरसिया समाज');
    setEditLogoSubEn(siteTexts.logoSubEn || 'Nepal');
    setEditLogoSubNe(siteTexts.logoSubNe || 'चौरसिया समाज नेपाल');
    setEditLogoUrl(siteTexts.logoUrl || '');
    setEditTaglineEn(siteTexts.taglineEn || 'A dedicated social platform preserving betel leaf culture & serving humanity');
    setEditTaglineNe(siteTexts.taglineNe || 'पान संस्कृतिको संरक्षण र मानव सेवामा समर्पित एक सामाजिक संस्था');
    setEditImpactHeaderEn(siteTexts.impactHeaderEn || 'Empowering & Transforming Lives');
    setEditImpactHeaderNe(siteTexts.impactHeaderNe || 'सशक्तिकरण र जीवन परिवर्तन');
    setEditFooterAboutEn(siteTexts.footerAboutEn || 'We are dedicated to unifying community coordinators, supporting traditional cultivation, and providing essential healthcare and youth education programs.');
    setEditFooterAboutNe(siteTexts.footerAboutNe || 'हामी सामुदायिक संयोजकहरूलाई एकीकृत गर्न, परम्परागत खेतीलाई सहयोग गर्न र आवश्यक स्वास्थ्य सेवा र युवा शिक्षा कार्यक्रमहरू प्रदान गर्न समर्पित छौं।');
    setEditFooterAddressEn(siteTexts.footerAddressEn || 'Ghantaghar Path, Birgunj, Parsa, Madhesh Province, Nepal');
    setEditFooterAddressNe(siteTexts.footerAddressNe || 'घण्टाघर पथ, वीरगन्ज, पर्सा, मधेश प्रदेश, नेपाल');
    setEditFooterPhone(siteTexts.footerPhone || '+977-9812345678');
    setEditFooterEmail(siteTexts.footerEmail || 'achauraseeya@gmail.com');
    setEditSocialFb(siteTexts.socialFb || 'https://facebook.com');
    setEditSocialTw(siteTexts.socialTw || 'https://twitter.com');
    setEditSocialIg(siteTexts.socialIg || 'https://instagram.com');

    try {
      if (siteTexts.heroImagesJson) {
        const parsed = JSON.parse(siteTexts.heroImagesJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEditHeroImages(parsed);
          return;
        }
      }
    } catch (e) {}
    setEditHeroImages([...galleryItems]);
  }, [siteTexts]);

  const handleSaveTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTexts(true);
    try {
      await onUpdateSiteTexts({
        heroTitleEn: editHeroTitleEn,
        heroTitleNe: editHeroTitleNe,
        heroSubEn: editHeroSubEn,
        heroSubNe: editHeroSubNe,
        introEn: editIntroEn,
        introNe: editIntroNe,
        paanStoryTitleEn: editPaanStoryTitleEn,
        paanStoryTitleNe: editPaanStoryTitleNe,
        paanStoryEn: editPaanStoryEn,
        paanStoryNe: editPaanStoryNe,
        missionTitleEn: editMissionTitleEn,
        missionTitleNe: editMissionTitleNe,
        missionEn: editMissionEn,
        missionNe: editMissionNe,
        sliderBadgeEn: editSliderBadgeEn,
        sliderBadgeNe: editSliderBadgeNe,
        logoTextEn: editLogoTextEn,
        logoTextNe: editLogoTextNe,
        logoSubEn: editLogoSubEn,
        logoSubNe: editLogoSubNe,
        logoUrl: editLogoUrl,
        taglineEn: editTaglineEn,
        taglineNe: editTaglineNe,
        impactHeaderEn: editImpactHeaderEn,
        impactHeaderNe: editImpactHeaderNe,
        footerAboutEn: editFooterAboutEn,
        footerAboutNe: editFooterAboutNe,
        footerAddressEn: editFooterAddressEn,
        footerAddressNe: editFooterAddressNe,
        footerPhone: editFooterPhone,
        footerEmail: editFooterEmail,
        socialFb: editSocialFb,
        socialTw: editSocialTw,
        socialIg: editSocialIg,
        heroImagesJson: JSON.stringify(editHeroImages)
      });
      setIsEditingTexts(false);
      onTrackAction('Save Homepage Site Texts via Admin');
    } catch (err) {
      alert('Failed to save texts.');
    } finally {
      setIsSavingTexts(false);
    }
  };

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

  const getActiveHeroImages = (): any[] => {
    try {
      if (siteTexts.heroImagesJson) {
        const parsed = JSON.parse(siteTexts.heroImagesJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return galleryItems;
  };

  const activeHeroImages = getActiveHeroImages();

  const nextImage = () => {
    setCurrentImageIdx((prev) => (prev + 1) % activeHeroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIdx((prev) => (prev - 1 + activeHeroImages.length) % activeHeroImages.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(timer);
  }, [activeHeroImages.length]);

  const t = {
    ctaButton: { en: 'Join Our Community', ne: 'हाम्रो समुदायमा सामेल हुनुहोस्' },
    bloggerBannerButton: { en: 'Blogger XML Layout', ne: 'ब्लगर XML लेआउट' },
    photoGallery: { en: 'Glimpses of Our Journey', ne: 'हाम्रो यात्राको झलक' },
    impactHeader: { en: 'Empowering & Transforming Lives', ne: 'सशक्तिकरण र जीवन परिवर्तन' },
  };

  return (
    <div className="space-y-16">
      {/* Admin Edit Homepage Content Button */}
      {isAdmin && !isEditingTexts && (
        <div className="flex justify-end -mb-8">
          <button
            onClick={() => setIsEditingTexts(true)}
            className="px-4 py-2.5 bg-teal-800 hover:bg-teal-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 border border-teal-700 z-20"
          >
            <Edit className="w-4 h-4 text-teal-300" />
            <span>Edit Homepage Content</span>
          </button>
        </div>
      )}

      {/* Admin Edit Homepage Content Panel */}
      {isAdmin && isEditingTexts && (
        <section className="bg-teal-50 border-2 border-emerald-500 p-6 sm:p-8 rounded-3xl shadow-lg space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-emerald-500 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-teal-950 flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-600 animate-pulse" />
                <span>Edit Homepage Text Content</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Changes are saved online instantly to the server database.</p>
            </div>
            <button
              onClick={() => setIsEditingTexts(false)}
              className="p-1.5 bg-gray-200/50 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveTexts} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Title */}
              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Hero Section Title (English)</label>
                <input
                  type="text"
                  required
                  value={editHeroTitleEn}
                  onChange={(e) => setEditHeroTitleEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Hero Section Title (Nepali)</label>
                <input
                  type="text"
                  required
                  value={editHeroTitleNe}
                  onChange={(e) => setEditHeroTitleNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Hero Sub */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Hero Subtitle (English)</label>
                <textarea
                  required
                  rows={2}
                  value={editHeroSubEn}
                  onChange={(e) => setEditHeroSubEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Hero Subtitle (Nepali)</label>
                <textarea
                  required
                  rows={2}
                  value={editHeroSubNe}
                  onChange={(e) => setEditHeroSubNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Intro Text */}
              <div className="space-y-1 md:col-span-2 border-t border-teal-200 pt-4">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Introduction Text (English)</label>
                <textarea
                  required
                  rows={4}
                  value={editIntroEn}
                  onChange={(e) => setEditIntroEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Introduction Text (Nepali)</label>
                <textarea
                  required
                  rows={4}
                  value={editIntroNe}
                  onChange={(e) => setEditIntroNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Paan Story Title */}
              <div className="space-y-1 border-t border-teal-200 pt-4">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Paan Story Title (English)</label>
                <input
                  type="text"
                  required
                  value={editPaanStoryTitleEn}
                  onChange={(e) => setEditPaanStoryTitleEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1 border-t border-teal-200 pt-4">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Paan Story Title (Nepali)</label>
                <input
                  type="text"
                  required
                  value={editPaanStoryTitleNe}
                  onChange={(e) => setEditPaanStoryTitleNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Paan Story Body */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Paan Story Body (English)</label>
                <textarea
                  required
                  rows={4}
                  value={editPaanStoryEn}
                  onChange={(e) => setEditPaanStoryEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Paan Story Body (Nepali)</label>
                <textarea
                  required
                  rows={4}
                  value={editPaanStoryNe}
                  onChange={(e) => setEditPaanStoryNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Mission Title */}
              <div className="space-y-1 border-t border-teal-200 pt-4">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Mission Title (English)</label>
                <input
                  type="text"
                  required
                  value={editMissionTitleEn}
                  onChange={(e) => setEditMissionTitleEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1 border-t border-teal-200 pt-4">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Mission Title (Nepali)</label>
                <input
                  type="text"
                  required
                  value={editMissionTitleNe}
                  onChange={(e) => setEditMissionTitleNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Mission Body */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Mission Body (English)</label>
                <textarea
                  required
                  rows={4}
                  value={editMissionEn}
                  onChange={(e) => setEditMissionEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Mission Body (Nepali)</label>
                <textarea
                  required
                  rows={4}
                  value={editMissionNe}
                  onChange={(e) => setEditMissionNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Slider Badge Text */}
              <div className="space-y-1 border-t border-teal-200 pt-4">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Slider Badge Text (English)</label>
                <input
                  type="text"
                  required
                  value={editSliderBadgeEn}
                  onChange={(e) => setEditSliderBadgeEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1 border-t border-teal-200 pt-4">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Slider Badge Text (Nepali)</label>
                <input
                  type="text"
                  required
                  value={editSliderBadgeNe}
                  onChange={(e) => setEditSliderBadgeNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Logo Settings */}
              <div className="space-y-1 border-t border-teal-200 pt-4 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Logo Image File (Upload to Repository)</label>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-teal-100">
                  {editLogoUrl ? (
                    <img src={editLogoUrl} className="w-12 h-12 rounded-full object-cover border border-teal-200 shadow-sm" alt="Logo preview" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 text-xs font-bold border border-teal-200">Default</div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleFileUpload(file);
                          setEditLogoUrl(url);
                        } catch (err: any) {
                          alert('Upload failed: ' + err.message);
                        }
                      }
                    }}
                    className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                  {editLogoUrl && (
                    <button type="button" onClick={() => setEditLogoUrl('')} className="text-xs text-red-500 hover:underline">Reset to Default</button>
                  )}
                </div>
              </div>

              {/* Logo Texts aside Logo */}
              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Logo Text Aside (English)</label>
                <input
                  type="text"
                  required
                  value={editLogoTextEn}
                  onChange={(e) => setEditLogoTextEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Logo Text Aside (Nepali)</label>
                <input
                  type="text"
                  required
                  value={editLogoTextNe}
                  onChange={(e) => setEditLogoTextNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Logo Subtexts */}
              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Logo Subtext (English)</label>
                <input
                  type="text"
                  required
                  value={editLogoSubEn}
                  onChange={(e) => setEditLogoSubEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Logo Subtext (Nepali)</label>
                <input
                  type="text"
                  required
                  value={editLogoSubNe}
                  onChange={(e) => setEditLogoSubNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Tagline Top text */}
              <div className="space-y-1 md:col-span-2 border-t border-teal-200 pt-4">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Header Top Tagline (English)</label>
                <input
                  type="text"
                  required
                  value={editTaglineEn}
                  onChange={(e) => setEditTaglineEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Header Top Tagline (Nepali)</label>
                <input
                  type="text"
                  required
                  value={editTaglineNe}
                  onChange={(e) => setEditTaglineNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Impact Header */}
              <div className="space-y-1 md:col-span-2 border-t border-teal-200 pt-4">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Impact/Empowerment Header (English)</label>
                <input
                  type="text"
                  required
                  value={editImpactHeaderEn}
                  onChange={(e) => setEditImpactHeaderEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Impact/Empowerment Header (Nepali)</label>
                <input
                  type="text"
                  required
                  value={editImpactHeaderNe}
                  onChange={(e) => setEditImpactHeaderNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Footer Settings */}
              <div className="space-y-1 border-t border-teal-200 pt-4 md:col-span-2">
                <h4 className="text-sm font-black text-teal-950 uppercase tracking-wider mb-2">Footer Settings</h4>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Footer About/Description (English)</label>
                <textarea
                  required
                  rows={3}
                  value={editFooterAboutEn}
                  onChange={(e) => setEditFooterAboutEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Footer About/Description (Nepali)</label>
                <textarea
                  required
                  rows={3}
                  value={editFooterAboutNe}
                  onChange={(e) => setEditFooterAboutNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Headquarters Address (English)</label>
                <input
                  type="text"
                  required
                  value={editFooterAddressEn}
                  onChange={(e) => setEditFooterAddressEn(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Headquarters Address (Nepali)</label>
                <input
                  type="text"
                  required
                  value={editFooterAddressNe}
                  onChange={(e) => setEditFooterAddressNe(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editFooterPhone}
                  onChange={(e) => setEditFooterPhone(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  value={editFooterEmail}
                  onChange={(e) => setEditFooterEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Social Media Links */}
              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Facebook URL</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={editSocialFb}
                  onChange={(e) => setEditSocialFb(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Twitter (X) URL</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/..."
                  value={editSocialTw}
                  onChange={(e) => setEditSocialTw(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-teal-950 uppercase tracking-wider block">Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={editSocialIg}
                  onChange={(e) => setEditSocialIg(e.target.value)}
                  className="w-full p-2.5 bg-white border border-teal-200 rounded-lg text-sm text-teal-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Hero Slider Images Manager */}
              <div className="space-y-4 md:col-span-2 border-t border-teal-200 pt-6">
                <h4 className="text-sm font-black text-teal-950 uppercase tracking-wider">Hero Slider Images Manager</h4>
                <p className="text-xs text-gray-500">Add, change, or delete images in the hero slider slideshow. Added images are uploaded and saved on the repository.</p>
                
                {/* List of current slides */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {editHeroImages.map((image, sIdx) => (
                    <div key={image.id || sIdx} className="p-4 bg-white border border-teal-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img src={image.imageUrl} className="w-16 h-10 object-cover rounded-lg border border-teal-200 shadow-sm" alt="" />
                        <div>
                          <div className="text-xs font-extrabold text-teal-950">{image.title?.en || 'Slide ' + (sIdx + 1)}</div>
                          <div className="text-[10px] text-gray-400 font-medium">{image.imageUrl}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editHeroImages.filter((_, i) => i !== sIdx);
                            setEditHeroImages(updated);
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form to add a new slide */}
                <div className="p-4 bg-teal-100/30 border border-teal-200/50 rounded-2xl space-y-4">
                  <div className="text-xs font-extrabold text-teal-950 uppercase tracking-wider">Add New Image Slide</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-teal-950 uppercase tracking-wider block">Slide Image (Upload File)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingSlide(true);
                            try {
                              const url = await handleFileUpload(file);
                              setNewSlideImage(url);
                            } catch (err: any) {
                              alert('Upload failed: ' + err.message);
                            } finally {
                              setUploadingSlide(false);
                            }
                          }
                        }}
                        className="text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                      />
                      {newSlideImage && (
                        <div className="text-[10px] text-emerald-600 mt-1 font-medium">Selected: {newSlideImage}</div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-teal-950 uppercase tracking-wider block">Slide Image URL (Or paste directly)</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={newSlideImage}
                        onChange={(e) => setNewSlideImage(e.target.value)}
                        className="w-full p-2 bg-white border border-teal-200 rounded-lg text-xs text-teal-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-teal-950 uppercase tracking-wider block">Slide Title (English)</label>
                      <input
                        type="text"
                        placeholder="e.g. Traditional Cultivation"
                        value={newSlideTitleEn}
                        onChange={(e) => setNewSlideTitleEn(e.target.value)}
                        className="w-full p-2 bg-white border border-teal-200 rounded-lg text-xs text-teal-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-teal-950 uppercase tracking-wider block">Slide Title (Nepali)</label>
                      <input
                        type="text"
                        placeholder="जस्तै: परम्परागत खेती"
                        value={newSlideTitleNe}
                        onChange={(e) => setNewSlideTitleNe(e.target.value)}
                        className="w-full p-2 bg-white border border-teal-200 rounded-lg text-xs text-teal-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-black text-teal-950 uppercase tracking-wider block">Description (English)</label>
                      <input
                        type="text"
                        placeholder="Short description of this slide..."
                        value={newSlideDescEn}
                        onChange={(e) => setNewSlideDescEn(e.target.value)}
                        className="w-full p-2 bg-white border border-teal-200 rounded-lg text-xs text-teal-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-black text-teal-950 uppercase tracking-wider block">Description (Nepali)</label>
                      <input
                        type="text"
                        placeholder="यस स्लाइडको संक्षिप्त विवरण..."
                        value={newSlideDescNe}
                        onChange={(e) => setNewSlideDescNe(e.target.value)}
                        className="w-full p-2 bg-white border border-teal-200 rounded-lg text-xs text-teal-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={uploadingSlide || !newSlideImage}
                    onClick={() => {
                      const newSlide = {
                        id: 'custom_slide_' + Date.now(),
                        imageUrl: newSlideImage,
                        title: {
                          en: newSlideTitleEn || 'Custom Slide',
                          ne: newSlideTitleNe || 'अनुकूलित स्लाइड'
                        },
                        description: {
                          en: newSlideDescEn || '',
                          ne: newSlideDescNe || ''
                        }
                      };
                      setEditHeroImages([...editHeroImages, newSlide]);
                      setNewSlideImage('');
                      setNewSlideTitleEn('');
                      setNewSlideTitleNe('');
                      setNewSlideDescEn('');
                      setNewSlideDescNe('');
                    }}
                    className="px-4 py-2 bg-teal-850 hover:bg-teal-800 text-white disabled:opacity-50 text-xs font-bold uppercase rounded-lg transition-colors flex items-center gap-1 border border-teal-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Slider List</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-teal-200">
              <button
                type="submit"
                disabled={isSavingTexts}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingTexts ? 'Saving...' : 'Save Homepage Content'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingTexts(false)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden text-white rounded-3xl py-16 px-6 sm:px-12 lg:px-20 shadow-2xl border-b-8 border-emerald-500">
        {/* Background Slider */}
        {activeHeroImages.map((item, idx) => (
          <div
            key={item.id || idx}
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
            {lang === 'en' ? (siteTexts.sliderBadgeEn || 'Jay Paan Dev') : (siteTexts.sliderBadgeNe || 'जय पान देव')}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-teal-50 drop-shadow-xl">
            {lang === 'en' ? siteTexts.heroTitleEn : siteTexts.heroTitleNe}
          </h1>
          <p className="text-lg sm:text-xl text-teal-50 max-w-2xl font-light leading-relaxed drop-shadow-lg">
            {lang === 'en' ? siteTexts.heroSubEn : siteTexts.heroSubNe}
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
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-md border border-teal-100 dark:border-slate-800 transition-colors">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-950 dark:text-teal-50 mb-8 flex items-center gap-3">
          <PlayCircle className="w-7 h-7 text-emerald-500" />
          {t.photoGallery[lang]}
        </h2>
        <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden bg-gray-100 group shadow-inner">
          {activeHeroImages[currentImageIdx] && (
            <>
              <img 
                src={activeHeroImages[currentImageIdx].imageUrl}
                alt={activeHeroImages[currentImageIdx].title?.[lang] || ''}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
                <h3 className="text-xl sm:text-3xl font-bold mb-2 shadow-sm">{activeHeroImages[currentImageIdx].title?.[lang] || ''}</h3>
                <p className="text-teal-50 text-sm sm:text-base max-w-2xl font-medium">{activeHeroImages[currentImageIdx].description?.[lang] || ''}</p>
              </div>
            </>
          )}
          
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
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-teal-50 dark:border-slate-800/60 relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <BookOpen className="w-32 h-32 text-teal-900 dark:text-teal-100" />
            </div>
            <h3 className="text-xl font-extrabold text-teal-950 dark:text-teal-150 mb-4 border-b-2 border-emerald-500 inline-block pb-1">
              {lang === 'en' ? siteTexts.heroTitleEn : siteTexts.heroTitleNe}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium text-[15px]">
              {lang === 'en' ? siteTexts.introEn : siteTexts.introNe}
            </p>
          </div>
          
          <div className="bg-teal-50 dark:bg-slate-900/50 p-8 rounded-3xl shadow-sm border border-teal-100 dark:border-slate-800/80 relative transition-colors">
            <div className="absolute -top-4 -left-4 bg-emerald-500 p-3 rounded-full text-white shadow-lg">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-teal-900 dark:text-emerald-400 mb-4 ml-6">
              {lang === 'en' ? siteTexts.paanStoryTitleEn : siteTexts.paanStoryTitleNe}
            </h3>
            <p className="text-teal-800 dark:text-teal-200 leading-relaxed font-medium text-[15px]">
              {lang === 'en' ? siteTexts.paanStoryEn : siteTexts.paanStoryNe}
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
                  {lang === 'en' ? siteTexts.missionTitleEn : siteTexts.missionTitleNe}
                </h3>
                <p className="text-teal-50 text-[15px] leading-relaxed font-medium">
                  {lang === 'en' ? siteTexts.missionEn : siteTexts.missionNe}
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="space-y-8">
        <h3 className="text-2xl sm:text-3xl font-black text-teal-950 dark:text-teal-50 text-center uppercase tracking-tight">
          {lang === 'en' ? siteTexts.impactHeaderEn : siteTexts.impactHeaderNe}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactStats.map((stat, idx) => {
            const icons = [Users, Leaf, BookOpen];
            const Icon = icons[idx % icons.length];
            return (
              <div key={stat.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-teal-100 dark:border-slate-800 hover:shadow-md transition-all text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-emerald-600">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-black text-teal-950 dark:text-teal-50 tracking-tight">
                  {stat.value}
                </div>
                <div>
                  <h4 className="font-extrabold text-teal-700 dark:text-emerald-400 uppercase text-xs tracking-wider mb-2">
                    {stat.label[lang]}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
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
            <div key={notice.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-teal-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all">
              <div 
                className="p-6 cursor-pointer hover:bg-teal-50/50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => {
                  setExpandedNoticeId(prev => prev === notice.id ? null : notice.id);
                  setViewPdfNoticeId(null);
                  onTrackAction(`Toggled notice expansion: ${notice.title.en || notice.title.ne}`);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-bold">
                    <Calendar className="w-4 h-4" />
                    {notice.date}
                  </div>
                  <ChevronRight className={`w-5 h-5 text-teal-400 transition-transform ${expandedNoticeId === notice.id ? 'rotate-90' : ''}`} />
                </div>
                <h4 className="text-xl font-bold text-teal-950 dark:text-teal-50 mb-2">
                  {notice.title[lang] || notice.title.en}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
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
              <div key={member.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-teal-100 dark:border-slate-800 flex flex-col items-center text-center gap-4 hover:shadow-md transition-all group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-100 dark:border-emerald-900/50 group-hover:border-emerald-400 transition-colors">
                  <img src={member.avatarUrl} alt={member.name[lang]} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-extrabold text-teal-950 dark:text-teal-50 text-lg">{member.name[lang]}</h4>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">{member.role[lang]}</p>
                </div>
                <button
                  onClick={() => {
                    onSelectLeader(member.id);
                    onNavigate('leader-bio');
                    onTrackAction(`Viewed profile of ${member.name.en}`);
                  }}
                  className="mt-auto text-sm font-bold text-teal-700 dark:text-teal-200 bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 px-6 py-2 rounded-full transition-colors flex items-center gap-1"
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
