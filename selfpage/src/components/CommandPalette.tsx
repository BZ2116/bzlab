import { useState, useEffect, useRef, useCallback } from 'react';
import Fuse from 'fuse.js';
import { projects } from '../data/projects.json';

interface Item {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  keywords: string;
}

const items: Item[] = [
  { id: 'home', label: 'Lab', sublabel: 'Home', href: '/', keywords: 'home lab 首页' },
  { id: 'projects', label: 'Projects', sublabel: 'All projects', href: '/projects', keywords: 'projects 项目列表' },
  { id: 'classic', label: 'Classic', sublabel: 'Resume view', href: '/classic', keywords: 'classic 经典 简历' },
  { id: 'resume', label: 'Resume', sublabel: 'PDF download', href: '/resume', keywords: 'resume 简历 pdf' },
  ...projects.map(p => ({
    id: p.slug,
    label: p.name,
    sublabel: p.fullName,
    href: `/projects/${p.slug}`,
    keywords: `${p.name} ${p.tech.join(' ')} ${p.type}`,
  })),
];

const fuse = new Fuse(items, {
  keys: ['label', 'sublabel', 'keywords'],
  threshold: 0.4,
});

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query ? fuse.search(query).map(r => r.item) : items;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery('');
        setSelectedIdx(0);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const triggerHandler = () => {
      setOpen(prev => !prev);
      setQuery('');
      setSelectedIdx(0);
    };
    window.addEventListener('keydown', handler);
    document.getElementById('cmdk-trigger')?.addEventListener('click', triggerHandler);
    return () => {
      window.removeEventListener('keydown', handler);
      document.getElementById('cmdk-trigger')?.removeEventListener('click', triggerHandler);
    };
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      window.location.href = results[selectedIdx].href;
    }
  }, [results, selectedIdx]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg mx-4 bg-[#0d1520] rounded-xl border border-white/[0.08] shadow-2xl overflow-hidden animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <svg className="w-4 h-4 text-[#6b7f94] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, pages..."
            className="flex-1 bg-transparent text-sm text-[#e8f0f8] placeholder-[#6b7f94] outline-none font-['JetBrains_Mono']"
          />
          <kbd className="text-[10px] text-[#6b7f94] px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-y-auto py-1">
          {results.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-[#6b7f94]">No results found</div>
          )}
          {results.map((item, i) => (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                i === selectedIdx ? 'bg-white/[0.06] text-[#e8f0f8]' : 'text-[#94a3b8] hover:bg-white/[0.03]'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0 text-[#6b7f94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {item.href.startsWith('/projects/') ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                )}
              </svg>
              <div className="min-w-0">
                <div className="font-['Orbitron'] text-xs">{item.label}</div>
                {item.sublabel && (
                  <div className="text-[10px] text-[#6b7f94] truncate">{item.sublabel}</div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
