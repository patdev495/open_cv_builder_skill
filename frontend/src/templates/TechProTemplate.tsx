import { User, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Languages, ExternalLink, Code } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';
import CustomSectionRenderer from './CustomSectionRenderer';
import LayoutSectionRenderer from './LayoutSectionRenderer';
import { CustomLinksRenderer } from './TemplateHelpers';

export default function TechProTemplate({ cvData, activeColor, t }: TemplateProps) {
  const activeColorName = activeColor.primary.includes('indigo') ? 'indigo'
                        : activeColor.primary.includes('emerald') ? 'emerald'
                        : activeColor.primary.includes('rose') ? 'rose'
                        : activeColor.primary.includes('amber') ? 'amber'
                        : activeColor.primary.includes('bronze') ? 'bronze'
                        : 'slate';

  // Dynamic border accents based on active color
  const accentBorder = activeColorName === 'indigo' ? 'border-l-indigo-600 print:border-l-indigo-800'
                     : activeColorName === 'emerald' ? 'border-l-emerald-600 print:border-l-emerald-800'
                     : activeColorName === 'rose' ? 'border-l-rose-600 print:border-l-rose-800'
                     : activeColorName === 'amber' ? 'border-l-amber-600 print:border-l-amber-800'
                     : activeColorName === 'bronze' ? 'border-l-amber-900 print:border-l-amber-955'
                     : 'border-l-slate-600 print:border-l-slate-800';

  const renderExperienceItem = (exp: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    if (layout === 'cards') {
      return (
        <div key={exp.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850/50 rounded-2xl flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs">
            <span className="font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{exp.company}</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-850 dark:text-slate-200 shrink-0">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
          </div>
          {!hideRole && (
            <span className={`text-[11px] font-bold ${activeColor.primary} print:text-black leading-snug`}>
              {exp.position}
            </span>
          )}
          <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-405 font-medium whitespace-pre-line mt-1 print:text-slate-955">
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
          <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-400 font-medium whitespace-pre-line mt-0.5 print:text-slate-955">
            {exp.description}
          </p>
        </div>
      );
    }

    // Default timeline with left vertical line structure
    return (
      <div key={exp.id} className="flex flex-col gap-1 break-inside-avoid relative">
        <div className={`absolute -left-[21px] top-1.5 w-2 h-2 rounded-full border bg-white dark:bg-slate-900 ${activeColor.border}`}></div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-xs gap-1">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{exp.company}</span>
            {!hideRole && (
              <>
                <span className="text-slate-400 mx-1.5">•</span>
                <span className={`font-bold ${activeColor.primary} print:text-black`}>{exp.position}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-405 print:text-slate-850 dark:text-slate-200 shrink-0">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-405 font-medium whitespace-pre-line mt-1 print:text-slate-950">
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
        <div key={proj.id} className="p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-850/50 flex flex-col gap-2 break-inside-avoid">
          <div className="flex justify-between items-start text-xs font-bold">
            <span className="text-slate-900 dark:text-slate-100">{proj.name}</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{proj.startDate}</span>
          </div>
          {!hideRole && (
            <span className={`text-[11px] font-semibold ${activeColor.primary}`}>{proj.role}</span>
          )}
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline font-bold print:text-black`}>
              <ExternalLink className="h-2.5 w-2.5" />
              {proj.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {proj.technologies.filter(Boolean).map((tech: string, idx: number) => (
                <span key={idx} className={`${activeColor.pill} rounded px-1.5 py-0.2 text-[9px] font-bold font-mono border border-slate-100 dark:border-slate-800`}>
                  {tech}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-400 font-medium mt-1 print:text-slate-950 whitespace-pre-line">
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
            <span className="text-[10px] font-mono text-slate-400">{proj.startDate}</span>
          </div>
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-0.5 text-[10px] ${activeColor.primary} hover:underline font-bold print:text-black`}>
              <ExternalLink className="h-2.5 w-2.5" />
              {proj.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {proj.technologies.filter(Boolean).join(", ")}
            </span>
          )}
          <p className="text-xs leading-relaxed text-slate-650 dark:text-slate-400 font-medium mt-0.5 print:text-slate-950">
            {proj.description}
          </p>
          {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
        </div>
      );
    }

    // Default layout style: full timeline-like card
    return (
      <div key={proj.id} className="flex flex-col gap-2.5 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-850/50 break-inside-avoid print:bg-transparent">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start text-xs gap-1">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{proj.name}</span>
            {!hideUrl && proj.url && (
              <a
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[10px] text-purple-650 hover:text-purple-750 font-bold ml-1.5 hover:underline print:text-black print:no-underline"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                {proj.url.replace(/^https?:\/\/(www\.)?github\.com\//, 'github.com/').replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
              </a>
            )}
            {!hideRole && (
              <>
                <span className="text-slate-450 mx-1.5">•</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold italic">{proj.role}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-850 dark:text-slate-200 shrink-0">{proj.startDate}</span>
        </div>
        
        {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {proj.technologies.filter(Boolean).map((tech: string, idx: number) => (
              <span key={idx} className={`${activeColor.pill} rounded px-1.5 py-0.2 text-[9px] font-bold font-mono border border-slate-100 dark:border-slate-800`}>
                {tech}
              </span>
            ))}
          </div>
        )}
        
        <p className="text-xs leading-relaxed text-slate-655 dark:text-slate-400 font-medium whitespace-pre-line mt-0.5 print:text-slate-950">
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
        <div key={edu.id} className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850/50 rounded-2xl flex flex-col gap-1 break-inside-avoid">
          <div className="flex justify-between items-start text-xs font-bold">
            <span className="text-slate-900 dark:text-slate-100">{edu.institution}</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
          </div>
          {!hideRole && (
            <div className="text-slate-600 dark:text-slate-400 font-semibold italic">{edu.degree}</div>
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
            <span className="text-[10px] font-mono text-slate-405 print:text-slate-800 dark:text-slate-200">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
          </div>
          {edu.description && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">{edu.description}</p>}
        </div>
      );
    }

    // Default timeline
    return (
      <div key={edu.id} className="flex flex-col gap-1 text-xs break-inside-avoid">
        <div className="flex justify-between items-start">
          <span className="font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{edu.institution}</span>
          <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-850 dark:text-slate-200 shrink-0">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
        </div>
        {!hideRole && (
          <div className="text-slate-600 dark:text-slate-400 font-semibold print:text-slate-900">{edu.degree}</div>
        )}
        {edu.description && <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">{edu.description}</p>}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 gap-6 text-sm">
      {/* 1. Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 print:flex-row print:justify-between print:items-center">
        <div className="flex items-center gap-4">
          {cvData.personalInfo.avatar && (
            <img 
              src={cvData.personalInfo.avatar} 
              alt="Avatar" 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 print:border-slate-800 dark:border-slate-400 shadow-md" 
            />
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight m-0 print:text-black">
              {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold font-mono border ${activeColor.pill}`}>
                <Code className="h-3 w-3" />
                {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400 text-xs text-right sm:items-end font-medium print:text-slate-700 dark:text-slate-300 print:items-end print:text-right">
          <div className="font-semibold text-slate-850 dark:text-slate-200 print:text-black">{cvData.personalInfo.email}</div>
          {cvData.personalInfo.phone && <div className="font-mono">{cvData.personalInfo.phone}</div>}
          {cvData.personalInfo.location && <div>{cvData.personalInfo.location}</div>}
          
          <div className="flex flex-wrap gap-2.5 mt-1.5 sm:justify-end print:justify-end">
            {cvData.personalInfo.website && (
              <a href={cvData.personalInfo.website} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline text-slate-500 dark:text-slate-400 print:text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                {cvData.personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {cvData.personalInfo.github && (
              <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline text-slate-500 dark:text-slate-400 print:text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                github.com/{cvData.personalInfo.github.split('/').pop()}
              </a>
            )}
            {cvData.personalInfo.linkedin && (
              <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline text-slate-500 dark:text-slate-400 print:text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                linkedin.com/in/{cvData.personalInfo.linkedin.split('/').pop()}
              </a>
            )}
          </div>
          {/* Custom contact links */}
          <CustomLinksRenderer
            customLinks={cvData.personalInfo.customLinks}
            className="flex flex-wrap gap-2.5 mt-1.5 sm:justify-end print:justify-end"
            itemClassName="hover:underline flex items-center gap-1 font-mono text-slate-500 dark:text-slate-400 print:text-slate-705 dark:text-slate-300 font-medium"
          />
        </div>
      </div>

      {/* 2. Asymmetric Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 print:grid-cols-12 gap-6 flex-1">
        
        {/* Left column (Experience, Projects, Summary) */}
        <div className="md:col-span-7 print:col-span-7 flex flex-col gap-6">
          {(() => {
            const baseOrder = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
            const order = [...baseOrder];
            const customSecs = cvData.customSections || [];
            customSecs.forEach((sec: any) => {
              if (!order.includes(sec.id)) {
                order.push(sec.id);
              }
            });

            const leftSections = order.filter(sec => 
              ['summary', 'experience', 'projects'].includes(sec) ||
              (sec.startsWith('custom-') && customSecs.find(s => s.id === sec)?.layoutStyle !== 'cards')
            );
            
            return leftSections.map((sec) => {
              if (sec.startsWith('custom-')) {
                const customSec = customSecs.find(s => s.id === sec);
                if (customSec) {
                  return <CustomSectionRenderer key={sec} section={customSec} activeColor={activeColor} t={t} />;
                }
              }
              if (sec === 'summary' && cvData.summary) {
                const summaryTitle = cvData.sectionSettings?.summary?.title || t('summaryUpper');
                return (
                  <div key={sec} className="flex flex-col gap-2.5 break-inside-avoid">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black`}>
                      <User className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{summaryTitle}</span>
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium text-justify">{cvData.summary}</p>
                  </div>
                );
              }
              if (sec === 'experience' && cvData.experience.length > 0) {
                const layout = cvData.sectionSettings?.experience?.layoutStyle || 'timeline';
                // For timeline layout, TechProTemplate uses a special border alignment
                const extraClass = layout === 'timeline' ? "border-l border-slate-100 dark:border-slate-800/80 ml-2 pl-4 space-y-2 print:border-slate-200" : "";
                
                return (
                  <div key={sec} className="flex flex-col gap-4">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black`}>
                      <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{cvData.sectionSettings?.experience?.title || t('experienceUpper')}</span>
                    </h3>
                    <div className={extraClass}>
                      <LayoutSectionRenderer
                        sectionId="experience"
                        cvData={cvData}
                        activeColor={activeColor}
                        t={t}
                        defaultTitleKey="experienceUpper"
                        IconComponent={null} // Title is rendered above
                        items={cvData.experience}
                        defaultLayoutStyle="timeline"
                        renderItem={renderExperienceItem}
                      />
                    </div>
                  </div>
                );
              }
              if (sec === 'projects' && cvData.projects.length > 0) {
                return (
                  <div key={sec} className="flex flex-col gap-4">
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
        </div>

        {/* Right column (Skills, Education, Certs, Languages) */}
        <div className="md:col-span-5 print:col-span-5 flex flex-col gap-6">
          {(() => {
            const baseOrder = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
            const order = [...baseOrder];
            const customSecs = cvData.customSections || [];
            customSecs.forEach((sec: any) => {
              if (!order.includes(sec.id)) {
                order.push(sec.id);
              }
            });

            const rightSections = order.filter(sec => 
              ['skills', 'education', 'certificates', 'languages'].includes(sec) ||
              (sec.startsWith('custom-') && customSecs.find(s => s.id === sec)?.layoutStyle === 'cards')
            );
            
            return rightSections.map((sec) => {
              if (sec.startsWith('custom-')) {
                const customSec = customSecs.find(s => s.id === sec);
                if (customSec) {
                  return <CustomSectionRenderer key={sec} section={customSec} activeColor={activeColor} t={t} />;
                }
              }
              if (sec === 'skills' && cvData.skills.length > 0) {
                const skillsTitle = cvData.sectionSettings?.skills?.title || t('skillsUpper');
                return (
                  <div key={sec} className="flex flex-col gap-3">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black`}>
                      <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{skillsTitle}</span>
                    </h3>
                    <div className="flex flex-col gap-3">
                      {cvData.skills.map((grp) => (
                        <div key={grp.id} className="p-3 rounded-2xl bg-slate-55/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-850/50 flex flex-col gap-1.5 print:bg-transparent break-inside-avoid">
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 print:text-black">{grp.category}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {grp.skills.filter(Boolean).map((s, i) => (
                              <span key={i} className={`${activeColor.pill} px-2.5 py-0.5 rounded-lg text-[11px] font-bold border border-slate-100 dark:border-slate-800`}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (sec === 'education' && cvData.education.length > 0) {
                return (
                  <div key={sec} className="flex flex-col gap-3">
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
                    />
                  </div>
                );
              }
              if (sec === 'certificates' && cvData.certificates.length > 0) {
                const certTitle = cvData.sectionSettings?.certificates?.title || t('certificatesUpper');
                return (
                  <div key={sec} className="flex flex-col gap-3">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black`}>
                      <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{certTitle}</span>
                    </h3>
                    <div className="flex flex-col gap-2.5">
                      {cvData.certificates.map((c) => (
                        <div key={c.id} className="text-xs flex flex-col gap-0.5 break-inside-avoid">
                          <span className="font-extrabold text-slate-850 dark:text-slate-200 leading-snug print:text-black">{c.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{c.issuer} ({c.date})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (sec === 'languages' && cvData.languages.length > 0) {
                const langTitle = cvData.sectionSettings?.languages?.title || t('languagesUpper');
                return (
                  <div key={sec} className="flex flex-col gap-2">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black`}>
                      <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{langTitle}</span>
                    </h3>
                    <div className="flex flex-col gap-2">
                      {cvData.languages.map((l) => (
                        <div key={l.id} className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 break-inside-avoid">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">{l.name}</span>
                          <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px] print:text-slate-800 dark:text-slate-200">{l.level}</span>
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

      </div>
    </div>
  );
}
