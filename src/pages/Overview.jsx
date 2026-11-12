import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Flame,
  Shield,
  Trophy,
  Crown,
  Activity,
  ArrowRight,
  Database,
  BarChart3,
  TrendingUp,
  Target,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Zap,
  HelpCircle,
  Award
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts'
import StatusBadge from '../components/ui/StatusBadge'
import analyticsService from '../services/analyticsService'

/* Hero Visual: Cinematic Stadium & Palace silhouette CSS Art */
function HeroVisual() {
  return (
    <div
      className="relative w-full h-full min-h-[260px] overflow-hidden rounded-xl"
      style={{
        background: 'linear-gradient(135deg, #1c0a2a 0%, #100824 50%, #0d091a 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Cellipse cx='300' cy='420' rx='340' ry='270' stroke='%23E91E63' stroke-width='1.2' fill='none'/%3E%3Cellipse cx='300' cy='420' rx='260' ry='210' stroke='%23E91E63' stroke-width='1' fill='none'/%3E%3Cellipse cx='300' cy='420' rx='190' ry='155' stroke='%23D4AF37' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 75% 65% at 60% 85%, rgba(233,30,99,0.22) 0%, rgba(36,19,56,0.4) 50%, transparent 80%)',
        }}
      />
      {/* Rajasthani Palace Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-[58%] pointer-events-none">
        <svg viewBox="0 0 500 220" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="palaceGlowV2" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#E91E63" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#E91E63" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="250" cy="220" rx="270" ry="85" fill="url(#palaceGlowV2)"/>
          <g fill="#160824" stroke="#E91E63" strokeWidth="0.75" strokeOpacity="0.55">
            <ellipse cx="250" cy="126" rx="32" ry="19" fill="#160824"/>
            <rect x="228" y="125" width="44" height="95" fill="#160824"/>
            <rect x="237" y="98" width="26" height="30"/>
            <polygon points="250,75 237,98 263,98" fill="#E91E63" fillOpacity="0.7" strokeWidth="0"/>
            <rect x="145" y="142" width="85" height="78"/>
            <rect x="154" y="126" width="18" height="22"/>
            <polygon points="163,112 154,126 172,126" fill="#E91E63" fillOpacity="0.5" strokeWidth="0"/>
            <rect x="190" y="132" width="18" height="20"/>
            <polygon points="199,118 190,132 208,132" fill="#E91E63" fillOpacity="0.45" strokeWidth="0"/>
            <rect x="270" y="142" width="85" height="78"/>
            <rect x="276" y="126" width="18" height="22"/>
            <polygon points="285,112 276,126 294,126" fill="#E91E63" fillOpacity="0.5" strokeWidth="0"/>
            <rect x="296" y="132" width="18" height="20"/>
            <polygon points="305,118 296,132 314,132" fill="#E91E63" fillOpacity="0.45" strokeWidth="0"/>
            <rect x="50" y="162" width="60" height="58"/>
            <polygon points="80,135 60,162 100,162" fill="#E91E63" fillOpacity="0.35" strokeWidth="0"/>
            <rect x="390" y="162" width="60" height="58"/>
            <polygon points="420,135 400,162 440,162" fill="#E91E63" fillOpacity="0.35" strokeWidth="0"/>
            <ellipse cx="250" cy="165" rx="9" ry="13" fill="#E91E63" fillOpacity="0.2"/>
            <ellipse cx="187" cy="162" rx="7" ry="10" fill="#E91E63" fillOpacity="0.15"/>
            <ellipse cx="313" cy="162" rx="7" ry="10" fill="#E91E63" fillOpacity="0.15"/>
            <rect x="0" y="212" width="500" height="15" fill="#0c0717" strokeWidth="0"/>
          </g>
        </svg>
      </div>
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(233,30,99,0.22)' }}
      />
    </div>
  )
}

export default function Overview() {
  const [overview, setOverview] = useState(null)
  const [topBatters, setTopBatters] = useState([])
  const [topBowlers, setTopBowlers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [ovRes, batRes, bowlRes] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getTop10Batters(),
        analyticsService.getTop10Bowlers()
      ])
      if (ovRes.isLoaded) setOverview(ovRes.data)
      if (batRes.isLoaded) setTopBatters(batRes.data)
      if (bowlRes.isLoaded) setTopBowlers(bowlRes.data)
      setLoading(false)
    }
    loadData()
  }, [])

  const audit = analyticsService.getDataAuditSummary()

  // Pressure category chart data
  const pressureCategoryData = [
    { name: 'Chasing RRR Spike', count: 34180, role: 'Batting', color: '#FF1768' },
    { name: 'Chasing Death (16-20)', count: 28420, role: 'Batting', color: '#E91E63' },
    { name: 'Setting Death (16-20)', count: 22932, role: 'Batting', color: '#C2185B' },
    { name: 'Defending High RRR', count: 26145, role: 'Bowling', color: '#D4AF37' },
    { name: 'Defending Death', count: 24993, role: 'Bowling', color: '#F59E0B' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* ── HERO BANNER ── */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #111A30 0%, #0D1428 100%)',
          border: '1px solid rgba(233,30,99,0.25)',
        }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-4 self-start">
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(233,30,99,0.12)',
                  border: '1px solid rgba(233,30,99,0.30)',
                  color: '#FF1768',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                SupeRR Selector 2.0 · Rajasthan Royals IPL 2027 Auction Intelligence
              </div>
            </div>

            <h1
              className="font-black leading-tight mb-3"
              style={{ fontSize: 'clamp(26px, 3.8vw, 42px)' }}
            >
              <span className="text-white">Discover Who Delivers</span>
              <br />
              <span style={{ color: '#FF1768' }}>When It Matters.</span>
            </h1>

            <p className="text-sm leading-relaxed mb-6 max-w-xl" style={{ color: '#A7B2C7' }}>
              Advanced cricket analytics platform measuring performance divergence under high leverage.
              Powered by chronological pre-ball match state reconstruction, Empirical Bayes shrinkage,
              and multi-factor pressure reliability scoring across 200,999 deliveries.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/top-batters" className="rr-btn-primary">
                <Trophy className="w-4 h-4" />
                Top 10 Batters Leaderboard
              </Link>
              <Link to="/top-bowlers" className="rr-btn-secondary">
                <Crown className="w-4 h-4 text-rr-gold" />
                Top 10 Bowlers Leaderboard
              </Link>
              <Link to="/comparison" className="px-4 py-2 rounded-lg text-xs font-bold text-white/80 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] transition-all flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                Player Head-to-Head
              </Link>
            </div>
          </div>

          <div className="hidden lg:block w-[40%] flex-shrink-0 p-3 pl-0">
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* ── VALIDATION & STATUS BAR ── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3.5 rounded-xl"
        style={{
          background: 'linear-gradient(90deg, rgba(233,30,99,0.08) 0%, rgba(36,19,56,0.3) 100%)',
          border: '1px solid rgba(233,30,99,0.20)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(233,30,99,0.15)', border: '1px solid rgba(233,30,99,0.3)' }}
          >
            <Activity className="w-4 h-4 text-rr-pink" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              Phase 1 & Phase 2 Analytical Engines Active
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                22 / 22 Tests Passed
              </span>
            </div>
            <div className="text-xs text-rr-muted mt-0.5">
              Empirical Bayes models calibrated with 867 match histories across IPL &amp; International T20s
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status="ready" label="Production Ready" />
        </div>
      </div>

      {/* ── 4 KPI CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Matches Analysed',
            value: overview ? `${overview.total_matches.toLocaleString()}` : `${audit.matchesWithBallByBall}`,
            sublabel: `${audit.totalMatches} total (${audit.abandonedMatches} abandoned)`,
            icon: Layers,
            color: '#E91E63',
          },
          {
            label: 'Deliveries Processed',
            value: overview ? `${overview.total_deliveries.toLocaleString()}` : `${audit.totalDeliveries.toLocaleString()}`,
            sublabel: 'Zero lookahead state reconstruction',
            icon: Database,
            color: '#D4AF37',
          },
          {
            label: 'Batting Pressure Deliveries',
            value: overview ? `${overview.batting_pressure_deliveries.toLocaleString()}` : '85,532',
            sublabel: overview ? `${overview.batting_pressure_pct}% of total deliveries` : '42.55% of all balls',
            icon: Flame,
            color: '#FF1768',
          },
          {
            label: 'Bowling Pressure Deliveries',
            value: overview ? `${overview.bowling_pressure_deliveries.toLocaleString()}` : '51,138',
            sublabel: overview ? `${overview.bowling_pressure_pct}% of total deliveries` : '25.44% of all balls',
            icon: Shield,
            color: '#3B82F6',
          },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="p-4 rounded-xl flex flex-col justify-between"
              style={{
                background: '#111A30',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rr-muted">
                  {kpi.label}
                </span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: kpi.color }} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">{kpi.value}</div>
                <div className="text-[11px] text-rr-muted mt-0.5 truncate">{kpi.sublabel}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── BENCHMARK DIVERGENCE: BASELINE VS PRESSURE ── */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-rr-pink" />
              League Baseline vs Pressure Impact
            </h3>
            <p className="text-xs text-rr-muted mt-0.5">
              Empirical evidence proving how high-pressure leverage shifts scoring rates and bowling containment
            </p>
          </div>
          <span className="text-xs text-rr-gold font-semibold bg-rr-gold/10 px-2.5 py-1 rounded-full border border-rr-gold/20">
            2022–2026 T20 Population Benchmark
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Batting Divergence */}
          <div className="p-4 rounded-lg bg-[#0B1020] border border-white/[0.05] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rr-pink" />
                <span className="text-xs font-bold text-white">Batting Strike Rate Shift</span>
              </div>
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +19.64 SR Elevation
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2.5 rounded bg-white/[0.02]">
                <div className="text-[10px] text-rr-muted uppercase font-bold">Overall Baseline SR</div>
                <div className="text-xl font-black text-white mt-0.5">132.78</div>
                <div className="text-[10px] text-rr-muted">Across 193,285 balls</div>
              </div>
              <div className="p-2.5 rounded bg-rr-pink/10 border border-rr-pink/20">
                <div className="text-[10px] text-rr-pink uppercase font-bold">Pressure SR</div>
                <div className="text-xl font-black text-rr-pink mt-0.5">152.42</div>
                <div className="text-[10px] text-rr-muted">Across 85,532 pressure balls</div>
              </div>
            </div>
            <p className="text-[11px] text-rr-muted leading-relaxed">
              Teams and batters must accelerate heavily under pressure, elevating league strike rate by nearly 20 runs per 100 balls.
            </p>
          </div>

          {/* Bowling Divergence */}
          <div className="p-4 rounded-lg bg-[#0B1020] border border-white/[0.05] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-rr-gold" />
                <span className="text-xs font-bold text-white">Bowling Economy Leakage</span>
              </div>
              <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                +1.52 RPO Pressure Leak
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="p-2.5 rounded bg-white/[0.02]">
                <div className="text-[10px] text-rr-muted uppercase font-bold">Overall Baseline Econ</div>
                <div className="text-xl font-black text-white mt-0.5">8.24</div>
                <div className="text-[10px] text-rr-muted">Across 192,709 legal balls</div>
              </div>
              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20">
                <div className="text-[10px] text-amber-400 uppercase font-bold">Pressure Economy</div>
                <div className="text-xl font-black text-amber-400 mt-0.5">9.76</div>
                <div className="text-[10px] text-rr-muted">Across 51,138 pressure balls</div>
              </div>
            </div>
            <p className="text-[11px] text-rr-muted leading-relaxed">
              Death overs and defending low margins escalate economy rates. Bowlers with pressure economy under 7.50 represent elite auction assets.
            </p>
          </div>
        </div>
      </div>

      {/* ── TOP 5 SPOTLIGHT: BATTERS & BOWLERS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 Batters Preview */}
        <div
          className="rounded-xl overflow-hidden flex flex-col"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="flex items-center justify-between px-4 py-3.5 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-rr-pink" />
              <span className="text-sm font-bold text-white">Top 5 Batters Under Pressure</span>
            </div>
            <Link to="/top-batters" className="text-xs text-rr-pink hover:text-white font-medium flex items-center gap-1">
              Full Top 10 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {topBatters.slice(0, 5).map((b) => (
              <div key={b.striker_id} className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    b.rank === 1 ? 'bg-rr-gold text-black' : b.rank <= 3 ? 'bg-rr-pink/20 text-rr-pink border border-rr-pink/30' : 'bg-white/[0.05] text-rr-muted'
                  }`}>
                    {b.rank}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{b.striker_name}</div>
                    <div className="text-[10px] text-rr-muted truncate">{b.primary_team} · {b.tactical_role}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="text-xs font-black text-emerald-400">
                    {b.adjusted_pressure_strike_rate.toFixed(1)} <span className="text-[10px] text-rr-muted font-normal">Adj SR</span>
                  </div>
                  <div className="text-[10px] text-rr-muted">
                    Score: <span className="font-bold text-white">{b.pressure_reliability_score.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#080D1B] border-t border-white/[0.05] text-[11px] text-rr-muted flex items-center justify-between">
            <span>Minimum 80 pressure balls &amp; 5 matches</span>
            <Link to="/top-batters" className="text-rr-pink font-semibold hover:underline">View Deliverable A</Link>
          </div>
        </div>

        {/* Top 5 Bowlers Preview */}
        <div
          className="rounded-xl overflow-hidden flex flex-col"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="flex items-center justify-between px-4 py-3.5 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-rr-gold" />
              <span className="text-sm font-bold text-white">Top 5 Bowlers Under Pressure</span>
            </div>
            <Link to="/top-bowlers" className="text-xs text-rr-gold hover:text-white font-medium flex items-center gap-1">
              Full Top 10 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {topBowlers.slice(0, 5).map((bw) => (
              <div key={bw.bowler_id} className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    bw.rank === 1 ? 'bg-rr-gold text-black' : bw.rank <= 3 ? 'bg-rr-gold/20 text-rr-gold border border-rr-gold/30' : 'bg-white/[0.05] text-rr-muted'
                  }`}>
                    {bw.rank}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{bw.bowler_name}</div>
                    <div className="text-[10px] text-rr-muted truncate">{bw.primary_team} · {bw.tactical_role}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="text-xs font-black text-amber-400">
                    {bw.adjusted_pressure_economy.toFixed(2)} <span className="text-[10px] text-rr-muted font-normal">Adj Econ</span>
                  </div>
                  <div className="text-[10px] text-rr-muted">
                    Score: <span className="font-bold text-white">{bw.pressure_reliability_score.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#080D1B] border-t border-white/[0.05] text-[11px] text-rr-muted flex items-center justify-between">
            <span>Minimum 80 pressure legal balls &amp; 5 matches</span>
            <Link to="/top-bowlers" className="text-rr-gold font-semibold hover:underline">View Deliverable B</Link>
          </div>
        </div>
      </div>

      {/* ── PRESSURE DISTRIBUTION VISUALIZATION ── */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-rr-pink" />
              Pressure Classification Distribution
            </h3>
            <p className="text-xs text-rr-muted mt-0.5">
              Deliveries classified into contextual match-state pressure categories
            </p>
          </div>
          <span className="text-xs text-rr-muted">85,532 Batting &amp; 51,138 Bowling Pressure Balls</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pressureCategoryData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
              <XAxis type="number" stroke="#6B7A99" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" stroke="#A7B2C7" fontSize={11} width={120} />
              <Tooltip
                contentStyle={{ background: '#0D1428', borderColor: '#241338', borderRadius: 8, fontSize: 12 }}
                formatter={(val) => [`${val.toLocaleString()} deliveries`, 'Sample Volume']}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {pressureCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── ANALYTICS PIPELINE STATUS ── */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Analytical Pipeline Stages</h3>
            <p className="text-xs text-rr-muted">End-to-end auditability and execution status</p>
          </div>
          <Link to="/methodology" className="text-xs text-rr-pink hover:text-white font-medium flex items-center gap-1">
            Methodology Details <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              step: '01',
              title: 'Dataset Audit',
              desc: '883 matches, 200,999 balls audited',
              status: 'ready',
              statusText: 'Completed',
            },
            {
              step: '02',
              title: 'State Engine',
              desc: 'Pre-ball state reconstruction (10/10 tests)',
              status: 'ready',
              statusText: 'Verified',
            },
            {
              step: '03',
              title: 'Pressure Classifier',
              desc: 'Contextual leverage classification',
              status: 'ready',
              statusText: 'Verified',
            },
            {
              step: '04',
              title: 'Baseline Modeling',
              desc: 'Career & period baselines calculated',
              status: 'ready',
              statusText: 'Verified',
            },
            {
              step: '05',
              title: 'Empirical Bayes',
              desc: 'Shrinkage & multi-factor scoring (12/12 tests)',
              status: 'ready',
              statusText: 'Verified',
            },
            {
              step: '06',
              title: 'Top 10 Rankings',
              desc: 'Deliverables A & B finalized',
              status: 'ready',
              statusText: 'Generated',
            },
          ].map((stage) => (
            <div
              key={stage.step}
              className="p-3.5 rounded-lg flex flex-col justify-between"
              style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.25)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-rr-muted">{stage.step}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xs font-bold text-white mb-1 leading-snug">{stage.title}</div>
                <div className="text-[10.5px] text-rr-muted leading-tight">{stage.desc}</div>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.05]">
                <StatusBadge status={stage.status} label={stage.statusText} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
