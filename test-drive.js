const id = '1ttMPCthjxnK6RB4-apZoHO-UioLdz62d';
const url = `https://drive.google.com/drive/folders/${id}`;

async function run() {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    }
  });
  const html = await res.text();
  
  const regex = /data-id=["']([a-zA-Z0-9_-]{33})["'][^>]+?data-tooltip=["']([^"']+?)\s+(?:Image|Video)["']/gi;
  let match;
  let count = 0;
  while ((match = regex.exec(html)) !== null) {
      console.log(match[1], match[2]);
      count++;
  }
  console.log("Count:", count);
}
run();
