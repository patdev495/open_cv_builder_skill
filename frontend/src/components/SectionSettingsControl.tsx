import { useState } from 'react';
import { useCVEditorContext } from '../context/CVEditorContext';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';

interface SectionSettingsControlProps {
  sectionId: string;
  allowedFields?: { key: string; labelKey: string }[];
}

export function SectionSettingsControl({ sectionId, allowedFields = [] }: SectionSettingsControlProps) {
  const { cvData, dispatch, t } = useCVEditorContext();
  const [isOpen, setIsOpen] = useState(false);

  const setting = cvData.sectionSettings?.[sectionId] || { id: sectionId };
  const customTitle = setting.title || '';
  const layoutStyle = setting.layoutStyle || 'default';
  const hideFields = setting.hideFields || [];

  const handleUpdate = (payload: any) => {
    dispatch({
      type: 'UPDATE_SECTION_SETTING',
      id: sectionId,
      payload
    });
  };

  const toggleField = (fieldKey: string) => {
    const isHidden = hideFields.includes(fieldKey);
    const newHideFields = isHidden
      ? hideFields.filter(f => f !== fieldKey)
      : [...hideFields, fieldKey];
    handleUpdate({ hideFields: newHideFields });
  };

  return (
    <div className="mb-4 bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-850/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-3.5 h-3.5" />
          <span>{t('sectionSettings' as any)}</span>
        </div>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-800 space-y-4 bg-slate-950/20">
          {/* Custom Title */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {t('customTitle' as any)}
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              placeholder={t('customTitlePlaceholder' as any)}
              className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Layout Style */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {t('layoutStyle' as any)}
            </label>
            <select
              value={layoutStyle}
              onChange={(e) => handleUpdate({ layoutStyle: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="default">{t('layoutDefault' as any)}</option>
              <option value="timeline">{t('layoutTimeline' as any)}</option>
              <option value="cards">{t('layoutCards' as any)}</option>
              {sectionId === 'skills' && (
                <>
                  <option value="groupCards">{t('layoutGroupCards' as any)}</option>
                  <option value="radar">{t('layoutRadar' as any)}</option>
                </>
              )}
              <option value="text">{t('layoutText' as any)}</option>
            </select>
          </div>

          {/* Hide Fields */}
          {allowedFields.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                {t('hideFields' as any)}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {allowedFields.map(field => {
                  const isChecked = hideFields.includes(field.key);
                  return (
                    <label key={field.key} className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleField(field.key)}
                        className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span>{t(field.labelKey as any)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
