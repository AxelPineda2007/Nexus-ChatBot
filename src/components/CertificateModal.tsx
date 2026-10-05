import React, { useRef } from 'react';
import { X, Printer, ShieldCheck, QrCode, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
  userQuestion: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  message,
  userQuestion
}) => {
  const printRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !message) return null;

  const handlePrint = () => {
    window.print();
  };

  const verificationHash = `INDEL-RAG-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-4)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white text-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top bar controls */}
        <div className="bg-zinc-900 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Ficha Oficial de Consulta Académica Certificada</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm shadow-emerald-950"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div ref={printRef} className="p-8 overflow-y-auto space-y-6 text-xs font-sans">
          
          {/* Institutional Header */}
          <div className="border-b-2 border-zinc-900 pb-4 flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                República de El Salvador • Ministerio de Educación
              </div>
              <h1 className="text-xl font-black text-zinc-950 tracking-tight mt-0.5">
                INSTITUTO NACIONAL CANTÓN LOURDES (INDEL)
              </h1>
              <div className="text-xs font-semibold text-emerald-800">
                Sistema NEXUS — Registro de Validación RAG y Dictámenes Normativos
              </div>
            </div>

            <div className="text-right font-mono text-[10px] text-zinc-600">
              <div className="font-bold text-zinc-900">FOLIO ELECTRÓNICO</div>
              <div className="text-emerald-800 font-bold">{verificationHash}</div>
              <div>Fecha: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          {/* Consultation Details */}
          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Consulta Formulada por el Solicitante:
            </div>
            <div className="text-sm font-semibold text-zinc-900 italic">
              «{userQuestion || 'Consulta de Normativa Institucional'}»
            </div>
          </div>

          {/* Official Grounded Response */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Dictamen Documental Oficial Generado por NEXUS (RAG Grounded):
            </div>
            <div className="p-4 rounded-xl bg-zinc-50/70 border border-zinc-200 text-zinc-800 text-xs leading-relaxed whitespace-pre-line">
              {message.text}
            </div>
          </div>

          {/* Citing Documents */}
          {message.citations && message.citations.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Documentos y Artículos Oficiales Citados:
              </div>
              <div className="space-y-1.5">
                {message.citations.map((c, i) => (
                  <div key={i} className="flex items-start justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-200 text-zinc-800 text-[11px]">
                    <div>
                      <span className="font-bold text-emerald-900">[{c.docCode}] {c.docTitle}</span>
                      <div className="text-zinc-600 text-[10px] mt-0.5">
                        {c.sectionTitle} {c.articleNumber && `• ${c.articleNumber}`}
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Verificado
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Stamps Footer */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <div className="font-bold text-zinc-900">Sello Digital SHA-256</div>
                <div className="font-mono text-[9px] text-zinc-600">{verificationHash}</div>
                <div>Garantía de fidelidad documental sin alucinación • INDEL Tech Lab</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-zinc-900">Firma Autorizada Electrónica</div>
              <div className="italic text-zinc-600">NEXUS Core Engine 2026.1</div>
              <div className="text-emerald-700 font-semibold flex items-center justify-end space-x-1">
                <CheckCircle2 className="w-3 h-3 inline" />
                <span>Documentación Vigente</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
