import { Award, Languages, Plus, Trash2 } from 'lucide-react';
import { useCVEditorContext } from '../context/CVEditorContext';

export function ExtraForm() {
  const { cvData, dispatch, t, addCertificate, removeCertificate, addLanguage, removeLanguage } = useCVEditorContext();
  return (
    <div className="flex flex-col gap-8">
      
      {/* A. Certificates */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-400" />
            {t('certTitle')}
          </h3>
          <button
            type="button"
            onClick={addCertificate}
            className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors"
          >
            <Plus className="h-3 w-3" /> {t('addCert')}
          </button>
        </div>

        {cvData.certificates.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-4">{t('emptyCert')}</p>
        ) : (
          cvData.certificates.map((cert) => (
            <div key={cert.id} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col gap-2 relative group shadow-sm">
              <button
                type="button"
                onClick={() => removeCertificate(cert.id)}
                className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 hover:bg-slate-900 rounded cursor-pointer transition-colors"
                title="Xóa chứng chỉ"
                aria-label="Xóa chứng chỉ"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{t('certNameLabel')}</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => dispatch({ type: 'UPDATE_CERTIFICATE', id: cert.id, payload: { name: e.target.value } })}
                    placeholder="AWS Solutions Architect"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{t('issuerLabel')}</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => dispatch({ type: 'UPDATE_CERTIFICATE', id: cert.id, payload: { issuer: e.target.value } })}
                    placeholder="Amazon Web Services"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{t('dateLabel')}</label>
                  <input
                    type="text"
                    value={cert.date}
                    onChange={(e) => dispatch({ type: 'UPDATE_CERTIFICATE', id: cert.id, payload: { date: e.target.value } })}
                    placeholder="2023"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* B. Languages */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Languages className="h-4 w-4 text-purple-400" />
            {t('langTitle')}
          </h3>
          <button
            type="button"
            onClick={addLanguage}
            className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors"
          >
            <Plus className="h-3 w-3" /> {t('addLang')}
          </button>
        </div>

        {cvData.languages.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-4">{t('emptyLang')}</p>
        ) : (
          cvData.languages.map((lang) => (
            <div key={lang.id} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col gap-2 relative group shadow-sm">
              <button
                type="button"
                onClick={() => removeLanguage(lang.id)}
                className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 p-1 hover:bg-slate-900 rounded cursor-pointer transition-colors"
                title="Xóa ngoại ngữ"
                aria-label="Xóa ngoại ngữ"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Tên {t('langTitle')}</label>
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => dispatch({ type: 'UPDATE_LANGUAGE', id: lang.id, payload: { name: e.target.value } })}
                    placeholder="Tiếng Anh"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{t('langLevelLabel')}</label>
                  <input
                    type="text"
                    value={lang.level}
                    onChange={(e) => dispatch({ type: 'UPDATE_LANGUAGE', id: lang.id, payload: { level: e.target.value } })}
                    placeholder="Thành thạo / IELTS 7.5"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
