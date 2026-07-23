import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Middleware to authenticate admin for modifying/destructive API calls
  app.use("/api/*", (req, res, next) => {
    if (req.method === "GET" || req.originalUrl === "/api/health") {
      return next();
    }
    
    const authHeader = (req.headers["authorization"] || "").toString();
    const adminPasswordHeader = (req.headers["x-admin-password"] || "").toString();
    
    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    const password = (token || adminPasswordHeader || "").trim();
    
    const validPasswords = ["admin2026", "chaurasiya2026", "chaurasiya"];
    if (validPasswords.includes(password)) {
      return next();
    }
    
    console.warn(`Unauthorized ${req.method} request blocked on ${req.originalUrl}`);
    return res.status(401).json({ success: false, error: "Unauthorized: Admin login is required" });
  });

  // Directory for online data storage
  const DATA_DIR = path.join(process.cwd(), "data");
  const ALBUMS_FILE = path.join(DATA_DIR, "journey_albums.json");
  const NOTICES_FILE = path.join(DATA_DIR, "community_notices.json");
  const EVENTS_FILE = path.join(DATA_DIR, "community_events.json");
  const MEMBERS_FILE = path.join(DATA_DIR, "community_members.json");
  const DOCUMENTS_FILE = path.join(DATA_DIR, "community_documents.json");
  const SITE_TEXTS_FILE = path.join(DATA_DIR, "site_texts.json");

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Ensure public/uploads directory exists and serve it statically
  const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Helper file readers/writers
  function getFileItems(filePath: string) {
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
      }
    }
    return [];
  }

  function saveFileItems(filePath: string, items: any[]) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf-8");
    } catch (e) {
      console.error(`Error writing ${filePath}:`, e);
    }
  }

  // Helper to read persistent online albums
  function getOnlineAlbums() {
    return getFileItems(ALBUMS_FILE);
  }

  // Helper to write persistent online albums
  function saveOnlineAlbums(albums: any[]) {
    saveFileItems(ALBUMS_FILE, albums);
  }

  // Helper to read persistent online notices
  function getOnlineNotices() {
    return getFileItems(NOTICES_FILE);
  }

  // Helper to write persistent online notices
  function saveOnlineNotices(notices: any[]) {
    saveFileItems(NOTICES_FILE, notices);
  }

  // API Route: GET all online custom posts/albums
  app.get("/api/albums", (req, res) => {
    const albums = getOnlineAlbums();
    res.json({ success: true, albums });
  });

  // API Route: POST create or update an online album/post
  app.post("/api/albums", (req, res) => {
    const newAlbum = req.body;
    if (!newAlbum || !newAlbum.id) {
      return res.status(400).json({ success: false, error: "Invalid album payload" });
    }

    const current = getOnlineAlbums();
    const filtered = current.filter((a: any) => a.id !== newAlbum.id);
    const updated = [newAlbum, ...filtered];

    saveOnlineAlbums(updated);
    console.log(`Saved online album: ${newAlbum.title?.en || newAlbum.id}`);

    res.json({ success: true, album: newAlbum, albums: updated });
  });

  // API Route: DELETE an online album/post
  app.delete("/api/albums/:id", (req, res) => {
    const { id } = req.params;
    const current = getOnlineAlbums();
    const updated = current.filter((a: any) => a.id !== id);

    saveOnlineAlbums(updated);
    res.json({ success: true, albums: updated });
  });

  // API Route: GET all online notices
  app.get("/api/notices", (req, res) => {
    const notices = getOnlineNotices();
    res.json({ success: true, notices });
  });

  // API Route: POST create or update an online notice
  app.post("/api/notices", (req, res) => {
    const newNotice = req.body;
    if (!newNotice || !newNotice.id) {
      return res.status(400).json({ success: false, error: "Invalid notice payload" });
    }

    const current = getOnlineNotices();
    const filtered = current.filter((n: any) => n.id !== newNotice.id);
    const updated = [newNotice, ...filtered];

    saveOnlineNotices(updated);
    console.log(`Saved online notice: ${newNotice.title?.en || newNotice.id}`);

    res.json({ success: true, notice: newNotice, notices: updated });
  });

  // API Route: DELETE an online notice
  app.delete("/api/notices/:id", (req, res) => {
    const { id } = req.params;
    const current = getOnlineNotices();
    const updated = current.filter((n: any) => n.id !== id);

    saveOnlineNotices(updated);
    res.json({ success: true, notices: updated });
  });

  // API Routes: Events
  app.get("/api/events", (req, res) => {
    const events = getFileItems(EVENTS_FILE);
    res.json({ success: true, events });
  });

  app.post("/api/events", (req, res) => {
    const newEvent = req.body;
    if (!newEvent || !newEvent.id) {
      return res.status(400).json({ success: false, error: "Invalid event payload" });
    }
    const current = getFileItems(EVENTS_FILE);
    const filtered = current.filter((e: any) => e.id !== newEvent.id);
    const updated = [newEvent, ...filtered];
    saveFileItems(EVENTS_FILE, updated);
    res.json({ success: true, event: newEvent, events: updated });
  });

  app.delete("/api/events/:id", (req, res) => {
    const { id } = req.params;
    const current = getFileItems(EVENTS_FILE);
    const updated = current.filter((e: any) => e.id !== id);
    saveFileItems(EVENTS_FILE, updated);
    res.json({ success: true, events: updated });
  });

  // API Routes: Members
  app.get("/api/members", (req, res) => {
    const members = getFileItems(MEMBERS_FILE);
    res.json({ success: true, members });
  });

  app.post("/api/members", (req, res) => {
    const newMember = req.body;
    if (!newMember || !newMember.id) {
      return res.status(400).json({ success: false, error: "Invalid member payload" });
    }

    // Check if there is an uploaded photo in base64
    if (newMember.photoBase64 && newMember.photoName) {
      try {
        let base64Data = newMember.photoBase64;
        if (base64Data.includes(";base64,")) {
          base64Data = base64Data.split(";base64,").pop() || "";
        }
        
        // Clean filename, make it unique
        const ext = path.extname(newMember.photoName) || ".jpg";
        const cleanName = `${newMember.id}_${Date.now()}${ext}`;
        const filePath = path.join(UPLOADS_DIR, cleanName);
        
        fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
        
        // Set new member's avatar to the uploaded path
        newMember.avatarUrl = `/uploads/${cleanName}`;
      } catch (e) {
        console.error("Error saving uploaded member photo:", e);
      }
    }

    // Strip photoBase64 and photoName so they don't persist in members JSON database
    delete newMember.photoBase64;
    delete newMember.photoName;

    const current = getFileItems(MEMBERS_FILE);
    const filtered = current.filter((m: any) => m.id !== newMember.id);
    const updated = [newMember, ...filtered];
    saveFileItems(MEMBERS_FILE, updated);
    res.json({ success: true, member: newMember, members: updated });
  });

  app.delete("/api/members/:id", (req, res) => {
    const { id } = req.params;
    const current = getFileItems(MEMBERS_FILE);
    
    // Find the member to see if they have an uploaded avatar we need to delete from the repository
    const memberToDelete = current.find((m: any) => m.id === id);
    if (memberToDelete && memberToDelete.avatarUrl && memberToDelete.avatarUrl.startsWith("/uploads/")) {
      try {
        const fileName = memberToDelete.avatarUrl.replace("/uploads/", "");
        const filePath = path.join(UPLOADS_DIR, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted member photo from repository: ${filePath}`);
        }
      } catch (e) {
        console.error("Error deleting member photo from repository:", e);
      }
    }

    const updated = current.filter((m: any) => m.id !== id);
    saveFileItems(MEMBERS_FILE, updated);
    res.json({ success: true, members: updated });
  });

  // API Routes: Documents
  app.get("/api/documents", (req, res) => {
    const documents = getFileItems(DOCUMENTS_FILE);
    res.json({ success: true, documents });
  });

  app.post("/api/documents", (req, res) => {
    const newDoc = req.body;
    if (!newDoc || !newDoc.id) {
      return res.status(400).json({ success: false, error: "Invalid document payload" });
    }
    const current = getFileItems(DOCUMENTS_FILE);
    const filtered = current.filter((d: any) => d.id !== newDoc.id);
    const updated = [newDoc, ...filtered];
    saveFileItems(DOCUMENTS_FILE, updated);
    res.json({ success: true, document: newDoc, documents: updated });
  });

  app.delete("/api/documents/:id", (req, res) => {
    const { id } = req.params;
    const current = getFileItems(DOCUMENTS_FILE);
    const updated = current.filter((d: any) => d.id !== id);
    saveFileItems(DOCUMENTS_FILE, updated);
    res.json({ success: true, documents: updated });
  });

  // API Routes: Site Texts (Homepage hero/texts, Privacy & Terms)
  const DEFAULT_SITE_TEXTS = {
    heroTitleEn: "Heritage & Legacy of Chaurasiya Samaj Nepal",
    heroTitleNe: "चौरसिया समाज नेपालको सम्पदा र विरासत",
    heroSubEn: "A dedicated social platform preserving betel leaf culture & serving humanity across Nepal.",
    heroSubNe: "नेपालभर पान संस्कृतिको संरक्षण र मानव सेवामा समर्पित एक सामाजिक मञ्च।",
    introEn: "Chaurasiya Samaj Nepal (चौरसिया समाज नेपाल) is a dedicated non-governmental organization (NGO) established to uplift, unite, and serve the Chaurasiya community across Nepal. Rich in cultural values and historic agricultural excellence, our community has played a pivotal role in Nepalese social-economic history.",
    introNe: "चौरसिया समाज नेपाल नेपालभर रहेका चौरसिया समुदायको उत्थान, एकता र सेवाका लागि स्थापित एक समर्पित गैर-सरकारी संस्था (NGO) हो। सांस्कृतिक मूल्य र ऐतिहासिक कृषि उत्कृष्टताले समृद्ध, हाम्रो समुदायले नेपालको सामाजिक-आर्थिक इतिहासमा महत्त्वपूर्ण भूमिका खेलेको छ।",
    paanStoryTitleEn: "The Sacred Bond with the Betel Leaf (Paan)",
    paanStoryTitleNe: "पानको पातसँगको पवित्र सम्बन्ध",
    paanStoryEn: "The Chaurasiya community is historically and culturally intertwined with the cultivation of the \"Paan\" (betel leaf) – a symbol of hospitality, respect, and traditional medicine in Nepal. The paan leaf represents freshness, growth, and community bonding, which is why our identity is dressed in vibrant and lush shades of teal and emerald.",
    paanStoryNe: "चौरसिया समुदाय ऐतिहासिक र सांस्कृतिक रूपमा \"पान\" (betel leaf) को खेतीसँग जोडिएको छ - जुन नेपालमा आतिथ्य, सम्मान र परम्परागत औषधिको प्रतीक हो। पानको पातले ताजापन, वृद्धि र सामुदायिक सम्बन्धलाई प्रतिनिधित्व गर्दछ, त्यसैले हाम्रो पहिचान हरियो र टिल रङको जीवन्त रंगहरूमा सजिएको छ।",
    missionTitleEn: "Our Vision & Mission",
    missionTitleNe: "हाम्रो दृष्टिकोण र लक्ष्य",
    missionEn: "To foster unity, education, economic empowerment, and preservation of cultural heritage among Chaurasiya members while actively contributing to the welfare of Nepalese society through charitable programs, healthcare camps, and youth-led initiatives.",
    missionNe: "चौरसिया सदस्यहरू बीच एकता, शिक्षा, आर्थिक सशक्तिकरण र सांस्कृतिक सम्पदाको संरक्षण प्रवर्द्धन गर्ने र परोपकारी कार्यक्रमहरू, स्वास्थ्य शिविरहरू र युवाहरूको नेतृत्वमा हुने पहलहरू मार्फत नेपाली समाजको कल्याणमा सक्रिय रूपमा योगदान पुर्‍याउने।",
    privacyEn: "### Privacy Policy\n\nChaurasiya Samaj Nepal is committed to protecting your personal privacy. We collect names, emails, and contact details solely for managing our member directory and keeping our members updated with official notices.\n\nYour data is securely stored and never shared with unauthorized third parties. By registering or nominating a member, you agree to our data handling practices.\n\n*Review led by Chief General Secretary and CTO Abhishek Kumar Chaurasiya.*\n\nFeel free to contact us for any query regarding this policy.",
    privacyNe: "### गोपनीयता नीति\n\nचौरसिया समाज नेपाल तपाईंको व्यक्तिगत गोपनीयताको रक्षा गर्न प्रतिबद्ध छ। हामी सदस्य निर्देशिका व्यवस्थापन गर्न र हाम्रा सदस्यहरूलाई आधिकारिक सूचनाहरू प्रदान गर्नका लागि मात्र नाम, इमेल र सम्पर्क विवरणहरू सङ्कलन गर्छौं।\n\nतपाईंको डाटा सुरक्षित रूपमा भण्डारण गरिएको छ र अनधिकृत तेस्रो पक्षहरूसँग कहिल्यै साझा गरिँदैन।",
    termsEn: "### Terms of Service\n\nWelcome to Chaurasiya Samaj Nepal's official portal. By accessing this website, you agree to comply with our community rules and guidelines.\n\nUsers must not submit false information or impersonate others when nominating community profiles or filling out registration forms.\n\nWe reserve the right to verify, approve, edit, or reject any listing or notice submitted to our portal.",
    termsNe: "### सेवाका सर्तहरू\n\nचौरसिया समाज नेपालको आधिकारिक पोर्टलमा स्वागत छ। यस वेबसाइटमा पहुँच गरेर, तपाईं हाम्रा सामुदायिक नियमहरू र दिशानिर्देशहरू पालना करना सहमत हुनुहुन्छ।\n\nप्रयोगकर्ताहरूले नक्कली जानकारी पेश गर्नु हुँदैन।",
    sliderBadgeEn: "Jay Paan Dev",
    sliderBadgeNe: "जय पान देव",
    logoTextEn: "Chaurasiya Samaj",
    logoTextNe: "चौरसिया समाज",
    logoSubEn: "Nepal",
    logoSubNe: "चौरसिया समाज नेपाल",
    logoUrl: "",
    taglineEn: "A dedicated social platform preserving betel leaf culture & serving humanity",
    taglineNe: "पान संस्कृतिको संरक्षण र मानव सेवामा समर्पित एक सामाजिक संस्था",
    impactHeaderEn: "Empowering & Transforming Lives",
    impactHeaderNe: "सशक्तिकरण र जीवन परिवर्तन",
    footerAboutEn: "We are dedicated to unifying community coordinators, supporting traditional cultivation, and providing essential healthcare and youth education programs.",
    footerAboutNe: "हामी सामुदायिक संयोजकहरूलाई एकीकृत गर्न, परम्परागत खेतीलाई सहयोग गर्न र आवश्यक स्वास्थ्य सेवा र युवा शिक्षा कार्यक्रमहरू प्रदान गर्न समर्पित छौं।",
    footerAddressEn: "Ghantaghar Path, Birgunj, Parsa, Madhesh Province, Nepal",
    footerAddressNe: "घण्टाघर पथ, वीरगन्ज, पर्सा, मधेश प्रदेश, नेपाल",
    footerPhone: "+977-9812345678",
    footerEmail: "achauraseeya@gmail.com",
    socialFb: "https://facebook.com",
    socialTw: "https://twitter.com",
    socialIg: "https://instagram.com",
    heroImagesJson: JSON.stringify([
      {
        id: "g1",
        title: { en: "Fresh Paan Garden (Betel Vineyard)", ne: "ताजा पान खेती (पानको बरेजा)" },
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600",
        description: {
          en: "A beautiful lush green traditional paan cultivation structure (Bareja) managed by local community members.",
          ne: "स्थानीय समुदायका सदस्यहरूद्वारा व्यवस्थित एक सुन्दर हरियो परम्परागत पान खेती संरचना (बरेजा)।"
        }
      },
      {
        id: "g2",
        title: { en: "Community Health Camp Parsa", ne: "सामुदायिक स्वास्थ्य शिविर पर्सा" },
        imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600",
        description: {
          en: "Free health screenings, eye tests, and medicine distribution for underprivileged elders.",
          ne: "अल्पसुविधा प्राप्त वृद्धवृद्धाहरूका लागि निःशुल्क स्वास्थ्य परीक्षण, आँखा जाँच र औषधि वितरण।"
        }
      },
      {
        id: "g3",
        title: { en: "Youth Interaction & IT Training", ne: "युवा अन्तरक्रिया र सूचना प्रविधि तालिम" },
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
        description: {
          en: "Workshop on modern IT skills while staying connected to roots.",
          ne: "जरासँग जोडिएर आधुनिक सूचना प्रविधि सीपहरूमा कार्यशाला।"
        }
      }
    ])
  };

  // API Route: POST upload any file/image in base64 format (restricted to admin via middleware)
  app.post("/api/upload", (req, res) => {
    const { fileBase64, fileName } = req.body;
    if (!fileBase64 || !fileName) {
      return res.status(400).json({ success: false, error: "Missing fileBase64 or fileName" });
    }
    try {
      let base64Data = fileBase64;
      if (base64Data.includes(";base64,")) {
        base64Data = base64Data.split(";base64,").pop() || "";
      }
      
      const ext = path.extname(fileName) || ".jpg";
      const cleanName = `upload_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
      const filePath = path.join(UPLOADS_DIR, cleanName);
      
      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
      const url = `/uploads/${cleanName}`;
      
      console.log(`Saved uploaded file to repository: ${url}`);
      res.json({ success: true, url });
    } catch (e: any) {
      console.error("Error in upload endpoint:", e);
      res.status(500).json({ success: false, error: e.message || "Failed to upload file" });
    }
  });

  app.get("/api/site-texts", (req, res) => {
    if (fs.existsSync(SITE_TEXTS_FILE)) {
      try {
        const raw = fs.readFileSync(SITE_TEXTS_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return res.json({ success: true, siteTexts: { ...DEFAULT_SITE_TEXTS, ...parsed } });
      } catch (e) {
        console.error("Error reading site texts file:", e);
      }
    }
    res.json({ success: true, siteTexts: DEFAULT_SITE_TEXTS });
  });

  app.post("/api/site-texts", (req, res) => {
    const newTexts = req.body;
    if (!newTexts) {
      return res.status(400).json({ success: false, error: "Empty payload" });
    }
    try {
      fs.writeFileSync(SITE_TEXTS_FILE, JSON.stringify(newTexts, null, 2), "utf-8");
      console.log("Updated online site texts successfully!");
      res.json({ success: true, siteTexts: newTexts });
    } catch (e) {
      console.error("Error saving site texts file:", e);
      res.status(500).json({ success: false, error: "Failed to write data" });
    }
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite development middleware or Production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
