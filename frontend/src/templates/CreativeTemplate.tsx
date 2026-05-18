import { Briefcase, GraduationCap, FolderGit2, Wrench, Award, Languages, ExternalLink } from 'lucide-react';
import type { TemplateProps } from './types';

export default function CreativeTemplate({ cvData, activeColor, t }: TemplateProps) {
  return (
    <div className="flex flex-col flex-1 gap-6 text-sm">
                   
                   {/* Creative Header */}
                   <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${activeColor.bg} text-white p-6 rounded-2xl print:bg-white print:text-black print:p-0 print:border-b-2 print:border-black print:rounded-none print:flex-row print:justify-between print:items-center`}>
                     <div className="flex items-center gap-4">
                       {cvData.personalInfo.avatar && (
                         <img 
                           src={cvData.personalInfo.avatar} 
                           alt="Avatar" 
                           className="w-16 h-16 rounded-full object-cover border-2 border-white print:border-slate-800" 
                         />
                       )}
                       <div>
                         <h1 className="text-3xl font-black tracking-tight text-white m-0 print:text-black">
                           {cvData.personalInfo.fullName || "HỌ VÀ TÊN"}
                         </h1>
                         <div className={`inline-block ${activeColor.lightBg} ${activeColor.primary} px-3 py-0.5 rounded-full text-xs font-bold mt-2 font-mono print:bg-slate-100 print:text-black print:border-slate-300`}>
                           {cvData.personalInfo.title || "VỊ TRÍ ỨNG TUYỂN"}
                         </div>
                       </div>
                     </div>
                     <div className="flex flex-col gap-1 text-slate-100 text-xs font-mono sm:items-end mt-2 md:mt-0 print:text-black print:items-end print:text-right print:mt-0">
                       <div>{cvData.personalInfo.email}</div>
                       {cvData.personalInfo.phone && <div>{cvData.personalInfo.phone}</div>}
                       {cvData.personalInfo.location && <div>{cvData.personalInfo.location}</div>}
                       <div className="flex flex-wrap gap-2 mt-1 md:justify-end print:justify-end">
                         {cvData.personalInfo.github && (
                           <a 
                             href={cvData.personalInfo.github} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="bg-white/15 hover:bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold border border-white/10 print:bg-slate-50 print:border-slate-300 print:text-black transition-colors"
                           >
                             github.com/{cvData.personalInfo.github.split('/').pop()}
                           </a>
                         )}
                         {cvData.personalInfo.linkedin && (
                           <a 
                             href={cvData.personalInfo.linkedin} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="bg-white/15 hover:bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold border border-white/10 print:bg-slate-50 print:border-slate-300 print:text-black transition-colors"
                           >
                             linkedin.com/in/{cvData.personalInfo.linkedin.split('/').pop()}
                           </a>
                         )}
                       </div>
                     </div>
                   </div>

                   {/* Dynamic sections in a single vertical stream ordered according to cvData.sectionOrder */}
                   {(() => {
                     const order = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
                     return order.map((sec) => {
                       if (sec === 'summary' && cvData.summary) {
                         return (
                           <div key={sec} className={`${activeColor.lightBg} p-4 rounded-xl border border-slate-200/40 print:bg-white print:p-0 print:border-none`}>
                             <p className="text-xs leading-relaxed text-slate-755 font-medium text-justify">{cvData.summary}</p>
                           </div>
                         );
                       }
                       if (sec === 'experience' && cvData.experience.length > 0) {
                         return (
                           <div key={sec} className="flex flex-col gap-4">
                             <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                               <Briefcase className="h-3.5 w-3.5 stroke-[2.5]" />
                               {t('experienceUpper')}
                             </h3>
                             {cvData.experience.map((exp) => (
                               <div key={exp.id} className={`border-l-2 ${activeColor.border} pl-4 py-0.5 flex flex-col gap-1 relative print:!border-slate-300`}>
                                 <div className="flex justify-between items-start text-xs">
                                   <div>
                                     <span className="font-extrabold text-slate-900 text-sm">{exp.company}</span>
                                     <span className={`mx-2 ${activeColor.primary}`}>•</span>
                                     <span className="font-bold text-slate-855">{exp.position}</span>
                                   </div>
                                   <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded print:bg-slate-50 print:border print:border-slate-200">{exp.startDate} – {exp.endDate || 'Hiện tại'}</span>
                                 </div>
                                 <p className="text-xs leading-relaxed text-slate-655 font-medium whitespace-pre-line mt-1 print:text-black">
                                   {exp.description}
                                 </p>
                               </div>
                             ))}
                           </div>
                         );
                       }
                       if (sec === 'projects' && cvData.projects.length > 0) {
                         return (
                           <div key={sec} className="flex flex-col gap-4">
                             <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                               <FolderGit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                               {t('projectsUpper')}
                             </h3>
                             {cvData.projects.map((proj) => (
                               <div key={proj.id} className={`border-l-2 ${activeColor.border} pl-4 py-0.5 flex flex-col gap-1 print:!border-slate-300`}>
                                 <div className="flex justify-between items-center text-xs">
                                   <div>
                                     <span className="font-extrabold text-slate-900 text-sm">{proj.name}</span>
                                     {proj.url && (
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
                                     <span className="text-slate-400 mx-1.5">•</span>
                                     <span className="text-[10px] text-slate-550 font-semibold italic">{proj.role}</span>
                                   </div>
                                   <span className="text-[10px] font-mono font-bold text-slate-400 print:text-black">{proj.startDate}</span>
                                 </div>
                                 {proj.technologies.filter(Boolean).length > 0 && (
                                   <div className="flex flex-wrap gap-1 mt-0.5">
                                       {proj.technologies.filter(Boolean).map((tech, idx) => (
                                         <span key={idx} className={`${activeColor.pill} rounded px-2 py-0.5 text-[9px] font-bold font-mono`}>
                                           {tech}
                                         </span>
                                       ))}
                                   </div>
                                 )}
                                 <p className="text-xs leading-relaxed text-slate-655 font-medium whitespace-pre-line mt-1 print:text-black">
                                   {proj.description}
                                 </p>
                               </div>
                             ))}
                           </div>
                         );
                       }
                       if (sec === 'skills' && cvData.skills.length > 0) {
                         return (
                           <div key={sec} className="flex flex-col gap-3">
                             <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                               <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                               {t('skillsUpper')}
                             </h3>
                             <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-3">
                               {cvData.skills.map((grp) => (
                                 <div key={grp.id} className="bg-slate-50 border border-slate-150 p-3 rounded-xl print:bg-white print:!border-slate-300">
                                   <span className="text-xs font-bold text-slate-855 block mb-1.5 border-b pb-0.5 print:border-slate-300">{grp.category}</span>
                                   <div className="flex flex-wrap gap-1">
                                     {grp.skills.filter(Boolean).map((s, idx) => (
                                       <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-semibold print:bg-slate-50 print:border-slate-300 print:text-black">
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
                             <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                               <GraduationCap className="h-3.5 w-3.5 stroke-[2.5]" />
                               {t('educationUpper')}
                             </h3>
                             {cvData.education.map((edu) => (
                               <div key={edu.id} className="flex flex-col gap-0.5 text-xs">
                                 <div className="flex justify-between items-start font-bold">
                                   <span className="text-slate-900 font-extrabold">{edu.institution}</span>
                                   <span className="text-[10px] font-mono text-slate-500 print:text-black">{edu.startDate} – {edu.endDate || 'Hiện tại'}</span>
                                 </div>
                                 <div className={`font-semibold ${activeColor.primary} print:text-black`}>{edu.degree}</div>
                                 {edu.description && <p className="text-[10px] text-slate-500 italic mt-0.5">{edu.description}</p>}
                               </div>
                             ))}
                           </div>
                         );
                       }
                       if (sec === 'certificates' && cvData.certificates.length > 0) {
                         return (
                           <div key={sec} className="flex flex-col gap-2">
                             <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                               <Award className="h-3.5 w-3.5 stroke-[2.5]" />
                               {t('certificatesUpper')}
                             </h3>
                             <div className="flex flex-col gap-1.5 text-xs text-slate-755">
                               {cvData.certificates.map((c) => (
                                 <div key={c.id} className="leading-snug">
                                   <span className="font-extrabold text-slate-900">{c.name}</span> — <span className="text-slate-500 text-[11px] font-medium">{c.issuer} ({c.date})</span>
                                 </div>
                               ))}
                             </div>
                           </div>
                         );
                       }
                       if (sec === 'languages' && cvData.languages.length > 0) {
                         return (
                           <div key={sec} className="flex flex-col gap-2">
                             <h3 className={`text-xs font-black uppercase tracking-wider ${activeColor.primary} flex items-center gap-1.5`}>
                               <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                               {t('languagesUpper')}
                             </h3>
                             <div className="flex flex-col gap-1 text-xs">
                               {cvData.languages.map((l) => (
                                 <div key={l.id} className="flex justify-between font-medium">
                                   <span className="font-bold text-slate-900">{l.name}</span>
                                   <span className="text-slate-500 font-mono text-[10px] print:text-black">{l.level}</span>
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
