import { Mail, Phone, Github, Award, BookOpen, Cpu, ShieldCheck, Heart } from 'lucide-react';
import { Language } from '../types';
import { designerProfile } from '../data/communityData';

interface AbhishekBioProps {
  lang: Language;
  onTrackAction: (actionName: string) => void;
}

export default function AbhishekBio({ lang, onTrackAction }: AbhishekBioProps) {
  const t = {
    title: { en: 'Our Architect: Abhishek Kumar Chaurasiya', ne: 'हाम्रो वास्तुकार: अभिषेक कुमार चौरसिया' },
    subtitle: {
      en: 'General Secretary, CTO & Chief Digital Designer of Chaurasiya Samaj Nepal',
      ne: 'महासचिव, सीटीओ र चौरसिया समाज नेपालका प्रमुख डिजिटल डिजाइनर',
    },
    aboutMe: { en: 'Executive Biography', ne: 'कार्यकारी जीवनी' },
    skillsTitle: { en: 'Technical Expertise & Craft', ne: 'प्राविधिक विशेषज्ञता र कला' },
    eduTitle: { en: 'Academic Foundation', ne: 'शैक्षिक पृष्ठभूमि' },
    contactTitle: { en: 'Get In Touch', ne: 'सम्पर्क गर्नुहोस्' },
    contributions: { en: 'Key Digital Contributions', ne: 'प्रमुख डिजिटल योगदानहरू' },
  };

  const contributionsList = [
    {
      title: { en: 'Centralized Member Database', ne: 'केन्द्रीकृत सदस्य डाटाबेस' },
      desc: {
        en: 'Designed and deployed a responsive cloud directory to organize and verify community members, preventing fraud.',
        ne: 'समुदायका सदस्यहरूलाई व्यवस्थित र प्रमाणित गर्न एक उत्तरदायी क्लाउड निर्देशिका डिजाइन र तैनात गर्नुभयो।',
      },
    },
    {
      title: { en: 'Blogger.com Integration Engine', ne: 'ब्लगर एकीकरण इन्जिन' },
      desc: {
        en: 'Developed custom XML template compiler that generates secure blogger.com layouts for low-budget deployment.',
        ne: 'कम बजेटको प्रयोगका लागि सुरक्षित ब्लगर ढाँचाहरू उत्पन्न गर्ने अनुकूलन XML टेम्पलेट कम्पाइलर विकास गर्नुभयो।',
      },
    },
    {
      title: { en: 'Rural Farmers Mobile Support', ne: 'ग्रामीण किसान मोबाइल सहयोग' },
      desc: {
        en: 'Engineered notification portals so rural betel leaf (paan) farmers receive instant cold and storm warning bulletins.',
        ne: 'ग्रामीण पान उत्पादक कृषकहरूले तत्काल चिसो र आँधीबेहरीको चेतावनी बुलेटिनहरू प्राप्त गर्न सक्ने गरी सूचना पोर्टलको निर्माण गर्नुभयो।',
      },
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Bio Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-950 text-white rounded-3xl py-12 px-6 sm:px-12 shadow-xl border-b-8 border-emerald-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_40%)]" />
        
        <div className="relative max-w-4xl flex flex-col md:flex-row items-center gap-8">
          {/* Avatar frame */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-400 bg-white shadow-lg shrink-0">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"
              alt="Abhishek Kumar Chaurasiya"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              Lead Architect &amp; CTO
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-teal-50">
              {designerProfile.name}
            </h1>
            <p className="text-sm sm:text-base text-teal-200 font-bold max-w-2xl">
              {t.subtitle[lang]}
            </p>
          </div>
        </div>
      </section>

      {/* Grid: Bio Details & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Bio Text & Contributions */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-teal-950 border-b border-teal-50 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-700" />
              {t.aboutMe[lang]}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {designerProfile.bio[lang]}
            </p>

            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 flex gap-3 text-xs text-teal-900 leading-relaxed font-medium italic">
              <Heart className="w-5 h-5 text-teal-600 shrink-0 mt-0.5 fill-teal-600/10" />
              "Technology holds the power to simplify grassroots community work. By building fast, accessible portals, we elevate traditional agriculture and unite our people under one digital roof."
            </div>
          </div>

          {/* Contributions */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-teal-950 border-b border-teal-50 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-700" />
              {t.contributions[lang]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {contributionsList.map((contrib, i) => (
                <div key={i} className="space-y-2 p-4 bg-teal-50/30 rounded-xl border border-teal-100/60 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-teal-900 text-xs sm:text-sm uppercase tracking-wide">
                      {contrib.title[lang]}
                    </h4>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {contrib.desc[lang]}
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-teal-700 uppercase tracking-wider flex items-center gap-1 pt-3 border-t border-teal-100/50 mt-4">
                    <ShieldCheck className="w-3.5 h-3.5" /> Deployed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Technical Expertise & Contacts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tech stack */}
          <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-teal-950 text-sm uppercase tracking-wide border-b border-teal-50 pb-2">
              {t.skillsTitle[lang]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {designerProfile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-teal-50 text-teal-800 text-xs font-bold rounded-lg border border-teal-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education background */}
          <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm space-y-3">
            <h3 className="font-extrabold text-teal-950 text-sm uppercase tracking-wide border-b border-teal-50 pb-2">
              {t.eduTitle[lang]}
            </h3>
            <p className="text-xs text-gray-700 font-bold leading-relaxed">
              {designerProfile.education}
            </p>
            <p className="text-[11px] text-teal-600 font-bold uppercase tracking-wide">
              Tribhuvan University, Nepal
            </p>
          </div>

          {/* Contact Details */}
          <div className="bg-teal-900 text-white p-6 rounded-2xl shadow-md border-b-4 border-emerald-500 space-y-4">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wide border-b border-teal-800 pb-2">
              {t.contactTitle[lang]}
            </h3>

            <div className="space-y-3 text-xs text-teal-200">
              <a
                href={`mailto:${designerProfile.email}`}
                onClick={() => onTrackAction('Contact Abhishek via Email')}
                className="flex items-center gap-2.5 p-2 bg-teal-950/40 rounded-lg hover:bg-teal-950 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{designerProfile.email}</span>
              </a>

              {designerProfile.phone && (
                <div className="flex items-center gap-2.5 p-2 bg-teal-950/40 rounded-lg">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{designerProfile.phone}</span>
                </div>
              )}

              <a
                href="https://github.com/achauraseeya"
                target="_blank"
                rel="noreferrer"
                onClick={() => onTrackAction('Open Abhishek Github')}
                className="flex items-center gap-2.5 p-2 bg-teal-950/40 rounded-lg hover:bg-teal-950 transition-all cursor-pointer"
              >
                <Github className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>github.com/achauraseeya</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
