export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  gpa: string;
  description: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface SkillCategory {
  id: string;
  skill: string;
  expertiseLevel: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  link: string;
  technologies: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface HobbyEntry {
  id: string;
  description: string;
}

export interface LinksEntry {
  id: string;
  name: string;
  link: string;
}

export type TemplateId = "minimal" | "modern" | "creative" | "classic";

export interface SectionVisibility {
  personalInfo: boolean;
  summary: boolean;
  education: boolean;
  experience: boolean;
  skills: boolean;
  projects: boolean;
  certifications: boolean;
  hobbies: boolean;
  links: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: SkillCategory[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  hobbies: HobbyEntry[];
  links: LinksEntry[];
  selectedTemplate: TemplateId;
  sectionVisibility: SectionVisibility;
}
