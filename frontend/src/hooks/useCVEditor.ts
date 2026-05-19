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
  statusMessage: { type: 'success' | 'error'; text: string; link?: string } | null;
  setStatusMessage: (m: { type: 'success' | 'error'; text: string; link?: string } | null) => void;
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
  draftToRecover: { cvData: CVSchema; template: string; editingMode: 'original' | 'translated' } | null;
  handleRecoverDraft: () => void;
  handleDiscardDraft: () => void;
}

export function useCVEditor(initialPasscode: string = ''): CVEditorState {
  const { language, setLanguage, t } = useTranslation();
  const [slug, setSlug] = useState<string>('');
  const [inputSlug, setInputSlug] = useState<string>('');
  const [cvData, rawDispatch] = useReducer(cvDataReducer, DEFAULT_CV);
  const [editingMode, setEditingMode] = useState<'original' | 'translated'>('original');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [draftToRecover, setDraftToRecover] = useState<{ cvData: CVSchema; template: string; editingMode: 'original' | 'translated' } | null>(null);
  const [hasResolvedDraft, setHasResolvedDraft] = useState<boolean>(false);

  const checkDraft = (targetSlug: string, currentCv: CVSchema = DEFAULT_CV, currentTemp: string = 'modern') => {
    try {
      const key = targetSlug ? `cv_draft_${targetSlug}` : 'cv_draft_new';
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.cvData) {
          const isDifferent = JSON.stringify(parsed.cvData) !== JSON.stringify(currentCv) || parsed.template !== currentTemp || parsed.editingMode !== editingMode;
          if (isDifferent) {
            setDraftToRecover({ cvData: parsed.cvData, template: parsed.template, editingMode: parsed.editingMode || 'original' });
            return;
          }
        }
      }
    } catch (e) {
      console.error('Error checking local draft:', e);
    }
    setHasResolvedDraft(true);
  };

  const handleRecoverDraft = () => {
    if (draftToRecover) {
      dispatch({ type: 'LOAD_CV', payload: draftToRecover.cvData });
      setTemplate(draftToRecover.template);
      setEditingMode(draftToRecover.editingMode);
      setDraftToRecover(null);
    }
    setHasResolvedDraft(true);
  };

  const handleDiscardDraft = () => {
    try {
      const key = slug ? `cv_draft_${slug}` : 'cv_draft_new';
      localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
    setDraftToRecover(null);
    setHasResolvedDraft(true);
  };

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
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string; link?: string } | null>(null);
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
      checkDraft(targetSlug, hydratedData, data.template || 'modern');
    } catch {
      // Not found, so we are creating a new one
      setIsViewOnly(false);
      dispatch({ type: 'LOAD_CV', payload: DEFAULT_CV });
      setStatusMessage({ type: 'success', text: `/${targetSlug} ${t('notExistYet')}` });
      checkDraft(targetSlug, DEFAULT_CV, 'modern');
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
      checkDraft('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced Auto-save Effect
  useEffect(() => {
    if (!hasResolvedDraft) return;

    const handler = setTimeout(() => {
      try {
        const key = slug ? `cv_draft_${slug}` : 'cv_draft_new';
        localStorage.setItem(key, JSON.stringify({ cvData, template, editingMode }));
      } catch (e) {
        console.error('Failed to auto-save draft to localStorage:', e);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [cvData, template, editingMode, hasResolvedDraft, slug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSlug.trim()) { setStatusMessage({ type: 'error', text: t('errorNoSlug') }); return; }
    if (!passcode.trim())  { setStatusMessage({ type: 'error', text: t('errorNoPasscode') }); return; }

    setIsLoading(true);
    setStatusMessage(null);
    const targetSlug = inputSlug.trim().toLowerCase();
    const targetUrl = `${window.location.origin}/${targetSlug}`;

    // Open a blank new tab immediately during the click event to bypass popup blockers
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Đang xuất bản CV... | CV Builder Pro</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0b0f19; color: #f1f5f9; margin: 0; overflow: hidden;">
            <div style="text-align: center; padding: 32px; border-radius: 24px; background: rgba(30, 41, 59, 0.45); border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); max-width: 360px; width: 90%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); box-sizing: border-box;">
              <div style="border: 4px solid rgba(168, 85, 247, 0.1); border-top-color: #a855f7; border-radius: 50%; width: 56px; height: 56px; margin: 0 auto 24px; animation: spin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; box-shadow: 0 0 20px rgba(168, 85, 247, 0.35);"></div>
              <p style="font-size: 18px; font-weight: 700; margin: 0 0 10px; background: linear-gradient(to right, #c084fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Đang xuất bản CV...</p>
              <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6;">Hệ thống đang lưu trữ dữ liệu và chuẩn bị hồ sơ tương tác của bạn.</p>
            </div>
            <style>
              @keyframes spin { to { transform: rotate(360deg); } }
            </style>
          </body>
        </html>
      `);
      newWindow.document.close();
    }

    const cleanedCvData: CVSchema = {
      ...cvData,
      projects: cvData.projects.map(p => ({ ...p, technologies: p.technologies.filter(Boolean) })),
      skills:   cvData.skills.map(s => ({ ...s, skills: s.skills.filter(Boolean) })),
    };

    try {
      if (isViewOnly) {
        await api.updateCV(targetSlug, passcode, template, cleanedCvData);
        try {
          localStorage.removeItem(`cv_draft_${targetSlug}`);
        } catch {}
        if (newWindow) {
          newWindow.location.href = targetUrl;
        }
        setStatusMessage({
          type: 'success',
          text: language === 'vi' 
            ? 'Cập nhật CV thành công! Đã tự động mở trang CV mới của bạn.' 
            : 'CV updated successfully! Automatically opened your public CV.',
          link: targetUrl
        });
      } else {
        await api.createCV(targetSlug, passcode, template, cleanedCvData);
        try {
          localStorage.removeItem('cv_draft_new');
          localStorage.removeItem(`cv_draft_${targetSlug}`);
        } catch {}
        if (newWindow) {
          newWindow.location.href = targetUrl;
        }
        setStatusMessage({
          type: 'success',
          text: language === 'vi' 
            ? 'Đăng ký & Xuất bản CV thành công! Đã tự động mở trang CV mới của bạn.' 
            : 'CV registered & published successfully! Automatically opened your public CV.',
          link: targetUrl
        });
        setSlug(targetSlug);
        setIsViewOnly(true); 
      }
    } catch (err: any) {
      if (newWindow) {
        newWindow.close();
      }
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
      try {
        const key = slug ? `cv_draft_${slug}` : 'cv_draft_new';
        localStorage.removeItem(key);
      } catch (e) {
        console.error(e);
      }
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
    draftToRecover, handleRecoverDraft, handleDiscardDraft,
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
