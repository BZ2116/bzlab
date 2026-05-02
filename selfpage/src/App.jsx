import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StarLab from './components/StarMap';
import AIChat from './components/AIChat';
import FreshPage from './components/FreshPage';
import StatusBar from './components/StatusBar';
import projectsData from './data/projects.json';
import skillsData from './data/skills.json';
import qaData from './data/qa.json';

const App = () => {
  const [activeModule, setActiveModule] = useState('hero');
  const [activeProjectId, setActiveProjectId] = useState(projectsData.projects[0]?.id);

  const handleProjectOpen = useCallback((project) => {
    setActiveProjectId(project.id);
    setActiveModule('starmap');
  }, []);

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
          <div className="h-full p-2 sm:p-4 lg:p-5">
            <div className="h-full rounded-xl border border-white/[0.06] overflow-hidden">
              <StarLab
                projects={projectsData.projects}
                activeProjectId={activeProjectId}
                onActiveChange={setActiveProjectId}
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
    </div>
  );
};

export default App;
