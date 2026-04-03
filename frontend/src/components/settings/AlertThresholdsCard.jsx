// src/components/settings/AlertThresholdsCard.jsx

export default function AlertThresholdsCard({ thresholds, onThresholdChange, sensitivity, onSensitivityChange }) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-error">notifications_active</span>
        <h3 className="text-xl font-bold font-headline">Alert Thresholds</h3>
      </div>

      <div className="space-y-10 flex-1">
        {/* Low Stock Threshold */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Low Stock Threshold (%)
            </label>
            <span className="text-primary font-bold text-lg">{thresholds.lowStock}%</span>
          </div>
          <input
            type="range"
            min={1} max={50}
            value={thresholds.lowStock}
            onChange={(e) => onThresholdChange('lowStock', Number(e.target.value))}
            className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <p className="mt-2 text-xs text-on-surface-variant italic">
            System triggers re-order alerts when stock falls below this limit.
          </p>
        </div>

        {/* Sales Dip Warning */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Sales Dip Warning (%)
            </label>
            <span className="text-primary font-bold text-lg">{thresholds.salesDip}%</span>
          </div>
          <input
            type="range"
            min={1} max={50}
            value={thresholds.salesDip}
            onChange={(e) => onThresholdChange('salesDip', Number(e.target.value))}
            className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <p className="mt-2 text-xs text-on-surface-variant italic">
            Triggers alert if sales drop versus previous week's average.
          </p>
        </div>

        {/* Anomaly Detection Sensitivity */}
        <div className="p-6 bg-surface-container-low rounded-xl border border-outline/5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>radar</span>
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Anomaly Detection Sensitivity
            </label>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-on-surface-variant whitespace-nowrap">RELAXED</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min={0} max={100}
                value={sensitivity}
                onChange={(e) => onSensitivityChange(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary bg-surface-container-highest"
              />
            </div>
            <span className="text-[10px] font-bold text-primary whitespace-nowrap">STRICT</span>
          </div>
          <p className="mt-4 text-xs text-on-surface-variant">
            Highly sensitive detection may increase "False Positives" in unpredictable markets.
          </p>
        </div>
      </div>

      {/* Status Report card */}
      <div className="mt-10">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="font-bold mb-1 font-headline">Status Report</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              All systems operational. No pending critical anomalies detected in the last 24h.
            </p>
          </div>
          <span
            className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500"
            style={{ fontSize: '80px' }}
          >
            security
          </span>
        </div>
      </div>
    </div>
  )
}
