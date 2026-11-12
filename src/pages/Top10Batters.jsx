import { useState, useEffect, useMemo } from 'react'
import {
  Trophy,
  Flame,
  Crown,
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
  TrendingUp,
  Download
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
import analyticsService from '../services/analyticsService'

export default function Top10Batters() {
  const [batters, setBatters] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('ALL')
  const [sortField, setSortField] = useState('rank')
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    async function fetchBatters() {
      const res = await analyticsService.getTop10Batters()
      if (res.isLoaded) {
        setBatters(res.data)
      }
      setLoading(false)
    }
    fetchBatters()
  }, [])

  // Teams list for filtering
  const teams = useMemo(() => {
    const list = Array.from(new Set(batters.map((b) => b.primary_team).filter(Boolean)))
    return ['ALL', ...list]
  }, [batters])

  // Filtered & sorted batters
  const filteredBatters = useMemo(() => {
    return batters
      .filter((b) => {
        const matchesSearch =
          b.striker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.tactical_role?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesTeam = selectedTeam === 'ALL' || b.primary_team === selectedTeam
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
  }, [batters, searchTerm, selectedTeam, sortField, sortAsc])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(field === 'rank')
    }
  }

  const rank1 = batters[0]

  // Chart data: Adjusted SR vs Baseline SR
  const chartData = batters.map((b) => ({
    name: b.striker_name.split(' ').slice(-1)[0],
    fullName: b.striker_name,
    adjSR: b.adjusted_pressure_strike_rate,
    baseSR: b.overall_strike_rate,
    delta: b.strike_rate_delta,
    score: b.pressure_reliability_score
  }))

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Official Deliverable A · Rajasthan Royals"
        title="Top 10 Batters Under Pressure"
        description="Ranked by Empirical Bayes Adjusted Strike Rate, performance delta (Δ SR), boundary generation under pressure, and sample volume confidence."
        action={<StatusBadge status="ready" label="10 / 10 Officially Ranked" />}
      />

      {/* ── #1 BATTER SPOTLIGHT CONTAINER ── */}
      {rank1 && (
        <div
          className="p-6 rounded-xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(233,30,99,0.2) 0%, #111A30 60%, #1A1028 100%)',
            border: '1.5px solid rgba(233,30,99,0.4)',
            boxShadow: '0 0 35px rgba(233,30,99,0.18)',
          }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #997B20 100%)',
                  boxShadow: '0 0 25px rgba(212,175,55,0.4)',
                }}
              >
                <Crown className="w-9 h-9 text-black" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rr-gold bg-rr-gold/15 px-2.5 py-0.5 rounded-full border border-rr-gold/30">
                    Rank #1 · Champion Pressure Batter
                  </span>
                  <span className="text-xs text-white/70 font-semibold">{rank1.primary_team}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">{rank1.striker_name}</h2>
                <p className="text-xs text-rr-muted mt-1 max-w-xl">
                  {rank1.justification} · <span className="text-white/90 font-medium">{rank1.tactical_role}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-4 lg:pt-0 lg:pl-6">
              <div className="text-left lg:text-right">
                <div className="text-[10px] text-rr-muted uppercase font-bold">Reliability Score</div>
                <div className="text-3xl font-black text-white">{rank1.pressure_reliability_score.toFixed(1)}</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Tier 1 Elite Finisher</div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#0B1020]/80 border border-white/[0.06]">
                <div className="text-center">
                  <div className="text-[10px] text-rr-muted uppercase font-bold">Adj SR</div>
                  <div className="text-sm font-black text-emerald-400">{rank1.adjusted_pressure_strike_rate.toFixed(1)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-rr-muted uppercase font-bold">Base SR</div>
                  <div className="text-sm font-black text-white/80">{rank1.overall_strike_rate.toFixed(1)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-rr-muted uppercase font-bold">Δ SR</div>
                  <div className="text-sm font-black text-rr-pink">+{rank1.strike_rate_delta.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VISUAL COMPARISON: ADJUSTED SR ACROSS TOP 10 ── */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rr-pink" />
              Adjusted Pressure Strike Rate Comparison (Empirical Bayes)
            </h3>
            <p className="text-xs text-rr-muted mt-0.5">
              Bayesian shrinkage pulls extreme small-sample noise toward player baseline ($K=40$ balls)
            </p>
          </div>
          <span className="text-xs text-rr-muted">League Pressure Mean: 152.4 SR</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#A7B2C7" fontSize={11} interval={0} angle={-20} textAnchor="end" />
              <YAxis stroke="#6B7A99" fontSize={11} domain={[120, 210]} />
              <Tooltip
                contentStyle={{ background: '#0D1428', borderColor: '#241338', borderRadius: 8, fontSize: 12 }}
                formatter={(val, name, item) => [
                  `${val.toFixed(1)} (${item.payload.delta >= 0 ? '+' : ''}${item.payload.delta.toFixed(1)} vs baseline ${item.payload.baseSR.toFixed(1)})`,
                  'Adjusted Pressure SR'
                ]}
                labelFormatter={(name, item) => item[0]?.payload?.fullName || name}
              />
              <ReferenceLine y={152.4} stroke="#E91E63" strokeDasharray="3 3" label={{ value: 'Pressure Avg (152.4)', fill: '#E91E63', fontSize: 10, position: 'right' }} />
              <Bar dataKey="adjSR" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#D4AF37' : index <= 2 ? '#FF1768' : '#3B82F6'}
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
                placeholder="Search by batter name or tactical role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080D1B] border border-white/[0.1] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-rr-muted focus:outline-none focus:border-rr-pink"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-rr-muted" />
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="bg-[#080D1B] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rr-pink"
              >
                {teams.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-rr-muted">
            <span>Showing <strong className="text-white">{filteredBatters.length}</strong> of 10 batters</span>
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
                <th onClick={() => handleSort('striker_name')} className="py-3 px-4 cursor-pointer hover:text-white">
                  <div className="flex items-center gap-1">Player Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-4">Primary Team</th>
                <th onClick={() => handleSort('adjusted_pressure_strike_rate')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Adj SR <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('overall_strike_rate')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Base SR <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_strike_rate')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Press SR <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('strike_rate_delta')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Δ SR <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('pressure_balls_faced')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Balls Faced <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-4 text-center">Boundary %</th>
                <th onClick={() => handleSort('pressure_reliability_score')} className="py-3 px-4 text-center cursor-pointer hover:text-white">
                  <div className="flex items-center justify-center gap-1">Score <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-4">Tactical Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredBatters.map((b) => {
                const isRank1 = b.rank === 1
                const isTop3 = b.rank <= 3
                return (
                  <tr
                    key={b.striker_id}
                    className={`hover:bg-white/[0.02] transition-colors ${isRank1 ? 'bg-rr-gold/[0.03]' : ''}`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                        isRank1 ? 'bg-rr-gold text-black shadow-md shadow-rr-gold/30' : isTop3 ? 'bg-rr-pink/20 text-rr-pink border border-rr-pink/30' : 'text-rr-muted bg-white/[0.04]'
                      }`}>
                        {b.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs">{b.striker_name}</div>
                      <div className="text-[10px] text-rr-muted">{b.batting_type}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-white/80">{b.primary_team}</td>
                    <td className="py-3.5 px-4 text-center font-black text-emerald-400 text-xs">
                      {b.adjusted_pressure_strike_rate.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/60 text-xs">
                      {b.overall_strike_rate.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/90 text-xs font-semibold">
                      {b.pressure_strike_rate.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-xs">
                      <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        +{b.strike_rate_delta.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/80 text-xs font-medium">
                      {b.pressure_balls_faced}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/80 text-xs">
                      {b.pressure_boundary_pct?.toFixed(1) || '—'}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-xs font-black text-white bg-white/[0.06] px-2 py-0.5 rounded border border-white/[0.1]">
                        {b.pressure_reliability_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-rr-muted">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rr-pink/10 text-rr-pink border border-rr-pink/25">
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
