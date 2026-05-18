import { Plus, Trash2 } from 'lucide-react';
import { useCVEditorContext } from '../context/CVEditorContext';
import { AIEnhancer } from '../components/AIEnhancer';

export function ProjectsForm() {
  const { cvData, dispatch, t, addProject, removeProject } = useCVEditorContext();
  return (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-300">Dự án Thực tế</h3>
                      <button
                        type="button"
                        onClick={addProject}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-xl border border-slate-700/50"
                      >
                        <Plus className="h-3.5 w-3.5" /> {t('addProject')}
                      </button>
                    </div>

                    {cvData.projects.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-6">Chưa có thông tin dự án cá nhân.</p>
                    ) : (
                      cvData.projects.map((proj, index) => (
                        <div key={proj.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 relative">
                          <button
                            type="button"
                            onClick={() => removeProject(proj.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="absolute top-4 left-4 bg-slate-800 text-slate-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded">#{index + 1}</span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">{t('projectNameLabel')}</label>
                              <input
                                type="text"
                                value={proj.name}
                                onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', id: proj.id, payload: { name: e.target.value } })}
                                placeholder="Hệ thống AI CV"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Vai trò của bạn</label>
                              <input
                                type="text"
                                value={proj.role}
                                onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', id: proj.id, payload: { role: e.target.value } })}
                                placeholder="Kỹ sư chính / Leader"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Thời gian / Năm</label>
                              <input
                                type="text"
                                value={proj.startDate}
                                onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', id: proj.id, payload: { startDate: e.target.value } })}
                                placeholder="2024"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">URL Dự án (GitHub / Live Link)</label>
                              <input
                                type="text"
                                value={proj.url || ""}
                                onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', id: proj.id, payload: { url: e.target.value } })}
                                placeholder="https://github.com/project"
                                className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550 mb-1">Công nghệ sử dụng (Cách nhau bằng dấu phẩy)</label>
                            <input
                              type="text"
                              value={proj.technologies.join(", ")}
                              onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', id: proj.id, payload: { technologies: e.target.value.split(',').map((s: string) => s.trim()) } })}
                              placeholder="React, TypeScript, Tailwind, FastAPI"
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-550">Mô tả chi tiết dự án</label>
                              <AIEnhancer
                                value={proj.description}
                                type="experience"
                                onAccept={(newValue) => dispatch({ type: 'UPDATE_PROJECT', id: proj.id, payload: { description: newValue } })}
                              />
                            </div>
                            <textarea
                              value={proj.description}
                              onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', id: proj.id, payload: { description: e.target.value } })}
                              placeholder="Mô tả các tính năng cốt lõi và kết quả dự án..."
                              rows={2}
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none font-sans leading-relaxed resize-y"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
  );
}
