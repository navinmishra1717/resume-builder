import { useState, useEffect, useCallback } from 'react';
import type {
  ResumeData,
  PersonalInfo,
  EducationEntry,
  ExperienceEntry,
  SkillCategory,
  ProjectEntry,
  CertificationEntry,
  HobbyEntry,
  TemplateId,
  SectionVisibility,
} from '@/types/resume';

const STORAGE_KEY = 'resume_builder_data';

const defaultPersonalInfo: PersonalInfo = {
  name: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  summary: '',
};

const defaultSectionVisibility: SectionVisibility = {
  personalInfo: true,
  summary: true,
  education: true,
  experience: true,
  skills: true,
  projects: true,
  certifications: true,
  hobbies: false,
};

const defaultData: ResumeData = {
  personalInfo: defaultPersonalInfo,
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  hobbies: [],
  selectedTemplate: 'minimal',
  sectionVisibility: defaultSectionVisibility,
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function loadFromStorage(): ResumeData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultData, ...parsed, sectionVisibility: { ...defaultSectionVisibility, ...parsed.sectionVisibility } };
    }
  } catch {
    // ignore parse errors
  }
  return defaultData;
}

function saveToStorage(data: ResumeData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function useResumeStore() {
  const [data, setData] = useState<ResumeData>(() => loadFromStorage());

  // Auto-save on change
  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, ...info } }));
  }, []);

  // Education
  const addEducation = useCallback(() => {
    const entry: EducationEntry = { id: generateId(), degree: '', institution: '', location: '', startYear: '', endYear: '', gpa: '', description: '' };
    setData(prev => ({ ...prev, education: [...prev.education, entry] }));
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<EducationEntry>) => {
    setData(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, ...updates } : e) }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  }, []);

  // Experience
  const addExperience = useCallback(() => {
    const entry: ExperienceEntry = { id: generateId(), role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' };
    setData(prev => ({ ...prev, experience: [...prev.experience, entry] }));
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<ExperienceEntry>) => {
    setData(prev => ({ ...prev, experience: prev.experience.map(e => e.id === id ? { ...e, ...updates } : e) }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  }, []);

  // Skills
  const addSkillCategory = useCallback(() => {
    const entry: SkillCategory = { id: generateId(), skill: '', expertiseLevel: '' };
    setData(prev => ({ ...prev, skills: [...prev.skills, entry] }));
  }, []);

  const updateSkillCategory = useCallback((id: string, updates: Partial<SkillCategory>) => {
    setData(prev => ({ ...prev, skills: prev.skills.map(e => e.id === id ? { ...e, ...updates } : e) }));
  }, []);

  const removeSkillCategory = useCallback((id: string) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter(e => e.id !== id) }));
  }, []);

  // Projects
  const addProject = useCallback(() => {
    const entry: ProjectEntry = { id: generateId(), title: '', description: '', link: '', technologies: '' };
    setData(prev => ({ ...prev, projects: [...prev.projects, entry] }));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<ProjectEntry>) => {
    setData(prev => ({ ...prev, projects: prev.projects.map(e => e.id === id ? { ...e, ...updates } : e) }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(e => e.id !== id) }));
  }, []);

  // Certifications
  const addCertification = useCallback(() => {
    const entry: CertificationEntry = { id: generateId(), name: '', issuer: '', date: '', link: '' };
    setData(prev => ({ ...prev, certifications: [...prev.certifications, entry] }));
  }, []);

  const updateCertification = useCallback((id: string, updates: Partial<CertificationEntry>) => {
    setData(prev => ({ ...prev, certifications: prev.certifications.map(e => e.id === id ? { ...e, ...updates } : e) }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setData(prev => ({ ...prev, certifications: prev.certifications.filter(e => e.id !== id) }));
  }, []);

  // Hobbies
  const addHobby = useCallback(() => {
    const entry: HobbyEntry = { id: generateId(), description: '' };
    setData(prev => ({ ...prev, hobbies: [...prev.hobbies, entry] }));
  }, []);

  const updateHobby = useCallback((id: string, updates: Partial<HobbyEntry>) => {
    setData(prev => ({ ...prev, hobbies: prev.hobbies.map(e => e.id === id ? { ...e, ...updates } : e) }));
  }, []);

  const removeHobby = useCallback((id: string) => {
    setData(prev => ({ ...prev, hobbies: prev.hobbies.filter(e => e.id !== id) }));
  }, []);

  // Template
  const setTemplate = useCallback((template: TemplateId) => {
    setData(prev => ({ ...prev, selectedTemplate: template }));
  }, []);

  // Section visibility
  const toggleSection = useCallback((section: keyof SectionVisibility) => {
    setData(prev => ({
      ...prev,
      sectionVisibility: { ...prev.sectionVisibility, [section]: !prev.sectionVisibility[section] },
    }));
  }, []);

  // Reset
  const resetData = useCallback(() => {
    setData(defaultData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    data,
    updatePersonalInfo,
    addEducation, updateEducation, removeEducation,
    addExperience, updateExperience, removeExperience,
    addSkillCategory, updateSkillCategory, removeSkillCategory,
    addProject, updateProject, removeProject,
    addCertification, updateCertification, removeCertification,
    addHobby, updateHobby, removeHobby,
    setTemplate,
    toggleSection,
    resetData,
  };
}

export type ResumeStore = ReturnType<typeof useResumeStore>;
