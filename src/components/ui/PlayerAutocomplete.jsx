import { useState, useRef, useEffect, useMemo } from 'react'
import { Search, X, Check, Lock, ChevronDown, User, AlertCircle } from 'lucide-react'

/**
 * Highlights matching query substring in text
 */
function HighlightMatch({ text, query, highlightColorClass }) {
  if (!query || !query.trim() || !text) return <span>{text}</span>
  
  const trimmed = query.trim()
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className={highlightColorClass}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

/**
 * Google-Style Searchable Autocomplete for Player Selection
 */
export default function PlayerAutocomplete({
  selectedPlayerId,
  onSelectPlayer,
  players = [],
  roleMode = 'batters',
  label = 'Player',
  themeColor = 'pink', // 'pink' | 'gold'
  disabledPlayerId = null,
  disabledLabel = 'Selected in other slot',
  placeholder = 'Search player or team (e.g. Virat, Naman, Yashasvi)...'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const isPink = themeColor === 'pink'
  const activeBorderClass = isPink ? 'focus:border-rr-pink' : 'focus:border-rr-gold'
  const ringClass = isPink ? 'focus:ring-rr-pink/20' : 'focus:ring-rr-gold/20'
  const badgeClass = isPink ? 'bg-rr-pink/15 text-rr-pink border-rr-pink/30' : 'bg-rr-gold/15 text-rr-gold border-rr-gold/30'
  const highlightClass = isPink ? 'text-rr-pink font-black' : 'text-rr-gold font-black'
  const activeItemBg = isPink ? 'bg-rr-pink/15 border-l-2 border-rr-pink' : 'bg-rr-gold/15 border-l-2 border-rr-gold'

  // Currently selected player object
  const selectedPlayer = useMemo(() => {
    return players.find((p) => String(p.player_id) === String(selectedPlayerId)) || null
  }, [players, selectedPlayerId])

  // Sync search input value with selected player when dropdown is closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery(selectedPlayer ? selectedPlayer.player_name : '')
    }
  }, [selectedPlayer, isOpen])

  // Filter players based on search query
  const filteredPlayers = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return players
    }
    const q = searchQuery.toLowerCase().trim()
    return players.filter((p) => {
      const nameMatch = p.player_name && p.player_name.toLowerCase().includes(q)
      const teamMatch = p.primary_team && p.primary_team.toLowerCase().includes(q)
      const allTeamsMatch = p.all_teams && p.all_teams.toLowerCase().includes(q)
      return nameMatch || teamMatch || allTeamsMatch
    })
  }, [players, searchQuery])

  // Reset highlight index on filter change
  useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredPlayers])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchQuery(selectedPlayer ? selectedPlayer.player_name : '')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedPlayer])

  // Auto-scroll highlighted option into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex]
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex, isOpen])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < filteredPlayers.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredPlayers.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = filteredPlayers[highlightedIndex]
      if (target) {
        if (String(target.player_id) !== String(disabledPlayerId)) {
          handleSelect(target)
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      setSearchQuery(selectedPlayer ? selectedPlayer.player_name : '')
      inputRef.current?.blur()
    }
  }

  const handleSelect = (player) => {
    if (String(player.player_id) === String(disabledPlayerId)) {
      return // Prevent duplicate selection
    }
    onSelectPlayer(String(player.player_id))
    setSearchQuery(player.player_name)
    setIsOpen(false)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    setSearchQuery('')
    onSelectPlayer('')
    setIsOpen(true)
    inputRef.current?.focus()
  }

  const handleFocus = () => {
    setIsOpen(true)
    // Select input text for convenient quick re-typing
    inputRef.current?.select()
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className={`absolute left-3 w-4 h-4 pointer-events-none transition-colors ${
          isOpen ? (isPink ? 'text-rr-pink' : 'text-rr-gold') : 'text-rr-muted'
        }`} />

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-[#080D1B] border border-white/[0.15] rounded-lg pl-9 pr-16 py-2.5 text-xs sm:text-sm font-semibold text-white placeholder-rr-muted/60 transition-all focus:outline-none focus:ring-2 ${activeBorderClass} ${ringClass}`}
          aria-label={`Search and select ${label}`}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear Button & Dropdown Chevron */}
        <div className="absolute right-2 flex items-center gap-1">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded text-rr-muted hover:text-white hover:bg-white/10 transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev)
              inputRef.current?.focus()
            }}
            className="p-1 rounded text-rr-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Autocomplete Suggestions Floating Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 left-0 right-0 mt-1.5 bg-[#0D1428] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-fade-in"
          style={{ maxHeight: '320px' }}
        >
          {/* Header indicator */}
          <div className="px-3 py-1.5 bg-[#080D1B]/80 border-b border-white/[0.06] flex items-center justify-between text-[10px] text-rr-muted font-bold uppercase tracking-wider">
            <span>
              {filteredPlayers.length} {roleMode === 'batters' ? 'Batters' : 'Bowlers'} Available
            </span>
            <span className="text-[9px] text-rr-muted/70 lowercase font-normal">
              ↑↓ navigate · enter select · esc close
            </span>
          </div>

          {/* List of Suggestions */}
          <div
            ref={listRef}
            className="overflow-y-auto divide-y divide-white/[0.04]"
            style={{ maxHeight: '275px' }}
          >
            {filteredPlayers.length === 0 ? (
              <div className="p-5 text-center space-y-2">
                <AlertCircle className="w-5 h-5 mx-auto text-rr-muted opacity-60" />
                <div className="text-xs font-bold text-white/80">No players found</div>
                <p className="text-[11px] text-rr-muted max-w-[240px] mx-auto">
                  No matching {roleMode === 'batters' ? 'batter' : 'bowler'} found for "{searchQuery}". Try searching by first name, surname, or IPL franchise.
                </p>
              </div>
            ) : (
              filteredPlayers.map((p, idx) => {
                const stat = roleMode === 'batters' ? p.batting : p.bowling
                const isSelected = String(p.player_id) === String(selectedPlayerId)
                const isDisabled = String(p.player_id) === String(disabledPlayerId)
                const isHighlighted = idx === highlightedIndex

                return (
                  <div
                    key={p.player_id}
                    onClick={() => {
                      if (!isDisabled) handleSelect(p)
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-3 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isDisabled
                        ? 'opacity-40 bg-white/[0.02] cursor-not-allowed'
                        : isHighlighted
                        ? activeItemBg
                        : isSelected
                        ? 'bg-white/[0.06]'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Left: Rank & Player Info */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Rank Badge */}
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                          isSelected
                            ? badgeClass
                            : 'bg-white/5 text-rr-muted border-white/10'
                        }`}
                      >
                        #{stat?.rank || '—'}
                      </span>

                      {/* Name & Subtitle */}
                      <div className="min-w-0 truncate">
                        <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                          <HighlightMatch
                            text={p.player_name}
                            query={searchQuery}
                            highlightColorClass={highlightClass}
                          />
                          {isSelected && (
                            <Check className={`w-3.5 h-3.5 shrink-0 ${isPink ? 'text-rr-pink' : 'text-rr-gold'}`} />
                          )}
                        </div>
                        <div className="text-[11px] text-rr-muted truncate">
                          <HighlightMatch
                            text={p.primary_team}
                            query={searchQuery}
                            highlightColorClass={highlightClass}
                          />
                          {' · '}
                          <span>{p.batting_type || p.bowling_type || p.primary_role}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Metrics & Status */}
                    <div className="text-right shrink-0">
                      {isDisabled ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400/90 bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 rounded">
                          <Lock className="w-2.5 h-2.5" />
                          {disabledLabel}
                        </span>
                      ) : (
                        <div>
                          <div className={`text-xs font-black font-mono ${
                            isSelected
                              ? (isPink ? 'text-rr-pink' : 'text-rr-gold')
                              : 'text-white/90'
                          }`}>
                            {stat?.reliability_score?.toFixed(1) || '—'}
                          </div>
                          <div className="text-[9px] text-rr-muted uppercase font-semibold">
                            Reliability
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
