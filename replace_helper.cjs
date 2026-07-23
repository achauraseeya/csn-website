const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = "const handleAddMemberNomination = async (newMember: Member) => {";
const endStr = "console.error('Failed to save member nomination:', e);\n    }\n  };";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newCode = `const handleAddMemberNomination = async (newMember: Member) => {
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

    if (!hasId && !displayMember.chapterId) {
      setMetrics((prev) => ({
        ...prev,
        membersRegistered: prev.membersRegistered + 1,
      }));
    }

    try {
      // Need members array from state. We use members from scope.
      const cleanList = members.filter(m => m.id !== displayMember.id);
      const fullList = [...cleanList, displayMember];
      const updatedList = await apiSave<Member>(
        '/api/members',
        'community_members.json',
        fullList,
        displayMember,
        \`Nominate/Update community member: \${displayMember.name.en}\`,
        getAuthHeaders()
      );
      setMembers(updatedList);
      try {
        localStorage.setItem('chaurasiya_members', JSON.stringify(updatedList));
      } catch (e) {}
    } catch (e) {
      console.error('Failed to save member nomination:', e);
    }
  };`;

  code = code.substring(0, startIndex) + newCode + code.substring(endIndex + endStr.length);
  
  // also add uploadImageToGithub to imports
  code = code.replace(
    "import { apiFetch, apiSave, apiDelete, saveFileToGithub, getGithubSettings } from './utils/githubDb';",
    "import { apiFetch, apiSave, apiDelete, saveFileToGithub, getGithubSettings, uploadImageToGithub } from './utils/githubDb';"
  );
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("Success");
} else {
  console.log("Not found.");
}
