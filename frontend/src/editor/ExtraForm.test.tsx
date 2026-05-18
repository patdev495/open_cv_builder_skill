import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExtraForm } from './ExtraForm';
import { CVEditorContext } from '../context/CVEditorContext';
import { DEFAULT_CV } from '../constants';
import type { CVEditorState } from '../hooks/useCVEditor';

describe('ExtraForm component', () => {
  const mockDispatch = vi.fn();
  const mockAddCert = vi.fn();
  const mockRemoveCert = vi.fn();
  const mockAddLang = vi.fn();
  const mockRemoveLang = vi.fn();

  const mockT = vi.fn((key: string) => {
    const keys: Record<string, string> = {
      certTitle: 'Chứng chỉ & Giải thưởng',
      addCert: 'Thêm chứng chỉ',
      emptyCert: 'Chưa có thông tin chứng chỉ.',
      langTitle: 'Ngoại ngữ',
      addLang: 'Thêm ngoại ngữ',
      emptyLang: 'Chưa có thông tin ngoại ngữ.',
      certNameLabel: 'Tên chứng chỉ',
      issuerLabel: 'Tổ chức cấp',
      dateLabel: 'Thời gian cấp',
      langLevelLabel: 'Trình độ',
    };
    return keys[key] || key;
  });

  const getBaseMockContext = (overrides = {}) => ({
    slug: 'test-slug',
    inputSlug: 'test-slug',
    setInputSlug: vi.fn(),
    cvData: {
      ...DEFAULT_CV,
      certificates: [],
      languages: [],
    },
    dispatch: mockDispatch,
    template: 'modern',
    setTemplate: vi.fn(),
    handleTemplateChange: vi.fn(),
    passcode: '',
    setPasscode: vi.fn(),
    showVerifyModal: false,
    setShowVerifyModal: vi.fn(),
    verifyPasscodeVal: '',
    setVerifyPasscodeVal: vi.fn(),
    verifyError: '',
    setVerifyError: vi.fn(),
    isLoading: false,
    statusMessage: null,
    setStatusMessage: vi.fn(),
    isEditMode: true,
    setIsEditMode: vi.fn(),
    isViewOnly: false,
    language: 'vi' as const,
    setLanguage: vi.fn(),
    t: mockT,
    handleSave: vi.fn(),
    handleUnlockVerify: vi.fn(),
    handleAvatarUpload: vi.fn(),
    handleAvatarDelete: vi.fn(),
    handleClearAll: vi.fn(),
    addExperience: vi.fn(),
    removeExperience: vi.fn(),
    addEducation: vi.fn(),
    removeEducation: vi.fn(),
    addProject: vi.fn(),
    removeProject: vi.fn(),
    addSkill: vi.fn(),
    removeSkill: vi.fn(),
    addCertificate: mockAddCert,
    removeCertificate: mockRemoveCert,
    addLanguage: mockAddLang,
    removeLanguage: mockRemoveLang,
    ...overrides,
  } as unknown as CVEditorState);

  it('should render empty states correctly when no certs or langs are added', () => {
    const contextVal = getBaseMockContext();
    render(
      <CVEditorContext.Provider value={contextVal}>
        <ExtraForm />
      </CVEditorContext.Provider>
    );

    expect(screen.getByText('Chưa có thông tin chứng chỉ.')).toBeInTheDocument();
    expect(screen.getByText('Chưa có thông tin ngoại ngữ.')).toBeInTheDocument();
  });

  it('should trigger add callbacks when add buttons are clicked', () => {
    const contextVal = getBaseMockContext();
    render(
      <CVEditorContext.Provider value={contextVal}>
        <ExtraForm />
      </CVEditorContext.Provider>
    );

    const addCertBtn = screen.getByText('Thêm chứng chỉ');
    const addLangBtn = screen.getByText('Thêm ngoại ngữ');

    fireEvent.click(addCertBtn);
    expect(mockAddCert).toHaveBeenCalled();

    fireEvent.click(addLangBtn);
    expect(mockAddLang).toHaveBeenCalled();
  });

  it('should render existing certificate inputs and trigger dispatch on change', () => {
    const contextVal = getBaseMockContext({
      cvData: {
        ...DEFAULT_CV,
        certificates: [{ id: 'cert-1', name: 'AWS SA', issuer: 'Amazon', date: '2023' }],
        languages: [],
      },
    });

    render(
      <CVEditorContext.Provider value={contextVal}>
        <ExtraForm />
      </CVEditorContext.Provider>
    );

    expect(screen.queryByText('Chưa có thông tin chứng chỉ.')).not.toBeInTheDocument();

    const certNameInput = screen.getByDisplayValue('AWS SA');
    expect(certNameInput).toBeInTheDocument();

    fireEvent.change(certNameInput, { target: { value: 'AWS Developer' } });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_CERTIFICATE',
      id: 'cert-1',
      payload: { name: 'AWS Developer' },
    });
  });
});
