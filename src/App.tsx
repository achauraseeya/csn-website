import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Leaf, Award, Heart, Shield, Landmark, MessageCircle, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import { Language, AnalyticsMetric, Member, Album, AlbumMediaItem, Notice, Document, CommunityEvent, NetworkBranch, MatrimonialProfile, VolunteerApplication, MembershipApplication, NewsletterSubscriber } from './types';
import { initialNetworks } from './data/networkData';
import { notices as initialNotices, boardMembers as initialMembers, upcomingEvents as initialEvents, documents as initialDocuments } from './data/communityData';
import { journeyAlbums as initialJourneyAlbums } from './data/albumsData';
import logoImg from './assets/images/chaurasiya_logo_1784519579895.jpg';

import Navigation from './components/Navigation';
import HistorySection from './components/HistorySection';
import AlbumGallery from './components/AlbumGallery';
import AlbumDetail from './components/AlbumDetail';
import BlogPostDetail, { SinglePostData } from './components/BlogPostDetail';
import NetworkBranchDetail from './components/NetworkBranchDetail';
import NoticeGallery from './components/NoticeGallery';
import DirectorySection from './components/DirectorySection';
import EventsSection from './components/EventsSection';
import MembershipDonation from './components/MembershipDonation';
import AbhishekBio from './components/AbhishekBio';
import LeaderBio from './components/LeaderBio';
import MatrimonialSection from './components/MatrimonialSection';
import AdminCentralDashboardModal from './components/AdminCentralDashboardModal';
import BloggerXmlExporter from './components/BloggerXmlExporter';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TransparencySection from './components/TransparencySection';
import ContactSection from './components/ContactSection';
import UploadJourneyPostModal from './components/UploadJourneyPostModal';
import AdminLoginModal from './components/AdminLoginModal';
import AddNoticeModal from './components/AddNoticeModal';
import PrivacySection from './components/PrivacySection';
import TermsSection from './components/TermsSection';
import { SiteTexts } from './types';
import { apiFetch, apiSave, apiDelete, saveFileToGithub, getGithubSettings, uploadImageToGithub } from './utils/githubDb';
import { formatNumber } from './utils/mediaUrl';
import {
  subscribeMatrimonialProfiles,
  saveMatrimonialProfileToCloud,
  updateMatrimonialStatusInCloud,
  deleteMatrimonialProfileFromCloud,
  subscribeVolunteerApps,
  saveVolunteerAppToCloud,
  updateVolunteerStatusInCloud,
  deleteVolunteerAppFromCloud,
  subscribeMembershipApps,
  saveMembershipAppToCloud,
  updateMembershipStatusInCloud,
  deleteMembershipAppFromCloud,
  subscribeSubscribers,
  saveSubscriberToCloud,
  deleteSubscriberFromCloud
} from './services/firebaseDb';
import { broadcastLiveEvent, listenLiveEvents } from './services/broadcastSync';

const defaultSiteTexts: SiteTexts = {
  heroTitleEn: 'Chaurasiya Samaj Nepal',
  heroTitleNe: 'चौरसिया समाज नेपाल',
  heroSubEn: 'A dedicated social platform preserving betel leaf culture & serving humanity across Nepal.',
  heroSubNe: 'नेपालभर पान संस्कृतिको संरक्षण र मानव सेवामा समर्पित एक सामाजिक मञ्च।',
  introEn: 'Chaurasiya Samaj Nepal is a non-profit, non-governmental community organization registered under the Social Welfare Council of Nepal. Our mission is to integrate, unify, and elevate the Chaurasiya community across Madhesh Province and greater Nepal, fostering socio-economic progress, promoting traditional agricultural practices (such as betel leaf/Paan cultivation), and providing educational scholarships, medical support, and emergency relief services.',
  introNe: 'चौरसिया समाज नेपाल एक गैर-नाफामूलक, गैर-सरकारी सामाजिक संस्था हो जुन नेपालको समाज कल्याण परिषदमा दर्ता छ। हाम्रो मुख्य उद्देश्य मधेस प्रदेश र समग्र नेपालभर छरिएर रहेका चौरसिया समुदायलाई एकीकृत गर्दै, उनीहरूको सामाजिक-आर्थिक उन्नति र परम्परागत कृषि प्रणाली (विशेषगरी पान खेती) को जगेर्ना गर्नुका साथै विपन्न विद्यार्थीहरूलाई छात्रवृत्ति, स्वास्थ्य सहायता तथा आपतकालीन राहत सेवाहरू पुर्‍याउनु हो।',
  paanStoryTitleEn: 'The Betel Leaf Cultivation Legacy',
  paanStoryTitleNe: 'पान खेतीको ऐतिहासिक विरासत',
  paanStoryEn: 'Betel Leaf (Paan) cultivation is not just an agricultural occupation for our community; it is a sacred historical legacy. Mentioned in ancient scriptures, the cultivation of the betel vine is an intricate art form passed down through generations. Known as "Jay Paan Dev", our traditional farmers maintain unique shaded structures (Borejha) that protect the delicate leaves, carrying forward a rich cultural heritage that blends nature with spirituality.',
  paanStoryNe: 'पान खेती चौरसिया समुदायका लागि केवल एक परम्परागत कृषि व्यवसाय मात्र नभएर हाम्रो पौराणिक सांस्कृतिक धरोहर पनि हो। धार्मिक ग्रन्थहरूमा समेत चर्चा गरिएको यो खेती अत्यन्तै संवेदनशील र कलात्मक छ। "जय पान देव" को मूल मन्त्रका साथ हाम्रा कृषकहरूले वर्षौंदेखि विशेष किसिमको छायादार संरचना (बरेजा) बनाएर यसको संरक्षण गर्दै आएका छन्, जसले हाम्रो प्राकृतिक र धार्मिक पहिचानलाई जीवन्त राखेको छ।',
  missionTitleEn: 'Our Vision & Impact Mission',
  missionTitleNe: 'हाम्रो दृष्टिकोण र लक्ष्य',
  missionEn: 'To build a self-reliant, literate, and healthy community where traditional knowledge of betel leaf cultivation is scientifically modernized, and every member has access to equal education, healthcare, and livelihood opportunities.',
  missionNe: 'एक आत्मनिर्भर, शिक्षित र स्वस्थ चौरसिया समाजको निर्माण गर्ने, जहाँ परम्परागत पान खेतीलाई आधुनिक वैज्ञानिक प्रविधिसँग जोडिनेछ र समुदायका प्रत्येक सदस्यले समान शिक्षा, स्वास्थ्य र जीविकोपार्जनका अवसरहरू प्राप्त गर्नेछन्।',
  privacyEn: 'Your privacy is extremely important to us. This Privacy Policy details how Chaurasiya Samaj Nepal collects, uses, and safeguards the personal information of our directory members and donors. We strictly protect your contact information and never sell or distribute data to third parties without explicit consent.',
  privacyNe: 'तपाईंको गोपनीयता हाम्रो लागि अत्यन्तै महत्त्वपूर्ण छ। यो गोपनीयता नीतिले चौरसिया समाज नेपालले हाम्रा सदस्यहरू र दाताहरूको व्यक्तिगत विवरणहरू कसरी संकलन, प्रयोग र संरक्षण गर्छ भन्ने व्याख्या गर्दछ। हामी तपाईंको सम्पर्क विवरणहरूलाई सुरक्षित राख्छौँ र बिना अनुमति तेस्रो पक्षलाई प्रदान गर्दैनौँ।',
  termsEn: 'By accessing Chaurasiya Samaj Nepal website, you agree to be bound by these Terms of Service. All content, logo, directories, and notices on this platform are owned by Chaurasiya Samaj Nepal. Any nomination or directory submission must contain valid, truthful information.',
  termsNe: 'चौरसिया समाज नेपालको वेबसाइट प्रयोग गरेर, तपाईं यी सेवाका सर्तहरू पालना गर्न सहमत हुनुहुन्छ। यस प्लेटफर्ममा रहेका सबै सामग्री, लोगो, निर्देशिका र सूचनाहरूको स्वामित्व चौरसिया समाज नेपालमा निहित छ।',
  sliderBadgeEn: 'Jay Paan Dev',
  sliderBadgeNe: 'जय पान देव',
  logoTextEn: 'Chaurasiya Samaj',
  logoTextNe: 'चौरसिया समाज',
  logoSubEn: 'Nepal',
  logoSubNe: 'चौरसिया समाज नेपाल',
  logoUrl: '',
  taglineEn: 'A dedicated social platform preserving betel leaf culture & serving humanity',
  taglineNe: 'पान संस्कृतिको संरक्षण र मानव सेवामा समर्पित एक सामाजिक संस्था',
  impactHeaderEn: 'Empowering & Transforming Lives',
  impactHeaderNe: 'सशक्तिकरण र जीवन परिवर्तन',
  footerAboutEn: 'We are dedicated to unifying community coordinators, supporting traditional cultivation, and providing essential healthcare and youth education programs.',
  footerAboutNe: 'हामी सामुदायिक संयोजकहरूलाई एकीकृत गर्न, परम्परागत खेतीलाई सहयोग गर्न र आवश्यक स्वास्थ्य सेवा र युवा शिक्षा कार्यक्रमहरू प्रदान गर्न समर्पित छौं।',
  footerAddressEn: 'Ghantaghar Path, Birgunj, Parsa, Madhesh Province, Nepal',
  footerAddressNe: 'घण्टाघर पथ, वीरगन्ज, पर्सा, मधेश प्रदेश, नेपाल',
  footerPhone: '+977-9812345678',
  footerEmail: 'achauraseeya@gmail.com',
  socialFb: 'https://facebook.com',
  socialTw: 'https://twitter.com',
  socialIg: 'https://instagram.com',
  heroImagesJson: JSON.stringify([
    {
      id: "g1",
      title: { en: "Fresh Paan Garden (Betel Vineyard)", ne: "ताजा पान खेती (पानको बरेजा)" },
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600",
      description: {
        en: "A beautiful lush green traditional paan cultivation structure (Bareja) managed by local community members.",
        ne: "स्थानीय समुदायका सदस्यहरूद्वारा व्यवस्थित एक सुन्दर हरियो परम्परागत पान खेती संरचना (बरेजा)।"
      }
    },
    {
      id: "g2",
      title: { en: "Community Health Camp Parsa", ne: "सामुदायिक स्वास्थ्य शिविर पर्सा" },
      imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600",
      description: {
        en: "Free health screenings, eye tests, and medicine distribution for underprivileged elders.",
        ne: "अल्पसुविधा प्राप्त वृद्धवृद्धाहरूका लागि निःशुल्क स्वास्थ्य परीक्षण, आँखा जाँच र औषधि वितरण।"
      }
    },
    {
      id: "g3",
      title: { en: "Youth Interaction & IT Training", ne: "युवा अन्तरक्रिया र सूचना प्रविधि तालिम" },
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
      description: {
        en: "Workshop on modern IT skills while staying connected to roots.",
        ne: "जरासँग जोडिएर आधुनिक सूचना प्रविधि सीपहरूमा कार्यशाला।"
      }
    }
  ])
};

export default function App() {
  // Default language turned to 'en' (English) as requested
  const [lang, setLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('history');
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<SinglePostData | null>(null);
  
  // Dynamic Network/Chapters State
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [networks, setNetworks] = useState<NetworkBranch[]>(initialNetworks);

  // Dynamic Site Texts State
  const [siteTexts, setSiteTexts] = useState<SiteTexts>(defaultSiteTexts);
  
  // Dynamic Member Directory list
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialMembers;
  });

  // Dynamic Community Events list
  const [events, setEvents] = useState<CommunityEvent[]>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialEvents;
  });

  // Dynamic Documents list
  const [documentsList, setDocumentsList] = useState<Document[]>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_documents');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialDocuments;
  });

  // Admin Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('chaurasiya_is_admin') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAddNoticeModalOpen, setIsAddNoticeModalOpen] = useState(false);

  // Initial Matrimonial Data
  const initialMatrimonialProfiles: MatrimonialProfile[] = [
    {
      id: 'matrimony-1',
      lookingFor: 'groom',
      fullName: 'Anand Kumar Chaurasiya',
      age: 28,
      dob: '1998-05-14',
      height: "5'10\"",
      gotraSubcaste: 'Kashyap',
      qualification: 'B.Tech Computer Science (TU)',
      occupation: 'Senior Software Engineer, Kathmandu',
      monthlyIncome: 'NPR 1,20,000 / month',
      currentCityDistrict: 'Kathmandu / Birgunj',
      nativePlace: 'Parsa, Madhesh Pradesh',
      fatherName: 'Ram Avatar Chaurasiya',
      fatherOccupation: 'Business & Agriculture',
      familyType: 'Nuclear',
      partnerExpectations: 'Looking for educated, family-oriented bride from Chaurasiya Samaj.',
      guardianName: 'Ram Avatar Chaurasiya',
      guardianPhone: '+977-9855012345',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      status: 'approved',
      createdAt: '2026-01-15'
    },
    {
      id: 'matrimony-2',
      lookingFor: 'bride',
      fullName: 'Pooja Chaurasiya',
      age: 25,
      dob: '2001-08-20',
      height: "5'4\"",
      gotraSubcaste: 'Kashyap',
      qualification: 'M.Sc Biochemistry (TU)',
      occupation: 'Quality Assurance Officer, Pharma',
      monthlyIncome: 'NPR 65,000 / month',
      currentCityDistrict: 'Birgunj, Parsa',
      nativePlace: 'Parsa, Nepal',
      fatherName: 'Shambhu Prasad Chaurasiya',
      fatherOccupation: 'Senior Government Officer (Retd.)',
      familyType: 'Joint Family',
      partnerExpectations: 'Looking for well-educated professional groom with good family values.',
      guardianName: 'Shambhu Prasad Chaurasiya',
      guardianPhone: '+977-9845098765',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      status: 'approved',
      createdAt: '2026-02-10'
    }
  ];

  const [matrimonialProfiles, setMatrimonialProfiles] = useState<MatrimonialProfile[]>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_matrimony');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialMatrimonialProfiles;
  });

  const [volunteerApps, setVolunteerApps] = useState<VolunteerApplication[]>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_volunteers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'vol-1',
        fullName: 'Rohan Chaurasiya',
        email: 'rohan.c@gmail.com',
        phone: '+977-9811223344',
        address: 'Pokhariya, Parsa',
        interests: ['Health Camps & Medical Relief', 'Youth & IT Skill Training'],
        availability: 'Weekends',
        notes: 'Excited to coordinate health checkup drives in rural Parsa villages.',
        status: 'pending',
        createdAt: '2026-03-01'
      }
    ];
  });

  const [membershipApps, setMembershipApps] = useState<MembershipApplication[]>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_membership_apps');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'memb-1',
        type: 'new',
        fullName: 'Sunil Kumar Chaurasiya',
        phone: '+977-9855123456',
        email: 'sunil.chaurasiya@gmail.com',
        address: 'Kalaiya, Bara',
        occupation: 'Civil Engineer',
        membershipType: 'Life Member',
        paymentMethod: 'Bank Transfer',
        paymentReference: 'GIBL-8921356',
        status: 'pending',
        createdAt: '2026-03-10'
      }
    ];
  });

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_subscribers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [
      { id: 'sub-1', email: 'csnepalwebsite@gmail.com', subscribedAt: '2026-01-01', source: 'Website Footer' },
      { id: 'sub-2', email: 'achauraseeya@gmail.com', subscribedAt: '2026-01-02', source: 'Website Footer' }
    ];
  });

  // Retrieve auth headers for admin actions
    const getAuthHeaders = () => { return {}; };

  // Dynamic Community Notices State (Initial + Server Online + LocalStorage)
  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_notices');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customOnly = parsed.filter(p => !initialNotices.some(i => i.id === p.id));
          return [...customOnly, ...initialNotices];
        }
      }
    } catch (e) {
      console.error('Error loading custom notices from localStorage', e);
    }
    return initialNotices;
  });

  // Live Toast state & tracking refs
  const [liveToast, setLiveToast] = useState<string | null>(null);
  const knownMatrimonyRef = useRef<Set<string>>(new Set());
  const knownVolunteersRef = useRef<Set<string>>(new Set());
  const knownMembershipsRef = useRef<Set<string>>(new Set());
  const knownSubscribersRef = useRef<Set<string>>(new Set());

  // Auto-dismiss toast
  useEffect(() => {
    if (liveToast) {
      const timer = setTimeout(() => setLiveToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [liveToast]);

  // Real-time Cloud Database & Broadcast Synchronization Listeners
  useEffect(() => {
    // 1. Listen to BroadcastChannel events for instant local cross-tab / cross-window updates
    const unsubscribeBroadcast = listenLiveEvents((event) => {
      if (event.type === 'NEW_MEMBERSHIP') {
        const item = event.payload as MembershipApplication;
        setMembershipApps(prev => {
          if (prev.some(m => m.id === item.id)) return prev;
          const updated = [item, ...prev];
          try { localStorage.setItem('chaurasiya_membership_apps', JSON.stringify(updated)); } catch (e) {}
          return updated;
        });
        setLiveToast(`🔔 New Membership Application / Renewal: ${item.fullName} (${item.membershipType})`);
      } else if (event.type === 'NEW_VOLUNTEER') {
        const item = event.payload as VolunteerApplication;
        setVolunteerApps(prev => {
          if (prev.some(v => v.id === item.id)) return prev;
          const updated = [item, ...prev];
          try { localStorage.setItem('chaurasiya_volunteers', JSON.stringify(updated)); } catch (e) {}
          return updated;
        });
        setLiveToast(`🔔 New Volunteer Application: ${item.fullName} (${item.address})`);
      } else if (event.type === 'NEW_MATRIMONY') {
        const item = event.payload as MatrimonialProfile;
        setMatrimonialProfiles(prev => {
          if (prev.some(p => p.id === item.id)) return prev;
          const updated = [item, ...prev];
          try { localStorage.setItem('chaurasiya_matrimony', JSON.stringify(updated)); } catch (e) {}
          return updated;
        });
        setLiveToast(`🔔 New Matrimonial Request: ${item.fullName} (${item.lookingFor === 'groom' ? 'Groom' : 'Bride'})`);
      } else if (event.type === 'NEW_SUBSCRIBER') {
        const item = event.payload as NewsletterSubscriber;
        setSubscribers(prev => {
          if (prev.some(s => s.id === item.id)) return prev;
          const updated = [item, ...prev];
          try { localStorage.setItem('chaurasiya_subscribers', JSON.stringify(updated)); } catch (e) {}
          return updated;
        });
        setLiveToast(`🔔 New Newsletter Subscriber: ${item.email}`);
      }
    });

    // 2. Firebase Firestore Real-time Listeners across devices
    const unsubscribeMatrimony = subscribeMatrimonialProfiles((cloudProfiles) => {
      cloudProfiles.forEach((p) => {
        if (knownMatrimonyRef.current.size > 0 && !knownMatrimonyRef.current.has(p.id)) {
          setLiveToast(`🔔 New Matrimonial Request: ${p.fullName} (${p.lookingFor === 'groom' ? 'Groom' : 'Bride'})`);
        }
      });
      knownMatrimonyRef.current = new Set(cloudProfiles.map(p => p.id));

      setMatrimonialProfiles((prev) => {
        const mergedMap = new Map<string, MatrimonialProfile>();
        prev.forEach(p => mergedMap.set(p.id, p));
        cloudProfiles.forEach(p => mergedMap.set(p.id, p));
        const result = Array.from(mergedMap.values());
        try { localStorage.setItem('chaurasiya_matrimony', JSON.stringify(result)); } catch (e) {}
        return result;
      });
    });

    const unsubscribeVolunteers = subscribeVolunteerApps((cloudVolunteers) => {
      cloudVolunteers.forEach((v) => {
        if (knownVolunteersRef.current.size > 0 && !knownVolunteersRef.current.has(v.id)) {
          setLiveToast(`🔔 New Volunteer Application: ${v.fullName} (${v.address})`);
        }
      });
      knownVolunteersRef.current = new Set(cloudVolunteers.map(v => v.id));

      setVolunteerApps((prev) => {
        const mergedMap = new Map<string, VolunteerApplication>();
        prev.forEach(v => mergedMap.set(v.id, v));
        cloudVolunteers.forEach(v => mergedMap.set(v.id, v));
        const result = Array.from(mergedMap.values());
        try { localStorage.setItem('chaurasiya_volunteers', JSON.stringify(result)); } catch (e) {}
        return result;
      });
    });

    const unsubscribeMemberships = subscribeMembershipApps((cloudMemberships) => {
      cloudMemberships.forEach((m) => {
        if (knownMembershipsRef.current.size > 0 && !knownMembershipsRef.current.has(m.id)) {
          setLiveToast(`🔔 New Membership Application / Renewal: ${m.fullName} (${m.membershipType})`);
        }
      });
      knownMembershipsRef.current = new Set(cloudMemberships.map(m => m.id));

      setMembershipApps((prev) => {
        const mergedMap = new Map<string, MembershipApplication>();
        prev.forEach(m => mergedMap.set(m.id, m));
        cloudMemberships.forEach(m => mergedMap.set(m.id, m));
        const result = Array.from(mergedMap.values());
        try { localStorage.setItem('chaurasiya_membership_apps', JSON.stringify(result)); } catch (e) {}
        return result;
      });
    });

    const unsubscribeSubscribers = subscribeSubscribers((cloudSubscribers) => {
      cloudSubscribers.forEach((s) => {
        if (knownSubscribersRef.current.size > 0 && !knownSubscribersRef.current.has(s.id)) {
          setLiveToast(`🔔 New Newsletter Subscriber: ${s.email}`);
        }
      });
      knownSubscribersRef.current = new Set(cloudSubscribers.map(s => s.id));

      setSubscribers((prev) => {
        const mergedMap = new Map<string, NewsletterSubscriber>();
        prev.forEach(s => mergedMap.set(s.id, s));
        cloudSubscribers.forEach(s => mergedMap.set(s.id, s));
        const result = Array.from(mergedMap.values());
        try { localStorage.setItem('chaurasiya_subscribers', JSON.stringify(result)); } catch (e) {}
        return result;
      });
    });

    return () => {
      unsubscribeBroadcast();
      unsubscribeMatrimony();
      unsubscribeVolunteers();
      unsubscribeMemberships();
      unsubscribeSubscribers();
    };
  }, []);

  // Fetch online server notices on mount so ALL visitors see new notices automatically!
  useEffect(() => {
    apiFetch<Notice[]>('/api/notices', 'community_notices.json', [])
      .then((serverNotices) => {
        if (Array.isArray(serverNotices) && serverNotices.length > 0) {
          setNotices((prev) => {
            const mergedMap = new Map<string, Notice>();
            serverNotices.forEach(n => mergedMap.set(n.id, n));
            initialNotices.forEach(n => {
              if (!mergedMap.has(n.id)) {
                mergedMap.set(n.id, n);
              }
            });
            return Array.from(mergedMap.values());
          });
        }
      })
      .catch((err) => {
        console.warn('Backend server notices fetch failed or serverless DB not reachable:', err);
      });
  }, []);

  // Matrimonial handlers
  const handleAddMatrimonialProfile = (newProfile: MatrimonialProfile) => {
    saveMatrimonialProfileToCloud(newProfile);
    broadcastLiveEvent('NEW_MATRIMONY', newProfile);
    setMatrimonialProfiles(prev => {
      const updated = [newProfile, ...prev];
      try {
        localStorage.setItem('chaurasiya_matrimony', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleUpdateMatrimonialStatus = (id: string, status: 'approved' | 'rejected') => {
    updateMatrimonialStatusInCloud(id, status);
    setMatrimonialProfiles(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, status } : p);
      try {
        localStorage.setItem('chaurasiya_matrimony', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleDeleteMatrimonialProfile = (id: string) => {
    deleteMatrimonialProfileFromCloud(id);
    setMatrimonialProfiles(prev => {
      const updated = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem('chaurasiya_matrimony', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Volunteer handlers
  const handleAddVolunteerApp = (newVol: VolunteerApplication) => {
    saveVolunteerAppToCloud(newVol);
    broadcastLiveEvent('NEW_VOLUNTEER', newVol);
    setVolunteerApps(prev => {
      const updated = [newVol, ...prev];
      try {
        localStorage.setItem('chaurasiya_volunteers', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleUpdateVolunteerStatus = (id: string, status: 'approved' | 'contacted') => {
    updateVolunteerStatusInCloud(id, status);
    setVolunteerApps(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, status } : v);
      try {
        localStorage.setItem('chaurasiya_volunteers', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleDeleteVolunteerApp = (id: string) => {
    deleteVolunteerAppFromCloud(id);
    setVolunteerApps(prev => {
      const updated = prev.filter(v => v.id !== id);
      try {
        localStorage.setItem('chaurasiya_volunteers', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Membership handlers
  const handleAddMembershipApp = (newMemb: MembershipApplication) => {
    saveMembershipAppToCloud(newMemb);
    broadcastLiveEvent('NEW_MEMBERSHIP', newMemb);
    setMembershipApps(prev => {
      const updated = [newMemb, ...prev];
      try {
        localStorage.setItem('chaurasiya_membership_apps', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleApproveMembershipApp = (id: string, assignedMemberId: string) => {
    updateMembershipStatusInCloud(id, 'approved');
    const targetApp = membershipApps.find(m => m.id === id);
    if (targetApp) {
      const newMemberObj: Member = {
        id: `mem-${Date.now()}`,
        name: { en: targetApp.fullName, ne: targetApp.fullName },
        role: {
          en: `${targetApp.membershipType} (${assignedMemberId})`,
          ne: `${targetApp.membershipType} (${assignedMemberId})`
        },
        category: 'general',
        address: { en: targetApp.address, ne: targetApp.address },
        phone: targetApp.phone,
        email: targetApp.email,
        bio: {
          en: `${targetApp.fullName} is an officially enrolled ${targetApp.membershipType} of Chaurasiya Samaj Nepal (Membership ID: ${assignedMemberId}).`,
          ne: `${targetApp.fullName} चौरसिया समाज नेपालका आधिकारिक दर्ता भएका ${targetApp.membershipType} हुनुहुन्छ (सदस्यता ID: ${assignedMemberId})।`
        },
      };
      setMembers(prev => {
        const updated = [newMemberObj, ...prev];
        try {
          localStorage.setItem('chaurasiya_members', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }

    setMembershipApps(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, status: 'approved' as const } : m);
      try {
        localStorage.setItem('chaurasiya_membership_apps', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleRejectMembershipApp = (id: string) => {
    deleteMembershipAppFromCloud(id);
    setMembershipApps(prev => {
      const updated = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem('chaurasiya_membership_apps', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Newsletter Subscribers handler
  const handleNewsletterSubscribeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input[type="email"]') as HTMLInputElement;
    if (input && input.value) {
      const emailVal = input.value.trim();
      const newSub: NewsletterSubscriber = {
        id: `sub-${Date.now()}`,
        email: emailVal,
        subscribedAt: new Date().toISOString().split('T')[0],
        source: 'Website Footer'
      };
      saveSubscriberToCloud(newSub);
      broadcastLiveEvent('NEW_SUBSCRIBER', newSub);
      setSubscribers(prev => {
        if (prev.some(s => s.email.toLowerCase() === emailVal.toLowerCase())) return prev;
        const updated = [newSub, ...prev];
        try {
          localStorage.setItem('chaurasiya_subscribers', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      alert(lang === 'en' ? `Subscribed ${emailVal} successfully!` : `${emailVal} सफलतापूर्वक सदस्यता लिइयो!`);
      input.value = '';
    }
  };

  const handleDeleteSubscriber = (id: string) => {
    deleteSubscriberFromCloud(id);
    setSubscribers(prev => {
      const updated = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem('chaurasiya_subscribers', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prev => {
      const updated = prev.map(m => m.id === updatedMember.id ? updatedMember : m);
      try {
        localStorage.setItem('chaurasiya_members', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleAddNotice = async (newNotice: Notice) => {
    // 1. Immediately update local state & localStorage
    setNotices((prev) => {
      const updated = [newNotice, ...prev.filter(n => n.id !== newNotice.id)];
      try {
        localStorage.setItem('chaurasiya_notices', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save notice to localStorage', e);
      }
      return updated;
    });

    // 2. Persist using unified API abstraction
    try {
      const cleanList = notices.filter(n => n.id !== newNotice.id);
      const fullList = [newNotice, ...cleanList];
      const updatedList = await apiSave<Notice>(
        '/api/notices',
        'community_notices.json',
        fullList,
        newNotice,
        `Publish community notice: ${typeof newNotice.title === 'object' ? newNotice.title.en : newNotice.title}`,
        getAuthHeaders()
      );
      setNotices((prev) => {
        const mergedMap = new Map<string, Notice>();
        updatedList.forEach((n) => mergedMap.set(n.id, n));
        initialNotices.forEach(n => {
          if (!mergedMap.has(n.id)) mergedMap.set(n.id, n);
        });
        return Array.from(mergedMap.values());
      });
    } catch (err) {
      console.error('Failed to save notice:', err);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    const listAfterDeletion = notices.filter((n) => n.id !== id);
    setNotices((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem('chaurasiya_notices', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update localStorage', e);
      }
      return updated;
    });

    try {
      const updatedList = await apiDelete<Notice>(
        `/api/notices/${id}`,
        'community_notices.json',
        listAfterDeletion,
        `Delete community notice ID: ${id}`,
        getAuthHeaders()
      );
      setNotices((prev) => {
        const mergedMap = new Map<string, Notice>();
        updatedList.forEach((n) => mergedMap.set(n.id, n));
        initialNotices.forEach(n => {
          if (!mergedMap.has(n.id)) mergedMap.set(n.id, n);
        });
        return Array.from(mergedMap.values());
      });
    } catch (err) {
      console.error('Failed to delete notice:', err);
    }
  };

  // Glimpses of Our Journey Albums State (Initial + Server Online + LocalStorage saved)
  const [albums, setAlbums] = useState<Album[]>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_journey_albums');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customOnly = parsed.filter(p => !initialJourneyAlbums.some(i => i.id === p.id));
          return [...initialJourneyAlbums, ...customOnly];
        }
      }
    } catch (e) {
      console.error('Error loading custom albums from localStorage', e);
    }
    return initialJourneyAlbums;
  });

  // Fetch online server albums on mount so ALL users see new posts instantly
  useEffect(() => {
    apiFetch<Album[]>('/api/albums', 'journey_albums.json', [])
      .then((serverAlbums) => {
        if (Array.isArray(serverAlbums) && serverAlbums.length > 0) {
          setAlbums((prev) => {
            const mergedMap = new Map<string, Album>();
            // Add default initial albums
            initialJourneyAlbums.forEach(a => mergedMap.set(a.id, a));
            // Add or overwrite with server online custom albums
            serverAlbums.forEach(a => mergedMap.set(a.id, a));
            return Array.from(mergedMap.values());
          });
        }
      })
      .catch((err) => {
        console.warn('Backend server albums fetch failed or serverless DB not reachable:', err);
      });
  }, []);

  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleSelectAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setCurrentTab('album-detail');
    window.history.pushState({ tab: 'album-detail', albumId }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddAlbum = async (newAlbum: Album) => {
    // 1. Immediately update local state & localStorage for fast feedback
    setAlbums((prev) => {
      const updated = [newAlbum, ...prev.filter(a => a.id !== newAlbum.id)];
      try {
        localStorage.setItem('chaurasiya_journey_albums', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save album to localStorage', e);
      }
      return updated;
    });

    // 2. Persist using unified API abstraction
    try {
      const cleanList = albums.filter(a => a.id !== newAlbum.id);
      const fullList = [newAlbum, ...cleanList];
      const updatedList = await apiSave<Album>(
        '/api/albums',
        'journey_albums.json',
        fullList,
        newAlbum,
        `Post journey album: ${typeof newAlbum.title === 'object' ? newAlbum.title.en : newAlbum.title}`,
        getAuthHeaders()
      );
      setAlbums((prev) => {
        const mergedMap = new Map<string, Album>();
        initialJourneyAlbums.forEach(a => mergedMap.set(a.id, a));
        updatedList.forEach((a) => mergedMap.set(a.id, a));
        return Array.from(mergedMap.values());
      });
    } catch (err) {
      console.error('Failed to save album:', err);
    }

    // 3. Automatically navigate to the dedicated page for this newly created album post!
    setSelectedAlbumId(newAlbum.id);
    setCurrentTab('album-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddMediaToAlbum = (albumId: string, media: AlbumMediaItem) => {
    const album = albums.find(a => a.id === albumId);
    if (!album) return;
    const updatedAlbum: Album = {
      ...album,
      coverUrl: album.coverUrl || (media.type === 'photo' ? media.url : album.coverUrl),
      mediaItems: [...(album.mediaItems || []), media]
    };
    handleAddAlbum(updatedAlbum);
  };

  const handleDeleteAlbum = async (albumId: string) => {
    const listAfterDeletion = albums.filter((a) => a.id !== albumId);
    setAlbums((prev) => {
      const updated = prev.filter((a) => a.id !== albumId);
      try {
        localStorage.setItem('chaurasiya_journey_albums', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update localStorage', e);
      }
      return updated;
    });

    try {
      const updatedList = await apiDelete<Album>(
        `/api/albums/${albumId}`,
        'journey_albums.json',
        listAfterDeletion,
        `Delete journey album ID: ${albumId}`,
        getAuthHeaders()
      );
      setAlbums((prev) => {
        const mergedMap = new Map<string, Album>();
        initialJourneyAlbums.forEach(a => mergedMap.set(a.id, a));
        updatedList.forEach((a) => mergedMap.set(a.id, a));
        return Array.from(mergedMap.values());
      });
    } catch (err) {
      console.error('Failed to delete album:', err);
    }
  };

  // --- EVENTS API & Handlers ---
  useEffect(() => {
    apiFetch<CommunityEvent[]>('/api/events', 'community_events.json', [])
      .then((serverEvents) => {
        if (Array.isArray(serverEvents)) {
          if (serverEvents.length === 0) {
            setEvents(initialEvents);
          } else {
            setEvents(serverEvents);
          }
        }
      })
      .catch((err) => {
        console.warn('Offline events endpoint, falling back:', err);
        setEvents(initialEvents);
      });
  }, []);

  const handleAddEvent = async (newEvent: CommunityEvent) => {
    setEvents((prev) => {
      const updated = [newEvent, ...prev.filter((e) => e.id !== newEvent.id)];
      try {
        localStorage.setItem('chaurasiya_events', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const cleanList = events.filter(e => e.id !== newEvent.id);
      const fullList = [newEvent, ...cleanList];
      const updatedList = await apiSave<CommunityEvent>(
        '/api/events',
        'community_events.json',
        fullList,
        newEvent,
        `Add community event: ${typeof newEvent.title === 'object' ? newEvent.title.en : newEvent.title}`,
        getAuthHeaders()
      );
      setEvents(updatedList);
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const listAfterDeletion = events.filter((e) => e.id !== id);
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      try {
        localStorage.setItem('chaurasiya_events', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const updatedList = await apiDelete<CommunityEvent>(
        `/api/events/${id}`,
        'community_events.json',
        listAfterDeletion,
        `Delete community event ID: ${id}`,
        getAuthHeaders()
      );
      setEvents(updatedList);
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  // --- MEMBERS API & Handlers ---
  useEffect(() => {
    apiFetch<Member[]>('/api/members', 'community_members.json', [])
      .then((serverMembers) => {
        if (Array.isArray(serverMembers)) {
          if (serverMembers.length === 0) {
            setMembers(initialMembers);
          } else {
            setMembers(serverMembers);
          }
        }
      })
      .catch((err) => {
        console.warn('Offline members endpoint, falling back:', err);
        setMembers(initialMembers);
      });
  }, []);

  const handleDeleteMember = async (id: string) => {
    const listAfterDeletion = members.filter((m) => m.id !== id);
    setMembers((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem('chaurasiya_members', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const updatedList = await apiDelete<Member>(
        `/api/members/${id}`,
        'community_members.json',
        listAfterDeletion,
        `Delete community directory member: ${id}`,
        getAuthHeaders()
      );
      setMembers(updatedList);
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  // --- DOCUMENTS API & Handlers ---
  useEffect(() => {
    apiFetch<Document[]>('/api/documents', 'community_documents.json', [])
      .then((serverDocs) => {
        if (Array.isArray(serverDocs)) {
          if (serverDocs.length === 0) {
            setDocumentsList(initialDocuments);
          } else {
            setDocumentsList(serverDocs);
          }
        }
      })
      .catch((err) => {
        console.warn('Offline documents endpoint, falling back:', err);
        setDocumentsList(initialDocuments);
      });
  }, []);

  const handleAddDocument = async (newDoc: Document) => {
    setDocumentsList((prev) => {
      const updated = [newDoc, ...prev.filter((d) => d.id !== newDoc.id)];
      try {
        localStorage.setItem('chaurasiya_documents', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const cleanList = documentsList.filter(d => d.id !== newDoc.id);
      const fullList = [newDoc, ...cleanList];
      const updatedList = await apiSave<Document>(
        '/api/documents',
        'community_documents.json',
        fullList,
        newDoc,
        `Add community document: ${typeof newDoc.title === 'object' ? newDoc.title.en : newDoc.title}`,
        getAuthHeaders()
      );
      setDocumentsList(updatedList);
    } catch (err) {
      console.error('Failed to save document:', err);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    const listAfterDeletion = documentsList.filter((d) => d.id !== id);
    setDocumentsList((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem('chaurasiya_documents', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      const updatedList = await apiDelete<Document>(
        `/api/documents/${id}`,
        'community_documents.json',
        listAfterDeletion,
        `Delete community document ID: ${id}`,
        getAuthHeaders()
      );
      setDocumentsList(updatedList);
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  // --- SITE TEXTS API & Handlers ---
  useEffect(() => {
    apiFetch<SiteTexts>('/api/site-texts', 'site_texts.json', defaultSiteTexts)
      .then((data) => {
        if (data) {
          setSiteTexts(data);
        }
      })
      .catch((err) => console.warn('Offline siteTexts fallback:', err));
  }, []);

  const handleUpdateSiteTexts = async (updatedTexts: Partial<SiteTexts>) => {
    const nextTexts = { ...siteTexts, ...updatedTexts };
    setSiteTexts(nextTexts);
    try {
      const { enabled } = getGithubSettings();
      if (enabled) {
        await saveFileToGithub('site_texts.json', nextTexts, 'Update site global texts');
      }
    } catch (err) {
      console.error('Failed to update site texts:', err);
    }
  };

  // --- NETWORKS/CHAPTERS API & Handlers ---
  useEffect(() => {
    apiFetch<NetworkBranch[]>('/api/networks', 'community_networks.json', initialNetworks)
      .then((serverNetworks) => {
        if (Array.isArray(serverNetworks) && serverNetworks.length > 0) {
          setNetworks(serverNetworks);
        }
      })
      .catch((err) => console.warn('Offline networks endpoint:', err));
  }, []);

  const handleAddNetwork = async (newNetwork: NetworkBranch) => {
    setNetworks((prev) => {
      const filtered = prev.filter((n) => n.id !== newNetwork.id);
      return [...filtered, newNetwork];
    });

    try {
      const cleanList = networks.filter(n => n.id !== newNetwork.id);
      const fullList = [...cleanList, newNetwork];
      const updatedList = await apiSave<NetworkBranch>(
        '/api/networks',
        'community_networks.json',
        fullList,
        newNetwork,
        `Add network branch: ${newNetwork.name.en}`,
        getAuthHeaders()
      );
      setNetworks(updatedList);
    } catch (err) {
      console.error('Failed to save network:', err);
    }
  };

  const handleDeleteNetwork = async (id: string) => {
    const listAfterDeletion = networks.filter((n) => n.id !== id);
    setNetworks((prev) => prev.filter((n) => n.id !== id));
    if (selectedNetworkId === id) {
      setSelectedNetworkId(null);
      setCurrentTab('history');
    }

    try {
      const updatedList = await apiDelete<NetworkBranch>(
        `/api/networks/${id}`,
        'community_networks.json',
        listAfterDeletion,
        `Delete network branch ID: ${id}`,
        getAuthHeaders()
      );
      setNetworks(updatedList);
    } catch (err) {
      console.error('Failed to delete network:', err);
    }
  };

  // Single Blog Post Detection (Blogger XML & URL path routing)
  useEffect(() => {
    const pathname = window.location.pathname;
    const isHomepagePath = 
      pathname === '/' || 
      pathname === '/index.html' || 
      pathname === '' || 
      pathname.endsWith('/dist/') || 
      pathname.endsWith('/dist/index.html');

    if (isHomepagePath) {
      setCurrentTab('history');
      setSelectedBlogPost(null);
      return;
    }

    const detectPost = () => {
      // 1. Check if Blogger XML injected native post data in #blogger-post-data
      const postElem = document.getElementById('blogger-post-data');
      if (postElem) {
        const title = document.getElementById('blogger-post-title')?.innerText?.trim() || '';
        const author = document.getElementById('blogger-post-author')?.innerText?.trim() || 'Chaurasiya Samaj Admin';
        const date = document.getElementById('blogger-post-date')?.innerText?.trim() || '';
        const url = document.getElementById('blogger-post-url')?.innerText?.trim() || window.location.href;
        const contentHtml = document.getElementById('blogger-post-content')?.innerHTML || '';

        if (title || (contentHtml && contentHtml.length > 10)) {
          setSelectedBlogPost({
            id: 'blogger-single-post-native',
            title: { en: title, ne: title },
            content: { en: contentHtml, ne: contentHtml },
            date: date || new Date().toLocaleDateString(),
            author,
            link: url,
          });
          setCurrentTab('single-post');
          return true;
        }
      }

      // 2. Check if URL pathname is a Blogger item or page URL (e.g. /2026/07/post.html or /p/notice.html)
      const pathname = window.location.pathname;
      if (pathname.length > 3 && (pathname.includes('/20') || pathname.includes('/p/') || pathname.endsWith('.html'))) {
        // Try fetching exact post via Blogger Path Feed API
        const pathFeedUrl = `/feeds/posts/default?alt=json&path=${encodeURIComponent(pathname)}`;
        fetch(pathFeedUrl)
          .then((res) => res.json())
          .then((data) => {
            const entry = data.feed?.entry?.[0] || data.entry;
            if (entry) {
              const contentStr = entry.content?.$t || entry.summary?.$t || '';
              const imgMatch = contentStr.match(/<img[^>]+src="([^">]+)"/i);
              const imageUrl = imgMatch ? imgMatch[1] : undefined;
              const link = entry.link?.find((l: any) => l.rel === 'alternate')?.href || window.location.href;
              const titleText = entry.title?.$t || 'Blog Article';

              setSelectedBlogPost({
                id: entry.id?.$t || 'path-post',
                title: { en: titleText, ne: titleText },
                content: { en: contentStr, ne: contentStr },
                date: new Date(entry.published?.$t || Date.now()).toLocaleDateString(),
                author: entry.author?.[0]?.name?.$t || 'Admin',
                imageUrl,
                link,
                tags: entry.category ? entry.category.map((c: any) => c.term) : [],
              });
              setCurrentTab('single-post');
              return;
            }
            throw new Error('Path feed empty');
          })
          .catch(() => {
            // Fallback: fetch default recent posts feed and search by pathname
            fetch('/feeds/posts/default?alt=json')
              .then((res) => res.json())
              .then((data) => {
                const entries = data.feed?.entry || [];
                const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
                const matched = entries.find((e: any) => {
                  const altLink = e.link?.find((l: any) => l.rel === 'alternate')?.href || '';
                  return altLink.includes(cleanPath) || pathname.includes(e.id?.$t);
                });

                if (matched) {
                  const contentStr = matched.content?.$t || matched.summary?.$t || '';
                  const imgMatch = contentStr.match(/<img[^>]+src="([^">]+)"/i);
                  const imageUrl = imgMatch ? imgMatch[1] : undefined;
                  const link = matched.link?.find((l: any) => l.rel === 'alternate')?.href || window.location.href;

                  setSelectedBlogPost({
                    id: matched.id?.$t || 'matched-post',
                    title: { en: matched.title?.$t || 'Blog Article', ne: matched.title?.$t || 'ब्लग पोस्ट' },
                    content: { en: contentStr, ne: contentStr },
                    date: new Date(matched.published?.$t || Date.now()).toLocaleDateString(),
                    author: matched.author?.[0]?.name?.$t || 'Admin',
                    imageUrl,
                    link,
                    tags: matched.category ? matched.category.map((c: any) => c.term) : [],
                  });
                  setCurrentTab('single-post');
                }
              })
              .catch(() => {});
          });
      }
      return false;
    };

    detectPost();
    const timer = setTimeout(detectPost, 400);
    return () => clearTimeout(timer);
  }, []);

  // Simulated live metrics state
  const [metrics, setMetrics] = useState<AnalyticsMetric>({
    pageViews: 1248,
    newsletterSubscribers: 342,
    donationsReceived: 45000,
    membersRegistered: 218,
    xmlDownloads: 89,
    buttonClicks: {
      'Explore Platform Load': 1248,
    },
  });

  // Track page view, simulate SEO meta tags
  useEffect(() => {
    // Increment page session metric on startup
    setMetrics((prev) => ({
      ...prev,
      pageViews: prev.pageViews + 1,
    }));

    // Simulate standard SEO tags (Title, Meta Description)
    document.title = lang === 'en' ? 'Chaurasiya Samaj Nepal | Official NGO Website' : 'चौरसिया समाज नेपाल | आधिकारिक NGO वेबसाइट';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', lang === 'en' 
        ? 'Official NGO website of Chaurasiya Samaj Nepal. Dedicated to preserving betel leaf culture, education, healthcare, and humanitarian efforts.'
        : 'चौरसिया समाज नेपालको आधिकारिक NGO वेबसाइट। पान संस्कृति, शिक्षा, स्वास्थ्य सेवा, र मानवीय प्रयासहरूको संरक्षण गर्न समर्पित।'
      );
    }

    // Inject JSON-LD Schema for NGO
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NGO",
      "name": "Chaurasiya Samaj Nepal",
      "url": "https://chaurasiyasumaj.org.np",
      "logo": "https://chaurasiyasumaj.org.np/logo.png",
      "description": "Dedicated to unifying community coordinators, supporting traditional cultivation, and providing healthcare.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ghantaghar Path",
        "addressLocality": "Birgunj",
        "addressRegion": "Madhesh Province",
        "addressCountry": "NP"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+977-9812345678",
        "contactType": "customer service"
      }
    });
    
    // Cleanup any existing schema to prevent duplicates on re-render
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) existingSchema.remove();
    
    document.head.appendChild(schemaScript);
  }, [lang]);

  const handleTrackAction = useCallback((actionName: string) => {
    setMetrics((prev) => {
      const updatedClicks = { ...prev.buttonClicks };
      updatedClicks[actionName] = (updatedClicks[actionName] || 0) + 1;
      return {
        ...prev,
        buttonClicks: updatedClicks,
      };
    });
  }, []);

  // Theme (Dark Mode) State & effect
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('chaurasiya_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('chaurasiya_theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    handleTrackAction(`Toggle theme to ${theme === 'light' ? 'dark' : 'light'}`);
  };

  const handleAddMemberNomination = async (newMember: Member) => {
    const hasId = !!newMember.id && !newMember.id.startsWith('temp_new_');
    const memberWithId: Member = hasId ? newMember : {
      ...newMember,
      id: `m-nom-${Date.now()}`,
    };

    let displayMember = { ...memberWithId };

    if (displayMember.photoBase64 && displayMember.photoName) {
      try {
        const fileName = `${Date.now()}_${displayMember.photoName.replace(/[^a-z0-9.]/gi, '_')}`;
        const uploadedUrl = await uploadImageToGithub(fileName, displayMember.photoBase64, `Upload photo for member ${displayMember.name.en}`);
        displayMember.avatarUrl = uploadedUrl;
        displayMember.photoBase64 = undefined;
        displayMember.photoName = undefined;
      } catch (err) {
        console.error("Failed to upload image to Github", err);
        if (!displayMember.avatarUrl) {
          displayMember.avatarUrl = displayMember.photoBase64;
        }
      }
    } else if (!displayMember.avatarUrl && displayMember.photoBase64) {
      displayMember.avatarUrl = displayMember.photoBase64;
    }

    setMembers((prev) => {
      const exists = prev.some((m) => m.id === displayMember.id);
      const updated = exists
        ? prev.map((m) => (m.id === displayMember.id ? displayMember : m))
        : [...prev, displayMember];
      try {
        localStorage.setItem('chaurasiya_members', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (!hasId && !displayMember.chapterId) {
      setMetrics((prev) => ({
        ...prev,
        membersRegistered: prev.membersRegistered + 1,
      }));
    }

    try {
      // Need members array from state. We use members from scope.
      const cleanList = members.filter(m => m.id !== displayMember.id);
      const fullList = [...cleanList, displayMember];
      const updatedList = await apiSave<Member>(
        '/api/members',
        'community_members.json',
        fullList,
        displayMember,
        `Nominate/Update community member: ${displayMember.name.en}`,
        getAuthHeaders()
      );
      setMembers(updatedList);
      try {
        localStorage.setItem('chaurasiya_members', JSON.stringify(updatedList));
      } catch (e) {}
    } catch (e) {
      console.error('Failed to save member nomination:', e);
    }
  };

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setMetrics((prev) => ({
      ...prev,
      newsletterSubscribers: prev.newsletterSubscribers + 1,
    }));
    handleTrackAction('Subscribed to Newsletter');
    alert(lang === 'en' ? 'Successfully subscribed to the newsletter!' : 'समाचार पत्रको सफलतापूर्वक सदस्यता लिनुभयो!');
  };

  const handleAddDonation = (amount: number) => {
    setMetrics((prev) => ({
      ...prev,
      donationsReceived: prev.donationsReceived + amount,
    }));
  };

  const handleXmlDownload = () => {
    setMetrics((prev) => ({
      ...prev,
      xmlDownloads: prev.xmlDownloads + 1,
    }));
  };

  const handleResetMetrics = () => {
    setMetrics({
      pageViews: 1250,
      newsletterSubscribers: 342,
      donationsReceived: 45000,
      membersRegistered: 218,
      xmlDownloads: 89,
      buttonClicks: {
        'Simulate Telemetry Refresh': 1,
      },
    });
  };

  // Mobile Browser & History Back Button Management
  useEffect(() => {
    // Standardize initial history state as homepage root
    if (!window.history.state) {
      window.history.replaceState({ tab: 'history' }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state && state.tab && state.tab !== 'history') {
        setCurrentTab(state.tab);
        setSelectedLeaderId(state.leaderId || null);
        setSelectedNetworkId(state.networkId || null);
        setSelectedAlbumId(state.albumId || null);
        if (!state.postId) {
          setSelectedBlogPost(null);
        }
      } else {
        // Mobile back button pressed or popped to base: Cancel any active page and return to Homepage!
        setCurrentTab('history');
        setSelectedLeaderId(null);
        setSelectedNetworkId(null);
        setSelectedAlbumId(null);
        setSelectedBlogPost(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Switch tab scroll helper
  const handleNavigate = (tabId: string) => {
    if (tabId !== currentTab) {
      window.history.pushState({ tab: tabId }, '');
    }
    setCurrentTab(tabId);
    if (tabId !== 'single-post') {
      setSelectedBlogPost(null);
    }
    if (tabId !== 'leader-detail') {
      setSelectedLeaderId(null);
    }
    if (tabId !== 'chapter-detail') {
      setSelectedNetworkId(null);
    }
    if (tabId !== 'album-detail') {
      setSelectedAlbumId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If currently on a Blogger single post URL and user clicks Home / Navigation
    if (window.location.pathname.includes('.html') || window.location.pathname.includes('/20')) {
      if (tabId === 'history') {
        window.location.href = '/';
      }
    }
  };

  const handleSelectLeader = (id: string | null) => {
    setSelectedLeaderId(id);
    if (id) {
      window.history.pushState({ tab: 'history', leaderId: id }, '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectPost = (post: SinglePostData) => {
    setSelectedBlogPost(post);
    setCurrentTab('single-post');
    window.history.pushState({ tab: 'single-post', postId: post.id }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNetwork = (id: string) => {
    setSelectedNetworkId(id);
    setCurrentTab('chapter-detail');
    window.history.pushState({ tab: 'chapter-detail', networkId: id }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = {
    tagline: {
      en: 'A dedicated social platform preserving betel leaf culture & serving humanity',
      ne: 'पान संस्कृतिको संरक्षण र मानव सेवामा समर्पित एक सामाजिक संस्था',
    },
    designedBy: {
      en: 'Designed and Engineered with love by Abhishek Kumar Chaurasiya',
      ne: 'अभिषेक कुमार चौरसियाद्वारा माया र लगावका साथ डिजाइन तथा निर्माण गरिएको',
    },
    rights: {
      en: '© 2026 Chaurasiya Samaj Nepal. All Rights Reserved.',
      ne: '© २०२६ चौरसिया समाज नेपाल। सर्वाधिकार सुरक्षित।',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans selection:bg-teal-200 selection:text-teal-950 transition-colors duration-200 overflow-x-clip">
      {/* Fixed Sticky Header Wrapper containing logo and navigation menu */}
      <header className="sticky top-0 z-50 shadow-md bg-white dark:bg-slate-900 transition-all">
        {/* Brand Top bar */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-teal-50 text-[11px] sm:text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-teal-800/40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="font-bold flex items-center gap-2 tracking-wide uppercase">
              <div className="w-5 h-5 rounded-full bg-white overflow-hidden flex items-center justify-center p-0.5 shadow-sm">
                <img src={siteTexts.logoUrl || logoImg} alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              {lang === 'en' ? siteTexts.taglineEn : siteTexts.taglineNe}
            </span>
            <div className="flex items-center gap-4 text-emerald-200 font-medium">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> SWC Registered</span>
              <span className="hidden sm:inline opacity-50">|</span>
              <span className="hidden sm:inline hover:text-white transition-colors cursor-pointer">✉️ {siteTexts.footerEmail}</span>
            </div>
          </div>
        </div>

        {/* Navigation header */}
        <Navigation
          currentTab={currentTab}
          setCurrentTab={handleNavigate}
          lang={lang}
          setLang={setLang}
          onTrackAction={handleTrackAction}
          isAdmin={isAdmin}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
          siteTexts={siteTexts}
          pendingNotificationsCount={matrimonialProfiles.filter(p => p.status === 'pending').length + volunteerApps.filter(v => v.status === 'pending').length + membershipApps.filter(m => m.status === 'pending').length}
        />
      </header>

      {/* Main body viewport container */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {currentTab === 'history' && (
          <HistorySection
            lang={lang}
            onNavigate={handleNavigate}
            onTrackAction={handleTrackAction}
            onSelectLeader={handleSelectLeader}
            membersList={members.filter(m => !m.chapterId)}
            onSelectPost={handleSelectPost}
            onSelectAlbum={handleSelectAlbum}
            albums={albums.filter(a => !a.chapterId)}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            isAdmin={isAdmin}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
            onDeleteAlbum={handleDeleteAlbum}
            onOpenAddNoticeModal={() => setIsAddNoticeModalOpen(true)}
            onDeleteNotice={handleDeleteNotice}
            noticesList={notices.filter(n => !n.chapterId)}
            siteTexts={siteTexts}
            onUpdateSiteTexts={handleUpdateSiteTexts}
            networks={networks}
            onSelectNetwork={handleSelectNetwork}
            onAddNetwork={handleAddNetwork}
            onDeleteNetwork={handleDeleteNetwork}
          />
        )}

        {currentTab === 'chapter-detail' && (
          (() => {
            const currentBranch = networks.find((n) => n.id === selectedNetworkId);
            if (!currentBranch) return null;
            return (
              <NetworkBranchDetail
                branch={currentBranch}
                lang={lang}
                isAdmin={isAdmin}
                onBack={() => handleNavigate('history')}
                members={members}
                onAddMember={handleAddMemberNomination}
                onDeleteMember={handleDeleteMember}
                events={events}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
                notices={notices}
                onAddNotice={handleAddNotice}
                onDeleteNotice={handleDeleteNotice}
                albums={albums}
                onAddAlbum={handleAddAlbum}
                onDeleteAlbum={handleDeleteAlbum}
              />
            );
          })()
        )}

        {currentTab === 'privacy' && (
          <PrivacySection
            lang={lang}
            isAdmin={isAdmin}
            siteTexts={siteTexts}
            onUpdateSiteTexts={handleUpdateSiteTexts}
            onTrackAction={handleTrackAction}
          />
        )}

        {currentTab === 'terms' && (
          <TermsSection
            lang={lang}
            isAdmin={isAdmin}
            siteTexts={siteTexts}
            onUpdateSiteTexts={handleUpdateSiteTexts}
            onTrackAction={handleTrackAction}
          />
        )}

        {currentTab === 'single-post' && selectedBlogPost && (
          <BlogPostDetail
            post={selectedBlogPost}
            lang={lang}
            onBackToHome={() => handleNavigate('history')}
            onTrackAction={handleTrackAction}
            onSelectPost={(post) => {
              setSelectedBlogPost(post);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'albums-gallery' && (
          <AlbumGallery
            lang={lang}
            onTrackAction={handleTrackAction}
            onBackToHome={() => handleNavigate('history')}
            albums={albums.filter(a => !a.chapterId)}
            onSelectAlbum={handleSelectAlbum}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            isAdmin={isAdmin}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
            onDeleteAlbum={handleDeleteAlbum}
            onAddMedia={handleAddMediaToAlbum}
          />
        )}

        {currentTab === 'album-detail' && (
          <div className="space-y-6">
            {(() => {
              const currentAlbum = albums.find((a) => a.id === selectedAlbumId) || albums[0];
              if (!currentAlbum) return null;
              return (
                <AlbumDetail
                  album={currentAlbum}
                  lang={lang}
                  isAdmin={isAdmin}
                  onClose={() => handleNavigate('albums-gallery')}
                  onTrackAction={handleTrackAction}
                  onAddMedia={handleAddMediaToAlbum}
                />
              );
            })()}
          </div>
        )}

        {currentTab === 'leader-bio' && (
          <LeaderBio
            lang={lang}
            leaderId={selectedLeaderId}
            onTrackAction={handleTrackAction}
            members={members}
            onUpdateMember={handleUpdateMember}
            isAdmin={isAdmin}
          />
        )}

        {currentTab === 'matrimonial' && (
          <MatrimonialSection
            lang={lang}
            profiles={matrimonialProfiles}
            onAddProfile={handleAddMatrimonialProfile}
            onTrackAction={handleTrackAction}
            isAdmin={isAdmin}
            onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
          />
        )}

        {currentTab === 'notices-gallery' && (
          <NoticeGallery
            lang={lang}
            onSubscribe={() => {}}
            onTrackAction={handleTrackAction}
            isAdmin={isAdmin}
            onOpenAddNoticeModal={() => setIsAddNoticeModalOpen(true)}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
            noticesList={notices.filter(n => !n.chapterId)}
            onDeleteNotice={handleDeleteNotice}
          />
        )}

        {currentTab === 'directory' && (
          <DirectorySection
            lang={lang}
            onAddMember={handleAddMemberNomination}
            onTrackAction={handleTrackAction}
            isAdmin={isAdmin}
            membersList={members.filter(m => !m.chapterId)}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {currentTab === 'events' && (
          <EventsSection
            lang={lang}
            onRegisterVolunteer={() => handleTrackAction('Submit Volunteer signup')}
            onTrackAction={handleTrackAction}
            isAdmin={isAdmin}
            eventsList={events.filter(e => !e.chapterId)}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {currentTab === 'membership-donation' && (
          <MembershipDonation
            lang={lang}
            onAddMembershipApp={handleAddMembershipApp}
            onAddVolunteerApp={handleAddVolunteerApp}
            onAddMember={() => {
              setMetrics((prev) => ({
                ...prev,
                membersRegistered: prev.membersRegistered + 1,
              }));
            }}
            onAddDonation={handleAddDonation}
            onTrackAction={handleTrackAction}
          />
        )}

        {currentTab === 'abhishek-bio' && (
          <AbhishekBio
            lang={lang}
            onTrackAction={handleTrackAction}
          />
        )}

        {currentTab === 'blogger-exporter' && (
          <BloggerXmlExporter
            lang={lang}
            onDownload={handleXmlDownload}
            onTrackAction={handleTrackAction}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsDashboard
            lang={lang}
            metrics={metrics}
            onResetMetrics={handleResetMetrics}
            onTrackAction={handleTrackAction}
          />
        )}

        {currentTab === 'transparency' && (
          <TransparencySection
            lang={lang}
            onTrackAction={handleTrackAction}
            isAdmin={isAdmin}
            documentsList={documentsList}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {currentTab === 'contact' && (
          <ContactSection
            lang={lang}
            onTrackAction={handleTrackAction}
          />
        )}
      </main>

      {/* Enhanced NGO Footer */}
      <footer className="bg-gray-900 text-white border-t-8 border-emerald-500 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-12">
          
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white overflow-hidden flex items-center justify-center">
                <img src={siteTexts.logoUrl || logoImg} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                {lang === 'en' ? siteTexts.logoTextEn : siteTexts.logoTextNe}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-medium pr-4">
              {(lang === 'en' ? siteTexts.taglineEn : siteTexts.taglineNe) + " " + (lang === 'en' ? siteTexts.footerAboutEn : siteTexts.footerAboutNe)}
            </p>
            <div className="flex gap-4 pt-2">
               {siteTexts.socialFb && (
                 <a href={siteTexts.socialFb} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors text-gray-400 hover:text-white" title="Facebook">
                   <Facebook className="w-4 h-4" />
                 </a>
               )}
               {siteTexts.socialTw && (
                 <a href={siteTexts.socialTw} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors text-gray-400 hover:text-white" title="Twitter">
                   <Twitter className="w-4 h-4" />
                 </a>
               )}
               {siteTexts.socialIg && (
                 <a href={siteTexts.socialIg} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors text-gray-400 hover:text-white" title="Instagram">
                   <Instagram className="w-4 h-4" />
                 </a>
               )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400 font-medium">
              <button onClick={() => handleNavigate('history')} className="hover:text-emerald-400 text-left transition-colors">About Us</button>
              <button onClick={() => handleNavigate('events')} className="hover:text-emerald-400 text-left transition-colors">Projects & Programs</button>
              <button onClick={() => handleNavigate('directory')} className="hover:text-emerald-400 text-left transition-colors">Committee Members</button>
              <button onClick={() => handleNavigate('transparency')} className="hover:text-emerald-400 text-left transition-colors">Transparency</button>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="font-bold text-white mb-4">Headquarters</h4>
            <div className="text-sm text-gray-400 space-y-3 font-medium">
              <p className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">📍</span> 
                {lang === 'en' ? siteTexts.footerAddressEn : siteTexts.footerAddressNe}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-500">📞</span> 
                {formatNumber(siteTexts.footerPhone, lang)}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-500">✉️</span> 
                {siteTexts.footerEmail}
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="font-bold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 font-medium mb-4">Subscribe to our newsletter for the latest updates on projects and events.</p>
            <form onSubmit={handleNewsletterSubscribeSubmit} className="flex flex-col gap-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  placeholder="Email address..." 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Credit Line */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
          <span>{formatNumber(t.rights[lang], lang)} | {formatNumber(lang === 'en' ? 'Reg: 12345/071' : 'दर्ता नं: १२३४५/०त्१', lang)}</span>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button onClick={() => handleNavigate('privacy')} className="hover:text-emerald-400 transition-colors">{lang === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}</button>
            <button onClick={() => handleNavigate('terms')} className="hover:text-emerald-400 transition-colors">{lang === 'en' ? 'Terms of Service' : 'सेवाका सर्तहरू'}</button>
          </div>
        </div>

        {/* Small, sweet & responsive Architect section at the very bottom */}
        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-gray-800/40 flex justify-center">
          <button
            onClick={() => handleNavigate('abhishek-bio')}
            className="inline-flex items-center gap-2.5 pl-1.5 pr-3 py-1 bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-300 hover:text-emerald-200 border border-emerald-800/20 hover:border-emerald-700/40 rounded-full transition-all text-xs font-bold shadow-sm group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden border border-emerald-500/40 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"
                alt="Abhishek Kumar Chaurasiya"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="whitespace-normal text-left">
              {lang === 'en' ? 'Designed & Maintained by' : 'डिजाइन र मर्मत सम्भार:'}{' '}
              <span className="font-extrabold text-white group-hover:underline">Abhishek Kumar Chaurasiya</span>
            </span>
          </button>
        </div>
      </footer>

      {/* Admin Floating Console Button */}
      {isAdmin && (
        <button
          onClick={() => setIsAdminDashboardOpen(true)}
          className="fixed bottom-6 left-6 z-50 px-4 py-3 bg-teal-950 text-emerald-300 border border-emerald-500/40 rounded-2xl shadow-2xl flex items-center gap-2 hover:bg-teal-900 transition-all font-extrabold text-xs cursor-pointer"
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          {lang === 'en' ? 'Central Admin Console' : 'केन्द्रीय प्रशासन'}
        </button>
      )}

      {/* Floating Real-time Cloud Database Notification Toast */}
      {liveToast && (
        <div className="fixed bottom-24 right-6 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 text-lg font-bold shrink-0">
            🔔
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Live Cloud Sync (Firebase)</span>
              <button onClick={() => setLiveToast(null)} className="text-gray-400 hover:text-white font-bold text-xs p-1 cursor-pointer">✕</button>
            </div>
            <p className="text-xs font-extrabold text-white leading-snug">{liveToast}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-medium">Click Central Admin to view and process request.</p>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/9779812345678" 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={() => handleTrackAction('Click WhatsApp Float')}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* Upload Journey Post & Media Creation Modal */}
      <UploadJourneyPostModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        lang={lang}
        onAddAlbum={handleAddAlbum}
        existingAlbums={albums}
        isAdmin={isAdmin}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        lang={lang}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {/* Admin Central Operations Dashboard Modal */}
      <AdminCentralDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        lang={lang}
        matrimonialProfiles={matrimonialProfiles}
        onUpdateMatrimonialStatus={handleUpdateMatrimonialStatus}
        onDeleteMatrimonialProfile={handleDeleteMatrimonialProfile}
        volunteerApps={volunteerApps}
        onUpdateVolunteerStatus={handleUpdateVolunteerStatus}
        onDeleteVolunteerApp={handleDeleteVolunteerApp}
        membershipApps={membershipApps}
        onApproveMembershipApp={handleApproveMembershipApp}
        onRejectMembershipApp={handleRejectMembershipApp}
        subscribers={subscribers}
        onDeleteSubscriber={handleDeleteSubscriber}
        members={members}
      />

      {/* Add Community Notice Modal */}
      <AddNoticeModal
        isOpen={isAddNoticeModalOpen}
        onClose={() => setIsAddNoticeModalOpen(false)}
        lang={lang}
        onAddNotice={handleAddNotice}
      />
    </div>
  );
}
