/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { DocumentVaultModal } from './components/DocumentVaultModal';
import { VectorSpaceVisualizer } from './components/VectorSpaceVisualizer';
import { AcademicSimulators } from './components/AcademicSimulators';
import { DocumentIngestModal } from './components/DocumentIngestModal';
import { DemeritsAndMemorandum } from './components/DemeritsAndMemorandum';
import { RAGInspectorModal } from './components/RAGInspectorModal';
import { CertificateModal } from './components/CertificateModal';
import { INDEL_DOCUMENTS } from './data/indelDocuments';
import { searchRAGChunks, extractCitationsFromMatches } from './lib/ragEngine';
import { OfficialDocument, ChatMessage, RAGInspectionDetails, RetrievedChunkMatch, ThemeColor } from './types';
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  Activity,
  ArrowRight,
  AlertOctagon
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'vault' | 'demerits' | 'simulator' | 'vector' | 'ingest'>('chat');
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>('emerald');
  const [strictMode, setStrictMode] = useState(true);
  const [documents, setDocuments] = useState<OfficialDocument[]>(INDEL_DOCUMENTS);
  const [isLoading, setIsLoading] = useState(false);

  // Inspector & Certificate Modal states
  const [selectedInspection, setSelectedInspection] = useState<RAGInspectionDetails | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [certificateData, setCertificateData] = useState<{ message: ChatMessage; question: string } | null>(null);

  // Vault navigation states
  const [vaultDocId, setVaultDocId] = useState<string | null>(null);
  const [vaultArticleNumber, setVaultArticleNumber] = useState<string | null>(null);

  // Latest query and retrieved matches for the vector visualizer
  const [latestQuery, setLatestQuery] = useState('¿Qué pasa si acumulo 3 llamados de atención verbales según el reglamento de disciplina?');
  const [latestMatches, setLatestMatches] = useState<RetrievedChunkMatch[]>([]);

  // Initial welcome message from NEXUS
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'nexus',
      text: `¡Hola! Soy **NEXUS**, asistente académico y disciplinario del **Instituto Nacional Cantón Lourdes (INDEL)**.\n\nRespondo de forma **breve, directa y específica** basándome únicamente en los reglamentos oficiales (31 deberes estudiantiles, 27 faltas leves, deméritos, registro en Drive, actas de compromiso/memorándums y malla de software).\n\n💡 *Selecciona una pregunta rápida o escribe tu consulta directa.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [
        {
          docId: 'doc-demeritos-faltas-sanciones-indel',
          docCode: 'DOC-DISC-02',
          docTitle: 'Faltas, Deméritos y Sanciones',
          articleNumber: 'Sanciones',
          sectionTitle: 'Regla del 3.er Llamado Verbal',
          exactSnippet: '1.º llamado en Drive, 2.º en expediente; al 3.er llamado verbal se convierte en Falta Grave y se elabora Acta Compromiso / Memorándum.'
        },
        {
          docId: 'doc-normativa-estudiantes-indel',
          docCode: 'DOC-EST-01',
          docTitle: 'Normativa Estudiantil INDEL',
          articleNumber: 'Num. 1-8',
          sectionTitle: 'Uniforme Diario y Presentación',
          exactSnippet: 'Calcetas blancas en señoritas sin punteras, calcetines negros en jóvenes sin punteras, monograma cosido, bolsón transparente.'
        }
      ]
    }
  ]);

  // Fetch initial documents from server if available
  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.documents && Array.isArray(data.documents)) {
          setDocuments(data.documents);
        }
      })
      .catch(() => {
        // Fallback to local default documents
        setDocuments(INDEL_DOCUMENTS);
      });
  }, []);

  // Send message handler
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    setLatestQuery(userText);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to full-stack server endpoint
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          strictMode
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (data.ragDetails?.retrievedChunks) {
        setLatestMatches(data.ragDetails.retrievedChunks);
      }

      const nexusMessage: ChatMessage = {
        id: `nexus-${Date.now()}`,
        sender: 'nexus',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [],
        ragDetails: data.ragDetails,
        notInDocsWarning: data.notInDocsWarning
      };

      setMessages(prev => [...prev, nexusMessage]);
    } catch (err) {
      console.warn('Backend /api/query failed, executing client-side RAG fallback:', err);
      // Client-side RAG fallback execution
      const { topMatches, inspection } = searchRAGChunks(userText);
      setLatestMatches(topMatches);
      const citations = extractCitationsFromMatches(topMatches);

      let fallbackText = '';
      if (!inspection.isGroundedInDocs) {
        fallbackText = `No figura en los documentos oficiales del INDEL. Como asistente RAG estricto, no puedo inventar información no verificada. Consulta en Secretaría Académica o Coordinación.`;
      } else {
        const primary = topMatches[0];
        const topSnippets = topMatches.slice(0, 2);
        fallbackText = `**Respuesta Oficial [${primary.chunk.docCode}]:**\n\n` +
          topSnippets.map(m => `• **${m.chunk.articleNumber || m.chunk.sectionTitle}**: ${m.chunk.content.split('\n')[0]}`).join('\n\n');
      }

      const nexusMessage: ChatMessage = {
        id: `nexus-${Date.now()}`,
        sender: 'nexus',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: inspection.isGroundedInDocs ? citations : [],
        ragDetails: inspection,
        notInDocsWarning: !inspection.isGroundedInDocs
      };

      setMessages(prev => [...prev, nexusMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Open Vault at exact article
  const handleOpenVaultAtArticle = (docId: string, articleNumber?: string) => {
    setVaultDocId(docId);
    setVaultArticleNumber(articleNumber || null);
    setActiveTab('vault');
  };

  // Inspect RAG pipeline modal
  const handleInspectRAG = (details: RAGInspectionDetails) => {
    setSelectedInspection(details);
    setIsInspectorOpen(true);
  };

  // Open official certificate modal
  const handleOpenCertificate = (message: ChatMessage, question: string) => {
    setCertificateData({ message, question });
  };

  // Ingestion handler
  const handleDocumentAdded = (newDoc: OfficialDocument) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  const THEME_CLASSES: Record<ThemeColor, string> = {
    emerald: 'bg-[#0c0e0d] selection:bg-emerald-500/30 selection:text-emerald-200',
    amber: 'bg-[#0f0e0b] selection:bg-amber-500/30 selection:text-amber-200',
    violet: 'bg-[#0e0c12] selection:bg-purple-500/30 selection:text-purple-200',
    crimson: 'bg-[#100c0d] selection:bg-rose-500/30 selection:text-rose-200',
  };

  return (
    <div className={`min-h-screen ${THEME_CLASSES[currentTheme]} text-zinc-100 flex flex-col font-sans scanline-effect transition-colors duration-300`}>
      
      {/* Institutional Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        strictMode={strictMode}
        setStrictMode={setStrictMode}
        totalDocuments={documents.length}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Interactive Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div 
            onClick={() => setActiveTab('vault')}
            className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-800/60 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Normativas
              </span>
              <BookOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-white">{documents.length}</span>
              <span className="text-[11px] text-emerald-300">Docs Oficiales</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('demerits')}
            className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-rose-800/60 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Deméritos & Actas
              </span>
              <AlertOctagon className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-rose-400">27 Faltas</span>
              <span className="text-[11px] text-zinc-400">Drive & Acta</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('vector')}
            className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-teal-800/60 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Arquitectura RAG
              </span>
              <Cpu className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-teal-300">Híbrida</span>
              <span className="text-[11px] text-zinc-400">BM25 + Coseno</span>
            </div>
          </div>

          <div 
            onClick={() => setStrictMode(!strictMode)}
            className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-800/60 transition-all cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Fidelidad RAG
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-emerald-400">
                {strictMode ? '100%' : 'Asistido'}
              </span>
              <span className="text-[11px] text-zinc-400">
                {strictMode ? 'Cero Alucinación' : 'Ampliado'}
              </span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('simulator')}
            className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-800/60 transition-all cursor-pointer group shadow-lg col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Herramientas
              </span>
              <GraduationCap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-amber-300">Simulador</span>
              <span className="text-[11px] text-zinc-400">Promoción & Malla</span>
            </div>
          </div>
        </div>

        {/* Tab 1: Chat Interface */}
        {activeTab === 'chat' && (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onInspectRAG={handleInspectRAG}
            onOpenVault={handleOpenVaultAtArticle}
            onOpenCertificate={handleOpenCertificate}
            onOpenVectorMap={() => setActiveTab('vector')}
          />
        )}

        {/* Tab 2: Document Vault */}
        {activeTab === 'vault' && (
          <DocumentVaultModal
            documents={documents}
            selectedDocId={vaultDocId}
            targetArticleNumber={vaultArticleNumber}
          />
        )}

        {/* Tab 3: Demerits & Memorandum */}
        {activeTab === 'demerits' && (
          <DemeritsAndMemorandum
            onAskNexus={(query) => {
              setActiveTab('chat');
              handleSendMessage(query);
            }}
          />
        )}

        {/* Tab 3: Vector Embedding Space Visualizer */}
        {activeTab === 'vector' && (
          <VectorSpaceVisualizer
            latestQuery={latestQuery}
            retrievedMatches={latestMatches}
            onSelectChunk={(chunk) => handleOpenVaultAtArticle(chunk.docId, chunk.articleNumber)}
          />
        )}

        {/* Tab 4: Academic Simulator & Curriculum Roadmaps */}
        {activeTab === 'simulator' && (
          <AcademicSimulators
            onAskNexus={(query) => {
              setActiveTab('chat');
              handleSendMessage(query);
            }}
          />
        )}

        {/* Tab 5: Dynamic Ingestion Sandbox */}
        {activeTab === 'ingest' && (
          <DocumentIngestModal
            onDocumentAdded={handleDocumentAdded}
            onAskNexus={(query) => {
              setActiveTab('chat');
              handleSendMessage(query);
            }}
          />
        )}

      </main>

      {/* RAG Neural Pipeline Inspector Modal */}
      <RAGInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        details={selectedInspection}
        onSelectDoc={(docId, articleNumber) => {
          setIsInspectorOpen(false);
          handleOpenVaultAtArticle(docId, articleNumber);
        }}
      />

      {/* Official Certified Ticket Modal */}
      <CertificateModal
        isOpen={!!certificateData}
        onClose={() => setCertificateData(null)}
        message={certificateData?.message || null}
        userQuestion={certificateData?.question || ''}
      />

      {/* Institutional Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/90 py-5 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-zinc-300">NEXUS</span>
            <span>— Asistente Académico con RAG e IA Oficial • INDEL 2026</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-zinc-400">
            <span>Tecnología: Retrieval-Augmented Generation</span>
            <span>•</span>
            <span>Gemini 3.8 Flash</span>
            <span>•</span>
            <span className="text-emerald-400">Cero Alucinaciones</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
