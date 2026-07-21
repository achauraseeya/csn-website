import { useState } from 'react';
import { Download, FileCode, Check, Copy, Settings, Info, Leaf, Send, Github } from 'lucide-react';
import { Language } from '../types';
import { generateBloggerXml } from './BloggerXmlTemplate';

interface BloggerXmlExporterProps {
  lang: Language;
  onDownload: () => void;
  onTrackAction: (actionName: string) => void;
}

export default function BloggerXmlExporter({ lang, onDownload, onTrackAction }: BloggerXmlExporterProps) {
  const [blogTitle, setBlogTitle] = useState('Chaurasiya Samaj Nepal');
  const [blogDesc, setBlogDesc] = useState(
    'Official Blogger Portal for Chaurasiya Samaj Nepal. Dedicated to unity, culture, and progress.'
  );
  const [contactEmail, setContactEmail] = useState('achauraseeya@gmail.com');
  const [githubUsername, setGithubUsername] = useState('achauraseeya');
  const [githubRepo, setGithubRepo] = useState('chaurasiya-samaj-nepal');
  
  // Theme Color Presets
  const presets = [
    { name: 'Paan Leaf Rich', primary: '#15803d', secondary: '#22c55e', bg: 'bg-teal-700' },
    { name: 'Forest Mystic', primary: '#14532d', secondary: '#4ade80', bg: 'bg-emerald-900' },
    { name: 'Teal Betel Garden', primary: '#0f766e', secondary: '#14b8a6', bg: 'bg-teal-700' },
    { name: 'Deep Sage Organic', primary: '#064e3b', secondary: '#86efac', bg: 'bg-teal-950' },
  ];

  const [primaryColor, setPrimaryColor] = useState('#15803d');
  const [secondaryColor, setSecondaryColor] = useState('#22c55e');
  const [copied, setCopied] = useState(false);

  const finalXml = generateBloggerXml(blogTitle, blogDesc, contactEmail, primaryColor, secondaryColor, githubUsername, githubRepo);

  const t = {
    title: { en: 'Blogger + GitHub Pages Headless Setup', ne: 'Blogger + GitHub Pages सेटअप' },
    sub: {
      en: 'Generate a minimal Blogger XML shell that hosts your content and links to your React app hosted on GitHub.',
      ne: 'तपाईंको सामग्री होस्ट गर्ने र GitHub मा होस्ट गरिएको तपाईंको React एपमा लिङ्क गर्ने न्यूनतम ब्लगर XML शेल उत्पन्न गर्नुहोस्।',
    },
    settingsGroup: { en: 'Theme Properties & Content Customizer', ne: 'विषयवस्तु र सामग्री अनुकूलन' },
    blogTitleLabel: { en: 'Blogger Site Title', ne: 'ब्लगको शीर्षक' },
    blogDescLabel: { en: 'Blogger Site Description', ne: 'ब्लगको विवरण' },
    emailLabel: { en: 'Contact Email Address', ne: 'सम्पर्क इमेल ठेगाना' },
    githubUserLabel: { en: 'GitHub Username', ne: 'GitHub प्रयोगकर्ता नाम' },
    githubRepoLabel: { en: 'GitHub Repository Name', ne: 'GitHub भण्डारको नाम' },
    presetLabel: { en: 'Paan Leaf Color Presets', ne: 'पानको पात रङ प्रिसेटहरू' },
    primaryColorLabel: { en: 'Primary Theme Color (Hex)', ne: 'प्राथमिक रङ (Hex)' },
    secondaryColorLabel: { en: 'Accent Theme Color (Hex)', ne: 'सहायक रङ (Hex)' },
    copyCode: { en: 'Copy Template Code', ne: 'टेम्पलेट कोड प्रतिलिपि गर्नुहोस्' },
    copiedCode: { en: 'Copied!', ne: 'प्रतिलिपि गरियो!' },
    downloadBtn: { en: 'Download Blogger XML Theme File', ne: 'ब्लगर XML थिम फाइल डाउनलोड गर्नुहोस्' },
    instrTitle: { en: 'How to Setup Blogger + GitHub (Headless SPA)', ne: 'Blogger + GitHub कसरी सेटअप गर्ने' },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(finalXml);
    setCopied(true);
    onTrackAction('Copy Blogger XML to Clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([finalXml], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chaurasiya_samaj_blogger_headless.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onDownload();
    onTrackAction('Download Blogger XML File');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Exporter header */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-md">
        <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
          <Github className="w-8 h-8 text-emerald-400" />
          {t.title[lang]}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
          {t.sub[lang]}
        </p>
      </section>

      {/* Grid customization parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customization form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
            <Settings className="w-4 h-4 text-slate-600" />
            {t.settingsGroup[lang]}
          </h3>
          <div className="space-y-4">
            
            {/* GitHub Config */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t.githubUserLabel[lang]}</label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-500 focus:bg-white text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">{t.githubRepoLabel[lang]}</label>
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{t.blogTitleLabel[lang]}</label>
              <input
                type="text"
                value={blogTitle}
                onChange={(e) => {
                  setBlogTitle(e.target.value);
                  onTrackAction(`Modify Blogger Title: ${e.target.value}`);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-500 focus:bg-white text-slate-900"
              />
            </div>
            
            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">{t.blogDescLabel[lang]}</label>
              <textarea
                value={blogDesc}
                onChange={(e) => {
                  setBlogDesc(e.target.value);
                  onTrackAction('Modify Blogger Description');
                }}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-500 focus:bg-white text-slate-900"
              />
            </div>
            
          </div>
        </div>

        {/* Right: Compiles output, Actions & Installation Guide */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Download & Action Box */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg border-b-8 border-emerald-500 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase rounded">
                Headless XML Ready
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white">Chaurasiya XML Compiler (V2)</h3>
              <p className="text-xs text-slate-400">Generates a minimal Blogger layout schema (V2) that links directly to GitHub Pages assets.</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-sm uppercase tracking-wide rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {t.downloadBtn[lang]}
              </button>
              <button
                onClick={handleCopy}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-extrabold uppercase tracking-wide rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? t.copiedCode[lang] : t.copyCode[lang]}
              </button>
            </div>

            {/* Quick Preview block */}
            <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">Source Preview (Top Lines)</span>
              <pre className="text-[10px] text-slate-300 font-mono leading-relaxed bg-black/50 p-2.5 rounded border border-slate-800 overflow-x-auto">
                {`<?xml version="1.0" encoding="UTF-8" ?>\n<!DOCTYPE html>\n<html b:layoutsVersion='2' b:responsive='true' xmlns:b='http://www.google.com/schemas/2005/b'>\n<head>\n  <title><data:blog.pageTitle/></title>\n  <link rel="stylesheet" href="https://${githubUsername}.github.io/${githubRepo}/assets/index.css" />`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Full Setup Guide */}
        <div className="col-span-1 lg:col-span-12 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h4 className="font-extrabold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Info className="w-5 h-5 text-emerald-600" />
            {t.instrTitle[lang]}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
                <h5 className="font-bold text-slate-900">Host App on GitHub Pages</h5>
              </div>
              <ul className="text-sm text-slate-600 space-y-2 pl-11 list-disc">
                <li>Download this project using the <strong>Export to ZIP</strong> or <strong>Export to GitHub</strong> option in AI Studio settings.</li>
                <li>In your repository, update <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">vite.config.ts</code> with your repo name: <code>base: '/${githubRepo}/'</code>.</li>
                <li>Run <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">npm run build</code> to generate the <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">dist/</code> folder.</li>
                <li>Deploy the <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">dist/</code> folder to GitHub Pages (or use a GitHub Action).</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">2</div>
                <h5 className="font-bold text-slate-900">Setup Blogger Theme</h5>
              </div>
              <ul className="text-sm text-slate-600 space-y-2 pl-11 list-disc">
                <li>Enter your GitHub Username and Repository Name in the form above.</li>
                <li>Click <strong>Download Blogger XML Theme File</strong>.</li>
                <li>Log in to <strong className="text-orange-500">Blogger.com</strong>, select your blog, and go to <strong>Theme</strong>.</li>
                <li>Click the drop-down arrow next to "Customize", choose <strong>Restore</strong>, click <strong>Upload</strong>, and select the XML file you downloaded.</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-sm text-emerald-900 leading-relaxed font-medium">
            <strong>How it works:</strong> The Blogger XML template contains a <code>&lt;div id="root"&gt;&lt;/div&gt;</code> element and links directly to the JavaScript and CSS files hosted on your GitHub Pages site. When users visit your Blogger site, it automatically loads your React App inside the Blogger shell!
          </div>
        </div>

      </div>
    </div>
  );
}
