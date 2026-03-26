const STORAGE_KEY = 'tf2_favorites';

export function getFavoriteIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids = JSON.parse(raw || '[]');
    return Array.isArray(ids) ? ids : [];
  } catch (e) {
    return [];
  }
}

export function isFavorite(id) {
  const ids = getFavoriteIds();
  return ids.includes(Number(id));
}

export function addFavorite(id) {
  const ids = getFavoriteIds();
  const numericId = Number(id);
  if (!ids.includes(numericId)) {
    ids.push(numericId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
  return ids;
}

export function removeFavorite(id) {
  const numericId = Number(id);
  const ids = getFavoriteIds().filter((x) => x !== numericId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  return ids;
}

export function toggleFavorite(id) {
  if (isFavorite(id)) {
    removeFavorite(id);
    return false;
  }
  addFavorite(id);
  return true;
}
