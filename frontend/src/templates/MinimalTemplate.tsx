import { User, Briefcase, GraduationCap, FolderGit2, Award, Languages, ExternalLink } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';
import CustomSectionRenderer from './CustomSectionRenderer';
import LayoutSectionRenderer from './LayoutSectionRenderer';
import SkillsSectionRenderer from './SkillsSectionRenderer';
import { CustomLinksRenderer } from './TemplateHelpers';
import { QRCodeWidget } from '../components/QRCodeWidget';

export default function MinimalTemplate({ cvData, activeColor, t, slug }: TemplateProps) {
  
  const renderExperienceItem = (exp: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    if (layout === 'cards') {
      return (
        <div key={exp.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-805 flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100 font-serif text-sm">{exp.company}</span>
            <span className="text-[10px] font-mono text-slate-405 print:text-black">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
          </div>
          {!hideRole && (
            <span className="text-slate-600 dark:text-slate-400 font-medium italic text-[11px]">{exp.position}</span>
          )}
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 text-justify mt-1 whitespace-pre-line print:text-black">
            {exp.description}
          </p>
        </div>
      );
    }

    if (layout === 'text') {
      return (
        <div key={exp.id} className="flex flex-col gap-0.5 break-inside-avoid">
          <div className="flex justify-between items-baseline text-xs">
            <span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-serif">{exp.company}</span>
              {!hideRole && <span className="font-normal text-slate-500"> ({exp.position})</span>}
            </span>
            <span className="text-[10px] font-mono text-slate-400 print:text-black">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 text-justify mt-0.5 whitespace-pre-line print:text-black">
            {exp.description}
          </p>
        </div>
      );
    }

    // Default timeline
    return (
      <div key={exp.id} className="flex flex-col gap-1 break-inside-avoid">
        <div className="flex justify-between items-baseline text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-serif text-sm">{exp.company}</span>
            {!hideRole && (
              <>
                <span className="mx-2 text-slate-450">•</span>
                <span className="text-slate-600 dark:text-slate-400 font-medium italic">{exp.position}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400 print:text-black">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 text-justify mt-0.5 whitespace-pre-line print:text-black">
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
          <div className="flex justify-between items-start text-xs font-bold">
            <span className="font-bold text-slate-900 dark:text-slate-100 font-serif text-sm leading-snug">{proj.name}</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-450">{proj.startDate}</span>
          </div>
          {!hideRole && (
            <span className="text-slate-500 dark:text-slate-400 font-medium italic text-[11px]">{proj.role}</span>
          )}
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline font-bold print:text-black font-mono`}>
              <ExternalLink className="h-2.5 w-2.5" />
              {proj.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {proj.technologies.filter(Boolean).join(", ")}
            </span>
          )}
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 text-justify mt-1 whitespace-pre-line print:text-black">
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
            <span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-serif text-sm">{proj.name}</span>
              {!hideRole && <span className="font-normal text-slate-550"> ({proj.role})</span>}
            </span>
            <span className="text-[10px] font-mono text-slate-400">{proj.startDate}</span>
          </div>
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline font-bold print:text-black font-mono`}>
              <ExternalLink className="h-2.5 w-2.5" />
              {proj.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {proj.technologies.filter(Boolean).join(", ")}
            </span>
          )}
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 text-justify mt-0.5 whitespace-pre-line print:text-black">
            {proj.description}
          </p>
          {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
        </div>
      );
    }

    // Default timeline
    return (
      <div key={proj.id} className="flex flex-col gap-1 break-inside-avoid">
        <div className="flex justify-between items-baseline text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-serif text-sm">{proj.name}</span>
            {!hideUrl && proj.url && (
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
            {!hideRole && (
              <>
                <span className="mx-2 text-slate-450">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium italic text-[11px]">{proj.role}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400 print:text-black">{proj.startDate}</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 text-justify mt-0.5 whitespace-pre-line print:text-black">
          {proj.description}
        </p>
        {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 gap-6 text-sm">
                  {/* Elegant Editorial Header */}
                  <div className="text-center flex flex-col items-center gap-1.5 pb-4 border-b border-slate-250 print:border-slate-350 relative">
                    {slug && (
                      <div className="hidden print:flex absolute right-0 top-0">
                        <QRCodeWidget slug={slug} />
                      </div>
                    )}
                    {cvData.personalInfo.avatar && (
                      <img 
                        src={cvData.personalInfo.avatar} 
                        alt="Avatar" 
                        className="w-20 h-20 rounded-full object-cover border border-slate-300 dark:border-slate-600 mb-2" 
                      />
                    )}
                    <h1 className="text-3.5xl font-light tracking-wide text-slate-900 dark:text-slate-100 uppercase font-serif">
                      {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                    </h1>
                    <p className={`${activeColor.primary} font-semibold text-xs tracking-widest uppercase font-serif`}>
                      {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                    </p>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-slate-500 dark:text-slate-400 text-xs font-mono mt-1 print:text-black print:justify-center print:flex-wrap">
                      <span>{cvData.personalInfo.email}</span>
                      {cvData.personalInfo.phone && <span>• {cvData.personalInfo.phone}</span>}
                      {cvData.personalInfo.location && <span>• {cvData.personalInfo.location}</span>}
                      {cvData.personalInfo.website && (
                        <span className="flex items-center gap-1">
                          • <a 
                              href={cvData.personalInfo.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="hover:underline print:bg-amber-50 print:border print:border-amber-200 print:text-amber-800 print:font-extrabold print:px-2 print:py-0.5 print:rounded"
                            >
                              <span className="print:hidden">
                                {cvData.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
                              </span>
                              <span className="hidden print:inline">
                                Personal Website: {cvData.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
                              </span>
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
                    {/* Custom Links Renderer */}
                    <CustomLinksRenderer
                      customLinks={cvData.personalInfo.customLinks}
                      className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-slate-500 dark:text-slate-400 text-xs font-mono mt-1 print:text-black print:justify-center"
                      itemClassName="hover:underline flex items-center gap-1 font-medium"
                    />
                  </div>

                  {/* Summary */}
                  {cvData.summary && (
                    <div data-section="summary" className="flex flex-col gap-2 break-inside-avoid">
                      <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center justify-center gap-1.5 font-serif`}>
                        <User className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>{cvData.sectionSettings?.summary?.title || t('summaryUpper')}</span>
                      </h3>
                      <div className={`w-8 h-0.5 ${activeColor.bg} mx-auto mb-1`}></div>
                      <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 text-center max-w-xl mx-auto italic">
                        "{cvData.summary}"
                      </p>
                    </div>
                  )}

                  {/* Dynamic Middle sections */}
                  {(() => {
                    const baseOrder = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
                    const order = [...baseOrder];
                    const customSecs = cvData.customSections || [];
                    customSecs.forEach((sec: any) => {
                      if (!order.includes(sec.id)) {
                        order.push(sec.id);
                      }
                    });

                    // We render experience and projects on top
                    const middleSections = order.filter(sec => 
                      ['experience', 'projects'].includes(sec) ||
                      (sec.startsWith('custom-') && customSecs.find(s => s.id === sec)?.layoutStyle !== 'cards')
                    );

                    return middleSections.map((sec) => {
                      if (sec.startsWith('custom-')) {
                        const customSec = customSecs.find(s => s.id === sec);
                        if (customSec) {
                          return (
                            <div key={sec} className="flex flex-col gap-3">
                              <CustomSectionRenderer section={customSec} activeColor={activeColor} t={t} />
                            </div>
                          );
                        }
                      }
                      if (sec === 'experience' && cvData.experience.length > 0) {
                        return (
                          <div key={sec} className="flex flex-col gap-3">
                            <LayoutSectionRenderer
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
                          </div>
                        );
                      }
                      if (sec === 'projects' && cvData.projects.length > 0) {
                        return (
                          <div key={sec} className="flex flex-col gap-3">
                            <LayoutSectionRenderer
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
                          </div>
                        );
                      }
                      return null;
                    });
                  })()}

                  {/* Grid elements at bottom */}
                  <div className="grid grid-cols-2 gap-8 border-t border-slate-100 dark:border-slate-800 dark:border-slate-400 pt-4 print:border-slate-350">
                    
                    {/* Left Grid: Education & Certs */}
                    <div className="flex flex-col gap-5">
                      {/* Education */}
                      {cvData.education.length > 0 && (
                        <div data-section="education" className="flex flex-col gap-3 break-inside-avoid">
                          <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}>
                            <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>{cvData.sectionSettings?.education?.title || t('educationUpper')}</span>
                          </h3>
                          {cvData.education.map((edu) => {
                            const hideRole = cvData.sectionSettings?.education?.hideFields?.includes('role');
                            return (
                              <div key={edu.id} className="flex flex-col gap-0.5 text-xs">
                                <div className="flex justify-between items-start font-bold">
                                  <span className="text-slate-900 dark:text-slate-100 font-serif">{edu.institution}</span>
                                  <span className="text-[9px] font-mono text-slate-400 print:text-black">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
                                </div>
                                {!hideRole && (
                                  <div className="text-slate-500 dark:text-slate-400 font-medium italic">{edu.degree}</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Certificates */}
                      {cvData.certificates.length > 0 && (
                        <div data-section="certificates" className="flex flex-col gap-2 break-inside-avoid">
                          <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}>
                            <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>{cvData.sectionSettings?.certificates?.title || t('certificatesUpper')}</span>
                          </h3>
                          {cvData.certificates.map((c) => (
                            <div key={c.id} className="text-xs text-slate-770 leading-snug">
                              <span className="font-bold text-slate-900 dark:text-slate-100 font-serif">{c.name}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{c.issuer} ({c.date})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Grid: Skills, Languages & Cards Custom Sections */}
                    <div className="flex flex-col gap-5">
                      {/* Skills */}
                      {cvData.skills.length > 0 && (
                        <SkillsSectionRenderer
                          cvData={cvData}
                          activeColor={activeColor}
                          t={t}
                          titleClassName={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}
                          wrapperClassName="break-inside-avoid"
                        />
                      )}

                      {/* Languages */}
                      {cvData.languages.length > 0 && (
                        <div data-section="languages" className="flex flex-col gap-2 break-inside-avoid">
                          <h3 className={`text-xs font-bold tracking-widest uppercase ${activeColor.primary} flex items-center gap-1.5 font-serif`}>
                            <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>{cvData.sectionSettings?.languages?.title || t('languagesUpper')}</span>
                          </h3>
                          <div className="text-xs flex flex-col gap-1">
                            {cvData.languages.map((l) => (
                              <div key={l.id} className="flex justify-between">
                                <span className="font-bold text-slate-900 dark:text-slate-100 font-serif">{l.name}</span>
                                <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] print:text-black">{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Render Custom Sections with cards layout inside right narrow grid column */}
                      {(cvData.customSections || []).map(sec => {
                        if (sec.layoutStyle === 'cards') {
                          return (
                            <div key={sec.id} className="flex flex-col gap-2">
                              <CustomSectionRenderer section={sec} activeColor={activeColor} t={t} />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
  );
}
