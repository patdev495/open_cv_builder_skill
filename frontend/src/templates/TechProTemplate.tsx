import { User, Briefcase, GraduationCap, FolderGit2, Award, Languages, Code } from 'lucide-react';
import { ProjectEmbed } from '../components/ProjectEmbed';
import type { TemplateProps } from './types';
import CustomSectionRenderer from './CustomSectionRenderer';
import LayoutSectionRenderer from './LayoutSectionRenderer';
import { CustomLinksRenderer, parseFormatting } from './TemplateHelpers';


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

  const renderExperienceItem = (exp: any, _layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    return (
      <div key={exp.id} className="flex flex-col gap-1.5 break-inside-avoid relative font-mono text-xs">
        <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border bg-white dark:bg-slate-900 ${activeColor.border} flex items-center justify-center`}>
          <span className="w-1 h-1 rounded-full bg-slate-400"></span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
          <div>
            <span className="font-extrabold text-slate-900 dark:text-slate-100 text-[13px]">{exp.company}</span>
            {!hideRole && (
              <>
                <span className="text-slate-400 mx-1.5 select-none">&gt;&gt;</span>
                <span className={`font-bold ${activeColor.primary} print:text-black`}>{exp.position}</span>
              </>
            )}
          </div>
          <span className="text-[10px] font-bold text-slate-400 print:text-slate-850 dark:text-slate-200 shrink-0">{exp.startDate} - {exp.endDate || 'Hiện tại'}</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-405 whitespace-pre-line mt-0.5 print:text-slate-955 font-sans">
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
      <div key={proj.id} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-hidden break-inside-avoid flex flex-col font-mono text-xs">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 select-none print:hidden">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400/80"></span>
            <span className="w-2 h-2 rounded-full bg-amber-450/80"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-450/80"></span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">bash – {proj.name.toLowerCase().replace(/\s+/g, '_')}.sh</span>
        </div>
        {/* Terminal Body */}
        <div className="p-3 flex flex-col gap-2 print:p-2">
          <div className="flex justify-between items-start text-xs font-bold font-mono">
            <span className="text-slate-900 dark:text-slate-100 font-extrabold flex items-center gap-1 text-[13px]">
              <span className="text-slate-400 font-normal select-none">$</span>
              {proj.name}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-medium">{proj.startDate}</span>
          </div>
          {!hideRole && (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="text-slate-400 select-none">role: </span>
              <span className={`${activeColor.primary} font-bold`}>{proj.role}</span>
            </div>
          )}
          {!hideUrl && proj.url && (
            <a href={proj.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 text-[10px] ${activeColor.primary} hover:underline font-bold print:text-black`}>
              <span className="text-slate-400 select-none">url: </span>
              {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          )}
          {!hideTech && proj.technologies.filter(Boolean).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {proj.technologies.filter(Boolean).map((tech: string, idx: number) => (
                <span key={idx} className={`${activeColor.pill} rounded px-1.5 py-0.5 text-[9px] font-bold border border-slate-100 dark:border-slate-800`}>
                  {tech}
                </span>
              ))}
            </div>
          )}
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line mt-1 print:text-slate-955 font-sans">
            {parseFormatting(proj.description)}
          </p>
          {!hideEmbed && <ProjectEmbed embedUrl={proj.embedUrl} projectName={proj.name} />}
        </div>
      </div>
    );
  };

  const renderEducationItem = (edu: any, _layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => {
    const hideRole = hiddenFields.includes('role');

    return (
      <div key={edu.id} className="flex flex-col gap-1.5 text-xs break-inside-avoid font-mono">
        <div className="flex justify-between items-start">
          <span className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1">
            <span className="text-purple-500 font-normal select-none">&gt;</span>
            {edu.institution}
          </span>
          <span className="text-[10px] font-bold text-slate-400 print:text-slate-850 dark:text-slate-200 shrink-0">{edu.startDate} - {edu.endDate || 'Hiện tại'}</span>
        </div>
        {!hideRole && (
          <div className="text-slate-600 dark:text-slate-400 font-semibold print:text-slate-900 pl-3">
            <span className="text-slate-400 font-normal select-none">degree: </span>
            {edu.degree}
          </div>
        )}
        {edu.description && (
          <p className="text-[11px] text-slate-505 dark:text-slate-405 italic pl-3 border-l border-slate-200 dark:border-slate-800 font-sans mt-0.5">
            {parseFormatting(edu.description)}
          </p>
        )}
      </div>
    );
  };

  const isDefaultFont = !cvData.fontFamily || cvData.fontFamily === 'sans';
  const techFontClass = isDefaultFont ? 'font-mono' : '';

  return (
    <div className={`flex flex-col flex-1 gap-6 text-sm ${techFontClass}`}>
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
          <div className="font-mono">
            <div className="text-slate-450 text-[10px] select-none font-medium mb-0.5">// dev profile</div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight m-0 print:text-black">
              {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded text-xs font-bold border ${activeColor.pill}`}>
                <Code className="h-3 w-3" />
                {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 print:flex-row print:items-center font-mono">
          <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400 text-xs text-right sm:items-end font-medium print:text-slate-700 dark:text-slate-300 print:items-end print:text-right">
            <div className="font-semibold text-slate-850 dark:text-slate-200 print:text-black">
              <span className="text-slate-450 select-none">email: </span>
              {cvData.personalInfo.email}
            </div>
            {cvData.personalInfo.phone && (
              <div>
                <span className="text-slate-450 select-none">phone: </span>
                {cvData.personalInfo.phone}
              </div>
            )}
            {cvData.personalInfo.location && (
              <div>
                <span className="text-slate-450 select-none">loc: </span>
                {cvData.personalInfo.location}
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-1.5 sm:justify-end print:justify-end">
              {cvData.personalInfo.website && (
                <a 
                  href={cvData.personalInfo.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline text-slate-500 dark:text-slate-400 print:text-amber-800 print:bg-amber-50 print:border print:border-amber-200 print:font-bold print:px-2 print:py-0.5 print:rounded flex items-center gap-1"
                >
                  <span className="text-slate-450 select-none">web: </span>
                  {cvData.personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              )}
              {cvData.personalInfo.github && (
                <a href={cvData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-500 dark:text-slate-400 print:text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span className="text-slate-450 select-none">git: </span>
                  github.com/{cvData.personalInfo.github.split('/').pop()}
                </a>
              )}
              {cvData.personalInfo.linkedin && (
                <a href={cvData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline text-slate-500 dark:text-slate-400 print:text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span className="text-slate-450 select-none">ln: </span>
                  linkedin.com/in/{cvData.personalInfo.linkedin.split('/').pop()}
                </a>
              )}
            </div>
            {/* Custom contact links */}
            <CustomLinksRenderer
              customLinks={cvData.personalInfo.customLinks}
              className="flex flex-wrap gap-2.5 mt-1 sm:justify-end print:justify-end"
              itemClassName="hover:underline flex items-center gap-1 text-slate-500 dark:text-slate-400 print:text-slate-705 dark:text-slate-300 font-medium"
            />
          </div>
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
                  return (
                    <div key={sec} className="flex flex-col gap-3">
                      <CustomSectionRenderer section={customSec} activeColor={activeColor} t={t} titleClassName={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black font-mono`} />
                    </div>
                  );
                }
              }
              if (sec === 'summary' && cvData.summary) {
                const summaryTitle = cvData.sectionSettings?.summary?.title || t('summaryUpper');
                return (
                  <div key={sec} data-section="summary" className="flex flex-col gap-2.5 break-inside-avoid">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black font-mono`}>
                      <User className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{`// ${summaryTitle}`}</span>
                    </h3>
                    <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 p-3 font-mono text-xs">
                      <span className="text-slate-400 select-none">{"/**"}</span>
                      <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-350 font-medium pl-3 border-l border-slate-250 dark:border-slate-850 my-1 font-sans">
                        {parseFormatting(cvData.summary)}
                      </p>
                      <span className="text-slate-400 select-none">{" */"}</span>
                    </div>
                  </div>
                );
              }
              if (sec === 'experience' && cvData.experience.length > 0) {
                const layout = cvData.sectionSettings?.experience?.layoutStyle || 'timeline';
                // For timeline layout, TechProTemplate uses a special border alignment
                const extraClass = layout === 'timeline' ? "border-l border-slate-155 dark:border-slate-800/80 ml-2 pl-4 space-y-2 print:border-slate-200" : "";
                
                return (
                  <div key={sec} className="flex flex-col gap-4">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black font-mono`}>
                      <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{`// ${cvData.sectionSettings?.experience?.title || t('experienceUpper')}`}</span>
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
                        hideHeader={true}
                      />
                    </div>
                  </div>
                );
              }
              if (sec === 'projects' && cvData.projects.length > 0) {
                return (
                  <div key={sec} className="flex flex-col gap-4">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black font-mono`}>
                      <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{`// ${cvData.sectionSettings?.projects?.title || t('projectsUpper')}`}</span>
                    </h3>
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
                      hideHeader={true}
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
                  return (
                    <div key={sec} className="flex flex-col gap-3">
                      <CustomSectionRenderer section={customSec} activeColor={activeColor} t={t} titleClassName={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black font-mono`} />
                    </div>
                  );
                }
              }
              if (sec === 'skills' && cvData.skills.length > 0) {
                return (
                  <div key={sec} data-section="skills" className="flex flex-col gap-3 break-inside-avoid">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black font-mono`}>
                      <Code className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{`// ${cvData.sectionSettings?.skills?.title || t('skillsUpper')}`}</span>
                    </h3>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-hidden break-inside-avoid flex flex-col font-mono text-xs">
                      {/* Code block header */}
                      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 select-none print:hidden">
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">skills.json</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">JSON</span>
                      </div>
                      {/* Code block body */}
                      <div className="p-3 flex flex-col gap-3 font-mono">
                        {cvData.skills.map((grp: any) => (
                          <div key={grp.id} className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1">
                              <span className="text-purple-500 select-none">&lt;/&gt;</span>
                              {grp.category}
                            </span>
                            <div className="flex flex-wrap gap-1.5 font-sans">
                              {grp.skills.filter(Boolean).map((s: string, idx: number) => (
                                <span
                                  key={idx}
                                  className={`${activeColor.pill} px-2 py-0.5 rounded text-[10px] font-bold border border-slate-100/50 dark:border-slate-800/50 font-mono`}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              if (sec === 'education' && cvData.education.length > 0) {
                return (
                  <div key={sec} className="flex flex-col gap-3">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black font-mono`}>
                      <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{`// ${cvData.sectionSettings?.education?.title || t('educationUpper')}`}</span>
                    </h3>
                    <LayoutSectionRenderer
                      sectionId="education"
                      cvData={cvData}
                      activeColor={activeColor}
                      t={t}
                      defaultTitleKey="educationUpper"
                      IconComponent={null}
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
                  <div key={sec} data-section="certificates" className="flex flex-col gap-3">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black font-mono`}>
                      <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{`// ${certTitle}`}</span>
                    </h3>
                    <div className="flex flex-col gap-2.5 font-mono text-xs">
                      {cvData.certificates.map((c) => (
                        <div key={c.id} className="flex flex-col gap-0.5 break-inside-avoid">
                          <span className="font-extrabold text-slate-850 dark:text-slate-200 leading-snug print:text-black flex items-center gap-1 text-[13px]">
                            <span className="text-amber-500 font-normal select-none">#</span>
                            {c.name}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-405 font-medium pl-3">
                            {c.issuer} ({c.date})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              if (sec === 'languages' && cvData.languages.length > 0) {
                const langTitle = cvData.sectionSettings?.languages?.title || t('languagesUpper');
                return (
                  <div key={sec} data-section="languages" className="flex flex-col gap-2">
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-0.5 border-l-2 ${accentBorder} pl-2 flex items-center gap-1.5 print:text-black font-mono`}>
                      <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>{`// ${langTitle}`}</span>
                    </h3>
                    <div className="flex flex-col gap-2 font-mono text-xs">
                      {cvData.languages.map((l) => (
                        <div key={l.id} className="flex justify-between text-xs font-medium text-slate-755 dark:text-slate-300 break-inside-avoid">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black flex items-center gap-1">
                            <span className="text-slate-450 select-none">locale:</span>
                            {l.name}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-[10px] print:text-slate-800 dark:text-slate-200 font-bold">{l.level}</span>
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
