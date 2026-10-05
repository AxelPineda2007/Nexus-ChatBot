import React, { useState } from 'react';
import { 
  AlertOctagon, 
  FileWarning, 
  ShieldAlert, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  User, 
  Calendar, 
  HardDrive, 
  ArrowRight,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

interface DemeritsAndMemorandumProps {
  onAskNexus?: (query: string) => void;
}

export const DemeritsAndMemorandum: React.FC<DemeritsAndMemorandumProps> = ({ onAskNexus }) => {
  const [activeSubTab, setActiveSubTab] = useState<'simulator' | 'memorandum'>('simulator');

  // Simulator state
  const [verbalCallsCount, setVerbalCallsCount] = useState<number>(1);
  const [selectedMinorFaults, setSelectedMinorFaults] = useState<string[]>(['sueter-830']);
  const [hasGravesFaults, setHasGravesFaults] = useState<boolean>(false);
  const [selectedGraveType, setSelectedGraveType] = useState<string>('vocabulario');
  const [hasMuyGraves, setHasMuyGraves] = useState<boolean>(false);
  const [selectedMuyGraveType, setSelectedMuyGraveType] = useState<string>('juegos-bruscos');

  // Memorandum form state
  const [studentName, setStudentName] = useState('Carlos Ernesto Flores Menjívar');
  const [studentGrade, setStudentGrade] = useState('2.º Año - Técnico en Desarrollo de Software');
  const [parentName, setParentName] = useState('María Elena Menjívar de Flores');
  const [teacherCoordinator, setTeacherCoordinator] = useState('Prof. Nelson Alvarado (Coordinador de Especialidad)');
  const [memorandumReason, setMemorandumReason] = useState(
    'Acumulación de tres (3) llamados de atención verbales por portar suéter después de las 8:30 a.m. (Falta Leve #8) y uso de celular en horario de clase (Falta Leve #16), convirtiéndose en Falta Grave según el Régimen Disciplinario Oficial del INDEL.'
  );
  const [positiveDisciplineAction, setPositiveDisciplineAction] = useState(
    'Realización de trabajo comunitario consistente en apoyo en la organización y limpieza del laboratorio de cómputo y aula de clases durante horarios que no interrumpan su jornada académica.'
  );

  // List of official 27 Minor Faults for the checklist
  const minorFaultsCatalog = [
    { id: 'horario-ingreso', num: 1, label: 'No presentarse en horario establecido para el ingreso (15 min antes)' },
    { id: 'almuerzo-externo', num: 2, label: 'Ingreso de alimentos en horas de almuerzo no elaborados en casa por padres' },
    { id: 'gorras-accesorios', num: 3, label: 'Uso de gorras, gorros, pañoletas u otros accesorios no permitidos' },
    { id: 'uniforme-incompleto', num: 4, label: 'No portar uniforme correctamente (punteras, sin cincho de cuero, etc.)' },
    { id: 'corte-no-francesa', num: 5, label: 'No seguir indicaciones de corte de cabello francesa oscura (varones)' },
    { id: 'cejas-corte', num: 6, label: 'Cejas con corte o tatuadas en señoritas y jóvenes' },
    { id: 'sueter-oscuro', num: 7, label: 'Usar suéter de colores oscuros, holgados o sudaderas' },
    { id: 'sueter-830', num: 8, label: 'Portar suéter después de las 8:30 am' },
    { id: 'piercing', num: 9, label: 'Usar piercing en oreja, nariz, lengua, barbilla o cejas' },
    { id: 'aritos-grandes', num: 10, label: 'Usar aritos de colgar grandes para señoritas' },
    { id: 'aretes-caballeros', num: 11, label: 'Uso de aretes en caballeros' },
    { id: 'unas-acrilicas', num: 12, label: 'Uso de uñas acrílicas en señoritas o uñas largas en jóvenes' },
    { id: 'maquillaje', num: 13, label: 'Uso de maquillaje en señoritas o jóvenes' },
    { id: 'tinte-cabello', num: 14, label: 'Uso de tinte en cabello en señoritas y jóvenes' },
    { id: 'irrespetar-toque', num: 15, label: 'Irrespetar el toque de entrada al salón de clases' },
    { id: 'celular-recesos', num: 16, label: 'Uso de CELULAR o audífonos en horas de clase, recesos o libres' },
    { id: 'chicle', num: 17, label: 'Ingresar o masticar chicle en la institución' },
    { id: 'bebidas-carbonatadas', num: 18, label: 'Ingresar bebidas carbonatadas, energizantes o jugos' },
    { id: 'cintas-xl', num: 19, label: 'Uso de cintas XL en zapatos deportivos' },
    { id: 'uniforme-deportivo-mal', num: 20, label: 'Portar uniforme deportivo cuando no corresponde a Educación Física' },
    { id: 'gabacha-horario-mal', num: 21, label: 'Portar gabacha en horas no correspondientes a tecnología' },
    { id: 'taller-desorden', num: 22, label: 'No mantener su espacio de trabajo limpio en zona de taller' },
    { id: 'materiales-olvidados', num: 23, label: 'No portar materiales tecnológicos (laptop, USB, cargador)' },
    { id: 'aseo-no-cumplido', num: 24, label: 'No cumplir con su horario de aseo asignado en el aula' },
    { id: 'alimentos-salon', num: 25, label: 'Ingresar alimentos y bebidas al salón de clases y talleres' },
    { id: 'retiro-sin-permiso', num: 26, label: 'Retirarse de la institución sin autorización' },
    { id: 'vello-facial', num: 27, label: 'Presentarse a la institución con vello facial (barba o bigote)' },
  ];

  const handleToggleMinorFault = (id: string) => {
    if (selectedMinorFaults.includes(id)) {
      setSelectedMinorFaults(selectedMinorFaults.filter(f => f !== id));
    } else {
      setSelectedMinorFaults([...selectedMinorFaults, id]);
    }
  };

  // Determine sanction according to INDEL official document
  let sanctionTitle = '';
  let sanctionDesc = '';
  let sanctionAction = '';
  let isMemorandumRequired = false;
  let isConapinaPncRequired = false;

  if (hasMuyGraves) {
    sanctionTitle = 'FALTA MUY GRAVE — Remisión Legal y Condicionamiento';
    sanctionDesc = 'Conducta tipificada como Falta Muy Grave que atenta contra la integridad física, psicológica o constituye delito.';
    sanctionAction = '1. Condicionamiento de matrícula para el siguiente año escolar.\n2. De existir daños a terceros o mobiliario, los gastos serán costeados íntegramente por el agresor / referente.\n3. Notificación y remisión inmediata a instancias: CONAPINA, PNC, Fiscalía General de la República o ISDEMU según corresponda.';
    isConapinaPncRequired = true;
    isMemorandumRequired = true;
  } else if (hasGravesFaults || verbalCallsCount >= 3) {
    sanctionTitle = 'FALTA GRAVE — Acta Compromiso y Trabajo Comunitario';
    if (verbalCallsCount >= 3 && !hasGravesFaults) {
      sanctionDesc = '¡REGLA OFICIAL INDEL: EL TERCER LLAMADO DE ATENCIÓN VERBAL SE CONVIERTE EN FALTA GRAVE!';
    } else {
      sanctionDesc = 'Falta grave que atenta contra la integridad psicológica o afecta el bien común institucional.';
    }
    sanctionAction = '1. Elaboración obligatoria de ACTA COMPROMISO / MEMORÁNDUM DISCIPLINARIO firmada por el estudiante y el referente de familia.\n2. Amonestación escrita y realización de trabajo comunitario que no interrumpa el horario de clases.\n3. En caso de reincidencia: Suspensión de clases presenciales garantizando proceso académico multimodal.\n4. Suspensión parcial de actividades institucionales y extracurriculares.';
    isMemorandumRequired = true;
  } else if (verbalCallsCount === 2) {
    sanctionTitle = 'Segundo Llamado de Atención por Falta Leve';
    sanctionDesc = 'Reincidencia en falta leve tras el primer llamado verbal.';
    sanctionAction = '1. Se registrará formalmente en el Expediente del estudiante.\n2. Se asignarán acciones formativas de Disciplina Positiva de acuerdo a la falta cometida.';
  } else {
    sanctionTitle = 'Primer Llamado de Atención por Falta Leve';
    sanctionDesc = 'Primera instancia disciplinaria por cometer alguna de las 27 faltas leves tipificadas.';
    sanctionAction = '1. Se realizará un llamado de atención verbal al estudiante.\n2. El llamado será registrado en el sistema Google Drive institucional para seguimiento.';
  }

  const handlePrintMemorandum = () => {
    window.print();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header */}
      <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-600 to-emerald-600 text-white shadow-lg shadow-rose-950/40">
            <AlertOctagon className="w-5 h-5 text-rose-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base text-white">Deméritos, Faltas y Memorándums INDEL</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
                Reglamento Vigente
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Instituto Nacional Cantón Lourdes • Sistema de cálculo de sanciones, registro en Drive y generación de Actas
            </p>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setActiveSubTab('simulator')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeSubTab === 'simulator'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <FileWarning className="w-3.5 h-3.5" />
            <span>Simulador de Deméritos</span>
          </button>

          <button
            onClick={() => setActiveSubTab('memorandum')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeSubTab === 'memorandum'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generador de Acta / Memorándum</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 bg-[#0f1110]">
        {activeSubTab === 'simulator' ? (
          <div className="max-w-5xl mx-auto space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Faults and Demerits Selector (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Step 1: Verbal calls counter */}
                <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center space-x-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                      <span>1. Historial de Llamados de Atención Verbales</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">Registro en Drive</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <button
                      type="button"
                      onClick={() => setVerbalCallsCount(1)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        verbalCallsCount === 1
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-950/40'
                          : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-sm font-extrabold font-mono">1.er Llamado</div>
                      <div className="text-[10px] mt-0.5">Registro en Drive</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVerbalCallsCount(2)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        verbalCallsCount === 2
                          ? 'bg-amber-950/80 border-amber-500 text-amber-200 font-bold shadow-md shadow-amber-950/40'
                          : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-sm font-extrabold font-mono">2.º Llamado</div>
                      <div className="text-[10px] mt-0.5">Expediente + D. Positiva</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVerbalCallsCount(3)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        verbalCallsCount >= 3
                          ? 'bg-rose-950/90 border-rose-500 text-rose-200 font-bold shadow-md shadow-rose-950/50 animate-pulse-subtle'
                          : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-sm font-extrabold font-mono">3.er Llamado</div>
                      <div className="text-[10px] text-rose-300 font-bold mt-0.5">→ ¡Falta Grave / Acta!</div>
                    </button>
                  </div>
                </div>

                {/* Step 2: Minor faults checklist (27 catalog) */}
                <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                      2. Faltas Leves Seleccionadas ({selectedMinorFaults.length} de 27)
                    </span>
                    <span className="text-[10px] text-zinc-400">Reglamento INDEL Págs. 3 y 4</span>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                    {minorFaultsCatalog.map(fault => {
                      const isChecked = selectedMinorFaults.includes(fault.id);
                      return (
                        <div
                          key={fault.id}
                          onClick={() => handleToggleMinorFault(fault.id)}
                          className={`p-2 rounded-xl border cursor-pointer select-none text-xs flex items-center justify-between transition-all ${
                            isChecked
                              ? 'bg-emerald-950/50 border-emerald-600/70 text-emerald-200'
                              : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400">
                              #{fault.num}
                            </span>
                            <span className="line-clamp-1">{fault.label}</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded accent-emerald-500 cursor-pointer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Faltas Graves & Muy Graves toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Faltas Graves box */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    hasGravesFaults ? 'bg-amber-950/30 border-amber-600' : 'bg-zinc-900/80 border-zinc-800'
                  }`}>
                    <label className="flex items-center space-x-2 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={hasGravesFaults}
                        onChange={(e) => setHasGravesFaults(e.target.checked)}
                        className="rounded accent-amber-500"
                      />
                      <span className="text-xs font-bold text-amber-300">
                        Incurrió en Falta Grave directa
                      </span>
                    </label>

                    {hasGravesFaults && (
                      <select
                        value={selectedGraveType}
                        onChange={(e) => setSelectedGraveType(e.target.value)}
                        className="w-full text-xs p-2 bg-zinc-950 border border-amber-800/80 rounded-xl text-zinc-200 focus:outline-none"
                      >
                        <option value="vocabulario">1. Vocabulario soez</option>
                        <option value="gritos-escandalo">2. Gritos/escándalo en cafetería, pasillos, fotocopiadora</option>
                        <option value="escenas-amorosas">3. Escenas amorosas dentro o fuera del instituto</option>
                      </select>
                    )}
                  </div>

                  {/* Faltas Muy Graves box */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    hasMuyGraves ? 'bg-rose-950/40 border-rose-600' : 'bg-zinc-900/80 border-zinc-800'
                  }`}>
                    <label className="flex items-center space-x-2 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={hasMuyGraves}
                        onChange={(e) => setHasMuyGraves(e.target.checked)}
                        className="rounded accent-rose-500"
                      />
                      <span className="text-xs font-bold text-rose-300">
                        Incurrió en Falta Muy Grave
                      </span>
                    </label>

                    {hasMuyGraves && (
                      <select
                        value={selectedMuyGraveType}
                        onChange={(e) => setSelectedMuyGraveType(e.target.value)}
                        className="w-full text-xs p-2 bg-zinc-950 border border-rose-800/80 rounded-xl text-zinc-200 focus:outline-none"
                      >
                        <option value="juegos-bruscos">1. Bromas o juegos bruscos contra la integridad</option>
                        <option value="cutter-cortopunzante">2. Ingresar cutter, navajas u objetos cortopunzantes</option>
                        <option value="drogas-alcohol">3. Drogas, alcohol o cigarrillos (Aviso a PNC)</option>
                        <option value="bullying">4. Bullying y sus derivados (Aviso a PNC)</option>
                        <option value="hurto-robo">5. Hurto o robo</option>
                        <option value="acoso-sexual">6. Acoso o abuso sexual</option>
                        <option value="rinas">8. Generar riñas</option>
                        <option value="dano-sanitarios">10. Daño a mobiliario o sanitarios (pago por padres)</option>
                      </select>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Sanction & Protocol Result (5 cols) */}
              <div className="lg:col-span-5 bg-zinc-900/90 p-5 rounded-2xl border border-zinc-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Dictamen Disciplinario Oficial INDEL
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      DOC-DISC-02
                    </span>
                  </div>

                  {/* Verdict Badge */}
                  <div className="my-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mb-1">
                      Calificación de la Conducta
                    </span>
                    <h4 className={`text-sm sm:text-base font-bold ${
                      hasMuyGraves ? 'text-rose-400' :
                      (hasGravesFaults || verbalCallsCount >= 3) ? 'text-amber-400' :
                      verbalCallsCount === 2 ? 'text-yellow-300' : 'text-emerald-300'
                    }`}>
                      {sanctionTitle}
                    </h4>

                    <p className="text-xs text-zinc-400 mt-1 italic">
                      {sanctionDesc}
                    </p>
                  </div>

                  {/* Protocol Steps */}
                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                      Protocolo de Acción Institucional:
                    </div>
                    <div className="whitespace-pre-line leading-relaxed font-sans text-zinc-200">
                      {sanctionAction}
                    </div>
                  </div>

                  {isConapinaPncRequired && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-700/60 text-xs text-rose-200 flex items-start space-x-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Obligación Legal de Denuncia:</strong> Este caso exige dar aviso formal a CONAPINA, Policía Nacional Civil (PNC) o Fiscalía General.
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  {isMemorandumRequired && (
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('memorandum')}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/60 transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Emitir Acta Compromiso / Memorándum</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onAskNexus && (
                    <button
                      type="button"
                      onClick={() => onAskNexus('¿Qué sucede exactamente cuando un estudiante acumula tres llamados de atención verbales según el reglamento de disciplina?')}
                      className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-300 text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors border border-zinc-700"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Consultar esta sanción a NEXUS</span>
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* SubTab 2: Official Memorandum / Acta de Compromiso Form & Preview */
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <h4 className="font-bold text-sm text-zinc-100">
                  Generador de Acta de Compromiso Disciplinaria Oficial
                </h4>
                <p className="text-xs text-zinc-400">
                  Formato reglamentario del Instituto Nacional Cantón Lourdes (INDEL) suscrito con el Referente de Familia
                </p>
              </div>

              <button
                type="button"
                onClick={handlePrintMemorandum}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-md shadow-emerald-950"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Exportar Acta</span>
              </button>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-zinc-900/90 p-4 rounded-xl border border-zinc-800">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Nombre del Estudiante:</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Grado y Especialidad:</label>
                <input
                  type="text"
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Referente de Familia (Ley Crecer Juntos):</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Docente Coordinador / Autoridad:</label>
                <input
                  type="text"
                  value={teacherCoordinator}
                  onChange={(e) => setTeacherCoordinator(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-zinc-300">Motivo de la Falta Grave / Deméritos Acumulados:</label>
                <textarea
                  rows={2}
                  value={memorandumReason}
                  onChange={(e) => setMemorandumReason(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200 font-sans"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-zinc-300">Acciones de Disciplina Positiva / Trabajo Comunitario:</label>
                <textarea
                  rows={2}
                  value={positiveDisciplineAction}
                  onChange={(e) => setPositiveDisciplineAction(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-200 font-sans"
                />
              </div>
            </div>

            {/* Official Printable Preview Sheet */}
            <div className="bg-white text-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-300 space-y-5 text-xs font-sans">
              
              {/* Header */}
              <div className="border-b-2 border-zinc-900 pb-3 flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    República de El Salvador • Ministerio de Educación
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-zinc-950">
                    INSTITUTO NACIONAL CANTÓN LOURDES (INDEL)
                  </h2>
                  <div className="text-xs text-zinc-600">
                    6.ª Avenida Sur Colonia Las Arboledas, Lourdes Colón • Tel: 2338-4571
                  </div>
                </div>

                <div className="text-right font-mono text-[10px] text-zinc-700">
                  <div className="font-bold text-zinc-900">ACTA COMPROMISO DISCIPLINARIA</div>
                  <div>FOLIO: INDEL-ACTA-{Date.now().toString().slice(-4)}</div>
                  <div>Fecha: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>

              <div className="text-center py-1">
                <h3 className="font-black text-sm uppercase tracking-wider text-zinc-900">
                  MEMORÁNDUM Y ACTA COMPROMISO POR REINCIDENCIA O FALTA GRAVE
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Sustento Reglamentario: DOC-DISC-02, Sección III (Faltas Graves y Deméritos)
                </span>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-[11px]">
                <div>
                  <span className="font-bold text-zinc-700">Estudiante: </span>
                  <span className="text-zinc-900 font-semibold">{studentName}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700">Grado/Sección: </span>
                  <span className="text-zinc-900">{studentGrade}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700">Referente de Familia: </span>
                  <span className="text-zinc-900">{parentName}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700">Docente / Coordinador: </span>
                  <span className="text-zinc-900">{teacherCoordinator}</span>
                </div>
              </div>

              {/* Legal text */}
              <div className="space-y-3 leading-relaxed text-zinc-800">
                <p>
                  En las instalaciones del <strong>Instituto Nacional Cantón Lourdes (INDEL)</strong>, comparecen el estudiante y su referente de familia ante la Coordinación Institucional, haciéndose constar la comisión de los siguientes hechos:
                </p>

                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-rose-950 font-medium text-[11px]">
                  <strong>Descripción de la falta o demérito: </strong>
                  {memorandumReason}
                </div>

                <p>
                  De conformidad con la normativa de convivencia estudiantil, el estudiante se compromete a enmendar su conducta mediante las siguientes <strong>acciones de disciplina positiva y servicio a la comunidad educativa</strong>:
                </p>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-zinc-800 text-[11px]">
                  <strong>Acción Asignada: </strong>
                  {positiveDisciplineAction}
                </div>

                <p className="text-[10px] text-zinc-600 italic">
                  * Advertencia: La reincidencia en faltas graves dará lugar a la suspensión temporal de clases presenciales con proceso multimodal, y en faltas muy graves al condicionamiento de matrícula y notificación a CONAPINA / PNC.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-6 pt-10 text-center text-[10px] border-t border-zinc-300">
                <div>
                  <div className="border-t border-zinc-700 pt-1 font-bold text-zinc-900">
                    Firma del Estudiante
                  </div>
                  <div className="text-zinc-500">{studentName}</div>
                </div>

                <div>
                  <div className="border-t border-zinc-700 pt-1 font-bold text-zinc-900">
                    Firma del Referente de Familia
                  </div>
                  <div className="text-zinc-500">{parentName}</div>
                </div>

                <div>
                  <div className="border-t border-zinc-700 pt-1 font-bold text-zinc-900">
                    Docente / Coordinación INDEL
                  </div>
                  <div className="text-zinc-500">{teacherCoordinator}</div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
};
