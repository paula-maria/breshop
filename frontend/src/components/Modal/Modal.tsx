import type { ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          {title && <h3>{title}</h3>}
          <button type="button" className="modal__close" onClick={onClose} aria-label="Fechar modal">
            <X size={18} />
          </button>
        </div>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  )
}
