import React, { useState, useEffect } from 'react';
import { Mail, Building, MapPin, Plus, Edit, Trash2, Search, Sparkles, User, Image, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { apiFetch, saveFileToGithub } from '../utils/githubDb';
import { compressImageToBase64 } from '../utils/imageUtils';

export interface RenownedPerson {
  id: string;
  name: { en: string; ne: string };
  photoUrl: string;
  email: string;
  institutionName: { en: string; ne: string };
  address: { en: string; ne: string };
}

interface RenownedPeopleProps {
  lang: Language;
  onTrackAction: (actionName: string) => void;
  isAdmin: boolean;
}

const fallbackPeople: RenownedPerson[] = [
  {
    id: 'rp-1',
    name: { en: 'Prof. Dr. Ram Bahadur Chaurasiya', ne: 'प्रा. डा. राम बहादुर चौरसिया' },
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300',
    email: 'ram.chaurasiya@tu.edu.np',
    institutionName: { en: 'Tribhuvan University', ne: 'त्रिभुवन विश्वविद्यालय' },
    address: { en: 'Kathmandu, Nepal', ne: 'काठमाडौँ, नेपाल' }
  },
  {
    id: 'rp-2',
    name: { en: 'Dr. Shyam Prasad Chaurasiya', ne: 'डा. श्याम प्रसाद चौरसिया' },
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    email: 'shyam.chaurasiya@nmc.edu.np',
    institutionName: { en: 'National Medical College', ne: 'नेशनल मेडिकल कलेज' },
    address: { en: 'Birgunj, Parsa, Nepal', ne: 'वीरगञ्ज, पर्सा, नेपाल' }
  },
  {
    id: 'rp-3',
    name: { en: 'Er. Krishna Kumar Chaurasiya', ne: 'इन्जि. कृष्ण कुमार चौरसिया' },
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    email: 'krishnack@nepal.gov.np',
    institutionName: { en: 'Department of Roads, Ministry of Physical Infrastructure', ne: 'सडक विभाग, भौतिक पूर्वाधार मन्त्रालय' },
    address: { en: 'Lalitpur, Nepal', ne: 'ललितपुर, नेपाल' }
  },
  {
    id: 'rp-4',
    name: { en: 'Mrs. Geeta Chaurasiya', ne: 'श्रीमती गीता चौरसिया' },
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    email: 'geeta.chaurasiya@narc.gov.np',
    institutionName: { en: 'Nepal Agricultural Research Council (NARC)', ne: 'नेपाल कृषि अनुसन्धान परिषद् (NARC)' },
    address: { en: 'Bara, Nepal', ne: 'बारा, नेपाल' }
  }
];

export default function RenownedPeople({ lang, onTrackAction, isAdmin }: RenownedPeopleProps) {
  const [people, setPeople] = useState<RenownedPerson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<RenownedPerson | null>(null);

  // Form states
  const [nameEn, setNameEn] = useState('');
  const [nameNe, setNameNe] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [email, setEmail] = useState('');
  const [instEn, setInstEn] = useState('');
  const [instNe, setInstNe] = useState('');
  const [addrEn, setAddrEn] = useState('');
  const [addrNe, setAddrNe] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    apiFetch<RenownedPerson[]>('/api/site-data/renowned_people', 'renowned_people.json', fallbackPeople)
      .then(data => {
        if (Array.isArray(data)) {
          setPeople(data);
        } else {
          setPeople(fallbackPeople);
        }
      })
      .catch(() => setPeople(fallbackPeople));

  }, [lang]);

  const handleOpenAddModal = () => {
    setEditingPerson(null);
    setNameEn('');
    setNameNe('');
    setPhotoUrl('');
    setEmail('');
    setInstEn('');
    setInstNe('');
    setAddrEn('');
    setAddrNe('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (person: RenownedPerson) => {
    setEditingPerson(person);
    setNameEn(person.name.en);
    setNameNe(person.name.ne);
    setPhotoUrl(person.photoUrl);
    setEmail(person.email);
    setInstEn(person.institutionName.en);
    setInstNe(person.institutionName.ne);
    setAddrEn(person.address.en);
    setAddrNe(person.address.ne);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !email || !instEn || !addrEn) {
      alert('Please fill in all English fields.');
      return;
    }

    const updatedPerson: RenownedPerson = {
      id: editingPerson?.id || `rp-${Date.now()}`,
      name: { en: nameEn, ne: nameNe || nameEn },
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
      email,
      institutionName: { en: instEn, ne: instNe || instEn },
      address: { en: addrEn, ne: addrNe || addrEn }
    };

    let nextPeople = [...people];
    if (editingPerson) {
      nextPeople = nextPeople.map(p => p.id === editingPerson.id ? updatedPerson : p);
    } else {
      nextPeople.push(updatedPerson);
    }

    try {
      await saveFileToGithub('renowned_people.json', nextPeople, editingPerson ? `Update renowned person: ${nameEn}` : `Add renowned person: ${nameEn}`);
      setPeople(nextPeople);
      setIsModalOpen(false);
      onTrackAction(editingPerson ? 'Edit Renowned Person' : 'Add Renowned Person');
    } catch (err: any) {
      alert(err.message || 'Failed to save changes.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(lang === 'en' ? `Are you sure you want to delete ${name}?` : `के तपाईं निश्चित रूपमा ${name} हटाउन चाहनुहुन्छ?`)) return;

    const nextPeople = people.filter(p => p.id !== id);
    try {
      await saveFileToGithub('renowned_people.json', nextPeople, `Delete renowned person: ${name}`);
      setPeople(nextPeople);
      onTrackAction('Delete Renowned Person');
    } catch (err: any) {
      alert(err.message || 'Failed to delete.');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const base64 = await compressImageToBase64(file, 400);
      setPhotoUrl(base64);
      setIsUploading(false);
    } catch (err) {
      setIsUploading(false);
    }
  };

  const filteredPeople = people.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.en.toLowerCase().includes(q) ||
      p.name.ne.includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.institutionName.en.toLowerCase().includes(q) ||
      p.institutionName.ne.includes(q) ||
      p.address.en.toLowerCase().includes(q) ||
      p.address.ne.includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border-b-8 border-emerald-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Renowned Personalities' : 'प्रख्यात व्यक्तित्वहरू'}
            </span>
            <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight text-white">
              {lang === 'en' ? 'Renowned Chaurasiya People in Nepal' : 'नेपालका प्रख्यात चौरसिया व्यक्तित्वहरू'}
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
              {lang === 'en' 
                ? 'Featuring distinguished leaders, academicians, scientists, engineers, and healthcare professionals who inspire our grassroots legacy.' 
                : 'हाम्रो गौरवशाली विरासतलाई प्रेरित गर्ने उत्कृष्ट वैज्ञानिकहरू, चिकित्सकहरू, इन्जिनियरहरू र प्राज्ञिक व्यक्तित्वहरूको सूची।'}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{lang === 'en' ? 'Add Renowned Person' : 'व्यक्तित्व थप्नुहोस्'}</span>
            </button>
          )}
        </div>
      </div>


      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-teal-50 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={lang === 'en' ? 'Search by name, address, institution or email...' : 'नाम, ठेगाना, संस्था वा इमेल खोज्नुहोस्...'}
          className="w-full bg-transparent text-sm focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {/* Grid List */}
      {filteredPeople.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-teal-50 dark:border-slate-800">
          <p className="text-gray-400 dark:text-gray-500 italic text-sm">
            {lang === 'en' ? 'No renowned personalities matching your search.' : 'तपाईंको खोजीसँग मिल्दो कुनै पनि व्यक्तित्व फेला परेन।'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeople.map((p) => (
            <div 
              key={p.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-50/60 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col group relative"
            >
              {/* Photo Frame */}
              <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden shrink-0">
                <img
                  src={p.photoUrl}
                  alt={lang === 'en' ? p.name.en : p.name.ne}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-base font-black text-white tracking-tight drop-shadow-sm line-clamp-1">
                    {lang === 'en' ? p.name.en : p.name.ne}
                  </h3>
                </div>
              </div>

              {/* Card Contents */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-3 text-xs leading-relaxed font-medium">
                  {/* Institution */}
                  <div className="flex items-start gap-2.5 text-gray-700 dark:text-gray-300">
                    <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-900 dark:text-white block font-bold text-[11px] uppercase tracking-wider mb-0.5">
                        {lang === 'en' ? 'Institution' : 'सम्बद्ध संस्था'}
                      </strong>
                      {lang === 'en' ? p.institutionName.en : p.institutionName.ne}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2.5 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-900 dark:text-white block font-bold text-[11px] uppercase tracking-wider mb-0.5">
                        {lang === 'en' ? 'Address' : 'ठेगाना'}
                      </strong>
                      {lang === 'en' ? p.address.en : p.address.ne}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-2.5 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-gray-900 dark:text-white block font-bold text-[11px] uppercase tracking-wider mb-0.5">
                        {lang === 'en' ? 'Email ID' : 'इमेल ठेगाना'}
                      </strong>
                      <a href={`mailto:${p.email}`} className="text-teal-600 dark:text-teal-400 hover:underline font-mono text-[11px]">
                        {p.email}
                      </a>
                    </span>
                  </div>
                </div>

                {/* Admin controls inside card */}
                {isAdmin && (
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-600 rounded-lg transition-colors cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name.en)}
                      className="p-1.5 hover:bg-rose-50 dark:hover:bg-slate-800 text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-br from-teal-950 to-teal-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black tracking-tight">
                  {editingPerson ? (lang === 'en' ? 'Edit Renowned Person' : 'प्रोफाइल सम्पादन गर्नुहोस्') : (lang === 'en' ? 'Add Renowned Person' : 'नयाँ व्यक्तित्व थप्नुहोस्')}
                </h3>
                <p className="text-teal-200 text-xs mt-1">
                  {lang === 'en' ? 'Changes require Super Admin approval for non-super admins.' : 'सामान्य प्रशासकको हकमा परिवर्तन स्वीकृत हुन सुपर एडमिनको आवश्यक पर्छ।'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={e => setNameEn(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. Prof. Dr. Ram Bahadur Chaurasiya"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Name (Nepali)</label>
                  <input
                    type="text"
                    value={nameNe}
                    onChange={e => setNameNe(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="उदा. प्रा. डा. राम बहादुर चौरसिया"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email ID *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  placeholder="ram.chaurasiya@tu.edu.np"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1">Institution Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={instEn}
                    onChange={e => setInstEn(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. Tribhuvan University"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Institution Name (Nepali)</label>
                  <input
                    type="text"
                    value={instNe}
                    onChange={e => setInstNe(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="उदा. त्रिभुवन विश्वविद्यालय"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1">Address (English) *</label>
                  <input
                    type="text"
                    required
                    value={addrEn}
                    onChange={e => setAddrEn(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. Kathmandu, Nepal"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Address (Nepali)</label>
                  <input
                    type="text"
                    value={addrNe}
                    onChange={e => setAddrNe(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="उदा. काठमाडौँ, नेपाल"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Photo Upload / URL</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={photoUrl}
                      onChange={e => setPhotoUrl(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                      placeholder="https://..."
                    />
                    <label className="shrink-0 p-2.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 transition-colors">
                      <Image className="w-4 h-4 text-gray-600" />
                      <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all mt-4"
              >
                {editingPerson ? (lang === 'en' ? 'Submit Changes' : 'परिवर्तन पेश गर्नुहोस्') : (lang === 'en' ? 'Publish Person' : 'व्यक्तित्व पेश गर्नुहोस्')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
