// src/components/settings/AIInsightSettingsCard.jsx
import ToggleSwitch from './ToggleSwitch'

export default function AIInsightSettingsCard({ toggles, onToggle }) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-primary">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-tertiary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          <h3 className="text-xl font-bold font-headline">AI Insight Settings</h3>
        </div>
        <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-3 py-1 rounded-full uppercase">
          Enterprise Engine
        </span>
      </div>

      <div className="space-y-4">
        {/* Toggle 1 */}
        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
          <div>
            <p className="font-bold text-on-surface text-sm">Auto-generate Daily Recommendations</p>
            <p className="text-sm text-on-surface-variant">Daily optimization tips for inventory and staffing.</p>
          </div>
          <ToggleSwitch
            enabled={toggles.autoRecommend}
            onChange={(v) => onToggle('autoRecommend', v)}
          />
        </div>

        {/* Toggle 2 */}
        <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
          <div>
            <p className="font-bold text-on-surface text-sm">Email High-impact Insights to Admin</p>
            <p className="text-sm text-on-surface-variant">Instant alerts for savings above $5,000.</p>
          </div>
          <ToggleSwitch
            enabled={toggles.emailInsights}
            onChange={(v) => onToggle('emailInsights', v)}
          />
        </div>

        {/* Locked premium toggle */}
        <div className="flex items-center justify-between p-4 border border-outline/10 border-dashed rounded-xl opacity-80">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-bold text-on-surface text-sm">Include Competitor Data</p>
              <p className="text-sm text-on-surface-variant">Benchmark against local franchise competitors.</p>
            </div>
            <span className="bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0">
              Premium
            </span>
          </div>
          <ToggleSwitch enabled={false} disabled />
        </div>
      </div>
    </div>
  )
}
