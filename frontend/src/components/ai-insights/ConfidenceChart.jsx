// src/components/ai-insights/ConfidenceChart.jsx

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
const HEIGHTS = [40, 60, 55, 75, 85, 70, 95, 65, 45, 80, 50, 60]

// Primary-tinted bars at positions where values are higher
const isTinted = (h) => h >= 80

export default function ConfidenceChart({ successRate, roiImpact }) {
  return (
    <div className="col-span-12 bg-surface-container-lowest rounded-[2rem] p-10 shadow-sm overflow-hidden relative border border-outline-variant/10">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-xl font-bold font-headline mb-1">AI Recommendation Confidence</h3>
          <p className="text-on-surface-variant text-sm">Historical success rate of automated insights across all 42 branches.</p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-right">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Success Rate</p>
            <p className="text-2xl font-black text-primary">{successRate}</p>
          </div>
          <div className="h-10 w-px bg-outline-variant/30" />
          <div className="text-right">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">ROI Impact</p>
            <p className="text-2xl font-black text-tertiary">{roiImpact}</p>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="h-48 flex items-end gap-2 px-2">
        {HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-xl transition-all cursor-help hover:opacity-80 ${isTinted(h) ? 'bg-primary' : h >= 60 ? 'bg-primary/40' : h >= 50 ? 'bg-primary/20' : 'bg-surface-container'}`}
            style={{ height: `${h}%` }}
            title={`${MONTHS[i]}: ${h}%`}
          />
        ))}
      </div>

      {/* Month labels */}
      <div className="flex justify-between mt-4 px-2">
        {MONTHS.map((m) => (
          <span key={m} className="text-[10px] font-bold text-on-surface-variant">{m}</span>
        ))}
      </div>
    </div>
  )
}
