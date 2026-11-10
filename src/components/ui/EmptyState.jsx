/**
 * EmptyState — standardised placeholder for data-less pages.
 * Updated to match the v2 dark premium design.
 */
export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: 'rgba(233,30,99,0.10)',
            border: '1px solid rgba(233,30,99,0.22)',
          }}
        >
          <Icon className="w-7 h-7" style={{ color: '#E91E63' }} />
        </div>
      )}
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm max-w-sm leading-relaxed mb-5" style={{ color: '#A7B2C7' }}>
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
