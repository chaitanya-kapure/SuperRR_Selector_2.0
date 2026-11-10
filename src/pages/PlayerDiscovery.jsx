import {
  Users, Search, SlidersHorizontal, Filter,
  Trophy, MapPin, Calendar, BarChart2,
} from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'

const FILTER_PLACEHOLDERS = [
  { label: 'Age Range',          icon: Calendar, hint: 'e.g. Under 23' },
  { label: 'Batting Role',       icon: BarChart2, hint: 'e.g. Top-order, All-rounder' },
  { label: 'Bowling Role',       icon: BarChart2, hint: 'e.g. Pace, Spin' },
  { label: 'Domestic League',    icon: Trophy,   hint: 'e.g. Ranji Trophy, Vijay Hazare' },
  { label: 'Home State / Region', icon: MapPin,  hint: 'e.g. Rajasthan, Mumbai' },
]

function FilterPreviewCard({ label, icon: Icon, hint }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg opacity-50 cursor-not-allowed select-none"
      style={{ background: '#1A2540', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#6B7A99' }} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-white/70">{label}</div>
        <div className="text-[11px] truncate" style={{ color: '#6B7A99' }}>{hint}</div>
      </div>
      <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: '#6B7A9940' }} />
    </div>
  )
}

export default function PlayerDiscovery() {
  return (
    <div className="p-4 md:p-6 animate-fade-in space-y-5" style={{ background: '#080D1B' }}>

      <SectionHeader
        label="Player Discovery"
        title="Domestic Talent Search"
        description="Identify and filter uncapped domestic players eligible for the IPL 2027 auction."
        action={<StatusBadge status="pending" label="Awaiting Dataset" />}
      />

      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-[18px] h-[18px]" style={{ color: '#6B7A99' }} />
        </div>
        <input
          type="text"
          disabled
          placeholder="Search players by name, state, or league… (available after dataset upload)"
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm cursor-not-allowed focus:outline-none"
          style={{
            background: '#111A30',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#A7B2C7',
          }}
        />
        <div className="absolute inset-y-0 right-4 flex items-center">
          <span className="text-xs font-medium" style={{ color: '#6B7A9960' }}>Locked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Filter sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl p-4" style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4" style={{ color: '#A7B2C7' }} />
              <span className="text-sm font-bold text-white">Filters</span>
              <span className="ml-auto text-[10px] font-bold uppercase tracking-wide" style={{ color: '#6B7A99' }}>
                Schema TBD
              </span>
            </div>
            <div className="space-y-2">
              {FILTER_PLACEHOLDERS.map((f) => (
                <FilterPreviewCard key={f.label} {...f} />
              ))}
            </div>
            <div
              className="mt-4 p-3 rounded-lg"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}
            >
              <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(245,158,11,0.75)' }}>
                Filters will be configured based on the official dataset schema. Columns and
                categories are not yet confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* Main area */}
        <div className="lg:col-span-3">
          <div
            className="min-h-[520px] flex flex-col rounded-xl overflow-hidden"
            style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-sm font-medium" style={{ color: '#A7B2C7' }}>
                Players found: <span className="text-white">—</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#6B7A99' }}>Sort by:</span>
                <select
                  disabled
                  className="text-xs rounded-md px-2 py-1 cursor-not-allowed focus:outline-none"
                  style={{ background: '#1A2540', border: '1px solid rgba(255,255,255,0.07)', color: '#A7B2C7' }}
                >
                  <option>Age (youngest first)</option>
                </select>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={Users}
                title="Player Discovery Unavailable"
                description="Player discovery will begin once the official Round 1 dataset is received and loaded. No player data has been fabricated."
              >
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
                  style={{ background: '#1A2540', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="s-dot-pulse" />
                  <span className="text-xs" style={{ color: '#A7B2C7' }}>Monitoring for dataset availability</span>
                </div>
              </EmptyState>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities preview */}
      <div className="rounded-xl p-5" style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#6B7A99' }}>
          What This Module Will Support
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { title: 'Player Search', desc: 'Find players by name, region, league, or role' },
            { title: 'Age Filtering', desc: 'Focus on the youngest eligible uncapped talent' },
            { title: 'Role Classification', desc: 'Filter by batting, bowling, and all-round profiles' },
            { title: 'League Coverage', desc: 'Browse talent across multiple domestic competitions' },
            { title: 'Player Profiles', desc: 'Deep dive into individual performance histories' },
            { title: 'Player Comparison', desc: 'Compare multiple players side by side' },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: '#1A2540', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#E91E63' }} />
              <div>
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs mt-0.5" style={{ color: '#A7B2C7' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
