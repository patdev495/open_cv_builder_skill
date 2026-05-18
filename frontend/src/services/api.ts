import type { CVSchema, CVResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function fetchCV(slug: string): Promise<CVResponse> {
  const response = await fetch(`${API_BASE_URL}/cvs/${slug}`);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Không thể tìm thấy CV với đường dẫn này.');
  }
  return response.json();
}

export async function createCV(
  slug: string,
  passcode: string,
  template: string,
  cvData: CVSchema
): Promise<CVResponse> {
  // Strip client-side helper ID fields before sending to backend to match Pydantic schema perfectly
  const cleanCvData = cleanClientIds(cvData);
  
  const response = await fetch(`${API_BASE_URL}/cvs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: slug.trim().toLowerCase(),
      passcode,
      template,
      cv_data: cleanCvData
    }),
  });
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Lỗi khi tạo mới CV.');
  }
  return response.json();
}

export async function updateCV(
  slug: string,
  passcode: string,
  template: string,
  cvData: CVSchema
): Promise<CVResponse> {
  const cleanCvData = cleanClientIds(cvData);

  const response = await fetch(`${API_BASE_URL}/cvs/${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      passcode,
      template,
      cv_data: cleanCvData
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Mật mã không đúng hoặc lỗi khi cập nhật CV.');
  }
  return response.json();
}

export async function verifyPasscode(slug: string, passcode: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/cvs/${slug}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  });
  return response.ok;
}

/**
 * Strips client-side unique IDs (used for React key lists) 
 * so the backend receives clean Pydantic-compatible objects.
 */
function cleanClientIds(cvData: CVSchema): any {
  const { experience, education, projects, skills, certificates, languages, ...rest } = cvData;
  
  const stripId = (arr: any[]) => arr.map(({ id, ...item }) => item);
  
  return {
    ...rest,
    experience: stripId(experience),
    education: stripId(education),
    projects: stripId(projects),
    skills: stripId(skills),
    certificates: stripId(certificates),
    languages: stripId(languages),
  };
}
export async function checkSlugAvailable(slug: string): Promise<boolean> {
  try {
    await fetchCV(slug);
    return false; // Already taken
  } catch (error) {
    return true; // Not found (available)
  }
}

export async function optimizeWithAI(
  text: string,
  type: 'summary' | 'experience',
  language: 'vi' | 'en'
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/ai/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      type,
      language
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || 'Không thể kết nối với dịch vụ AI.');
  }

  const data = await response.json();
  return data.optimized_text;
}
