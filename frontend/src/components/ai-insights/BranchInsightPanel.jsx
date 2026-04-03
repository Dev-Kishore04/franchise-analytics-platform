import { useEffect, useState } from "react"
import { analyticsApi } from "@/lib/api"

export default function BranchInsightPanel({ branchId }) {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!branchId) return
    loadBranchInsight()
  }, [branchId])

  const loadBranchInsight = async () => {
    try {
      setLoading(true)
      const res = await analyticsApi.getBranchInsight(branchId)
      setData(res)
    } catch (err) {
      console.error("Failed to load branch insight", err)
    } finally {
      setLoading(false)
    }
  }

  if (!branchId) return null

  if (loading) {
    return (
      <div className="col-span-12 bg-surface-container-lowest rounded-[2rem] p-10 mb-8 shadow-sm border border-outline-variant/10 flex items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin mr-3">sync</span>
        Loading branch analysis…
      </div>
    )
  }

  if (!data) return null

  const performancePct = ((data.revenue / data.topBranchRevenue) * 100).toFixed(1)
  const gap = (data.topBranchRevenue - data.revenue).toLocaleString()

  const orderStatus =
    data.orders >= data.topBranchOrders * 0.9
        ? { text: "Strong performance", color: "text-green-600" }
        : data.orders >= data.topBranchOrders * 0.6
        ? { text: "Moderate performance", color: "text-amber-600" }
        : { text: "Below network average", color: "text-error" }

  const aovStatus =
    data.avgOrderValue >= data.topBranchAOV * 0.9
        ? { text: "Competitive pricing", color: "text-green-600" }
        : data.avgOrderValue >= data.topBranchAOV * 0.6
        ? { text: "Slightly below leader", color: "text-amber-600" }
        : { text: "Lower than top branch", color: "text-error" }

  const diversityStatus =
    data.productDiversity >= data.topBranchProductTypes * 0.9
        ? { text: "Strong product variety", color: "text-green-600" }
        : data.productDiversity >= data.topBranchProductTypes * 0.6
        ? { text: "Moderate offering", color: "text-amber-600" }
        : { text: "Limited offerings", color: "text-error" }

  return (
    <div className="col-span-12 bg-surface-container-lowest rounded-[2rem] p-10 mb-10 shadow-sm border border-outline-variant/10">

      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <span className="text-primary font-bold tracking-widest text-xs uppercase block mb-2">
            Branch Intelligence
          </span>
          <h3 className="text-3xl font-bold font-headline text-on-surface mb-1">
            {data.branchName} Performance Analysis
          </h3>
          <p className="text-on-surface-variant text-sm">
            AI-powered diagnostics comparing this branch with top-performing locations.
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">
            Network Rank
          </p>
          <p className="text-3xl font-black text-primary">
            #{data.rank}
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-6 mb-10">

        <div className="bg-surface-container rounded-xl p-5">
          <p className="text-xs uppercase text-on-surface-variant mb-1">Revenue (30 Days)</p>
          <p className="text-2xl font-bold text-on-surface">₹{data.revenue.toLocaleString()}</p>
        </div>

        <div className="bg-surface-container rounded-xl p-5">
          <p className="text-xs uppercase text-on-surface-variant mb-1">Orders</p>
          <p className="text-2xl font-bold text-on-surface">{data.orders}</p>
        </div>

        <div className="bg-surface-container rounded-xl p-5">
          <p className="text-xs uppercase text-on-surface-variant mb-1">Avg Order Value</p>
          <p className="text-2xl font-bold text-on-surface">₹{Number(data.avgOrderValue).toFixed(2)}</p>
        </div>

        <div className="bg-surface-container rounded-xl p-5">
          <p className="text-xs uppercase text-on-surface-variant mb-1">Product Diversity</p>
          <p className="text-2xl font-bold text-on-surface">{data.productDiversity}</p>
        </div>

      </div>

      {/* Performance Gap */}
      <div className="mb-10">

        <h4 className="text-lg font-bold font-headline mb-4">Performance Gap</h4>

        <div className="bg-surface-container rounded-2xl p-6">

          <div className="flex justify-between text-sm mb-3">
            <span className="font-medium text-on-surface">Top Branch</span>
            <span className="font-bold">₹{data.topBranchRevenue.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm mb-3">
            <span className="font-medium text-on-surface">This Branch</span>
            <span className="font-bold">₹{data.revenue.toLocaleString()}</span>
          </div>

          <div className="progress-track h-3 mt-4">
            <div
              className="progress-fill bg-primary"
              style={{ width: `${performancePct}%` }}
            />
          </div>

          <p className="text-xs text-on-surface-variant mt-2">
            {performancePct}% of top branch performance — revenue gap ₹{gap}
          </p>

        </div>

      </div>

      {/* Root Cause Signals */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-surface-container rounded-xl p-6">
        <p className="text-xs uppercase text-on-surface-variant mb-2">
            Orders vs Leader
        </p>
        <p className="text-xl font-bold text-on-surface">{data.orders}</p>
        <p className={`text-xs mt-1 ${orderStatus.color}`}>
            {orderStatus.text}
        </p>
        </div>

        <div className="bg-surface-container rounded-xl p-6">
        <p className="text-xs uppercase text-on-surface-variant mb-2">
            Avg Order Value
        </p>
        <p className="text-xl font-bold text-on-surface">
            ₹{Number(data.avgOrderValue).toFixed(2)}
        </p>
        <p className={`text-xs mt-1 ${aovStatus.color}`}>
            {aovStatus.text}
        </p>
        </div>

        <div className="bg-surface-container rounded-xl p-6">
        <p className="text-xs uppercase text-on-surface-variant mb-2">
            Product Diversity
        </p>
        <p className="text-xl font-bold text-on-surface">
            {data.productDiversity} types
        </p>
        <p className={`text-xs mt-1 ${diversityStatus.color}`}>
            {diversityStatus.text}
        </p>
        </div>

      </div>

      {/* Benchmark Comparison */}
      <div className="mb-10">

        <h4 className="text-lg font-bold font-headline mb-4">
          Benchmark Comparison
        </h4>

        <div className="bg-surface-container rounded-xl p-6">

          <table className="w-full text-sm">
            <thead className="text-on-surface-variant">
              <tr>
                <th className="text-left py-2">Metric</th>
                <th className="text-left py-2">This Branch</th>
                <th className="text-left py-2">Top Branch</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="py-2">Revenue</td>
                <td>₹{data.revenue}</td>
                <td>₹{data.topBranchRevenue}</td>
              </tr>

              <tr>
                <td className="py-2">Orders</td>
                <td>{data.orders}</td>
                <td>{data.topBranchOrders}</td>
              </tr>

              <tr>
                <td className="py-2">Avg Order Value</td>
                <td>₹{Number(data.avgOrderValue).toFixed(2)}</td>
                <td>₹{Number(data.topBranchAOV).toFixed(2)}</td>
              </tr>

              <tr>
                <td className="py-2">Product Types</td>
                <td>{data.productDiversity}</td>
                <td>{data.topBranchProductTypes}</td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>

      {/* AI Recommendation */}
      <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">

        <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
          AI Recommendation
        </p>

        <p className="text-lg font-semibold text-on-surface mb-3">
          {data.insight}
        </p>

        <p className="text-on-surface-variant text-sm">
          {data.recommendation}
        </p>

      </div>

    </div>
  )
}