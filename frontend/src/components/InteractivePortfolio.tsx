import { useState, useEffect } from 'react';
import { Edit3, Printer, AlertCircle, CheckCircle2, Languages, FilePlus2 } from 'lucide-react';
import { useCVViewer } from '../hooks/useCVViewer';
import { usePasscodeVerify } from '../hooks/usePasscodeVerify';
import TemplateRenderer from '../templates/TemplateRenderer';
import { API_BASE_URL } from '../services/api';
import { COLOR_MAP, FONT_MAP } from '../constants';

export function InteractivePortfolio({ 
  slug, 
  onUnlock 
}: { 
  slug: string;
  onUnlock: (passcode: string) => void;
}) {
  const viewerState = useCVViewer(slug);
  const {
    cvData, isLoading, statusMessage, 
    displayMode, setDisplayMode, t, template,
    language, setLanguage
  } = viewerState;

  const [sysDark, setSysDark] = useState<boolean>(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  );

  // Track system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSysDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const isDark = cvData.themeMode === 'dark' || (cvData.themeMode === 'auto' && sysDark);

  // Client-side analytics tracking hook
  useEffect(() => {
    if (!slug || typeof window === 'undefined' || isLoading) return;

    const width = window.innerWidth;
    const device = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    let country = 'Vietnam';
    let city = 'Hanoi';

    const sendEvent = async (eventType: string, section?: string, duration?: number) => {
      try {
        await fetch(`${API_BASE_URL}/cvs/${slug}/analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: eventType,
            section: section || null,
            duration: duration || null,
            device,
            country,
            city
          })
        });
      } catch (err) {
        console.error('Failed to log analytics event', err);
      }
    };

    const fetchGeoAndInit = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const geo = await res.json();
          country = geo.country_name || 'Vietnam';
          city = geo.city || 'Hanoi';
        }
      } catch (e) { /* ignore error */ }
      sendEvent('view');
    };

    fetchGeoAndInit();
    
    // Log scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > maxScroll + 20) {
        maxScroll = scrollPercent;
        sendEvent('scroll', `depth_${Math.round(maxScroll)}%`);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Session duration
    const startTime = Date.now();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      const duration = (Date.now() - startTime) / 1000;
      sendEvent('leave', undefined, duration);
    };
  }, [slug, isLoading]);

  const triggerPrint = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      const device = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
      fetch(`${API_BASE_URL}/cvs/${slug}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'export',
          device,
          country: 'Vietnam',
          city: 'Hanoi'
        })
      }).catch(() => {});
    }
    window.print();
  };

  const {
    showVerifyModal, setShowVerifyModal,
    verifyPasscodeVal, setVerifyPasscodeVal,
    verifyError, handleUnlockVerify
  } = usePasscodeVerify();

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUnlockVerify(
      slug, 
      t, 
      () => {}, 
      (isEdit) => { if (isEdit) onUnlock(verifyPasscodeVal); }, 
      () => {} 
    );
  };

  // Dynamically find if we have a translation key
  const translationKey = cvData.translated_data ? Object.keys(cvData.translated_data)[0] : null;

  // Resolve which data to display based on public view toggle
  const activeCvData = (displayMode === 'translated' && translationKey) 
    ? cvData.translated_data![translationKey] 
    : cvData;

  const activeColor = COLOR_MAP[(cvData.themeColor || 'indigo') as keyof typeof COLOR_MAP] || COLOR_MAP.indigo;
  const activeFont = FONT_MAP[(cvData.fontFamily || 'sans') as keyof typeof FONT_MAP] || FONT_MAP.sans;

  // Render Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Render 404 Error State (CV Not Found)
  if (statusMessage && statusMessage.type === 'error') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-purple-600 selection:text-white transition-colors duration-300 relative overflow-hidden flex items-center justify-center p-4">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.06),transparent_50%)] pointer-events-none"></div>

        {/* Top Right Language Switch */}
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="flex items-center justify-center px-3 py-1.5 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/50 shadow-lg transition-all cursor-pointer font-bold text-xs"
          >
            {language === 'vi' ? 'EN' : 'VI'}
          </button>
        </div>

        {/* Error Card */}
        <div className="relative max-w-md w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20 shadow-lg shadow-rose-900/10">
            <AlertCircle className="h-8 w-8 text-rose-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-rose-400 to-amber-200 bg-clip-text text-transparent">
              {t('cvNotFound')}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('cvNotFoundDesc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 px-5 py-3 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
            >
              {t('createNewCV')}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white text-sm font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              {t('tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-purple-600 selection:text-white transition-colors duration-300 relative overflow-x-hidden print:!bg-white print:!text-black print:!overflow-visible print:!static print:!min-h-0">
      {/* Premium subtle background glow effect (mesh/radial gradient) — hidden on print to prevent XPS renderer crash */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none print:!hidden"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.06),transparent_50%)] pointer-events-none print:!hidden"></div>

      {/* Floating Toolbar (Glassmorphism) - Hidden on Print */}
      <div className="print:hidden fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-2xl">
        <button
          onClick={() => setShowVerifyModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-purple-600/10 cursor-pointer"
        >
          <Edit3 className="h-4 w-4" />
          <span className="hidden sm:inline">{t('editCV')}</span>
        </button>

        <a
          href="/"
          className="flex items-center gap-2 px-4 py-2 btn-premium-cta active:scale-95 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          <FilePlus2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t('buildOwnCV')}</span>
        </a>

        {/* Public Display Language Toggle */}
        {translationKey && (
          <div className="flex bg-slate-800/80 p-1 rounded-xl w-fit print:hidden backdrop-blur-md border border-slate-700/50 shadow-xl mx-auto">
            <button 
              onClick={() => setDisplayMode('original')}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${displayMode === 'original' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t('originalMode')}
            </button>
            <button 
              onClick={() => setDisplayMode('translated')}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${displayMode === 'translated' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Languages className="w-4 h-4" />
              {t('translatedMode')}
            </button>
          </div>
        )}

        <button
          onClick={triggerPrint}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer text-white"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">{t('exportPDF')}</span>
        </button>
      </div>

      {/* Top Right Utilities */}
      <div className="print:hidden fixed top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          className="flex items-center justify-center px-3 py-1.5 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700/50 shadow-lg transition-all cursor-pointer font-bold text-xs"
        >
          {language === 'vi' ? 'EN' : 'VI'}
        </button>
      </div>

      {/* Main CV Container */}
      <div className="pt-24 pb-12 w-full max-w-[210mm] mx-auto print:!p-0 print:!m-0 print:!max-w-none print:!border-0 print:!bg-transparent">
        <div className={`
          mx-auto 
          ${isDark ? 'dark bg-slate-900 text-slate-100 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-xl border border-slate-850' : 'bg-white text-slate-900 shadow-2xl rounded-xl'} 
          transition-all duration-500 min-h-[297mm]
          print:!shadow-none print:!w-full print:!bg-white print:!text-black print:!p-0 print:!m-0
          print:!border-0 print:!border-transparent print:!rounded-none print:!outline-none
          print:!h-auto print:!min-h-0 print:!overflow-visible print:!static
          w-full max-w-full sm:max-w-[210mm]
          overflow-hidden relative
        `}>
          
          {isDark && (
            <div className="print:hidden absolute inset-0 bg-slate-950/20 pointer-events-none mix-blend-overlay"></div>
          )}

          <div 
            style={{
              '--cv-section-gap': `${cvData.sectionGap ?? 24}px`,
              '--cv-page-padding': `${cvData.pagePadding ?? 15}mm`,
              '--cv-font-size-adjust': `${cvData.fontSize ?? 0}px`,
            } as React.CSSProperties}
            className={`
              cv-document
              print:p-0 print:m-0
              ${activeFont}
              h-full flex flex-col relative z-10
            `}
          >
            <style>{`
              @media print {
                @page {
                  size: A4;
                  margin: ${cvData.pagePadding ?? 15}mm !important;
                }
              }
            `}</style>
            <TemplateRenderer templateId={template || 'modern'} cvData={activeCvData} activeColor={activeColor} t={t} />
          </div>
        </div>
      </div>

      {/* Passcode Unlock Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm print:hidden">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-2">{t('verifyPasscode')}</h3>
            <p className="text-sm text-slate-400 mb-6">{t('verifyDesc')}</p>
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={verifyPasscodeVal}
                  onChange={e => setVerifyPasscodeVal(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all text-slate-200"
                />
                {verifyError && <p className="text-rose-400 text-xs mt-2">{verifyError}</p>}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-all"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  {t('verify')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Toasts */}
      {statusMessage && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-sm transform transition-all duration-300 print:hidden ${
          statusMessage.type === 'success' ? 'bg-emerald-900/90 border border-emerald-500/30' : 'bg-rose-900/90 border border-rose-500/30'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" /> : <AlertCircle className="h-5 w-5 text-rose-400 mt-0.5" />}
          <p className="text-sm font-medium text-white">{statusMessage.text}</p>
        </div>
      )}
    </div>
  );
}
