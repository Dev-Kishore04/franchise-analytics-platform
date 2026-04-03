// src/components/ai-insights/SideInsightCard.jsx

const statusColor = {
  Implementation: 'text-amber-600',
  Resolved:       'text-green-600',
  Pending:        'text-primary',
  Dismissed:      'text-on-surface-variant',
}

export default function SideInsightCard({ insight }) {
  const color = statusColor[insight.status] || 'text-on-surface-variant'
  return (
    <div className="col-span-4 bg-white rounded-[2rem] p-8 shadow-sm flex flex-col justify-between border border-transparent hover:border-primary/10 transition-all">
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {insight.category}
          </span>
          <span className="material-symbols-outlined text-tertiary" style={{ fontSize: '22px' }}>
            {insight.trendIcon}
          </span>
        </div>
        <h4 className="text-lg font-bold font-headline mb-4 leading-snug">{insight.headline}</h4>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{insight.body}</p>
      </div>
      <div className="pt-6 border-t border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant font-medium">Status</span>
            <span className={`text-xs font-bold ${color}`}>{insight.status}</span>
          </div>
          <span className="text-[10px] text-on-surface-variant italic">{insight.time}</span>
        </div>
      </div>
    </div>
  )
}
