import {
  Gavel, TrendingUp, Shield, Zap,
  Scale, Target, AlertCircle, Info, Database,
} from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'

const EVALUATION_DIMENSIONS = [
  { icon: TrendingUp, title: 'Performance Quality',  desc: 'Statistical output across batting and/or bowling — judged relative to competition level.' },
  { icon: Shield,     title: 'Consistency',           desc: 'Reliability of performance over multiple matches and seasons.' },
  { icon: Target,     title: 'Youth & Potential',     desc: 'Age relative to performance peers — identifying players on an upward trajectory.' },
  { icon: Scale,      title: 'Role Suitability',      desc: "How well the player's skill set fits Rajasthan Royals' typical squad needs." },
  { icon: Zap,        title: 'Impact Indicators',     desc: 'Match-winning contributions, big-match performance, clutch metrics.' },
]

export default function AuctionIntelligence() {
  return (
    <div className="p-4 md:p-6 animate-fade-in space-y-5" style={{ background: '#080D1B' }}>

      <SectionHeader
        label="Auction Intelligence"
        title="Strategic Player Evaluation"
        description="Evidence-based framework to identify the highest-value uncapped targets for IPL 2027."
        action={<StatusBadge status="pending" label="Model Pending" />}
      />

      {/* Critical notice */}
      <div
        className="flex gap-3 px-4 py-4 rounded-xl"
        style={{ background: 'rgba(233,30,99,0.06)', border: '1px solid rgba(233,30,99,0.18)' }}
      >
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#E91E63' }} />
        <div>
          <div className="text-sm font-bold text-white mb-1">Methodology Pending Dataset Review</div>
          <p className="text-sm leading-relaxed" style={{ color: '#A7B2C7' }}>
            The evaluation and ranking logic will only be developed after inspecting the official
            competition dataset. We will not assume column names, scoring weights, or rank players
            arbitrarily. Every recommendation must be supported by real data.
          </p>
        </div>
      </div>

      {/* Evaluation framework */}
      <section
        className="rounded-xl p-5"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <SectionHeader
          label="Framework"
          title="Planned Evaluation Dimensions"
          description="These dimensions represent our current thinking. Weights will be calibrated against the actual dataset."
        />
        <div className="space-y-3">
          {EVALUATION_DIMENSIONS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-4 rounded-lg"
              style={{ background: '#1A2540', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(233,30,99,0.10)', border: '1px solid rgba(233,30,99,0.22)' }}
              >
                <Icon className="w-4 h-4" style={{ color: '#E91E63' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs mt-0.5 leading-relaxed" style={{ color: '#A7B2C7' }}>{desc}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#6B7A99' }}>Weight</div>
                <div className="text-sm font-bold" style={{ color: '#6B7A99' }}>TBD</div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-4 flex items-start gap-2 p-3 rounded-lg"
          style={{ background: '#080D1B', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#6B7A99' }} />
          <p className="text-xs leading-relaxed" style={{ color: '#A7B2C7' }}>
            Weights marked "TBD" will be determined through data analysis. Youth alone does not
            guarantee selection — we must balance age, performance, role fit, and consistency.
          </p>
        </div>
      </section>

      {/* Rankings table placeholder */}
      <section
        className="rounded-xl overflow-hidden"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div className="text-sm font-bold text-white">Player Rankings</div>
            <div className="text-xs mt-0.5" style={{ color: '#A7B2C7' }}>Top uncapped domestic talent — ranked by composite score</div>
          </div>
          <StatusBadge status="inactive" label="Not Available" />
        </div>

        {/* Column headers */}
        <div
          className="hidden md:grid grid-cols-7 px-5 py-2.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,13,27,0.5)' }}
        >
          {['Rank', 'Player', 'Age', 'Role', 'Competition', 'Score', 'Action'].map((col) => (
            <div key={col} className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6B7A99' }}>
              {col}
            </div>
          ))}
        </div>

        <EmptyState
          icon={Gavel}
          title="Ranking Not Yet Available"
          description="Player rankings will be computed after the official dataset is loaded, cleaned, and analysed. No rankings are fabricated."
        >
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
            style={{ background: '#1A2540', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="s-dot-pulse" />
            <span className="text-xs" style={{ color: '#A7B2C7' }}>Awaiting Round 1 dataset</span>
          </div>
        </EmptyState>
      </section>
    </div>
  )
}
