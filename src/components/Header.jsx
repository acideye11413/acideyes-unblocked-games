import React from 'react';
import { 
  Gamepad2, 
  Search, 
  PlusCircle, 
  FileJson, 
  Shuffle, 
  ShieldAlert, 
  Heart, 
  Sparkles,
  X,
  Sun,
  Moon
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Favorites',
  'Action',
  'Arcade',
  'Puzzle',
  'Sports',
  'Retro',
  'Strategy',
  'Casual'
];

export const Header = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  favoritesCount,
  onOpenAddModal,
  onOpenJsonModal,
  onRandomGame,
  onPanic,
  darkMode,
  setDarkMode,
  onGoHome
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 dark:bg-slate-950/90 border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Row: Logo, Search, Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Branding */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <button 
              onClick={onGoHome}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                    Unblocked Games
                  </h1>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold">
                    JSON Engine
                  </span>
                </div>
                <p className="text-xs text-slate-400">Play embeddable browser games anytime</p>
              </div>
            </button>

            {/* Mobile Actions Right */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={onPanic}
                title="Panic Button (Classroom Cloak)"
                className="p-2 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
              >
                <ShieldAlert className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by game name, category, or keyword..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Tools */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onRandomGame}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              title="Pick a random game"
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Surprise Me</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-100 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all shadow-md shadow-emerald-900/30 hover:scale-[1.02] active:scale-[0.98]"
              title="Add custom iframe game"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Game</span>
            </button>

            <button
              onClick={onOpenJsonModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all"
              title="View JSON game configuration"
            >
              <FileJson className="w-3.5 h-3.5 text-teal-400" />
              <span>JSON Data</span>
            </button>

            <button
              onClick={onPanic}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
              title="Panic / Classroom Screen Shield"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Panic Button</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const isFav = cat === 'Favorites';

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? isFav
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                      : 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-950/40'
                    : isFav
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-rose-400 border border-rose-500/30'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                {isFav && <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-white' : 'fill-rose-400'}`} />}
                {cat === 'All' && <Sparkles className="w-3.5 h-3.5" />}
                <span>{cat}</span>
                {isFav && favoritesCount > 0 && (
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {favoritesCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
