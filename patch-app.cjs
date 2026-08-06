const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `    const fetchAllGithubData = () => {
      syncCustomFormFieldsFromGithub().catch(() => {});
      syncMemberCategoriesFromGithub().catch(() => {});

      // Notices
      apiFetch<Notice[]>('/api/notices', 'community_notices.json', [])
        .then((serverNotices) => {
          if (Array.isArray(serverNotices) && serverNotices.length > 0) {
            setNotices((prev) => {
              const mergedMap = new Map<string, Notice>();
              serverNotices.forEach(n => mergedMap.set(n.id, n));
              initialNotices.forEach(n => {
                if (!mergedMap.has(n.id)) {
                  mergedMap.set(n.id, n);
                }
              });
              const finalNotices = Array.from(mergedMap.values());
              try { localStorage.setItem('chaurasiya_notices', JSON.stringify(finalNotices)); } catch (e) {}
              return finalNotices;
            });
          }
        })
        .catch(() => {});

      // Events
      apiFetch<CommunityEvent[]>('/api/events', 'community_events.json', [])
        .then((serverEvents) => {
          if (Array.isArray(serverEvents) && serverEvents.length > 0) {
            setEvents(serverEvents);
            try { localStorage.setItem('chaurasiya_events', JSON.stringify(serverEvents)); } catch (e) {}
          }
        })
        .catch(() => {});

      // Members
      apiFetch<Member[]>('/api/members', 'community_members.json', [])
        .then((serverMembers) => {
          if (Array.isArray(serverMembers) && serverMembers.length > 0) {
            setMembers(serverMembers);
            try { localStorage.setItem('chaurasiya_members', JSON.stringify(serverMembers)); } catch (e) {}
          }
        })
        .catch(() => {});

      // Documents
      apiFetch<Document[]>('/api/documents', 'community_documents.json', [])
        .then((serverDocs) => {
          if (Array.isArray(serverDocs) && serverDocs.length > 0) {
            setDocumentsList(serverDocs);
            try { localStorage.setItem('chaurasiya_documents', JSON.stringify(serverDocs)); } catch (e) {}
          }
        })
        .catch(() => {});

      // Site Texts
      apiFetch<SiteTexts>('/api/site-texts', 'site_texts.json', defaultSiteTexts)
        .then((data) => {
          if (data && typeof data === 'object') {
            setSiteTexts((prev) => ({ ...prev, ...data }));
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsInitializing(false);
        });

      // Networks
      apiFetch<NetworkBranch[]>('/api/networks', 'community_networks.json', initialNetworks)
        .then((serverNetworks) => {
          if (Array.isArray(serverNetworks) && serverNetworks.length > 0) {
            setNetworks(serverNetworks);
          }
        })
        .catch(() => {});

      // Journey Albums
      apiFetch<Album[]>('/api/albums', 'journey_albums.json', [])
        .then((serverAlbums) => {
          if (Array.isArray(serverAlbums) && serverAlbums.length > 0) {
            setAlbums((prev) => {
              const mergedMap = new Map<string, Album>();
              initialJourneyAlbums.forEach(a => mergedMap.set(a.id, a));
              serverAlbums.forEach((a) => mergedMap.set(a.id, a));
              return Array.from(mergedMap.values());
            });
          }
        })
        .catch(() => {});

      // Abhishek Profile
      apiFetch<any>('/api/abhishek-profile', 'abhishek_profile.json', null)
        .then((cloudProfile) => {
          if (cloudProfile && typeof cloudProfile === 'object' && cloudProfile.avatarUrl) {
            setAbhishekAvatar(cloudProfile.avatarUrl);
            try {
              const saved = localStorage.getItem('chaurasiya_abhishek_profile_data');
              const parsed = saved ? JSON.parse(saved) : {};
              parsed.avatarUrl = cloudProfile.avatarUrl;
              localStorage.setItem('chaurasiya_abhishek_profile_data', JSON.stringify(parsed));
            } catch (e) {}
          }
        })
        .catch(() => {});
    };`;

const replacement = `    const fetchAllGithubData = () => {
      const fetches = [];
      fetches.push(syncCustomFormFieldsFromGithub().catch(() => {}));
      fetches.push(syncMemberCategoriesFromGithub().catch(() => {}));

      // Notices
      fetches.push(apiFetch<Notice[]>('/api/notices', 'community_notices.json', [])
        .then((serverNotices) => {
          if (Array.isArray(serverNotices) && serverNotices.length > 0) {
            setNotices((prev) => {
              const mergedMap = new Map<string, Notice>();
              serverNotices.forEach(n => mergedMap.set(n.id, n));
              initialNotices.forEach(n => {
                if (!mergedMap.has(n.id)) {
                  mergedMap.set(n.id, n);
                }
              });
              const finalNotices = Array.from(mergedMap.values());
              try { localStorage.setItem('chaurasiya_notices', JSON.stringify(finalNotices)); } catch (e) {}
              return finalNotices;
            });
          }
        })
        .catch(() => {}));

      // Events
      fetches.push(apiFetch<CommunityEvent[]>('/api/events', 'community_events.json', [])
        .then((serverEvents) => {
          if (Array.isArray(serverEvents) && serverEvents.length > 0) {
            setEvents(serverEvents);
            try { localStorage.setItem('chaurasiya_events', JSON.stringify(serverEvents)); } catch (e) {}
          }
        })
        .catch(() => {}));

      // Members
      fetches.push(apiFetch<Member[]>('/api/members', 'community_members.json', [])
        .then((serverMembers) => {
          if (Array.isArray(serverMembers) && serverMembers.length > 0) {
            setMembers(serverMembers);
            try { localStorage.setItem('chaurasiya_members', JSON.stringify(serverMembers)); } catch (e) {}
          }
        })
        .catch(() => {}));

      // Documents
      fetches.push(apiFetch<Document[]>('/api/documents', 'community_documents.json', [])
        .then((serverDocs) => {
          if (Array.isArray(serverDocs) && serverDocs.length > 0) {
            setDocumentsList(serverDocs);
            try { localStorage.setItem('chaurasiya_documents', JSON.stringify(serverDocs)); } catch (e) {}
          }
        })
        .catch(() => {}));

      // Site Texts
      fetches.push(apiFetch<SiteTexts>('/api/site-texts', 'site_texts.json', defaultSiteTexts)
        .then((data) => {
          if (data && typeof data === 'object') {
            setSiteTexts((prev) => ({ ...prev, ...data }));
          }
        })
        .catch(() => {}));

      // Networks
      fetches.push(apiFetch<NetworkBranch[]>('/api/networks', 'community_networks.json', initialNetworks)
        .then((serverNetworks) => {
          if (Array.isArray(serverNetworks) && serverNetworks.length > 0) {
            setNetworks(serverNetworks);
          }
        })
        .catch(() => {}));

      // Journey Albums
      fetches.push(apiFetch<Album[]>('/api/albums', 'journey_albums.json', [])
        .then((serverAlbums) => {
          if (Array.isArray(serverAlbums) && serverAlbums.length > 0) {
            setAlbums((prev) => {
              const mergedMap = new Map<string, Album>();
              initialJourneyAlbums.forEach(a => mergedMap.set(a.id, a));
              serverAlbums.forEach((a) => mergedMap.set(a.id, a));
              return Array.from(mergedMap.values());
            });
          }
        })
        .catch(() => {}));

      // Abhishek Profile
      fetches.push(apiFetch<any>('/api/abhishek-profile', 'abhishek_profile.json', null)
        .then((cloudProfile) => {
          if (cloudProfile && typeof cloudProfile === 'object' && cloudProfile.avatarUrl) {
            setAbhishekAvatar(cloudProfile.avatarUrl);
            try {
              const saved = localStorage.getItem('chaurasiya_abhishek_profile_data');
              const parsed = saved ? JSON.parse(saved) : {};
              parsed.avatarUrl = cloudProfile.avatarUrl;
              localStorage.setItem('chaurasiya_abhishek_profile_data', JSON.stringify(parsed));
            } catch (e) {}
          }
        })
        .catch(() => {}));
        
      Promise.allSettled(fetches).finally(() => {
        setIsInitializing(false);
      });
    };`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log('Replaced successfully');
