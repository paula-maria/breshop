import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'

type SearchBarProps = {
  onSearch?: (query: string) => void
  placeholder?: string
  defaultValue?: string
}

export default function SearchBar({
  onSearch,
  placeholder = 'Busque por peça, categoria ou brechó',
  defaultValue = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <form className="hero-search-bar" onSubmit={handleSubmit} role="search">
      <div className="hero-search-bar__input-group">
        <Search className="hero-search-bar__icon" size={20} aria-hidden="true" />
        <input
          type="search"
          className="hero-search-bar__input"
          placeholder={placeholder}
          aria-label={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-cyan-pill hero-search-bar__btn">
        Buscar
      </button>
    </form>
  )
}
