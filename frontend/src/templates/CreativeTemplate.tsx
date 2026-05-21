import { Briefcase, GraduationCap, FolderGit2, Award, Languages, ExternalLink, User } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';
import CustomSectionRenderer from './CustomSectionRenderer';
import LayoutSectionRenderer from './LayoutSectionRenderer';
import SkillsSectionRenderer from './SkillsSectionRenderer';
import { CustomLinksRenderer } from './TemplateHelpers';
import { QRCodeWidget } from '../components/QRCodeWidget';

export default function CreativeTemplate({ cvData, activeColor, t, slug }: TemplateProps) {
  
  const renderExperienceItem = (exp: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    if (layout === 'cards') {
      return (
        <div key={exp.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] flex flex-col gap-1.5 break-inside-avoid print:bg-white print:border-slate-200 print:shadow-none print:hover:scale-100">
          <div className="flex justify-between items-start text-xs">
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm leading-snug">{exp.company}</span>
            <span className="text-[10px] font-mono font-bold bg-slate-105 dark:bg-slate-800/85 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded print:bg-slate-50">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
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

    // Default timeline with left border dashed and diamond bullet
    return (
      <div key={exp.id} className={`border-l-2 border-dashed ${activeColor.border} pl-4 py-0.5 flex flex-col gap-1 relative print:!border-slate-300 dark:border-slate-600 break-inside-avoid`}>
        <span className={`absolute -left-[5px] top-2.5 w-2 h-2 rotate-45 ${activeColor.bg} print:bg-black border border-white dark:border-slate-900`} />
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
        <div key={proj.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-purple-300 dark:hover:border-purple-800/80 flex flex-col gap-1.5 break-inside-avoid print:bg-white print:border-slate-200 print:shadow-none print:hover:scale-100 print:hover:shadow-none print:border">
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
              {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
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
              {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
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

    // Default timeline with left border dashed and diamond bullet
    return (
      <div key={proj.id} className={`border-l-2 border-dashed ${activeColor.border} pl-4 py-0.5 flex flex-col gap-1 print:!border-slate-300 dark:border-slate-600 break-inside-avoid`}>
        <span className={`absolute -left-[5px] top-2.5 w-2 h-2 rotate-45 ${activeColor.bg} print:bg-black border border-white dark:border-slate-900`} />
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
        <div key={edu.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1 break-inside-avoid">
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
              {!hideRole && <span className="font-normal text-slate-550"> ({edu.degree})</span>}
            </span>
            <span className="text-[10px] font-mono text-slate-455 dark:text-slate-500">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
          </div>
          {edu.description && <p className="text-[10px] text-slate-550 dark:text-slate-400 italic mt-0.5">{edu.description}</p>}
        </div>
      );
    }

    // Default timeline with dash border and diamond bullet
    return (
      <div key={edu.id} className={`border-l-2 border-dashed ${activeColor.border} pl-4 py-0.5 flex flex-col gap-0.5 text-xs relative print:!border-slate-300 dark:border-slate-600 break-inside-avoid`}>
        <span className={`absolute -left-[5px] top-2.5 w-2 h-2 rotate-45 ${activeColor.bg} print:bg-black border border-white dark:border-slate-900`} />
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

  const isDefaultFont = !cvData.fontFamily || cvData.fontFamily === 'sans';
  const creativeFontClass = isDefaultFont ? 'font-sans' : '';
  const sectionTitleClass = `text-[13px] font-black uppercase tracking-wider ${activeColor.primary} pb-1 border-b-2 ${activeColor.border} print:border-black flex items-center gap-2 mb-3`;

  // Parse Section order
  const baseOrder = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
  const order = [...baseOrder];
  const customSecs = cvData.customSections || [];
  customSecs.forEach((sec: any) => {
    if (!order.includes(sec.id)) {
      order.push(sec.id);
    }
  });

  return (
    <div className={`flex flex-col flex-1 gap-6 text-sm ${creativeFontClass}`}>
      
      {/* Creative Asymmetric Slanted/Split Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-stretch min-h-[150px] print:border-slate-300 print:shadow-none print:rounded-none">
        
        {/* Left Block: Slanted active color block (60% width on md) */}
        <div className={`flex-1 md:w-3/5 p-6 flex items-center justify-between gap-4 ${activeColor.bg} text-white relative z-10 print:bg-white print:text-black print:p-0 print:border-b-2 print:border-black`}>
          <div className="flex items-center gap-4">
            {cvData.personalInfo.avatar && (
              <img 
                src={cvData.personalInfo.avatar} 
                alt="Avatar" 
                className={`w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md ring-4 ring-offset-2 ring-offset-transparent ${activeColor.primary}`} 
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
        </div>

        {/* Right Block: Contrasting Dark Block (40% width on md) */}
        <div className="hidden md:flex md:w-2/5 p-6 bg-slate-900 dark:bg-slate-950 text-slate-100 flex-col justify-center gap-1 z-10 print:hidden font-mono text-xs">
          {cvData.personalInfo.email && <div className="truncate">Email: {cvData.personalInfo.email}</div>}
          {cvData.personalInfo.phone && <div>Phone: {cvData.personalInfo.phone}</div>}
          {cvData.personalInfo.location && <div>Loc: {cvData.personalInfo.location}</div>}
          <div className="flex flex-wrap gap-2 mt-1">
            {cvData.personalInfo.website && (
              <a href={cvData.personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline text-[10px] text-purple-300 font-bold">
                web
              </a>
            )}
            {cvData.personalInfo.github && (
              <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline text-[10px] text-purple-300 font-bold">
                github
              </a>
            )}
            {cvData.personalInfo.linkedin && (
              <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-[10px] text-purple-300 font-bold">
                linkedin
              </a>
            )}
          </div>
        </div>

        {/* Diagonal Slanted background overlay for md layout */}
        <div className={`absolute top-0 right-0 left-0 bottom-0 pointer-events-none z-0 hidden md:block ${activeColor.bg} print:hidden`} style={{ clipPath: 'polygon(0 0, 62% 0, 58% 100%, 0% 100%)' }} />
      </div>

      {/* Mobile/Print fallback contacts (visible when header is printed or on mobile) */}
      <div className="flex md:hidden print:flex flex-wrap gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400 text-xs font-mono justify-start print:justify-start border-b pb-4 print:border-slate-300">
        {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
        {cvData.personalInfo.phone && <span>• {cvData.personalInfo.phone}</span>}
        {cvData.personalInfo.location && <span>• {cvData.personalInfo.location}</span>}
        {cvData.personalInfo.website && (
          <a href={cvData.personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
            • {cvData.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        )}
        {cvData.personalInfo.github && (
          <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
            • github.com/{cvData.personalInfo.github.split('/').pop()}
          </a>
        )}
        {cvData.personalInfo.linkedin && (
          <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
            • linkedin.com/in/{cvData.personalInfo.linkedin.split('/').pop()}
          </a>
        )}
        
        <CustomLinksRenderer
          customLinks={cvData.personalInfo.customLinks}
          className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400 text-xs font-mono"
          itemClassName="hover:underline flex items-center gap-1"
          showIcon={false}
        />
        
        {slug && (
          <div className="hidden print:flex ml-auto flex-shrink-0">
            <QRCodeWidget slug={slug} />
          </div>
        )}
      </div>

      {/* Dynamic sections */}
      {order.map((sec) => {
        if (sec.startsWith('custom-')) {
          const customSec = customSecs.find(s => s.id === sec);
          if (customSec) {
            return <CustomSectionRenderer key={sec} section={customSec} activeColor={activeColor} t={t} titleClassName={sectionTitleClass} />;
          }
        }
        if (sec === 'summary' && cvData.summary) {
          return (
            <div key={sec} data-section="summary" className={`${activeColor.lightBg} p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700/40 print:bg-white dark:bg-slate-900/50 print:p-0 print:border-none break-inside-avoid shadow-sm`}>
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
              titleClassName={sectionTitleClass}
            />
          );
        }
        if (sec === 'projects' && cvData.projects.length > 0) {
          const projTitle = cvData.sectionSettings?.projects?.title || t('projectsUpper');
          const setting = cvData.sectionSettings?.projects;
          const layoutStyle = setting?.layoutStyle || 'timeline';
          const hideFields = setting?.hideFields || [];

          if (layoutStyle === 'cards') {
            return (
              <div key={sec} data-section="projects" className="flex flex-col gap-4 break-inside-avoid">
                <h3 className={sectionTitleClass}>
                  <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>{projTitle}</span>
                </h3>
                {/* Asymmetric Staggered Grid on Screen, normal grid in Print */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
                  {cvData.projects.map((proj: any, idx: number) => {
                    const staggerClass = idx % 2 === 1 ? 'md:mt-6 print:mt-0' : '';
                    return (
                      <div key={proj.id} className={`${staggerClass} p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-purple-300 dark:hover:border-purple-800/80 flex flex-col gap-1.5 break-inside-avoid print:bg-white print:border-slate-200 print:shadow-none print:hover:scale-100 print:hover:shadow-none print:border print:mt-0`}>
                        <div className="flex justify-between items-start text-xs">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm leading-snug">{proj.name}</span>
                          <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{proj.startDate}</span>
                        </div>
                        {!hideFields.includes('role') && proj.role && (
                          <span className={`text-[11px] font-semibold ${activeColor.primary} leading-snug`}>
                            {proj.role}
                          </span>
                        )}
                        {!hideFields.includes('url') && proj.url && (
                          <a href={proj.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline font-bold print:text-black`}>
                            <ExternalLink className="h-2.5 w-2.5" />
                            {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        )}
                        {!hideFields.includes('technologies') && proj.technologies.filter(Boolean).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {proj.technologies.filter(Boolean).map((tech: string, i: number) => (
                              <span key={i} className={`${activeColor.pill} rounded px-2 py-0.5 text-[9px] font-bold font-mono`}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line mt-1 print:text-black">
                          {proj.description}
                        </p>
                        {!hideFields.includes('embed') && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

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
        if (sec === 'certificates' && cvData.certificates.length > 0) {
          const certTitle = cvData.sectionSettings?.certificates?.title || t('certificatesUpper');
          return (
            <div key={sec} data-section="certificates" className="flex flex-col gap-2 break-inside-avoid">
              <h3 className={sectionTitleClass}>
                <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>{certTitle}</span>
              </h3>
              <div className="flex flex-col gap-1.5 text-xs text-slate-755">
                {cvData.certificates.map((c) => (
                  <div key={c.id} className="leading-snug flex items-center">
                    <span className={`inline-block w-1.5 h-1.5 rotate-45 ${activeColor.bg} print:bg-black mr-2`} />
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">{c.name}</span>
                    <span className="mx-2 text-slate-400">•</span>
                    <span className="text-slate-550 dark:text-slate-400 text-[11px] font-medium">{c.issuer} ({c.date})</span>
                  </div>
                ))}
              </div>
            </div>
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
              <div className="flex flex-col gap-1 text-xs">
                {cvData.languages.map((l) => (
                  <div key={l.id} className="flex justify-between font-medium items-center">
                    <div className="flex items-center">
                      <span className={`inline-block w-1.5 h-1.5 rotate-45 ${activeColor.bg} print:bg-black mr-2`} />
                      <span className="font-bold text-slate-900 dark:text-slate-100">{l.name}</span>
                    </div>
                    <span className="text-slate-505 dark:text-slate-400 font-mono text-[10px] print:text-black bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}

    </div>
  );
}
