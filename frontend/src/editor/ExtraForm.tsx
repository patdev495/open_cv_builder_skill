import React from 'react';
import { Award, Languages, Plus, Trash2 } from 'lucide-react';
import type { CVSchema } from '../types';
import { TRANSLATIONS } from '../constants';

export interface ExtraFormProps {
  cvData: CVSchema;
  setCvData: React.Dispatch<React.SetStateAction<CVSchema>>;
  t: (key: keyof typeof TRANSLATIONS.vi) => string;
  language: 'vi' | 'en';
  addCertificate: () => void;
  removeCertificate: (id: string) => void;
  addLanguage: () => void;
  removeLanguage: (id: string) => void;
}

export function ExtraForm({ cvData, setCvData, t, language: _language, addCertificate, removeCertificate, addLanguage, removeLanguage }: ExtraFormProps) {
  return (
                  <div className="flex flex-col gap-8">
                    
                    {/* A. Certificates */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-400" />
                          {t('certTitle')}
                        </h3>
                        <button
                          type="button"
                          onClick={addCertificate}
                          className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/50"
                        >
                          <Plus className="h-3 w-3" /> {t('addCert')}
                        </button>
                      </div>

                      {cvData.certificates.length === 0 ? (
                        <p className="text-xs text-slate-550 italic text-center py-2">{t('emptyCert')}</p>
                      ) : (
                        cvData.certificates.map((cert, index) => (
                          <div key={cert.id} className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 flex flex-col gap-2 relative">
                            <button
                              type="button"
                              onClick={() => removeCertificate(cert.id)}
                              className="absolute top-3 right-3 text-slate-500 hover:text-rose-450 p-1 hover:bg-slate-900 rounded cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">{t('certNameLabel')}</label>
                                <input
                                  type="text"
                                  value={cert.name}
                                  onChange={(e) => {
                                    const list = [...cvData.certificates];
                                    list[index].name = e.target.value;
                                    setCvData({ ...cvData, certificates: list });
                                  }}
                                  placeholder="AWS Solutions Architect"
                                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">{t('issuerLabel')}</label>
                                <input
                                  type="text"
                                  value={cert.issuer}
                                  onChange={(e) => {
                                    const list = [...cvData.certificates];
                                    list[index].issuer = e.target.value;
                                    setCvData({ ...cvData, certificates: list });
                                  }}
                                  placeholder="Amazon Web Services"
                                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">{t('dateLabel')}</label>
                                <input
                                  type="text"
                                  value={cert.date}
                                  onChange={(e) => {
                                    const list = [...cvData.certificates];
                                    list[index].date = e.target.value;
                                    setCvData({ ...cvData, certificates: list });
                                  }}
                                  placeholder="2023"
                                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* B. Languages */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                          <Languages className="h-4 w-4 text-purple-400" />
                          {t('langTitle')}
                        </h3>
                        <button
                          type="button"
                          onClick={addLanguage}
                          className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/50"
                        >
                          <Plus className="h-3 w-3" /> {t('addLang')}
                        </button>
                      </div>

                      {cvData.languages.length === 0 ? (
                        <p className="text-xs text-slate-550 italic text-center py-2">{t('emptyLang')}</p>
                      ) : (
                        cvData.languages.map((lang, index) => (
                          <div key={lang.id} className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 flex flex-col gap-2 relative">
                            <button
                              type="button"
                              onClick={() => removeLanguage(lang.id)}
                              className="absolute top-3 right-3 text-slate-500 hover:text-rose-450 p-1 hover:bg-slate-900 rounded cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">Tên {t('langTitle')}</label>
                                <input
                                  type="text"
                                  value={lang.name}
                                  onChange={(e) => {
                                    const list = [...cvData.languages];
                                    list[index].name = e.target.value;
                                    setCvData({ ...cvData, languages: list });
                                  }}
                                  placeholder={t('langPlaceholder')}
                                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold uppercase text-slate-500 mb-0.5">{t('langLevelLabel')}</label>
                                <input
                                  type="text"
                                  value={lang.level}
                                  onChange={(e) => {
                                    const list = [...cvData.languages];
                                    list[index].level = e.target.value;
                                    setCvData({ ...cvData, languages: list });
                                  }}
                                  placeholder={t('langLevelPlaceholder')}
                                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>
  );
}
