import React, { useState, useEffect, useMemo, useRef } from 'react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'research', label: 'Research' },
  { id: 'application', label: 'Application' },
];

const statusMap = {
  active: { label: 'Active', cls: 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/30' },
  published: { label: 'Published', cls: 'bg-[#00d4ff]/15 text-[#00d4ff] border-[#00d4ff]/30' },
  completed: { label: 'Completed', cls: 'bg-[#6b7f94]/15 text-[#6b7f94] border-[#6b7f94]/30' },
};

const StarLab = ({ projects, activeProjectId, onActiveChange }) => {
  const [internalId, setInternalId] = useState(projects[0]?.id);
  const [filter, setFilter] = useState('all');
  const [animKey, setAnimKey] = useState(0);

  // Support both controlled (via prop) and uncontrolled modes
  const activeId = activeProjectId ?? internalId;
  const prevActiveIdRef = useRef(activeId);
  useEffect(() => {
    if (activeProjectId && activeProjectId !== prevActiveIdRef.current) {
      setAnimKey(k => k + 1);
    }
    prevActiveIdRef.current = activeProjectId;
  }, [activeProjectId]);

  const filtered = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter(p => p.type === filter);
  }, [projects, filter]);

  const active = projects.find(p => p.id === activeId) || projects[0];

  const selectProject = (id) => {
    if (id === activeId) return;
    if (onActiveChange) onActiveChange(id);
    else setInternalId(id);
    setAnimKey(k => k + 1);
  };

  const handleFilter = (id) => {
    setFilter(id);
    const newFiltered = id === 'all' ? projects : projects.filter(p => p.type === id);
    if (newFiltered.length && !newFiltered.find(p => p.id === activeId)) {
      selectProject(newFiltered[0].id);
    }
  };

  if (!active) return null;

  return (
    <div className="h-full flex flex-col sm:flex-row overflow-hidden">
      {/* ═══ Left Panel ═══ */}
      <div className="w-full sm:w-64 lg:w-72 shrink-0 flex flex-col bg-[#0d1520]/60 border-b sm:border-b-0 sm:border-r border-white/[0.06]">
        {/* Header */}
        <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
          <div className="font-['Orbitron'] text-[#e8f0f8] text-xs tracking-wider mb-3">
            PROJECTS
          </div>
          {/* Filter pills */}
          <div className="flex gap-1.5">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => handleFilter(f.id)}
                className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-['JetBrains_Mono'] transition-all duration-200 ${
                  filter === f.id
                    ? 'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30'
                    : 'text-[#6b7f94] border border-transparent hover:text-[#94a3b8] hover:border-white/[0.06]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto">
          <div className="flex sm:flex-col px-3 sm:px-3 pb-3 sm:pb-3 gap-1 sm:gap-0.5">
            {filtered.map(p => {
              const isActive = p.id === activeId;
              const color = p.type === 'research' ? '#00d4ff' : '#7b61ff';
              return (
                <button
                  key={p.id}
                  onClick={() => selectProject(p.id)}
                  className={`relative shrink-0 sm:shrink sm:w-full flex items-center gap-3 px-3 py-2.5 sm:py-2.5 rounded-lg text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-white/[0.04]'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full hidden sm:block"
                      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
                    />
                  )}
                  {/* Mobile dot indicator */}
                  <div
                    className={`sm:hidden w-2 h-2 rounded-full shrink-0 transition-all ${isActive ? 'scale-100' : 'scale-75 opacity-40'}`}
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0">
                    <div className={`text-sm font-['Orbitron'] truncate transition-colors ${isActive ? 'text-[#e8f0f8]' : 'text-[#6b7f94] group-hover:text-[#94a3b8]'}`}>
                      {p.name}
                    </div>
                    <div className="text-[10px] text-[#4a5568] font-['JetBrains_Mono'] truncate hidden sm:block">
                      {p.fullName.length > 30 ? p.fullName.slice(0, 30) + '…' : p.fullName}
                    </div>
                  </div>
                  {/* Type dot */}
                  <div
                    className="w-1.5 h-1.5 rounded-full ml-auto shrink-0 hidden sm:block"
                    style={{ backgroundColor: color, opacity: isActive ? 0.8 : 0.3 }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ Center Panel ═══ */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div key={animKey} className="h-full p-5 sm:p-8 lg:p-10 animate-fadeIn">
          {/* Project header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-['Orbitron'] text-2xl sm:text-3xl text-[#e8f0f8] tracking-wide">
                {active.name}
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-['JetBrains_Mono'] border ${statusMap[active.status]?.cls || statusMap.completed.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  active.status === 'active' ? 'bg-[#00ff88]' :
                  active.status === 'published' ? 'bg-[#00d4ff]' : 'bg-[#6b7f94]'
                }`} />
                {statusMap[active.status]?.label || 'Completed'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6b7f94] font-['JetBrains_Mono']">
              {active.fullName}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-[15px] text-[#94a3b8] leading-relaxed font-['JetBrains_Mono'] mb-8 sm:mb-10 max-w-2xl">
            {active.description}
          </p>

          {/* Feature cards */}
          {active.features && (
            <div className="mb-8 sm:mb-10">
              <div className="text-[10px] font-['Orbitron'] text-[#6b7f94] tracking-wider mb-4">
                FEATURES
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                {active.features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                  >
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-['Orbitron'] shrink-0 mt-0.5"
                      style={{
                        backgroundColor: `${active.type === 'research' ? '#00d4ff' : '#7b61ff'}10`,
                        color: active.type === 'research' ? '#00d4ff' : '#7b61ff',
                        border: `1px solid ${active.type === 'research' ? '#00d4ff' : '#7b61ff'}20`,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className="text-sm text-[#b0bec5] font-['JetBrains_Mono'] leading-relaxed">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GitHub link */}
          <a
            href={active.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#94a3b8] hover:text-[#e8f0f8] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all text-sm font-['JetBrains_Mono']"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {active.github.includes('springer.com') ? 'View Paper' : 'View on GitHub'}
          </a>
        </div>
      </div>

      {/* ═══ Right Panel ═══ */}
      <div key={`right-${animKey}`} className="w-full sm:w-60 lg:w-64 shrink-0 border-t sm:border-t-0 sm:border-l border-white/[0.06] bg-[#0d1520]/40 overflow-y-auto animate-fadeIn">
        <div className="p-5 sm:p-5 space-y-6 sm:space-y-7">
          {/* Type */}
          <Section title="TYPE">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: active.type === 'research' ? '#00d4ff' : '#7b61ff' }}
              />
              <span className="text-sm text-[#e8f0f8] font-['JetBrains_Mono'] capitalize">
                {active.type === 'research' ? 'Research' : 'Application'}
              </span>
            </div>
          </Section>

          {/* Metrics */}
          {active.metrics && (
            <Section title="METRICS">
              <div className="space-y-3">
                {active.metrics.map((m, i) => (
                  <div key={i} className="flex items-baseline justify-between">
                    <span className="text-[11px] text-[#6b7f94] font-['JetBrains_Mono']">
                      {m.label}
                    </span>
                    <span className="text-sm text-[#e8f0f8] font-['Orbitron']">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Tech Stack */}
          <Section title="TECH STACK">
            <div className="flex flex-wrap gap-1.5">
              {active.tech.map(t => (
                <span
                  key={t}
                  className="px-2 py-1 rounded-md text-[11px] font-['JetBrains_Mono'] bg-white/[0.03] text-[#94a3b8] border border-white/[0.06] hover:border-white/[0.12] hover:text-[#e8f0f8] transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </Section>

          {/* Contributions */}
          {active.contributions && (
            <Section title="CONTRIBUTIONS">
              <ul className="space-y-2.5">
                {active.contributions.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#00d4ff] text-xs mt-0.5 shrink-0">›</span>
                    <span className="text-[12px] text-[#94a3b8] font-['JetBrains_Mono'] leading-relaxed">
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <div className="text-[10px] font-['Orbitron'] text-[#4a5568] tracking-wider mb-2.5">
      {title}
    </div>
    {children}
  </div>
);

export default StarLab;
