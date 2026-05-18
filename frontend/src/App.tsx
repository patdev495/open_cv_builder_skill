import { useState, useEffect } from 'react';
import { 
  FileText, Save, Edit3, Eye, Printer, Lock, Globe, Plus, Trash2, Sparkles, Loader2, AlertCircle, CheckCircle2,
  User, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Layers, BarChart3, Sun, Moon
} from 'lucide-react';
import { COLOR_MAP, FONT_MAP, DENSITY_MAP } from './constants';
import { useCVEditor } from './hooks/useCVEditor';
import { CVEditorContext } from './context/CVEditorContext';
import { PersonalInfoForm } from './editor/PersonalInfoForm';
import { SummaryForm } from './editor/SummaryForm';
import { ExperienceForm } from './editor/ExperienceForm';
import { EducationForm } from './editor/EducationForm';
import { ProjectsForm } from './editor/ProjectsForm';
import { SkillsForm } from './editor/SkillsForm';
import { ExtraForm } from './editor/ExtraForm';
import { LayoutForm } from './editor/LayoutForm';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import TemplateRenderer from './templates/TemplateRenderer';
import { API_BASE_URL } from './services/api';

// ==========================================
// 2. React main App component
// ==========================================
function App() {
  const editorState = useCVEditor();
  const {
    slug,
    inputSlug, setInputSlug,
    cvData, dispatch,
    template, handleTemplateChange,
    passcode, setPasscode,
    showVerifyModal, setShowVerifyModal,
    verifyPasscodeVal, setVerifyPasscodeVal,
    verifyError, setVerifyError,
    isLoading,
    statusMessage,
    isEditMode, setIsEditMode,
    isViewOnly,
    language, setLanguage,
    t,
    handleSave,
    handleUnlockVerify,
    handleClearAll,
  } = editorState;

  const [activeTab, setActiveTab] = useState<string>("personal");

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
    if (!slug || typeof window === 'undefined') return;

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

    // Retrieve Geo location
    const fetchGeoAndInit = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          country = data.country_name || 'Vietnam';
          city = data.city || 'Hanoi';
        }
      } catch {}
      sendEvent('view');
    };
    fetchGeoAndInit();

    // Hover engagement tracker
    let activeSec: string | null = null;
    let entryTime = Date.now();

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const previewContainer = document.getElementById('cv-preview-sheet');
      if (!previewContainer) return;

      let current: HTMLElement | null = target;
      let secName: string | null = null;

      while (current && current !== previewContainer) {
        if (current.hasAttribute('data-section')) {
          secName = current.getAttribute('data-section');
          break;
        }
        if (current.id) {
          secName = current.id;
          break;
        }
        current = current.parentElement;
      }

      if (!secName) {
        const headers = Array.from(previewContainer.querySelectorAll('h3, h2, h1'));
        let minDistance = Infinity;
        let nearestHeader: Element | null = null;
        for (const h of headers) {
          const rect = h.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          const distance = Math.abs(rect.top - targetRect.top);
          if (distance < minDistance) {
            minDistance = distance;
            nearestHeader = h;
          }
        }
        if (nearestHeader) {
          const text = (nearestHeader.textContent || '').toLowerCase();
          if (text.includes('kinh nghiệm') || text.includes('experience') || text.includes('work')) secName = 'experience';
          else if (text.includes('dự án') || text.includes('project')) secName = 'projects';
          else if (text.includes('học vấn') || text.includes('education')) secName = 'education';
          else if (text.includes('kỹ năng') || text.includes('skills') || text.includes('skill')) secName = 'skills';
          else if (text.includes('tóm tắt') || text.includes('summary') || text.includes('profile')) secName = 'summary';
          else if (text.includes('chứng chỉ') || text.includes('certificate')) secName = 'certificates';
          else if (text.includes('ngoại ngữ') || text.includes('language')) secName = 'languages';
        }
      }

      if (secName && secName !== activeSec) {
        if (activeSec) {
          const elapsed = (Date.now() - entryTime) / 1000;
          if (elapsed > 0.5) sendEvent('hover', activeSec, elapsed);
        }
        activeSec = secName;
        entryTime = Date.now();
      }
    };

    const handleMouseLeave = () => {
      if (activeSec) {
        const elapsed = (Date.now() - entryTime) / 1000;
        if (elapsed > 0.5) sendEvent('hover', activeSec, elapsed);
        activeSec = null;
      }
    };

    // Attach listeners
    const interval = setInterval(() => {
      const previewContainer = document.getElementById('cv-preview-sheet');
      if (previewContainer) {
        clearInterval(interval);
        previewContainer.addEventListener('mouseover', handleMouseOver);
        previewContainer.addEventListener('mouseleave', handleMouseLeave);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      const previewContainer = document.getElementById('cv-preview-sheet');
      if (previewContainer) {
        previewContainer.removeEventListener('mouseover', handleMouseOver);
        previewContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [slug]);

  const triggerPrint = () => {
    if (slug) {
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


  const activeColor = COLOR_MAP[(cvData.themeColor || 'indigo') as keyof typeof COLOR_MAP] || COLOR_MAP.indigo;
  const activeFont = FONT_MAP[(cvData.fontFamily || 'sans') as keyof typeof FONT_MAP] || FONT_MAP.sans;
  const activeDensity = DENSITY_MAP[(cvData.layoutDensity || 'normal') as keyof typeof DENSITY_MAP] || DENSITY_MAP.normal;

  return (
    <CVEditorContext.Provider value={editorState}>
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-purple-600 selection:text-white">
      
      {/* ==========================================
          HEADER (Hidden when printing)
         ========================================== */}
      <header className="print:hidden border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-400 via-indigo-200 to-white bg-clip-text text-transparent">
                CV BUILDER PRO
              </span>
              <span className="text-[10px] block font-mono text-purple-400 tracking-widest font-semibold uppercase">AI-READY SKILL</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick URL and Mode Information */}
            {slug && (
              <div className="hidden md:flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50 text-xs">
                <Globe className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-slate-400 font-mono">localhost:5173/{slug}</span>
                {isEditMode ? (
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-purple-500/30">{t('modeEdit')}</span>
                ) : (
                  <span className="bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-bold">{t('modeView')}</span>
                )}
              </div>
            )}

            {/* Global Actions */}
            <div className="flex items-center gap-2">
              {!isEditMode && isViewOnly && (
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-sm font-semibold rounded-xl transition-all shadow-md shadow-purple-600/10 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                  {t('editCV')}
                </button>
              )}

              {isEditMode && isViewOnly && (
                <button
                  onClick={() => setIsEditMode(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-sm font-semibold rounded-xl transition-all cursor-pointer border border-slate-700"
                >
                  <Eye className="h-4 w-4" />
                  {t('viewPublic')}
                </button>
              )}
              {/* Theme Mode Toggle Button */}
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_THEME_MODE', payload: isDark ? 'light' : 'dark' })}
                className="p-2 bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center print:hidden mr-1"
                title={isDark ? (language === 'vi' ? 'Chế độ sáng' : 'Light Mode') : (language === 'vi' ? 'Chế độ tối' : 'Dark Mode')}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-amber-400 fill-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-purple-400 fill-purple-400" />
                )}
              </button>

              {/* Language Toggle Selector */}
              <div className="flex bg-slate-800/80 p-0.5 rounded-xl border border-slate-700 select-none mr-1 print:hidden">
                <button
                  type="button"
                  onClick={() => setLanguage('vi')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    language === 'vi' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  VI
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    language === 'en' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  EN
                </button>
              </div>
              <div className="relative group print:hidden">
                <button
                  onClick={triggerPrint}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer text-white"
                >
                  <Printer className="h-4 w-4" />
                  {t('exportPDF')}
                </button>
                {/* Floating Micro-Instruction Tooltip */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-800 text-[10px] text-slate-400 p-3 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none leading-normal">
                  <span className="font-bold text-slate-200 block mb-1">{t('printTipTitle')}</span>
                  <div className="flex flex-col gap-0.5">
                    <span>{t('printTipStep1')}</span>
                    <span>{t('printTipStep2')}</span>
                    <span>{t('printTipStep3')}</span>
                  </div>
                </div>
              </div>
              
              {isViewOnly && (
                <a
                  href="/"
                  className="flex items-center justify-center p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700/80"
                  title="title={t('newCV')}"
                >
                  <Plus className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          MAIN LAYOUT
         ========================================== */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 print:overflow-visible print:p-0 print:m-0 print:max-w-none print:w-auto ${isEditMode ? 'overflow-hidden' : 'overflow-visible'}`}>
        
        {/* ==========================================
            LEFT PANEL: EDITOR (Hidden when printing)
           ========================================== */}
        {isEditMode && (
          <section className="w-full lg:w-[48%] flex flex-col gap-6 print:hidden">
            
            {/* Status Messages */}
            {statusMessage && (
              <div className={`p-4 rounded-xl flex items-start gap-3 border ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm font-medium">{statusMessage.text}</span>
              </div>
            )}

            {/* CV Meta Box (Slug, Passcode and Template) */}
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 shadow-xl shadow-slate-950/20">
              <h2 className="text-base font-bold flex items-center gap-2 mb-4 bg-gradient-to-r from-purple-400 to-indigo-200 bg-clip-text text-transparent">
                <Sparkles className="h-4 w-4 text-purple-400" />
                {t('configPublish')}
              </h2>
              
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Slug Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      {t('slug')}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-mono font-medium">/</span>
                      <input
                        type="text"
                        value={inputSlug}
                        disabled={isViewOnly}
                        onChange={(e) => setInputSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                        placeholder="vi-du-pat"
                        className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl pl-6 pr-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-purple-500/30 text-slate-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  {/* Passcode Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      {t('passcode')}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/30 text-slate-200 transition-colors"
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Template Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {t('template')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'modern', name: t('modern') },
                      { id: 'classic', name: t('classic') },
                      { id: 'creative', name: t('creative') },
                      { id: 'executive', name: t('executive') },
                      { id: 'minimal', name: t('minimal') }
                    ].map((temp) => (
                      <button
                        key={temp.id}
                        type="button"
                        onClick={() => handleTemplateChange(temp.id)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all cursor-pointer truncate ${
                          template === temp.id
                            ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                            : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                        title={temp.name}
                      >
                        {temp.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Customization (Color, Font & Density) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1 border-t border-slate-800/80 pt-4">
                  
                  {/* Theme Color Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {language === 'vi' ? 'Tông màu chủ đạo' : 'Primary Theme Color'}
                    </label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {[
                        { id: 'indigo', name: 'Indigo', color: 'bg-indigo-600' },
                        { id: 'emerald', name: 'Emerald', color: 'bg-emerald-600' },
                        { id: 'rose', name: 'Rose', color: 'bg-rose-600' },
                        { id: 'amber', name: 'Amber', color: 'bg-amber-600' },
                        { id: 'bronze', name: 'Bronze', color: 'bg-amber-800' },
                        { id: 'slate', name: 'Slate', color: 'bg-slate-650' },
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => dispatch({ type: 'SET_THEME_COLOR', payload: c.id })}
                          className={`w-6 h-6 rounded-full cursor-pointer transition-all border-2 flex items-center justify-center hover:scale-110 active:scale-95 ${
                            (cvData.themeColor || 'indigo') === c.id
                              ? 'border-white ring-2 ring-purple-500/50'
                              : 'border-slate-800'
                          } ${c.color}`}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Layout Density Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {language === 'vi' ? 'Căn lề (Density)' : 'Layout Density'}
                    </label>
                    <select
                      value={cvData.layoutDensity || 'normal'}
                      onChange={(e) => dispatch({ type: 'SET_LAYOUT_DENSITY', payload: e.target.value as 'compact' | 'normal' | 'comfortable' })}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                    >
                      <option value="compact">{language === 'vi' ? 'Nhỏ (Gọn gàng)' : 'Compact'}</option>
                      <option value="normal">{language === 'vi' ? 'Vừa (Tiêu chuẩn)' : 'Normal'}</option>
                      <option value="comfortable">{language === 'vi' ? 'Lớn (Thoải mái)' : 'Comfortable'}</option>
                    </select>
                  </div>

                  {/* Font Family Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {language === 'vi' ? 'Phông chữ' : 'Typography'}
                    </label>
                    <select
                      value={cvData.fontFamily || 'inter'}
                      onChange={(e) => dispatch({ type: 'SET_FONT_FAMILY', payload: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none transition-colors"
                    >
                      <optgroup label="Modern Sans">
                        <option value="inter">Inter (Clean & Professional)</option>
                        <option value="outfit">Outfit (Premium Geometric)</option>
                      </optgroup>
                      <optgroup label="Elegant Serif">
                        <option value="lora">Lora (Contemporary Academic)</option>
                        <option value="playfair">Playfair Display (Luxurious Editorial)</option>
                      </optgroup>
                      <optgroup label="Tech Monospace">
                        <option value="jetbrains">JetBrains Mono (Developer Standard)</option>
                        <option value="fira">Fira Code (Creative Tech)</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Page Layout Selector */}
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {language === 'vi' ? '📄 Số trang (Page Layout)' : '📄 Page Layout'}
                    </label>
                    <div className="flex gap-2">
                      {([['single', language === 'vi' ? '1 Trang (Cố định)' : '1 Page (Fixed)'], ['multi', language === 'vi' ? 'Đa trang (Tự do)' : 'Multi-page (Free)']]) .map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => dispatch({ type: 'SET_PAGE_LAYOUT', payload: val as 'single' | 'multi' })}
                          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            (cvData.pageLayout || 'multi') === val
                              ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/30'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Mode Selector */}
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {t('defaultThemeMode')}
                    </label>
                    <div className="flex gap-2">
                      {([['light', t('themeModeLight')], ['dark', t('themeModeDark')], ['auto', t('themeModeAuto')]]).map(([val, label]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => dispatch({ type: 'SET_THEME_MODE', payload: val as 'light' | 'dark' | 'auto' })}
                          className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer truncate ${
                            (cvData.themeMode || 'light') === val
                              ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/30'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Actions Grid */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex-1 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 active:scale-[0.98] font-bold text-xs text-rose-400 hover:text-rose-300 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('clearCV')}
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] font-bold text-xs text-white rounded-xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isViewOnly ? t('updateCV') : t('saveAndPublish')}
                  </button>
                </div>
              </form>
            </div>

            {/* Form Editor Accordions */}
            <div className="flex-1 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden flex flex-col">
              
              {/* Tab Selector Header */}
              <div className="grid grid-cols-3 sm:grid-cols-5 border-b border-slate-800/80 bg-slate-900/60">
                {[
                  { id: 'personal', name: t('personalInfo'), icon: User },
                  { id: 'summary', name: t('summary'), icon: FileText },
                  { id: 'experience', name: t('experience'), icon: Briefcase },
                  { id: 'education', name: t('education'), icon: GraduationCap },
                  { id: 'projects', name: t('projects'), icon: FolderGit2 },
                  { id: 'skills', name: t('skills'), icon: Wrench },
                  { id: 'extra', name: t('languages'), icon: Award },
                  { id: 'layout', name: language === 'vi' ? 'Bố cục' : 'Layout', icon: Layers },
                  { id: 'analytics', name: language === 'vi' ? 'Thống kê' : 'Stats', icon: BarChart3 }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-1.5 px-1 sm:px-2 py-3 border-b-2 text-[10px] sm:text-xs font-bold transition-all cursor-pointer text-center ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-400 bg-purple-500/5'
                          : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate sm:whitespace-normal">{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Editor Contents */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[500px]">
                {/* PersonalInfoForm */}
                {activeTab === 'personal' && (
                  <PersonalInfoForm />
                )}

                {/* SummaryForm */}
                {activeTab === 'summary' && (
                  <SummaryForm />
                )}

                {/* ExperienceForm */}
                {activeTab === 'experience' && (
                  <ExperienceForm />
                )}

                {/* EducationForm */}
                {activeTab === 'education' && (
                  <EducationForm />
                )}

                {/* ProjectsForm */}
                {activeTab === 'projects' && (
                  <ProjectsForm />
                )}

                {/* SkillsForm */}
                {activeTab === 'skills' && (
                  <SkillsForm />
                )}

                {/* ExtraForm */}
                {activeTab === 'extra' && (
                  <ExtraForm />
                )}

                {/* LayoutForm */}
                {activeTab === 'layout' && (
                  <LayoutForm />
                )}

                {/* AnalyticsDashboard */}
                {activeTab === 'analytics' && (
                  <AnalyticsDashboard />
                )}


              </div>
            </div>

          </section>
        )}

        <section className={`flex-1 flex flex-col items-center justify-start ${isEditMode ? 'lg:w-[48%] overflow-y-auto' : 'w-full overflow-visible'} print:p-0 print:m-0`}>
          
          {/* View Only Mode Info Panel (Hidden when printing) */}
          {!isEditMode && isViewOnly && (
            <div className="w-[210mm] max-w-full print:hidden bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl mb-6 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                  <Globe className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{t('pubViewMode')}</h4>
                  <p className="text-xs text-slate-400">{t('pubViewDesc')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowVerifyModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold cursor-pointer border border-slate-700/60 text-slate-300 transition-all hover:text-white"
              >
                <Lock className="h-3.5 w-3.5" />
                {t('unlockBtn')}
              </button>
            </div>
          )}

          {/* Dotted Grid Layout wrapper for the simulated A4 Sheet */}
          <div className="w-full flex justify-center py-2 bg-slate-950 rounded-2xl border border-slate-900/60 shadow-inner relative overflow-x-auto print:overflow-visible print:bg-white print:border-none print:shadow-none print:p-0">
            
            {/* 
                ==========================================================
                A4 SIMULATION SHEET (Standard Dimension: 210mm x 297mm)
                Using deep Tailwind vector printer styles.
                ==========================================================
            */}
            <div
              id="cv-preview-sheet"
              className={`w-[210mm] transition-all duration-300 print:shadow-none print:w-full print:!bg-white print:!text-black ${activeFont} ${
                isDark
                  ? 'dark bg-slate-900 text-slate-100 border border-slate-800 shadow-indigo-950/20'
                  : 'bg-white text-slate-800'
              } ${activeDensity.paperPadding} shadow-2xl flex flex-col relative ${
                (cvData.pageLayout || 'multi') === 'single'
                  ? 'min-h-[297mm] max-h-[297mm] overflow-hidden print:overflow-visible print:max-h-none print:min-h-0'
                  : 'min-h-[297mm] overflow-visible'
              } ${
                template === 'modern' ? `border-t-[6px] ${activeColor.border} print:border-t-0` : ''
              }`}
            >
              <style>{`
                /* ==========================================================================
                   SCREEN STYLES (Only active on monitors - will be ignored when printing)
                   ========================================================================== */
                @media screen {
                  /* Screen Dark Mode overrides when .dark class is active on #cv-preview-sheet */
                  #cv-preview-sheet.dark {
                    background-color: #0f172a !important;
                    color: #f1f5f9 !important;
                    border-color: #1e293b !important;
                  }
                  #cv-preview-sheet.dark h1,
                  #cv-preview-sheet.dark h2,
                  #cv-preview-sheet.dark h3,
                  #cv-preview-sheet.dark h4,
                  #cv-preview-sheet.dark h5,
                  #cv-preview-sheet.dark h6,
                  #cv-preview-sheet.dark .text-slate-900,
                  #cv-preview-sheet.dark .text-slate-950,
                  #cv-preview-sheet.dark .text-slate-850 {
                    color: #ffffff !important;
                  }
                  #cv-preview-sheet.dark p,
                  #cv-preview-sheet.dark span,
                  #cv-preview-sheet.dark div,
                  #cv-preview-sheet.dark .text-slate-800,
                  #cv-preview-sheet.dark .text-slate-700,
                  #cv-preview-sheet.dark .text-slate-705,
                  #cv-preview-sheet.dark .text-slate-650,
                  #cv-preview-sheet.dark .text-slate-655,
                  #cv-preview-sheet.dark .text-slate-600 {
                    color: #e2e8f0 !important;
                  }
                  #cv-preview-sheet.dark .text-slate-500,
                  #cv-preview-sheet.dark .text-slate-550,
                  #cv-preview-sheet.dark .text-slate-400 {
                    color: #94a3b8 !important;
                  }

                  /* Deep target white/light cards inside skills list and flip to dark slate */
                  #cv-preview-sheet.dark .bg-slate-50,
                  #cv-preview-sheet.dark .bg-slate-100,
                  #cv-preview-sheet.dark .bg-slate-200,
                  #cv-preview-sheet.dark .bg-white {
                    background-color: #1e293b !important;
                    color: #f1f5f9 !important;
                  }

                  /* Target date pills and badges (e.g. 02/2024 - 03/2026) */
                  #cv-preview-sheet.dark .bg-slate-50.text-slate-500,
                  #cv-preview-sheet.dark .bg-slate-100.text-slate-600,
                  #cv-preview-sheet.dark [class*="bg-slate-"].text-\[10px\],
                  #cv-preview-sheet.dark .text-slate-400.bg-slate-100,
                  #cv-preview-sheet.dark .text-[10px].bg-slate-100,
                  #cv-preview-sheet.dark .font-mono.bg-slate-100,
                  #cv-preview-sheet.dark .bg-slate-100 {
                    background-color: #1e293b !important;
                    color: #cbd5e1 !important; /* Premium light slate text */
                    border: 1px solid #334155 !important;
                  }

                  /* Target skill tag pills inside cards */
                  #cv-preview-sheet.dark .bg-white.text-slate-700,
                  #cv-preview-sheet.dark .bg-white.text-slate-800,
                  #cv-preview-sheet.dark .border-slate-200 {
                    background-color: #0f172a !important;
                    color: #f1f5f9 !important;
                    border-color: #334155 !important;
                  }

                  /* Direct overrides for color-specific technology pills in dark mode */
                  #cv-preview-sheet.dark .bg-indigo-50,
                  #cv-preview-sheet.dark .bg-emerald-50,
                  #cv-preview-sheet.dark .bg-rose-50,
                  #cv-preview-sheet.dark .bg-amber-50 {
                    background-color: #1e293b !important;
                    border: 1px solid #334155 !important;
                  }
                  #cv-preview-sheet.dark .bg-indigo-50.text-indigo-700 {
                    color: #818cf8 !important; /* Premium light indigo */
                  }
                  #cv-preview-sheet.dark .bg-emerald-50.text-emerald-700 {
                    color: #34d399 !important; /* Premium light emerald */
                  }
                  #cv-preview-sheet.dark .bg-rose-50.text-rose-700 {
                    color: #fb7185 !important; /* Premium light rose */
                  }
                  #cv-preview-sheet.dark .bg-amber-50.text-amber-700,
                  #cv-preview-sheet.dark .bg-amber-50.text-amber-900 {
                    color: #fbbf24 !important; /* Premium light amber */
                  }
                  #cv-preview-sheet.dark .bg-slate-100.text-slate-700 {
                    background-color: #1e293b !important;
                    color: #cbd5e1 !important;
                    border-color: #334155 !important;
                  }

                  #cv-preview-sheet.dark .border-slate-200,
                  #cv-preview-sheet.dark .border-slate-300,
                  #cv-preview-sheet.dark .border-slate-100 {
                    border-color: #1e293b !important;
                  }
                  
                  #cv-preview-sheet.dark a {
                    color: #a78bfa !important;
                  }

                  /* Fix headings inside custom skill grid containers */
                  #cv-preview-sheet.dark .bg-slate-50 div,
                  #cv-preview-sheet.dark .bg-slate-50 span,
                  #cv-preview-sheet.dark .bg-white div,
                  #cv-preview-sheet.dark .bg-white span,
                  #cv-preview-sheet.dark .bg-indigo-50 div,
                  #cv-preview-sheet.dark .bg-indigo-50 span,
                  #cv-preview-sheet.dark .bg-emerald-50 div,
                  #cv-preview-sheet.dark .bg-emerald-50 span,
                  #cv-preview-sheet.dark .bg-rose-50 div,
                  #cv-preview-sheet.dark .bg-rose-50 span,
                  #cv-preview-sheet.dark .bg-amber-50 div,
                  #cv-preview-sheet.dark .bg-amber-50 span {
                    color: #ffffff !important;
                  }
                }

                /* ==========================================================================
                   GLOBAL PRINT STYLES (Enforces a pure, high-contrast, black-on-white sheet)
                   ========================================================================== */
                @media print {
                  @page {
                    margin: 0;
                    size: A4 portrait;
                  }
                  body {
                    margin: 0;
                    background: white !important;
                    color: black !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                  /* Completely strip dark backgrounds, forcing a clean white sheet */
                  #cv-preview-sheet,
                  #cv-preview-sheet.dark,
                  .dark, .bg-slate-900, .bg-slate-950 {
                    background: white !important;
                    background-color: white !important;
                    color: #0f172a !important;
                    box-shadow: none !important;
                    border: none !important;
                  }
                  
                  /* Enforce absolute dark text for high legibility */
                  #cv-preview-sheet h1,
                  #cv-preview-sheet h2,
                  #cv-preview-sheet h3,
                  #cv-preview-sheet h4,
                  #cv-preview-sheet h5,
                  #cv-preview-sheet h6,
                  #cv-preview-sheet.dark h1,
                  #cv-preview-sheet.dark h2,
                  #cv-preview-sheet.dark h3,
                  #cv-preview-sheet.dark h4,
                  #cv-preview-sheet.dark h5,
                  #cv-preview-sheet.dark h6 {
                    color: #000000 !important;
                  }
                  #cv-preview-sheet p,
                  #cv-preview-sheet span,
                  #cv-preview-sheet div,
                  #cv-preview-sheet.dark p,
                  #cv-preview-sheet.dark span,
                  #cv-preview-sheet.dark div {
                    color: #1e293b !important;
                  }
                  
                  /* Clean light card styling for skill grids */
                  #cv-preview-sheet .bg-slate-50,
                  #cv-preview-sheet .bg-slate-100,
                  #cv-preview-sheet .bg-slate-200,
                  #cv-preview-sheet .bg-white,
                  #cv-preview-sheet.dark .bg-slate-50,
                  #cv-preview-sheet.dark .bg-slate-100,
                  #cv-preview-sheet.dark .bg-slate-200,
                  #cv-preview-sheet.dark .bg-white {
                    background-color: #f8fafc !important; /* light slate-50 */
                    color: #0f172a !important;
                    border: 1px solid #cbd5e1 !important;
                  }
                  
                  /* Dynamic technology tag restore to light mode colors */
                  #cv-preview-sheet .bg-indigo-50,
                  #cv-preview-sheet .bg-emerald-50,
                  #cv-preview-sheet .bg-rose-50,
                  #cv-preview-sheet .bg-amber-50,
                  #cv-preview-sheet.dark .bg-indigo-50,
                  #cv-preview-sheet.dark .bg-emerald-50,
                  #cv-preview-sheet.dark .bg-rose-50,
                  #cv-preview-sheet.dark .bg-amber-50 {
                    background-color: #f1f5f9 !important; /* extremely soft light slate */
                    border: 1px solid #cbd5e1 !important;
                  }

                  #cv-preview-sheet .text-indigo-700,
                  #cv-preview-sheet .text-emerald-700,
                  #cv-preview-sheet .text-rose-700,
                  #cv-preview-sheet .text-amber-700,
                  #cv-preview-sheet .text-amber-900,
                  #cv-preview-sheet .text-slate-700,
                  #cv-preview-sheet.dark .text-indigo-700,
                  #cv-preview-sheet.dark .text-emerald-700,
                  #cv-preview-sheet.dark .text-rose-700,
                  #cv-preview-sheet.dark .text-amber-700,
                  #cv-preview-sheet.dark .text-amber-900,
                  #cv-preview-sheet.dark .text-slate-700 {
                    color: #334155 !important;
                  }

                  /* Restore dates/badges styles to light */
                  #cv-preview-sheet .bg-slate-50.text-slate-500,
                  #cv-preview-sheet .bg-slate-100.text-slate-600,
                  #cv-preview-sheet .bg-slate-100,
                  #cv-preview-sheet.dark .bg-slate-50.text-slate-500,
                  #cv-preview-sheet.dark .bg-slate-100.text-slate-600,
                  #cv-preview-sheet.dark .bg-slate-100 {
                    background-color: #f1f5f9 !important;
                    color: #475569 !important;
                    border: 1px solid #cbd5e1 !important;
                  }
                  
                  #cv-preview-sheet iframe,
                  #cv-preview-sheet button,
                  #cv-preview-sheet .print-hide,
                  #cv-preview-sheet.dark iframe,
                  #cv-preview-sheet.dark button,
                  #cv-preview-sheet.dark .print-hide {
                    display: none !important;
                  }
                }
              `}</style>
              
                            <TemplateRenderer templateId={template} cvData={cvData} activeColor={activeColor} t={t} />

            </div>
          </div>
        </section>

      </main>

      {/* ==========================================
          FOOTER (Hidden when printing)
         ========================================== */}
      <footer className="print:hidden border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 CV Builder Skill. Được xây dựng bài bản bằng React, FastAPI, SQLite và Tailwind v4.</p>
        </div>
      </footer>

      {/* ==========================================
          MODAL: PASSCODE VERIFICATION
         ========================================== */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-purple-500" />
              {t('unlockModalTitle')}
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {t('unlockModalDesc')}
            </p>

            {verifyError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-4 text-xs font-semibold text-rose-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {verifyError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUnlockVerify();
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{t('verifyPasscodeLabel')}</label>
                <input
                  type="password"
                  value={verifyPasscodeVal}
                  onChange={(e) => setVerifyPasscodeVal(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowVerifyModal(false);
                    setVerifyPasscodeVal("");
                    setVerifyError("");
                  }}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all text-slate-300 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-xs font-bold text-white rounded-xl transition-all shadow-md shadow-purple-600/10 flex items-center gap-1 cursor-pointer"
                >
                  {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  {t('verify')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
    </CVEditorContext.Provider>
  );
}

export default App;
