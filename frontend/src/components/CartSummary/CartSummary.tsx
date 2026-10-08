import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/cart'
import './CartSummary.css'

type CartSummaryProps = {
  subtotal: number
  hasUnavailable: boolean
  onCheckout: () => void
}

export default function CartSummary({ subtotal, hasUnavailable, onCheckout }: CartSummaryProps) {
  return (
    <aside className="cart-summary">
      <h2 className="cart-summary__title">Resumo do pedido</h2>

      <div className="cart-summary__row">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      <hr className="cart-summary__divider" />

      <div className="cart-summary__row cart-summary__row--total">
        <span>Total</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      <p className="cart-summary__note">
        Os valores apresentados correspondem aos preços atuais das peças. Caso exista uma negociação em
        andamento, o valor poderá ser atualizado antes da confirmação do pedido.
      </p>

      {hasUnavailable && (
        <p className="cart-summary__warning">Remova as peças indisponíveis para finalizar o pedido.</p>
      )}

      <button
        type="button"
        className="btn btn-cyan-pill cart-summary__checkout"
        onClick={onCheckout}
        disabled={hasUnavailable || subtotal === 0}
      >
        Finalizar pedido
      </button>

      <Link to="/brechos?view=pecas" className="cart-summary__continue">Continuar comprando</Link>
    </aside>
  )
}
