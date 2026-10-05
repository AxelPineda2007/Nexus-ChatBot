import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  BookOpen, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Layers, 
  FileCheck, 
  Zap 
} from 'lucide-react';
import { ChatMessage, RAGInspectionDetails, Citation } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onInspectRAG: (details: RAGInspectionDetails) => void;
  onOpenVault: (docId: string, articleNumber?: string) => void;
  onOpenCertificate: (message: ChatMessage, question: string) => void;
  onOpenVectorMap: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onInspectRAG,
  onOpenVault,
  onOpenCertificate,
  onOpenVectorMap
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('todos');
  const [briefMode, setBriefMode] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Web Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'es-ES';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleVoiceDictation = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta reconocimiento de voz nativo. Por favor escribe tu consulta.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const q = inputText;
    setInputText('');
    onSendMessage(q);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Play audio for a message using Gemini TTS base64 or Web Speech
  const handlePlayTTS = async (msg: ChatMessage) => {
    if (playingAudioId === msg.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis?.cancel();
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(msg.id);

    // If msg already has base64 audio from server
    if (msg.audioBase64) {
      const audioUrl = `data:audio/wav;base64,${msg.audioBase64}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setPlayingAudioId(null);
      audio.onerror = () => setPlayingAudioId(null);
      audio.play();
      return;
    }

    // Try fetching from server /api/tts
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.text }),
      });
      const data = await res.json();

      if (data.available && data.audioBase64) {
        msg.audioBase64 = data.audioBase64;
        const audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.onended = () => setPlayingAudioId(null);
        audio.onerror = () => setPlayingAudioId(null);
        audio.play();
        return;
      }
    } catch (err) {
      console.warn('TTS server call failed, falling back to browser synthesis:', err);
    }

    // Browser SpeechSynthesis fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = msg.text
        .replace(/\[DOC-[^\]]+\]/g, '')
        .replace(/[*_#`•]/g, ' ')
        .slice(0, 320);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-ES';
      utterance.rate = 1.08;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingAudioId(null);
    }
  };

  // Grouped prompt chips for clean quick access
  const allPrompts = [
    { label: '¿Qué pasa al acumular 3 llamados de atención verbales?', category: 'demeritos', icon: '📋' },
    { label: '¿Qué dice sobre usar suéter después de 8:30 a.m. y bolsón transparente?', category: 'faltas', icon: '🎒' },
    { label: '¿Qué exige el uniforme diario (calcetas, cincho, monograma, zapatos)?', category: 'uniforme', icon: '👔' },
    { label: '¿Qué módulos lleva 2.º año de Desarrollo de Software?', category: 'software', icon: '💻' },
    { label: '¿Cuándo se reporta una falta a CONAPINA o PNC?', category: 'seguridad', icon: '🚨' },
    { label: '¿Cómo justifican las inasistencias los referentes de familia?', category: 'padres', icon: '👨‍👩‍👧' },
    { label: '¿Cuáles son las sanciones a docentes por la Ley de Carrera Docente?', category: 'docentes', icon: '⚖️' },
    { label: '¿Quién ganó la última Champions League?', category: 'antihallucination', icon: '🛡️' },
  ];

  const filteredPrompts = activeCategoryFilter === 'todos' 
    ? allPrompts 
    : allPrompts.filter(p => p.category === activeCategoryFilter);

  return (
    <div className="flex flex-col h-[750px] max-h-[85vh] bg-[#111312] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
      
      {/* Top Refined Chat Subheader */}
      <div className="px-5 py-3.5 bg-[#141716] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-md shadow-emerald-950 text-white font-bold">
            <Cpu className="w-4 h-4 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white tracking-tight">
                NEXUS RAG Core
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                INDEL Cantón Lourdes
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Respuestas breves y precisas fundamentadas en el reglamento oficial
            </p>
          </div>
        </div>

        {/* Brevity Toggle & Vector Link */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setBriefMode(!briefMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              briefMode
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-950'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Activar/desactivar respuestas breves y específicas"
          >
            <Zap className={`w-3.5 h-3.5 ${briefMode ? 'text-emerald-400 fill-emerald-400' : 'text-zinc-500'}`} />
            <span>Modo Breve & Específico</span>
          </button>

          <button
            onClick={onOpenVectorMap}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
            title="Ver proyección en el Espacio Vectorial 2D"
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Vectores 2D</span>
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#111312] to-[#0c0e0d]">
        
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          const precedingUserMsg = !isUser && index > 0 ? messages[index - 1]?.text : '';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="relative shrink-0 w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/50 mt-1">
                  <Cpu className="w-4 h-4 text-emerald-100" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 transition-all relative ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-950/40 rounded-tr-sm'
                    : msg.notInDocsWarning
                    ? 'bg-zinc-900/95 border border-amber-800/60 text-zinc-200 shadow-xl rounded-tl-sm'
                    : 'bg-[#141716] border border-zinc-800/90 text-zinc-100 shadow-xl rounded-tl-sm backdrop-blur-md'
                }`}
              >
                {/* Specific answer badge header for NEXUS */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-zinc-800 text-[11px]">
                    <div className="flex items-center space-x-1.5 font-semibold text-emerald-400">
                      <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                      <span>Respuesta Específica INDEL</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                )}

                {/* Warning header if out of documents */}
                {msg.notInDocsWarning && (
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold mb-2 pb-2 border-b border-amber-800/40">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Sin registro en los documentos oficiales de INDEL</span>
                  </div>
                )}

                {/* Message Text Content */}
                <div className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-sans text-zinc-100">
                  {msg.text}
                </div>

                {/* Official Citations Pills */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3.5 pt-2.5 border-t border-zinc-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      <span className="flex items-center space-x-1 text-zinc-400">
                        <BookOpen className="w-3 h-3 text-emerald-400" />
                        <span>Citas oficiales ({msg.citations.length}):</span>
                      </span>
                      <span className="text-[10px] text-emerald-400/80 font-normal">
                        Ver artículo en Bóveda →
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => onOpenVault(cite.docId, cite.articleNumber)}
                          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-600/80 text-[11px] text-emerald-300 transition-all group"
                          title={cite.docTitle}
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span className="font-mono font-bold">[{cite.docCode}]</span>
                          <span className="text-zinc-300 group-hover:text-white truncate max-w-[200px]">
                            {cite.articleNumber || cite.sectionTitle}
                          </span>
                          <ExternalLink className="w-2.5 h-2.5 text-zinc-500 group-hover:text-emerald-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Action Bar for NEXUS Responses */}
                {!isUser && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      {/* Audio Button */}
                      <button
                        onClick={() => handlePlayTTS(msg)}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs transition-all ${
                          playingAudioId === msg.id
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
                        }`}
                        title="Escuchar respuesta con voz de IA"
                      >
                        {playingAudioId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-emerald-200" />
                            <span>Pausar</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Escuchar</span>
                          </>
                        )}
                      </button>

                      {/* Copy Text Button */}
                      <button
                        onClick={() => handleCopyText(msg.text, msg.id)}
                        className="p-1 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center space-x-1"
                        title="Copiar respuesta al portapapeles"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300 text-[10px]">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">Copiar</span>
                          </>
                        )}
                      </button>

                      {/* RAG Inspector Button */}
                      {msg.ragDetails && (
                        <button
                          onClick={() => onInspectRAG(msg.ragDetails!)}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs transition-colors"
                          title="Auditar tokens, similitud y prompt inyectado"
                        >
                          <Cpu className="w-3 h-3 text-teal-400" />
                          <span>Auditar RAG</span>
                        </button>
                      )}
                    </div>

                    {/* Official Certificate Button */}
                    <button
                      onClick={() => onOpenCertificate(msg, precedingUserMsg)}
                      className="flex items-center space-x-1 px-2 py-1 rounded-lg text-zinc-400 hover:text-emerald-300 hover:bg-zinc-800 transition-colors text-xs"
                      title="Emitir constancia formal con QR y folio de verificación"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ficha Oficial</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3 justify-start animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-950 mt-1 animate-pulse">
              <Cpu className="w-4 h-4 text-emerald-200" />
            </div>
            <div className="bg-zinc-900 border border-emerald-800/60 rounded-2xl p-3.5 text-xs text-emerald-300 shadow-xl flex items-center space-x-3">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <div>
                <div className="font-semibold text-zinc-200">
                  Consultando documentos oficiales del INDEL...
                </div>
                <div className="text-[11px] text-zinc-400">
                  Extrayendo respuesta concisa y citando artículos reglamentarios
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Category Pills & Suggested Prompts Bar */}
      <div className="px-4 py-2 bg-[#121514] border-t border-zinc-800 space-y-2">
        
        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-1">
            Filtro:
          </span>
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'demeritos', label: '📋 Deméritos & Actas' },
            { id: 'faltas', label: '🎒 Suéter & Bolsón' },
            { id: 'uniforme', label: '👔 Uniforme Oficial' },
            { id: 'software', label: '💻 Malla Software' },
            { id: 'padres', label: '👨‍👩‍👧 Padres Crecer Juntos' },
            { id: 'docentes', label: '⚖️ Ley Docente' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
                activeCategoryFilter === cat.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-950'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Prompt Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {filteredPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(p.label)}
              disabled={isLoading}
              className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-600/60 text-zinc-300 hover:text-white transition-all flex items-center space-x-1.5"
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar with Voice Dictation */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-[#111312] border-t border-zinc-800 flex items-center space-x-2.5">
        
        {/* Voice Dictation Button */}
        <button
          type="button"
          onClick={handleToggleVoiceDictation}
          className={`p-2.5 rounded-2xl border transition-all flex items-center justify-center shrink-0 ${
            isListening
              ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-lg shadow-rose-600/30'
              : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-emerald-400'
          }`}
          title={isListening ? 'Detener dictado por voz' : 'Dictar pregunta por voz'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={isListening ? 'Escuchando tu voz...' : 'Escribe o dicta tu pregunta sobre el reglamento, deméritos, uniforme o software...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-zinc-900/90 border border-zinc-800 focus:border-emerald-500 rounded-2xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
          />
          {isListening && (
            <div className="absolute right-3 top-3 flex items-center space-x-1">
              <span className="w-1.5 h-3 bg-rose-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-2 bg-rose-500 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-emerald-950/40 shrink-0 flex items-center space-x-1.5 text-xs"
          title="Enviar consulta a NEXUS"
        >
          <span className="hidden sm:inline">Preguntar</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
