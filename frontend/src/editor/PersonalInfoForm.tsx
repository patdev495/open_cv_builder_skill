import { User, Camera, Plus, Trash2 } from 'lucide-react';
import { useCVEditorContext } from '../context/CVEditorContext';

export function PersonalInfoForm() {
  const { cvData, dispatch, t, handleAvatarUpload, handleAvatarDelete } = useCVEditorContext();
  const customLinks = cvData.personalInfo.customLinks || [];

  const handleAddLink = () => {
    const newLinks = [...customLinks, { id: `link-${Date.now()}`, label: '', url: '', icon: '' }];
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { customLinks: newLinks } });
  };

  const handleUpdateLink = (id: string, field: string, value: string) => {
    const newLinks = customLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    );
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { customLinks: newLinks } });
  };

  const handleRemoveLink = (id: string) => {
    const newLinks = customLinks.filter(link => link.id !== id);
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { customLinks: newLinks } });
  };

  return (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-300 mb-2">{t('personalInfo')}</h3>
                    
                    {/* Premium Avatar Uploader */}
                    <div className="flex items-center gap-4 mb-2 pb-4 border-b border-slate-800/80">
                      <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-slate-700 hover:border-purple-500 transition-all cursor-pointer bg-slate-950 flex items-center justify-center">
                        {cvData.personalInfo.avatar ? (
                          <img src={cvData.personalInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-8 w-8 text-slate-500 group-hover:text-slate-300 transition-colors" />
                        )}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-[10px] text-white font-semibold transition-opacity cursor-pointer">
                          <Camera className="h-4 w-4" />
                          <span>{t('uploadPhoto')}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-300">{t('avatarPhoto')}</span>
                        <span className="text-[10px] text-slate-500">JPG, PNG, WEBP. Tối đa 150KB (tự động nén)</span>
                        {cvData.personalInfo.avatar && (
                          <button
                            type="button"
                            onClick={handleAvatarDelete}
                            className="mt-1 self-start text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer"
                          >
                            {t('deletePhoto')}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('fullName')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.fullName}
                          onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { fullName: e.target.value } })}
                          placeholder="Nguyễn Văn A"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('jobTitle')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.title || ""}
                          onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { title: e.target.value } })}
                          placeholder="Senior Full Stack Engineer"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                        <input
                          type="email"
                          value={cvData.personalInfo.email}
                          onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { email: e.target.value } })}
                          placeholder="a@gmail.com"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('phone')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.phone || ""}
                          onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { phone: e.target.value } })}
                          placeholder="0987654321"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('location')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.location || ""}
                          onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { location: e.target.value } })}
                          placeholder="Hà Nội, Việt Nam"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('website')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.website || ""}
                          onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { website: e.target.value } })}
                          placeholder="https://vana.dev"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.github || ""}
                          onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { github: e.target.value } })}
                          placeholder="https://github.com/Nguyenvana"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.linkedin || ""}
                          onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { linkedin: e.target.value } })}
                          placeholder="https://linkedin.com/in/Nguyenvana"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Custom contact links section */}
                    <div className="mt-6 pt-6 border-t border-slate-800/80">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          {t('customLinks' as any)}
                        </h4>
                        <button
                          type="button"
                          onClick={handleAddLink}
                          className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer bg-slate-850 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-800"
                        >
                          <Plus className="h-3 w-3" /> {t('addCustomLink' as any)}
                        </button>
                      </div>

                      {customLinks.length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic py-2">
                          Chưa có liên kết tùy chỉnh nào được thêm.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {customLinks.map((link) => (
                            <div
                              key={link.id}
                              className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all relative group"
                            >
                              <div className="sm:col-span-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                  {t('linkTitle' as any)}
                                </label>
                                <input
                                  type="text"
                                  value={link.label}
                                  onChange={(e) => handleUpdateLink(link.id, 'label', e.target.value)}
                                  placeholder="e.g. Portfolio"
                                  className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                  {t('linkUrl' as any)}
                                </label>
                                <input
                                  type="text"
                                  value={link.url}
                                  onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                                  placeholder="https://..."
                                  className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                                />
                              </div>

                              <div className="sm:col-span-1 flex gap-2 items-end">
                                <div className="flex-1">
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                    {t('linkIcon' as any)}
                                  </label>
                                  <select
                                    value={link.icon || ''}
                                    onChange={(e) => handleUpdateLink(link.id, 'icon', e.target.value)}
                                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                                  >
                                    <option value="">{t('iconPlaceholder' as any)}</option>
                                    <option value="globe">Globe</option>
                                    <option value="github">GitHub</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="twitter">Twitter</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="mail">Mail</option>
                                    <option value="phone">Phone</option>
                                    <option value="map-pin">MapPin</option>
                                    <option value="link">Link</option>
                                    <option value="award">Award</option>
                                    <option value="book-open">Book</option>
                                    <option value="graduation-cap">Academic</option>
                                    <option value="briefcase">Work</option>
                                    <option value="code">Code</option>
                                  </select>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveLink(link.id)}
                                  className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-slate-900 rounded cursor-pointer transition-colors"
                                  title="Xóa liên kết"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
  );
}
