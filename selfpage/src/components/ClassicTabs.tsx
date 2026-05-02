import { useState } from 'react';
import profile from '../data/profile.json';
import { projects } from '../data/projects.json';
import { skills } from '../data/skills.json';

const tabs = [
  { id: 'about', label: '关于我' },
  { id: 'projects', label: '项目' },
  { id: 'skills', label: '技能' },
  { id: 'contact', label: '联系' },
];

const statusMap: Record<string, { label: string; cls: string }> = {
  active: { label: '进行中', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  published: { label: '已发表', cls: 'bg-sky-50 text-sky-600 border-sky-200' },
  completed: { label: '已完成', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
};

export default function ClassicTabs() {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <>
      {/* Tab bar */}
      <div className="flex justify-center gap-1 mt-8 bg-white rounded-xl p-1 shadow-sm border border-[#e2e8f0] inline-flex mx-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
              activeTab === t.id
                ? 'bg-[#2dd4bf] text-white font-medium shadow-sm'
                : 'text-[#64748b] hover:text-[#334155] hover:bg-[#f1f5f9]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-12 mt-8">
        {activeTab === 'about' && (
          <div className="space-y-8 animate-fadeIn">
            <Section title="自我介绍">
              <p className="leading-relaxed">{profile.bio}</p>
            </Section>
            <Section title="教育经历">
              <div className="space-y-4">
                {profile.education.map((e, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#2dd4bf] ring-4 ring-[#f0fdfa]"></div>
                      {i < profile.education.length - 1 && <div className="w-px flex-1 bg-[#e2e8f0] mt-1"></div>}
                    </div>
                    <div className="pb-4">
                      <div className="text-xs text-[#94a3b8] font-medium">{e.period}</div>
                      <div className="text-sm font-medium text-[#1e293b] mt-0.5">{e.school}</div>
                      <div className="text-xs text-[#64748b] mt-0.5">{e.degree}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="研究方向">
              <div className="flex flex-wrap gap-2">
                {profile.research.map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full text-sm bg-[#f0fdfa] text-[#0d9488] border border-[#99f6e4]">
                    {tag}
                  </span>
                ))}
              </div>
            </Section>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4 animate-fadeIn">
            {projects.map(p => {
              const s = statusMap[p.status] || statusMap.completed;
              return (
                <div key={p.slug} className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#1e293b]">{p.name}</h3>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${s.cls}`}>{s.label}</span>
                      </div>
                      <p className="text-xs text-[#94a3b8] mb-2">{p.fullName}</p>
                      <p className="text-sm text-[#64748b] leading-relaxed">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.tech.map((t: string) => (
                          <span key={t} className="px-2 py-0.5 rounded text-xs bg-[#f1f5f9] text-[#64748b]">{t}</span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-9 h-9 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] hover:text-[#1e293b] hover:border-[#cbd5e1] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fadeIn">
            {skills.map(cat => (
              <div key={cat.category}>
                <h3 className="text-sm font-semibold text-[#1e293b] mb-3">{cat.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg text-sm bg-white border border-[#e2e8f0] text-[#475569] hover:border-[#2dd4bf] hover:text-[#0d9488] transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-3 animate-fadeIn">
            <ContactCard
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
              label="邮箱"
              value={profile.contact.email}
              href={`mailto:${profile.contact.email}`}
            />
            <ContactCard
              icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>}
              label="GitHub"
              value={profile.contact.githubUser}
              href={profile.contact.github}
            />
          </div>
        )}
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#1e293b] mb-3">{title}</h2>
      <div className="text-sm text-[#64748b] leading-relaxed">{children}</div>
    </div>
  );
}

function ContactCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-[#e2e8f0] p-4 hover:shadow-sm transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-[#f0fdfa] flex items-center justify-center text-[#2dd4bf] shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-[#94a3b8]">{label}</div>
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1e293b] hover:text-[#2dd4bf] transition-colors">
          {value}
        </a>
      </div>
    </div>
  );
}
