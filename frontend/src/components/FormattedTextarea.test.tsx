import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CVEditorContext } from '../context/CVEditorContext';
import type { CVEditorState } from '../hooks/useCVEditor';
import { FormattedTextarea } from './FormattedTextarea';

describe('FormattedTextarea', () => {
  it('forwards typed text to the editor state callback', () => {
    const onChangeValue = vi.fn();

    render(
      <CVEditorContext.Provider value={{ language: 'en' } as unknown as CVEditorState}>
        <FormattedTextarea value="Current summary" onChangeValue={onChangeValue} />
      </CVEditorContext.Provider>
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated summary' } });

    expect(onChangeValue).toHaveBeenCalledWith('Updated summary');
  });
});
