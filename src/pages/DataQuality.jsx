import { useState, useEffect } from 'react'
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Search,
  Activity,
  Layers,
  Sparkles,
  Check,
  Award
} from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'
import analyticsService from '../services/analyticsService'

export default function DataQuality() {
  const audit = analyticsService.getDataAuditSummary()

  const filesInventory = [
    { name: 'competitions.csv', rows: '141', cols: '4', size: '7.6 KB', purpose: 'Competition metadata, formats (T20/T20I), and seasons (2022–2026).' },
    { name: 'teams.csv', rows: '353', cols: '3', size: '6.9 KB', purpose: '38 unique franchises and national teams mapped across competitions.' },
    { name: 'matches.csv', rows: '883', cols: '22', size: '123.8 KB', purpose: 'Match dates, venues, captains, toss results, revised overs & targets.' },
    { name: 'ball_by_ball.csv', rows: '200,999', cols: '33', size: '41.1 MB', purpose: 'Telemetry for every delivery: bowler, striker, speeds, dismissals, runs.' },
    { name: 'playing_eleven.csv', rows: '28,381', cols: '9', size: '966.3 KB', purpose: 'Match lineups, batting orders, captains, keepers, and impact players.' },
    { name: 'competition_team_player_mapping.csv', rows: '6,413', cols: '6', size: '463.0 KB', purpose: 'Master player mapping for 1,217 players across teams & tournaments.' },
  ]

  const phase1Tests = [
    { title: 'T1: Legal Ball Progression Monotonicity', status: 'passed', detail: 'Legal balls sequence strictly increases from 0 to 120 per innings without skipping or stalling.' },
    { title: 'T2: Wicket Count Cumulative Progression', status: 'passed', detail: 'Innings wickets track strictly from 0 to 10. No negative wickets or increments > 1 per ball.' },
    { title: 'T3: Extras Accounting & Overstep Separation', status: 'passed', detail: 'extras1_runs decoded as categorical ID. extras_2_runs correctly isolated as actual penalty run count.' },
    { title: 'T4: Wide Non-Legal Delivery Accounting', status: 'passed', detail: '7,714 wides correctly marked as non-legal deliveries; zero legal ball count progression on wides.' },
    { title: 'T5: Overstep / No-Ball Accounting', status: 'passed', detail: '576 no-balls correctly charge 1 run to bowler and advance batter balls faced without advancing legal balls.' },
    { title: 'T6: True Bowler Dismissal vs Run-Out Separation', status: 'passed', detail: '600 run-outs and 9 non-bowler dismissals excluded from bowler wickets across all 867 matches.' },
    { title: 'T7: Innings Transition & Cumulative State Reset', status: 'passed', detail: 'Pre-score, wickets, and legal balls cleanly reset to 0 upon start of 2nd innings.' },
    { title: 'T8: Revised Target & Runs Required Accounting', status: 'passed', detail: 'DLS and revised targets verified; runs required strictly equals (Target - PreScore) in 2nd innings.' },
    { title: 'T9: Zero Lookahead Pre-Ball State Guarantee', status: 'passed', detail: 'Verified that pre_score and pre_wickets on ball N never include runs or dismissals occurring on ball N.' },
    { title: 'T10: Second-Innings RRR & Pressure Convergence', status: 'passed', detail: 'Required Run Rate verified strictly on pre-ball remaining balls; pressure flags activate deterministically.' },
  ]

  const phase2Tests = [
    { title: 'T1: Batting Ball Accounting (Wides Excluded)', status: 'passed', detail: 'Total balls faced equals total deliveries minus wides (200,999 - 7,714 = 193,285; exact 0 discrepancy).' },
    { title: 'T2: Batting Run Conservation', status: 'passed', detail: 'Dataset off-bat runs (246,750) exactly matches the sum of player batting runs across all 888 batters.' },
    { title: 'T3: Batting Strike Rate Mathematical Validity', status: 'passed', detail: 'Verified that (runs / balls_faced) * 100 holds across all qualifying batters with max discrepancy < 0.0001.' },
    { title: 'T4: Bowling Legal Ball Accounting', status: 'passed', detail: '192,709 legal deliveries matched across all 647 bowlers (wides and oversteps excluded).' },
    { title: 'T5: Bowling Runs Conceded Accounting', status: 'passed', detail: '261,315 bowler runs conceded accurately charges batter runs, wides, and no-balls; byes and leg-byes excluded.' },
    { title: 'T6: Bowling Economy Rate Mathematical Validity', status: 'passed', detail: 'Verified that (runs_conceded / legal_balls) * 6.0 holds across all qualifying bowlers.' },
    { title: 'T7: Bowler Wickets Accounting', status: 'passed', detail: '7,781 bowler dismissals counted; run-outs strictly excluded from bowler wickets.' },
    { title: 'T8: Zero-Division & Edge-Case Protection', status: 'passed', detail: 'Safe zero handling guards against crashes on zero balls faced, zero legal balls, or zero wickets.' },
    { title: 'T9: Performance Delta Mathematical Identity', status: 'passed', detail: 'Verified that Δ SR = Pressure SR - Overall SR and Δ Econ = Pressure Econ - Overall Econ.' },
    { title: 'T10: Empirical Bayes Shrinkage Boundedness', status: 'passed', detail: 'Adjusted rates strictly bounded between observed pressure rates and baseline priors across all players.' },
    { title: 'T11: Eligibility Threshold Enforcement', status: 'passed', detail: 'All ranked batters satisfy ≥ 80 pressure balls; all ranked bowlers satisfy ≥ 80 pressure legal balls.' },
    { title: 'T12: Ranking Uniqueness & Completeness', status: 'passed', detail: 'Top 10 Batters and Top 10 Bowlers contain exactly 10 distinct, non-null, uniquely ranked players.' },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Engineering & Analytical Rigor"
        title="Data Quality & Verification Audit"
        description="Delivery-level accounting validation, zero-lookahead verification, and automated regression test results across 200,999 balls."
        action={<StatusBadge status="ready" label="22 / 22 Tests Passed (100%)" />}
      />

      {/* ── AUDIT SUMMARY KPIS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Corpus Deliveries', value: '200,999', note: '867 matches with ball-by-ball', color: '#E91E63' },
          { label: 'Abandoned Washouts', value: '16', note: 'Verified zero balls bowled', color: '#D4AF37' },
          { label: 'Phase 1 Tests', value: '10 / 10', note: 'Reconstruction & accounting', color: '#10B981' },
          { label: 'Phase 2 Tests', value: '12 / 12', note: 'Modeling & Empirical Bayes', color: '#10B981' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="p-4 rounded-xl flex flex-col justify-between"
            style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-rr-muted mb-1">
              {kpi.label}
            </div>
            <div>
              <div className="text-2xl font-black text-white">{kpi.value}</div>
              <div className="text-[11px] text-rr-muted mt-0.5">{kpi.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── PHASE 2 VALIDATION TEST RESULTS (12 TESTS) ── */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Phase 2 Automated Verification Tests (12 / 12 Passed)
            </h3>
            <p className="text-xs text-rr-muted mt-0.5">
              Rigorous verification of Bayesian shrinkage, cricket accounting identities, and ranking completeness
            </p>
          </div>
          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            100% Pass Rate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {phase2Tests.map((t) => (
            <div
              key={t.title}
              className="p-3.5 rounded-lg bg-[#0B1020] border border-white/[0.05] flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white mb-0.5">{t.title}</div>
                <div className="text-[11px] text-rr-muted leading-relaxed">{t.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHASE 1 VALIDATION TEST RESULTS (10 TESTS) ── */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Phase 1 Match-State Reconstruction Tests (10 / 10 Passed)
            </h3>
            <p className="text-xs text-rr-muted mt-0.5">
              Verification of zero-lookahead pre-ball telemetry, DLS target handling, and dismissal accounting
            </p>
          </div>
          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            100% Pass Rate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {phase1Tests.map((t) => (
            <div
              key={t.title}
              className="p-3.5 rounded-lg bg-[#0B1020] border border-white/[0.05] flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white mb-0.5">{t.title}</div>
                <div className="text-[11px] text-rr-muted leading-relaxed">{t.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RAW DATASET INVENTORY ── */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-rr-pink" />
              Official Data Pack Inventory
            </h3>
            <p className="text-xs text-rr-muted mt-0.5">
              Verified record counts and schema structure across raw data files
            </p>
          </div>
          <span className="text-xs text-rr-muted">6 Core Tables Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-rr-muted font-bold text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">File Name</th>
                <th className="py-2.5 px-3 text-right">Row Count</th>
                <th className="py-2.5 px-3 text-center">Columns</th>
                <th className="py-2.5 px-3 text-right">Size</th>
                <th className="py-2.5 px-3">Functional Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filesInventory.map((f) => (
                <tr key={f.name} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-xs text-rr-pink font-semibold">{f.name}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-white">{f.rows}</td>
                  <td className="py-2.5 px-3 text-center text-white/70">{f.cols}</td>
                  <td className="py-2.5 px-3 text-right text-white/60">{f.size}</td>
                  <td className="py-2.5 px-3 text-rr-muted text-[11px]">{f.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
