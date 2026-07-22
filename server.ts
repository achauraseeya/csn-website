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

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Helper to read persistent online albums
  function getOnlineAlbums() {
    if (fs.existsSync(ALBUMS_FILE)) {
      try {
        const raw = fs.readFileSync(ALBUMS_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Error reading online albums file:", e);
      }
    }
    return [];
  }

  // Helper to write persistent online albums
  function saveOnlineAlbums(albums: any[]) {
    try {
      fs.writeFileSync(ALBUMS_FILE, JSON.stringify(albums, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing online albums file:", e);
    }
  }

  // Helper to read persistent online notices
  function getOnlineNotices() {
    if (fs.existsSync(NOTICES_FILE)) {
      try {
        const raw = fs.readFileSync(NOTICES_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Error reading online notices file:", e);
      }
    }
    return [];
  }

  // Helper to write persistent online notices
  function saveOnlineNotices(notices: any[]) {
    try {
      fs.writeFileSync(NOTICES_FILE, JSON.stringify(notices, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing online notices file:", e);
    }
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
