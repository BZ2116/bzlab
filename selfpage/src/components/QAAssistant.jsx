import React, { useState, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';

const QAAssistant = ({ qaData }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  const fuse = new Fuse(qaData, {
    keys: ['keywords', 'question'],
    threshold: 0.4,
    includeScore: true,
  });

  const addMessage = (type, content) => {
    setMessages((prev) => [...prev, { type, content, id: Date.now() }]);
  };

  useEffect(() => {
    addMessage('system', "你好！我是 BZ's Lab 的问答助手。可以问我关于 Bruce 的问题，比如：");
    addMessage('info', '• 你有什么爱好？');
    addMessage('info', '• 你的研究方向是什么？');
    addMessage('info', '• 你在哪里读书？');
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const typeWriter = (text, callback) => {
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        callback(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 30);
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    addMessage('user', input);
    const query = input;
    setInput('');

    const results = fuse.search(query);
    let answer;

    if (results.length > 0 && results[0].score < 0.4) {
      answer = results[0].item.answer;
    } else {
      answer = '抱歉，我暂时无法回答这个问题。你可以尝试换一种方式问我，或者输入 help 查看示例问题。';
    }

    let displayedText = '';
    typeWriter(answer, (text) => {
      displayedText = text;
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.type === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: text } : m));
        } else {
          return [...prev, { type: 'assistant', content: text, id: Date.now() }];
        }
      });
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    '你有什么爱好？',
    '你的研究方向是什么？',
    '你在哪里读书？',
    '你发表过哪些论文？',
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 ${
                msg.type === 'user'
                  ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30'
                  : msg.type === 'system'
                  ? 'bg-transparent text-[#6b7f94] text-xs'
                  : 'bg-[#131f30] text-[#e8f0f8] border border-white/[0.08]'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Questions */}
      <div className="px-4 pb-2 flex flex-wrap gap-2">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => {
              setInput(q);
              inputRef.current?.focus();
            }}
            className="text-xs px-3 py-1.5 rounded-full bg-[#131f30] text-[#6b7f94] border border-white/[0.08] hover:border-[#00d4ff]/30 hover:text-[#00d4ff] transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 p-4 border-t border-white/[0.08] bg-[#0d1520]">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入问题..."
          rows={1}
          className="flex-1 bg-[#131f30] rounded-lg px-4 py-3 text-[#e8f0f8] font-['JetBrains_Mono'] text-sm placeholder-[#6b7f94] outline-none border border-white/[0.08] focus:border-[#00d4ff]/30 resize-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="px-4 py-3 rounded-lg bg-[#00d4ff] text-[#060810] font-['Orbitron'] text-sm font-bold hover:bg-[#00d4ff]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default QAAssistant;