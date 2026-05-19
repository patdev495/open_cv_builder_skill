import { User, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Languages, Layers, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { useCVEditorContext } from '../context/CVEditorContext';

export function LayoutForm() {
  const { cvData, dispatch, language, handleAutoFit } = useCVEditorContext() as any;
  return (
                  <div className="flex flex-col gap-6">
                    {/* Page Layout Style Selector */}
                    <div className="border-b border-slate-800 pb-4">
                      <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-2">
                        <Layers className="h-4 w-4 text-purple-400" />
                        {language === 'vi' ? 'Định dạng Trang (Page Layout)' : 'Page Layout Style'}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'SET_PAGE_LAYOUT', payload: 'single' })}
                          className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                            cvData.pageLayout === 'single'
                              ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-lg'
                              : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          <span>{language === 'vi' ? 'Cố định 1 Trang (Single Page)' : 'Single Page (Fixed)'}</span>
                          <span className="text-[10px] font-normal text-slate-500">
                            {language === 'vi' ? 'Ép nội dung gọn trong 1 trang A4' : 'Fit content inside a single A4'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'SET_PAGE_LAYOUT', payload: 'multi' })}
                          className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                            cvData.pageLayout !== 'single'
                              ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-lg'
                              : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          <span>{language === 'vi' ? 'Đa Trang (Multi Page)' : 'Multi Page (Auto Split)'}</span>
                          <span className="text-[10px] font-normal text-slate-500">
                            {language === 'vi' ? 'Tự động ngắt trang khi viết dài' : 'Auto split pages for long text'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Typography / Font Family Selector */}
                    <div className="border-b border-slate-800 pb-5">
                      <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-3">
                        <span className="text-purple-400 font-extrabold">Aa</span>
                        {language === 'vi' ? 'Kiểu chữ (Typography)' : 'Document Typography'}
                      </h3>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {[
                          { id: 'inter', name: 'Inter', desc: 'Sans-serif' },
                           { id: 'outfit', name: 'Outfit', desc: 'Modern' },
                           { id: 'lora', name: 'Lora', desc: 'Serif Elegant' },
                           { id: 'playfair', name: 'Playfair', desc: 'Serif Classic' },
                           { id: 'jetbrains', name: 'JetBrains', desc: 'Monospace' },
                           { id: 'fira', name: 'Fira Code', desc: 'Code Mono' },
                        ].map((font) => {
                          const isSelected = cvData.fontFamily === font.id || 
                            (font.id === 'inter' && cvData.fontFamily === 'sans') || 
                            (font.id === 'lora' && cvData.fontFamily === 'serif') || 
                            (font.id === 'fira' && cvData.fontFamily === 'mono');
                          
                          return (
                            <button
                              key={font.id}
                              type="button"
                              onClick={() => dispatch({ type: 'SET_FONT_FAMILY', payload: font.id })}
                              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                                isSelected
                                  ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-lg'
                                  : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                              }`}
                            >
                              <span className="font-semibold text-[13px]">{font.name}</span>
                              <span className="text-[9px] font-normal text-slate-500">{font.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Page Spacing & Margin Sliders */}
                    <div className="border-b border-slate-800 pb-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 m-0">
                          <Wrench className="h-4 w-4 text-purple-400" />
                          {language === 'vi' ? 'Tinh chỉnh Khoảng cách' : 'Spacing Micro-adjustment'}
                        </h3>
                        {/* Auto-fit Button */}
                        {cvData.pageLayout !== 'single' && (
                          <button
                            type="button"
                            onClick={handleAutoFit}
                            className="flex items-center gap-1 px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 hover:text-white border border-purple-500/30 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm"
                            title={language === 'vi' ? 'Tự động co giãn vừa khít trang chẵn' : 'Auto scale to fit page perfectly'}
                          >
                            <Sparkles className="h-3 w-3 text-purple-300 animate-pulse" />
                            {language === 'vi' ? 'Tự động vừa trang' : 'Auto-fit Page'}
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        {/* Section Spacing Slider */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-400">{language === 'vi' ? 'Khoảng cách giữa các khối:' : 'Section Spacing:'}</span>
                            <span className="font-mono font-bold text-purple-400">{(cvData.sectionGap ?? 24)}px</span>
                          </div>
                          <input
                            type="range"
                            min="8"
                            max="32"
                            step="2"
                            value={cvData.sectionGap ?? 24}
                            onChange={(e) => dispatch({ type: 'SET_SECTION_GAP', payload: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500 border border-slate-850"
                          />
                        </div>

                        {/* Page Padding Slider */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-400">{language === 'vi' ? 'Lề trang (Padding):' : 'Page Padding:'}</span>
                            <span className="font-mono font-bold text-purple-400">{(cvData.pagePadding ?? 15)}mm</span>
                          </div>
                          <input
                            type="range"
                            min="8"
                            max="24"
                            step="1"
                            value={cvData.pagePadding ?? 15}
                            onChange={(e) => dispatch({ type: 'SET_PAGE_PADDING', payload: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500 border border-slate-850"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-slate-800 pb-2">
                      <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-purple-400" />
                        {language === 'vi' ? 'Sắp xếp Thứ tự các Khối (Sections)' : 'Adjust Section Layout Order'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {language === 'vi' 
                          ? 'Sử dụng các nút mũi tên Lên/Xuống bên phải mỗi khối để thay đổi thứ tự hiển thị của khối đó trên CV của bạn. Bố cục CV sẽ tự động cập nhật ngay lập tức!'
                          : 'Use the Up/Down arrow buttons to adjust the vertical order of sections on your CV. The CV template will update dynamically!'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {(() => {
                        const order = cvData.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills', 'certificates', 'languages'];
                        
                        const SECTION_META = {
                          summary: { nameVi: 'Tóm tắt (Summary)', nameEn: 'Summary', icon: User },
                          experience: { nameVi: 'Kinh nghiệm làm việc', nameEn: 'Work Experience', icon: Briefcase },
                          projects: { nameVi: 'Dự án tiêu biểu', nameEn: 'Key Projects', icon: FolderGit2 },
                          education: { nameVi: 'Học vấn', nameEn: 'Education', icon: GraduationCap },
                          skills: { nameVi: 'Kỹ năng chuyên môn', nameEn: 'Professional Skills', icon: Wrench },
                          certificates: { nameVi: 'Chứng chỉ', nameEn: 'Certificates', icon: Award },
                          languages: { nameVi: 'Ngoại ngữ', nameEn: 'Languages', icon: Languages }
                        };

                        return (order as string[]).map((sec: string, idx: number) => {
                          const meta = SECTION_META[sec as keyof typeof SECTION_META];
                          if (!meta) return null;
                          const IconComp = meta.icon;

                          return (
                            <div 
                              key={sec} 
                              className="bg-slate-950/40 px-4 py-3.5 rounded-xl border border-slate-850 hover:border-slate-800 transition-all flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-purple-400">
                                  <IconComp className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-200">
                                  {language === 'vi' ? meta.nameVi : meta.nameEn}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentOrder = [...order];
                                    if (idx > 0) {
                                      const temp = currentOrder[idx];
                                      currentOrder[idx] = currentOrder[idx - 1];
                                      currentOrder[idx - 1] = temp;
                                      dispatch({ type: 'SET_SECTION_ORDER', payload: currentOrder });
                                    }
                                  }}
                                  disabled={idx === 0}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    idx === 0 
                                      ? 'text-slate-600 border-slate-850 bg-slate-900/10 cursor-not-allowed' 
                                      : 'text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800 bg-slate-900/40'
                                  }`}
                                  title={language === 'vi' ? 'Di chuyển lên' : 'Move up'}
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentOrder = [...order];
                                    if (idx < currentOrder.length - 1) {
                                      const temp = currentOrder[idx];
                                      currentOrder[idx] = currentOrder[idx + 1];
                                      currentOrder[idx + 1] = temp;
                                      dispatch({ type: 'SET_SECTION_ORDER', payload: currentOrder });
                                    }
                                  }}
                                  disabled={idx === order.length - 1}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    idx === order.length - 1
                                      ? 'text-slate-600 border-slate-850 bg-slate-900/10 cursor-not-allowed' 
                                      : 'text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800 bg-slate-900/40'
                                  }`}
                                  title={language === 'vi' ? 'Di chuyển xuống' : 'Move down'}
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
  );
}
