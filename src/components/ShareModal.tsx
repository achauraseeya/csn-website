import React, { useState } from 'react';
import { 
  X, Copy, Check, Share2, Send, MessageCircle, Facebook, Twitter, Instagram, Linkedin, Globe
} from 'lucide-react';
import { Language } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text?: string;
  url: string;
  lang: Language;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  text = '',
  url,
  lang
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title}\n${text ? text.slice(0, 120) + '...' : ''}`);

  const handleCopy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url
        });
      } catch (err) {
        console.warn('Native share dismissed or failed', err);
      }
    } else {
      handleCopy();
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      bgColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      link: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      bgColor: 'bg-blue-600 hover:bg-blue-500 text-white',
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      bgColor: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 text-white',
      link: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      bgColor: 'bg-sky-500 hover:bg-sky-400 text-white',
      link: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      bgColor: 'bg-blue-700 hover:bg-blue-600 text-white',
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Instagram',
      icon: Instagram,
      bgColor: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
      onClick: () => {
        handleCopy();
        alert(
          lang === 'en'
            ? '✅ Link copied to clipboard! You can now paste and share this post link directly in Instagram DM, Bio, or Story!'
            : '✅ लिङ्क क्लिपबोर्डमा प्रतिलिपि गरियो! अब तपाईं यसलाई इन्स्टाग्राम स्टोरी वा म्यासेजमा टाँस्न सक्नुहुन्छ!'
        );
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/60 rounded-2xl text-teal-600 dark:text-emerald-400">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'en' ? 'Share Post' : 'पोस्ट सेयर गर्नुहोस्'}
              </h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                {title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct Link Copy Bar */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            {lang === 'en' ? 'Direct Post Address (URL)' : 'प्रत्यक्ष पोस्ट लिङ्क (URL)'}
          </label>
          <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <Globe className="w-4 h-4 text-teal-600 dark:text-emerald-400 shrink-0 ml-2" />
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 bg-transparent text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none overflow-x-auto"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-teal-700 hover:bg-teal-600 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Copied!' : 'प्रतिलिपि भयो!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Copy Link' : 'लिङ्क कपी'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Sharing Grid */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {lang === 'en' ? 'Share to Social Platforms' : 'सामाजिक सञ्जालमा सेयर गर्नुहोस्'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {shareOptions.map((opt) => (
              opt.link ? (
                <a
                  key={opt.name}
                  href={opt.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${opt.bgColor}`}
                >
                  <opt.icon className="w-4 h-4" />
                  <span>{opt.name}</span>
                </a>
              ) : (
                <button
                  key={opt.name}
                  onClick={opt.onClick}
                  className={`p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${opt.bgColor}`}
                >
                  <opt.icon className="w-4 h-4" />
                  <span>{opt.name}</span>
                </button>
              )
            ))}
          </div>
        </div>

        {/* Native Mobile Share Sheet Button */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <div className="pt-2">
            <button
              onClick={handleNativeShare}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-teal-600 dark:text-emerald-400" />
              <span>{lang === 'en' ? 'More Sharing Apps / Mobile Sheet' : 'अन्य एपहरूमा सेयर गर्नुहोस्'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
