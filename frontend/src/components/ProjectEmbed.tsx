import React from 'react';

interface ProjectEmbedProps {
  embedUrl?: string;
  projectName: string;
}

export const ProjectEmbed: React.FC<ProjectEmbedProps> = ({ embedUrl, projectName }) => {
  if (!embedUrl) return null;

  // Normalization helper
  const url = embedUrl.trim();

  // 1. YouTube Helper
  const getYouTubeId = (urlStr: string): string | null => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = urlStr.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    } catch {
      return null;
    }
  };

  // 2. Figma Helper
  const isFigmaUrl = (urlStr: string): boolean => {
    return urlStr.toLowerCase().includes('figma.com/file/') || 
           urlStr.toLowerCase().includes('figma.com/design/') ||
           urlStr.toLowerCase().includes('figma.com/proto/');
  };

  // 3. GitHub Helper
  const getGitHubRepo = (urlStr: string): { owner: string; repo: string } | null => {
    try {
      const lowerUrl = urlStr.toLowerCase();
      if (lowerUrl.includes('github.com/')) {
        const parts = urlStr.split('github.com/')[1].split('/');
        if (parts.length >= 2) {
          return { owner: parts[0], repo: parts[1].split('?')[0] };
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const ytId = getYouTubeId(url);
  const isFigma = isFigmaUrl(url);
  const gitHubRepo = getGitHubRepo(url);

  // Render YouTube Player
  if (ytId) {
    return (
      <div className="mt-4 w-full">
        {/* Screen view */}
        <div className="print:hidden relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-lg dark:shadow-indigo-950/20 group">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={`Video giới thiệu ${projectName}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
        {/* Print view */}
        <div className="hidden print:block mt-1 text-xs font-mono text-indigo-700 dark:text-indigo-400">
          🎥 Video Demo: <a href={url} target="_blank" rel="noreferrer" className="underline">{url}</a>
        </div>
      </div>
    );
  }

  // Render Figma Embed
  if (isFigma) {
    return (
      <div className="mt-4 w-full">
        {/* Screen view */}
        <div className="print:hidden relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-lg dark:shadow-indigo-950/20">
          <iframe
            src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`}
            title={`Thiết kế Figma cho ${projectName}`}
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full bg-slate-900"
          />
        </div>
        {/* Print view */}
        <div className="hidden print:block mt-1 text-xs font-mono text-indigo-700 dark:text-indigo-400">
          🎨 Thiết kế Figma: <a href={url} target="_blank" rel="noreferrer" className="underline">{url}</a>
        </div>
      </div>
    );
  }

  // Render GitHub Mockup Card (Stateless Premium design)
  if (gitHubRepo) {
    const { owner, repo } = gitHubRepo;
    return (
      <div className="mt-4 w-full">
        {/* Screen view */}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="print:hidden block w-full p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white/60 to-slate-50/40 dark:from-slate-900/60 dark:to-slate-950/40 backdrop-blur-md hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 shadow-md group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* GitHub SVG Icon */}
              <svg className="w-8 h-8 text-slate-800 dark:text-slate-200 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48 static 0-.236-.008-.864-.013-1.697-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {owner} / <span className="text-indigo-600 dark:text-indigo-400">{repo}</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Kho mã nguồn GitHub của dự án
                </p>
              </div>
            </div>
            
            {/* Click link action indicator */}
            <span className="text-indigo-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </span>
          </div>

          {/* Simulated Repo Stats to look incredibly premium */}
          <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-slate-200/30 dark:border-slate-800/30 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>TypeScript</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-4.5 h-4.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>GitHub Repository</span>
            </span>
          </div>
        </a>
        
        {/* Print view */}
        <div className="hidden print:block mt-1 text-xs font-mono text-indigo-700 dark:text-indigo-400">
          💻 Mã nguồn: <a href={url} target="_blank" rel="noreferrer" className="underline">{url}</a>
        </div>
      </div>
    );
  }

  // Render Generic Link Card Fallback
  return (
    <div className="mt-4 w-full">
      {/* Screen view */}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="print:hidden block w-full p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white/60 to-slate-50/40 dark:from-slate-900/60 dark:to-slate-950/40 backdrop-blur-md hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 shadow-md group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Globe Web Icon */}
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-900/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9yM3 9.75h18M3 14.25h18" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                Demo & Project Live
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[250px] sm:max-w-sm">
                {new URL(url).hostname}
              </p>
            </div>
          </div>

          <span className="text-indigo-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </span>
        </div>
      </a>

      {/* Print view */}
      <div className="hidden print:block mt-1 text-xs font-mono text-indigo-700 dark:text-indigo-400">
        🔗 Đường dẫn: <a href={url} target="_blank" rel="noreferrer" className="underline">{url}</a>
      </div>
    </div>
  );
};
