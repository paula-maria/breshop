import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import CartItem from '../../components/CartItem/CartItem'
import CartSummary from '../../components/CartSummary/CartSummary'
import Toast from '../../components/Toast/Toast'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'
import { getCart, removeFromCart, saveCart, subscribeToCart, type CartItem as CartItemData } from '../../utils/cart'
import './Cart.css'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [items, setItems] = useState<CartItemData[]>(getCart)
  const [toastOpen, setToastOpen] = useState(false)

  useEffect(() => subscribeToCart(() => setItems(getCart())), [])

  // Atualiza preço e disponibilidade com os dados atuais de cada peça
  useEffect(() => {
    const current = getCart()
    if (current.length === 0) return

    let cancelled = false
    Promise.all(
      current.map(async (item) => {
        try {
          const { data } = await api.get(`/pecas/${item.id}`)
          return { ...item, preco: Number(data.preco), disponivel: data.disponivel } as CartItemData
        } catch (err: unknown) {
          const status = (err as { response?: { status?: number } }).response?.status
          return status === 404 ? { ...item, disponivel: false } : item
        }
      })
    ).then((refreshed) => {
      if (cancelled) return
      // Preserva remoções feitas enquanto a requisição estava em andamento
      const ids = new Set(getCart().map((i) => i.id))
      saveCart(refreshed.filter((i) => ids.has(i.id)))
    })

    return () => { cancelled = true }
  }, [])

  const available = items.filter((i) => i.disponivel)
  const subtotal = available.reduce((sum, i) => sum + i.preco, 0)

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }
    // O checkout/pagamento ainda não foi implementado
    setToastOpen(true)
  }

  return (
    <div className="cart-page">
      <header className="cart-page__header">
        <h1>Carrinho</h1>
        {items.length > 0 && (
          <p>{items.length} {items.length === 1 ? 'peça selecionada' : 'peças selecionadas'}</p>
        )}
      </header>

      {items.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty__icon"><ShoppingCart size={48} /></div>
          <h2>Seu carrinho está vazio</h2>
          <p>Você ainda não adicionou nenhuma peça.</p>
          <Link to="/brechos?view=pecas" className="btn btn-cyan-pill">Explorar peças</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-list">
            {items.map((item) => (
              <CartItem key={item.id} item={item} onRemove={removeFromCart} />
            ))}
          </section>

          <CartSummary
            subtotal={subtotal}
            hasUnavailable={available.length !== items.length}
            onCheckout={handleCheckout}
          />
        </div>
      )}

      <Toast
        isOpen={toastOpen}
        message="A finalização do pedido estará disponível em breve."
        type="info"
        onClose={() => setToastOpen(false)}
      />
    </div>
  )
}
