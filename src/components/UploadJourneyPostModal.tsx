import React, { useState, useEffect } from 'react';
import { 
  X, Upload, Plus, Trash2, Image as ImageIcon, Film, HelpCircle, 
  Check, Sparkles, FolderPlus, ArrowRight, Video, FileText, Link as LinkIcon,
  ShieldCheck, Lock, Key, LogOut, Database, CheckCircle2
} from 'lucide-react';
import { Album, AlbumMediaItem, Language } from '../types';

interface UploadJourneyPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddAlbum: (newAlbum: Album) => void;
  onAddMediaToAlbum?: (albumId: string, newMedia: AlbumMediaItem[]) => void;
  existingAlbums?: Album[];
}

export default function UploadJourneyPostModal({
  isOpen,
  onClose,
  lang,
  onAddAlbum,
  existingAlbums = [],
}: UploadJourneyPostModalProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'guide'>('create');

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('chaurasiya_admin_authenticated') === 'true';
  });
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
  
  // Cover Image
  const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200');

  // Media items state
  const [mediaItems, setMediaItems] = useState<Array<{
    id: string;
    titleEn: string;
    titleNe: string;
    type: 'photo' | 'video';
    url: string;
    fileObj?: File;
  }>>([
    {
      id: 'item-1',
      titleEn: 'Main Event Photo',
      titleNe: 'मुख्य कार्यक्रम फोटो',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200'
    }
  ]);

  if (!isOpen) return null;

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const validPasscodes = ['2026', '8888', 'chaurasiya2026', 'admin'];
    if (validPasscodes.includes(inputPasscode.trim().toLowerCase())) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('chaurasiya_admin_authenticated', 'true');
      setPasscodeError(false);
      setInputPasscode('');
    } else {
      setPasscodeError(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('chaurasiya_admin_authenticated');
  };

  // Cover image file handler
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add individual media item file handler
  const handleMediaFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newItems = [...mediaItems];
          newItems[index].url = event.target.result as string;
          newItems[index].type = isVid ? 'video' : 'photo';
          if (!newItems[index].titleEn) {
            newItems[index].titleEn = file.name;
            newItems[index].titleNe = file.name;
          }
          setMediaItems(newItems);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMediaRow = () => {
    setMediaItems([
      ...mediaItems,
      {
        id: `item-${Date.now()}`,
        titleEn: `Media Item ${mediaItems.length + 1}`,
        titleNe: `मिडिया आइटम ${mediaItems.length + 1}`,
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

    const formattedMediaItems: AlbumMediaItem[] = mediaItems.map((m, idx) => ({
      id: `media-${newAlbumId}-${idx}`,
      title: { en: m.titleEn || `Photo ${idx + 1}`, ne: m.titleNe || `फोटो ${idx + 1}` },
      description: { en: descEn, ne: descNe },
      type: m.type,
      url: m.url || coverUrl,
      date: dateStr,
      location: { en: locationEn, ne: locationNe }
    }));

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
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200',
      date: dateStr,
      location: {
        en: locationEn,
        ne: locationNe,
      },
      tags: parsedTags.length > 0 ? parsedTags : ['Community', 'Journey'],
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
            {isAdminAuthenticated && (
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
        {!isAdminAuthenticated ? (
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
                  value={inputPasscode}
                  onChange={(e) => {
                    setInputPasscode(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder={lang === 'en' ? 'Passcode (Default: 2026)' : 'पासकोड (पूर्वनिर्धारित: 2026)'}
                  className="w-full px-4 py-2.5 bg-white border border-teal-200 rounded-xl text-sm font-medium text-teal-950 focus:outline-none focus:border-teal-600 shadow-sm"
                />
                {passcodeError && (
                  <p className="text-xs font-bold text-red-600 mt-1">
                    {lang === 'en' ? '❌ Invalid Passcode. Please try default passcode: 2026' : '❌ अमान्य पासकोड। कृपया पूर्वनिर्धारित पासकोड प्रयास गर्नुहोस्: 2026'}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-teal-700 font-bold bg-teal-100/60 p-2.5 rounded-xl border border-teal-200/60">
                <span>🔑 {lang === 'en' ? 'Default Admin PIN:' : 'पूर्वनिर्धारित एडमिन पिन:'} <strong>2026</strong></span>
                <span className="text-teal-900">({lang === 'en' ? 'or 8888' : 'वा 8888'})</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'en' ? 'Unlock Admin Media Portal' : 'एडमिन मिडिया पोर्टल खोल्नुहोस्'}</span>
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

              {/* Cover Image Group */}
              <div className="bg-teal-50/40 p-4 sm:p-6 rounded-2xl border border-teal-100 space-y-4">
                <h3 className="text-sm font-black text-teal-950 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  {lang === 'en' ? '2. Cover Banner Photo' : '२. मुख्य कभर फोटो'}
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-48 aspect-video rounded-xl bg-teal-950 overflow-hidden relative border border-teal-200 shrink-0">
                    <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <label className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>{lang === 'en' ? 'Upload Cover Image File' : 'कभर फोटो फाइल छान्नुहोस्'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-gray-500 font-bold">OR</span>
                    </div>

                    <input
                      type="url"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      placeholder="Paste Image URL / Unsplash / Google Drive Link"
                      className="w-full px-3.5 py-2 bg-white border border-teal-200 rounded-xl text-xs font-medium text-teal-950"
                    />
                  </div>
                </div>
              </div>

              {/* Media Items Group (Photos & Videos) */}
              <div className="bg-teal-50/40 p-4 sm:p-6 rounded-2xl border border-teal-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-teal-950 uppercase tracking-wider flex items-center gap-2">
                    <Film className="w-4 h-4 text-teal-600" />
                    {lang === 'en' ? '3. Attached Photos & Videos' : '३. संलग्न फोटो तथा भिडियोहरू'}
                  </h3>

                  <button
                    type="button"
                    onClick={handleAddMediaRow}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-gray-950 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Add Item' : 'थप्नुहोस्'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {mediaItems.map((item, idx) => (
                    <div key={item.id} className="bg-white p-3.5 rounded-xl border border-teal-100 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider">
                          Item #{idx + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          <select
                            value={item.type}
                            onChange={(e) => {
                              const newItems = [...mediaItems];
                              newItems[idx].type = e.target.value as 'photo' | 'video';
                              setMediaItems(newItems);
                            }}
                            className="px-2.5 py-1 bg-teal-50 border border-teal-200 rounded-lg text-xs font-bold text-teal-900"
                          >
                            <option value="photo">📷 Photo</option>
                            <option value="video">🎥 Video (YouTube / MP4 / GDrive)</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleRemoveMediaRow(idx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                          placeholder="Media Caption / Title"
                          className="px-3 py-1.5 bg-teal-50/50 border border-teal-100 rounded-lg text-xs font-medium text-teal-950"
                        />

                        <div className="flex items-center gap-2">
                          <label className="px-3 py-1.5 bg-teal-100 hover:bg-teal-200 text-teal-900 rounded-lg text-xs font-bold cursor-pointer shrink-0">
                            Upload File
                            <input
                              type="file"
                              accept={item.type === 'video' ? 'video/*' : 'image/*'}
                              onChange={(e) => handleMediaFileUpload(idx, e)}
                              className="hidden"
                            />
                          </label>

                          <input
                            type="text"
                            value={item.url}
                            onChange={(e) => {
                              const newItems = [...mediaItems];
                              newItems[idx].url = e.target.value;
                              setMediaItems(newItems);
                            }}
                            placeholder={item.type === 'video' ? 'Paste YouTube watch URL or Google Drive Video URL' : 'Paste Image URL'}
                            className="w-full px-3 py-1.5 bg-teal-50/50 border border-teal-100 rounded-lg text-xs font-medium text-teal-950"
                          />
                        </div>
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
                  {lang === 'en' ? 'How Media Publishing & Page Auto-Creation Works' : 'मिडिया प्रकाशन र स्वतः पृष्ठ सिर्जना कसरी काम गर्छ'}
                </h3>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {lang === 'en' 
                    ? 'Every time you add a new post or upload media items in "Glimpses of Our Journey", the system automatically provisions a dedicated interactive page for that event post!'
                    : 'जब तपाईं "हाम्रो यात्राको झलक" मा नयाँ पोस्ट वा मिडिया अपलोड गर्नुहुन्छ, प्रणालीले त्यो कार्यक्रम पोस्टको लागि स्वचालित रूपमा एक अलग अन्तरक्रियात्मक पृष्ठ सिर्जना गर्दछ!'}
                </p>
              </div>

              {/* Step 1 */}
              <div className="flex gap-4 p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                <div className="w-8 h-8 rounded-full bg-teal-700 text-white font-black text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-teal-950">
                    {lang === 'en' ? 'Direct File Upload (From Phone or Computer)' : 'प्रत्यक्ष फाइल अपलोड (मोबाइल वा कम्प्युटरबाट)'}
                  </h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Click <strong>"Upload Cover Image File"</strong> or <strong>"Upload File"</strong> next to any item. You can select JPG, PNG, WEBP images or MP4 videos directly from your device storage. The system generates a instant high-resolution preview.
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
                    {lang === 'en' ? 'Using YouTube or External Video Links' : 'युट्युब वा बाह्य भिडियो लिङ्क प्रयोग गर्ने तरिका'}
                  </h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Set the item type to <strong>"🎥 Video"</strong> and paste any standard YouTube URL (e.g., <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">https://www.youtube.com/watch?v=...</code> or <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">https://youtu.be/...</code>). The player will embed YouTube smoothly.
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
                    {lang === 'en' ? 'Using Google Drive Photos & Videos' : 'गुगल ड्राइभका फोटो तथा भिडियो प्रयोग गर्ने तरिका'}
                  </h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Upload your photos/videos to Google Drive → Right click file → Share → Set access to <strong>"Anyone with the link can view"</strong> → Copy link and paste it directly into the URL input field.
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
                    {lang === 'en' ? 'Automatic Dedicated Page Creation' : 'स्वचालित अलग पृष्ठ सिर्जना'}
                  </h4>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">
                    Once you click <strong>"Publish & Auto-Generate Dedicated Page"</strong>, the application saves the media post and immediately opens the newly generated dedicated page with full-screen viewer, photo galleries, and video player!
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
