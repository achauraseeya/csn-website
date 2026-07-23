const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleAddMemberNomination = async \([\s\S]*?console\.error\('Failed to sync member to GitHub', err\);\s*\}\s*\};/;
const newFunction = `const handleAddMemberNomination = async (newMember: Member) => {
    const hasId = !!newMember.id && !newMember.id.startsWith('temp_new_');
    const memberWithId: Member = hasId ? newMember : {
      ...newMember,
      id: \`m-nom-\${Date.now()}\`,
    };

    let displayMember = { ...memberWithId };

    if (displayMember.photoBase64 && displayMember.photoName) {
      try {
        const fileName = \`\${Date.now()}_\${displayMember.photoName.replace(/[^a-z0-9.]/gi, '_')}\`;
        const uploadedUrl = await uploadImageToGithub(fileName, displayMember.photoBase64, \`Upload photo for member \${displayMember.name.en}\`);
        displayMember.avatarUrl = uploadedUrl;
        displayMember.photoBase64 = undefined;
        displayMember.photoName = undefined;
      } catch (err) {
        console.error("Failed to upload image to Github", err);
        if (!displayMember.avatarUrl) {
          displayMember.avatarUrl = displayMember.photoBase64;
        }
      }
    } else if (!displayMember.avatarUrl && displayMember.photoBase64) {
      displayMember.avatarUrl = displayMember.photoBase64;
    }

    setMembers((prev) => {
      const exists = prev.some((m) => m.id === displayMember.id);
      const updated = exists
        ? prev.map((m) => (m.id === displayMember.id ? displayMember : m))
        : [...prev, displayMember];
      try {
        localStorage.setItem('chaurasiya_members', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (!hasId) {
      setMetrics((prev) => ({
        ...prev,
        membersRegistered: prev.membersRegistered + 1,
      }));
    }

    try {
      const cleanList = members.filter(m => m.id !== displayMember.id);
      const fullList = [...cleanList, displayMember];
      const updatedList = await apiSave<Member>(
        '/api/members',
        'community_members.json',
        fullList,
        displayMember,
        \`Update member: \${displayMember.name.en}\`
      );
      setMembers(updatedList);
    } catch (err) {
      console.error('Failed to sync member to GitHub', err);
    }
  };`;

if (regex.test(code)) {
    code = code.replace(regex, newFunction);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Success");
} else {
    console.log("Regex didn't match.");
}
