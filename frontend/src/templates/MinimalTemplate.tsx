import { User, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Languages, ExternalLink } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';

export default function MinimalTemplate({ cvData, activeColor, t }: TemplateProps) {
  return (
    <div className="flex flex-col flex-1 gap-6 text-sm">
                  {/* Elegant Editorial Header */}
                  <div className="text-center flex flex-col items-center gap-1.5 pb-4 border-b border-slate-250 print:border-slate-350">
                    {cvData.personalInfo.avatar && (
                      <img 
                        src={cvData.personalInfo.avatar} 
                        alt="Avatar" 
                        className="w-20 h-20 rounded-full object-cover border border-slate-300 mb-2" 
                      />
                    )}
                    <h1 className="text-3.5xl font-light tracking-wide text-slate-900 uppercase font-serif">
                      {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                    </h1>
                    <p className={`${activeColor.primary} font-semibold text-xs tracking-widest uppercase font-serif`}>
                      {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-slate-500 text-xs font-mono mt-1 print:text-black print:justify-center print:flex-wrap">
                      <span>{cvData.personalInfo.email}</span>
                      {cvData.personalInfo.phone && <span>• {cvData.personalInfo.phone}</span>}
                      {cvData.personalInfo.location && <span>• {cvData.personalInfo.location}</span>}
                      {cvData.personalInfo.website && (
                        <span>
                          • <a href={cvData.personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {cvData.personalInfo.website.replace(/^https?:\/\//, '')}
                          </a>
                        </span>
                      )}
                      {cvData.personalInfo.github && (
                        <span>
                          • <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            github.com/{cvData.personalInfo.github.split('/').pop()}
                          </a>
                        </span>
                      )}
                      {cvData.personalInfo.linkedin && (
                        <span>
                          • <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            linkedin.com/in/{cvData.personalInfo.linkedin.split('/').pop()}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Linear clean sections */}
                  
                  {/* Summary */}
                  {cvData.summary && (
                    <div className="flex flex-col gap-2">
                      <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center justify-center gap-1.5 font-serif`}>
                        <User className="h-3.5 w-3.5 stroke-[2.5]" />
                        {t('summaryUpper')}
                      </h3>
                      <div className={`w-8 h-0.5 ${activeColor.bg} mx-auto mb-1`}></div>
                      <p className="text-xs leading-relaxed text-slate-700 text-center max-w-xl mx-auto italic">
                        "{cvData.summary}"
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {cvData.experience.length > 0 && (
                    <div className="flex flex-col gap-4">
                      <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center justify-center gap-1.5 font-serif`}>
                        <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                        {t('experienceUpper')}
                      </h3>
                      <div className={`w-8 h-0.5 ${activeColor.bg} mx-auto mb-2`}></div>
                      <div className="flex flex-col gap-4">
                        {cvData.experience.map((exp) => (
                          <div key={exp.id} className="flex flex-col gap-1">
                            <div className="flex justify-between items-baseline text-xs">
                              <div>
                                <span className="font-bold text-slate-900 font-serif text-sm">{exp.company}</span>
                                <span className="mx-2 text-slate-450">•</span>
                                <span className="text-slate-655 font-medium italic">{exp.position}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 print:text-black">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-655 text-justify mt-0.5 whitespace-pre-line print:text-black">
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
                      <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center justify-center gap-1.5 font-serif`}>
                        <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                        {t('projectsUpper')}
                      </h3>
                      <div className={`w-8 h-0.5 ${activeColor.bg} mx-auto mb-2`}></div>
                      <div className="flex flex-col gap-4">
                        {cvData.projects.map((proj) => (
                          <div key={proj.id} className="flex flex-col gap-1">
                            <div className="flex justify-between items-baseline text-xs">
                              <div>
                                <span className="font-bold text-slate-900 font-serif text-sm">{proj.name}</span>
                                {proj.url && (
                                  <a
                                    href={proj.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline ml-2 font-bold print:text-black print:no-underline font-mono`}
                                  >
                                    <ExternalLink className="h-2.5 w-2.5" />
                                    {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
                                  </a>
                                )}
                                <span className="mx-2 text-slate-450">•</span>
                                <span className="text-slate-500 font-medium italic text-[11px]">{proj.role}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 print:text-black">{proj.startDate}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-655 text-justify mt-0.5 whitespace-pre-line print:text-black">
                              {proj.description}
                            </p>
                            <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grid elements at bottom */}
                  <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-4 print:border-slate-350">
                    
                    {/* Left Grid: Education & Certs */}
                    <div className="flex flex-col gap-5">
                      {/* Education */}
                      {cvData.education.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}>
                            <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('educationUpper')}
                          </h3>
                          {cvData.education.map((edu) => (
                            <div key={edu.id} className="flex flex-col gap-0.5 text-xs">
                              <div className="flex justify-between items-start font-bold">
                                <span className="text-slate-900 font-serif">{edu.institution}</span>
                                <span className="text-[9px] font-mono text-slate-400 print:text-black">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
                              </div>
                              <div className="text-slate-500 font-medium italic">{edu.degree}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Certificates */}
                      {cvData.certificates.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}>
                            <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('certificatesUpper')}
                          </h3>
                          {cvData.certificates.map((c) => (
                            <div key={c.id} className="text-xs text-slate-770 leading-snug">
                              <span className="font-bold text-slate-900 font-serif">{c.name}</span>
                              <span className="text-[10px] text-slate-550 block">{c.issuer} ({c.date})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Grid: Skills & Languages */}
                    <div className="flex flex-col gap-5">
                      {/* Skills */}
                      {cvData.skills.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}>
                            <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('skillsUpper')}
                          </h3>
                          <div className="flex flex-col gap-2 text-xs">
                            {cvData.skills.map((grp) => (
                              <div key={grp.id} className="leading-relaxed">
                                <span className="font-bold text-slate-900 font-serif block">{grp.category}</span>
                                <span className="text-slate-655">{grp.skills.filter(Boolean).join(", ")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages */}
                      {cvData.languages.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}>
                            <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                            {t('languagesUpper')}
                          </h3>
                          <div className="text-xs flex flex-col gap-1">
                            {cvData.languages.map((l) => (
                              <div key={l.id} className="flex justify-between">
                                <span className="font-bold text-slate-900 font-serif">{l.name}</span>
                                <span className="text-slate-500 font-mono text-[10px] print:text-black">{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
  );
}
