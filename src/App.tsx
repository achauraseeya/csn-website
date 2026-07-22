import React, { useState, useEffect, useCallback } from 'react';
import { Leaf, Award, Heart, Shield, Landmark, MessageCircle, Mail } from 'lucide-react';
import { Language, AnalyticsMetric, Member, Album, Notice, Document, CommunityEvent } from './types';
import { notices as initialNotices, boardMembers as initialMembers, upcomingEvents as initialEvents, documents as initialDocuments } from './data/communityData';
import { journeyAlbums as initialJourneyAlbums } from './data/albumsData';
import logoImg from './assets/images/chaurasiya_logo_1784519579895.jpg';

import Navigation from './components/Navigation';
import HistorySection from './components/HistorySection';
import AlbumGallery from './components/AlbumGallery';
import AlbumDetail from './components/AlbumDetail';
import BlogPostDetail, { SinglePostData } from './components/BlogPostDetail';
import NoticeGallery from './components/NoticeGallery';
import DirectorySection from './components/DirectorySection';
import EventsSection from './components/EventsSection';
import MembershipDonation from './components/MembershipDonation';
import AbhishekBio from './components/AbhishekBio';
import LeaderBio from './components/LeaderBio';
import BloggerXmlExporter from './components/BloggerXmlExporter';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TransparencySection from './components/TransparencySection';
import ContactSection from './components/ContactSection';
import UploadJourneyPostModal from './components/UploadJourneyPostModal';
import AdminLoginModal from './components/AdminLoginModal';
import AddNoticeModal from './components/AddNoticeModal';

export default function App() {
  // Default language turned to 'en' (English) as requested
  const [lang, setLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('history');
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<SinglePostData | null>(null);
  
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
  const [isAddNoticeModalOpen, setIsAddNoticeModalOpen] = useState(false);

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

  // Fetch online server notices on mount so ALL visitors see new notices automatically!
  useEffect(() => {
    fetch('/api/notices')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.notices) && data.notices.length > 0) {
          setNotices((prev) => {
            const serverNotices: Notice[] = data.notices;
            const mergedMap = new Map<string, Notice>();
            // Add server online custom notices first
            serverNotices.forEach(n => mergedMap.set(n.id, n));
            // Add initial static notices if not present
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
        console.warn('Backend server /api/notices not reachable:', err);
      });
  }, []);

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

    // 2. Persist online to Express backend server so EVERY visitor online sees this notice!
    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotice),
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.notices)) {
        setNotices((prev) => {
          const mergedMap = new Map<string, Notice>();
          data.notices.forEach((n: Notice) => mergedMap.set(n.id, n));
          initialNotices.forEach(n => {
            if (!mergedMap.has(n.id)) {
              mergedMap.set(n.id, n);
            }
          });
          return Array.from(mergedMap.values());
        });
      }
    } catch (err) {
      console.error('Failed to save notice to online server:', err);
    }
  };

  const handleDeleteNotice = async (id: string) => {
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
      await fetch(`/api/notices/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete notice on server:', err);
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
    fetch('/api/albums')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.albums) && data.albums.length > 0) {
          setAlbums((prev) => {
            const serverAlbums: Album[] = data.albums;
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
        console.warn('Backend server /api/albums not reachable, using offline state:', err);
      });
  }, []);

  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleSelectAlbum = (albumId: string) => {
    setSelectedAlbumId(albumId);
    setCurrentTab('album-detail');
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

    // 2. Persist online to Express backend server so EVERY visitor online sees this post!
    try {
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlbum),
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.albums)) {
        setAlbums((prev) => {
          const mergedMap = new Map<string, Album>();
          initialJourneyAlbums.forEach(a => mergedMap.set(a.id, a));
          data.albums.forEach((a: Album) => mergedMap.set(a.id, a));
          return Array.from(mergedMap.values());
        });
      }
    } catch (err) {
      console.error('Failed to save album to online server:', err);
    }

    // 3. Automatically navigate to the dedicated page for this newly created album post!
    setSelectedAlbumId(newAlbum.id);
    setCurrentTab('album-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAlbum = async (albumId: string) => {
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
      await fetch(`/api/albums/${albumId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete album on server:', err);
    }
  };

  // --- EVENTS API & Handlers ---
  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.events)) {
          if (data.events.length === 0) {
            // First time seeding the backend
            initialEvents.forEach(async (evt) => {
              try {
                await fetch('/api/events', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(evt),
                });
              } catch (e) {}
            });
            setEvents(initialEvents);
          } else {
            setEvents(data.events);
          }
        }
      })
      .catch((err) => console.warn('Offline events endpoint:', err));
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
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
    } catch (err) {
      console.error('Failed to save event on server:', err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      try {
        localStorage.setItem('chaurasiya_events', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete event on server:', err);
    }
  };

  // --- MEMBERS API & Handlers ---
  useEffect(() => {
    fetch('/api/members')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.members)) {
          if (data.members.length === 0) {
            // First time seeding the backend
            initialMembers.forEach(async (m) => {
              try {
                await fetch('/api/members', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(m),
                });
              } catch (e) {}
            });
            setMembers(initialMembers);
          } else {
            setMembers(data.members);
          }
        }
      })
      .catch((err) => console.warn('Offline members endpoint:', err));
  }, []);

  const handleDeleteMember = async (id: string) => {
    setMembers((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem('chaurasiya_members', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      await fetch(`/api/members/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete member on server:', err);
    }
  };

  // --- DOCUMENTS API & Handlers ---
  useEffect(() => {
    fetch('/api/documents')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.documents)) {
          if (data.documents.length === 0) {
            // First time seeding the backend
            initialDocuments.forEach(async (d) => {
              try {
                await fetch('/api/documents', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(d),
                });
              } catch (e) {}
            });
            setDocumentsList(initialDocuments);
          } else {
            setDocumentsList(data.documents);
          }
        }
      })
      .catch((err) => console.warn('Offline documents endpoint:', err));
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
      await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc),
      });
    } catch (err) {
      console.error('Failed to save document on server:', err);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setDocumentsList((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem('chaurasiya_documents', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete document on server:', err);
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

  const handleAddMemberNomination = async (newMember: Omit<Member, 'id'>) => {
    const memberWithId: Member = {
      ...newMember,
      id: `m-nom-${Date.now()}`,
    };
    setMembers((prev) => {
      const updated = [...prev, memberWithId];
      try {
        localStorage.setItem('chaurasiya_members', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setMetrics((prev) => ({
      ...prev,
      membersRegistered: prev.membersRegistered + 1,
    }));

    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberWithId),
      });
    } catch (e) {
      console.error('Failed to save member to server:', e);
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

  // Switch tab scroll helper
  const handleNavigate = (tabId: string) => {
    setCurrentTab(tabId);
    if (tabId !== 'single-post') {
      setSelectedBlogPost(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If currently on a Blogger single post URL and user clicks Home / Navigation
    if (window.location.pathname.includes('.html') || window.location.pathname.includes('/20')) {
      if (tabId === 'history') {
        window.location.href = '/';
      }
    }
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
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans selection:bg-teal-200 selection:text-teal-950">
      {/* Brand Top bar */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-teal-50 text-[11px] sm:text-xs py-2.5 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-bold flex items-center gap-2 tracking-wide uppercase">
            <div className="w-5 h-5 rounded-full bg-white overflow-hidden flex items-center justify-center p-0.5 shadow-sm">
              <img src={logoImg} alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            {t.tagline[lang]}
          </span>
          <div className="flex items-center gap-4 text-emerald-200 font-medium">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> SWC Registered</span>
            <span className="hidden sm:inline opacity-50">|</span>
            <span className="hidden sm:inline hover:text-white transition-colors cursor-pointer">✉️ achauraseeya@gmail.com</span>
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
      />

      {/* Main body viewport container */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {currentTab === 'history' && (
          <HistorySection
            lang={lang}
            onNavigate={handleNavigate}
            onTrackAction={handleTrackAction}
            onSelectLeader={setSelectedLeaderId}
            onSelectPost={(post) => {
              setSelectedBlogPost(post);
              setCurrentTab('single-post');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectAlbum={handleSelectAlbum}
            albums={albums}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            isAdmin={isAdmin}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
            onDeleteAlbum={handleDeleteAlbum}
            onOpenAddNoticeModal={() => setIsAddNoticeModalOpen(true)}
            onDeleteNotice={handleDeleteNotice}
            noticesList={notices}
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
            albums={albums}
            onSelectAlbum={handleSelectAlbum}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            isAdmin={isAdmin}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
            onDeleteAlbum={handleDeleteAlbum}
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
                  onClose={() => handleNavigate('albums-gallery')}
                  onTrackAction={handleTrackAction}
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
            noticesList={notices}
            onDeleteNotice={handleDeleteNotice}
          />
        )}

        {currentTab === 'directory' && (
          <DirectorySection
            lang={lang}
            onAddMember={handleAddMemberNomination}
            onTrackAction={handleTrackAction}
            isAdmin={isAdmin}
            membersList={members}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {currentTab === 'events' && (
          <EventsSection
            lang={lang}
            onRegisterVolunteer={() => handleTrackAction('Submit Volunteer signup')}
            onTrackAction={handleTrackAction}
            isAdmin={isAdmin}
            eventsList={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {currentTab === 'membership-donation' && (
          <MembershipDonation
            lang={lang}
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
                <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">Chaurasiya Samaj</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-medium pr-4">
              {t.tagline[lang]} We are dedicated to unifying community coordinators, supporting traditional cultivation, and providing essential healthcare and youth education programs.
            </p>
            <div className="flex gap-4 pt-2">
               {/* Social Icons Placeholder */}
               <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer text-gray-400 hover:text-white">fb</div>
               <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer text-gray-400 hover:text-white">tw</div>
               <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer text-gray-400 hover:text-white">ig</div>
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
                Ghantaghar Path, Birgunj, Parsa, Madhesh Province, Nepal
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-500">📞</span> 
                +977-9812345678
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-500">✉️</span> 
                achauraseeya@gmail.com
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="font-bold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 font-medium mb-4">Subscribe to our newsletter for the latest updates on projects and events.</p>
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  placeholder="Email address..." 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold py-2.5 rounded-lg text-sm transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Credit Line */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
          <span>{t.rights[lang]} | Reg: 12345/071</span>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNavigate('transparency')} className="hover:text-emerald-400 transition-colors">Privacy Policy</button>
            <button onClick={() => handleNavigate('transparency')} className="hover:text-emerald-400 transition-colors">Terms of Service</button>
            <button
              onClick={() => handleNavigate('abhishek-bio')}
              className="hover:text-emerald-400 transition-colors border-l border-gray-700 pl-6 flex items-center gap-2"
            >
              👨‍💻 {t.designedBy[lang]}
            </button>
          </div>
        </div>
      </footer>

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
