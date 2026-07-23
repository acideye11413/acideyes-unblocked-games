import React from 'react';
import { Gamepad2, Search, Plus, Heart, ShieldAlert, FileCode, Sparkles, X, Keyboard } from 'lucide-react';

const CATEGORIES = ['All', 'Favorites', 'Action', 'Arcade', 'Puzzle', 'Sports', 'Retro', 'Strategy', 'Casual'];

export default function Header({
  category,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  favoritesCount,
  onOpenAddModal,
  onOpenJsonModal,
  onOpenControlsModal,
  onOpenPanic,
  onSurpriseMe,
  onResetView
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo Branding */}
          <button
            onClick={onResetView}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
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
              <p className="text-xs text-slate-400">Play embeddable HTML5 games anytime</p>
            </div>
          </button>

          {/* Search Box */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by game title, category, or description..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={onSurpriseMe}
              className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Pick a Random Game"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Surprise Me</span>
            </button>
            
            <button
              onClick={onOpenAddModal}
              className="px-3 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Game</span>
            </button>

            <button
              onClick={onOpenJsonModal}
              className="px-3 py-2 text-xs font-medium bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg text-teal-400 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON Data</span>
            </button>

            <button
              onClick={onOpenControlsModal}
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700 rounded-lg transition-all cursor-pointer"
              title="Keyboard Controls & Shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenPanic}
              className="px-3 py-2 text-xs font-medium bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Panic Cloak Screen (Esc / ~)"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Panic Cloak</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950/40'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                {cat === 'Favorites' && <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-slate-950' : 'text-rose-400 fill-rose-400'}`} />}
                <span>{cat}</span>
                {cat === 'Favorites' && favoritesCount > 0 && (
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    isSelected ? 'bg-slate-950 text-emerald-400' : 'bg-rose-500/20 text-rose-300'
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
}
