import { User, Briefcase, GraduationCap, FolderGit2, Award, Languages, ExternalLink } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';
import CustomSectionRenderer from './CustomSectionRenderer';
import LayoutSectionRenderer from './LayoutSectionRenderer';
import SkillsSectionRenderer from './SkillsSectionRenderer';
import { CustomLinksRenderer } from './TemplateHelpers';
import { QRCodeWidget } from '../components/QRCodeWidget';

export default function ClassicTemplate({ cvData, activeColor, t, slug }: TemplateProps) {
  
  const renderExperienceItem = (exp: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');
    
    if (layout === 'cards') {
      return (
        <div key={exp.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs font-bold">
            <span className="text-slate-900 dark:text-slate-100 font-extrabold">{exp.company}</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
          </div>
          {!hideRole && (
            <span className={`text-[11px] font-semibold ${activeColor.primary} print:text-black leading-snug`}>
              {exp.position}
            </span>
          )}
          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-400 whitespace-pre-line mt-1 print:text-black">
            {exp.description}
          </p>
        </div>
      );
    }

    if (layout === 'text') {
      return (
        <div key={exp.id} className="flex flex-col gap-0.5 break-inside-avoid">
          <div className="flex justify-between items-baseline text-xs font-bold">
            <span>
              {exp.company}
              {!hideRole && <span className="font-normal text-slate-500"> ({exp.position})</span>}
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-400 whitespace-pre-line mt-0.5 print:text-black">
            {exp.description}
          </p>
        </div>
      );
    }

    // Default timeline
    return (
      <div key={exp.id} className="flex flex-col gap-0.5 break-inside-avoid">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-900 dark:text-slate-100 font-extrabold">
            {exp.company}
            {!hideRole && (
              <>
                {" — "}
                <span className={`italic font-normal ${activeColor.primary}`}>{exp.position}</span>
              </>
            )}
          </span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-705 whitespace-pre-line mt-1 print:text-black">
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
            <span className="text-slate-900 dark:text-slate-100 font-extrabold leading-snug">{proj.name}</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-450">{proj.startDate}</span>
          </div>
          {!hideRole && (
            <span className={`text-[11px] font-semibold ${activeColor.primary} print:text-black leading-snug`}>
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
            <span className="text-[10px] text-slate-550 dark:text-slate-400 font-semibold">
              {proj.technologies.filter(Boolean).join(", ")}
            </span>
          )}
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 mt-1 print:text-slate-950 whitespace-pre-line">
            {proj.description}
          </p>
          {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
        </div>
      );
    }

    if (layout === 'text') {
      return (
        <div key={proj.id} className="flex flex-col gap-0.5 break-inside-avoid">
          <div className="flex justify-between items-baseline text-xs font-bold">
            <span>
              {proj.name}
              {!hideRole && <span className="font-normal text-slate-500"> ({proj.role})</span>}
            </span>
            <span className="text-[10px] font-mono text-slate-555 dark:text-slate-400 print:text-black">{proj.startDate}</span>
          </div>
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[10px] text-purple-650 hover:underline print:text-black">
              <ExternalLink className="h-2.5 w-2.5" />
              {proj.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {proj.technologies.filter(Boolean).join(", ")}
            </span>
          )}
          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-400 whitespace-pre-line mt-0.5 print:text-black">
            {proj.description}
          </p>
          {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
        </div>
      );
    }

    // Default timeline
    return (
      <div key={proj.id} className="flex flex-col gap-0.5 break-inside-avoid">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-900 dark:text-slate-100 font-extrabold">
            {proj.name}
            {!hideUrl && proj.url && (
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
            {!hideRole && (
              <>
                {" — "}
                <span className="font-normal italic text-[11px]">{proj.role}</span>
              </>
            )}
          </span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black">{proj.startDate}</span>
        </div>
        {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
          <span className="text-[10px] text-slate-550 dark:text-slate-400 font-semibold">Công nghệ: {proj.technologies.filter(Boolean).join(", ")}</span>
        )}
        <p className="text-xs leading-relaxed text-slate-705 whitespace-pre-line mt-0.5 print:text-black">
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
        <div key={edu.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs font-bold">
            <span className="text-slate-900 dark:text-slate-100 font-extrabold">{edu.institution}</span>
            <span className="text-[10px] font-mono text-slate-550 dark:text-slate-400 print:text-black">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
          </div>
          {!hideRole && (
            <div className="text-slate-600 dark:text-slate-400 italic text-[11px]">{edu.degree}</div>
          )}
          {edu.description && <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-1">{edu.description}</p>}
        </div>
      );
    }

    if (layout === 'text') {
      return (
        <div key={edu.id} className="flex flex-col gap-0.5 text-xs break-inside-avoid">
          <div className="flex justify-between items-baseline font-bold">
            <span>
              {edu.institution}
              {!hideRole && <span className="font-normal text-slate-550"> ({edu.degree})</span>}
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
          </div>
          {edu.description && <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-0.5">{edu.description}</p>}
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
          <div className="text-slate-660 dark:text-slate-400 italic print:text-black">{edu.degree}</div>
        )}
        {edu.description && <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-0.5">{edu.description}</p>}
      </div>
    );
  };

  const isDefaultFont = !cvData.fontFamily || cvData.fontFamily === 'sans';
  const classicFontClass = isDefaultFont ? 'font-lora font-serif' : '';
  const sectionTitleClass = `text-[13px] font-bold uppercase tracking-wider ${activeColor.primary} pb-1 border-b border-slate-300 dark:border-slate-800 print:border-slate-400 font-serif flex items-center justify-start mt-4`;

  return (
    <div className={`flex flex-col flex-1 gap-5 text-sm ${classicFontClass}`}>
                   
                    {/* Header - Centered LaTeX Style */}
                    <div className={`flex flex-col items-center text-center w-full gap-2 border-b-2 ${activeColor.border} pb-4 print:flex-col print:items-center print:text-center`}>
                      {cvData.personalInfo.avatar && (
                        <img 
                          src={cvData.personalInfo.avatar} 
                          alt="Avatar" 
                          className="w-20 h-20 rounded-full object-cover border border-slate-300 dark:border-slate-600 mb-1" 
                        />
                      )}
                      <h1 className="text-3xl font-bold tracking-wide text-slate-950 dark:text-slate-50 uppercase m-0 print:text-black font-serif">
                        {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                      </h1>
                      <p className={`font-semibold text-xs tracking-widest uppercase ${activeColor.primary} font-serif`}>
                        {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400 text-xs mt-1 print:text-black print:justify-center print:flex-wrap font-serif">
                        <span>{cvData.personalInfo.email}</span>
                        {cvData.personalInfo.phone && <span>• {cvData.personalInfo.phone}</span>}
                        {cvData.personalInfo.location && <span>• {cvData.personalInfo.location}</span>}
                        {cvData.personalInfo.website && (
                          <span>
                            • <a 
                                href={cvData.personalInfo.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:underline"
                              >
                                {cvData.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
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
                      
                      <CustomLinksRenderer
                        customLinks={cvData.personalInfo.customLinks}
                        className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400 text-xs mt-1 print:text-black print:justify-center"
                        itemClassName="hover:underline flex items-center gap-1 font-serif"
                        showIcon={false}
                      />
                      
                      {slug && (
                        <div className="hidden print:flex flex-shrink-0 mt-2">
                          <QRCodeWidget slug={slug} />
                        </div>
                      )}
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
                            return <CustomSectionRenderer key={sec} section={customSec} activeColor={activeColor} t={t} titleClassName={sectionTitleClass} hideIcon={true} />;
                          }
                        }
                        if (sec === 'summary' && cvData.summary) {
                          const summaryTitle = cvData.sectionSettings?.summary?.title || t('summaryUpper');
                          return (
                            <div key={sec} data-section="summary" className="flex flex-col gap-1.5 break-inside-avoid">
                              <h3 className={sectionTitleClass}>
                                <span>{summaryTitle}</span>
                              </h3>
                              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 italic text-justify font-serif">{cvData.summary}</p>
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
                              IconComponent={null}
                              items={cvData.experience}
                              defaultLayoutStyle="timeline"
                              renderItem={renderExperienceItem}
                              titleClassName={sectionTitleClass}
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
                              IconComponent={null}
                              items={cvData.projects}
                              defaultLayoutStyle="timeline"
                              renderItem={renderProjectItem}
                              titleClassName={sectionTitleClass}
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
                              IconComponent={null}
                              items={cvData.education}
                              defaultLayoutStyle="timeline"
                              renderItem={renderEducationItem}
                              titleClassName={sectionTitleClass}
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
                              titleClassName={sectionTitleClass}
                              wrapperClassName="break-inside-avoid"
                              hideIcon={true}
                            />
                          );
                        }
                        if (sec === 'certificates' && cvData.certificates.length > 0) {
                          const certTitle = cvData.sectionSettings?.certificates?.title || t('certificatesUpper');
                          return (
                            <div key={sec} data-section="certificates" className="flex flex-col gap-1.5 break-inside-avoid">
                              <h3 className={sectionTitleClass}>
                                <span>{certTitle}</span>
                              </h3>
                              <div className="flex flex-col gap-1 mt-1">
                                {cvData.certificates.map((c) => (
                                  <div key={c.id} className="text-xs text-slate-700 dark:text-slate-300 font-serif">
                                    <span className="font-bold text-slate-900 dark:text-slate-100">{c.name}</span> <span className="text-[10px] text-slate-500 dark:text-slate-400">({c.date})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (sec === 'languages' && cvData.languages.length > 0) {
                          const langTitle = cvData.sectionSettings?.languages?.title || t('languagesUpper');
                          return (
                            <div key={sec} data-section="languages" className="flex flex-col gap-1.5 break-inside-avoid">
                              <h3 className={sectionTitleClass}>
                                <span>{langTitle}</span>
                              </h3>
                              <div className="text-xs text-slate-700 dark:text-slate-300 flex flex-col gap-1 mt-1 font-serif">
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
