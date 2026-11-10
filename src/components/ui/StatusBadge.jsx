/**
 * StatusBadge — coloured pill indicating a module's data readiness.
 * Updated for v2 design system.
 */
export default function StatusBadge({ status, label }) {
  const styles = {
    pending:    { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
    ready:      { bg: 'rgba(16,185,129,0.12)', text: '#10B981', border: 'rgba(16,185,129,0.25)' },
    inactive:   { bg: 'rgba(255,255,255,0.05)', text: '#6B7A99', border: 'rgba(255,255,255,0.10)' },
    processing: { bg: 'rgba(59,130,246,0.12)', text: '#3B82F6', border: 'rgba(59,130,246,0.25)' },
  }

  const s = styles[status] || styles.inactive
  const isPulsing = status === 'pending' || status === 'processing'

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          background: s.text,
          animation: isPulsing ? 'pulseDot 2s cubic-bezier(.4,0,.6,1) infinite' : 'none',
        }}
      />
      {label}
    </span>
  )
}
