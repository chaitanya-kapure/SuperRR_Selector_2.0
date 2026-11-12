import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Flame,
  Shield,
  GitCompare,
  Trophy,
  Crown,
  BookOpen,
  Database,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',             label: 'Overview',                icon: LayoutDashboard },
  { to: '/batting',      label: 'Batting Under Pressure',  icon: Flame },
  { to: '/bowling',      label: 'Bowling Under Pressure',  icon: Shield },
  { to: '/comparison',   label: 'Player Comparison',       icon: GitCompare },
  { to: '/top-batters',  label: 'Top 10 Batters',          icon: Trophy },
  { to: '/top-bowlers',  label: 'Top 10 Bowlers',          icon: Crown },
  { to: '/methodology',  label: 'Methodology',             icon: BookOpen },
  { to: '/data-quality', label: 'Data Quality',            icon: Database },
]

/* ── Stylised Rajasthan Royals Emblem ─── */
function RREmblem() {
  return (
    <div className="flex flex-col items-center pt-5 pb-3 px-4">
      <div className="relative mb-2">
        <div
          className="w-13 h-13 rounded-full flex items-center justify-center p-2"
          style={{
            background: 'linear-gradient(145deg, rgba(233,30,99,0.18) 0%, rgba(36,19,56,0.5) 100%)',
            border: '1.5px solid rgba(233,30,99,0.4)',
            boxShadow: '0 0 20px rgba(233,30,99,0.25)',
          }}
        >
          <svg viewBox="0 0 48 48" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 32 L10 20 L16 26 L24 14 L32 26 L38 20 L38 32 Z"
              fill="none"
              stroke="#E91E63"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <rect x="10" y="31" width="28" height="4" rx="1" fill="#E91E63" opacity="0.95"/>
            <circle cx="24" cy="14" r="2" fill="#D4AF37"/>
            <circle cx="10" cy="20" r="1.5" fill="#D4AF37"/>
            <circle cx="38" cy="20" r="1.5" fill="#D4AF37"/>
          </svg>
        </div>
      </div>

      <div className="text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90 leading-tight">
          Rajasthan
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90 leading-tight">
          Royals
        </div>
      </div>

      <div className="w-8 h-px mt-2.5" style={{ background: 'rgba(233,30,99,0.45)' }} />
    </div>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-60 flex flex-col flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: 'linear-gradient(180deg, #0B1020 0%, #080D1B 65%, #0A0C1A 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1.5 rounded-md text-rr-muted hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>

        <RREmblem />

        <div className="px-4 pb-3">
          <div className="text-center">
            <span className="text-lg font-black text-white tracking-tight">SupeRR </span>
            <span className="text-lg font-black tracking-tight" style={{ color: '#E91E63' }}>Selector</span>
            <span className="text-lg font-black text-white tracking-tight"> 2.0</span>
            <div className="text-[9px] font-bold uppercase tracking-widest text-rr-gold mt-0.5">
              Pressure Intelligence
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive =
              to === '/' ? location.pathname === '/' : location.pathname === to || location.pathname.startsWith(`${to}/`)
            return (
              <NavLink
                key={to}
                to={to}
                className={`rr-nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-[12.5px] truncate">{label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto">
          <div
            className="palace-bg w-full"
            style={{ height: '70px', opacity: 0.65 }}
          />
          <div
            className="px-4 py-3 text-center border-t border-white/[0.04]"
            style={{ background: 'rgba(8,13,27,0.95)' }}
          >
            <div className="text-[10px] font-medium text-white/70 leading-snug">
              Discover Who Delivers
            </div>
            <div className="text-[11px] font-black leading-snug" style={{ color: '#E91E63' }}>
              When It Matters.
            </div>
            <div className="mt-1.5 w-6 h-px mx-auto" style={{ background: '#E91E63' }} />
          </div>
        </div>
      </aside>
    </>
  )
}
