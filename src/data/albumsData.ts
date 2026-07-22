import { Album } from '../types';

/**
 * High quality sample album data for "Glimpses of Our Journey".
 * Supports photos and videos (including Google Drive links, YouTube embeds, and direct CDN URLs).
 * 
 * HOW TO ADD GOOGLE DRIVE OR EXTERNAL LINKS:
 * - Photos: You can paste a Google Drive share link (e.g., https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
 *           or direct CDN / Unsplash URL.
 * - Videos: You can paste YouTube watch links (https://www.youtube.com/watch?v=ID), 
 *           Google Drive video links (https://drive.google.com/file/d/FILE_ID/view),
 *           or direct MP4 URLs.
 */
export const journeyAlbums: Album[] = [
  {
    id: 'betel-farming-expo-2026',
    title: {
      en: 'National Betel Farming Expo & Cultural Summit 2026',
      ne: 'राष्ट्रिय पान खेती प्रविधि तथा सांस्कृतिक सम्मेलन २०२६',
    },
    description: {
      en: 'A flagship event held in Parsa highlighting organic paan cultivation techniques, market linkages, and cultural performances by Chaurasiya youth.',
      ne: 'पर्सामा आयोजना गरिएको प्रमुख कार्यक्रम, जसमा जैविक पान खेती प्रविधि, बजार पहुँच र चौरसिया युवाहरूको सांस्कृतिक प्रस्तुति प्रदर्शन गरिएको थियो।',
    },
    coverUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200',
    date: 'July 15, 2026',
    location: {
      en: 'Ghantaghar Ground, Birgunj, Parsa',
      ne: 'घन्टाघर मैदान, वीरगन्ज, पर्सा',
    },
    tags: ['Culture', 'Agriculture', 'Paan Heritage', 'Expo'],
    mediaItems: [
      {
        id: 'm1-1',
        title: {
          en: 'Traditional Betel Leaf Nursery Demonstration',
          ne: 'परम्परागत पान खेती नर्सरी प्रदर्शन',
        },
        description: {
          en: 'Senior farmers explaining optimal irrigation, soil preparation, and shade structures for high-grade betel vines.',
          ne: 'वरिष्ठ किसानहरूले उच्च स्तरको पानको लहरोका लागि उपयुक्त सिँचाइ, माटो तयारी र छहारी संरचनाको बारेमा व्याख्या गर्दै।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1600',
        date: 'July 15, 2026',
        location: { en: 'Birgunj, Parsa', ne: 'वीरगन्ज, पर्सा' },
      },
      {
        id: 'm1-2',
        title: {
          en: 'Highlights Video: Betel Farming Expo Opening Ceremony',
          ne: 'मुख्य भिडियो: पान खेती मेला उद्घाटन समारोह',
        },
        description: {
          en: 'Watch the vibrant cultural inauguration, speech by community leaders, and live paan processing showcase.',
          ne: 'जीवन्त सांस्कृतिक उद्घाटन, सामुदायिक नेताहरूको मन्तव्य र प्रत्यक्ष पान प्रशोधन प्रदर्शन हेर्नुहोस्।',
        },
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // YouTube link parsed automatically
        thumbnailUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
        date: 'July 15, 2026',
        location: { en: 'Birgunj, Parsa', ne: 'वीरगन्ज, पर्सा' },
      },
      {
        id: 'm1-3',
        title: {
          en: 'Chaurasiya Youth Folk Dance Performance',
          ne: 'चौरसिया युवा लोकनृत्य प्रस्तुति',
        },
        description: {
          en: 'Young community members performing traditional Madheshi folk music during the evening cultural program.',
          ne: 'साँझको सांस्कृतिक कार्यक्रममा परम्परागत मधेशी लोकसङ्गीत प्रस्तुत गर्दै युवा सदस्यहरू।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1600',
        date: 'July 15, 2026',
        location: { en: 'Birgunj, Parsa', ne: 'वीरगन्ज, पर्सा' },
      },
      {
        id: 'm1-4',
        title: {
          en: 'Organic Pest Control Workshop Video',
          ne: 'जैविक कीटनाशक नियन्त्रण कार्यशाला भिडियो',
        },
        description: {
          en: 'Agricultural experts training local farmers on eco-friendly remedies to protect vines without harsh chemicals.',
          ne: 'कृषि विज्ञहरूले रसायन बिना लहरो जोगाउन वातावरणमैत्री उपायहरूमा स्थानीय किसानहरूलाई तालिम दिँदै।',
        },
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200',
        date: 'July 15, 2026',
        location: { en: 'Birgunj, Parsa', ne: 'वीरगन्ज, पर्सा' },
      },
      {
        id: 'm1-5',
        title: {
          en: 'Felicitation of Veteran Betel Leaf Cultivators',
          ne: 'ज्येष्ठ पान किसानहरूको सम्मान',
        },
        description: {
          en: 'Award ceremony honoring farmers with over 40 years of dedication to preserving ancestral agriculture.',
          ne: 'पुर्ख्यौली कृषिको संरक्षणमा ४० वर्षभन्दा बढी समय बिताएका किसानहरूलाई सम्मान कार्यक्रम।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1531058240690-006c446962d8?auto=format&fit=crop&q=80&w=1600',
        date: 'July 15, 2026',
        location: { en: 'Birgunj, Parsa', ne: 'वीरगन्ज, पर्सा' },
      },
      {
        id: 'm1-6',
        title: {
          en: 'Interactive Paan Crafting & Tasting Booth',
          ne: 'अन्तरक्रियात्मक पान निर्माण र स्वाद बुथ',
        },
        description: {
          en: 'Visitors learning the delicate art of wrapping Meetha, Banarasi, and Sahi paan varieties.',
          ne: 'आगन्तुकहरूले मीठा, बनारसी र साही पानका प्रकारहरू बेर्ने कला सिक्दै।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80&w=1600',
        date: 'July 15, 2026',
        location: { en: 'Birgunj, Parsa', ne: 'वीरगन्ज, पर्सा' },
      },
    ],
  },

  {
    id: 'free-health-eye-camp-2026',
    title: {
      en: 'Mega Free Health, Eye & Dental Screening Camp',
      ne: 'बृहत् निःशुल्क स्वास्थ्य, आँखा र दन्त परीक्षण शिविर',
    },
    description: {
      en: 'Providing free specialist checkups, cataract screenings, and free prescription glasses to over 600 rural residents in Parsa & Bara.',
      ne: 'पर्सा र बाराका ६०० भन्दा बढी ग्रामीण बासिन्दाहरूलाई निःशुल्क विशेषज्ञ जाँच, मोतियाबिन्दु परीक्षण र निःशुल्क चश्मा वितरण।',
    },
    coverUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
    date: 'June 28, 2026',
    location: {
      en: 'Community Health Post, Pokhariya, Parsa',
      ne: 'सामुदायिक स्वास्थ्य चौकी, पोखरिया, पर्सा',
    },
    tags: ['Health', 'Free Eye Camp', 'Community Service', 'Medical'],
    mediaItems: [
      {
        id: 'm2-1',
        title: {
          en: 'Doctor Consultation & Blood Pressure Check',
          ne: 'डाक्टर परामर्श र रक्तचाप जाँच',
        },
        description: {
          en: 'Volunteer physicians examining senior citizens and providing free essential medicines.',
          ne: 'स्वयंसेवी चिकित्सकहरूले ज्येष्ठ नागरिकहरूको जाँच गर्दै र निःशुल्क औषधि वितरण गर्दै।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600',
        date: 'June 28, 2026',
        location: { en: 'Pokhariya, Parsa', ne: 'पोखरिया, पर्सा' },
      },
      {
        id: 'm2-2',
        title: {
          en: 'Video Documentary: Health Camp Impact Story',
          ne: 'भिडियो डकुमेन्ट्री: स्वास्थ्य शिविर प्रभावको कथा',
        },
        description: {
          en: 'Short video highlighting patient testimonials and doctors delivering medical care in remote villages.',
          ne: 'दुर्गम गाउँहरूमा बिरामीहरूको अनुभव र डाक्टरहरूले स्वास्थ्य सेवा पुर्‍याएको संक्षिप्त भिडियो।',
        },
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200',
        date: 'June 28, 2026',
        location: { en: 'Pokhariya, Parsa', ne: 'पोखरिया, पर्सा' },
      },
      {
        id: 'm2-3',
        title: {
          en: 'Eye Refraction Test & Free Spectacles Distribution',
          ne: 'आँखा जाँच र निःशुल्क चश्मा वितरण',
        },
        description: {
          en: 'Optometrists conducting vision tests for school children and elderly patients.',
          ne: 'दृष्टिमितिज्ञहरूले विद्यालयका बालबालिका र वृद्ध बिरामीहरूको आँखा जाँच गर्दै।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1600',
        date: 'June 28, 2026',
        location: { en: 'Pokhariya, Parsa', ne: 'पोखरिया, पर्सा' },
      },
      {
        id: 'm2-4',
        title: {
          en: 'Pharmacy & Free Medicine Counter',
          ne: 'फार्मेसी र निःशुल्क औषधि काउन्टर',
        },
        description: {
          en: 'Pharmacists dispensing prescribed vitamins, eye drops, and chronic care medicines.',
          ne: 'फार्मासिस्टहरूले तोकिएको भिटामिन, आँखाको थोपा र औषधिहरू वितरण गर्दै।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1600',
        date: 'June 28, 2026',
        location: { en: 'Pokhariya, Parsa', ne: 'पोखरिया, पर्सा' },
      },
    ],
  },

  {
    id: 'youth-it-skills-workshop-2026',
    title: {
      en: 'Youth IT & Digital Empowerment BootCamp 2026',
      ne: 'युवा सूचना प्रविधि तथा डिजिटल सशक्तिकरण बुटक्याम्प २०२६',
    },
    description: {
      en: 'A 3-day intensive software engineering, Web development, and AI tools training for youth from Madhesh Province.',
      ne: 'मधेश प्रदेशका युवाहरूका लागि ३ दिने गहन सफ्टवेयर इन्जिनियरिङ, वेब विकास र एआई उपकरण तालिम।',
    },
    coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    date: 'May 18, 2026',
    location: {
      en: 'IT Innovation Lab, Birgunj',
      ne: 'आईटी इनोभेसन ल्याब, वीरगन्ज',
    },
    tags: ['Youth', 'IT Training', 'Education', 'Technology'],
    mediaItems: [
      {
        id: 'm3-1',
        title: {
          en: 'Hands-on Coding & Web Development Session',
          ne: 'प्रत्यक्ष कोडिङ र वेब विकास सत्र',
        },
        description: {
          en: 'CTO Abhishek Kumar Chaurasiya guiding students through modern TypeScript and React fundamentals.',
          ne: 'सीटीओ अभिषेक कुमार चौरसियाले विद्यार्थीहरूलाई आधुनिक टाइपस्क्रिप्ट र रियाक्टका सिद्धान्तहरूमा मार्गदर्शन गर्दै।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600',
        date: 'May 18, 2026',
        location: { en: 'Birgunj', ne: 'वीरगन्ज' },
      },
      {
        id: 'm3-2',
        title: {
          en: 'Bootcamp Project Presentations & Keynote Video',
          ne: 'बुटक्याम्प परियोजना प्रस्तुति र भिडियो',
        },
        description: {
          en: 'Watch young coders present their open-source web solutions built during the workshop.',
          ne: 'युवा कोडर्सहरूले कार्यशालामा बनाएका ओपन-सोर्स वेब समाधानहरू प्रस्तुत गरेको भिडियो।',
        },
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
        date: 'May 18, 2026',
        location: { en: 'Birgunj', ne: 'वीरगन्ज' },
      },
      {
        id: 'm3-3',
        title: {
          en: 'Laptop & Scholarship Handover Ceremony',
          ne: 'ल्यापटप तथा छात्रवृत्ति हस्तान्तरण समारोह',
        },
        description: {
          en: 'Awarding laptop hardware and tech stipends to meritorious students from needy backgrounds.',
          ne: 'जेहेन्दार र विपन्न वर्गका विद्यार्थीहरूलाई ल्यापटप र प्राविधिक छात्रवृत्ति प्रदान गरियो।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1600',
        date: 'May 18, 2026',
        location: { en: 'Birgunj', ne: 'वीरगन्ज' },
      },
    ],
  },

  {
    id: 'tree-plantation-environment-2026',
    title: {
      en: 'Green Chaurasiya Environmental & Tree Plantation Drive',
      ne: 'हरियाली चौरसिया वातावरण तथा वृक्षारोपण अभियान',
    },
    description: {
      en: 'Planting over 2,500 shade and fruit-bearing trees along public roadsides and betel farming clusters in Rautahat & Parsa.',
      ne: 'रौतहट र पर्सामा सार्वजनिक सडक किनार र पान खेती क्षेत्रमा २,५०० भन्दा बढी छहारी र फलफूलका रुखहरू रोपण।',
    },
    coverUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
    date: 'April 22, 2026',
    location: {
      en: 'Chandrapur & Gaur Corridors, Rautahat',
      ne: 'चन्द्रपुर र गौर करिडोर, रौतहट',
    },
    tags: ['Environment', 'Green Drive', 'Tree Plantation', 'Sustainability'],
    mediaItems: [
      {
        id: 'm4-1',
        title: {
          en: 'Community Volunteers Sapling Plantation',
          ne: 'सामुदायिक स्वयंसेवकहरूद्वारा बिरुवा रोपण',
        },
        description: {
          en: 'Youths, women groups, and local leaders joining hands to plant neem, peepal, and fruit saplings.',
          ne: 'युवा, महिला समूह र स्थानीय नेताहरू मिलेर नीम, पीपल र फलफूलका बिरुवाहरू रोप्दै।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1600',
        date: 'April 22, 2026',
        location: { en: 'Rautahat', ne: 'रौतहट' },
      },
      {
        id: 'm4-2',
        title: {
          en: 'Time-Lapse & Video Overview: Green Corridor Drive',
          ne: 'हरियो करिडोर अभियानको भिडियो झलक',
        },
        description: {
          en: 'A scenic video tour showing the transformation of canal banks and farm boundaries.',
          ne: 'नहरका डिल र खेतका सिमानाहरूमा भएको हरियाली परिवर्तन देखाउने दृश्य भिडियो।',
        },
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
        date: 'April 22, 2026',
        location: { en: 'Rautahat', ne: 'रौतहट' },
      },
      {
        id: 'm4-3',
        title: {
          en: 'Distribution of Fruit Tree Saplings to Farmers',
          ne: 'किसानहरूलाई फलफूलका बिरुवा वितरण',
        },
        description: {
          en: 'Distributing avocado, mango, and betel nut saplings to supplement farmers income.',
          ne: 'किसानको आम्दानी बढाउन एभोकाडो, आँप र सुपारीका बिरुवा वितरण गर्दै।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600',
        date: 'April 22, 2026',
        location: { en: 'Rautahat', ne: 'रौतहट' },
      },
    ],
  },

  {
    id: 'chhath-puja-heritage-2025',
    title: {
      en: 'Chhath Mahaparva Celebrations & Riverbank Cleanliness Drive',
      ne: 'छठ महापर्व उत्सव तथा नदी किनार सरसफाइ अभियान',
    },
    description: {
      en: 'Sponsoring ghat decorations, night lighting, and organizing eco-friendly riverbank cleanup drives during Chhath festival in Birgunj.',
      ne: 'वीरगन्जमा छठ पर्वको अवसरमा घाट सजावट, रात्रिकालीन बत्ती र वातावरणमैत्री सरसफाइ अभियान सञ्चालन।',
    },
    coverUrl: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&q=80&w=1200',
    date: 'November 12, 2025',
    location: {
      en: 'Ghadiarwa Pokhari, Birgunj',
      ne: 'घडीअर्वा पोखरी, वीरगन्ज',
    },
    tags: ['Festival', 'Chhath Puja', 'Heritage', 'Cleanliness'],
    mediaItems: [
      {
        id: 'm5-1',
        title: {
          en: 'Illuminated Ghadiarwa Ghat Sunset Arghya',
          ne: 'सजावट गरिएको घडीअर्वा घाटमा अस्ताउँदो सूर्यलाई अर्घ्य',
        },
        description: {
          en: 'Devotees offering traditional prayers and sweets to the setting Sun at Ghadiarwa lake.',
          ne: 'घडीअर्वा पोखरीमा अस्ताउँदो सूर्यलाई ठेकुवा र अर्घ्य अर्पण गर्दै श्रद्धालुहरू।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&q=80&w=1600',
        date: 'November 12, 2025',
        location: { en: 'Birgunj', ne: 'वीरगन्ज' },
      },
      {
        id: 'm5-2',
        title: {
          en: 'Chhath Night Celebrations Video Highlights',
          ne: 'छठ रात्रिकालीन उत्सवको भिडियो',
        },
        description: {
          en: 'Mesmerizing night lights, devotional songs, and volunteer tea distribution stalls.',
          ne: 'मनमोहक रात्रिकालीन रोशनी, भक्ति सङ्गीत र स्वयंसेवकहरूको चिया स्टल भिडियो।',
        },
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200',
        date: 'November 12, 2025',
        location: { en: 'Birgunj', ne: 'वीरगन्ज' },
      },
      {
        id: 'm5-3',
        title: {
          en: 'Youth Cleanliness & Eco-Ghat Volunteer Team',
          ne: 'युवा सरसफाइ र इको-घाट स्वयंसेवक टोली',
        },
        description: {
          en: 'Over 80 Chaurasiya Samaj volunteers collecting bio-waste and keeping water bodies pristine.',
          ne: '८० भन्दा बढी चौरसिया समाजका स्वयंसेवकहरूले फोहोर संकलन गरी जलाशय सफा राख्दै।',
        },
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1600',
        date: 'November 12, 2025',
        location: { en: 'Birgunj', ne: 'वीरगन्ज' },
      },
    ],
  },
];
