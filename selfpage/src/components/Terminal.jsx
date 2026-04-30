import React, { useState, useRef, useEffect } from 'react';

const Terminal = ({ projects, skills, onProjectOpen }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const addOutput = (type, content) => {
    setHistory((prev) => [...prev, { type, content, id: Date.now() }]);
  };

  useEffect(() => {
    addOutput('system', "BZ's Lab Terminal v1.0.0");
    addOutput('system', '输入 help 查看可用命令');
    addOutput('system', '');
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const commands = {
    help: () => {
      addOutput('info', '可用命令:');
      addOutput('info', '  whoami      - 显示个人信息');
      addOutput('info', '  projects    - 列出所有项目');
      addOutput('info', '  open <name> - 打开项目详情');
      addOutput('info', '  skills      - 显示技术栈');
      addOutput('info', '  contact     - 显示联系方式');
      addOutput('info', '  resume      - 获取简历下载链接');
      addOutput('info', '  clear       - 清屏');
    },
    whoami: () => {
      addOutput('info', '');
      addOutput('result', 'Bruce Zhao / 赵耀');
      addOutput('result', '即将读研的网安大四学生 @ 电子科技大学');
      addOutput('result', '研究方向：低光视觉感知、多模态分析、智能系统');
      addOutput('result', '邮箱: bzy1621@outlook.com');
      addOutput('info', '');
    },
    projects: () => {
      addOutput('info', '');
      addOutput('result', '┌─────────────────────────────────────────────┐');
      addOutput('result', '│           RESEARCH PROJECTS                  │');
      addOutput('result', '├─────────────────────────────────────────────┤');
      projects.filter(p => p.type === 'research').forEach((p, i) => {
        addOutput('result', `│ [${i + 1}] ${p.name.padEnd(20)} - ${p.fullName}     │`);
      });
      addOutput('result', '├─────────────────────────────────────────────┤');
      addOutput('result', '│           APPLICATIONS                      │');
      addOutput('result', '├─────────────────────────────────────────────┤');
      projects.filter(p => p.type === 'application').forEach((p, i) => {
        addOutput('result', `│ [${i + 1}] ${p.name.padEnd(20)} - ${p.fullName}     │`);
      });
      addOutput('result', '└─────────────────────────────────────────────┘');
      addOutput('info', '');
      addOutput('info', '输入 open <name> 查看项目详情，如: open uavp');
    },
    skills: () => {
      addOutput('info', '');
      skills.forEach((cat) => {
        addOutput('result', `[${cat.category}]`);
        addOutput('result', '  ' + cat.items.join(' | '));
        addOutput('info', '');
      });
    },
    contact: () => {
      addOutput('info', '');
      addOutput('result', '📧 邮箱: bzy1621@outlook.com');
      addOutput('result', '🐙 GitHub: github.com/bz2116');
      addOutput('result', '📱 微信: BZ2116___');
      addOutput('info', '');
    },
    resume: () => {
      addOutput('info', '');
      addOutput('result', '📄 简历下载链接生成中...');
      addOutput('result', '👉 github.com/bz2116/resume');
      addOutput('info', '');
    },
    clear: () => {
      setHistory([]);
    },
  };

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    addOutput('input', `$ ${trimmed}`);
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const [base, ...args] = trimmed.toLowerCase().split(' ');

    if (base === 'open' && args.length > 0) {
      const projectName = args[0];
      const project = projects.find(
        (p) => p.id.toLowerCase() === projectName || p.name.toLowerCase() === projectName
      );
      if (project) {
        addOutput('info', `正在打开项目: ${project.name}...`);
        onProjectOpen(project);
      } else {
        addOutput('error', `项目未找到: ${projectName}`);
        addOutput('info', '输入 projects 查看可用项目');
      }
    } else if (commands[base]) {
      commands[base]();
    } else {
      addOutput('error', `command not found: ${base}`);
      addOutput('info', '输入 help 查看可用命令');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'input': return '#00d4ff';
      case 'error': return '#ff4757';
      case 'result': return '#00ff88';
      case 'info': return '#6b7f94';
      default: return '#6b7f94';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1520] rounded-lg border border-white/[0.08] overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#131f30] border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
        </div>
        <span className="text-xs font-['JetBrains_Mono'] text-[#6b7f94]">zhaolab@terminal</span>
        <button
          onClick={() => setHistory([])}
          className="text-xs text-[#6b7f94] hover:text-[#e8f0f8] transition-colors"
        >
          CLEAR
        </button>
      </div>

      {/* Terminal Output */}
      <div ref={outputRef} className="flex-1 p-4 overflow-y-auto font-['JetBrains_Mono'] text-sm">
        {history.map((item) => (
          <div key={item.id} className="mb-1 whitespace-pre-wrap" style={{ color: getTypeColor(item.type) }}>
            {item.content}
          </div>
        ))}
      </div>

      {/* Terminal Input */}
      <div className="flex items-center gap-2 p-4 border-t border-white/[0.08] bg-[#131f30]">
        <span className="text-[#00d4ff] font-['JetBrains_Mono']">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入命令..."
          className="flex-1 bg-transparent outline-none text-[#e8f0f8] font-['JetBrains_Mono'] placeholder-[#6b7f94]"
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;