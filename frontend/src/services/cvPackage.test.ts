import { describe, expect, it } from 'vitest';
import { DEFAULT_CV } from '../constants';
import { createCVPackage, parseCVPackage } from './cvPackage';

describe('CV Package', () => {
  it('creates a portable v1 package without client IDs or a passcode', () => {
    const packageFile = createCVPackage('  Pat-CV  ', 'creative', {
      ...DEFAULT_CV,
      experience: [{
        id: 'editor-only-id',
        company: 'OpenAI',
        position: 'Engineer',
        startDate: '2026-01',
        description: 'Builds useful tools.',
      }],
    });

    expect(packageFile).toEqual({
      format: 'cv-builder/package',
      version: 1,
      slug: 'pat-cv',
      template: 'creative',
      cv_data: expect.objectContaining({
        experience: [expect.not.objectContaining({ id: expect.anything() })],
      }),
    });
    expect(JSON.stringify(packageFile)).not.toContain('passcode');
  });

  it('rejects a package with an unsupported version before altering editor data', () => {
    const invalidPackage = JSON.stringify({
      ...createCVPackage('pat-cv', 'modern', DEFAULT_CV),
      version: 2,
    });

    expect(() => parseCVPackage(invalidPackage)).toThrow(/phiên bản/i);
  });

  it('rejects unknown fields instead of silently dropping agent data', () => {
    const invalidPackage = JSON.stringify({
      ...createCVPackage('pat-cv', 'modern', DEFAULT_CV),
      agentNote: 'This must not be silently discarded',
    });

    expect(() => parseCVPackage(invalidPackage)).toThrow(/không hỗ trợ/i);
  });
});
