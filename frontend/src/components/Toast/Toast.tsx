import './Toast.css'
import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

type ToastProps = {
  message: string
  type?: ToastType
  isOpen: boolean
  onClose: () => void
  duration?: number
}

export default function Toast({
  message,
  type = 'success',
  isOpen,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="toast-icon toast-icon--success" />
      case 'error':
        return <AlertCircle size={20} className="toast-icon toast-icon--error" />
      case 'info':
        return <Info size={20} className="toast-icon toast-icon--info" />
    }
  }

  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="assertive">
      <div className="toast__content">
        {getIcon()}
        <span className="toast__message">{message}</span>
      </div>
      <button
        type="button"
        className="toast__close-btn"
        onClick={onClose}
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>
    </div>
  )
}
