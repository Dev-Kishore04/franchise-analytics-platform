// src/components/analytics/RevenueShareDonut.jsx

import { useCurrency } from "../../utils/currency"

const COLORS = ['#004bcb', '#9d3000', '#515f74', '#e0e3e5']
const DOT_CLASSES = ['bg-primary', 'bg-tertiary', 'bg-secondary', 'bg-surface-container-highest']

export default function RevenueShareDonut({ ranking = [] }) {
  const total = ranking.reduce((s, b) => s + (b.revenue || 0), 0)
  const {format}=useCurrency()

  // Compute slice percentages
  const slices = ranking.slice(0, 3).map((b, i) => ({
    label: b.branchName || `Branch ${i + 1}`,
    pct:   total > 0 ? Math.round((b.revenue / total) * 100) : 0,
    color: COLORS[i],
    dot:   DOT_CLASSES[i],
  }))

  // Others
  const topPct = slices.reduce((s, x) => s + x.pct, 0)
  if (slices.length > 0 && topPct < 100) {
    slices.push({ label: 'Others', pct: 100 - topPct, color: COLORS[3], dot: DOT_CLASSES[3] })
  }

  const r = 70, circumference = 2 * Math.PI * r
  let offset = 0

  function fmtRevenue(n) {
    if (!n) return '—'
    if (n >= 1_000_000) return format(n / 1_000_000) + "M"
    if (n >= 1_000) return format(n / 1_000) + "K"
    return format(n)
  }
  

  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm flex flex-col">
      <h3 className="text-xl font-headline font-bold text-on-surface mb-1">Revenue Share</h3>
      <p className="text-on-surface-variant text-sm mb-8">Branch contribution to total revenue</p>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 160 160" className="w-40 h-40 -rotate-90">
          {slices.map((s) => {
            const dash = (s.pct / 100) * circumference
            const gap = circumference - dash

            const el = (
              <circle
                key={s.label}
                cx={80}
                cy={80}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={20}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
              />
            )

            offset += dash
            return el
          })}
        </svg>
          <div className="absolute text-center">
            <p className="text-2xl font-headline font-extrabold text-on-surface">{fmtRevenue(total)}</p>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Total</p>
          </div>
        </div>

        <div className="w-full space-y-3">
          {slices.map(s => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                <span className="text-sm font-medium text-on-surface">{s.label}</span>
              </div>
              <span className="text-sm font-bold">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
