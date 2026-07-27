import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.js";
import { matrimonialProfiles, volunteerApplications, membershipApplications, newsletterSubscribers } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

async function startServer() {
  const app = express();
  app.use(cors());
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
    const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

    app.get("/api/drive-folder-images", async (req, res) => {
      const { folderId } = req.query;
      if (!folderId || typeof folderId !== "string") {
        return res.status(400).json({ error: "folderId is required" });
      }

      try {
        // Check cache
        const cached = driveCache.get(folderId);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          return res.json({ files: cached.files, fromCache: true });
        }

        const urls = [
          `https://drive.google.com/drive/folders/${folderId}`
        ];

        let html = "";
        let success = false;

        for (const url of urls) {
          try {
            const response = await fetch(url, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
              }
            });

            if (response.ok) {
              html = await response.text();
              if (html.length > 1000) {
                success = true;
                break;
              }
            }
          } catch (e) {
            console.error(`Fetch attempt failed for ${url}`);
          }
        }

        if (!success) {
          return res.status(500).json({ error: "Could not reach Google Drive folders. Ensure the folder is public." });
        }

        const files: Array<{ id: string; name: string; type: "photo" | "video" }> = [];
        const seenIds = new Set<string>();

        // Pattern 1: Tooltip format (data-id="id" ... data-tooltip="name Image")
        const tooltipPattern = /data-id=["']([a-zA-Z0-9_-]{33})["'][^>]+?data-tooltip=["']([^"']+?)\s+(?:Image|Video)["']/gi;
        let match;
        while ((match = tooltipPattern.exec(html)) !== null) {
          const id = match[1];
          const name = match[2];
          const type = match[0].includes('Video') ? "video" : "photo";
          if (id !== folderId && !seenIds.has(id)) {
            seenIds.add(id);
            files.push({ id, name, type });
          }
        }

        // Pattern 2: JSON data in AF_initDataCallback or similar structured blocks
        // Matches: ["id", "name", ..., "mimeType"]
        const jsonPattern = /\[\s*["']([a-zA-Z0-9_-]{25,45})["']\s*,\s*["']([^"']+?)["']\s*,\s*["'](image|video)\/([^"']+?)["']/gi;
        while ((match = jsonPattern.exec(html)) !== null) {
          const id = match[1];
          const name = match[2];
          const type = match[3] === "video" ? "video" : "photo";
          if (id !== folderId && !seenIds.has(id)) {
            seenIds.add(id);
            files.push({ id, name, type });
          }
        }

        // Pattern 3: Search for data chunks in the drive-viewer format
        // Usually matches patterns like ["id",null,"name",...] or ["id", ["name", ...]]
        const viewerPattern = /\[\s*["']([a-zA-Z0-9_-]{25,45})["']\s*,\s*(?:null|\[)\s*,\s*["']([^"']+?)["']/gi;
        while ((match = viewerPattern.exec(html)) !== null) {
          const id = match[1];
          const name = match[2];
          if (id !== folderId && !seenIds.has(id) && (/\.(jpg|jpeg|png|gif|webp|heic|mp4|mov|avi|webm)$/i.test(name) || name.includes('IMG_') || name.includes('DSC_'))) {
            seenIds.add(id);
            const isVideo = /\.(mp4|mov|avi|webm)$/i.test(name);
            files.push({ id, name, type: isVideo ? "video" : "photo" });
          }
        }

        // Pattern 4: Look for the specific "item" array in Drive bootstrap data
        // Matches: [null, null, null, "id", "name", ...]
        const bootstrapPattern = /\[\s*null\s*,\s*null\s*,\s*null\s*,\s*["']([a-zA-Z0-9_-]{25,45})["']\s*,\s*["']([^"']+?)["']/gi;
        while ((match = bootstrapPattern.exec(html)) !== null) {
          const id = match[1];
          const name = match[2];
          if (id !== folderId && !seenIds.has(id)) {
            seenIds.add(id);
            const isVideo = /\.(mp4|mov|avi|webm)$/i.test(name);
            files.push({ id, name, type: isVideo ? "video" : "photo" });
          }
        }

        // Pattern 5: Fallback for different HTML structures (matches ID and filename with extension)
        if (files.length < 5) {
          const fallbackPattern = /["']([a-zA-Z0-9_-]{28,45})["']\s*,\s*["']([^"']+?\.(?:jpg|jpeg|png|gif|webp|heic|mp4|mov|avi|webm))["']/gi;
          while ((match = fallbackPattern.exec(html)) !== null) {
            const id = match[1];
            const name = match[2];
            const isVideo = /\.(mp4|mov|avi|webm)$/i.test(name);
            if (id !== folderId && !seenIds.has(id)) {
              seenIds.add(id);
              files.push({ id, name, type: isVideo ? "video" : "photo" });
            }
          }
        }

        // Pattern 6: Deep scan for any strings that look like Drive IDs (33 chars) if still empty
        if (files.length === 0) {
          const idPattern = /["']([a-zA-Z0-9_-]{33})["']/g;
          while ((match = idPattern.exec(html)) !== null) {
            const id = match[1];
            // Exclude known non-file IDs
            if (id !== folderId && !seenIds.has(id) && !id.includes('drive') && !id.includes('google') && !id.includes('shared')) {
              seenIds.add(id);
              files.push({ id, name: `Media Item ${files.length + 1}`, type: "photo" });
            }
          }
        }

        // Final sort
        files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        if (files.length > 0) {
          driveCache.set(folderId, { files, timestamp: Date.now() });
        }
        return res.json({ files, count: files.length });
      } catch (err) {
        return res.status(500).json({ error: "Internal server error during folder fetch" });
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
