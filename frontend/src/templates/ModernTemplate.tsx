import { User, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Languages, ExternalLink } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';

export default function ModernTemplate({ cvData, activeColor, t }: TemplateProps) {
  return (
    <div className="flex flex-col flex-1 gap-6 text-sm">
                  {/* Top section / Contact block */}
                  <div className="border-b pb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 print:flex-row print:justify-between print:items-start">
                    <div className="flex items-center gap-4">
                      {cvData.personalInfo.avatar && (
                        <img 
                          src={cvData.personalInfo.avatar} 
                          alt="Avatar" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 print:border-slate-800" 
                        />
                      )}
                      <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight m-0 print:text-black">
                          {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                        </h1>
                        <p className={`${activeColor.primary} font-bold text-sm tracking-wider uppercase mt-1 print:text-slate-800`}>
                          {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-slate-550 text-xs text-right sm:items-end font-medium print:text-slate-700 print:items-end print:text-right">
                      <div>{cvData.personalInfo.email}</div>
                      {cvData.personalInfo.phone && <div>{cvData.personalInfo.phone}</div>}
                      {cvData.personalInfo.location && <div>{cvData.personalInfo.location}</div>}
                      <div className="flex flex-wrap gap-2 mt-1 sm:justify-end print:justify-end">
                        {cvData.personalInfo.website && (
                          <a href={cvData.personalInfo.website} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline text-slate-550 print:text-slate-700">
                            {cvData.personalInfo.website.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                        {cvData.personalInfo.github && (
                          <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline text-slate-550 print:text-slate-700">
                            github.com/{cvData.personalInfo.github.split('/').pop()}
                          </a>
                        )}
                        {cvData.personalInfo.linkedin && (
                          <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline text-slate-550 print:text-slate-700">
                            linkedin.com/in/{cvData.personalInfo.linkedin.split('/').pop()}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body Content splits into two columns if needed, but linear modern is beautiful */}
                  <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-6">
                    
                    {/* Left narrow sidebar with Glassmorphism */}
                    <div className="md:col-span-1 print:col-span-1 flex flex-col gap-6 glass-sidebar">
                      {(() => {
                        const order = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
                        const sidebarSections = order.filter(sec => ['skills', 'languages', 'certificates'].includes(sec));
                        return sidebarSections.map((sec) => {
                          if (sec === 'skills' && cvData.skills.length > 0) {
                            return (
                              <div key={sec} className="flex flex-col gap-3">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                                  <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                                  {t('skillsUpper')}
                                </h3>
                                {cvData.skills.map((grp) => (
                                  <div key={grp.id} className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-slate-800">{grp.category}</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {grp.skills.filter(Boolean).map((s, i) => (
                                        <span key={i} className={`${activeColor.pill} px-2 py-0.5 rounded text-[11px] font-medium`}>
                                          {s}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          if (sec === 'languages' && cvData.languages.length > 0) {
                            return (
                              <div key={sec} className="flex flex-col gap-2">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                                  <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                                  {t('languagesUpper')}
                                </h3>
                                <div className="flex flex-col gap-1">
                                  {cvData.languages.map((l) => (
                                    <div key={l.id} className="flex justify-between text-xs font-medium text-slate-750">
                                      <span className="font-semibold text-slate-800">{l.name}</span>
                                      <span className="text-slate-500 font-mono text-[10px] print:text-slate-800">{l.level}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          if (sec === 'certificates' && cvData.certificates.length > 0) {
                            return (
                              <div key={sec} className="flex flex-col gap-3">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                                  <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                                  {t('certificatesUpper')}
                                </h3>
                                {cvData.certificates.map((c) => (
                                  <div key={c.id} className="text-xs flex flex-col gap-0.5">
                                    <span className="font-bold text-slate-850 leading-snug">{c.name}</span>
                                    <span className="text-[10px] text-slate-550 font-medium">{c.issuer} ({c.date})</span>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        });
                      })()}
                    </div>

                    {/* Right wide main column */}
                    <div className="md:col-span-2 print:col-span-2 flex flex-col gap-6">
                      {(() => {
                        const order = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
                        const mainSections = order.filter(sec => ['summary', 'experience', 'projects', 'education'].includes(sec));
                        return mainSections.map((sec) => {
                          if (sec === 'summary' && cvData.summary) {
                            return (
                              <div key={sec} className="flex flex-col gap-2">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                                  <User className="h-3.5 w-3.5 stroke-[2.5]" />
                                  {t('summaryUpper')}
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-700 font-medium text-justify">{cvData.summary}</p>
                              </div>
                            );
                          }
                          if (sec === 'experience' && cvData.experience.length > 0) {
                            return (
                              <div key={sec} className="flex flex-col gap-4">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                                  <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                                  {t('experienceUpper')}
                                </h3>
                                {cvData.experience.map((exp) => (
                                  <div key={exp.id} className="flex flex-col gap-1 break-inside-avoid">
                                    <div className="flex justify-between items-start text-xs">
                                      <div>
                                        <span className="font-extrabold text-slate-900">{exp.company}</span>
                                        <span className="text-slate-400 mx-1.5">•</span>
                                        <span className={`font-semibold ${activeColor.primary} print:text-black`}>{exp.position}</span>
                                      </div>
                                      <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-850">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-655 font-medium whitespace-pre-line mt-1 print:text-slate-950">
                                      {exp.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          if (sec === 'projects' && cvData.projects.length > 0) {
                            return (
                              <div key={sec} className="flex flex-col gap-4">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                                  <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                                  {t('projectsUpper')}
                                </h3>
                                {cvData.projects.map((proj) => (
                                  <div key={proj.id} className="flex flex-col gap-1 break-inside-avoid">
                                    <div className="flex justify-between items-center text-xs">
                                      <div>
                                        <span className="font-extrabold text-slate-900">{proj.name}</span>
                                        {proj.url && (
                                          <a
                                            href={proj.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-0.5 text-[10px] text-purple-600 hover:text-purple-750 font-bold ml-1.5 hover:underline print:text-black print:no-underline"
                                          >
                                            <ExternalLink className="h-2.5 w-2.5" />
                                            {proj.url.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/').replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                                          </a>
                                        )}
                                        <span className="text-slate-400 mx-1.5">•</span>
                                        <span className="text-[10px] text-slate-550 font-semibold italic">{proj.role}</span>
                                      </div>
                                      <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-850">{proj.startDate}</span>
                                    </div>
                                    {proj.technologies.filter(Boolean).length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-0.5">
                                        {proj.technologies.filter(Boolean).map((tech, idx) => (
                                          <span key={idx} className={`${activeColor.pill} rounded px-1.5 py-0.2 text-[9px] font-bold font-mono`}>
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    <p className="text-xs leading-relaxed text-slate-655 font-medium whitespace-pre-line mt-1 print:text-slate-950">
                                      {proj.description}
                                    </p>
                                    <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          if (sec === 'education' && cvData.education.length > 0) {
                            return (
                              <div key={sec} className="flex flex-col gap-3">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black`}>
                                  <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                                  {t('educationUpper')}
                                </h3>
                                {cvData.education.map((edu) => (
                                  <div key={edu.id} className="flex flex-col gap-0.5 text-xs break-inside-avoid">
                                    <div className="flex justify-between items-start">
                                      <span className="font-extrabold text-slate-900">{edu.institution}</span>
                                      <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-850">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
                                    </div>
                                    <div className="text-slate-600 font-semibold print:text-slate-900">{edu.degree}</div>
                                    {edu.description && <p className="text-[11px] text-slate-500 italic mt-0.5">{edu.description}</p>}
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        });
                      })()}
                    </div>

                  </div>
                </div>
  );
}
