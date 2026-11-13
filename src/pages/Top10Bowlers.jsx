import { useState, useEffect, useMemo } from 'react'
import {
  Crown,
  Shield,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Info,
  Layers,
  Activity,
  Search,
  Filter,
  ArrowUpDown,
  Zap,
  TrendingDown,
  Lock
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'
import PlayerAvatar from '../components/ui/PlayerAvatar'
import analyticsService from '../services/analyticsService'

export default function Top10Bowlers() {
  const [bowlers, setBowlers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('ALL')
  const [sortField, setSortField] = useState('rank')
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    async function fetchBowlers() {
      const res = await analyticsService.getTop10Bowlers()
      if (res.isLoaded) {
        setBowlers(res.data)
      }
      setLoading(false)
    }
    fetchBowlers()
  }, [])

  // Teams list for filtering
  const teams = useMemo(() => {
    const list = Array.from(new Set(bowlers.map((bw) => bw.primary_team).filter(Boolean)))
    return ['ALL', ...list]
  }, [bowlers])

  // Filtered & sorted bowlers
  const filteredBowlers = useMemo(() => {
    return bowlers
      .filter((bw) => {
        const matchesSearch =
          bw.bowler_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bw.tactical_role?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesTeam = selectedTeam === 'ALL' || bw.primary_team === selectedTeam
        return matchesSearch && matchesTeam
      })
      .sort((a, b) => {
        let valA = a[sortField]
        let valB = b[sortField]
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA)
        }
        return sortAsc ? valA - valB : valB - valA
      })
  }, [bowlers, searchTerm, selectedTeam, sortField, sortAsc])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(field === 'rank' || field === 'adjusted_pressure_economy')
    }
  }

  const rank1 = bowlers[0]

  // Chart data: Adjusted Economy vs Baseline Economy
  const chartData = bowlers.map((bw) => ({
    name: bw.bowler_name.split(' ').slice(-1)[0],
    fullName: bw.bowler_name,
    adjEcon: bw.adjusted_pressure_economy,
    baseEcon: bw.overall_economy,
    delta: bw.delta_economy,
    score: bw.pressure_reliability_score,
    wkts: bw.pressure_wickets
  }))

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Official Deliverable B · Rajasthan Royals"
        title="Top 10 Bowlers Under Pressure"
        description="Ranked by Empirical Bayes Adjusted Pressure Economy (lower is better), run containment resilience (Δ Econ), high-leverage wicket strike rate, and sample volume confidence."
        action={<StatusBadge status="ready" label="10 / 10 Officially Ranked" />}
      />

      {/* ── #1 BOWLER SPOTLIGHT CONTAINER ── */}
      {rank1 && (
        <div
          className="p-6 rounded-xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, #111A30 60%, #1A1028 100%)',
            border: '1.5px solid rgba(212,175,55,0.4)',
            boxShadow: '0 0 35px rgba(212,175,55,0.18)',
          }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                <PlayerAvatar
                  playerId={rank1.bowler_id}
                  playerName={rank1.bowler_name}
                  teamName={rank1.primary_team}
                  role="bowler"
                  size="xl"
                  ringColor="gold"
                  showGlow={true}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#111A30]"
                  style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #997B20 100%)' }}
                >
                  <Lock className="w-4 h-4 text-black" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rr-gold bg-rr-gold/15 px-2.5 py-0.5 rounded-full border border-rr-gold/30">
                    Rank #1 · Champion Pressure Bowler
                  </span>
                  <span className="text-xs text-white/70 font-semibold">{rank1.primary_team}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">{rank1.bowler_name}</h2>
                <p className="text-xs text-rr-muted mt-1 max-w-xl">
                  {rank1.justification} · <span className="text-white/90 font-medium">{rank1.tactical_role}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-4 lg:pt-0 lg:pl-6">
              <div className="text-left lg:text-right">
                <div className="text-[10px] text-rr-muted uppercase font-bold">Reliability Score</div>
                <div className="text-3xl font-black text-white">{rank1.pressure_reliability_score.toFixed(1)}</div>
                <div className="text-[10px] text-rr-gold font-semibold">Tier 1 Pressure Lock</div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#0B1020]/80 border border-white/[0.06]">
                <div className="text-center">
                  <div className="text-[10px] text-rr-muted uppercase font-bold">Adj Econ</div>
                  <div className="text-sm font-black text-emerald-400">{rank1.adjusted_pressure_economy.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-rr-muted uppercase font-bold">Base Econ</div>
                  <div className="text-sm font-black text-white/80">{rank1.overall_economy.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-rr-muted uppercase font-bold">Wickets</div>
                  <div className="text-sm font-black text-rr-gold">{rank1.pressure_wickets}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VISUAL COMPARISON: ADJUSTED ECONOMY ACROSS TOP 10 ── */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rr-gold" />
              Adjusted Pressure Economy Comparison (Lower is Better)
            </h3>
            <p className="text-xs text-rr-muted mt-0.5">
              Empirical Bayes shrinkage with $K=48$ legal balls (~8.0 overs) prevents small-sample skew
            </p>
          </div>
          <span className="text-xs text-rr-muted">League Pressure Mean: 9.76 Econ</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#A7B2C7" fontSize={11} interval={0} angle={-20} textAnchor="end" />
              <YAxis stroke="#6B7A99" fontSize={11} domain={[5.0, 11.0]} />
              <Tooltip
                contentStyle={{ background: '#0D1428', borderColor: '#241338', borderRadius: 8, fontSize: 12 }}
                formatter={(val, name, item) => [
                  `${val.toFixed(2)} RPO (${item.payload.delta <= 0 ? '' : '+'}${item.payload.delta.toFixed(2)} vs baseline ${item.payload.baseEcon.toFixed(2)}) | ${item.payload.wkts} wickets`,
                  'Adjusted Economy'
                ]}
                labelFormatter={(name, item) => item[0]?.payload?.fullName || name}
              />
              <ReferenceLine y={9.76} stroke="#F43F5E" strokeDasharray="3 3" label={{ value: 'Pressure Avg (9.76)', fill: '#F43F5E', fontSize: 10, position: 'right' }} />
              <Bar dataKey="adjEcon" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#D4AF37' : entry.adjEcon <= 7.2 ? '#10B981' : entry.adjEcon <= 8.0 ? '#3B82F6' : '#F59E0B'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── SEARCH, FILTER & TABLE CONTAINER ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Controls Bar */}
        <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-rr-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by bowler name or tactical role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080D1B] border border-white/[0.1] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-rr-muted focus:outline-none focus:border-rr-gold"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-rr-muted" />
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-[#080D1B] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rr-gold"
              >
                {teams.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-rr-muted">
            <span>Showing <strong className="text-white">{filteredBowlers.length}</strong> of 10 bowlers</span>
          </div>
        </div>

        {/* Official Rankings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#0B1020]/60 text-rr-muted font-bold text-[10px] uppercase tracking-wider">
                <th onClick={() => handleSort('rank')} className="py-3 px-4 w-16 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Rank <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('bowler_name')} className="py-3 px-4 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">Player Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-4">Primary Team</th>
                <th onClick={() => handleSort('adjusted_pressure_economy')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Adj Econ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('overall_economy')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Base Econ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_economy')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Press Econ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('delta_economy')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Δ Econ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_wickets')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Wickets <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-4 text-center">Press Overs</th>
                <th onClick={() => handleSort('pressure_reliability_score')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Score <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-4">Tactical Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredBowlers.map((bw) => {
                const isRank1 = bw.rank === 1
                const isTop3 = bw.rank <= 3
                const isImproved = bw.delta_economy <= 0
                return (
                  <tr
                    key={bw.bowler_id}
                    className={`hover:bg-white/[0.02] transition-colors ${isRank1 ? 'bg-rr-gold/[0.03]' : ''}`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                        isRank1 ? 'bg-rr-gold text-black shadow-md shadow-rr-gold/30' : isTop3 ? 'bg-rr-gold/20 text-rr-gold border border-rr-gold/30' : 'text-rr-muted bg-white/[0.04]'
                      }`}>
                        {bw.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <PlayerAvatar
                          playerId={bw.bowler_id}
                          playerName={bw.bowler_name}
                          teamName={bw.primary_team}
                          role="bowler"
                          size="sm"
                          ringColor={isRank1 ? 'gold' : isTop3 ? 'gold' : 'none'}
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white text-xs truncate">{bw.bowler_name}</div>
                          <div className="text-[10px] text-rr-muted">{bw.bowling_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-white/80">{bw.primary_team}</td>
                    <td className="py-3.5 px-4 text-center font-black text-emerald-400 text-xs">
                      {bw.adjusted_pressure_economy.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/60 text-xs">
                      {bw.overall_economy.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/90 text-xs font-semibold">
                      {bw.pressure_economy.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-xs">
                      <span className={`px-1.5 py-0.5 rounded border ${
                        isImproved ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      }`}>
                        {bw.delta_economy > 0 ? '+' : ''}{bw.delta_economy.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-rr-gold font-bold text-xs">
                      {bw.pressure_wickets}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/80 text-xs font-medium">
                      {bw.pressure_overs}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-xs font-black text-white bg-white/[0.06] px-2 py-0.5 rounded border border-white/[0.1]">
                        {bw.pressure_reliability_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-rr-muted">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rr-gold/10 text-rr-gold border border-rr-gold/25">
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
