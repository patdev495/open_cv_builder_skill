import { useState, useEffect, useReducer } from 'react';
import type { CVSchema } from '../types';
import * as api from '../services/api';
import { DEFAULT_CV } from '../constants';
import { useTranslation } from '../i18n/useTranslation';
import { TRANSLATIONS } from '../i18n/translations';
import { processAvatar } from '../services/avatarProcessor';
import { cvDataReducer, type CVAction } from './cvDataReducer';

export type EditorStatus = 'loading' | 'editing' | 'view-only';

export interface CVEditorState {
  // Routing
  slug: string;
  inputSlug: string;
  setInputSlug: (v: string) => void;

  // CV data (read-only — mutations go through dispatch)
  cvData: CVSchema;
  dispatch: React.Dispatch<CVAction>;
  template: string;
  setTemplate: (t: string) => void;
  handleTemplateChange: (tempId: string) => void;

  // Auth
  passcode: string;
  setPasscode: (p: string) => void;
  showVerifyModal: boolean;
  setShowVerifyModal: (v: boolean) => void;
  verifyPasscodeVal: string;
  setVerifyPasscodeVal: (v: string) => void;
  verifyError: string;
  setVerifyError: (v: string) => void;

  // UI / status
  isLoading: boolean;
  statusMessage: { type: 'success' | 'error'; text: string } | null;
  setStatusMessage: (m: { type: 'success' | 'error'; text: string } | null) => void;
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
  isViewOnly: boolean;

  // Language
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
  t: (key: keyof typeof TRANSLATIONS.vi) => string;

  // CV save / auth actions
  handleSave: (e: React.FormEvent) => Promise<void>;
  handleUnlockVerify: () => Promise<void>;

  // Avatar actions
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleAvatarDelete: () => void;
  handleClearAll: () => void;

  // List mutations (convenience wrappers over dispatch)
  addExperience: () => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
  addSkill: () => void;
  removeSkill: (id: string) => void;
  addCertificate: () => void;
  removeCertificate: (id: string) => void;
  addLanguage: () => void;
  removeLanguage: (id: string) => void;
}

export function useCVEditor(): CVEditorState {
  // --- Language / i18n ---
  const { language, setLanguage, t } = useTranslation();

  // --- Routing ---
  const [slug, setSlug] = useState<string>('');
  const [inputSlug, setInputSlug] = useState<string>('');

  // --- CV Data via Reducer ---
  const [cvData, dispatch] = useReducer(cvDataReducer, DEFAULT_CV);
  const [template, setTemplate] = useState<string>('modern');

  const handleTemplateChange = (tempId: string) => {
    setTemplate(tempId);
    const fontMap: Record<string, string> = {
      modern: 'inter', classic: 'lora', creative: 'fira',
      executive: 'outfit', minimal: 'playfair',
    };
    dispatch({ type: 'SET_FONT_FAMILY', payload: fontMap[tempId] || 'inter' });
  };

  // --- Auth ---
  const [passcode, setPasscode] = useState<string>('');
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [verifyPasscodeVal, setVerifyPasscodeVal] = useState<string>('');
  const [verifyError, setVerifyError] = useState<string>('');

  // --- UI ---
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);

  // --- Document title ---
  useEffect(() => {
    document.title = cvData?.personalInfo?.fullName
      ? `${cvData.personalInfo.fullName} - CV`
      : 'CV Builder Pro';
  }, [cvData?.personalInfo?.fullName]);

  // --- Fetch CV on load ---
  const loadCVFromServer = async (targetSlug: string) => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const data = await api.fetchCV(targetSlug);
      const hydratedData: CVSchema = {
        ...data.cv_data,
        experience:   data.cv_data.experience?.map((x: any, i: number) => ({ ...x, id: x.id || `exp-${i}-${Date.now()}` })) || [],
        education:    data.cv_data.education?.map((x: any, i: number) => ({ ...x, id: x.id || `edu-${i}-${Date.now()}` })) || [],
        projects:     data.cv_data.projects?.map((x: any, i: number) => ({ ...x, id: x.id || `proj-${i}-${Date.now()}` })) || [],
        skills:       data.cv_data.skills?.map((x: any, i: number) => ({ ...x, id: x.id || `skill-${i}-${Date.now()}` })) || [],
        certificates: data.cv_data.certificates?.map((x: any, i: number) => ({ ...x, id: x.id || `cert-${i}-${Date.now()}` })) || [],
        languages:    data.cv_data.languages?.map((x: any, i: number) => ({ ...x, id: x.id || `lang-${i}-${Date.now()}` })) || [],
      };
      dispatch({ type: 'LOAD_CV', payload: hydratedData });
      setTemplate(data.template || 'modern');
      setIsEditMode(false);
      setIsViewOnly(true);
    } catch {
      setIsEditMode(true);
      setIsViewOnly(false);
      dispatch({ type: 'LOAD_CV', payload: DEFAULT_CV });
      setStatusMessage({ type: 'success', text: `/${targetSlug} ${t('notExistYet')}` });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const path = window.location.pathname.substring(1).trim().toLowerCase();
    if (path) {
      setSlug(path);
      setInputSlug(path);
      loadCVFromServer(path);
    } else {
      setIsEditMode(true);
      setIsViewOnly(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Save (Create or Update) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSlug.trim()) { setStatusMessage({ type: 'error', text: t('errorNoSlug') }); return; }
    if (!passcode.trim())  { setStatusMessage({ type: 'error', text: t('errorNoPasscode') }); return; }

    setIsLoading(true);
    setStatusMessage(null);
    const targetSlug = inputSlug.trim().toLowerCase();
    const cleanedCvData: CVSchema = {
      ...cvData,
      projects: cvData.projects.map(p => ({ ...p, technologies: p.technologies.filter(Boolean) })),
      skills:   cvData.skills.map(s => ({ ...s, skills: s.skills.filter(Boolean) })),
    };

    try {
      if (isViewOnly) {
        await api.updateCV(targetSlug, passcode, template, cleanedCvData);
        setStatusMessage({ type: 'success', text: t('successUpdate') });
      } else {
        await api.createCV(targetSlug, passcode, template, cleanedCvData);
        setSlug(targetSlug);
        setIsViewOnly(true);
        setIsEditMode(false);
        window.history.pushState({}, '', `/${targetSlug}`);
        setStatusMessage({ type: 'success', text: `${t('successPublish')}${targetSlug}` });
      }
      dispatch({ type: 'LOAD_CV', payload: cleanedCvData });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi khi lưu trữ CV.' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Passcode Verify ---
  const handleUnlockVerify = async () => {
    if (!verifyPasscodeVal.trim()) { setVerifyError(t('errorPasscodeRequired')); return; }
    setIsLoading(true);
    setVerifyError('');
    try {
      const isValid = await api.verifyPasscode(slug, verifyPasscodeVal);
      if (isValid) {
        setPasscode(verifyPasscodeVal);
        setIsEditMode(true);
        setShowVerifyModal(false);
        setVerifyPasscodeVal('');
        setStatusMessage({ type: 'success', text: t('successAuth') });
      } else {
        setVerifyError(t('errorAuthIncorrect'));
      }
    } catch (err: any) {
      setVerifyError(err.message || t('errorAuthFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // --- Avatar ---
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await processAvatar(file);
      dispatch({ type: 'SET_AVATAR', payload: base64 });
    } catch (err) {
      console.error('Avatar processing failed:', err);
    }
  };

  const handleAvatarDelete = () => dispatch({ type: 'DELETE_AVATAR' });

  const handleClearAll = () => {
    if (!window.confirm(t('confirmClear'))) return;
    dispatch({ type: 'CLEAR_ALL', preserveSettings: { themeColor: cvData.themeColor, fontFamily: cvData.fontFamily } });
  };

  // --- List convenience wrappers ---
  const addExperience    = () => dispatch({ type: 'ADD_EXPERIENCE' });
  const removeExperience = (id: string) => dispatch({ type: 'REMOVE_EXPERIENCE', id });
  const addEducation     = () => dispatch({ type: 'ADD_EDUCATION' });
  const removeEducation  = (id: string) => dispatch({ type: 'REMOVE_EDUCATION', id });
  const addProject       = () => dispatch({ type: 'ADD_PROJECT' });
  const removeProject    = (id: string) => dispatch({ type: 'REMOVE_PROJECT', id });
  const addSkill         = () => dispatch({ type: 'ADD_SKILL_GROUP' });
  const removeSkill      = (id: string) => dispatch({ type: 'REMOVE_SKILL_GROUP', id });
  const addCertificate   = () => dispatch({ type: 'ADD_CERTIFICATE' });
  const removeCertificate = (id: string) => dispatch({ type: 'REMOVE_CERTIFICATE', id });
  const addLanguage      = () => dispatch({ type: 'ADD_LANGUAGE' });
  const removeLanguage   = (id: string) => dispatch({ type: 'REMOVE_LANGUAGE', id });

  return {
    slug, inputSlug, setInputSlug,
    cvData, dispatch, template, setTemplate, handleTemplateChange,
    passcode, setPasscode,
    showVerifyModal, setShowVerifyModal,
    verifyPasscodeVal, setVerifyPasscodeVal,
    verifyError, setVerifyError,
    isLoading, statusMessage, setStatusMessage,
    isEditMode, setIsEditMode, isViewOnly,
    language, setLanguage, t,
    handleSave, handleUnlockVerify,
    handleAvatarUpload, handleAvatarDelete, handleClearAll,
    addExperience, removeExperience,
    addEducation, removeEducation,
    addProject, removeProject,
    addSkill, removeSkill,
    addCertificate, removeCertificate,
    addLanguage, removeLanguage,
  };
}
