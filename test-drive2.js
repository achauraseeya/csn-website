const folderId = '1ttMPCthjxnK6RB4-apZoHO-UioLdz62d';
async function run() {
const fetchRes = await fetch(`https://drive.google.com/drive/folders/${folderId}`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
          }
        });
const html = await fetchRes.text();

const tooltipPattern = /data-id=["']([a-zA-Z0-9_-]{33})["'][^>]+?data-tooltip=["']([^"']+?)\s+(?:Image|Video)["']/gi;
let match;
let count = 0;
while ((match = tooltipPattern.exec(html)) !== null) { count++; console.log(match[1]); }
console.log("Count:", count);
}
run();
