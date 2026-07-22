import { Member, Notice, CommunityEvent, GalleryItem, ImpactStat, AbhishekProfile, Document } from '../types';

export const communityHistory = {
  title: {
    en: 'Heritage & Legacy of Chaurasiya Samaj Nepal',
    ne: 'चौरसिया समाज नेपालको सम्पदा र विरासत',
  },
  introduction: {
    en: 'Chaurasiya Samaj Nepal (चौरसिया समाज नेपाल) is a dedicated non-governmental organization (NGO) established to uplift, unite, and serve the Chaurasiya community across Nepal. Rich in cultural values and historic agricultural excellence, our community has played a pivotal role in Nepalese social-economic history.',
    ne: 'चौरसिया समाज नेपाल नेपालभर रहेका चौरसिया समुदायको उत्थान, एकता र सेवाका लागि स्थापित एक समर्पित गैर-सरकारी संस्था (NGO) हो। सांस्कृतिक मूल्य र ऐतिहासिक कृषि उत्कृष्टताले समृद्ध, हाम्रो समुदायले नेपालको सामाजिक-आर्थिक इतिहासमा महत्त्वपूर्ण भूमिका खेलेको छ।',
  },
  thePaanStoryTitle: {
    en: 'The Sacred Bond with the Betel Leaf (Paan)',
    ne: 'पानको पातसँगको पवित्र सम्बन्ध',
  },
  thePaanStory: {
    en: 'The Chaurasiya community is historically and culturally intertwined with the cultivation of the "Paan" (betel leaf) – a symbol of hospitality, respect, and traditional medicine in Nepal. The paan leaf represents freshness, growth, and community bonding, which is why our identity is dressed in vibrant and lush shades of teal and emerald.',
    ne: 'चौरसिया समुदाय ऐतिहासिक र सांस्कृतिक रूपमा "पान" (betel leaf) को खेतीसँग जोडिएको छ - जुन नेपालमा आतिथ्य, सम्मान र परम्परागत औषधिको प्रतीक हो। पानको पातले ताजापन, वृद्धि र सामुदायिक सम्बन्धलाई प्रतिनिधित्व गर्दछ, त्यसैले हाम्रो पहिचान हरियो र टिल रङको जीवन्त रंगहरूमा सजिएको छ।',
  },
  missionTitle: {
    en: 'Our Vision & Mission',
    ne: 'हाम्रो दृष्टिकोण र लक्ष्य',
  },
  mission: {
    en: 'To foster unity, education, economic empowerment, and preservation of cultural heritage among Chaurasiya members while actively contributing to the welfare of Nepalese society through charitable programs, healthcare camps, and youth-led initiatives.',
    ne: 'चौरसिया सदस्यहरू बीच एकता, शिक्षा, आर्थिक सशक्तिकरण र सांस्कृतिक सम्पदाको संरक्षण प्रवर्द्धन गर्ने र परोपकारी कार्यक्रमहरू, स्वास्थ्य शिविरहरू र युवाहरूको नेतृत्वमा हुने पहलहरू मार्फत नेपाली समाजको कल्याणमा सक्रिय रूपमा योगदान पुर्‍याउने।',
  },
};

export const boardMembers: Member[] = [
  {
    id: '1',
    name: { en: 'Ram Bilas Chaurasiya', ne: 'राम विलास चौरसिया' },
    role: { en: 'Chief President (Chairperson)', ne: 'मुख्य अध्यक्ष (अध्यक्ष)' },
    category: 'chief',
    phone: '+977-9851000001',
    email: 'president@chaurasiyasamaaj.org.np',
    address: { en: 'Kathmandu, Nepal', ne: 'काठमाडौं, नेपाल' },
    bio: {
      en: 'Leading the organization with over 20 years of experience in community leadership and social development.',
      ne: 'सामुदायिक नेतृत्व र सामाजिक विकासमा २० वर्ष भन्दा बढीको अनुभवका साथ संस्थाको नेतृत्व गर्दै।',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'vc1',
    name: { en: 'Sita Ram Chaurasiya', ne: 'सीता राम चौरसिया' },
    role: { en: 'Vice Chairperson', ne: 'उपाध्यक्ष' },
    category: 'chief',
    phone: '+977-9851000002',
    email: 'vicepresident@chaurasiyasamaaj.org.np',
    address: { en: 'Birgunj, Nepal', ne: 'वीरगन्ज, नेपाल' },
    bio: {
      en: 'Dedicated to community upliftment and strategic planning for Chaurasiya Samaj.',
      ne: 'चौरसिया समाजको सामुदायिक उत्थान र रणनीतिक योजनाको लागि समर्पित।',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: '2',
    name: { en: 'Abhishek Kumar Chaurasiya', ne: 'अभिषेक कुमार चौरसिया' },
    role: { en: 'Chief Technology Officer & General Secretary', ne: 'मुख्य प्रविधि अधिकारी र महासचिव' },
    category: 'secretary',
    phone: '+977-9812345678',
    email: 'abhishek@chaurasiyasamaaj.org.np',
    address: { en: 'Birgunj, Parsa, Nepal', ne: 'वीरगन्ज, पर्सा, नेपाल' },
    bio: {
      en: 'A visionary software engineer and designer dedicated to digitizing our community services and building modern web portals.',
      ne: 'हाम्रो सामुदायिक सेवाहरूलाई डिजिटाइज गर्न र आधुनिक वेब पोर्टलहरू निर्माण गर्न समर्पित एक दूरदर्शी सफ्टवेयर इन्जिनियर र डिजाइनर।',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: '3',
    name: { en: 'Saraswati Chaurasiya', ne: 'सरस्वती चौरसिया' },
    role: { en: 'Joint Secretary', ne: 'सह-सचिव' },
    category: 'secretary',
    phone: '+977-9841234567',
    email: 'saraswati@chaurasiyasamaaj.org.np',
    address: { en: 'Lalitpur, Nepal', ne: 'ललितपुर, नेपाल' },
    bio: {
      en: 'Actively coordinates women-led educational schemes, empowerment workshops, and health awareness campaigns.',
      ne: 'महिलाहरूको नेतृत्वमा शैक्षिक योजनाहरू, सशक्तिकरण कार्यशालाहरू र स्वास्थ्य सचेतना अभियानहरूको सक्रिय समन्वय गर्नुहुन्छ।',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: '4',
    name: { en: 'Dr. Devendra Prasad Chaurasiya', ne: 'डा. देवेन्द्र प्रसाद चौरसिया' },
    role: { en: 'Treasurer & Medical Advisor', ne: 'कोषाध्यक्ष र चिकित्सा सल्लाहकार' },
    category: 'board',
    phone: '+977-9855012345',
    email: 'devendra@chaurasiyasamaaj.org.np',
    address: { en: 'Janakpur, Nepal', ne: 'जनकपुर, नेपाल' },
    bio: {
      en: 'Managing the community welfare fund and leading the weekend free healthcare clinics program.',
      ne: 'सामुदायिक कल्याण कोषको व्यवस्थापन र सप्ताहन्त नि:शुल्क स्वास्थ्य क्लिनिक कार्यक्रमको नेतृत्व गर्दै।',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: '5',
    name: { en: 'Krishna Kant Chaurasiya', ne: 'कृष्ण कान्त चौरसिया' },
    role: { en: 'Senior Advisor', ne: 'वरिष्ठ सल्लाहकार' },
    category: 'board',
    phone: '+977-9801098765',
    address: { en: 'Biratnagar, Nepal', ne: 'विराटनगर, नेपाल' },
    bio: {
      en: 'Guiding the community’s social and legal frameworks with a lifelong dedication to public welfare.',
      ne: 'जनताको कल्याणका लागि आजीवन समर्पणका साथ समुदायको सामाजिक र कानुनी संरचनालाई मार्गदर्शन गर्दै।',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: '6',
    name: { en: 'Anil Kumar Chaurasiya', ne: 'अनिल कुमार चौरसिया' },
    role: { en: 'Executive Youth Member', ne: 'कार्यकारी युवा सदस्य' },
    category: 'general',
    phone: '+977-9818812345',
    address: { en: 'Bara, Nepal', ne: 'बारा, नेपाल' },
    bio: {
      en: 'Coordinating youth blood donation networks and emergency relief activities in Madhesh Province.',
      ne: 'मधेश प्रदेशमा युवा रक्तदान सञ्जाल र आपतकालीन राहत गतिविधिको समन्वय गर्दै।',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
  },
];

export const notices: Notice[] = [
  {
    id: 'n1',
    title: {
      en: 'Annual General Assembly 2026 Announcement',
      ne: 'वार्षिक साधारण सभा २०८३ को घोषणा',
    },
    content: {
      en: 'Chaurasiya Samaj Nepal is pleased to invite all community members, advisors, and executive members to the Annual General Assembly to be held in Kathmandu. We will discuss our expansion plans, agricultural initiatives for paan growers, and student scholarship quotas.',
      ne: 'चौरसिया समाज नेपाल काठमाडौंमा आयोजना हुने वार्षिक साधारण सभामा सम्पूर्ण समुदायका सदस्य, सल्लाहकार र कार्यकारी सदस्यहरूलाई निमन्त्रणा गर्दछ। हामी हाम्रो विस्तार योजना, पान उत्पादकहरूका लागि कृषि पहलहरू र विद्यार्थी छात्रवृत्ति कोटाबारे छलफल गर्नेछौं।',
    },
    date: '2026-08-10',
    category: 'notice',
  },
  {
    id: 'n2',
    title: {
      en: 'Free Paan Farmers Modernization Workshop',
      ne: 'नि:शुल्क पान कृषक आधुनिकीकरण कार्यशाला',
    },
    content: {
      en: 'To sustain the historic cultivation of betel leaves, we are organizing a training seminar on modern soil testing, drip irrigation, and organic pest control in Birgunj. Export quality enhancements will be key focus.',
      ne: 'पानको पातको ऐतिहासिक खेतीलाई जोगाइराख्न हामी वीरगन्जमा आधुनिक माटो परीक्षण, थोपा सिँचाइ र अर्गानिक कीटनाशक नियन्त्रणसम्बन्धी तालिम गोष्ठी आयोजना गर्दैछौं। गुणस्तर वृद्धि मुख्य फोकस हुनेछ।',
    },
    date: '2026-07-25',
    category: 'work',
  },
  {
    id: 'n3',
    title: {
      en: 'Scholarship Distribution to Chaurasiya Students',
      ne: 'चौरसिया विद्यार्थीहरूलाई छात्रवृत्ति वितरण',
    },
    content: {
      en: 'Applications are officially open for the Chaurasiya Education Welfare Scholarship, aiming to support meritorious students from low-income families pursuing medicine, engineering, and computer sciences.',
      ne: 'चिकित्सा, इन्जिनियरिङ् र कम्प्युटर विज्ञान पढिरहेका न्यून आय भएका परिवारका जेहेन्दार विद्यार्थीहरूलाई सहयोग गर्ने उद्देश्यले चौरसिया शिक्षा कल्याण छात्रवृत्तिका लागि आवेदन खुला गरिएको छ।',
    },
    date: '2026-07-05',
    category: 'press',
  },
];

export const upcomingEvents: CommunityEvent[] = [
  {
    id: 'e1',
    title: {
      en: 'Free Medical Camp & Blood Donation Drive',
      ne: 'नि:शुल्क स्वास्थ्य शिविर तथा रक्तदान कार्यक्रम',
    },
    description: {
      en: 'A collaborative health drive providing free checkups, diabetes testing, pediatric care, and a voluntary blood donation setup in Bara district.',
      ne: 'बारा जिल्लामा नि:शुल्क परीक्षण, मधुमेह परीक्षण, बाल हेरचाह र स्वैच्छिक रक्तदान कार्यक्रम प्रदान गर्ने एक संयुक्त स्वास्थ्य अभियान।',
    },
    date: '2026-07-28',
    time: '08:00 AM - 04:00 PM',
    location: { en: 'Community Health Post, Bara', ne: 'सामुदायिक स्वास्थ्य चौकी, बारा' },
    status: 'upcoming',
  },
  {
    id: 'e2',
    title: {
      en: 'Chaurasiya Youth Leadership & Tech Summit',
      ne: 'चौरसिया युवा नेतृत्व तथा प्रविधि सम्मेलन',
    },
    description: {
      en: 'An enriching conference led by Abhishek Kumar Chaurasiya to guide students into careers in tech, digital marketing, and modern business startups in Nepal.',
      ne: 'नेपालमा प्रविधि, डिजिटल मार्केटिङ र आधुनिक व्यवसायिक स्टार्टअपहरूमा विद्यार्थीहरूलाई करियर मार्गदर्शन गर्न अभिषेक कुमार चौरसियाको नेतृत्वमा हुने एक सम्मेलन।',
    },
    date: '2026-08-15',
    time: '10:00 AM - 05:00 PM',
    location: { en: 'Lalitpur Heritage Hall, Patan', ne: 'ललितपुर हेरिटेज हल, पाटन' },
    status: 'upcoming',
  },
  {
    id: 'e3',
    title: {
      en: 'Annual Paan Leaf Festival & Cultural Puja',
      ne: 'वार्षिक पान महोत्सव तथा सांस्कृतिक पूजा',
    },
    description: {
      en: 'An amazing social gathering celebrating our historical farming culture with traditional foods, dances, agricultural displays, and worship of nature.',
      ne: 'परम्परागत खाना, नृत्य, कृषि प्रदर्शनी र प्रकृति पूजाको साथ हाम्रो ऐतिहासिक कृषि संस्कृतिको उत्सव मनाउने एक अद्भुत सामाजिक भेला।',
    },
    date: '2026-09-02',
    time: '02:00 PM - 09:00 PM',
    location: { en: 'Janaki Mandir Ground, Janakpur', ne: 'जानकी मन्दिर परिसर, जनकपुर' },
    status: 'upcoming',
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    title: { en: 'Fresh Paan Garden (Betel Vineyard)', ne: 'ताजा पान खेती (पानको बरेजा)' },
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
    description: {
      en: 'A beautiful lush green traditional paan cultivation structure (Bareja) managed by local community members.',
      ne: 'स्थानीय समुदायका सदस्यहरूद्वारा व्यवस्थित एक सुन्दर हरियो परम्परागत पान खेती संरचना (बरेजा)।',
    },
  },
  {
    id: 'g2',
    title: { en: 'Community Health Camp Parsa', ne: 'सामुदायिक स्वास्थ्य शिविर पर्सा' },
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
    description: {
      en: 'Free health screenings, eye tests, and medicine distribution for underprivileged elders.',
      ne: 'अल्पसुविधा प्राप्त वृद्धवृद्धाहरूका लागि निःशुल्क स्वास्थ्य परीक्षण, आँखा जाँच र औषधि वितरण।',
    },
  },
  {
    id: 'g3',
    title: { en: 'Youth Interaction & IT Training', ne: 'युवा अन्तरक्रिया र सूचना प्रविधि तालिम' },
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
    description: {
      en: 'Workshop on modern IT skills while staying connected to roots.',
      ne: 'जरासँग जोडिएर आधुनिक सूचना प्रविधि सीपहरूमा कार्यशाला।'
    }
  }
];

export const impactStats: ImpactStat[] = [
  {
    id: 's1',
    value: '500+',
    label: { en: 'Families Supported', ne: 'परिवारहरूलाई सहयोग' },
    desc: { en: 'Through our agriculture and welfare programs.', ne: 'हाम्रा कृषि र कल्याणकारी कार्यक्रमहरू मार्फत।' },
  },
  {
    id: 's2',
    value: '10,000+',
    label: { en: 'Trees Planted', ne: 'वृक्षारोपण' },
    desc: { en: 'Promoting eco-friendly farming.', ne: 'वातावरण मैत्री खेतीलाई बढावा दिँदै।' }, 
  },
  {
    id: 's3',
    value: '350+',
    label: { en: 'Scholarships Disbursed', ne: 'वितरित छात्रवृत्तिहरू' },
    desc: { en: 'Allowing talented students to complete their technical degrees.', ne: 'प्रतिभाशाली विद्यार्थीहरूलाई प्राविधिक डिग्री पूरा गर्न सहयोग।' },
  },
  {
    id: 's4',
    value: '25+',
    label: { en: 'Free Health Camps', ne: 'नि:शुल्क स्वास्थ्य शिविर' },
    desc: { en: 'Conducted in remote villages of Parsa, Bara, and Rautahat districts.', ne: 'पर्सा, बारा र रौतहट जिल्लाका दुर्गम गाउँहरूमा सञ्चालन।' },
  },
];

export const designerProfile: AbhishekProfile = {
  name: 'Abhishek Kumar Chaurasiya',
  title: 'Distinguished Full-Stack Software Engineer & UI/UX Designer',
  bio: {
    en: 'Abhishek Kumar Chaurasiya is a passionate software architect, tech community leader, and the General Secretary & CTO of Chaurasiya Samaj Nepal. Driven by a deep love for his community and technological advancements, Abhishek designed this responsive platform to digitize resources, expand outreach, and deliver a clean digital ecosystem. He specializes in designing modern full-stack systems, mobile apps, and robust cloud services, while preserving cultural legacies through innovative open-source solutions.',
    ne: 'अभिषेक कुमार चौरसिया एक भावुक सफ्टवेयर आर्किटेक्ट, प्रविधि समुदायका नेता र चौरसिया समाज नेपालका महासचिव तथा सीटीओ हुन्। आफ्नो समुदाय र प्राविधिक विकासप्रति गहिरो मायाले प्रेरित भई, अभिषेकले स्रोतहरूलाई डिजिटलाइज गर्न, पहुँच विस्तार गर्न र सफा डिजिटल इकोसिस्टम प्रदान गर्न यो उत्तरदायी प्लेटफर्मको डिजाइन गरेका हुन्। उनी नवीन ओपन-सोर्स समाधानहरू मार्फत सांस्कृतिक विरासतहरू जोगाउँदै आधुनिक फुल-स्ट्याक प्रणालीहरू, मोबाइल एपहरू र बलियो क्लाउड सेवाहरू डिजाइन गर्न विशेषज्ञ छन्।',
  },
  education: 'Bachelor of Science in Computer Science & Information Technology (B.Sc. CSIT)',
  skills: ['TypeScript / JavaScript', 'React / Next.js', 'Blogger Custom XML Templating', 'Node.js & Cloud Architecture', 'UI/UX Design (Figma)', 'Mobile App Development (Flutter)'],
  email: 'achauraseeya@gmail.com',
  phone: '+977-9812345678',
};

export const projects = [
  {
    id: 'p1',
    title: { en: 'Paan Farmers Cooperative', ne: 'पान किसान सहकारी' },
    description: { en: 'Empowering local betel leaf farmers with modern agricultural techniques, organic pest management, and direct market access to increase their income and preserve traditional farming.', ne: 'स्थानीय पान किसानहरूलाई आधुनिक कृषि प्रविधि, जैविक कीटनाशक व्यवस्थापन, र प्रत्यक्ष बजार पहुँचको साथ उनीहरूको आम्दानी बढाउन र परम्परागत खेती संरक्षण गर्न सशक्त बनाउने।' },
    status: 'Ongoing',
    category: { en: 'Agriculture', ne: 'कृषि' },
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef71a3596d24?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p2',
    title: { en: 'Youth IT Scholarship', ne: 'युवा आईटी छात्रवृत्ति' },
    description: { en: 'Providing fully-funded scholarships and laptops to underprivileged youths from the community to pursue degrees in Computer Science and Information Technology.', ne: 'समुदायका विपन्न युवाहरूलाई कम्प्युटर विज्ञान र सूचना प्रविधिमा डिग्री हासिल गर्न पूर्ण-अनुदान प्राप्त छात्रवृत्ति र ल्यापटप प्रदान गर्दै।' },
    status: 'Ongoing',
    category: { en: 'Education', ne: 'शिक्षा' },
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'p3',
    title: { en: 'Community Health Center', ne: 'सामुदायिक स्वास्थ्य केन्द्र' },
    description: { en: 'Established a primary care health clinic in Parsa providing free medical checkups, essential medicines, and maternal care to rural families.', ne: 'ग्रामीण परिवारहरूलाई निःशुल्क स्वास्थ्य परीक्षण, अत्यावश्यक औषधि र मातृ हेरचाह प्रदान गर्ने पर्सामा प्राथमिक हेरचाह स्वास्थ्य क्लिनिक स्थापना गरियो।' },
    status: 'Completed',
    category: { en: 'Health', ne: 'स्वास्थ्य' },
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-cebb47acdd4e?auto=format&fit=crop&q=80&w=800'
  }
];

export const documents: Document[] = [
  {
    id: 'd1',
    title: { en: 'Annual Audit Report 2025', ne: 'वार्षिक लेखापरीक्षण रिपोर्ट २०२५' },
    category: { en: 'Financial', ne: 'वित्तीय' },
    year: '2025',
    type: 'PDF',
    size: '2.4 MB'
  },
  {
    id: 'd2',
    title: { en: 'NGO Registration Certificate', ne: 'NGO दर्ता प्रमाणपत्र' },
    category: { en: 'Legal', ne: 'कानूनी' },
    year: '2014',
    type: 'PDF',
    size: '1.1 MB'
  },
  {
    id: 'd3',
    title: { en: 'Social Welfare Council Affiliation', ne: 'समाज कल्याण परिषद् सम्बन्धन' },
    category: { en: 'Legal', ne: 'कानूनी' },
    year: '2015',
    type: 'PDF',
    size: '850 KB'
  },
  {
    id: 'd4',
    title: { en: 'Constitution of Chaurasiya Samaj', ne: 'चौरसिया समाजको विधान' },
    category: { en: 'Policy', ne: 'नीति' },
    year: '2012',
    type: 'PDF',
    size: '3.5 MB'
  }
];

export const blogPosts = [
  {
    id: 'b1',
    title: {
      en: 'The Heritage of Paan Cultivation in Nepal',
      ne: 'नेपालमा पान खेतीको सम्पदा',
    },
    excerpt: {
      en: 'Exploring the rich history and cultural significance of betel leaf farming within the Chaurasiya community.',
      ne: 'चौरसिया समुदायमा पान खेतीको समृद्ध इतिहास र सांस्कृतिक महत्त्वको अन्वेषण गर्दै।',
    },
    date: 'July 15, 2026',
    author: 'Admin',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'b2',
    title: {
      en: 'Youth Empowerment Initiative 2026',
      ne: 'युवा सशक्तिकरण पहल २०२६',
    },
    excerpt: {
      en: 'How our recent workshops are helping young minds develop modern skills while staying connected to their roots.',
      ne: 'हाम्रा हालैका कार्यशालाहरूले युवा मस्तिष्कहरूलाई उनीहरूको जरासँग जोडिएको आधुनिक सीपहरू विकास गर्न कसरी मद्दत गरिरहेका छन्।',
    },
    date: 'July 10, 2026',
    author: 'Community Coordinator',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'b3',
    title: {
      en: 'Health Camp Success Story',
      ne: 'स्वास्थ्य शिविर सफलताको कथा',
    },
    excerpt: {
      en: 'Over 500 community members received free health checkups and consultations in our latest medical camp.',
      ne: 'हाम्रो पछिल्लो चिकित्सा शिविरमा ५०० भन्दा बढी समुदायका सदस्यहरूले निःशुल्क स्वास्थ्य जाँच र परामर्श प्राप्त गरे।',
    },
    date: 'June 28, 2026',
    author: 'Health Committee',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
  }
];
