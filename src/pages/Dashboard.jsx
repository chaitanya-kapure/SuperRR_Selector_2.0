import { Link } from 'react-router-dom'
import {
  Users, BookOpen, BarChart3, TrendingUp, Star,
  Database, Cpu, CheckCircle2, Sparkles, Crown,
  BarChart2, Target, Calendar,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

/* Cricket-player silhouettes + stadium CSS art for hero right panel */
function HeroVisual() {
  return (
    <div
      className="relative w-full h-full min-h-[260px] overflow-hidden rounded-xl"
      style={{
        background: 'linear-gradient(135deg, #1a0a24 0%, #0f0820 50%, #110818 100%)',
      }}
    >
      {/* Stadium arch rings */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Cellipse cx='300' cy='420' rx='320' ry='260' stroke='%23E91E63' stroke-width='1' fill='none'/%3E%3Cellipse cx='300' cy='420' rx='250' ry='200' stroke='%23E91E63' stroke-width='1' fill='none'/%3E%3Cellipse cx='300' cy='420' rx='180' ry='145' stroke='%23E91E63' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      />

      {/* Pink radial glow centre */}
      <div
        className="absolute"
        style={{
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 60% 80%, rgba(233,30,99,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Palace silhouette */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '55%' }}
      >
        <svg viewBox="0 0 500 220" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
          {/* Sky glow */}
          <defs>
            <radialGradient id="palaceGlow" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#E91E63" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="#E91E63" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="250" cy="220" rx="260" ry="80" fill="url(#palaceGlow)"/>

          {/* Main palace structure */}
          <g fill="#1a0828" stroke="#E91E63" strokeWidth="0.6" strokeOpacity="0.5">
            {/* Central dome */}
            <ellipse cx="250" cy="130" rx="30" ry="18" fill="#1a0828"/>
            <rect x="230" y="128" width="40" height="92" fill="#1a0828"/>
            {/* Central tower */}
            <rect x="238" y="100" width="24" height="30"/>
            <polygon points="250,80 238,100 262,100" fill="#E91E63" fillOpacity="0.6" strokeWidth="0"/>

            {/* Left wing */}
            <rect x="150" y="145" width="80" height="75"/>
            <rect x="158" y="130" width="16" height="20"/>
            <polygon points="166,116 158,130 174,130" fill="#E91E63" fillOpacity="0.5" strokeWidth="0"/>
            <rect x="192" y="135" width="16" height="18"/>
            <polygon points="200,122 192,135 208,135" fill="#E91E63" fillOpacity="0.4" strokeWidth="0"/>

            {/* Right wing */}
            <rect x="270" y="145" width="80" height="75"/>
            <rect x="276" y="130" width="16" height="20"/>
            <polygon points="284,116 276,130 292,130" fill="#E91E63" fillOpacity="0.5" strokeWidth="0"/>
            <rect x="294" y="135" width="16" height="18"/>
            <polygon points="302,122 294,135 310,135" fill="#E91E63" fillOpacity="0.4" strokeWidth="0"/>

            {/* Far left */}
            <rect x="60" y="165" width="55" height="55"/>
            <rect x="68" y="150" width="12" height="18"/>
            <polygon points="74,138 68,150 80,150" fill="#E91E63" fillOpacity="0.35" strokeWidth="0"/>

            {/* Far right */}
            <rect x="385" y="165" width="55" height="55"/>
            <rect x="420" y="150" width="12" height="18"/>
            <polygon points="426,138 420,150 432,150" fill="#E91E63" fillOpacity="0.35" strokeWidth="0"/>

            {/* Arch windows */}
            <ellipse cx="250" cy="165" rx="8" ry="11" fill="#E91E63" fillOpacity="0.15"/>
            <ellipse cx="190" cy="162" rx="6" ry="8" fill="#E91E63" fillOpacity="0.12"/>
            <ellipse cx="310" cy="162" rx="6" ry="8" fill="#E91E63" fillOpacity="0.12"/>

            {/* Ground platform */}
            <rect x="0" y="210" width="500" height="15" fill="#0f0820" strokeWidth="0"/>
          </g>
        </svg>
      </div>

      {/* Cricket player silhouettes */}
      <div className="absolute bottom-[28%] left-0 right-0 flex justify-center items-end gap-0 px-6">
        {/* Left player — batting stance */}
        <svg viewBox="0 0 60 110" width="60" height="110" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="playerL" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E91E63" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#C2185B" stopOpacity="0.5"/>
            </linearGradient>
          </defs>
          <circle cx="30" cy="12" r="10" fill="url(#playerL)"/>
          <ellipse cx="30" cy="45" rx="14" ry="22" fill="url(#playerL)"/>
          <rect x="20" y="66" width="8" height="30" rx="4" fill="url(#playerL)"/>
          <rect x="32" y="66" width="8" height="30" rx="4" fill="url(#playerL)"/>
          {/* Bat */}
          <rect x="8" y="40" width="4" height="28" rx="2" fill="#D4AF37" opacity="0.9" transform="rotate(-25 20 56)"/>
        </svg>

        {/* Centre player — taller, front */}
        <svg viewBox="0 0 70 130" width="70" height="130" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 2, position: 'relative' }}>
          <defs>
            <linearGradient id="playerC" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF1768" stopOpacity="0.85"/>
              <stop offset="100%" stopColor="#E91E63" stopOpacity="0.65"/>
            </linearGradient>
          </defs>
          <circle cx="35" cy="14" r="12" fill="url(#playerC)"/>
          <ellipse cx="35" cy="55" rx="17" ry="27" fill="url(#playerC)"/>
          <rect x="22" y="78" width="10" height="38" rx="5" fill="url(#playerC)"/>
          <rect x="38" y="78" width="10" height="38" rx="5" fill="url(#playerC)"/>
        </svg>

        {/* Right player — bowling action */}
        <svg viewBox="0 0 60 110" width="60" height="110" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="playerR" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C2185B" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#E91E63" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          <circle cx="30" cy="12" r="10" fill="url(#playerR)"/>
          <ellipse cx="30" cy="45" rx="14" ry="22" fill="url(#playerR)"/>
          <rect x="20" y="66" width="8" height="30" rx="4" fill="url(#playerR)"/>
          <rect x="32" y="66" width="8" height="30" rx="4" fill="url(#playerR)"/>
          {/* Raised arm */}
          <line x1="44" y1="40" x2="56" y2="20" stroke="#FF1768" strokeWidth="6" strokeLinecap="round" opacity="0.7"/>
        </svg>
      </div>

      {/* Top-right purple overlay for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(11,16,32,0.6) 0%, transparent 50%, rgba(8,13,27,0.2) 100%)',
        }}
      />

      {/* Pink border glow on card */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(233,30,99,0.20)' }}
      />
    </div>
  )
}

/* KPI card */
function KpiCard({ icon: Icon, label, value, note, divider }) {
  return (
    <div className="flex items-center gap-4 flex-1 min-w-0 px-5 py-4">
      {/* Icon circle */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: 'rgba(233,30,99,0.12)',
          border: '1px solid rgba(233,30,99,0.25)',
        }}
      >
        <Icon className="w-4 h-4" style={{ color: '#E91E63' }} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#A7B2C7' }}>
          {label}
        </div>
        <div className="text-xl font-black text-white mt-0.5">{value}</div>
        <div className="text-[11px] mt-0.5" style={{ color: '#6B7A99' }}>{note}</div>
      </div>
      {divider && (
        <div className="ml-auto w-px self-stretch hidden sm:block" style={{ background: 'rgba(255,255,255,0.07)' }} />
      )}
    </div>
  )
}

/* Top-10 shortlist row */
function ShortlistRow({ rank }) {
  const isTop3 = rank <= 3
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0"
      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
    >
      {/* Rank number */}
      <span
        className="w-5 text-center text-xs font-bold flex-shrink-0"
        style={{ color: isTop3 ? '#D4AF37' : '#6B7A99' }}
      >
        {rank}
      </span>
      {/* Dash placeholder */}
      <span className="text-sm font-medium flex-shrink-0" style={{ color: '#A7B2C7' }}>—</span>
      {/* Spacer */}
      <div className="flex-1" />
      {/* Pending badge */}
      <span
        className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
        style={{
          background: 'rgba(255,255,255,0.05)',
          color: '#6B7A99',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        PENDING
      </span>
    </div>
  )
}

/* Pipeline step */
function PipelineStep({ icon: Icon, label, sublabel, active, isLast }) {
  return (
    <div className="flex items-center gap-0 flex-1 min-w-0">
      <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
        {/* Node */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
          style={
            active
              ? {
                  background: 'rgba(233,30,99,0.15)',
                  border: '2px solid #E91E63',
                  boxShadow: '0 0 18px rgba(233,30,99,0.30)',
                }
              : {
                  background: 'rgba(26,37,64,0.8)',
                  border: '2px solid rgba(255,255,255,0.10)',
                }
          }
        >
          <Icon className="w-5 h-5" style={{ color: active ? '#E91E63' : '#6B7A99' }} />
        </div>
        {/* Label */}
        <div className="text-center px-1">
          <div
            className="text-[11px] font-semibold leading-tight"
            style={{ color: active ? '#E91E63' : '#A7B2C7' }}
          >
            {label}
          </div>
          {sublabel && (
            <div className="text-[10px] mt-0.5 leading-tight" style={{ color: active ? '#E91E63' : '#6B7A99' }}>
              {sublabel}
            </div>
          )}
        </div>
      </div>
      {/* Connector line */}
      {!isLast && (
        <div className="flex-1 mx-1" style={{ minWidth: '20px' }}>
          <div
            style={{
              height: '1px',
              marginBottom: '24px',
              backgroundImage: active
                ? 'repeating-linear-gradient(90deg,#E91E63 0px,#E91E63 4px,transparent 4px,transparent 10px)'
                : 'repeating-linear-gradient(90deg,rgba(255,255,255,0.12) 0px,rgba(255,255,255,0.12) 4px,transparent 4px,transparent 10px)',
            }}
          />
        </div>
      )}
    </div>
  )
}

/* Analysis view card */
function AnalysisCard({ icon: Icon, title, desc }) {
  return (
    <div
      className="flex-1 min-w-0 p-5 rounded-xl flex flex-col items-center text-center gap-3 cursor-default"
      style={{
        background: 'rgba(17,26,48,0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: 'rgba(233,30,99,0.10)',
          border: '1px solid rgba(233,30,99,0.20)',
        }}
      >
        <Icon className="w-5 h-5" style={{ color: '#E91E63' }} />
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-[11px] mt-1 leading-relaxed" style={{ color: '#A7B2C7' }}>{desc}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const shortlistRanks = [1,2,3,4,5,6,7,8,9,10]

  return (
    <div className="p-4 md:p-5 space-y-4 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* ── MAIN GRID: left content (70%) + right column (30%) ── */}
      <div className="flex gap-4 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ── HERO CARD ── */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #111A30 0%, #0D1428 100%)',
              border: '1px solid rgba(233,30,99,0.18)',
              minHeight: '260px',
            }}
          >
            {/* Subtle radial glow top-left */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'radial-gradient(ellipse 50% 70% at 10% 50%, rgba(233,30,99,0.08) 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
              {/* Text side */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                {/* Brand badge */}
                <div className="inline-flex items-center gap-2 mb-5 self-start">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(233,30,99,0.12)',
                      border: '1px solid rgba(233,30,99,0.30)',
                      color: '#E91E63',
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    SupeRR Selector 2.0
                  </div>
                </div>

                {/* Headline */}
                <h1
                  className="font-black leading-tight mb-3"
                  style={{ fontSize: 'clamp(24px, 3.5vw, 40px)' }}
                >
                  <span className="text-white">Discover Tomorrow's</span>
                  <br />
                  <span style={{ color: '#E91E63' }}>Royals.</span>
                </h1>

                {/* Subtext */}
                <p
                  className="text-sm leading-relaxed mb-6 max-w-md"
                  style={{ color: '#A7B2C7' }}
                >
                  An intelligent talent discovery platform built to uncover the next generation of
                  IPL stars through data-driven cricket analytics — for Rajasthan Royals'&nbsp;IPL 2027 auction.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Link to="/discovery" className="rr-btn-primary">
                    <Users className="w-4 h-4" />
                    Explore Players
                  </Link>
                  <Link to="/methodology" className="rr-btn-secondary">
                    <BookOpen className="w-4 h-4" />
                    Our Methodology
                  </Link>
                </div>
              </div>

              {/* Visual side — hero CSS art */}
              <div className="hidden lg:block w-[42%] flex-shrink-0 p-3 pl-0">
                <HeroVisual />
              </div>
            </div>
          </div>

          {/* ── KPI ROW ── */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: '#111A30',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex flex-wrap divide-x" style={{ '--tw-divide-opacity': 1, borderColor: 'rgba(255,255,255,0.07)' }}>
              <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }} className="flex-1 min-w-[140px]">
                <KpiCard icon={Users}    label="Players"           value="—"       note="Awaiting dataset"  />
              </div>
              <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }} className="flex-1 min-w-[140px]">
                <KpiCard icon={BarChart2} label="Domestic Leagues" value="—"       note="Awaiting dataset"  />
              </div>
              <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }} className="flex-1 min-w-[140px]">
                <KpiCard icon={Calendar} label="Age Range"         value="—"       note="Uncapped only"     />
              </div>
              <div className="flex-1 min-w-[140px]">
                <KpiCard icon={Star}     label="Shortlisted"       value="0 / 10"  note="Target: Top 10"    />
              </div>
            </div>
          </div>

          {/* ── ANALYTICS ENGINE + DATASET STATUS (side by side) ── */}
          <div className="flex flex-col md:flex-row gap-4">

            {/* Analytics Engine pipeline */}
            <div
              className="flex-1 rounded-xl p-5"
              style={{
                background: '#111A30',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-sm font-bold text-white">Analytics Engine</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(233,30,99,0.12)',
                    border: '1px solid rgba(233,30,99,0.25)',
                    color: '#E91E63',
                  }}
                >
                  Round 1
                </span>
                <span
                  className="text-[10px] font-semibold ml-1"
                  style={{ color: '#6B7A99' }}
                >
                  · Round 1 Status
                </span>
              </div>

              {/* Pipeline nodes */}
              <div className="flex items-start gap-0">
                <PipelineStep
                  icon={Database}
                  label="Dataset"
                  sublabel="(Pending)"
                  active={true}
                />
                <PipelineStep
                  icon={BarChart3}
                  label="Data Cleaning"
                  sublabel="& EDA"
                  active={false}
                />
                <PipelineStep
                  icon={TrendingUp}
                  label="Talent Scoring"
                  sublabel="& Ranking"
                  active={false}
                />
                <PipelineStep
                  icon={Star}
                  label="Top 10"
                  sublabel="Recommendation"
                  active={false}
                  isLast={true}
                />
              </div>
            </div>

            {/* Dataset status */}
            <div
              className="w-full md:w-64 flex-shrink-0 rounded-xl p-5 flex flex-col justify-between"
              style={{
                background: 'linear-gradient(135deg, #1a0a24 0%, #150d2a 100%)',
                border: '1px solid rgba(233,30,99,0.18)',
              }}
            >
              {/* Round 1 badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(233,30,99,0.15)',
                    border: '1px solid rgba(233,30,99,0.30)',
                    color: '#E91E63',
                  }}
                >
                  Round 1
                </span>
                <span className="text-[10px]" style={{ color: '#6B7A99' }}>· Round 1 Status</span>
              </div>

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{
                  background: 'rgba(233,30,99,0.12)',
                  border: '1px solid rgba(233,30,99,0.25)',
                }}
              >
                <Database className="w-5 h-5" style={{ color: '#E91E63' }} />
              </div>

              <div>
                <div className="text-sm font-bold text-white mb-2">Awaiting Official Dataset</div>
                <p className="text-[11px] leading-relaxed" style={{ color: '#A7B2C7' }}>
                  The analytics engine will be activated once the official Round 1 dataset and
                  guidelines are available.
                </p>
              </div>

              {/* Status pulse */}
              <div className="flex items-center gap-2 mt-4">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: '#E91E63',
                    animation: 'pulseDot 2s cubic-bezier(.4,0,.6,1) infinite',
                  }}
                />
                <span className="text-[11px] font-medium" style={{ color: '#E91E63' }}>
                  Dataset Pending
                </span>
              </div>
            </div>
          </div>

          {/* ── KEY ANALYSIS VIEWS ── */}
          <div
            className="rounded-xl p-5"
            style={{
              background: '#111A30',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-bold text-white">Key Analysis Views</span>
              <span className="text-sm font-medium" style={{ color: '#6B7A99' }}>
                (Will be activated with data.)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <AnalysisCard
                icon={TrendingUp}
                title="Performance Trends"
                desc="Form, consistency &amp; impact"
              />
              <AnalysisCard
                icon={Target}
                title="Role Analysis"
                desc="Batting, bowling &amp; all-round value"
              />
              <AnalysisCard
                icon={Users}
                title="Age vs Performance"
                desc="Identifying young, high-potential talent"
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="hidden xl:flex flex-col gap-4 w-64 flex-shrink-0">

          {/* Top 10 Shortlist Preview */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: '#111A30',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <Crown className="w-4 h-4 flex-shrink-0" style={{ color: '#D4AF37' }} />
              <span className="text-sm font-bold text-white">Top 10 Shortlist</span>
              <span
                className="text-xs font-semibold ml-auto"
                style={{ color: '#D4AF37' }}
              >
                (Preview)
              </span>
            </div>

            {/* Rows */}
            {shortlistRanks.map((r) => (
              <ShortlistRow key={r} rank={r} />
            ))}
          </div>

          {/* Our Focus for RR */}
          <div
            className="rounded-xl p-4"
            style={{
              background: '#111A30',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'rgba(233,30,99,0.12)',
                  border: '1px solid rgba(233,30,99,0.25)',
                }}
              >
                <Target className="w-3.5 h-3.5" style={{ color: '#E91E63' }} />
              </div>
              <span className="text-sm font-bold text-white">Our Focus for RR</span>
            </div>

            <div className="space-y-2.5">
              {[
                'Young & high-potential uncapped talent',
                'Data-backed, explainable recommendations',
                "Role balance for RR's squad needs",
                'Long-term value for IPL 2027 and beyond',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                    style={{ color: '#E91E63' }}
                  />
                  <span className="text-[12px] leading-snug" style={{ color: '#A7B2C7' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: right column stacked below on smaller screens ── */}
      <div className="flex xl:hidden flex-col sm:flex-row gap-4">
        {/* Shortlist mini */}
        <div
          className="flex-1 rounded-xl overflow-hidden"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="flex items-center gap-2 px-4 py-3 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <Crown className="w-4 h-4" style={{ color: '#D4AF37' }} />
            <span className="text-sm font-bold text-white">Top 10 Shortlist</span>
            <span className="text-xs font-semibold ml-auto" style={{ color: '#D4AF37' }}>(Preview)</span>
          </div>
          {shortlistRanks.map((r) => <ShortlistRow key={r} rank={r} />)}
        </div>

        {/* Focus for RR mini */}
        <div
          className="flex-1 rounded-xl p-4"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4" style={{ color: '#E91E63' }} />
            <span className="text-sm font-bold text-white">Our Focus for RR</span>
          </div>
          <div className="space-y-2.5">
            {[
              'Young & high-potential uncapped talent',
              'Data-backed, explainable recommendations',
              "Role balance for RR's squad needs",
              'Long-term value for IPL 2027 and beyond',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#E91E63' }} />
                <span className="text-[12px] leading-snug" style={{ color: '#A7B2C7' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
