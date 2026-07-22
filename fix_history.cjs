const fs = require('fs');
const content = fs.readFileSync('src/components/HistorySection.tsx', 'utf8');

// Insert interface
let newContent = content.replace(
  'export default function HistorySection',
  `interface BloggerPost {
  id: string;
  title: { en: string; ne: string };
  excerpt: { en: string; ne: string };
  date: string;
  author: string;
  imageUrl: string;
  link: string;
}

export default function HistorySection`
);

// Insert state and effect
newContent = newContent.replace(
  'const [viewPdfNoticeId, setViewPdfNoticeId] = useState<string | null>(null);',
  `const [viewPdfNoticeId, setViewPdfNoticeId] = useState<string | null>(null);
  const [livePosts, setLivePosts] = useState<BloggerPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchBloggerPosts = async () => {
      try {
        // Assume default feeds path if running inside Blogger
        const feedUrl = '/feeds/posts/default?alt=json';
        const res = await fetch(feedUrl);
        if (!res.ok) throw new Error('Not on blogger');
        
        const data = await res.json();
        const entries = data.feed.entry || [];
        
        const parsedPosts = entries.slice(0, 3).map((entry: any) => {
          const contentStr = entry.content?.$t || entry.summary?.$t || '';
          
          // Extract first image
          const imgMatch = contentStr.match(/<img[^>]+src="([^">]+)"/i);
          const imageUrl = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800';
          
          // Clean HTML for excerpt
          const stripped = contentStr.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + '...';
          
          const link = entry.link.find((l: any) => l.rel === 'alternate')?.href || '#';
          
          return {
            id: entry.id.$t,
            title: {
              en: entry.title.$t,
              ne: entry.title.$t
            },
            excerpt: {
              en: stripped,
              ne: stripped
            },
            date: new Date(entry.published.$t).toLocaleDateString(),
            author: entry.author?.[0]?.name?.$t || 'Admin',
            imageUrl,
            link
          };
        });
        
        if (parsedPosts.length > 0) {
          setLivePosts(parsedPosts);
        } else {
          setLivePosts(blogPosts as unknown as BloggerPost[]);
        }
      } catch (err) {
        // Fallback for localhost / github pages viewing
        setLivePosts(blogPosts as unknown as BloggerPost[]);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchBloggerPosts();
  }, []);`
);

// Replace mapping
const oldMapping = `{blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title[lang]} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs font-bold text-teal-600 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {post.author}</span>
                </div>
                <h4 className="text-xl font-bold text-teal-950 mb-2 line-clamp-2">
                  {post.title[lang]}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt[lang]}
                </p>
                <button 
                  onClick={() => {
                    onTrackAction(\`Read blog post: \${post.title.en}\`);
                    alert(lang === 'en' ? 'Full blog posts are available on our official Blogger site. Please visit our Blogger portal.' : 'पूर्ण ब्लग पोस्टहरू हाम्रो आधिकारिक ब्लगर साइटमा उपलब्ध छन्। कृपया हाम्रो ब्लगर पोर्टल भ्रमण गर्नुहोस्।');
                  }}
                  className="text-sm font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 transition-colors"
                >
                  {lang === 'en' ? 'Read More' : 'थप पढ्नुहोस्'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}`;

const newMapping = `{loadingPosts ? (
            <div className="col-span-1 md:col-span-3 text-center py-12 text-teal-600 font-bold animate-pulse">
              {lang === 'en' ? 'Loading latest posts from Blogger...' : 'ब्लगरबाट पछिल्लो पोस्टहरू लोड गर्दैछ...'}
            </div>
          ) : livePosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-teal-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title[lang] || post.title.en} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between text-xs font-bold text-teal-600 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {post.author}</span>
                </div>
                <h4 className="text-xl font-bold text-teal-950 mb-2 line-clamp-2">
                  {post.title[lang] || post.title.en}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                  {post.excerpt[lang] || post.excerpt.en}
                </p>
                <a 
                  href={post.link}
                  target="_self"
                  onClick={(e) => {
                    if (post.link === '#') {
                      e.preventDefault();
                      alert(lang === 'en' ? 'Full blog posts are available on our official Blogger site.' : 'पूर्ण ब्लग पोस्टहरू हाम्रो आधिकारिक ब्लगर साइटमा उपलब्ध छन्।');
                    } else {
                      onTrackAction(\`Read live blog post: \${post.title.en}\`);
                    }
                  }}
                  className="text-sm font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 transition-colors mt-auto"
                >
                  {lang === 'en' ? 'Read More' : 'थप पढ्नुहोस्'} <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}`;

newContent = newContent.replace(oldMapping, newMapping);

fs.writeFileSync('src/components/HistorySection.tsx', newContent, 'utf8');
