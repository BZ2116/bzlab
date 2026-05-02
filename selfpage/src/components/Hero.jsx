import React, { useEffect, useState, useCallback, useRef } from 'react';

const Hero = ({ onNavigate }) => {
  const [visible, setVisible] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const particleIdRef = useRef(0);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 10;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 10;
    setTilt({ x: rotateX, y: rotateY });

    // Spawn a particle
    const id = particleIdRef.current++;
    const particle = {
      id,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setParticles((prev) => [...prev.slice(-30), particle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 800);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      className="h-full flex flex-col items-center justify-center relative overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#060810]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00d4ff] rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Mouse-Following Particles */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#00d4ff]"
            style={{
              left: p.x,
              top: p.y,
              width: 4,
              height: 4,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 6px #00d4ff, 0 0 12px rgba(0,212,255,0.4)',
              animation: 'particleFade 0.8s ease-out forwards',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="mb-3 sm:mb-4 font-['Orbitron'] text-[#6b7f94] text-[10px] sm:text-xs tracking-[0.3em] animate-pulse">
          SYSTEM INITIALIZED // WELCOME TO
        </div>

        <h1 className="font-['Orbitron'] text-4xl sm:text-6xl md:text-8xl font-bold tracking-wider mb-4 sm:mb-6">
          <span className="bg-gradient-to-r from-[#00d4ff] via-[#7b61ff] to-[#00d4ff] bg-clip-text text-transparent animate-gradient">
            BZ's Lab
          </span>
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-['JetBrains_Mono'] bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30">
            AI
          </span>
          <span className="text-[#6b7f94] hidden sm:inline">/</span>
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-['JetBrains_Mono'] bg-[#7b61ff]/10 text-[#7b61ff] border border-[#7b61ff]/30">
            Computer Vision
          </span>
          <span className="text-[#6b7f94] hidden sm:inline">/</span>
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-['JetBrains_Mono'] bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30">
            Software Engineering
          </span>
        </div>

        <p className="text-[#6b7f94] text-sm sm:text-lg max-w-xl mx-auto leading-relaxed font-['JetBrains_Mono']">
          AI & CV · 即将前往 USTC 攻读网络安全方向
        </p>

        <div className="mt-8 sm:mt-12 flex items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-['JetBrains_Mono'] text-[#6b7f94]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff88]"></span>
            5 PROJECTS
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00d4ff]"></span>
            1 PAPER
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7b61ff]"></span>
            CQUPT → USTC
          </span>
        </div>

        <div className="mt-10 sm:mt-16">
          <button
            onClick={() => onNavigate('starmap')}
            className="inline-flex flex-col items-center gap-2 text-[#6b7f94] text-xs font-['JetBrains_Mono'] hover:text-[#00d4ff] transition-colors cursor-pointer"
          >
            <span className="animate-bounce inline-block">CLICK TO EXPLORE</span>
            <svg className="w-5 h-5 animate-bounce" style={{animationDelay: '0.15s'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scan Line Effect */}
      <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent animate-scan" />
    </div>
  );
};

export default Hero;