// src/components/dashboard/BranchComparisonChart.jsx

import { useEffect, useState } from "react"
import { analyticsApi } from "@/lib/api"
import { useCurrency } from "../../utils/currency"

export default function BranchComparisonChart() {

  const [branches, setBranches] = useState([])
  const {format} = useCurrency()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {

      const data = await analyticsApi.getBranchAOV()


      const max = Math.max(...data.map(b => b.avgOrderValue))

      const formatted = data.slice(0,5).map(b => ({
        name: b.branchName,
        revenue: format(Math.round(b.avgOrderValue)),
        pct: (b.avgOrderValue / max) * 100
      }))

      setBranches(formatted)

    } catch (err) {
      console.error("Failed to load branch AOV", err)
    }
  }

  return (
    <div className="chart-card col-span-12 lg:col-span-4">
      <h4 className="section-title mb-1">Branch Comparison</h4>
      <p className="section-subtitle mb-8">Average Order Value</p>

      <div className="space-y-6">
        {branches.map(({ name, revenue, pct }) => (
          <div key={name}>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>{name}</span>
              <span>{revenue}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}