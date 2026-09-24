import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { api } from '../../../services/api'
import { User } from 'lucide-react'

export default function ClientProfile() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/auth/me', { name, phone })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      // silently ignore for now
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
        Meu Perfil
      </h1>

      <div className="client-profile-card">
        {/* AVATAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
          }}>
            <User size={32} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{user?.name}</p>
            <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.85rem' }}>{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-input"
              value={email}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input
              type="text"
              className="form-input"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="btn btn-cyan-pill" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
            {success && (
              <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.875rem' }}>
                ✓ Salvo com sucesso!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
