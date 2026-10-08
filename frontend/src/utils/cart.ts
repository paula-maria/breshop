// Cada peça de brechó é única: o carrinho guarda no máximo uma unidade por peça (sem quantidade).
const STORAGE_KEY = 'breshop_carrinho'
const EVENT_NAME = 'cartUpdated'

export type CartItem = {
  id: string
  nome: string
  brechoId: string
  brechoNome: string
  tamanho: string
  preco: number
  imageUrl: string
  disponivel: boolean
}

export function getCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(EVENT_NAME))
}

export function isInCart(id: string): boolean {
  return getCart().some((item) => item.id === id)
}

export function addToCart(item: CartItem) {
  const items = getCart()
  if (items.some((i) => i.id === item.id)) return
  saveCart([...items, item])
}

export function removeFromCart(id: string) {
  saveCart(getCart().filter((item) => item.id !== id))
}

export function subscribeToCart(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT_NAME, callback)
    window.removeEventListener('storage', callback)
  }
}

export function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`
}
