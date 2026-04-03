// src/components/alerts/RegionalHeatmap.jsx

const REGIONS = [
  { label: 'Western',  height: 40, high: false },
  { label: 'Mountain', height: 65, high: false },
  { label: 'Central',  height: 85, high: true  },
  { label: 'Southern', height: 30, high: false },
  { label: 'Atlantic', height: 55, high: false },
  { label: 'Pacific',  height: 45, high: false },
  { label: 'Northern', height: 75, high: false },
]

export default function RegionalHeatmap() {
  return (
    <div className="lg:col-span-2 bg-surface-container-low rounded-2xl p-8 relative overflow-hidden border border-white/40">
      <h3 className="font-headline font-bold text-xl text-on-surface mb-6">Regional Severity Heatmap</h3>

      <div className="h-64 flex items-end gap-2 px-2">
        {REGIONS.map(({ label, height, high }) => (
          <div key={label} className="flex-1 relative group">
            {/* Hover tooltip */}
            {high && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-tertiary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {label}: High
              </span>
            )}
            <div
              className={`w-full rounded-t-lg relative transition-all duration-300
                ${high
                  ? 'bg-tertiary/20 border-t-2 border-tertiary'
                  : 'bg-surface-container-highest'}`}
              style={{ height: `${height}%` }}
            >
              <div className={`absolute inset-0 rounded-t-lg transition-opacity opacity-0 group-hover:opacity-10 ${high ? 'bg-tertiary' : 'bg-primary'}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest px-1">
        {REGIONS.map(({ label }) => (
          <span key={label}>{label.slice(0, 4)}</span>
        ))}
      </div>
    </div>
  )
}
