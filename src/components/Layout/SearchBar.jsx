import React, { useState } from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ placeholder, onSearch, isDark }) => {
  const [term, setTerm] = useState('')

  const handleChange = e => {
    const value = e.target.value
    setTerm(value)
    onSearch(value)
  }

  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
      <input
        type="search"
        value={term}
        onChange={handleChange}
        placeholder={placeholder}
        className={`pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500
          ${isDark ? 'bg-slate-700 text-white placeholder:text-slate-400' : 'bg-white text-gray-900 placeholder:text-gray-400'}
        `}
        aria-label="Recherche"
      />
    </div>
  )
}

export default SearchBar
