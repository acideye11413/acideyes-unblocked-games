import initialGamesData from '../data/games.json';

const CUSTOM_GAMES_KEY = 'unblocked_games_custom_v1';
const FAVORITES_KEY = 'unblocked_games_favorites_v1';
const LIKES_KEY = 'unblocked_games_likes_v1';
const PLAYS_KEY = 'unblocked_games_plays_v1';

export const getInitialGames = () => {
  return initialGamesData;
};

export const getSavedCustomGames = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_GAMES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to parse custom games from localStorage', e);
    return [];
  }
};

export const saveCustomGame = (game) => {
  const customGames = getSavedCustomGames();
  const newGame = {
    ...game,
    id: `custom-${Date.now()}`,
    rating: 5.0,
    plays: 1,
    isCustom: true,
    addedAt: new Date().toISOString()
  };

  const updated = [newGame, ...customGames];
  localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(updated));
  return newGame;
};

export const deleteCustomGame = (id) => {
  const customGames = getSavedCustomGames();
  const updated = customGames.filter(g => g.id !== id);
  localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(updated));
};

export const getFavorites = () => {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const toggleFavoriteStorage = (id) => {
  const current = getFavorites();
  const exists = current.includes(id);
  const updated = exists ? current.filter(favId => favId !== id) : [...current, id];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};

export const getLikedGameIds = () => {
  try {
    const saved = localStorage.getItem(LIKES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const toggleLikeStorage = (id) => {
  const current = getLikedGameIds();
  const exists = current.includes(id);
  const updated = exists ? current.filter(lId => lId !== id) : [...current, id];
  localStorage.setItem(LIKES_KEY, JSON.stringify(updated));
  return updated;
};

export const incrementPlayCountStorage = (id) => {
  try {
    const saved = localStorage.getItem(PLAYS_KEY);
    const counts = saved ? JSON.parse(saved) : {};
    counts[id] = (counts[id] || 0) + 1;
    localStorage.setItem(PLAYS_KEY, JSON.stringify(counts));
    return counts;
  } catch (e) {
    return {};
  }
};

export const getExtraPlayCounts = () => {
  try {
    const saved = localStorage.getItem(PLAYS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
};

export const extractIframeSrc = (input) => {
  const trimmed = input.trim();
  if (trimmed.startsWith('<iframe')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  }
  return trimmed;
};

export const generateIframeCode = (url, title = 'Game') => {
  return `<iframe src="${url}" title="${title}" width="100%" height="600" frameborder="0" scrolling="no" allowfullscreen allow="autoplay; gamepad; fullscreen"></iframe>`;
};
