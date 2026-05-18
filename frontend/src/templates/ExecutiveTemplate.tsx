import { User, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Languages, ExternalLink } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';

export default function ExecutiveTemplate({ cvData, activeColor, t }: TemplateProps) {
  return (
    <div className="flex-1 flex flex-col text-sm">
                  {/* Top Header */}
                  <div className={`border-b-[4px] ${activeColor.border} pb-5 mb-5`}>
                    <h1 className="text-3.5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight m-0 uppercase">
                      {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                    </h1>
                    <p className={`${activeColor.primary} font-bold text-sm tracking-widest uppercase mt-1.5`}>
                      {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 flex-1">
                    {/* Left Wide Section (2/3) */}
                    <div className="col-span-2 flex flex-col gap-5 pr-4 border-r border-slate-100 dark:border-slate-800 dark:border-slate-400 print:border-slate-350">
                      {/* Summary */}
                      {cvData.summary && (
                        <div className="flex flex-col gap-2">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-0.5 flex items-center gap-1.5`}>
                            <User className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('summaryUpper')}
                          </h3>
                          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 text-justify">{cvData.summary}</p>
                        </div>
                      )}

                      {/* Experience */}
                      {cvData.experience.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-0.5 flex items-center gap-1.5`}>
                            <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('experienceUpper')}
                          </h3>
                          <div className="flex flex-col gap-4">
                            {cvData.experience.map((exp) => (
                              <div key={exp.id} className="flex flex-col gap-1">
                                <div className="flex justify-between items-start text-xs">
                                  <div>
                                    <span className="font-extrabold text-slate-900 dark:text-slate-100">{exp.company}</span>
                                    <span className="text-slate-400 mx-1.5">•</span>
                                    <span className={`font-semibold ${activeColor.primary}`}>{exp.position}</span>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line mt-1 print:text-black">
                                  {exp.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {cvData.projects.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-0.5 flex items-center gap-1.5`}>
                            <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('projectsUpper')}
                          </h3>
                          <div className="flex flex-col gap-4">
                            {cvData.projects.map((proj) => (
                              <div key={proj.id} className="flex flex-col gap-1">
                                <div className="flex justify-between items-center text-xs">
                                  <div>
                                    <span className="font-extrabold text-slate-900 dark:text-slate-100">{proj.name}</span>
                                    {proj.url && (
                                      <a
                                        href={proj.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline ml-2 font-bold print:text-black print:no-underline`}
                                      >
                                        <ExternalLink className="h-2.5 w-2.5" />
                                        {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
                                      </a>
                                    )}
                                    <span className="text-slate-400 mx-1.5">•</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold italic">{proj.role}</span>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{proj.startDate}</span>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line mt-1 print:text-black">
                                  {proj.description}
                                </p>
                                <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {cvData.education.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-0.5 flex items-center gap-1.5`}>
                            <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('educationUpper')}
                          </h3>
                          {cvData.education.map((edu) => (
                            <div key={edu.id} className="flex flex-col gap-0.5 text-xs">
                              <div className="flex justify-between items-start">
                                <span className="font-extrabold text-slate-900 dark:text-slate-100">{edu.institution}</span>
                                <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
                              </div>
                              <div className="text-slate-600 dark:text-slate-400 font-semibold">{edu.degree}</div>
                              {edu.description && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Narrow Column (1/3) with beautiful Glassmorphism sidebar styling */}
                    <div className="col-span-1 flex flex-col gap-5 glass-sidebar">
                      {cvData.personalInfo.avatar && (
                        <div className="flex justify-center mb-1">
                          <img 
                            src={cvData.personalInfo.avatar} 
                            alt="Avatar" 
                            className={`w-24 h-24 rounded-full object-cover border-2 ${activeColor.border} p-0.5`} 
                          />
                        </div>
                      )}
                      {/* Contacts Info */}
                      <div className="flex flex-col gap-2">
                        <h4 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono border-b border-slate-250 pb-1 mb-1`}>
                          {t('personalInfo')}
                        </h4>
                        <div className="flex flex-col gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                          <div className="truncate" title={cvData.personalInfo.email}>
                            <span className="font-bold text-slate-800 dark:text-slate-200">Email:</span> {cvData.personalInfo.email}
                          </div>
                          {cvData.personalInfo.phone && (
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200">SĐT:</span> {cvData.personalInfo.phone}
                            </div>
                          )}
                          {cvData.personalInfo.location && (
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200">ĐC:</span> {cvData.personalInfo.location}
                            </div>
                          )}
                          {cvData.personalInfo.website && (
                            <div className="truncate">
                              <span className="font-bold text-slate-800 dark:text-slate-200">Web:</span> <a href={cvData.personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-700 dark:text-slate-300 font-medium">{cvData.personalInfo.website.replace(/^https?:\/\//, '')}</a>
                            </div>
                          )}
                          {cvData.personalInfo.github && (
                            <div className="truncate">
                              <span className="font-bold text-slate-800 dark:text-slate-200">Git:</span> <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-700 dark:text-slate-300 font-medium">github.com/{cvData.personalInfo.github.split('/').pop()}</a>
                            </div>
                          )}
                          {cvData.personalInfo.linkedin && (
                            <div className="truncate">
                              <span className="font-bold text-slate-800 dark:text-slate-200">In:</span> <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-700 dark:text-slate-300 font-medium">linkedin.com/in/{cvData.personalInfo.linkedin.split('/').pop()}</a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Technical Skills */}
                      {cvData.skills.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-1 flex items-center gap-1.5`}>
                            <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('skillsUpper')}
                          </h3>
                          {cvData.skills.map((grp) => (
                            <div key={grp.id} className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{grp.category}</span>
                              <div className="flex flex-wrap gap-1">
                                {grp.skills.filter(Boolean).map((s, idx) => (
                                  <span key={idx} className={`${activeColor.pill} px-2 py-0.5 rounded text-[10px] font-semibold`}>
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Languages */}
                      {cvData.languages.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-1 flex items-center gap-1.5`}>
                            <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('languagesUpper')}
                          </h3>
                          <div className="flex flex-col gap-1.5">
                            {cvData.languages.map((l) => (
                              <div key={l.id} className="text-xs flex flex-col gap-0.5">
                                <span className="font-bold text-slate-800 dark:text-slate-200">{l.name}</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certificates */}
                      {cvData.certificates.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-mono pb-1 flex items-center gap-1.5`}>
                            <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('certificatesUpper')}
                          </h3>
                          {cvData.certificates.map((c) => (
                            <div key={c.id} className="text-xs flex flex-col gap-0.5">
                              <span className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{c.name}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{c.issuer} ({c.date})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
  );
}
