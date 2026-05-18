
import { useCVEditorContext } from '../context/CVEditorContext';

export function SummaryForm() {
  const { cvData, dispatch, t } = useCVEditorContext();
  return (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-slate-300 mb-1">{t('summaryTitle')}</h3>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                      {t('summaryDesc')}
                    </p>
                    <textarea
                      value={cvData.summary || ""}
                      onChange={(e) => dispatch({ type: 'SET_SUMMARY', payload: e.target.value })}
                      placeholder={t('summaryPlaceholder')}
                      rows={6}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none font-sans leading-relaxed resize-y"
                    />
                  </div>
  );
}
