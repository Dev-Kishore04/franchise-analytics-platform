import { useEffect, useState } from "react"
import { analyticsApi } from "@/lib/api"

export default function RevenueTrendChart() {

  const [monthlyData, setMonthlyData] = useState([])

  useEffect(() => {
    loadRevenue()
  }, [])

  const loadRevenue = async () => {
    try {

      const data = await analyticsApi.getMonthlyRevenue()

      // Create last 8 months timeline
      const months = []
      const now = new Date()

      for (let i = 7; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)

        months.push({
          year: d.getFullYear(),
          month: d.getMonth() + 1
        })
      }

      // Map API data for quick lookup
      const revenueMap = {}

      data.forEach(d => {
        revenueMap[`${d.year}-${d.month}`] = d.revenue
      })

      // Combine timeline with API data
      const merged = months.map(m => {
        const revenue = revenueMap[`${m.year}-${m.month}`] || 0
        return { ...m, revenue }
      })

      const maxRevenue = Math.max(...merged.map(m => m.revenue), 1)

      const formatted = merged.map(m => ({
        month: new Date(m.year, m.month - 1)
          .toLocaleString("en-US", { month: "short" })
          .toUpperCase(),

        height: (m.revenue / maxRevenue) * 100 || 5
      }))

      setMonthlyData(formatted)

    } catch (err) {
      console.error("Revenue chart error:", err)
    }
  }

  return (
    <div className="chart-card col-span-12 lg:col-span-8">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="section-title">Revenue Growth Trend</h4>
          <p className="section-subtitle">Monthly historical performance</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-lg text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            Current Year
          </div>

          {/* <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-lg text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-outline-variant inline-block" />
            Previous Year
          </div> */}
        </div>
      </div>

      <div className="h-[300px] w-full relative flex items-end justify-between gap-1 pt-10">

        <div className="absolute inset-0 flex flex-col justify-between py-10 pointer-events-none">
          <div className="w-full border-t border-slate-50" />
          <div className="w-full border-t border-slate-50" />
          <div className="w-full border-t border-slate-50" />
          <div className="w-full border-t border-slate-100" />
        </div>

        {monthlyData.map(({ month, height }) => (
          <div key={month} className="chart-column">
            <div className="chart-bar" style={{ height: `${height}%` }} />
            <span className="chart-label">{month}</span>
          </div>
        ))}

      </div>
    </div>
  )
}