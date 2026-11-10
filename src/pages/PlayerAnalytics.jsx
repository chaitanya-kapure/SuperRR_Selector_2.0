import {
  BarChart3, TrendingUp, Activity,
  PieChart, Layers, Target,
} from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'

const PLANNED_CHARTS = [
  { icon: BarChart3,   title: 'Batting Performance',    desc: 'Runs, averages, strike rates across formats and competitions.',        tags: ['Batting','Statistics'] },
  { icon: Activity,    title: 'Bowling Performance',    desc: 'Wickets, economy rates, bowling averages, and strike rates.',          tags: ['Bowling','Statistics'] },
  { icon: TrendingUp,  title: 'Consistency Trends',     desc: 'Performance over time — identifying players improving with experience.', tags: ['Trends','Consistency'] },
  { icon: Target,      title: 'Age vs Performance',     desc: 'How young players compare to seniors in domestic cricket.',              tags: ['Age Analysis','Benchmarking'] },
  { icon: Layers,      title: 'Cross-Competition View', desc: 'Performance compared across different domestic formats.',               tags: ['Formats','Comparison'] },
  { icon: PieChart,    title: 'Role Distributions',     desc: 'Breakdown of player roles across the eligible pool.',                   tags: ['Roles','Overview'] },
]

function ChartPlaceholder({ icon: Icon, title, desc, tags }) {
  return (
    <div
      className="p-5 rounded-xl flex flex-col transition-all duration-200 hover:border-white/[0.12]"
      style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(233,30,99,0.10)', border: '1px solid rgba(233,30,99,0.22)' }}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: '#E91E63' }} />
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#6B7A99', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="text-sm font-semibold text-white mb-1">{title}</div>
      <div className="text-xs leading-relaxed mb-4" style={{ color: '#A7B2C7' }}>{desc}</div>

      {/* Chart placeholder */}
      <div
        className="flex-1 min-h-[120px] rounded-lg flex items-center justify-center"
        style={{ background: '#080D1B', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="text-center px-4">
          <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: 'rgba(107,122,153,0.3)' }} />
          <span className="text-[11px]" style={{ color: 'rgba(107,122,153,0.5)' }}>Chart renders after dataset load</span>
        </div>
      </div>
    </div>
  )
}

export default function PlayerAnalytics() {
  return (
    <div className="p-4 md:p-6 animate-fade-in space-y-5" style={{ background: '#080D1B' }}>

      <SectionHeader
        label="Player Analytics"
        title="Performance Intelligence"
        description="Statistical analysis and visualisation of player performance across domestic cricket competitions."
        action={<StatusBadge status="pending" label="Awaiting Dataset" />}
      />

      {/* Info notice */}
      <div
        className="flex gap-3 px-4 py-3.5 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="w-1 rounded-full flex-shrink-0" style={{ background: '#E91E63' }} />
        <p className="text-sm leading-relaxed" style={{ color: '#A7B2C7' }}>
          <span className="text-white font-semibold">Note:</span> The visualisations below are placeholders
          representing planned analytical views. All chart types and metrics will be determined after
          inspecting the official dataset. No fabricated statistics are displayed.
        </p>
      </div>

      {/* Chart grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PLANNED_CHARTS.map((c) => (
          <ChartPlaceholder key={c.title} {...c} />
        ))}
      </div>

      {/* Individual player placeholder */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <SectionHeader
          label="Individual Analysis"
          title="Player Deep Dive"
          description="Select a player to explore their full performance breakdown."
        />
        <EmptyState
          icon={BarChart3}
          title="No Players Loaded"
          description="Individual player analytics will be available after the dataset is loaded and processed."
        />
      </div>
    </div>
  )
}
