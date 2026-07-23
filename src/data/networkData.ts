import { NetworkBranch } from '../types';

export const initialNetworks: NetworkBranch[] = [
  {
    id: "chapter-kathmandu",
    type: "chapter",
    name: {
      en: "Kathmandu District Chapter",
      ne: "काठमाडौं जिल्ला शाखा"
    },
    description: {
      en: "The central and largest chapter of Chaurasiya Samaj Nepal, driving national initiatives and community support in the capital.",
      ne: "चौरसिया समाज नेपालको केन्द्रीय र सबैभन्दा ठूलो शाखा, जसले राजधानीमा राष्ट्रिय पहल र सामुदायिक समर्थन सञ्चालन गर्दछ।"
    },
    location: {
      en: "Kathmandu, Bagmati",
      ne: "काठमाडौं, बागमती"
    },
    establishedDate: "2015-01-15",
    contactEmail: "kathmandu@chaurasiyasamaj.org.np",
    contactPhone: "+977 1-4000000",
    heroImagesJson: JSON.stringify([
      "https://images.unsplash.com/photo-1542385150-13f6381014cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]),
    impactStatsJson: JSON.stringify([
      { label: { en: "Members", ne: "सदस्यहरू" }, value: "1,200+" },
      { label: { en: "Events/Year", ne: "प्रति वर्ष कार्यक्रम" }, value: "24" }
    ])
  },
  {
    id: "chapter-parsagadhi",
    type: "chapter",
    name: {
      en: "Parsa District Chapter",
      ne: "पर्सा जिल्ला शाखा"
    },
    description: {
      en: "Focusing on agricultural empowerment and community welfare in Parsa district, the heartland of paan cultivation.",
      ne: "पर्सा जिल्लामा कृषि सशक्तिकरण र सामुदायिक कल्याणमा केन्द्रित, जुन पान खेतीको केन्द्र हो।"
    },
    location: {
      en: "Birgunj, Parsa",
      ne: "वीरगञ्ज, पर्सा"
    },
    establishedDate: "2010-04-10",
    contactEmail: "parsa@chaurasiyasamaj.org.np",
    heroImagesJson: JSON.stringify([
      "https://images.unsplash.com/photo-1629853909778-9004d608d810?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]),
    impactStatsJson: JSON.stringify([
      { label: { en: "Members", ne: "सदस्यहरू" }, value: "850+" },
      { label: { en: "Farmers Supported", ne: "समर्थित किसानहरू" }, value: "320" }
    ])
  },
  {
    id: "chapter-bara",
    type: "chapter",
    name: {
      en: "Bara District Chapter",
      ne: "बारा जिल्ला शाखा"
    },
    description: {
      en: "Working closely with local authorities to promote cultural heritage and support marginalized families.",
      ne: "सांस्कृतिक सम्पदा प्रवर्द्धन गर्न र सीमान्तकृत परिवारहरूलाई समर्थन गर्न स्थानीय अधिकारीहरूसँग मिलेर काम गर्दै।"
    },
    location: {
      en: "Kalaiya, Bara",
      ne: "कलैया, बारा"
    },
    establishedDate: "2012-08-22",
    heroImagesJson: JSON.stringify([
      "https://images.unsplash.com/photo-1605367858909-0d322efbc34f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ])
  },
  {
    id: "sister-youth",
    type: "sister",
    name: {
      en: "Chaurasiya Youth Forum",
      ne: "चौरसिया युवा मञ्च"
    },
    description: {
      en: "A dynamic sister organization empowering the younger generation through education, skill development, and sports.",
      ne: "शिक्षा, सीप विकास र खेलकुद मार्फत युवा पुस्तालाई सशक्त बनाउने एक गतिशील भातृ संस्था।"
    },
    location: {
      en: "National / Kathmandu Base",
      ne: "राष्ट्रिय / काठमाडौं आधार"
    },
    establishedDate: "2018-05-10",
    contactEmail: "youth@chaurasiyasamaj.org.np",
    heroImagesJson: JSON.stringify([
      "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ]),
    impactStatsJson: JSON.stringify([
      { label: { en: "Active Youth", ne: "सक्रिय युवा" }, value: "500+" },
      { label: { en: "Scholarships", ne: "छात्रवृत्ति" }, value: "45" }
    ])
  },
  {
    id: "sister-women",
    type: "sister",
    name: {
      en: "Chaurasiya Women's Empowerment Cell",
      ne: "चौरसिया महिला सशक्तिकरण सेल"
    },
    description: {
      en: "Dedicated to advancing women's rights, healthcare, and economic independence within the community.",
      ne: "समुदाय भित्र महिला अधिकार, स्वास्थ्य सेवा र आर्थिक स्वतन्त्रता प्रवर्द्धन गर्न समर्पित।"
    },
    location: {
      en: "National",
      ne: "राष्ट्रिय"
    },
    establishedDate: "2016-11-20",
    heroImagesJson: JSON.stringify([
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ])
  }
];
