// src/pages/Dashboard.jsx
import { useApi } from '@/hooks/useApi'
import { analyticsApi, alertApi, insightApi } from '@/lib/api'
import KpiCard from '@/components/ui/KpiCard'
import RevenueTrendChart from '@/components/dashboard/RevenueTrendChart'
import BranchComparisonChart from '@/components/dashboard/BranchComparisonChart'
import BranchLeaderboard from '@/components/dashboard/BranchLeaderboard'
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel'
import RecentAlertsPanel from '@/components/dashboard/RecentAlertsPanel'
import UnderperformingBranches from '@/components/dashboard/UnderperformingBranches'
import { useNavigate } from 'react-router-dom'
import { useCurrency } from '@/utils/currency'



export default function Dashboard() {
  const { data: dash, loading: dashLoading } = useApi(analyticsApi.getDashboard)
  const { data: ranking }  = useApi(analyticsApi.getBranchRanking)
  const { data: alerts }   = useApi(alertApi.getAll)
  const { data: insights } = useApi(insightApi.getAll)
  const {format}=useCurrency()

  function fmt(n) {
  if (n == null) return "—"
  if (n >= 1_000_000) return format(n / 1_000_000) + "M"
  if (n >= 1_000) return format(n / 1_000) + "K"
  return format(n)
}

  const kpiData = [
    {
      icon: 'payments', iconFilled: true, iconColor: 'text-primary', iconBg: 'bg-primary/5',
      label: 'Total Revenue',
      value: dashLoading ? '…' : fmt(dash?.totalRevenue),
      badge: '+12%', badgeStyle: 'green', progressColor: 'bg-primary', progressWidth: 75,
    },
    {
      icon: 'shopping_cart', iconFilled: true, iconColor: 'text-secondary', iconBg: 'bg-secondary/5',
      label: 'Total Orders',
      value: dashLoading ? '…' : (dash?.totalOrders?.toLocaleString() ?? '—'),
      badge: '+8%', badgeStyle: 'green', progressColor: 'bg-secondary', progressWidth: 60,
    },
    {
      icon: 'store', iconFilled: true, iconColor: 'text-tertiary', iconBg: 'bg-tertiary-container/10',
      label: 'Total Branches',
      value: dashLoading ? '…' : (dash?.totalBranches?.toString() ?? '—'),
      badge: 'Active', badgeStyle: 'blue', progressColor: 'bg-tertiary-container', progressWidth: 100,
    },
    {
      icon: 'receipt_long', iconFilled: true, iconColor: 'text-on-secondary-container',
      iconBg: 'bg-on-secondary-container/10',
      label: 'Avg Order Value',
      value: dashLoading ? '…' : fmt(dash?.averageOrderValue),
      badge: 'Live', badgeStyle: 'slate', progressColor: 'bg-on-secondary-container', progressWidth: 45,
    },
  ]

  return (
    <div className="px-14 py-10 pb-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-on-background tracking-tight mb-2 font-headline">
            Franchise Overview
          </h2>
          <p className="text-on-surface-variant flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>calendar_today</span>
            Real-time performance data
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>file_download</span>
            Export PDF
          </button>
          <button className="btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
            Advanced Filters
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {kpiData.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      <UnderperformingBranches />

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        <RevenueTrendChart ranking={ranking || []} />
        <BranchComparisonChart ranking={ranking || []} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-12 gap-6">
        <BranchLeaderboard ranking={ranking || []} />
        <AIInsightsPanel insights={(insights || []).slice(0, 3)} />
        <RecentAlertsPanel alerts={(alerts || []).filter(a => a.status !== 'RESOLVED').slice(0, 3)} />
      </div>
    </div>
  )
}
