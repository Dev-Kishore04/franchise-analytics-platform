// src/components/analytics/TopProductsChart.jsx

import { useCurrency } from "../../utils/currency"

export default function TopProductsChart({ products = [] }) {
  const maxRevenue = Math.max(...products.map(p => p.revenue || 0), 1)
  const {format}=useCurrency()

  // Use real data or show empty state
  const items = products.length > 0
    ? products.slice(0, 6).map(p => ({
        name:  p.productName || 'Unknown',
        units: p.revenue != null ? `${format(Number(p.revenue).toFixed(0))}` : '—',
        pct:   Math.round((p.revenue / maxRevenue) * 100),
      }))
    : []

  const barOpacity = ['bg-primary', 'bg-primary/70', 'bg-primary/60', 'bg-primary/50', 'bg-primary/40', 'bg-primary/30']

  return (
    <div className="lg:col-span-3 bg-surface-container-lowest p-8 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-headline font-bold text-on-surface">Top Performing Products</h3>
          <p className="text-on-surface-variant text-sm">Revenue generated across all branches</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-on-surface-variant text-sm text-center py-8">No product data yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {items.map((p, i) => (
            <div key={p.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-on-surface">{p.name}</span>
                <span className="text-on-surface-variant font-medium">{p.units}</span>
              </div>
              <div className="h-2.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barOpacity[i] || 'bg-primary/20'}`}
                  style={{ width: `${p.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
