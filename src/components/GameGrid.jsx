import React from 'react';
import { GameCard } from './GameCard';
import { Flame, Gamepad2, Plus, ArrowUpDown } from 'lucide-react';

export const GameGrid = ({
  games,
  allGames,
  selectedCategory,
  searchQuery,
  sortBy,
  setSortBy,
  favorites,
  onSelectGame,
  onToggleFavorite,
  onDeleteCustomGame,
  onOpenAddModal,
  onClearSearch
}) => {
  const featuredGames = allGames.filter(g => g.featured);
  const showHero = selectedCategory === 'All' && !searchQuery && featuredGames.length > 0;

  return (
    <div className="space-y-8">
      {/* Featured Hero Banner */}
      {showHero && (
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 md:p-8 shadow-2xl shadow-emerald-950/40">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Trending Spotlight</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Play High-Speed <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Slope Run & 2048</span>
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Every game is embedded directly via HTML5 JSON iframes. Enjoy unblocked access, fullscreen theater mode, and zero downloads.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectGame(featuredGames[0] || games[0])}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Play Spotlight Game</span>
              </button>

              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-medium rounded-xl text-sm border border-slate-700/80 transition-all"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Embed Your Own Iframe</span>
              </button>
            </div>
          </div>

          <div className="absolute top-1/2 right-6 -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none">
            <Gamepad2 className="w-72 h-72 text-emerald-400 transform rotate-12" />
          </div>
        </section>
      )}

      {/* Grid Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              {selectedCategory === 'Favorites' ? (
                <>Favorite Games</>
              ) : selectedCategory === 'All' ? (
                <>All Unblocked Games</>
              ) : (
                <>{selectedCategory} Games</>
              )}
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold bg-slate-800 text-emerald-400 border border-slate-700 rounded-full">
              {games.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Stored in games.json with iframe rendering'}
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort-select" className="text-xs text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
            <option value="newest">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Games Card Grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isFavorite={favorites.includes(game.id)}
              onSelectGame={onSelectGame}
              onToggleFavorite={onToggleFavorite}
              onDeleteCustomGame={onDeleteCustomGame}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-slate-800/40 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center border border-slate-700">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-200">No games found</h3>
            <p className="text-sm text-slate-400">
              {selectedCategory === 'Favorites'
                ? "You haven't saved any games to your favorites yet. Click the heart icon on any game card!"
                : searchQuery
                ? `No games matched your search for "${searchQuery}".`
                : "No games found in this category."}
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-colors"
            >
              Add Custom Iframe Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
