import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIEnhancer } from './AIEnhancer';
import { CVEditorContext } from '../context/CVEditorContext';
import * as api from '../services/api';

// Mock the API client
vi.mock('../services/api', () => ({
  optimizeWithAI: vi.fn(),
}));

describe('AIEnhancer Component', () => {
  const mockOnAccept = vi.fn();
  const mockState = {
    // Routing
    slug: '',
    inputSlug: '',
    setInputSlug: vi.fn(),

    cvData: {
      personalInfo: { fullName: '', email: '', phone: '', avatar: '' },
      summary: '',
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certificates: [],
      languages: [],
      sectionOrder: [],
      themeColor: 'emerald',
      fontSize: 'normal',
      fontFamily: 'inter',
      lineHeight: 'normal',
    },
    dispatch: vi.fn(),
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
    language: 'en' as const,
    setLanguage: vi.fn(),
    t: (key: string) => {
      const keys: Record<string, string> = {
        aiOptimize: 'Optimize with AI ✨',
        aiOptimizing: 'Analyzing...',
        aiOptimizeTitle: 'AI Resume Co-Pilot',
        aiOriginal: 'Your Original Content',
        aiSuggested: 'Suggested by Gemini AI',
        aiAccept: '✔️ Accept & Replace',
        aiDiscard: '❌ Discard Suggestion',
        aiError: 'An error occurred calling the AI.',
      };
      return keys[key] || key;
    },
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
    editingLanguage: 'vi',
    setEditingLanguage: vi.fn(),
    isTranslating: false,
    handleTranslateCV: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props: { value: string; type: 'summary' | 'experience' }) => {
    return render(
      <CVEditorContext.Provider value={mockState}>
        <AIEnhancer {...props} onAccept={mockOnAccept} />
      </CVEditorContext.Provider>
    );
  };

  it('renders the AI Optimize button successfully', () => {
    renderComponent({ value: 'Nguyen Van A', type: 'summary' });
    expect(screen.getByText('Optimize with AI ✨')).toBeInTheDocument();
  });

  it('shows validation error when attempting to optimize empty value', async () => {
    renderComponent({ value: '   ', type: 'summary' });
    
    const optBtn = screen.getByText('Optimize with AI ✨');
    fireEvent.click(optBtn);

    expect(screen.getByText('Please enter some text before optimizing.')).toBeInTheDocument();
  });

  it('calls optimizeWithAI and opens comparison modal with results on success', async () => {
    const originalText = 'tôi là lập trình viên react';
    const optimizedText = 'I am a highly skilled React Developer with deep expertise.';
    
    // Configure API mock response
    vi.mocked(api.optimizeWithAI).mockResolvedValue(optimizedText);

    renderComponent({ value: originalText, type: 'summary' });
    
    const optBtn = screen.getByText('Optimize with AI ✨');
    fireEvent.click(optBtn);

    // Verify modal is shown and calls correct API
    expect(screen.getByText('AI Resume Co-Pilot')).toBeInTheDocument();
    expect(api.optimizeWithAI).toHaveBeenCalledWith(originalText, 'summary', 'en');

    // Wait for the suggestion to load and show up in the suggestion box
    await waitFor(() => {
      expect(screen.getByText(optimizedText)).toBeInTheDocument();
    });

    expect(screen.getByText(originalText)).toBeInTheDocument();
  });

  it('calls onAccept with optimized value and closes modal when accept is clicked', async () => {
    const originalText = 'tôi là lập trình viên react';
    const optimizedText = 'I am a highly skilled React Developer with deep expertise.';
    vi.mocked(api.optimizeWithAI).mockResolvedValue(optimizedText);

    renderComponent({ value: originalText, type: 'summary' });
    
    const optBtn = screen.getByText('Optimize with AI ✨');
    fireEvent.click(optBtn);

    await waitFor(() => {
      expect(screen.getByText(optimizedText)).toBeInTheDocument();
    });

    const acceptBtn = screen.getByText('✔️ Accept & Replace');
    fireEvent.click(acceptBtn);

    // Verify onAccept callback and modal closed
    expect(mockOnAccept).toHaveBeenCalledWith(optimizedText);
    expect(screen.queryByText('AI Resume Co-Pilot')).not.toBeInTheDocument();
  });

  it('closes modal and does not call onAccept when discard is clicked', async () => {
    const originalText = 'tôi là lập trình viên react';
    const optimizedText = 'I am a highly skilled React Developer with deep expertise.';
    vi.mocked(api.optimizeWithAI).mockResolvedValue(optimizedText);

    renderComponent({ value: originalText, type: 'summary' });
    
    const optBtn = screen.getByText('Optimize with AI ✨');
    fireEvent.click(optBtn);

    await waitFor(() => {
      expect(screen.getByText(optimizedText)).toBeInTheDocument();
    });

    const discardBtn = screen.getByText('❌ Discard Suggestion');
    fireEvent.click(discardBtn);

    expect(mockOnAccept).not.toHaveBeenCalled();
    expect(screen.queryByText('AI Resume Co-Pilot')).not.toBeInTheDocument();
  });
});
