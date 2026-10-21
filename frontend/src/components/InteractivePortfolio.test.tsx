import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { DEFAULT_CV } from '../constants';
import { InteractivePortfolio } from './InteractivePortfolio';

const useCVViewerMock = vi.hoisted(() => vi.fn());

vi.mock('../hooks/useCVViewer', () => ({ useCVViewer: useCVViewerMock }));
vi.mock('../hooks/usePasscodeVerify', () => ({
  usePasscodeVerify: () => ({
    showVerifyModal: false,
    setShowVerifyModal: vi.fn(),
    verifyPasscodeVal: '',
    setVerifyPasscodeVal: vi.fn(),
    verifyError: '',
    handleUnlockVerify: vi.fn(),
  }),
}));
vi.mock('../templates/TemplateRenderer', () => ({ default: () => <div data-testid="cv-template" /> }));

describe('InteractivePortfolio', () => {
  beforeEach(() => {
    useCVViewerMock.mockReturnValue({
      slug: 'public-cv',
      cvData: DEFAULT_CV,
      isLoading: false,
      statusMessage: null,
      displayMode: 'original',
      setDisplayMode: vi.fn(),
      template: 'modern',
      language: 'en',
      setLanguage: vi.fn(),
      t: (key: string) => key,
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    });
    Object.defineProperty(URL, 'createObjectURL', { writable: true, value: vi.fn(() => 'blob:cv-package') });
    Object.defineProperty(URL, 'revokeObjectURL', { writable: true, value: vi.fn() });
    Object.defineProperty(HTMLAnchorElement.prototype, 'click', { writable: true, value: vi.fn() });
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });
    globalThis.IntersectionObserver = class {
      observe() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  it('lets a public visitor export a CV Package without entering a passcode', () => {
    render(<InteractivePortfolio slug="public-cv" onUnlock={vi.fn()} />);

    fireEvent.click(screen.getByTitle('Export CV Package JSON'));

    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledOnce();
  });
});
