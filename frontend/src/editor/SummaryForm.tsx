
import { useCVEditorContext } from '../context/CVEditorContext';
import { AIEnhancer } from '../components/AIEnhancer';
import { FormattedTextarea } from '../components/FormattedTextarea';

export function SummaryForm() {
  const { cvData, dispatch, t } = useCVEditorContext();
  return (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-slate-300">{t('summaryTitle')}</h3>
                      <AIEnhancer
                        value={cvData.summary || ""}
                        type="summary"
                        onAccept={(newValue) => dispatch({ type: 'SET_SUMMARY', payload: newValue })}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                      {t('summaryDesc')}
                    </p>
                    <FormattedTextarea
                      value={cvData.summary || ""}
                      onChangeValue={(val) => dispatch({ type: 'SET_SUMMARY', payload: val })}
                      placeholder={t('summaryPlaceholder')}
                      rows={6}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none font-sans leading-relaxed resize-y"
                    />
                  </div>
  );
}
