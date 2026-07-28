export async function fetchDriveFolderImagesClient(folderId: string): Promise<{ files: Array<{ id: string; name: string; type: "photo" | "video" }> }> {
  if (!folderId) return { files: [] };

  try {
    // 1. Try relative API first (works when hosted together on AI Studio or a Node server)
    try {
      const res = await fetch(`/api/drive-folder-images?folderId=${folderId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.files) && data.files.length > 0) {
          return data;
        }
      }
    } catch (e) {
      console.warn("Relative backend fetch failed, trying external proxies...", e);
    }

    // 2. Try fetching via hosted AI Studio Cloud Run backends (with CORS enabled)
    // This allows static deployments (like GitHub Pages) to fetch drive folder contents reliably!
    const backendUrls = [
      `https://ais-dev-gcntazvnndte5whjvz5kvt-253948748508.asia-southeast1.run.app/api/drive-folder-images?folderId=${folderId}`,
      `https://ais-pre-gcntazvnndte5whjvz5kvt-253948748508.asia-southeast1.run.app/api/drive-folder-images?folderId=${folderId}`
    ];

    for (const backendUrl of backendUrls) {
      try {
        const res = await fetch(backendUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.files) && data.files.length > 0) {
            return data;
          }
        }
      } catch (e) {
        console.warn(`Hosted backend ${backendUrl} fetch failed, trying next...`, e);
      }
    }

    // 3. Try fetching via public CORS proxies
    const targetUrls = [
      `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`,
      `https://drive.google.com/drive/folders/${folderId}`
    ];
    
    for (const targetUrl of targetUrls) {
      const proxies = [
        {
          url: `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
          extractHtml: async (res: Response) => res.text()
        },
        {
          url: `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
          extractHtml: async (res: Response) => {
            const json = await res.json();
            return json?.contents || "";
          }
        },
        {
          url: `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
          extractHtml: async (res: Response) => res.text()
        },
        {
          url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
          extractHtml: async (res: Response) => res.text()
        }
      ];

      for (const proxy of proxies) {
        try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        
        const res = await fetch(proxy.url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) continue;

        const html = await proxy.extractHtml(res);
        if (!html || html.length < 500) continue;

        const files: Array<{ id: string; name: string; type: "photo" | "video" }> = [];
        const seenIds = new Set<string>();

        const patterns = [
          /data-id=["']([a-zA-Z0-9_-]{33})["'][^>]+?data-tooltip=["']([^"']+?)\s+(?:Image|Video)["']/gi,
          /\[\s*["']([a-zA-Z0-9_-]{25,45})["']\s*,\s*["']([^"']+?)["']\s*,\s*["'](image|video)\/([^"']+?)["']/gi,
          /\[\s*["']([a-zA-Z0-9_-]{25,45})["']\s*,\s*(?:null|\[)\s*,\s*["']([^"']+?)["']/gi,
          /\[\s*null\s*,\s*null\s*,\s*null\s*,\s*["']([a-zA-Z0-9_-]{25,45})["']\s*,\s*["']([^"']+?)["']/gi,
          /["']([a-zA-Z0-9_-]{28,45})["']\s*,\s*["']([^"']+?\.(?:jpg|jpeg|png|gif|webp|heic|mp4|mov|avi|webm))["']/gi
        ];

        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(html)) !== null) {
            const id = match[1];
            const name = match[2];
            const isVideo = /\.(mp4|mov|avi|webm)$/i.test(name) || (match[3] === "video") || match[0].includes('Video');
            const type = isVideo ? "video" : "photo";
            
            if (id !== folderId && !seenIds.has(id) && (pattern === patterns[0] || pattern === patterns[1] || (/\.(jpg|jpeg|png|gif|webp|heic|mp4|mov|avi|webm)$/i.test(name) || name.includes('IMG_') || name.includes('DSC_')))) {
              seenIds.add(id);
              files.push({ id, name, type });
            }
          }
        }

        // Fallback: search for any 33-character Google Drive file IDs in HTML
        if (files.length === 0) {
          const idPattern = /["']([a-zA-Z0-9_-]{33})["']/g;
          let match;
          while ((match = idPattern.exec(html)) !== null) {
            const id = match[1];
            if (id !== folderId && !seenIds.has(id) && !id.includes('drive') && !id.includes('google') && !id.includes('shared')) {
              seenIds.add(id);
              files.push({ id, name: `Photo ${files.length + 1}`, type: "photo" });
            }
          }
        }

        if (files.length > 0) {
          files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
          return { files };
        }
      } catch (err) {
        console.warn(`Proxy ${proxy.url} failed or timed out:`, err);
      }
    }
  }

    return { files: [] };
  } catch (err) {
    console.error("Client-side drive fetch failed", err);
    return { files: [] };
  }
}
