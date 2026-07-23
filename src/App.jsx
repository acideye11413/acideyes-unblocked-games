import React, { useState, useMemo } from 'react';
import { 
  getInitialGames, 
  getSavedCustomGames, 
  saveCustomGame, 
  deleteCustomGame, 
  getFavorites, 
  toggleFavoriteStorage, 
  getLikedGameIds, 
  toggleLikeStorage, 
  incrementPlayCountStorage,
  getExtraPlayCounts 
} from './utils/gameStorage.js';

import { Header } from './components/Header.jsx';
import { GameGrid } from './components/GameGrid.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonViewerModal } from './components/JsonViewerModal.jsx';
import { PanicModal } from './components/PanicModal.jsx';
import { ControlsGuideModal } from './components/ControlsGuideModal.jsx';
import { Gamepad2, FileJson, ShieldAlert } from 'lucide-react';

export default function App() {
  const [defaultGames] = useState(() => getInitialGames());
  const [customGames, setCustomGames] = useState(() => getSavedCustomGames());
  const [importedGames, setImportedGames] = useState([]);
  
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const [favorites, setFavorites] = useState(() => getFavorites());
  const [likes, setLikes] = useState(() => getLikedGameIds());
  const [playCounts, setPlayCounts] = useState(() => getExtraPlayCounts());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Combine all games datasets
  const allGames = useMemo(() => {
    const base = importedGames.length > 0 ? importedGames : [...customGames, ...defaultGames];
    return base.map(game => ({
      ...game,
      plays: game.plays + (playCounts[game.id] || 0)
    }));
  }, [defaultGames, customGames, importedGames, playCounts]);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let result = [...allGames];

    // Filter by Category or Favorites
    if (selectedCategory === 'Favorites') {
      result = result.filter(g => favorites.includes(g.id));
    } else if (selectedCategory !== 'All') {
      result = result.filter(g => g.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(g => 
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      );
    }

    // Sort Results
    result.sort((a, b) => {
      if (sortBy === 'popular') return b.plays - a.plays;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      if (sortBy === 'newest') return (b.addedAt || '').localeCompare(a.addedAt || '');
      return 0;
    });

    return result;
  }, [allGames, selectedCategory, searchQuery, sortBy, favorites]);

  // Handlers
  const handleToggleFavorite = (id) => {
    const updated = toggleFavoriteStorage(id);
    setFavorites(updated);
  };

  const handleCardToggleFavorite = (e, id) => {
    e.stopPropagation();
    handleToggleFavorite(id);
  };

  const handleToggleLike = (id) => {
    const updated = toggleLikeStorage(id);
    setLikes(updated);
  };

  const handleIncrementPlay = (id) => {
    const updated = incrementPlayCountStorage(id);
    setPlayCounts(updated);
  };

  const handleAddGame = (newGameData) => {
    const created = saveCustomGame(newGameData);
    setCustomGames(prev => [created, ...prev]);
    setSelectedGame(created);
  };

  const handleDeleteCustomGame = (e, id) => {
    e.stopPropagation();
    deleteCustomGame(id);
    setCustomGames(prev => prev.filter(g => g.id !== id));
    if (selectedGame?.id === id) {
      setSelectedGame(null);
    }
  };

  const handleRandomGame = () => {
    if (allGames.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allGames.length);
    setSelectedGame(allGames[randomIndex]);
  };

  const handleImportJson = (newGames) => {
    setImportedGames(newGames);
  };

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'} transition-colors selection:bg-emerald-500 selection:text-slate-950`}>
      
      {/* Panic Cloak Mode */}
      <PanicModal 
        isActive={isPanicActive}
        onDeactivate={() => setIsPanicActive(false)}
      />

      {/* Main Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        favoritesCount={favorites.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onRandomGame={handleRandomGame}
        onPanic={() => setIsPanicActive(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onGoHome={() => setSelectedGame(null)}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedGame ? (
          /* Active Game Player View */
          <GamePlayer
            game={selectedGame}
            isFavorite={favorites.includes(selectedGame.id)}
            isLiked={likes.includes(selectedGame.id)}
            onBack={() => setSelectedGame(null)}
            onToggleFavorite={handleToggleFavorite}
            onToggleLike={handleToggleLike}
            onIncrementPlay={handleIncrementPlay}
            onPanic={() => setIsPanicActive(true)}
            onOpenControlsModal={() => setIsControlsModalOpen(true)}
            onOpenJsonModal={() => setIsJsonModalOpen(true)}
          />
        ) : (
          /* Game Catalog Grid View */
          <GameGrid
            games={filteredGames}
            allGames={allGames}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            favorites={favorites}
            onSelectGame={(g) => setSelectedGame(g)}
            onToggleFavorite={handleCardToggleFavorite}
            onDeleteCustomGame={handleDeleteCustomGame}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onClearSearch={() => setSearchQuery('')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-200">Unblocked Games Hub</span>
            <span className="text-slate-500">• Stored as JSON iframe embeds</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button 
              onClick={() => setIsJsonModalOpen(true)} 
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>JSON File Data</span>
            </button>
            <button 
              onClick={() => setIsControlsModalOpen(true)} 
              className="hover:text-emerald-400 transition-colors"
            >
              Controls
            </button>
            <button 
              onClick={() => setIsPanicActive(true)} 
              className="hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Panic Cloak</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonViewerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={allGames}
        onImportJson={handleImportJson}
      />

      <ControlsGuideModal
        isOpen={isControlsModalOpen}
        onClose={() => setIsControlsModalOpen(false)}
      />

    </div>
  );
}
