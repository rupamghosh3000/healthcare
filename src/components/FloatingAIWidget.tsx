import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

export const FloatingAIWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; isEmergency?: boolean }>>([
    {
      sender: 'ai',
      text: "Hello! I'm the CareConnect AI Assistant. Ask me anything about our non-emergency care requests, volunteer registration, or service coverage."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg = query.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await api.chatWithAI({ message: userMsg, modelTier: 'fast' });
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: response.answer, isEmergency: response.isEmergency }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "I'm having a brief issue reaching the server. CareConnect supports hospital accompaniment, appointment rides, and grocery help for seniors. Feel free to try again in a moment."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="pointer-events-auto w-[360px] sm:w-[400px] h-[520px] max-h-[80vh] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_24px_48px_-8px_rgba(10,15,29,0.18)] border border-white/80 ring-1 ring-black/5 flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#006a6a] to-[#006398] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00d2d3]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-[#00d2d3]">auto_awesome</span>
              </div>
              <div>
                <div className="font-headline-sm text-sm font-semibold tracking-tight">CareConnect Assistant</div>
                <div className="text-[11px] text-[#00d2d3] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d2d3] animate-pulse"></span>
                  Active • Non-clinical guide
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close assistant"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Quick chips */}
          <div className="px-4 py-2 bg-[#f2f3ff] border-b border-[#0A0F1D]/05 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => handleSend("What support can I request?")}
              className="px-2.5 py-1 rounded-full bg-white text-[#0A0F1D] shadow-xs border border-gray-200 shrink-0 hover:bg-[#0A0F1D] hover:text-white transition-all"
            >
              Support types?
            </button>
            <button
              onClick={() => handleSend("How can I become a volunteer?")}
              className="px-2.5 py-1 rounded-full bg-white text-[#0A0F1D] shadow-xs border border-gray-200 shrink-0 hover:bg-[#0A0F1D] hover:text-white transition-all"
            >
              Volunteer steps?
            </button>
            <button
              onClick={() => handleSend("Is CareConnect an emergency service?")}
              className="px-2.5 py-1 rounded-full bg-white text-[#0A0F1D] shadow-xs border border-gray-200 shrink-0 hover:bg-[#0A0F1D] hover:text-white transition-all"
            >
              Emergency guidance?
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#0A0F1D] text-white rounded-br-xs'
                      : m.isEmergency
                      ? 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30 font-medium'
                      : 'bg-[#f2f3ff] text-[#161b2a] rounded-bl-xs border border-[#dee2f6]'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-0.5 px-1">
                  {m.sender === 'user' ? 'You' : 'CareConnect AI'}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#f2f3ff] text-gray-500 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#006a6a] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#006a6a] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#006a6a] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs ml-1 text-[#006a6a]">Synthesizing response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about requests, volunteers, FAQs..."
              className="flex-1 h-10 px-3.5 rounded-full bg-[#F6F8FA] text-sm text-[#0A0F1D] focus:outline-none focus:ring-2 focus:ring-[#00d2d3] border border-gray-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-[#0A0F1D] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#006398] transition-colors shrink-0 shadow-sm"
              aria-label="Send message"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto h-14 px-5 rounded-full bg-[#0A0F1D] text-white flex items-center gap-3 shadow-[0_12px_28px_-4px_rgba(10,15,29,0.35)] hover:bg-[#006398] hover:shadow-[0_16px_32px_-4px_rgba(0,106,106,0.4)] transition-all group"
        aria-label="Toggle AI Assistant"
      >
        <div className="w-7 h-7 rounded-full bg-[#00d2d3]/20 flex items-center justify-center text-[#00d2d3] group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-[18px]">
            {isOpen ? 'close' : 'auto_awesome'}
          </span>
        </div>
        <span className="font-label-lg text-sm font-semibold tracking-wide">
          {isOpen ? 'Close Assistant' : 'Ask CareConnect AI'}
        </span>
      </button>
    </div>
  );
};
