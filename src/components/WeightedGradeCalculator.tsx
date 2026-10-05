import React, { useState, useId } from 'react';
import { 
  Calculator, 
  Target, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  Award, 
  ShieldAlert, 
  ArrowRight, 
  RotateCcw, 
  Percent, 
  BookOpen, 
  FileText,
  Copy,
  Check
} from 'lucide-react';

interface PeriodData {
  id: number;
  name: string;
  weight: number; // e.g. 25 for 25%
  grade: number; // 0 to 10
  isCompleted: boolean;
}

interface WeightedGradeCalculatorProps {
  onAskNexus?: (query: string) => void;
}

export const WeightedGradeCalculator: React.FC<WeightedGradeCalculatorProps> = ({ onAskNexus }) => {
  const [calculationMode, setCalculationMode] = useState<'4periods' | '3periods' | 'modular'>('4periods');
  
  // 4 Periods Mode (Official MINEDUCYT / INDEL High School: 4 periods of 25% each)
  const [periods, setPeriods] = useState<PeriodData[]>([
    { id: 1, name: 'Periodo 1', weight: 25, grade: 7.5, isCompleted: true },
    { id: 2, name: 'Periodo 2', weight: 25, grade: 6.8, isCompleted: true },
    { id: 3, name: 'Periodo 3', weight: 25, grade: 7.0, isCompleted: false },
    { id: 4, name: 'Periodo 4', weight: 25, grade: 7.0, isCompleted: false },
  ]);

  // Target Grade preset or custom
  const [targetGrade, setTargetGrade] = useState<number>(7.0); // INDEL minimum passing grade is 7.0
  const [attendancePercentage, setAttendancePercentage] = useState<number>(92);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Switch presets
  const handleModeChange = (mode: '4periods' | '3periods' | 'modular') => {
    setCalculationMode(mode);
    if (mode === '4periods') {
      setPeriods([
        { id: 1, name: 'Periodo 1', weight: 25, grade: 7.5, isCompleted: true },
        { id: 2, name: 'Periodo 2', weight: 25, grade: 6.5, isCompleted: true },
        { id: 3, name: 'Periodo 3', weight: 25, grade: 7.0, isCompleted: false },
        { id: 4, name: 'Periodo 4', weight: 25, grade: 7.0, isCompleted: false },
      ]);
    } else if (mode === '3periods') {
      setPeriods([
        { id: 1, name: 'Periodo 1 (30%)', weight: 30, grade: 7.2, isCompleted: true },
        { id: 2, name: 'Periodo 2 (35%)', weight: 35, grade: 6.9, isCompleted: false },
        { id: 3, name: 'Periodo 3 (35%)', weight: 35, grade: 7.0, isCompleted: false },
      ]);
    } else if (mode === 'modular') {
      // Internal module breakdown: Labs 40%, Exam 30%, Project 30%
      setPeriods([
        { id: 1, name: '40% Práctica y Laboratorios', weight: 40, grade: 8.0, isCompleted: true },
        { id: 2, name: '30% Prueba Departamental', weight: 30, grade: 6.5, isCompleted: true },
        { id: 3, name: '30% Proyecto Integrador', weight: 30, grade: 7.0, isCompleted: false },
      ]);
    }
  };

  // Update grade for a period
  const handleGradeChange = (id: number, val: number) => {
    const clamped = Math.max(0, Math.min(10, Math.round(val * 10) / 10));
    setPeriods(prev => prev.map(p => p.id === id ? { ...p, grade: clamped } : p));
  };

  // Toggle period completed status
  const handleToggleCompleted = (id: number) => {
    setPeriods(prev => prev.map(p => p.id === id ? { ...p, isCompleted: !p.isCompleted } : p));
  };

  // Update weight for custom adjustments
  const handleWeightChange = (id: number, w: number) => {
    const clamped = Math.max(1, Math.min(100, Math.round(w)));
    setPeriods(prev => prev.map(p => p.id === id ? { ...p, weight: clamped } : p));
  };

  // Calculations
  const completedPeriods = periods.filter(p => p.isCompleted);
  const remainingPeriods = periods.filter(p => !p.isCompleted);
  
  const totalWeight = periods.reduce((sum, p) => sum + p.weight, 0);
  const completedWeight = completedPeriods.reduce((sum, p) => sum + p.weight, 0);
  const remainingWeight = remainingPeriods.reduce((sum, p) => sum + p.weight, 0);

  // Current accumulated weighted score: Sum(grade * (weight / totalWeight))
  const currentAccumulatedScore = completedPeriods.reduce((acc, p) => {
    return acc + (p.grade * (p.weight / totalWeight));
  }, 0);

  // Points needed to reach targetGrade
  const pointsNeeded = targetGrade - currentAccumulatedScore;

  // Grade needed across remaining periods
  // target = currentAccumulated + gradeNeeded * (remainingWeight / totalWeight)
  // => gradeNeeded = pointsNeeded / (remainingWeight / totalWeight)
  const remainingWeightRatio = remainingWeight / totalWeight;
  const gradeNeeded = remainingWeightRatio > 0 ? pointsNeeded / remainingWeightRatio : 0;

  // Immediate next period estimate (if multiple remain, assuming others get target or identical average)
  const nextPeriod = remainingPeriods[0];

  // Feasibility status
  let feasibility: 'achieved' | 'easy' | 'moderate' | 'hard' | 'impossible' = 'moderate';
  let feasibilityColor = 'text-emerald-400';
  let feasibilityBg = 'bg-emerald-950/60 border-emerald-800/80';
  let statusSummary = '';

  if (pointsNeeded <= 0) {
    feasibility = 'achieved';
    feasibilityColor = 'text-emerald-300';
    feasibilityBg = 'bg-emerald-950/70 border-emerald-700';
    statusSummary = '¡Meta ya asegurada! Aún con 0.0 en los periodos restantes superas la calificación objetivo.';
  } else if (remainingPeriods.length === 0) {
    feasibility = currentAccumulatedScore >= targetGrade ? 'achieved' : 'impossible';
    feasibilityColor = currentAccumulatedScore >= targetGrade ? 'text-emerald-400' : 'text-rose-400';
    feasibilityBg = currentAccumulatedScore >= targetGrade ? 'bg-emerald-950/60 border-emerald-800' : 'bg-rose-950/60 border-rose-800';
    statusSummary = currentAccumulatedScore >= targetGrade 
      ? `Promedio final completado: ${currentAccumulatedScore.toFixed(2)} pts.`
      : `Todos los periodos concluyeron con ${currentAccumulatedScore.toFixed(2)} pts. No se alcanzó la meta de ${targetGrade.toFixed(1)}.`;
  } else if (gradeNeeded <= 7.0) {
    feasibility = 'easy';
    feasibilityColor = 'text-emerald-400';
    feasibilityBg = 'bg-emerald-950/60 border-emerald-800/70';
    statusSummary = `Meta muy alcanzable. Necesitas un promedio de ${gradeNeeded.toFixed(2)} en los periodos restantes.`;
  } else if (gradeNeeded <= 8.5) {
    feasibility = 'moderate';
    feasibilityColor = 'text-teal-300';
    feasibilityBg = 'bg-teal-950/60 border-teal-800/70';
    statusSummary = `Meta alcanzable con dedicación. Requiere promedio de ${gradeNeeded.toFixed(2)} en lo restante.`;
  } else if (gradeNeeded <= 10.0) {
    feasibility = 'hard';
    feasibilityColor = 'text-amber-400';
    feasibilityBg = 'bg-amber-950/60 border-amber-800/80';
    statusSummary = `Meta exigente pero matemáticamente posible. Deberás obtener ${gradeNeeded.toFixed(2)} en los periodos restantes.`;
  } else {
    feasibility = 'impossible';
    feasibilityColor = 'text-rose-400';
    feasibilityBg = 'bg-rose-950/60 border-rose-800';
    statusSummary = `Inalcanzable en el periodo regular (requerirías ${gradeNeeded.toFixed(2)} / 10.0). Según el Art. 19 de la Normativa INDEL, si tu promedio global final se ubica entre 5.0 y 6.9, podrás presentarte a Convocatoria Extraordinaria de Recuperación.`;
  }

  // Attendance check (Art. 22: Minimum 85% attendance required)
  const isAttendanceAtRisk = attendancePercentage < 85;

  // Copy report
  const handleCopySummary = () => {
    let text = `=== REPORTE DE ESTIMACIÓN DE PROMEDIO INDEL 2026 ===\n`;
    text += `Modalidad: ${calculationMode === '4periods' ? '4 Periodos Ordinarios (25% c/u)' : calculationMode === '3periods' ? '3 Periodos' : 'Desglose Modular'}\n`;
    text += `Meta de Calificación: ${targetGrade.toFixed(1)} / 10.0\n`;
    text += `Puntos acumulados hasta hoy: ${currentAccumulatedScore.toFixed(2)} / ${totalWeight}%\n\n`;
    text += `DETALLE DE PERIODOS:\n`;
    periods.forEach(p => {
      text += `- ${p.name} (${p.weight}%): ${p.isCompleted ? p.grade.toFixed(1) + ' [REGISTRADA]' : '[PENDIENTE]'}\n`;
    });
    text += `\nESTIMACIÓN OFICIAL:\n`;
    if (remainingPeriods.length > 0) {
      text += `Nota requerida en ${nextPeriod?.name || 'el próximo periodo'}: ${gradeNeeded > 10 ? 'Superior a 10.0 (Requiere Extraordinario)' : gradeNeeded.toFixed(2)}\n`;
    }
    text += `Dictamen: ${statusSummary}\n`;
    text += `Asistencia: ${attendancePercentage}% (${isAttendanceAtRisk ? 'RIESGO RPE Art. 22' : 'VÁLIDA'})\n`;
    text += `Normativa de referencia: DOC-EVAL-03 Arts. 13, 19 y 22 (Instituto Nacional Cantón Lourdes).`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Mode Selection */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/80">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Calculadora Ponderada & Estimador de Periodo</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  Lineamientos INDEL
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Ingresa tus notas actuales y estima con exactitud qué calificación necesitas en el próximo periodo para aprobar o conseguir honores
              </p>
            </div>
          </div>
        </div>

        {/* Structure Mode Switcher */}
        <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start md:self-auto text-xs">
          <button
            onClick={() => handleModeChange('4periods')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              calculationMode === '4periods'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            4 Periodos (25% c/u)
          </button>
          <button
            onClick={() => handleModeChange('3periods')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              calculationMode === '3periods'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            3 Periodos
          </button>
          <button
            onClick={() => handleModeChange('modular')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              calculationMode === 'modular'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Desglose Modular (40/30/30)
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs Column (7 cols) + Live Verdict Dashboard (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Grade Inputs & Period Configuration */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Target Grade Selector */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>Calificación Objetivo que deseas alcanzar</span>
                </label>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  La nota mínima de aprobación reglamentaria en INDEL es <strong className="text-emerald-400">7.0</strong> (DOC-EVAL-03, Art. 13)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {targetGrade.toFixed(1)}
                </span>
                <span className="text-xs text-zinc-500 font-mono">/ 10.0</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { label: 'Aprobación Mínima', grade: 7.0, tag: 'Art. 13', icon: '🎯' },
                { label: 'Buen Rendimiento', grade: 8.0, tag: 'Notable', icon: '📈' },
                { label: 'Beca STEAM', grade: 8.5, tag: 'Excelencia', icon: '🏆' },
                { label: 'Cuadro de Honor', grade: 9.0, tag: 'Sobresaliente', icon: '⭐' },
              ].map(preset => (
                <button
                  key={preset.grade}
                  onClick={() => setTargetGrade(preset.grade)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    targetGrade === preset.grade
                      ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-sm shadow-emerald-950'
                      : 'bg-zinc-950/70 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>{preset.icon} {preset.grade.toFixed(1)}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 font-mono text-zinc-400">
                      {preset.tag}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1 truncate">
                    {preset.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom slider for Target */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Ajuste fino de meta deseada:</span>
                <span className="font-mono text-emerald-400 font-semibold">{targetGrade.toFixed(1)} pts</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="10.0"
                step="0.1"
                value={targetGrade}
                onChange={(e) => setTargetGrade(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Periods Table & Grade Inputs */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Ingreso de Calificaciones por Periodo</span>
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Marca los periodos que ya cursaste e ingresa tu nota (0.0 a 10.0). Deja desmarcados los próximos a estimar.
                </p>
              </div>

              <button
                onClick={() => handleModeChange(calculationMode)}
                className="flex items-center space-x-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Reiniciar valores a estándar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Restablecer</span>
              </button>
            </div>

            {/* Period Input Rows */}
            <div className="space-y-3">
              {periods.map((period, index) => {
                const isCurrentNext = !period.isCompleted && (index === 0 || periods[index - 1]?.isCompleted);

                return (
                  <div 
                    key={period.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      period.isCompleted
                        ? 'bg-zinc-950/70 border-zinc-800'
                        : isCurrentNext
                        ? 'bg-emerald-950/20 border-emerald-600/70 ring-1 ring-emerald-500/40'
                        : 'bg-zinc-950/30 border-zinc-800/60 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Left: Checkbox & Name */}
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`period-check-${period.id}`}
                          checked={period.isCompleted}
                          onChange={() => handleToggleCompleted(period.id)}
                          className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-zinc-900 cursor-pointer"
                        />
                        <div>
                          <label 
                            htmlFor={`period-check-${period.id}`}
                            className={`text-xs font-semibold cursor-pointer flex items-center space-x-2 ${
                              period.isCompleted ? 'text-zinc-100' : 'text-zinc-400'
                            }`}
                          >
                            <span>{period.name}</span>
                            {isCurrentNext && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700">
                                Próximo Periodo a Cursar
                              </span>
                            )}
                          </label>
                          <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                            Ponderación: {period.weight}% del total anual
                          </div>
                        </div>
                      </div>

                      {/* Right: Numeric Input & Contribution */}
                      <div className="flex items-center space-x-3 sm:justify-end">
                        {period.isCompleted ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-zinc-400 hidden sm:inline">Nota obtenida:</span>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={period.grade}
                                onChange={(e) => handleGradeChange(period.id, parseFloat(e.target.value) || 0)}
                                className="w-20 px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-center font-mono font-bold text-sm text-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                            <span className="text-xs font-mono text-zinc-400">/ 10</span>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="px-2 py-1 rounded text-[11px] font-mono font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">
                              {isCurrentNext ? 'Estimación activa ⏳' : 'Pendiente'}
                            </span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Weight and Contribution bar */}
                    {period.isCompleted && (
                      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                        <span>Aporte ponderado a la nota final:</span>
                        <span className="text-emerald-400 font-bold">
                          +{(period.grade * (period.weight / 100)).toFixed(2)} pts
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Attendance Guardrail (Art. 22) */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300 flex items-center space-x-1.5">
                  <ShieldAlert className={`w-4 h-4 ${isAttendanceAtRisk ? 'text-rose-400' : 'text-emerald-400'}`} />
                  <span>Control de Asistencia Estudiantil (Normativa Art. 22)</span>
                </span>
                <span className={`font-mono font-bold ${isAttendanceAtRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {attendancePercentage}% (Mínimo: 85%)
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                step="1"
                value={attendancePercentage}
                onChange={(e) => setAttendancePercentage(parseInt(e.target.value))}
                className={`w-full cursor-pointer ${isAttendanceAtRisk ? 'accent-rose-500' : 'accent-emerald-500'}`}
              />
              <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>
                  {isAttendanceAtRisk 
                    ? '🚨 Riesgo de Reprobado por Inasistencia (RPE): Más del 15% de ausencias sin justificar anula el derecho a evaluación.' 
                    : '✓ Asistencia regular conforme al reglamento INDEL.'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">DOC-EVAL-03 Art. 22</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Live Estimator Results & Official Action Plan (5 cols) */}
        <div className="lg:col-span-5 space-y-5 flex flex-col">
          
          {/* Main Verdict Card */}
          <div className={`p-6 rounded-2xl border ${feasibilityBg} shadow-xl flex flex-col justify-between space-y-5 transition-all`}>
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className={`w-4 h-4 ${feasibilityColor}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Estimación para el Próximo Periodo
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                Fórmula Ponderada
              </span>
            </div>

            {/* Big Needed Grade Display */}
            <div className="text-center py-2 space-y-1">
              <div className="text-xs font-medium text-zinc-400">
                {remainingPeriods.length > 0
                  ? `Calificación necesaria en ${nextPeriod?.name || 'el siguiente periodo'}:`
                  : 'Calificación Final Obtenida:'}
              </div>

              <div className="flex items-baseline justify-center space-x-2">
                <span className={`text-5xl sm:text-6xl font-black font-mono tracking-tight ${feasibilityColor}`}>
                  {remainingPeriods.length === 0
                    ? currentAccumulatedScore.toFixed(2)
                    : pointsNeeded <= 0
                    ? '0.0'
                    : gradeNeeded > 10
                    ? '> 10.0'
                    : gradeNeeded.toFixed(2)}
                </span>
                <span className="text-lg font-mono text-zinc-500">/ 10.0</span>
              </div>

              <div className="pt-2">
                <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  feasibility === 'achieved' || feasibility === 'easy' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                  feasibility === 'moderate' ? 'bg-teal-950 text-teal-300 border border-teal-700' :
                  feasibility === 'hard' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                  'bg-rose-950 text-rose-300 border border-rose-700'
                }`}>
                  {(feasibility === 'achieved' || feasibility === 'easy') && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {(feasibility === 'moderate' || feasibility === 'hard') && <AlertTriangle className="w-3.5 h-3.5" />}
                  {feasibility === 'impossible' && <ShieldAlert className="w-3.5 h-3.5" />}
                  <span>
                    {feasibility === 'achieved' ? 'Aprobación Garantizada' :
                     feasibility === 'easy' ? 'Objetivo Cómodo' :
                     feasibility === 'moderate' ? 'Objetivo Factible' :
                     feasibility === 'hard' ? 'Exigencia Alta' :
                     'Requiere Convocatoria Extraordinaria'}
                  </span>
                </span>
              </div>
            </div>

            {/* Accumulated vs Target Progress Bar */}
            <div className="space-y-2 p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>Puntos acumulados hasta hoy:</span>
                <span className="font-mono font-bold text-white">
                  {currentAccumulatedScore.toFixed(2)} pts / {totalWeight}%
                </span>
              </div>

              {/* Multi-segment Progress Bar */}
              <div className="w-full h-3 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden relative">
                {/* Current accumulated */}
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentAccumulatedScore / 10) * 100)}%` }}
                />
                {/* Target marker indicator */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 shadow-sm"
                  style={{ left: `${(targetGrade / 10) * 100}%` }}
                  title={`Meta: ${targetGrade.toFixed(1)}`}
                />
              </div>

              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>0.0</span>
                <span className="text-amber-400 font-semibold">Meta: {targetGrade.toFixed(1)} pts</span>
                <span>10.0</span>
              </div>

              <div className="pt-1.5 border-t border-zinc-800/60 flex justify-between text-[11px]">
                <span className="text-zinc-400">Puntos restantes para la meta:</span>
                <span className={`font-mono font-bold ${pointsNeeded <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {pointsNeeded <= 0 ? '0.00 pts (Superada)' : `${pointsNeeded.toFixed(2)} pts`}
                </span>
              </div>
            </div>

            {/* Verdict Explanation & Institutional Context */}
            <div className="p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60 text-xs text-zinc-300 leading-relaxed space-y-2">
              <p>{statusSummary}</p>

              {/* Official INDEL Guidance */}
              <div className="text-[11px] pt-2 border-t border-zinc-800 text-zinc-400 space-y-1">
                <div className="font-semibold text-zinc-300 flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lineamientos Oficiales INDEL:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-zinc-400 pl-1">
                  <li><strong>Aprobación:</strong> Mínimo 7.0 ordinario y &ge;85% de asistencia (Art. 13).</li>
                  <li><strong>Convocatoria Extraordinaria:</strong> Promedio entre 5.0 y 6.9 (nota máxima registrada 7.0, Art. 19).</li>
                  <li><strong>Reprobación Directa:</strong> Menor a 5.0 no tiene derecho a extraordinario.</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleCopySummary}
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 border border-zinc-700"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? '¡Reporte Copiado!' : 'Copiar Plan'}</span>
              </button>

              {onAskNexus && (
                <button
                  onClick={() => onAskNexus(`Según mis notas actuales acumuladas (${currentAccumulatedScore.toFixed(2)} pts) y mi meta de ${targetGrade.toFixed(1)}, ¿qué opciones tengo según la normativa de evaluación del INDEL?`)}
                  className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-950"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Consultar a NEXUS</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
