import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTranslation } from './useTranslation';

describe('useTranslation hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default language "en" when localStorage is empty', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.language).toBe('en');
    expect(result.current.t('title')).toBe('CV BUILDER PRO'); // default translates
  });

  it('should initialize language from localStorage if valid value is stored', () => {
    localStorage.setItem('cv_builder_lang', 'vi');
    const { result } = renderHook(() => useTranslation());
    expect(result.current.language).toBe('vi');
    expect(result.current.t('title')).toBe('CV BUILDER PRO');
  });

  it('should update language and save to localStorage when setLanguage is called', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.language).toBe('en');

    act(() => {
      result.current.setLanguage('vi');
    });

    expect(result.current.language).toBe('vi');
    expect(localStorage.getItem('cv_builder_lang')).toBe('vi');
  });

  it('should return translation correct strings according to current language', () => {
    const { result } = renderHook(() => useTranslation());

    // English translation (default)
    expect(result.current.t('experienceTitle')).toBe('Work Experience');

    act(() => {
      result.current.setLanguage('vi');
    });

    // Vietnamese translation
    expect(result.current.t('experienceTitle')).toBe('Kinh nghiệm làm việc');
  });
});
