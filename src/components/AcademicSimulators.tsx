import React, { useState } from 'react';
import { 
  Calculator, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert, 
  Clock, 
  Code2, 
  Server, 
  Cloud, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Target
} from 'lucide-react';
import { WeightedGradeCalculator } from './WeightedGradeCalculator';

interface AcademicSimulatorsProps {
  onAskNexus?: (query: string) => void;
}

export const AcademicSimulators: React.FC<AcademicSimulatorsProps> = ({ onAskNexus }) => {
  const [activeTool, setActiveTool] = useState<'weighted' | 'modular' | 'curriculum'>('weighted');

  // Calculator inputs
  const [labGrade, setLabGrade] = useState<number>(7.5);
  const [examGrade, setExamGrade] = useState<number>(6.5);
  const [projectGrade, setProjectGrade] = useState<number>(8.0);
  const [attendance, setAttendance] = useState<number>(90);

  // Selected curriculum module
  const [selectedModuleYear, setSelectedModuleYear] = useState<1 | 2 | 3>(2);

  // Grade calculation
  const weightedScore = (labGrade * 0.40) + (examGrade * 0.30) + (projectGrade * 0.30);
  const finalGrade = parseFloat(weightedScore.toFixed(1));

  // Determine official status based on DOC-EVAL-03 Art 13, 19, 22
  let status: 'APROBADO' | 'EXTRAORDINARIO' | 'REPROBADO' | 'INASISTENCIA' = 'APROBADO';
  let statusColor = 'emerald';
  let statusText = '';
  let articleRef = '';

  if (attendance < 85) {
    status = 'INASISTENCIA';
    statusColor = 'rose';
    statusText = 'Reprobado Por Inasistencia (RPE). Ha acumulado más del 15% de inasistencias injustificadas, perdiendo derecho a evaluación ordinaria y extraordinaria.';
    articleRef = 'DOC-EVAL-03, Art. 22';
  } else if (finalGrade >= 7.0) {
    status = 'APROBADO';
    statusColor = 'emerald';
    statusText = '¡Aprobado satisfactoriamente! Cumple con la nota mínima institucional (7.0) y la asistencia requerida.';
    articleRef = 'DOC-EVAL-03, Art. 13';
  } else if (finalGrade >= 5.0) {
    status = 'EXTRAORDINARIO';
    statusColor = 'amber';
    statusText = 'Derecho a Convocatoria Extraordinaria de Recuperación. Su promedio se ubica entre 5.0 y 6.9 con asistencia superior al 85%. Recuerde que la nota máxima registrable tras la suficiencia será 7.0.';
    articleRef = 'DOC-EVAL-03, Art. 19';
  } else {
    status = 'REPROBADO';
    statusColor = 'rose';
    statusText = 'Reprobación directa del módulo. Al obtener una nota inferior a 5.0, no tiene derecho a examen extraordinario y deberá recursar la materia.';
    articleRef = 'DOC-EVAL-03, Art. 19';
  }

  // Curriculum data for Software Development
  const modulesByYear = {
    1: [
      { code: 'M1.1', title: 'Fundamentos de Lógica y Algoritmos', hours: 8, tech: 'TypeScript, Diagramación', desc: 'Pensamiento computacional, estructuras de control, funciones y arrays.' },
      { code: 'M1.2', title: 'Arquitectura de Computadores y Linux', hours: 6, tech: 'Bash, Redes LAN, Hardware', desc: 'Administración de servidores Linux, terminal, ensamble y cableado estructurado.' },
      { code: 'M1.3', title: 'Desarrollo Web Frontend Moderno', hours: 8, tech: 'React, Tailwind CSS, Vite', desc: 'Maquetación responsive, componentes de interfaz de usuario y estados.' },
      { code: 'M1.4', title: 'Matemática Discreta y Lógica', hours: 4, tech: 'Grafos, Álgebra Booleana', desc: 'Bases matemáticas para ciencias de la computación y análisis de algoritmos.' },
      { code: 'M1.5', title: 'Inglés Técnico para TI I', hours: 4, tech: 'Lectura Técnica, Tickets', desc: 'Comprensión auditiva y lectora de documentación técnica de software.' },
    ],
    2: [
      { code: 'M2.1', title: 'POO y Patrones de Diseño Avanzados', hours: 8, tech: 'SOLID, Clean Architecture', desc: 'Principios de diseño orientado a objetos, desacoplamiento y testing unitario.' },
      { code: 'M2.2', title: 'Bases de Datos Relacionales y NoSQL', hours: 8, tech: 'PostgreSQL, MongoDB, Redis', desc: 'Modelado relacional, optimización de queries, triggers, índices y almacenamiento de vectores.' },
      { code: 'M2.3', title: 'Desarrollo Backend & APIs (REST / GraphQL)', hours: 8, tech: 'Node.js, Express, Go, JWT', desc: 'Arquitectura de servicios web, autenticación robusta, WebSockets y microservicios.' },
      { code: 'M2.4', title: 'Ingeniería de Software y Metodologías Ágiles', hours: 4, tech: 'Scrum, Git CI/CD, Kanban', desc: 'Gestión de ciclos de vida de software, revisiones de código y despliegue continuo.' },
      { code: 'M2.5', title: 'Inglés Técnico para TI II & Habilidades', hours: 4, tech: 'Entrevistas, Pitching', desc: 'Presentación de soluciones tecnológicas y comunicación en equipos multiculturales.' },
    ],
    3: [
      { code: 'M3.1', title: 'Arquitectura Cloud & DevOps', hours: 8, tech: 'Docker, Kubernetes, GCP/AWS', desc: 'Contenedores, orquestación, balanceo de carga e infraestructura como código.' },
      { code: 'M3.2', title: 'Ingeniería de IA & Sistemas RAG Aplicados', hours: 8, tech: 'Gemini API, Vector Embeddings', desc: 'Integración de modelos generativos, búsqueda semántica, agentes autónomos y LLMOps.' },
      { code: 'M3.3', title: 'Ciberseguridad Defensiva y DevSecOps', hours: 6, tech: 'OWASP, Pentesting Básico', desc: 'Seguridad en aplicaciones web, análisis de vulnerabilidades y encriptación.' },
      { code: 'M3.4', title: 'Proyecto de Graduación & Startups', hours: 8, tech: 'MVP Full-Stack', desc: 'Desarrollo de una solución tecnológica de alto impacto para la sociedad o industria.' },
    ]
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Tool Selector Bar */}
      <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 to-emerald-600 text-white shadow-md shadow-amber-950/40">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <span>Herramientas Académicas Interactivas INDEL</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                Reglamento 2026
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Calculadoras oficiales y visualizador de mallas curriculares según normativas vigentes
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTool('weighted')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTool === 'weighted'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-950'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Calculadora de Promedio Ponderado</span>
          </button>
          <button
            onClick={() => setActiveTool('modular')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTool === 'modular'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-950'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Evaluación Modular (40/30/30)</span>
          </button>
          <button
            onClick={() => setActiveTool('curriculum')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTool === 'curriculum'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-950'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Malla Software</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 bg-[#0f1110]">
        {activeTool === 'weighted' && (
          <WeightedGradeCalculator onAskNexus={onAskNexus} />
        )}

        {activeTool === 'modular' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Grade Sliders */}
              <div className="bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800 space-y-5">
                <div className="border-b border-zinc-800 pb-3">
                  <h4 className="font-bold text-sm text-zinc-100">
                    Componentes de Evaluación Modular
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Ajuste los valores según las ponderaciones oficiales de INDEL (40% - 30% - 30%)
                  </p>
                </div>

                {/* 40% Continuous Labs */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-300">
                      40% Práctica Continua (Laboratorios y Código):
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{labGrade.toFixed(1)} / 10.0</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={labGrade}
                    onChange={(e) => setLabGrade(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-500 block">
                    Aporte a nota final: +{(labGrade * 0.40).toFixed(2)} pts
                  </span>
                </div>

                {/* 30% Theoretical Exam */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-300">
                      30% Prueba Departamental Estandarizada:
                    </span>
                    <span className="font-mono font-bold text-teal-400">{examGrade.toFixed(1)} / 10.0</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={examGrade}
                    onChange={(e) => setExamGrade(parseFloat(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-500 block">
                    Aporte a nota final: +{(examGrade * 0.30).toFixed(2)} pts
                  </span>
                </div>

                {/* 30% Integrated Project */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-300">
                      30% Proyecto Integrador Modular:
                    </span>
                    <span className="font-mono font-bold text-amber-400">{projectGrade.toFixed(1)} / 10.0</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={projectGrade}
                    onChange={(e) => setProjectGrade(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-500 block">
                    Aporte a nota final: +{(projectGrade * 0.30).toFixed(2)} pts
                  </span>
                </div>

                {/* Attendance Slider */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-zinc-300">
                      Asistencia Presencial Registrada:
                    </span>
                    <span className={`font-mono font-bold ${attendance >= 85 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {attendance}% (Mínimo: 85%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="1"
                    value={attendance}
                    onChange={(e) => setAttendance(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-500 block">
                    {attendance < 85 ? '⚠️ Por debajo del límite reglamentario del 85%' : '✓ Asistencia regular cumplida'}
                  </span>
                </div>

              </div>

              {/* Right Column: Calculated Official Verdict */}
              <div className="bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Dictamen Oficial del Sistema
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      INDEL-EVAL-v4
                    </span>
                  </div>

                  {/* Big Grade Display */}
                  <div className="my-5 text-center p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
                    <span className="text-xs text-zinc-400 block mb-1">Nota Final Ponderada</span>
                    <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white">
                      {finalGrade.toFixed(1)}
                      <span className="text-lg text-zinc-500 font-normal"> / 10.0</span>
                    </div>

                    <div className="mt-3">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        status === 'APROBADO' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                        status === 'EXTRAORDINARIO' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                        'bg-rose-950 text-rose-300 border border-rose-700'
                      }`}>
                        {status === 'APROBADO' && <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />}
                        {status === 'EXTRAORDINARIO' && <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />}
                        {(status === 'REPROBADO' || status === 'INASISTENCIA') && <XCircle className="w-3.5 h-3.5 inline mr-1" />}
                        <span>{status === 'APROBADO' ? 'Módulo Aprobado' : status === 'EXTRAORDINARIO' ? 'Convocatoria Extraordinaria' : status === 'INASISTENCIA' ? 'Reprobado por Inasistencia' : 'Reprobado Directo'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Verdict Description */}
                  <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                    <p className="mb-2">{statusText}</p>
                    <div className="text-[11px] font-mono text-emerald-400 pt-2 border-t border-zinc-800/80">
                      Sustento legal: [{articleRef}]
                    </div>
                  </div>
                </div>

                {onAskNexus && (
                  <button
                    onClick={() => onAskNexus('¿Cuáles son los requisitos exactos para tener derecho a examen de recuperación según el reglamento de evaluación?')}
                    className="mt-4 w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-300 text-xs font-medium flex items-center justify-center space-x-2 transition-colors border border-zinc-700"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Consultar detalles de este artículo a NEXUS</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

        {activeTool === 'curriculum' && (
          /* Curriculum Explorer */
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Year selector pills */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-zinc-100">
                  Plan Formativo: Técnico en Desarrollo de Software
                </h4>
                <p className="text-xs text-zinc-400">
                  Documento Oficial: DOC-ACAD-02 • 32 horas semanales por ciclo
                </p>
              </div>

              <div className="flex items-center space-x-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                {([1, 2, 3] as const).map(yr => (
                  <button
                    key={yr}
                    onClick={() => setSelectedModuleYear(yr)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      selectedModuleYear === yr
                        ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-950'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {yr}.º Año {yr === 2 ? '★ Pitch' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {modulesByYear[selectedModuleYear].map(mod => (
                <div
                  key={mod.code}
                  className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-700/60 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {mod.code}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 inline" />
                      <span>{mod.hours} hrs/sem</span>
                    </span>
                  </div>

                  <h5 className="font-bold text-xs sm:text-sm text-zinc-100 mb-1">
                    {mod.title}
                  </h5>

                  <p className="text-xs text-zinc-400 mb-2 leading-relaxed">
                    {mod.desc}
                  </p>

                  <div className="text-[10px] font-mono text-emerald-300 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900/50">
                    Stack: {mod.tech}
                  </div>
                </div>
              ))}
            </div>

            {/* Special year requirement notes */}
            {selectedModuleYear === 2 && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 flex items-start space-x-3 text-xs text-zinc-300">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-200 block font-semibold mb-1">
                    Requisito Crítico de 2.º Año [Art. 4]:
                  </strong>
                  Para matricular el 3.er año, los estudiantes de Desarrollo de Software deben haber completado <strong>80 horas de pre-pasantía</strong> en el INDEL Tech Lab o en empresas tecnológicas con convenio.
                </div>
              </div>
            )}

            {selectedModuleYear === 3 && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 flex items-start space-x-3 text-xs text-zinc-300">
                <Cloud className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-200 block font-semibold mb-1">
                    Graduación & Práctica Profesional [Art. 5 & Art. 8]:
                  </strong>
                  El 3.er año incluye <strong>300 horas de Práctica Profesional Externa</strong> y <strong>150 horas de Servicio Social Estudiantil</strong> para obtener el título técnico.
                </div>
              </div>
            )}

            {onAskNexus && (
              <div className="text-center pt-2">
                <button
                  onClick={() => onAskNexus('¿Qué módulos lleva 2.º año de Desarrollo de Software?')}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Probar en NEXUS: «¿Qué módulos lleva 2.º año de Software?»</span>
                </button>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
};
