import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StarMap from './components/StarMap';
import AIChat from './components/AIChat';
import FreshPage from './components/FreshPage';
import StatusBar from './components/StatusBar';
import projectsData from './data/projects.json';
import skillsData from './data/skills.json';
import qaData from './data/qa.json';

const ProjectDetail = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl mx-2 sm:mx-4 bg-[#0d1520] rounded-xl border border-white/[0.08] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/[0.08]">
          <div>
            <h2 className="text-xl sm:text-2xl font-['Orbitron'] text-[#e8f0f8]">{project.name}</h2>
            <p className="text-xs sm:text-sm text-[#6b7f94] font-['JetBrains_Mono']">{project.fullName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#131f30] flex items-center justify-center text-[#6b7f94] hover:text-[#e8f0f8] hover:bg-[#1a2a3a] transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-xs font-['Orbitron'] text-[#00d4ff] mb-2">项目描述</h3>
            <p className="text-[#e8f0f8] leading-relaxed">{project.description}</p>
          </div>

          <div>
            <h3 className="text-xs font-['Orbitron'] text-[#00d4ff] mb-2">技术栈</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-['JetBrains_Mono'] bg-[#7b61ff]/20 text-[#7b61ff] border border-[#7b61ff]/30"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-['Orbitron'] text-[#00d4ff] mb-2">状态</h3>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-['JetBrains_Mono'] ${
                project.status === 'active'
                  ? 'bg-[#00ff88]/20 text-[#00ff88]'
                  : project.status === 'published'
                  ? 'bg-[#00d4ff]/20 text-[#00d4ff]'
                  : 'bg-[#6b7f94]/20 text-[#6b7f94]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                project.status === 'active' ? 'bg-[#00ff88]' :
                project.status === 'published' ? 'bg-[#00d4ff]' : 'bg-[#6b7f94]'
              }`}></span>
              {project.status === 'active' ? '进行中' : project.status === 'published' ? '已发表' : '已完成'}
            </span>
          </div>

          <div className="flex gap-3 pt-4">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d4ff] text-[#060810] font-['Orbitron'] text-sm font-bold hover:bg-[#00d4ff]/90 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeModule, setActiveModule] = useState('hero');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);

  const handleProjectSelect = useCallback((project) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  }, []);

  const handleProjectOpen = (project) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  if (activeModule === 'fresh') {
    return (
      <div className="h-screen overflow-hidden">
        <FreshPage onSwitchBack={() => setActiveModule('hero')} />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#060810] text-[#e8f0f8]">
      <Navbar activeModule={activeModule} onModuleChange={setActiveModule} />

      <main className="h-[calc(100dvh-3.5rem)] mt-14 overflow-hidden">
        {activeModule === 'hero' && <Hero onNavigate={setActiveModule} />}

        {activeModule === 'starmap' && (
          <div className="h-full p-3 sm:p-6">
            <div className="h-full bg-[#0d1520]/50 rounded-xl border border-white/[0.08] overflow-hidden">
              <StarMap
                projects={projectsData.projects}
                onProjectSelect={handleProjectSelect}
                selectedProject={selectedProject}
              />
            </div>
          </div>
        )}

        {activeModule === 'ai' && (
          <div className="h-full p-3 sm:p-6">
            <AIChat
              projects={projectsData.projects}
              skills={skillsData.skills}
              qaData={qaData.qa}
              onProjectOpen={handleProjectOpen}
            />
          </div>
        )}
      </main>

      <div className="hidden sm:block">
        <StatusBar />
      </div>

      {showProjectDetail && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setShowProjectDetail(false)}
        />
      )}
    </div>
  );
};

export default App;