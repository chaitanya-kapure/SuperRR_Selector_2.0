import { useState } from 'react'
import {
  Crown,
  Shield,
  Sparkles,
  ArrowRight,
  Target,
  Activity,
  Layers,
} from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'

export default function Top10Bowlers() {
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Official Deliverable 2"
        title="Top 10 Bowlers Under Pressure"
        description="Ten bowlers who demonstrate exceptional reliability when defending runs, stifling boundaries, and claiming breakthroughs in high-pressure match situations."
        action={<StatusBadge status="processing" label="Pipeline: Stage 5" />}
      />

      {/* ── #1 BOWLER SPOTLIGHT CONTAINER (Empty/Pending State) ── */}
      <div
        className="p-6 rounded-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, #111A30 60%, #1E1A10 100%)',
          border: '1.5px solid rgba(212,175,55,0.35)',
          boxShadow: '0 0 30px rgba(212,175,55,0.15)',
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #997B20 100%)',
                boxShadow: '0 0 20px rgba(212,175,55,0.35)',
              }}
            >
              <Crown className="w-8 h-8 text-black" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-rr-gold bg-rr-gold/15 px-2.5 py-0.5 rounded-full border border-rr-gold/30">
                  Rank #1 · Champion Pressure Bowler
                </span>
              </div>
              <h2 className="text-xl font-black text-white">Pending Model Computation</h2>
              <p className="text-xs text-rr-muted mt-0.5">
                The highest-rated bowler combining death-over economy suppression, wicket strike rate, and consistency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-rr-muted uppercase font-bold">Reliability Score</div>
              <div className="text-2xl font-black text-white">—</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LEADERBOARD SLOTS 1 TO 10 ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-rr-gold" />
            <span className="text-sm font-bold text-white">Ranked Bowlers (1–10)</span>
          </div>
          <span className="text-xs text-rr-muted">Model in training</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#0B1020]/50 text-rr-muted font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Player Name</th>
                <th className="py-3 px-4">Primary Team</th>
                <th className="py-3 px-4 text-center">Pressure Innings</th>
                <th className="py-3 px-4 text-center">Overs Bowled</th>
                <th className="py-3 px-4 text-center">Wickets</th>
                <th className="py-3 px-4 text-center">Pressure Econ</th>
                <th className="py-3 px-4 text-center">Normal Econ</th>
                <th className="py-3 px-4 text-center">Δ Econ</th>
                <th className="py-3 px-4 text-center">Reliability Score</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {ranks.map((r) => {
                const isTop3 = r <= 3
                return (
                  <tr key={r} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black"
                        style={{
                          background: isTop3 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                          color: isTop3 ? '#D4AF37' : '#6B7A99',
                          border: isTop3 ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        {r}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white/60">Rank {r} Bowler Slot</span>
                        {isTop3 && <Sparkles className="w-3 h-3 text-rr-gold" />}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-rr-muted">Awaiting Calculation</td>
                    <td className="py-3.5 px-4 text-center text-rr-muted">—</td>
                    <td className="py-3.5 px-4 text-center text-rr-muted">—</td>
                    <td className="py-3.5 px-4 text-center text-rr-muted">—</td>
                    <td className="py-3.5 px-4 text-center text-rr-muted">—</td>
                    <td className="py-3.5 px-4 text-center text-rr-muted">—</td>
                    <td className="py-3.5 px-4 text-center text-rr-muted">—</td>
                    <td className="py-3.5 px-4 text-center font-bold text-white/50">—</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-rr-muted bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                        Pending
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SELECTION & EVIDENCE CRITERIA ── */}
      <div
        className="p-5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="text-sm font-bold text-white mb-2">Bowler Ranking Justification Architecture</div>
        <p className="text-xs text-rr-muted leading-relaxed mb-4">
          Each bowler in the final Top 10 will be accompanied by an evidence-based dossier explaining:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            {
              title: 'Death Overs Economy',
              desc: 'Performance in overs 16–20 where run rates typically surge beyond 10.5 rpo.',
            },
            {
              title: 'Breakthrough Impact',
              desc: 'Wickets that stall momentum and dismiss established top-order hitters.',
            },
            {
              title: 'Boundary Suppression',
              desc: 'Ratio of legal balls bowled that restrict batters to singles and dots.',
            },
            {
              title: 'Bayesian Shrinkage',
              desc: 'Confidence adjustment ensuring high-sample reliability over one-off spells.',
            },
          ].map((c) => (
            <div key={c.title} className="p-3 rounded-lg bg-[#1A2540] border border-white/[0.05]">
              <div className="font-bold text-rr-gold mb-1">{c.title}</div>
              <div className="text-[11px] text-rr-muted leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
