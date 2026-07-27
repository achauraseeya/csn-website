(async () => {
    const targetUrl = `https://drive.google.com/drive/folders/1ttMPCthjxnK6RB4-apZoHO-UioLdz62d`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl);
    const data = await res.json();
    console.log("length:", data.contents.length);
})();
