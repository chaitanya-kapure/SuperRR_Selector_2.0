/**
 * SectionHeader — consistent section heading with optional label and action.
 * Updated for v2 design system.
 */
export default function SectionHeader({ label, title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        {label && (
          <div
            className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
            style={{ color: '#6B7A99' }}
          >
            {label}
          </div>
        )}
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {description && (
          <p className="text-sm mt-1" style={{ color: '#A7B2C7' }}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
