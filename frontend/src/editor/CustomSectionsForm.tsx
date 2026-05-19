import { Plus, Trash2, Sparkles } from 'lucide-react';
import { useCVEditorContext } from '../context/CVEditorContext';
import { AIEnhancer } from '../components/AIEnhancer';

export function CustomSectionsForm() {
  const { cvData, dispatch, language } = useCVEditorContext() as any;
  const sections = cvData.customSections || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            {language === 'vi' ? 'Khối nội dung Tùy chỉnh' : 'Custom Sections'}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            {language === 'vi' 
              ? 'Tự thiết kế thêm các mục ngoài lề (Hoạt động, Người tham chiếu, ...)' 
              : 'Design your own personal sections (Activities, References, ...)'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADD_CUSTOM_SECTION' })}
          className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer bg-purple-600/10 hover:bg-purple-600/20 px-3 py-1.5 rounded-xl border border-purple-500/30 transition-all shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          {language === 'vi' ? 'Thêm mục mới' : 'Add Section'}
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-10 bg-slate-950/20 rounded-2xl border border-slate-850 border-dashed">
          <Sparkles className="h-10 w-10 text-slate-600/40 mx-auto mb-3" />
          <p className="text-xs text-slate-500 italic">
            {language === 'vi' 
              ? 'Chưa thêm khối tùy chỉnh nào. Bấm nút phía trên để tạo!' 
              : 'No custom sections added yet. Click above to create one!'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sections.map((sec: any, sIdx: number) => (
            <div key={sec.id} className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800/80 flex flex-col gap-4 relative">
              {/* Header of the Custom Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex-1">
                  <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/20">
                    {language === 'vi' ? `KHỐI TÙY CHỈNH #${sIdx + 1}` : `CUSTOM SECTION #${sIdx + 1}`}
                  </span>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => dispatch({ type: 'UPDATE_CUSTOM_SECTION', id: sec.id, payload: { title: e.target.value } })}
                    placeholder={language === 'vi' ? 'Tên tiêu đề (ví dụ: Hoạt động ngoại khóa)' : 'Section Title (e.g. Extracurriculars)'}
                    className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-800 focus:border-purple-500 font-bold text-sm text-slate-200 focus:outline-none py-1 mt-1 transition-all"
                  />
                </div>
                <div className="flex items-center gap-3">
                  {/* Layout selector */}
                  <div className="flex bg-slate-950/80 rounded-xl p-1 shadow-inner border border-slate-850 items-center">
                    {(['timeline', 'cards', 'text'] as const).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => dispatch({ type: 'UPDATE_CUSTOM_SECTION', id: sec.id, payload: { layoutStyle: style } })}
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          (sec.layoutStyle || 'timeline') === style
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                            : 'text-slate-500 hover:text-slate-300 border border-transparent'
                        }`}
                      >
                        {style === 'timeline' ? (language === 'vi' ? '📅 Timeline' : '📅 Timeline') :
                         style === 'cards' ? (language === 'vi' ? '🗂️ Thẻ' : '🗂️ Cards') :
                         (language === 'vi' ? '📝 Đoạn văn' : '📝 Paragraphs')}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'REMOVE_CUSTOM_SECTION', id: sec.id })}
                    className="text-slate-500 hover:text-rose-450 p-1.5 hover:bg-slate-950 rounded-xl cursor-pointer border border-transparent hover:border-slate-800 transition-all"
                    title={language === 'vi' ? 'Xóa mục tùy chỉnh này' : 'Delete this custom section'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Items List in this section */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {language === 'vi' ? 'Danh sách nội dung' : 'Items List'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'ADD_CUSTOM_SECTION_ITEM', sectionId: sec.id })}
                    className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-850"
                  >
                    <Plus className="h-3 w-3" />
                    {language === 'vi' ? 'Thêm nội dung' : 'Add Item'}
                  </button>
                </div>

                {(!sec.items || sec.items.length === 0) ? (
                  <p className="text-[11px] text-slate-500 italic text-center py-4 bg-slate-950/10 rounded-xl border border-slate-900 border-dashed">
                    {language === 'vi' ? 'Chưa có thông tin. Bấm "Thêm nội dung" ở trên!' : 'Empty. Click "Add Item" above!'}
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {sec.items.map((item: any, iIdx: number) => (
                      <div key={item.id} className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex flex-col gap-3 relative">
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'REMOVE_CUSTOM_SECTION_ITEM', sectionId: sec.id, itemId: item.id })}
                          className="absolute top-4 right-4 text-slate-500 hover:text-rose-450 p-1 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                          title={language === 'vi' ? 'Xóa nội dung' : 'Delete item'}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <span className="absolute top-4 left-4 bg-slate-900 text-slate-500 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-800">
                          #{iIdx + 1}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                              {language === 'vi' ? 'Tiêu đề chính' : 'Main Title'}
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => dispatch({
                                type: 'UPDATE_CUSTOM_SECTION_ITEM',
                                sectionId: sec.id,
                                itemId: item.id,
                                payload: { title: e.target.value }
                              })}
                              placeholder={language === 'vi' ? 'ví dụ: Trưởng nhóm Dự án, PGS.TS Nguyễn Văn B' : 'e.g. Team Leader, Dr. John Smith'}
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                              {language === 'vi' ? 'Tiêu đề phụ / Đơn vị' : 'Subtitle / Sub-header'}
                            </label>
                            <input
                              type="text"
                              value={item.subtitle || ''}
                              onChange={(e) => dispatch({
                                type: 'UPDATE_CUSTOM_SECTION_ITEM',
                                sectionId: sec.id,
                                itemId: item.id,
                                payload: { subtitle: e.target.value }
                              })}
                              placeholder={language === 'vi' ? 'ví dụ: Chiến dịch mùa hè xanh, CTO tại ABC Group' : 'e.g. Green Summer, CTO at ABC Tech'}
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                              {language === 'vi' ? 'Thời gian / Năm' : 'Date / Year'}
                            </label>
                            <input
                              type="text"
                              value={item.date || ''}
                              onChange={(e) => dispatch({
                                type: 'UPDATE_CUSTOM_SECTION_ITEM',
                                sectionId: sec.id,
                                itemId: item.id,
                                payload: { date: e.target.value }
                              })}
                              placeholder="2023 - 2024"
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                              {language === 'vi' ? 'Liên kết (Link)' : 'URL / Link'}
                            </label>
                            <input
                              type="text"
                              value={item.url || ''}
                              onChange={(e) => dispatch({
                                type: 'UPDATE_CUSTOM_SECTION_ITEM',
                                sectionId: sec.id,
                                itemId: item.id,
                                payload: { url: e.target.value }
                              })}
                              placeholder="https://example.com/certificate"
                              className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-550">
                              {language === 'vi' ? 'Mô tả chi tiết' : 'Description'}
                            </label>
                            <AIEnhancer
                              value={item.description || ''}
                              type="experience"
                              onAccept={(newValue) => dispatch({
                                type: 'UPDATE_CUSTOM_SECTION_ITEM',
                                sectionId: sec.id,
                                itemId: item.id,
                                payload: { description: newValue }
                              })}
                            />
                          </div>
                          <textarea
                            value={item.description || ''}
                            onChange={(e) => dispatch({
                              type: 'UPDATE_CUSTOM_SECTION_ITEM',
                              sectionId: sec.id,
                              itemId: item.id,
                              payload: { description: e.target.value }
                            })}
                            placeholder={language === 'vi' ? 'Mô tả chi tiết đóng góp của bạn hoặc gạch đầu dòng...' : 'Describe details or list items...'}
                            rows={3}
                            className="w-full bg-slate-950/60 border border-slate-850 focus:border-purple-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none font-sans leading-relaxed resize-y"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
