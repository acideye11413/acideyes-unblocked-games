/**
 * Unblocked Games Engine
 * Pure Vanilla JavaScript Application
 */

const STORAGE_KEYS = {
  CUSTOM_GAMES: 'unblocked_custom_games_v2',
  FAVORITES: 'unblocked_favorites_v2',
  LIKES: 'unblocked_likes_v2',
  PLAYS: 'unblocked_plays_v2',
  THEME: 'unblocked_theme_v2'
};

const STATE = {
  defaultGames: [],
  customGames: JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_GAMES) || '[]'),
  importedGames: [],
  favorites: JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]'),
  likes: JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || '[]'),
  plays: JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYS) || '{}'),
  selectedGame: null,
  category: 'All',
  searchQuery: '',
  sortBy: 'popular',
  isPanic: false,
  isAddModalOpen: false,
  isJsonModalOpen: false,
  isControlsModalOpen: false,
  isTheater: false,
  theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'dark'
};

const CATEGORIES = ['All', 'Favorites', 'Action', 'Arcade', 'Puzzle', 'Sports', 'Retro', 'Strategy', 'Casual'];

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  await loadDefaultGames();
  applyTheme();
  setupEventListeners();
  render();
});

// Load JSON Games
async function loadDefaultGames() {
  try {
    const response = await fetch('./data/games.json');
    if (response.ok) {
      STATE.defaultGames = await response.json();
    }
  } catch (err) {
    console.error('Failed to load data/games.json', err);
    STATE.defaultGames = [];
  }
}

// Get All Combined Games
function getAllGames() {
  const base = STATE.importedGames.length > 0 
    ? STATE.importedGames 
    : [...STATE.customGames, ...STATE.defaultGames];

  return base.map(game => ({
    ...game,
    plays: (game.plays || 0) + (STATE.plays[game.id] || 0)
  }));
}

// Filter and Sort Games
function getFilteredGames() {
  let list = getAllGames();

  if (STATE.category === 'Favorites') {
    list = list.filter(g => STATE.favorites.includes(g.id));
  } else if (STATE.category !== 'All') {
    list = list.filter(g => g.category === STATE.category);
  }

  if (STATE.searchQuery.trim()) {
    const q = STATE.searchQuery.toLowerCase().trim();
    list = list.filter(g => 
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      (g.description && g.description.toLowerCase().includes(q))
    );
  }

  list.sort((a, b) => {
    if (STATE.sortBy === 'popular') return (b.plays || 0) - (a.plays || 0);
    if (STATE.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (STATE.sortBy === 'alphabetical') return a.title.localeCompare(b.title);
    if (STATE.sortBy === 'newest') return (b.addedAt || '').localeCompare(a.addedAt || '');
    return 0;
  });

  return list;
}

// Theme Application
function applyTheme() {
  const root = document.documentElement;
  if (STATE.theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// Event Listener Bindings
function setupEventListeners() {
  // Panic Mode Shortcut (Esc or ~)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === '`') {
      if (STATE.isPanic) {
        STATE.isPanic = false;
        render();
      }
    }
  });
}

// Main State Render Loop
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  // If Panic Mode is Active
  if (STATE.isPanic) {
    app.innerHTML = renderPanicScreen();
    bindPanicEvents();
    return;
  }

  const filteredGames = getFilteredGames();
  const allGames = getAllGames();

  app.innerHTML = `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      <!-- Sticky Navigation Header -->
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex flex-col md:flex-row items-center justify-between gap-3">
            
            <!-- Branding Logo -->
            <button id="btn-logo" class="flex items-center gap-2.5 text-left group focus:outline-none">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z"></path></svg>
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <h1 class="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                    Unblocked Games
                  </h1>
                  <span class="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-semibold">
                    JSON Engine
                  </span>
                </div>
                <p class="text-xs text-slate-400">Play embeddable HTML5 games anytime</p>
              </div>
            </button>

            <!-- Search Bar -->
            <div class="relative w-full md:max-w-md">
              <input
                id="search-input"
                type="text"
                value="${escapeHtml(STATE.searchQuery)}"
                placeholder="Search by game name, category, or keyword..."
                class="w-full pl-10 pr-9 py-2 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
              />
              <svg class="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              ${STATE.searchQuery ? `<button id="btn-clear-search" class="absolute right-3 top-2.5 text-slate-400 hover:text-white">✕</button>` : ''}
            </div>

            <!-- Action Toolbar Buttons -->
            <div class="flex items-center gap-2">
              <button id="btn-surprise" class="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 transition-all">
                🔀 Surprise Me
              </button>
              <button id="btn-add-game" class="px-3 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 rounded-lg text-slate-100 font-semibold shadow-md transition-all">
                ➕ Add Game
              </button>
              <button id="btn-json-modal" class="px-3 py-2 text-xs font-medium bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg text-teal-400 transition-all">
                📄 JSON Data
              </button>
              <button id="btn-panic" class="px-3 py-2 text-xs font-medium bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 rounded-lg transition-colors">
                🛡️ Panic Button
              </button>
            </div>
          </div>

          <!-- Category Pills -->
          <div class="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            ${CATEGORIES.map(cat => {
              const isSelected = STATE.category === cat;
              return `
                <button
                  data-category="${cat}"
                  class="btn-category flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950/40'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                  }"
                >
                  ${cat === 'Favorites' ? '❤️ ' : ''}
                  <span>${cat}</span>
                  ${cat === 'Favorites' && STATE.favorites.length > 0 ? `<span class="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500/20 text-rose-300 font-bold">${STATE.favorites.length}</span>` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </header>

      <!-- Main Body Content -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        ${STATE.selectedGame ? renderPlayerView(STATE.selectedGame) : renderGridView(filteredGames, allGames)}
      </main>

      <!-- Footer -->
      <footer class="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">🎮</span>
            <span class="font-semibold text-slate-200">Unblocked Games Hub</span>
            <span class="text-slate-500">• JSON Iframe Embed Engine</span>
          </div>
          <div class="flex items-center gap-4 text-slate-400">
            <button id="footer-btn-json" class="hover:text-emerald-400">JSON File Data</button>
            <button id="footer-btn-controls" class="hover:text-emerald-400">Controls</button>
            <button id="footer-btn-panic" class="hover:text-rose-400">Panic Cloak</button>
          </div>
        </div>
      </footer>

      <!-- Modals -->
      ${STATE.isAddModalOpen ? renderAddModal() : ''}
      ${STATE.isJsonModalOpen ? renderJsonModal(allGames) : ''}
      ${STATE.isControlsModalOpen ? renderControlsModal() : ''}

    </div>
  `;

  bindAppEvents();
}

// Render Grid Catalog
function renderGridView(games, allGames) {
  const featuredGames = allGames.filter(g => g.featured);
  const showHero = STATE.category === 'All' && !STATE.searchQuery && featuredGames.length > 0;

  return `
    <div class="space-y-8 animate-fade-in">
      ${showHero ? `
        <section class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 md:p-8 shadow-2xl">
          <div class="relative z-10 max-w-2xl space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              🔥 Spotlight Featured Game
            </div>
            <h2 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Play High-Speed <span class="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">2048 & Hextris</span>
            </h2>
            <p class="text-sm md:text-base text-slate-300 leading-relaxed">
              Every game is embedded directly via HTML5 JSON iframe code. Unblocked access, fullscreen theater mode, and instant play.
            </p>
            <div class="pt-2 flex flex-wrap items-center gap-3">
              <button data-game-id="${featuredGames[0].id}" class="btn-play-game inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/30">
                ▶ Play Spotlight Game
              </button>
              <button id="hero-add-btn" class="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-medium rounded-xl text-sm border border-slate-700/80">
                ➕ Embed Custom Iframe
              </button>
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Grid Header Controls -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold text-slate-100">
              ${STATE.category === 'Favorites' ? 'Favorite Games' : STATE.category === 'All' ? 'All Unblocked Games' : STATE.category + ' Games'}
            </h2>
            <span class="px-2.5 py-0.5 text-xs font-mono font-semibold bg-slate-800 text-emerald-400 border border-slate-700 rounded-full">
              ${games.length}
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">
            ${STATE.searchQuery ? `Search results for "${escapeHtml(STATE.searchQuery)}"` : 'Stored in games.json with iframe rendering'}
          </p>
        </div>

        <!-- Sort Select -->
        <div class="flex items-center gap-2">
          <label class="text-xs text-slate-400">Sort by:</label>
          <select id="sort-select" class="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500">
            <option value="popular" ${STATE.sortBy === 'popular' ? 'selected' : ''}>Most Popular</option>
            <option value="rating" ${STATE.sortBy === 'rating' ? 'selected' : ''}>Highest Rated</option>
            <option value="alphabetical" ${STATE.sortBy === 'alphabetical' ? 'selected' : ''}>Alphabetical (A-Z)</option>
            <option value="newest" ${STATE.sortBy === 'newest' ? 'selected' : ''}>Recently Added</option>
          </select>
        </div>
      </div>

      <!-- Games Cards Grid -->
      ${games.length > 0 ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          ${games.map(game => renderGameCard(game)).join('')}
        </div>
      ` : `
        <div class="py-16 text-center bg-slate-800/40 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center border border-slate-700 text-2xl">
            🎮
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-bold text-slate-200">No games found</h3>
            <p class="text-sm text-slate-400">Try adjusting your category filters or search query.</p>
          </div>
        </div>
      `}
    </div>
  `;
}

// Render Game Card Item
function renderGameCard(game) {
  const isFav = STATE.favorites.includes(game.id);

  return `
    <div
      data-game-id="${game.id}"
      class="btn-play-game group relative bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col"
    >
      <div class="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src="${escapeHtml(game.thumbnail)}"
          alt="${escapeHtml(game.title)}"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        
        <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span class="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md bg-slate-950/80 text-emerald-400 border border-emerald-500/30">
            ${escapeHtml(game.category)}
          </span>
          <button
            data-fav-id="${game.id}"
            class="btn-fav-toggle pointer-events-auto p-1.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-rose-400 border border-slate-700/50 transition-transform"
            title="Toggle Favorite"
          >
            ${isFav ? '❤️' : '🤍'}
          </button>
        </div>

        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-lg">
            ▶
          </div>
        </div>
      </div>

      <div class="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-slate-100 text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
            ${escapeHtml(game.title)}
          </h3>
          <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            ${escapeHtml(game.description || '')}
          </p>
        </div>

        <div class="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
          <span class="text-amber-400 font-medium">★ ${(game.rating || 4.8).toFixed(1)}</span>
          <span class="font-mono text-[11px]">${(game.plays || 0).toLocaleString()} plays</span>
        </div>
      </div>
    </div>
  `;
}

// Render Game Player Screen
function renderPlayerView(game) {
  const isFav = STATE.favorites.includes(game.id);
  const isLiked = STATE.likes.includes(game.id);

  return `
    <div class="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <button id="btn-back" class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors">
          ⬅ Back to Games Catalog
        </button>
        <div class="flex items-center gap-3">
          <span class="px-2.5 py-1 text-xs font-semibold uppercase rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ${escapeHtml(game.category)}
          </span>
          <h2 class="text-xl md:text-2xl font-extrabold text-slate-100">
            ${escapeHtml(game.title)}
          </h2>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-controls-modal" class="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300">
            ⌨️ Controls
          </button>
          <button id="btn-player-panic" class="p-2 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg">
            🛡️
          </button>
        </div>
      </div>

      <!-- Iframe Frame Container -->
      <div id="player-frame" class="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div class="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="font-mono text-emerald-400 text-[11px]">JSON Iframe Active</span>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-reload-iframe" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px]">🔄 Reload</button>
            <button id="btn-toggle-theater" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] ${STATE.isTheater ? 'text-emerald-400' : ''}">🎭 Theater</button>
            <button id="btn-fullscreen" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px]">⛶ Fullscreen</button>
          </div>
        </div>

        <div class="relative w-full ${STATE.isTheater ? 'h-[80vh]' : 'aspect-[16/9] min-h-[500px]'}">
          <iframe
            id="game-iframe"
            src="${escapeHtml(game.iframeUrl)}"
            title="${escapeHtml(game.title)}"
            class="w-full h-full border-0 bg-slate-950"
            allow="autoplay; gamepad; fullscreen; keyboard"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <!-- Details Box -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-5">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div>
            <h3 class="text-lg font-bold text-slate-100">${escapeHtml(game.title)}</h3>
            <p class="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">${escapeHtml(game.description || '')}</p>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-player-fav" class="px-3.5 py-2 rounded-xl text-xs font-semibold border ${isFav ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-900 border-slate-700'}">
              ${isFav ? '❤️ Favorited' : '🤍 Favorite'}
            </button>
            <button id="btn-player-like" class="px-3.5 py-2 rounded-xl text-xs font-semibold border ${isLiked ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 border-slate-700'}">
              ${isLiked ? '👍 Liked' : '👍 Like'}
            </button>
            <button id="btn-open-tab" class="px-3 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs">
              🔗 Open in New Tab
            </button>
          </div>
        </div>

        ${game.controls && game.controls.length > 0 ? `
          <div>
            <h4 class="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Game Controls</h4>
            <div class="flex flex-wrap gap-2">
              ${game.controls.map(c => `<span class="px-3 py-1 bg-slate-950 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono">${escapeHtml(c)}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Render Panic Mode Screen
function renderPanicScreen() {
  return `
    <div class="fixed inset-0 z-50 bg-white text-slate-800 font-sans overflow-y-auto select-none">
      <header class="bg-slate-100 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">🎓</div>
          <div>
            <h1 class="text-base font-semibold text-slate-900">Google Classroom & Study Portal</h1>
            <p class="text-xs text-slate-500">Computer Science & Mathematics Unit 4</p>
          </div>
        </div>
        <button id="btn-exit-panic" class="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-mono">
          Press Esc / Click to Return
        </button>
      </header>

      <main class="max-w-4xl mx-auto py-8 px-6 space-y-6">
        <div class="bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-2xl p-6 shadow-md">
          <span class="text-xs font-semibold uppercase bg-white/20 px-2.5 py-1 rounded-md">Active Reading</span>
          <h2 class="text-2xl font-bold mt-2">Binary Search Trees & Algorithmic Complexity</h2>
          <p class="text-xs text-teal-100 mt-1">Due Today, 11:59 PM • 100 Points</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h3 class="font-bold text-slate-900 text-sm">Chapter 4 Reading Notes</h3>
            <p class="text-xs text-slate-600">Review in-order and post-order traversal properties in binary search tree structures before tomorrow's exam.</p>
          </div>
          <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h3 class="font-bold text-slate-900 text-sm">Lab Assignment 4</h3>
            <p class="text-xs text-slate-600">Complete exercise problems 1 through 5 on line-segment intersection algorithms.</p>
          </div>
        </div>
      </main>
    </div>
  `;
}

// Render Add Game Modal
function renderAddModal() {
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div class="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 class="text-base font-bold text-slate-100">Add Custom Iframe Game</h3>
          <button id="btn-close-modal" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <form id="form-add-game" class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-300 mb-1">Game Title</label>
            <input id="add-title" type="text" placeholder="e.g. Slope 3D" required class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Category</label>
              <select id="add-category" class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100">
                ${CATEGORIES.filter(c => c !== 'All' && c !== 'Favorites').map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-300 mb-1">Thumbnail Image URL</label>
              <input id="add-thumb" type="text" placeholder="https://..." class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Iframe URL or HTML Embed Code</label>
            <textarea id="add-iframe" placeholder='https://game-url.com or <iframe src="..."></iframe>' required class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono h-20 resize-none"></textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-300 mb-1">Description</label>
            <input id="add-desc" type="text" placeholder="Short gameplay description..." class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100" />
          </div>

          <div class="pt-3 flex justify-end gap-2">
            <button type="button" id="btn-cancel-modal" class="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
            <button type="submit" class="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl">Save Game</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Render JSON Data Engine Modal
function renderJsonModal(games) {
  const jsonStr = JSON.stringify(games, null, 2);

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div class="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 class="text-base font-bold text-slate-100">games.json Data Engine</h3>
          <div class="flex items-center gap-2">
            <button id="btn-copy-json" class="px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs">Copy JSON</button>
            <button id="btn-download-json" class="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs">Download</button>
            <button id="btn-close-modal" class="text-slate-400 hover:text-white ml-2">✕</button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl font-mono text-xs text-emerald-400">
          <pre>${escapeHtml(jsonStr)}</pre>
        </div>
      </div>
    </div>
  `;
}

// Render Controls Modal
function renderControlsModal() {
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div class="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 class="text-base font-bold text-slate-100">Controls & Shortcuts</h3>
          <button id="btn-close-modal" class="text-slate-400 hover:text-white">✕</button>
        </div>
        <div class="space-y-3 text-xs text-slate-300">
          <p><strong>WASD / Arrow Keys:</strong> Character & Navigation Movement</p>
          <p><strong>Spacebar / Mouse Click:</strong> Jump / Action Trigger</p>
          <p><strong>Esc / ~:</strong> Activate Panic Cloak Screen</p>
        </div>
      </div>
    </div>
  `;
}

// Event Bindings
function bindAppEvents() {
  // Category buttons
  document.querySelectorAll('.btn-category').forEach(btn => {
    btn.addEventListener('click', () => {
      STATE.category = btn.getAttribute('data-category');
      STATE.selectedGame = null;
      render();
    });
  });

  // Search Input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      STATE.searchQuery = e.target.value;
      render();
    });
  }

  const btnClearSearch = document.getElementById('btn-clear-search');
  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      STATE.searchQuery = '';
      render();
    });
  }

  // Sort Select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      STATE.sortBy = e.target.value;
      render();
    });
  }

  // Play Game Buttons
  document.querySelectorAll('.btn-play-game').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-fav-toggle')) return;
      const id = card.getAttribute('data-game-id');
      const game = getAllGames().find(g => g.id === id);
      if (game) {
        STATE.selectedGame = game;
        // Increment play count
        STATE.plays[id] = (STATE.plays[id] || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.PLAYS, JSON.stringify(STATE.plays));
        render();
      }
    });
  });

  // Favorite Toggles on cards
  document.querySelectorAll('.btn-fav-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-fav-id');
      toggleFavorite(id);
    });
  });

  // Logo button
  const logo = document.getElementById('btn-logo');
  if (logo) {
    logo.addEventListener('click', () => {
      STATE.selectedGame = null;
      render();
    });
  }

  // Surprise Me Button
  const surpriseBtn = document.getElementById('btn-surprise');
  if (surpriseBtn) {
    surpriseBtn.addEventListener('click', () => {
      const games = getAllGames();
      if (games.length > 0) {
        const rand = games[Math.floor(Math.random() * games.length)];
        STATE.selectedGame = rand;
        render();
      }
    });
  }

  // Add Game Modal Open
  const addBtn = document.getElementById('btn-add-game');
  if (addBtn) addBtn.addEventListener('click', () => { STATE.isAddModalOpen = true; render(); });

  const heroAddBtn = document.getElementById('hero-add-btn');
  if (heroAddBtn) heroAddBtn.addEventListener('click', () => { STATE.isAddModalOpen = true; render(); });

  // JSON Modal Open
  const jsonBtn = document.getElementById('btn-json-modal');
  if (jsonBtn) jsonBtn.addEventListener('click', () => { STATE.isJsonModalOpen = true; render(); });

  const footerJsonBtn = document.getElementById('footer-btn-json');
  if (footerJsonBtn) footerJsonBtn.addEventListener('click', () => { STATE.isJsonModalOpen = true; render(); });

  // Panic Button
  const panicBtn = document.getElementById('btn-panic');
  if (panicBtn) panicBtn.addEventListener('click', () => { STATE.isPanic = true; render(); });

  const playerPanicBtn = document.getElementById('btn-player-panic');
  if (playerPanicBtn) playerPanicBtn.addEventListener('click', () => { STATE.isPanic = true; render(); });

  const footerPanicBtn = document.getElementById('footer-btn-panic');
  if (footerPanicBtn) footerPanicBtn.addEventListener('click', () => { STATE.isPanic = true; render(); });

  // Controls Modal Open
  const controlsBtn = document.getElementById('btn-controls-modal');
  if (controlsBtn) controlsBtn.addEventListener('click', () => { STATE.isControlsModalOpen = true; render(); });

  const footerControlsBtn = document.getElementById('footer-btn-controls');
  if (footerControlsBtn) footerControlsBtn.addEventListener('click', () => { STATE.isControlsModalOpen = true; render(); });

  // Back Button
  const backBtn = document.getElementById('btn-back');
  if (backBtn) backBtn.addEventListener('click', () => { STATE.selectedGame = null; render(); });

  // Player Actions
  const btnPlayerFav = document.getElementById('btn-player-fav');
  if (btnPlayerFav && STATE.selectedGame) {
    btnPlayerFav.addEventListener('click', () => toggleFavorite(STATE.selectedGame.id));
  }

  const btnPlayerLike = document.getElementById('btn-player-like');
  if (btnPlayerLike && STATE.selectedGame) {
    btnPlayerLike.addEventListener('click', () => {
      const id = STATE.selectedGame.id;
      if (STATE.likes.includes(id)) {
        STATE.likes = STATE.likes.filter(x => x !== id);
      } else {
        STATE.likes.push(id);
      }
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(STATE.likes));
      render();
    });
  }

  const btnOpenTab = document.getElementById('btn-open-tab');
  if (btnOpenTab && STATE.selectedGame) {
    btnOpenTab.addEventListener('click', () => window.open(STATE.selectedGame.iframeUrl, '_blank'));
  }

  const btnReloadIframe = document.getElementById('btn-reload-iframe');
  if (btnReloadIframe) {
    btnReloadIframe.addEventListener('click', () => {
      const iframe = document.getElementById('game-iframe');
      if (iframe) iframe.src = iframe.src;
    });
  }

  const btnToggleTheater = document.getElementById('btn-toggle-theater');
  if (btnToggleTheater) {
    btnToggleTheater.addEventListener('click', () => {
      STATE.isTheater = !STATE.isTheater;
      render();
    });
  }

  const btnFullscreen = document.getElementById('btn-fullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      const frame = document.getElementById('player-frame');
      if (frame) {
        if (!document.fullscreenElement) {
          frame.requestFullscreen().catch(e => console.error(e));
        } else {
          document.exitFullscreen().catch(e => console.error(e));
        }
      }
    });
  }

  // Modal Closes
  document.querySelectorAll('#btn-close-modal, #btn-cancel-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      STATE.isAddModalOpen = false;
      STATE.isJsonModalOpen = false;
      STATE.isControlsModalOpen = false;
      render();
    });
  });

  // Add Game Form Submit
  const addForm = document.getElementById('form-add-game');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('add-title').value.trim();
      const category = document.getElementById('add-category').value;
      const iframeInput = document.getElementById('add-iframe').value.trim();
      const thumbnail = document.getElementById('add-thumb').value.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80';
      const description = document.getElementById('add-desc').value.trim() || 'Custom user embedded HTML5 game.';

      const cleanUrl = extractIframeSrc(iframeInput);

      const newGame = {
        id: `custom-${Date.now()}`,
        title,
        category,
        iframeUrl: cleanUrl,
        iframeCode: `<iframe src="${cleanUrl}" title="${title}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`,
        thumbnail,
        description,
        controls: ['WASD / Arrow Keys: Play'],
        rating: 5.0,
        plays: 1,
        addedAt: new Date().toISOString()
      };

      STATE.customGames.unshift(newGame);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_GAMES, JSON.stringify(STATE.customGames));
      STATE.selectedGame = newGame;
      STATE.isAddModalOpen = false;
      render();
    });
  }

  // JSON Copy & Download
  const btnCopyJson = document.getElementById('btn-copy-json');
  if (btnCopyJson) {
    btnCopyJson.addEventListener('click', () => {
      const jsonStr = JSON.stringify(getAllGames(), null, 2);
      navigator.clipboard.writeText(jsonStr);
      btnCopyJson.textContent = 'Copied!';
      setTimeout(() => { btnCopyJson.textContent = 'Copy JSON'; }, 2000);
    });
  }

  const btnDownloadJson = document.getElementById('btn-download-json');
  if (btnDownloadJson) {
    btnDownloadJson.addEventListener('click', () => {
      const jsonStr = JSON.stringify(getAllGames(), null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'games.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}

function bindPanicEvents() {
  const exitBtn = document.getElementById('btn-exit-panic');
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      STATE.isPanic = false;
      render();
    });
  }
}

function toggleFavorite(id) {
  if (STATE.favorites.includes(id)) {
    STATE.favorites = STATE.favorites.filter(x => x !== id);
  } else {
    STATE.favorites.push(id);
  }
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(STATE.favorites));
  render();
}

function extractIframeSrc(input) {
  const trimmed = input.trim();
  if (trimmed.startsWith('<iframe')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) return match[1];
  }
  return trimmed;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
