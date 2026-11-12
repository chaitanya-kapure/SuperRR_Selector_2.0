import { useState } from 'react'
import {
  GitCompare,
  Flame,
  Shield,
  Search,
  Plus,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'

export default function PlayerComparison() {
  const [roleMode, setRoleMode] = useState('batters') // 'batters' | 'bowlers'
  const [selectedPlayer1, setSelectedPlayer1] = useState(null)
  const [selectedPlayer2, setSelectedPlayer2] = useState(null)

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Head-to-Head Analytics"
        title="Player Comparison"
        description="Compare two or more players side-by-side on situational leverage, pressure acceleration, boundary rates, and reliability scores."
        action={<StatusBadge status="processing" label="Pipeline: Stage 4" />}
      />

      {/* Mode Switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setRoleMode('batters')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            roleMode === 'batters'
              ? 'bg-rr-pink text-white shadow-rr-pink'
              : 'bg-[#111A30] text-rr-muted hover:text-white border border-white/[0.07]'
          }`}
        >
          <Flame className="w-4 h-4" />
          Compare Batters
        </button>
        <button
          onClick={() => setRoleMode('bowlers')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            roleMode === 'bowlers'
              ? 'bg-rr-gold text-black shadow-rr-gold'
              : 'bg-[#111A30] text-rr-muted hover:text-white border border-white/[0.07]'
          }`}
        >
          <Shield className="w-4 h-4" />
          Compare Bowlers
        </button>
      </div>

      {/* Player Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Slot 1 */}
        <div
          className="p-5 rounded-xl flex flex-col justify-between"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-rr-muted">
              Primary Player (Slot 1)
            </span>
            <span className="w-2 h-2 rounded-full bg-rr-pink" />
          </div>

          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rr-muted pointer-events-none" />
            <input
              type="text"
              placeholder={`Search ${roleMode === 'batters' ? 'batter' : 'bowler'} name...`}
              disabled
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1A2540] border border-white/[0.07] text-xs text-white placeholder-rr-muted/50 cursor-not-allowed"
            />
          </div>

          <div className="p-4 rounded-lg bg-[#080D1B] border border-white/[0.04] text-center">
            <span className="text-xs text-rr-muted/60">Awaiting player ranking model completion</span>
          </div>
        </div>

        {/* Slot 2 */}
        <div
          className="p-5 rounded-xl flex flex-col justify-between"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-rr-muted">
              Comparison Player (Slot 2)
            </span>
            <span className="w-2 h-2 rounded-full bg-rr-gold" />
          </div>

          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rr-muted pointer-events-none" />
            <input
              type="text"
              placeholder={`Search ${roleMode === 'batters' ? 'batter' : 'bowler'} name...`}
              disabled
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#1A2540] border border-white/[0.07] text-xs text-white placeholder-rr-muted/50 cursor-not-allowed"
            />
          </div>

          <div className="p-4 rounded-lg bg-[#080D1B] border border-white/[0.04] text-center">
            <span className="text-xs text-rr-muted/60">Awaiting player ranking model completion</span>
          </div>
        </div>
      </div>

      {/* Comparison Metrics Grid Placeholder */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-rr-pink" />
            <span className="text-sm font-bold text-white">
              {roleMode === 'batters' ? 'Batting Metric Radar & Differential' : 'Bowling Metric Radar & Differential'}
            </span>
          </div>
          <span className="text-[10px] text-rr-muted bg-[#1A2540] px-2.5 py-1 rounded border border-white/[0.05]">
            Head-to-Head
          </span>
        </div>

        <div className="p-12 text-center">
          <EmptyState
            icon={GitCompare}
            title="Comparison Engine Pending Analytical Artifacts"
            description={`Select two ${roleMode === 'batters' ? 'batters' : 'bowlers'} once the reliability scoring engine finalizes situational baselines to inspect their radar overlap and head-to-head metrics.`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto mt-4 text-left">
              {(roleMode === 'batters'
                ? ['Pressure Strike Rate', 'Boundary Rate (4s/6s)', 'Dot Ball Resistance', 'Reliability Score']
                : ['Pressure Economy', 'Dot-Ball % Induced', 'Death Overs Breakthroughs', 'Reliability Score']
              ).map((m) => (
                <div key={m} className="p-2.5 rounded bg-[#1A2540] border border-white/[0.05]">
                  <div className="text-[10px] text-rr-muted uppercase font-bold">{m}</div>
                  <div className="text-xs font-mono text-white/50 mt-1">Pending</div>
                </div>
              ))}
            </div>
          </EmptyState>
        </div>
      </div>

    </div>
  )
}
