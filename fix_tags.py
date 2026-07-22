import sys
with open('src/components/HistorySection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("link: string;\n}", "link: string;\n  tags?: string[];\n}")

# Also replace the fetch logic to include tags.
# In fetchBloggerPosts:
old_fetch = "const link = entry.link.find((l: any) => l.rel === 'alternate')?.href || '#';"
new_fetch = """const link = entry.link.find((l: any) => l.rel === 'alternate')?.href || '#';
          const tags = entry.category ? entry.category.map((c: any) => c.term) : [];"""
content = content.replace(old_fetch, new_fetch)

old_return = "imageUrl,\n            link"
new_return = "imageUrl,\n            link,\n            tags"
content = content.replace(old_return, new_return)

# Also update the render block to show tags.
old_render = """<span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {post.author}</span>
                </div>
                <h4 className="text-xl font-bold text-teal-950 mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">"""
new_render = """<span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {post.author}</span>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.tags.slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <h4 className="text-xl font-bold text-teal-950 mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">"""
content = content.replace(old_render, new_render)

# Now update the dummy posts in communityData.ts
with open('src/data/communityData.ts', 'r', encoding='utf-8') as f:
    data_content = f.read()

old_posts = """export const blogPosts = [
  {
    id: 'b1',
    title: {
      en: 'The Heritage of Paan Cultivation in Nepal',
      ne: 'नेपालमा पान खेतीको सम्पदा',
    },
    excerpt: {
      en: 'Exploring the rich history and cultural significance of betel leaf farming within the Chaurasiya community.',
      ne: 'चौरसिया समुदायमा पान खेतीको समृद्ध इतिहास र सांस्कृतिक महत्त्वको अन्वेषण गर्दै।',
    },
    date: 'July 15, 2026',
    author: 'Admin',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'b2',
    title: {
      en: 'Youth Empowerment Initiative 2026',
      ne: 'युवा सशक्तिकरण पहल २०२६',
    },
    excerpt: {
      en: 'How our recent workshops are helping young minds develop modern skills while staying connected to their roots.',
      ne: 'हाम्रा हालैका कार्यशालाहरूले युवा मस्तिष्कहरूलाई उनीहरूको जरासँग जोडिएको आधुनिक सीपहरू विकास गर्न कसरी मद्दत गरिरहेका छन्।',
    },
    date: 'July 10, 2026',
    author: 'Community Coordinator',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'b3',
    title: {
      en: 'Health Camp Success Story',
      ne: 'स्वास्थ्य शिविर सफलताको कथा',
    },
    excerpt: {
      en: 'Over 500 community members received free health checkups and consultations in our latest medical camp.',
      ne: 'हाम्रो पछिल्लो चिकित्सा शिविरमा ५०० भन्दा बढी समुदायका सदस्यहरूले निःशुल्क स्वास्थ्य जाँच र परामर्श प्राप्त गरे।',
    },
    date: 'June 28, 2026',
    author: 'Health Committee',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
  },
];"""

new_posts = """export const blogPosts = [
  {
    id: 'b1',
    title: {
      en: 'The Heritage of Paan Cultivation in Nepal',
      ne: 'नेपालमा पान खेतीको सम्पदा',
    },
    excerpt: {
      en: 'Exploring the rich history and cultural significance of betel leaf farming within the Chaurasiya community.',
      ne: 'चौरसिया समुदायमा पान खेतीको समृद्ध इतिहास र सांस्कृतिक महत्त्वको अन्वेषण गर्दै।',
    },
    date: 'July 15, 2026',
    author: 'Admin',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
    link: 'https://chaurasiya-samaj-nepal.blogspot.com/',
    tags: ['Culture', 'Agriculture']
  },
  {
    id: 'b2',
    title: {
      en: 'Youth Empowerment Initiative 2026',
      ne: 'युवा सशक्तिकरण पहल २०२६',
    },
    excerpt: {
      en: 'How our recent workshops are helping young minds develop modern skills while staying connected to their roots.',
      ne: 'हाम्रा हालैका कार्यशालाहरूले युवा मस्तिष्कहरूलाई उनीहरूको जरासँग जोडिएको आधुनिक सीपहरू विकास गर्न कसरी मद्दत गरिरहेका छन्।',
    },
    date: 'July 10, 2026',
    author: 'Community Coordinator',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    link: 'https://chaurasiya-samaj-nepal.blogspot.com/',
    tags: ['Youth', 'Education']
  },
  {
    id: 'b3',
    title: {
      en: 'Health Camp Success Story',
      ne: 'स्वास्थ्य शिविर सफलताको कथा',
    },
    excerpt: {
      en: 'Over 500 community members received free health checkups and consultations in our latest medical camp.',
      ne: 'हाम्रो पछिल्लो चिकित्सा शिविरमा ५०० भन्दा बढी समुदायका सदस्यहरूले निःशुल्क स्वास्थ्य जाँच र परामर्श प्राप्त गरे।',
    },
    date: 'June 28, 2026',
    author: 'Health Committee',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    link: 'https://chaurasiya-samaj-nepal.blogspot.com/',
    tags: ['Health', 'Community']
  },
];"""

data_content = data_content.replace(old_posts, new_posts)

with open('src/components/HistorySection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
with open('src/data/communityData.ts', 'w', encoding='utf-8') as f:
    f.write(data_content)

print("Done")
