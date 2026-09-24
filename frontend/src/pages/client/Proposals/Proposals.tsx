import { HandCoins } from 'lucide-react'

export default function ClientProposals() {
  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
        Minhas Propostas
      </h1>
      <div className="client-empty-state">
        <HandCoins size={48} />
        <h3>Nenhuma proposta enviada</h3>
        <p>Quando você enviar uma proposta de negociação para um brechó, ela aparecerá aqui com o status atualizado.</p>
      </div>
    </div>
  )
}
