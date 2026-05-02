import React, { useState, useRef, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';

const AIChat = ({ projects, skills, qaData, onProjectOpen }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const fuseRef = useRef(null);

  if (!fuseRef.current) {
    fuseRef.current = new Fuse(qaData, {
      keys: ['keywords', 'question'],
      threshold: 0.4,
      includeScore: true,
    });
  }

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });
  }, []);

  const addMessage = useCallback((type, content) => {
    setMessages((prev) => [...prev, { type, content, id: Date.now() + Math.random() }]);
  }, []);

  useEffect(() => {
    addMessage('system', "BZ's Lab AI Assistant — 输入 /help 查看命令，或直接提问");
    addMessage('suggestions', [
      '/projects — 查看项目',
      '/skills — 技术栈',
      '你的研究方向是什么？',
      '你在哪里读书？',
    ]);
  }, []);

  useEffect(() => {
    scrollBottom();
  }, [messages, scrollBottom]);

  // --- Command handlers ---
  const commands = {
    help: () => {
      return [
        '/help — 显示帮助',
        '/projects — 列出所有项目',
        '/open <name> — 打开项目详情',
        '/skills — 显示技术栈',
        '/whoami — 个人信息',
        '/contact — 联系方式',
        '/clear — 清空对话',
      ].join('\n');
    },
    whoami: () => {
      return 'Bruce Zhao / 赵耀\n重庆邮电大学 2026 届本科毕业生\n即将前往中国科学技术大学攻读硕士（网络安全方向）\n本科方向：AI & Computer Vision';
    },
    projects: () => {
      const lines = projects.map((p, i) => {
        const tag = p.type === 'research' ? '[研究]' : '[应用]';
        return `${tag} ${p.name} — ${p.fullName}`;
      });
      lines.push('\n输入 /open <name> 查看详情，如 /open uavp');
      return lines.join('\n');
    },
    skills: () => {
      return skills.map((cat) => `[${cat.category}]\n  ${cat.items.join(' · ')}`).join('\n\n');
    },
    contact: () => {
      return '邮箱: bzy1621@outlook.com\nGitHub: github.com/bz2116';
    },
  };

  const handleCommand = (raw) => {
    const [cmd, ...args] = raw.slice(1).toLowerCase().split(' ');

    if (cmd === 'clear') {
      setMessages([]);
      setTimeout(() => addMessage('system', '对话已清空'), 50);
      return;
    }

    if (cmd === 'open' && args.length > 0) {
      const project = projects.find(
        (p) => p.id.toLowerCase() === args[0] || p.name.toLowerCase() === args[0]
      );
      if (project) {
        addMessage('assistant', `正在打开 ${project.name} ...`);
        onProjectOpen(project);
      } else {
        addMessage('assistant', `未找到项目: ${args[0]}\n输入 /projects 查看可用项目`);
      }
      return;
    }

    if (commands[cmd]) {
      addMessage('assistant', commands[cmd]());
    } else {
      addMessage('assistant', `未知命令: /${cmd}\n输入 /help 查看可用命令`);
    }
  };

  const handleChat = (query) => {
    const fuse = fuseRef.current;
    const results = fuse.search(query);
    let answer;

    if (results.length > 0 && results[0].score < 0.4) {
      answer = results[0].item.answer;
    } else {
      answer = '抱歉，我暂时无法回答这个问题。你可以试试输入 /help 查看可用命令。';
    }

    // Typewriter effect
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      index++;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.type === 'assistant-typing') {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: answer.slice(0, index) } : m
          );
        }
        return [...prev, { type: 'assistant-typing', content: answer.slice(0, index), id: Date.now() }];
      });
      scrollBottom();
      if (index >= answer.length) {
        clearInterval(timer);
        setMessages((prev) =>
          prev.map((m) => (m.type === 'assistant-typing' ? { ...m, type: 'assistant' } : m))
        );
        setIsTyping(false);
      }
    }, 20);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    addMessage('user', trimmed);
    setInput('');

    if (trimmed.startsWith('/')) {
      handleCommand(trimmed);
    } else {
      handleChat(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1520]/50 rounded-xl border border-white/[0.08] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-[#131f30]/80 border-b border-white/[0.08] shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#7b61ff] flex items-center justify-center">
          <svg className="w-4 h-4 text-[#060810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-['Orbitron'] text-sm text-[#e8f0f8]">BZ's Lab AI</div>
          <div className="text-xs text-[#6b7f94]">命令 · 问答 · 探索</div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#6b7f94]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>
          ONLINE
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">
        {messages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="text-center text-xs text-[#6b7f94] py-2">
                {msg.content}
              </div>
            );
          }

          if (msg.type === 'suggestions') {
            return (
              <div key={msg.id} className="flex flex-wrap gap-2 justify-center">
                {msg.content.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#131f30] text-[#6b7f94] border border-white/[0.08] hover:border-[#00d4ff]/30 hover:text-[#00d4ff] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            );
          }

          const isUser = msg.type === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-['JetBrains_Mono'] whitespace-pre-wrap break-words leading-relaxed ${
                  isUser
                    ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20'
                    : 'bg-[#131f30] text-[#e8f0f8] border border-white/[0.06]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {isTyping && !messages.some((m) => m.type === 'assistant-typing') && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-xl bg-[#131f30] border border-white/[0.06]">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b7f94] animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b7f94] animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b7f94] animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 py-3 border-t border-white/[0.08] bg-[#131f30]/60">
        <div className="flex items-end gap-2 bg-[#0d1520] rounded-xl border border-white/[0.08] focus-within:border-[#00d4ff]/30 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder="输入命令 (/) 或提问..."
            rows={1}
            className="flex-1 bg-transparent px-4 py-3 text-sm text-[#e8f0f8] font-['JetBrains_Mono'] placeholder-[#6b7f94] outline-none resize-none leading-relaxed"
            style={{ minHeight: '42px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="m-1.5 p-2 rounded-lg bg-[#00d4ff] text-[#060810] hover:bg-[#00d4ff]/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
