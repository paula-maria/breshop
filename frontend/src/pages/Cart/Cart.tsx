import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Copy, QrCode, ShoppingCart } from 'lucide-react'
import CartItem from '../../components/CartItem/CartItem'
import CartSummary from '../../components/CartSummary/CartSummary'
import Toast from '../../components/Toast/Toast'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'
import { formatPrice, getCart, removeFromCart, saveCart, subscribeToCart, type CartItem as CartItemData } from '../../utils/cart'
import './Cart.css'

export default function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [items, setItems] = useState<CartItemData[]>(getCart)
  const [toastOpen, setToastOpen] = useState(false)
  const [pedido, setPedido] = useState<{
    id: string
    status: string
    totalCentavos: number
    pagamento: { status: string; codigoPix: string; qrCodeDataUrl: string; aviso: string }
  } | null>(null)
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')

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

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setProcessing(true)
    setPaymentError('')
    try {
      const { data } = await api.post('/pedidos', { pecaIds: available.map((item) => item.id) })
      setPedido(data)
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } }).response?.data?.error
      setPaymentError(message ?? 'Não foi possível iniciar o pagamento. Tente atualizar o carrinho.')
    } finally {
      setProcessing(false)
    }
  }

  const simulatePayment = async (resultado: 'APROVADO' | 'RECUSADO') => {
    if (!pedido) return
    setProcessing(true)
    setPaymentError('')
    try {
      const { data } = await api.post(`/pedidos/${pedido.id}/pagamento/simular`, { resultado })
      setPedido({ ...pedido, status: resultado === 'APROVADO' ? 'PAGO' : 'CANCELADO', pagamento: data.pagamento })
      if (resultado === 'APROVADO') {
        saveCart([])
        setItems([])
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } }).response?.data?.error
      setPaymentError(message ?? 'Não foi possível concluir a simulação.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="cart-page">
      <header className="cart-page__header">
        <h1>Carrinho</h1>
        {items.length > 0 && (
          <p>{items.length} {items.length === 1 ? 'peça selecionada' : 'peças selecionadas'}</p>
        )}
      </header>

      {pedido ? (
        <section className="pix-checkout" aria-live="polite">
          {pedido.pagamento.status === 'PENDENTE' ? (
            <>
              <div className="pix-checkout__heading"><QrCode size={24} /><h2>Pix demonstrativo</h2></div>
              <p className="pix-checkout__notice">{pedido.pagamento.aviso}</p>
              <p>Pedido <strong>#{pedido.id.slice(0, 8)}</strong> · Total <strong>{formatPrice(pedido.totalCentavos / 100)}</strong></p>
              <img className="pix-checkout__qr" src={pedido.pagamento.qrCodeDataUrl} alt="QR Code Pix demonstrativo, sem cobrança real" />
              <label className="pix-checkout__code-label" htmlFor="pix-code">Código demonstrativo</label>
              <div className="pix-checkout__code">
                <input id="pix-code" readOnly value={pedido.pagamento.codigoPix} />
                <button type="button" aria-label="Copiar código demonstrativo" onClick={() => navigator.clipboard?.writeText(pedido.pagamento.codigoPix)}><Copy size={18} /></button>
              </div>
              <p className="pix-checkout__hint">Este QR representa apenas uma referência de teste da aplicação. Ele não pode ser pago por um banco.</p>
              <div className="pix-checkout__actions">
                <button type="button" className="btn btn-cyan-pill" disabled={processing} onClick={() => simulatePayment('APROVADO')}>{processing ? 'Processando...' : 'Simular pagamento aprovado'}</button>
                <button type="button" className="btn pix-checkout__reject" disabled={processing} onClick={() => simulatePayment('RECUSADO')}>Simular recusa</button>
              </div>
            </>
          ) : (
            <div className="pix-checkout__result">
              <CheckCircle2 size={42} />
              <h2>{pedido.pagamento.status === 'APROVADO' ? 'Pagamento simulado com sucesso' : 'Pagamento simulado como recusado'}</h2>
              <p>Pedido #{pedido.id.slice(0, 8)} · Status: {pedido.status}</p>
              <p className="pix-checkout__notice">Nenhuma transferência ou cobrança real foi realizada.</p>
              <Link to="/brechos?view=pecas" className="btn btn-cyan-pill">Voltar a explorar</Link>
            </div>
          )}
          {paymentError && <p className="pix-checkout__error" role="alert">{paymentError}</p>}
        </section>
      ) : items.length === 0 ? (
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
            loading={processing}
          />
        </div>
      )}

      {paymentError && !pedido && <p className="pix-checkout__error" role="alert">{paymentError}</p>}

      <Toast
        isOpen={toastOpen}
        message="A finalização do pedido estará disponível em breve."
        type="info"
        onClose={() => setToastOpen(false)}
      />
    </div>
  )
}
