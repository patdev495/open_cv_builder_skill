/**
 * CVEditorContext — provides the full editor state to any descendant.
 * Form Adapters call useCVEditorContext() directly, eliminating all prop drilling.
 */
import { createContext, useContext } from 'react';
import type { CVEditorState } from '../hooks/useCVEditor';

export const CVEditorContext = createContext<CVEditorState | null>(null);

/**
 * Convenience hook — throws if used outside a provider, giving a clear error
 * instead of silent undefined behavior.
 */
export function useCVEditorContext(): CVEditorState {
  const ctx = useContext(CVEditorContext);
  if (!ctx) {
    throw new Error('useCVEditorContext must be used inside <CVEditorContext.Provider>');
  }
  return ctx;
}
