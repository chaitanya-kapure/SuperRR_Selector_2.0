import { useState, useEffect, useMemo } from 'react'
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
  Filter,
  Crown,
  Sparkles,
  TrendingDown
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
  Cell
} from 'recharts'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'
import PlayerAvatar from '../components/ui/PlayerAvatar'
import analyticsService from '../services/analyticsService'

export default function BowlingAnalytics() {
  const [bowlers, setBowlers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('ALL')
  const [selectedRole, setSelectedRole] = useState('ALL')
  const [sortField, setSortField] = useState('pressure_reliability_score')
  const [sortAsc, setSortAsc] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  useEffect(() => {
    async function loadBowlers() {
      const res = await analyticsService.getBowlingAnalytics()
      if (res.isLoaded) {
        setBowlers(res.data)
        if (res.data.length > 0) setSelectedPlayer(res.data[0])
      }
      setLoading(false)
    }
    loadBowlers()
  }, [])

  // Teams & Roles for filtering
  const teams = useMemo(() => {
    const list = Array.from(new Set(bowlers.map((bw) => bw.primary_team).filter(Boolean)))
    return ['ALL', ...list.sort()]
  }, [bowlers])

  const roles = useMemo(() => {
    const list = Array.from(new Set(bowlers.map((bw) => bw.tactical_role).filter(Boolean)))
    return ['ALL', ...list.sort()]
  }, [bowlers])

  // Filtered & sorted bowlers
  const filteredBowlers = useMemo(() => {
    return bowlers
      .filter((bw) => {
        const matchesSearch =
          bw.bowler_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bw.bowling_type?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesTeam = selectedTeam === 'ALL' || bw.primary_team === selectedTeam
        const matchesRole = selectedRole === 'ALL' || bw.tactical_role === selectedRole
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
  }, [bowlers, searchQuery, selectedTeam, selectedRole, sortField, sortAsc])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(field === 'rank' || field === 'adjusted_pressure_economy')
    }
  }

  // Scatter chart data: Base Econ vs Pressure Econ
  const scatterData = useMemo(() => {
    return bowlers.slice(0, 50).map((bw) => ({
      name: bw.bowler_name,
      baseEcon: bw.overall_economy,
      pressEcon: bw.pressure_economy,
      adjEcon: bw.adjusted_pressure_economy,
      delta: bw.delta_economy,
      balls: bw.pressure_legal_balls,
      wkts: bw.pressure_wickets,
      team: bw.primary_team,
      score: bw.pressure_reliability_score
    }))
  }, [bowlers])

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Bowling Intelligence · 2022–2026 T20 Telemetry"
        title="Bowling Under Pressure"
        description="Evaluation of run rate suppression, death-overs containment, and breakthrough capability across 172 qualifying bowlers (minimum 80 pressure legal balls & 5 matches)."
        action={<StatusBadge status="ready" label="172 Bowlers Calibrated" />}
      />

      {/* ── KPI TILES ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Eligible Bowlers', icon: Target, value: '172', note: '≥80 pressure balls' },
          { label: 'Pressure Deliveries', icon: Zap, value: '51,138', note: '25.4% of all balls' },
          { label: 'Pressure Avg Econ', icon: Shield, value: '9.76', note: '+1.52 vs baseline' },
          { label: 'Pressure Wickets', icon: Activity, value: '2,577', note: 'Breakthroughs in clutch' },
          { label: 'Avg Dot Ball %', icon: Lock, value: '34.2%', note: 'Pressure dot balls' },
          { label: 'Top Rated Bowler', icon: Crown, value: 'Sunil Narine', note: 'Score: 80.2 · Econ 6.52' },
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

      {/* ── SCATTER VISUALIZATION: PRESSURE ECON VS BASELINE ECON ── */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rr-gold" />
              Adjusted Pressure Economy vs Overall Baseline (Top 50 Bowlers)
            </h3>
            <p className="text-xs text-rr-muted mt-0.5">
              Lower is superior: bowlers below the line tighten their economy under pressure (negative Δ Econ)
            </p>
          </div>
          <span className="text-xs text-rr-muted">Bubble Size = Pressure Wickets Taken</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <XAxis
                type="number"
                dataKey="baseEcon"
                name="Baseline Economy"
                domain={[5.5, 11.0]}
                stroke="#6B7A99"
                fontSize={11}
                unit=" RPO"
              />
              <YAxis
                type="number"
                dataKey="adjEcon"
                name="Adjusted Pressure Economy"
                domain={[5.5, 11.5]}
                stroke="#6B7A99"
                fontSize={11}
                unit=" RPO"
              />
              <ZAxis type="number" dataKey="wkts" range={[40, 400]} name="Pressure Wickets" />
              <Tooltip
                contentStyle={{ background: '#0D1428', borderColor: '#241338', borderRadius: 8, fontSize: 12 }}
                formatter={(val, name) => {
                  if (name === 'Adjusted Pressure Economy') return [`${val.toFixed(2)} RPO`, name]
                  if (name === 'Baseline Economy') return [`${val.toFixed(2)} RPO`, name]
                  if (name === 'Pressure Wickets') return [`${val} wkts`, name]
                  return [val, name]
                }}
                labelFormatter={(idx, item) => item[0]?.payload?.name || 'Bowler'}
              />
              <ReferenceLine y={9.76} stroke="#F43F5E" strokeDasharray="3 3" label={{ value: 'Pressure Avg (9.76)', fill: '#F43F5E', fontSize: 10, position: 'right' }} />
              <Scatter name="Bowlers" data={scatterData} fill="#D4AF37">
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.adjEcon <= 7.2 ? '#10B981' : entry.adjEcon <= 8.2 ? '#3B82F6' : '#F59E0B'}
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
                placeholder="Search by bowler name or style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080D1B] border border-white/[0.1] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-rr-muted focus:outline-none focus:border-rr-gold"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-rr-muted" />
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-[#080D1B] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rr-gold max-w-[160px]"
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
                className="bg-[#080D1B] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rr-gold"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-rr-muted flex-shrink-0">
            Showing <strong className="text-white">{filteredBowlers.length}</strong> of {bowlers.length} qualifiers
          </div>
        </div>

        {/* ── BOWLING TABLE ── */}
        <div className="overflow-x-auto max-h-[550px]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-[#0B1020]">
              <tr className="border-b border-white/[0.08] text-rr-muted font-bold text-[10px] uppercase tracking-wider">
                <th onClick={() => handleSort('rank')} className="py-3 px-3.5 w-14 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Rank <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('bowler_name')} className="py-3 px-4 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">Bowler Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3">Team</th>
                <th onClick={() => handleSort('adjusted_pressure_economy')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Adj Econ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('overall_economy')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Base Econ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_economy')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Press Econ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('delta_economy')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Δ Econ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_wickets')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Wickets <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_overs')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Press Overs <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_dot_pct')} className="py-3 px-3 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Dot % <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_reliability_score')} className="py-3 px-3.5 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Score <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredBowlers.map((bw) => {
                const isSelected = selectedPlayer?.bowler_id === bw.bowler_id
                const isTop10 = bw.rank <= 10
                const isImproved = bw.delta_economy <= 0
                return (
                  <tr
                    key={bw.bowler_id}
                    onClick={() => setSelectedPlayer(bw)}
                    className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                      isSelected ? 'bg-rr-gold/[0.08]' : isTop10 ? 'bg-white/[0.015]' : ''
                    }`}
                  >
                    <td className="py-3 px-3.5 text-center">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full font-bold text-[11px] ${
                        bw.rank === 1 ? 'bg-rr-gold text-black' : bw.rank <= 3 ? 'bg-rr-gold/20 text-rr-gold border border-rr-gold/30' : 'text-rr-muted'
                      }`}>
                        {bw.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <PlayerAvatar
                          playerId={bw.bowler_id}
                          playerName={bw.bowler_name}
                          teamName={bw.primary_team}
                          role="bowler"
                          size="xs"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate">{bw.bowler_name}</div>
                          <div className="text-[10px] text-rr-muted">{bw.bowling_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-white/80 text-xs truncate max-w-[120px]">{bw.primary_team}</td>
                    <td className="py-3 px-3 text-center font-black text-emerald-400 text-xs">
                      {bw.adjusted_pressure_economy.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center text-white/60 text-xs">
                      {bw.overall_economy.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center text-white/90 text-xs font-semibold">
                      {bw.pressure_economy.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-xs">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                        isImproved ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {bw.delta_economy > 0 ? '+' : ''}{bw.delta_economy.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-rr-gold font-bold text-xs">
                      {bw.pressure_wickets}
                    </td>
                    <td className="py-3 px-3 text-center text-white/80 font-medium">
                      {bw.pressure_overs}
                    </td>
                    <td className="py-3 px-3 text-center text-white/70">
                      {bw.pressure_dot_pct?.toFixed(1) || '0.0'}%
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="font-black text-white bg-white/[0.06] px-2 py-0.5 rounded border border-white/[0.1]">
                        {bw.pressure_reliability_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[10px] text-rr-muted">
                      <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] truncate max-w-[130px] inline-block">
                        {bw.tactical_role}
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
