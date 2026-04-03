// src/components/dashboard/AIInsightsPanel.jsx

export default function AIInsightsPanel({ insights = [] }) {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col gap-6">
      <div className="ai-insights-card">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <h4 className="text-sm font-bold uppercase tracking-wider text-tertiary">AI Insights</h4>
          </div>
          <a href="/ai-insights" className="text-[10px] font-bold underline text-on-surface-variant">View All</a>
        </div>

        {insights.length === 0 ? (
          <p className="text-xs text-on-surface-variant">No insights generated yet.</p>
        ) : (
          <div className="space-y-4">
            {insights.map((ins, i) => (
              <div key={ins.id || i} className={i === 0 ? 'ai-insight-item-primary' : 'ai-insight-item'}>
                <p className={`text-xs font-bold mb-1 ${i === 0 ? 'text-on-tertiary-fixed' : 'text-on-surface'}`}>
                  {ins.category || 'Insight'}
                </p>
                <p className={`text-[11px] leading-relaxed ${i === 0 ? 'text-on-tertiary-fixed-variant' : 'text-on-surface-variant'}`}>
                  {ins.insightText}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
