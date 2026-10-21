import type { CVSchema } from '../types';

export const CV_PACKAGE_FORMAT = 'cv-builder/package';
export const CV_PACKAGE_VERSION = 1;
export const MAX_CV_PACKAGE_BYTES = 10 * 1024 * 1024;

export interface CVPackageV1 {
  format: typeof CV_PACKAGE_FORMAT;
  version: typeof CV_PACKAGE_VERSION;
  slug: string;
  template: string;
  cv_data: Record<string, unknown>;
}

type WithClientId = { id?: string };

function stripClientIds<T extends WithClientId>(items: T[]): Omit<T, 'id'>[] {
  return items.map(({ id: _id, ...item }) => item);
}

function serializeCVData(cvData: CVSchema): Record<string, unknown> {
  const { translated_data, experience, education, projects, skills, certificates, languages, ...rest } = cvData;

  return {
    ...rest,
    experience: stripClientIds(experience),
    education: stripClientIds(education),
    projects: stripClientIds(projects),
    skills: stripClientIds(skills),
    certificates: stripClientIds(certificates),
    languages: stripClientIds(languages),
    ...(translated_data
      ? {
          translated_data: Object.fromEntries(
            Object.entries(translated_data).map(([language, translatedCV]) => [
              language,
              serializeCVData(translatedCV),
            ]),
          ),
        }
      : {}),
  };
}

export function createCVPackage(slug: string, template: string, cvData: CVSchema): CVPackageV1 {
  return {
    format: CV_PACKAGE_FORMAT,
    version: CV_PACKAGE_VERSION,
    slug: slug.trim().toLowerCase(),
    template,
    cv_data: serializeCVData(cvData),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertAllowedKeys(value: Record<string, unknown>, allowed: string[], path: string): void {
  const unexpected = Object.keys(value).find((key) => !allowed.includes(key));
  if (unexpected) throw new Error(`${path} chứa trường không hỗ trợ: ${unexpected}.`);
}

function assertString(value: unknown, path: string): void {
  if (typeof value !== 'string') throw new Error(`${path} phải là chuỗi.`);
}

function assertOptionalString(value: unknown, path: string): void {
  if (value !== undefined && value !== null) assertString(value, path);
}

function assertStringArray(value: unknown, path: string): void {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`${path} phải là danh sách chuỗi.`);
  }
}

function assertObject(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${path} phải là đối tượng.`);
  return value;
}

function assertArray(value: unknown, path: string): Record<string, unknown>[] {
  if (!Array.isArray(value)) throw new Error(`${path} phải là danh sách.`);
  return value.map((item, index) => assertObject(item, `${path}[${index}]`));
}

function validatePersonalInfo(value: unknown): void {
  const personalInfo = assertObject(value, 'cv_data.personalInfo');
  assertAllowedKeys(personalInfo, ['fullName', 'title', 'email', 'phone', 'location', 'website', 'github', 'linkedin', 'avatar', 'customLinks'], 'cv_data.personalInfo');
  assertString(personalInfo.fullName, 'cv_data.personalInfo.fullName');
  assertString(personalInfo.email, 'cv_data.personalInfo.email');
  ['title', 'phone', 'location', 'website', 'github', 'linkedin', 'avatar'].forEach((key) => assertOptionalString(personalInfo[key], `cv_data.personalInfo.${key}`));
  if (personalInfo.customLinks !== undefined && personalInfo.customLinks !== null) {
    assertArray(personalInfo.customLinks, 'cv_data.personalInfo.customLinks').forEach((link, index) => {
      assertAllowedKeys(link, ['id', 'label', 'url', 'icon'], `cv_data.personalInfo.customLinks[${index}]`);
      assertString(link.id, `cv_data.personalInfo.customLinks[${index}].id`);
      assertString(link.label, `cv_data.personalInfo.customLinks[${index}].label`);
      assertString(link.url, `cv_data.personalInfo.customLinks[${index}].url`);
      assertOptionalString(link.icon, `cv_data.personalInfo.customLinks[${index}].icon`);
    });
  }
}

function validateCVData(value: unknown, path = 'cv_data'): asserts value is Record<string, unknown> {
  const cvData = assertObject(value, path);
  assertAllowedKeys(cvData, ['personalInfo', 'summary', 'experience', 'education', 'projects', 'skills', 'certificates', 'languages', 'customSections', 'themeColor', 'fontFamily', 'layoutDensity', 'pageLayout', 'sectionOrder', 'themeMode', 'sectionGap', 'pagePadding', 'fontSize', 'sectionSettings', 'translated_data'], path);
  validatePersonalInfo(cvData.personalInfo);
  assertOptionalString(cvData.summary, `${path}.summary`);

  const itemRules: Array<[string, string[], string[]]> = [
    ['experience', ['company', 'position', 'startDate', 'endDate', 'description'], ['company', 'position', 'startDate', 'description']],
    ['education', ['institution', 'degree', 'startDate', 'endDate', 'description'], ['institution', 'degree', 'startDate']],
    ['projects', ['name', 'role', 'startDate', 'endDate', 'description', 'technologies', 'url', 'embedUrl'], ['name', 'role', 'startDate', 'description']],
    ['skills', ['category', 'skills'], ['category']],
    ['certificates', ['name', 'issuer', 'date', 'url'], ['name', 'issuer', 'date']],
    ['languages', ['name', 'level'], ['name', 'level']],
  ];

  itemRules.forEach(([key, allowed, required]) => {
    assertArray(cvData[key], `${path}.${key}`).forEach((item, index) => {
      const itemPath = `${path}.${key}[${index}]`;
      assertAllowedKeys(item, allowed, itemPath);
      required.forEach((field) => assertString(item[field], `${itemPath}.${field}`));
      allowed.filter((field) => !required.includes(field) && field !== 'technologies' && field !== 'skills').forEach((field) => assertOptionalString(item[field], `${itemPath}.${field}`));
      if (key === 'projects') assertStringArray(item.technologies, `${itemPath}.technologies`);
      if (key === 'skills') assertStringArray(item.skills, `${itemPath}.skills`);
    });
  });

  if (cvData.customSections !== undefined && cvData.customSections !== null) {
    assertArray(cvData.customSections, `${path}.customSections`).forEach((section, sectionIndex) => {
      const sectionPath = `${path}.customSections[${sectionIndex}]`;
      assertAllowedKeys(section, ['id', 'title', 'layoutStyle', 'items'], sectionPath);
      assertString(section.id, `${sectionPath}.id`);
      assertString(section.title, `${sectionPath}.title`);
      assertOptionalString(section.layoutStyle, `${sectionPath}.layoutStyle`);
      assertArray(section.items, `${sectionPath}.items`).forEach((item, itemIndex) => {
        const itemPath = `${sectionPath}.items[${itemIndex}]`;
        assertAllowedKeys(item, ['id', 'title', 'subtitle', 'date', 'url', 'description'], itemPath);
        assertString(item.id, `${itemPath}.id`);
        assertString(item.title, `${itemPath}.title`);
        ['subtitle', 'date', 'url', 'description'].forEach((field) => assertOptionalString(item[field], `${itemPath}.${field}`));
      });
    });
  }

  ['themeColor', 'fontFamily', 'layoutDensity', 'pageLayout', 'themeMode'].forEach((key) => assertOptionalString(cvData[key], `${path}.${key}`));
  if (cvData.sectionOrder !== undefined && cvData.sectionOrder !== null) assertStringArray(cvData.sectionOrder, `${path}.sectionOrder`);
  ['sectionGap', 'pagePadding', 'fontSize'].forEach((key) => {
    if (cvData[key] !== undefined && cvData[key] !== null && typeof cvData[key] !== 'number') throw new Error(`${path}.${key} phải là số.`);
  });
  if (cvData.sectionSettings !== undefined && cvData.sectionSettings !== null) {
    const settings = assertObject(cvData.sectionSettings, `${path}.sectionSettings`);
    Object.entries(settings).forEach(([key, setting]) => {
      const settingPath = `${path}.sectionSettings.${key}`;
      const sectionSetting = assertObject(setting, settingPath);
      assertAllowedKeys(sectionSetting, ['id', 'title', 'layoutStyle', 'hideFields'], settingPath);
      assertString(sectionSetting.id, `${settingPath}.id`);
      assertOptionalString(sectionSetting.title, `${settingPath}.title`);
      assertOptionalString(sectionSetting.layoutStyle, `${settingPath}.layoutStyle`);
      if (sectionSetting.hideFields !== undefined && sectionSetting.hideFields !== null) assertStringArray(sectionSetting.hideFields, `${settingPath}.hideFields`);
    });
  }
  if (cvData.translated_data !== undefined && cvData.translated_data !== null) {
    const translations = assertObject(cvData.translated_data, `${path}.translated_data`);
    Object.entries(translations).forEach(([language, translation]) => validateCVData(translation, `${path}.translated_data.${language}`));
  }
}

export function parseCVPackage(json: string): CVPackageV1 {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Tệp không phải JSON hợp lệ.');
  }
  const packageFile = assertObject(parsed, 'CV Package');
  assertAllowedKeys(packageFile, ['format', 'version', 'slug', 'template', 'cv_data'], 'CV Package');
  if (packageFile.format !== CV_PACKAGE_FORMAT) throw new Error('Tệp không phải CV Package được hỗ trợ.');
  if (packageFile.version !== CV_PACKAGE_VERSION) throw new Error('Phiên bản CV Package không được hỗ trợ.');
  assertString(packageFile.slug, 'slug');
  assertString(packageFile.template, 'template');
  validateCVData(packageFile.cv_data);
  return packageFile as unknown as CVPackageV1;
}

function addClientIds(cvData: Record<string, unknown>, prefix: string): CVSchema {
  const addIds = (key: string) => ((cvData[key] as Record<string, unknown>[]) || []).map((item, index) => ({
    ...item,
    id: `${prefix}-${key}-${index}-${Date.now()}`,
  }));
  const translations = cvData.translated_data as Record<string, Record<string, unknown>> | undefined;

  return {
    ...cvData,
    experience: addIds('experience'),
    education: addIds('education'),
    projects: addIds('projects'),
    skills: addIds('skills'),
    certificates: addIds('certificates'),
    languages: addIds('languages'),
    ...(translations
      ? {
          translated_data: Object.fromEntries(
            Object.entries(translations).map(([language, translation]) => [
              language,
              addClientIds(translation, `${prefix}-${language}`),
            ]),
          ),
        }
      : {}),
  } as CVSchema;
}

export function hydrateCVPackage(packageFile: CVPackageV1): CVSchema {
  return addClientIds(packageFile.cv_data, packageFile.slug);
}

export function downloadCVPackage(packageFile: CVPackageV1): void {
  const blob = new Blob([JSON.stringify(packageFile, null, 2)], { type: 'application/json;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = `${packageFile.slug || 'untitled-cv'}.cv-package.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}
