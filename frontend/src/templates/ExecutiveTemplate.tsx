import { Briefcase, GraduationCap, FolderGit2, Award, Languages, ExternalLink } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';
import CustomSectionRenderer from './CustomSectionRenderer';
import LayoutSectionRenderer from './LayoutSectionRenderer';
import SkillsSectionRenderer from './SkillsSectionRenderer';
import { CustomLinksRenderer, parseFormatting } from './TemplateHelpers';


export default function ExecutiveTemplate({ cvData, activeColor, t }: TemplateProps) {
  
  const renderExperienceItem = (exp: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    if (layout === 'cards') {
      return (
        <div key={exp.id} className="p-3.5 bg-slate-50/40 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs font-bold font-serif">
            <span className="text-slate-900 dark:text-slate-100 text-sm">{exp.company}</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black font-normal">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
          </div>
          {!hideRole && (
            <span className={`text-[11px] font-semibold ${activeColor.primary} font-serif`}>{exp.position}</span>
          )}
          <p className="text-xs leading-relaxed text-slate-655 dark:text-slate-400 whitespace-pre-line mt-1 print:text-black font-sans">
            {parseFormatting(exp.description)}
          </p>
        </div>
      );
    }

    if (layout === 'text') {
      return (
        <div key={exp.id} className="flex flex-col gap-0.5 break-inside-avoid">
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100 font-serif">
              {exp.company}
              {!hideRole && <span className="font-normal text-slate-500 font-sans"> ({exp.position})</span>}
            </span>
            <span className="text-[10px] font-mono text-slate-400">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line mt-0.5 print:text-black font-sans">
            {parseFormatting(exp.description)}
          </p>
        </div>
      );
    }

    // Default timeline
    return (
      <div key={exp.id} className="flex flex-col gap-1 break-inside-avoid border-l-2 border-slate-250 dark:border-slate-850 pl-3.5 print:border-slate-300">
        <div className="flex justify-between items-start text-xs">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 font-serif text-[13px]">{exp.company}</span>
            {!hideRole && (
              <>
                <span className="text-slate-400 mx-1.5">•</span>
                <span className={`font-semibold ${activeColor.primary} font-serif`}>{exp.position}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line mt-1 print:text-black font-sans">
          {parseFormatting(exp.description)}
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
        <div key={proj.id} className="p-3.5 bg-slate-50/40 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs font-bold font-serif">
            <span className="text-slate-900 dark:text-slate-100 text-sm">{proj.name}</span>
            <span className="text-[10px] font-mono text-slate-550 dark:text-slate-400 font-normal">{proj.startDate}</span>
          </div>
          {!hideRole && (
            <span className={`text-[11px] font-semibold ${activeColor.primary} font-serif`}>{proj.role}</span>
          )}
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline font-bold print:text-black font-sans`}>
              <ExternalLink className="h-2.5 w-2.5" />
              {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">
              {proj.technologies.filter(Boolean).join(", ")}
            </span>
          )}
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 mt-1 print:text-slate-950 whitespace-pre-line font-sans">
            {parseFormatting(proj.description)}
          </p>
          {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
        </div>
      );
    }

    if (layout === 'text') {
      return (
        <div key={proj.id} className="flex flex-col gap-0.5 break-inside-avoid">
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100 font-serif">
              {proj.name}
              {!hideRole && <span className="font-normal text-slate-550 font-sans"> ({proj.role})</span>}
            </span>
            <span className="text-[10px] font-mono text-slate-400">{proj.startDate}</span>
          </div>
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline font-bold print:text-black font-sans`}>
              <ExternalLink className="h-2.5 w-2.5" />
              {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">
              {proj.technologies.filter(Boolean).join(", ")}
            </span>
          )}
          <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-400 whitespace-pre-line mt-0.5 print:text-black font-sans">
            {parseFormatting(proj.description)}
          </p>
          {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
        </div>
      );
    }

    // Default timeline
    return (
      <div key={proj.id} className="flex flex-col gap-1 break-inside-avoid border-l-2 border-slate-250 dark:border-slate-855 pl-3.5 print:border-slate-300">
        <div className="flex justify-between items-center text-xs">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 font-serif text-[13px]">{proj.name}</span>
            {!hideUrl && proj.url && (
              <a
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline ml-2 font-bold print:text-black print:no-underline font-sans`}
              >
                <ExternalLink className="h-2.5 w-2.5" />
                {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            )}
            {!hideRole && (
              <>
                <span className="text-slate-400 mx-1.5">•</span>
                <span className="text-[10px] text-slate-505 dark:text-slate-400 font-semibold italic font-sans">{proj.role}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{proj.startDate}</span>
        </div>
        {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-sans">Công nghệ: {proj.technologies.filter(Boolean).join(", ")}</span>
        )}
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line mt-1 print:text-black font-sans">
          {parseFormatting(proj.description)}
        </p>
        {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
      </div>
    );
  };

  const renderEducationItem = (edu: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    if (layout === 'cards') {
      return (
        <div key={edu.id} className="p-3 bg-slate-50/40 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs font-bold font-serif">
            <span className="text-slate-900 dark:text-slate-100">{edu.institution}</span>
            <span className="text-[10px] font-mono text-slate-550 dark:text-slate-400 print:text-black font-normal">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
          </div>
          {!hideRole && (
            <div className="text-slate-600 dark:text-slate-400 font-semibold italic font-serif">{edu.degree}</div>
          )}
          {edu.description && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 font-sans">{parseFormatting(edu.description)}</p>}
        </div>
      );
    }

    if (layout === 'text') {
      return (
        <div key={edu.id} className="flex flex-col gap-0.5 text-xs break-inside-avoid">
          <div className="flex justify-between items-baseline font-bold font-serif">
            <span>
              {edu.institution}
              {!hideRole && <span className="font-normal text-slate-500 font-sans"> ({edu.degree})</span>}
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black font-normal">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
          </div>
          {edu.description && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5 font-sans">{parseFormatting(edu.description)}</p>}
        </div>
      );
    }

    // Default timeline
    return (
      <div key={edu.id} className="flex flex-col gap-0.5 text-xs break-inside-avoid">
        <div className="flex justify-between items-start font-serif font-bold">
          <span className="text-slate-900 dark:text-slate-100">{edu.institution}</span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 print:text-black font-normal">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
        </div>
        {!hideRole && (
          <div className="text-slate-660 dark:text-slate-400 font-semibold font-serif italic print:text-black">{edu.degree}</div>
        )}
        {edu.description && <p className="text-[11px] text-slate-505 dark:text-slate-400 italic mt-0.5 font-sans">{parseFormatting(edu.description)}</p>}
      </div>
    );
  };

  const isDefaultFont = !cvData.fontFamily || cvData.fontFamily === 'sans';
  const nameFontClass = isDefaultFont ? 'font-playfair font-serif tracking-wide' : '';
  const bodyFontClass = isDefaultFont ? 'font-inter font-sans' : '';
  const sectionTitleClass = `text-[13px] font-bold uppercase tracking-widest ${activeColor.primary} pb-1.5 border-b-2 ${activeColor.border} print:border-black font-serif flex items-center justify-start mt-3 mb-2`;

  const baseOrder = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
  const order = [...baseOrder];
  const customSecs = cvData.customSections || [];
  customSecs.forEach((sec: any) => {
    if (!order.includes(sec.id)) {
      order.push(sec.id);
    }
  });

  const leftSections = order.filter(sec => 
    ['experience', 'projects'].includes(sec) ||
    (sec.startsWith('custom-') && customSecs.find(s => s.id === sec)?.layoutStyle !== 'cards')
  );

  const rightSections = order.filter(sec => 
    ['education', 'skills', 'languages', 'certificates'].includes(sec) ||
    (sec.startsWith('custom-') && customSecs.find(s => s.id === sec)?.layoutStyle === 'cards')
  );

  return (
    <div className={`flex-1 flex flex-col ${bodyFontClass}`}>
      
      {/* Top Header */}
      <div className={`border-b-[4px] ${activeColor.border} pb-5 mb-5 flex justify-between items-start print:border-slate-800`}>
        <div>
          <h1 className={`text-3.5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight m-0 uppercase ${nameFontClass}`}>
            {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
          </h1>
          <p className={`${activeColor.primary} font-bold text-xs tracking-widest uppercase mt-2 font-serif`}>
            {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-6 flex-1">
        
        {/* Left Wide Section (2/3) */}
        <div className="md:col-span-2 print:col-span-2 flex flex-col gap-6 pr-4 border-r border-slate-100 dark:border-slate-850 print:border-slate-250">
          
          {/* Summary Boxquote with thick left gold/bronze border */}
          {cvData.summary && (
            <div data-section="summary" className="border-l-4 border-amber-500 bg-slate-50/50 dark:bg-slate-900/30 p-4 italic print:bg-white dark:border-amber-600 break-inside-avoid shadow-sm rounded-r-lg">
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 text-justify">{parseFormatting(cvData.summary)}</p>
            </div>
          )}

          {/* Dynamic Left Column Sections */}
          {leftSections.map((sec) => {
            if (sec.startsWith('custom-')) {
              const customSec = customSecs.find(s => s.id === sec);
              if (customSec) {
                return <CustomSectionRenderer key={sec} section={customSec} activeColor={activeColor} t={t} titleClassName={sectionTitleClass} />;
              }
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
                  IconComponent={FolderGit2}
                  items={cvData.projects}
                  defaultLayoutStyle="timeline"
                  renderItem={renderProjectItem}
                  titleClassName={sectionTitleClass}
                />
              );
            }
            return null;
          })}
        </div>

        {/* Right Narrow Column (1/3) */}
        <div className="md:col-span-1 print:col-span-1 flex flex-col gap-6">
          {cvData.personalInfo.avatar && (
            <div className="flex justify-center mb-1">
              <img 
                src={cvData.personalInfo.avatar} 
                alt="Avatar" 
                className={`w-24 h-24 rounded-full object-cover border-2 ${activeColor.border} p-0.5 shadow-md`} 
              />
            </div>
          )}
          
          {/* Contacts Info */}
          <div className="flex flex-col gap-2 break-inside-avoid">
            <h4 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} font-serif border-b border-slate-200 dark:border-slate-800 pb-1.5 mb-1.5`}>
              {t('personalInfo')}
            </h4>
            <div className="flex flex-col gap-2 text-xs text-slate-700 dark:text-slate-300 font-sans">
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
                  <span className="font-bold text-slate-800 dark:text-slate-200">Web:</span>{" "}
                  <a 
                    href={cvData.personalInfo.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {cvData.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
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
            
            <CustomLinksRenderer
              customLinks={cvData.personalInfo.customLinks}
              className="flex flex-col gap-2 text-xs text-slate-700 dark:text-slate-300 mt-1"
              itemClassName="hover:underline flex items-center gap-1 font-medium"
            />
          </div>

          {/* Right Column Dynamic Sections */}
          {rightSections.map((sec) => {
            if (sec.startsWith('custom-')) {
              const customSec = customSecs.find(s => s.id === sec);
              if (customSec) {
                return <CustomSectionRenderer key={sec} section={customSec} activeColor={activeColor} t={t} titleClassName={sectionTitleClass} />;
              }
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
                />
              );
            }
            if (sec === 'languages' && cvData.languages.length > 0) {
              const langTitle = cvData.sectionSettings?.languages?.title || t('languagesUpper');
              return (
                <div key={sec} data-section="languages" className="flex flex-col gap-2 break-inside-avoid">
                  <h3 className={sectionTitleClass}>
                    <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>{langTitle}</span>
                  </h3>
                  <div className="flex flex-col gap-2">
                    {cvData.languages.map((l) => (
                      <div key={l.id} className="text-xs flex flex-col gap-0.5">
                        <span className="font-bold text-slate-805 dark:text-slate-200">{l.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{l.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (sec === 'certificates' && cvData.certificates.length > 0) {
              const certTitle = cvData.sectionSettings?.certificates?.title || t('certificatesUpper');
              return (
                <div key={sec} data-section="certificates" className="flex flex-col gap-3 break-inside-avoid">
                  <h3 className={sectionTitleClass}>
                    <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>{certTitle}</span>
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {cvData.certificates.map((c) => (
                      <div key={c.id} className="text-xs flex flex-col gap-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200 leading-snug">{c.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{c.issuer} ({c.date})</span>
                      </div>
                    ))}
                  </div>
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
