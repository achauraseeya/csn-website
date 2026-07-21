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
}

export interface Notice {
  id: string;
  title: LocalizedString;
  content: LocalizedString;
  date: string;
  category: 'work' | 'notice' | 'press';
}

export interface CommunityEvent {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  date: string;
  time: string;
  location: LocalizedString;
  status: 'upcoming' | 'completed';
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
}

