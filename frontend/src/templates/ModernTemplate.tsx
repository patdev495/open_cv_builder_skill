import { User, Briefcase, GraduationCap, FolderGit2, Award, Languages, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';
import CustomSectionRenderer from './CustomSectionRenderer';
import LayoutSectionRenderer from './LayoutSectionRenderer';
import SkillsSectionRenderer from './SkillsSectionRenderer';
import { CustomLinksRenderer } from './TemplateHelpers';
import { QRCodeWidget } from '../components/QRCodeWidget';

export default function ModernTemplate({ cvData, activeColor, t, slug }: TemplateProps) {
  
  const renderExperienceItem = (exp: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    if (layout === 'cards') {
      return (
        <div key={exp.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-slate-150 dark:border-slate-800 flex flex-col gap-1 break-inside-avoid shadow-sm print:bg-white print:border-slate-200 print:shadow-none">
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
      <div key={exp.id} className="flex flex-col gap-1 break-inside-avoid pl-3 border-l-2 border-slate-200 dark:border-slate-800/80 print:border-slate-300">
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
          <span className="text-[10px] font-mono font-bold text-slate-405 print:text-slate-800 dark:text-slate-200">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
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
      <div key={proj.id} className="flex flex-col gap-1 break-inside-avoid pl-3 border-l-2 border-slate-200 dark:border-slate-800/80 print:border-slate-300">
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
          <span className="text-[10px] font-mono font-bold text-slate-405 print:text-slate-800 dark:text-slate-200">{proj.startDate}</span>
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
              {!hideRole && <span className="font-normal text-slate-550"> ({edu.degree})</span>}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-405 print:text-slate-800 dark:text-slate-200">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
          </div>
          {edu.description && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">{edu.description}</p>}
        </div>
      );
    }

    // Default timeline
    return (
      <div key={edu.id} className="flex flex-col gap-0.5 text-xs break-inside-avoid pl-3 border-l-2 border-slate-200 dark:border-slate-800/80 print:border-slate-300">
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

  const isDefaultFont = !cvData.fontFamily || cvData.fontFamily === 'sans';
  const modernFontClass = isDefaultFont ? 'font-sans' : '';
  const sectionTitleClass = `text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1.5 font-sans flex items-center gap-1.5 print:text-black border-b border-slate-200 dark:border-slate-800/80 print:border-slate-300 mb-2`;

  const baseOrder = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
  const order = [...baseOrder];
  const customSecs = cvData.customSections || [];
  customSecs.forEach((sec: any) => {
    if (!order.includes(sec.id)) {
      order.push(sec.id);
    }
  });

  const sidebarSections = order.filter(sec => 
    ['skills', 'languages'].includes(sec) ||
    (sec.startsWith('custom-') && customSecs.find(s => s.id === sec)?.layoutStyle === 'cards')
  );

  const mainSections = order.filter(sec => 
    ['summary', 'experience', 'projects', 'education', 'certificates'].includes(sec) ||
    (sec.startsWith('custom-') && customSecs.find(s => s.id === sec)?.layoutStyle !== 'cards')
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 gap-6 flex-1 text-sm ${modernFontClass}`}>
      
      {/* Left Column: 4/12 width */}
      <div className="md:col-span-4 print:col-span-4 flex flex-col gap-6 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md border border-slate-200/40 dark:border-slate-800/50 shadow-sm print:bg-transparent print:border-0 print:p-0 print:shadow-none print:backdrop-blur-none">
        
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-800/60 print:items-start print:text-left print:border-slate-350">
          {cvData.personalInfo.avatar && (
            <img 
              src={cvData.personalInfo.avatar} 
              alt="Avatar" 
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-800 shadow-sm" 
            />
          )}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight m-0 print:text-black">
              {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
            </h1>
            <p className={`${activeColor.primary} font-bold text-xs tracking-wider uppercase mt-1 print:text-slate-800 dark:text-slate-200`}>
              {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
            </p>
          </div>
        </div>

        {/* Contact Info (vertical list with nice details) */}
        <div className="flex flex-col gap-2.5 text-xs text-slate-650 dark:text-slate-400 font-medium">
          {cvData.personalInfo.email && (
            <div className="flex items-center gap-2 break-all">
              <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="text-slate-850 dark:text-slate-200">{cvData.personalInfo.email}</span>
            </div>
          )}
          {cvData.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="text-slate-850 dark:text-slate-200">{cvData.personalInfo.phone}</span>
            </div>
          )}
          {cvData.personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="text-slate-850 dark:text-slate-200">{cvData.personalInfo.location}</span>
            </div>
          )}
          {cvData.personalInfo.website && (
            <div className="flex items-center gap-2 break-all">
              <ExternalLink className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <a href={cvData.personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-slate-850 dark:text-slate-200 hover:underline">
                {cvData.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          )}
          {cvData.personalInfo.github && (
            <div className="flex items-center gap-2 break-all">
              <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 shrink-0">GH</span>
              <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-slate-850 dark:text-slate-200 hover:underline">
                github.com/{cvData.personalInfo.github.split('/').pop()}
              </a>
            </div>
          )}
          {cvData.personalInfo.linkedin && (
            <div className="flex items-center gap-2 break-all">
              <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 shrink-0">LN</span>
              <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-850 dark:text-slate-200 hover:underline">
                linkedin.com/in/{cvData.personalInfo.linkedin.split('/').pop()}
              </a>
            </div>
          )}
          
          <CustomLinksRenderer
            customLinks={cvData.personalInfo.customLinks}
            className="flex flex-col gap-2.5 pt-1"
            itemClassName="flex items-center gap-2 text-xs font-medium text-slate-850 dark:text-slate-200 hover:underline"
            showIcon={true}
          />
        </div>

        {sidebarSections.length > 0 && <hr className="border-slate-200/50 dark:border-slate-800/50 print:border-slate-300" />}

        {/* Sidebar Sections */}
        {sidebarSections.map((sec) => {
          if (sec.startsWith('custom-')) {
            const customSec = customSecs.find(s => s.id === sec);
            if (customSec) {
              return <CustomSectionRenderer key={sec} section={customSec} activeColor={activeColor} t={t} titleClassName={sectionTitleClass} />;
            }
          }
          if (sec === 'skills' && cvData.skills.length > 0) {
            return (
              <SkillsSectionRenderer
                key={sec}
                cvData={cvData}
                activeColor={activeColor}
                t={t}
                titleClassName={sectionTitleClass}
              />
            );
          }
          if (sec === 'languages' && cvData.languages.length > 0) {
            const langTitle = cvData.sectionSettings?.languages?.title || t('languagesUpper');
            return (
              <div key={sec} data-section="languages" className="flex flex-col gap-2">
                <h3 className={sectionTitleClass}>
                  <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>{langTitle}</span>
                </h3>
                <div className="flex flex-col gap-1.5">
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
          return null;
        })}

        {slug && (
          <div className="hidden print:flex flex-col items-center gap-2 mt-auto border-t border-slate-250/50 dark:border-slate-800/50 pt-4">
            <QRCodeWidget slug={slug} />
          </div>
        )}
      </div>

      {/* Right Column: 8/12 width */}
      <div className="md:col-span-8 print:col-span-8 flex flex-col gap-6">
        
        {mainSections.map((sec) => {
          if (sec.startsWith('custom-')) {
            const customSec = customSecs.find(s => s.id === sec);
            if (customSec) {
              return (
                <div key={sec} className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-3 break-inside-avoid print:bg-white print:border-slate-200 print:shadow-none print:backdrop-blur-none transition-all duration-300 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700">
                  <CustomSectionRenderer section={customSec} activeColor={activeColor} t={t} titleClassName={sectionTitleClass} hideHeader={false} />
                </div>
              );
            }
          }
          if (sec === 'summary' && cvData.summary) {
            const summaryTitle = cvData.sectionSettings?.summary?.title || t('summaryUpper');
            return (
              <div key={sec} data-section="summary" className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-3 break-inside-avoid print:bg-white print:border-slate-200 print:shadow-none print:backdrop-blur-none transition-all duration-300 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700">
                <h3 className={sectionTitleClass}>
                  <User className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>{summaryTitle}</span>
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium text-justify">{cvData.summary}</p>
              </div>
            );
          }
          if (sec === 'experience' && cvData.experience.length > 0) {
            const expTitle = cvData.sectionSettings?.experience?.title || t('experienceUpper');
            return (
              <div key={sec} className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-3 break-inside-avoid print:bg-white print:border-slate-200 print:shadow-none print:backdrop-blur-none transition-all duration-300 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700">
                <h3 className={sectionTitleClass}>
                  <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>{expTitle}</span>
                </h3>
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
                  hideHeader={true}
                />
              </div>
            );
          }
          if (sec === 'projects' && cvData.projects.length > 0) {
            const projTitle = cvData.sectionSettings?.projects?.title || t('projectsUpper');
            return (
              <div key={sec} className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-3 break-inside-avoid print:bg-white print:border-slate-200 print:shadow-none print:backdrop-blur-none transition-all duration-300 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700">
                <h3 className={sectionTitleClass}>
                  <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>{projTitle}</span>
                </h3>
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
                  hideHeader={true}
                />
              </div>
            );
          }
          if (sec === 'education' && cvData.education.length > 0) {
            const eduTitle = cvData.sectionSettings?.education?.title || t('educationUpper');
            return (
              <div key={sec} className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-3 break-inside-avoid print:bg-white print:border-slate-200 print:shadow-none print:backdrop-blur-none transition-all duration-300 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700">
                <h3 className={sectionTitleClass}>
                  <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>{eduTitle}</span>
                </h3>
                <LayoutSectionRenderer
                  sectionId="education"
                  cvData={cvData}
                  activeColor={activeColor}
                  t={t}
                  defaultTitleKey="educationUpper"
                  IconComponent={GraduationCap}
                  items={cvData.education}
                  defaultLayoutStyle="timeline"
                  renderItem={renderEducationItem}
                  hideHeader={true}
                />
              </div>
            );
          }
          if (sec === 'certificates' && cvData.certificates.length > 0) {
            const certTitle = cvData.sectionSettings?.certificates?.title || t('certificatesUpper');
            return (
              <div key={sec} data-section="certificates" className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col gap-3 break-inside-avoid print:bg-white print:border-slate-200 print:shadow-none print:backdrop-blur-none transition-all duration-300 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700">
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
  );
}
