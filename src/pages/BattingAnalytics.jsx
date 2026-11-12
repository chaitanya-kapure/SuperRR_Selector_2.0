import { useState, useEffect, useMemo } from 'react'
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
  Filter,
  Trophy,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'
import analyticsService from '../services/analyticsService'

export default function BattingAnalytics() {
  const [batters, setBatters] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('ALL')
  const [selectedRole, setSelectedRole] = useState('ALL')
  const [sortField, setSortField] = useState('pressure_reliability_score')
  const [sortAsc, setSortAsc] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  useEffect(() => {
    async function loadBatters() {
      const res = await analyticsService.getBattingAnalytics()
      if (res.isLoaded) {
        setBatters(res.data)
        if (res.data.length > 0) setSelectedPlayer(res.data[0])
      }
      setLoading(false)
    }
    loadBatters()
  }, [])

  // Teams & Roles for filtering
  const teams = useMemo(() => {
    const list = Array.from(new Set(batters.map((b) => b.primary_team).filter(Boolean)))
    return ['ALL', ...list.sort()]
  }, [batters])

  const roles = useMemo(() => {
    const list = Array.from(new Set(batters.map((b) => b.tactical_role).filter(Boolean)))
    return ['ALL', ...list.sort()]
  }, [batters])

  // Filtered & sorted batters
  const filteredBatters = useMemo(() => {
    return batters
      .filter((b) => {
        const matchesSearch =
          b.striker_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.batting_type?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTeam = selectedTeam === 'ALL' || b.primary_team === selectedTeam
        const matchesRole = selectedRole === 'ALL' || b.tactical_role === selectedRole
        return matchesSearch && matchesTeam && matchesRole
      })
      .sort((a, b) => {
        let valA = a[sortField]
        let valB = b[sortField]
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA)
        }
        return sortAsc ? valA - valB : valB - valA
      })
  }, [batters, searchQuery, selectedTeam, selectedRole, sortField, sortAsc])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(field === 'rank')
    }
  }

  // Scatter chart data: Base SR vs Pressure SR
  const scatterData = useMemo(() => {
    return batters.slice(0, 50).map((b) => ({
      name: b.striker_name,
      baseSR: b.overall_strike_rate,
      pressSR: b.pressure_strike_rate,
      adjSR: b.adjusted_pressure_strike_rate,
      delta: b.strike_rate_delta,
      balls: b.pressure_balls_faced,
      team: b.primary_team,
      score: b.pressure_reliability_score
    }))
  }, [batters])

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Batting Intelligence · 2022–2026 T20 Telemetry"
        title="Batting Under Pressure"
        description="Comprehensive evaluation of scoring rate acceleration, boundary frequency, and situation-adjusted resilience across 255 qualifying batters (minimum 80 pressure balls & 5 matches)."
        action={<StatusBadge status="ready" label="255 Batters Calibrated" />}
      />

      {/* ── KPI TILES ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Eligible Batters', icon: Target, value: '255', note: '≥80 pressure balls' },
          { label: 'Pressure Deliveries', icon: Zap, value: '85,532', note: '42.6% of all balls' },
          { label: 'Population Press SR', icon: Flame, value: '152.4', note: '+19.6 vs baseline' },
          { label: 'Boundary Rate', icon: TrendingUp, value: '62.8%', note: 'Boundary runs / total' },
          { label: 'Avg Dot Ball %', icon: BarChart2, value: '31.4%', note: 'Pressure dot balls' },
          { label: 'Top Rated Finisher', icon: Trophy, value: 'Naman Dhir', note: 'Score: 86.8 · SR 189.2' },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="p-3.5 rounded-xl flex flex-col justify-between"
              style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-rr-muted">
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

      {/* ── SCATTER VISUALIZATION: PRESSURE SR VS BASELINE SR ── */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rr-pink" />
              Pressure Strike Rate vs Overall Baseline (Top 50 Batters)
            </h3>
            <p className="text-xs text-rr-muted mt-0.5">
              Players above the diagonal line elevate their scoring under pressure (positive Δ SR)
            </p>
          </div>
          <span className="text-xs text-rr-muted">Bubble Size = Pressure Balls Faced</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <XAxis
                type="number"
                dataKey="baseSR"
                name="Baseline Strike Rate"
                domain={[120, 200]}
                stroke="#6B7A99"
                fontSize={11}
                unit=" SR"
              />
              <YAxis
                type="number"
                dataKey="adjSR"
                name="Adjusted Pressure Strike Rate"
                domain={[130, 210]}
                stroke="#6B7A99"
                fontSize={11}
                unit=" SR"
              />
              <ZAxis type="number" dataKey="balls" range={[40, 400]} name="Pressure Balls" />
              <Tooltip
                contentStyle={{ background: '#0D1428', borderColor: '#241338', borderRadius: 8, fontSize: 12 }}
                formatter={(val, name, item) => {
                  if (name === 'Adjusted Pressure Strike Rate') return [`${val.toFixed(1)} SR`, name]
                  if (name === 'Baseline Strike Rate') return [`${val.toFixed(1)} SR`, name]
                  if (name === 'Pressure Balls') return [`${val} balls`, name]
                  return [val, name]
                }}
                labelFormatter={(idx, item) => item[0]?.payload?.name || 'Batter'}
              />
              <ReferenceLine y={152.4} stroke="#E91E63" strokeDasharray="3 3" label={{ value: 'Pressure Avg (152.4)', fill: '#E91E63', fontSize: 10, position: 'right' }} />
              <Scatter name="Batters" data={scatterData} fill="#FF1768">
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.delta >= 20 ? '#10B981' : entry.delta >= 10 ? '#FF1768' : '#3B82F6'}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="p-4 border-b border-white/[0.06] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative min-w-[220px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-rr-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by batter name or style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080D1B] border border-white/[0.1] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-rr-muted focus:outline-none focus:border-rr-pink"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-rr-muted" />
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-[#080D1B] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rr-pink max-w-[160px]"
              >
                {teams.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-[#080D1B] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rr-pink"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-rr-muted flex-shrink-0">
            Showing <strong className="text-white">{filteredBatters.length}</strong> of {batters.length} qualifiers
          </div>
        </div>

        {/* ── BATTING TABLE ── */}
        <div className="overflow-x-auto max-h-[550px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-[#0B1020]">
              <tr className="border-b border-white/[0.08] text-rr-muted font-bold text-[10px] uppercase tracking-wider">
                <th onClick={() => handleSort('rank')} className="py-3 px-3.5 w-14 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Rank <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('striker_name')} className="py-3 px-4 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">Batter Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3">Team</th>
                <th onClick={() => handleSort('adjusted_pressure_strike_rate')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Adj SR <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('overall_strike_rate')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Base SR <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_strike_rate')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Press SR <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('strike_rate_delta')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Δ SR <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_balls_faced')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Balls <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_matches')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Matches <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_boundary_pct')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Boundary % <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_reliability_score')} className="py-3 px-3.5 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Score <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredBatters.map((b) => {
                const isSelected = selectedPlayer?.striker_id === b.striker_id
                const isTop10 = b.rank <= 10
                return (
                  <tr
                    key={b.striker_id}
                    onClick={() => setSelectedPlayer(b)}
                    className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                      isSelected ? 'bg-rr-pink/[0.08]' : isTop10 ? 'bg-white/[0.015]' : ''
                    }`}
                  >
                    <td className="py-3 px-3.5 text-center">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full font-bold text-[11px] ${
                        b.rank === 1 ? 'bg-rr-gold text-black' : b.rank <= 3 ? 'bg-rr-pink/20 text-rr-pink border border-rr-pink/30' : 'text-rr-muted'
                      }`}>
                        {b.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{b.striker_name}</div>
                      <div className="text-[10px] text-rr-muted">{b.batting_type}</div>
                    </td>
                    <td className="py-3 px-3 text-white/80 text-xs truncate max-w-[120px]">{b.primary_team}</td>
                    <td className="py-3 px-3 text-center font-black text-emerald-400 text-xs">
                      {b.adjusted_pressure_strike_rate.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-center text-white/60 text-xs">
                      {b.overall_strike_rate.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-center text-white/90 text-xs font-semibold">
                      {b.pressure_strike_rate.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                        b.strike_rate_delta >= 15 ? 'text-emerald-400 bg-emerald-500/10' : b.strike_rate_delta >= 0 ? 'text-blue-400 bg-blue-500/10' : 'text-rose-400 bg-rose-500/10'
                      }`}>
                        {b.strike_rate_delta > 0 ? '+' : ''}{b.strike_rate_delta.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-white/80 font-medium">
                      {b.pressure_balls_faced}
                    </td>
                    <td className="py-3 px-3 text-center text-white/60">
                      {b.pressure_matches}
                    </td>
                    <td className="py-3 px-3 text-center text-white/80">
                      {b.pressure_boundary_pct?.toFixed(1) || '0.0'}%
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="font-black text-white bg-white/[0.06] px-2 py-0.5 rounded border border-white/[0.1]">
                        {b.pressure_reliability_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[10px] text-rr-muted">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] truncate max-w-[130px] inline-block">
                        {b.tactical_role}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
