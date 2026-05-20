import { User, Briefcase, GraduationCap, FolderGit2, Award, Languages, ExternalLink } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';
import CustomSectionRenderer from './CustomSectionRenderer';
import LayoutSectionRenderer from './LayoutSectionRenderer';
import SkillsSectionRenderer from './SkillsSectionRenderer';
import { CustomLinksRenderer } from './TemplateHelpers';

export default function ModernTemplate({ cvData, activeColor, t }: TemplateProps) {
  
  const renderExperienceItem = (exp: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    if (layout === 'cards') {
      return (
        <div key={exp.id} className="p-3 bg-slate-55/30 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/60 flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs">
            <span className="font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{exp.company}</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-800 dark:text-slate-200">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
          </div>
          {!hideRole && (
            <span className={`text-[11px] font-semibold ${activeColor.primary} print:text-black leading-snug`}>
              {exp.position}
            </span>
          )}
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 mt-1 print:text-slate-950 font-medium">
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
              {!hideRole && <span className="font-normal text-slate-550"> ({exp.position})</span>}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium mt-0.5 print:text-slate-950">
            {exp.description}
          </p>
        </div>
      );
    }

    // Default timeline
    return (
      <div key={exp.id} className="flex flex-col gap-1 break-inside-avoid">
        <div className="flex justify-between items-start text-xs">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{exp.company}</span>
            {!hideRole && (
              <>
                <span className="text-slate-400 mx-1.5">•</span>
                <span className={`font-semibold ${activeColor.primary} print:text-black`}>{exp.position}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-800 dark:text-slate-200">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line mt-1 print:text-slate-950">
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
            <span className="font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{proj.name}</span>
            <span className="text-[10px] font-mono font-bold text-slate-400">{proj.startDate}</span>
          </div>
          {!hideRole && (
            <span className={`text-[11px] font-semibold ${activeColor.primary} leading-snug`}>
              {proj.role}
            </span>
          )}
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[10px] text-purple-600 hover:text-purple-750 font-semibold hover:underline print:text-black">
              <ExternalLink className="h-2.5 w-2.5" />
              {proj.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {proj.technologies.filter(Boolean).map((tech: string, idx: number) => (
                <span key={idx} className={`${activeColor.pill} rounded px-1.5 py-0.2 text-[9px] font-bold font-mono`}>
                  {tech}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium mt-1 print:text-slate-950 whitespace-pre-line">
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
              {!hideRole && <span className="font-normal text-slate-550"> ({proj.role})</span>}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">{proj.startDate}</span>
          </div>
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[10px] text-purple-600 hover:text-purple-750 font-semibold hover:underline print:text-black">
              <ExternalLink className="h-2.5 w-2.5" />
              {proj.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {proj.technologies.filter(Boolean).join(", ")}
            </span>
          )}
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium mt-0.5 print:text-slate-950">
            {proj.description}
          </p>
          {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
        </div>
      );
    }

    // Default timeline
    return (
      <div key={proj.id} className="flex flex-col gap-1 break-inside-avoid">
        <div className="flex justify-between items-center text-xs">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{proj.name}</span>
            {!hideUrl && proj.url && (
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
            {!hideRole && (
              <>
                <span className="text-slate-400 mx-1.5">•</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold italic">{proj.role}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-800 dark:text-slate-200">{proj.startDate}</span>
        </div>
        {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {proj.technologies.filter(Boolean).map((tech: string, idx: number) => (
              <span key={idx} className={`${activeColor.pill} rounded px-1.5 py-0.2 text-[9px] font-bold font-mono`}>
                {tech}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line mt-1 print:text-slate-950">
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
            <span className="font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{edu.institution}</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-800 dark:text-slate-200">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
          </div>
          {!hideRole && (
            <div className="text-slate-600 dark:text-slate-400 font-semibold print:text-slate-900 dark:text-slate-100">{edu.degree}</div>
          )}
          {edu.description && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1">{edu.description}</p>}
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
            <span className="text-[10px] font-mono font-bold text-slate-405 print:text-slate-800 dark:text-slate-200">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
          </div>
          {edu.description && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">{edu.description}</p>}
        </div>
      );
    }

    // Default timeline
    return (
      <div key={edu.id} className="flex flex-col gap-0.5 text-xs break-inside-avoid">
        <div className="flex justify-between items-start">
          <span className="font-extrabold text-slate-900 dark:text-slate-100">{edu.institution}</span>
          <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-800 dark:text-slate-200">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
        </div>
        {!hideRole && (
          <div className="text-slate-660 dark:text-slate-400 font-semibold print:text-slate-900 dark:text-slate-100">{edu.degree}</div>
        )}
        {edu.description && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">{edu.description}</p>}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 gap-6 text-sm">
                  {/* Top section / Contact block */}
                  <div className="border-b pb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 print:flex-row print:justify-between print:items-start">
                    <div className="flex items-center gap-4">
                      {cvData.personalInfo.avatar && (
                        <img 
                          src={cvData.personalInfo.avatar} 
                          alt="Avatar" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 print:border-slate-800 dark:border-slate-400" 
                        />
                      )}
                      <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight m-0 print:text-black">
                          {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                        </h1>
                        <p className={`${activeColor.primary} font-bold text-sm tracking-wider uppercase mt-1 print:text-slate-800 dark:text-slate-200`}>
                          {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400 text-xs text-right sm:items-end font-medium print:text-slate-700 dark:text-slate-300 print:items-end print:text-right">
                      <div>{cvData.personalInfo.email}</div>
                      {cvData.personalInfo.phone && <div>{cvData.personalInfo.phone}</div>}
                      {cvData.personalInfo.location && <div>{cvData.personalInfo.location}</div>}
                      <div className="flex flex-wrap gap-2 mt-1 sm:justify-end print:justify-end">
                        {cvData.personalInfo.website && (
                          <a 
                            href={cvData.personalInfo.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-mono hover:underline text-slate-500 dark:text-slate-400 print:bg-amber-50 print:border print:border-amber-200 print:text-amber-800 print:font-extrabold print:px-2 print:py-0.5 print:rounded"
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
                          <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline text-slate-500 dark:text-slate-400 print:text-slate-700 dark:text-slate-300">
                            github.com/{cvData.personalInfo.github.split('/').pop()}
                          </a>
                        )}
                        {cvData.personalInfo.linkedin && (
                          <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline text-slate-500 dark:text-slate-400 print:text-slate-700 dark:text-slate-300">
                            linkedin.com/in/{cvData.personalInfo.linkedin.split('/').pop()}
                          </a>
                        )}
                      </div>
                      {/* Render custom contact links */}
                      <CustomLinksRenderer
                        customLinks={cvData.personalInfo.customLinks}
                        className="flex flex-wrap gap-2 mt-1 sm:justify-end print:justify-end"
                        itemClassName="hover:underline flex items-center gap-1 font-mono text-slate-500 dark:text-slate-400 print:text-slate-700 dark:text-slate-300 font-medium"
                      />
                    </div>
                  </div>

                  {/* Body Content splits into two columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-6">
                    
                    {/* Left narrow sidebar */}
                    <div className="md:col-span-1 print:col-span-1 flex flex-col gap-6 glass-sidebar">
                      {(() => {
                        const baseOrder = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
                        const order = [...baseOrder];
                        const customSecs = cvData.customSections || [];
                        customSecs.forEach((sec: any) => {
                          if (!order.includes(sec.id)) {
                            order.push(sec.id);
                          }
                        });

                        const sidebarSections = order.filter(sec => 
                          ['skills', 'languages', 'certificates'].includes(sec) ||
                          (sec.startsWith('custom-') && customSecs.find(s => s.id === sec)?.layoutStyle === 'cards')
                        );

                        return sidebarSections.map((sec) => {
                          if (sec.startsWith('custom-')) {
                            const customSec = customSecs.find(s => s.id === sec);
                            if (customSec) {
                              return <CustomSectionRenderer key={sec} section={customSec} activeColor={activeColor} t={t} />;
                            }
                          }
                          if (sec === 'skills' && cvData.skills.length > 0) {
                            return (
                              <SkillsSectionRenderer
                                key={sec}
                                cvData={cvData}
                                activeColor={activeColor}
                                t={t}
                                titleClassName={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black border-b border-slate-100 dark:border-slate-800/40 print:border-slate-200`}
                              />
                            );
                          }
                          if (sec === 'languages' && cvData.languages.length > 0) {
                            const langTitle = cvData.sectionSettings?.languages?.title || t('languagesUpper');
                            return (
                              <div key={sec} data-section="languages" className="flex flex-col gap-2">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black border-b border-slate-100 dark:border-slate-800/40 print:border-slate-200`}>
                                  <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                                  <span>{langTitle}</span>
                                </h3>
                                <div className="flex flex-col gap-1">
                                  {cvData.languages.map((l) => (
                                    <div key={l.id} className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                                      <span className="font-semibold text-slate-800 dark:text-slate-200">{l.name}</span>
                                      <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] print:text-slate-800 dark:text-slate-200">{l.level}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          if (sec === 'certificates' && cvData.certificates.length > 0) {
                            const certTitle = cvData.sectionSettings?.certificates?.title || t('certificatesUpper');
                            return (
                              <div key={sec} data-section="certificates" className="flex flex-col gap-3">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black border-b border-slate-100 dark:border-slate-800/40 print:border-slate-200`}>
                                  <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                                  <span>{certTitle}</span>
                                </h3>
                                {cvData.certificates.map((c) => (
                                  <div key={c.id} className="text-xs flex flex-col gap-0.5">
                                    <span className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{c.name}</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{c.issuer} ({c.date})</span>
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
                        const baseOrder = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
                        const order = [...baseOrder];
                        const customSecs = cvData.customSections || [];
                        customSecs.forEach((sec: any) => {
                          if (!order.includes(sec.id)) {
                            order.push(sec.id);
                          }
                        });
 
                        const mainSections = order.filter(sec => 
                          ['summary', 'experience', 'projects', 'education'].includes(sec) ||
                          (sec.startsWith('custom-') && customSecs.find(s => s.id === sec)?.layoutStyle !== 'cards')
                        );
 
                        return mainSections.map((sec) => {
                          if (sec.startsWith('custom-')) {
                            const customSec = customSecs.find(s => s.id === sec);
                            if (customSec) {
                              return <CustomSectionRenderer key={sec} section={customSec} activeColor={activeColor} t={t} />;
                            }
                          }
                          if (sec === 'summary' && cvData.summary) {
                            const summaryTitle = cvData.sectionSettings?.summary?.title || t('summaryUpper');
                            return (
                              <div key={sec} data-section="summary" className="flex flex-col gap-2 break-inside-avoid">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black border-b border-slate-100 dark:border-slate-800/40 print:border-slate-200`}>
                                  <User className="h-3.5 w-3.5 stroke-[2.5]" />
                                  <span>{summaryTitle}</span>
                                </h3>
                                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium text-justify">{cvData.summary}</p>
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
                          return null;
                        });
                      })()}
                    </div>

                  </div>
                </div>
  );
}
