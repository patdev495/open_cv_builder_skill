import { useState, useEffect, useRef } from 'react';
import { FileText, Save, Globe, Sun, Moon, AlertCircle, CheckCircle2, Loader2, Sparkles, User, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Layers, BarChart3, ChevronLeft } from 'lucide-react';
import { useCVEditor } from '../hooks/useCVEditor';
import { CVEditorContext } from '../context/CVEditorContext';
import { PersonalInfoForm } from '../editor/PersonalInfoForm';
import { SummaryForm } from '../editor/SummaryForm';
import { ExperienceForm } from '../editor/ExperienceForm';
import { EducationForm } from '../editor/EducationForm';
import { ProjectsForm } from '../editor/ProjectsForm';
import { SkillsForm } from '../editor/SkillsForm';
import { ExtraForm } from '../editor/ExtraForm';
import { CustomSectionsForm } from '../editor/CustomSectionsForm';
import { LayoutForm } from '../editor/LayoutForm';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import TemplateRenderer from '../templates/TemplateRenderer';
import { COLOR_MAP, FONT_MAP } from '../constants';

export function EditorWorkspace({ onExit, initialPasscode = '' }: { onExit: () => void, initialPasscode?: string }) {
  const editorState = useCVEditor(initialPasscode);
  const {
    slug, inputSlug, setInputSlug,
    cvData, dispatch, template,
    passcode, setPasscode,
    isLoading, statusMessage, setStatusMessage, isViewOnly,
    language, setLanguage, t,
    editingMode, setEditingMode,
    isTranslating, handleTranslateCV,
    handleSave, handleClearAll, handleTemplateChange
  } = editorState;

  const [activeTab, setActiveTab] = useState<string>("personal");

  const [sysDark, setSysDark] = useState<boolean>(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [contentHeight, setContentHeight] = useState<number>(1123);

  // Measure and compute scale factor relative to A4 (794px width)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const parentWidth = container.getBoundingClientRect().width;
      // standard A4 width is 794px at 96 DPI
      const a4Width = 794;
      const newScale = Math.min(1, parentWidth / a4Width);
      setScale(newScale);
    };

    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Track dynamic content height of the A4 inner content
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleHeightResize = () => {
      // Get exact content height and default to at least one full A4 page (1123px)
      setContentHeight(Math.max(1123, content.scrollHeight));
    };

    handleHeightResize();

    const observer = new ResizeObserver(handleHeightResize);
    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, [cvData, template, activeTab]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSysDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const autoFitRef = useRef<{
    active: boolean;
    sectionGap: number;
    pagePadding: number;
  }>({
    active: false,
    sectionGap: 24,
    pagePadding: 15
  });

  const handleAutoFit = () => {
    const currentContent = contentRef.current;
    if (!currentContent) return;

    const currentHeight = currentContent.scrollHeight;
    const currentPadPx = (cvData.pagePadding ?? 15) * 3.78;
    const printableHeight = 1123 - 2 * currentPadPx;
    const totalContentSpace = Math.max(0, currentHeight - 2 * currentPadPx);
    const overflow = totalContentSpace % printableHeight;

    // If the last page is almost perfectly full, we don't need to do anything
    if (overflow > printableHeight - 8 || overflow === 0) {
      setStatusMessage({ type: 'success', text: language === 'vi' ? 'Bố cục đã vừa vặn tối ưu!' : 'Layout is already perfectly optimized!' });
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    // Start auto-fitting process
    autoFitRef.current = {
      active: true,
      sectionGap: cvData.sectionGap ?? 24,
      pagePadding: cvData.pagePadding ?? 15
    };

    runAutoFitStep();
  };

  const runAutoFitStep = () => {
    if (!autoFitRef.current.active) return;

    const currentContent = contentRef.current;
    if (!currentContent) {
      autoFitRef.current.active = false;
      return;
    }

    const currentHeight = currentContent.scrollHeight;
    const currentPadPx = autoFitRef.current.pagePadding * 3.78;
    const printableHeight = 1123 - 2 * currentPadPx;
    const totalContentSpace = Math.max(0, currentHeight - 2 * currentPadPx);
    const overflow = totalContentSpace % printableHeight;

    // Check if it fits now (the last page is completely full or we just crossed the boundary)
    // When we cross the boundary, overflow drops from a small number to almost printableHeight
    if (overflow > printableHeight - 8 || overflow === 0) {
      autoFitRef.current.active = false;
      setStatusMessage({ type: 'success', text: language === 'vi' ? 'Đã tự động tối ưu hóa bố cục vừa khít trang!' : 'Successfully optimized layout to fit page!' });
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    // Try to shrink section gap first (min limit: 8px)
    if (autoFitRef.current.sectionGap > 8) {
      autoFitRef.current.sectionGap -= 2;
      dispatch({ type: 'SET_SECTION_GAP', payload: autoFitRef.current.sectionGap });
      setTimeout(runAutoFitStep, 80); // slight delay for smooth visual transition
    } 
    // Then try to shrink page padding (min limit: 8mm)
    else if (autoFitRef.current.pagePadding > 8) {
      autoFitRef.current.pagePadding -= 1;
      dispatch({ type: 'SET_PAGE_PADDING', payload: autoFitRef.current.pagePadding });
      setTimeout(runAutoFitStep, 80);
    } 
    // We reached the limit but still couldn't fit
    else {
      autoFitRef.current.active = false;
      setStatusMessage({ type: 'success', text: language === 'vi' ? 'Đã tối ưu hóa khoảng cách tốt nhất để tiết kiệm không gian!' : 'Layout minimized to optimal density!' });
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const isDark = cvData.themeMode === 'dark' || (cvData.themeMode === 'auto' && sysDark);

  const translationKey = cvData.translated_data ? Object.keys(cvData.translated_data)[0] : null;

  const activeCvData = (editingMode === 'translated' && translationKey) 
    ? cvData.translated_data![translationKey] 
    : cvData;

  const activeColor = COLOR_MAP[(cvData.themeColor || 'indigo') as keyof typeof COLOR_MAP] || COLOR_MAP.indigo;
  const activeFont = FONT_MAP[(cvData.fontFamily || 'sans') as keyof typeof FONT_MAP] || FONT_MAP.sans;

  return (
    <CVEditorContext.Provider value={{ ...editorState, cvData: activeCvData, handleAutoFit }}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-purple-600 selection:text-white">
        
        {/* Editor Header */}
        <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onExit} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-400 via-indigo-200 to-white bg-clip-text text-transparent">
                  CV BUILDER PRO
                </span>
                <span className="text-[10px] block font-mono text-purple-400 tracking-widest font-semibold uppercase">EDITOR WORKSPACE</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {slug && (
                <div className="hidden md:flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50 text-xs">
                  <Globe className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-slate-400 font-mono">localhost:5173/{slug}</span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-purple-500/30">EDITING</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                className="flex items-center justify-center px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer font-bold text-xs"
              >
                {language === 'vi' ? 'EN' : 'VI'}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_THEME_MODE', payload: isDark ? 'light' : 'dark' })}
                className="p-2 bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center"
              >
                {isDark ? <Sun className="h-4 w-4 text-amber-400 fill-amber-400" /> : <Moon className="h-4 w-4 text-purple-400 fill-purple-400" />}
              </button>
            </div>
          </div>
        </header>

        {/* Workspace Layout */}
        <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col lg:flex-row gap-6 p-4 sm:p-6 relative">
          
          {/* Left Panel: Editor */}
          <div className="w-full lg:w-[40%] xl:w-[38%] flex flex-col lg:sticky lg:top-24 z-30 space-y-4 h-auto">
            
            {/* Save Form */}
            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <Save className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  {isViewOnly ? t('configPublish') : t('configPublish')}
                </h2>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('slug')}</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-700 bg-slate-800/50 text-slate-400 text-sm font-mono">
                        /
                      </span>
                      <input
                        type="text"
                        value={inputSlug}
                        onChange={(e) => setInputSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-r-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm font-medium"
                        placeholder="my-awesome-cv"
                        required
                        disabled={isViewOnly}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('passcode')}</label>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm font-medium"
                      placeholder="••••••••"
                      required
                      disabled={isViewOnly}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={handleClearAll} className="px-4 py-2 bg-slate-800 hover:bg-rose-900/50 hover:text-rose-400 text-slate-400 text-sm font-semibold rounded-xl transition-all cursor-pointer">
                    {t('clearCV')}
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-70 cursor-pointer">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isViewOnly ? t('updateCV') : t('saveAndPublish')}
                  </button>
                </div>
              </form>
            </div>

            {/* Form Editor Accordions */}
            <div className="flex-1 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden flex flex-col">
              
              {/* Bilingual Editor Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-slate-800/80 bg-slate-950/60 gap-3">
                <div className="flex bg-slate-900 p-1 rounded-xl w-fit">
                  <button 
                    type="button"
                    onClick={() => setEditingMode('original')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${editingMode === 'original' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {t('originalMode')}
                  </button>
                  {translationKey && (
                    <button 
                      type="button"
                      onClick={() => setEditingMode('translated')}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${editingMode === 'translated' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {t('translatedMode')} ({translationKey.toUpperCase()})
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleTranslateCV}
                  disabled={isTranslating}
                  className="flex items-center justify-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-900/20 transition-all cursor-pointer disabled:opacity-50"
                  title="AI sẽ tự động nhận diện ngôn ngữ gốc và tạo Bản Dịch"
                >
                  {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {translationKey ? (language === 'vi' ? '🔄 Dịch lại toàn bộ' : '🔄 Retranslate All') : (language === 'vi' ? '🪄 Dịch AI thông minh' : '🪄 AI Smart Translate')}
                </button>
              </div>

              {/* Tab Selector Header */}
              <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-slate-950/30 border-b border-slate-800/85 select-none relative">
                {[
                  { id: 'personal', name: t('personalInfo'), icon: User },
                  { id: 'summary', name: t('summary'), icon: FileText },
                  { id: 'experience', name: t('experience'), icon: Briefcase },
                  { id: 'education', name: t('education'), icon: GraduationCap },
                  { id: 'projects', name: t('projects'), icon: FolderGit2 },
                  { id: 'skills', name: t('skills'), icon: Wrench },
                  { id: 'extra', name: t('languages'), icon: Award },
                  { id: 'custom', name: language === 'vi' ? 'Tùy chỉnh' : 'Custom', icon: Sparkles },
                  { id: 'layout', name: language === 'vi' ? 'Bố cục' : 'Layout', icon: Layers },
                  { id: 'analytics', name: language === 'vi' ? 'Thống kê' : 'Stats', icon: BarChart3 }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 whitespace-nowrap border ${
                        activeTab === tab.id
                          ? 'bg-purple-500/10 border-purple-500/40 text-purple-400 font-extrabold shadow-[0_0_12px_rgba(168,85,247,0.12)]'
                          : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Editor Contents */}
              <div className="flex-1 p-6">
                {activeTab === 'personal' && <PersonalInfoForm />}
                {activeTab === 'summary' && <SummaryForm />}
                {activeTab === 'experience' && <ExperienceForm />}
                {activeTab === 'education' && <EducationForm />}
                {activeTab === 'projects' && <ProjectsForm />}
                {activeTab === 'skills' && <SkillsForm />}
                {activeTab === 'extra' && <ExtraForm />}
                {activeTab === 'custom' && <CustomSectionsForm />}
                {activeTab === 'layout' && <LayoutForm />}
                {activeTab === 'analytics' && (
                  <div className="text-slate-300">
                    <h3 className="text-sm font-bold text-slate-200 mb-4">Thống kê tương tác CV</h3>
                    {slug && isViewOnly ? (
                      <AnalyticsDashboard />
                    ) : (
                      <div className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700 border-dashed">
                        <BarChart3 className="h-12 w-12 text-slate-500 mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-slate-400">
                          Hãy lưu CV để xem thống kê
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Live Preview */}
          <div className="w-full lg:w-[60%] xl:w-[62%]">
            <div className="relative transition-all duration-300 rounded-2xl shadow-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-md">
              <div className="absolute top-4 right-4 z-20 flex gap-3">
                {/* CV Theme Color Picker */}
                <div className="flex bg-slate-850/90 backdrop-blur-md rounded-xl p-1.5 shadow-lg border border-slate-700/60 items-center gap-1">
                  {(['indigo', 'emerald', 'rose', 'amber', 'bronze', 'slate'] as const).map((color) => {
                    const dotColor = color === 'indigo' ? 'bg-indigo-600' 
                                   : color === 'emerald' ? 'bg-emerald-600'
                                   : color === 'rose' ? 'bg-rose-600' 
                                   : color === 'amber' ? 'bg-amber-600' 
                                   : color === 'bronze' ? 'bg-amber-800' 
                                   : 'bg-slate-500';
                    const isActive = (cvData.themeColor || 'indigo') === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => dispatch({ type: 'SET_THEME_COLOR', payload: color })}
                        className={`w-5 h-5 rounded-full ${dotColor} mx-0.5 transition-all duration-300 hover:scale-120 active:scale-90 cursor-pointer relative flex items-center justify-center border ${
                          isActive 
                            ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
                            : 'border-slate-700/40 hover:border-slate-500/60'
                        }`}
                        title={color}
                      >
                        {isActive && (
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex bg-slate-800/80 backdrop-blur-md rounded-xl p-1.5 shadow-lg border border-slate-700/50">
                  {(['modern', 'classic', 'creative', 'executive', 'minimal', 'techpro'] as const).map((temp) => (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => handleTemplateChange(temp)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        template === temp
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200 cursor-pointer'
                      }`}
                    >
                      {t(temp as any)}
                    </button>
                  ))}
                </div>
              </div>
              <div ref={containerRef} className="p-2 sm:p-4 md:p-6 mt-14 sm:mt-0 w-full flex justify-center print:!p-0 print:!m-0 print:!block relative">
                {/* Floating Page Status Badge */}
                {(() => {
                  const padPx = (cvData.pagePadding ?? 15) * 3.78;
                  const printableHeight = 1123 - 2 * padPx;
                  const totalContentSpace = Math.max(0, contentHeight - 2 * padPx);
                  
                  const isSinglePage = cvData.pageLayout === 'single';
                  const pageCount = isSinglePage ? 1 : (Math.ceil(totalContentSpace / printableHeight) || 1);

                  return (
                    <div className="print:hidden absolute bottom-4 right-4 z-20 flex flex-col gap-2 items-end pointer-events-none">
                      {isSinglePage && contentHeight > 1123 && (
                        <div className="bg-rose-900/95 border border-rose-500/40 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 backdrop-blur-md">
                          <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 animate-pulse" />
                          <span>{t('contentTooLongSingle')}</span>
                        </div>
                      )}
                      <div className="bg-slate-800/90 border border-slate-700/50 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-md">
                        {t('totalPages')} {pageCount} {t('pagesUnit')}
                        {isSinglePage && ` (${t('fixedLayout')})`}
                      </div>
                    </div>
                  );
                })()}

                {(() => {
                  const padPx = (cvData.pagePadding ?? 15) * 3.78;
                  const printableHeight = 1123 - 2 * padPx;
                  const totalContentSpace = Math.max(0, contentHeight - 2 * padPx);
                  
                  const isSinglePage = cvData.pageLayout === 'single';
                  const pageCount = isSinglePage ? 1 : (Math.ceil(totalContentSpace / printableHeight) || 1);
                  const displayHeight = isSinglePage ? Math.max(1123, contentHeight) : padPx + pageCount * printableHeight + padPx;

                  return (
                    <div 
                      style={{
                        width: `${794 * scale}px`,
                        height: `${displayHeight * scale}px`,
                        position: 'relative',
                      }}
                      className="print:!w-full print:!h-auto print:!static print:!overflow-visible transition-all duration-300"
                    >
                      <div 
                        ref={innerRef}
                        style={{
                          transform: `scale(${scale})`,
                          transformOrigin: 'top left',
                          width: '794px',
                          height: `${displayHeight}px`,
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}
                        className={`
                          ${isDark ? 'dark bg-slate-900 text-slate-100 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-850 rounded-xl' : 'bg-white text-slate-900 shadow-2xl rounded-xl'} 
                          transition-all duration-500
                          print:!shadow-none print:!w-full print:!bg-transparent print:!text-black print:!p-0 print:!m-0 print:!static print:!transform-none print:!rounded-none print:!border-0 print:!border-transparent print:!outline-none print:!h-auto print:!min-h-0 print:!overflow-visible
                          overflow-hidden
                        `}
                      >
                        
                        {isDark && (
                          <div className="print:hidden absolute inset-0 bg-slate-950/20 pointer-events-none mix-blend-overlay"></div>
                        )}

                        {/* Page Dividers (Web only) */}
                        {!isSinglePage && Array.from({ length: pageCount - 1 }).map((_, idx) => {
                          const topPos = padPx + (idx + 1) * printableHeight;
                          return (
                            <div 
                              key={idx}
                              style={{ top: `${topPos}px` }}
                              className="print:hidden absolute left-0 right-0 border-t-2 border-dashed border-red-500/60 z-30 pointer-events-none flex justify-end pr-4"
                            >
                              <span className="bg-red-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-b-md shadow-md uppercase tracking-wider -translate-y-[1px]">
                                {t('pageBoundary')} {idx + 1} / {t('toPage')} {idx + 2}
                              </span>
                            </div>
                          );
                        })}

                        {/* Single Page Overflow Warning (Web only) */}
                        {isSinglePage && contentHeight > 1123 && (
                          <div 
                            style={{ top: '1120px' }}
                            className="print:hidden absolute left-0 right-0 border-t-2 border-dashed border-rose-600 z-30 pointer-events-none flex justify-end pr-4"
                          >
                            <span className="bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-b-md shadow-md uppercase tracking-wider">
                              {t('pageLimitExceeded')}
                            </span>
                          </div>
                        )}

                        <div 
                          ref={contentRef}
                          style={{
                            '--cv-section-gap': `${cvData.sectionGap ?? 24}px`,
                            '--cv-page-padding': `${cvData.pagePadding ?? 15}mm`,
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
                  );
                })()}
              </div>
            </div>
          </div>

        </div>

        {/* Status Toasts */}
        {statusMessage && (
          <div className={`fixed top-20 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-sm transform transition-all duration-300 ${
            statusMessage.type === 'success' ? 'bg-emerald-900/90 border border-emerald-500/30' : 'bg-rose-900/90 border border-rose-500/30'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" /> : <AlertCircle className="h-5 w-5 text-rose-400 mt-0.5" />}
            <p className="text-sm font-medium text-white">{statusMessage.text}</p>
          </div>
        )}
      </div>
    </CVEditorContext.Provider>
  );
}
