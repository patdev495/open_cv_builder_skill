import { Sparkles, ExternalLink } from 'lucide-react';
import type { CustomSection } from '../types';

interface CustomSectionRendererProps {
  section: CustomSection;
  activeColor: {
    primary: string;
    pill: string;
  };
  t: (key: string) => string;
  titleClassName?: string;
  hideHeader?: boolean;
  hideIcon?: boolean;
}

export default function CustomSectionRenderer({ section, activeColor, titleClassName, hideHeader, hideIcon = false }: CustomSectionRendererProps) {
  if (!section || !section.items || section.items.length === 0) return null;

  const layout = section.layoutStyle || 'timeline';

  return (
    <div className="flex flex-col gap-4">
      {/* Section Title */}
      {!hideHeader && (
        <h3 className={titleClassName || `text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black border-b border-slate-100 dark:border-slate-800/40 print:border-slate-200`}>
          {!hideIcon && <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />}
          {section.title}
        </h3>
      )}

      <div className={`flex flex-col gap-4 ${layout === 'cards' ? 'grid grid-cols-1 gap-3' : ''}`}>
        {section.items.map((item) => {
          if (layout === 'timeline') {
            return (
              <div key={item.id} className="flex flex-col gap-1 break-inside-avoid">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">{item.title}</span>
                    {item.subtitle && (
                      <>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span className={`font-semibold ${activeColor.primary} print:text-black`}>{item.subtitle}</span>
                      </>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[10px] text-purple-600 hover:text-purple-750 font-bold ml-1.5 hover:underline print:text-black print:no-underline"
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                        {item.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                      </a>
                    )}
                  </div>
                  {item.date && (
                    <span className="text-[10px] font-mono font-bold text-slate-400 print:text-slate-800 dark:text-slate-200">
                      {item.date}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line mt-1 print:text-slate-950">
                    {item.description}
                  </p>
                )}
              </div>
            );
          }

          if (layout === 'cards') {
            return (
              <div key={item.id} className="p-3 bg-slate-55/30 dark:bg-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/60 flex flex-col gap-1 break-inside-avoid">
                <div className="flex justify-between items-start text-xs">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 leading-snug">{item.title}</span>
                  {item.date && (
                    <span className="text-[10px] font-mono font-bold text-slate-450 dark:text-slate-500">
                      {item.date}
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <span className={`text-[11px] font-semibold ${activeColor.primary} print:text-black leading-snug`}>
                    {item.subtitle}
                  </span>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[10px] text-purple-600 hover:text-purple-750 font-semibold hover:underline print:text-black"
                  >
                    <ExternalLink className="h-2.5 w-2.5" />
                    {item.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                  </a>
                )}
                {item.description && (
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 mt-1 print:text-slate-950 font-medium">
                    {item.description}
                  </p>
                )}
              </div>
            );
          }

          // Paragraph / Text layout
          return (
            <div key={item.id} className="flex flex-col gap-1 break-inside-avoid">
              <div className="flex justify-between items-baseline text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>
                  {item.title}
                  {item.subtitle && <span className="font-medium text-slate-500"> ({item.subtitle})</span>}
                </span>
                {item.date && <span className="text-[10px] font-mono text-slate-400">{item.date}</span>}
              </div>
              {item.description && (
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium whitespace-pre-line print:text-slate-950">
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
