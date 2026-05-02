import { useState } from 'react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'research', label: 'Research' },
  { id: 'application', label: 'Application' },
];

export default function ProjectFilter({ onFilter }: { onFilter: (filter: string) => void }) {
  const [active, setActive] = useState('all');

  const handleClick = (id: string) => {
    setActive(id);
    onFilter(id);
  };

  return (
    <div className="flex gap-1.5">
      {FILTERS.map(f => (
        <button
          key={f.id}
          onClick={() => handleClick(f.id)}
          className={`px-3 py-1.5 rounded-md text-xs font-['Orbitron'] transition-all duration-200 ${
            active === f.id
              ? 'bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30'
              : 'text-[#6b7f94] border border-transparent hover:text-[#94a3b8] hover:border-white/[0.06]'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
