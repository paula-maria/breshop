import { useState, type FormEvent } from 'react'

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
        <svg
          className="hero-search-bar__icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
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
