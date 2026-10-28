import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { COLOR_MAP, DEFAULT_CV } from '../constants';
import CreativeTemplate from './CreativeTemplate';

describe('CreativeTemplate print layout', () => {
  it('keeps the desktop contact panel and hides the mobile fallback when printing', () => {
    const { container } = render(
      <CreativeTemplate cvData={DEFAULT_CV} activeColor={COLOR_MAP.emerald} t={(key: string) => key} />
    );

    expect(container.innerHTML).toContain('print:flex print:w-2/5');
    expect(container.innerHTML).toContain('md:hidden print:hidden');
    expect(container.innerHTML).not.toContain('print:bg-white print:text-black print:p-0');
  });
});
