import { useState, useMemo } from 'react'
import {
  getPlayerImageUrl,
  generateSvgAvatarDataUri,
  getTeamColorPalette
} from '../../services/playerImageService'

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-xl',
  '2xl': 'w-24 h-24 text-2xl'
}

/**
 * Universal Player Avatar & Portrait Component
 * 
 * Supports authorized headshots with seamless fallback to team-branded
 * vector SVG avatars. Maintains Rajasthan Royals visual language with
 * pink and gold accent rings and glowing borders.
 */
export default function PlayerAvatar({
  playerId,
  playerName = 'Player',
  teamName = '',
  role = 'batter',
  size = 'md',
  ringColor = 'none', // 'pink' | 'gold' | 'team' | 'none'
  showGlow = false,
  className = ''
}) {
  const [imageError, setImageError] = useState(false)

  // Look up registered image URL
  const registeredUrl = useMemo(() => {
    return getPlayerImageUrl(playerId)
  }, [playerId])

  // Generate fallback SVG avatar data URI
  const svgFallbackUri = useMemo(() => {
    return generateSvgAvatarDataUri(playerName, teamName, role)
  }, [playerName, teamName, role])

  // Ring styling
  const ringStyle = useMemo(() => {
    if (ringColor === 'pink') {
      return `ring-2 ring-rr-pink/70 ${showGlow ? 'shadow-lg shadow-rr-pink/30' : ''}`
    }
    if (ringColor === 'gold') {
      return `ring-2 ring-rr-gold/70 ${showGlow ? 'shadow-lg shadow-rr-gold/30' : ''}`
    }
    if (ringColor === 'team') {
      const palette = getTeamColorPalette(teamName)
      return `ring-2 shadow-md`
    }
    return 'ring-1 ring-white/10'
  }, [ringColor, showGlow, teamName])

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md

  const effectiveSrc = (!imageError && registeredUrl) ? registeredUrl : svgFallbackUri

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none overflow-hidden transition-transform duration-200 hover:scale-105 ${sizeClass} ${ringStyle} ${className}`}
      style={{ backgroundColor: '#080D1B' }}
      title={`${playerName} (${teamName || 'T20'})`}
    >
      <img
        src={effectiveSrc}
        alt={playerName}
        loading="lazy"
        onError={() => setImageError(true)}
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  )
}
