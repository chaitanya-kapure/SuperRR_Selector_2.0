import { useState } from 'react'
import {
  Shield,
  Search,
  SlidersHorizontal,
  Target,
  Zap,
  Activity,
  ArrowUpDown,
  Info,
  BarChart2,
  Lock,
} from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'

export default function BowlingAnalytics() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('all')

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Bowling Intelligence"
        title="Bowling Under Pressure"
        description="Identify bowlers who suppress run rates, prevent boundaries, and deliver decisive breakthroughs in death overs and defending tight totals."
        action={<StatusBadge status="processing" label="Pipeline: Stage 4" />}
      />

      {/* ── A. BOWLER PERFORMANCE KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Pressure Runs', icon: Target, value: '—', note: 'Conceded in high-leverage' },
          { label: 'Legal Deliveries', icon: Zap, value: '—', note: 'Excluding wides & no-balls' },
          { label: 'Pressure Wickets', icon: Activity, value: '—', note: 'True bowler dismissals' },
          { label: 'Pressure Economy', icon: Shield, value: '—', note: 'Runs / 6 legal deliveries' },
          { label: 'Dot-Ball %', icon: Lock, value: '—', note: 'Scoreless balls induced' },
          { label: 'Boundary Concession', icon: BarChart2, value: '—', note: '% legal deliveries for 4/6' },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="p-3.5 rounded-xl flex flex-col justify-between"
              style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-rr-muted">
                  {kpi.label}
                </span>
                <div className="w-6 h-6 rounded-lg bg-rr-gold/10 border border-rr-gold/20 flex items-center justify-center">
                  <Icon className="w-3 h-3 text-rr-gold" />
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-white">{kpi.value}</div>
                <div className="text-[10px] text-rr-muted mt-0.5 truncate">{kpi.note}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── B. PRESSURE VS NORMAL COMPARISON FRAMEWORK ── */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Pressure vs Normal Bowling Delta</h3>
            <p className="text-xs text-rr-muted">
              Measuring how a bowler's economy, wicket strike rate, and boundary suppression hold up under extreme match pressure
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rr-gold bg-rr-gold/10 px-2.5 py-1 rounded-full border border-rr-gold/25">
            Suppression Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            {
              metric: 'Economy Delta (ΔECON)',
              formula: 'Pressure Economy − Baseline Economy',
              significance: 'Measures ability to contain run-rate spikes in death overs',
            },
            {
              metric: 'Dot-Ball Retention (ΔDOT%)',
              formula: 'Pressure Dot % − Normal Dot %',
              significance: 'Creating pressure by building scoreless pressure blocks',
            },
            {
              metric: 'Wicket Strike Rate Delta',
              formula: 'Balls/Wicket (Pressure vs Normal)',
              significance: 'Breakthrough capacity when opposition is attacking',
            },
            {
              metric: 'Boundary Prevention Rate',
              formula: '1 − (Pressure Boundaries / Balls)',
              significance: 'Refusal to yield easy boundary releases under pressure',
            },
          ].map((item) => (
            <div
              key={item.metric}
              className="p-3.5 rounded-lg bg-[#1A2540] border border-white/[0.05] flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white mb-1">{item.metric}</div>
                <div className="text-[11px] font-mono text-rr-gold mb-2">{item.formula}</div>
                <div className="text-[10.5px] text-rr-muted leading-relaxed">{item.significance}</div>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.05] text-[10px] text-amber-400 font-semibold">
                Pending Baseline Synthesis
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── C. BOWLER PERFORMANCE TABLE INTERFACE ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rr-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Filter bowlers by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#1A2540] border border-white/[0.07] text-xs text-white placeholder-rr-muted focus:outline-none focus:border-rr-gold"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#1A2540] border border-white/[0.07] text-xs text-rr-muted focus:outline-none"
            >
              <option value="all">All Competitions (IPL + T20I)</option>
              <option value="ipl">IPL Only (2022–2026)</option>
              <option value="t20i">T20I Only</option>
            </select>
            <button className="px-3 py-1.5 rounded-lg bg-[#1A2540] border border-white/[0.07] text-xs text-rr-muted flex items-center gap-1.5 hover:text-white">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Min. Overs</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#0B1020]/50 text-rr-muted font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4 text-center">Pressure Innings</th>
                <th className="py-3 px-4 text-center">Overs Bowled</th>
                <th className="py-3 px-4 text-center">Runs Conceded</th>
                <th className="py-3 px-4 text-center">Wickets</th>
                <th className="py-3 px-4 text-center">Pressure Econ</th>
                <th className="py-3 px-4 text-center">Normal Econ</th>
                <th className="py-3 px-4 text-center">Δ Econ</th>
                <th className="py-3 px-4 text-center">Reliability Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="11" className="py-16 text-center">
                  <EmptyState
                    icon={Shield}
                    title="Bowling Pressure Model In Development"
                    description="The delivery-level match-state reconstruction engine is compiling legal deliveries, true bowler wickets, and context-adjusted economy rates."
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A2540] border border-white/[0.08] text-xs text-rr-muted mt-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      Stage: True bowler wicket &amp; legal delivery accounting
                    </div>
                  </EmptyState>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── D. VISUALIZATIONS SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pressure vs Normal Economy Scatter */}
        <div
          className="p-5 rounded-xl flex flex-col"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold text-white">Pressure Economy vs Normal Economy</h4>
              <p className="text-[11px] text-rr-muted">Identifies bowlers in bottom-left (low economy in all situations)</p>
            </div>
            <span className="text-[10px] text-rr-muted bg-[#1A2540] px-2 py-0.5 rounded border border-white/[0.05]">
              Recharts Engine
            </span>
          </div>

          <div className="h-56 rounded-lg bg-[#080D1B] border border-white/[0.05] flex items-center justify-center">
            <div className="text-center p-4">
              <BarChart2 className="w-7 h-7 mx-auto mb-2 text-rr-muted/30" />
              <span className="text-xs text-rr-muted/60">Economy matrix activates with processed delivery telemetry</span>
            </div>
          </div>
        </div>

        {/* Wicket Strike Rate vs Dot-Ball % */}
        <div
          className="p-5 rounded-xl flex flex-col"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold text-white">Dot-Ball % vs Wicket Strike Rate</h4>
              <p className="text-[11px] text-rr-muted">Pressure creation through dots vs direct wicket-taking ability</p>
            </div>
            <span className="text-[10px] text-rr-muted bg-[#1A2540] px-2 py-0.5 rounded border border-white/[0.05]">
              Recharts Engine
            </span>
          </div>

          <div className="h-56 rounded-lg bg-[#080D1B] border border-white/[0.05] flex items-center justify-center">
            <div className="text-center p-4">
              <Target className="w-7 h-7 mx-auto mb-2 text-rr-muted/30" />
              <span className="text-xs text-rr-muted/60">Impact chart activates with processed delivery telemetry</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── E. BOWLER DEEP DIVE INFO ── */}
      <div
        className="p-4 rounded-xl flex items-start gap-3"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Info className="w-4 h-4 text-rr-gold mt-0.5 flex-shrink-0" />
        <div className="text-xs text-rr-muted leading-relaxed">
          <span className="text-white font-semibold">Bowler Deep Dive Inspector:</span> Selecting any bowler
          reveals over-by-over phase splits (Powerplay, Middle, Death Overs 16–20), legal delivery accuracy,
          boundary concession resistance under pressure, and match-level economy variance.
        </div>
      </div>

    </div>
  )
}
