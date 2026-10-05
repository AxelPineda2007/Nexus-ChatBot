import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  FileText, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Download,
  Calendar,
  Award,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { OfficialDocument, DocumentArticle } from '../types';
import { INDEL_DOCUMENTS } from '../data/indelDocuments';

interface DocumentVaultModalProps {
  documents?: OfficialDocument[];
  selectedDocId?: string | null;
  targetArticleNumber?: string | null;
  onClose?: () => void;
}

export const DocumentVaultModal: React.FC<DocumentVaultModalProps> = ({
  documents = INDEL_DOCUMENTS,
  selectedDocId,
  targetArticleNumber,
  onClose
}) => {
  const [activeDocId, setActiveDocId] = useState<string>(selectedDocId || documents[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDocId) {
      setActiveDocId(selectedDocId);
    }
  }, [selectedDocId]);

  // Scroll to article if targetArticleNumber is specified
  useEffect(() => {
    if (targetArticleNumber) {
      setTimeout(() => {
        const el = document.getElementById(`art-${targetArticleNumber.replace(/\s+/g, '-').toLowerCase()}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-950/40');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-emerald-400');
          }, 3500);
        }
      }, 250);
    }
  }, [targetArticleNumber, activeDocId]);

  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadDoc = () => {
    if (!activeDoc) return;
    let fullText = `${activeDoc.title} [${activeDoc.code}]\n`;
    fullText += `Autoridad Emisora: ${activeDoc.authority}\n`;
    fullText += `Vigencia: ${activeDoc.effectiveDate} | Versión: ${activeDoc.version}\n\n`;
    activeDoc.sections.forEach(s => {
      fullText += `\n=== ${s.title} ===\n`;
      s.articles.forEach(a => {
        fullText += `\n${a.articleNumber ? a.articleNumber + ': ' : ''}${a.title}\n${a.content}\n`;
      });
    });

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeDoc.code}_${activeDoc.title.slice(0, 30)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.sections.some(s => s.articles.some(a => a.content.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[750px] max-h-[85vh]">
      
      {/* Vault Header */}
      <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base text-white">Bóveda Documental Oficial INDEL</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                100% Verificado
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Repositorio de reglamentos, planes de estudio y acuerdos institucionales vigentes
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar en normativas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-64"
            />
          </div>

          <button
            onClick={handleDownloadDoc}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
            title="Descargar copia oficial en texto plano"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar Texto</span>
          </button>
        </div>
      </div>

      {/* Main Content Area (Split Sidebar + Reader) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Document Selector Sidebar */}
        <div className="w-72 sm:w-80 bg-zinc-950/80 border-r border-zinc-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-zinc-800/80">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
              Documentos Indexados ({filteredDocs.length})
            </span>
            <div className="flex flex-wrap gap-1 text-[10px]">
              {['all', 'academico', 'reglamento', 'evaluacion', 'institucional'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded capitalize ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white font-medium shadow-sm shadow-emerald-950'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredDocs.map(doc => {
              const isActive = doc.id === activeDoc?.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    isActive
                      ? 'bg-zinc-900 border-emerald-500/60 shadow-md shadow-emerald-950/50'
                      : 'bg-zinc-950/40 border-zinc-800/60 hover:bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-emerald-400">
                      {doc.code}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {doc.version.split(' ')[0]}
                    </span>
                  </div>
                  <h5 className="font-semibold text-xs text-zinc-200 line-clamp-2 leading-snug">
                    {doc.title}
                  </h5>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                    {doc.authority}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Reader Area */}
        <div className="flex-1 bg-[#0f1110] overflow-y-auto p-6 lg:p-8">
          {activeDoc ? (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Document Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                      {activeDoc.code}
                    </span>
                    <span className="text-xs text-zinc-400">
                      • {activeDoc.version}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Documento Oficial Aprobado</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                  {activeDoc.title}
                </h2>

                <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
                  {activeDoc.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-3 border-t border-zinc-800 text-zinc-400">
                  <div>
                    <span className="text-zinc-500 font-medium">Autoridad: </span>
                    <span className="text-zinc-300">{activeDoc.authority}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium">Vigencia: </span>
                    <span className="text-zinc-300">{activeDoc.effectiveDate}</span>
                  </div>
                </div>
              </div>

              {/* Sections & Articles */}
              <div className="space-y-6">
                {activeDoc.sections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 pb-1.5 border-b border-zinc-800 flex items-center space-x-2">
                      <Bookmark className="w-3.5 h-3.5 inline text-emerald-400" />
                      <span>{section.title}</span>
                    </h3>

                    <div className="space-y-3">
                      {section.articles.map(article => {
                        const artIdKey = article.articleNumber?.replace(/\s+/g, '-').toLowerCase() || article.id;
                        const isTargeted = targetArticleNumber && 
                          article.articleNumber?.toLowerCase().includes(targetArticleNumber.toLowerCase());

                        return (
                          <div
                            key={article.id}
                            id={`art-${artIdKey}`}
                            className={`p-4 rounded-xl border transition-all ${
                              isTargeted
                                ? 'bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-950/50'
                                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {article.articleNumber && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                                    {article.articleNumber}
                                  </span>
                                )}
                                <h4 className="text-xs sm:text-sm font-semibold text-zinc-100">
                                  {article.title}
                                </h4>
                              </div>

                              <button
                                onClick={() => handleCopy(`${activeDoc.title} [${activeDoc.code}, ${article.articleNumber || ''}]:\n${article.content}`, article.id)}
                                className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors"
                                title="Copiar artículo con cita formal"
                              >
                                {copiedId === article.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
                              {article.content}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-zinc-800/60">
                              <span className="text-[10px] text-zinc-500 font-mono">Palabras clave RAG:</span>
                              {article.keywords.map((kw, kIdx) => (
                                <span
                                  key={kIdx}
                                  className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-950 text-zinc-400 border border-zinc-800"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500 text-xs">
              Selecciona un documento para visualizar sus artículos
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
