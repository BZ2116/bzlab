import React, { useState, useEffect } from 'react';

const Navbar = ({ activeModule, onModuleChange }) => {
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const formatTime = (d) => {
    return d.toLocaleTimeString('zh-CN', { hour12: false });
  };

  const modules = [
    { id: 'hero', label: 'HOME' },
    { id: 'starmap', label: 'STAR MAP' },
    { id: 'ai', label: 'AI' },
  ];

  const handleNav = (id) => {
    onModuleChange(id);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 sm:px-6 bg-[#060810]/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <img src="./BZ_logo.png" alt="BZ" className="w-8 h-8 rounded-lg" />
          <span className="font-['Orbitron'] text-[#00d4ff] text-sm tracking-wider">BZ's Lab</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
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

        <div className="hidden md:flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-[#6b7f94]">
          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
          <span>SYS ONLINE</span>
          <span className="text-[#00d4ff]">{formatTime(time)}</span>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-[#6b7f94] hover:text-[#00d4ff] transition-colors"
          aria-label="Menu"
        >
          <span className={`block w-5 h-[2px] bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`}></span>
          <span className={`block w-5 h-[2px] bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-[2px] bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#060810]/95 backdrop-blur-lg flex flex-col items-center justify-center gap-6 animate-fadeIn md:hidden">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => handleNav(m.id)}
              className={`text-2xl font-['Orbitron'] tracking-wider px-8 py-3 rounded-xl transition-all duration-200 ${
                activeModule === m.id
                  ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/40'
                  : 'text-[#6b7f94] hover:text-[#e8f0f8]'
              }`}
            >
              {m.label}
            </button>
          ))}
          <div className="mt-8 flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-[#6b7f94]">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
            <span>SYS ONLINE</span>
            <span className="text-[#00d4ff]">{formatTime(time)}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
