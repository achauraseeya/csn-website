const fs = require('fs');
let code = fs.readFileSync('src/components/HistorySection.tsx', 'utf8');

code = code.replace(
  "albums?: Album[];",
  "albums?: Album[];\n  membersList?: Member[];"
);

// We need to add the import UI for members
// Look for "Add Key Leader" button and add a dropdown
const addKeyLeaderStr = `<span>Add Key Leader</span>
                  </button>`;

const newAddKeyLeader = `<span>Add Key Leader</span>
                  </button>
                  {membersList && membersList.length > 0 && (
                    <select
                      className="px-3 py-2 bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold rounded-lg focus:outline-none"
                      onChange={(e) => {
                        const m = membersList.find(x => x.id === e.target.value);
                        if (m) {
                          const newLeader = {
                            id: m.id,
                            name: m.name,
                            role: m.role,
                            category: m.category,
                            address: m.address,
                            avatarUrl: m.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
                          };
                          setEditLeadership([...editLeadership, newLeader]);
                        }
                        e.target.value = "";
                      }}
                    >
                      <option value="">Import from Directory...</option>
                      {membersList.map(m => (
                        <option key={m.id} value={m.id}>{m.name.en} - {m.role.en}</option>
                      ))}
                    </select>
                  )}`;

code = code.replace(addKeyLeaderStr, newAddKeyLeader);

// Ensure we update HistorySectionProps parameter list
code = code.replace(
  "onDeleteNetwork,\n}: HistorySectionProps) {",
  "onDeleteNetwork,\n  membersList,\n}: HistorySectionProps) {"
);

fs.writeFileSync('src/components/HistorySection.tsx', code);
