import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Play, Maximize2, Minimize2, 
  Calendar, MapPin, Tag, Film, Image as ImageIcon, ExternalLink, Share2, Info, ArrowLeft,
  Check
} from 'lucide-react';
import { Album, AlbumMediaItem, Language } from '../types';
import { parseMediaUrl } from '../utils/mediaUrl';

interface AlbumDetailProps {
  album: Album;
  lang: Language;
  onClose: () => void;
  onTrackAction: (actionName: string) => void;
}

export default function AlbumDetail({ album, lang, onClose, onTrackAction }: AlbumDetailProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredItems = album.mediaItems.filter((item) => {
    if (filter === 'photo') return item.type === 'photo';
    if (filter === 'video') return item.type === 'video';
    return true;
  });

  const currentItem: AlbumMediaItem | undefined = filteredItems[activeIdx] || filteredItems[0];

  const handleNext = useCallback(() => {
    if (filteredItems.length === 0) return;
    setActiveIdx((prev) => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (filteredItems.length === 0) return;
    setActiveIdx((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isFullscreen, onClose]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    onTrackAction(`Toggle Album Fullscreen: ${isFullscreen ? 'Exit' : 'Enter'}`);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    onTrackAction(`Shared album link: ${album.title.en}`);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const photoCount = album.mediaItems.filter((i) => i.type === 'photo').length;
  const videoCount = album.mediaItems.filter((i) => i.type === 'video').length;

  if (!currentItem) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-teal-100 text-center space-y-4">
        <p className="text-gray-500 font-medium">No media items found in this album category.</p>
        <button
          onClick={() => setFilter('all')}
          className="px-4 py-2 bg-teal-700 text-white font-bold rounded-lg text-sm"
        >
          Reset Filter
        </button>
      </div>
    );
  }

  const parsed = parseMediaUrl(currentItem.url, currentItem.type);

  return (
    <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden p-0' : 'space-y-8 bg-slate-900 text-white rounded-3xl p-4 sm:p-8 shadow-2xl border border-teal-800'}`}>
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4 px-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-teal-700 text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'en' ? 'Back to Albums' : 'सबै एल्बममा फर्कनुहोस्'}</span>
          </button>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white line-clamp-1">
              {album.title[lang]}
            </h2>
            <div className="flex items-center gap-3 text-xs text-teal-400 font-semibold mt-0.5">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {album.date}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {album.location[lang]}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Media Filter Tabs */}
          <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
            <button
              onClick={() => { setFilter('all'); setActiveIdx(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-emerald-500 text-gray-950 shadow-sm' : 'text-gray-300 hover:text-white'}`}
            >
              {lang === 'en' ? 'All' : 'सबै'} ({album.mediaItems.length})
            </button>
            <button
              onClick={() => { setFilter('photo'); setActiveIdx(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${filter === 'photo' ? 'bg-emerald-500 text-gray-950 shadow-sm' : 'text-gray-300 hover:text-white'}`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> {photoCount}
            </button>
            <button
              onClick={() => { setFilter('video'); setActiveIdx(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${filter === 'video' ? 'bg-emerald-500 text-gray-950 shadow-sm' : 'text-gray-300 hover:text-white'}`}
            >
              <Film className="w-3.5 h-3.5" /> {videoCount}
            </button>
          </div>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-teal-300 transition-colors relative"
            title="Share Album"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2.5 rounded-xl transition-colors ${showInfo ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            title="Toggle Caption Info"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-teal-700 text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isFullscreen && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Media Viewport Slider */}
      <div className="relative group bg-black/90 rounded-2xl overflow-hidden border border-gray-800 flex items-center justify-center min-h-[350px] sm:min-h-[520px] max-h-[750px]">
        
        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-emerald-500 hover:text-gray-950 text-white backdrop-blur-md border border-white/10 transition-all shadow-2xl opacity-90 group-hover:opacity-100"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Media Render Engine: Photo OR Video (HTML5, Google Drive Embed, YouTube Embed) */}
        <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
          {currentItem.type === 'video' ? (
            parsed.isEmbed ? (
              <div className="w-full aspect-video max-w-5xl rounded-xl overflow-hidden shadow-2xl bg-black border border-gray-800 relative">
                <iframe
                  src={parsed.formattedUrl}
                  title={currentItem.title[lang]}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                key={currentItem.id}
                controls
                autoPlay={false}
                poster={currentItem.thumbnailUrl || album.coverUrl}
                className="max-w-full max-h-[600px] rounded-xl object-contain shadow-2xl"
              >
                <source src={parsed.formattedUrl} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            )
          ) : (
            <img
              key={currentItem.id}
              src={parsed.formattedUrl}
              alt={currentItem.title[lang]}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[600px] object-contain rounded-xl shadow-2xl select-none transition-opacity duration-300"
            />
          )}
        </div>

        {/* Navigation Arrow Right */}
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-emerald-500 hover:text-gray-950 text-white backdrop-blur-md border border-white/10 transition-all shadow-2xl opacity-90 group-hover:opacity-100"
          title="Next (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Counter Badge */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-emerald-400">
          {activeIdx + 1} / {filteredItems.length}
        </div>

        {/* Media Type Badge */}
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-1.5">
          {currentItem.type === 'video' ? (
            <>
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase tracking-wider text-[10px] text-amber-300">Video Content</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
              <span className="uppercase tracking-wider text-[10px] text-teal-300">High-Res Photo</span>
            </>
          )}
        </div>

        {/* Optional Caption Info Overlay at bottom of slider */}
        {showInfo && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 sm:p-6 text-white backdrop-blur-sm border-t border-white/5">
            <h3 className="text-base sm:text-lg font-extrabold text-teal-200">
              {currentItem.title[lang]}
            </h3>
            {currentItem.description && (
              <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-4xl mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                {currentItem.description[lang]}
              </p>
            )}
            {currentItem.location && (
              <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-emerald-400">
                <MapPin className="w-3 h-3" />
                <span>{currentItem.location[lang]}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filmstrip / Thumbnail Grid Selection Bar */}
      <div className="space-y-3 px-1">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-teal-400">
          <span>{lang === 'en' ? 'Album Thumbnails' : 'एल्बम थम्बनेलहरू'} ({filteredItems.length})</span>
          <span className="text-gray-400 font-normal normal-case">Use ← → arrow keys to navigate</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 custom-scrollbar scroll-smooth">
          {filteredItems.map((item, idx) => {
            const itemParsed = parseMediaUrl(item.url, item.type);
            const isSelected = idx === activeIdx;
            const thumbSrc = item.thumbnailUrl || (item.type === 'photo' ? itemParsed.formattedUrl : album.coverUrl);

            return (
              <button
                key={item.id}
                onClick={() => setActiveIdx(idx)}
                className={`relative shrink-0 w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden border-2 transition-all group ${
                  isSelected
                    ? 'border-emerald-400 scale-105 shadow-lg shadow-emerald-500/20'
                    : 'border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-600'
                }`}
              >
                <img
                  src={thumbSrc}
                  alt={item.title[lang]}
                  className="w-full h-full object-cover"
                />
                
                {item.type === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-amber-500/90 text-gray-950 flex items-center justify-center shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-bold text-white uppercase">
                  {item.type === 'video' ? 'VID' : 'IMG'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Album Metadata & Tag Footer */}
      {!isFullscreen && (
        <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/60 space-y-4 text-sm text-gray-300">
          <div>
            <h4 className="font-bold text-white mb-1 uppercase text-xs tracking-wider text-teal-400">
              {lang === 'en' ? 'About this Album' : 'यस एल्बमको बारेमा'}
            </h4>
            <p className="leading-relaxed font-medium">
              {album.description[lang]}
            </p>
          </div>

          {album.tags && album.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-700/40">
              <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-teal-400" /> Tags:
              </span>
              {album.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800 text-xs font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
