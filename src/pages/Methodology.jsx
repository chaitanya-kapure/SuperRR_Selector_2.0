import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lightbulb,
  FlaskConical,
  Scale,
  Target,
  Flame,
  Shield,
  Layers,
  Activity,
  Zap,
  Info
} from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'

const METHODOLOGY_SECTIONS = [
  {
    number: '01',
    title: 'Problem Definition & Core Objectives',
    status: 'ready',
    content: `Rajasthan Royals' official challenge asks us to: "Identify the Most Reliable Players Under Pressure" using proprietary domestic and international T20 data from 2022 to 2026. The objective is to identify and rank the 10 best-performing batters and 10 best-performing bowlers whose performance in high-pressure match situations demonstrates genuine, reproducible resilience rather than small-sample luck, directly informing Rajasthan Royals' IPL 2027 auction strategy.`,
  },
  {
    number: '02',
    title: 'Dataset Corpus & Scope of Processing',
    status: 'ready',
    content: `The official dataset spans 883 matches across 141 competitions between 2022 and 2026, comprising 371 IPL matches (IPL 2022 through IPL 2026) and 482 international T20Is across 136 bilateral and multi-nation series. Exactly 867 matches contain ball-by-ball delivery records (200,999 total deliveries), while 16 matches were confirmed washouts without a ball bowled. Master mappings cover 1,217 players (888 unique strikers, 647 unique bowlers).`,
  },
  {
    number: '03',
    title: 'Match-State Reconstruction Engine (Zero Lookahead)',
    status: 'ready',
    content: `Before classifying pressure on any delivery, the match state immediately preceding that delivery must be reconstructed strictly from prior events to prevent lookahead bias. For all 200,999 deliveries, our vectorized engine calculates: innings, batting/bowling team, striker, bowler, pre-delivery score, pre-delivery wickets fallen, legal balls bowled, balls remaining, revised target, runs required, current run rate (CRR), and required run rate (RRR). Innings 1 (setting totals) and Innings 2 (chasing targets) are processed independently.`,
  },
  {
    number: '04',
    title: 'Bifurcated Contextual Pressure Classification',
    status: 'ready',
    content: `Pressure is not synonymous with death overs; it is situational:
• Batters Chasing (2nd Innings): High pressure triggers when Required Run Rate (RRR) ≥ 9.0 rpo, or RRR exceeds CRR by ≥ 2.0 rpo, or in overs 16–20 with ≤ 5 wickets in hand.
• Batters Setting (1st Innings): Pressure triggers when top-order collapse occurs (score ≤ 40 with ≥ 3 wickets lost), or during death overs (overs 16–20) where par score maximization is critical.
• Bowlers Defending (2nd Innings): High pressure triggers when defending totals where opponent RRR ≤ 9.5 rpo, or bowling in overs 16–20 with match margin < 24 runs.
• Bowlers Setting (1st Innings): Pressure triggers in overs 16–20 death overs to restrict target inflation.
Across the corpus, 85,532 deliveries (42.6%) were classified as batting pressure and 51,138 deliveries (25.4%) as bowling pressure.`,
  },
  {
    number: '05',
    title: 'Batting & Bowling Cricket Accounting Rules',
    status: 'ready',
    content: `Strict cricket accounting rules are enforced across all baseline and pressure computations:
1. Balls Faced: Only deliveries where extras_type != 'wide' count as balls faced by the batter. Oversteps / no-balls count as balls faced.
2. Bowler Deliveries & Runs Conceded: Bowler legal deliveries count when is_legal_delivery == True (excluding wides and oversteps). Runs conceded include off-the-bat runs, wides, and no-balls; byes and leg-byes are strictly excluded.
3. Bowler Dismissals: Only true bowler dismissals count toward bowler wickets: Bowled (1), Caught (2), LBW (3), Stumped (5), Hit Wicket (6). Run-outs (600) and retired outs (6) are excluded.`,
  },
  {
    number: '06',
    title: 'Empirical Bayes Shrinkage Formulation',
    status: 'ready',
    content: `Raw rates in small pressure samples suffer from severe random variance. Empirical Bayes shrinkage pulls noisy observed rates toward an informative prior (the player's established baseline) as a function of sample size:
Adjusted Rate = w * Observed_Pressure_Rate + (1 - w) * Prior_Baseline_Rate
where shrinkage weight w = n / (n + K).
• Batting Strike Rate: n = pressure balls faced, prior = player baseline SR, prior strength K_bat = 40.0 balls (~6.4 overs).
• Bowling Economy Rate: n = pressure legal balls, prior = player baseline economy, prior strength K_bowl = 48.0 legal balls (8.0 overs).
When sample size is small (e.g. 10 balls), 80% of the rating derives from the player's established baseline, eliminating flash-in-the-pan artifacts. When sample size is large (e.g. 400+ balls), over 90% of the rating reflects observed pressure performance.`,
  },
  {
    number: '07',
    title: 'Multi-Factor Pressure Reliability Score (0 to 100)',
    status: 'ready',
    content: `To rank players across multiple performance dimensions, composite scores (0–100) are computed:
• Batting Reliability Score:
  = 0.40 * S_adj_sr + 0.25 * S_delta_sr + 0.20 * S_boundary + 0.15 * S_volume
  - S_adj_sr (40%): Adjusted Pressure Strike Rate scaled from 110.0 to 200.0.
  - S_delta_sr (25%): Strike Rate Delta (Pressure SR - Overall SR) scaled from -15.0 to +30.0.
  - S_boundary (20%): Boundary runs under pressure (% of runs from 4s & 6s) scaled from 30% to 80%.
  - S_volume (15%): sqrt(balls / 400) * 100 confidence scaling.

• Bowling Reliability Score:
  = 0.40 * S_adj_econ + 0.25 * S_delta_econ + 0.20 * S_wickets + 0.15 * S_volume
  - S_adj_econ (40%): Adjusted Economy (lower is better) scaled from 12.00 to 6.00.
  - S_delta_econ (25%): Economy Resilience (Overall Econ - Pressure Econ) scaled from -2.00 to +2.00.
  - S_wickets (20%): Pressure wicket strike rate scaled from 0.00 to 0.08 wkts/ball.
  - S_volume (15%): sqrt(legal_balls / 400) * 100 confidence scaling.

Mathematical Justification:
The 40/25/20/15 weighting represents a multi-criteria decision framework tailored for Rajasthan Royals' auction requirements. Absolute efficiency (40%) ensures the player meets minimum competitive thresholds; delta resilience (25%) rewards psychological fortitude; execution (20%) measures boundary/wicket impact; and volume confidence (15%) guards against unproven samples. These weights are transparent heuristic choices designed for strategic utility rather than unconstrained black-box regression coefficients.`,
  },
  {
    number: '08',
    title: 'Eligibility Thresholds & Known Limitations',
    status: 'ready',
    content: `Eligibility Cutoffs:
• Batters: Minimum 80 pressure balls faced and minimum 5 pressure matches (255 qualifying batters).
• Bowlers: Minimum 80 pressure legal balls (deliveries bowled in pressure states excluding wides and oversteps, ≈ 13.3 pressure overs) and minimum 5 pressure matches (172 qualifying bowlers).

Known Limitations:
1. Pitch / Venue Variance: Raw economy and strike rates do not adjust for high-scoring venue bias (e.g. Chinnaswamy Stadium vs Chepauk).
2. Opposition Quality: Deliveries bowled against elite top-order batters are weighted identically to lower-order tailenders.
3. Non-Striker Run-Outs: A batter running out their partner under pressure is not penalized in personal strike rates.
These limitations highlight areas for future expansion in Phase 4.`,
  },
]

export default function Methodology() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Deliverable C · Official Methodology Report"
        title="Analytical Framework & Explainability"
        description="Comprehensive documentation of match-state reconstruction, situation-adjusted pressure classification, Empirical Bayes shrinkage, and multi-factor reliability scoring."
        action={<StatusBadge status="ready" label="Methodology Certified" />}
      />

      {/* ── CORE PRINCIPLES BANNER ── */}
      <div
        className="p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(233,30,99,0.1) 0%, #111A30 60%, rgba(212,175,55,0.08) 100%)',
          borderColor: 'rgba(233,30,99,0.25)',
        }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rr-pink/15 border border-rr-pink/30 flex items-center justify-center flex-shrink-0">
            <FlaskConical className="w-5 h-5 text-rr-pink" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              Statistically Grounded &amp; Fully Explainable
              <span className="text-[10px] font-bold uppercase tracking-wider text-rr-gold bg-rr-gold/10 px-2 py-0.5 rounded-full border border-rr-gold/25">
                Zero Black-Box Scoring
              </span>
            </div>
            <div className="text-xs text-rr-muted mt-0.5">
              Every ranking is backed by delivery-level audit trails, mathematical identities, and reproducible Bayesian shrinkage.
            </div>
          </div>
        </div>
      </div>

      {/* ── 8 METHODOLOGY SECTIONS ── */}
      <div className="space-y-4">
        {METHODOLOGY_SECTIONS.map((sec) => (
          <div
            key={sec.number}
            className="p-5 rounded-xl"
            style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-black text-rr-pink flex items-center justify-center flex-shrink-0">
                  {sec.number}
                </span>
                <h3 className="text-sm font-bold text-white">{sec.title}</h3>
              </div>
              <StatusBadge status="ready" label="Verified" />
            </div>

            <div className="text-xs text-white/80 leading-relaxed whitespace-pre-line pl-10 font-sans">
              {sec.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
