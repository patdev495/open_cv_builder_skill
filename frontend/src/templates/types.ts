import type { CVSchema } from '../types';

export interface ColorTheme {
  primary: string;
  bg: string;
  border: string;
  lightBg: string;
  pill: string;
}

export interface TemplateProps {
  cvData: CVSchema;
  activeColor: ColorTheme;
  t: any;
  slug?: string;
}
