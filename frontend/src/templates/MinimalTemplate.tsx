import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';
import CustomSectionRenderer from './CustomSectionRenderer';
import LayoutSectionRenderer from './LayoutSectionRenderer';
import { CustomLinksRenderer, parseFormatting } from './TemplateHelpers';


export default function MinimalTemplate({ cvData, activeColor, t }: TemplateProps) {
  
  const renderExperienceItem = (exp: any, _layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    return (
      <div key={exp.id} className="flex flex-col gap-1 break-inside-avoid pb-1">
        <div className="flex justify-between items-baseline text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-[13px]">{exp.company}</span>
            {!hideRole && (
              <>
                <span className="mx-2 text-slate-350 dark:text-slate-700">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium italic">{exp.position}</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 print:text-black flex items-center gap-1.5 shrink-0 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            {exp.startDate} – {exp.endDate || 'Hiện tại'}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 text-justify mt-0.5 whitespace-pre-line print:text-black">
          {parseFormatting(exp.description)}
        </p>
      </div>
    );
  };

  const renderProjectItem = (proj: any, _layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');
    const hideUrl = hiddenFields.includes('url');
    const hideTech = hiddenFields.includes('technologies');
    const hideEmbed = hiddenFields.includes('embed');

    return (
      <div key={proj.id} className="flex flex-col gap-1 break-inside-avoid pb-1">
        <div className="flex justify-between items-baseline text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-[13px]">{proj.name}</span>
            {!hideRole && (
              <>
                <span className="mx-2 text-slate-350 dark:text-slate-700">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium italic">{proj.role}</span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 print:text-black flex items-center gap-1.5 shrink-0 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            {proj.startDate}
          </span>
        </div>
        {!hideUrl && proj.url && (
          <a
            href={proj.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[10px] ${activeColor.primary} hover:underline font-bold print:text-black print:no-underline`}
          >
            {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        )}
        {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-light">
            {proj.technologies.filter(Boolean).join("  |  ")}
          </span>
        )}
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 text-justify mt-0.5 whitespace-pre-line print:text-black">
          {parseFormatting(proj.description)}
        </p>
        {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
      </div>
    );
  };

  const isDefaultFont = !cvData.fontFamily || cvData.fontFamily === 'sans';
  const minimalFontClass = isDefaultFont ? 'font-sans' : '';
  const sectionTitleClass = `text-xs font-bold uppercase tracking-widest ${activeColor.primary} pb-1 border-b border-slate-100 dark:border-slate-800 print:border-slate-200 mt-4`;

  return (
    <div className={`flex flex-col flex-1 gap-8 text-sm max-w-4xl mx-auto ${minimalFontClass} print:gap-6`}>
      {/* Elegant Editorial Header */}
      <div className="text-center flex flex-col items-center gap-1.5 pb-4 border-b border-slate-100 dark:border-slate-800 print:border-slate-200 relative">

        {cvData.personalInfo.avatar && (
          <img 
            src={cvData.personalInfo.avatar} 
            alt="Avatar" 
            className="w-20 h-20 rounded-full object-cover border border-slate-200 dark:border-slate-800 mb-2" 
          />
        )}
        <h1 className="text-3.5xl font-light tracking-wide text-slate-900 dark:text-slate-100 uppercase">
          {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
        </h1>
        <p className={`${activeColor.primary} font-medium text-xs tracking-widest uppercase`}>
          {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-slate-500 dark:text-slate-400 text-xs mt-1 print:text-black print:justify-center print:flex-wrap">
          <span>{cvData.personalInfo.email}</span>
          {cvData.personalInfo.phone && <span>• {cvData.personalInfo.phone}</span>}
          {cvData.personalInfo.location && <span>• {cvData.personalInfo.location}</span>}
          {cvData.personalInfo.website && (
            <span>
              • <a 
                  href={cvData.personalInfo.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline print:text-black print:no-underline"
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
        {/* Custom Links Renderer */}
        <CustomLinksRenderer
          customLinks={cvData.personalInfo.customLinks}
          className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-slate-500 dark:text-slate-400 text-xs mt-1 print:text-black print:justify-center"
          itemClassName="hover:underline flex items-center gap-1 font-medium"
          showIcon={false}
        />
      </div>

      {/* Summary */}
      {cvData.summary && (
        <div data-section="summary" className="flex flex-col gap-2.5 break-inside-avoid max-w-2xl mx-auto">
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350 text-center italic">
            "{parseFormatting(cvData.summary)}"
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
                  <CustomSectionRenderer section={customSec} activeColor={activeColor} t={t} titleClassName={sectionTitleClass} hideIcon={true} />
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
                  IconComponent={null}
                  items={cvData.experience}
                  defaultLayoutStyle="timeline"
                  renderItem={renderExperienceItem}
                  titleClassName={sectionTitleClass}
                  hideHeader={false}
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
                  IconComponent={null}
                  items={cvData.projects}
                  defaultLayoutStyle="timeline"
                  renderItem={renderProjectItem}
                  titleClassName={sectionTitleClass}
                  hideHeader={false}
                />
              </div>
            );
          }
          return null;
        });
      })()}

      {/* Grid elements at bottom */}
      <div className="grid grid-cols-2 gap-8 border-t border-slate-100 dark:border-slate-800 pt-4 print:border-slate-200">
        
        {/* Left Grid: Education & Certs */}
        <div className="flex flex-col gap-5">
          {/* Education */}
          {cvData.education.length > 0 && (
            <div data-section="education" className="flex flex-col gap-3 break-inside-avoid">
              <h3 className={sectionTitleClass}>
                <span>{cvData.sectionSettings?.education?.title || t('educationUpper')}</span>
              </h3>
              {cvData.education.map((edu) => {
                const hideRole = cvData.sectionSettings?.education?.hideFields?.includes('role');
                return (
                  <div key={edu.id} className="flex flex-col gap-0.5 text-xs">
                    <div className="flex justify-between items-start font-bold">
                      <span className="text-slate-900 dark:text-slate-100">{edu.institution}</span>
                      <span className="text-[9px] text-slate-400 print:text-black font-medium">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
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
              <h3 className={sectionTitleClass}>
                <span>{cvData.sectionSettings?.certificates?.title || t('certificatesUpper')}</span>
              </h3>
              {cvData.certificates.map((c) => (
                <div key={c.id} className="text-xs text-slate-700 dark:text-slate-350 leading-snug">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{c.name}</span>
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
            <div data-section="skills" className="flex flex-col gap-3 break-inside-avoid">
              <h3 className={sectionTitleClass}>
                <span>{cvData.sectionSettings?.skills?.title || t('skillsUpper')}</span>
              </h3>
              <div className="flex flex-col gap-2">
                {cvData.skills.map((grp: any) => (
                  <div key={grp.id} className="flex flex-col gap-1 break-inside-avoid text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {grp.category}
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {grp.skills.filter(Boolean).join('  |  ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {cvData.languages.length > 0 && (
            <div data-section="languages" className="flex flex-col gap-2 break-inside-avoid">
              <h3 className={sectionTitleClass}>
                <span>{cvData.sectionSettings?.languages?.title || t('languagesUpper')}</span>
              </h3>
              <div className="text-xs flex flex-col gap-1">
                {cvData.languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{l.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] print:text-black font-medium">{l.level}</span>
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
                  <CustomSectionRenderer section={sec} activeColor={activeColor} t={t} titleClassName={sectionTitleClass} hideIcon={true} />
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
