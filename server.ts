import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.js";
import { matrimonialProfiles, volunteerApplications, membershipApplications, newsletterSubscribers } from "./src/db/schema.js";
import { eq } from "drizzle-orm";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes

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
