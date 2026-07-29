import React, { useState } from 'react';
import { Mail, Search, Image as ImageIcon, FileText, CheckCircle2, ChevronRight, X, Download, Eye, Plus, ExternalLink, Trash2, ShieldCheck, Sparkles, Share2 } from 'lucide-react';
import { Language, Notice, GalleryItem } from '../types';
import { notices as defaultNotices, galleryItems } from '../data/communityData';
import { extractGoogleDriveId, formatDriveImageUrl, getGoogleDriveDownloadUrl, formatNumber } from '../utils/mediaUrl';
import ShareModal from './ShareModal';
import { getShareUrl } from '../utils/shareUtils';

interface NoticeGalleryProps {
  lang: Language;
  onSubscribe?: (email: string) => void;
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
  const [shareTargetNotice, setShareTargetNotice] = useState<Notice | null>(null);

  // Back button popstate listener
  React.useEffect(() => {
    const handlePopState = () => {
      if (selectedImage) {
        setSelectedImage(null);
      } else if (viewPdfNoticeId) {
        setViewPdfNoticeId(null);
      } else if (expandedNoticeId) {
        setExpandedNoticeId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedImage, viewPdfNoticeId, expandedNoticeId]);

  // Deep link URL parameter listener for specific notice share links
  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const noticeParam = searchParams.get('notice');
    if (noticeParam) {
      setExpandedNoticeId(noticeParam);
      setTimeout(() => {
        const elem = document.getElementById(`notice-card-${noticeParam}`);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, []);

  const t = {
    noticesHeading: { en: 'Official Notices & Current Works', ne: 'आधिकारिक सूचनाहरू र वर्तमान कार्यहरू' },
    galleryHeading: { en: 'Interactive Media Gallery', ne: 'अन्तरक्रियात्मक मिडिया ग्यालरी' },
    searchPlaceholder: { en: 'Search notices or news...', ne: 'सूचनाहरू वा समाचार खोज्नुहोस्...' },
    all: { en: 'All Categories', ne: 'सबै विधाहरू' },
    work: { en: 'Current Works', ne: 'सञ्चालित कार्यहरू' },
    notice: { en: 'Bulletins', ne: 'सूचनाहरू' },
    press: { en: 'Press Releases', ne: 'प्रेस विज्ञप्ति' },
    close: { en: 'Close', ne: 'बन्द गर्नुहोस्' },
  };

  const filteredNotices = noticesList.filter((notice) => {
    const titleMatch = (notice.title[lang] || notice.title.en || '').toLowerCase().includes(searchTerm.toLowerCase());
    const contentMatch = (notice.content[lang] || notice.content.en || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || contentMatch;
    const matchesCat = selectedNoticeCat === 'all' || notice.category === selectedNoticeCat;
    return matchesSearch && matchesCat;
  });

  const handleOpenLightbox = (item: GalleryItem) => {
    window.history.pushState({ modal: 'notice-gallery' }, '');
    setSelectedImage(item);
    onTrackAction(`Open gallery image: ${item.title[lang]}`);
  };

  return (
    <div className="space-y-12">
      {/* Notices & Bulletins Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Notices list column */}
        <div className="lg:col-span-12 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-50 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-teal-950 dark:text-teal-100 flex items-center gap-2">
                <FileText className="w-6 h-6 text-teal-600 dark:text-emerald-400" />
                {t.noticesHeading[lang]}
              </h2>
              <p className="text-xs font-bold text-teal-600 dark:text-emerald-400 uppercase tracking-wide mt-1">
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
              <div className="flex flex-wrap gap-1 bg-teal-50 dark:bg-slate-800 p-1 rounded-lg border border-teal-100 dark:border-slate-700">
                {(['all', 'work', 'notice', 'press'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedNoticeCat(cat);
                      onTrackAction(`Filter notices by ${cat}`);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      selectedNoticeCat === cat
                        ? 'bg-teal-700 dark:bg-emerald-600 text-white shadow-sm'
                        : 'text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-slate-700'
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
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-teal-600/60 dark:text-emerald-400/60" />
            <input
              type="text"
              placeholder={t.searchPlaceholder[lang]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-teal-50/50 dark:bg-slate-800/80 border border-teal-100 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-teal-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-teal-900 dark:text-teal-100 placeholder:text-gray-400"
            />
          </div>

          {/* Notices renderer */}
          <div className="space-y-6">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  id={`notice-card-${notice.id}`}
                  className="rounded-xl border border-teal-100 dark:border-slate-800 bg-gradient-to-b from-white to-teal-50/20 dark:from-slate-900 dark:to-slate-800/50 hover:shadow-md hover:border-teal-200 dark:hover:border-slate-700 transition-all overflow-hidden"
                >
                  <div 
                    className="p-5 cursor-pointer hover:bg-teal-50/50 dark:hover:bg-slate-800/50 transition-colors"
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
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                              : notice.category === 'notice'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800'
                              : 'bg-teal-100 text-teal-800 border border-teal-200 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800'
                          }`}
                        >
                          {t[notice.category][lang]}
                        </span>
                        <span className="text-xs font-semibold text-teal-600/80 dark:text-emerald-400/80 font-mono">
                          🗓️ {formatNumber(notice.date, lang)}
                        </span>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-teal-400 transition-transform ${expandedNoticeId === notice.id ? 'rotate-90' : ''}`} />
                    </div>
                    <h3 className="text-lg font-extrabold text-teal-950 dark:text-teal-100 transition-colors">
                      {formatNumber(notice.title[lang], lang)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-relaxed">
                      {formatNumber(notice.content[lang], lang)}
                    </p>
                  </div>
                  
                  {expandedNoticeId === notice.id && (
                    <div className="px-5 pb-5 pt-3 bg-teal-50/40 dark:bg-slate-800/80 border-t border-teal-100 dark:border-slate-800 space-y-4">
                      {/* Attached File Google Drive Banner */}
                      {(notice.driveFileUrl || notice.fileUrl) && (
                        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950 dark:text-emerald-200 font-medium">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-600 text-white rounded-lg">📄</span>
                            <div>
                              <span className="font-extrabold block text-emerald-900 dark:text-emerald-300">
                                {lang === 'en' ? 'Google Drive Attached Document/File' : 'गुगल ड्राइभ संलग्न कागजात/फाइल'}
                              </span>
                              <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
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
                              setShareTargetNotice(notice);
                              onTrackAction(`Opened share modal for notice: ${notice.title.en}`);
                            }}
                            className="text-xs font-bold text-teal-900 dark:text-emerald-300 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <Share2 className="w-3.5 h-3.5 text-teal-700 dark:text-emerald-400" />
                            <span>{lang === 'en' ? 'Share Notice' : 'सूचना सेयर गर्नुहोस्'}</span>
                          </button>

                          {(notice.driveFileUrl || notice.fileUrl) ? (
                            <>
                              <a 
                                href={notice.driveFileUrl || notice.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => onTrackAction(`Opened notice file in Drive: ${notice.title.en}`)}
                                className="text-xs font-bold text-teal-800 dark:text-teal-200 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
                                {lang === 'en' ? 'View on Google Drive' : 'गुगल ड्राइभमा हेर्नुहोस्'}
                              </a>
                              <a 
                                href={getGoogleDriveDownloadUrl(notice.driveFileUrl || notice.fileUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={`Notice_${notice.date || 'file'}`}
                                onClick={() => onTrackAction(`Downloaded notice file directly: ${notice.title.en}`)}
                                className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                {lang === 'en' ? 'Direct Download File' : 'फाइल सिधा डाउनलोड गर्नुहोस्'}
                              </a>
                            </>
                          ) : (
                            <a 
                              href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                              target="_blank"
                              download={`Notice_${notice.date}.pdf`}
                              onClick={() => onTrackAction(`Downloaded notice: ${notice.title.en}`)}
                              className="text-xs font-bold text-teal-800 dark:text-teal-200 bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
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
                            className="text-xs font-extrabold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === 'en' ? 'Delete Notice (Admin)' : 'सूचना हटाउनुहोस्'}</span>
                          </button>
                        )}
                      </div>
                      
                      {viewPdfNoticeId === notice.id && (
                        <div className="mt-4 rounded-2xl overflow-hidden border border-teal-200 dark:border-slate-700 shadow-inner bg-slate-900">
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
              <div className="text-center py-10 bg-teal-50/40 dark:bg-slate-800/40 border border-dashed border-teal-200 dark:border-slate-700 rounded-xl text-gray-500 dark:text-gray-400">
                No active notices found matching your filters.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Gallery Section */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-teal-100 dark:border-slate-800 shadow-sm space-y-6">
        <div className="border-b border-teal-50 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-extrabold text-teal-950 dark:text-teal-100 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-teal-600 dark:text-emerald-400" />
            {t.galleryHeading[lang]}
          </h2>
          <p className="text-xs font-bold text-teal-600 dark:text-emerald-400 uppercase tracking-wide mt-1">
            Visual archive of community outreach, events, and agricultural fields
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(item)}
              className="group cursor-pointer bg-teal-50/30 dark:bg-slate-800/40 rounded-xl overflow-hidden border border-teal-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-slate-700 hover:shadow-md transition-all flex flex-col"
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
                  <h4 className="font-bold text-teal-950 dark:text-teal-100 text-sm group-hover:text-teal-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title[lang]}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 line-clamp-2">
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
          <div className="relative max-w-3xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-teal-100 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row">
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
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-teal-50/20 dark:bg-slate-800/50">
              <div className="space-y-4">
                <span className="inline-block px-2.5 py-1 bg-teal-100 dark:bg-slate-700 text-teal-800 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wide rounded">
                  Chaurasiya Archive
                </span>
                <h3 className="text-xl font-extrabold text-teal-950 dark:text-teal-100">
                  {selectedImage.title[lang]}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {selectedImage.description[lang]}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-teal-100/60 dark:border-slate-700 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-teal-600 dark:bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                  CS
                </span>
                <div>
                  <span className="block text-xs font-bold text-teal-900 dark:text-teal-100">Chaurasiya Samaj Nepal</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Historical Gallery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal Dialog for Notice */}
      {shareTargetNotice && (
        <ShareModal
          isOpen={!!shareTargetNotice}
          onClose={() => setShareTargetNotice(null)}
          title={shareTargetNotice.title[lang] || shareTargetNotice.title.en}
          text={shareTargetNotice.content[lang] || shareTargetNotice.content.en}
          url={getShareUrl('notice', shareTargetNotice.id)}
          lang={lang}
        />
      )}
    </div>
  );
}
