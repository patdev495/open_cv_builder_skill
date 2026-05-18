import { useState, useEffect } from 'react';
import type { CVSchema } from '../types';
import * as api from '../services/api';
import { DEFAULT_CV, TRANSLATIONS } from '../constants';

export type EditorStatus = 'loading' | 'editing' | 'view-only';

export interface CVEditorState {
  // Routing
  slug: string;
  inputSlug: string;
  setInputSlug: (v: string) => void;

  // CV data
  cvData: CVSchema;
  setCvData: React.Dispatch<React.SetStateAction<CVSchema>>;
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

  // Actions
  handleSave: (e: React.FormEvent) => Promise<void>;
  handleUnlockVerify: () => Promise<void>;
}

export function useCVEditor(): CVEditorState {
  // --- Language ---
  const [language, setLanguageState] = useState<'vi' | 'en'>(() => {
    const saved = localStorage.getItem('cv_builder_lang');
    return saved === 'en' || saved === 'vi' ? saved : 'vi';
  });

  const setLanguage = (lang: 'vi' | 'en') => {
    localStorage.setItem('cv_builder_lang', lang);
    setLanguageState(lang);
  };

  const t = (key: keyof typeof TRANSLATIONS.vi): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.vi[key];
  };

  // --- Routing ---
  const [slug, setSlug] = useState<string>('');
  const [inputSlug, setInputSlug] = useState<string>('');

  // --- CV Data & Template ---
  const [cvData, setCvData] = useState<CVSchema>(DEFAULT_CV);
  const [template, setTemplate] = useState<string>('modern');

  const handleTemplateChange = (tempId: string) => {
    setTemplate(tempId);
    // Smart default typography mapped to template
    const fontMap: Record<string, string> = {
      modern: 'inter',
      classic: 'lora',
      creative: 'fira',
      executive: 'outfit',
      minimal: 'playfair',
    };
    setCvData(prev => ({ ...prev, fontFamily: fontMap[tempId] || 'inter' }));
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

  // --- Fetch CV on load (Custom Client-side Routing) ---
  const loadCVFromServer = async (targetSlug: string) => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const data = await api.fetchCV(targetSlug);
      // Re-hydrate array items with temporary client-side IDs
      const hydratedData: CVSchema = {
        ...data.cv_data,
        experience: data.cv_data.experience?.map((x: any, i: number) => ({ ...x, id: x.id || `exp-${i}-${Date.now()}` })) || [],
        education: data.cv_data.education?.map((x: any, i: number) => ({ ...x, id: x.id || `edu-${i}-${Date.now()}` })) || [],
        projects: data.cv_data.projects?.map((x: any, i: number) => ({ ...x, id: x.id || `proj-${i}-${Date.now()}` })) || [],
        skills: data.cv_data.skills?.map((x: any, i: number) => ({ ...x, id: x.id || `skill-${i}-${Date.now()}` })) || [],
        certificates: data.cv_data.certificates?.map((x: any, i: number) => ({ ...x, id: x.id || `cert-${i}-${Date.now()}` })) || [],
        languages: data.cv_data.languages?.map((x: any, i: number) => ({ ...x, id: x.id || `lang-${i}-${Date.now()}` })) || [],
      };
      setCvData(hydratedData);
      setTemplate(data.template || 'modern');
      setIsEditMode(false);
      setIsViewOnly(true);
    } catch {
      // Slug does not exist yet — available for creation
      setIsEditMode(true);
      setIsViewOnly(false);
      setCvData(DEFAULT_CV);
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
    if (!inputSlug.trim()) {
      setStatusMessage({ type: 'error', text: t('errorNoSlug') });
      return;
    }
    if (!passcode.trim()) {
      setStatusMessage({ type: 'error', text: t('errorNoPasscode') });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    const targetSlug = inputSlug.trim().toLowerCase();

    const cleanedCvData: CVSchema = {
      ...cvData,
      projects: cvData.projects.map(p => ({ ...p, technologies: p.technologies.filter(Boolean) })),
      skills: cvData.skills.map(s => ({ ...s, skills: s.skills.filter(Boolean) })),
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
      setCvData(cleanedCvData);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi khi lưu trữ CV.' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Verify Passcode ---
  const handleUnlockVerify = async () => {
    if (!verifyPasscodeVal.trim()) {
      setVerifyError(t('errorPasscodeRequired'));
      return;
    }

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

  return {
    slug,
    inputSlug,
    setInputSlug,
    cvData,
    setCvData,
    template,
    setTemplate,
    handleTemplateChange,
    passcode,
    setPasscode,
    showVerifyModal,
    setShowVerifyModal,
    verifyPasscodeVal,
    setVerifyPasscodeVal,
    verifyError,
    setVerifyError,
    isLoading,
    statusMessage,
    setStatusMessage,
    isEditMode,
    setIsEditMode,
    isViewOnly,
    language,
    setLanguage,
    t,
    handleSave,
    handleUnlockVerify,
  };
}
