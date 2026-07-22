import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Directory for online data storage
  const DATA_DIR = path.join(process.cwd(), "data");
  const ALBUMS_FILE = path.join(DATA_DIR, "journey_albums.json");
  const NOTICES_FILE = path.join(DATA_DIR, "community_notices.json");
  const EVENTS_FILE = path.join(DATA_DIR, "community_events.json");
  const MEMBERS_FILE = path.join(DATA_DIR, "community_members.json");
  const DOCUMENTS_FILE = path.join(DATA_DIR, "community_documents.json");

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
