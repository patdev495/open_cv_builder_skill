import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { CVSchema } from '../types';
import { TRANSLATIONS } from '../constants';

export interface SkillsFormProps {
  cvData: CVSchema;
  setCvData: React.Dispatch<React.SetStateAction<CVSchema>>;
  t: (key: keyof typeof TRANSLATIONS.vi) => string;
  language: 'vi' | 'en';
  addSkill: () => void;
  removeSkill: (id: string) => void;
}

export function SkillsForm({ cvData, setCvData, t, language: _language, addSkill, removeSkill }: SkillsFormProps) {
  return (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-300">Phân nhóm Kỹ năng</h3>
                      <button
                        type="button"
                        onClick={addSkill}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50"
                      >
                        <Plus className="h-3.5 w-3.5" /> Thêm nhóm
                      </button>
                    </div>

                    {cvData.skills.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-6">{t('emptySkills')}</p>
                    ) : (
                      cvData.skills.map((grp, index) => (
                        <div key={grp.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 relative">
                          <button
                            type="button"
                            onClick={() => removeSkill(grp.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="absolute top-4 left-4 bg-slate-800 text-slate-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded">#{index + 1}</span>

                          <div className="grid grid-cols-1 gap-3 mt-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Tên Nhóm (Category)</label>
                              <input
                                type="text"
                                value={grp.category}
                                onChange={(e) => {
                                  const list = [...cvData.skills];
                                  list[index].category = e.target.value;
                                  setCvData({ ...cvData, skills: list });
                                }}
                                placeholder="Ví dụ: Frontend, Backend, Cloud..."
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Các kỹ năng (Phân tách bằng dấu phẩy)</label>
                              <input
                                type="text"
                                value={grp.skills.join(", ")}
                                onChange={(e) => {
                                  const list = [...cvData.skills];
                                  list[index].skills = e.target.value.split(",").map(s => s.trim());
                                  setCvData({ ...cvData, skills: list });
                                }}
                                placeholder="React, Next.js, HTML, CSS"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
  );
}
