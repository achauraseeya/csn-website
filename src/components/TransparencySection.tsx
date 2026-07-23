import React, { useState } from 'react';
import { Download, FileText, ShieldCheck, CheckCircle2, Search, ExternalLink, Plus, Trash2, X, Sparkles, Link as LinkIcon } from 'lucide-react';
import { Language, Document } from '../types';
import { documents as initialDocuments } from '../data/communityData';
import { formatNumber } from '../utils/mediaUrl';

interface TransparencySectionProps {
  lang: Language;
  onTrackAction: (actionName: string) => void;
  isAdmin?: boolean;
  documentsList?: Document[];
  onAddDocument?: (doc: Document) => void;
  onDeleteDocument?: (id: string) => void;
}

export default function TransparencySection({
  lang,
  onTrackAction,
  isAdmin = false,
  documentsList = initialDocuments,
  onAddDocument,
  onDeleteDocument,
}: TransparencySectionProps) {
  const docs = documentsList.length > 0 ? documentsList : initialDocuments;
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [docTitleEn, setDocTitleEn] = useState('');
  const [docTitleNe, setDocTitleNe] = useState('');
  const [docCategoryEn, setDocCategoryEn] = useState('Financial');
  const [docCategoryNe, setDocCategoryNe] = useState('वित्तीय');
  const [docYear, setDocYear] = useState('2026');
  const [docType, setDocType] = useState('PDF');
  const [docSize, setDocSize] = useState('Google Drive Link');
  const [docDriveUrl, setDocDriveUrl] = useState('');

  const t = {
    title: { en: 'Transparency & Downloads', ne: 'पारदर्शिता र डाउनलोडहरू' },
    sub: { 
      en: 'We believe in complete transparency. Access our financial audits, registration certificates, and organizational policies below.', 
      ne: 'हामी पूर्ण पारदर्शितामा विश्वास गर्छौं। हाम्रा वित्तीय लेखापरीक्षणहरू, दर्ता प्रमाणपत्रहरू, र संगठनात्मक नीतिहरू तल पहुँच गर्नुहोस्।' 
    },
    download: { en: 'Download / View', ne: 'डाउनलोड / हेर्नुहोस्' },
    certifications: { en: 'Our Certifications', ne: 'हाम्रा प्रमाणपत्रहरू' },
    documents: { en: 'Public Documents & Drive Files', ne: 'सार्वजनिक कागजातहरू र गुगल ड्राइभ फाइलाहरू' }
  };

  const certifications = [
    { title: { en: 'Registered NGO', ne: 'दर्ता भएको NGO' }, authority: { en: 'District Administration Office, Parsa', ne: 'जिल्ला प्रशासन कार्यालय, पर्सा' } },
    { title: { en: 'SWC Affiliated', ne: 'समाज कल्याण परिषद् आबद्ध' }, authority: { en: 'Social Welfare Council Nepal', ne: 'समाज कल्याण परिषद् नेपाल' } },
    { title: { en: 'Tax Cleared', ne: 'कर चुक्ता' }, authority: { en: 'Inland Revenue Department', ne: 'आन्तरिक राजस्व विभाग' } }
  ];

  const filteredDocs = docs.filter((doc) => {
    const term = searchTerm.toLowerCase();
    const title = doc.title[lang] || doc.title.en || '';
    const cat = doc.category[lang] || doc.category.en || '';
    return title.toLowerCase().includes(term) || cat.toLowerCase().includes(term) || doc.year.includes(term);
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitleEn || !docDriveUrl) return;

    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      title: { en: docTitleEn, ne: docTitleNe || docTitleEn },
      category: { en: docCategoryEn, ne: docCategoryNe || docCategoryEn },
      year: docYear || '2026',
      type: docType || 'PDF',
      size: docSize || 'Online Drive File',
      driveUrl: docDriveUrl,
    };

    if (onAddDocument) {
      onAddDocument(newDoc);
    }
    onTrackAction(`Admin added document: ${docTitleEn}`);
    setShowAddModal(false);

    // Reset form
    setDocTitleEn('');
    setDocTitleNe('');
    setDocDriveUrl('');
  };

  const handleOpenDoc = (doc: Document) => {
    onTrackAction(`Opened document: ${doc.title.en}`);
    if (doc.driveUrl) {
      window.open(doc.driveUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Accessing "${doc.title[lang]}". Note: Default sample document.`);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-500 pb-20">
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-8">
        <div className="inline-flex items-center justify-center p-4 bg-teal-50 rounded-full mb-4">
          <ShieldCheck className="w-12 h-12 text-teal-600" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {t.title[lang]}
        </h1>
        <p className="text-lg text-gray-600 font-medium">
          {t.sub[lang]}
        </p>

        {/* Admin Add Document Button */}
        {isAdmin && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'en' ? '+ Add Document (Google Drive Link)' : '+ गुगल ड्राइभ कागजात थप्नुहोस्'}</span>
            </button>
          </div>
        )}
      </section>

      {/* Admin Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-teal-950">
                {lang === 'en' ? 'Add Public Document / Drive Link' : 'सार्वजनिक कागजात / ड्राइभ लिंक थप्नुहोस्'}
              </h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Document Title (English) *</label>
                <input
                  type="text"
                  required
                  value={docTitleEn}
                  onChange={(e) => setDocTitleEn(e.target.value)}
                  placeholder="e.g. Audit Report 2026 / Bylaws"
                  className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">कागजातको शीर्षक (नेपाली)</label>
                <input
                  type="text"
                  value={docTitleNe}
                  onChange={(e) => setDocTitleNe(e.target.value)}
                  placeholder="उदा. वार्षिक लेखापरीक्षण प्रतिवेदन २०२६"
                  className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                  Google Drive Link (URL) *
                </label>
                <input
                  type="url"
                  required
                  value={docDriveUrl}
                  onChange={(e) => setDocDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Category (English)</label>
                  <select
                    value={docCategoryEn}
                    onChange={(e) => {
                      setDocCategoryEn(e.target.value);
                      if (e.target.value === 'Financial') setDocCategoryNe('वित्तीय');
                      if (e.target.value === 'Legal') setDocCategoryNe('कानूनी');
                      if (e.target.value === 'Policy') setDocCategoryNe('नीति');
                      if (e.target.value === 'Report') setDocCategoryNe('प्रतिवेदन');
                    }}
                    className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600 bg-white"
                  >
                    <option value="Financial">Financial</option>
                    <option value="Legal">Legal</option>
                    <option value="Policy">Policy</option>
                    <option value="Report">Report</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Year</label>
                  <input
                    type="text"
                    value={docYear}
                    onChange={(e) => setDocYear(e.target.value)}
                    placeholder="2026"
                    className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Type</label>
                  <input
                    type="text"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    placeholder="PDF / Drive / Link"
                    className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Size / Info</label>
                  <input
                    type="text"
                    value={docSize}
                    onChange={(e) => setDocSize(e.target.value)}
                    placeholder="Google Drive Link"
                    className="w-full p-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow"
                >
                  Save & Publish Online
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certifications Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certifications.map((cert, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{cert.title[lang]}</h3>
              <p className="text-sm text-gray-500">{cert.authority[lang]}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Documents List */}
      <section className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{t.documents[lang]}</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'en' ? 'Search documents...' : 'कागजातहरू खोज्नुहोस्...'} 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64"
            />
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
                      {formatNumber(doc.title[lang] || doc.title.en, lang)}
                      {doc.driveUrl && (
                        <span className="text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          Drive Link
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="px-2.5 py-0.5 bg-gray-100 rounded-full font-medium">{formatNumber(doc.category[lang] || doc.category.en, lang)}</span>
                      <span>• {formatNumber(doc.year, lang)}</span>
                      <span>• {doc.type}</span>
                      <span>• {formatNumber(doc.size, lang)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {isAdmin && onDeleteDocument && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${doc.title[lang] || doc.title.en}"?`)) {
                          onDeleteDocument(doc.id);
                        }
                      }}
                      className="p-3 text-red-500 hover:bg-red-50 border border-red-200 rounded-xl transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <button 
                    onClick={() => handleOpenDoc(doc)}
                    className="flex-1 sm:flex-none px-6 py-3 bg-white border border-teal-200 text-teal-700 font-bold rounded-xl hover:bg-teal-50 hover:border-teal-300 transition-colors flex items-center justify-center gap-2"
                  >
                    {doc.driveUrl ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    {t.download[lang]}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              No documents match your search criteria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
