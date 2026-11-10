import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, BarChart3, Gavel,
  Star, BookOpen, X, Crown,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',           label: 'Overview',           icon: LayoutDashboard },
  { to: '/discovery',  label: 'Player Discovery',   icon: Users },
  { to: '/analytics',  label: 'Player Analytics',   icon: BarChart3 },
  { to: '/auction',    label: 'Auction Intelligence', icon: Gavel },
  { to: '/shortlist',  label: 'Shortlist (Top 10)', icon: Star },
  { to: '/methodology',label: 'Methodology',        icon: BookOpen },
]

/* ── Stylised RR Emblem (CSS-only, no official asset used) ─── */
function RREmblem() {
  return (
    <div className="flex flex-col items-center pt-6 pb-4 px-4">
      {/* Crown icon sits above */}
      <div className="relative mb-2">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, rgba(233,30,99,0.15) 0%, rgba(36,19,56,0.4) 100%)',
            border: '1.5px solid rgba(233,30,99,0.35)',
            boxShadow: '0 0 20px rgba(233,30,99,0.20)',
          }}
        >
          {/* Stylised "RR" monogram */}
          <svg viewBox="0 0 48 48" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Crown shape */}
            <path
              d="M10 32 L10 20 L16 26 L24 14 L32 26 L38 20 L38 32 Z"
              fill="none"
              stroke="#E91E63"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Crown band */}
            <rect x="10" y="31" width="28" height="4" rx="1" fill="#E91E63" opacity="0.9"/>
            {/* Crown jewels */}
            <circle cx="24" cy="14" r="2" fill="#D4AF37"/>
            <circle cx="10" cy="20" r="1.5" fill="#D4AF37"/>
            <circle cx="38" cy="20" r="1.5" fill="#D4AF37"/>
          </svg>
        </div>
      </div>

      {/* Franchise text */}
      <div className="text-center">
        <div
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 leading-tight"
        >
          Rajasthan
        </div>
        <div
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 leading-tight"
        >
          Royals
        </div>
      </div>

      {/* Divider */}
      <div className="w-10 h-px mt-3 mb-0" style={{ background: 'rgba(233,30,99,0.4)' }} />
    </div>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-56 flex flex-col flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: 'linear-gradient(180deg, #0D1428 0%, #090E1E 60%, #0A0C1A 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Mobile close */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1.5 rounded-md text-rr-muted hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Emblem block ── */}
        <RREmblem />

        {/* ── Branding ── */}
        <div className="px-4 pb-4">
          <div className="text-center">
            <span className="text-xl font-black text-white tracking-tight">SupeRR </span>
            <span className="text-xl font-black tracking-tight" style={{ color: '#E91E63' }}>Selector</span>
            <div className="text-xl font-black text-white tracking-tight">2.0</div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive =
              to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
            return (
              <NavLink
                key={to}
                to={to}
                className={`rr-nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-[13px]">{label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* ── Palace silhouette + tagline footer ── */}
        <div className="mt-auto">
          {/* Palace artwork */}
          <div
            className="palace-bg w-full"
            style={{ height: '90px', opacity: 0.85 }}
          />
          {/* Tagline */}
          <div
            className="px-4 py-4 text-center"
            style={{ background: 'rgba(8,13,27,0.95)' }}
          >
            <div className="text-[11px] font-semibold text-white/70 leading-snug">
              Discover Tomorrow's
            </div>
            <div className="text-[11px] font-bold leading-snug" style={{ color: '#E91E63' }}>
              Royals.
            </div>
            <div className="mt-2 w-6 h-px mx-auto" style={{ background: '#E91E63' }} />
          </div>
        </div>
      </aside>
    </>
  )
}
