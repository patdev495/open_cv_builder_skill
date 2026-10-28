import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ContactLinksRenderer, CustomLinksRenderer } from './TemplateHelpers';

describe('CustomLinksRenderer', () => {
  it('renders nothing when legacy CV data has null custom links', () => {
    const { container } = render(
      <CustomLinksRenderer customLinks={null as unknown as undefined} />
    );

    expect(container).toBeEmptyDOMElement();
  });
});

describe('ContactLinksRenderer', () => {
  it('renders every web contact as an icon and its URL, not its editable label', () => {
    const { getByText, getAllByRole } = render(
      <ContactLinksRenderer
        personalInfo={{
          website: 'https://pat.dev',
          github: 'https://github.com/patdev495',
          customLinks: [{ id: 'portfolio', label: 'My work', url: 'https://work.pat.dev', icon: 'globe' }],
        }}
      />
    );

    expect(getByText('pat.dev')).toBeInTheDocument();
    expect(getByText('github.com/patdev495')).toBeInTheDocument();
    expect(getByText('work.pat.dev')).toBeInTheDocument();
    expect(getAllByRole('link')).toHaveLength(3);
  });
});
