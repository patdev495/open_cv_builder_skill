import { useState, useEffect, useRef } from 'react';
import { 
  FileText, Save, Globe, Sun, Moon, AlertCircle, CheckCircle2, Loader2, Sparkles, 
  User, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Layers, BarChart3, 
  ChevronLeft, Copy, ExternalLink, X, Mail, Phone, 
  PenLine, Eye, Minus, Plus
} from 'lucide-react';
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
    isSlugAvailable, isCheckingSlug, slugValidationError,
    cvData, dispatch, template,
    passcode, setPasscode,
    isLoading, statusMessage, setStatusMessage, isViewOnly,
    language, setLanguage, t,
    editingMode, setEditingMode,
    isTranslating, handleTranslateCV,
    handleSave, handleClearAll, handleTemplateChange,
    draftToRecover, handleRecoverDraft, handleDiscardDraft
  } = editorState;

  const [activeTab, setActiveTab] = useState<string>("personal");
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');

  const [sysDark, setSysDark] = useState<boolean>(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [contentHeight, setContentHeight] = useState<number>(1123);

  // Zoom controls state
  const [zoomMode, setZoomMode] = useState<'fit' | 'custom'>('fit');
  const [customZoom, setCustomZoom] = useState<number>(100);

  const effectiveScale = zoomMode === 'fit' ? scale : (customZoom / 100);

  const handleZoomIn = () => {
    setZoomMode('custom');
    setCustomZoom((prev) => Math.min(160, Math.round(prev / 10) * 10 + 10));
  };

  const handleZoomOut = () => {
    setZoomMode('custom');
    setCustomZoom((prev) => Math.max(40, Math.round(prev / 10) * 10 - 10));
  };

  const handleResetZoom = () => {
    setZoomMode('fit');
  };

  // Measure and compute scale factor relative to A4 (794px width)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const parentWidth = container.getBoundingClientRect().width;
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

    if (overflow > printableHeight - 8 || overflow === 0) {
      setStatusMessage({ type: 'success', text: language === 'vi' ? 'Bố cục đã vừa vặn tối ưu!' : 'Layout is already perfectly optimized!' });
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

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

    if (overflow > printableHeight - 8 || overflow === 0) {
      autoFitRef.current.active = false;
      setStatusMessage({ type: 'success', text: language === 'vi' ? 'Đã tự động tối ưu hóa bố cục vừa khít trang!' : 'Successfully optimized layout to fit page!' });
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }

    if (autoFitRef.current.sectionGap > 8) {
      autoFitRef.current.sectionGap -= 1;
      dispatch({ type: 'SET_SECTION_GAP', payload: autoFitRef.current.sectionGap });
      setTimeout(runAutoFitStep, 80);
    } 
    else if (autoFitRef.current.pagePadding > 8) {
      autoFitRef.current.pagePadding -= 1;
      dispatch({ type: 'SET_PAGE_PADDING', payload: autoFitRef.current.pagePadding });
      setTimeout(runAutoFitStep, 80);
    } 
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

  // Completion status for tabs
  const sectionStatus = {
    personal: Boolean(cvData.personalInfo.fullName?.trim() || cvData.personalInfo.title?.trim()),
    summary: Boolean(cvData.summary?.trim()),
    experience: cvData.experience.length > 0,
    education: cvData.education.length > 0,
    projects: cvData.projects.length > 0,
    skills: cvData.skills.length > 0,
    extra: cvData.certificates.length > 0 || cvData.languages.length > 0,
    custom: (cvData.customSections?.length ?? 0) > 0,
    layout: true,
    analytics: true
  };

  return (
    <CVEditorContext.Provider value={{ ...editorState, cvData: activeCvData, handleAutoFit }}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-purple-600 selection:text-white">
        
        {/* Editor Header */}
        <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={onExit} 
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Quay lại danh mục"
                aria-label="Quay lại"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-2 rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-purple-400 via-indigo-200 to-white bg-clip-text text-transparent">
                  CV BUILDER PRO
                </span>
                <span className="text-[10px] block font-mono text-purple-400 tracking-widest font-semibold uppercase">
                  EDITOR WORKSPACE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {!slug && (
                <>
                  <a 
                    href="mailto:work.phamanhtu@gmail.com" 
                    className="hidden sm:flex items-center gap-1.5 bg-slate-800/60 hover:bg-slate-800 hover:text-purple-300 px-3 py-1.5 rounded-full border border-slate-700/50 text-xs text-slate-400 font-medium transition-all cursor-pointer"
                    title="Email Lập trình viên"
                  >
                    <Mail className="h-3.5 w-3.5 text-purple-400" />
                    <span className="font-mono text-[11px]">work.phamanhtu@gmail.com</span>
                  </a>
                  <a 
                    href="tel:0823634810" 
                    className="hidden sm:flex items-center gap-1.5 bg-slate-800/60 hover:bg-slate-800 hover:text-purple-300 px-3 py-1.5 rounded-full border border-slate-700/50 text-xs text-slate-400 font-medium transition-all cursor-pointer"
                    title="Số điện thoại Lập trình viên"
                  >
                    <Phone className="h-3.5 w-3.5 text-purple-400" />
                    <span className="font-mono text-[11px]">082.363.4810</span>
                  </a>
                </>
              )}

              {slug && (
                <div className="hidden md:flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50 text-xs">
                  <Globe className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-slate-400 font-mono text-[11px]">
                    {typeof window !== 'undefined' ? window.location.host : 'localhost:5173'}/{slug}
                  </span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold border border-purple-500/30">
                    EDITING
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                className="flex items-center justify-center px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer font-bold text-xs"
                title="Chuyển đổi giao diện Tiếng Việt / Tiếng Anh"
              >
                {language === 'vi' ? 'EN' : 'VI'}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_THEME_MODE', payload: isDark ? 'light' : 'dark' })}
                className="p-2 bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center"
                title={isDark ? "Chuyển sang Giao diện Sáng" : "Chuyển sang Giao diện Tối"}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-4 w-4 text-amber-400 fill-amber-400" /> : <Moon className="h-4 w-4 text-purple-400 fill-purple-400" />}
              </button>
            </div>
          </div>
        </header>

        {/* Workspace Layout */}
        <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col lg:flex-row gap-6 p-4 sm:p-6 pb-24 lg:pb-6 relative">
          
          {/* Left Panel: Editor */}
          <div className={`w-full lg:w-[42%] xl:w-[40%] flex flex-col lg:sticky lg:top-20 z-30 space-y-4 h-auto ${mobileTab === 'edit' ? 'block' : 'hidden lg:flex'}`}>
            
            {/* Save & Publish Control Bar */}
            <div className="bg-slate-900/70 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <Save className="h-4 w-4 text-emerald-400" />
                  </div>
                  <h2 className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                    {isViewOnly ? t('configPublish') : t('configPublish')}
                  </h2>
                </div>
                <button 
                  type="button" 
                  onClick={handleClearAll} 
                  className="text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-slate-800/60"
                  title="Xóa toàn bộ nội dung"
                >
                  {t('clearCV')}
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('slug')}</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-slate-700/80 bg-slate-950 text-slate-400 text-xs font-mono">
                        /
                      </span>
                      <input
                        type="text"
                        value={inputSlug}
                        onChange={(e) => setInputSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                        className="flex-1 bg-slate-950 border border-slate-700/80 rounded-r-xl px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all text-xs font-medium"
                        placeholder="my-awesome-cv"
                        required
                        disabled={isViewOnly}
                      />
                    </div>
                    {isCheckingSlug && (
                      <p className="text-slate-400 text-[10px] mt-1 font-medium flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 animate-spin text-purple-400" />
                        {t('checkingSlug')}
                      </p>
                    )}
                    {slugValidationError && (
                      <p className="text-rose-400 text-[10px] mt-1 font-medium flex items-center gap-1.5">
                        <AlertCircle className="h-3 w-3 text-rose-400 shrink-0" />
                        {slugValidationError}
                      </p>
                    )}
                    {!isCheckingSlug && !slugValidationError && isSlugAvailable && (
                      <p className="text-emerald-400 text-[10px] mt-1 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                        {t('slugAvailable')}
                      </p>
                    )}
                  </div>
                  {!isViewOnly && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('passcode')}</label>
                      <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all text-xs font-medium"
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isCheckingSlug || (!isViewOnly && isSlugAvailable === false)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>{isViewOnly ? t('updateCV') : t('saveAndPublish')}</span>
                </button>
              </form>
            </div>

            {/* Form Editor Section */}
            <div className="flex-1 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
              
              {/* Bilingual Editor & AI Translate Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-slate-800/80 bg-slate-950/50 gap-2.5">
                <div className="flex bg-slate-900 p-1 rounded-xl w-fit border border-slate-800">
                  <button 
                    type="button"
                    onClick={() => setEditingMode('original')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      editingMode === 'original' 
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/20' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t('originalMode')}
                  </button>
                  {translationKey && (
                    <button 
                      type="button"
                      onClick={() => setEditingMode('translated')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        editingMode === 'translated' 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t('translatedMode')} ({translationKey.toUpperCase()})
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleTranslateCV}
                  disabled={isTranslating}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-950/30 transition-all cursor-pointer disabled:opacity-50"
                  title="AI sẽ tự động nhận diện ngôn ngữ gốc và tạo Bản Dịch"
                >
                  {isTranslating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  <span>{translationKey ? (language === 'vi' ? 'Dịch lại toàn bộ' : 'Retranslate All') : (language === 'vi' ? 'Dịch AI song ngữ' : 'AI Translate')}</span>
                </button>
              </div>
              
              {/* Draft Recovery Banner */}
              {draftToRecover && (
                <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-medium">
                    <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
                    <span>{t('draftAlert')}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleRecoverDraft}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all cursor-pointer text-[11px]"
                    >
                      {t('draftRecover')}
                    </button>
                    <button
                      type="button"
                      onClick={handleDiscardDraft}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-all cursor-pointer border border-slate-700/50 text-[11px]"
                    >
                      {t('draftDiscard')}
                    </button>
                  </div>
                </div>
              )}

              {/* Tab Navigation: Modern Horizontal Scrollable Strip */}
              <div className="overflow-x-auto scrollbar-none px-3 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 select-none">
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
                  const isDone = sectionStatus[tab.id as keyof typeof sectionStatus];
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 whitespace-nowrap border ${
                        isActive
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30'
                          : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span>{tab.name}</span>
                      {isDone && tab.id !== 'layout' && tab.id !== 'analytics' && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-300' : 'bg-emerald-400/80'}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Body */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto max-h-[calc(100vh-320px)]">
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
                      <div className="bg-slate-800/50 rounded-2xl p-8 text-center border border-slate-700/60 border-dashed">
                        <BarChart3 className="h-12 w-12 text-slate-500 mx-auto mb-3 opacity-60" />
                        <p className="text-sm text-slate-400">
                          Hãy lưu và xuất bản CV để theo dõi lượt xem và thống kê tương tác
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Live Canvas Preview */}
          <div className={`w-full lg:w-[58%] xl:w-[60%] ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <div className="rounded-2xl shadow-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden flex flex-col">
              
              {/* Dedicated Canvas Control Toolbar */}
              <div className="p-3 sm:px-5 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
                {/* Left: Template Switcher & Theme Colors */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Template Selector Pills */}
                  <div className="flex bg-slate-950/90 p-1 rounded-xl border border-slate-800 shadow-inner">
                    {(['modern', 'classic', 'creative', 'executive', 'minimal', 'techpro'] as const).map((temp) => (
                      <button
                        key={temp}
                        type="button"
                        onClick={() => handleTemplateChange(temp)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                          template === temp
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                            : 'text-slate-400 hover:text-slate-200 cursor-pointer'
                        }`}
                      >
                        {t(temp as any)}
                      </button>
                    ))}
                  </div>

                  {/* CV Theme Color Picker */}
                  <div className="flex bg-slate-950/90 rounded-xl p-1 shadow-inner border border-slate-800 items-center gap-1">
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
                          className={`w-5 h-5 rounded-full ${dotColor} transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer relative flex items-center justify-center border ${
                            isActive 
                              ? 'border-white scale-105 shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
                              : 'border-transparent hover:border-slate-500/60'
                          }`}
                          title={color}
                          aria-label={`Theme color ${color}`}
                        >
                          {isActive && (
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Zoom Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-950/90 rounded-xl border border-slate-800 p-0.5 text-xs">
                    <button 
                      type="button" 
                      onClick={handleZoomOut} 
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
                      title="Thu nhỏ (-10%)"
                      aria-label="Zoom out"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-2 font-mono font-bold text-slate-300 min-w-[42px] text-center text-[11px]">
                      {Math.round(effectiveScale * 100)}%
                    </span>
                    <button 
                      type="button" 
                      onClick={handleZoomIn} 
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
                      title="Phóng to (+10%)"
                      aria-label="Zoom in"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={handleResetZoom} 
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg cursor-pointer ml-0.5 border-l border-slate-800 transition-colors ${
                        zoomMode === 'fit' ? 'text-purple-400 bg-purple-500/10' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="Vừa chiều rộng màn hình"
                    >
                      Fit
                    </button>
                  </div>
                </div>
              </div>

              {/* Canvas Preview Area */}
              <div ref={containerRef} className="p-4 sm:p-6 w-full flex justify-center overflow-x-auto min-h-[600px] print:!p-0 print:!m-0 print:!block relative bg-slate-950/30">
                {(() => {
                  const padPx = (cvData.pagePadding ?? 15) * 3.78;
                  const printableHeight = 1123 - 2 * padPx;
                  const totalContentSpace = Math.max(0, contentHeight - 2 * padPx);
                  
                  const isSinglePage = false;
                  const pageCount = isSinglePage ? 1 : (Math.ceil(totalContentSpace / printableHeight) || 1);
                  const displayHeight = isSinglePage ? Math.max(1123, contentHeight) : padPx + pageCount * printableHeight + padPx;

                  return (
                    <div 
                      style={{
                        width: `${794 * effectiveScale}px`,
                        height: `${displayHeight * effectiveScale}px`,
                        position: 'relative',
                      }}
                      className="print:!w-full print:!h-auto print:!static print:!overflow-visible transition-all duration-200"
                    >
                      <div 
                        ref={innerRef}
                        style={{
                          transform: `scale(${effectiveScale})`,
                          transformOrigin: 'top left',
                          width: '794px',
                          height: `${displayHeight}px`,
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}
                        className={`
                          ${isDark ? 'dark bg-slate-900 text-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.6)] border border-slate-800 rounded-xl' : 'bg-white text-slate-900 shadow-[0_15px_45px_rgba(0,0,0,0.15)] rounded-xl'} 
                          transition-all duration-300
                          print:!shadow-none print:!w-full print:!bg-transparent print:!text-black print:!p-0 print:!m-0 print:!static print:!transform-none print:!rounded-none print:!border-0 print:!border-transparent print:!outline-none print:!h-auto print:!min-h-0 print:!overflow-visible
                          overflow-hidden
                        `}
                      >
                        
                        {isDark && (
                          <div className="print:hidden absolute inset-0 bg-slate-950/20 pointer-events-none mix-blend-overlay"></div>
                        )}

                        {/* Paper Page Break Separators (Web only) */}
                        {!isSinglePage && Array.from({ length: pageCount - 1 }).map((_, idx) => {
                          const topPos = padPx + (idx + 1) * printableHeight;
                          return (
                            <div 
                              key={idx}
                              style={{ top: `${topPos}px` }}
                              className="print:hidden absolute left-0 right-0 z-30 pointer-events-none flex items-center justify-between px-4 -translate-y-1/2"
                            >
                              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
                              <div className="bg-slate-900/95 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold font-mono px-2.5 py-0.5 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5">
                                <FileText className="h-3 w-3 text-indigo-400" />
                                <span>{t('pageBoundary')} {idx + 1} &rarr; {t('toPage')} {idx + 2}</span>
                              </div>
                              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
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
                                margin: 0 !important;
                              }
                              body {
                                margin: ${cvData.pagePadding ?? 15}mm !important;
                                padding: 0 !important;
                              }
                            }
                          `}</style>
                          <TemplateRenderer templateId={template || 'modern'} cvData={activeCvData} activeColor={activeColor} t={t} slug={slug} />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

        </div>

        {/* Mobile View Toggle Bar with Lucide Vector Icons */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl p-1.5 border border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] gap-1.5 select-none transition-all duration-300">
          <button
            type="button"
            onClick={() => setMobileTab('edit')}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'edit'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 border border-purple-500/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border'
            }`}
          >
            <PenLine className="h-3.5 w-3.5" />
            <span>{language === 'vi' ? 'Soạn thảo' : 'Edit'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mobileTab === 'preview'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 border border-purple-500/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{language === 'vi' ? 'Bản in A4' : 'A4 Preview'}</span>
          </button>
        </div>

        {/* Status Toasts */}
        {statusMessage && (
          <div className={`fixed top-20 right-4 z-50 p-4 rounded-2xl shadow-2xl flex flex-col gap-3 max-w-sm w-full transform transition-all duration-300 backdrop-blur-xl ${
            statusMessage.type === 'success' 
              ? 'bg-slate-900/95 border border-emerald-500/40 shadow-emerald-950/20 text-slate-100' 
              : 'bg-rose-900/95 border border-rose-500/40 text-white'
          }`}>
            <div className="flex items-start gap-3">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rose-400 mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white break-words pr-4">{statusMessage.text}</p>
                
                {statusMessage.link && (
                  <div className="mt-3 space-y-2">
                    <div className="bg-slate-950/80 rounded-lg p-2 border border-slate-800 flex items-center justify-between gap-2">
                      <a 
                        href={statusMessage.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-mono underline truncate flex items-center gap-1.5"
                      >
                        <Globe className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                        <span className="truncate">{statusMessage.link}</span>
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(statusMessage.link || '');
                          const oldText = statusMessage.text;
                          setStatusMessage({
                            ...statusMessage,
                            text: language === 'vi' ? 'Đã sao chép liên kết!' : 'Link copied to clipboard!'
                          });
                          setTimeout(() => {
                            setStatusMessage(statusMessage ? { ...statusMessage, text: oldText } : null);
                          }, 2000);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-lg border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                        <span>{language === 'vi' ? 'Sao chép' : 'Copy'}</span>
                      </button>
                      <a 
                        href={statusMessage.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 active:scale-95 text-emerald-400 rounded-lg border border-emerald-500/30 text-xs font-semibold transition-all text-center"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{language === 'vi' ? 'Truy cập' : 'Open Link'}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => setStatusMessage(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1 hover:bg-slate-800/50 rounded-lg shrink-0 cursor-pointer -mt-1 -mr-1"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </CVEditorContext.Provider>
  );
}
