import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { Store } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const brechoSchema = z.object({
  nome: z.string().min(2, 'O nome é obrigatório'),
  descricao: z.string().optional(),
  logoUrl: z.string().optional(),
  capaUrl: z.string().optional(),

  telefone: z.string().optional(),
  whatsapp: z.string().min(8, 'WhatsApp é obrigatório'),
  emailContato: z.string().email('E-mail inválido').optional().or(z.literal('')),
  instagram: z.string().optional(),
  site: z.string().optional(),

  cep: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),

  horarios: z.string().optional(),

  formasPagamento: z.array(z.string()).default([]),
  atendimento: z.string().optional(),
  entrega: z.boolean().default(false),
  retirada: z.boolean().default(false),
  negociacao: z.boolean().default(false),
})

type BrechoFormData = z.infer<typeof brechoSchema>

export default function CadastroBrecho() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<BrechoFormData>({
    resolver: zodResolver(brechoSchema),
    defaultValues: {
      entrega: false,
      retirada: false,
      negociacao: false
    }
  })

  const onSubmit = async (data: BrechoFormData) => {
    try {
      await api.post('/brechos', data)
      navigate('/painel')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Erro ao cadastrar brechó')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 800 }}>
        <div className="auth-header">
          <div className="auth-icon" style={{ margin: '0 auto 16px' }}>
            <Store size={32} />
          </div>
          <h1 className="auth-title">Complete seu Perfil</h1>
          <p className="auth-subtitle">
            Configure as informações da sua loja para começar a vender.
          </p>
        </div>

        {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form" style={{ marginTop: 24 }}>
          
          <h3 className="section-title" style={{ marginTop: 0 }}>01 ─ Informações Básicas</h3>
          <div className="form-group">
            <label className="form-label">Nome do Brechó *</label>
            <input type="text" className="form-input" {...register('nome')} />
            {errors.nome && <span className="error-text" style={{color:'red', fontSize:12}}>{errors.nome.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea className="form-textarea" rows={3} {...register('descricao')} />
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">URL da Logo</label>
              <input type="text" className="form-input" {...register('logoUrl')} />
            </div>
            <div className="form-group">
              <label className="form-label">URL da Capa</label>
              <input type="text" className="form-input" {...register('capaUrl')} />
            </div>
          </div>

          <h3 className="section-title">02 ─ Contatos</h3>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">WhatsApp *</label>
              <input type="text" className="form-input" {...register('whatsapp')} />
              {errors.whatsapp && <span className="error-text" style={{color:'red', fontSize:12}}>{errors.whatsapp.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input type="text" className="form-input" {...register('telefone')} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input type="text" className="form-input" {...register('instagram')} />
            </div>
            <div className="form-group">
              <label className="form-label">E-mail Comercial</label>
              <input type="email" className="form-input" {...register('emailContato')} />
            </div>
          </div>

          <h3 className="section-title">03 ─ Endereço</h3>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">CEP</label>
              <input type="text" className="form-input" {...register('cep')} />
            </div>
            <div className="form-group">
              <label className="form-label">Cidade / Estado</label>
              <input type="text" className="form-input" placeholder="Ex: Macapá - AP" {...register('cidade')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Rua e Bairro</label>
            <input type="text" className="form-input" {...register('rua')} />
          </div>

          <h3 className="section-title">05 ─ Funcionamento</h3>
          <div className="form-group">
            <label className="form-label">Horários por dia</label>
            <input type="text" className="form-input" placeholder="Ex: Seg a Sex: 09h às 18h" {...register('horarios')} />
          </div>

          <h3 className="section-title">06 ─ Informações Comerciais</h3>
          <div className="form-row-2">
            <div className="form-group" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="checkbox" id="entrega" {...register('entrega')} />
              <label htmlFor="entrega" className="form-label" style={{margin:0}}>Faz Entrega?</label>
            </div>
            <div className="form-group" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="checkbox" id="retirada" {...register('retirada')} />
              <label htmlFor="retirada" className="form-label" style={{margin:0}}>Permite Retirada?</label>
            </div>
            <div className="form-group" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="checkbox" id="negociacao" {...register('negociacao')} />
              <label htmlFor="negociacao" className="form-label" style={{margin:0}}>Aceita Negociação?</label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 32 }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/painel')}>
              Pular por enquanto
            </button>
            <button type="submit" className="btn btn-cyan-pill" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Cadastrar Brechó'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
