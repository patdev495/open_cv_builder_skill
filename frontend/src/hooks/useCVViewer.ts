import { useState, useEffect } from 'react';
import type { CVSchema } from '../types';
import * as api from '../services/api';
import { DEFAULT_CV } from '../constants';
import { useTranslation } from '../i18n/useTranslation';

export interface CVViewerState {
  slug: string;
  cvData: CVSchema;
  isLoading: boolean;
  statusMessage: { type: 'success' | 'error'; text: string } | null;
  displayMode: 'original' | 'translated';
  setDisplayMode: (mode: 'original' | 'translated') => void;
  language: 'vi' | 'en';
  setLanguage: (lang: 'vi' | 'en') => void;
  t: (key: any) => string;
  template: string;
}

export function useCVViewer(slug: string): CVViewerState {
  const { language, setLanguage, t } = useTranslation();
  const [cvData, setCvData] = useState<CVSchema>(DEFAULT_CV);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [displayMode, setDisplayMode] = useState<'original' | 'translated'>('original');
  const [template, setTemplate] = useState<string>('modern');

  useEffect(() => {
    if (!slug) return;
    
    let isMounted = true;
    const fetchCV = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchCV(slug);
        if (isMounted) {
          // Hydrate array items with basic IDs for rendering maps if needed
          const hydratedData: CVSchema = {
            ...data.cv_data,
            experience:   data.cv_data.experience?.map((x: any, i: number) => ({ ...x, id: x.id || `exp-${i}` })) || [],
            education:    data.cv_data.education?.map((x: any, i: number) => ({ ...x, id: x.id || `edu-${i}` })) || [],
            projects:     data.cv_data.projects?.map((x: any, i: number) => ({ ...x, id: x.id || `proj-${i}` })) || [],
            skills:       data.cv_data.skills?.map((x: any, i: number) => ({ ...x, id: x.id || `skill-${i}` })) || [],
            certificates: data.cv_data.certificates?.map((x: any, i: number) => ({ ...x, id: x.id || `cert-${i}` })) || [],
            languages:    data.cv_data.languages?.map((x: any, i: number) => ({ ...x, id: x.id || `lang-${i}` })) || [],
          };
          setCvData(hydratedData);
          setTemplate(data.template || 'modern');
        }
      } catch (err: any) {
        if (isMounted) {
          setStatusMessage({ type: 'error', text: err.message || t('notExistYet') });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchCV();
    
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return {
    slug,
    cvData,
    isLoading,
    statusMessage,
    displayMode,
    setDisplayMode,
    language,
    setLanguage,
    t,
    template
  };
}
