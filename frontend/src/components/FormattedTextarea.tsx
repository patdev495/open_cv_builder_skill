import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic } from 'lucide-react';
import { useCVEditorContext } from '../context/CVEditorContext';

interface FormattedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChangeValue: (value: string) => void;
}

export function FormattedTextarea({
  value,
  onChangeValue,
  className = '',
  onKeyDown,
  onSelect,
  onBlur,
  onFocus,
  ...rest
}: FormattedTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { language } = useCVEditorContext() as any;

  // Check selection to toggle toolbar visibility
  const checkSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end && isFocused) {
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    // Delay hiding toolbar slightly so click on toolbar buttons can go through if mouse-down didn't prevent default
    setTimeout(() => {
      setShowToolbar(false);
    }, 150);
    if (onBlur) onBlur(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMeta = e.ctrlKey || e.metaKey;
    if (isMeta && (e.key.toLowerCase() === 'b' || e.key.toLowerCase() === 'i')) {
      e.preventDefault();
      handleFormat(e.key.toLowerCase() === 'b' ? 'bold' : 'italic');
    }
    if (onKeyDown) onKeyDown(e);
  };

  const handleFormat = (type: 'bold' | 'italic') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText = '';
    let newStart = start;
    let newEnd = end;

    if (type === 'bold') {
      const isBold = selectedText.startsWith('**') && selectedText.endsWith('**');
      if (isBold) {
        // Unwrap
        const unwrapped = selectedText.slice(2, -2);
        newText = value.slice(0, start) + unwrapped + value.slice(end);
        newStart = start;
        newEnd = end - 4;
      } else {
        // Wrap
        newText = value.slice(0, start) + `**${selectedText}**` + value.slice(end);
        newStart = start;
        newEnd = end + 4;
      }
    } else {
      const isItalic = selectedText.startsWith('*') && selectedText.endsWith('*') && !(selectedText.startsWith('**') && selectedText.endsWith('**'));
      if (isItalic) {
        // Unwrap
        const unwrapped = selectedText.slice(1, -1);
        newText = value.slice(0, start) + unwrapped + value.slice(end);
        newStart = start;
        newEnd = end - 2;
      } else {
        // Wrap
        newText = value.slice(0, start) + `*${selectedText}*` + value.slice(end);
        newStart = start;
        newEnd = end + 2;
      }
    }

    onChangeValue(newText);

    // Refocus and reselect text in next tick
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newEnd);
      checkSelection();
    }, 0);
  };

  useEffect(() => {
    checkSelection();
  }, [value, isFocused]);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col gap-1.5">
      {/* Floating Selection Toolbar */}
      {showToolbar && (
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 px-2.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2 z-20 animate-in fade-in slide-in-from-bottom-2 duration-150"
          onMouseDown={(e) => {
            // Prevent textarea from losing focus
            e.preventDefault();
          }}
        >
          <button
            type="button"
            onClick={() => handleFormat('bold')}
            className="p-1.5 hover:bg-purple-650/30 hover:text-purple-300 rounded-lg text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center cursor-pointer border border-transparent hover:border-purple-500/20"
            title={language === 'vi' ? 'In đậm (Ctrl+B)' : 'Bold (Ctrl+B)'}
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-slate-800" />
          <button
            type="button"
            onClick={() => handleFormat('italic')}
            className="p-1.5 hover:bg-purple-650/30 hover:text-purple-300 rounded-lg text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center cursor-pointer border border-transparent hover:border-purple-500/20"
            title={language === 'vi' ? 'In nghiêng (Ctrl+I)' : 'Italic (Ctrl+I)'}
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onSelect={checkSelection}
        className={className}
        {...rest}
      />

      {/* Inline Formatting Hint */}
      {isFocused && (
        <p className="text-[10px] text-slate-550/80 dark:text-slate-500/80 italic select-none">
          {language === 'vi' 
            ? '💡 Bôi đen văn bản + Ctrl+B để in đậm, Ctrl+I để in nghiêng' 
            : '💡 Select text + Ctrl+B to bold, Ctrl+I to italic'}
        </p>
      )}
    </div>
  );
}
