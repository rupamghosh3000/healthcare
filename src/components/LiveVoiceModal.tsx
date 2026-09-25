import React, { useState, useEffect, useRef } from 'react';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [transcriptPreview, setTranscriptPreview] = useState<string>('Press connect to start a real-time voice conversation with Gemini 3.8 Live.');

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const startVoiceSession = async () => {
    try {
      setStatus('connecting');
      setErrorMessage(null);
      setTranscriptPreview('Connecting to Gemini 3.8 Live API voice gateway...');

      // 1. Establish WebSocket to /live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // 2. Setup Audio contexts
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      const outputCtx = new AudioCtx({ sampleRate: 24000 });
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;
      nextPlayTimeRef.current = outputCtx.currentTime;

      // 3. Setup Mic capture
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      streamRef.current = stream;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMuted || ws.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16 PCM
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Convert to base64
        let binary = '';
        const bytes = new Uint8Array(pcm16.buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Audio = btoa(binary);

        ws.send(JSON.stringify({ audio: base64Audio }));
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);

      // 4. WebSocket handlers
      ws.onopen = () => {
        setStatus('listening');
        setTranscriptPreview("I'm listening. Speak naturally to ask about CareConnect healthcare accompaniment, transport, or volunteers.");
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setErrorMessage(msg.error);
            setStatus('error');
            return;
          }

          if (msg.interrupted) {
            // Stop scheduled playing audio
            activeSourcesRef.current.forEach((src) => {
              try { src.stop(); } catch (e) {}
            });
            activeSourcesRef.current = [];
            if (outputAudioCtxRef.current) {
              nextPlayTimeRef.current = outputAudioCtxRef.current.currentTime;
            }
            setStatus('listening');
            return;
          }

          if (msg.audio) {
            setStatus('speaking');
            playAudioChunk(msg.audio);
          }
        } catch (e) {
          console.error('Error handling WebSocket voice data:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket Live voice error:', err);
        setErrorMessage('Failed to connect to the Live API voice stream.');
        setStatus('error');
      };

      ws.onclose = () => {
        if (status !== 'error') {
          setStatus('idle');
          setTranscriptPreview('Voice conversation ended.');
        }
      };
    } catch (err: any) {
      console.error('Mic access or connection error:', err);
      setErrorMessage(err.message || 'Microphone access denied or connection failed.');
      setStatus('error');
    }
  };

  const playAudioChunk = (base64Audio: string) => {
    const outputCtx = outputAudioCtxRef.current;
    if (!outputCtx) return;

    try {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      const audioBuffer = outputCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = outputCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputCtx.destination);

      const now = outputCtx.currentTime;
      const startTime = Math.max(now, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + audioBuffer.duration;

      activeSourcesRef.current.push(source);
      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
        if (activeSourcesRef.current.length === 0) {
          setStatus('listening');
        }
      };
    } catch (e) {
      console.error('Error decoding audio chunk:', e);
    }
  };

  const stopVoiceSession = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    activeSourcesRef.current.forEach((src) => {
      try { src.stop(); } catch (e) {}
    });
    activeSourcesRef.current = [];
    setStatus('idle');
  };

  useEffect(() => {
    if (!isOpen) {
      stopVoiceSession();
    }
    return () => {
      stopVoiceSession();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0A0F1D] text-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/10 flex flex-col items-center text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Ambient background glows */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#00d2d3]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#5bb8fe]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00d2d3] animate-pulse"></span>
            <span className="font-label-caps text-xs uppercase font-bold tracking-wider text-[#00d2d3]">
              Gemini 3.8 Live API
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close voice modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Central Audio Visualizer Orb */}
        <div className="my-10 relative flex items-center justify-center">
          <div
            className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative ${
              status === 'speaking'
                ? 'bg-gradient-to-tr from-[#00d2d3] to-[#5bb8fe] ring-8 ring-[#00d2d3]/30 scale-110 animate-pulse'
                : status === 'listening'
                ? 'bg-gradient-to-tr from-[#006a6a] to-[#00d2d3] ring-4 ring-[#00d2d3]/20 scale-100'
                : status === 'connecting'
                ? 'bg-gradient-to-tr from-gray-700 to-gray-600 animate-spin'
                : status === 'error'
                ? 'bg-red-900/60 ring-4 ring-red-500/30'
                : 'bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-4xl text-white">
              {status === 'speaking'
                ? 'volume_up'
                : status === 'listening'
                ? 'mic'
                : status === 'connecting'
                ? 'sync'
                : status === 'error'
                ? 'error_outline'
                : 'mic_none'}
            </span>
          </div>

          {/* Sound wave rings when speaking or listening */}
          {(status === 'speaking' || status === 'listening') && (
            <div className="absolute inset-0 rounded-full border border-[#00d2d3]/40 animate-ping pointer-events-none"></div>
          )}
        </div>

        {/* Status text */}
        <div className="font-headline-sm text-lg font-bold tracking-tight z-10">
          {status === 'speaking' && 'Gemini Voice Speaking...'}
          {status === 'listening' && 'Listening to your voice...'}
          {status === 'connecting' && 'Connecting to Live API...'}
          {status === 'error' && 'Voice Session Error'}
          {status === 'idle' && 'Real-Time Voice Assistant'}
        </div>

        {/* Live caption/transcript preview */}
        <p className="text-xs text-gray-300 mt-2 min-h-[44px] px-2 leading-relaxed z-10">
          {errorMessage || transcriptPreview}
        </p>

        {/* Safety pill */}
        <div className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 z-10">
          Non-clinical support only • Dial 911 for emergencies
        </div>

        {/* Controls */}
        <div className="w-full flex items-center justify-center gap-4 mt-8 pt-4 border-t border-white/10 z-10">
          {status === 'idle' ? (
            <button
              onClick={startVoiceSession}
              className="px-8 py-3.5 rounded-full bg-[#00d2d3] text-[#002020] font-label-lg text-sm font-bold shadow-[0_0_24px_-4px_rgba(0,210,211,0.5)] hover:bg-[#56f9f9] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
              <span>Start Live Conversation</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-full border transition-all ${
                  isMuted
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {isMuted ? 'mic_off' : 'mic'}
                </span>
              </button>

              <button
                onClick={stopVoiceSession}
                className="px-6 py-3.5 rounded-full bg-red-600 text-white font-label-lg text-sm font-semibold hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">call_end</span>
                <span>End Conversation</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
