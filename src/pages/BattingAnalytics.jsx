import { useState } from 'react'
import {
  Flame,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Target,
  Zap,
  ShieldAlert,
  ArrowUpDown,
  Info,
  BarChart2,
} from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'

export default function BattingAnalytics() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('all')

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Batting Intelligence"
        title="Batting Under Pressure"
        description="Discover batters who maintain or elevate their scoring rate, boundary output, and wicket preservation when match situations demand it."
        action={<StatusBadge status="processing" label="Pipeline: Stage 4" />}
      />

      {/* ── A. BATTER PERFORMANCE KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Pressure Runs', icon: Target, value: '—', note: 'Off bat in clutch overs' },
          { label: 'Balls Faced', icon: Zap, value: '—', note: 'Under pressure threshold' },
          { label: 'Pressure Strike Rate', icon: Flame, value: '—', note: 'Target: >150.0 SR' },
          { label: 'Boundary %', icon: TrendingUp, value: '—', note: '4s & 6s / legal balls' },
          { label: 'Dot-Ball %', icon: BarChart2, value: '—', note: 'Lower is superior' },
          { label: 'Dismissal Freq', icon: ShieldAlert, value: '—', note: 'Balls per dismissal' },
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
                <div className="w-6 h-6 rounded-lg bg-rr-pink/10 border border-rr-pink/20 flex items-center justify-center">
                  <Icon className="w-3 h-3 text-rr-pink" />
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
            <h3 className="text-sm font-bold text-white">Pressure vs Normal Performance Delta</h3>
            <p className="text-xs text-rr-muted">
              Evaluating how each batter's metrics shift between normal match conditions and high-leverage situations
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rr-gold bg-rr-gold/10 px-2.5 py-1 rounded-full border border-rr-gold/25">
            Divergence Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            {
              metric: 'Strike Rate Delta (ΔSR)',
              formula: 'Pressure SR − Baseline Normal SR',
              significance: 'Measures acceleration under rising required rates',
            },
            {
              metric: 'Boundary % Delta (ΔBND%)',
              formula: 'Pressure Boundary % − Normal Boundary %',
              significance: 'Tests ability to find the ropes against defensive bowling',
            },
            {
              metric: 'Dot-Ball Reduction (ΔDOT%)',
              formula: 'Normal Dot % − Pressure Dot %',
              significance: 'Strike rotation efficiency under scoreboard pressure',
            },
            {
              metric: 'Wicket Preservation',
              formula: 'Balls/Dismissal (Pressure vs Normal)',
              significance: 'Balance between aggressive risk-taking and wicket preservation',
            },
          ].map((item) => (
            <div
              key={item.metric}
              className="p-3.5 rounded-lg bg-[#1A2540] border border-white/[0.05] flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white mb-1">{item.metric}</div>
                <div className="text-[11px] font-mono text-rr-pink mb-2">{item.formula}</div>
                <div className="text-[10.5px] text-rr-muted leading-relaxed">{item.significance}</div>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.05] text-[10px] text-amber-400 font-semibold">
                Pending Baseline Synthesis
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── C. PLAYER PERFORMANCE TABLE INTERFACE ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Table Toolbar */}
        <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rr-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Filter batters by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#1A2540] border border-white/[0.07] text-xs text-white placeholder-rr-muted focus:outline-none focus:border-rr-pink"
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
              <span>Min. Balls</span>
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#0B1020]/50 text-rr-muted font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4 text-center">Pressure Innings</th>
                <th className="py-3 px-4 text-center">Balls Faced</th>
                <th className="py-3 px-4 text-center">Pressure Runs</th>
                <th className="py-3 px-4 text-center">Pressure SR</th>
                <th className="py-3 px-4 text-center">Normal SR</th>
                <th className="py-3 px-4 text-center">Δ SR</th>
                <th className="py-3 px-4 text-center">Reliability Score</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty state while model runs */}
              <tr>
                <td colSpan="10" className="py-16 text-center">
                  <EmptyState
                    icon={Flame}
                    title="Batting Pressure Model In Development"
                    description="The delivery-level match-state reconstruction engine is currently computing situational leverage before populating the player leaderboard."
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A2540] border border-white/[0.08] text-xs text-rr-muted mt-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      Stage: Pre-ball leverage classification
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
        {/* Pressure vs Normal Scatter Container */}
        <div
          className="p-5 rounded-xl flex flex-col"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold text-white">Pressure SR vs Normal SR Distribution</h4>
              <p className="text-[11px] text-rr-muted">Identifies players in the top-right quadrant (elevators under pressure)</p>
            </div>
            <span className="text-[10px] text-rr-muted bg-[#1A2540] px-2 py-0.5 rounded border border-white/[0.05]">
              Recharts Engine
            </span>
          </div>

          <div className="h-56 rounded-lg bg-[#080D1B] border border-white/[0.05] flex items-center justify-center">
            <div className="text-center p-4">
              <BarChart2 className="w-7 h-7 mx-auto mb-2 text-rr-muted/30" />
              <span className="text-xs text-rr-muted/60">Scatter plot activates with processed delivery telemetry</span>
            </div>
          </div>
        </div>

        {/* Boundary % vs Dot % Container */}
        <div
          className="p-5 rounded-xl flex flex-col"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold text-white">Boundary % vs Dot % Efficiency</h4>
              <p className="text-[11px] text-rr-muted">Evaluating boundary reliance vs steady strike rotation in crunch overs</p>
            </div>
            <span className="text-[10px] text-rr-muted bg-[#1A2540] px-2 py-0.5 rounded border border-white/[0.05]">
              Recharts Engine
            </span>
          </div>

          <div className="h-56 rounded-lg bg-[#080D1B] border border-white/[0.05] flex items-center justify-center">
            <div className="text-center p-4">
              <TrendingUp className="w-7 h-7 mx-auto mb-2 text-rr-muted/30" />
              <span className="text-xs text-rr-muted/60">Efficiency matrix activates with processed delivery telemetry</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── E. PLAYER DETAILS INSPECTOR INFO ── */}
      <div
        className="p-4 rounded-xl flex items-start gap-3"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Info className="w-4 h-4 text-rr-pink mt-0.5 flex-shrink-0" />
        <div className="text-xs text-rr-muted leading-relaxed">
          <span className="text-white font-semibold">Player Deep Dive Inspector:</span> Clicking any batter
          in the leaderboard once rankings are populated will open a detailed breakdown including their
          situation-by-situation strike rate, match-level bootstrap consistency, exposure to extreme leverage
          (RRR &gt; 12.0), and head-to-head performance across IPL and international T20s.
        </div>
      </div>

    </div>
  )
}
