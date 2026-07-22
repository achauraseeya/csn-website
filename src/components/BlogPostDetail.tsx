import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, User, Share2, Check, BookOpen, Clock, 
  ExternalLink, Sparkles, MessageCircle, Facebook, Twitter
} from 'lucide-react';
import { Language } from '../types';

export interface SinglePostData {
  id: string;
  title: { en: string; ne: string };
  content: { en: string; ne: string };
  date: string;
  author: string;
  imageUrl?: string;
  link?: string;
  tags?: string[];
}

interface BlogPostDetailProps {
  post: SinglePostData;
  lang: Language;
  onBackToHome: () => void;
  onTrackAction: (actionName: string) => void;
  recentPosts?: SinglePostData[];
  onSelectPost?: (post: SinglePostData) => void;
}

export default function BlogPostDetail({
  post,
  lang,
  onBackToHome,
  onTrackAction,
  recentPosts = [],
  onSelectPost,
}: BlogPostDetailProps) {
  const [copied, setCopied] = useState(false);

  const pageUrl = post.link || window.location.href;

  const handleShare = () => {
    navigator.clipboard?.writeText(pageUrl);
    setCopied(true);
    onTrackAction(`Copied post link: ${post.title.en || post.title.ne}`);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${post.title[lang] || post.title.en}\n${pageUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    onTrackAction('Shared post on WhatsApp');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');
    onTrackAction('Shared post on Facebook');
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(post.title[lang] || post.title.en);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(pageUrl)}`, '_blank');
    onTrackAction('Shared post on Twitter');
  };

  const titleText = post.title[lang] || post.title.en || 'Untitled Article';
  const contentHtml = post.content[lang] || post.content.en || '';

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-2 sm:px-4 animate-in fade-in duration-300">
      
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-teal-100 pb-4">
        <button
          onClick={onBackToHome}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'en' ? 'Back to Homepage' : 'गृहपृष्ठमा फर्कनुहोस्'}</span>
        </button>
      </div>

      {/* Main Post Container */}
      <article className="bg-white rounded-3xl border border-teal-100 shadow-xl overflow-hidden">
        
        {/* Cover Featured Image (if available) */}
        {post.imageUrl && (
          <div className="relative aspect-[21/9] sm:aspect-[2/1] overflow-hidden bg-teal-950 border-b border-teal-100">
            <img
              src={post.imageUrl}
              alt={titleText}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-6">
          
          {/* Category Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Article Title */}
          <h1 className="text-2xl sm:text-4xl font-black text-teal-950 leading-tight tracking-tight">
            {titleText}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-teal-50 text-xs sm:text-sm text-gray-600 font-semibold">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-teal-700 font-bold">
                <User className="w-4 h-4 text-emerald-600" /> {post.author || 'Chaurasiya Samaj Admin'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" /> {post.date}
              </span>
            </div>

            {/* Social Share Group */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors flex items-center gap-1 text-xs font-bold"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-teal-600" />}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={shareOnWhatsApp}
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              <button
                onClick={shareOnFacebook}
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Full Post Content (HTML or formatted text) */}
          <div className="prose prose-teal max-w-none text-gray-800 font-medium text-base sm:text-lg leading-relaxed space-y-4 [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:shadow-md [&_img]:my-6 [&_p]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-teal-950 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-teal-900 [&_a]:text-teal-700 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-teal-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600">
            {contentHtml ? (
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            ) : (
              <p className="text-gray-500 italic">
                {lang === 'en'
                  ? 'The content for this blog post is being loaded from Blogger...'
                  : 'यस ब्लग पोस्टको सामग्री ब्लगरबाट लोड हुँदैछ...'}
              </p>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="pt-8 border-t border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onBackToHome}
              className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'en' ? 'Back to Homepage' : 'गृहपृष्ठमा फर्कनुहोस्'}</span>
            </button>
          </div>
        </div>
      </article>

      {/* Recommended / Recent Posts Section */}
      {recentPosts.length > 0 && (
        <div className="bg-teal-50/60 rounded-3xl p-6 sm:p-8 border border-teal-100 space-y-6">
          <div className="flex items-center gap-2 text-teal-950 font-black text-lg">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3>{lang === 'en' ? 'More Articles & Community Stories' : 'थप लेख तथा सामुदायिक कथाहरू'}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentPosts.slice(0, 3).map((rPost) => (
              <div
                key={rPost.id}
                onClick={() => {
                  if (onSelectPost) {
                    onSelectPost(rPost);
                  } else if (rPost.link && rPost.link !== '#') {
                    window.location.href = rPost.link;
                  }
                }}
                className="bg-white rounded-2xl p-4 border border-teal-100 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group space-y-2"
              >
                <span className="text-[10px] font-bold text-teal-600 uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {rPost.date}
                </span>
                <h4 className="font-extrabold text-sm text-teal-950 group-hover:text-teal-700 line-clamp-2 transition-colors">
                  {rPost.title[lang] || rPost.title.en}
                </h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
