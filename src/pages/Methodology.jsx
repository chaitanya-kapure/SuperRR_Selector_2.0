import {
  BookOpen, CheckCircle2, AlertTriangle,
  Lightbulb, FlaskConical, Scale, FileText,
} from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'

const PRINCIPLES = [
  { icon: CheckCircle2,  color: 'pink', title: 'Evidence Over Opinion',       desc: 'Every player recommendation is backed by statistical evidence from the official dataset. We do not rely on reputation, media perception, or gut feeling.' },
  { icon: Scale,         color: 'gold', title: 'Balanced Evaluation',          desc: 'Youth alone does not make a player valuable. We balance age, performance quality, consistency, role fit, and competition level in our evaluation model.' },
  { icon: AlertTriangle, color: 'pink', title: 'Honest About Limitations',     desc: 'We acknowledge the limitations of domestic cricket data. Sample sizes, opposition quality, and format differences are considered in our analysis.' },
  { icon: Lightbulb,     color: 'gold', title: 'Explainable Decisions',        desc: 'Every rank, every score, and every recommendation can be explained in plain cricket language. We use ML only when it genuinely adds value, not for show.' },
  { icon: FlaskConical,  color: 'pink', title: 'Rigorous Data Workflow',       desc: 'We follow a structured workflow: inspect → clean → explore → model → validate → present. No shortcuts, no assumptions.' },
  { icon: FileText,      color: 'gold', title: 'Transparent Methodology',      desc: 'Our full analytical approach will be documented and presented to the Rajasthan Royals analytics team. Nothing is hidden or unexplained.' },
]

const WORKFLOW_DETAIL = [
  { phase: 'Phase 1 — Dataset Intake',       steps: ['Receive and verify the official Round 1 dataset','Read and understand all competition guidelines','Identify every column, data type, and unit of measurement','Document known limitations and data gaps'] },
  { phase: 'Phase 2 — Data Engineering',      steps: ['Clean and validate all player records','Handle missing values using statistically appropriate methods','Normalise performance metrics for cross-competition comparison','Filter to eligible uncapped players only'] },
  { phase: 'Phase 3 — Exploratory Analysis',   steps: ['Understand distributions of key performance metrics','Identify outliers and investigate their causes','Examine age versus performance relationships','Understand representation across domestic competitions'] },
  { phase: 'Phase 4 — Evaluation Model',       steps: ['Design a composite scoring methodology based on dataset insights','Assign evidence-based weights to evaluation dimensions','Validate the model against known high-quality players as benchmarks','Apply ML techniques only if they provide a meaningful advantage'] },
  { phase: 'Phase 5 — Ranking & Shortlisting', steps: ['Rank all eligible uncapped players using the composite model','Identify the top 10 youngest players with strong scores','Cross-validate rankings using alternative analytical perspectives','Prepare individual player rationale for each top-10 selection'] },
  { phase: 'Phase 6 — Submission',             steps: ['Finalise the visual analytics platform','Prepare supporting documentation and methodology writeup','Package the full submission as required by competition guidelines','Review for accuracy, clarity, and presentation quality'] },
]

export default function Methodology() {
  return (
    <div className="p-4 md:p-6 animate-fade-in space-y-6" style={{ background: '#080D1B' }}>

      <SectionHeader
        label="Methodology"
        title="Analytical Framework"
        description="The principles, process, and design philosophy behind SupeRR Selector 2.0."
        action={<StatusBadge status="pending" label="In Development" />}
      />

      {/* Philosophy */}
      <div
        className="rounded-xl p-5 md:p-6"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(233,30,99,0.10)', border: '1px solid rgba(233,30,99,0.22)' }}
          >
            <BookOpen className="w-[18px] h-[18px]" style={{ color: '#E91E63' }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Our Analytical Philosophy</h3>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: '#A7B2C7' }}>
              SupeRR Selector 2.0 is built on a single conviction: in cricket talent identification,
              the quality of your analytical framework matters more than the complexity of your tools.
              A statistically sound, explainable methodology beats a black-box machine learning model
              every time — especially when presenting recommendations to a professional franchise.
            </p>
          </div>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ background: '#080D1B', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-xs leading-relaxed italic" style={{ color: '#A7B2C7' }}>
            "We don't rank players until we understand what the data actually says. Every decision
            on this platform will be traceable back to a specific statistic, a specific dataset
            column, and a specific analytical rationale."
          </p>
        </div>
      </div>

      {/* Core principles */}
      <section>
        <SectionHeader label="Core Principles" title="What Drives Our Decisions" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PRINCIPLES.map(({ icon: Icon, color, title, desc }) => {
            const isPink = color === 'pink'
            return (
              <div
                key={title}
                className="rounded-xl p-5 transition-all duration-200 hover:border-white/[0.12]"
                style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{
                    background: isPink ? 'rgba(233,30,99,0.10)' : 'rgba(212,175,55,0.10)',
                    border: `1px solid ${isPink ? 'rgba(233,30,99,0.22)' : 'rgba(212,175,55,0.22)'}`,
                  }}
                >
                  <Icon className="w-[18px] h-[18px]" style={{ color: isPink ? '#E91E63' : '#D4AF37' }} />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#A7B2C7' }}>{desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Workflow phases */}
      <section>
        <SectionHeader
          label="Workflow"
          title="Phase-by-Phase Process"
          description="Our structured analytical pipeline — to be executed once the official dataset arrives."
        />
        <div className="space-y-3">
          {WORKFLOW_DETAIL.map(({ phase, steps }, i) => (
            <div
              key={phase}
              className="rounded-xl overflow-hidden"
              style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                className="flex items-center gap-3 px-5 py-3.5"
                style={{ background: '#1A2540', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(233,30,99,0.12)', border: '1px solid rgba(233,30,99,0.25)' }}
                >
                  <span className="text-[10px] font-bold" style={{ color: '#E91E63' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{phase}</h4>
              </div>
              <ul className="px-5 py-4 space-y-2.5">
                {steps.map((step) => (
                  <li key={step} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(233,30,99,0.5)' }} />
                    <span className="text-sm leading-relaxed" style={{ color: '#A7B2C7' }}>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div
        className="flex gap-3 px-4 py-4 rounded-xl"
        style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
        <p className="text-xs leading-relaxed" style={{ color: '#A7B2C7' }}>
          <span className="text-white font-semibold">Important:</span> This methodology document will
          be updated and refined as we receive the official dataset and competition guidelines. All
          analytical decisions depend on the actual data available. Nothing documented here commits
          us to a specific scoring formula — that will emerge from the data itself.
        </p>
      </div>
    </div>
  )
}
