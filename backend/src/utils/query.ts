const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export function queryString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export function queryList(value: unknown): string[] {
  const str = queryString(value)
  return str ? str.split(',').map((s) => s.trim()).filter(Boolean) : []
}

export function parsePagination(query: Record<string, unknown>) {
  const page = Math.max(1, Math.floor(Number(query.page)) || 1)
  const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(Number(query.limit)) || DEFAULT_LIMIT))
  return { page, limit, skip: (page - 1) * limit }
}

export function paginated<T>(data: T[], total: number, page: number, limit: number) {
  return { data, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } }
}
