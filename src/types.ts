export type Language = 'en' | 'ne';

export interface LocalizedString {
  en: string;
  ne: string;
}

export interface Member {
  id: string;
  name: LocalizedString;
  role: LocalizedString; // e.g., Chief, Secretary, Advisor, Member
  category: 'chief' | 'secretary' | 'board' | 'general';
  phone?: string;
  email?: string;
  address: LocalizedString;
  bio?: LocalizedString;
  avatarUrl?: string;
  photoBase64?: string;
  photoName?: string;
  chapterId?: string; // Links member to a specific chapter/sister org
}

export interface Notice {
  id: string;
  title: LocalizedString;
  content: LocalizedString;
  date: string;
  category: 'work' | 'notice' | 'press';
  driveFileUrl?: string;
  fileUrl?: string;
  chapterId?: string; // Links notice to a specific chapter/sister org
}

export interface CommunityEvent {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  date: string;
  time: string;
  location: LocalizedString;
  status: 'upcoming' | 'completed';
  chapterId?: string; // Links event to a specific chapter/sister org
}

export interface GalleryItem {
  id: string;
  title: LocalizedString;
  imageUrl: string;
  description: LocalizedString;
}

export interface ImpactStat {
  id: string;
  value: string;
  label: LocalizedString;
  desc: LocalizedString;
}

export interface AbhishekProfile {
  name: string;
  title: string;
  bio: LocalizedString;
  education: string;
  skills: string[];
  github?: string;
  email: string;
  phone?: string;
}

export interface AnalyticsMetric {
  pageViews: number;
  newsletterSubscribers: number;
  donationsReceived: number;
  membersRegistered: number;
  xmlDownloads: number;
  buttonClicks: Record<string, number>;
}

export interface Project {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  status: 'Ongoing' | 'Completed';
  category: Record<Language, string>;
  imageUrl: string;
}

export interface Document {
  id: string;
  title: Record<Language, string>;
  category: Record<Language, string>;
  year: string;
  type: string;
  size: string;
  driveUrl?: string;
  downloadUrl?: string;
}

export type MediaType = 'photo' | 'video';

export interface AlbumMediaItem {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  type: MediaType;
  url: string; // Direct image/mp4 link, Google Drive link, YouTube embed link
  thumbnailUrl?: string; // Optional custom poster for videos or photos
  date?: string;
  location?: LocalizedString;
}

export interface Album {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  coverUrl: string;
  date: string;
  location: LocalizedString;
  tags: string[];
  driveFolderUrl?: string;
  driveFolderId?: string;
  mediaItems: AlbumMediaItem[];
  chapterId?: string; // Links album to a specific chapter/sister org
}

export interface SiteTexts {
  heroTitleEn: string;
  heroTitleNe: string;
  heroSubEn: string;
  heroSubNe: string;
  introEn: string;
  introNe: string;
  paanStoryTitleEn: string;
  paanStoryTitleNe: string;
  paanStoryEn: string;
  paanStoryNe: string;
  missionTitleEn: string;
  missionTitleNe: string;
  missionEn: string;
  missionNe: string;
  privacyEn: string;
  privacyNe: string;
  termsEn: string;
  termsNe: string;
  sliderBadgeEn: string;
  sliderBadgeNe: string;
  logoTextEn: string;
  logoTextNe: string;
  logoSubEn: string;
  logoSubNe: string;
  logoUrl: string;
  taglineEn: string;
  taglineNe: string;
  impactHeaderEn: string;
  impactHeaderNe: string;
  footerAboutEn: string;
  footerAboutNe: string;
  footerAddressEn: string;
  footerAddressNe: string;
  footerPhone: string;
  footerEmail: string;
  socialFb: string;
  socialTw: string;
  socialIg: string;
  heroImagesJson: string;
  impactStatsJson?: string;
  leadershipIdsJson?: string;
}

export interface NetworkBranch {
  id: string;
  type: 'chapter' | 'sister';
  name: LocalizedString;
  description: LocalizedString;
  location: LocalizedString;
  established?: string;
  establishedDate?: string;
  avatarUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  heroImagesJson?: string;
  impactStatsJson?: string;
}



