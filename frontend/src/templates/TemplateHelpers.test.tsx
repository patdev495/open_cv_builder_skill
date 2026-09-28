import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { CustomLinksRenderer } from './TemplateHelpers';

describe('CustomLinksRenderer', () => {
  it('renders nothing when legacy CV data has null custom links', () => {
    const { container } = render(
      <CustomLinksRenderer customLinks={null as unknown as undefined} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
