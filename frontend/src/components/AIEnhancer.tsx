import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { useCVEditorContext } from '../context/CVEditorContext';
import { optimizeWithAI } from '../services/api';

interface AIEnhancerProps {
  value: string;
  type: 'summary' | 'experience';
  onAccept: (newValue: string) => void;
}

export function AIEnhancer({ value, type, onAccept }: AIEnhancerProps) {
  const { t, language } = useCVEditorContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleAIRequest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!value || !value.trim()) {
      setError(language === 'vi' ? 'Vui lòng nhập nội dung thô trước khi tối ưu.' : 'Please enter some text before optimizing.');
      setIsOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestion(null);
    setIsOpen(true);

    try {
      const result = await optimizeWithAI(value, type, language);
      setSuggestion(result);
    } catch (err: any) {
      setError(err.message || t('aiError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (suggestion) {
      onAccept(suggestion);
    }
    setIsOpen(false);
    setSuggestion(null);
  };

  const handleDiscard = () => {
    setIsOpen(false);
    setSuggestion(null);
    setError(null);
  };

  return (
    <div className="relative inline-block print:hidden">
      {/* Magic Sparkle Button */}
      <button
        type="button"
        disabled={loading}
        onClick={handleAIRequest}
        className="flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 border border-purple-500/20 hover:border-purple-500/40 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
        title={t('aiOptimize')}
      >
        <Sparkles className={`h-3 w-3 ${loading ? 'animate-spin text-purple-300' : 'animate-pulse'}`} />
        <span>{loading ? t('aiOptimizing') : t('aiOptimize')}</span>
      </button>

      {/* Comparison Modal Popover (Overlay glass) */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  {t('aiOptimizeTitle')}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={handleDiscard}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              {error ? (
                <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                  <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
                  <span className="text-xs font-semibold animate-pulse">{t('aiOptimizing')}</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Original Text */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                      {t('aiOriginal')}
                    </label>
                    <div className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 leading-relaxed min-h-[150px] max-h-[250px] overflow-y-auto whitespace-pre-line select-text">
                      {value}
                    </div>
                  </div>

                  {/* Right Column: AI Suggestion */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold tracking-widest text-purple-400 uppercase flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 animate-pulse" />
                      {t('aiSuggested')}
                    </label>
                    <div className="flex-1 p-4 bg-purple-950/10 border border-purple-500/20 rounded-lg text-xs text-slate-200 leading-relaxed min-h-[150px] max-h-[250px] overflow-y-auto whitespace-pre-line shadow-inner shadow-purple-500/5 select-text">
                      {suggestion}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleDiscard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all cursor-pointer active:scale-95"
              >
                <X className="h-3.5 w-3.5" />
                <span>{t('aiDiscard')}</span>
              </button>
              
              {!loading && !error && suggestion && (
                <button
                  type="button"
                  onClick={handleAccept}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/20 cursor-pointer active:scale-95"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{t('aiAccept')}</span>
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
