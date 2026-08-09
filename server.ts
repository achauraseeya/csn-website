import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.js";
import { matrimonialProfiles, volunteerApplications, membershipApplications, newsletterSubscribers } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

async function startServer() {
  console.log('Starting Chaurasiya Samaj Nepal Server initialization...');
  const app = express();
  app.use(cors());
  const PORT = 3000;

  // Add a dedicated health check endpoint before everything else
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  app.use(express.json({ limit: '50mb' }));

  console.log('Ensuring directories exist...');
  const DATA_DIR = path.join(process.cwd(), 'data_store');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Ensure uploads directory exists
  const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  // Run GitHub sync in background on server startup to get the freshest live-site data & images
  try {
    const syncScriptPath = path.join(process.cwd(), 'sync_github_data.cjs');
    if (fs.existsSync(syncScriptPath)) {
      console.log('Spawning startup GitHub Sync...');
      exec(`node "${syncScriptPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Startup GitHub Sync Error: ${error.message}`);
          return;
        }
        console.log(`Startup GitHub Sync completed successfully.\n${stdout}`);
      });
    }
  } catch (err) {
    console.warn('Could not launch startup GitHub Sync:', err);
  }

  // --- Entire Repository GitHub Sync Endpoint ---
  const handleRepoSync = (req: express.Request, res: express.Response) => {
    try {
      const syncScriptPath = path.join(process.cwd(), 'sync_github_data.cjs');
      if (!fs.existsSync(syncScriptPath)) {
        return res.status(404).json({ error: "Sync script sync_github_data.cjs not found" });
      }

      const token = req.body?.token || req.query?.token || "";
      console.log('Manual Trigger: Syncing Entire GitHub Repository (Files, Folders & Photos)...');
      exec(`node "${syncScriptPath}"`, {
        env: {
          ...process.env,
          GITHUB_PAT: token || process.env.GITHUB_PAT || process.env.GITHUB_TOKEN || ""
        }
      }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Manual GitHub Sync Error: ${error.message}`);
          return res.status(500).json({ error: "Failed to sync repository", details: error.message });
        }
        console.log(`Manual GitHub Sync completed:\n${stdout}`);

        // Clear all .local_only files so that local state is aligned with GitHub's master copy
        try {
          if (fs.existsSync(DATA_DIR)) {
            const files = fs.readdirSync(DATA_DIR);
            for (const file of files) {
              if (file.endsWith('.local_only')) {
                fs.unlinkSync(path.join(DATA_DIR, file));
              }
            }
          }
        } catch (e) {
          console.warn('Failed to clear local_only flags:', e);
        }

        return res.json({
          success: true,
          message: "Entire repository synced successfully! All files, folders, and photos up to date.",
          output: stdout,
          timestamp: new Date().toISOString()
        });
      });
    } catch (err: any) {
      console.error("Repository Sync Endpoint Failed:", err);
      return res.status(500).json({ error: "Server error during repository sync" });
    }
  };

  app.get("/api/sync-github-repo", handleRepoSync);
  app.post("/api/sync-github-repo", handleRepoSync);

  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/uploads', express.static(path.join(DATA_DIR, 'uploads')));
  app.use('/assets/uploads', express.static(UPLOADS_DIR));
  app.use('/assets/uploads', express.static(path.join(DATA_DIR, 'uploads')));

  // --- Universal Image Upload Endpoint ---
  app.post("/api/upload-image", (req, res) => {
    try {
      const { fileName, base64Data } = req.body;
      if (!fileName || !base64Data) {
        return res.status(400).json({ error: "fileName and base64Data are required" });
      }

      const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const cleanBase64 = base64Data.split(',')[1] || base64Data;
      const buffer = Buffer.from(cleanBase64, 'base64');

      const uploadDirs = [
        path.join(process.cwd(), 'public', 'uploads'),
        path.join(DATA_DIR, 'uploads'),
        path.join(process.cwd(), 'dist', 'public', 'uploads'),
        path.join(process.cwd(), 'dist', 'uploads')
      ];

      for (const dirPath of uploadDirs) {
        try {
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }
          fs.writeFileSync(path.join(dirPath, safeName), buffer);
        } catch (e) {}
      }

      return res.json({ success: true, url: `/uploads/${safeName}`, fileName: safeName });
    } catch (err) {
      console.error("Image upload failed:", err);
      return res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // --- Secure Anonymous GitHub Repository Proxy ---
  // Masks the raw GitHub source, preventing public XML code or users from discovering the architecture,
  // username, repository, or PAT, while serving correct Content-Type headers for XML, JSON, JS, CSS, and images.
  app.get("/api/proxy/*all", async (req, res) => {
    try {
      const pathParam = req.params.all;
      const filePath = Array.isArray(pathParam) ? pathParam.join('/') : (pathParam || "");
      if (!filePath) {
        return res.status(400).json({ error: "Missing file path" });
      }

      // Block path traversal/security attempts
      if (filePath.includes('..') || filePath.startsWith('/') || filePath.includes('//')) {
        return res.status(400).json({ error: "Invalid path format" });
      }

      const username = "achauraseeya";
      const repo = "csn-website";
      const branch = "main";
      
      const gitUrl = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${filePath}`;

      // Set headers for CORS and anonymity
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Cache-Control", "public, max-age=1800"); // Cache for 30 minutes

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

      let gitRes;
      try {
        gitRes = await fetch(gitUrl, { signal: controller.signal });
      } catch (fetchErr) {
        console.warn(`Secure Proxy fetch error for ${filePath}, attempting local fallback:`, fetchErr);
      }
      clearTimeout(timeoutId);

      if (!gitRes || !gitRes.ok) {
        // Fallback to local files if available
        const localPossiblePaths = [
          path.join(DATA_DIR, filePath),
          path.join(process.cwd(), 'public', filePath),
          path.join(process.cwd(), filePath)
        ];

        for (const localPath of localPossiblePaths) {
          if (fs.existsSync(localPath)) {
            const ext = path.extname(localPath).toLowerCase();
            let contentType = "application/octet-stream";
            if (ext === ".json") contentType = "application/json; charset=utf-8";
            else if (ext === ".js") contentType = "application/javascript; charset=utf-8";
            else if (ext === ".css") contentType = "text/css; charset=utf-8";
            else if (ext === ".xml") contentType = "application/xml; charset=utf-8";
            else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
            else if (ext === ".png") contentType = "image/png";
            else if (ext === ".svg") contentType = "image/svg+xml";

            res.setHeader("Content-Type", contentType);
            const fileStream = fs.createReadStream(localPath);
            return fileStream.pipe(res);
          }
        }
        return res.status(gitRes ? gitRes.status : 404).send(`Failed to load proxied asset`);
      }

      // Map appropriate Content-Type depending on file extension
      const ext = path.extname(filePath).toLowerCase();
      let contentType = gitRes.headers.get("content-type") || "application/octet-stream";
      
      if (ext === ".json") contentType = "application/json; charset=utf-8";
      else if (ext === ".js") contentType = "application/javascript; charset=utf-8";
      else if (ext === ".css") contentType = "text/css; charset=utf-8";
      else if (ext === ".xml") contentType = "application/xml; charset=utf-8";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".png") contentType = "image/png";
      else if (ext === ".svg") contentType = "image/svg+xml";

      res.setHeader("Content-Type", contentType);

      const arrayBuffer = await gitRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return res.send(buffer);

    } catch (err) {
      console.error("Secure Proxy Error:", err);
      return res.status(500).send("Error fetching or parsing the proxied asset");
    }
  });

  // --- Universal Pure JSON Site Data Persistence Endpoints (GitHub-backed) ---
  app.get("/api/site-data/:key", async (req, res) => {
    try {
      const key = req.params.key.replace(/[^a-zA-Z0-9_-]/g, '');
      const fileName = `${key}.json`;
      const possiblePaths = [
        path.join(DATA_DIR, fileName),
        path.join(process.cwd(), 'public', fileName),
        path.join(process.cwd(), fileName)
      ];

      // Check if we have a very recently saved local file (within 5 minutes)
      // or if it was modified locally via POST (flagged with .local_only)
      const isLocalOnly = fs.existsSync(path.join(DATA_DIR, `${key}.local_only`));
      let isRecentlyModified = false;
      let localContent: string | null = null;

      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          try {
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf-8');
            // Parse to verify it's valid JSON
            JSON.parse(content); 
            localContent = content;

            if (Date.now() - stats.mtimeMs < 5 * 60 * 1000) {
              isRecentlyModified = true;
            }
            break;
          } catch (e) {
            // Bad JSON or stats error, continue searching
          }
        }
      }

      // If local file was saved recently or is flagged as local-only, serve it directly to prevent race conditions with GitHub CDN caching
      if ((isRecentlyModified || isLocalOnly) && localContent) {
        return res.json(JSON.parse(localContent));
      }

      // Otherwise, try to fetch the freshest copy from the live GitHub repository
      try {
        const username = "achauraseeya";
        const repo = "csn-website";
        const branch = "main";
        const gitUrl = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${fileName}?t=${Date.now()}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout
        const gitRes = await fetch(gitUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (gitRes.ok) {
          const freshText = await gitRes.text();
          const parsed = JSON.parse(freshText);

          // Save the freshly fetched data from GitHub back to the local paths so they are in sync
          const pathsToUpdate = [
            path.join(DATA_DIR, fileName),
            path.join(process.cwd(), 'public', fileName),
            path.join(process.cwd(), fileName),
            path.join(process.cwd(), 'dist', fileName),
            path.join(process.cwd(), 'dist', 'public', fileName)
          ];

          for (const filePath of pathsToUpdate) {
            try {
              const dir = path.dirname(filePath);
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }
              fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
            } catch (e) {}
          }

          return res.json(parsed);
        }
      } catch (gitErr) {
        console.warn(`GitHub fresh fetch failed for ${fileName}, falling back to local storage:`, gitErr);
      }

      // If GitHub is down/rate-limited or doesn't have the file, fall back to local file
      if (localContent) {
        return res.json(JSON.parse(localContent));
      }

      return res.status(404).json({ error: "Site data key not found" });
    } catch (err) {
      console.error("Failed to read site data:", err);
      return res.status(500).json({ error: "Failed to read site data" });
    }
  });

  app.post("/api/site-data/:key", (req, res) => {
    try {
      const key = req.params.key.replace(/[^a-zA-Z0-9_-]/g, '');
      const content = JSON.stringify(req.body, null, 2);
      const pathsToUpdate = [
        path.join(DATA_DIR, `${key}.json`),
        path.join(process.cwd(), 'public', `${key}.json`),
        path.join(process.cwd(), `${key}.json`),
        path.join(process.cwd(), 'dist', `${key}.json`),
        path.join(process.cwd(), 'dist', 'public', `${key}.json`)
      ];

      for (const filePath of pathsToUpdate) {
        try {
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(filePath, content, 'utf-8');
        } catch (e) {}
      }

      // Write .local_only file to mark it as locally modified
      try {
        fs.writeFileSync(path.join(DATA_DIR, `${key}.local_only`), String(Date.now()), 'utf-8');
      } catch (e) {}

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
          `https://drive.google.com/drive/folders/${folderId}`,
          `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`
        ];

        const files: Array<{ id: string; name: string; type: "photo" | "video" }> = [];
        const seenIds = new Set<string>();

        for (const url of urls) {
          try {
            const response = await fetch(url, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
              }
            });

            if (!response.ok) continue;

            const html = await response.text();
            if (!html || html.length < 500) continue;

            // Pattern 1: Tooltip format (data-id="id" ... data-tooltip="name Image")
            const tooltipPattern = /data-id=["']([a-zA-Z0-9_-]{28,45})["'][^>]+?data-tooltip=["']([^"']+?)\s+(?:Image|Video)["']/gi;
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

            // Pattern 4: Bootstrap data format
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

            // Pattern 5: Fallback for ID and filename
            if (files.length < 3) {
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
                if (id !== folderId && !seenIds.has(id) && !id.startsWith('drive') && !id.startsWith('google') && !id.includes('shared')) {
                  seenIds.add(id);
                  files.push({ id, name: `Media Item ${files.length + 1}`, type: "photo" });
                }
              }
            }

            // If we found files, stop checking fallback URLs
            if (files.length > 0) {
              break;
            }
          } catch (e) {
            console.error(`Fetch attempt failed for ${url}`, e);
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
    console.log('Initializing Vite Dev Server Middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    console.log('Vite Dev Server Middleware ready.');
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
