import { describe, it, expect } from 'vitest';
import { cvDataReducer } from './cvDataReducer';
import type { CVSchema } from '../types';
import { DEFAULT_CV } from '../constants';

const MOCK_CV: CVSchema = {
  ...DEFAULT_CV,
  personalInfo: {
    fullName: 'Test Developer',
    title: 'Senior Engineer',
    email: 'test@example.com',
    phone: '123456789',
    location: 'Saigon, VN',
    website: 'https://test.dev',
    github: 'testdev',
    linkedin: 'testdev-linkedin',
  },
  summary: 'A highly experienced coder.',
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certificates: [],
  languages: [],
  themeColor: 'emerald',
  fontFamily: 'outfit',
};

describe('cvDataReducer', () => {
  it('should handle UPDATE_PERSONAL_INFO action correctly', () => {
    const action = {
      type: 'UPDATE_PERSONAL_INFO' as const,
      payload: { fullName: 'Updated Developer', title: 'Tech Lead' },
    };
    const newState = cvDataReducer(MOCK_CV, action);
    expect(newState.personalInfo.fullName).toBe('Updated Developer');
    expect(newState.personalInfo.title).toBe('Tech Lead');
    expect(newState.personalInfo.email).toBe('test@example.com'); // untouched
  });

  it('should handle SET_SUMMARY action correctly', () => {
    const action = {
      type: 'SET_SUMMARY' as const,
      payload: 'New professional summary content.',
    };
    const newState = cvDataReducer(MOCK_CV, action);
    expect(newState.summary).toBe('New professional summary content.');
  });

  it('should handle SET_AVATAR and DELETE_AVATAR actions correctly', () => {
    const setAction = {
      type: 'SET_AVATAR' as const,
      payload: 'data:image/png;base64,fakeimage',
    };
    let state = cvDataReducer(MOCK_CV, setAction);
    expect(state.personalInfo.avatar).toBe('data:image/png;base64,fakeimage');

    const deleteAction = { type: 'DELETE_AVATAR' as const };
    state = cvDataReducer(state, deleteAction);
    expect(state.personalInfo.avatar).toBeUndefined();
  });

  it('should handle experience actions (ADD, UPDATE, REMOVE) correctly', () => {
    // 1. ADD_EXPERIENCE
    let state = cvDataReducer(MOCK_CV, { type: 'ADD_EXPERIENCE' as const });
    expect(state.experience).toHaveLength(1);
    const expId = state.experience[0].id;
    expect(expId).toBeDefined();

    // 2. UPDATE_EXPERIENCE
    state = cvDataReducer(state, {
      type: 'UPDATE_EXPERIENCE' as const,
      id: expId,
      payload: { company: 'Google Deepmind', position: 'Research Engineer' },
    });
    expect(state.experience[0].company).toBe('Google Deepmind');
    expect(state.experience[0].position).toBe('Research Engineer');

    // 3. REMOVE_EXPERIENCE
    state = cvDataReducer(state, {
      type: 'REMOVE_EXPERIENCE' as const,
      id: expId,
    });
    expect(state.experience).toHaveLength(0);
  });

  it('should handle education actions (ADD, UPDATE, REMOVE) correctly', () => {
    let state = cvDataReducer(MOCK_CV, { type: 'ADD_EDUCATION' as const });
    expect(state.education).toHaveLength(1);
    const eduId = state.education[0].id;

    state = cvDataReducer(state, {
      type: 'UPDATE_EDUCATION' as const,
      id: eduId,
      payload: { institution: 'MIT', degree: 'Ph.D in AI' },
    });
    expect(state.education[0].institution).toBe('MIT');

    state = cvDataReducer(state, { type: 'REMOVE_EDUCATION' as const, id: eduId });
    expect(state.education).toHaveLength(0);
  });

  it('should handle project actions (ADD, UPDATE, REMOVE) correctly', () => {
    let state = cvDataReducer(MOCK_CV, { type: 'ADD_PROJECT' as const });
    expect(state.projects).toHaveLength(1);
    const projId = state.projects[0].id;

    state = cvDataReducer(state, {
      type: 'UPDATE_PROJECT' as const,
      id: projId,
      payload: { name: 'CV Builder', technologies: ['React', 'Vite'] },
    });
    expect(state.projects[0].name).toBe('CV Builder');
    expect(state.projects[0].technologies).toEqual(['React', 'Vite']);

    state = cvDataReducer(state, { type: 'REMOVE_PROJECT' as const, id: projId });
    expect(state.projects).toHaveLength(0);
  });

  it('should handle skills actions (ADD, UPDATE, REMOVE) correctly', () => {
    let state = cvDataReducer(MOCK_CV, { type: 'ADD_SKILL_GROUP' as const });
    expect(state.skills).toHaveLength(1);
    const skillId = state.skills[0].id;

    state = cvDataReducer(state, {
      type: 'UPDATE_SKILL_GROUP' as const,
      id: skillId,
      payload: { category: 'Backend', skills: ['Python', 'SQLModel'] },
    });
    expect(state.skills[0].category).toBe('Backend');

    state = cvDataReducer(state, { type: 'REMOVE_SKILL_GROUP' as const, id: skillId });
    expect(state.skills).toHaveLength(0);
  });

  it('should handle certificates actions (ADD, UPDATE, REMOVE) correctly', () => {
    let state = cvDataReducer(MOCK_CV, { type: 'ADD_CERTIFICATE' as const });
    expect(state.certificates).toHaveLength(1);
    const certId = state.certificates[0].id;

    state = cvDataReducer(state, {
      type: 'UPDATE_CERTIFICATE' as const,
      id: certId,
      payload: { name: 'AWS Cloud Practitioner', issuer: 'Amazon' },
    });
    expect(state.certificates[0].name).toBe('AWS Cloud Practitioner');

    state = cvDataReducer(state, { type: 'REMOVE_CERTIFICATE' as const, id: certId });
    expect(state.certificates).toHaveLength(0);
  });

  it('should handle languages actions (ADD, UPDATE, REMOVE) correctly', () => {
    let state = cvDataReducer(MOCK_CV, { type: 'ADD_LANGUAGE' as const });
    expect(state.languages).toHaveLength(1);
    const langId = state.languages[0].id;

    state = cvDataReducer(state, {
      type: 'UPDATE_LANGUAGE' as const,
      id: langId,
      payload: { name: 'English', level: 'IELTS 8.0' },
    });
    expect(state.languages[0].name).toBe('English');

    state = cvDataReducer(state, { type: 'REMOVE_LANGUAGE' as const, id: langId });
    expect(state.languages).toHaveLength(0);
  });

  it('should handle SET_THEME_COLOR and SET_FONT_FAMILY correctly', () => {
    let state = cvDataReducer(MOCK_CV, { type: 'SET_THEME_COLOR' as const, payload: 'rose' });
    expect(state.themeColor).toBe('rose');

    state = cvDataReducer(state, { type: 'SET_FONT_FAMILY' as const, payload: 'lora' });
    expect(state.fontFamily).toBe('lora');
  });

  it('should handle LOAD_CV correctly', () => {
    const targetCV: CVSchema = {
      ...DEFAULT_CV,
      personalInfo: { fullName: 'New Loaded User', title: 'Consultant', email: '', phone: '' },
      themeColor: 'amber',
      fontFamily: 'serif',
    };
    const state = cvDataReducer(MOCK_CV, { type: 'LOAD_CV' as const, payload: targetCV });
    expect(state).toEqual(targetCV);
  });

  it('should handle CLEAR_ALL correctly while preserving chosen visual styles', () => {
    const state = cvDataReducer(MOCK_CV, {
      type: 'CLEAR_ALL' as const,
      preserveSettings: { themeColor: 'emerald', fontFamily: 'outfit' },
    });

    expect(state.personalInfo.fullName).toBe('');
    expect(state.summary).toBe('');
    expect(state.experience).toEqual([]);
    expect(state.themeColor).toBe('emerald'); // preserved!
    expect(state.fontFamily).toBe('outfit'); // preserved!
  });
});
