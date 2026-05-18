import { User, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Languages, Layers, ArrowUp, ArrowDown } from 'lucide-react';
import { useCVEditorContext } from '../context/CVEditorContext';

export function LayoutForm() {
  const { cvData, dispatch, language } = useCVEditorContext();
  return (
                  <div className="flex flex-col gap-6">
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

                        return order.map((sec, idx) => {
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
