import React from 'react';
import GameCard from './GameCard';
import { Flame, Play, Plus, Gamepad2 } from 'lucide-react';

export default function GameGrid({
  games,
  allGames,
  category,
  searchQuery,
  sortBy,
  onSortChange,
  favorites,
  onPlay,
  onToggleFavorite,
  onOpenAddModal
}) {
  const featuredGame = allGames.find(g => g.featured) || allGames[0];
  const showHero = category === 'All' && !searchQuery && featuredGame;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Spotlight Featured Game Hero */}
      {showHero && (
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 md:p-8 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Spotlight Featured Game</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Play High-Speed <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{featuredGame.title}</span>
            </h2>
            
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              {featuredGame.description || 'Every game is embedded directly via HTML5 JSON iframe code. Unblocked access, fullscreen theater mode, and instant play.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onPlay(featuredGame)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/30 cursor-pointer transition-transform hover:scale-105"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Play Spotlight Game</span>
              </button>

              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-medium rounded-xl text-sm border border-slate-700/80 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Embed Custom Iframe</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Grid Controls & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100">
              {category === 'Favorites' ? 'Favorite Games' : category === 'All' ? 'All Unblocked Games' : `${category} Games`}
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold bg-slate-800 text-emerald-400 border border-slate-700 rounded-full">
              {games.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Stored in games.json with iframe rendering'}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
            <option value="newest">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Games Catalog Grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isFavorite={favorites.includes(game.id)}
              onPlay={onPlay}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-slate-800/40 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center border border-slate-700 text-2xl">
            <Gamepad2 className="w-8 h-8 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-200">No games found</h3>
            <p className="text-sm text-slate-400">Try adjusting your category filters or search query.</p>
          </div>
        </div>
      )}
    </div>
  );
}
