import React from 'react';
import { User, Camera } from 'lucide-react';
import type { CVSchema } from '../types';
import { TRANSLATIONS } from '../constants';

export interface PersonalInfoFormProps {
  cvData: CVSchema;
  setCvData: React.Dispatch<React.SetStateAction<CVSchema>>;
  t: (key: keyof typeof TRANSLATIONS.vi) => string;
  language: 'vi' | 'en';
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarDelete: () => void;
}

export function PersonalInfoForm({ cvData, setCvData, t, language: _language, handleAvatarUpload, handleAvatarDelete }: PersonalInfoFormProps) {
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
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, fullName: e.target.value }
                          })}
                          placeholder="Nguyễn Văn A"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('jobTitle')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.title || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, title: e.target.value }
                          })}
                          placeholder="Senior Full Stack Engineer"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                        <input
                          type="email"
                          value={cvData.personalInfo.email}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, email: e.target.value }
                          })}
                          placeholder="a@gmail.com"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('phone')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.phone || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                          })}
                          placeholder="0987654321"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('location')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.location || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, location: e.target.value }
                          })}
                          placeholder="Hà Nội, Việt Nam"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">{t('website')}</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.website || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, website: e.target.value }
                          })}
                          placeholder="https://vana.dev"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.github || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, github: e.target.value }
                          })}
                          placeholder="https://github.com/Nguyenvana"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={cvData.personalInfo.linkedin || ""}
                          onChange={(e) => setCvData({
                            ...cvData,
                            personalInfo: { ...cvData.personalInfo, linkedin: e.target.value }
                          })}
                          placeholder="https://linkedin.com/in/Nguyenvana"
                          className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
  );
}
