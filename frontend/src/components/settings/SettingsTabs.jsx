// src/components/settings/SettingsTabs.jsx

const TABS = ['General Settings', 'Alert Thresholds', 'AI Insight Settings']

export default function SettingsTabs({ active, onChange }) {
  return (
    <div className="mb-12 border-b border-outline-variant/20">
      <div className="flex gap-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`pb-4 text-sm font-medium transition-all relative
              ${active === tab
                ? 'text-primary font-bold border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
