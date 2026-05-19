import { Plus, Trash2 } from 'lucide-react';
import { useCVEditorContext } from '../context/CVEditorContext';
import { AIEnhancer } from '../components/AIEnhancer';
import { SectionSettingsControl } from '../components/SectionSettingsControl';

export function ExperienceForm() {
  const { cvData, dispatch, t, addExperience, removeExperience } = useCVEditorContext();
  return (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-300">{t('experienceTitle')}</h3>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50"
                      >
                        <Plus className="h-3.5 w-3.5" /> {t('addExperience')}
                      </button>
                    </div>

                    <SectionSettingsControl
                      sectionId="experience"
                      allowedFields={[{ key: 'role', labelKey: 'hideRole' }]}
                    />

                    {cvData.experience.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-6">{t('emptyExperience')}</p>
                    ) : (
                      cvData.experience.map((exp, index) => (
                        <div key={exp.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 relative">
                          <button
                            type="button"
                            onClick={() => removeExperience(exp.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                            title="Xóa công việc"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="absolute top-4 left-4 bg-slate-800 text-slate-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded">#{index + 1}</span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('companyLabel')}</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { company: e.target.value } })}
                                placeholder={t('companyPlaceholder')}
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('positionLabel')}</label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { position: e.target.value } })}
                                placeholder={t('positionPlaceholder')}
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('startDateLabel')}</label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { startDate: e.target.value } })}
                                placeholder={t('datePlaceholder')}
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('endDateLabel')}</label>
                              <input
                                type="text"
                                value={exp.endDate || ""}
                                onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { endDate: e.target.value } })}
                                placeholder={t('datePlaceholder')}
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550">{t('descLabel')}</label>
                              <AIEnhancer
                                value={exp.description}
                                type="experience"
                                onAccept={(newValue) => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { description: newValue } })}
                              />
                            </div>
                            <textarea
                              value={exp.description}
                              onChange={(e) => dispatch({ type: 'UPDATE_EXPERIENCE', id: exp.id, payload: { description: e.target.value } })}
                              placeholder="- Quản lý dự án...\n- Tối ưu hóa API..."
                              rows={3}
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none font-sans leading-relaxed resize-y"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
  );
}
