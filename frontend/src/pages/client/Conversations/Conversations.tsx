import { MessageCircle } from 'lucide-react'

export default function ClientConversations() {
  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
        Conversas
      </h1>
      <div className="client-empty-state">
        <MessageCircle size={48} />
        <h3>Nenhuma conversa ainda</h3>
        <p>Quando você entrar em contato com um brechó sobre uma peça, suas conversas aparecerão aqui.</p>
      </div>
    </div>
  )
}
