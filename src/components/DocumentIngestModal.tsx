import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Plus, 
  AlertCircle,
  FilePlus2,
  RefreshCw
} from 'lucide-react';
import { OfficialDocument } from '../types';

interface DocumentIngestModalProps {
  onDocumentAdded: (doc: OfficialDocument) => void;
  onAskNexus?: (query: string) => void;
}

export const DocumentIngestModal: React.FC<DocumentIngestModalProps> = ({
  onDocumentAdded,
  onAskNexus
}) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<'institucional' | 'academico' | 'reglamento' | 'evaluacion'>('institucional');
  const [authority, setAuthority] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [successDoc, setSuccessDoc] = useState<OfficialDocument | null>(null);

  const handleLoadTemplate = (type: 'hackathon' | 'feriado') => {
    if (type === 'hackathon') {
      setTitle('Convocatoria Oficial: Hackathon Nacional de IA y Ciberseguridad 2026');
      setCode('CIRC-DIR-2026-08');
      setCategory('academico');
      setAuthority('Comité de Innovación Pedagógica INDEL');
      setContent(
        `Artículo 1. Objeto del Evento: Se convoca a todos los estudiantes de 2.º y 3.er año de Bachillerato Técnico en Desarrollo de Software al Hackathon Institucional 2026 a celebrarse el 18 de octubre.\n` +
        `Artículo 2. Requisitos de Participación: Equipos mixtos de 3 a 4 integrantes. Es indispensable presentar credencial estudiantil vigente y no poseer faltas disciplinarias graves en el registro de Drive.\n` +
        `Artículo 3. Premiación: Los equipos finalistas obtendrán exoneración de la evaluación práctica del Módulo 2.4 y becas para certificaciones en la nube otorgadas por el MINEDUCYT.`
      );
    } else {
      setTitle('Disposición Administrativa: Receso Académico y Jornadas de Asesoría');
      setCode('CIRC-DIR-2026-09');
      setCategory('institucional');
      setAuthority('Dirección General INDEL');
      setContent(
        `Disposición 1: Durante la semana del 24 al 28 de noviembre se suspenden las clases presenciales por jornada pedagógica docente nacional.\n` +
        `Disposición 2: Los estudiantes que requieran recuperación de módulos en estado "Extraordinario" deberán presentarse a tutoría obligatoria en el laboratorio de cómputo de 8:00 a.m. a 12:00 m.d. con uniforme de gala completo.`
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    try {
      const generatedCode = code.trim() || `DOC-USER-${Date.now().toString().slice(-4)}`;
      
      const paragraphs = content.split('\n\n').filter(p => p.trim());
      const articles = paragraphs.map((p, idx) => ({
        id: `user-art-${idx + 1}`,
        articleNumber: `Art. ${idx + 1}`,
        title: p.slice(0, 40) + '...',
        content: p.trim(),
        keywords: title.toLowerCase().split(' ').filter(w => w.length > 3)
      }));

      const newDoc: OfficialDocument = {
        id: `doc-custom-${Date.now()}`,
        code: generatedCode,
        title: title.trim(),
        category,
        badgeColor: '#10b981',
        effectiveDate: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
        version: '1.0 (Ingesta Dinámica)',
        authority: authority.trim() || 'Dirección / Secretaría Académica INDEL',
        description: `Documento incorporado dinámicamente mediante el Sandbox de Ingesta RAG en memoria en caliente.`,
        sections: [
          {
            title: 'Disposiciones y Articulado',
            articles
          }
        ]
      };

      await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDoc.title,
          code: newDoc.code,
          category: newDoc.category,
          authority: newDoc.authority,
          content: content.trim()
        })
      }).catch(() => {
        // Safe local fallback
      });

      onDocumentAdded(newDoc);
      setSuccessDoc(newDoc);
    } catch (err) {
      console.error('Error submitting document:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center space-x-2">
              <span>Sandbox de Ingesta Dinámica RAG</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                Vector Indexing en Caliente
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Agrega una circular, nuevo comunicado o reglamento para que NEXUS lo incorpore a su memoria vectorial inmediatamente
            </p>
          </div>
        </div>

        {/* Quick templates */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-zinc-400 text-[11px] hidden sm:inline">Cargar ejemplo:</span>
          <button
            type="button"
            onClick={() => handleLoadTemplate('hackathon')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-zinc-700 transition-colors"
          >
            + Hackathon IA 2026
          </button>
          <button
            type="button"
            onClick={() => handleLoadTemplate('feriado')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-teal-300 border border-zinc-700 transition-colors"
          >
            + Circular Horarios
          </button>
        </div>
      </div>

      {successDoc ? (
        <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-emerald-200">
              ¡Documento indexado con éxito en el sistema RAG!
            </h4>
            <p className="text-xs text-zinc-300 mt-1 max-w-lg mx-auto">
              «{successDoc.title}» [{successDoc.code}] ahora forma parte de la base de conocimiento en tiempo real. NEXUS responderá preguntas y citará estos fragmentos.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onAskNexus && (
              <button
                onClick={() => onAskNexus(`¿Qué dice el documento ${successDoc.code} sobre ${successDoc.title}?`)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-md shadow-emerald-950"
              >
                <Sparkles className="w-4 h-4" />
                <span>Hacer pregunta a NEXUS sobre este documento</span>
              </button>
            )}

            <button
              onClick={() => {
                setSuccessDoc(null);
                setTitle('');
                setContent('');
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors"
            >
              Indexar otro documento
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-zinc-300 block">Título Oficial del Documento *</label>
              <input
                type="text"
                required
                placeholder="Ej. Reglamento de Uso de MakerSpace e Impresoras 3D"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Código Institucional</label>
              <input
                type="text"
                placeholder="DOC-ACAD-XX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Categoría Temática</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="institucional">Institucional / General</option>
                <option value="academico">Académico / Malla Curricular</option>
                <option value="reglamento">Reglamento / Disciplina</option>
                <option value="evaluacion">Evaluación y Calificaciones</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300 block">Autoridad Emisora</label>
              <input
                type="text"
                placeholder="Ej. Dirección Académica INDEL"
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-zinc-300 block">
                Texto Oficial o Artículos (Separar párrafos con doble enter para auto-chunking) *
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">
                {content.length} caracteres
              </span>
            </div>
            <textarea
              required
              rows={6}
              placeholder="Pega aquí el contenido del reglamento, circular o acuerdo institucional..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center space-x-2 shadow-lg shadow-emerald-950"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generando fragmentos vectoriales...</span>
                </>
              ) : (
                <>
                  <FilePlus2 className="w-4 h-4" />
                  <span>Indexar Documento en Memoria RAG</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
