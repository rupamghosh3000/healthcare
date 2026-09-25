import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { MapsFacilityLocator } from '../components/MapsFacilityLocator';
import { LiveVoiceModal } from '../components/LiveVoiceModal';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
  modelUsed?: string;
  role?: string;
}

export const AIAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'maps'>('chat');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  // Model & Role state
  const [modelTier, setModelTier] = useState<'fast' | 'general' | 'complex'>('fast');
  const [selectedRole, setSelectedRole] = useState<'navigator' | 'volunteer' | 'triage' | 'general'>('navigator');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Welcome to CareConnect AI Assistant. I am your Care Navigation Specialist. I can help organize companion logistics, appointment accompaniment, or check volunteer availability across municipal sectors.\n\nNotice: CareConnect AI provides general platform information and does not diagnose conditions or provide medical treatment.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.1-flash-lite',
      role: 'Care Navigator'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, activeTab]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Build conversation history: only valid alternating turns starting from first user message
      const historyTurns: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      let seenUser = false;
      for (const m of messages) {
        if (m.sender === 'user') seenUser = true;
        if (seenUser) {
          historyTurns.push({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          });
        }
      }

      const response = await api.chatWithAI({
        message: userMessage.text,
        history: historyTurns,
        role: selectedRole,
        modelTier
      });

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: response.isEmergency,
        modelUsed: response.modelUsed,
        role:
          selectedRole === 'navigator'
            ? 'Care Navigator'
            : selectedRole === 'volunteer'
            ? 'Volunteer Coordinator'
            : selectedRole === 'triage'
            ? 'Triage Coordinator'
            : 'General Guide'
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I am having temporary difficulty connecting to the intake model. Please review our FAQ section or submit your request directly via the form.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'Offline Fallback'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const starterPrompts = [
    {
      icon: 'support',
      label: 'Companion Request',
      query: 'I need someone to sit with an elderly family member at City Hospital tomorrow morning.'
    },
    {
      icon: 'volunteer_activism',
      label: 'Volunteer Vetting',
      query: 'What identity checks and background verification are required to become a volunteer?'
    },
    {
      icon: 'directions_car',
      label: 'Appointment Ride',
      query: 'Can a volunteer drive me to an eye clinic dilation appointment and back?'
    },
    {
      icon: 'pin_drop',
      label: 'Grounded Locations',
      query: 'Find nearby medical centers with wheelchair accessible companion bays.'
    }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="relative w-full overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-20 right-1/3 w-[550px] h-[550px] bg-[#00d2d3]/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-[1100px] mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-20">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eaedff] text-[#006a6a] font-label-caps text-xs uppercase font-bold tracking-wider">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              Multi-Turn Gemini Assistant &amp; Grounding
            </div>
            <h1 className="font-display-hero text-headline-lg md:text-display-hero text-[#0A0F1D] tracking-tight">
              CareConnect AI Assistant
            </h1>
            <p className="font-body-lead text-base md:text-lg text-[#64748B]">
              Multi-turn conversational navigation powered by Gemini, live Google Maps grounding, and real-time voice sessions.
            </p>
          </div>

          {/* Top Mode Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 p-1.5 bg-[#eaedff] rounded-2xl border border-white">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`px-5 py-2.5 rounded-xl font-label-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'chat'
                    ? 'bg-white text-[#0A0F1D] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0A0F1D]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Multi-Turn Chat</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('maps')}
                className={`px-5 py-2.5 rounded-xl font-label-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'maps'
                    ? 'bg-white text-[#0A0F1D] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0A0F1D]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] text-[#006398]">pin_drop</span>
                <span>Google Maps Facilities</span>
              </button>
            </div>

            {/* Launch Live Voice Conversation button */}
            <button
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#006a6a] to-[#006398] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-[#56f9f9] animate-pulse">mic</span>
              <span>Launch Live Voice (gemini-3.8-live)</span>
            </button>
          </div>

          {/* MAPS GROUNDING TAB */}
          {activeTab === 'maps' && (
            <MapsFacilityLocator />
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <>
              {/* Role & Model Controls Bar */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 mb-4 border border-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Specific Role System Instruction */}
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-xs text-[#64748B] uppercase font-bold tracking-wider">
                    Role:
                  </span>
                  <div className="flex flex-wrap gap-1 text-xs">
                    {[
                      { id: 'navigator', label: 'Care Navigator' },
                      { id: 'volunteer', label: 'Volunteer Coordinator' },
                      { id: 'triage', label: 'Civic Triage' },
                      { id: 'general', label: 'General Guide' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id as any)}
                        className={`px-3 py-1 rounded-full font-medium transition-all ${
                          selectedRole === r.id
                            ? 'bg-[#0A0F1D] text-white shadow-xs'
                            : 'bg-[#f2f3ff] text-gray-700 hover:bg-[#eaedff]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Tier Selector (Fast, General, Complex) */}
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-xs text-[#64748B] uppercase font-bold tracking-wider">
                    Model:
                  </span>
                  <div className="flex gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setModelTier('fast')}
                      className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                        modelTier === 'fast'
                          ? 'bg-[#00d2d3] text-[#002020] font-bold shadow-xs'
                          : 'bg-[#f2f3ff] text-gray-700 hover:bg-[#eaedff]'
                      }`}
                      title="gemini-3.1-flash-lite: Fast execution for straightforward tasks"
                    >
                      Fast (Flash Lite)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelTier('general')}
                      className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                        modelTier === 'general'
                          ? 'bg-[#006a6a] text-white font-bold shadow-xs'
                          : 'bg-[#f2f3ff] text-gray-700 hover:bg-[#eaedff]'
                      }`}
                      title="gemini-3.5-flash: Balanced reasoning and general multi-turn support"
                    >
                      General (3.5 Flash)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModelTier('complex')}
                      className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                        modelTier === 'complex'
                          ? 'bg-[#0A0F1D] text-white font-bold shadow-xs'
                          : 'bg-[#f2f3ff] text-gray-700 hover:bg-[#eaedff]'
                      }`}
                      title="gemini-3.8-flash / 3.1 Pro: In-depth civic triage and multi-step reasoning"
                    >
                      Complex (3.8 Flash)
                    </button>
                  </div>
                </div>

              </div>

              {/* Quick Starter Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {starterPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(p.query)}
                    className="flex items-center gap-2 p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 hover:border-[#00d2d3] hover:shadow-xs transition-all text-left text-xs font-medium text-[#0A0F1D] group"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#eaedff] group-hover:bg-[#00d2d3]/20 flex items-center justify-center shrink-0 text-[#006a6a]">
                      <span className="material-symbols-outlined text-[16px]">{p.icon}</span>
                    </div>
                    <span className="truncate">{p.label}</span>
                  </button>
                ))}
              </div>

              {/* Chat Thread Container */}
              <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl border border-white flex flex-col h-[560px] overflow-hidden">
                
                {/* Chat Top Bar */}
                <div className="px-6 py-4 bg-[#f2f3ff]/80 border-b border-gray-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#006a6a] text-white flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[20px] text-[#56f9f9]">smart_toy</span>
                    </div>
                    <div>
                      <div className="font-headline-sm text-sm font-semibold text-[#0A0F1D]">
                        CareConnect Assistant ({selectedRole})
                      </div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                        Model: {modelTier === 'fast' ? 'gemini-3.1-flash-lite' : modelTier === 'general' ? 'gemini-3.5-flash' : 'gemini-3.8-flash'} • Multi-Turn
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setMessages([
                        {
                          id: 'm1',
                          sender: 'ai',
                          text: "Conversation refreshed. How may I help you with CareConnect today?\n\nNotice: CareConnect AI provides general platform information and does not diagnose conditions or provide medical treatment.",
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          modelUsed: 'gemini-3.5-flash',
                          role: 'Care Navigator'
                        }
                      ])
                    }
                    className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#0A0F1D] hover:bg-gray-200/50 rounded-full transition-all flex items-center gap-1 font-medium"
                  >
                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                    Clear Chat
                  </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-3xl p-4 text-sm leading-relaxed shadow-xs relative group ${
                          m.sender === 'user'
                            ? 'bg-[#0A0F1D] text-white rounded-br-xs'
                            : m.isEmergency
                            ? 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30 font-medium'
                            : 'bg-[#f2f3ff]/90 text-[#161b2a] rounded-bl-xs border border-[#dee2f6]'
                        }`}
                      >
                        <p className="whitespace-pre-line">{m.text}</p>

                        {/* Copy button */}
                        <button
                          type="button"
                          onClick={() => copyMessage(m.id, m.text)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-black/10 hover:bg-black/20 text-xs"
                          title="Copy text"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedId === m.id ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1 px-2">
                        <span>{m.sender === 'user' ? 'You' : m.role || 'CareConnect AI'}</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                        {m.modelUsed && (
                          <>
                            <span>•</span>
                            <span className="text-[#006a6a] font-semibold">{m.modelUsed}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#f2f3ff] text-[#006a6a] w-fit border border-[#dee2f6]">
                      <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                      <span className="text-xs font-semibold">Gemini is formulating response...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="p-4 bg-white border-t border-gray-100 flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about hospital accompaniment, volunteer qualifications, request processing..."
                    className="flex-1 h-12 px-5 rounded-full bg-[#F6F8FA] text-sm text-[#0A0F1D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d2d3] border border-gray-200"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="h-12 px-6 rounded-full bg-[#0A0F1D] text-white font-label-lg text-sm flex items-center gap-2 hover:bg-[#006398] disabled:opacity-40 transition-all shrink-0 font-semibold shadow-sm"
                  >
                    <span>Send</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </form>

              </div>
            </>
          )}

        </div>
      </div>

      {/* Live Voice Modal */}
      <LiveVoiceModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
    </div>
  );
};
