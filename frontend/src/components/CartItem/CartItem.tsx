import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { formatPrice, type CartItem as CartItemData } from '../../utils/cart'
import './CartItem.css'

type CartItemProps = {
  item: CartItemData
  onRemove: (id: string) => void
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <article className={`cart-item ${item.disponivel ? '' : 'cart-item--unavailable'}`}>
      <Link to={`/pecas/${item.id}`} className="cart-item__image">
        {item.imageUrl ? <img src={item.imageUrl} alt={item.nome} /> : <span>FOTO</span>}
      </Link>

      <div className="cart-item__info">
        <Link to={`/pecas/${item.id}`} className="cart-item__name">{item.nome}</Link>
        <Link to={`/brechos/${item.brechoId}`} className="cart-item__store">{item.brechoNome}</Link>
        <span className="cart-item__meta">Tamanho: {item.tamanho}</span>
        <span className="cart-item__meta">Preço: {formatPrice(item.preco)}</span>
        {!item.disponivel && <span className="cart-item__badge">Indisponível</span>}
      </div>

      <div className="cart-item__side">
        <span className="cart-item__qty" title="Cada peça de brechó é única">Quantidade: 1</span>
        <strong className="cart-item__subtotal">{formatPrice(item.preco)}</strong>
        <button type="button" className="cart-item__remove" onClick={() => onRemove(item.id)}>
          <Trash2 size={16} /> Remover
        </button>
      </div>
    </article>
  )
}
