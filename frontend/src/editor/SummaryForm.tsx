import React from 'react';

import type { CVSchema } from '../types';
import { TRANSLATIONS } from '../constants';

export interface SummaryFormProps {
  cvData: CVSchema;
  setCvData: React.Dispatch<React.SetStateAction<CVSchema>>;
  t: (key: keyof typeof TRANSLATIONS.vi) => string;
  language: 'vi' | 'en';
}

export function SummaryForm({ cvData, setCvData, t, language: _language }: SummaryFormProps) {
  return (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-300 mb-1">{t('summaryTitle')}</h3>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                      {t('summaryDesc')}
                    </p>
                    <textarea
                      value={cvData.summary || ""}
                      onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                      placeholder={t('summaryPlaceholder')}
                      rows={6}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none font-sans leading-relaxed resize-y"
                    />
                  </div>
  );
}
