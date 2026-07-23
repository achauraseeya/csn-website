import React, { useState } from 'react';
import { 
  ArrowLeft, Users, Calendar, Bell, Image as ImageIcon, Video, 
  MapPin, Plus, Trash2, Edit, X, Upload, Globe, Mail, Phone, 
  Clock, Sparkles, Youtube, ChevronLeft, ChevronRight, Play, ExternalLink, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Language, Member, CommunityEvent, Notice, Album, 
  NetworkBranch, AlbumMediaItem 
} from '../types';
import { getBestAlbumCover, getGoogleDriveDownloadUrl } from '../utils/mediaUrl';

interface NetworkBranchDetailProps {
  branch: NetworkBranch;
  lang: Language;
  isAdmin: boolean;
  onBack: () => void;
  members: Member[];
  onAddMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  events: CommunityEvent[];
  onAddEvent: (event: CommunityEvent) => void;
  onDeleteEvent: (id: string) => void;
  notices: Notice[];
  onAddNotice: (notice: Notice) => void;
  onDeleteNotice: (id: string) => void;
  albums: Album[];
  onAddAlbum: (album: Album) => void;
  onDeleteAlbum: (id: string) => void;
}

export default function NetworkBranchDetail({
  branch,
  lang,
  isAdmin,
  onBack,
  members,
  onAddMember,
  onDeleteMember,
  events,
  onAddEvent,
  onDeleteEvent,
  notices,
  onAddNotice,
  onDeleteNotice,
  albums,
  onAddAlbum,
  onDeleteAlbum
}: NetworkBranchDetailProps) {
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'events' | 'notices' | 'gallery'>('members');
  
  // Filtering branch-specific content
  const branchMembers = members.filter(m => m.chapterId === branch.id);
  const branchEvents = events.filter(e => e.chapterId === branch.id);
  const branchNotices = notices.filter(n => n.chapterId === branch.id);
  const branchAlbums = albums.filter(a => a.chapterId === branch.id);

  // Modals state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedAlbumForMedia, setSelectedAlbumForMedia] = useState<Album | null>(null);

  // Edit / Add Form States
  // 1. Member Form
  const [memberNameEn, setMemberNameEn] = useState('');
  const [memberNameNe, setMemberNameNe] = useState('');
  const [memberRoleEn, setMemberRoleEn] = useState('');
  const [memberRoleNe, setMemberRoleNe] = useState('');
  const [memberCategory, setMemberCategory] = useState<'board' | 'general' | 'chief'>('board');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberAddressEn, setMemberAddressEn] = useState('');
  const [memberAddressNe, setMemberAddressNe] = useState('');
  const [memberBioEn, setMemberBioEn] = useState('');
  const [memberBioNe, setMemberBioNe] = useState('');
  const [memberAvatarUrl, setMemberAvatarUrl] = useState('');
  const [memberPhotoBase64, setMemberPhotoBase64] = useState('');
  const [memberPhotoName, setMemberPhotoName] = useState('');

  // 2. Event Form
  const [eventTitleEn, setEventTitleEn] = useState('');
  const [eventTitleNe, setEventTitleNe] = useState('');
  const [eventDescEn, setEventDescEn] = useState('');
  const [eventDescNe, setEventDescNe] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocEn, setEventLocEn] = useState('');
  const [eventLocNe, setEventLocNe] = useState('');
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'completed'>('upcoming');

  // 3. Notice Form
  const [noticeTitleEn, setNoticeTitleEn] = useState('');
  const [noticeTitleNe, setNoticeTitleNe] = useState('');
  const [noticeContentEn, setNoticeContentEn] = useState('');
  const [noticeContentNe, setNoticeContentNe] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'work' | 'notice' | 'press'>('notice');
  const [noticeDate, setNoticeDate] = useState('');
  const [noticeDriveUrl, setNoticeDriveUrl] = useState('');

  // 4. Album Form
  const [albumTitleEn, setAlbumTitleEn] = useState('');
  const [albumTitleNe, setAlbumTitleNe] = useState('');
  const [albumDescEn, setAlbumDescEn] = useState('');
  const [albumDescNe, setAlbumDescNe] = useState('');
  const [albumCoverUrl, setAlbumCoverUrl] = useState('');
  const [albumDate, setAlbumDate] = useState('');
  const [albumLocEn, setAlbumLocEn] = useState('');
  const [albumLocNe, setAlbumLocNe] = useState('');

  // 5. Add Media Item Form
  const [mediaTitleEn, setMediaTitleEn] = useState('');
  const [mediaTitleNe, setMediaTitleNe] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [mediaUrl, setMediaUrl] = useState('');

  // Slider State for Galleries
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Handle Photo Upload base64
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMemberPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemberPhotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetMemberForm = () => {
    setMemberNameEn('');
    setMemberNameNe('');
    setMemberRoleEn('');
    setMemberRoleNe('');
    setMemberCategory('board');
    setMemberPhone('');
    setMemberEmail('');
    setMemberAddressEn('');
    setMemberAddressNe('');
    setMemberBioEn('');
    setMemberBioNe('');
    setMemberAvatarUrl('');
    setMemberPhotoBase64('');
    setMemberPhotoName('');
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberNameEn || !memberRoleEn) return;

    const newMember: Member = {
      id: `m_${Date.now()}`,
      name: { en: memberNameEn, ne: memberNameNe || memberNameEn },
      role: { en: memberRoleEn, ne: memberRoleNe || memberRoleEn },
      category: memberCategory,
      phone: memberPhone,
      email: memberEmail,
      address: { en: memberAddressEn || branch.location.en, ne: memberAddressNe || branch.location.ne },
      bio: { en: memberBioEn, ne: memberBioNe },
      avatarUrl: memberAvatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      photoBase64: memberPhotoBase64 || undefined,
      photoName: memberPhotoName || undefined,
      chapterId: branch.id
    };

    onAddMember(newMember);
    setIsMemberModalOpen(false);
    resetMemberForm();
  };

  const resetEventForm = () => {
    setEventTitleEn('');
    setEventTitleNe('');
    setEventDescEn('');
    setEventDescNe('');
    setEventDate('');
    setEventTime('');
    setEventLocEn('');
    setEventLocNe('');
    setEventStatus('upcoming');
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitleEn || !eventDate) return;

    const newEvent: CommunityEvent = {
      id: `evt_${Date.now()}`,
      title: { en: eventTitleEn, ne: eventTitleNe || eventTitleEn },
      description: { en: eventDescEn, ne: eventDescNe || eventDescEn },
      date: eventDate,
      time: eventTime || '10:00 AM',
      location: { en: eventLocEn || branch.location.en, ne: eventLocNe || branch.location.ne },
      status: eventStatus,
      chapterId: branch.id
    };

    onAddEvent(newEvent);
    setIsEventModalOpen(false);
    resetEventForm();
  };

  const resetNoticeForm = () => {
    setNoticeTitleEn('');
    setNoticeTitleNe('');
    setNoticeContentEn('');
    setNoticeContentNe('');
    setNoticeCategory('notice');
    setNoticeDate('');
    setNoticeDriveUrl('');
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitleEn || !noticeContentEn) return;

    const newNotice: Notice = {
      id: `not_${Date.now()}`,
      title: { en: noticeTitleEn, ne: noticeTitleNe || noticeTitleEn },
      content: { en: noticeContentEn, ne: noticeContentNe || noticeContentEn },
      date: noticeDate || new Date().toISOString().split('T')[0],
      category: noticeCategory,
      driveFileUrl: noticeDriveUrl || undefined,
      chapterId: branch.id
    };

    onAddNotice(newNotice);
    setIsNoticeModalOpen(false);
    resetNoticeForm();
  };

  const resetAlbumForm = () => {
    setAlbumTitleEn('');
    setAlbumTitleNe('');
    setAlbumDescEn('');
    setAlbumDescNe('');
    setAlbumCoverUrl('');
    setAlbumDate('');
    setAlbumLocEn('');
    setAlbumLocNe('');
  };

  const handleAlbumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitleEn) return;

    const newAlbum: Album = {
      id: `alb_${Date.now()}`,
      title: { en: albumTitleEn, ne: albumTitleNe || albumTitleEn },
      description: { en: albumDescEn, ne: albumDescNe || albumDescEn },
      coverUrl: '',
      date: albumDate || new Date().toISOString().split('T')[0],
      location: { en: albumLocEn || branch.location.en, ne: albumLocNe || branch.location.ne },
      tags: [branch.id, 'chapter'],
      mediaItems: [],
      chapterId: branch.id
    };

    onAddAlbum(newAlbum);
    setIsAlbumModalOpen(false);
    resetAlbumForm();
  };

  const handleAddMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbumForMedia || !mediaUrl) return;

    // Support extracting YouTube ID if a standard YouTube link is provided
    let finalUrl = mediaUrl;
    if (mediaType === 'video' && mediaUrl.includes('youtube.com/watch')) {
      try {
        const urlObj = new URL(mediaUrl);
        const vParam = urlObj.searchParams.get('v');
        if (vParam) {
          finalUrl = `https://www.youtube.com/embed/${vParam}`;
        }
      } catch (e) {}
    } else if (mediaType === 'video' && mediaUrl.includes('youtu.be/')) {
      try {
        const parts = mediaUrl.split('youtu.be/');
        if (parts.length > 1) {
          finalUrl = `https://www.youtube.com/embed/${parts[1].split('?')[0]}`;
        }
      } catch (e) {}
    }

    const newMedia: AlbumMediaItem = {
      id: `med_${Date.now()}`,
      title: { en: mediaTitleEn || 'Media Item', ne: mediaTitleNe || mediaTitleEn || 'मिडिया' },
      type: mediaType,
      url: finalUrl,
      thumbnailUrl: mediaType === 'video' ? 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=400' : undefined
    };

    const updatedAlbum: Album = {
      ...selectedAlbumForMedia,
      mediaItems: [...selectedAlbumForMedia.mediaItems, newMedia]
    };

    onAddAlbum(updatedAlbum);
    setIsMediaModalOpen(false);
    setMediaTitleEn('');
    setMediaTitleNe('');
    setMediaUrl('');
  };

  const handleDeleteMedia = (album: Album, mediaId: string) => {
    const updatedAlbum: Album = {
      ...album,
      mediaItems: album.mediaItems.filter(m => m.id !== mediaId)
    };
    onAddAlbum(updatedAlbum);
  };

  // Helper to open media slideshow slider
  const openSlideshow = (albumId: string) => {
    setActiveAlbumId(albumId);
    setCurrentSlideIndex(0);
  };

  const currentAlbumForSlideshow = branchAlbums.find(a => a.id === activeAlbumId);

  return (
    <div className="space-y-8 pb-16">
      {/* Dynamic Branch Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white p-6 sm:p-10 shadow-lg border border-teal-800/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_50%)]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3.5 max-w-3xl">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white transition-all text-xs font-bold uppercase tracking-wider mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Back to Headquarters' : 'मुख्य शाखामा फर्कनुहोस्'}
            </button>

            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                {branch.type === 'chapter' 
                  ? (lang === 'en' ? 'District Chapter' : 'जिल्ला शाखा') 
                  : (lang === 'en' ? 'Sister Institution' : 'भगिनी संस्था')}
              </span>
              <span className="flex items-center gap-1 text-teal-300 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                {branch.location[lang]}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              {branch.name[lang]}
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
              {branch.description[lang]}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-full md:w-auto">
            <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold">Network Coordination</span>
            <div className="text-xs text-gray-300 space-y-1.5 font-semibold">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>chaurasiya.org.np/{branch.id}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>{branch.id}@chaurasiya.org.np</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="flex flex-wrap border-b border-teal-100 dark:border-slate-800 gap-1.5 sm:gap-2">
        <button
          onClick={() => setActiveSubTab('members')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-extrabold text-sm transition-all ${
            activeSubTab === 'members'
              ? 'border-teal-600 text-teal-800 dark:text-teal-400'
              : 'border-transparent text-gray-500 hover:text-teal-700 hover:border-teal-200 dark:text-gray-400'
          }`}
        >
          <Users className="w-4 h-4" />
          {lang === 'en' ? 'Committee Members' : 'कार्यसमिति सदस्यहरू'}
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-black">
            {branchMembers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('events')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-extrabold text-sm transition-all ${
            activeSubTab === 'events'
              ? 'border-teal-600 text-teal-800 dark:text-teal-400'
              : 'border-transparent text-gray-500 hover:text-teal-700 hover:border-teal-200 dark:text-gray-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          {lang === 'en' ? 'Events' : 'कार्यक्रमहरू'}
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-black">
            {branchEvents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('notices')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-extrabold text-sm transition-all ${
            activeSubTab === 'notices'
              ? 'border-teal-600 text-teal-800 dark:text-teal-400'
              : 'border-transparent text-gray-500 hover:text-teal-700 hover:border-teal-200 dark:text-gray-400'
          }`}
        >
          <Bell className="w-4 h-4" />
          {lang === 'en' ? 'Notices' : 'सूचनाहरू'}
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-black">
            {branchNotices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('gallery')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-extrabold text-sm transition-all ${
            activeSubTab === 'gallery'
              ? 'border-teal-600 text-teal-800 dark:text-teal-400'
              : 'border-transparent text-gray-500 hover:text-teal-700 hover:border-teal-200 dark:text-gray-400'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          {lang === 'en' ? 'Gallery & Slides' : 'ग्यालरी र स्लाइडहरू'}
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-black">
            {branchAlbums.length}
          </span>
        </button>
      </div>

      {/* Dynamic Content Switching Panels */}
      <div>
        {/* MEMBERS PANEL */}
        {activeSubTab === 'members' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-teal-950 dark:text-teal-50">
                  {lang === 'en' ? 'Committee Members Directory' : 'समिति सदस्य निर्देशिका'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lang === 'en' 
                    ? `Registered executive and general board members of ${branch.name.en}`
                    : `${branch.name.ne} का दर्ता भएका कार्यसमिति र साधारण सदस्यहरू`}
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setIsMemberModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Add Member' : 'सदस्य थप्नुहोस्'}</span>
                </button>
              )}
            </div>

            {branchMembers.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-teal-100/60 dark:border-slate-800/80 p-8">
                <Users className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                <h4 className="font-extrabold text-teal-950 dark:text-teal-50 text-sm">
                  {lang === 'en' ? 'No Members Found' : 'कुनै सदस्य भेटिएन'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
                  {lang === 'en'
                    ? 'No specific local committee members registered yet. Admin can register members using the button above.'
                    : 'कुनै स्थानीय समिति सदस्यहरू दर्ता भएका छैनन्। व्यवस्थापकले माथिको बटन प्रयोग गरी सदस्य दर्ता गर्न सक्नुहुन्छ।'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {branchMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="relative bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-teal-50/70 dark:border-slate-800/70 text-center flex flex-col items-center group hover:shadow-md transition-all"
                  >
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteMember(member.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg transition-colors z-10"
                        title="Delete Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="w-16 h-16 rounded-full overflow-hidden border border-teal-500/30 shrink-0 mb-3 relative">
                      <img 
                        src={member.avatarUrl} 
                        alt={member.name[lang]} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="space-y-1 min-w-0 w-full flex-grow">
                      <h4 className="font-extrabold text-teal-950 dark:text-teal-50 text-[13px] leading-tight break-words">
                        {member.name[lang]}
                      </h4>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider break-words">
                        {member.role[lang]}
                      </p>
                      
                      {(member.phone || member.email) && (
                        <div className="pt-2 text-[10px] text-gray-500 space-y-0.5 border-t border-teal-50/40 dark:border-slate-800 mt-2">
                          {member.phone && <p>📞 {member.phone}</p>}
                          {member.email && <p className="truncate">✉️ {member.email}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EVENTS PANEL */}
        {activeSubTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-teal-950 dark:text-teal-50">
                  {lang === 'en' ? 'Upcoming & Completed Events' : 'आगामी र सम्पन्न कार्यक्रमहरू'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lang === 'en' 
                    ? `Local programs and community gatherings hosted by ${branch.name.en}`
                    : `${branch.name.ne} द्वारा आयोजित स्थानीय कार्यक्रमहरू र भेलाहरू`}
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setIsEventModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Create Event' : 'कार्यक्रम सिर्जना गर्नुहोस्'}</span>
                </button>
              )}
            </div>

            {branchEvents.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-teal-100/60 dark:border-slate-800/80 p-8">
                <Calendar className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                <h4 className="font-extrabold text-teal-950 dark:text-teal-50 text-sm">
                  {lang === 'en' ? 'No Events Found' : 'कुनै कार्यक्रम भेटिएन'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
                  {lang === 'en'
                    ? 'No community events scheduled yet for this chapter.'
                    : 'यस शाखाका लागि हाल कुनै पनि कार्यक्रमहरू तय गरिएको छैन।'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branchEvents.map((evt) => (
                  <div 
                    key={evt.id}
                    className="relative bg-white dark:bg-slate-900 p-5 rounded-2xl border border-teal-50 dark:border-slate-800 shadow-sm flex gap-4 hover:shadow-md transition-all group"
                  >
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteEvent(evt.id)}
                        className="absolute top-3 right-3 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="flex flex-col items-center justify-center bg-teal-50 dark:bg-slate-800 p-3 rounded-xl text-teal-800 dark:text-teal-200 min-w-[70px] h-fit text-center border border-teal-100/40">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                        {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-black leading-none my-0.5">
                        {new Date(evt.date).getDate()}
                      </span>
                      <span className="text-[9px] font-bold text-gray-500">
                        {new Date(evt.date).getFullYear()}
                      </span>
                    </div>

                    <div className="space-y-2 min-w-0 flex-grow">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          evt.status === 'upcoming' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'
                        }`}>
                          {evt.status === 'upcoming' 
                            ? (lang === 'en' ? 'Upcoming' : 'आगामी')
                            : (lang === 'en' ? 'Completed' : 'सम्पन्न')}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm sm:text-base text-teal-950 dark:text-teal-50 leading-snug">
                        {evt.title[lang]}
                      </h4>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {evt.description[lang]}
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-[10px] text-gray-500 font-semibold border-t border-teal-50/40 dark:border-slate-800/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-teal-600" />
                          {evt.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-teal-600" />
                          {evt.location[lang]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTICES PANEL */}
        {activeSubTab === 'notices' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-teal-950 dark:text-teal-50">
                  {lang === 'en' ? 'Local Circulars & Announcements' : 'स्थानीय सूचना र परिपत्रहरू'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lang === 'en' 
                    ? `Official updates, files, and resources distributed by ${branch.name.en}`
                    : `${branch.name.ne} द्वारा वितरित आधिकारिक सूचना तथा जानकारीहरू`}
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setIsNoticeModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Add Notice' : 'सूचना थप्नुहोस्'}</span>
                </button>
              )}
            </div>

            {branchNotices.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-teal-100/60 dark:border-slate-800/80 p-8">
                <Bell className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                <h4 className="font-extrabold text-teal-950 dark:text-teal-50 text-sm">
                  {lang === 'en' ? 'No Notices Active' : 'कुनै सूचना सक्रिय छैन'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
                  {lang === 'en'
                    ? 'No official announcements issued for this chapter yet.'
                    : 'यस शाखाका लागि हाल कुनै पनि आधिकारिक सूचनाहरू जारी गरिएको छैन।'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {branchNotices.map((not) => (
                  <div 
                    key={not.id}
                    className="relative bg-white dark:bg-slate-900 p-5 rounded-2xl border border-teal-50 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
                  >
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteNotice(not.id)}
                        className="absolute top-4 right-4 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg transition-colors"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                      <div className="space-y-1">
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-extrabold uppercase tracking-wider">
                          📅 {not.date}
                        </span>
                        <h4 className="text-base font-black text-teal-950 dark:text-teal-50 pr-8">
                          {not.title[lang]}
                        </h4>
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300 text-[10px] font-bold uppercase tracking-wider h-fit w-fit">
                        {not.category}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      {not.content[lang]}
                    </p>

                    {not.driveFileUrl && (
                      <div className="mt-4 pt-3 border-t border-teal-50/60 dark:border-slate-800 flex justify-end gap-3.5">
                        <a 
                          href={not.driveFileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-bold"
                        >
                          <span>{lang === 'en' ? 'View File' : 'फाइल हेर्नुहोस्'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a 
                          href={getGoogleDriveDownloadUrl(not.driveFileUrl)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          download={`Notice_${not.date || 'file'}`}
                          className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold border-l border-teal-100 dark:border-slate-800 pl-3.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{lang === 'en' ? 'Direct Download' : 'सिधा डाउनलोड'}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GALLERY SLIDESHOW PANEL */}
        {activeSubTab === 'gallery' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-teal-950 dark:text-teal-50">
                  {lang === 'en' ? 'Photo Albums & Video Clips' : 'फोटो एलबम र भिडियो क्लिपहरू'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {lang === 'en' 
                    ? `Interactive visual records and video documentations of local activities`
                    : `स्थानीय गतिविधिहरूको अन्तरक्रियात्मक भिजुअल रेकर्ड र भिडियो कागजातहरू`}
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setIsAlbumModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Create Album' : 'एल्बम सिर्जना गर्नुहोस्'}</span>
                </button>
              )}
            </div>

            {branchAlbums.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-teal-100/60 dark:border-slate-800/80 p-8">
                <ImageIcon className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                <h4 className="font-extrabold text-teal-950 dark:text-teal-50 text-sm">
                  {lang === 'en' ? 'No Media Albums Found' : 'कुनै मिडिया एल्बम भेटिएन'}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
                  {lang === 'en'
                    ? 'No photo/video albums created yet. Admin can create an album and add Google Drive or YouTube links.'
                    : 'हालसम्म कुनै पनि फोटो/भिडियो एल्बमहरू सिर्जना गरिएको छैन। व्यवस्थापकले एल्बम सिर्जना गरी गुगल ड्राइभ वा युट्युब लिङ्कहरू थप्न सक्नुहुन्छ।'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branchAlbums.map((album) => (
                  <div 
                    key={album.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-teal-50 dark:border-slate-800 shadow-sm flex flex-col group hover:shadow-md transition-all relative"
                  >
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex gap-1 z-10">
                        <button
                          onClick={() => {
                            setSelectedAlbumForMedia(album);
                            setIsMediaModalOpen(true);
                          }}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-emerald-400 rounded-lg transition-colors"
                          title="Add Media File (Photo/Video)"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteAlbum(album.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg transition-colors"
                          title="Delete Album"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Cover Preview Image */}
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0">
                      <img 
                        src={getBestAlbumCover(album)} 
                        alt={album.title[lang]} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {album.mediaItems.length > 0 && (
                        <button 
                          onClick={() => openSlideshow(album.id)}
                          className="absolute bottom-3 right-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-lg tracking-wider uppercase flex items-center gap-1 shadow-sm transition-all"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>{lang === 'en' ? 'Launch Slider' : 'स्लाइडर सुरु गर्नुहोस्'} ({album.mediaItems.length})</span>
                        </button>
                      )}
                    </div>

                    <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <span className="text-[9px] text-teal-600 dark:text-teal-400 font-extrabold uppercase tracking-widest block">
                          📅 {album.date} | 📍 {album.location[lang]}
                        </span>
                        <h4 className="font-extrabold text-sm text-teal-950 dark:text-teal-50 leading-tight">
                          {album.title[lang]}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {album.description[lang]}
                        </p>
                      </div>

                      {/* Display a micro layout of slides in the album */}
                      {album.mediaItems.length > 0 ? (
                        <div className="pt-3 border-t border-teal-50/60 dark:border-slate-800/80">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Slides list</span>
                          <div className="flex flex-wrap gap-1.5 max-h-12 overflow-hidden">
                            {album.mediaItems.map((med) => (
                              <div 
                                key={med.id} 
                                className="relative w-8 h-8 rounded-md overflow-hidden bg-gray-100 border border-teal-500/10 shrink-0 group/media"
                              >
                                {med.type === 'video' ? (
                                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white p-0.5">
                                    <Video className="w-3 h-3 text-emerald-400" />
                                  </div>
                                ) : (
                                  <img src={med.url} alt="" className="w-full h-full object-cover" />
                                )}

                                {isAdmin && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteMedia(album, med.id);
                                    }}
                                    className="absolute inset-0 bg-red-600/95 text-white flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity duration-150"
                                    title="Delete Slide"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-400 italic font-medium pt-2">
                          {lang === 'en' ? 'No slides inside this album yet.' : 'यस एल्बममा हाल कुनै स्लाइड थपिएको छैन।'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DETAILED INTERACTIVE SLIDESHOW SLIDER */}
      <AnimatePresence>
        {activeAlbumId && currentAlbumForSlideshow && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4 md:p-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center text-white pb-4 border-b border-white/10 shrink-0">
              <div className="min-w-0">
                <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest block">
                  Interactive Album Slider
                </span>
                <h3 className="font-extrabold text-base md:text-lg truncate">
                  {currentAlbumForSlideshow.title[lang]}
                </h3>
              </div>
              <button 
                onClick={() => setActiveAlbumId(null)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors shrink-0"
                title="Close Slider"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slide Stage */}
            <div className="flex-grow flex items-center justify-center relative py-6">
              {currentAlbumForSlideshow.mediaItems.length > 0 ? (
                (() => {
                  const currentItem = currentAlbumForSlideshow.mediaItems[currentSlideIndex];
                  if (!currentItem) return null;

                  return (
                    <div className="w-full max-w-4xl max-h-[70vh] flex flex-col items-center justify-center relative">
                      
                      {/* Left Button */}
                      <button
                        onClick={() => setCurrentSlideIndex(prev => prev > 0 ? prev - 1 : currentAlbumForSlideshow.mediaItems.length - 1)}
                        className="absolute left-2 md:-left-12 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all hover:scale-105 z-10"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>

                      {/* Frame */}
                      <div className="w-full h-full max-h-[60vh] flex items-center justify-center bg-zinc-950 rounded-2xl overflow-hidden border border-white/5 relative">
                        {currentItem.type === 'video' ? (
                          currentItem.url.includes('embed') || currentItem.url.includes('youtube.com') ? (
                            <iframe 
                              src={currentItem.url}
                              title={currentItem.title[lang]}
                              className="w-full aspect-video max-h-[55vh]"
                              allowFullScreen
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <video 
                              src={currentItem.url}
                              controls
                              className="w-full max-h-[55vh]"
                            />
                          )
                        ) : (
                          <img 
                            src={currentItem.url} 
                            alt={currentItem.title[lang]} 
                            referrerPolicy="no-referrer"
                            className="max-w-full max-h-[55vh] object-contain"
                          />
                        )}
                      </div>

                      {/* Right Button */}
                      <button
                        onClick={() => setCurrentSlideIndex(prev => prev < currentAlbumForSlideshow.mediaItems.length - 1 ? prev + 1 : 0)}
                        className="absolute right-2 md:-right-12 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all hover:scale-105 z-10"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                    </div>
                  );
                })()
              ) : (
                <p className="text-zinc-500 italic">No media items available.</p>
              )}
            </div>

            {/* Footer / Caption */}
            <div className="text-center text-white shrink-0 space-y-2 border-t border-white/10 pt-4">
              {currentAlbumForSlideshow.mediaItems[currentSlideIndex] && (
                <div className="max-w-xl mx-auto space-y-1">
                  <h4 className="font-extrabold text-sm text-emerald-300">
                    {currentAlbumForSlideshow.mediaItems[currentSlideIndex].title[lang]}
                  </h4>
                  {currentAlbumForSlideshow.mediaItems[currentSlideIndex].description && (
                    <p className="text-xs text-zinc-400">
                      {currentAlbumForSlideshow.mediaItems[currentSlideIndex].description?.[lang]}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex justify-center gap-1 text-[11px] font-bold text-zinc-500">
                <span>Slide</span>
                <span className="text-emerald-400">{currentSlideIndex + 1}</span>
                <span>/</span>
                <span>{currentAlbumForSlideshow.mediaItems.length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FORM MODALS FOR CHAPTER-SPECIFIC EDITING --- */}
      
      {/* 1. MEMBER ADD MODAL */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-teal-100 dark:border-slate-800 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-teal-50 dark:border-slate-800">
              <h3 className="font-black text-lg text-teal-950 dark:text-teal-50 uppercase tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Add Local Member to Chapter
              </h3>
              <button onClick={() => setIsMemberModalOpen(false)} className="p-1.5 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-full text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Full Name (English)</label>
                  <input 
                    type="text" 
                    value={memberNameEn} 
                    onChange={e => setMemberNameEn(e.target.value)} 
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Full Name (Nepali)</label>
                  <input 
                    type="text" 
                    value={memberNameNe} 
                    onChange={e => setMemberNameNe(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Role / Designation (English)</label>
                  <input 
                    type="text" 
                    value={memberRoleEn} 
                    onChange={e => setMemberRoleEn(e.target.value)} 
                    placeholder="e.g. Chapter Chief, General Secretary"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Role / Designation (Nepali)</label>
                  <input 
                    type="text" 
                    value={memberRoleNe} 
                    onChange={e => setMemberRoleNe(e.target.value)} 
                    placeholder="उदा. अध्यक्ष, सचिव"
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Contact Phone Number</label>
                  <input 
                    type="tel" 
                    value={memberPhone} 
                    onChange={e => setMemberPhone(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Email Address</label>
                  <input 
                    type="email" 
                    value={memberEmail} 
                    onChange={e => setMemberEmail(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Address (English)</label>
                  <input 
                    type="text" 
                    value={memberAddressEn} 
                    onChange={e => setMemberAddressEn(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Address (Nepali)</label>
                  <input 
                    type="text" 
                    value={memberAddressNe} 
                    onChange={e => setMemberAddressNe(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">Image Avatar URL</label>
                <input 
                  type="url" 
                  value={memberAvatarUrl} 
                  onChange={e => setMemberAvatarUrl(e.target.value)} 
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white mb-2"
                />
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-teal-50/30 dark:bg-slate-800 border border-teal-100/40">
                <span className="text-teal-800 dark:text-teal-300 block mb-1">Or Upload Member Photo:</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange}
                  className="text-xs text-teal-900 dark:text-white"
                />
                {memberPhotoName && <p className="text-[10px] text-emerald-600">Attached: {memberPhotoName}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold uppercase tracking-widest text-center shadow-md transition-all pt-2.5"
              >
                Save Member in Repository
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. EVENT ADD MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-teal-100 dark:border-slate-800 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-teal-50 dark:border-slate-800">
              <h3 className="font-black text-lg text-teal-950 dark:text-teal-50 uppercase tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Create Local Event for Chapter
              </h3>
              <button onClick={() => setIsEventModalOpen(false)} className="p-1.5 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-full text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Event Title (English)</label>
                  <input 
                    type="text" 
                    value={eventTitleEn} 
                    onChange={e => setEventTitleEn(e.target.value)} 
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Event Title (Nepali)</label>
                  <input 
                    type="text" 
                    value={eventTitleNe} 
                    onChange={e => setEventTitleNe(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">Event Description (English)</label>
                <textarea 
                  value={eventDescEn} 
                  onChange={e => setEventDescEn(e.target.value)} 
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">Event Description (Nepali)</label>
                <textarea 
                  value={eventDescNe} 
                  onChange={e => setEventDescNe(e.target.value)} 
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Event Date</label>
                  <input 
                    type="date" 
                    value={eventDate} 
                    onChange={e => setEventDate(e.target.value)} 
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Event Time</label>
                  <input 
                    type="text" 
                    value={eventTime} 
                    onChange={e => setEventTime(e.target.value)} 
                    placeholder="e.g. 11:30 AM"
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Location (English)</label>
                  <input 
                    type="text" 
                    value={eventLocEn} 
                    onChange={e => setEventLocEn(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Location (Nepali)</label>
                  <input 
                    type="text" 
                    value={eventLocNe} 
                    onChange={e => setEventLocNe(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold uppercase tracking-widest text-center shadow-md transition-all pt-2.5"
              >
                Create Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. NOTICE ADD MODAL */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-teal-100 dark:border-slate-800 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-teal-50 dark:border-slate-800">
              <h3 className="font-black text-lg text-teal-950 dark:text-teal-50 uppercase tracking-tight flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                Add Circular / Notice
              </h3>
              <button onClick={() => setIsNoticeModalOpen(false)} className="p-1.5 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-full text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNoticeSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Notice Title (English)</label>
                  <input 
                    type="text" 
                    value={noticeTitleEn} 
                    onChange={e => setNoticeTitleEn(e.target.value)} 
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Notice Title (Nepali)</label>
                  <input 
                    type="text" 
                    value={noticeTitleNe} 
                    onChange={e => setNoticeTitleNe(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">Notice Content (English)</label>
                <textarea 
                  value={noticeContentEn} 
                  onChange={e => setNoticeContentEn(e.target.value)} 
                  rows={4}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">Notice Content (Nepali)</label>
                <textarea 
                  value={noticeContentNe} 
                  onChange={e => setNoticeContentNe(e.target.value)} 
                  rows={4}
                  className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Date of Notice</label>
                  <input 
                    type="date" 
                    value={noticeDate} 
                    onChange={e => setNoticeDate(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Notice Category</label>
                  <select 
                    value={noticeCategory} 
                    onChange={e => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  >
                    <option value="notice">Official Circular</option>
                    <option value="work">Socio-Welfare Activity</option>
                    <option value="press">Press Release</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">Google Drive Link / PDF File Attachment</label>
                <input 
                  type="url" 
                  value={noticeDriveUrl} 
                  onChange={e => setNoticeDriveUrl(e.target.value)} 
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold uppercase tracking-widest text-center shadow-md transition-all pt-2.5"
              >
                Publish Notice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. ALBUM CREATE MODAL */}
      {isAlbumModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-teal-100 dark:border-slate-800 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-teal-50 dark:border-slate-800">
              <h3 className="font-black text-lg text-teal-950 dark:text-teal-50 uppercase tracking-tight flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                Create Gallery Album
              </h3>
              <button onClick={() => setIsAlbumModalOpen(false)} className="p-1.5 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-full text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAlbumSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Album Title (English)</label>
                  <input 
                    type="text" 
                    value={albumTitleEn} 
                    onChange={e => setAlbumTitleEn(e.target.value)} 
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Album Title (Nepali)</label>
                  <input 
                    type="text" 
                    value={albumTitleNe} 
                    onChange={e => setAlbumTitleNe(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Album Description (English)</label>
                  <input 
                    type="text" 
                    value={albumDescEn} 
                    onChange={e => setAlbumDescEn(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Album Description (Nepali)</label>
                  <input 
                    type="text" 
                    value={albumDescNe} 
                    onChange={e => setAlbumDescNe(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Date</label>
                  <input 
                    type="date" 
                    value={albumDate} 
                    onChange={e => setAlbumDate(e.target.value)} 
                    className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-gray-500 uppercase tracking-wider block">Loc En</label>
                    <input 
                      type="text" 
                      value={albumLocEn} 
                      onChange={e => setAlbumLocEn(e.target.value)} 
                      placeholder="e.g. Nepalgunj"
                      className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-500 uppercase tracking-wider block">Loc Ne</label>
                    <input 
                      type="text" 
                      value={albumLocNe} 
                      onChange={e => setAlbumLocNe(e.target.value)} 
                      placeholder="नेपालगन्ज"
                      className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold uppercase tracking-widest text-center shadow-md transition-all pt-2.5"
              >
                Create Album
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. MEDIA SLIDE ADD MODAL */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-teal-100 dark:border-slate-800 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-teal-50 dark:border-slate-800">
              <h3 className="font-black text-lg text-teal-950 dark:text-teal-50 uppercase tracking-tight">
                Add Slide / Photo / Video
              </h3>
              <button onClick={() => setIsMediaModalOpen(false)} className="p-1.5 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-full text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMediaSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">Slide Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-teal-950 dark:text-white">
                    <input 
                      type="radio" 
                      name="mediaType" 
                      checked={mediaType === 'photo'} 
                      onChange={() => setMediaType('photo')} 
                    />
                    <span>Photo (Direct or Google Drive direct link)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-teal-950 dark:text-white">
                    <input 
                      type="radio" 
                      name="mediaType" 
                      checked={mediaType === 'video'} 
                      onChange={() => setMediaType('video')} 
                    />
                    <span>Video (YouTube URL)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">Slide Title (English)</label>
                <input 
                  type="text" 
                  value={mediaTitleEn} 
                  onChange={e => setMediaTitleEn(e.target.value)} 
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">Slide Title (Nepali)</label>
                <input 
                  type="text" 
                  value={mediaTitleNe} 
                  onChange={e => setMediaTitleNe(e.target.value)} 
                  className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">
                  {mediaType === 'photo' ? 'Photo Image URL (Google Drive / Unsplash, etc.)' : 'YouTube Video URL'}
                </label>
                <input 
                  type="url" 
                  value={mediaUrl} 
                  onChange={e => setMediaUrl(e.target.value)} 
                  placeholder={mediaType === 'photo' ? 'https://...' : 'https://www.youtube.com/watch?v=...'}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-teal-100/75 dark:border-slate-800 bg-teal-50/20 dark:bg-slate-950 focus:outline-none focus:border-teal-500 text-teal-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold uppercase tracking-widest text-center shadow-md transition-all pt-2.5"
              >
                Add Slide
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
