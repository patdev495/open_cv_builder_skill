export interface PersonalInfo {
  fullName: string;
  title?: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  avatar?: string;
}

export interface ExperienceItem {
  id: string; // Client-side helper for react key and dynamic list management
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface CVSchema {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  certificates: CertificateItem[];
  languages: LanguageItem[];
  themeColor?: string;
  fontFamily?: string;
  layoutDensity?: 'compact' | 'normal' | 'comfortable';
  pageLayout?: 'single' | 'multi';
}

export interface CVResponse {
  slug: string;
  template: string;
  cv_data: CVSchema;
}
