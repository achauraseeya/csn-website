(async () => {
  const folderId = "1ttMPCthjxnK6RB4-apZoHO-UioLdz62d";
  const url = `https://corsproxy.io/?url=` + encodeURIComponent(`https://drive.google.com/drive/folders/${folderId}`);
  const res = await fetch(url);
  const text = await res.text();
  console.log(text.substring(0, 100));
})();
