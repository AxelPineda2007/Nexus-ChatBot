import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Search, 
  Layers, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  ArrowRight,
  Terminal
} from 'lucide-react';
import { RAGInspectionDetails } from '../types';

interface RAGInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: RAGInspectionDetails | null;
  onSelectDoc?: (docId: string, articleNumber?: string) => void;
}

export const RAGInspectorModal: React.FC<RAGInspectorModalProps> = ({
  isOpen,
  onClose,
  details,
  onSelectDoc
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'prompt' | 'metrics'>('pipeline');

  if (!isOpen || !details) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-700/50 text-emerald-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">Inspector de Arquitectura RAG</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Retrieval-Augmented Generation
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Auditoría en tiempo real del pipeline de recuperación, ensamble de contexto y control de alucinaciones
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-nav / Tabs */}
        <div className="flex items-center space-x-2 px-6 py-2.5 bg-zinc-950/50 border-b border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'pipeline'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            1. Pipeline de Búsqueda & Chunks
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'prompt'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            2. Ensamble de Prompt & Guardrails
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'metrics'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            3. Métricas de Fidelidad
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Intención Detectada</span>
              <span className="text-xs font-semibold text-emerald-300 mt-1 block truncate">
                {details.detectedIntent}
              </span>
            </div>

            <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Chunks Auditados</span>
              <span className="text-xs font-semibold text-zinc-200 mt-1 block">
                {details.retrievedChunks.length} recuperados de {details.totalChunksSearched}
              </span>
            </div>

            <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Fidelidad Documental</span>
              <span className="text-xs font-semibold text-emerald-400 mt-1 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 inline" />
                <span>{details.groundingConfidenceScore}% Verificado</span>
              </span>
            </div>

            <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Riesgo de Alucinación</span>
              <span className={`text-xs font-semibold mt-1 flex items-center space-x-1 ${
                details.hallucinationRisk === 'Bajo' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {details.hallucinationRisk === 'Bajo' ? <CheckCircle2 className="w-3.5 h-3.5 inline" /> : <AlertTriangle className="w-3.5 h-3.5 inline" />}
                <span>{details.hallucinationRisk}</span>
              </span>
            </div>
          </div>

          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              {/* Step 1: Query Tokens */}
              <div className="bg-zinc-950/70 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Search className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                    Fase 1: Tokenización y Extracción de Entidades Clave
                  </h4>
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  Se eliminaron palabras vacías (stopwords) y se normalizaron los términos de búsqueda:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {details.keywordsExtracted.map((kw, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 text-xs font-mono rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800/80"
                    >
                      #{kw}
                    </span>
                  ))}
                  {details.keywordsExtracted.length === 0 && (
                    <span className="text-xs text-zinc-500 italic">No se extrajeron términos específicos.</span>
                  )}
                </div>
              </div>

              {/* Step 2: Retrieved Chunks with Similarity Scores */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-teal-400" />
                    <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                      Fase 2: Ranking Híbrido de Chunks Oficiales (BM25 + Coseno Semántico)
                    </h4>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Umbral mínimo: {(details.similarityThreshold * 100).toFixed(0)}%
                  </span>
                </div>

                {details.retrievedChunks.length === 0 ? (
                  <div className="p-6 rounded-xl bg-amber-950/20 border border-amber-800/40 text-center">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <h5 className="text-sm font-semibold text-amber-300">Ningún fragmento superó el umbral de similitud</h5>
                    <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                      El filtro de seguridad RAG detectó que la consulta no guarda relación suficiente con los reglamentos institucionales de INDEL. Se activó el protocolo de "No Alucinación".
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {details.retrievedChunks.map((match, idx) => (
                      <div 
                        key={match.chunk.id}
                        className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-800/60 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-emerald-300 border border-zinc-700">
                                Chunk #{idx + 1}
                              </span>
                              <span className="text-xs font-semibold text-zinc-200">
                                {match.chunk.docTitle}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-mono">
                                [{match.chunk.docCode}]
                              </span>
                            </div>
                            <div className="text-[11px] font-medium text-zinc-400 mb-2">
                              {match.chunk.sectionTitle} {match.chunk.articleNumber && `• ${match.chunk.articleNumber}`}
                            </div>
                            <p className="text-xs text-zinc-300 bg-zinc-900/90 p-2.5 rounded-lg font-sans leading-relaxed border border-zinc-800">
                              {match.chunk.content}
                            </p>
                          </div>

                          {/* Scores Badge */}
                          <div className="text-right shrink-0 flex flex-col items-end space-y-1">
                            <div className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-mono font-bold">
                              {(match.combinedScore * 100).toFixed(1)}% match
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono">
                              Semántico: {(match.similarityScore * 100).toFixed(0)}%
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono">
                              Léxico: {(match.keywordScore * 100).toFixed(0)}%
                            </div>
                            {onSelectDoc && (
                              <button
                                onClick={() => onSelectDoc(match.chunk.docId, match.chunk.articleNumber)}
                                className="mt-2 text-[10px] text-emerald-400 hover:text-emerald-300 underline flex items-center space-x-1"
                              >
                                <span>Ver en Bóveda</span>
                                <ArrowRight className="w-2.5 h-2.5 inline" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs">
                <div className="flex items-center space-x-2 text-zinc-400 mb-2 pb-2 border-b border-zinc-800">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-zinc-200">System Instruction de Inyección RAG</span>
                </div>
                <pre className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                  {details.systemPromptUsed}
                </pre>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-xs">
                <div className="flex items-center justify-between text-zinc-400 mb-2 pb-2 border-b border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-zinc-200">Contexto Suministrado al LLM ({details.assembledContextTokens} tokens aprox.)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">Ventana Aislada</span>
                </div>
                <div className="text-zinc-400 text-[11px] space-y-3 max-h-60 overflow-y-auto">
                  {details.retrievedChunks.map((m, i) => (
                    <div key={i} className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <div className="text-emerald-400 font-bold mb-1">
                        [FRAGMENTO #{i + 1} - {m.chunk.docCode} {m.chunk.articleNumber}]
                      </div>
                      <div className="text-zinc-300">{m.chunk.content}</div>
                    </div>
                  ))}
                  {details.retrievedChunks.length === 0 && (
                    <div className="text-amber-400 italic">Contexto nulo (sin documentos coincidentes).</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <h5 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Latencia y Rendimiento RAG</span>
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-400">Latencia total de respuesta:</span>
                      <span className="font-mono text-emerald-300 font-bold">{details.latencyMs} ms</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-400">Modelo Fundacional:</span>
                      <span className="font-mono text-zinc-300">{details.modelUsed}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-400">Índice Vectorial:</span>
                      <span className="font-mono text-zinc-300">En Memoria (Hybrid BM25 + Cosine)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <h5 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Control Anti-Alucinaciones</span>
                  </h5>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-2">
                    El sistema compara la respuesta generada con los fragmentos institucionales indexados. Si un hecho no cuenta con sustento en el texto oficial, el modelo tiene la directiva de declarar su ausencia.
                  </p>
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300">
                    ✓ Estado: {details.isGroundedInDocs ? 'Respuesta anclada a documentos oficiales' : 'Bloqueo preventivo de alucinación activo'}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>NEXUS RAG Inspector • Instituto INDEL 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors"
          >
            Cerrar Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
