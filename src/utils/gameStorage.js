const STORAGE_KEYS = {
  CUSTOM_GAMES: 'unblocked_custom_games_v2',
  FAVORITES: 'unblocked_favorites_v2',
  LIKES: 'unblocked_likes_v2',
  PLAYS: 'unblocked_plays_v2'
};

export function getCustomGames() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_GAMES) || '[]');
  } catch (e) {
    return [];
  }
}

export function saveCustomGame(game) {
  const current = getCustomGames();
  const updated = [game, ...current];
  localStorage.setItem(STORAGE_KEYS.CUSTOM_GAMES, JSON.stringify(updated));
  return updated;
}

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
  } catch (e) {
    return [];
  }
}

export function toggleFavoriteInStorage(id) {
  const current = getFavorites();
  const exists = current.includes(id);
  const updated = exists ? current.filter(x => x !== id) : [...current, id];
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
  return updated;
}

export function getLikes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES) || '[]');
  } catch (e) {
    return [];
  }
}

export function toggleLikeInStorage(id) {
  const current = getLikes();
  const exists = current.includes(id);
  const updated = exists ? current.filter(x => x !== id) : [...current, id];
  localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(updated));
  return updated;
}

export function getPlayCounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYS) || '{}');
  } catch (e) {
    return {};
  }
}

export function recordPlay(id) {
  const current = getPlayCounts();
  current[id] = (current[id] || 0) + 1;
  localStorage.setItem(STORAGE_KEYS.PLAYS, JSON.stringify(current));
  return current;
}

export function extractIframeSrc(input) {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('<iframe')) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) return match[1];
  }
  return trimmed;
}
