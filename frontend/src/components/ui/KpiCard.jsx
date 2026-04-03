// src/components/ui/KpiCard.jsx

import { useCurrency } from "../../utils/currency"

/**
 * @param {object} props
 * @param {string} props.icon          - Material Symbols icon name
 * @param {boolean} [props.iconFilled] - Fill icon variant
 * @param {string} props.iconColor     - Tailwind text color class
 * @param {string} props.iconBg        - Tailwind bg color class
 * @param {string} props.label         - Metric label
 * @param {string} props.value         - Primary metric value
 * @param {string} props.badge         - Badge text (e.g. "+12%")
 * @param {string} props.badgeStyle    - "green" | "blue" | "slate"
 * @param {string} props.progressColor - Tailwind bg color for progress bar
 * @param {number} props.progressWidth - 0-100
 */
export default function KpiCard({
  icon,
  iconFilled = false,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/5',
  label,
  value,
  badge,
  badgeStyle = 'green',
  progressColor = 'bg-primary',
  progressWidth = 50,
}) {
  const {format}=useCurrency()
  const badgeClasses = {
    green: 'badge badge-green',
    blue:  'badge badge-blue',
    slate: 'badge badge-slate',
  }[badgeStyle] || 'badge badge-slate'

  return (
    <div className="kpi-card">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg ${iconBg} ${iconColor}`}>
          <span
            className="material-symbols-outlined"
            style={iconFilled ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {icon}
          </span>
        </div>
        <span className={badgeClasses}>{badge}</span>
      </div>

      <p className="text-on-surface-variant text-sm font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-extrabold font-headline">{value}</h3>

      {/* Progress bar */}
      <div className="kpi-card-progress">
        <div
          className={`kpi-card-progress-bar ${progressColor}`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  )
}
