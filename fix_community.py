import sys

with open('src/data/communityData.ts', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if line.startswith('export const blogPosts = ['):
        # Only skip the FIRST occurrence.
        # But wait, how do I know it's the first?
        pass

# Let's just do a regex replace or manual chunking.
content = "".join(lines)
idx1 = content.find('export const blogPosts = [')
idx2 = content.find('export const designerProfile')

if idx1 != -1 and idx2 != -1:
    before = content[:idx1]
    after = content[idx2:]
    
    impact_stats = """export const impactStats: ImpactStat[] = [
  {
    id: 's1',
    value: '500+',
    label: { en: 'Families Supported', ne: 'परिवारहरूलाई सहयोग' },
    desc: { en: 'Through our agriculture and welfare programs.', ne: 'हाम्रा कृषि र कल्याणकारी कार्यक्रमहरू मार्फत।' },
  },
  {
    id: 's2',
    value: '10,000+',
    label: { en: 'Trees Planted', ne: 'वृक्षारोपण' },
    desc: { en: 'Promoting eco-friendly farming.', ne: 'वातावरण मैत्री खेतीलाई बढावा दिँदै।' }, 
  },
  {
    id: 's3',
    value: '350+',
    label: { en: 'Scholarships Disbursed', ne: 'वितरित छात्रवृत्तिहरू' },
    desc: { en: 'Allowing talented students to complete their technical degrees.', ne: 'प्रतिभाशाली विद्यार्थीहरूलाई प्राविधिक डिग्री पूरा गर्न सहयोग।' },
  },
  {
    id: 's4',
    value: '25+',
    label: { en: 'Free Health Camps', ne: 'नि:शुल्क स्वास्थ्य शिविर' },
    desc: { en: 'Conducted in remote villages of Parsa, Bara, and Rautahat districts.', ne: 'पर्सा, बारा र रौतहट जिल्लाका दुर्गम गाउँहरूमा सञ्चालन।' },
  },
];

"""
    new_content = before + impact_stats + after
    with open('src/data/communityData.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
        print("Success")
