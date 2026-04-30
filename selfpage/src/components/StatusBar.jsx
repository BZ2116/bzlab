import React from 'react';

const StatusBar = () => {
  return (
    <footer className="h-10 flex items-center justify-between px-6 bg-[#060810]/90 border-t border-white/[0.08] text-xs font-['JetBrains_Mono'] text-[#6b7f94]">
      <div className="flex items-center gap-4">
        <span>BZ's Lab v1.0.0</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span>
          ONLINE
        </span>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="/frontend-design"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          跳转到常规主页
        </a>
        <span>|</span>
        <span>© 2026 Bruce Zhao</span>
      </div>
    </footer>
  );
};

export default StatusBar;