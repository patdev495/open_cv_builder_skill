import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePasscodeVerify } from './usePasscodeVerify';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
  verifyPasscode: vi.fn(),
}));

describe('usePasscodeVerify hook', () => {
  const mockT = vi.fn((key: string) => `translated_${key}`);
  const mockSetIsLoading = vi.fn();
  const mockSetIsEditMode = vi.fn();
  const mockSetStatusMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default states', () => {
    const { result } = renderHook(() => usePasscodeVerify());
    expect(result.current.passcode).toBe('');
    expect(result.current.showVerifyModal).toBe(false);
    expect(result.current.verifyPasscodeVal).toBe('');
    expect(result.current.verifyError).toBe('');
  });

  it('should block verification with validation error if passcode is empty', async () => {
    const { result } = renderHook(() => usePasscodeVerify());

    await act(async () => {
      await result.current.handleUnlockVerify(
        'test-slug',
        mockT,
        mockSetIsLoading,
        mockSetIsEditMode,
        mockSetStatusMessage
      );
    });

    expect(result.current.verifyError).toBe('translated_errorPasscodeRequired');
    expect(api.verifyPasscode).not.toHaveBeenCalled();
  });

  it('should unlock and set success states on correct passcode API return', async () => {
    vi.mocked(api.verifyPasscode).mockResolvedValue(true);

    const { result } = renderHook(() => usePasscodeVerify());

    act(() => {
      result.current.setVerifyPasscodeVal('super-pass');
    });

    await act(async () => {
      await result.current.handleUnlockVerify(
        'test-slug',
        mockT,
        mockSetIsLoading,
        mockSetIsEditMode,
        mockSetStatusMessage
      );
    });

    expect(mockSetIsLoading).toHaveBeenNthCalledWith(1, true);
    expect(mockSetIsLoading).toHaveBeenNthCalledWith(2, false);
    expect(api.verifyPasscode).toHaveBeenCalledWith('test-slug', 'super-pass');

    expect(result.current.passcode).toBe('super-pass');
    expect(mockSetIsEditMode).toHaveBeenCalledWith(true);
    expect(result.current.showVerifyModal).toBe(false);
    expect(result.current.verifyPasscodeVal).toBe('');
    expect(mockSetStatusMessage).toHaveBeenCalledWith({
      type: 'success',
      text: 'translated_successAuth',
    });
  });

  it('should show error message if passcode is incorrect', async () => {
    vi.mocked(api.verifyPasscode).mockResolvedValue(false);

    const { result } = renderHook(() => usePasscodeVerify());

    act(() => {
      result.current.setVerifyPasscodeVal('wrong-pass');
    });

    await act(async () => {
      await result.current.handleUnlockVerify(
        'test-slug',
        mockT,
        mockSetIsLoading,
        mockSetIsEditMode,
        mockSetStatusMessage
      );
    });

    expect(result.current.verifyError).toBe('translated_errorAuthIncorrect');
    expect(mockSetIsEditMode).not.toHaveBeenCalled();
    expect(result.current.passcode).toBe('');
  });

  it('should handle API exceptions properly', async () => {
    vi.mocked(api.verifyPasscode).mockRejectedValue(new Error('Network Timeout'));

    const { result } = renderHook(() => usePasscodeVerify());

    act(() => {
      result.current.setVerifyPasscodeVal('some-pass');
    });

    await act(async () => {
      await result.current.handleUnlockVerify(
        'test-slug',
        mockT,
        mockSetIsLoading,
        mockSetIsEditMode,
        mockSetStatusMessage
      );
    });

    expect(result.current.verifyError).toBe('Network Timeout');
    expect(mockSetIsEditMode).not.toHaveBeenCalled();
  });
});
