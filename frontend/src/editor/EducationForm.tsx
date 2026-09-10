import { Plus, Trash2 } from 'lucide-react';
import { useCVEditorContext } from '../context/CVEditorContext';
import { SectionSettingsControl } from '../components/SectionSettingsControl';

export function EducationForm() {
  const { cvData, dispatch, t, addEducation, removeEducation } = useCVEditorContext();
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

                    <SectionSettingsControl
                      sectionId="education"
                      allowedFields={[{ key: 'role', labelKey: 'hideRole' }]}
                    />

                    {cvData.education.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-6">{t('emptyEducation')}</p>
                    ) : (
                      cvData.education.map((edu, index) => (
                        <div key={edu.id} className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col gap-3.5 relative group shadow-sm">
                          <button
                            type="button"
                            onClick={() => removeEducation(edu.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                            title="Xóa học vấn"
                            aria-label="Xóa học vấn"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="absolute top-4 left-4 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">#{index + 1}</span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tên Trường / Viện</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { institution: e.target.value } })}
                                placeholder={t('schoolPlaceholder')}
                                className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('degreeLabel')}</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { degree: e.target.value } })}
                                placeholder="Cử nhân Công nghệ thông tin"
                                className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('startDateLabel')}</label>
                              <input
                                type="text"
                                value={edu.startDate}
                                onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { startDate: e.target.value } })}
                                placeholder="2016-09"
                                className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('endDateLabel')}</label>
                              <input
                                type="text"
                                value={edu.endDate || ""}
                                onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { endDate: e.target.value } })}
                                placeholder="2021-06"
                                className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Mô tả thành tựu / Điểm số (Tùy chọn)</label>
                            <input
                              type="text"
                              value={edu.description || ""}
                              onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', id: edu.id, payload: { description: e.target.value } })}
                              placeholder="Tốt nghiệp loại Giỏi, GPA 3.6"
                              className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none transition-colors"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
  );
}
