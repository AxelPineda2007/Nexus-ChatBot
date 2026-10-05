import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Cpu, 
  Calculator, 
  Database, 
  Layers, 
  Upload,
  BookOpen,
  Sparkles,
  AlertOctagon,
  Palette,
  Check
} from 'lucide-react';
import { ThemeColor } from '../types';

interface HeaderProps {
  activeTab: 'chat' | 'vault' | 'demerits' | 'simulator' | 'vector' | 'ingest';
  setActiveTab: (tab: 'chat' | 'vault' | 'demerits' | 'simulator' | 'vector' | 'ingest') => void;
  strictMode: boolean;
  setStrictMode: (strict: boolean) => void;
  totalDocuments: number;
  currentTheme: ThemeColor;
  onSelectTheme: (theme: ThemeColor) => void;
}

const THEME_CONFIG = {
  emerald: {
    name: 'Esmeralda',
    tag: 'Verde Oficial',
    dot: 'bg-emerald-500',
    headerBg: 'bg-[#0b0e0c]/95',
    activeTabBg: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-emerald-950',
    logoGradient: 'from-emerald-600 via-teal-600 to-emerald-500',
    badge: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    accentText: 'text-emerald-400',
    toggleActive: 'bg-emerald-600',
    ping: 'bg-emerald-400',
  },
  amber: {
    name: 'Ámbar',
    tag: 'Dorado Cálido',
    dot: 'bg-amber-500',
    headerBg: 'bg-[#0f0e0b]/95',
    activeTabBg: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-950',
    logoGradient: 'from-amber-600 via-orange-500 to-amber-500',
    badge: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
    accentText: 'text-amber-400',
    toggleActive: 'bg-amber-600',
    ping: 'bg-amber-400',
  },
  violet: {
    name: 'Amatista',
    tag: 'Púrpura Neón',
    dot: 'bg-purple-500',
    headerBg: 'bg-[#0e0c12]/95',
    activeTabBg: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-purple-950',
    logoGradient: 'from-purple-600 via-violet-500 to-indigo-500',
    badge: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
    accentText: 'text-purple-400',
    toggleActive: 'bg-purple-600',
    ping: 'bg-purple-400',
  },
  crimson: {
    name: 'Carmesí',
    tag: 'Rubí Obsidiana',
    dot: 'bg-rose-500',
    headerBg: 'bg-[#100c0d]/95',
    activeTabBg: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-950',
    logoGradient: 'from-rose-600 via-pink-600 to-red-500',
    badge: 'bg-rose-950/80 text-rose-400 border-rose-800/60',
    accentText: 'text-rose-400',
    toggleActive: 'bg-rose-600',
    ping: 'bg-rose-400',
  }
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  strictMode,
  setStrictMode,
  totalDocuments,
  currentTheme,
  onSelectTheme
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const theme = THEME_CONFIG[currentTheme];

  return (
    <header className={`sticky top-0 z-30 ${theme.headerBg} backdrop-blur-md border-b border-zinc-800/90 transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr ${theme.logoGradient} shadow-lg text-white font-bold`}>
              <Cpu className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.ping} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${theme.dot}`}></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  NEXUS
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full border ${theme.badge}`}>
                  RAG Core 2026
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Instituto Nacional Cantón Lourdes • <strong className={`${theme.accentText} font-medium`}>INDEL</strong>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'chat'
                  ? `${theme.activeTabBg} shadow-sm`
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consultas RAG</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'vault'
                  ? `${theme.activeTabBg} shadow-sm`
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bóveda Documental</span>
              <span className={`text-[10px] bg-zinc-800 px-1.5 py-0.2 rounded-full ${theme.accentText} font-mono`}>
                {totalDocuments}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('demerits')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'demerits'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-300" />
              <span>Deméritos & Memorándum</span>
            </button>

            <button
              onClick={() => setActiveTab('vector')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'vector'
                  ? `${theme.activeTabBg} shadow-sm`
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Espacio Vectorial</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'simulator'
                  ? `${theme.activeTabBg} shadow-sm`
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulador</span>
            </button>

            <button
              onClick={() => setActiveTab('ingest')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ingest'
                  ? `${theme.activeTabBg} shadow-sm`
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ingesta RAG</span>
            </button>
          </nav>

          {/* Right Controls: Theme Selector + Strict Toggle */}
          <div className="flex items-center space-x-2">
            
            {/* Theme Picker Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-1.5 px-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white transition-all shadow-sm"
                title="Cambiar color de interfaz"
              >
                <Palette className="w-3.5 h-3.5 text-zinc-400" />
                <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`}></span>
                <span className="hidden lg:inline text-[11px] font-semibold">{theme.name}</span>
              </button>

              {isThemeMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsThemeMenuOpen(false)}
                >
                  <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 mb-1">
                    Color de Interfaz
                  </div>
                  {(Object.keys(THEME_CONFIG) as ThemeColor[]).map((tKey) => {
                    const t = THEME_CONFIG[tKey];
                    const isSelected = currentTheme === tKey;
                    return (
                      <button
                        key={tKey}
                        onClick={() => {
                          onSelectTheme(tKey);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all ${
                          isSelected 
                            ? 'bg-zinc-800 text-white font-semibold' 
                            : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`w-3 h-3 rounded-full ${t.dot}`}></span>
                          <span>{t.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Strict Guardrail Toggle */}
            <div 
              onClick={() => setStrictMode(!strictMode)}
              className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-1.5 px-2.5 rounded-xl cursor-pointer select-none transition-all group"
              title="Garantía RAG: Si no está en los documentos oficiales, no inventa."
            >
              <ShieldCheck className={`w-4 h-4 transition-colors ${strictMode ? theme.accentText : 'text-amber-400'}`} />
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-semibold text-zinc-200 leading-tight">
                  {strictMode ? 'Fidelidad RAG' : 'Asistido'}
                </div>
                <div className="text-[9px] text-zinc-400">
                  {strictMode ? 'Cero Alucinación' : 'Ampliado'}
                </div>
              </div>
              <div className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors ${strictMode ? theme.toggleActive : 'bg-zinc-700'}`}>
                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${strictMode ? 'translate-x-3' : 'translate-x-0'}`} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile subnavigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-zinc-800/80 bg-zinc-950/95 px-2 py-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center text-[10px] ${activeTab === 'chat' ? `${theme.accentText} font-semibold` : 'text-zinc-400'}`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span>Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`flex flex-col items-center text-[10px] ${activeTab === 'vault' ? `${theme.accentText} font-semibold` : 'text-zinc-400'}`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Bóveda</span>
        </button>
        <button
          onClick={() => setActiveTab('demerits')}
          className={`flex flex-col items-center text-[10px] ${activeTab === 'demerits' ? 'text-rose-400 font-semibold' : 'text-zinc-400'}`}
        >
          <AlertOctagon className="w-4 h-4 mb-0.5" />
          <span>Faltas</span>
        </button>
        <button
          onClick={() => setActiveTab('vector')}
          className={`flex flex-col items-center text-[10px] ${activeTab === 'vector' ? `${theme.accentText} font-semibold` : 'text-zinc-400'}`}
        >
          <Layers className="w-4 h-4 mb-0.5" />
          <span>Vectores</span>
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex flex-col items-center text-[10px] ${activeTab === 'simulator' ? `${theme.accentText} font-semibold` : 'text-zinc-400'}`}
        >
          <Calculator className="w-4 h-4 mb-0.5" />
          <span>Simulador</span>
        </button>
        <button
          onClick={() => setActiveTab('ingest')}
          className={`flex flex-col items-center text-[10px] ${activeTab === 'ingest' ? `${theme.accentText} font-semibold` : 'text-zinc-400'}`}
        >
          <Upload className="w-4 h-4 mb-0.5" />
          <span>Ingesta</span>
        </button>
      </div>
    </header>
  );
};
