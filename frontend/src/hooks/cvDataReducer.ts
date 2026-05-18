/**
 * CV Schema Reducer — pure function for all CV data mutations.
 * Replaces scattered setCvData(prev => ...) calls with typed actions.
 * Fully testable without mounting React.
 */
import type { CVSchema, ExperienceItem, EducationItem, ProjectItem, SkillGroup, CertificateItem, LanguageItem, PersonalInfo } from '../types';
import { DEFAULT_CV } from '../constants';

// ── Action union type ──────────────────────────────────────────────────────

export type CVAction =
  // Personal Info & Summary
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<PersonalInfo> }
  | { type: 'SET_SUMMARY'; payload: string }
  | { type: 'SET_AVATAR'; payload: string }
  | { type: 'DELETE_AVATAR' }
  // Experience
  | { type: 'ADD_EXPERIENCE' }
  | { type: 'UPDATE_EXPERIENCE'; id: string; payload: Partial<ExperienceItem> }
  | { type: 'REMOVE_EXPERIENCE'; id: string }
  // Education
  | { type: 'ADD_EDUCATION' }
  | { type: 'UPDATE_EDUCATION'; id: string; payload: Partial<EducationItem> }
  | { type: 'REMOVE_EDUCATION'; id: string }
  // Projects
  | { type: 'ADD_PROJECT' }
  | { type: 'UPDATE_PROJECT'; id: string; payload: Partial<ProjectItem> }
  | { type: 'REMOVE_PROJECT'; id: string }
  // Skills
  | { type: 'ADD_SKILL_GROUP' }
  | { type: 'UPDATE_SKILL_GROUP'; id: string; payload: Partial<SkillGroup> }
  | { type: 'REMOVE_SKILL_GROUP'; id: string }
  // Certificates
  | { type: 'ADD_CERTIFICATE' }
  | { type: 'UPDATE_CERTIFICATE'; id: string; payload: Partial<CertificateItem> }
  | { type: 'REMOVE_CERTIFICATE'; id: string }
  // Languages
  | { type: 'ADD_LANGUAGE' }
  | { type: 'UPDATE_LANGUAGE'; id: string; payload: Partial<LanguageItem> }
  | { type: 'REMOVE_LANGUAGE'; id: string }
  // Presentation settings
  | { type: 'SET_THEME_COLOR'; payload: string }
  | { type: 'SET_FONT_FAMILY'; payload: string }
  | { type: 'SET_LAYOUT_DENSITY'; payload: 'compact' | 'normal' | 'comfortable' }
  | { type: 'SET_PAGE_LAYOUT'; payload: 'single' | 'multi' }
  | { type: 'SET_SECTION_ORDER'; payload: string[] }
  // Bulk operations
  | { type: 'LOAD_CV'; payload: CVSchema }
  | { type: 'CLEAR_ALL'; preserveSettings?: { themeColor?: string; fontFamily?: string } };

// ── Helper ─────────────────────────────────────────────────────────────────

function updateById<T extends { id: string }>(
  arr: T[],
  id: string,
  payload: Partial<T>
): T[] {
  return arr.map(item => (item.id === id ? { ...item, ...payload } : item));
}

function removeById<T extends { id: string }>(arr: T[], id: string): T[] {
  return arr.filter(item => item.id !== id);
}

// ── Reducer ────────────────────────────────────────────────────────────────

export function cvDataReducer(state: CVSchema, action: CVAction): CVSchema {
  switch (action.type) {
    // ── Personal ──────────────────────────────────────────────────────────
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
    case 'SET_AVATAR':
      return { ...state, personalInfo: { ...state.personalInfo, avatar: action.payload } };
    case 'DELETE_AVATAR':
      return { ...state, personalInfo: { ...state.personalInfo, avatar: undefined } };

    // ── Experience ────────────────────────────────────────────────────────
    case 'ADD_EXPERIENCE':
      return {
        ...state,
        experience: [
          ...state.experience,
          { id: `exp-${Date.now()}`, company: '', position: '', startDate: '', description: '' },
        ],
      };
    case 'UPDATE_EXPERIENCE':
      return { ...state, experience: updateById(state.experience, action.id, action.payload) };
    case 'REMOVE_EXPERIENCE':
      return { ...state, experience: removeById(state.experience, action.id) };

    // ── Education ─────────────────────────────────────────────────────────
    case 'ADD_EDUCATION':
      return {
        ...state,
        education: [
          ...state.education,
          { id: `edu-${Date.now()}`, institution: '', degree: '', startDate: '' },
        ],
      };
    case 'UPDATE_EDUCATION':
      return { ...state, education: updateById(state.education, action.id, action.payload) };
    case 'REMOVE_EDUCATION':
      return { ...state, education: removeById(state.education, action.id) };

    // ── Projects ──────────────────────────────────────────────────────────
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [
          ...state.projects,
          { id: `proj-${Date.now()}`, name: '', role: '', startDate: '', description: '', technologies: [] },
        ],
      };
    case 'UPDATE_PROJECT':
      return { ...state, projects: updateById(state.projects, action.id, action.payload) };
    case 'REMOVE_PROJECT':
      return { ...state, projects: removeById(state.projects, action.id) };

    // ── Skills ────────────────────────────────────────────────────────────
    case 'ADD_SKILL_GROUP':
      return {
        ...state,
        skills: [...state.skills, { id: `skill-${Date.now()}`, category: '', skills: [] }],
      };
    case 'UPDATE_SKILL_GROUP':
      return { ...state, skills: updateById(state.skills, action.id, action.payload) };
    case 'REMOVE_SKILL_GROUP':
      return { ...state, skills: removeById(state.skills, action.id) };

    // ── Certificates ──────────────────────────────────────────────────────
    case 'ADD_CERTIFICATE':
      return {
        ...state,
        certificates: [...state.certificates, { id: `cert-${Date.now()}`, name: '', issuer: '', date: '' }],
      };
    case 'UPDATE_CERTIFICATE':
      return { ...state, certificates: updateById(state.certificates, action.id, action.payload) };
    case 'REMOVE_CERTIFICATE':
      return { ...state, certificates: removeById(state.certificates, action.id) };

    // ── Languages ─────────────────────────────────────────────────────────
    case 'ADD_LANGUAGE':
      return {
        ...state,
        languages: [...state.languages, { id: `lang-${Date.now()}`, name: '', level: '' }],
      };
    case 'UPDATE_LANGUAGE':
      return { ...state, languages: updateById(state.languages, action.id, action.payload) };
    case 'REMOVE_LANGUAGE':
      return { ...state, languages: removeById(state.languages, action.id) };

    // ── Presentation settings ─────────────────────────────────────────────
    case 'SET_THEME_COLOR':
      return { ...state, themeColor: action.payload };
    case 'SET_FONT_FAMILY':
      return { ...state, fontFamily: action.payload };
    case 'SET_LAYOUT_DENSITY':
      return { ...state, layoutDensity: action.payload };
    case 'SET_PAGE_LAYOUT':
      return { ...state, pageLayout: action.payload };
    case 'SET_SECTION_ORDER':
      return { ...state, sectionOrder: action.payload };

    // ── Bulk ──────────────────────────────────────────────────────────────
    case 'LOAD_CV':
      return action.payload;
    case 'CLEAR_ALL':
      return {
        ...DEFAULT_CV,
        personalInfo: {
          fullName: '', title: '', email: '', phone: '',
          location: '', website: '', github: '', linkedin: '', avatar: undefined,
        },
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: [],
        certificates: [],
        languages: [],
        themeColor: action.preserveSettings?.themeColor ?? state.themeColor ?? 'indigo',
        fontFamily: action.preserveSettings?.fontFamily ?? state.fontFamily ?? 'inter',
      };

    default:
      return state;
  }
}
