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
} from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'

const METHODOLOGY_SECTIONS = [
  {
    number: '01',
    title: 'Problem Understanding & Competition Objectives',
    status: 'ready',
    content: `Rajasthan Royals' SupeRR Selector 2.0 challenge tasks us with solving a fundamental cricketing question: Which players genuinely elevate their game when matches are on the line, and which players regress under pressure? Rather than evaluating volume or raw averages, this framework isolates high-leverage deliveries to identify empirical resilience for IPL 2027 auction targeting.`,
  },
  {
    number: '02',
    title: 'Dataset Overview & Corpus Scope',
    status: 'ready',
    content: `The official corpus spans 883 matches (200,999 deliveries) between 2022 and 2026: 371 IPL matches across five full seasons (IPL 2022 to IPL 2026) and 482 international T20I matches across 136 series. Every delivery contains speed, stroke type, bowling variation, and dismissal details mapped across 1,217 cataloged players.`,
  },
  {
    number: '03',
    title: 'Data Cleaning & Delivery Accounting',
    status: 'ready',
    content: `Through full audit verification, our pipeline identified that: (a) 16 matches were abandoned without a ball bowled; (b) 'extras1_runs' is an enum type code (1=NoBall, 2=Wide, 3=LegBye, etc.) rather than run values; (c) true bowler wickets exclude run-outs (600), retired-out (6), and obstructing field (3); and (d) legal delivery progression only advances on non-wide and non-overstep balls.`,
  },
  {
    number: '04',
    title: 'Pre-Ball Match-State Reconstruction',
    status: 'processing',
    content: `Before evaluating pressure on any delivery, the match context must be reconstructed strictly using prior events (preventing lookahead bias). For every delivery, the engine tracks: cumulative score, wickets in hand, balls remaining in the innings, current run rate (CRR), target score, runs required, and required run rate (RRR).`,
  },
  {
    number: '05',
    title: 'Bifurcated Pressure Formulation (Batting vs Bowling)',
    status: 'processing',
    content: `Pressure is not monolithic; it behaves differently across innings and roles:
• Chasing Batters (2nd Innings): High pressure is triggered when RRR ≥ 9.5 rpo, or RRR exceeds CRR by ≥ 2.5 rpo, or in the death overs (overs 16–20) with ≤ 5 wickets in hand.
• Setting Batters (1st Innings): Pressure arises from top-order collapses (≥ 3 wickets down inside powerplay) or death overs acceleration where par score must be maximized.
• Defending Bowlers: High pressure occurs when defending totals with < 8.0 rpo margin, death-over bowling (overs 16–20), or defending sub-par targets.`,
  },
  {
    number: '06',
    title: 'Batting Pressure Metrics & Scoring',
    status: 'pending',
    content: `Batting under pressure is evaluated on four core dimensions:
1. Pressure Strike Rate (SR_p) vs Normal Baseline Strike Rate (SR_n)
2. Boundary Frequency in Pressure Overs (% of balls hitting 4 or 6)
3. Dot-Ball Resistance (% of non-scoring balls suppressed)
4. Wicket Preservation (Balls per dismissal under pressure vs normal)`,
  },
  {
    number: '07',
    title: 'Bowling Pressure Metrics & Scoring',
    status: 'pending',
    content: `Bowling under pressure is evaluated on:
1. Pressure Economy Rate (Econ_p) vs Normal Baseline Economy (Econ_n)
2. Dot-Ball Generation Rate (% of pressure legal balls yielding 0 runs)
3. Breakthrough Frequency (Balls per true bowler wicket in pressure situations)
4. Boundary Concession Resistance (Suppression of boundary balls in death overs)`,
  },
  {
    number: '08',
    title: 'Player Baseline Computation',
    status: 'pending',
    content: `A raw strike rate of 150 under pressure means something vastly different for a top-order anchor whose normal SR is 125 (+25 delta) versus a power-hitter whose normal SR is 170 (-20 regression). Each player's normal performance serves as their personalized benchmark to measure true situational elevation.`,
  },
  {
    number: '09',
    title: 'Empirical Bayes Shrinkage & Sample Size Reliability',
    status: 'pending',
    content: `To prevent small-sample anomalies (e.g. a batter facing 6 balls and hitting two sixes achieving a 200 SR), we apply Empirical Bayes shrinkage. A player's observed pressure metric is regressed toward the league positional prior based on their sample size (balls faced or overs bowled).`,
  },
  {
    number: '10',
    title: 'Composite Reliability Scoring',
    status: 'pending',
    content: `The final Batting Pressure Reliability Score (BPRS) and Bowling Pressure Reliability Score (BPRS) synthesize the situation-adjusted metric, baseline delta, and Bayesian sample reliability into a normalized 0–100 index for final ranking.`,
  },
  {
    number: '11',
    title: 'Validation & Sensitivity Analysis',
    status: 'pending',
    content: `Rankings will be subjected to bootstrap consistency checks across match samples and format-split validations (testing whether rankings remain stable when IPL and T20I weights are varied).`,
  },
  {
    number: '12',
    title: 'Analytical Limitations',
    status: 'pending',
    content: `We explicitly acknowledge limitations: pitch conditions, boundary sizes, and opposition bowling attack strengths cannot be fully parameterized from standard ball-by-ball logs. Our model documents these variances transparently.`,
  },
]

export default function Methodology() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Methodology & Governance"
        title="Analytical Framework & Pressure Model"
        description="The mathematical principles, situational classifications, baseline adjustments, and reliability models powering SupeRR Selector 2.0."
        action={<StatusBadge status="processing" label="Model Development" />}
      />

      {/* Philosophy Statement */}
      <div
        className="p-5 md:p-6 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(233,30,99,0.08) 0%, #111A30 60%, #1A1028 100%)',
          border: '1px solid rgba(233,30,99,0.20)',
        }}
      >
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-9 h-9 rounded-lg bg-rr-pink/15 border border-rr-pink/30 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4.5 h-4.5 text-rr-pink" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Our Methodological Philosophy</h3>
            <p className="text-xs text-rr-muted mt-1 leading-relaxed">
              In professional cricket intelligence, pressure cannot be reduced to a single arbitrary cutoff
              like "overs 16–20". A delivery is only high-pressure if the outcome of the match heavily hinges
              on its result. Our system models pressure as a dynamic state of leverage, comparing each player's
              pressure output against their established baseline to identify true match-winners.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#080D1B] border border-white/[0.04]">
          <p className="text-xs italic text-rr-muted/90">
            "We do not reward reputation or raw volume. Every player in the final Top 10 lists must possess
            statistically significant proof of clutch performance, backed by Empirical Bayes shrinkage to eliminate
            small-sample distortions."
          </p>
        </div>
      </div>

      {/* 12 Detailed Sections */}
      <div className="space-y-3.5">
        {METHODOLOGY_SECTIONS.map((sec) => (
          <div
            key={sec.number}
            className="rounded-xl overflow-hidden"
            style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#1A2540] border-b border-white/[0.05]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-rr-pink font-mono px-2 py-0.5 rounded bg-rr-pink/10 border border-rr-pink/20">
                  {sec.number}
                </span>
                <h4 className="text-xs font-bold text-white">{sec.title}</h4>
              </div>
              <StatusBadge status={sec.status} label={sec.status === 'ready' ? 'Verified' : sec.status === 'processing' ? 'Active' : 'Planned'} />
            </div>

            <div className="p-4 sm:p-5 text-xs text-rr-muted leading-relaxed whitespace-pre-line">
              {sec.content}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimers */}
      <div
        className="p-4 rounded-xl flex items-start gap-3"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-rr-muted leading-relaxed">
          <span className="text-white font-semibold">Competition Transparency:</span> This methodology report
          reflects our audited data engineering rules and proposed statistical formulations. As the Python
          analytics scripts complete execution in our codebase, verified tables and empirical results will
          dynamically populate the corresponding sections.
        </div>
      </div>

    </div>
  )
}
