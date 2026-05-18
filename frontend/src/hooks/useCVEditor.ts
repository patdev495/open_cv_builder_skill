import { useState, useEffect, useReducer } from 'react';
import type { CVSchema } from '../types';
import * as api from '../services/api';
import { DEFAULT_CV } from '../constants';
import { useTranslation } from '../i18n/useTranslation';
import { TRANSLATIONS } from '../i18n/translations';
import { processAvatar } from '../services/avatarProcessor';
import { cvDataReducer, type CVAction } from './cvDataReducer';

export interface CVEditorState {
  slug: string;
  inputSlug: string;
  setInputSlug: (v: string) => void;

  cvData: CVSchema;
  dispatch: React.Dispatch<CVAction>;
  template: string;
  setTemplate: (t: string) => void;
  handleTemplateChange: (tempId: string) => void;

  passcode: string;
  setPasscode: (p: string) => void;

  isLoading: boolean;
  statusMessage: { type: 'success' | 'error'; text: string } | null;
  setStatusMessage: (m: { type: 'success' | 'error'; text: string } | null) => void;
  isViewOnly: boolean; // Renamed conceptually: is this an existing CV on the server?

  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
  t: (key: keyof typeof TRANSLATIONS.vi) => string;

  editingMode: 'original' | 'translated';
  setEditingMode: (mode: 'original' | 'translated') => void;
  isTranslating: boolean;
  handleTranslateCV: () => Promise<void>;

  handleSave: (e: React.FormEvent) => Promise<void>;
  
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleAvatarDelete: () => void;
  handleClearAll: () => void;
  handleAutoFit?: () => void;

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

export function useCVEditor(initialPasscode: string = ''): CVEditorState {
  const { language, setLanguage, t } = useTranslation();
  const [slug, setSlug] = useState<string>('');
  const [inputSlug, setInputSlug] = useState<string>('');
  const [cvData, rawDispatch] = useReducer(cvDataReducer, DEFAULT_CV);
  const [editingMode, setEditingMode] = useState<'original' | 'translated'>('original');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const dispatch = (action: CVAction) => {
    rawDispatch({ ...action, _mode: editingMode });
  };
  const [template, setTemplate] = useState<string>('modern');

  const handleTemplateChange = (tempId: string) => {
    setTemplate(tempId);
    const fontMap: Record<string, string> = {
      modern: 'inter', classic: 'lora', creative: 'fira',
      executive: 'outfit', minimal: 'playfair',
    };
    dispatch({ type: 'SET_FONT_FAMILY', payload: fontMap[tempId] || 'inter' });
  };

  const [passcode, setPasscode] = useState<string>(initialPasscode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);

  useEffect(() => {
    document.title = cvData?.personalInfo?.fullName
      ? `${cvData.personalInfo.fullName} - Editor Workspace`
      : 'Editor Workspace - CV Builder Pro';
  }, [cvData?.personalInfo?.fullName]);

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
      // If we successfully load it, it means it's an existing CV (isViewOnly = true for handleSave)
      setIsViewOnly(true);
    } catch {
      // Not found, so we are creating a new one
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
      setIsViewOnly(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        setStatusMessage({ type: 'success', text: 'CV được tạo thành công!' });
        setSlug(targetSlug);
        setIsViewOnly(true); 
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi khi lưu CV.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslateCV = async () => {
    if (!cvData) return;
    setIsTranslating(true);
    setStatusMessage({ type: 'success', text: 'Đang dùng AI nhận diện và dịch Bản Gốc... (khoảng 3 giây)' });
    try {
      const fullTranslatedCv = await api.translateCV(cvData);
      rawDispatch({ 
        type: 'SET_TRANSLATED_DATA', 
        payload: fullTranslatedCv,
        _mode: 'original'
      } as CVAction);
      setStatusMessage({ type: 'success', text: 'Hoàn tất dịch! Nhấn sang tab Bản Dịch để xem.' });
      setEditingMode('translated');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Lỗi khi dịch CV.' });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const b64 = await processAvatar(file);
        dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { avatar: b64 } });
      } catch (error) {
        console.error(error);
        setStatusMessage({ type: 'error', text: 'Lỗi tải ảnh. Vui lòng chọn ảnh < 2MB.' });
      }
    }
  };

  const handleAvatarDelete = () => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { avatar: '' } });
  
  const handleClearAll = () => {
    if (window.confirm(t('confirmClear'))) {
      dispatch({ type: 'LOAD_CV', payload: DEFAULT_CV });
      setPasscode('');
      setIsViewOnly(false);
    }
  };

  return {
    slug, inputSlug, setInputSlug,
    cvData, dispatch, template, setTemplate, handleTemplateChange,
    passcode, setPasscode,
    isLoading, statusMessage, setStatusMessage, isViewOnly,
    language, setLanguage, t,
    editingMode, setEditingMode,
    isTranslating, handleTranslateCV,
    handleSave,
    handleAvatarUpload, handleAvatarDelete, handleClearAll,
    addExperience: () => dispatch({ type: 'ADD_EXPERIENCE' }),
    removeExperience: (id: string) => dispatch({ type: 'REMOVE_EXPERIENCE', id }),
    addEducation: () => dispatch({ type: 'ADD_EDUCATION' }),
    removeEducation: (id: string) => dispatch({ type: 'REMOVE_EDUCATION', id }),
    addProject: () => dispatch({ type: 'ADD_PROJECT' }),
    removeProject: (id: string) => dispatch({ type: 'REMOVE_PROJECT', id }),
    addSkill: () => dispatch({ type: 'ADD_SKILL_GROUP' }),
    removeSkill: (id: string) => dispatch({ type: 'REMOVE_SKILL_GROUP', id }),
    addCertificate: () => dispatch({ type: 'ADD_CERTIFICATE' }),
    removeCertificate: (id: string) => dispatch({ type: 'REMOVE_CERTIFICATE', id }),
    addLanguage: () => dispatch({ type: 'ADD_LANGUAGE' }),
    removeLanguage: (id: string) => dispatch({ type: 'REMOVE_LANGUAGE', id }),
  };
}
