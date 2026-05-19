import { User, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Languages, ExternalLink } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';
import CustomSectionRenderer from './CustomSectionRenderer';

export default function ClassicTemplate({ cvData, activeColor, t }: TemplateProps) {
  return (
    <div className="flex flex-col flex-1 gap-5 text-sm">
                   
                    {/* Căn giữa Header */}
                   <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 border-b-[3px] ${activeColor.border} pb-4 print:flex-row print:justify-start print:items-center`}>
                     {cvData.personalInfo.avatar && (
                       <img 
                         src={cvData.personalInfo.avatar} 
                         alt="Avatar" 
                         className="w-16 h-16 rounded-full object-cover border border-slate-300 dark:border-slate-600" 
                       />
                     )}
                     <div className="text-center sm:text-left flex flex-col gap-1 print:text-left">
                       <h1 className="text-3xl font-extrabold tracking-wide text-slate-950 dark:text-slate-50 uppercase m-0 print:text-black">
                         {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                       </h1>
                       <p className={`font-bold text-xs tracking-widest uppercase ${activeColor.primary}`}>
                         {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                       </p>
                       <div className="flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1 text-slate-600 dark:text-slate-400 text-xs font-mono mt-2 print:text-black print:justify-start print:flex-wrap">
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
                   </div>

                    {/* Dynamic sections in a single vertical stream ordered according to cvData.sectionOrder */}
                    {(() => {
                      const baseOrder = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
                      const order = [...baseOrder];
                      const customSecs = cvData.customSections || [];
                      customSecs.forEach((sec: any) => {
                        if (!order.includes(sec.id)) {
                          order.push(sec.id);
                        }
                      });

                      return order.map((sec) => {
                        if (sec.startsWith('custom-')) {
                          const customSec = customSecs.find(s => s.id === sec);
                          if (customSec) {
                            return <CustomSectionRenderer key={sec} section={customSec} activeColor={activeColor} t={t} />;
                          }
                        }
                        if (sec === 'summary' && cvData.summary) {
                          return (
                            <div key={sec} className="flex flex-col gap-1.5">
                              <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                                <User className="h-3.5 w-3.5 stroke-[2.5]" />
                                {t('summaryUpper')}
                              </h3>
                              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 italic text-justify">{cvData.summary}</p>
                            </div>
                          );
                        }
                        if (sec === 'experience' && cvData.experience.length > 0) {
                          return (
                            <div key={sec} className="flex flex-col gap-3">
                              <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                                <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                                {t('experienceUpper')}
                              </h3>
                              {cvData.experience.map((exp) => (
                                <div key={exp.id} className="flex flex-col gap-0.5">
                                  <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-900 dark:text-slate-100 font-extrabold">{exp.company} — <span className={`italic font-normal ${activeColor.primary}`}>{exp.position}</span></span>
                                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
                                  </div>
                                  <p className="text-xs leading-relaxed text-slate-705 whitespace-pre-line mt-1 print:text-black">
                                    {exp.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (sec === 'projects' && cvData.projects.length > 0) {
                          return (
                            <div key={sec} className="flex flex-col gap-3">
                              <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                                <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                                {t('projectsUpper')}
                              </h3>
                              {cvData.projects.map((proj) => (
                                <div key={proj.id} className="flex flex-col gap-0.5">
                                  <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-900 dark:text-slate-100 font-extrabold">
                                      {proj.name}
                                      {proj.url && (
                                        <a
                                          href={proj.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-0.5 text-[10px] text-indigo-650 hover:underline ml-2 font-normal print:text-black print:no-underline"
                                        >
                                          <ExternalLink className="h-2.5 w-2.5" />
                                          {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
                                        </a>
                                      )}
                                      {" — "}
                                      <span className="font-normal italic text-[11px]">{proj.role}</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black">{proj.startDate}</span>
                                  </div>
                                  {proj.technologies.filter(Boolean).length > 0 && (
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Công nghệ: {proj.technologies.filter(Boolean).join(", ")}</span>
                                  )}
                                  <p className="text-xs leading-relaxed text-slate-705 whitespace-pre-line mt-0.5 print:text-black">
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
                              <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                                <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                                {t('educationUpper')}
                              </h3>
                              {cvData.education.map((edu) => (
                                <div key={edu.id} className="flex flex-col gap-0.5 text-xs">
                                  <div className="flex justify-between items-start font-bold">
                                    <span className="text-slate-900 dark:text-slate-100 font-extrabold">{edu.institution}</span>
                                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
                                  </div>
                                  <div className="text-slate-600 dark:text-slate-400 italic print:text-black">{edu.degree}</div>
                                  {edu.description && <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{edu.description}</p>}
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (sec === 'skills' && cvData.skills.length > 0) {
                          return (
                            <div key={sec} className="flex flex-col gap-2">
                              <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                                <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                                {t('skillsUpper')}
                              </h3>
                              <div className="flex flex-col gap-1 text-xs">
                                {cvData.skills.map((grp) => (
                                  <div key={grp.id} className="leading-snug">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{grp.category}: </span>
                                    <span className="text-slate-700 dark:text-slate-300">{grp.skills.filter(Boolean).join(", ")}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (sec === 'certificates' && cvData.certificates.length > 0) {
                          return (
                            <div key={sec} className="flex flex-col gap-1">
                              <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                                <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                                {t('certificatesUpper')}
                              </h3>
                              {cvData.certificates.map((c) => (
                                <div key={c.id} className="text-xs text-slate-755">
                                  <span className="font-bold text-slate-900 dark:text-slate-100">{c.name}</span> <span className="text-[10px] text-slate-500 dark:text-slate-400">({c.date})</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (sec === 'languages' && cvData.languages.length > 0) {
                          return (
                            <div key={sec} className="flex flex-col gap-1">
                              <h3 className={`text-xs font-extrabold uppercase tracking-wider ${activeColor.primary} pb-0.5 flex items-center gap-1.5`}>
                                <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                                {t('languagesUpper')}
                              </h3>
                              <div className="text-xs text-slate-755 flex flex-col gap-0.5">
                                {cvData.languages.map((l) => (
                                  <div key={l.id}>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">{l.name}</span>: {l.level}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      });
                    })()}

                  </div>
  );
}
