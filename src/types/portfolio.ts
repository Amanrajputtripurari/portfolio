export interface PersonalInfo {
  name: string;
  role: string;
  eyebrow: string;
  headline: string[];
  summary: string;
  location: string;
  email: string;
  available?: boolean;
  resumeUrl?: string;
}

export interface SkillItem {
  name: string;
  category: string;
  mark: string;
  color: string;
  ink?: string;
  summary: string;
  rating: number;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  url?: string;
}

export interface Project {
  id: string;
  number: string;
  name: string;
  description: string;
  technologies?: string[];
  role: string;
  year: string;
  accent: string;
  mock: "console" | "realtime" | "spatial";
  problem: string;
  outcome: string;
  approach?: string;
  features?: string[];
  image?: string;
  imageFull?: string;
  imageAlt?: string;
  liveUrl?: string;
  sourceUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
}

export interface SocialLink {
  label: string;
  url: string;
}
