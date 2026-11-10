import type { CardPecaProps } from '../components/CardPeca/CardPeca'

const FAVORITES_PREFIX = 'breshop_favoritos_'
const FAVORITES_EVENT = 'favoritesUpdated'

function keyFor(userId: string) {
  return `${FAVORITES_PREFIX}${userId}`
}

export function getFavorites(userId?: string | null): CardPecaProps[] {
  if (!userId) return []
  try {
    const saved = localStorage.getItem(keyFor(userId))
    const parsed: unknown = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function toggleFavorite(userId: string, item: CardPecaProps): boolean {
  const favorites = getFavorites(userId)
  const exists = favorites.some((favorite) => String(favorite.id) === String(item.id))
  const updated = exists
    ? favorites.filter((favorite) => String(favorite.id) !== String(item.id))
    : [...favorites, item]
  localStorage.setItem(keyFor(userId), JSON.stringify(updated))
  window.dispatchEvent(new Event(FAVORITES_EVENT))
  return !exists
}

export function subscribeToFavorites(callback: () => void) {
  window.addEventListener(FAVORITES_EVENT, callback)
  return () => window.removeEventListener(FAVORITES_EVENT, callback)
}
