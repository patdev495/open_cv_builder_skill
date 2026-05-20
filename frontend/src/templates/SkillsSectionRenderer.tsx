import React from 'react';
import { Wrench } from 'lucide-react';

interface SkillsSectionRendererProps {
  cvData: any;
  activeColor: {
    primary: string;
    pill: string;
    border?: string;
  };
  t: (key: string) => string;
  /** Extra classes applied to the section title h3 */
  titleClassName?: string;
  /** Extra classes for the wrapping container */
  wrapperClassName?: string;
}

/**
 * Renders the skills section with layout-awareness.
 *
 * Layout modes (read from cvData.sectionSettings?.skills?.layoutStyle):
 *  - timeline (default): each SkillGroup on its own row, category label + skills as comma-separated text
 *  - cards: each SkillGroup rendered as a pill-badge card with skill tags — visually rich
 *  - text: fully flat, all groups inline as "Category: s1, s2 • Category2: s3" — ultra-compact
 *
 * NOTE: Do NOT use responsive breakpoint prefixes (md:, sm:, lg:) in grid/layout
 * classes here. Print media has no viewport width so breakpoints are ignored,
 * causing screen and print layouts to diverge.
 */
export default function SkillsSectionRenderer({
  cvData,
  activeColor,
  t,
  titleClassName = '',
  wrapperClassName = '',
}: SkillsSectionRendererProps) {
  if (!cvData.skills || cvData.skills.length === 0) return null;

  const setting = cvData.sectionSettings?.skills || {};
  const title = setting.title || t('skillsUpper');
  const layoutStyle: 'timeline' | 'cards' | 'text' =
    setting.layoutStyle === 'cards' ? 'cards'
    : setting.layoutStyle === 'text' ? 'text'
    : 'timeline';

  const defaultTitleClass = `text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black border-b border-slate-100 dark:border-slate-800/40 print:border-slate-200`;

  const renderContent = () => {
    if (layoutStyle === 'text') {
      // Ultra-compact: all groups inline, no visual separation
      return (
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed print:text-black">
          {cvData.skills.map((grp: any, i: number) => (
            <React.Fragment key={grp.id}>
              <span className="font-bold text-slate-800 dark:text-slate-200">{grp.category}: </span>
              <span>{grp.skills.filter(Boolean).join(', ')}</span>
              {i < cvData.skills.length - 1 && <span className="mx-2 text-slate-400">•</span>}
            </React.Fragment>
          ))}
        </p>
      );
    }

    if (layoutStyle === 'cards') {
      // Each SkillGroup is a distinct pill-badge card
      // Use grid-cols-2 directly — no md: prefix (print has no viewport)
      return (
        <div className="grid grid-cols-2 gap-2">
          {cvData.skills.map((grp: any) => (
            <div
              key={grp.id}
              className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 flex flex-col gap-1.5 break-inside-avoid"
            >
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 print:text-black">
                {grp.category}
              </span>
              <div className="flex flex-wrap gap-1">
                {grp.skills.filter(Boolean).map((s: string, i: number) => (
                  <span
                    key={i}
                    className={`${activeColor.pill} px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-100 dark:border-slate-800`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default: timeline — each group stacked vertically, skills as comma text
    return (
      <div className="flex flex-col gap-2">
        {cvData.skills.map((grp: any) => (
          <div key={grp.id} className="flex flex-col gap-0.5 break-inside-avoid">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 print:text-black">
              {grp.category}
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed print:text-black">
              {grp.skills.filter(Boolean).join(', ')}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex flex-col gap-3 ${wrapperClassName}`}>
      <h3 className={titleClassName || defaultTitleClass}>
        <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
        <span>{title}</span>
      </h3>
      {renderContent()}
    </div>
  );
}
