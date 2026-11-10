import { Star, Trophy, Target, Crown, CheckCircle2 } from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'

const SLOTS = Array.from({ length: 10 }, (_, i) => i + 1)

function ShortlistSlot({ rank }) {
  const isTop3 = rank <= 3
  return (
    <div
      className="flex items-center gap-4 px-5 py-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
        style={{
          background: isTop3 ? 'rgba(212,175,55,0.12)' : '#1A2540',
          border: `1px solid ${isTop3 ? 'rgba(212,175,55,0.30)' : 'rgba(255,255,255,0.07)'}`,
          color: isTop3 ? '#D4AF37' : '#6B7A99',
        }}
      >
        {rank}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="skeleton h-3.5 w-32 rounded" />
          {isTop3 && <Star className="w-3.5 h-3.5" style={{ color: 'rgba(212,175,55,0.4)' }} />}
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-2.5 w-16 rounded" />
          <div className="skeleton h-2.5 w-20 rounded" />
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="skeleton h-5 w-12 rounded" />
        <div className="text-[10px] mt-1" style={{ color: '#6B7A99' }}>Score pending</div>
      </div>
    </div>
  )
}

export default function Shortlist() {
  return (
    <div className="p-4 md:p-6 animate-fade-in space-y-5" style={{ background: '#080D1B' }}>

      <SectionHeader
        label="Final Shortlist"
        title="Top 10 Uncapped Targets"
        description="The definitive IPL 2027 auction target list — youngest uncapped domestic players backed by data."
        action={<StatusBadge status="inactive" label="Not Finalised" />}
      />

      {/* Info banner */}
      <div
        className="flex gap-3 px-4 py-4 rounded-xl"
        style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}
      >
        <Trophy className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
        <div>
          <div className="text-sm font-bold text-white mb-1">Shortlist Under Construction</div>
          <p className="text-sm leading-relaxed" style={{ color: '#A7B2C7' }}>
            The Top 10 shortlist will be finalised after completing data analysis, applying our
            evaluation methodology, and validating the rankings. Each selected player will have a
            full supporting rationale based on actual performance data.
          </p>
        </div>
      </div>

      {/* Shortlist table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(212,175,55,0.10)', border: '1px solid rgba(212,175,55,0.25)' }}
            >
              <Crown className="w-4 h-4" style={{ color: '#D4AF37' }} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Shortlist</div>
              <div className="text-xs" style={{ color: '#A7B2C7' }}>0 of 10 positions filled</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs" style={{ color: '#6B7A99' }}>Progress:</div>
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: '#080D1B', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="h-full w-0 rounded-full" style={{ background: '#E91E63' }} />
            </div>
            <div className="text-xs" style={{ color: '#6B7A99' }}>0%</div>
          </div>
        </div>

        {/* Column headers */}
        <div
          className="hidden md:grid grid-cols-5 px-5 py-2.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,13,27,0.5)' }}
        >
          {['Rank', 'Player', 'Age', 'Role / Stats', 'Composite Score'].map((col) => (
            <div key={col} className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6B7A99' }}>
              {col}
            </div>
          ))}
        </div>

        {SLOTS.map((rank) => (
          <ShortlistSlot key={rank} rank={rank} />
        ))}

        <div className="px-5 py-3" style={{ background: 'rgba(8,13,27,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[11px]" style={{ color: 'rgba(107,122,153,0.6)' }}>
            Player slots will be populated after completing the full analytical workflow. All
            selections will be evidence-backed.
          </p>
        </div>
      </div>

      {/* Selection criteria */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <SectionHeader
          label="Selection Criteria"
          title="How Players Are Chosen"
          description="The shortlist will be built on a multi-factor evaluation model."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Uncapped Status',       desc: 'Player must not have represented India in any international format.' },
            { title: 'Age Eligibility',        desc: 'Priority given to the youngest players with strong performance profiles.' },
            { title: 'Domestic Performance',   desc: 'Evaluated across relevant domestic competitions (not fabricated).' },
            { title: 'Role Fit',               desc: 'Must suit the type of players Rajasthan Royals typically target.' },
            { title: 'Consistency',            desc: 'Not just one good season — sustained or improving performance matters.' },
            { title: 'Data Support',           desc: 'Every ranking position backed by statistics from the official dataset.' },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="flex gap-3 p-3 rounded-lg"
              style={{ background: '#1A2540', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E91E63' }} />
              <div>
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs mt-0.5 leading-relaxed" style={{ color: '#A7B2C7' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
