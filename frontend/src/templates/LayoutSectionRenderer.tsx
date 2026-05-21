import React from 'react';

interface LayoutSectionRendererProps {
  sectionId: string;
  cvData: any;
  activeColor: {
    primary: string;
    pill: string;
  };
  t: (key: string) => string;
  defaultTitleKey: string;
  IconComponent: any;
  items: any[];
  defaultLayoutStyle: 'timeline' | 'cards' | 'text';
  renderItem: (item: any, layout: 'timeline' | 'cards' | 'text', hiddenFields: string[]) => React.ReactNode;
  titleClassName?: string;
  hideHeader?: boolean;
}

export default function LayoutSectionRenderer({
  sectionId,
  cvData,
  activeColor,
  t,
  defaultTitleKey,
  IconComponent,
  items,
  defaultLayoutStyle,
  renderItem,
  titleClassName,
  hideHeader
}: LayoutSectionRendererProps) {
  if (!items || items.length === 0) return null;

  const setting = cvData.sectionSettings?.[sectionId] || {};
  const title = setting.title || t(defaultTitleKey);
  const layoutStyle = setting.layoutStyle === 'default' || !setting.layoutStyle
    ? defaultLayoutStyle
    : (setting.layoutStyle as 'timeline' | 'cards' | 'text');
  
  const hideFields = setting.hideFields || [];

  // Cards layout uses grid layout, timeline/text uses stacked layout
  // NOTE: Do NOT use responsive prefixes like `md:grid-cols-2` here.
  // Print media has no viewport, so breakpoint classes are never applied when printing.
  // Use `grid-cols-2` directly so the 2-column layout works both on screen and in print.
  const containerClass = layoutStyle === 'cards'
    ? "grid grid-cols-2 gap-3"
    : "flex flex-col gap-3";

  return (
    <div data-section={sectionId} className="flex flex-col gap-3">
      {!hideHeader && (
        <h3 className={titleClassName || `text-xs font-bold uppercase tracking-wider ${activeColor.primary} pb-1 font-mono flex items-center gap-1.5 print:text-black border-b border-slate-100 dark:border-slate-800/40 print:border-slate-200`}>
          {IconComponent && <IconComponent className="h-3.5 w-3.5 stroke-[2.5]" />}
          <span>{title}</span>
        </h3>
      )}

      <div className={containerClass}>
        {items.map((item) => renderItem(item, layoutStyle, hideFields))}
      </div>
    </div>
  );
}
