import { useState } from 'react';
import * as api from '../services/api';

export interface UsePasscodeVerifyResult {
  passcode: string;
  setPasscode: (p: string) => void;
  showVerifyModal: boolean;
  setShowVerifyModal: (v: boolean) => void;
  verifyPasscodeVal: string;
  setVerifyPasscodeVal: (v: string) => void;
  verifyError: string;
  setVerifyError: (v: string) => void;
  handleUnlockVerify: (
    slug: string,
    t: (key: any) => string,
    setIsLoading: (v: boolean) => void,
    setIsEditMode: (v: boolean) => void,
    setStatusMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void
  ) => Promise<void>;
}

export function usePasscodeVerify(): UsePasscodeVerifyResult {
  const [passcode, setPasscode] = useState<string>('');
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [verifyPasscodeVal, setVerifyPasscodeVal] = useState<string>('');
  const [verifyError, setVerifyError] = useState<string>('');

  const handleUnlockVerify = async (
    slug: string,
    t: (key: any) => string,
    setIsLoading: (v: boolean) => void,
    setIsEditMode: (v: boolean) => void,
    setStatusMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void
  ) => {
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
    passcode,
    setPasscode,
    showVerifyModal,
    setShowVerifyModal,
    verifyPasscodeVal,
    setVerifyPasscodeVal,
    verifyError,
    setVerifyError,
    handleUnlockVerify,
  };
}
