import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.js";
import { matrimonialProfiles, volunteerApplications, membershipApplications, newsletterSubscribers } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Ensure data_store directory exists for local filesystem cache
  const DATA_DIR = path.join(process.cwd(), 'data_store');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // --- Universal Pure JSON Site Data Persistence Endpoints (GitHub-backed) ---
  app.get("/api/site-data/:key", (req, res) => {
    try {
      const key = req.params.key.replace(/[^a-zA-Z0-9_-]/g, '');
      const filePath = path.join(DATA_DIR, `${key}.json`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return res.json(JSON.parse(content));
      }
      return res.status(404).json({ error: "Site data key not found" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to read site data" });
    }
  });

  app.post("/api/site-data/:key", (req, res) => {
    try {
      const key = req.params.key.replace(/[^a-zA-Z0-9_-]/g, '');
      const filePath = path.join(DATA_DIR, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
      return res.json({ success: true, key });
    } catch (err) {
      return res.status(500).json({ error: "Failed to save site data" });
    }
  });

  // API Routes

// --- Google Drive Folder Images Scraper with Cache ---
const driveCache = new Map<string, { files: any[], timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

app.get("/api/drive-folder-images", async (req, res) => {
  try {
    const { folderId } = req.query;
    if (!folderId || typeof folderId !== "string") {
      return res.status(400).json({ error: "folderId is required" });
    }

    // Check cache
    const cached = driveCache.get(folderId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ files: cached.files, fromCache: true });
    }

    const url = `https://drive.google.com/embeddedfolderview?id=${folderId}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: `Failed to fetch folder: ${response.status}` });
    }

    const html = await response.text();
    const files: Array<{ id: string; name: string; type: "photo" | "video" }> = [];
    const seenIds = new Set<string>();

    // Priority 1: Direct JSON-like data structure matches
    // Matches: [ "ID", "Name", "mime/type", ... ]
    const dataRegex = /\[\s*["']([a-zA-Z0-9_-]{25,})["']\s*,\s*["']([^"']{1,255}?)["']\s*,\s*["'](image|video)\/[^"']+?["']/gi;
    let match;
    while ((match = dataRegex.exec(html)) !== null) {
      const id = match[1];
      const name = match[2];
      const type = match[3] === "video" ? "video" : "photo";
      if (!seenIds.has(id)) {
        seenIds.add(id);
        files.push({ id, name, type });
      }
    }

    // Priority 2: Extension based matches for slightly different formats
    const extRegex = /["']([a-zA-Z0-9_-]{25,})["']\s*,\s*["']([^"']+?\.(?:jpg|jpeg|png|gif|webp|heic|mp4|mov|avi|webm))["']/gi;
    while ((match = extRegex.exec(html)) !== null) {
      const id = match[1];
      const name = match[2];
      const isVideo = /\.(mp4|mov|avi|webm)$/i.test(name);
      if (!seenIds.has(id)) {
        seenIds.add(id);
        files.push({ id, name, type: isVideo ? "video" : "photo" });
      }
    }

    // If no files found, try a very broad search for IDs (33 chars usually)
    if (files.length === 0) {
      const broadRegex = /["']([a-zA-Z0-9_-]{33})["']\s*,\s*["']([^"']+?)["']/g;
      while ((match = broadRegex.exec(html)) !== null) {
        const id = match[1];
        const name = match[2];
        // Basic check for image/video extensions or generic names
        if (!seenIds.has(id) && (/\.(jpg|jpeg|png|gif|webp|heic|mp4|mov|avi|webm)$/i.test(name) || name.startsWith('IMG_') || name.startsWith('DSC'))) {
          seenIds.add(id);
          const isVideo = /\.(mp4|mov|avi|webm)$/i.test(name);
          files.push({ id, name, type: isVideo ? "video" : "photo" });
        }
      }
    }

    // Sort: items with "cover", "main", "thumb" first, then by name
    files.sort((a, b) => {
      const aLower = a.name.toLowerCase();
      const bLower = b.name.toLowerCase();
      const aIsPrio = aLower.includes('cover') || aLower.includes('main') || aLower.includes('thumb');
      const bIsPrio = bLower.includes('cover') || bLower.includes('main') || bLower.includes('thumb');
      
      if (aIsPrio && !bIsPrio) return -1;
      if (!aIsPrio && bIsPrio) return 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });

    // Update cache
    driveCache.set(folderId, { files, timestamp: Date.now() });

    return res.json({ files, count: files.length });
  } catch (err: any) {
    console.error("Error in drive-folder-images route:", err);
    return res.status(500).json({ error: err.message || "Failed to process folder images" });
  }
});

  // --- Matrimonial Profiles ---
  app.get("/api/matrimony", async (req, res) => {
    try {
      const data = await db.select().from(matrimonialProfiles);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch matrimonial profiles" });
    }
  });

  app.post("/api/matrimony", async (req, res) => {
    try {
      const result = await db.insert(matrimonialProfiles).values(req.body).returning();
      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save matrimonial profile" });
    }
  });

  app.put("/api/matrimony/:id/status", async (req, res) => {
    try {
      const result = await db.update(matrimonialProfiles)
        .set({ status: req.body.status })
        .where(eq(matrimonialProfiles.id, req.params.id))
        .returning();
      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update matrimonial status" });
    }
  });

  app.delete("/api/matrimony/:id", async (req, res) => {
    try {
      await db.delete(matrimonialProfiles).where(eq(matrimonialProfiles.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete matrimonial profile" });
    }
  });

  // --- Volunteer Applications ---
  app.get("/api/volunteers", async (req, res) => {
    try {
      const data = await db.select().from(volunteerApplications);
      const parsedData = data.map(d => ({
        ...d,
        interests: JSON.parse(d.interests)
      }));
      res.json(parsedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch volunteers" });
    }
  });

  app.post("/api/volunteers", async (req, res) => {
    try {
      const dataToSave = {
        ...req.body,
        interests: JSON.stringify(req.body.interests)
      };
      const result = await db.insert(volunteerApplications).values(dataToSave).returning();
      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save volunteer" });
    }
  });

  app.put("/api/volunteers/:id/status", async (req, res) => {
    try {
      const result = await db.update(volunteerApplications)
        .set({ status: req.body.status })
        .where(eq(volunteerApplications.id, req.params.id))
        .returning();
      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update volunteer status" });
    }
  });

  app.delete("/api/volunteers/:id", async (req, res) => {
    try {
      await db.delete(volunteerApplications).where(eq(volunteerApplications.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete volunteer" });
    }
  });

  // --- Membership Applications ---
  app.get("/api/memberships", async (req, res) => {
    try {
      const data = await db.select().from(membershipApplications);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch memberships" });
    }
  });

  app.post("/api/memberships", async (req, res) => {
    try {
      const result = await db.insert(membershipApplications).values(req.body).returning();
      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save membership" });
    }
  });

  app.put("/api/memberships/:id/status", async (req, res) => {
    try {
      const result = await db.update(membershipApplications)
        .set({ status: req.body.status, assignedMemberId: req.body.assignedMemberId })
        .where(eq(membershipApplications.id, req.params.id))
        .returning();
      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update membership status" });
    }
  });

  app.delete("/api/memberships/:id", async (req, res) => {
    try {
      await db.delete(membershipApplications).where(eq(membershipApplications.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete membership" });
    }
  });

  // --- Newsletter Subscribers ---
  app.get("/api/subscribers", async (req, res) => {
    try {
      const data = await db.select().from(newsletterSubscribers);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  app.post("/api/subscribers", async (req, res) => {
    try {
      const result = await db.insert(newsletterSubscribers).values(req.body).returning();
      res.json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save subscriber" });
    }
  });

  app.delete("/api/subscribers/:id", async (req, res) => {
    try {
      await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete subscriber" });
    }
  });

  // --- Dynamic XML Sitemap Route for Search Engines ---
  app.get("/sitemap.xml", (req, res) => {
    const domain = `${req.protocol}://${req.get("host")}`;
    const today = new Date().toISOString().split("T")[0];
    const pages = [
      "",
      "#directory",
      "#matrimonial",
      "#events",
      "#membership-donation",
      "#our-heritage",
      "#albums-gallery",
      "#notices-gallery",
      "#transparency",
      "#privacy",
      "#terms",
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages
  .map(
    (page) => `  <url>
    <loc>${domain}/${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
