/**
 * CV Schema Reducer — pure function for all CV data mutations.
 * Implements real-time Structural Mirroring for bilingual editing.
 * Language Agnostic Version: original vs translated.
 */
import type { CVSchema, ExperienceItem, EducationItem, ProjectItem, SkillGroup, CertificateItem, LanguageItem, PersonalInfo } from '../types';
import { DEFAULT_CV } from '../constants';

// ── Action union type ──────────────────────────────────────────────────────

export type CVActionBase =
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
  | { type: 'SET_SECTION_GAP'; payload: number }
  | { type: 'SET_PAGE_PADDING'; payload: number }
  | { type: 'SET_PAGE_LAYOUT'; payload: 'single' | 'multi' }
  | { type: 'SET_SECTION_ORDER'; payload: string[] }
  | { type: 'SET_THEME_MODE'; payload: 'light' | 'dark' | 'auto' }
  // Custom Sections
  | { type: 'ADD_CUSTOM_SECTION'; payload?: { title?: string; layoutStyle?: 'timeline' | 'cards' | 'text' } }
  | { type: 'UPDATE_CUSTOM_SECTION'; id: string; payload: Partial<{ title: string; layoutStyle: 'timeline' | 'cards' | 'text' }> }
  | { type: 'REMOVE_CUSTOM_SECTION'; id: string }
  | { type: 'ADD_CUSTOM_SECTION_ITEM'; sectionId: string }
  | { type: 'UPDATE_CUSTOM_SECTION_ITEM'; sectionId: string; itemId: string; payload: Partial<{ title: string; subtitle: string; date: string; url: string; description: string }> }
  | { type: 'REMOVE_CUSTOM_SECTION_ITEM'; sectionId: string; itemId: string }
  // Translation support
  | { type: 'SET_TRANSLATED_DATA'; payload: CVSchema }
  // Bulk operations
  | { type: 'LOAD_CV'; payload: CVSchema }
  | { type: 'CLEAR_ALL'; preserveSettings?: { themeColor?: string; fontFamily?: string } };

export type CVAction = CVActionBase & { _mode?: 'original' | 'translated' };

// ── Helper ─────────────────────────────────────────────────────────────────

function updateById<T extends { id: string }>(arr: T[], id: string, payload: Partial<T>): T[] {
  return arr.map(item => (item.id === id ? { ...item, ...payload } : item));
}

function removeById<T extends { id: string }>(arr: T[], id: string): T[] {
  return arr.filter(item => item.id !== id);
}

// Extract content vs structural fields
const CONTENT_FIELDS: Record<string, string[]> = {
  personalInfo: ['title'],
  experience: ['position', 'description'],
  education: ['degree', 'description'],
  projects: ['role', 'description'],
  skills: ['category'],
  certificates: ['name', 'issuer']
};

function splitPayload(entityType: string, payload: any) {
  const content: any = {};
  const structural: any = {};
  const contentKeys = CONTENT_FIELDS[entityType] || [];
  
  for (const key of Object.keys(payload)) {
    if (contentKeys.includes(key)) {
      content[key] = payload[key];
    } else {
      structural[key] = payload[key];
    }
  }
  return { content, structural };
}

// ── Reducer ────────────────────────────────────────────────────────────────

export function cvDataReducer(state: CVSchema, action: CVAction): CVSchema {
  const mode = action._mode || 'original';
  const isOriginal = mode === 'original';
  
  // Helper to dynamically get the translated language key (e.g., 'en' or 'vi')
  // We assume there is only 1 target translation at a time for simplicity.
  const getTransLangKey = (): string | null => {
    if (!state.translated_data) return null;
    const keys = Object.keys(state.translated_data);
    return keys.length > 0 ? keys[0] : null;
  };

  const getTransTarget = () => {
    const key = getTransLangKey();
    if (!key || !state.translated_data) return null;
    return state.translated_data[key];
  };

  const syncTrans = (updater: (transState: CVSchema) => CVSchema) => {
    const key = getTransLangKey();
    const transState = getTransTarget();
    if (!key || !transState || !state.translated_data) return state.translated_data;
    return {
      ...state.translated_data,
      [key]: updater(transState)
    };
  };

  switch (action.type) {
    // ── Translation ───────────────────────────────────────────────────────
    case 'SET_TRANSLATED_DATA':
      return {
        ...action.payload
      };

    // ── Personal ──────────────────────────────────────────────────────────
    case 'UPDATE_PERSONAL_INFO': {
      const { content, structural } = splitPayload('personalInfo', action.payload);
      
      let newState = { ...state };
      
      if (isOriginal) {
        // Original mode: update both content and structural in primary
        newState.personalInfo = { ...newState.personalInfo, ...action.payload };
        // Sync structural to Translated
        if (Object.keys(structural).length > 0) {
          newState.translated_data = syncTrans(trans => ({
            ...trans, personalInfo: { ...trans.personalInfo, ...structural }
          }));
        }
      } else {
        // Translated mode: update content in Translated, sync structural to BOTH
        newState.personalInfo = { ...newState.personalInfo, ...structural };
        newState.translated_data = syncTrans(trans => ({
          ...trans, personalInfo: { ...trans.personalInfo, ...structural, ...content }
        }));
      }
      return newState;
    }

    case 'SET_SUMMARY': {
      if (isOriginal) return { ...state, summary: action.payload };
      return { ...state, translated_data: syncTrans(trans => ({ ...trans, summary: action.payload })) };
    }

    case 'SET_AVATAR':
      return { 
        ...state, 
        personalInfo: { ...state.personalInfo, avatar: action.payload },
        translated_data: syncTrans(trans => ({ ...trans, personalInfo: { ...trans.personalInfo, avatar: action.payload } }))
      };
      
    case 'DELETE_AVATAR':
      return { 
        ...state, 
        personalInfo: { ...state.personalInfo, avatar: undefined },
        translated_data: syncTrans(trans => ({ ...trans, personalInfo: { ...trans.personalInfo, avatar: undefined } }))
      };

    // ── Experience ────────────────────────────────────────────────────────
    case 'ADD_EXPERIENCE': {
      const newItem = { id: `exp-${Date.now()}`, company: '', position: '', startDate: '', description: '' };
      return {
        ...state,
        experience: [...state.experience, newItem],
        translated_data: syncTrans(trans => ({ ...trans, experience: [...trans.experience, { ...newItem }] }))
      };
    }
    case 'UPDATE_EXPERIENCE': {
      const { content, structural } = splitPayload('experience', action.payload);
      if (isOriginal) {
        return {
          ...state,
          experience: updateById(state.experience, action.id, action.payload),
          translated_data: syncTrans(trans => ({ ...trans, experience: updateById(trans.experience, action.id, structural) }))
        };
      } else {
        return {
          ...state,
          experience: updateById(state.experience, action.id, structural),
          translated_data: syncTrans(trans => ({ ...trans, experience: updateById(trans.experience, action.id, { ...structural, ...content }) }))
        };
      }
    }
    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        experience: removeById(state.experience, action.id),
        translated_data: syncTrans(trans => ({ ...trans, experience: removeById(trans.experience, action.id) }))
      };

    // ── Education ─────────────────────────────────────────────────────────
    case 'ADD_EDUCATION': {
      const newItem = { id: `edu-${Date.now()}`, institution: '', degree: '', startDate: '' };
      return {
        ...state,
        education: [...state.education, newItem],
        translated_data: syncTrans(trans => ({ ...trans, education: [...trans.education, { ...newItem }] }))
      };
    }
    case 'UPDATE_EDUCATION': {
      const { content, structural } = splitPayload('education', action.payload);
      if (isOriginal) {
        return {
          ...state,
          education: updateById(state.education, action.id, action.payload),
          translated_data: syncTrans(trans => ({ ...trans, education: updateById(trans.education, action.id, structural) }))
        };
      } else {
        return {
          ...state,
          education: updateById(state.education, action.id, structural),
          translated_data: syncTrans(trans => ({ ...trans, education: updateById(trans.education, action.id, { ...structural, ...content }) }))
        };
      }
    }
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        education: removeById(state.education, action.id),
        translated_data: syncTrans(trans => ({ ...trans, education: removeById(trans.education, action.id) }))
      };

    // ── Projects ──────────────────────────────────────────────────────────
    case 'ADD_PROJECT': {
      const newItem = { id: `proj-${Date.now()}`, name: '', role: '', startDate: '', description: '', technologies: [] };
      return {
        ...state,
        projects: [...state.projects, newItem],
        translated_data: syncTrans(trans => ({ ...trans, projects: [...trans.projects, { ...newItem }] }))
      };
    }
    case 'UPDATE_PROJECT': {
      const { content, structural } = splitPayload('projects', action.payload);
      if (isOriginal) {
        return {
          ...state,
          projects: updateById(state.projects, action.id, action.payload),
          translated_data: syncTrans(trans => ({ ...trans, projects: updateById(trans.projects, action.id, structural) }))
        };
      } else {
        return {
          ...state,
          projects: updateById(state.projects, action.id, structural),
          translated_data: syncTrans(trans => ({ ...trans, projects: updateById(trans.projects, action.id, { ...structural, ...content }) }))
        };
      }
    }
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: removeById(state.projects, action.id),
        translated_data: syncTrans(trans => ({ ...trans, projects: removeById(trans.projects, action.id) }))
      };

    // ── Skills ────────────────────────────────────────────────────────────
    case 'ADD_SKILL_GROUP': {
      const newItem = { id: `skill-${Date.now()}`, category: '', skills: [] };
      return {
        ...state,
        skills: [...state.skills, newItem],
        translated_data: syncTrans(trans => ({ ...trans, skills: [...trans.skills, { ...newItem }] }))
      };
    }
    case 'UPDATE_SKILL_GROUP': {
      const { content, structural } = splitPayload('skills', action.payload);
      if (isOriginal) {
        return {
          ...state,
          skills: updateById(state.skills, action.id, action.payload),
          translated_data: syncTrans(trans => ({ ...trans, skills: updateById(trans.skills, action.id, structural) }))
        };
      } else {
        return {
          ...state,
          skills: updateById(state.skills, action.id, structural),
          translated_data: syncTrans(trans => ({ ...trans, skills: updateById(trans.skills, action.id, { ...structural, ...content }) }))
        };
      }
    }
    case 'REMOVE_SKILL_GROUP':
      return {
        ...state,
        skills: removeById(state.skills, action.id),
        translated_data: syncTrans(trans => ({ ...trans, skills: removeById(trans.skills, action.id) }))
      };

    // ── Certificates ──────────────────────────────────────────────────────
    case 'ADD_CERTIFICATE': {
      const newItem = { id: `cert-${Date.now()}`, name: '', issuer: '', date: '' };
      return {
        ...state,
        certificates: [...state.certificates, newItem],
        translated_data: syncTrans(trans => ({ ...trans, certificates: [...trans.certificates, { ...newItem }] }))
      };
    }
    case 'UPDATE_CERTIFICATE': {
      const { content, structural } = splitPayload('certificates', action.payload);
      if (isOriginal) {
        return {
          ...state,
          certificates: updateById(state.certificates, action.id, action.payload),
          translated_data: syncTrans(trans => ({ ...trans, certificates: updateById(trans.certificates, action.id, structural) }))
        };
      } else {
        return {
          ...state,
          certificates: updateById(state.certificates, action.id, structural),
          translated_data: syncTrans(trans => ({ ...trans, certificates: updateById(trans.certificates, action.id, { ...structural, ...content }) }))
        };
      }
    }
    case 'REMOVE_CERTIFICATE':
      return {
        ...state,
        certificates: removeById(state.certificates, action.id),
        translated_data: syncTrans(trans => ({ ...trans, certificates: removeById(trans.certificates, action.id) }))
      };

    // ── Languages (Fully Structural - mirrored completely) ────────────────
    case 'ADD_LANGUAGE': {
      const newItem = { id: `lang-${Date.now()}`, name: '', level: '' };
      return {
        ...state,
        languages: [...state.languages, newItem],
        translated_data: syncTrans(trans => ({ ...trans, languages: [...trans.languages, { ...newItem }] }))
      };
    }
    case 'UPDATE_LANGUAGE':
      return { 
        ...state, 
        languages: updateById(state.languages, action.id, action.payload),
        translated_data: syncTrans(trans => ({ ...trans, languages: updateById(trans.languages, action.id, action.payload) }))
      };
    case 'REMOVE_LANGUAGE':
      return {
        ...state,
        languages: removeById(state.languages, action.id),
        translated_data: syncTrans(trans => ({ ...trans, languages: removeById(trans.languages, action.id) }))
      };

    // ── Presentation settings (Structural - mirrored completely) ──────────
    case 'SET_THEME_COLOR':
      return { ...state, themeColor: action.payload, translated_data: syncTrans(trans => ({ ...trans, themeColor: action.payload })) };
    case 'SET_FONT_FAMILY':
      return { ...state, fontFamily: action.payload, translated_data: syncTrans(trans => ({ ...trans, fontFamily: action.payload })) };
    case 'SET_LAYOUT_DENSITY':
      return { ...state, layoutDensity: action.payload, translated_data: syncTrans(trans => ({ ...trans, layoutDensity: action.payload })) };
    case 'SET_SECTION_GAP':
      return { ...state, sectionGap: action.payload, translated_data: syncTrans(trans => ({ ...trans, sectionGap: action.payload })) };
    case 'SET_PAGE_PADDING':
      return { ...state, pagePadding: action.payload, translated_data: syncTrans(trans => ({ ...trans, pagePadding: action.payload })) };
    case 'SET_PAGE_LAYOUT':
      return { ...state, pageLayout: action.payload, translated_data: syncTrans(trans => ({ ...trans, pageLayout: action.payload })) };
    case 'SET_SECTION_ORDER':
      return { ...state, sectionOrder: action.payload, translated_data: syncTrans(trans => ({ ...trans, sectionOrder: action.payload })) };
    case 'SET_THEME_MODE':
      return { ...state, themeMode: action.payload, translated_data: syncTrans(trans => ({ ...trans, themeMode: action.payload })) };

    // ── Custom Sections ──────────────────────────────────────────────────
    case 'ADD_CUSTOM_SECTION': {
      const sectionCount = (state.customSections?.length || 0) + 1;
      const newSec = {
        id: `custom-${Date.now()}`,
        title: `Custom Section ${sectionCount}`,
        layoutStyle: 'timeline' as const,
        items: []
      };
      const customSections = [...(state.customSections || []), newSec];
      return {
        ...state,
        customSections,
        translated_data: syncTrans(trans => ({
          ...trans,
          customSections: [...(trans.customSections || []), { ...newSec }]
        }))
      };
    }
    case 'UPDATE_CUSTOM_SECTION': {
      const customSections = (state.customSections || []).map(sec => 
        sec.id === action.id ? { ...sec, ...action.payload } : sec
      );
      return {
        ...state,
        customSections,
        translated_data: syncTrans(trans => ({
          ...trans,
          customSections: (trans.customSections || []).map(sec => 
            sec.id === action.id ? { ...sec, ...action.payload } : sec
          )
        }))
      };
    }
    case 'REMOVE_CUSTOM_SECTION': {
      const customSections = (state.customSections || []).filter(sec => sec.id !== action.id);
      return {
        ...state,
        customSections,
        translated_data: syncTrans(trans => ({
          ...state,
          customSections: (trans.customSections || []).filter(sec => sec.id !== action.id)
        }))
      };
    }
    case 'ADD_CUSTOM_SECTION_ITEM': {
      const newItem = {
        id: `citem-${Date.now()}`,
        title: '',
        subtitle: '',
        date: '',
        url: '',
        description: ''
      };
      const customSections = (state.customSections || []).map(sec => {
        if (sec.id === action.sectionId) {
          return { ...sec, items: [...sec.items, newItem] };
        }
        return sec;
      });
      return {
        ...state,
        customSections,
        translated_data: syncTrans(trans => ({
          ...trans,
          customSections: (trans.customSections || []).map(sec => {
            if (sec.id === action.sectionId) {
              return { ...sec, items: [...sec.items, { ...newItem }] };
            }
            return sec;
          })
        }))
      };
    }
    case 'UPDATE_CUSTOM_SECTION_ITEM': {
      const customSections = (state.customSections || []).map(sec => {
        if (sec.id === action.sectionId) {
          const items = sec.items.map(item => 
            item.id === action.itemId ? { ...item, ...action.payload } : item
          );
          return { ...sec, items };
        }
        return sec;
      });
      const { title, subtitle, date, url, description } = action.payload;
      const content = { title, subtitle, description };
      const structural = { date, url };
      
      if (isOriginal) {
        return {
          ...state,
          customSections,
          translated_data: syncTrans(trans => ({
            ...trans,
            customSections: (trans.customSections || []).map(sec => {
              if (sec.id === action.sectionId) {
                const items = sec.items.map(item => 
                  item.id === action.itemId ? { ...item, ...structural } : item
                );
                return { ...sec, items };
              }
              return sec;
            })
          }))
        };
      } else {
        return {
          ...state,
          customSections: (state.customSections || []).map(sec => {
            if (sec.id === action.sectionId) {
              const items = sec.items.map(item => 
                item.id === action.itemId ? { ...item, ...structural } : item
              );
              return { ...sec, items };
            }
            return sec;
          }),
          translated_data: syncTrans(trans => ({
            ...trans,
            customSections: (trans.customSections || []).map(sec => {
              if (sec.id === action.sectionId) {
                const items = sec.items.map(item => 
                  item.id === action.itemId ? { ...item, ...structural, ...content } : item
                );
                return { ...sec, items };
              }
              return sec;
            })
          }))
        };
      }
    }
    case 'REMOVE_CUSTOM_SECTION_ITEM': {
      const customSections = (state.customSections || []).map(sec => {
        if (sec.id === action.sectionId) {
          const items = sec.items.filter(item => item.id !== action.itemId);
          return { ...sec, items };
        }
        return sec;
      });
      return {
        ...state,
        customSections,
        translated_data: syncTrans(trans => ({
          ...trans,
          customSections: (trans.customSections || []).map(sec => {
            if (sec.id === action.sectionId) {
              const items = sec.items.filter(item => item.id !== action.itemId);
              return { ...sec, items };
            }
            return sec;
          })
        }))
      };
    }

    // ── Bulk ──────────────────────────────────────────────────────────────
    case 'LOAD_CV':
      return action.payload;
    case 'CLEAR_ALL':
      const cleared = {
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
        translated_data: undefined // Reset translation on clear all
      };
      return cleared;

    default:
      return state;
  }
}
