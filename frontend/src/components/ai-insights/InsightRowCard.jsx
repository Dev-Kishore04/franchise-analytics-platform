// src/components/ai-insights/InsightRowCard.jsx

export default function InsightRowCard({ insight, onAccept, onDismiss }) {
  const dismissed = insight.tag === 'Dismissed'

  return (
    <div className={`col-span-6 bg-surface-container-low rounded-3xl p-7 flex gap-6 items-start hover:bg-surface-container-high transition-colors group ${dismissed ? 'opacity-75' : ''}`}>
      {/* Icon */}
      <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0 ${!dismissed ? 'group-hover:scale-110 transition-transform' : ''}`}>
        <span className={`material-symbols-outlined ${dismissed ? 'text-on-surface-variant' : 'text-primary'}`} style={{ fontSize: '22px' }}>
          {insight.icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h5 className="font-bold text-on-surface leading-snug">{insight.title}</h5>
          <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0">
            {insight.tag}
          </span>
        </div>
        <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">{insight.body}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-on-surface/60">{insight.meta}</span>
          {dismissed ? (
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Manual Override</span>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => onAccept?.(insight.id)}
                className="p-1.5 hover:bg-white rounded-lg transition-all text-on-surface-variant hover:text-green-600"
                title="Accept"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
              </button>
              <button
                onClick={() => onDismiss?.(insight.id)}
                className="p-1.5 hover:bg-white rounded-lg transition-all text-on-surface-variant hover:text-error"
                title="Dismiss"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
