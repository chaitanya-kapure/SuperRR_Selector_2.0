/**
 * SupeRR Selector 2.0 — Centralized Player Profile Image & Avatar Service
 * 
 * Provides authorized player image mappings, team-specific dynamic SVG avatars,
 * and graceful fallback mechanisms for all 360 player profiles.
 * Adheres strictly to intellectual property guidelines by prioritizing neutral,
 * mathematically generated SVG portraits with team palettes over unverified scrapes.
 */

// Centralized Player Image Registry (player_id -> authorized image URL / asset path)
// If a player ID has an authorized or public domain photograph asset, map it here.
const PLAYER_IMAGE_MAP = {
  // Can be mapped to local authorized assets in /images/players/[id].webp or licensed URLs
  // e.g. 37052: '/images/players/37052.webp'
}

// Signature team color palettes for dynamic avatar gradients
const TEAM_COLOR_PALETTES = {
  'Rajasthan Royals': {
    primary: '#E91E63', // Royals Pink
    secondary: '#0C2340', // Deep Royal Blue
    accent: '#D4AF37', // Gold
    badge: 'RR'
  },
  'Mumbai Indians': {
    primary: '#004BA0', // MI Blue
    secondary: '#0B2347',
    accent: '#D4AF37',
    badge: 'MI'
  },
  'Kolkata Knight Riders': {
    primary: '#3A225D', // KKR Purple
    secondary: '#1C0B35',
    accent: '#D4AF37',
    badge: 'KKR'
  },
  'Chennai Super Kings': {
    primary: '#FDB913', // CSK Gold
    secondary: '#0081E9',
    accent: '#FDB913',
    badge: 'CSK'
  },
  'Royal Challengers Bengaluru': {
    primary: '#EC1C24', // RCB Red
    secondary: '#000000',
    accent: '#D4AF37',
    badge: 'RCB'
  },
  'Delhi Capitals': {
    primary: '#004C97', // DC Blue
    secondary: '#D71920',
    accent: '#0078FF',
    badge: 'DC'
  },
  'Gujarat Titans': {
    primary: '#1B2133', // GT Navy
    secondary: '#0B1120',
    accent: '#CBA92B',
    badge: 'GT'
  },
  'Punjab Kings': {
    primary: '#DD1F2D', // PBKS Red
    secondary: '#800A13',
    accent: '#D4AF37',
    badge: 'PBKS'
  },
  'Sunrisers Hyderabad': {
    primary: '#F26522', // SRH Orange
    secondary: '#1B0800',
    accent: '#FF8833',
    badge: 'SRH'
  },
  'Lucknow Super Giants': {
    primary: '#0057E7', // LSG Cyan
    secondary: '#021B47',
    accent: '#FF6F00',
    badge: 'LSG'
  },
  'Pakistan': {
    primary: '#006629', // Green
    secondary: '#002B11',
    accent: '#CBA92B',
    badge: 'PAK'
  },
  'India': {
    primary: '#0070B8', // BCCI Blue
    secondary: '#003366',
    accent: '#FF9933',
    badge: 'IND'
  },
  'Australia': {
    primary: '#004B23', // Australian Green
    secondary: '#002611',
    accent: '#FFCC00',
    badge: 'AUS'
  },
  'England': {
    primary: '#0B1E36', // England Navy
    secondary: '#C8102E',
    accent: '#FFFFFF',
    badge: 'ENG'
  },
  'South Africa': {
    primary: '#007A4D', // Proteas Green
    secondary: '#013823',
    accent: '#FFB612',
    badge: 'SA'
  },
  'New Zealand': {
    primary: '#1A1A1A', // Black Caps
    secondary: '#000000',
    accent: '#1D9AD6',
    badge: 'NZ'
  },
  'West Indies': {
    primary: '#7B0024', // Maroon
    secondary: '#36000F',
    accent: '#FFC72C',
    badge: 'WI'
  },
  'Afghanistan': {
    primary: '#002B7F',
    secondary: '#D32011',
    accent: '#000000',
    badge: 'AFG'
  },
  'Ireland': {
    primary: '#009A44',
    secondary: '#00481F',
    accent: '#169B62',
    badge: 'IRE'
  },
  'Hong Kong': {
    primary: '#DE2910',
    secondary: '#6E0B00',
    accent: '#FFFFFF',
    badge: 'HK'
  },
  'Zimbabwe': {
    primary: '#D40000',
    secondary: '#006600',
    accent: '#FFD700',
    badge: 'ZIM'
  }
}

const DEFAULT_PALETTE = {
  primary: '#E91E63',
  secondary: '#111A30',
  accent: '#D4AF37',
  badge: 'T20'
}

/**
 * Extracts 1-2 letter initials from a player's name
 */
export function getPlayerInitials(name) {
  if (!name || typeof name !== 'string') return 'RR'
  const clean = name.trim().replace(/[^a-zA-Z\s]/g, '')
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'RR'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Retrieves color palette for a team name
 */
export function getTeamColorPalette(teamName) {
  if (!teamName) return DEFAULT_PALETTE
  for (const [key, palette] of Object.entries(TEAM_COLOR_PALETTES)) {
    if (teamName.toLowerCase().includes(key.toLowerCase())) {
      return palette
    }
  }
  return DEFAULT_PALETTE
}

/**
 * Looks up authorized image URL for a player ID
 */
export function getPlayerImageUrl(playerId) {
  if (!playerId) return null
  const idStr = String(playerId)
  if (PLAYER_IMAGE_MAP[idStr]) {
    return PLAYER_IMAGE_MAP[idStr]
  }
  return null
}

/**
 * Generates an SVG Data URI avatar with team gradient and player initials
 */
export function generateSvgAvatarDataUri(name, teamName, role = 'all') {
  const initials = getPlayerInitials(name)
  const palette = getTeamColorPalette(teamName)
  const isBowler = role === 'bowler' || (role && role.toLowerCase().includes('bowl'))

  // SVG Markup with gradient background, subtle cricket icon/pattern, and crisp typography
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.primary}" />
        <stop offset="100%" stop-color="${palette.secondary}" />
      </linearGradient>
      <linearGradient id="ringGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.2" />
      </linearGradient>
    </defs>
    <!-- Background Circle with Team Gradient -->
    <circle cx="60" cy="60" r="58" fill="url(#grad)" stroke="url(#ringGrad)" stroke-width="2" />
    
    <!-- Subtle Backdrop Shield Pattern -->
    <path d="M60 18 L94 32 V62 C94 84 60 102 60 102 C60 102 26 84 26 62 V32 Z" 
          fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />

    <!-- Role Icon Watermark (Bat or Ball) -->
    ${isBowler ? `
      <!-- Seamed Ball Motif -->
      <circle cx="60" cy="60" r="32" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
      <path d="M42 42 Q60 60 42 78" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" stroke-dasharray="2,2" />
      <path d="M78 42 Q60 60 78 78" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" stroke-dasharray="2,2" />
    ` : `
      <!-- Crossed Bats Angle Motif -->
      <line x1="36" y1="84" x2="84" y2="36" stroke="rgba(255,255,255,0.05)" stroke-width="3" stroke-linecap="round" />
    `}

    <!-- Player Initials -->
    <text x="60" y="68" 
          font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="36" 
          font-weight="900" 
          letter-spacing="1" 
          fill="#FFFFFF" 
          text-anchor="middle"
          style="text-shadow: 0 2px 8px rgba(0,0,0,0.4);">
      ${initials}
    </text>

    <!-- Bottom Team Badge Pill -->
    <g transform="translate(60, 102)">
      <rect x="-18" y="-7" width="36" height="14" rx="7" fill="rgba(8, 13, 27, 0.85)" stroke="rgba(255,255,255,0.2)" stroke-width="0.8" />
      <text x="0" y="3.5" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="8" 
            font-weight="800" 
            fill="${palette.accent}" 
            text-anchor="middle">
        ${palette.badge}
      </text>
    </g>
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const playerImageService = {
  getPlayerImageUrl,
  getPlayerInitials,
  getTeamColorPalette,
  generateSvgAvatarDataUri
}

export default playerImageService
