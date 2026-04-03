// src/components/analytics/AnalyticsKpiCards.jsx

import { useCurrency } from "../../utils/currency"



export default function AnalyticsKpiCards({ dash }) {
  const {format}=useCurrency()
  function fmt(n) {
  if (n == null) return "—"
  if (n >= 1_000_000) return format(n / 1_000_000) + "M"
  if (n >= 1_000) return format(n / 1_000) + "K"
  return format(n)
}
  const cards = [
    {
      icon: 'payments', iconBg: 'bg-primary/5', iconColor: 'text-primary',
      borderColor: 'border-l-4 border-primary',
      label: 'Total Revenue',
      value: fmt(dash?.totalRevenue),
      trend: '+8.4%', trendUp: true,
      sub: 'Cumulative all branches',
    },
    {
      icon: 'calendar_view_week', iconBg: 'bg-secondary-container/30', iconColor: 'text-secondary',
      borderColor: '',
      label: 'Total Orders',
      value: dash?.totalOrders?.toLocaleString() ?? '—',
      trend: '+12.1%', trendUp: true,
      sub: 'All-time order count',
    },
    {
      icon: 'shopping_bag', iconBg: 'bg-tertiary-fixed/30', iconColor: 'text-tertiary',
      borderColor: '',
      label: 'Total Branches',
      value: dash?.totalBranches?.toString() ?? '—',
      trend: 'Active', trendUp: true,
      sub: 'Active franchise locations',
    },
    {
      icon: 'leaderboard', iconBg: 'bg-primary/5', iconColor: 'text-primary',
      borderColor: '',
      label: 'Avg Order Value',
      value: fmt(dash?.averageOrderValue),
      trend: '+4.7%', trendUp: true,
      sub: 'Per transaction average',
    },
  ]

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card) => (
        <div key={card.label} className={`bg-surface-container-lowest p-6 rounded-xl shadow-sm ${card.borderColor}`}>
          <div className="flex justify-between items-start mb-4">
            <span className={`p-2 rounded-lg material-symbols-outlined ${card.iconBg} ${card.iconColor}`}>
              {card.icon}
            </span>
            <span className={`text-xs font-bold flex items-center gap-0.5 ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {card.trendUp ? 'trending_up' : 'trending_down'}
              </span>
              {card.trend}
            </span>
          </div>
          <h3 className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-1">{card.label}</h3>
          <p className="text-3xl font-headline font-extrabold text-on-surface">{card.value}</p>
          <p className="text-[11px] text-on-surface-variant mt-2 italic">{card.sub}</p>
        </div>
      ))}
    </section>
  )
}
