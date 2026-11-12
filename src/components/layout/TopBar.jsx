import { useLocation } from 'react-router-dom'
import { Menu, Bell, Activity } from 'lucide-react'

const PAGE_TITLES = {
  '/':             { title: 'Overview',                subtitle: 'Pressure performance platform status and executive summary' },
  '/batting':      { title: 'Batting Under Pressure',  subtitle: 'Discover batters who maintain or elevate performance in crunch situations' },
  '/bowling':      { title: 'Bowling Under Pressure',  subtitle: 'Identify bowlers who control scoring and take wickets in high-leverage moments' },
  '/comparison':   { title: 'Player Comparison',       subtitle: 'Head-to-head pressure vs normal performance evaluation' },
  '/top-batters':  { title: 'Top 10 Batters',          subtitle: 'Ten most reliable batters in high-pressure match situations' },
  '/top-bowlers':  { title: 'Top 10 Bowlers',          subtitle: 'Ten most reliable bowlers defending runs and creating breakthroughs' },
  '/methodology':  { title: 'Methodology',             subtitle: 'Mathematical framework, pressure definition & reliability scoring' },
  '/data-quality': { title: 'Data Quality & Audit',    subtitle: 'Official Round 1 dataset verification, integrity checks & coverage' },
}

export default function TopBar({ onMenuToggle }) {
  const location = useLocation()
  const page = PAGE_TITLES[location.pathname] || PAGE_TITLES['/']

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 py-2.5 flex-shrink-0 z-20"
      style={{
        background: 'rgba(8,13,27,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-rr-muted hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-1 h-5 rounded-full bg-rr-pink hidden sm:block flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white leading-tight truncate">{page.title}</h1>
            <p className="text-[11px] text-rr-muted mt-0.5 hidden md:block leading-none truncate">
              {page.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(233,30,99,0.12)',
            border: '1px solid rgba(233,30,99,0.28)',
            color: '#FF1768',
          }}
        >
          <Activity className="w-3.5 h-3.5 text-rr-pink animate-pulse" />
          Round 1 · Pressure Intelligence
        </div>

        <button
          className="relative p-2 rounded-lg transition-colors hover:bg-white/[0.06]"
          style={{ color: '#A7B2C7' }}
          aria-label="Notifications"
        >
          <Bell style={{ width: '16px', height: '16px' }} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#E91E63' }}
          />
        </button>

        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
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
