import { useEffect, useState } from 'react';
import { useCVEditorContext } from '../context/CVEditorContext';
import { Eye, Printer, Clock, BarChart3, Globe, Smartphone, RefreshCw, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

interface AnalyticsData {
  total_views: number;
  total_exports: number;
  total_focus_time: number;
  section_heatmap: Record<string, number>;
  devices: Record<string, number>;
  countries: Record<string, number>;
}

export function AnalyticsDashboard() {
  const { slug, passcode, language } = useCVEditorContext();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/cvs/${slug}/analytics-dashboard?passcode=${encodeURIComponent(passcode)}`);
      if (!res.ok) {
        throw new Error(language === 'vi' ? 'Không thể tải báo cáo. Vui lòng thử lại.' : 'Failed to load report. Please try again.');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Error fetching stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [slug, passcode]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
        <span className="text-sm font-semibold">{language === 'vi' ? 'Đang phân tích số liệu tương tác...' : 'Analyzing interactive stats...'}</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-rose-400" />
        <p className="text-sm font-bold text-rose-300">{error || (language === 'vi' ? 'Lỗi tải dữ liệu' : 'Data Load Error')}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-all border border-slate-700 cursor-pointer"
        >
          {language === 'vi' ? 'Thử lại' : 'Retry'}
        </button>
      </div>
    );
  }

  // Calculate helpers
  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec.toFixed(0)}s`;
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins}m ${remainingSecs.toFixed(0)}s`;
  };

  const maxHeatmapVal = Math.max(...Object.values(data.section_heatmap), 1);
  const totalDeviceViews = Object.values(data.devices).reduce((a, b) => a + b, 0) || 1;

  // Pretty section names
  const sectionMeta = {
    summary: { vi: 'Tóm tắt', en: 'Summary' },
    experience: { vi: 'Kinh nghiệm', en: 'Experience' },
    projects: { vi: 'Dự án', en: 'Projects' },
    education: { vi: 'Học vấn', en: 'Education' },
    skills: { vi: 'Kỹ năng', en: 'Skills' },
    certificates: { vi: 'Chứng chỉ', en: 'Certificates' },
    languages: { vi: 'Ngoại ngữ', en: 'Languages' },
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title & Sync button */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            {language === 'vi' ? 'Thống kê tương tác thời gian thực' : 'Real-time Engagement Analytics'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'vi' 
              ? 'Phân tích ẩn danh hành vi đọc và mức độ quan tâm của nhà tuyển dụng.' 
              : 'Anonymously track reader focus and engagement metrics.'}
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          title={language === 'vi' ? 'Làm mới' : 'Refresh stats'}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {language === 'vi' ? 'Làm mới' : 'Refresh'}
        </button>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Views Card */}
        <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-800 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
          <div className="bg-purple-600/10 p-3.5 rounded-xl border border-purple-500/20 text-purple-400">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              {language === 'vi' ? 'Lượt xem CV' : 'Total Views'}
            </span>
            <span className="text-2xl font-black text-slate-100 font-mono tracking-tight mt-0.5 block">
              {data.total_views}
            </span>
          </div>
        </div>

        {/* Total PDF Exports Card */}
        <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-800 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
          <div className="bg-emerald-600/10 p-3.5 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Printer className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              {language === 'vi' ? 'Tải / In PDF' : 'PDF Prints'}
            </span>
            <span className="text-2xl font-black text-slate-100 font-mono tracking-tight mt-0.5 block">
              {data.total_exports}
            </span>
          </div>
        </div>

        {/* Total Focus Time Card */}
        <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex items-center gap-4 hover:border-slate-800 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
          <div className="bg-amber-600/10 p-3.5 rounded-xl border border-amber-500/20 text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              {language === 'vi' ? 'Thời gian đọc' : 'Focus Duration'}
            </span>
            <span className="text-2xl font-black text-slate-100 font-mono tracking-tight mt-0.5 block">
              {formatDuration(data.total_focus_time)}
            </span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section Heat-map Card */}
        <div className="bg-slate-950/30 border border-slate-850 p-6 rounded-2xl flex flex-col gap-4">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              {language === 'vi' ? 'Vùng tập trung của nhà tuyển dụng' : 'Reader Focus Areas'}
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              {language === 'vi'
                ? 'Đo lường thời gian (giây) người đọc lưu lại trên từng phần CV.'
                : 'Tracks average hover duration per section in seconds.'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {Object.keys(sectionMeta).map((key) => {
              const dur = data.section_heatmap[key] || 0;
              const percentage = Math.min((dur / maxHeatmapVal) * 100, 100);
              const label = sectionMeta[key as keyof typeof sectionMeta][language];

              return (
                <div key={key} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-300">{label}</span>
                    <span className="text-slate-500 font-mono font-bold">{dur.toFixed(1)}s</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Devices & Geography Card */}
        <div className="flex flex-col gap-6">
          
          {/* Device Distribution */}
          <div className="bg-slate-950/30 border border-slate-850 p-6 rounded-2xl flex flex-col gap-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-purple-400" />
              {language === 'vi' ? 'Thiết bị truy cập' : 'Device Distribution'}
            </h4>
            
            <div className="flex flex-col gap-3">
              {['desktop', 'tablet', 'mobile'].map((dev) => {
                const count = data.devices[dev] || 0;
                const ratio = Math.round((count / totalDeviceViews) * 100);
                const label = dev.charAt(0).toUpperCase() + dev.slice(1);

                return (
                  <div key={dev} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-semibold">{label}</span>
                      <span className="text-slate-500 font-mono font-bold">{count} ({ratio}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Geo/Country list */}
          <div className="bg-slate-950/30 border border-slate-850 p-6 rounded-2xl flex flex-col gap-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-purple-400" />
              {language === 'vi' ? 'Vị trí địa lý' : 'Top Regions'}
            </h4>

            {Object.keys(data.countries).length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-2">
                {language === 'vi' ? 'Chưa có thông tin địa lý' : 'No geographic data yet'}
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {Object.entries(data.countries).map(([country, count]) => (
                  <div key={country} className="flex justify-between items-center text-xs border-b border-slate-900 pb-1.5 last:border-0 last:pb-0">
                    <span className="font-semibold text-slate-300">{country}</span>
                    <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">{count} views</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
