import React, { useState, useEffect } from 'react';

const Navbar = ({ activeModule, onModuleChange }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d) => {
    return d.toLocaleTimeString('zh-CN', { hour12: false });
  };

  const modules = [
    { id: 'hero', label: 'HOME' },
    { id: 'starmap', label: 'STAR MAP' },
    { id: 'terminal', label: 'TERMINAL' },
    { id: 'qa', label: 'Q&A' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 bg-[#060810]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="flex items-center gap-3">
        <img src="./BZ_logo.png" alt="BZ" className="w-8 h-8 rounded-lg" />
        <span className="font-['Orbitron'] text-[#00d4ff] text-sm tracking-wider">BZ's Lab</span>
      </div>

      <div className="flex items-center gap-1">
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => onModuleChange(m.id)}
            className={`px-3 py-1.5 text-xs font-['Orbitron'] tracking-wider rounded transition-all duration-200 ${
              activeModule === m.id
                ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40'
                : 'text-[#6b7f94] hover:text-[#e8f0f8]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-[#6b7f94]">
        <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
        <span>SYS ONLINE</span>
        <span className="text-[#00d4ff]">{formatTime(time)}</span>
      </div>
    </nav>
  );
};

export default Navbar;