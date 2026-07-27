(async () => {
  const folderId = "1ttMPCthjxnK6RB4-apZoHO-UioLdz62d";
  try {
    const url = `https://api.codetabs.com/v1/proxy?quest=` + encodeURIComponent(`https://drive.google.com/drive/folders/${folderId}`);
    const res = await fetch(url);
    const text = await res.text();
    console.log("codetabs:", text ? text.substring(0, 50) : "NO CONTENTS");
  } catch(e) { console.error(e.message); }
})();
