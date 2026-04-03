// src/pages/Analytics.jsx
import { useState } from 'react'
import { useApi } from '@/hooks/useApi'
import { analyticsApi } from '@/lib/api'
import AnalyticsKpiCards from '@/components/analytics/AnalyticsKpiCards'
import WeeklySalesTrend from '@/components/analytics/WeeklySalesTrend'
import RevenueShareDonut from '@/components/analytics/RevenueShareDonut'
import TopProductsChart from '@/components/analytics/TopProductsChart'
import AIStrategicInsight from '@/components/analytics/AIStrategicInsight'

const DATE_FILTERS = ['D', 'W', 'M', 'Y']

export default function Analytics() {
  const [activePeriod, setActivePeriod] = useState('M')

  const { data: dash } = useApi(() => analyticsApi.getDashboard(activePeriod),[activePeriod])
  const { data: ranking }  = useApi(analyticsApi.getBranchRanking)
  const { data: products } = useApi(analyticsApi.getTopProducts)

  const handleExport = async () => {

    const res = await analyticsApi.exportAnalytics(activePeriod)

    const url = window.URL.createObjectURL(new Blob([res.data]))

    const link = document.createElement("a")

    link.href = url
    link.setAttribute("download", "analytics-report.xlsx")

    document.body.appendChild(link)

    link.click()
  }

  return (
    <div className="pt-24 pb-12 px-14 min-h-screen bg-surface-container-low">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant text-xs font-medium mb-2">
            <span>Executive Insight</span>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
            <span className="text-primary">Performance Analytics</span>
          </nav>
          <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">
            Business Deep-Dive
          </h2>
          <p className="text-on-surface-variant mt-1">
            Real-time performance metrics across all franchise locations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-surface-container-lowest p-1 rounded-xl flex items-center gap-1 shadow-sm">
            {DATE_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActivePeriod(f)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all
                  ${activePeriod === f ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button onClick={handleExport} className="bg-surface-container-high text-on-surface px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-surface-container-highest transition-all">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
            Export
          </button>
        </div>
      </section>

      {/* KPI Cards driven by real data */}
      <AnalyticsKpiCards dash={dash} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <WeeklySalesTrend ranking={ranking || []} />
        <RevenueShareDonut ranking={ranking || []} />
        <TopProductsChart products={products || []} />
      </div>

      <AIStrategicInsight analyticsData={dash}/>
    </div>
  )
}
