import { useLocation } from 'react-router-dom'
import { Menu, Bell, Database, Slash } from 'lucide-react'

const PAGE_TITLES = {
  '/':            { title: 'Overview',             subtitle: 'Platform status, key insights and talent summary' },
  '/discovery':   { title: 'Player Discovery',     subtitle: 'Search and filter domestic talent' },
  '/analytics':   { title: 'Player Analytics',     subtitle: 'Deep performance analysis and visualisation' },
  '/auction':     { title: 'Auction Intelligence', subtitle: 'Strategic player evaluation and ranking' },
  '/shortlist':   { title: 'Shortlist (Top 10)',   subtitle: 'Curated targets for IPL 2027 auction' },
  '/methodology': { title: 'Methodology',          subtitle: 'Analytical framework and scoring model' },
}

export default function TopBar({ onMenuToggle }) {
  const location = useLocation()
  const page = PAGE_TITLES[location.pathname] || PAGE_TITLES['/']

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 py-3 flex-shrink-0"
      style={{
        background: 'rgba(8,13,27,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-rr-muted hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Pink slash accent + page title — matches reference */}
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-5 rounded-full bg-rr-pink hidden sm:block" />
          <div>
            <h1 className="text-sm font-bold text-white leading-none">{page.title}</h1>
            <p className="text-[11px] text-rr-muted mt-0.5 hidden md:block leading-none">
              {page.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        {/* Round 1 • Dataset Pending badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(212,175,55,0.12)',
            border: '1px solid rgba(212,175,55,0.30)',
            color: '#D4AF37',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"
            style={{ animation: 'pulseDot 2s cubic-bezier(.4,0,.6,1) infinite' }}
          />
          Round 1 · Dataset Pending
        </div>

        {/* Bell */}
        <button
          className="relative p-2 rounded-lg transition-colors hover:bg-white/[0.06]"
          style={{ color: '#A7B2C7' }}
        >
          <Bell style={{ width: '17px', height: '17px' }} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#E91E63' }}
          />
        </button>

        {/* RR avatar */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white"
          style={{
            background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
            boxShadow: '0 0 10px rgba(233,30,99,0.30)',
          }}
        >
          RR
        </div>
      </div>
    </header>
  )
}
