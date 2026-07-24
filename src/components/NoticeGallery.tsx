import React, { useState } from 'react';
import { Mail, Search, Image as ImageIcon, FileText, CheckCircle2, ChevronRight, X, Download, Eye, Plus, ExternalLink, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { Language, Notice, GalleryItem } from '../types';
import { notices as defaultNotices, galleryItems } from '../data/communityData';
import { extractGoogleDriveId, formatDriveImageUrl, getGoogleDriveDownloadUrl, formatNumber } from '../utils/mediaUrl';

interface NoticeGalleryProps {
  lang: Language;
  onSubscribe: (email: string) => void;
  onTrackAction: (actionName: string) => void;
  isAdmin?: boolean;
  onOpenAddNoticeModal?: () => void;
  onOpenAdminModal?: () => void;
  noticesList?: Notice[];
  onDeleteNotice?: (id: string) => void;
}

export default function NoticeGallery({
  lang,
  onSubscribe,
  onTrackAction,
  isAdmin = false,
  onOpenAddNoticeModal,
  onOpenAdminModal,
  noticesList = defaultNotices,
  onDeleteNotice,
}: NoticeGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNoticeCat, setSelectedNoticeCat] = useState<'all' | 'work' | 'notice' | 'press'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);
  const [viewPdfNoticeId, setViewPdfNoticeId] = useState<string | null>(null);
  
  // Newsletter state
  const [newsEmail, setNewsEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const t = {
    noticesHeading: { en: 'Official Notices & Current Works', ne: 'आधिकारिक सूचनाहरू र वर्तमान कार्यहरू' },
    galleryHeading: { en: 'Interactive Media Gallery', ne: 'अन्तरक्रियात्मक मिडिया ग्यालरी' },
    newsletterHeading: { en: 'Secure Subscription Portal', ne: 'सुरक्षित बुलेटिन सदस्यता' },
    newsletterSub: {
      en: 'Stay informed with real-time push bulletins about healthcare camps, scholarships, and agricultural programs.',
      ne: 'स्वास्थ्य शिविर, छात्रवृत्ति र कृषि कार्यक्रमहरूको बारेमा वास्तविक समयमा पुश बुलेटिनहरू प्राप्त गर्नुहोस्।',
    },
    subSuccess: {
      en: 'Welcome to Chaurasiya Samaj bulletins! Verification email dispatched.',
      ne: 'चौरसिया समाज बुलेटिनमा स्वागत छ! प्रमाणीकरण इमेल पठाइयो।',
    },
    searchPlaceholder: { en: 'Search notices or news...', ne: 'सूचनाहरू वा समाचार खोज्नुहोस्...' },
    all: { en: 'All Categories', ne: 'सबै विधाहरू' },
    work: { en: 'Current Works', ne: 'सञ्चालित कार्यहरू' },
    notice: { en: 'Bulletins', ne: 'सूचनाहरू' },
    press: { en: 'Press Releases', ne: 'प्रेस विज्ञप्ति' },
    btnSub: { en: 'Subscribe Now', ne: 'अहिले नै सदस्य बन्नुहोस्' },
    close: { en: 'Close', ne: 'बन्द गर्नुहोस्' },
  };

  const filteredNotices = noticesList.filter((notice) => {
    const titleMatch = (notice.title[lang] || notice.title.en || '').toLowerCase().includes(searchTerm.toLowerCase());
    const contentMatch = (notice.content[lang] || notice.content.en || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || contentMatch;
    const matchesCat = selectedNoticeCat === 'all' || notice.category === selectedNoticeCat;
    return matchesSearch && matchesCat;
  });

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      onSubscribe(newsEmail.trim());
      setIsSubscribed(true);
      onTrackAction(`Newsletter subscribe: ${newsEmail}`);
      setTimeout(() => {
        setIsSubscribed(false);
        setNewsEmail('');
      }, 5000);
    }
  };

  const handleOpenLightbox = (item: GalleryItem) => {
    setSelectedImage(item);
    onTrackAction(`Open gallery image: ${item.title[lang]}`);
  };

  return (
    <div className="space-y-12">
      {/* Notices & Bulletins Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Notices list column */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-50 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-teal-950 flex items-center gap-2">
                <FileText className="w-6 h-6 text-teal-600" />
                {t.noticesHeading[lang]}
              </h2>
              <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mt-1">
                Transparency and announcements portal
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              {/* Admin Add Notice Button ONLY visible after central admin login */}
              {isAdmin && onOpenAddNoticeModal && (
                <button
                  onClick={onOpenAddNoticeModal}
                  className="px-4 py-2 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {lang === 'en' ? '+ Add Community Notice' : '+ सूचना थप्नुहोस्'}
                  </span>
                </button>
              )}

              {/* Filter buttons */}
              <div className="flex flex-wrap gap-1 bg-teal-50 p-1 rounded-lg border border-teal-100">
                {(['all', 'work', 'notice', 'press'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedNoticeCat(cat);
                      onTrackAction(`Filter notices by ${cat}`);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      selectedNoticeCat === cat
                        ? 'bg-teal-700 text-white shadow-sm'
                        : 'text-teal-800 hover:bg-teal-100'
                    }`}
                  >
                    {t[cat][lang]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-teal-600/60" />
            <input
              type="text"
              placeholder={t.searchPlaceholder[lang]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-teal-50/50 border border-teal-100 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-teal-900"
            />
          </div>

          {/* Notices renderer */}
          <div className="space-y-6">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="rounded-xl border border-teal-100 bg-gradient-to-b from-white to-teal-50/20 hover:shadow-md hover:border-teal-200 transition-all overflow-hidden"
                >
                  <div 
                    className="p-5 cursor-pointer hover:bg-teal-50/50 transition-colors"
                    onClick={() => {
                      setExpandedNoticeId(prev => prev === notice.id ? null : notice.id);
                      setViewPdfNoticeId(null);
                      onTrackAction(`Toggled notice expansion: ${notice.title.en}`);
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-extrabold tracking-wide rounded uppercase ${
                            notice.category === 'work'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : notice.category === 'notice'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-teal-100 text-teal-800 border border-teal-200'
                          }`}
                        >
                          {t[notice.category][lang]}
                        </span>
                        <span className="text-xs font-semibold text-teal-600/80 font-mono">
                          🗓️ {formatNumber(notice.date, lang)}
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-teal-400 transition-transform ${expandedNoticeId === notice.id ? 'rotate-90' : ''}`} />
                    </div>
                    <h3 className="text-lg font-extrabold text-teal-950 transition-colors">
                      {formatNumber(notice.title[lang], lang)}
                    </h3>
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                      {formatNumber(notice.content[lang], lang)}
                    </p>
                  </div>
                  
                  {expandedNoticeId === notice.id && (
                    <div className="px-5 pb-5 pt-3 bg-teal-50/40 border-t border-teal-100 space-y-4">
                      {/* Attached File Google Drive Banner */}
                      {(notice.driveFileUrl || notice.fileUrl) && (
                        <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950 font-medium">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-600 text-white rounded-lg">📄</span>
                            <div>
                              <span className="font-extrabold block text-emerald-900">
                                {lang === 'en' ? 'Google Drive Attached Document/File' : 'गुगल ड्राइभ संलग्न कागजात/फाइल'}
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
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg shadow-sm transition-all flex items-center gap-1.5 shrink-0"
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
                              onTrackAction(`Toggled view PDF: ${notice.title.en}`);
                            }}
                            className="text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                          >
                            {viewPdfNoticeId === notice.id ? <X className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            {viewPdfNoticeId === notice.id 
                              ? (lang === 'en' ? 'Close Preview' : 'पूर्वप्रदर्शन बन्द गर्नुहोस्') 
                              : (lang === 'en' ? 'View Document Preview' : 'कागजात पूर्वप्रदर्शन हेर्नुहोस्')}
                          </button>

                          {(notice.driveFileUrl || notice.fileUrl) ? (
                            <>
                              <a 
                                href={notice.driveFileUrl || notice.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => onTrackAction(`Opened notice file in Drive: ${notice.title.en}`)}
                                className="text-xs font-bold text-teal-800 bg-white border border-teal-200 hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                                {lang === 'en' ? 'View on Google Drive' : 'गुगल ड्राइभमा हेर्नुहोस्'}
                              </a>
                              <a 
                                href={getGoogleDriveDownloadUrl(notice.driveFileUrl || notice.fileUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={`Notice_${notice.date || 'file'}`}
                                onClick={() => onTrackAction(`Downloaded notice file directly: ${notice.title.en}`)}
                                className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-600" />
                                {lang === 'en' ? 'Direct Download File' : 'फाइल सिधा डाउनलोड गर्नुहोस्'}
                              </a>
                            </>
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
                                className="w-full h-[450px]"
                                title={notice.title.en || notice.title.ne}
                              />
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-teal-50/40 border border-dashed border-teal-200 rounded-xl text-gray-500">
                No active notices found matching your filters.
              </div>
            )}
          </div>
        </div>

        {/* Secure Newsletter Widget Column */}
        <div className="lg:col-span-4 bg-teal-950 text-white p-6 sm:p-8 rounded-2xl border-b-8 border-emerald-500 shadow-md space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-teal-50">
              {t.newsletterHeading[lang]}
            </h2>
            <p className="text-xs text-teal-300 font-bold uppercase tracking-wider">
              100% Privacy • encrypted pipeline
            </p>
          </div>

          <p className="text-sm text-teal-200/90 leading-relaxed">
            {t.newsletterSub[lang]}
          </p>
          {isSubscribed ? (
            <div className="p-4 bg-teal-900/90 border border-emerald-500/50 rounded-xl flex items-start gap-3 text-emerald-300 animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <div className="text-xs leading-relaxed font-semibold">
                {t.subSuccess[lang]}
              </div>
            </div>
          ) : (
            <form onSubmit={handleNewsSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-4 py-3 rounded-lg bg-teal-900/60 border border-teal-800 focus:outline-none focus:border-emerald-400 focus:bg-teal-900 text-sm text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {t.btnSub[lang]} <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}
          <div className="pt-4 border-t border-teal-800 text-[11px] text-teal-400 flex flex-col gap-1.5 font-medium">
            <span>🛡️ Compliant with international data practices.</span>
            <span>✉️ Unsubscribe with 1-click in any email footer.</span>
          </div>
        </div>
      </section>

      {/* Interactive Gallery Section */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-6">
        <div className="border-b border-teal-50 pb-4">
          <h2 className="text-2xl font-extrabold text-teal-950 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-teal-600" />
            {t.galleryHeading[lang]}
          </h2>
          <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mt-1">
            Visual archive of community outreach, events, and agricultural fields
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(item)}
              className="group cursor-pointer bg-teal-50/30 rounded-xl overflow-hidden border border-teal-100 hover:border-teal-300 hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative overflow-hidden aspect-video bg-teal-900">
                <img
                  src={item.imageUrl}
                  alt={item.title[lang]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs text-white font-bold bg-teal-600/90 px-2 py-1 rounded">
                    Click to View Details
                  </span>
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-teal-950 text-sm group-hover:text-teal-700 transition-colors">
                    {item.title[lang]}
                  </h4>
                  <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">
                    {item.description[lang]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden border border-teal-100 shadow-2xl flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all"
              title={t.close[lang]}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image side */}
            <div className="md:w-3/5 bg-black flex items-center justify-center aspect-video md:aspect-auto md:h-[450px]">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title[lang]}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Text details side */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-teal-50/20">
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-1 bg-teal-100 text-teal-800 text-[10px] font-extrabold uppercase tracking-wide rounded">
                  Chaurasiya Archive
                </span>
                <h3 className="text-xl font-extrabold text-teal-950">
                  {selectedImage.title[lang]}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedImage.description[lang]}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-teal-100/60 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
                  CS
                </span>
                <div>
                  <span className="block text-xs font-bold text-teal-900">Chaurasiya Samaj Nepal</span>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Historical Gallery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
