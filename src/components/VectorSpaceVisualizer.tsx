import React, { useState, useEffect, useRef } from 'react';
import { Layers, Search, Sparkles, Filter, Info, Eye } from 'lucide-react';
import { DocumentChunk, RetrievedChunkMatch } from '../types';
import { generateDocumentChunks } from '../data/indelDocuments';

interface VectorSpaceVisualizerProps {
  latestQuery?: string;
  retrievedMatches?: RetrievedChunkMatch[];
  onSelectChunk?: (chunk: DocumentChunk) => void;
}

export const VectorSpaceVisualizer: React.FC<VectorSpaceVisualizerProps> = ({
  latestQuery = '',
  retrievedMatches = [],
  onSelectChunk
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [selectedChunk, setSelectedChunk] = useState<DocumentChunk | null>(null);
  const [hoveredChunk, setHoveredChunk] = useState<DocumentChunk | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    setChunks(generateDocumentChunks());
  }, []);

  // Category colors
  const categoryColors: Record<string, { fill: string; stroke: string; glow: string; label: string }> = {
    academico: { fill: '#10b981', stroke: '#34d399', glow: 'rgba(16, 185, 129, 0.4)', label: 'Malla Curricular & Software' },
    reglamento: { fill: '#059669', stroke: '#10b981', glow: 'rgba(5, 150, 105, 0.4)', label: 'Reglamento & Uniformes' },
    evaluacion: { fill: '#f59e0b', stroke: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)', label: 'Evaluación & Notas' },
    admision: { fill: '#a855f7', stroke: '#c084fc', glow: 'rgba(168, 85, 247, 0.4)', label: 'Admisiones & Becas' },
    institucional: { fill: '#14b8a6', stroke: '#2dd4bf', glow: 'rgba(20, 184, 166, 0.4)', label: 'Servicio Social' },
    seguridad: { fill: '#f43f5e', stroke: '#fb7185', glow: 'rgba(244, 63, 94, 0.4)', label: 'Laboratorios & Cómputo' },
  };

  const getDocCategory = (docId: string): string => {
    if (docId.includes('malla')) return 'academico';
    if (docId.includes('reglamento-uniformes') || docId.includes('normativa')) return 'reglamento';
    if (docId.includes('evaluacion') || docId.includes('demeritos')) return 'evaluacion';
    if (docId.includes('admision')) return 'admision';
    if (docId.includes('servicio')) return 'institucional';
    if (docId.includes('laboratorio')) return 'seguridad';
    return 'academico';
  };

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle futuristic cyber grid
      ctx.strokeStyle = 'rgba(39, 39, 42, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw cluster centroids labels
      const clusters = [
        { label: 'Cluster: Plan de Estudios Software', x: 220, y: 140, color: '#10b981' },
        { label: 'Cluster: Normativa Uniforme & Disciplina', x: 480, y: 120, color: '#059669' },
        { label: 'Cluster: Evaluación & Notas (7.0)', x: 350, y: 430, color: '#f59e0b' },
        { label: 'Cluster: Admisiones & Becas STEAM', x: 170, y: 460, color: '#a855f7' },
      ];

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(161, 161, 170, 0.4)';
      clusters.forEach(c => {
        ctx.fillText(c.label, c.x - 60, c.y);
      });

      // Filter chunks if category selected
      const visibleChunks = chunks.filter(c => {
        if (activeCategory === 'all') return true;
        return getDocCategory(c.docId) === activeCategory;
      });

      // Calculate Query Node coordinates if retrievedMatches exist
      let queryNodeCoords: { x: number; y: number } | null = null;
      if (retrievedMatches.length > 0) {
        const top3 = retrievedMatches.slice(0, 3);
        const avgX = top3.reduce((acc, m) => acc + m.chunk.vectorCoords.x, 0) / top3.length;
        const avgY = top3.reduce((acc, m) => acc + m.chunk.vectorCoords.y, 0) / top3.length;
        queryNodeCoords = {
          x: Math.round(avgX + Math.sin(t * 0.8) * 6),
          y: Math.round(avgY + Math.cos(t * 0.8) * 6)
        };

        // Draw animated laser vectors between query and retrieved chunks
        retrievedMatches.forEach((m, i) => {
          const target = m.chunk.vectorCoords;
          ctx.beginPath();
          ctx.moveTo(queryNodeCoords!.x, queryNodeCoords!.y);
          ctx.lineTo(target.x, target.y);
          
          // Laser glow
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.4 + 0.3 * Math.sin(t + i)})`;
          ctx.lineWidth = Math.max(1, (m.similarityScore * 3));
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = -t * 8;
          ctx.stroke();
          ctx.setLineDash([]); // Reset
        });
      }

      // Draw Chunk Nodes
      visibleChunks.forEach(chunk => {
        const cat = getDocCategory(chunk.docId);
        const col = categoryColors[cat] || categoryColors.academico;
        const isRetrieved = retrievedMatches.some(m => m.chunk.id === chunk.id);
        const isHovered = hoveredChunk?.id === chunk.id;
        const isSelected = selectedChunk?.id === chunk.id;

        const radius = isSelected ? 8 : isHovered ? 7 : isRetrieved ? 6 : 4.5;

        // Glow
        if (isRetrieved || isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(chunk.vectorCoords.x, chunk.vectorCoords.y, radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = col.glow;
          ctx.fill();
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(chunk.vectorCoords.x, chunk.vectorCoords.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isRetrieved ? '#10b981' : col.fill;
        ctx.strokeStyle = isRetrieved ? '#6ee7b7' : col.stroke;
        ctx.lineWidth = isRetrieved ? 2 : 1;
        ctx.fill();
        ctx.stroke();

        // Node ID label on hover or retrieved
        if (isRetrieved || isHovered) {
          ctx.font = '10px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#f4f4f5';
          ctx.fillText(chunk.articleNumber || chunk.docCode, chunk.vectorCoords.x + 8, chunk.vectorCoords.y - 6);
        }
      });

      // Draw Query Vector Node
      if (queryNodeCoords && latestQuery) {
        // Outer pulsing ring
        const pulse = 14 + Math.sin(t * 3) * 4;
        ctx.beginPath();
        ctx.arc(queryNodeCoords.x, queryNodeCoords.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fill();

        // Central query node
        ctx.beginPath();
        ctx.arc(queryNodeCoords.x, queryNodeCoords.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();

        // Query label
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#34d399';
        ctx.fillText('Vector Consulta Actual', queryNodeCoords.x + 12, queryNodeCoords.y + 4);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [chunks, activeCategory, retrievedMatches, hoveredChunk, selectedChunk, latestQuery]);

  // Handle canvas mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Check hit test
    const found = chunks.find(c => {
      const dx = c.vectorCoords.x - x;
      const dy = c.vectorCoords.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 12;
    });

    setHoveredChunk(found || null);
  };

  const handleCanvasClick = () => {
    if (hoveredChunk) {
      setSelectedChunk(hoveredChunk);
      if (onSelectChunk) onSelectChunk(hoveredChunk);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Bar */}
      <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <span>Espacio Vectorial Semántico 2D (Embeddings RAG)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                {chunks.length} vectores indexados
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Visualización topológica de la base de conocimiento institucional de INDEL y proximidad de consultas
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeCategory === 'all'
                ? 'bg-emerald-600 text-white font-medium shadow-sm shadow-emerald-950'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          {Object.entries(categoryColors).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-2 py-1 rounded-lg text-[11px] transition-all flex items-center space-x-1 ${
                activeCategory === key
                  ? 'bg-zinc-800 text-white font-medium border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: val.fill }} />
              <span>{val.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas & Info Drawer */}
      <div className="relative flex-1 bg-[#0b0d0c] min-h-[420px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={720}
          height={520}
          onMouseMove={handleMouseMove}
          onClick={handleCanvasClick}
          className="w-full h-[460px] cursor-crosshair object-contain"
        />

        {/* Floating Query Indicator */}
        {latestQuery && (
          <div className="absolute top-3 left-3 bg-zinc-900/90 backdrop-blur-md border border-emerald-700/60 p-2.5 rounded-xl shadow-xl max-w-xs text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vector de Consulta Activa:</span>
            </div>
            <p className="text-zinc-200 truncate italic">«{latestQuery}»</p>
            {retrievedMatches.length > 0 && (
              <div className="text-[10px] text-emerald-400 mt-1 font-mono">
                → Conectado a {retrievedMatches.length} chunks más cercanos
              </div>
            )}
          </div>
        )}

        {/* Hover / Selected Chunk Card */}
        {(hoveredChunk || selectedChunk) && (
          <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:max-w-sm bg-zinc-900/95 backdrop-blur-md border border-zinc-700 p-3.5 rounded-xl shadow-2xl text-xs animate-in fade-in duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400">
                  [{((hoveredChunk || selectedChunk)!).docCode}]
                </span>
                <h5 className="font-bold text-zinc-100 mt-0.5">
                  {((hoveredChunk || selectedChunk)!).articleNumber} • {((hoveredChunk || selectedChunk)!).sectionTitle}
                </h5>
                <p className="text-zinc-400 text-[11px] mt-1 line-clamp-3 leading-relaxed">
                  {((hoveredChunk || selectedChunk)!).content}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            <span className="text-[11px]">Chunk Recuperado (Top RAG Match)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full border border-emerald-400 bg-transparent" />
            <span className="text-[11px]">Línea Laser: Afinidad Coseno</span>
          </div>
        </div>
        <div className="text-[11px] text-zinc-500 italic">
          Haz clic en cualquier nodo para inspeccionar su fragmento oficial
        </div>
      </div>
    </div>
  );
};
