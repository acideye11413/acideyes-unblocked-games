import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import GameGrid from './components/GameGrid';
import GamePlayer from './components/GamePlayer';
import AddGameModal from './components/AddGameModal';
import JsonViewerModal from './components/JsonViewerModal';
import ControlsModal from './components/ControlsModal';
import PanicModal from './components/PanicModal';

import defaultGamesData from './data/games.json';
import {
  getCustomGames,
  saveCustomGame,
  getFavorites,
  toggleFavoriteInStorage,
  getLikes,
  toggleLikeInStorage,
  getPlayCounts,
  recordPlay
} from './utils/gameStorage';

export default function App() {
  const [customGames, setCustomGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [likes, setLikes] = useState([]);
  const [playCounts, setPlayCounts] = useState({});

  const [selectedGame, setSelectedGame] = useState(null);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);

  // Initialize storage states on client mount
  useEffect(() => {
    setCustomGames(getCustomGames());
    setFavorites(getFavorites());
    setLikes(getLikes());
    setPlayCounts(getPlayCounts());
  }, []);

  // Keyboard shortcut for Panic Cloak (Esc or ~)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === '`') {
        setIsPanicActive(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Combined Games
  const allGames = useMemo(() => {
    const combined = [...customGames, ...defaultGamesData];
    return combined.map(game => ({
      ...game,
      plays: (game.plays || 0) + (playCounts[game.id] || 0)
    }));
  }, [customGames, playCounts]);

  // Filtered & Sorted Games
  const filteredGames = useMemo(() => {
    let list = [...allGames];

    if (category === 'Favorites') {
      list = list.filter(g => favorites.includes(g.id));
    } else if (category !== 'All') {
      list = list.filter(g => g.category === category);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        (g.description && g.description.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'popular') return (b.plays || 0) - (a.plays || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      if (sortBy === 'newest') return (b.addedAt || '').localeCompare(a.addedAt || '');
      return 0;
    });

    return list;
  }, [allGames, category, favorites, searchQuery, sortBy]);

  // Handlers
  const handlePlayGame = (game) => {
    setSelectedGame(game);
    const updatedCounts = recordPlay(game.id);
    setPlayCounts(updatedCounts);
  };

  const handleToggleFavorite = (id) => {
    const updated = toggleFavoriteInStorage(id);
    setFavorites(updated);
  };

  const handleToggleLike = (id) => {
    const updated = toggleLikeInStorage(id);
    setLikes(updated);
  };

  const handleAddGame = (newGame) => {
    const updated = saveCustomGame(newGame);
    setCustomGames(updated);
    setSelectedGame(newGame);
  };

  const handleSurpriseMe = () => {
    if (allGames.length > 0) {
      const randomIndex = Math.floor(Math.random() * allGames.length);
      handlePlayGame(allGames[randomIndex]);
    }
  };

  const handleResetView = () => {
    setSelectedGame(null);
    setCategory('All');
    setSearchQuery('');
  };

  if (isPanicActive) {
    return <PanicModal onExit={() => setIsPanicActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Header
        category={category}
        onSelectCategory={(cat) => {
          setCategory(cat);
          setSelectedGame(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenControlsModal={() => setIsControlsModalOpen(true)}
        onOpenPanic={() => setIsPanicActive(true)}
        onSurpriseMe={handleSurpriseMe}
        onResetView={handleResetView}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedGame ? (
          <GamePlayer
            game={selectedGame}
            isFavorite={favorites.includes(selectedGame.id)}
            isLiked={likes.includes(selectedGame.id)}
            onBack={() => setSelectedGame(null)}
            onToggleFavorite={handleToggleFavorite}
            onToggleLike={handleToggleLike}
            onOpenControlsModal={() => setIsControlsModalOpen(true)}
            onOpenPanic={() => setIsPanicActive(true)}
          />
        ) : (
          <GameGrid
            games={filteredGames}
            allGames={allGames}
            category={category}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            favorites={favorites}
            onPlay={handlePlayGame}
            onToggleFavorite={handleToggleFavorite}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">🎮</span>
            <span className="font-semibold text-slate-200">Unblocked Games Hub</span>
            <span className="text-slate-500">• JSON Iframe Embed Engine</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-emerald-400 cursor-pointer"
            >
              JSON File Data
            </button>
            <button
              onClick={() => setIsControlsModalOpen(true)}
              className="hover:text-emerald-400 cursor-pointer"
            >
              Controls
            </button>
            <button
              onClick={() => setIsPanicActive(true)}
              className="hover:text-rose-400 cursor-pointer"
            >
              Panic Cloak
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
      />

      <ControlsModal
        isOpen={isControlsModalOpen}
        onClose={() => setIsControlsModalOpen(false)}
      />

    </div>
  );
}
