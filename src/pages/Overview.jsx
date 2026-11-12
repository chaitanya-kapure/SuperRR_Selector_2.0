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
} from 'lucide-react'
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
      {/* Stadium arch rings */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Cellipse cx='300' cy='420' rx='340' ry='270' stroke='%23E91E63' stroke-width='1.2' fill='none'/%3E%3Cellipse cx='300' cy='420' rx='260' ry='210' stroke='%23E91E63' stroke-width='1' fill='none'/%3E%3Cellipse cx='300' cy='420' rx='190' ry='155' stroke='%23D4AF37' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      />

      {/* Radiant pink & purple glow center */}
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

            {/* Left Pavilion */}
            <rect x="145" y="142" width="85" height="78"/>
            <rect x="154" y="126" width="18" height="22"/>
            <polygon points="163,112 154,126 172,126" fill="#E91E63" fillOpacity="0.5" strokeWidth="0"/>
            <rect x="190" y="132" width="18" height="20"/>
            <polygon points="199,118 190,132 208,132" fill="#E91E63" fillOpacity="0.45" strokeWidth="0"/>

            {/* Right Pavilion */}
            <rect x="270" y="142" width="85" height="78"/>
            <rect x="276" y="126" width="18" height="22"/>
            <polygon points="285,112 276,126 294,126" fill="#E91E63" fillOpacity="0.5" strokeWidth="0"/>
            <rect x="296" y="132" width="18" height="20"/>
            <polygon points="305,118 296,132 314,132" fill="#E91E63" fillOpacity="0.45" strokeWidth="0"/>

            {/* Outer Flanks */}
            <rect x="50" y="162" width="60" height="58"/>
            <polygon points="80,135 60,162 100,162" fill="#E91E63" fillOpacity="0.35" strokeWidth="0"/>
            <rect x="390" y="162" width="60" height="58"/>
            <polygon points="420,135 400,162 440,162" fill="#E91E63" fillOpacity="0.35" strokeWidth="0"/>

            {/* Arches */}
            <ellipse cx="250" cy="165" rx="9" ry="13" fill="#E91E63" fillOpacity="0.2"/>
            <ellipse cx="187" cy="162" rx="7" ry="10" fill="#E91E63" fillOpacity="0.15"/>
            <ellipse cx="313" cy="162" rx="7" ry="10" fill="#E91E63" fillOpacity="0.15"/>
            <rect x="0" y="212" width="500" height="15" fill="#0c0717" strokeWidth="0"/>
          </g>
        </svg>
      </div>

      {/* Cricket Action Stylized Silhouette */}
      <div className="absolute bottom-[24%] left-0 right-0 flex justify-center items-end gap-2 px-6 pointer-events-none">
        {/* Batter in high-pressure strike */}
        <svg viewBox="0 0 65 115" width="65" height="115" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="batterGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E91E63" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#FF1768" stopOpacity="0.5"/>
            </linearGradient>
          </defs>
          <circle cx="32" cy="14" r="10" fill="url(#batterGlow)"/>
          <ellipse cx="32" cy="48" rx="14" ry="24" fill="url(#batterGlow)"/>
          <rect x="22" y="70" width="8" height="32" rx="4" fill="url(#batterGlow)"/>
          <rect x="34" y="70" width="8" height="32" rx="4" fill="url(#batterGlow)"/>
          <rect x="10" y="42" width="4.5" height="30" rx="2" fill="#D4AF37" opacity="0.9" transform="rotate(-30 22 58)"/>
        </svg>

        {/* Clutch Bowler Follow-through */}
        <svg viewBox="0 0 65 115" width="65" height="115" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bowlerGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF1768" stopOpacity="0.85"/>
              <stop offset="100%" stopColor="#E91E63" stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          <circle cx="32" cy="13" r="10" fill="url(#bowlerGlow)"/>
          <ellipse cx="32" cy="46" rx="13" ry="23" fill="url(#bowlerGlow)"/>
          <rect x="22" y="68" width="8" height="34" rx="4" fill="url(#bowlerGlow)"/>
          <rect x="34" y="68" width="8" height="34" rx="4" fill="url(#bowlerGlow)"/>
          <line x1="42" y1="36" x2="56" y2="18" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
        </svg>
      </div>

      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(233,30,99,0.22)' }}
      />
    </div>
  )
}

/* Pending leaderboard row */
function PendingRow({ rank, label = 'Pending Model Calculation' }) {
  const isTop3 = rank <= 3
  return (
    <div
      className="flex items-center gap-3 px-3.5 py-2.5 border-b last:border-0"
      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
    >
      <span
        className="w-5 text-center text-xs font-bold flex-shrink-0"
        style={{ color: isTop3 ? '#D4AF37' : '#6B7A99' }}
      >
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-white/50">{label}</span>
      </div>
      <span
        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
        style={{
          background: 'rgba(255,255,255,0.04)',
          color: '#6B7A99',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        PENDING
      </span>
    </div>
  )
}

export default function Overview() {
  const audit = analyticsService.getDataAuditSummary()
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* ── HERO SECTION ── */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #111A30 0%, #0D1428 100%)',
          border: '1px solid rgba(233,30,99,0.20)',
        }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
          {/* Left Text */}
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
                SupeRR Selector 2.0 · Rajasthan Royals
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
              Advanced cricket intelligence to identify the most reliable batters and bowlers under
              pressure through rigorous match-state reconstruction, situation-adjusted metrics, and
              Bayesian reliability modeling for Rajasthan Royals' IPL 2027 auction strategy.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/batting" className="rr-btn-primary">
                <Flame className="w-4 h-4" />
                Explore Batting Analytics
              </Link>
              <Link to="/bowling" className="rr-btn-secondary">
                <Shield className="w-4 h-4" />
                Explore Bowling Analytics
              </Link>
            </div>
          </div>

          {/* Right Visual Art */}
          <div className="hidden lg:block w-[42%] flex-shrink-0 p-3 pl-0">
            <HeroVisual />
          </div>
        </div>
      </div>

      {/* ── COMPETITION STATUS BANNER ── */}
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
              Round 1 — Pressure Performance Analysis
              <span className="text-[10px] font-bold uppercase tracking-wider text-rr-gold bg-rr-gold/10 px-2 py-0.5 rounded-full border border-rr-gold/25">
                Official Brief
              </span>
            </div>
            <div className="text-xs text-rr-muted mt-0.5">
              Evaluating delivery-level performance across 883 matches (IPL 2022–2026 &amp; T20Is)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status="processing" label="Analytics Engine · In Development" />
        </div>
      </div>

      {/* ── 4 KPI CARDS (Real verified audit figures) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Matches Analysed',
            value: `${audit.matchesWithBallByBall.toLocaleString()}`,
            sublabel: `${audit.totalMatches} total (${audit.abandonedMatches} abandoned)`,
            icon: Layers,
            color: '#E91E63',
          },
          {
            label: 'Deliveries Analysed',
            value: `${audit.totalDeliveries.toLocaleString()}`,
            sublabel: 'Full delivery-level telemetry',
            icon: Database,
            color: '#D4AF37',
          },
          {
            label: 'Pressure Deliveries',
            value: 'Pending',
            sublabel: 'State engine classification in progress',
            icon: Activity,
            color: '#FF1768',
          },
          {
            label: 'Players Evaluated',
            value: `${audit.totalPlayersMapped.toLocaleString()}`,
            sublabel: `${audit.uniqueStrikers} batters · ${audit.uniqueBowlers} bowlers`,
            icon: Target,
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

      {/* ── PERFORMANCE OVERVIEW PREVIEWS (Batting & Bowling) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Batter Performance Overview Card */}
        <div
          className="p-5 rounded-xl flex flex-col"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rr-pink/10 border border-rr-pink/25 flex items-center justify-center">
                <Flame className="w-4 h-4 text-rr-pink" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Batter Pressure Performance</h3>
                <p className="text-xs text-rr-muted">Strike rate, boundary %, and clutch impact</p>
              </div>
            </div>
            <Link to="/batting" className="text-xs text-rr-pink hover:text-white flex items-center gap-1 font-medium transition-colors">
              Full Module <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { metric: 'Pressure Strike Rate', desc: 'Runs / 100 balls in clutch situations' },
              { metric: 'Pressure Boundary %', desc: '4s & 6s frequency under pressure' },
              { metric: 'Dismissal Frequency', desc: 'Balls per dismissal in high leverage' },
              { metric: 'Pressure vs Normal Delta', desc: 'Performance divergence from baseline' },
            ].map((m) => (
              <div key={m.metric} className="p-3 rounded-lg bg-[#1A2540] border border-white/[0.05]">
                <div className="text-xs font-semibold text-white/90">{m.metric}</div>
                <div className="text-[10px] text-rr-muted mt-0.5">{m.desc}</div>
                <div className="text-sm font-bold text-amber-400 mt-2">Pending Execution</div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-3 rounded-lg bg-[#080D1B] border border-white/[0.04] flex items-center justify-between">
            <span className="text-xs text-rr-muted">Baseline Model: Empirical Bayes Shrinkage</span>
            <span className="text-[10px] uppercase font-bold text-amber-400">Pipeline Stage 4</span>
          </div>
        </div>

        {/* Bowler Performance Overview Card */}
        <div
          className="p-5 rounded-xl flex flex-col"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rr-gold/10 border border-rr-gold/25 flex items-center justify-center">
                <Shield className="w-4 h-4 text-rr-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Bowler Pressure Performance</h3>
                <p className="text-xs text-rr-muted">Economy control, dot ball % &amp; wickets defending</p>
              </div>
            </div>
            <Link to="/bowling" className="text-xs text-rr-gold hover:text-white flex items-center gap-1 font-medium transition-colors">
              Full Module <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { metric: 'Pressure Economy', desc: 'Runs conceded / 6 legal deliveries' },
              { metric: 'Pressure Dot-Ball %', desc: 'Scoreless deliveries under pressure' },
              { metric: 'Pressure Wickets', desc: 'Breakthroughs in high-leverage overs' },
              { metric: 'Pressure vs Normal Delta', desc: 'Economy suppression vs standard overs' },
            ].map((m) => (
              <div key={m.metric} className="p-3 rounded-lg bg-[#1A2540] border border-white/[0.05]">
                <div className="text-xs font-semibold text-white/90">{m.metric}</div>
                <div className="text-[10px] text-rr-muted mt-0.5">{m.desc}</div>
                <div className="text-sm font-bold text-amber-400 mt-2">Pending Execution</div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-3 rounded-lg bg-[#080D1B] border border-white/[0.04] flex items-center justify-between">
            <span className="text-xs text-rr-muted">Baseline Model: Situation-Adjusted Economy</span>
            <span className="text-[10px] uppercase font-bold text-amber-400">Pipeline Stage 4</span>
          </div>
        </div>
      </div>

      {/* ── TOP 10 LEADERBOARD PREVIEWS (Batters & Bowlers) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 10 Batters Preview */}
        <div
          className="rounded-xl overflow-hidden flex flex-col"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-rr-pink" />
              <span className="text-sm font-bold text-white">Top 10 Batters Under Pressure</span>
            </div>
            <Link to="/top-batters" className="text-xs text-rr-pink hover:text-white font-medium flex items-center gap-1">
              View Leaderboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {ranks.map((r) => (
              <PendingRow key={r} rank={r} label={`Rank ${r} Batter Slot`} />
            ))}
          </div>

          <div className="p-3 bg-[#080D1B] border-t border-white/[0.05] text-[11px] text-rr-muted text-center">
            Rankings will populate upon completion of the reliability scoring pipeline.
          </div>
        </div>

        {/* Top 10 Bowlers Preview */}
        <div
          className="rounded-xl overflow-hidden flex flex-col"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-rr-gold" />
              <span className="text-sm font-bold text-white">Top 10 Bowlers Under Pressure</span>
            </div>
            <Link to="/top-bowlers" className="text-xs text-rr-gold hover:text-white font-medium flex items-center gap-1">
              View Leaderboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {ranks.map((r) => (
              <PendingRow key={r} rank={r} label={`Rank ${r} Bowler Slot`} />
            ))}
          </div>

          <div className="p-3 bg-[#080D1B] border-t border-white/[0.05] text-[11px] text-rr-muted text-center">
            Rankings will populate upon completion of the reliability scoring pipeline.
          </div>
        </div>
      </div>

      {/* ── ANALYTICS PIPELINE STATUS ── */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Analytics Pipeline</h3>
            <p className="text-xs text-rr-muted">Real-time status of each analytical stage</p>
          </div>
          <Link to="/methodology" className="text-xs text-rr-pink hover:text-white font-medium flex items-center gap-1">
            Methodology Details <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              step: '01',
              title: 'Dataset Inspection',
              desc: '883 matches, 200,999 balls audited',
              status: 'ready',
              statusText: 'Completed',
            },
            {
              step: '02',
              title: 'Match-State Engine',
              desc: 'Pre-ball telemetry & target reconstruction',
              status: 'processing',
              statusText: 'In Development',
            },
            {
              step: '03',
              title: 'Pressure Classifier',
              desc: 'RRR, balls left, leverage index',
              status: 'pending',
              statusText: 'Pending',
            },
            {
              step: '04',
              title: 'Performance Analysis',
              desc: 'Pressure vs baseline metrics',
              status: 'pending',
              statusText: 'Pending',
            },
            {
              step: '05',
              title: 'Reliability Scoring',
              desc: 'Bayesian shrinkage & sample limits',
              status: 'pending',
              statusText: 'Pending',
            },
            {
              step: '06',
              title: 'Top 10 Rankings',
              desc: 'Final official submission leaderboards',
              status: 'pending',
              statusText: 'Pending',
            },
          ].map((stage) => (
            <div
              key={stage.step}
              className="p-3.5 rounded-lg flex flex-col justify-between"
              style={{
                background: stage.status === 'ready' ? 'rgba(16,185,129,0.06)' : stage.status === 'processing' ? 'rgba(59,130,246,0.06)' : '#1A2540',
                border: stage.status === 'ready' ? '1px solid rgba(16,185,129,0.25)' : stage.status === 'processing' ? '1px solid rgba(59,130,246,0.25)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-rr-muted">{stage.step}</span>
                  {stage.status === 'ready' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : stage.status === 'processing' ? (
                    <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-rr-muted/40" />
                  )}
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
