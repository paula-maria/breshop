// Opções usadas tanto nos filtros da landing quanto no cadastro de peças.
// Devem ser mantidas iguais às do backend (src/constants/pecas.ts).
export const CATEGORIAS = ['Roupas', 'Calçados', 'Acessórios'] as const
export const TAMANHOS = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'] as const
export const CONDICOES = ['Novo', 'Seminovo', 'Usado'] as const
export const PUBLICOS = ['Feminino', 'Masculino', 'Infantil', 'Unissex'] as const

export type Categoria = (typeof CATEGORIAS)[number]

export const TIPOS_POR_CATEGORIA: Record<Categoria, readonly string[]> = {
  Roupas: ['Camiseta', 'Camisa', 'Calça', 'Vestido', 'Saia', 'Jaqueta', 'Outros'],
  Calçados: ['Tênis', 'Outros'],
  Acessórios: ['Bolsa', 'Outros'],
}

export const TIPOS = Array.from(new Set(Object.values(TIPOS_POR_CATEGORIA).flat()))
