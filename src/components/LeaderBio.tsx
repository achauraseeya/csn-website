import React from 'react';
import { Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { Language } from '../types';
import { boardMembers } from '../data/communityData';

interface LeaderBioProps {
  lang: Language;
  leaderId: string | null;
  onTrackAction: (actionName: string) => void;
}

export default function LeaderBio({ lang, leaderId, onTrackAction }: LeaderBioProps) {
  const leader = boardMembers.find(m => m.id === leaderId);

  if (!leader) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {lang === 'en' ? 'Profile Not Found' : 'प्रोफाइल फेला परेन'}
        </h2>
      </div>
    );
  }

  React.useEffect(() => {
    onTrackAction(`Viewed Bio: ${leader.name.en}`);
  }, [leader.name.en, onTrackAction]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-teal-100 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-emerald-100 shrink-0">
          <img src={leader.avatarUrl} alt={leader.name[lang]} className="w-full h-full object-cover" />
        </div>
        <div className="space-y-4 flex-grow">
          <div>
            <h1 className="text-4xl font-black text-teal-950 tracking-tight">
              {leader.name[lang]}
            </h1>
            <p className="text-xl font-bold text-emerald-600 uppercase tracking-wider mt-1">
              {leader.role[lang]}
            </p>
          </div>
          <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
            {leader.bio[lang]}
          </p>
          <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
            {leader.email && (
              <a href={`mailto:${leader.email}`} className="flex items-center gap-2 text-sm font-medium text-teal-700 bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition-colors">
                <Mail className="w-4 h-4" />
                {leader.email}
              </a>
            )}
            {leader.phone && (
              <a href={`tel:${leader.phone}`} className="flex items-center gap-2 text-sm font-medium text-teal-700 bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition-colors">
                <Phone className="w-4 h-4" />
                {leader.phone}
              </a>
            )}
            {leader.address && (
              <div className="flex items-center gap-2 text-sm font-medium text-teal-700 bg-teal-50 px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4" />
                {leader.address[lang]}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contributions or Additional Info (Placeholder) */}
      <section className="bg-teal-50 rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-black text-teal-950 mb-6 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-emerald-600" />
          {lang === 'en' ? 'Roles & Responsibilities' : 'भूमिका र जिम्मेवारीहरू'}
        </h2>
        <div className="bg-white p-6 rounded-2xl border border-teal-100 text-gray-700 leading-relaxed">
          {lang === 'en'
            ? 'As a key member of the Chaurasiya Samaj Nepal executive committee, ' + leader.name.en + ' plays a vital role in steering the community towards its strategic goals. They actively participate in policy-making, organize community events, and ensure that the legacy of the Chaurasiya community is preserved while adapting to modern challenges.'
            : 'चौरसिया समाज नेपाल कार्यकारी समितिको मुख्य सदस्यको रूपमा, ' + leader.name.ne + ' ले समुदायलाई यसको रणनीतिक लक्ष्यहरूतर्फ डोर्‍याउन महत्त्वपूर्ण भूमिका खेल्छन्। उनीहरू नीति निर्माणमा सक्रिय रूपमा भाग लिन्छन्, सामुदायिक कार्यक्रमहरू आयोजना गर्छन्, र आधुनिक चुनौतीहरूसँग अनुकूल हुँदै चौरसिया समुदायको विरासतलाई संरक्षण गर्ने सुनिश्चित गर्छन्।'}
        </div>
      </section>
    </div>
  );
}
