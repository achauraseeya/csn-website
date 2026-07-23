import React, { useState, useEffect } from 'react';
import { 
  X, Upload, Plus, Trash2, Image as ImageIcon, Film, HelpCircle, 
  Check, Sparkles, FolderPlus, ArrowRight, Video, FileText, Link as LinkIcon,
  ShieldCheck, Lock, Key, LogOut, Database, CheckCircle2, Layers, DownloadCloud, Globe
} from 'lucide-react';
import { Album, AlbumMediaItem, Language } from '../types';
import { formatDriveImageUrl, parseMultipleMediaLinks, extractGoogleDriveFolderId, detectMediaType } from '../utils/mediaUrl';

interface UploadJourneyPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddAlbum: (newAlbum: Album) => void;
  onAddMediaToAlbum?: (albumId: string, newMedia: AlbumMediaItem[]) => void;
  existingAlbums?: Album[];
  isAdmin?: boolean;
}

export default function UploadJourneyPostModal({
  isOpen,
  onClose,
  lang,
  onAddAlbum,
  existingAlbums = [],
  isAdmin = false,
}: UploadJourneyPostModalProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'guide'>('create');

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('chaurasiya_admin_authenticated') === 'true';
  });

  const effectiveIsAdmin = isAdmin || isAdminAuthenticated;
  const [inputPasscode, setInputPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Form State
  const [titleEn, setTitleEn] = useState('');
  const [titleNe, setTitleNe] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descNe, setDescNe] = useState('');
  const [locationEn, setLocationEn] = useState('Parsa, Nepal');
  const [locationNe, setLocationNe] = useState('पर्सा, नेपाल');
  const [dateStr, setDateStr] = useState(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  const [tagsStr, setTagsStr] = useState('Community, Journey, Youth');
  
  // Remove unused file upload states and handlers
  // Google Drive Folder URL State
  const [driveFolderUrl, setDriveFolderUrl] = useState('');

  // Bulk Links Import State
  const [bulkLinksText, setBulkLinksText] = useState('');
  const [showBulkPaste, setShowBulkPaste] = useState(false);

  // Attached media items (photos or videos) state
  const [mediaItems, setMediaItems] = useState<Array<{
    id: string;
    titleEn: string;
    titleNe: string;
    type: 'photo' | 'video';
    url: string;
  }>>([
    {
      id: 'media-1',
      titleEn: 'YouTube Event Video',
      titleNe: 'युट्युब कार्यक्रम भिडियो',
      type: 'video',
      url: ''
    }
  ]);

  if (!isOpen) return null;

  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPasscode = inputPasscode.trim();
    if (!cleanPasscode) return;

    setIsVerifying(true);
    setPasscodeError(false);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: cleanPasscode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAdminAuthenticated(true);
        try {
          sessionStorage.setItem('chaurasiya_admin_authenticated', 'true');
          localStorage.setItem('chaurasiya_is_admin', 'true');
          localStorage.setItem('chaurasiya_admin_password', cleanPasscode);
        } catch (err) {
          console.error('Error saving admin auth', err);
        }
        setPasscodeError(false);
        setInputPasscode('');
      } else {
        setPasscodeError(true);
      }
    } catch (err) {
      console.error('Verify error:', err);
      setPasscodeError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('chaurasiya_admin_authenticated');
      localStorage.removeItem('chaurasiya_is_admin');
    } catch (e) {
      console.error('Error clearing admin auth', e);
    }
  };

  // Bulk Links Import Handler
  const handleBulkImportLinks = () => {
    if (!bulkLinksText.trim()) return;
    const parsed = parseMultipleMediaLinks(bulkLinksText);
    if (parsed.length === 0) return;

    const newRows = parsed.map((p, idx) => ({
      id: `bulk-${Date.now()}-${idx}`,
      titleEn: p.type === 'photo' ? `Event Photo #${mediaItems.length + idx + 1}` : `YouTube Video #${mediaItems.length + idx + 1}`,
      titleNe: p.type === 'photo' ? `कार्यक्रम फोटो #${mediaItems.length + idx + 1}` : `युट्युब भिडियो #${mediaItems.length + idx + 1}`,
      type: p.type,
      url: p.url,
    }));

    setMediaItems(prev => [...prev, ...newRows]);
    setBulkLinksText('');
    setShowBulkPaste(false);
  };

  const handleAddMediaRow = () => {
    setMediaItems([
      ...mediaItems,
      {
        id: `media-${Date.now()}`,
        titleEn: `Media Item #${mediaItems.length + 1}`,
        titleNe: `मिडिया सामग्री #${mediaItems.length + 1}`,
        type: 'photo',
        url: '',
      }
    ]);
  };

  const handleRemoveMediaRow = (index: number) => {
    setMediaItems(mediaItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn && !titleNe) {
      alert(lang === 'en' ? 'Please enter a post title.' : 'कृपया पोस्ट शीर्षक प्रविष्ट गर्नुहोस्।');
      return;
    }

    const newAlbumId = `journey-post-${Date.now()}`;
    const parsedTags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    const folderId = extractGoogleDriveFolderId(driveFolderUrl);

    // Format all URLs (converting Google Drive links into high speed CDN URLs)
    const formattedMediaItems: AlbumMediaItem[] = [];

    // If Google Drive Folder URL is provided, put the folder item first
    if (driveFolderUrl.trim()) {
      formattedMediaItems.push({
        id: `media-${newAlbumId}-folder`,
        title: { en: 'Google Drive Photo Folder Gallery', ne: 'गूगल ड्राइभ फोटो फोल्डर ग्यालरी' },
        description: { en: descEn, ne: descNe },
        type: 'photo',
        url: driveFolderUrl.trim(),
        date: dateStr,
        location: { en: locationEn, ne: locationNe }
      });
    }

    // Append individual photo or video items
    mediaItems.forEach((m, idx) => {
      if (m.url.trim()) {
        formattedMediaItems.push({
          id: `media-${newAlbumId}-${idx}`,
          title: { en: m.titleEn || (m.type === 'photo' ? `Photo ${idx + 1}` : `Video ${idx + 1}`), ne: m.titleNe || (m.type === 'photo' ? `फोटो ${idx + 1}` : `भिडियो ${idx + 1}`) },
          description: { en: descEn, ne: descNe },
          type: m.type,
          url: m.url.trim(),
          date: dateStr,
          location: { en: locationEn, ne: locationNe }
        });
      }
    });

    if (formattedMediaItems.length === 0) {
      alert(
        lang === 'en' 
          ? '❌ Error: Please specify at least one Google Drive folder link OR at least one individual Photo/Video URL to create this gallery post.' 
          : '❌ त्रुटि: कृपया यो ग्यालरी पोस्ट सिर्जना गर्न कम्तिमा एउटा गुगल ड्राइभ फोल्डर लिङ्क वा कम्तिमा एउटा फोटो/भिडियो लिङ्क थप्नुहोस्।'
      );
      return;
    }

    // Automatic cover banner image from Google Drive folder or clean stock image
    const formattedCover = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200';

    const newAlbum: Album = {
      id: newAlbumId,
      title: {
        en: titleEn || titleNe,
        ne: titleNe || titleEn,
      },
      description: {
        en: descEn || 'Community event gallery post from Chaurasiya Samaj.',
        ne: descNe || 'चौरसिया समाजको सामुदायिक कार्यक्रम ग्यालरी पोस्ट।',
      },
      coverUrl: formattedCover,
      date: dateStr,
      location: {
        en: locationEn,
        ne: locationNe,
      },
      tags: parsedTags.length > 0 ? parsedTags : ['Community', 'Journey'],
      driveFolderUrl: driveFolderUrl.trim() || undefined,
      driveFolderId: folderId || undefined,
      mediaItems: formattedMediaItems,
    };

    onAddAlbum(newAlbum);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-teal-100 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white p-6 flex items-center justify-between border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                {lang === 'en' ? 'Glimpses of Our Journey — Admin Media Portal' : 'हाम्रो यात्राको झलक — एडमिन मिडिया पोर्टल'}
              </h2>
              <p className="text-xs text-teal-200 font-medium">
                {lang === 'en' ? 'Upload photos/videos & auto-generate dedicated journey pages' : 'फोटो/भिडियो अपलोड गर्नुहोस् र अलग यात्रा पृष्ठहरू स्वतः सिर्जना गर्नुहोस्'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {effectiveIsAdmin && (
              <button
                onClick={handleAdminLogout}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                title="Lock Admin Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Lock Admin' : 'एडमिन बन्द गर्नुहोस्'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If Admin is NOT Authenticated: Show Security Lock Screen */}
        {!effectiveIsAdmin ? (
          <div className="p-8 space-y-6 text-center max-w-lg mx-auto my-auto">
            <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 text-teal-800 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 text-teal-700" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-teal-950">
                {lang === 'en' ? 'Admin Verification Required' : 'एडमिन प्रमाणीकरण आवश्यक छ'}
              </h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                {lang === 'en' 
                  ? 'Adding photos, videos, and creating dedicated journey pages is restricted to authorized Chaurasiya Samaj Executive Admins.'
                  : 'फोटो, भिडियो थप्न र अलग यात्रा पृष्ठहरू सिर्जना गर्न अधिकृत चौरसिया समाज कार्यकारी एडमिनहरूका लागि मात्र सीमित छ।'}
              </p>
            </div>

            <form onSubmit={handleVerifyPasscode} className="space-y-4 text-left bg-teal-50/50 p-6 rounded-2xl border border-teal-100">
              <div>
                <label className="block text-xs font-extrabold text-teal-900 mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-teal-600" />
                  {lang === 'en' ? 'Enter Admin Passcode / PIN' : 'एडमिन पासकोड / पिन प्रविष्ट गर्नुहोस्'}
                </label>
                <input
                  type="password"
                  required
                  disabled={isVerifying}
                  value={inputPasscode}
                  onChange={(e) => {
                    setInputPasscode(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder={lang === 'en' ? 'Enter passcode' : 'पासकोड प्रविष्ट गर्नुहोस्'}
                  className="w-full px-4 py-2.5 bg-white border border-teal-200 rounded-xl text-sm font-medium text-teal-950 focus:outline-none focus:border-teal-600 shadow-sm disabled:opacity-60"
                />
                {passcodeError && (
                  <p className="text-xs font-bold text-red-600 mt-1">
                    {lang === 'en' ? '❌ Invalid Passcode. Access Denied.' : '❌ अमान्य पासकोड। पहुँच अस्वीकृत।'}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-teal-700 font-bold bg-teal-100/60 p-2.5 rounded-xl border border-teal-200/60">
                <span>🔑 {lang === 'en' ? 'Environment Authentication Active' : 'वातावरण प्रमाणीकरण सक्रिय छ'}</span>
                <span className="text-teal-900">({lang === 'en' ? 'Secure Verification' : 'सुरक्षित प्रमाणीकरण'})</span>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{lang === 'en' ? 'Unlocking...' : 'खोल्दै...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Unlock Admin Media Portal' : 'एडमिन मिडिया पोर्टल खोल्नुहोस्'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Modal Tabs Header */}
            <div className="flex items-center justify-between border-b border-teal-100 bg-teal-50/50 px-6 pt-3 gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-x ${activeTab === 'create' ? 'bg-white text-teal-950 border-teal-200 border-b-transparent shadow-sm' : 'text-gray-600 hover:text-teal-900'}`}
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'en' ? 'Create & Upload Post' : 'पोस्ट बनाउनुहोस् र अपलोड गर्नुहोस्'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('guide')}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-t border-x ${activeTab === 'guide' ? 'bg-white text-teal-950 border-teal-200 border-b-transparent shadow-sm' : 'text-gray-600 hover:text-teal-900'}`}
                >
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>{lang === 'en' ? 'How to Upload Guide' : 'फाइल/भिडियो अपलोड निर्देशिका'}</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'en' ? 'Admin Access Active' : 'एडमिन पहुँच सक्रिय'}</span>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* TAB 1: CREATE POST FORM */}
          {activeTab === 'create' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Info Group */}
              <div className="bg-teal-50/40 p-4 sm:p-6 rounded-2xl border border-teal-100 space-y-4">
                <h3 className="text-sm font-black text-teal-950 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  {lang === 'en' ? '1. Post Details & Header' : '१. पोस्ट विवरण तथा शीर्षक'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-teal-900 mb-1">
                      {lang === 'en' ? 'Post Title (English)' : 'पोस्ट शीर्षक (अंग्रेजी)'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="e.g. Cultural Program & Youth Meet 2026"
                      className="w-full px-3.5 py-2 bg-white border border-teal-200 rounded-xl text-xs sm:text-sm font-medium text-teal-950 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-900 mb-1">
                      {lang === 'en' ? 'Post Title (Nepali)' : 'पोस्ट शीर्षक (नेपाली)'}
                    </label>
                    <input
                      type="text"
                      value={titleNe}
                      onChange={(e) => setTitleNe(e.target.value)}
                      placeholder="उदा. सांस्कृतिक कार्यक्रम तथा युवा भेला २०२६"
                      className="w-full px-3.5 py-2 bg-white border border-teal-200 rounded-xl text-xs sm:text-sm font-medium text-teal-950 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-teal-900 mb-1">Date</label>
                    <input
                      type="text"
                      value={dateStr}
                      onChange={(e) => setDateStr(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-teal-200 rounded-xl text-xs font-medium text-teal-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-900 mb-1">Location (English)</label>
                    <input
                      type="text"
                      value={locationEn}
                      onChange={(e) => setLocationEn(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-teal-200 rounded-xl text-xs font-medium text-teal-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-900 mb-1">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={tagsStr}
                      onChange={(e) => setTagsStr(e.target.value)}
                      placeholder="Culture, Agriculture, Youth"
                      className="w-full px-3.5 py-2 bg-white border border-teal-200 rounded-xl text-xs font-medium text-teal-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-900 mb-1">
                    {lang === 'en' ? 'Post Description / Story' : 'पोस्ट विवरण / कथा'}
                  </label>
                  <textarea
                    rows={2}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    placeholder="Brief description of the event, highlights, and community members present..."
                    className="w-full px-3.5 py-2 bg-white border border-teal-200 rounded-xl text-xs sm:text-sm font-medium text-teal-950 focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Google Drive Folder Link Input Section */}
              <div className="bg-emerald-500/10 p-4 sm:p-6 rounded-2xl border-2 border-emerald-500/40 space-y-3">
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-emerald-600 shrink-0" />
                  <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                    {lang === 'en' ? '2. Google Drive Event Photo Folder Link' : '२. गुगल ड्राइभ कार्यक्रम फोटो फोल्डर लिङ्क'}
                  </h3>
                </div>

                <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                  {lang === 'en'
                    ? 'Paste your Google Drive folder link containing event photos. The website automatically fetches all photos from this folder and renders them in the slider viewer!'
                    : 'कार्यक्रमका फोटोहरू रहेको गुगल ड्राइभ फोल्डरको लिङ्क पेस्ट गर्नुहोस्। वेबसाइटले यो फोल्डरबाट सबै फोटोहरू स्वतः स्लाइडरमा देखाउनेछ!'}
                </p>

                <input
                  type="url"
                  value={driveFolderUrl}
                  onChange={(e) => setDriveFolderUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/1A2B3C4D5E..."
                  className="w-full px-4 py-3 bg-white border-2 border-emerald-400 rounded-xl text-xs sm:text-sm font-semibold text-emerald-950 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 shadow-sm"
                />

                <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-bold bg-emerald-100/60 p-2.5 rounded-xl">
                  <span>💡 {lang === 'en' ? 'Requirement:' : 'आवश्यकता:'} Set Google Drive folder sharing permission to <strong>"Anyone with the link can view"</strong>.</span>
                </div>
              </div>

              {/* Individual Photos and Videos Section */}
              <div className="bg-teal-50/40 p-4 sm:p-6 rounded-2xl border border-teal-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-teal-950 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-teal-600" />
                    {lang === 'en' ? '3. Individual Photos & Videos' : '३. संलग्न फोटो तथा भिडियोहरू'}
                  </h3>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBulkPaste(!showBulkPaste)}
                      className="px-3 py-1.5 bg-teal-100 hover:bg-teal-200 text-teal-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Layers className="w-3.5 h-3.5 text-teal-700" />
                      <span>{lang === 'en' ? 'Bulk Paste Links' : 'एकैपटक धेरै लिङ्कहरू राख्नुहोस्'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddMediaRow}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-gray-950 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'Add Photo / Video Row' : 'फोटो वा भिडियो थप्नुहोस्'}</span>
                    </button>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{lang === 'en' ? 'Supported Formats:' : 'समर्थित ढाँचाहरू:'}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    {lang === 'en' 
                      ? 'Add Google Drive share links or direct CDN URLs for photos, and YouTube videos or Shorts links for videos. Paste the link and the app will automatically recognize its type!' 
                      : 'तस्बिरहरूका लागि गुगल ड्राइभ वा सिधा छवि लिङ्कहरू, र भिडियोहरूका लागि युट्युब वा सर्ट्स भिडियोहरू थप्नुहोस्। लिङ्क राख्दा एपले यसको प्रकार स्वतः चिन्नेछ!'}
                  </p>
                </div>

                {/* Bulk Paste Box */}
                {showBulkPaste && (
                  <div className="p-4 bg-teal-900 text-white rounded-2xl border border-teal-700 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-teal-200 flex items-center gap-1.5">
                        <DownloadCloud className="w-4 h-4 text-emerald-400" />
                        <span>{lang === 'en' ? 'Paste Media Links (One per line or comma-separated)' : 'मिडिया लिङ्कहरू पेस्ट गर्नुहोस् (प्रति लाइन एक वा अल्पविरामद्वारा छुट्याइएको)'}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowBulkPaste(false)}
                        className="text-gray-300 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={bulkLinksText}
                      onChange={(e) => setBulkLinksText(e.target.value)}
                      placeholder={`https://drive.google.com/file/d/1A2B3C4D5E/view\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ`}
                      className="w-full p-3 bg-teal-950 border border-teal-700 rounded-xl text-xs font-mono text-teal-100 focus:outline-none focus:border-emerald-400"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-teal-300">
                        💡 {lang === 'en' ? 'Supports Google Drive photo/file links, direct image URLs, and YouTube watch links.' : 'गुगल ड्राइभ फोटो लिङ्क, सिधा छवि युआरएल र युट्युब भिडियो लिङ्कहरू समर्थन गर्दछ।'}
                      </span>
                      <button
                        type="button"
                        onClick={handleBulkImportLinks}
                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Import All Links' : 'सबै लिङ्कहरू थप्नुहोस्'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {mediaItems.map((item, idx) => (
                    <div key={item.id} className="bg-white p-3.5 rounded-xl border border-teal-100 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                            {item.type === 'video' ? (
                              <Film className="w-3.5 h-3.5 text-amber-500" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                            Slide #{idx + 1}
                          </span>
                          
                          <select
                            value={item.type}
                            onChange={(e) => {
                              const newItems = [...mediaItems];
                              const newType = e.target.value as 'photo' | 'video';
                              newItems[idx].type = newType;
                              // Update default title if it hasn't been custom modified
                              if (newType === 'photo' && (item.titleEn === '' || item.titleEn.startsWith('YouTube Video'))) {
                                newItems[idx].titleEn = `Event Photo #${idx + 1}`;
                                newItems[idx].titleNe = `कार्यक्रम फोटो #${idx + 1}`;
                              } else if (newType === 'video' && (item.titleEn === '' || item.titleEn.startsWith('Event Photo'))) {
                                newItems[idx].titleEn = `YouTube Video #${idx + 1}`;
                                newItems[idx].titleNe = `युट्युब भिडियो #${idx + 1}`;
                              }
                              setMediaItems(newItems);
                            }}
                            className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg px-2 py-0.5 outline-none cursor-pointer focus:border-teal-500"
                          >
                            <option value="photo">📷 Photo (Drive / Direct URL)</option>
                            <option value="video">🎥 Video (YouTube Link)</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveMediaRow(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={item.titleEn}
                          onChange={(e) => {
                            const newItems = [...mediaItems];
                            newItems[idx].titleEn = e.target.value;
                            setMediaItems(newItems);
                          }}
                          placeholder={item.type === 'photo' ? "Photo Title / Caption" : "Video Title / Caption"}
                          className="px-3 py-2 bg-teal-50/50 border border-teal-100 rounded-lg text-xs font-medium text-teal-950"
                        />

                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => {
                            const newItems = [...mediaItems];
                            const val = e.target.value;
                            newItems[idx].url = val;
                            if (val.trim()) {
                              const detectedType = detectMediaType(val);
                              newItems[idx].type = detectedType;
                              
                              // Update default title if empty or matches previous defaults
                              const cleanTitleEn = item.titleEn.trim();
                              if (cleanTitleEn === '' || cleanTitleEn.startsWith('Media Item') || cleanTitleEn.startsWith('Event Photo') || cleanTitleEn.startsWith('YouTube Video')) {
                                if (detectedType === 'photo') {
                                  newItems[idx].titleEn = `Event Photo #${idx + 1}`;
                                  newItems[idx].titleNe = `कार्यक्रम फोटो #${idx + 1}`;
                                } else {
                                  newItems[idx].titleEn = `YouTube Video #${idx + 1}`;
                                  newItems[idx].titleNe = `युट्युब भिडियो #${idx + 1}`;
                                }
                              }
                            }
                            setMediaItems(newItems);
                          }}
                          placeholder={item.type === 'photo' ? "Paste Photo Link (Google Drive / Direct URL)" : "Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"}
                          className="w-full px-3 py-2 bg-teal-50/50 border border-teal-100 rounded-lg text-xs font-medium text-teal-950 focus:outline-none focus:border-teal-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Publish & Auto-Generate Dedicated Page' : 'प्रकाशित गर्नुहोस् र अलग पृष्ठ सिर्जना गर्नुहोस्'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: INSTRUCTION GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6 text-gray-800">
              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  {lang === 'en' ? 'How Google Drive & YouTube Links Integration Works' : 'गुगल ड्राइभ र युट्युब लिङ्क एकीकरण कसरी काम गर्छ'}
                </h3>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {lang === 'en' 
                    ? 'No image file hosting required! Your website directly streams high-resolution photos from Google Drive and embeds videos from YouTube.'
                    : 'कुनै फोटो फाइल होस्टिङ आवश्यक छैन! तपाईंको वेबसाइटले गुगल ड्राइभबाट सीधा तस्बिरहरू र युट्युबबाट भिडियोहरू लोड गर्दछ।'}
                </p>
              </div>

              {/* Step 1 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                <div className="w-8 h-8 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-teal-950">
                    {lang === 'en' ? 'Google Drive Link for Photos' : 'तस्बिरहरूका लागि गुगल ड्राइभ लिङ्क'}
                  </h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Upload your event photos to a Google Drive folder or file → Right-click file/folder → Share → Set access permission to <strong>"Anyone with the link can view"</strong> → Copy link and paste it here!
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                <div className="w-8 h-8 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-teal-950">
                    {lang === 'en' ? 'YouTube Video Links' : 'युट्युब भिडियो लिङ्कहरू'}
                  </h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    For videos, select <strong>"🎥 Video"</strong> and paste any standard YouTube video or Shorts link (e.g., <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">https://www.youtube.com/watch?v=...</code>).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                <div className="w-8 h-8 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-teal-950">
                    {lang === 'en' ? 'Bulk Import' : 'एकैपटक धेरै लिङ्कहरू थप्ने'}
                  </h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Click <strong>"Bulk Paste Links"</strong> to paste dozens of Google Drive and YouTube links at once. The app will automatically separate photos and videos into structured post gallery items.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-emerald-950">
                    {lang === 'en' ? 'Online Server Syncing' : 'अनलाइन सर्भर सिङ्क'}
                  </h4>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    Once published, the post data is saved online to the database server. All visitors accessing the website worldwide can view the newly created post page immediately!
                  </p>
                </div>
              </div>
            </div>
          )}

            </div>
          </>
        )}
      </div>
    </div>
  );
}
