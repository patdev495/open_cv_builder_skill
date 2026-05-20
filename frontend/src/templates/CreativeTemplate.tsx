import { Briefcase, GraduationCap, FolderGit2, Award, Languages, ExternalLink, User } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';
import CustomSectionRenderer from './CustomSectionRenderer';
import LayoutSectionRenderer from './LayoutSectionRenderer';
import SkillsSectionRenderer from './SkillsSectionRenderer';
import { CustomLinksRenderer } from './TemplateHelpers';

export default function CreativeTemplate({ cvData, activeColor, t }: TemplateProps) {
  
  const renderExperienceItem = (exp: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    if (layout === 'cards') {
      return (
        <div key={exp.id} className="p-3 bg-slate-55/30 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/60 flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs">
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm leading-snug">{exp.company}</span>
            <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded print:bg-slate-50">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
          </div>
          {!hideRole && (
            <span className={`text-[11px] font-bold ${activeColor.primary} leading-snug`}>
              {exp.position}
            </span>
          )}
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line mt-1 print:text-black">
            {exp.description}
          </p>
        </div>
      );
    }

    if (layout === 'text') {
      return (
        <div key={exp.id} className="flex flex-col gap-0.5 break-inside-avoid">
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {exp.company}
              {!hideRole && <span className="font-normal text-slate-500"> ({exp.position})</span>}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line print:text-black mt-0.5">
            {exp.description}
          </p>
        </div>
      );
    }

    // Default timeline with left border
    return (
      <div key={exp.id} className={`border-l-2 ${activeColor.border} pl-4 py-0.5 flex flex-col gap-1 relative print:!border-slate-300 dark:border-slate-600 break-inside-avoid`}>
        <div className="flex justify-between items-start text-xs">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{exp.company}</span>
            {!hideRole && (
              <>
                <span className={`mx-2 ${activeColor.primary}`}>•</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{exp.position}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded print:bg-slate-50 dark:bg-slate-800/50 print:border print:border-slate-200 dark:border-slate-700">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line mt-1 print:text-black">
          {exp.description}
        </p>
      </div>
    );
  };

  const renderProjectItem = (proj: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');
    const hideUrl = hiddenFields.includes('url');
    const hideTech = hiddenFields.includes('technologies');
    const hideEmbed = hiddenFields.includes('embed');

    if (layout === 'cards') {
      return (
        <div key={proj.id} className="p-3 bg-slate-55/30 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/60 flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs">
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm leading-snug">{proj.name}</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{proj.startDate}</span>
          </div>
          {!hideRole && (
            <span className={`text-[11px] font-semibold ${activeColor.primary} leading-snug`}>
              {proj.role}
            </span>
          )}
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline font-bold print:text-black`}>
              <ExternalLink className="h-2.5 w-2.5" />
              {proj.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {proj.technologies.filter(Boolean).map((tech: string, idx: number) => (
                <span key={idx} className={`${activeColor.pill} rounded px-2 py-0.5 text-[9px] font-bold font-mono`}>
                  {tech}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line mt-1 print:text-black">
            {proj.description}
          </p>
          {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
        </div>
      );
    }

    if (layout === 'text') {
      return (
        <div key={proj.id} className="flex flex-col gap-0.5 break-inside-avoid">
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {proj.name}
              {!hideRole && <span className="font-normal text-slate-500"> ({proj.role})</span>}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">{proj.startDate}</span>
          </div>
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline font-bold print:text-black`}>
              <ExternalLink className="h-2.5 w-2.5" />
              {proj.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <span className="text-[10px] text-slate-550 dark:text-slate-400">
              {proj.technologies.filter(Boolean).join(", ")}
            </span>
          )}
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line mt-0.5 print:text-black">
            {proj.description}
          </p>
          {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
        </div>
      );
    }

    // Default timeline with left border
    return (
      <div key={proj.id} className={`border-l-2 ${activeColor.border} pl-4 py-0.5 flex flex-col gap-1 print:!border-slate-300 dark:border-slate-600 break-inside-avoid`}>
        <div className="flex justify-between items-center text-xs">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{proj.name}</span>
            {!hideUrl && proj.url && (
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
            {!hideRole && (
              <>
                <span className="text-slate-400 mx-1.5">•</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold italic">{proj.role}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{proj.startDate}</span>
        </div>
        {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {proj.technologies.filter(Boolean).map((tech: string, idx: number) => (
              <span key={idx} className={`${activeColor.pill} rounded px-2 py-0.5 text-[9px] font-bold font-mono`}>
                {tech}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line mt-1 print:text-black">
          {proj.description}
        </p>
        {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
      </div>
    );
  };

  const renderEducationItem = (edu: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    if (layout === 'cards') {
      return (
        <div key={edu.id} className="p-3 bg-slate-55/30 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/60 flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs">
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm leading-snug">{edu.institution}</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-405">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
          </div>
          {!hideRole && (
            <div className="text-slate-700 dark:text-slate-300 font-semibold">{edu.degree}</div>
          )}
          {edu.description && <p className="text-[10px] text-slate-550 dark:text-slate-400 italic mt-1">{edu.description}</p>}
        </div>
      );
    }

    if (layout === 'text') {
      return (
        <div key={edu.id} className="flex flex-col gap-0.5 text-xs break-inside-avoid">
          <div className="flex justify-between items-baseline font-bold">
            <span>
              {edu.institution}
              {!hideRole && <span className="font-normal text-slate-500"> ({edu.degree})</span>}
            </span>
            <span className="text-[10px] font-mono text-slate-455 dark:text-slate-500">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
          </div>
          {edu.description && <p className="text-[10px] text-slate-550 dark:text-slate-400 italic mt-0.5">{edu.description}</p>}
        </div>
      );
    }

    // Default timeline
    return (
      <div key={edu.id} className="flex flex-col gap-0.5 text-xs break-inside-avoid">
        <div className="flex justify-between items-start font-bold">
          <span className="text-slate-900 dark:text-slate-100 font-extrabold">{edu.institution}</span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
        </div>
        {!hideRole && (
          <div className="text-slate-700 dark:text-slate-300 font-semibold print:text-black">{edu.degree}</div>
        )}
        {edu.description && <p className="text-[10px] text-slate-550 dark:text-slate-400 italic mt-0.5">{edu.description}</p>}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 gap-6 text-sm">
                   
                    {/* Creative Header */}
                    <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${activeColor.bg} text-white p-6 rounded-2xl print:bg-white dark:bg-slate-900/50 print:text-black print:p-0 print:border-b-2 print:border-black print:rounded-none print:flex-row print:justify-between print:items-center`}>
                      <div className="flex items-center gap-4">
                        {cvData.personalInfo.avatar && (
                          <img 
                            src={cvData.personalInfo.avatar} 
                            alt="Avatar" 
                            className="w-16 h-16 rounded-full object-cover border-2 border-white print:border-slate-800 dark:border-slate-400" 
                          />
                        )}
                        <div>
                          <h1 className="text-3xl font-black tracking-tight text-white m-0 print:text-black">
                            {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                          </h1>
                          <div className={`inline-block ${activeColor.lightBg} ${activeColor.primary} px-3 py-0.5 rounded-full text-xs font-bold mt-2 font-mono print:bg-slate-100 dark:bg-slate-800/80 print:text-black print:border-slate-300 dark:border-slate-600`}>
                            {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 text-slate-105 text-xs font-mono sm:items-end mt-2 md:mt-0 print:text-black print:items-end print:text-right print:mt-0">
                        <div>{cvData.personalInfo.email}</div>
                        {cvData.personalInfo.phone && <div>{cvData.personalInfo.phone}</div>}
                        {cvData.personalInfo.location && <div>{cvData.personalInfo.location}</div>}
                        <div className="flex flex-wrap gap-2 mt-1 md:justify-end print:justify-end">
                           {cvData.personalInfo.website && (
                             <a 
                               href={cvData.personalInfo.website} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className={`bg-white hover:bg-slate-100 ${activeColor.primary} px-2 py-0.5 rounded text-[10px] font-bold border border-white/20 print:bg-amber-50 print:border-amber-200 print:text-amber-800 print:font-extrabold print:px-2.5 print:py-0.5 transition-colors`}
                             >
                               <span className="print:hidden">
                                 {cvData.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
                               </span>
                               <span className="hidden print:inline">
                                 Personal Website: {cvData.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
                               </span>
                             </a>
                           )}
                           {cvData.personalInfo.github && (
                             <a 
                               href={cvData.personalInfo.github} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className={`bg-white hover:bg-slate-100 ${activeColor.primary} px-2 py-0.5 rounded text-[10px] font-bold border border-white/20 print:bg-slate-50 print:border-slate-300 print:text-black transition-colors`}
                             >
                               github.com/{cvData.personalInfo.github.split('/').pop()}
                             </a>
                           )}
                           {cvData.personalInfo.linkedin && (
                             <a 
                               href={cvData.personalInfo.linkedin} 
                               target="_blank" 
                               rel="noopener noreferrer" 
                               className={`bg-white hover:bg-slate-100 ${activeColor.primary} px-2 py-0.5 rounded text-[10px] font-bold border border-white/20 print:bg-slate-50 print:border-slate-300 print:text-black transition-colors`}
                             >
                               linkedin.com/in/{cvData.personalInfo.linkedin.split('/').pop()}
                             </a>
                           )}
                        </div>
                        {/* Custom links rendering in header */}
                        <CustomLinksRenderer
                          customLinks={cvData.personalInfo.customLinks}
                          className="flex flex-wrap gap-2 mt-1 md:justify-end print:justify-end"
                          itemClassName={`bg-white hover:bg-slate-100 ${activeColor.primary} px-2 py-0.5 rounded text-[10px] font-bold border border-white/20 print:bg-slate-50 print:border-slate-300 print:text-black transition-colors flex items-center gap-1`}
                        />
                      </div>
                    </div>

                    {/* Dynamic sections */}
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
                            <div key={sec} className={`${activeColor.lightBg} p-4 rounded-xl border border-slate-200 dark:border-slate-700/40 print:bg-white dark:bg-slate-900/50 print:p-0 print:border-none break-inside-avoid`}>
                              <h4 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} mb-2 print:text-black flex items-center gap-1.5`}>
                                <User className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>{cvData.sectionSettings?.summary?.title || t('summaryUpper')}</span>
                              </h4>
                              <p className="text-xs leading-relaxed text-slate-755 dark:text-slate-300 font-medium text-justify">{cvData.summary}</p>
                            </div>
                          );
                        }
                        if (sec === 'experience' && cvData.experience.length > 0) {
                          return (
                            <LayoutSectionRenderer
                              key={sec}
                              sectionId="experience"
                              cvData={cvData}
                              activeColor={activeColor}
                              t={t}
                              defaultTitleKey="experienceUpper"
                              IconComponent={Briefcase}
                              items={cvData.experience}
                              defaultLayoutStyle="timeline"
                              renderItem={renderExperienceItem}
                            />
                          );
                        }
                        if (sec === 'projects' && cvData.projects.length > 0) {
                          return (
                            <LayoutSectionRenderer
                              key={sec}
                              sectionId="projects"
                              cvData={cvData}
                              activeColor={activeColor}
                              t={t}
                              defaultTitleKey="projectsUpper"
                              IconComponent={FolderGit2}
                              items={cvData.projects}
                              defaultLayoutStyle="timeline"
                              renderItem={renderProjectItem}
                            />
                          );
                        }
                        if (sec === 'education' && cvData.education.length > 0) {
                          return (
                            <LayoutSectionRenderer
                              key={sec}
                              sectionId="education"
                              cvData={cvData}
                              activeColor={activeColor}
                              t={t}
                              defaultTitleKey="educationUpper"
                              IconComponent={GraduationCap}
                              items={cvData.education}
                              defaultLayoutStyle="timeline"
                              renderItem={renderEducationItem}
                            />
                          );
                        }
                        if (sec === 'skills' && cvData.skills.length > 0) {
                          return (
                            <SkillsSectionRenderer
                              key={sec}
                              cvData={cvData}
                              activeColor={activeColor}
                              t={t}
                              titleClassName={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}
                              wrapperClassName="break-inside-avoid"
                            />
                          );
                        }
                        if (sec === 'certificates' && cvData.certificates.length > 0) {
                          const certTitle = cvData.sectionSettings?.certificates?.title || t('certificatesUpper');
                          return (
                            <div key={sec} className="flex flex-col gap-2 break-inside-avoid">
                              <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                                <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>{certTitle}</span>
                              </h3>
                              <div className="flex flex-col gap-1.5 text-xs text-slate-755">
                                {cvData.certificates.map((c) => (
                                  <div key={c.id} className="leading-snug">
                                    <span className="font-extrabold text-slate-900 dark:text-slate-100">{c.name}</span> — <span className="text-slate-550 dark:text-slate-400 text-[11px] font-medium">{c.issuer} ({c.date})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (sec === 'languages' && cvData.languages.length > 0) {
                          const langTitle = cvData.sectionSettings?.languages?.title || t('languagesUpper');
                          return (
                            <div key={sec} className="flex flex-col gap-2 break-inside-avoid">
                              <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                                <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>{langTitle}</span>
                              </h3>
                              <div className="flex flex-col gap-1 text-xs">
                                {cvData.languages.map((l) => (
                                  <div key={l.id} className="flex justify-between font-medium">
                                    <span className="font-bold text-slate-900 dark:text-slate-100">{l.name}</span>
                                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] print:text-black">{l.level}</span>
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
