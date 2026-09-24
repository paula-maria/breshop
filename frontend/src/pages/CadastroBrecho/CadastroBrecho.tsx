import { useState, useEffect } from 'react'
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
  whatsapp: z.string().min(14, 'WhatsApp inválido'),
  emailContato: z.string().email('E-mail inválido').optional().or(z.literal('')),
  instagram: z.string().optional(),
  site: z.string().optional(),

  cep: z.string().min(8, 'CEP é obrigatório'),
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

const maskPhone = (v: string) => {
  v = v.replace(/\D/g, "")
  if (v.length > 11) v = v.slice(0, 11)
  if (v.length <= 2) {
    return v.length > 0 ? `(${v}` : v
  } else if (v.length <= 6) {
    return `(${v.slice(0, 2)}) ${v.slice(2)}`
  } else if (v.length <= 10) {
    return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`
  } else {
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`
  }
}

const maskCEP = (v: string) => {
  v = v.replace(/\D/g, "")
  if (v.length > 8) v = v.slice(0, 8)
  if (v.length > 5) return v.replace(/^(\d{5})(\d{1,3}).*/, "$1-$2")
  return v
}

const maskInstagram = (v: string) => {
  if (!v) return ''
  if (v.startsWith('@')) return v
  return `@${v}`
}

export default function CadastroBrecho() {
  const [errorMsg, setErrorMsg] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [horariosObj, setHorariosObj] = useState({
    semana: { abre: '09:00', fecha: '18:00', fechado: false },
    sabado: { abre: '09:00', fecha: '13:00', fechado: false },
    domingo: { abre: '00:00', fecha: '00:00', fechado: true }
  })

  // Options para os selects
  const horas = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0')
    return [`${h}:00`, `${h}:30`]
  }).flat()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BrechoFormData>({
    resolver: zodResolver(brechoSchema),
    defaultValues: {
      entrega: false,
      retirada: false,
      negociacao: false
    }
  })

  useEffect(() => {
    async function fetchStore() {
      try {
        const res = await api.get('/brechos/minha-loja')
        if (res.data) {
          setIsEditing(true)
          
          // Prisma retorna null para campos vazios, mas Zod espera string | undefined. 
          // Precisamos mapear null para string vazia.
          const sanitizedData = Object.keys(res.data).reduce((acc, key) => {
            acc[key] = res.data[key] === null ? '' : res.data[key]
            return acc
          }, {} as any)
          
          // Tenta parsear os horários, caso tenham sido salvos no formato padrão
          if (res.data.horarios) {
            try {
              const parts = res.data.horarios.split(' | ')
              const newObj = { ...horariosObj }
              parts.forEach((p: string) => {
                if (p.includes('Seg a Sex')) {
                  if (p.includes('Fechado')) newObj.semana.fechado = true
                  else {
                    const match = p.match(/das (\d{2}:\d{2}) às (\d{2}:\d{2})/)
                    if (match) { newObj.semana.abre = match[1]; newObj.semana.fecha = match[2]; newObj.semana.fechado = false; }
                  }
                }
                if (p.includes('Sáb')) {
                  if (p.includes('Fechado')) newObj.sabado.fechado = true
                  else {
                    const match = p.match(/das (\d{2}:\d{2}) às (\d{2}:\d{2})/)
                    if (match) { newObj.sabado.abre = match[1]; newObj.sabado.fecha = match[2]; newObj.sabado.fechado = false; }
                  }
                }
                if (p.includes('Dom')) {
                  if (p.includes('Fechado')) newObj.domingo.fechado = true
                  else {
                    const match = p.match(/das (\d{2}:\d{2}) às (\d{2}:\d{2})/)
                    if (match) { newObj.domingo.abre = match[1]; newObj.domingo.fecha = match[2]; newObj.domingo.fechado = false; }
                  }
                }
              })
              setHorariosObj(newObj)
            } catch (e) {}
          }
          
          if (sanitizedData.whatsapp) sanitizedData.whatsapp = maskPhone(sanitizedData.whatsapp)
          if (sanitizedData.telefone) sanitizedData.telefone = maskPhone(sanitizedData.telefone)
          if (sanitizedData.cep) sanitizedData.cep = maskCEP(sanitizedData.cep)

          reset(sanitizedData)
        }
      } catch (err: any) {
        // Se 404, não tem loja ainda
      } finally {
        setIsLoading(false)
      }
    }
    fetchStore()
  }, [reset])

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '')
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setValue('rua', data.logradouro, { shouldValidate: true })
          setValue('bairro', data.bairro, { shouldValidate: true })
          setValue('cidade', data.localidade, { shouldValidate: true })
          setValue('estado', data.uf, { shouldValidate: true })
        }
      } catch (err) {}
    }
  }

  const onSubmit = async (data: BrechoFormData) => {
    // Limpar erro anterior
    setErrorMsg('')

    // Compilar os horários
    const segSex = horariosObj.semana.fechado ? 'Seg a Sex: Fechado' : `Seg a Sex das ${horariosObj.semana.abre} às ${horariosObj.semana.fecha}`
    const sab = horariosObj.sabado.fechado ? 'Sáb: Fechado' : `Sáb das ${horariosObj.sabado.abre} às ${horariosObj.sabado.fecha}`
    const dom = horariosObj.domingo.fechado ? 'Dom: Fechado' : `Dom das ${horariosObj.domingo.abre} às ${horariosObj.domingo.fecha}`
    
    data.horarios = `${segSex} | ${sab} | ${dom}`

    // Remover máscaras antes de enviar ao backend
    const payload = {
      ...data,
      whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, '') : data.whatsapp,
      telefone: data.telefone ? data.telefone.replace(/\D/g, '') : data.telefone,
      cep: data.cep ? data.cep.replace(/\D/g, '') : data.cep,
    }

    // Separar API do navigate: o catch só captura erros reais do backend
    try {
      await api.post('/brechos', payload)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Erro ao salvar brechó')
      return
    }

    // Só navega se o POST foi bem-sucedido
    navigate('/painel', {
      state: {
        toastMessage: isEditing ? 'Dados do brechó atualizados com sucesso!' : 'Brechó cadastrado com sucesso!',
        tab: 'perfil'
      }
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ width: '100%', maxWidth: '800px' }}>
        <div className="auth-header">
          <div className="auth-icon" style={{ margin: '0 auto 16px' }}>
            <Store size={32} />
          </div>
          <h1 className="auth-title">{isEditing ? 'Atualizar Dados do Brechó' : 'Complete seu Perfil'}</h1>
          <p className="auth-subtitle">
            {isEditing ? 'Atualize as informações da sua loja.' : 'Configure as informações da sua loja para começar a vender.'}
          </p>
        </div>

        {errorMsg && <div className="auth-error-banner" style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>{errorMsg}</div>}
        
        {Object.keys(errors).length > 0 && (
          <div className="auth-error-banner" style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600 }}>
            Existem campos inválidos ou obrigatórios não preenchidos. Verifique os campos em vermelho.
          </div>
        )}

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
              <input 
                type="text" 
                className="form-input" 
                placeholder="(00) 00000-0000"
                {...register('whatsapp')} 
                onChange={(e) => {
                  setValue('whatsapp', maskPhone(e.target.value), { shouldValidate: true })
                }}
              />
              {errors.whatsapp && <span className="error-text" style={{color:'red', fontSize:12}}>{errors.whatsapp.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="(00) 0000-0000"
                {...register('telefone')} 
                onChange={(e) => {
                  setValue('telefone', maskPhone(e.target.value), { shouldValidate: true })
                }}
              />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="@seubrecho"
                {...register('instagram')} 
                onChange={(e) => {
                  setValue('instagram', maskInstagram(e.target.value), { shouldValidate: true })
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">E-mail Comercial</label>
              <input type="email" className="form-input" {...register('emailContato')} />
            </div>
          </div>

          <h3 className="section-title">03 ─ Endereço</h3>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">CEP *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="00000-000"
                {...register('cep')} 
                onBlur={handleCepBlur}
                onChange={(e) => {
                  setValue('cep', maskCEP(e.target.value), { shouldValidate: true })
                }}
              />
              {errors.cep && <span className="error-text" style={{color:'red', fontSize:12}}>{errors.cep.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Rua</label>
              <input type="text" className="form-input" {...register('rua')} />
            </div>
          </div>
          <div className="form-row-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Bairro</label>
              <input type="text" className="form-input" {...register('bairro')} />
            </div>
            <div className="form-group">
              <label className="form-label">Cidade</label>
              <input type="text" className="form-input" {...register('cidade')} />
            </div>
            <div className="form-group">
              <label className="form-label">Estado (UF)</label>
              <input type="text" className="form-input" {...register('estado')} maxLength={2} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Número</label>
              <input type="text" className="form-input" {...register('numero')} />
            </div>
            <div className="form-group">
              <label className="form-label">Complemento</label>
              <input type="text" className="form-input" {...register('complemento')} />
            </div>
          </div>

          <h3 className="section-title">05 ─ Funcionamento</h3>
          <div className="form-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <label className="form-label" style={{ marginBottom: '16px', display: 'block' }}>Defina seus horários de atendimento</label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Seg a Sex */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ width: '100px', fontWeight: 600, color: '#334155' }}>Seg a Sex</span>
                <input 
                  type="checkbox" 
                  checked={horariosObj.semana.fechado} 
                  onChange={(e) => setHorariosObj(p => ({ ...p, semana: { ...p.semana, fechado: e.target.checked }}))}
                /> <span style={{ fontSize: '14px', color: '#64748b' }}>Fechado</span>
                
                {!horariosObj.semana.fechado && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select className="form-input" style={{ width: '100px', padding: '6px' }} value={horariosObj.semana.abre} onChange={e => setHorariosObj(p => ({ ...p, semana: { ...p.semana, abre: e.target.value }}))}>
                      {horas.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span>às</span>
                    <select className="form-input" style={{ width: '100px', padding: '6px' }} value={horariosObj.semana.fecha} onChange={e => setHorariosObj(p => ({ ...p, semana: { ...p.semana, fecha: e.target.value }}))}>
                      {horas.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Sabado */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ width: '100px', fontWeight: 600, color: '#334155' }}>Sábado</span>
                <input 
                  type="checkbox" 
                  checked={horariosObj.sabado.fechado} 
                  onChange={(e) => setHorariosObj(p => ({ ...p, sabado: { ...p.sabado, fechado: e.target.checked }}))}
                /> <span style={{ fontSize: '14px', color: '#64748b' }}>Fechado</span>
                
                {!horariosObj.sabado.fechado && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select className="form-input" style={{ width: '100px', padding: '6px' }} value={horariosObj.sabado.abre} onChange={e => setHorariosObj(p => ({ ...p, sabado: { ...p.sabado, abre: e.target.value }}))}>
                      {horas.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span>às</span>
                    <select className="form-input" style={{ width: '100px', padding: '6px' }} value={horariosObj.sabado.fecha} onChange={e => setHorariosObj(p => ({ ...p, sabado: { ...p.sabado, fecha: e.target.value }}))}>
                      {horas.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Domingo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ width: '100px', fontWeight: 600, color: '#334155' }}>Domingo</span>
                <input 
                  type="checkbox" 
                  checked={horariosObj.domingo.fechado} 
                  onChange={(e) => setHorariosObj(p => ({ ...p, domingo: { ...p.domingo, fechado: e.target.checked }}))}
                /> <span style={{ fontSize: '14px', color: '#64748b' }}>Fechado</span>
                
                {!horariosObj.domingo.fechado && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select className="form-input" style={{ width: '100px', padding: '6px' }} value={horariosObj.domingo.abre} onChange={e => setHorariosObj(p => ({ ...p, domingo: { ...p.domingo, abre: e.target.value }}))}>
                      {horas.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span>às</span>
                    <select className="form-input" style={{ width: '100px', padding: '6px' }} value={horariosObj.domingo.fecha} onChange={e => setHorariosObj(p => ({ ...p, domingo: { ...p.domingo, fecha: e.target.value }}))}>
                      {horas.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
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
              Cancelar
            </button>
            <button type="submit" className="btn btn-cyan-pill" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : (isEditing ? 'Atualizar Brechó' : 'Cadastrar Brechó')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
