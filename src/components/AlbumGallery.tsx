import React, { useState } from 'react';
import { 
  Film, Image as ImageIcon, Search, Calendar, MapPin, Tag, ArrowRight, Play, Eye, 
  Grid, List, Sparkles, Folder
} from 'lucide-react';
import { Album, Language } from '../types';
import { journeyAlbums as defaultJourneyAlbums } from '../data/albumsData';
import AlbumDetail from './AlbumDetail';

interface AlbumGalleryProps {
  lang: Language;
  onTrackAction: (actionName: string) => void;
  initialSelectedAlbumId?: string | null;
  onBackToHome?: () => void;
  albums?: Album[];
  onSelectAlbum?: (albumId: string) => void;
  onOpenUploadModal?: () => void;
}

export default function AlbumGallery({ 
  lang, 
  onTrackAction, 
  initialSelectedAlbumId, 
  onBackToHome,
  albums = defaultJourneyAlbums,
  onSelectAlbum,
  onOpenUploadModal
}: AlbumGalleryProps) {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(initialSelectedAlbumId || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract unique tags across all albums
  const allTags = Array.from(new Set(albums.flatMap((a) => a.tags)));

  const selectedAlbum = albums.find((a) => a.id === selectedAlbumId);

  const filteredAlbums = albums.filter((album) => {
    const matchesSearch = 
      album.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.description[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.location[lang].toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === 'all' || album.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const handleOpenAlbum = (albumId: string) => {
    if (onSelectAlbum) {
      onSelectAlbum(albumId);
    } else {
      setSelectedAlbumId(albumId);
    }
    const album = albums.find(a => a.id === albumId);
    if (album) {
      onTrackAction(`Opened album: ${album.title.en}`);
    }
  };

  const t = {
    title: { en: 'Glimpses of Our Journey — Photo & Video Albums', ne: 'हाम्रो यात्राको झलक — फोटो तथा भिडियो एल्बमहरू' },
    sub: {
      en: 'Explore visual archives from community events, healthcare camps, agricultural expos, and youth workshops.',
      ne: 'सामुदायिक कार्यक्रम, स्वास्थ्य शिविर, कृषि मेला र युवा कार्यशालाहरूका दृश्य संग्रहहरू अन्वेषण गर्नुहोस्।',
    },
    searchPlaceholder: { en: 'Search albums by title, keyword or location...', ne: 'एल्बम शीर्षक, कीवर्ड वा स्थान द्वारा खोज्नुहोस्...' },
    allTags: { en: 'All Topics', ne: 'सबै विषयहरू' },
    noAlbums: { en: 'No albums found matching your filter criteria.', ne: 'तपाईंको फिल्टर मापदण्डसँग मिल्दो कुनै एल्बम फेला परेन।' },
  };

  // If an album is currently selected, render the interactive AlbumDetail view!
  if (selectedAlbum) {
    return (
      <div className="animate-in fade-in duration-200">
        <AlbumDetail
          album={selectedAlbum}
          lang={lang}
          onClose={() => setSelectedAlbumId(null)}
          onTrackAction={onTrackAction}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 py-2">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-b-8 border-emerald-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Chaurasiya Samaj Visual Archives
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-teal-50">
            {t.title[lang]}
          </h1>
          <p className="text-teal-100 text-sm sm:text-base font-medium leading-relaxed">
            {t.sub[lang]}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="text-xs font-bold uppercase tracking-wider px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/20"
              >
                ← {lang === 'en' ? 'Back to Homepage' : 'गृहपृष्ठमा फर्कनुहोस्'}
              </button>
            )}

            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="text-xs font-extrabold uppercase tracking-wider px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{lang === 'en' ? '+ Add Photos/Videos & Create Post' : '+ फोटो/भिडियो थप्नुहोस् र पोस्ट बनाउनुहोस्'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-teal-600" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder[lang]}
              className="w-full pl-10 pr-4 py-2.5 bg-teal-50/50 border border-teal-100 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 text-teal-950 font-medium placeholder:text-gray-400"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${viewMode === 'grid' ? 'bg-teal-700 text-white border-teal-700 shadow-sm' : 'bg-teal-50 text-teal-800 border-teal-200'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${viewMode === 'list' ? 'bg-teal-700 text-white border-teal-700 shadow-sm' : 'bg-teal-50 text-teal-800 border-teal-200'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tag Pills Filter */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-teal-50">
          <span className="text-xs font-bold text-teal-800 mr-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-teal-600" /> Tags:
          </span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedTag === 'all' ? 'bg-emerald-500 text-gray-950 shadow-sm' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'}`}
          >
            {t.allTags[lang]}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedTag === tag ? 'bg-emerald-500 text-gray-950 shadow-sm' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Albums Grid or List Display */}
      {filteredAlbums.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
          {filteredAlbums.map((album) => {
            const photosCount = album.mediaItems.filter(i => i.type === 'photo').length;
            const videosCount = album.mediaItems.filter(i => i.type === 'video').length;

            return (
              <div
                key={album.id}
                onClick={() => handleOpenAlbum(album.id)}
                className={`bg-white rounded-3xl border border-teal-100/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col ${viewMode === 'list' ? 'sm:flex-row sm:items-center' : ''}`}
              >
                {/* Cover Image Header */}
                <div className={`relative overflow-hidden bg-teal-950 ${viewMode === 'list' ? 'sm:w-72 aspect-video shrink-0' : 'aspect-[16/10]'}`}>
                  <img
                    src={album.coverUrl}
                    alt={album.title[lang]}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Item Counter Badges */}
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-bold text-teal-300 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-teal-400" /> {photosCount} {lang === 'en' ? 'Photos' : 'फोटोहरू'}
                    </span>
                    {videosCount > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 backdrop-blur-md text-[11px] font-bold text-amber-300 flex items-center gap-1 border border-amber-500/30">
                        <Film className="w-3 h-3 text-amber-400" /> {videosCount} {lang === 'en' ? 'Videos' : 'भिडियोहरू'}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 p-2 rounded-full bg-emerald-500 text-gray-950 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-3 text-xs font-bold text-teal-600 mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {album.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {album.location[lang]}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-teal-950 group-hover:text-teal-700 transition-colors line-clamp-2">
                      {album.title[lang]}
                    </h3>

                    <p className="text-gray-600 text-sm mt-2 line-clamp-3 leading-relaxed font-medium">
                      {album.description[lang]}
                    </p>
                  </div>

                  {/* Album Tags & View Action */}
                  <div className="pt-3 border-t border-teal-50 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {album.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-black text-teal-700 group-hover:text-emerald-600 inline-flex items-center gap-1 uppercase tracking-wider shrink-0">
                      {lang === 'en' ? 'Open Album' : 'एल्बम हेर्नुहोस्'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-teal-100 space-y-3">
          <Folder className="w-12 h-12 text-teal-300 mx-auto" />
          <h3 className="text-lg font-bold text-teal-950">{t.noAlbums[lang]}</h3>
          <p className="text-xs text-gray-500 font-medium">Try clearing your search query or tag filter.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedTag('all'); }}
            className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
