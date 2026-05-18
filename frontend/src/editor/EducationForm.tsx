import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { CVSchema } from '../types';
import { TRANSLATIONS } from '../constants';

export interface EducationFormProps {
  cvData: CVSchema;
  setCvData: React.Dispatch<React.SetStateAction<CVSchema>>;
  t: (key: keyof typeof TRANSLATIONS.vi) => string;
  language: 'vi' | 'en';
  addEducation: () => void;
  removeEducation: (id: string) => void;
}

export function EducationForm({ cvData, setCvData, t, language: _language, addEducation, removeEducation }: EducationFormProps) {
  return (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-300">Quá trình {t('educationTitle')}</h3>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50"
                      >
                        <Plus className="h-3.5 w-3.5" /> Thêm học vị
                      </button>
                    </div>

                    {cvData.education.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-6">{t('emptyEducation')}</p>
                    ) : (
                      cvData.education.map((edu, index) => (
                        <div key={edu.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 relative">
                          <button
                            type="button"
                            onClick={() => removeEducation(edu.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="absolute top-4 left-4 bg-slate-800 text-slate-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded">#{index + 1}</span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Tên Trường / Viện</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => {
                                  const list = [...cvData.education];
                                  list[index].institution = e.target.value;
                                  setCvData({ ...cvData, education: list });
                                }}
                                placeholder={t('schoolPlaceholder')}
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('degreeLabel')}</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => {
                                  const list = [...cvData.education];
                                  list[index].degree = e.target.value;
                                  setCvData({ ...cvData, education: list });
                                }}
                                placeholder="Cử nhân Công nghệ thông tin"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('startDateLabel')}</label>
                              <input
                                type="text"
                                value={edu.startDate}
                                onChange={(e) => {
                                  const list = [...cvData.education];
                                  list[index].startDate = e.target.value;
                                  setCvData({ ...cvData, education: list });
                                }}
                                placeholder="2016-09"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('endDateLabel')}</label>
                              <input
                                type="text"
                                value={edu.endDate || ""}
                                onChange={(e) => {
                                  const list = [...cvData.education];
                                  list[index].endDate = e.target.value;
                                  setCvData({ ...cvData, education: list });
                                }}
                                placeholder="2021-06"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Mô tả thành tựu / Điểm số (Tùy chọn)</label>
                            <input
                              type="text"
                              value={edu.description || ""}
                              onChange={(e) => {
                                const list = [...cvData.education];
                                list[index].description = e.target.value;
                                setCvData({ ...cvData, education: list });
                              }}
                              placeholder="Tốt nghiệp loại Giỏi, GPA 3.6"
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
  );
}
