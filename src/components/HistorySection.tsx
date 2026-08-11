import React, { useState, useEffect } from 'react';
import { BookOpen, Map, Users, ChevronRight, ChevronLeft, Leaf, PlayCircle, ArrowRight, Bell, Calendar, Image as ImageIcon, Eye, Download, X, Film, Play, Sparkles, MapPin, ShieldCheck, Lock, Trash2, Plus, ExternalLink, Edit, Edit3, Save, Phone, Mail, HeartHandshake, GraduationCap, ShieldAlert, LifeBuoy, Building2, Globe, FileText, Heart, Search, CheckCircle, TrendingUp, BarChart2, UserCheck, Clock, Droplet, FolderDown, Layers, Award, Upload, Wand2 } from 'lucide-react';
import { Album, Language, Notice, SiteTexts, NetworkBranch, Member } from '../types';
import { uploadImageToGithub } from '../utils/githubDb';
import { compressImageToBase64, removeImageWhiteBackground } from '../utils/imageUtils';
import { communityHistory, impactStats, galleryItems, boardMembers, notices as defaultNotices, blogPosts, upcomingEvents } from '../data/communityData';
import { journeyAlbums as defaultJourneyAlbums } from '../data/albumsData';
import AlbumDetail from './AlbumDetail';
import { extractGoogleDriveId, formatNumber, getBestAlbumCover } from '../utils/mediaUrl';

interface HistorySectionProps {
  lang: Language;
  onNavigate: (tabId: string) => void;
  onTrackAction: (actionName: string) => void;
  onSelectLeader: (id: string) => void;
  onSelectPost?: (post: any) => void;
  onSelectAlbum?: (albumId: string) => void;
  albums?: Album[];
  membersList?: Member[];
  onOpenUploadModal?: () => void;
  isAdmin?: boolean;
  onOpenAdminModal?: () => void;
  onDeleteAlbum?: (albumId: string) => void;
  onOpenAddNoticeModal?: () => void;
  onDeleteNotice?: (id: string) => void;
  noticesList?: Notice[];
  siteTexts: SiteTexts;
  onUpdateSiteTexts: (texts: Partial<SiteTexts>) => Promise<void>;
  networks?: NetworkBranch[];
  onSelectNetwork?: (id: string) => void;
  onAddNetwork?: (network: NetworkBranch) => void;
  onDeleteNetwork?: (id: string) => void;
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

const defaultEservices = [
  { id: '1', titleEn: 'Directory & Member ID', titleNe: 'सदस्यता तथा परिचयपत्र प्रणाली', subEn: 'Search members & verify credentials', subNe: 'सदस्य खोजी र डिजिटल प्रमाण प्रमाणीकरण', icon: 'UserCheck', targetPage: 'directory' },
  { id: '2', titleEn: 'Matrimonial Match Portal', titleNe: 'वैवाहिक जोडी खोज तथा दर्ता', subEn: 'Verified matrimonial profiles hub', subNe: 'प्रमाणित बायोडाटा र वैवाहिक समन्वय', icon: 'Heart', targetPage: 'matrimonial' },
  { id: '3', titleEn: 'Emergency Blood Bank', titleNe: 'आकस्मिक रक्तदान तथा स्वास्थ्य कोष', subEn: 'Find blood donors & medical aid', subNe: 'रक्तदाता सूची र आकस्मिक स्वास्थ्य सहयोग', icon: 'Droplet', targetPage: 'directory' },
  { id: '4', titleEn: 'Youth Scholarship Desk', titleNe: 'विद्यार्थी छात्रवृत्ति तथा युवा मार्गदर्शन', subEn: 'Higher education grants & IT training', subNe: 'उच्च शिक्षा छात्रवृत्ति र प्राविधिक तालिम', icon: 'GraduationCap', targetPage: 'membership' },
  { id: '5', titleEn: 'Bareja Paan Farmers Helpdesk', titleNe: 'बरैजा पान किसान सहयोग कक्ष', subEn: 'Subsidies, crop insurance & guidance', subNe: 'अनुदान, कृषि बीमा र प्राविधिक सल्लाह', icon: 'FolderDown', targetPage: 'our-heritage' },
  { id: '6', titleEn: 'Official Document & Circular Portal', titleNe: 'अधिकार तथा परिपत्र पोर्टल', subEn: 'Download SWC registration & bylaws', subNe: 'विधान, दर्ता प्रमाण र वार्षिक प्रतिवेदन', icon: 'FileText', targetPage: 'documents' },
  { id: '7', titleEn: 'Notice & Press Announcements', titleNe: 'सूचना तथा प्रेस विज्ञप्ति', subEn: 'Official central press releases & notices', subNe: 'केन्द्रीय प्रेस विज्ञप्ति र आधिकारिक निर्णय', icon: 'Bell', targetPage: 'history' }
];

const defaultUnityStats = [
  { id: '1', labelEn: 'Members', labelNe: 'दर्ता परिवार', val: '12,500+', subEn: 'Verified Profiles', subNe: 'नेपाल र विदेश', icon: 'Users' },
  { id: '2', labelEn: 'Branches', labelNe: 'जिल्ला शाखा', val: '35+', subEn: 'Active Committees', subNe: 'कार्यसमिति गठन', icon: 'Building2' },
  { id: '3', labelEn: 'Blood Donors', labelNe: 'रक्तदाता', val: '1,400+', subEn: 'Ready Assistance', subNe: 'आकस्मिक सूची', icon: 'Droplet' },
  { id: '4', labelEn: 'Weddings', labelNe: 'सफल जोडी', val: '450+', subEn: 'Happy Unions', subNe: 'सम्पन्न विवाह', icon: 'Heart' }
];

const renderServiceIcon = (iconName?: string) => {
  switch (iconName) {
    case 'UserCheck': return <UserCheck className="w-4 h-4" />;
    case 'Heart': return <Heart className="w-4 h-4" />;
    case 'Droplet': return <Droplet className="w-4 h-4" />;
    case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
    case 'FolderDown': return <FolderDown className="w-4 h-4" />;
    case 'FileText': return <FileText className="w-4 h-4" />;
    case 'Bell': return <Bell className="w-4 h-4" />;
    case 'Globe': return <Globe className="w-4 h-4" />;
    case 'Building2': return <Building2 className="w-4 h-4" />;
    case 'Users': return <Users className="w-4 h-4" />;
    case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
    default: return <Globe className="w-4 h-4" />;
  }
};

const renderStatIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Users': return <Users className="w-3.5 h-3.5 text-emerald-500" />;
    case 'Building2': return <Building2 className="w-3.5 h-3.5 text-blue-500" />;
    case 'Droplet': return <Droplet className="w-3.5 h-3.5 text-rose-500" />;
    case 'Heart': return <Heart className="w-3.5 h-3.5 text-pink-500" />;
    case 'GraduationCap': return <GraduationCap className="w-3.5 h-3.5 text-teal-500" />;
    default: return <Sparkles className="w-3.5 h-3.5 text-emerald-500" />;
  }
};

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
  networks = [],
  onSelectNetwork,
  onAddNetwork,
  onDeleteNetwork,
  membersList,
}: HistorySectionProps) {
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  const [secondaryImageIdx, setSecondaryImageIdx] = useState(0);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);
  const [viewPdfNoticeId, setViewPdfNoticeId] = useState<string | null>(null);
  const [livePosts, setLivePosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Network creation/editing modal states
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [editingNetId, setEditingNetId] = useState<string | null>(null);
  const [netNameEn, setNetNameEn] = useState('');
  const [netNameNe, setNetNameNe] = useState('');
  const [netType, setNetType] = useState<'chapter' | 'sister'>('chapter');
  const [netDescEn, setNetDescEn] = useState('');
  const [netDescNe, setNetDescNe] = useState('');
  const [netLocEn, setNetLocEn] = useState('');
  const [netLocNe, setNetLocNe] = useState('');

  // Editable site texts section modal state
  const [activeEditSection, setActiveEditSection] = useState<'hero' | 'leadership' | 'executive_committee' | 'heritage' | 'mission' | 'impact' | 'eservices' | 'branding' | 'unity' | 'ribbon' | 'pillars' | 'recent_updates' | null>(null);
  const [editingUnityStatId, setEditingUnityStatId] = useState<string | number | null>(null);
  const [inlineStatValue, setInlineStatValue] = useState('');
  const [inlineStatLabelEn, setInlineStatLabelEn] = useState('');
  const [inlineStatLabelNe, setInlineStatLabelNe] = useState('');
  const [inlineStatSubEn, setInlineStatSubEn] = useState('');
  const [inlineStatSubNe, setInlineStatSubNe] = useState('');
  const [inlineStatIcon, setInlineStatIcon] = useState('Users');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [editTopRibbonEn, setEditTopRibbonEn] = useState(siteTexts.topRibbonEn || '');
  const [editTopRibbonNe, setEditTopRibbonNe] = useState(siteTexts.topRibbonNe || '');
  const [editRegNoEn, setEditRegNoEn] = useState(siteTexts.regNoEn || '');
  const [editRegNoNe, setEditRegNoNe] = useState(siteTexts.regNoNe || '');
  const [selectedDirectoryMemberId, setSelectedDirectoryMemberId] = useState<string>('');

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
  const [editLogoFontSizeMobile, setEditLogoFontSizeMobile] = useState(siteTexts.logoFontSizeMobile || 'text-base xs:text-lg sm:text-xl');
  const [editLogoFontSizeDesktop, setEditLogoFontSizeDesktop] = useState(siteTexts.logoFontSizeDesktop || 'text-2xl lg:text-3.5xl');
  const [editLogoSubFontSizeMobile, setEditLogoSubFontSizeMobile] = useState(siteTexts.logoSubFontSizeMobile || 'text-[9px] xs:text-[10px] sm:text-[11px]');
  const [editMenuFontSizeDesktop, setEditMenuFontSizeDesktop] = useState(siteTexts.menuFontSizeDesktop || 'text-xs xl:text-sm');
  const [editMenuFontSizeMobile, setEditMenuFontSizeMobile] = useState(siteTexts.menuFontSizeMobile || 'text-sm');
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
  const [editPresidentTitleEn, setEditPresidentTitleEn] = useState(siteTexts.presidentMessageTitleEn || "Chief President's Message");
  const [editPresidentTitleNe, setEditPresidentTitleNe] = useState(siteTexts.presidentMessageTitleNe || 'मुख्य अध्यक्षको सन्देश');
  const [editPresidentMsgEn, setEditPresidentMsgEn] = useState(siteTexts.presidentMessageEn || '');
  const [editPresidentMsgNe, setEditPresidentMsgNe] = useState(siteTexts.presidentMessageNe || '');

  // Helpline & Community Pillars state
  const [editHelplineTitleEn, setEditHelplineTitleEn] = useState(siteTexts.helplineTitleEn || 'Emergency & Helpline');
  const [editHelplineTitleNe, setEditHelplineTitleNe] = useState(siteTexts.helplineTitleNe || 'आकस्मिक तथा हेल्पलाइन');
  const [editHelplineCentralLabelEn, setEditHelplineCentralLabelEn] = useState(siteTexts.helplineCentralLabelEn || 'Central Helpline');
  const [editHelplineCentralLabelNe, setEditHelplineCentralLabelNe] = useState(siteTexts.helplineCentralLabelNe || 'केन्द्रीय हेल्पलाइन');
  const [editHelplinePhone, setEditHelplinePhone] = useState(siteTexts.helplinePhone || '+977-9812345678');
  const [editHelplineSecretariatLabelEn, setEditHelplineSecretariatLabelEn] = useState(siteTexts.helplineSecretariatLabelEn || 'Secretariat');
  const [editHelplineSecretariatLabelNe, setEditHelplineSecretariatLabelNe] = useState(siteTexts.helplineSecretariatLabelNe || 'केन्द्रीय सचिवाल');
  const [editHelplineEmail, setEditHelplineEmail] = useState(siteTexts.helplineEmail || 'achauraseeya@gmail.com');

  const [editPillarsTitleEn, setEditPillarsTitleEn] = useState(siteTexts.pillarsTitleEn || 'Community Pillars');
  const [editPillarsTitleNe, setEditPillarsTitleNe] = useState(siteTexts.pillarsTitleNe || 'समुदायका आधारहरू');
  const [editPillar1TitleEn, setEditPillar1TitleEn] = useState(siteTexts.pillar1TitleEn || 'Paan Heritage');
  const [editPillar1TitleNe, setEditPillar1TitleNe] = useState(siteTexts.pillar1TitleNe || 'पान सम्पदा');
  const [editPillar1SubEn, setEditPillar1SubEn] = useState(siteTexts.pillar1SubEn || 'Culture & Farming');
  const [editPillar1SubNe, setEditPillar1SubNe] = useState(siteTexts.pillar1SubNe || 'संस्कृति र खेती');

  const [editPillar2TitleEn, setEditPillar2TitleEn] = useState(siteTexts.pillar2TitleEn || 'Youth & Career');
  const [editPillar2TitleNe, setEditPillar2TitleNe] = useState(siteTexts.pillar2TitleNe || 'युवा तथा शिक्षा');
  const [editPillar2SubEn, setEditPillar2SubEn] = useState(siteTexts.pillar2SubEn || 'Grants & Support');
  const [editPillar2SubNe, setEditPillar2SubNe] = useState(siteTexts.pillar2SubNe || 'छात्रवृत्ति र मार्गदर्शन');

  const [editPillar3TitleEn, setEditPillar3TitleEn] = useState(siteTexts.pillar3TitleEn || 'District Branches');
  const [editPillar3TitleNe, setEditPillar3TitleNe] = useState(siteTexts.pillar3TitleNe || 'जिल्ला शाखाहरू');
  const [editPillar3SubEn, setEditPillar3SubEn] = useState(siteTexts.pillar3SubEn || '77 Districts');
  const [editPillar3SubNe, setEditPillar3SubNe] = useState(siteTexts.pillar3SubNe || '७७ वटै जिल्ला');

  const [editPillar4TitleEn, setEditPillar4TitleEn] = useState(siteTexts.pillar4TitleEn || 'Transparency');
  const [editPillar4TitleNe, setEditPillar4TitleNe] = useState(siteTexts.pillar4TitleNe || 'सुशासन र कोष');
  const [editPillar4SubEn, setEditPillar4SubEn] = useState(siteTexts.pillar4SubEn || 'Audited Reports');
  const [editPillar4SubNe, setEditPillar4SubNe] = useState(siteTexts.pillar4SubNe || 'पारदर्शी विवरण');

  const [editHeroImages, setEditHeroImages] = useState<any[]>(() => {
    try {
      if (siteTexts.heroImagesJson) {
        const parsed = JSON.parse(siteTexts.heroImagesJson);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [...galleryItems];
  });

  const [editSecondaryImages, setEditSecondaryImages] = useState<any[]>(() => {
    try {
      if (siteTexts.secondaryImagesJson) {
        const parsed = JSON.parse(siteTexts.secondaryImagesJson);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [...galleryItems];
  });

  // State for adding a new secondary slider image
  const [newSecondaryImage, setNewSecondaryImage] = useState('');
  const [newSecondaryTitleEn, setNewSecondaryTitleEn] = useState('');
  const [newSecondaryTitleNe, setNewSecondaryTitleNe] = useState('');
  const [newSecondaryDescEn, setNewSecondaryDescEn] = useState('');
  const [newSecondaryDescNe, setNewSecondaryDescNe] = useState('');
  const [uploadingSecondarySlide, setUploadingSecondarySlide] = useState(false);

  // Dynamic statistics editor state
  const [editImpactStats, setEditImpactStats] = useState<any[]>(() => {
    try {
      if (siteTexts.impactStatsJson) {
        const parsed = JSON.parse(siteTexts.impactStatsJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [...impactStats];
  });

  // Dynamic homepage featured leadership state
  const [editLeadership, setEditLeadership] = useState<any[]>(() => {
    try {
      if (siteTexts.leadershipIdsJson) {
        const parsed = JSON.parse(siteTexts.leadershipIdsJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return boardMembers.filter(m => m.id === '1' || m.id === 'vc1');
  });

  // E-Services editable state
  const [editEservicesTitleEn, setEditEservicesTitleEn] = useState(siteTexts.eservicesTitleEn || 'Institutional E-Services');
  const [editEservicesTitleNe, setEditEservicesTitleNe] = useState(siteTexts.eservicesTitleNe || 'डिजिटल नागरिक सेवा पोर्टल');
  const [editEservicesSubEn, setEditEservicesSubEn] = useState(siteTexts.eservicesSubEn || 'Direct Citizen Portals & Verification');
  const [editEservicesSubNe, setEditEservicesSubNe] = useState(siteTexts.eservicesSubNe || 'प्रत्यक्ष संस्थागत तथा नागरिक सेवाहरू');
  const [editEservicesList, setEditEservicesList] = useState<any[]>(() => {
    try {
      if (siteTexts.eservicesJson) {
        const parsed = JSON.parse(siteTexts.eservicesJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultEservices;
  });

  // Unity, Consolidation & Cooperation editable state
  const [editUnityTitleEn, setEditUnityTitleEn] = useState(siteTexts.unityTitleEn || 'Unity, Consolidation & Cooperation');
  const [editUnityTitleNe, setEditUnityTitleNe] = useState(siteTexts.unityTitleNe || 'एकता, एक्यबद्धता र सहकार्य');
  const [editUnityVisionEn, setEditUnityVisionEn] = useState(siteTexts.unityVisionEn || siteTexts.visionEn || 'Dedicated to Unity, Consolidation and Cooperation.');
  const [editUnityVisionNe, setEditUnityVisionNe] = useState(siteTexts.unityVisionNe || siteTexts.visionNe || 'एकता, एक्यबद्धता र सहकार्यमा समर्पित।');

  const [editUnityTenet1En, setEditUnityTenet1En] = useState(siteTexts.unityTenet1En || 'Unity');
  const [editUnityTenet1Ne, setEditUnityTenet1Ne] = useState(siteTexts.unityTenet1Ne || 'एकता');
  const [editUnityTenet1SubEn, setEditUnityTenet1SubEn] = useState(siteTexts.unityTenet1SubEn || 'Harmony');
  const [editUnityTenet1SubNe, setEditUnityTenet1SubNe] = useState(siteTexts.unityTenet1SubNe || 'सद्भाव');

  const [editUnityTenet2En, setEditUnityTenet2En] = useState(siteTexts.unityTenet2En || 'Consolidation');
  const [editUnityTenet2Ne, setEditUnityTenet2Ne] = useState(siteTexts.unityTenet2Ne || 'एक्यबद्धता');
  const [editUnityTenet2SubEn, setEditUnityTenet2SubEn] = useState(siteTexts.unityTenet2SubEn || 'Heritage');
  const [editUnityTenet2SubNe, setEditUnityTenet2SubNe] = useState(siteTexts.unityTenet2SubNe || 'सम्पदा');

  const [editUnityTenet3En, setEditUnityTenet3En] = useState(siteTexts.unityTenet3En || 'Cooperation');
  const [editUnityTenet3Ne, setEditUnityTenet3Ne] = useState(siteTexts.unityTenet3Ne || 'सहकार्य');
  const [editUnityTenet3SubEn, setEditUnityTenet3SubEn] = useState(siteTexts.unityTenet3SubEn || 'Mutual Aid');
  const [editUnityTenet3SubNe, setEditUnityTenet3SubNe] = useState(siteTexts.unityTenet3SubNe || 'सहयोग');

  const [editUnityStats, setEditUnityStats] = useState<any[]>(() => {
    try {
      if (siteTexts.unityStatsJson) {
        const parsed = JSON.parse(siteTexts.unityStatsJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultUnityStats;
  });

  const [editUnityNextEventTitleEn, setEditUnityNextEventTitleEn] = useState(siteTexts.unityNextEventTitleEn || 'Annual Chaurasiya National Convention & Educational Honors');
  const [editUnityNextEventTitleNe, setEditUnityNextEventTitleNe] = useState(siteTexts.unityNextEventTitleNe || 'चौरासिया समाज राष्ट्रिय महाधिवेशन तथा सम्मान समारोह');
  const [editUnityNextEventDateEn, setEditUnityNextEventDateEn] = useState(siteTexts.unityNextEventDateEn || 'BS 2083');
  const [editUnityNextEventDateNe, setEditUnityNextEventDateNe] = useState(siteTexts.unityNextEventDateNe || 'वि.सं. २०८३');
  const [editUnityNextEventLocEn, setEditUnityNextEventLocEn] = useState(siteTexts.unityNextEventLocEn || 'Kathmandu / Parsa');
  const [editUnityNextEventLocNe, setEditUnityNextEventLocNe] = useState(siteTexts.unityNextEventLocNe || 'काठमाडौँ / पर्सा');

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
    return new Promise(async (resolve, reject) => {
      try {
        const base64 = await compressImageToBase64(file, 500);
        const fileName = `${Date.now()}_${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
        const url = await uploadImageToGithub(fileName, base64, `Upload image ${file.name}`);
        resolve(url);
      } catch (e: any) {
        reject(e);
      }
    });
  };

  useEffect(() => {
    if (!activeEditSection) return;

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
    setEditLogoFontSizeMobile(siteTexts.logoFontSizeMobile || 'text-base xs:text-lg sm:text-xl');
    setEditLogoFontSizeDesktop(siteTexts.logoFontSizeDesktop || 'text-2xl lg:text-3.5xl');
    setEditLogoSubFontSizeMobile(siteTexts.logoSubFontSizeMobile || 'text-[9px] xs:text-[10px] sm:text-[11px]');
    setEditMenuFontSizeDesktop(siteTexts.menuFontSizeDesktop || 'text-xs xl:text-sm');
    setEditMenuFontSizeMobile(siteTexts.menuFontSizeMobile || 'text-sm');
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
    setEditPresidentTitleEn(siteTexts.presidentMessageTitleEn || "Chief President's Message");
    setEditPresidentTitleNe(siteTexts.presidentMessageTitleNe || 'मुख्य अध्यक्षको सन्देश');
    setEditPresidentMsgEn(siteTexts.presidentMessageEn || '');
    setEditPresidentMsgNe(siteTexts.presidentMessageNe || '');

    setEditHelplineTitleEn(siteTexts.helplineTitleEn || 'Emergency & Helpline');
    setEditHelplineTitleNe(siteTexts.helplineTitleNe || 'आकस्मिक तथा हेल्पलाइन');
    setEditHelplineCentralLabelEn(siteTexts.helplineCentralLabelEn || 'Central Helpline');
    setEditHelplineCentralLabelNe(siteTexts.helplineCentralLabelNe || 'केन्द्रीय हेल्पलाइन');
    setEditHelplinePhone(siteTexts.helplinePhone || '+977-9812345678');
    setEditHelplineSecretariatLabelEn(siteTexts.helplineSecretariatLabelEn || 'Secretariat');
    setEditHelplineSecretariatLabelNe(siteTexts.helplineSecretariatLabelNe || 'केन्द्रीय सचिवाल');
    setEditHelplineEmail(siteTexts.helplineEmail || 'achauraseeya@gmail.com');

    setEditPillarsTitleEn(siteTexts.pillarsTitleEn || 'Community Pillars');
    setEditPillarsTitleNe(siteTexts.pillarsTitleNe || 'समुदायका आधारहरू');
    setEditPillar1TitleEn(siteTexts.pillar1TitleEn || 'Paan Heritage');
    setEditPillar1TitleNe(siteTexts.pillar1TitleNe || 'पान सम्पदा');
    setEditPillar1SubEn(siteTexts.pillar1SubEn || 'Culture & Farming');
    setEditPillar1SubNe(siteTexts.pillar1SubNe || 'संस्कृति र खेती');

    setEditPillar2TitleEn(siteTexts.pillar2TitleEn || 'Youth & Career');
    setEditPillar2TitleNe(siteTexts.pillar2TitleNe || 'युवा तथा शिक्षा');
    setEditPillar2SubEn(siteTexts.pillar2SubEn || 'Grants & Support');
    setEditPillar2SubNe(siteTexts.pillar2SubNe || 'छात्रवृत्ति र मार्गदर्शन');

    setEditPillar3TitleEn(siteTexts.pillar3TitleEn || 'District Branches');
    setEditPillar3TitleNe(siteTexts.pillar3TitleNe || 'जिल्ला शाखाहरू');
    setEditPillar3SubEn(siteTexts.pillar3SubEn || '77 Districts');
    setEditPillar3SubNe(siteTexts.pillar3SubNe || '७७ वटै जिल्ला');

    setEditPillar4TitleEn(siteTexts.pillar4TitleEn || 'Transparency');
    setEditPillar4TitleNe(siteTexts.pillar4TitleNe || 'सुशासन र कोष');
    setEditPillar4SubEn(siteTexts.pillar4SubEn || 'Audited Reports');
    setEditPillar4SubNe(siteTexts.pillar4SubNe || 'पारदर्शी विवरण');

    try {
      if (siteTexts.heroImagesJson) {
        const parsed = JSON.parse(siteTexts.heroImagesJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEditHeroImages(parsed);
        } else {
          setEditHeroImages([...galleryItems]);
        }
      } else {
        setEditHeroImages([...galleryItems]);
      }
    } catch (e) {
      setEditHeroImages([...galleryItems]);
    }

    try {
      if (siteTexts.impactStatsJson) {
        const parsed = JSON.parse(siteTexts.impactStatsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEditImpactStats(parsed);
        } else {
          setEditImpactStats([...impactStats]);
        }
      } else {
        setEditImpactStats([...impactStats]);
      }
    } catch (e) {
      setEditImpactStats([...impactStats]);
    }

    try {
      if (siteTexts.leadershipIdsJson) {
        const parsed = JSON.parse(siteTexts.leadershipIdsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEditLeadership(parsed);
        } else {
          setEditLeadership(boardMembers.filter(m => m.id === '1' || m.id === 'vc1'));
        }
      } else {
        setEditLeadership(boardMembers.filter(m => m.id === '1' || m.id === 'vc1'));
      }
    } catch (e) {
      setEditLeadership(boardMembers.filter(m => m.id === '1' || m.id === 'vc1'));
    }

    // Sync E-Services and Unity state
    setEditEservicesTitleEn(siteTexts.eservicesTitleEn || 'Institutional E-Services');
    setEditEservicesTitleNe(siteTexts.eservicesTitleNe || 'डिजिटल नागरिक सेवा पोर्टल');
    setEditEservicesSubEn(siteTexts.eservicesSubEn || 'Direct Citizen Portals & Verification');
    setEditEservicesSubNe(siteTexts.eservicesSubNe || 'प्रत्यक्ष संस्थागत तथा नागरिक सेवाहरू');
    try {
      if (siteTexts.eservicesJson) {
        const parsed = JSON.parse(siteTexts.eservicesJson);
        if (Array.isArray(parsed) && parsed.length > 0) setEditEservicesList(parsed);
        else setEditEservicesList(defaultEservices);
      } else {
        setEditEservicesList(defaultEservices);
      }
    } catch (e) { setEditEservicesList(defaultEservices); }

    setEditUnityTitleEn(siteTexts.unityTitleEn || 'Unity, Consolidation & Cooperation');
    setEditUnityTitleNe(siteTexts.unityTitleNe || 'एकता, एक्यबद्धता र सहकार्य');
    setEditUnityVisionEn(siteTexts.unityVisionEn || siteTexts.visionEn || 'Dedicated to Unity, Consolidation and Cooperation.');
    setEditUnityVisionNe(siteTexts.unityVisionNe || siteTexts.visionNe || 'एकता, एक्यबद्धता र सहकार्यमा समर्पित।');
    setEditUnityTenet1En(siteTexts.unityTenet1En || 'Unity');
    setEditUnityTenet1Ne(siteTexts.unityTenet1Ne || 'एकता');
    setEditUnityTenet1SubEn(siteTexts.unityTenet1SubEn || 'Harmony');
    setEditUnityTenet1SubNe(siteTexts.unityTenet1SubNe || 'सद्भाव');
    setEditUnityTenet2En(siteTexts.unityTenet2En || 'Consolidation');
    setEditUnityTenet2Ne(siteTexts.unityTenet2Ne || 'एक्यबद्धता');
    setEditUnityTenet2SubEn(siteTexts.unityTenet2SubEn || 'Heritage');
    setEditUnityTenet2SubNe(siteTexts.unityTenet2SubNe || 'सम्पदा');
    setEditUnityTenet3En(siteTexts.unityTenet3En || 'Cooperation');
    setEditUnityTenet3Ne(siteTexts.unityTenet3Ne || 'सहकार्य');
    setEditUnityTenet3SubEn(siteTexts.unityTenet3SubEn || 'Mutual Aid');
    setEditUnityTenet3SubNe(siteTexts.unityTenet3SubNe || 'सहयोग');

    try {
      if (siteTexts.unityStatsJson) {
        const parsed = JSON.parse(siteTexts.unityStatsJson);
        if (Array.isArray(parsed) && parsed.length > 0) setEditUnityStats(parsed);
        else setEditUnityStats(defaultUnityStats);
      } else {
        setEditUnityStats(defaultUnityStats);
      }
    } catch (e) { setEditUnityStats(defaultUnityStats); }

    setEditTopRibbonEn(siteTexts.topRibbonEn || 'जय चौरसिया समाज ! Chaurasiya Samaj Central Secretariat Birgunj, Parsa Nepal');
    setEditTopRibbonNe(siteTexts.topRibbonNe || 'जय चौरसिया समाज ! चौरसिया समाज नेपाल - केन्द्रीय कार्यालय वीरगन्ज, पर्सा');
    setEditRegNoEn(siteTexts.regNoEn || 'Reg. No. 1284/080/081');
    setEditRegNoNe(siteTexts.regNoNe || 'दर्ता नं. १२८४/०८०/०८१');

    setEditUnityNextEventTitleEn(siteTexts.unityNextEventTitleEn || 'Annual Chaurasiya National Convention & Educational Honors');
    setEditUnityNextEventTitleNe(siteTexts.unityNextEventTitleNe || 'चौरासिया समाज राष्ट्रिय महाधिवेशन तथा सम्मान समारोह');
    setEditUnityNextEventDateEn(siteTexts.unityNextEventDateEn || 'BS 2083');
    setEditUnityNextEventDateNe(siteTexts.unityNextEventDateNe || 'वि.सं. २०८३');
    setEditUnityNextEventLocEn(siteTexts.unityNextEventLocEn || 'Kathmandu / Parsa');
    setEditUnityNextEventLocNe(siteTexts.unityNextEventLocNe || 'काठमाडौँ / पर्सा');

    try {
      if (siteTexts.secondaryImagesJson) {
        const parsed = JSON.parse(siteTexts.secondaryImagesJson);
        if (Array.isArray(parsed)) {
          setEditSecondaryImages(parsed);
        } else {
          setEditSecondaryImages([...galleryItems]);
        }
      } else {
        setEditSecondaryImages([...galleryItems]);
      }
    } catch (e) {
      setEditSecondaryImages([...galleryItems]);
    }
  }, [activeEditSection]);

  useEffect(() => {
    if (activeEditSection !== null) return; // Do not overwrite local states while user is actively editing
    if (siteTexts.heroImagesJson) {
      try {
        const parsed = JSON.parse(siteTexts.heroImagesJson);
        if (Array.isArray(parsed)) setEditHeroImages(parsed);
      } catch (e) {}
    }
  }, [siteTexts.heroImagesJson, activeEditSection]);

  useEffect(() => {
    if (activeEditSection !== null) return; // Do not overwrite local states while user is actively editing
    if (siteTexts.secondaryImagesJson) {
      try {
        const parsed = JSON.parse(siteTexts.secondaryImagesJson);
        if (Array.isArray(parsed)) setEditSecondaryImages(parsed);
      } catch (e) {}
    }
  }, [siteTexts.secondaryImagesJson, activeEditSection]);

  useEffect(() => {
    if (siteTexts.topRibbonEn) setEditTopRibbonEn(siteTexts.topRibbonEn);
    if (siteTexts.topRibbonNe) setEditTopRibbonNe(siteTexts.topRibbonNe);
  }, [siteTexts.topRibbonEn, siteTexts.topRibbonNe]);

  const handleDeleteUnityStat = async (statId: string | number) => {
    if (!window.confirm('Are you sure you want to delete this statistic?')) return;
    const updatedStats = activeUnityStatsList.filter(s => s.id !== statId);
    setEditUnityStats(updatedStats);
    try {
      await onUpdateSiteTexts({
        unityStatsJson: JSON.stringify(updatedStats)
      });
      onTrackAction('Delete Unity Stat inline');
    } catch (err) {
      alert('Failed to delete statistic.');
    }
  };

  const handleStartInlineEdit = (st: any) => {
    setEditingUnityStatId(st.id);
    setInlineStatValue(st.value || st.val || '');
    setInlineStatLabelEn(st.label?.en || st.labelEn || '');
    setInlineStatLabelNe(st.label?.ne || st.labelNe || '');
    setInlineStatSubEn(st.sub?.en || st.subEn || '');
    setInlineStatSubNe(st.sub?.ne || st.subNe || '');
    setInlineStatIcon(st.icon || 'Users');
  };

  const handleSaveInlineUnityStat = async (statId: string | number) => {
    const updatedStats = activeUnityStatsList.map(s => {
      if (s.id === statId) {
        return {
          ...s,
          value: inlineStatValue,
          val: inlineStatValue,
          label: { en: inlineStatLabelEn, ne: inlineStatLabelNe },
          labelEn: inlineStatLabelEn,
          labelNe: inlineStatLabelNe,
          sub: { en: inlineStatSubEn, ne: inlineStatSubNe },
          subEn: inlineStatSubEn,
          subNe: inlineStatSubNe,
          icon: inlineStatIcon
        };
      }
      return s;
    });
    setEditUnityStats(updatedStats);
    try {
      await onUpdateSiteTexts({
        unityStatsJson: JSON.stringify(updatedStats)
      });
      setEditingUnityStatId(null);
      onTrackAction('Save Unity Stat inline');
    } catch (err) {
      alert('Failed to save statistic.');
    }
  };

  const handleAddInlineUnityStat = async () => {
    const newId = `ustat-${Date.now()}`;
    const newStat = {
      id: newId,
      value: '100+',
      val: '100+',
      label: { en: 'New Metric', ne: 'नयाँ सूचक' },
      labelEn: 'New Metric',
      labelNe: 'नयाँ सूचक',
      sub: { en: 'Active Members', ne: 'सक्रिय सदस्यहरू' },
      subEn: 'Active Members',
      subNe: 'सक्रिय सदस्यहरू',
      icon: 'Users'
    };
    const updatedStats = [...activeUnityStatsList, newStat];
    setEditUnityStats(updatedStats);
    try {
      await onUpdateSiteTexts({
        unityStatsJson: JSON.stringify(updatedStats)
      });
      setEditingUnityStatId(newId);
      setInlineStatValue('100+');
      setInlineStatLabelEn('New Metric');
      setInlineStatLabelNe('नयाँ सूचक');
      setInlineStatSubEn('Active Members');
      setInlineStatSubNe('सक्रिय सदस्यहरू');
      setInlineStatIcon('Users');
      onTrackAction('Add Unity Stat inline');
    } catch (err) {
      alert('Failed to add new statistic.');
    }
  };

  const handleSaveCurrentSection = async () => {
    setIsSavingTexts(true);
    try {
      let updates: Partial<typeof siteTexts> = {};

      if (activeEditSection === 'hero') {
        updates = {
          sliderBadgeEn: editSliderBadgeEn,
          sliderBadgeNe: editSliderBadgeNe,
          heroTitleEn: editHeroTitleEn,
          heroTitleNe: editHeroTitleNe,
          heroSubEn: editHeroSubEn,
          heroSubNe: editHeroSubNe,
          heroImagesJson: JSON.stringify(editHeroImages),
        };
      } else if (activeEditSection === 'recent_updates') {
        updates = {
          secondaryImagesJson: JSON.stringify(editSecondaryImages),
        };
      } else if (activeEditSection === 'leadership') {
        updates = {
          presidentMessageTitleEn: editPresidentTitleEn,
          presidentMessageTitleNe: editPresidentTitleNe,
          presidentMessageEn: editPresidentMsgEn,
          presidentMessageNe: editPresidentMsgNe,
        };
      } else if (activeEditSection === 'executive_committee') {
        updates = {
          leadershipIdsJson: JSON.stringify(editLeadership),
        };
      } else if (activeEditSection === 'heritage') {
        updates = {
          introEn: editIntroEn,
          introNe: editIntroNe,
          paanStoryTitleEn: editPaanStoryTitleEn,
          paanStoryTitleNe: editPaanStoryTitleNe,
          paanStoryEn: editPaanStoryEn,
          paanStoryNe: editPaanStoryNe,
        };
      } else if (activeEditSection === 'mission') {
        updates = {
          missionTitleEn: editMissionTitleEn,
          missionTitleNe: editMissionTitleNe,
          missionEn: editMissionEn,
          missionNe: editMissionNe,
        };
      } else if (activeEditSection === 'impact') {
        updates = {
          impactHeaderEn: editImpactHeaderEn,
          impactHeaderNe: editImpactHeaderNe,
          impactStatsJson: JSON.stringify(editImpactStats),
        };
      } else if (activeEditSection === 'eservices') {
        updates = {
          eservicesTitleEn: editEservicesTitleEn,
          eservicesTitleNe: editEservicesTitleNe,
          eservicesSubEn: editEservicesSubEn,
          eservicesSubNe: editEservicesSubNe,
          eservicesJson: JSON.stringify(editEservicesList),
        };
      } else if (activeEditSection === 'unity') {
        updates = {
          unityTitleEn: editUnityTitleEn,
          unityTitleNe: editUnityTitleNe,
          unityVisionEn: editUnityVisionEn,
          unityVisionNe: editUnityVisionNe,
          unityTenet1En: editUnityTenet1En,
          unityTenet1Ne: editUnityTenet1Ne,
          unityTenet1SubEn: editUnityTenet1SubEn,
          unityTenet1SubNe: editUnityTenet1SubNe,
          unityTenet2En: editUnityTenet2En,
          unityTenet2Ne: editUnityTenet2Ne,
          unityTenet2SubEn: editUnityTenet2SubEn,
          unityTenet2SubNe: editUnityTenet2SubNe,
          unityTenet3En: editUnityTenet3En,
          unityTenet3Ne: editUnityTenet3Ne,
          unityTenet3SubEn: editUnityTenet3SubEn,
          unityTenet3SubNe: editUnityTenet3SubNe,
          unityStatsJson: JSON.stringify(editUnityStats),
          unityNextEventTitleEn: editUnityNextEventTitleEn,
          unityNextEventTitleNe: editUnityNextEventTitleNe,
          unityNextEventDateEn: editUnityNextEventDateEn,
          unityNextEventDateNe: editUnityNextEventDateNe,
          unityNextEventLocEn: editUnityNextEventLocEn,
          unityNextEventLocNe: editUnityNextEventLocNe,
        };
      } else if (activeEditSection === 'ribbon') {
        updates = {
          topRibbonEn: editTopRibbonEn,
          topRibbonNe: editTopRibbonNe,
          regNoEn: editRegNoEn,
          regNoNe: editRegNoNe,
          helplinePhone: editHelplinePhone,
          helplineEmail: editHelplineEmail,
        };
      } else if (activeEditSection === 'branding') {
        updates = {
          logoTextEn: editLogoTextEn,
          logoTextNe: editLogoTextNe,
          logoSubEn: editLogoSubEn,
          logoSubNe: editLogoSubNe,
          logoUrl: editLogoUrl,
          logoFontSizeMobile: editLogoFontSizeMobile,
          logoFontSizeDesktop: editLogoFontSizeDesktop,
          logoSubFontSizeMobile: editLogoSubFontSizeMobile,
          menuFontSizeDesktop: editMenuFontSizeDesktop,
          menuFontSizeMobile: editMenuFontSizeMobile,
          taglineEn: editTaglineEn,
          taglineNe: editTaglineNe,
          footerAboutEn: editFooterAboutEn,
          footerAboutNe: editFooterAboutNe,
          footerAddressEn: editFooterAddressEn,
          footerAddressNe: editFooterAddressNe,
          footerPhone: editFooterPhone,
          footerEmail: editFooterEmail,
          socialFb: editSocialFb,
          socialTw: editSocialTw,
          socialIg: editSocialIg,
        };
      } else if (activeEditSection === 'pillars') {
        updates = {
          pillarsTitleEn: editPillarsTitleEn,
          pillarsTitleNe: editPillarsTitleNe,
          pillar1TitleEn: editPillar1TitleEn,
          pillar1TitleNe: editPillar1TitleNe,
          pillar1SubEn: editPillar1SubEn,
          pillar1SubNe: editPillar1SubNe,
          pillar2TitleEn: editPillar2TitleEn,
          pillar2TitleNe: editPillar2TitleNe,
          pillar2SubEn: editPillar2SubEn,
          pillar2SubNe: editPillar2SubNe,
          pillar3TitleEn: editPillar3TitleEn,
          pillar3TitleNe: editPillar3TitleNe,
          pillar3SubEn: editPillar3SubEn,
          pillar3SubNe: editPillar3SubNe,
          pillar4TitleEn: editPillar4TitleEn,
          pillar4TitleNe: editPillar4TitleNe,
          pillar4SubEn: editPillar4SubEn,
          pillar4SubNe: editPillar4SubNe,
        };
      }

      await onUpdateSiteTexts(updates);
      setActiveEditSection(null);
      onTrackAction('Save Section Site Texts via Admin');
    } catch (err) {
      alert('Failed to save section texts.');
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
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {}
    return galleryItems;
  };

  const getActiveImpactStats = (): any[] => {
    try {
      if (siteTexts.impactStatsJson) {
        const parsed = JSON.parse(siteTexts.impactStatsJson);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {}
    return impactStats;
  };

  const getActiveLeadership = (): any[] => {
    try {
      if (siteTexts.leadershipIdsJson) {
        const parsed = JSON.parse(siteTexts.leadershipIdsJson);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => {
            const latestMember = membersList?.find(m => m.id === item.id) || boardMembers.find(m => m.id === item.id);
            if (latestMember) {
              return {
                ...item,
                ...latestMember,
              };
            }
            return item;
          });
        }
      }
    } catch (e) {}
    return boardMembers.filter(m => m.id === '1' || m.id === 'vc1').map(bm => {
      const latestMember = membersList?.find(m => m.id === bm.id);
      return latestMember ? { ...bm, ...latestMember } : bm;
    });
  };

  const getActiveEservices = (): any[] => {
    try {
      if (siteTexts.eservicesJson) {
        const parsed = JSON.parse(siteTexts.eservicesJson);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return defaultEservices;
  };

  const getActiveUnityStats = (): any[] => {
    try {
      if (siteTexts.unityStatsJson) {
        const parsed = JSON.parse(siteTexts.unityStatsJson);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return defaultUnityStats;
  };

  const activeEservicesList = activeEditSection === 'eservices' ? editEservicesList : getActiveEservices();
  const activeUnityStatsList = activeEditSection === 'unity' ? editUnityStats : getActiveUnityStats();

  const getChiefPresident = (): Member => {
    if (membersList && membersList.length > 0) {
      const chief = membersList.find(m => 
        m.category === 'chief' || 
        m.id === '1' || 
        (m.role?.en && (
          m.role.en.toLowerCase().includes('chief president') ||
          m.role.en.toLowerCase().includes('chairperson') ||
          m.role.en.toLowerCase().includes('president')
        ))
      );
      if (chief) return chief;
    }
    return boardMembers.find(m => m.category === 'chief' || m.id === '1') || boardMembers[0];
  };

  const chiefPresident = getChiefPresident();

  const getActiveSecondaryImages = (): any[] => {
    try {
      if (siteTexts.secondaryImagesJson) {
        const parsed = JSON.parse(siteTexts.secondaryImagesJson);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {}
    return galleryItems;
  };

  const activeHeroImages = activeEditSection === 'hero' ? editHeroImages : getActiveHeroImages();
  const activeSecondaryImages = activeEditSection === 'recent_updates' ? editSecondaryImages : getActiveSecondaryImages();
  const activeImpactStats = activeEditSection === 'impact' ? editImpactStats : getActiveImpactStats();
  const activeLeadership = activeEditSection === 'executive_committee' ? editLeadership : getActiveLeadership();

  // Keep edit state in sync with siteTexts only when modal opens
  useEffect(() => {
    if (!activeEditSection) return;

    if (activeEditSection === 'hero') {
      try {
        if (siteTexts.heroImagesJson) {
          const parsed = JSON.parse(siteTexts.heroImagesJson);
          if (Array.isArray(parsed)) setEditHeroImages(parsed);
        } else {
          setEditHeroImages([...galleryItems]);
        }
      } catch(e) { setEditHeroImages([...galleryItems]); }
      setEditSliderBadgeEn(siteTexts.sliderBadgeEn || '');
      setEditSliderBadgeNe(siteTexts.sliderBadgeNe || '');
      setEditHeroTitleEn(siteTexts.heroTitleEn || '');
      setEditHeroTitleNe(siteTexts.heroTitleNe || '');
      setEditHeroSubEn(siteTexts.heroSubEn || '');
      setEditHeroSubNe(siteTexts.heroSubNe || '');
    } else if (activeEditSection === 'recent_updates') {
      try {
        if (siteTexts.secondaryImagesJson) {
          const parsed = JSON.parse(siteTexts.secondaryImagesJson);
          if (Array.isArray(parsed)) setEditSecondaryImages(parsed);
        } else {
          setEditSecondaryImages([...galleryItems]);
        }
      } catch(e) { setEditSecondaryImages([...galleryItems]); }
    } else if (activeEditSection === 'leadership') {
      setEditPresidentTitleEn(siteTexts.presidentMessageTitleEn || '');
      setEditPresidentTitleNe(siteTexts.presidentMessageTitleNe || '');
      setEditPresidentMsgEn(siteTexts.presidentMessageEn || '');
      setEditPresidentMsgNe(siteTexts.presidentMessageNe || '');
    } else if (activeEditSection === 'executive_committee') {
      try {
        if (siteTexts.leadershipIdsJson) {
          const parsed = JSON.parse(siteTexts.leadershipIdsJson);
          if (Array.isArray(parsed)) setEditLeadership(parsed);
        } else {
          const initialLeadership = boardMembers.filter(m => m.id === '1' || m.id === 'vc1').map(bm => {
            const latestMember = membersList?.find(m => m.id === bm.id);
            return latestMember ? { ...bm, ...latestMember } : bm;
          });
          setEditLeadership(initialLeadership);
        }
      } catch(e) { 
        const initialLeadership = boardMembers.filter(m => m.id === '1' || m.id === 'vc1').map(bm => {
          const latestMember = membersList?.find(m => m.id === bm.id);
          return latestMember ? { ...bm, ...latestMember } : bm;
        });
        setEditLeadership(initialLeadership);
      }
    } else if (activeEditSection === 'heritage') {
      setEditIntroEn(siteTexts.introEn || '');
      setEditIntroNe(siteTexts.introNe || '');
      setEditPaanStoryTitleEn(siteTexts.paanStoryTitleEn || '');
      setEditPaanStoryTitleNe(siteTexts.paanStoryTitleNe || '');
      setEditPaanStoryEn(siteTexts.paanStoryEn || '');
      setEditPaanStoryNe(siteTexts.paanStoryNe || '');
    } else if (activeEditSection === 'mission') {
      setEditMissionTitleEn(siteTexts.missionTitleEn || '');
      setEditMissionTitleNe(siteTexts.missionTitleNe || '');
      setEditMissionEn(siteTexts.missionEn || '');
      setEditMissionNe(siteTexts.missionNe || '');
    } else if (activeEditSection === 'impact') {
      setEditImpactHeaderEn(siteTexts.impactHeaderEn || '');
      setEditImpactHeaderNe(siteTexts.impactHeaderNe || '');
      try {
        if (siteTexts.impactStatsJson) {
          const parsed = JSON.parse(siteTexts.impactStatsJson);
          if (Array.isArray(parsed)) setEditImpactStats(parsed);
        } else {
          setEditImpactStats([...impactStats]);
        }
      } catch(e) { setEditImpactStats([...impactStats]); }
    } else if (activeEditSection === 'eservices') {
      setEditEservicesTitleEn(siteTexts.eservicesTitleEn || '');
      setEditEservicesTitleNe(siteTexts.eservicesTitleNe || '');
      setEditEservicesSubEn(siteTexts.eservicesSubEn || '');
      setEditEservicesSubNe(siteTexts.eservicesSubNe || '');
      try {
        if (siteTexts.eservicesJson) {
          const parsed = JSON.parse(siteTexts.eservicesJson);
          if (Array.isArray(parsed)) setEditEservicesList(parsed);
        } else {
          setEditEservicesList([...defaultEservices]);
        }
      } catch(e) { setEditEservicesList([...defaultEservices]); }
    } else if (activeEditSection === 'unity') {
      setEditUnityTitleEn(siteTexts.unityTitleEn || '');
      setEditUnityTitleNe(siteTexts.unityTitleNe || '');
      setEditUnityVisionEn(siteTexts.unityVisionEn || '');
      setEditUnityVisionNe(siteTexts.unityVisionNe || '');
      setEditUnityTenet1En(siteTexts.unityTenet1En || '');
      setEditUnityTenet1Ne(siteTexts.unityTenet1Ne || '');
      setEditUnityTenet1SubEn(siteTexts.unityTenet1SubEn || '');
      setEditUnityTenet1SubNe(siteTexts.unityTenet1SubNe || '');
      setEditUnityTenet2En(siteTexts.unityTenet2En || '');
      setEditUnityTenet2Ne(siteTexts.unityTenet2Ne || '');
      setEditUnityTenet2SubEn(siteTexts.unityTenet2SubEn || '');
      setEditUnityTenet2SubNe(siteTexts.unityTenet2SubNe || '');
      setEditUnityTenet3En(siteTexts.unityTenet3En || '');
      setEditUnityTenet3Ne(siteTexts.unityTenet3Ne || '');
      setEditUnityTenet3SubEn(siteTexts.unityTenet3SubEn || '');
      setEditUnityTenet3SubNe(siteTexts.unityTenet3SubNe || '');
      try {
        if (siteTexts.unityStatsJson) {
          const parsed = JSON.parse(siteTexts.unityStatsJson);
          if (Array.isArray(parsed)) setEditUnityStats(parsed);
        } else {
          setEditUnityStats([...defaultUnityStats]);
        }
      } catch(e) { setEditUnityStats([...defaultUnityStats]); }
      setEditUnityNextEventTitleEn(siteTexts.unityNextEventTitleEn || '');
      setEditUnityNextEventTitleNe(siteTexts.unityNextEventTitleNe || '');
      setEditUnityNextEventDateEn(siteTexts.unityNextEventDateEn || '');
      setEditUnityNextEventDateNe(siteTexts.unityNextEventDateNe || '');
      setEditUnityNextEventLocEn(siteTexts.unityNextEventLocEn || '');
      setEditUnityNextEventLocNe(siteTexts.unityNextEventLocNe || '');
    } else if (activeEditSection === 'ribbon') {
      setEditTopRibbonEn(siteTexts.topRibbonEn || '');
      setEditTopRibbonNe(siteTexts.topRibbonNe || '');
      setEditRegNoEn(siteTexts.regNoEn || '');
      setEditRegNoNe(siteTexts.regNoNe || '');
      setEditHelplinePhone(siteTexts.helplinePhone || '');
    } else if (activeEditSection === 'pillars') {
      setEditPillar1TitleEn(siteTexts.pillar1TitleEn || '');
      setEditPillar1TitleNe(siteTexts.pillar1TitleNe || '');
      setEditPillar1SubEn(siteTexts.pillar1SubEn || '');
      setEditPillar1SubNe(siteTexts.pillar1SubNe || '');
      setEditPillar2TitleEn(siteTexts.pillar2TitleEn || '');
      setEditPillar2TitleNe(siteTexts.pillar2TitleNe || '');
      setEditPillar2SubEn(siteTexts.pillar2SubEn || '');
      setEditPillar2SubNe(siteTexts.pillar2SubNe || '');
      setEditPillar3TitleEn(siteTexts.pillar3TitleEn || '');
      setEditPillar3TitleNe(siteTexts.pillar3TitleNe || '');
      setEditPillar3SubEn(siteTexts.pillar3SubEn || '');
      setEditPillar3SubNe(siteTexts.pillar3SubNe || '');
      setEditPillar4TitleEn(siteTexts.pillar4TitleEn || '');
      setEditPillar4TitleNe(siteTexts.pillar4TitleNe || '');
      setEditPillar4SubEn(siteTexts.pillar4SubEn || '');
      setEditPillar4SubNe(siteTexts.pillar4SubNe || '');
    }
  }, [activeEditSection]);

  // Hero background slider timer (6s)
  useEffect(() => {
    if (!activeHeroImages.length) {
      setHeroImageIdx(0);
      return;
    }
    if (heroImageIdx >= activeHeroImages.length) {
      setHeroImageIdx(0);
    }
    const timer = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % activeHeroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeHeroImages.length, heroImageIdx]);

  // Ensure secondary image index is valid if list changes
  useEffect(() => {
    if (secondaryImageIdx >= activeSecondaryImages.length && activeSecondaryImages.length > 0) {
      setSecondaryImageIdx(activeSecondaryImages.length - 1);
    } else if (activeSecondaryImages.length === 0) {
      setSecondaryImageIdx(0);
    }
  }, [activeSecondaryImages.length, secondaryImageIdx]);

  // Secondary gallery slider controls & timer (4.5s)
  const nextSecondaryImage = () => {
    if (!activeSecondaryImages.length) return;
    setSecondaryImageIdx((prev) => (prev + 1) % activeSecondaryImages.length);
  };

  const prevSecondaryImage = () => {
    if (!activeSecondaryImages.length) return;
    setSecondaryImageIdx((prev) => (prev - 1 + activeSecondaryImages.length) % activeSecondaryImages.length);
  };

  useEffect(() => {
    if (!activeSecondaryImages.length) return;
    const timer = setInterval(() => {
      nextSecondaryImage();
    }, 4500);
    return () => clearInterval(timer);
  }, [activeSecondaryImages.length, siteTexts.secondaryImagesJson]);

  const t = {
    ctaButton: { en: 'Join Our Community', ne: 'हाम्रो समुदायमा सामेल हुनुहोस्' },
    bloggerBannerButton: { en: 'Blogger XML Layout', ne: 'ब्लगर XML लेआउट' },
    photoGallery: { en: 'Recent Updates', ne: 'हालैका अपडेटहरू' },
    impactHeader: { en: 'Empowering & Transforming Lives', ne: 'सशक्तिकरण र जीवन परिवर्तन' },
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const base64 = await compressImageToBase64(file, 800, 0.85);
      const transparentDataUrl = await removeImageWhiteBackground(base64, 225);
      try {
        const uploadedUrl = await uploadImageToGithub(`CSN_logo_${Date.now()}_${file.name}`, transparentDataUrl, `Upload site logo ${file.name}`);
        setEditLogoUrl(uploadedUrl);
      } catch (ghErr) {
        setEditLogoUrl(transparentDataUrl);
      }
    } catch (err) {
      console.error('Failed to process logo image:', err);
      alert('Failed to process logo image.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleMakeLogoTransparent = async () => {
    if (!editLogoUrl) return;
    setIsUploadingLogo(true);
    try {
      const transparentDataUrl = await removeImageWhiteBackground(editLogoUrl, 225);
      try {
        const uploadedUrl = await uploadImageToGithub(`CSN_logo_${Date.now()}.png`, transparentDataUrl, 'Update logo transparency');
        setEditLogoUrl(uploadedUrl);
      } catch (ghErr) {
        setEditLogoUrl(transparentDataUrl);
      }
    } catch (err) {
      console.error('Failed to make logo transparent:', err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  /* Individual section edit modals */
  const renderSectionEditModal = () => {
    if (!activeEditSection) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-teal-500/40 shadow-2xl w-full max-w-4xl my-8 max-h-[85vh] flex flex-col overflow-hidden text-teal-950 dark:text-teal-50">
          {/* Modal Header */}
          <div className="p-4 sm:p-5 bg-teal-900 text-white flex items-center justify-between border-b border-teal-700 shrink-0">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-400 animate-pulse" />
              <h3 className="font-black text-sm sm:text-base uppercase tracking-wider text-amber-300">
                {activeEditSection === 'hero' && '1. Edit Hero Banner'}
                {activeEditSection === 'recent_updates' && '11. Edit Recent Updates Image Slider'}
                {activeEditSection === 'leadership' && "2. Edit Chief President's Message"}
                {activeEditSection === 'executive_committee' && '3. Manage Executive Committee & Leadership'}
                {activeEditSection === 'eservices' && '4. Edit Institutional E-Services'}
                {activeEditSection === 'heritage' && '5. Edit Heritage & Paan Story'}
                {activeEditSection === 'mission' && '6. Edit Vision & Mission'}
                {activeEditSection === 'unity' && '7. Edit Unity, Consolidation & Cooperation'}
                {activeEditSection === 'branding' && '8. Edit Branding, Logo & Typography Details'}
                {activeEditSection === 'ribbon' && '9. Edit Top Ribbon Announcement & Reg. No.'}
                {activeEditSection === 'pillars' && '10. Edit Community Pillars'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveEditSection(null)}
              className="p-1.5 bg-teal-800 hover:bg-teal-700 text-teal-200 hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
            {/* HERO BANNER EDIT FIELDS */}
            {activeEditSection === 'hero' && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Hero Banner Headings</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Badge Tag (English)</label>
                      <input
                        type="text"
                        value={editSliderBadgeEn}
                        onChange={(e) => setEditSliderBadgeEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Badge Tag (Nepali)</label>
                      <input
                        type="text"
                        value={editSliderBadgeNe}
                        onChange={(e) => setEditSliderBadgeNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Hero Title (English)</label>
                      <input
                        type="text"
                        value={editHeroTitleEn}
                        onChange={(e) => setEditHeroTitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Hero Title (Nepali)</label>
                      <input
                        type="text"
                        value={editHeroTitleNe}
                        onChange={(e) => setEditHeroTitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Hero Subtitle (English)</label>
                      <textarea
                        rows={2}
                        value={editHeroSubEn}
                        onChange={(e) => setEditHeroSubEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Hero Subtitle (Nepali)</label>
                      <textarea
                        rows={2}
                        value={editHeroSubNe}
                        onChange={(e) => setEditHeroSubNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Hero Banner Slides</h4>
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingSlide ? 'Uploading...' : 'Upload & Add Slide'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingSlide}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                setUploadingSlide(true);
                                const url = await handleFileUpload(file);
                                const updatedHero = [{ 
                                  id: `hero-${Date.now()}`, 
                                  imageUrl: url, 
                                  caption: { en: file.name.split('.')[0], ne: 'नयाँ स्लाइड तस्विर' } 
                                }, ...editHeroImages];
                                setEditHeroImages(updatedHero);
                                setHeroImageIdx(0);
                                alert('New slide image uploaded and added successfully!');
                              } catch (err) {
                                alert('Failed to upload slide image.');
                              } finally {
                                setUploadingSlide(false);
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedHero = [{ id: `hero-${Date.now()}`, imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80', caption: { en: 'New Slide Image', ne: 'नयाँ स्लाइड तस्विर' } }, ...editHeroImages];
                            setEditHeroImages(updatedHero);
                            setHeroImageIdx(0);
                          }}
                          className="px-3 py-1.5 bg-teal-800 hover:bg-teal-700 text-teal-100 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Placeholder</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-[10.5px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">
                      * For perfect display across all devices without awkward zooming, use images with a 16:9 aspect ratio (e.g., 1920x1080) and keep the main subject centered.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {editHeroImages.map((img, idx) => (
                      <div key={img.id || idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-700 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <img src={img.imageUrl} alt="" className="w-16 h-12 object-cover rounded-lg shrink-0 border" />
                          <div className="flex-1 space-y-1 min-w-0">
                            <input
                              type="text"
                              placeholder="Image URL"
                              value={img.imageUrl}
                              onChange={(e) => {
                                const updated = [...editHeroImages];
                                updated[idx].imageUrl = e.target.value;
                                setEditHeroImages(updated);
                              }}
                              className="w-full p-1.5 border rounded text-xs"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedHero = editHeroImages.filter((_, i) => i !== idx);
                              setEditHeroImages(updatedHero);
                            }}
                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Slide file upload option */}
                        <div className="flex items-center gap-2 sm:pl-[76px]">
                          <label className="px-2.5 py-1 bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 text-teal-800 dark:text-teal-200 text-[10px] font-bold rounded border border-teal-200 dark:border-slate-700 cursor-pointer flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            <span>{uploadingSlide ? 'Uploading...' : 'Replace Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingSlide}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  setUploadingSlide(true);
                                  const url = await handleFileUpload(file);
                                  const updated = [...editHeroImages];
                                  updated[idx].imageUrl = url;
                                  setEditHeroImages(updated);
                                  alert('Hero image replaced successfully!');
                                } catch (err) {
                                  alert('Failed to upload hero image.');
                                } finally {
                                  setUploadingSlide(false);
                                }
                              }}
                            />
                          </label>
                          <span className="text-[9px] text-slate-500">Upload a photo to replace this URL</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RECENT UPDATES IMAGE SLIDER EDIT FIELDS */}
            {activeEditSection === 'recent_updates' && (
              <div className="space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>Notice:</strong> This manages the second visual slider under "Recent Updates" / "हालैका अपडेटहरू" on the homepage. You can add new slides, delete old ones, change text titles & description, and upload photos.</span>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-teal-600" />
                    <span>Create New Update Slide</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={newSecondaryTitleEn}
                        onChange={(e) => setNewSecondaryTitleEn(e.target.value)}
                        placeholder="e.g., Annual Chaurasiya Convention"
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Title (Nepali)</label>
                      <input
                        type="text"
                        value={newSecondaryTitleNe}
                        onChange={(e) => setNewSecondaryTitleNe(e.target.value)}
                        placeholder="उदा. वार्षिक चौरसिया महाधिवेशन"
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Description (English)</label>
                      <textarea
                        rows={2}
                        value={newSecondaryDescEn}
                        onChange={(e) => setNewSecondaryDescEn(e.target.value)}
                        placeholder="Enter short description"
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Description (Nepali)</label>
                      <textarea
                        rows={2}
                        value={newSecondaryDescNe}
                        onChange={(e) => setNewSecondaryDescNe(e.target.value)}
                        placeholder="छोटो विवरण नेपालीमा"
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Photo Selection</label>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          value={newSecondaryImage}
                          onChange={(e) => setNewSecondaryImage(e.target.value)}
                          placeholder="Image URL or upload file to generate URL"
                          className="flex-1 p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-mono"
                        />
                        <label className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>{uploadingSecondarySlide ? 'Uploading...' : 'Upload Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingSecondarySlide}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                setUploadingSecondarySlide(true);
                                const url = await handleFileUpload(file);
                                setNewSecondaryImage(url);
                                alert('Slide photo uploaded successfully!');
                              } catch (err) {
                                alert('Failed to upload slide photo.');
                              } finally {
                                setUploadingSecondarySlide(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={uploadingSecondarySlide || !newSecondaryImage}
                      onClick={() => {
                        if (!newSecondaryImage) return;
                        const newSlide = {
                          id: `sec-${Date.now()}`,
                          imageUrl: newSecondaryImage,
                          title: { en: newSecondaryTitleEn || 'Update', ne: newSecondaryTitleNe || 'अपडेट' },
                          description: { en: newSecondaryDescEn || '', ne: newSecondaryDescNe || '' }
                        };
                        const updatedList = [newSlide, ...editSecondaryImages];
                        setEditSecondaryImages(updatedList);
                        setSecondaryImageIdx(0);
                        // Reset form
                        setNewSecondaryImage('');
                        setNewSecondaryTitleEn('');
                        setNewSecondaryTitleNe('');
                        setNewSecondaryDescEn('');
                        setNewSecondaryDescNe('');
                      }}
                      className="px-5 py-2 bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Slider</span>
                    </button>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Current Update Slides</h4>
                  <div className="space-y-4">
                    {editSecondaryImages.map((img, idx) => (
                      <div key={img.id || idx} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-700 space-y-3">
                        <div className="flex flex-wrap sm:flex-nowrap items-start gap-4">
                          <img src={img.imageUrl} alt="" className="w-24 h-16 object-cover rounded-lg shrink-0 border" />
                          <div className="flex-1 space-y-2 min-w-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] font-bold uppercase text-slate-400">Title (EN)</label>
                                <input
                                  type="text"
                                  placeholder="Title (EN)"
                                  value={img.title?.en || ''}
                                  onChange={(e) => {
                                    const updated = [...editSecondaryImages];
                                    updated[idx].title = { ...updated[idx].title, en: e.target.value };
                                    setEditSecondaryImages(updated);
                                  }}
                                  className="w-full p-1.5 border rounded text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold uppercase text-slate-400">Title (NE)</label>
                                <input
                                  type="text"
                                  placeholder="Title (NE)"
                                  value={img.title?.ne || ''}
                                  onChange={(e) => {
                                    const updated = [...editSecondaryImages];
                                    updated[idx].title = { ...updated[idx].title, ne: e.target.value };
                                    setEditSecondaryImages(updated);
                                  }}
                                  className="w-full p-1.5 border rounded text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold uppercase text-slate-400">Description (EN)</label>
                                <input
                                  type="text"
                                  placeholder="Description (EN)"
                                  value={img.description?.en || ''}
                                  onChange={(e) => {
                                    const updated = [...editSecondaryImages];
                                    updated[idx].description = { ...updated[idx].description, en: e.target.value };
                                    setEditSecondaryImages(updated);
                                  }}
                                  className="w-full p-1.5 border rounded text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold uppercase text-slate-400">Description (NE)</label>
                                <input
                                  type="text"
                                  placeholder="Description (NE)"
                                  value={img.description?.ne || ''}
                                  onChange={(e) => {
                                    const updated = [...editSecondaryImages];
                                    updated[idx].description = { ...updated[idx].description, ne: e.target.value };
                                    setEditSecondaryImages(updated);
                                  }}
                                  className="w-full p-1.5 border rounded text-xs"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold uppercase text-slate-400">Image URL</label>
                              <input
                                type="text"
                                placeholder="Image URL"
                                value={img.imageUrl}
                                onChange={(e) => {
                                  const updated = [...editSecondaryImages];
                                  updated[idx].imageUrl = e.target.value;
                                  setEditSecondaryImages(updated);
                                }}
                                className="w-full p-1.5 border rounded text-xs font-mono"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editSecondaryImages.filter((_, i) => i !== idx);
                              setEditSecondaryImages(updated);
                            }}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs self-start"
                            title="Delete Slide"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* File upload to replace image */}
                        <div className="flex items-center gap-2 sm:pl-[112px]">
                          <label className="px-3 py-1.5 bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 text-teal-800 dark:text-teal-200 text-xs font-semibold rounded-lg border border-teal-200 dark:border-slate-700 cursor-pointer flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingSecondarySlide ? 'Uploading...' : 'Replace Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingSecondarySlide}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  setUploadingSecondarySlide(true);
                                  const url = await handleFileUpload(file);
                                  const updated = [...editSecondaryImages];
                                  updated[idx].imageUrl = url;
                                  setEditSecondaryImages(updated);
                                  alert('Slide photo replaced successfully!');
                                } catch (err) {
                                  alert('Failed to upload replace image.');
                                } finally {
                                  setUploadingSecondarySlide(false);
                                }
                              }}
                            />
                          </label>
                          <span className="text-[10px] text-slate-500">Upload a photo to replace this URL</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LEADERSHIP SECTION EDIT FIELDS */}
            {activeEditSection === 'leadership' && (
              <div className="space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>Note:</strong> Chief President photo, name, designation, and phone details are automatically synced from the Chief President profile in the Member Directory.</span>
                </div>
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">President Message Headings & Text</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={editPresidentTitleEn}
                        onChange={(e) => setEditPresidentTitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Title (Nepali)</label>
                      <input
                        type="text"
                        value={editPresidentTitleNe}
                        onChange={(e) => setEditPresidentTitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Message Body (English)</label>
                      <textarea
                        rows={4}
                        value={editPresidentMsgEn}
                        onChange={(e) => setEditPresidentMsgEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Message Body (Nepali)</label>
                      <textarea
                        rows={4}
                        value={editPresidentMsgNe}
                        onChange={(e) => setEditPresidentMsgNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DEDICATED EXECUTIVE COMMITTEE MODAL */}
            {activeEditSection === 'executive_committee' && (
              <div className="space-y-6">
                <div className="bg-amber-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-amber-300 dark:border-amber-700/60 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                    <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Select & Import Executive Leader from Member Directory</span>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    Choose an existing registered member from the Member Directory list to automatically fetch their photo and details into the Executive Committee.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <select
                      value={selectedDirectoryMemberId}
                      onChange={(e) => setSelectedDirectoryMemberId(e.target.value)}
                      className="flex-1 p-2.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="">-- Select Registered Member ({membersList?.length || 0} available) --</option>
                      {(membersList || []).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name?.en || m.name?.ne || 'Unknown'} ({m.role?.en || 'Member'}) - {m.address?.en || 'Nepal'} [ID: {m.id}]
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedDirectoryMemberId) {
                          alert('Please select a member from the directory dropdown first.');
                          return;
                        }
                        const member = (membersList || []).find((m) => m.id === selectedDirectoryMemberId);
                        if (!member) return;
                        const newLeader = {
                          id: member.id,
                          name: { en: member.name?.en || '', ne: member.name?.ne || member.name?.en || '' },
                          role: { en: member.role?.en || 'Executive Member', ne: member.role?.ne || 'कार्यकारी सदस्य' },
                          avatarUrl: member.avatarUrl || member.photoBase64 || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
                          phone: member.phone || '',
                          email: member.email || '',
                          address: member.address?.en || '',
                        };
                        setEditLeadership([...editLeadership, newLeader]);
                        setSelectedDirectoryMemberId('');
                        alert(`Successfully added ${member.name?.en || member.name?.ne || 'Member'} to Executive Committee list!`);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Member</span>
                    </button>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Active Executive Committee ({editLeadership.length})</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {editLeadership.map((ldr, idx) => (
                      <div key={ldr.id || idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {ldr.avatarUrl && (
                              <img src={ldr.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-emerald-400" />
                            )}
                            <span className="text-xs font-bold text-teal-900 dark:text-teal-200">{ldr.name?.en || ldr.name?.ne || `Leader #${idx + 1}`}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditLeadership(editLeadership.filter((_, i) => i !== idx))}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded cursor-pointer"
                            title="Remove Leader"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input type="text" placeholder="Title/Role (EN)" value={ldr.role?.en || ''} onChange={(e) => { const u = [...editLeadership]; u[idx].role = { ...u[idx].role, en: e.target.value }; setEditLeadership(u); }} className="w-full p-1.5 border rounded text-xs" />
                          <input type="text" placeholder="Title/Role (NE)" value={ldr.role?.ne || ''} onChange={(e) => { const u = [...editLeadership]; u[idx].role = { ...u[idx].role, ne: e.target.value }; setEditLeadership(u); }} className="w-full p-1.5 border rounded text-xs" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* E-SERVICES SECTION EDIT FIELDS */}
            {activeEditSection === 'eservices' && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">E-Services Headings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={editEservicesTitleEn}
                        onChange={(e) => setEditEservicesTitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Title (Nepali)</label>
                      <input
                        type="text"
                        value={editEservicesTitleNe}
                        onChange={(e) => setEditEservicesTitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Subtitle (English)</label>
                      <textarea
                        rows={2}
                        value={editEservicesSubEn}
                        onChange={(e) => setEditEservicesSubEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Subtitle (Nepali)</label>
                      <textarea
                        rows={2}
                        value={editEservicesSubNe}
                        onChange={(e) => setEditEservicesSubNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* MANUAL BOX: HOW TO LINK A PAGE */}
                <div className="bg-sky-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-sky-300 dark:border-sky-700/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sky-900 dark:text-sky-300 font-extrabold text-xs uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>💡 Manual & Complete List of All Website Tabs / Pages</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const allTabsServices = [
                          { id: 'srv-dir', title: { en: 'Member Directory & KYC', ne: 'सदस्य निर्देशिका र खोजी' }, desc: { en: 'Search, verify, and view digital ID cards of all CSN members.', ne: 'नेपालभरका चौरसिया सदस्यहरूको खोजी र डिजिटल कार्ड।' }, actionUrl: 'directory', icon: 'UserCheck' },
                          { id: 'srv-mat', title: { en: 'Matrimonial Hub', ne: 'वैवाहिक समन्वय केन्द्र' }, desc: { en: 'Find verified marriage profiles within Chaurasiya community.', ne: 'स्वजातीय विवाह जोडी खोज र बायोडाटा व्यवस्थापन।' }, actionUrl: 'matrimonial', icon: 'Heart' },
                          { id: 'srv-bld', title: { en: 'Emergency Blood Donors', ne: 'आकस्मिक रक्तदान सेवा' }, desc: { en: 'Connect instantly with volunteer donors and blood banks.', ne: 'आपतकालीन समयमा तत्काल रगत उपलब्ध गराउने सेवा।' }, actionUrl: 'blood', icon: 'Droplet' },
                          { id: 'srv-mem', title: { en: 'Membership & Youth Grants', ne: 'सदस्यता तथा छात्रवृत्ति' }, desc: { en: 'Apply for central membership and student excellence grants.', ne: 'केन्द्रीय सदस्यता दर्ता र मेधावी छात्रवृत्ति आवेदन।' }, actionUrl: 'membership', icon: 'Award' },
                          { id: 'srv-vol', title: { en: 'Volunteer Registration', ne: 'स्वयंसेवक फारम' }, desc: { en: 'Join youth volunteer wing for community social welfare.', ne: 'सामाजिक कार्य र युवा स्वयंसेवक समूहमा आबद्धता।' }, actionUrl: 'volunteer', icon: 'Users' },
                          { id: 'srv-don', title: { en: 'Guest House Donation', ne: 'अतिथि गृह दान कोष' }, desc: { en: 'Contribute to Central Guest House & Bhawan building fund.', ne: 'केन्द्रीय चौरसिया भवन निर्माण र दान सहयोग।' }, actionUrl: 'donate', icon: 'Building' },
                          { id: 'srv-her', title: { en: 'Paan Culture & Farming Heritage', ne: 'पान संस्कृति र बरैजा खेती' }, desc: { en: 'Learn about ancient Chaurasiya betel cultivation & lore.', ne: 'चौरसिया समाजको पौराणिक इतिहास र पान खेती।' }, actionUrl: 'our-heritage', icon: 'BookOpen' },
                          { id: 'srv-doc', title: { en: 'Official Bylaws & SWC Registry', ne: 'विधान तथा प्रमाणपत्र' }, desc: { en: 'Download constitution, annual reports, and government registration.', ne: 'समाज कल्याण परिषद दर्ता, विधान र प्रतिवेदन।' }, actionUrl: 'documents', icon: 'FileText' },
                          { id: 'srv-his', title: { en: 'Central Notice & Press Portal', ne: 'सूचना तथा प्रेस विज्ञप्ति' }, desc: { en: 'Read official central press releases, notices & decisions.', ne: 'केन्द्रीय समिति निर्णय, विज्ञप्ति र आधिकारिक समाचार।' }, actionUrl: 'history', icon: 'Newspaper' },
                          { id: 'srv-evt', title: { en: 'Events Calendar & Conventions', ne: 'कार्यक्रम क्यालेन्डर' }, desc: { en: 'Schedule for national conventions, rallies & Kul Puja.', ne: 'राष्ट्रिय महाधिवेशन, कुलपुजा र सभाको तालिका।' }, actionUrl: 'events', icon: 'Calendar' },
                          { id: 'srv-fam', title: { en: 'Family Trees & Lineage', ne: 'वंशवृक्ष र परिवार नाता' }, desc: { en: 'Connect family trees, gotras, and ancestral roots.', ne: 'वंशवृक्ष खोजी, गोत्र र पारिवारिक नाता जोड्ने।' }, actionUrl: 'family-connectivity', icon: 'Network' },
                          { id: 'srv-ren', title: { en: 'Renowned Personalities', ne: 'विशिष्ट व्यक्तित्व सम्मान' }, desc: { en: 'Honoring prominent leaders, doctors & scholars of CSN.', ne: 'चौरसिया समाजका विशिष्ट विद्वान तथा प्रतिभा सम्मान।' }, actionUrl: 'renowned-people', icon: 'Sparkles' },
                          { id: 'srv-gal', title: { en: 'Photo & Video Archives', ne: 'तस्विर तथा भिडियो ग्यालरी' }, desc: { en: 'Browse historical photos and event media archives.', ne: 'केन्द्रीय र जिल्ला तहका कार्यक्रमका तस्विरहरू।' }, actionUrl: 'albums-gallery', icon: 'Image' },
                          { id: 'srv-trn', title: { en: 'Financial Transparency Audit', ne: 'वित्तीय पारदर्शिता र लेखा' }, desc: { en: 'View audited financial balance sheets and fund allocation.', ne: 'लेखा परीक्षण गरिएको आय-व्यय र वित्तीय पारदर्शिता।' }, actionUrl: 'transparency', icon: 'CheckCircle' },
                          { id: 'srv-cnt', title: { en: 'Central Helpdesk & Contacts', ne: 'सचिवालय सम्पर्क' }, desc: { en: 'Get in touch with central secretariat & district offices.', ne: 'केन्द्रीय सचिवालय ठेगाना र टेलिफोन सम्पर्क।' }, actionUrl: 'contacts', icon: 'PhoneCall' },
                        ];
                        setEditEservicesList(allTabsServices);
                        alert('Auto-populated services list with all 15 website tabs!');
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Populate Services for All Website Tabs</span>
                    </button>
                  </div>
                  <p className="text-xs text-sky-800 dark:text-sky-200 leading-relaxed">
                    Click any tab badge below or enter its exact <strong>Tab ID</strong> in the target page field of any service card:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 pt-1 text-[11px]">
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">directory</code>: Member Directory</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">matrimonial</code>: Matrimonial Hub</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">blood</code>: Emergency Blood</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">membership</code>: Join & Grants</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">volunteer</code>: Youth Volunteers</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">donate</code>: Guest House Fund</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">our-heritage</code>: Cultural Paan</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">documents</code>: Official Bylaws</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">history</code>: News & Notices</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">events</code>: Events Calendar</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">family-connectivity</code>: Family Trees</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">renowned-people</code>: Achievers</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">albums-gallery</code>: Media Gallery</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">transparency</code>: Financial Audit</div>
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"><code className="font-bold text-teal-700 dark:text-teal-300">contacts</code>: Central Helpdesk</div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Services List ({editEservicesList.length})</h4>
                    <button
                      type="button"
                      onClick={() => setEditEservicesList([...editEservicesList, { id: `srv-${Date.now()}`, title: { en: 'New Service', ne: 'नयाँ सेवा' }, desc: { en: 'Service description', ne: 'सेवा विवरण' }, actionUrl: 'directory', icon: 'FileText' }])}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {editEservicesList.map((srv, idx) => (
                      <div key={srv.id || idx} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-700 space-y-2.5 shadow-sm">
                        <div className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-slate-800">
                          <span className="text-[11px] font-extrabold text-teal-800 dark:text-teal-300 uppercase tracking-wide">
                            Service #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete service #${idx + 1}?`)) {
                                setEditEservicesList(editEservicesList.filter((_, i) => i !== idx));
                              }
                            }}
                            className="px-2 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-950/60 text-red-600 dark:text-red-300 rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Delete this Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Title (EN / NE)</label>
                          <div className="grid grid-cols-2 gap-1.5 mt-0.5">
                            <input type="text" placeholder="Title (EN)" value={srv.title?.en || srv.titleEn || ''} onChange={(e) => { const u = [...editEservicesList]; u[idx].title = { ...u[idx].title, en: e.target.value }; setEditEservicesList(u); }} className="w-full p-1.5 border rounded text-xs" />
                            <input type="text" placeholder="Title (NE)" value={srv.title?.ne || srv.titleNe || ''} onChange={(e) => { const u = [...editEservicesList]; u[idx].title = { ...u[idx].title, ne: e.target.value }; setEditEservicesList(u); }} className="w-full p-1.5 border rounded text-xs" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Description (EN / NE)</label>
                          <div className="grid grid-cols-2 gap-1.5 mt-0.5">
                            <input type="text" placeholder="Desc (EN)" value={srv.desc?.en || srv.subEn || ''} onChange={(e) => { const u = [...editEservicesList]; u[idx].desc = { ...u[idx].desc, en: e.target.value }; setEditEservicesList(u); }} className="w-full p-1.5 border rounded text-xs" />
                            <input type="text" placeholder="Desc (NE)" value={srv.desc?.ne || srv.subNe || ''} onChange={(e) => { const u = [...editEservicesList]; u[idx].desc = { ...u[idx].desc, ne: e.target.value }; setEditEservicesList(u); }} className="w-full p-1.5 border rounded text-xs" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400">Target Tab ID (e.g. directory, blood, matrimonial, membership)</label>
                          <input type="text" placeholder="Target Tab ID" value={srv.actionUrl || srv.targetPage || ''} onChange={(e) => { const u = [...editEservicesList]; u[idx].actionUrl = e.target.value; setEditEservicesList(u); }} className="w-full p-1.5 border rounded text-xs font-mono bg-teal-50/50 dark:bg-slate-800" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* HERITAGE & PAAN SECTION EDIT FIELDS */}
            {activeEditSection === 'heritage' && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Homepage Introduction Paragraphs</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Intro Text (English)</label>
                      <textarea
                        rows={5}
                        value={editIntroEn}
                        onChange={(e) => setEditIntroEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Intro Text (Nepali)</label>
                      <textarea
                        rows={5}
                        value={editIntroNe}
                        onChange={(e) => setEditIntroNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Cultural Paan Story</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Paan Story Title (English)</label>
                      <input
                        type="text"
                        value={editPaanStoryTitleEn}
                        onChange={(e) => setEditPaanStoryTitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Paan Story Title (Nepali)</label>
                      <input
                        type="text"
                        value={editPaanStoryTitleNe}
                        onChange={(e) => setEditPaanStoryTitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Paan Story Body (English)</label>
                      <textarea
                        rows={5}
                        value={editPaanStoryEn}
                        onChange={(e) => setEditPaanStoryEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Paan Story Body (Nepali)</label>
                      <textarea
                        rows={5}
                        value={editPaanStoryNe}
                        onChange={(e) => setEditPaanStoryNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MISSION SECTION EDIT FIELDS */}
            {activeEditSection === 'mission' && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Vision & Mission Content</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Mission Title (English)</label>
                      <input
                        type="text"
                        value={editMissionTitleEn}
                        onChange={(e) => setEditMissionTitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Mission Title (Nepali)</label>
                      <input
                        type="text"
                        value={editMissionTitleNe}
                        onChange={(e) => setEditMissionTitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Mission Statement (English)</label>
                      <textarea
                        rows={4}
                        value={editMissionEn}
                        onChange={(e) => setEditMissionEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Mission Statement (Nepali)</label>
                      <textarea
                        rows={4}
                        value={editMissionNe}
                        onChange={(e) => setEditMissionNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IMPACT STATS EDIT FIELDS */}
            {activeEditSection === 'impact' && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Impact Section Header</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Header Title (English)</label>
                      <input
                        type="text"
                        value={editImpactHeaderEn}
                        onChange={(e) => setEditImpactHeaderEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Header Title (Nepali)</label>
                      <input
                        type="text"
                        value={editImpactHeaderNe}
                        onChange={(e) => setEditImpactHeaderNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Impact Counters</h4>
                    <button
                      type="button"
                      onClick={() => setEditImpactStats([...editImpactStats, { id: `stat-${Date.now()}`, value: '1,000+', label: { en: 'New Metric', ne: 'नयाँ सूचक' }, sub: { en: 'Across Nepal', ne: 'नेपालभर' } }])}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Stat</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {editImpactStats.map((st, idx) => (
                      <div key={st.id || idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300">Metric #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setEditImpactStats(editImpactStats.filter((_, i) => i !== idx))}
                            className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input type="text" placeholder="Value Number (e.g. 50,000+)" value={st.value || ''} onChange={(e) => { const u = [...editImpactStats]; u[idx].value = e.target.value; setEditImpactStats(u); }} className="w-full p-1.5 border rounded text-xs font-bold" />
                        <input type="text" placeholder="Label (EN)" value={st.label?.en || ''} onChange={(e) => { const u = [...editImpactStats]; u[idx].label = { ...u[idx].label, en: e.target.value }; setEditImpactStats(u); }} className="w-full p-1.5 border rounded text-xs" />
                        <input type="text" placeholder="Label (NE)" value={st.label?.ne || ''} onChange={(e) => { const u = [...editImpactStats]; u[idx].label = { ...u[idx].label, ne: e.target.value }; setEditImpactStats(u); }} className="w-full p-1.5 border rounded text-xs" />
                        <input type="text" placeholder="Subtext (EN)" value={st.sub?.en || ''} onChange={(e) => { const u = [...editImpactStats]; u[idx].sub = { ...u[idx].sub, en: e.target.value }; setEditImpactStats(u); }} className="w-full p-1.5 border rounded text-xs" />
                        <input type="text" placeholder="Subtext (NE)" value={st.sub?.ne || ''} onChange={(e) => { const u = [...editImpactStats]; u[idx].sub = { ...u[idx].sub, ne: e.target.value }; setEditImpactStats(u); }} className="w-full p-1.5 border rounded text-xs" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* UNITY, CONSOLIDATION & COOPERATION EDIT FIELDS */}
            {activeEditSection === 'unity' && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Unity Section Headings & Motto</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Section Title (English)</label>
                      <input
                        type="text"
                        value={editUnityTitleEn}
                        onChange={(e) => setEditUnityTitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Section Title (Nepali)</label>
                      <input
                        type="text"
                        value={editUnityTitleNe}
                        onChange={(e) => setEditUnityTitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Central Vision/Motto Statement (English)</label>
                      <textarea
                        rows={2}
                        value={editUnityVisionEn}
                        onChange={(e) => setEditUnityVisionEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Central Vision/Motto Statement (Nepali)</label>
                      <textarea
                        rows={2}
                        value={editUnityVisionNe}
                        onChange={(e) => setEditUnityVisionNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">3 Core Tenets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-700 space-y-2">
                      <p className="font-bold text-xs text-teal-800 dark:text-teal-300">Tenet 1: Unity</p>
                      <input type="text" placeholder="Title (EN)" value={editUnityTenet1En} onChange={(e) => setEditUnityTenet1En(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                      <input type="text" placeholder="Title (NE)" value={editUnityTenet1Ne} onChange={(e) => setEditUnityTenet1Ne(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                      <input type="text" placeholder="Subtitle (EN)" value={editUnityTenet1SubEn} onChange={(e) => setEditUnityTenet1SubEn(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                      <input type="text" placeholder="Subtitle (NE)" value={editUnityTenet1SubNe} onChange={(e) => setEditUnityTenet1SubNe(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-700 space-y-2">
                      <p className="font-bold text-xs text-teal-800 dark:text-teal-300">Tenet 2: Consolidation</p>
                      <input type="text" placeholder="Title (EN)" value={editUnityTenet2En} onChange={(e) => setEditUnityTenet2En(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                      <input type="text" placeholder="Title (NE)" value={editUnityTenet2Ne} onChange={(e) => setEditUnityTenet2Ne(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                      <input type="text" placeholder="Subtitle (EN)" value={editUnityTenet2SubEn} onChange={(e) => setEditUnityTenet2SubEn(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                      <input type="text" placeholder="Subtitle (NE)" value={editUnityTenet2SubNe} onChange={(e) => setEditUnityTenet2SubNe(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-700 space-y-2">
                      <p className="font-bold text-xs text-teal-800 dark:text-teal-300">Tenet 3: Cooperation</p>
                      <input type="text" placeholder="Title (EN)" value={editUnityTenet3En} onChange={(e) => setEditUnityTenet3En(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                      <input type="text" placeholder="Title (NE)" value={editUnityTenet3Ne} onChange={(e) => setEditUnityTenet3Ne(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                      <input type="text" placeholder="Subtitle (EN)" value={editUnityTenet3SubEn} onChange={(e) => setEditUnityTenet3SubEn(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                      <input type="text" placeholder="Subtitle (NE)" value={editUnityTenet3SubNe} onChange={(e) => setEditUnityTenet3SubNe(e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Unity & Organization Key Statistics ({editUnityStats.length})</h4>
                    <button
                      type="button"
                      onClick={() => setEditUnityStats([...editUnityStats, { id: `ustat-${Date.now()}`, value: '100+', label: { en: 'New Stat', ne: 'नयाँ तथ्याङ्क' }, sub: { en: 'Across Nepal', ne: 'नेपालभर' } }])}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Stat Metric</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {editUnityStats.map((st, idx) => (
                      <div key={st.id || idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300">Stat #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setEditUnityStats(editUnityStats.filter((_, i) => i !== idx))}
                            className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                            title="Delete Stat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input type="text" placeholder="Value Number (e.g. 77 Districts, 100k+)" value={st.value || ''} onChange={(e) => { const u = [...editUnityStats]; u[idx].value = e.target.value; setEditUnityStats(u); }} className="w-full p-1.5 border rounded text-xs font-bold" />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input type="text" placeholder="Label (EN)" value={st.label?.en || ''} onChange={(e) => { const u = [...editUnityStats]; u[idx].label = { ...u[idx].label, en: e.target.value }; setEditUnityStats(u); }} className="w-full p-1.5 border rounded text-xs" />
                          <input type="text" placeholder="Label (NE)" value={st.label?.ne || ''} onChange={(e) => { const u = [...editUnityStats]; u[idx].label = { ...u[idx].label, ne: e.target.value }; setEditUnityStats(u); }} className="w-full p-1.5 border rounded text-xs" />
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input type="text" placeholder="Subtext (EN)" value={st.sub?.en || ''} onChange={(e) => { const u = [...editUnityStats]; u[idx].sub = { ...u[idx].sub, en: e.target.value }; setEditUnityStats(u); }} className="w-full p-1.5 border rounded text-xs" />
                          <input type="text" placeholder="Subtext (NE)" value={st.sub?.ne || ''} onChange={(e) => { const u = [...editUnityStats]; u[idx].sub = { ...u[idx].sub, ne: e.target.value }; setEditUnityStats(u); }} className="w-full p-1.5 border rounded text-xs" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Next Major Community Event Banner</h4>
                    <button
                      type="button"
                      onClick={() => {
                        if (upcomingEvents && upcomingEvents.length > 0) {
                          const nextEvt = upcomingEvents[0];
                          setEditUnityNextEventTitleEn(nextEvt.title.en);
                          setEditUnityNextEventTitleNe(nextEvt.title.ne);
                          setEditUnityNextEventDateEn(`${nextEvt.date} | ${nextEvt.location.en}`);
                          setEditUnityNextEventDateNe(`${nextEvt.date} | ${nextEvt.location.ne}`);
                          alert(`Auto-fetched next event: "${nextEvt.title.en}" from Community Calendar!`);
                        } else {
                          alert('No upcoming events found in calendar.');
                        }
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Auto-Fetch Next Event from Calendar Page</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Event Title (English)</label>
                      <input
                        type="text"
                        value={editUnityNextEventTitleEn}
                        onChange={(e) => setEditUnityNextEventTitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Event Title (Nepali)</label>
                      <input
                        type="text"
                        value={editUnityNextEventTitleNe}
                        onChange={(e) => setEditUnityNextEventTitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Date (English)</label>
                      <input
                        type="text"
                        value={editUnityNextEventDateEn}
                        onChange={(e) => setEditUnityNextEventDateEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Date (Nepali)</label>
                      <input
                        type="text"
                        value={editUnityNextEventDateNe}
                        onChange={(e) => setEditUnityNextEventDateNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TOP RIBBON & REGISTRATION NO. EDIT FIELDS */}
            {activeEditSection === 'ribbon' && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Top Header Ribbon Marquee Ticker</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Top Ribbon Ticker Announcement (English)</label>
                      <input
                        type="text"
                        value={editTopRibbonEn}
                        onChange={(e) => setEditTopRibbonEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Top Ribbon Ticker Announcement (Nepali)</label>
                      <input
                        type="text"
                        value={editTopRibbonNe}
                        onChange={(e) => setEditTopRibbonNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Official Registration Number (SWC)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Registration No. (English)</label>
                      <input
                        type="text"
                        value={editRegNoEn}
                        onChange={(e) => setEditRegNoEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Registration No. (Nepali)</label>
                      <input
                        type="text"
                        value={editRegNoNe}
                        onChange={(e) => setEditRegNoNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BRANDING & FOOTER EDIT FIELDS */}
            {activeEditSection === 'branding' && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Logo & Branding Identity</h4>
                  
                  {/* Logo Image Upload & Transparent Tool */}
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-teal-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                        Logo Emblem Image & Background Processing
                      </span>
                      {isUploadingLogo && (
                        <span className="text-xs font-bold text-amber-600 animate-pulse flex items-center gap-1">
                          <Wand2 className="w-3.5 h-3.5 animate-spin" />
                          Processing Logo...
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-20 h-20 shrink-0 rounded-2xl border-2 border-teal-300 dark:border-slate-700 flex items-center justify-center p-2 bg-slate-50 dark:bg-slate-950 shadow-inner overflow-hidden">
                        {editLogoUrl ? (
                          <img src={editLogoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400">No Logo</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-2.5 w-full">
                        <input
                          type="text"
                          value={editLogoUrl}
                          onChange={(e) => setEditLogoUrl(e.target.value)}
                          placeholder="https://... or upload file below"
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                        />

                        <div className="flex flex-wrap items-center gap-2">
                          <label className="px-3 py-1.5 bg-teal-800 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Logo Image</span>
                            <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
                          </label>

                          <button
                            type="button"
                            onClick={handleMakeLogoTransparent}
                            disabled={!editLogoUrl || isUploadingLogo}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50 transition-all"
                            title="Removes white background and creates transparent PNG logo"
                          >
                            <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                            <span>Make Background Transparent</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Logo Main Name (English)</label>
                      <input
                        type="text"
                        value={editLogoTextEn}
                        onChange={(e) => setEditLogoTextEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Logo Main Name (Nepali)</label>
                      <input
                        type="text"
                        value={editLogoTextNe}
                        onChange={(e) => setEditLogoTextNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Logo Subtitle (English)</label>
                      <input
                        type="text"
                        value={editLogoSubEn}
                        onChange={(e) => setEditLogoSubEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Logo Subtitle (Nepali)</label>
                      <input
                        type="text"
                        value={editLogoSubNe}
                        onChange={(e) => setEditLogoSubNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Website Tagline (Footer & Header)</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Tagline (English)</label>
                      <input
                        type="text"
                        value={editTaglineEn}
                        onChange={(e) => setEditTaglineEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Tagline (Nepali)</label>
                      <input
                        type="text"
                        value={editTaglineNe}
                        onChange={(e) => setEditTaglineNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider">Footer About & Contact Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Footer About Paragraph (English)</label>
                      <textarea
                        rows={2}
                        value={editFooterAboutEn}
                        onChange={(e) => setEditFooterAboutEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Footer About Paragraph (Nepali)</label>
                      <textarea
                        rows={2}
                        value={editFooterAboutNe}
                        onChange={(e) => setEditFooterAboutNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={editFooterPhone}
                        onChange={(e) => setEditFooterPhone(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Contact Email</label>
                      <input
                        type="text"
                        value={editFooterEmail}
                        onChange={(e) => setEditFooterEmail(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Address (English)</label>
                      <input
                        type="text"
                        value={editFooterAddressEn}
                        onChange={(e) => setEditFooterAddressEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Address (Nepali)</label>
                      <input
                        type="text"
                        value={editFooterAddressNe}
                        onChange={(e) => setEditFooterAddressNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeEditSection === 'pillars' && (
              <div className="space-y-6">
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Pillars Section Title</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillars Title (English)</label>
                      <input
                        type="text"
                        value={editPillarsTitleEn}
                        onChange={(e) => setEditPillarsTitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillars Title (Nepali)</label>
                      <input
                        type="text"
                        value={editPillarsTitleNe}
                        onChange={(e) => setEditPillarsTitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Pillar 1 */}
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 text-[10px] font-black">1</span>
                    <span>Pillar 1 Details</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 1 Title (English)</label>
                      <input
                        type="text"
                        value={editPillar1TitleEn}
                        onChange={(e) => setEditPillar1TitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 1 Title (Nepali)</label>
                      <input
                        type="text"
                        value={editPillar1TitleNe}
                        onChange={(e) => setEditPillar1TitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 1 Subtext / Category (English)</label>
                      <input
                        type="text"
                        value={editPillar1SubEn}
                        onChange={(e) => setEditPillar1SubEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 1 Subtext / Category (Nepali)</label>
                      <input
                        type="text"
                        value={editPillar1SubNe}
                        onChange={(e) => setEditPillar1SubNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 text-[10px] font-black">2</span>
                    <span>Pillar 2 Details</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 2 Title (English)</label>
                      <input
                        type="text"
                        value={editPillar2TitleEn}
                        onChange={(e) => setEditPillar2TitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 2 Title (Nepali)</label>
                      <input
                        type="text"
                        value={editPillar2TitleNe}
                        onChange={(e) => setEditPillar2TitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 2 Subtext / Category (English)</label>
                      <input
                        type="text"
                        value={editPillar2SubEn}
                        onChange={(e) => setEditPillar2SubEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 2 Subtext / Category (Nepali)</label>
                      <input
                        type="text"
                        value={editPillar2SubNe}
                        onChange={(e) => setEditPillar2SubNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 text-[10px] font-black">3</span>
                    <span>Pillar 3 Details</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 3 Title (English)</label>
                      <input
                        type="text"
                        value={editPillar3TitleEn}
                        onChange={(e) => setEditPillar3TitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 3 Title (Nepali)</label>
                      <input
                        type="text"
                        value={editPillar3TitleNe}
                        onChange={(e) => setEditPillar3TitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 3 Subtext / Category (English)</label>
                      <input
                        type="text"
                        value={editPillar3SubEn}
                        onChange={(e) => setEditPillar3SubEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 3 Subtext / Category (Nepali)</label>
                      <input
                        type="text"
                        value={editPillar3SubNe}
                        onChange={(e) => setEditPillar3SubNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="bg-teal-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-700 space-y-4">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-200 uppercase text-xs tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 text-[10px] font-black">4</span>
                    <span>Pillar 4 Details</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 4 Title (English)</label>
                      <input
                        type="text"
                        value={editPillar4TitleEn}
                        onChange={(e) => setEditPillar4TitleEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 4 Title (Nepali)</label>
                      <input
                        type="text"
                        value={editPillar4TitleNe}
                        onChange={(e) => setEditPillar4TitleNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 4 Subtext / Category (English)</label>
                      <input
                        type="text"
                        value={editPillar4SubEn}
                        onChange={(e) => setEditPillar4SubEn(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-teal-900 dark:text-teal-200 block mb-1">Pillar 4 Subtext / Category (Nepali)</label>
                      <input
                        type="text"
                        value={editPillar4SubNe}
                        onChange={(e) => setEditPillar4SubNe(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-teal-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-teal-50 dark:bg-slate-800/80 border-t border-teal-200 dark:border-slate-700 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveEditSection(null)}
              className="px-5 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveCurrentSection}
              disabled={isSavingTexts}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex flex-col items-center gap-0.5 cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{isSavingTexts ? 'Saving...' : 'Save Section Changes'}</span>
              </div>
              <span className="text-[9px] opacity-70 font-medium normal-case">Mandatory to persist changes</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEservicesPortal = () => (
    <div className="bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl shadow-md border-y sm:border border-teal-100 dark:border-slate-800 transition-all relative -mx-4 sm:mx-0">
      {/* Sticky Header Bar */}
      <div className="xl:sticky xl:top-[48px] z-20 bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white px-4 py-3 sm:rounded-t-2xl flex items-center justify-between shadow-sm border-b border-teal-800/60">
        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-teal-100">
          <Globe className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span>{lang === 'en' ? (siteTexts.eservicesTitleEn || 'Institutional E-Services') : (siteTexts.eservicesTitleNe || 'डिजिटल नागरिक सेवा पोर्टल')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            {lang === 'en' ? 'Live Portal' : '२४/७ खुला'}
          </span>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveEditSection('eservices')}
              className="p-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold rounded border border-amber-400/40 transition-colors cursor-pointer"
              title="Edit E-Services Section"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="p-3.5 space-y-2.5">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
          {lang === 'en' ? (siteTexts.eservicesSubEn || 'Direct Citizen Portals & Verification') : (siteTexts.eservicesSubNe || 'प्रत्यक्ष संस्थागत तथा नागरिक सेवाहरू')}
        </p>

        <div className="space-y-1.5">
          {activeEservicesList.map((srv, sIdx) => {
            return (
              <button
                key={srv.id || sIdx}
                onClick={() => {
                  onNavigate(srv.targetPage || 'directory');
                  onTrackAction(`Click E-Services ${srv.titleEn}`);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-all group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {renderServiceIcon(srv.icon)}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-[11px] font-extrabold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors truncate">
                      {lang === 'en' ? srv.titleEn : srv.titleNe}
                    </h5>
                    <p className="text-[9.5px] font-medium text-slate-500 dark:text-slate-400 truncate">
                      {lang === 'en' ? srv.subEn : srv.subNe}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCommunityPillars = () => (
    <div className="bg-[#03443e] dark:bg-slate-900 rounded-none sm:rounded-2xl shadow-md border-y sm:border border-teal-800/40 dark:border-slate-800 transition-all relative -mx-4 sm:mx-0">
      {/* Header Bar */}
      <div className="xl:sticky xl:top-[48px] z-20 bg-gradient-to-r from-[#02332f] to-[#03443e] dark:from-slate-950 dark:to-slate-900 text-white px-4 py-3 sm:rounded-t-2xl flex items-center justify-between shadow-sm border-b border-teal-850/40">
        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-teal-100">
          <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{lang === 'en' ? (siteTexts.pillarsTitleEn || 'Community Pillars') : (siteTexts.pillarsTitleNe || 'समुदायका आधारहरू')}</span>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setActiveEditSection('pillars')}
            className="px-2 py-1 bg-teal-800/60 hover:bg-teal-700/80 text-white hover:text-emerald-300 text-[11px] font-bold rounded-lg border border-teal-700/40 transition-colors cursor-pointer flex items-center gap-1"
            title="Edit Pillars"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Edit' : 'सम्पादन'}</span>
          </button>
        )}
      </div>

      <div className="p-3.5 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          {/* Pillar 1 */}
          <button
            type="button"
            onClick={() => {
              onNavigate('our-heritage');
              onTrackAction('Click Pillar Paan Heritage');
            }}
            className="p-3 rounded-2xl bg-[#02332f]/80 hover:bg-[#022b27] border border-teal-800/40 hover:border-emerald-500/40 text-left flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group cursor-pointer shadow-sm w-full min-h-[105px]"
          >
            <Leaf className="w-5 h-5 text-emerald-400 transition-transform group-hover:scale-110 shrink-0" />
            <div className="mt-2.5">
              <h5 className="text-[12px] font-black text-white leading-tight">
                {lang === 'en' ? (siteTexts.pillar1TitleEn || 'Paan Heritage') : (siteTexts.pillar1TitleNe || 'पान सम्पदा')}
              </h5>
              <span className="text-[10px] font-medium text-teal-300 group-hover:text-emerald-300 transition-colors block mt-0.5">
                {lang === 'en' ? (siteTexts.pillar1SubEn || 'Culture & Farming') : (siteTexts.pillar1SubNe || 'संस्कृति र खेती')}
              </span>
            </div>
          </button>

          {/* Pillar 2 */}
          <button
            type="button"
            onClick={() => {
              onNavigate('about-vision');
              onTrackAction('Click Pillar Youth & Career');
            }}
            className="p-3 rounded-2xl bg-[#02332f]/80 hover:bg-[#022b27] border border-teal-800/40 hover:border-emerald-500/40 text-left flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group cursor-pointer shadow-sm w-full min-h-[105px]"
          >
            <GraduationCap className="w-5 h-5 text-amber-400 transition-transform group-hover:scale-110 shrink-0" />
            <div className="mt-2.5">
              <h5 className="text-[12px] font-black text-white leading-tight">
                {lang === 'en' ? (siteTexts.pillar2TitleEn || 'Youth & Career') : (siteTexts.pillar2TitleNe || 'युवा तथा शिक्षा')}
              </h5>
              <span className="text-[10px] font-medium text-teal-300 group-hover:text-emerald-300 transition-colors block mt-0.5">
                {lang === 'en' ? (siteTexts.pillar2SubEn || 'Grants & Support') : (siteTexts.pillar2SubNe || 'छात्रवृत्ति र मार्गदर्शन')}
              </span>
            </div>
          </button>

          {/* Pillar 3 */}
          <button
            type="button"
            onClick={() => {
              onNavigate('directory');
              onTrackAction('Click Pillar District Branches');
            }}
            className="p-3 rounded-2xl bg-[#02332f]/80 hover:bg-[#022b27] border border-teal-800/40 hover:border-emerald-500/40 text-left flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group cursor-pointer shadow-sm w-full min-h-[105px]"
          >
            <Building2 className="w-5 h-5 text-cyan-400 transition-transform group-hover:scale-110 shrink-0" />
            <div className="mt-2.5">
              <h5 className="text-[12px] font-black text-white leading-tight">
                {lang === 'en' ? (siteTexts.pillar3TitleEn || 'District Branches') : (siteTexts.pillar3TitleNe || 'जिल्ला शाखाहरू')}
              </h5>
              <span className="text-[10px] font-medium text-teal-300 group-hover:text-emerald-300 transition-colors block mt-0.5">
                {lang === 'en' ? (siteTexts.pillar3SubEn || '77 Districts') : (siteTexts.pillar3SubNe || '७७ वटै जिल्ला')}
              </span>
            </div>
          </button>

          {/* Pillar 4 */}
          <button
            type="button"
            onClick={() => {
              onNavigate('transparency');
              onTrackAction('Click Pillar Transparency');
            }}
            className="p-3 rounded-2xl bg-[#02332f]/80 hover:bg-[#022b27] border border-teal-800/40 hover:border-emerald-500/40 text-left flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group cursor-pointer shadow-sm w-full min-h-[105px]"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400 transition-transform group-hover:scale-110 shrink-0" />
            <div className="mt-2.5">
              <h5 className="text-[12px] font-black text-white leading-tight">
                {lang === 'en' ? (siteTexts.pillar4TitleEn || 'Transparency') : (siteTexts.pillar4TitleNe || 'सुशासन र कोष')}
              </h5>
              <span className="text-[10px] font-medium text-teal-300 group-hover:text-emerald-300 transition-colors block mt-0.5">
                {lang === 'en' ? (siteTexts.pillar4SubEn || 'Audited Reports') : (siteTexts.pillar4SubNe || 'पारदर्शी विवरण')}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderUnityWidget = () => (
    <div className="bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl shadow-md border-y sm:border border-teal-100 dark:border-slate-800 transition-all relative -mx-4 sm:mx-0">
      {/* Sticky/Static Header Bar */}
      <div className="xl:sticky xl:top-[48px] z-20 bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white px-4 py-3 sm:rounded-t-2xl flex items-center justify-between shadow-sm border-b border-teal-800/60">
        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-teal-100">
          <Users className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{lang === 'en' ? (siteTexts.unityTitleEn || 'Unity, Consolidation & Cooperation') : (siteTexts.unityTitleNe || 'एकता, एक्यबद्धता र सहकार्य')}</span>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setActiveEditSection('unity')}
            className="p-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold rounded border border-amber-400/40 transition-colors cursor-pointer"
            title="Edit Unity Section"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Vision / Motto Statement */}
        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium italic border-l-2 border-emerald-500 pl-2.5 leading-relaxed">
          "{lang === 'en' ? (siteTexts.unityVisionEn || 'Dedicated to Unity, Consolidation and Cooperation.') : (siteTexts.unityVisionNe || 'एकता, एक्यबद्धता र सहकार्यमा समर्पित।')}"
        </p>

        {/* Statistics Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {lang === 'en' ? 'Community Statistics' : 'समुदाय तथ्याङ्कहरू'}
            </p>
            {isAdmin && (
              <button
                type="button"
                onClick={handleAddInlineUnityStat}
                className="px-1.5 py-0.5 bg-teal-600 text-white hover:bg-teal-700 rounded text-[9px] font-extrabold flex items-center gap-0.5 cursor-pointer shadow-sm transition-all"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>{lang === 'en' ? 'Add' : 'थप्नुहोस्'}</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {activeUnityStatsList.map((st, idx) => {
              const statVal = st.value || st.val || '';
              const statLabel = lang === 'en' 
                ? (st.label?.en || st.labelEn || '') 
                : (st.label?.ne || st.labelNe || '');
              const statSub = lang === 'en'
                ? (st.sub?.en || st.subEn || '')
                : (st.sub?.ne || st.subNe || '');
              const iconName = st.icon || 'Users';
              
              if (editingUnityStatId === st.id) {
                return (
                  <div 
                    key={st.id || idx} 
                    className="bg-teal-50/40 dark:bg-slate-800 p-2.5 rounded-xl border border-teal-200 dark:border-slate-700 col-span-2 space-y-2 text-xs shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[10px] text-teal-800 dark:text-teal-300 uppercase tracking-wide">Edit Stat Metric</span>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">Metric Value</label>
                      <input 
                        type="text" 
                        value={inlineStatValue} 
                        onChange={(e) => setInlineStatValue(e.target.value)} 
                        className="w-full p-1 border rounded text-[11px] font-bold bg-white dark:bg-slate-900 dark:text-white"
                        placeholder="e.g. 12,500+" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">Label (EN)</label>
                        <input 
                          type="text" 
                          value={inlineStatLabelEn} 
                          onChange={(e) => setInlineStatLabelEn(e.target.value)} 
                          className="w-full p-1 border rounded text-[11px] bg-white dark:bg-slate-900 dark:text-white"
                          placeholder="Label En" 
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">Label (NE)</label>
                        <input 
                          type="text" 
                          value={inlineStatLabelNe} 
                          onChange={(e) => setInlineStatLabelNe(e.target.value)} 
                          className="w-full p-1 border rounded text-[11px] bg-white dark:bg-slate-900 dark:text-white"
                          placeholder="Label Ne" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">Subtext (EN)</label>
                        <input 
                          type="text" 
                          value={inlineStatSubEn} 
                          onChange={(e) => setInlineStatSubEn(e.target.value)} 
                          className="w-full p-1 border rounded text-[11px] bg-white dark:bg-slate-900 dark:text-white"
                          placeholder="Subtext En" 
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">Subtext (NE)</label>
                        <input 
                          type="text" 
                          value={inlineStatSubNe} 
                          onChange={(e) => setInlineStatSubNe(e.target.value)} 
                          className="w-full p-1 border rounded text-[11px] bg-white dark:bg-slate-900 dark:text-white"
                          placeholder="Subtext Ne" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">Icon</label>
                      <select 
                        value={inlineStatIcon} 
                        onChange={(e) => setInlineStatIcon(e.target.value)}
                        className="w-full p-1 border rounded text-[11px] bg-white dark:bg-slate-900 dark:text-white"
                      >
                        <option value="Users">Users (Default)</option>
                        <option value="Building2">Building</option>
                        <option value="Droplet">Droplet</option>
                        <option value="Heart">Heart</option>
                        <option value="GraduationCap">Cap</option>
                        <option value="Sparkles">Sparkles</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-teal-100 dark:border-slate-700/60 mt-1">
                      <button 
                        type="button" 
                        onClick={() => setEditingUnityStatId(null)}
                        className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-bold cursor-pointer hover:bg-slate-300 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleSaveInlineUnityStat(st.id)}
                        className="px-2.5 py-1 bg-teal-600 text-white rounded text-[10px] font-bold cursor-pointer hover:bg-teal-700 transition-all"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                );
              }
              
              return (
                <div 
                  key={st.id || idx} 
                  className="bg-slate-50/80 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between transition-all hover:border-teal-200 dark:hover:border-slate-700/60 shadow-sm relative group/stat"
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide truncate max-w-[65px]">
                      {statLabel}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {isAdmin && (
                        <div className="flex items-center gap-0.5 opacity-0 group-hover/stat:opacity-100 transition-opacity bg-slate-100/90 dark:bg-slate-800/90 px-1 py-0.5 rounded shadow-sm">
                          <button
                            type="button"
                            onClick={() => handleStartInlineEdit(st)}
                            className="p-0.5 text-amber-600 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 rounded transition-colors cursor-pointer"
                            title="Edit Stat"
                          >
                            <Edit3 className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUnityStat(st.id || idx)}
                            className="p-0.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                            title="Delete Stat"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                      <div className="w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center shrink-0">
                        {renderStatIcon(iconName)}
                      </div>
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <div className="text-sm sm:text-base font-black text-teal-950 dark:text-teal-50 tracking-tight leading-none">
                      {formatNumber(statVal, lang)}
                    </div>
                    <p className="text-[8.5px] font-semibold text-slate-400 dark:text-slate-500 leading-tight truncate mt-0.5">
                      {statSub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Three Tenets Row */}
        <div className="space-y-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            {lang === 'en' ? 'Core Tenets' : 'मुख्य सिद्धान्तहरू'}
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {/* Tenet 1 */}
            <div className="p-2 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 text-center border border-teal-100/30">
              <div className="text-[10.5px] font-black text-teal-900 dark:text-teal-200 leading-none mb-1">
                {lang === 'en' ? (siteTexts.unityTenet1En || 'Unity') : (siteTexts.unityTenet1Ne || 'एकता')}
              </div>
              <div className="text-[8.5px] font-bold text-teal-600/70 dark:text-teal-400/70 truncate">
                {lang === 'en' ? (siteTexts.unityTenet1SubEn || 'Harmony') : (siteTexts.unityTenet1SubNe || 'सद्भाव')}
              </div>
            </div>

            {/* Tenet 2 */}
            <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-center border border-emerald-100/30">
              <div className="text-[10.5px] font-black text-emerald-900 dark:text-emerald-200 leading-none mb-1">
                {lang === 'en' ? (siteTexts.unityTenet2En || 'Consolidation') : (siteTexts.unityTenet2Ne || 'एक्यबद्धता')}
              </div>
              <div className="text-[8.5px] font-bold text-emerald-600/70 dark:text-emerald-400/70 truncate">
                {lang === 'en' ? (siteTexts.unityTenet2SubEn || 'Heritage') : (siteTexts.unityTenet2SubNe || 'सम्पदा')}
              </div>
            </div>

            {/* Tenet 3 */}
            <div className="p-2 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 text-center border border-cyan-100/30">
              <div className="text-[10.5px] font-black text-cyan-900 dark:text-cyan-200 leading-none mb-1">
                {lang === 'en' ? (siteTexts.unityTenet3En || 'Cooperation') : (siteTexts.unityTenet3Ne || 'सहकार्य')}
              </div>
              <div className="text-[8.5px] font-bold text-cyan-600/70 dark:text-cyan-400/70 truncate">
                {lang === 'en' ? (siteTexts.unityTenet3SubEn || 'Mutual Aid') : (siteTexts.unityTenet3SubNe || 'सहयोग')}
              </div>
            </div>
          </div>
        </div>

        {/* Next Major Community Event Banner */}
        <button
          type="button"
          onClick={() => onNavigate('events')}
          className="w-full text-left mt-2 p-3 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-slate-800/80 dark:to-slate-800 border border-teal-100/80 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-slate-600 hover:shadow-md transition-all cursor-pointer group space-y-2 block text-slate-900 dark:text-white"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider">
              <Calendar className="w-3 h-3" />
              <span>{lang === 'en' ? 'Upcoming Event' : 'आगामी कार्यक्रम'}</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <h6 className="text-[11px] font-black text-slate-900 dark:text-slate-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {lang === 'en' ? (siteTexts.unityNextEventTitleEn || 'Annual Chaurasiya National Convention & Educational Honors') : (siteTexts.unityNextEventTitleNe || 'चौरासिया समाज राष्ट्रिय महाधिवेशन तथा सम्मान समारोह')}
          </h6>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 pt-0.5">
            <span className="inline-flex items-center gap-0.5 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60">
              <Clock className="w-2.5 h-2.5 text-emerald-500" />
              <span>{lang === 'en' ? (siteTexts.unityNextEventDateEn || 'BS 2083') : (siteTexts.unityNextEventDateNe || 'वि.सं. २०८३')}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60">
              <MapPin className="w-2.5 h-2.5 text-emerald-500" />
              <span>{lang === 'en' ? (siteTexts.unityNextEventLocEn || 'Kathmandu / Parsa') : (siteTexts.unityNextEventLocNe || 'काठमाडौँ / पर्सा')}</span>
            </span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderNoticesSection = () => (
    <section className="space-y-6 py-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 -mx-4 sm:mx-0">
        {[...noticesList]
          .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (!isNaN(dateA) && !isNaN(dateB) && dateA !== dateB) {
              return dateB - dateA;
            }
            return b.id.localeCompare(a.id);
          })
          .slice(0, 4)
          .map((notice) => (
          <div key={notice.id} className="bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl shadow-sm border-y sm:border border-teal-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all">
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
                  {formatNumber(notice.date, lang)}
                </div>
                <ChevronRight className={`w-5 h-5 text-teal-400 transition-transform ${expandedNoticeId === notice.id ? 'rotate-90' : ''}`} />
              </div>
              <h4 className="text-xl font-bold text-teal-950 dark:text-teal-50 mb-2">
                {formatNumber(notice.title[lang] || notice.title.en, lang)}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {formatNumber(notice.content[lang] || notice.content.en, lang)}
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
  );

  return (
    <div className="space-y-3 sm:space-y-10">
      {/* Active Homepage Section Edit Modal */}
      {renderSectionEditModal()}
      {/* Admin Homepage CMS Quick Bar */}
      {isAdmin && (
        <div className="bg-teal-900/95 dark:bg-slate-900/95 text-white p-3.5 rounded-2xl border border-teal-700/80 shadow-xl flex flex-wrap items-center justify-between gap-3 -mb-4 z-20">
          <div className="flex items-center gap-2 font-black text-xs uppercase text-amber-300 tracking-wider">
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Edit Homepage Section:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveEditSection('hero')}
              className="px-2.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-teal-100 hover:text-white text-[11px] font-bold rounded-lg transition-all border border-teal-700/60 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>1. Hero Banner</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEditSection('leadership')}
              className="px-2.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-teal-100 hover:text-white text-[11px] font-bold rounded-lg transition-all border border-teal-700/60 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>2. President Message</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEditSection('executive_committee')}
              className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[11px] font-bold rounded-lg transition-all border border-amber-400/40 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>3. Executive Committee</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEditSection('eservices')}
              className="px-2.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-teal-100 hover:text-white text-[11px] font-bold rounded-lg transition-all border border-teal-700/60 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>4. E-Services</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEditSection('heritage')}
              className="px-2.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-teal-100 hover:text-white text-[11px] font-bold rounded-lg transition-all border border-teal-700/60 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>5. Heritage & Paan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEditSection('mission')}
              className="px-2.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-teal-100 hover:text-white text-[11px] font-bold rounded-lg transition-all border border-teal-700/60 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>6. Vision & Mission</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEditSection('unity')}
              className="px-2.5 py-1.5 bg-teal-800 hover:bg-teal-700 text-teal-100 hover:text-white text-[11px] font-bold rounded-lg transition-all border border-teal-700/60 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>7. Unity & Motto</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEditSection('branding')}
              className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[11px] font-bold rounded-lg transition-all border border-amber-400/40 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>8. Branding & Logo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEditSection('ribbon')}
              className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[11px] font-bold rounded-lg transition-all border border-amber-400/40 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>9. Top Ribbon & Reg.</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEditSection('recent_updates')}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-all border border-emerald-500/40 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>11. Recent Updates</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden text-white rounded-none sm:rounded-3xl -mx-4 sm:mx-0 py-8 sm:py-16 px-6 sm:px-12 lg:px-20 shadow-2xl border-b-8 border-emerald-500">
        {/* Background Slider */}
        {activeHeroImages.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === heroImageIdx ? 'opacity-100' : 'opacity-0'}`}
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
          </div>
        </div>
      </section>

      {/* 2-Column Desktop View Layout Below Hero Slider */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-px sm:gap-8 items-start">
        {/* =========================================================================
            COLUMN 1: LEFT COLUMN (25% Width on Desktop: xl:col-span-3)
            - On Mobile (xl:hidden): Reverted to exact original full-width horizontal presentation
            - On Desktop (hidden xl:block): Vertical sidebar card
           ========================================================================= */}
        <aside className="xl:col-span-3 space-y-6 self-start">
          
          {/* MOBILE VIEW PRESENTATION (xl:hidden): Elegant Horizontal & Prominent Photo Format */}
          <section
            onClick={() => {
              onSelectLeader(chiefPresident.id);
              onTrackAction('Click Chief President Message Section');
            }}
            className="xl:hidden bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 rounded-none sm:rounded-2xl -mx-4 sm:mx-0 p-4 sm:p-5 text-white shadow-xl border-y sm:border-x border-teal-800/80 hover:border-emerald-400/90 relative overflow-hidden transition-all duration-300 cursor-pointer group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3.5">
              {/* Header Badge & Admin Edit Button */}
              <div className="flex items-center justify-between border-b border-teal-800/60 pb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {lang === 'en'
                    ? (siteTexts.presidentMessageTitleEn || "Chairperson's Message")
                    : (siteTexts.presidentMessageTitleNe || 'मुख्य अध्यक्षको सन्देश')}
                </span>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveEditSection('leadership');
                      }}
                      className="px-2.5 py-1 bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 text-xs font-bold rounded-lg border border-emerald-400/40 flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{lang === 'en' ? 'Edit' : 'सम्पादन'}</span>
                    </button>
                  )}
                  <ChevronRight className="w-4 h-4 text-teal-300/80 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Prominent Photo & Leader Title Row on Mobile */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                {/* Noticeable, Elegant Large Photo with Ring */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-emerald-400 shadow-xl bg-teal-900 p-0.5 shrink-0 ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-teal-950 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={chiefPresident.avatarUrl || chiefPresident.photoBase64 || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'}
                    alt={chiefPresident.name?.[lang] || chiefPresident.name?.en}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Leader Name, Role & Badges */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-extrabold text-white text-base sm:text-lg group-hover:text-emerald-300 transition-colors leading-tight truncate">
                    {chiefPresident.name?.[lang] || chiefPresident.name?.en}
                  </h4>
                  <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider bg-teal-900/90 px-2.5 py-0.5 rounded border border-teal-700/80 inline-block">
                    {chiefPresident.role?.[lang] || chiefPresident.role?.en || (lang === 'en' ? 'Chief President' : 'मुख्य अध्यक्ष')}
                  </p>
                  
                  {/* Quick contact icons */}
                  <div className="flex items-center gap-2 pt-0.5 text-[10px] text-teal-200">
                    {chiefPresident.phone && (
                      <span className="inline-flex items-center gap-1 bg-teal-900/60 px-2 py-0.5 rounded border border-teal-800/80">
                        <Phone className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{chiefPresident.phone}</span>
                      </span>
                    )}
                    {chiefPresident.address && (
                      <span className="hidden xs:inline-flex items-center gap-1 bg-teal-900/60 px-2 py-0.5 rounded border border-teal-800/80 truncate max-w-[120px]">
                        <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{chiefPresident.address?.[lang] || chiefPresident.address?.en}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Quote Text */}
              <div className="pt-1">
                <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed italic border-l-2 border-emerald-400 pl-3">
                  "{lang === 'en'
                    ? (siteTexts.presidentMessageEn || chiefPresident.vision?.en || chiefPresident.bio?.en || 'Welcome to Chaurasiya Samaj Nepal. Our mission is to integrate, unify, and elevate the Chaurasiya community across Nepal, preserving our sacred betel leaf cultural heritage while empowering every member with equal educational, healthcare, and economic opportunities.')
                    : (siteTexts.presidentMessageNe || chiefPresident.vision?.ne || chiefPresident.bio?.ne || 'चौरसिया समाज नेपालमा हार्दिक स्वागत छ। हाम्रो मुख्य उद्देश्य नेपालभर छरिएर रहेका चौरसिया समुदायलाई एकीकृत गर्दै, परम्परागत पान खेतीको संरक्षण र विकाससँगै प्रत्येक सदस्यलाई शिक्षा, स्वास्थ्य र आर्थिक अवसरहरू प्रदान गर्नु हो।')}"
                </p>
              </div>
            </div>
          </section>

          {/* DESKTOP VIEW PRESENTATION (hidden xl:flex): Vertical Sidebar Column */}
          <section
            onClick={() => {
              onSelectLeader(chiefPresident.id);
              onTrackAction('Click Chief President Message Section');
            }}
            className="hidden xl:flex bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 rounded-2xl text-white shadow-xl border border-teal-800/80 hover:border-emerald-400/90 relative transition-all duration-300 cursor-pointer group flex-col"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none rounded-2xl" />

            {/* Sticky Header Bar for Chairperson's Message */}
            <div className="xl:sticky xl:top-[48px] z-20 bg-teal-950/95 backdrop-blur-md px-5 py-3.5 rounded-t-2xl border-b border-teal-800/80 flex items-center justify-between shadow-md">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black uppercase tracking-wider border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">
                  {lang === 'en'
                    ? (siteTexts.presidentMessageTitleEn || "Chairperson's Message")
                    : (siteTexts.presidentMessageTitleNe || 'मुख्य अध्यक्षको सन्देश')}
                </span>
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveEditSection('leadership');
                    }}
                    className="p-1.5 bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 text-xs font-bold rounded-lg border border-emerald-400/40 flex items-center gap-1 transition-colors"
                    title="Edit Message"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                <ChevronRight className="w-4 h-4 text-teal-300/80 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Card Body Content Scrolling Under Sticky Header */}
            <div className="p-5 space-y-4 relative z-10">
              {/* Photo & Profile Header */}
              <div className="flex flex-col items-center text-center space-y-2.5 pt-1">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-emerald-400 shadow-md bg-teal-900 p-0.5 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={chiefPresident.avatarUrl || chiefPresident.photoBase64 || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'}
                    alt={chiefPresident.name?.[lang] || chiefPresident.name?.en}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-white text-base sm:text-lg group-hover:text-emerald-300 transition-colors">
                    {chiefPresident.name?.[lang] || chiefPresident.name?.en}
                  </h4>
                  <span className="inline-block text-[11px] font-bold text-emerald-300 uppercase tracking-wider bg-teal-900/90 px-2.5 py-0.5 rounded border border-teal-700/80">
                    {chiefPresident.role?.[lang] || chiefPresident.role?.en || (lang === 'en' ? 'Chief President' : 'मुख्य अध्यक्ष')}
                  </span>
                </div>
              </div>

              {/* Message Quote Text */}
              <div className="pt-2 border-t border-teal-800/60">
                <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed italic relative pl-3 border-l-2 border-emerald-400">
                  "{lang === 'en'
                    ? (siteTexts.presidentMessageEn || chiefPresident.vision?.en || chiefPresident.bio?.en || 'Welcome to Chaurasiya Samaj Nepal. Our mission is to integrate, unify, and elevate the Chaurasiya community across Nepal, preserving our sacred betel leaf cultural heritage while empowering every member with equal educational, healthcare, and economic opportunities.')
                    : (siteTexts.presidentMessageNe || chiefPresident.vision?.ne || chiefPresident.bio?.ne || 'चौरसिया समाज नेपालमा हार्दिक स्वागत छ। हाम्रो मुख्य उद्देश्य नेपालभर छरिएर रहेका चौरसिया समुदायलाई एकीकृत गर्दै, परम्परागत पान खेतीको संरक्षण र विकाससँगै प्रत्येक सदस्यलाई शिक्षा, स्वास्थ्य र आर्थिक अवसरहरू प्रदान गर्नु हो।')}"
                </p>
              </div>

              {/* Leader Info & Live Contact Details */}
              <div
                className="pt-3 border-t border-teal-800/60 flex flex-col gap-2 text-xs text-teal-200"
                onClick={(e) => e.stopPropagation()}
              >
                {chiefPresident.address && (
                  <div className="inline-flex items-center gap-1.5 bg-teal-900/80 px-2.5 py-1.5 rounded-lg border border-teal-800/80 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{chiefPresident.address?.[lang] || chiefPresident.address?.en}</span>
                  </div>
                )}
                {chiefPresident.phone && (
                  <a
                    href={`tel:${chiefPresident.phone}`}
                    className="inline-flex items-center gap-1.5 bg-teal-900/80 hover:bg-teal-800 px-2.5 py-1.5 rounded-lg border border-teal-800/80 hover:text-emerald-300 transition-colors text-[11px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{chiefPresident.phone}</span>
                  </a>
                )}
                {chiefPresident.email && (
                  <a
                    href={`mailto:${chiefPresident.email}`}
                    className="inline-flex items-center gap-1.5 bg-teal-900/80 hover:bg-teal-800 px-2.5 py-1.5 rounded-lg border border-teal-800/80 hover:text-emerald-300 transition-colors text-[11px] truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{chiefPresident.email}</span>
                  </a>
                )}
              </div>

              <div className="pt-2 text-center">
                <span className="text-[11px] font-bold text-emerald-400 group-hover:underline inline-flex items-center gap-1">
                  {lang === 'en' ? 'View Leader Profile' : 'अध्यक्षको प्रोफाइल हेर्नुहोस्'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </section>

          {/* DESKTOP VIEW ONLY SIDEBAR WIDGETS */}
          <div className="hidden xl:block space-y-6">
            {renderEservicesPortal()}
            {renderCommunityPillars()}
            {renderUnityWidget()}
          </div>

        </aside>

        {/* =========================================================================
            COLUMN 2: RIGHT COLUMN (75% Width on Desktop: xl:col-span-9)
            All remaining homepage sections
           ========================================================================= */}
        <div className="xl:col-span-9 space-y-4 sm:space-y-10">
          {/* Image Carousel */}
      <section className="bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl -mx-4 sm:mx-0 pt-4 pb-0 sm:pt-6 sm:pb-10 shadow-md border-y sm:border border-teal-100 dark:border-slate-800 transition-colors overflow-hidden">
        <div className="px-4 sm:px-0 mb-4 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-950 dark:text-teal-50 flex flex-wrap items-center justify-between gap-4">
            <span className="flex items-center gap-3">
              <PlayCircle className="w-7 h-7 text-emerald-500" />
              <span>{t.photoGallery[lang]}</span>
            </span>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveEditSection('recent_updates')}
                className="px-3.5 py-1.5 bg-teal-50 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 text-teal-800 dark:text-teal-200 text-xs font-bold rounded-xl border border-teal-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Slider</span>
              </button>
            )}
          </h2>
        </div>
        <div className="relative w-full aspect-[4/3] sm:aspect-[21/9] rounded-none sm:rounded-2xl overflow-hidden bg-gray-100 group shadow-inner">
          {activeSecondaryImages[secondaryImageIdx] && (
            <>
              <img 
                src={activeSecondaryImages[secondaryImageIdx].imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600'}
                alt={activeSecondaryImages[secondaryImageIdx].title?.[lang] || ''}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600';
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
                <h3 className="text-xl sm:text-3xl font-bold mb-2 shadow-sm">{activeSecondaryImages[secondaryImageIdx].title?.[lang] || ''}</h3>
                <p className="text-teal-50 text-sm sm:text-base max-w-2xl font-medium">{activeSecondaryImages[secondaryImageIdx].description?.[lang] || ''}</p>
              </div>
            </>
          )}
          
          <button 
            onClick={prevSecondaryImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextSecondaryImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 right-4 flex gap-2">
            {activeSecondaryImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSecondaryImageIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === secondaryImageIdx ? 'bg-emerald-400 w-6' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Intro & History Content */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-10">
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-none sm:rounded-3xl -mx-4 sm:mx-0 shadow-sm border-y sm:border border-teal-50 dark:border-slate-800/60 relative overflow-hidden transition-colors">
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
              {formatNumber(lang === 'en' ? siteTexts.paanStoryTitleEn : siteTexts.paanStoryTitleNe, lang)}
            </h3>
            <p className="text-teal-800 dark:text-teal-200 leading-relaxed font-medium text-[15px]">
              {formatNumber(lang === 'en' ? siteTexts.paanStoryEn : siteTexts.paanStoryNe, lang)}
            </p>
          </div>
        </div>

        {/* Vision & Mission sidebar card */}
        <div className="xl:col-span-5">
          <div className="bg-teal-900 text-white p-6 sm:p-8 rounded-none sm:rounded-3xl -mx-4 sm:mx-0 shadow-lg border-t-4 sm:border-t-8 border-emerald-400 h-full flex flex-col justify-center relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 bg-teal-800 rounded-full w-40 h-40 opacity-50 blur-2xl" />
             <div className="relative z-10">
                <h3 className="text-2xl font-black text-emerald-300 mb-4 flex items-center gap-2">
                  <Map className="w-6 h-6" />
                  {formatNumber(lang === 'en' ? siteTexts.missionTitleEn : siteTexts.missionTitleNe, lang)}
                </h3>
                <p className="text-teal-50 text-[15px] leading-relaxed font-medium">
                  {formatNumber(lang === 'en' ? siteTexts.missionEn : siteTexts.missionNe, lang)}
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Mobile-only Sidebar Widgets: Shown below Vision & Mission on mobile */}
      <div className="xl:hidden space-y-px sm:space-y-6 pt-px pb-6 border-b border-teal-100 dark:border-slate-800 -mx-4 px-4 sm:mx-0 sm:px-0 -mt-3 sm:mt-0">
        {renderEservicesPortal()}
        {renderCommunityPillars()}
        {renderUnityWidget()}
      </div>

      {/* Impact Stats */}
      <section className="space-y-8 hidden">
        <h3 className="text-2xl sm:text-3xl font-black text-teal-950 dark:text-teal-50 text-center uppercase tracking-tight">
          {formatNumber(lang === 'en' ? siteTexts.impactHeaderEn : siteTexts.impactHeaderNe, lang)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeImpactStats.map((stat, idx) => {
            const icons = [Users, Leaf, BookOpen];
            const Icon = icons[idx % icons.length];
            return (
              <div key={stat.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-teal-100 dark:border-slate-800 hover:shadow-md transition-all text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-emerald-600">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-black text-teal-950 dark:text-teal-50 tracking-tight">
                  {formatNumber(stat.value, lang)}
                </div>
                <div>
                  <h4 className="font-extrabold text-teal-700 dark:text-emerald-400 uppercase text-xs tracking-wider mb-2">
                    {formatNumber(stat.label?.[lang] || '', lang)}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {formatNumber(stat.desc?.[lang] || '', lang)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>



      {/* Blog Section */}
      <section className="space-y-6 py-2">
        <h3 className="text-2xl sm:text-3xl font-black text-teal-950 dark:text-teal-50 text-center uppercase tracking-tight flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-teal-600 dark:text-emerald-400" />
          {lang === 'en' ? 'Latest Blog Posts' : 'पछिल्लो ब्लग पोस्टहरू'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 -mx-4 sm:mx-0">
          {loadingPosts ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl p-4 border-y sm:border border-teal-100 dark:border-slate-800 space-y-3 animate-pulse shadow-sm">
                <div className="w-full h-44 bg-teal-100/50 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-teal-100/60 dark:bg-slate-800 rounded-md w-3/4" />
                <div className="h-3 bg-teal-100/40 dark:bg-slate-800 rounded-md w-1/2" />
              </div>
            ))
          ) : [...livePosts]
            .sort((a, b) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              if (!isNaN(dateA) && !isNaN(dateB) && dateA !== dateB) {
                return dateB - dateA;
              }
              return b.id.localeCompare(a.id);
            })
            .map((post) => (
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
              className="bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl shadow-sm border-y sm:border border-teal-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow group block cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title[lang] || post.title.en} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between text-xs font-bold text-teal-600 dark:text-emerald-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatNumber(post.date, lang)}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {post.author}</span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.tags.slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-emerald-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h4 className="text-xl font-bold text-teal-950 dark:text-teal-100 mb-2 line-clamp-2 group-hover:text-teal-700 dark:group-hover:text-emerald-400 transition-colors">
                  {post.title[lang] || post.title.en}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                  {post.excerpt[lang] || post.excerpt.en}
                </p>
                <div 
                  className="text-sm font-bold text-teal-700 dark:text-emerald-400 group-hover:text-teal-900 dark:group-hover:text-emerald-300 inline-flex items-center gap-1 transition-colors mt-auto"
                >
                  {lang === 'en' ? 'Read More' : 'थप पढ्नुहोस्'} <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Glimpses to Our Journey Albums Section */}
      <section className="space-y-6 py-4 border-t border-teal-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-teal-200 dark:border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Photo &amp; Video Gallery
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-teal-950 dark:text-teal-50 uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <ImageIcon className="w-8 h-8 text-teal-600 dark:text-emerald-400" />
              {t.photoGallery[lang]}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium max-w-2xl">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 -mx-4 sm:mx-0">
          {[...(albums || [])]
            .sort((a, b) => {
              const dateA = new Date(a.date).getTime();
              const dateB = new Date(b.date).getTime();
              if (!isNaN(dateA) && !isNaN(dateB) && dateA !== dateB) {
                return dateB - dateA;
              }
              return b.id.localeCompare(a.id);
            })
            .slice(0, 3)
            .map((album) => {
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
                className="bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl border-y sm:border border-teal-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col"
              >
                {/* Cover Preview Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-teal-950">
                  <img
                    src={getBestAlbumCover(album)}
                    alt={album.title[lang]}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Count Badges */}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-bold text-teal-300 flex items-center gap-1 border border-white/10">
                      <ImageIcon className="w-3 h-3 text-teal-400" /> {formatNumber(photosCount, lang)} {lang === 'en' ? 'Photos' : 'फोटो'}
                    </span>
                    {videosCount > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 backdrop-blur-md text-[11px] font-bold text-amber-300 flex items-center gap-1 border border-amber-500/30">
                        <Film className="w-3 h-3 text-amber-400" /> {formatNumber(videosCount, lang)} {lang === 'en' ? 'Videos' : 'भिडियो'}
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
                    <div className="flex items-center gap-3 text-xs font-bold text-teal-600 dark:text-emerald-400 mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatNumber(album.date, lang)}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {formatNumber(album.location[lang], lang)}</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-teal-950 dark:text-teal-100 group-hover:text-teal-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {formatNumber(album.title[lang], lang)}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-2 line-clamp-2 font-medium leading-relaxed">
                      {formatNumber(album.description[lang], lang)}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-teal-50 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {album.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-emerald-300 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-black text-teal-700 dark:text-emerald-400 group-hover:text-emerald-600 inline-flex items-center gap-1 uppercase tracking-wider">
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

      {/* Community Notices Section */}
      {renderNoticesSection()}

      {/* Our Network: District Chapters & Sister Institutions */}
      <section className="space-y-6 py-6 border-t border-teal-100 dark:border-slate-800">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/30">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {lang === 'en' ? 'Our Network' : 'हाम्रो संजाल'}
          </span>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <h3 className="text-2xl sm:text-3xl font-black text-teal-950 dark:text-teal-50 uppercase tracking-tight">
              {lang === 'en' ? 'Chapters & Sister Organizations' : 'शाखाहरू र भगिनी संस्थाहरू'}
            </h3>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingNetId(null);
                  setNetNameEn('');
                  setNetNameNe('');
                  setNetType('chapter');
                  setNetDescEn('');
                  setNetDescNe('');
                  setNetLocEn('');
                  setNetLocNe('');
                  setIsNetworkModalOpen(true);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Chapter / Sister Org</span>
              </button>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto font-medium leading-relaxed">
            {lang === 'en' 
              ? 'Expanding our footprints and coordinating social welfare initiatives across Nepal through active district chapters and associated wings.'
              : 'सक्रिय जिल्ला शाखाहरू र आबद्ध संस्थाहरू मार्फत नेपालभर हाम्रो उपस्थिति विस्तार गर्दै र सामाजिक कल्याणकारी पहलहरू समन्वय गर्दै।'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {/* Left Column: District Chapters */}
          <div className="bg-gradient-to-br from-white to-teal-50/20 dark:from-slate-900 dark:to-slate-900/40 rounded-none sm:rounded-2xl p-5 sm:p-6 shadow-sm border-y sm:border border-teal-100/60 dark:border-slate-800/80 space-y-4 -mx-4 sm:mx-0">
            <div className="flex items-center gap-2.5 pb-3 border-b border-teal-100/40 dark:border-slate-800">
              <Map className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h4 className="text-lg font-extrabold text-teal-950 dark:text-teal-50">
                {lang === 'en' ? 'District Chapters' : 'जिल्ला शाखाहरू'}
              </h4>
            </div>

            <div className="space-y-4">
              {networks.filter(n => n.type === 'chapter').length === 0 ? (
                <p className="text-xs text-gray-400 italic">No chapters added yet.</p>
              ) : (
                networks.filter(n => n.type === 'chapter').map((net) => (
                  <div 
                    key={net.id}
                    onClick={() => onSelectNetwork && onSelectNetwork(net.id)}
                    className="flex gap-3 items-start p-3 rounded-xl hover:bg-teal-50/45 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group relative border border-transparent hover:border-teal-100/40"
                  >
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingNetId(net.id);
                            setNetNameEn(net.name?.en || '');
                            setNetNameNe(net.name?.ne || '');
                            setNetType(net.type || 'chapter');
                            setNetDescEn(net.description?.en || '');
                            setNetDescNe(net.description?.ne || '');
                            setNetLocEn(net.location?.en || '');
                            setNetLocNe(net.location?.ne || '');
                            setIsNetworkModalOpen(true);
                          }}
                          className="p-1 bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-slate-800 dark:text-teal-300 rounded-md shadow-sm"
                          title="Edit Chapter"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteNetwork && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this branch and its data?')) {
                                onDeleteNetwork(net.id);
                              }
                            }}
                            className="p-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 rounded-md shadow-sm"
                            title="Delete Branch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}

                    <div className="p-2 rounded-lg bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 pr-12">
                      <h5 className="font-extrabold text-sm text-teal-950 dark:text-teal-50 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors flex items-center gap-1.5">
                        {net.name[lang]}
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                        {net.description[lang]}
                      </p>
                      <span className="inline-block text-[10px] font-bold text-teal-600 dark:text-teal-400">
                        📍 {net.location[lang]}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Sister Institutions */}
          <div className="bg-gradient-to-br from-white to-emerald-50/20 dark:from-slate-900 dark:to-slate-900/40 rounded-none sm:rounded-2xl p-5 sm:p-6 shadow-sm border-y sm:border border-emerald-100/60 dark:border-slate-800/80 space-y-4 -mx-4 sm:mx-0">
            <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-100/40 dark:border-slate-800">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-lg font-extrabold text-teal-950 dark:text-teal-50">
                {lang === 'en' ? 'Sister Organizations' : 'भगिनी संस्थाहरू'}
              </h4>
            </div>

            <div className="space-y-4">
              {networks.filter(n => n.type === 'sister').length === 0 ? (
                <p className="text-xs text-gray-400 italic">No sister organizations added yet.</p>
              ) : (
                networks.filter(n => n.type === 'sister').map((net) => (
                  <div 
                    key={net.id}
                    onClick={() => onSelectNetwork && onSelectNetwork(net.id)}
                    className="flex gap-3 items-start p-3 rounded-xl hover:bg-emerald-50/45 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group relative border border-transparent hover:border-emerald-100/40"
                  >
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingNetId(net.id);
                            setNetNameEn(net.name?.en || '');
                            setNetNameNe(net.name?.ne || '');
                            setNetType(net.type || 'sister');
                            setNetDescEn(net.description?.en || '');
                            setNetDescNe(net.description?.ne || '');
                            setNetLocEn(net.location?.en || '');
                            setNetLocNe(net.location?.ne || '');
                            setIsNetworkModalOpen(true);
                          }}
                          className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-slate-800 dark:text-emerald-300 rounded-md shadow-sm"
                          title="Edit Sister Org"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteNetwork && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this branch and its data?')) {
                                onDeleteNetwork(net.id);
                              }
                            }}
                            className="p-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 rounded-md shadow-sm"
                            title="Delete Sister Org"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}

                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 pr-12">
                      <h5 className="font-extrabold text-sm text-teal-950 dark:text-teal-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                        {net.name[lang]}
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                        {net.description[lang]}
                      </p>
                      <span className="inline-block text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        📍 {net.location[lang]}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ADMIN MODAL TO ADD/EDIT NETWORK BRANCH */}
        {isNetworkModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-teal-100 dark:border-slate-800 max-w-md w-full text-xs font-semibold space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-teal-50 dark:border-slate-800">
                <h3 className="font-black text-lg text-teal-950 dark:text-teal-50 uppercase tracking-tight">
                  {editingNetId ? 'Edit Network Branch' : 'Add Network Branch'}
                </h3>
                <button 
                  onClick={() => setIsNetworkModalOpen(false)}
                  className="p-1 hover:bg-teal-50 rounded-full text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!netNameEn || !netDescEn) return;
                  const branchToSave: NetworkBranch = {
                    id: editingNetId || netNameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `branch-${Date.now()}`,
                    type: netType,
                    name: { en: netNameEn, ne: netNameNe || netNameEn },
                    description: { en: netDescEn, ne: netDescNe || netDescEn },
                    location: { en: netLocEn || 'Nepal', ne: netLocNe || 'नेपाल' }
                  };
                  if (onAddNetwork) onAddNetwork(branchToSave);
                  setIsNetworkModalOpen(false);
                  setEditingNetId(null);
                  // Reset fields
                  setNetNameEn('');
                  setNetNameNe('');
                  setNetType('chapter');
                  setNetDescEn('');
                  setNetDescNe('');
                  setNetLocEn('');
                  setNetLocNe('');
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Branch Type</label>
                  <select
                    value={netType}
                    onChange={(e) => setNetType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-teal-100 dark:border-slate-800 bg-teal-50/20 focus:outline-none focus:border-teal-500 dark:bg-slate-950 text-teal-950 dark:text-white"
                  >
                    <option value="chapter">District Chapter</option>
                    <option value="sister">Sister Organization</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-500 uppercase tracking-wider block">Name (English)</label>
                    <input
                      type="text"
                      value={netNameEn}
                      onChange={(e) => setNetNameEn(e.target.value)}
                      placeholder="e.g. Nepalgunj Chapter"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-teal-100 dark:border-slate-800 bg-teal-50/20 focus:outline-none focus:border-teal-500 dark:bg-slate-950 text-teal-950 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-500 uppercase tracking-wider block">Name (Nepali)</label>
                    <input
                      type="text"
                      value={netNameNe}
                      onChange={(e) => setNetNameNe(e.target.value)}
                      placeholder="नेपालगन्ज शाखा"
                      className="w-full px-3 py-2 rounded-xl border border-teal-100 dark:border-slate-800 bg-teal-50/20 focus:outline-none focus:border-teal-500 dark:bg-slate-950 text-teal-950 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Description (English)</label>
                  <textarea
                    value={netDescEn}
                    onChange={(e) => setNetDescEn(e.target.value)}
                    placeholder="Brief description about its goals and presence..."
                    rows={2}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-teal-100 dark:border-slate-800 bg-teal-50/20 focus:outline-none focus:border-teal-500 dark:bg-slate-950 text-teal-950 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Description (Nepali)</label>
                  <textarea
                    value={netDescNe}
                    onChange={(e) => setNetDescNe(e.target.value)}
                    placeholder="यस शाखाको लक्ष्य र उपस्थितिको विवरण..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-teal-100 dark:border-slate-800 bg-teal-50/20 focus:outline-none focus:border-teal-500 dark:bg-slate-950 text-teal-950 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-500 uppercase tracking-wider block">Location (English)</label>
                    <input
                      type="text"
                      value={netLocEn}
                      onChange={(e) => setNetLocEn(e.target.value)}
                      placeholder="e.g. Banke District"
                      className="w-full px-3 py-2 rounded-xl border border-teal-100 dark:border-slate-800 bg-teal-50/20 focus:outline-none focus:border-teal-500 dark:bg-slate-950 text-teal-950 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-500 uppercase tracking-wider block">Location (Nepali)</label>
                    <input
                      type="text"
                      value={netLocNe}
                      onChange={(e) => setNetLocNe(e.target.value)}
                      placeholder="बाँके जिल्ला"
                      className="w-full px-3 py-2 rounded-xl border border-teal-100 dark:border-slate-800 bg-teal-50/20 focus:outline-none focus:border-teal-500 dark:bg-slate-950 text-teal-950 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold uppercase tracking-widest rounded-xl text-center shadow-md transition-all pt-2.5"
                >
                  Create Branch Page
                </button>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Leadership & Key Figures */}
      <section className="space-y-6 py-4 border-t border-teal-50 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <h3 className="text-2xl sm:text-3xl font-black text-teal-950 dark:text-teal-50 text-center uppercase tracking-tight">
            {lang === 'en' ? 'Our Leadership' : 'हाम्रो नेतृत्व'}
          </h3>
          {isAdmin && (
            <button
              onClick={() => {
                setActiveEditSection('executive_committee');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1.5 bg-teal-50 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 text-teal-800 dark:text-teal-200 text-[11px] font-bold rounded-lg hover:bg-teal-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
              title="Manage Executive Committee"
            >
              <Edit className="w-3.5 h-3.5 text-emerald-600" />
              <span>Edit Leadership</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {activeLeadership.map((member, idx) => {
            if (!member) return null;
            return (
              <div key={member.id || idx} className="w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-0.67rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(20%-0.8rem)] max-w-[200px] bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-teal-100 dark:border-slate-800 flex flex-col items-center text-center gap-2 hover:shadow-md transition-all group relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/50 group-hover:border-emerald-400 transition-colors shrink-0 shadow-inner">
                  <img src={member.avatarUrl || member.photoBase64} alt={member.name?.[lang] || ''} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5 min-w-0 w-full">
                  <h4 className="font-extrabold text-teal-950 dark:text-teal-50 text-[13px] leading-tight break-words text-center">{member.name?.[lang] || ''}</h4>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider break-words text-center">{member.role?.[lang] || ''}</p>
                </div>
                <button
                  onClick={() => {
                    onSelectLeader(member.id);
                    onNavigate('leader-bio');
                    onTrackAction(`Viewed profile of ${member.name?.en || ''}`);
                  }}
                  className="mt-auto text-[10px] font-black uppercase text-teal-700 dark:text-teal-200 bg-teal-50/80 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors flex items-center justify-center gap-0.5 w-full whitespace-nowrap"
                >
                  <span>{lang === 'en' ? 'Profile' : 'प्रोफाइल'}</span>
                  <ArrowRight className="w-3 h-3" />
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

        </div> {/* End of Column 2 (xl:col-span-9) */}
      </div> {/* End of 2-Column Grid (grid-cols-1 xl:grid-cols-12) */}

    </div>
  );
}
