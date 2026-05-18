import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { CVEditorContext } from '../context/CVEditorContext';
import { DEFAULT_CV } from '../constants';
import type { CVEditorState } from '../hooks/useCVEditor';

describe('PersonalInfoForm component', () => {
  const mockDispatch = vi.fn();
  const mockT = vi.fn((key: string) => {
    const keys: Record<string, string> = {
      personalInfo: 'Thông tin cá nhân',
      fullName: 'Họ và tên',
      jobTitle: 'Vị trí công việc',
      phone: 'Số điện thoại',
      location: 'Địa điểm',
      website: 'Trang web cá nhân',
      uploadPhoto: 'Tải ảnh',
      avatarPhoto: 'Ảnh chân dung',
    };
    return keys[key] || key;
  });

  const mockContextValue = {
    slug: 'test-slug',
    inputSlug: 'test-slug',
    setInputSlug: vi.fn(),
    cvData: {
      ...DEFAULT_CV,
      personalInfo: {
        fullName: 'John Doe',
        title: 'Senior Dev',
        email: 'john@example.com',
        phone: '0909090909',
        location: 'HCMC',
        website: 'john.dev',
        github: '',
        linkedin: '',
      },
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
    addCertificate: vi.fn(),
    removeCertificate: vi.fn(),
    addLanguage: vi.fn(),
    removeLanguage: vi.fn(),
  } as unknown as CVEditorState;

  it('should render form fields with initial values from context', () => {
    render(
      <CVEditorContext.Provider value={mockContextValue}>
        <PersonalInfoForm />
      </CVEditorContext.Provider>
    );

    // Verify labels are translated and shown
    expect(screen.getByText('Thông tin cá nhân')).toBeInTheDocument();

    // Verify inputs have correct values
    const nameInput = screen.getByDisplayValue('John Doe') as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();

    const titleInput = screen.getByDisplayValue('Senior Dev') as HTMLInputElement;
    expect(titleInput).toBeInTheDocument();

    const emailInput = screen.getByDisplayValue('john@example.com') as HTMLInputElement;
    expect(emailInput).toBeInTheDocument();
  });

  it('should trigger dispatch on input field changes', () => {
    render(
      <CVEditorContext.Provider value={mockContextValue}>
        <PersonalInfoForm />
      </CVEditorContext.Provider>
    );

    const nameInput = screen.getByDisplayValue('John Doe');
    
    // Simulate typing
    fireEvent.change(nameInput, { target: { value: 'Alice Smith' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_PERSONAL_INFO',
      payload: { fullName: 'Alice Smith' },
    });
  });
});
