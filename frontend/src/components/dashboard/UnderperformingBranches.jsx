import { useEffect, useState } from "react"
import { analyticsApi, insightApi } from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { useCurrency } from "../../utils/currency"

export default function UnderperformingBranches() {

  const [branches, setBranches] = useState([])
  const [loadingId, setLoadingId] = useState(null)
  const navigate = useNavigate()
  const {format}=useCurrency()

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {

      const data = await analyticsApi.getUnderperformingBranches()

      // remove new branches (0 revenue) and keep bottom 3
     const filtered = data
      .filter(b => b.revenue > 0)
      .sort((a,b) => a.revenue - b.revenue)
      .slice(0,3)

      setBranches(filtered)

    } catch (err) {
      console.error("Failed to load underperforming branches", err)
    }
  }

  const generateInsight = (branchId) => {
    navigate(`/ai-insights?branchId=${branchId}`)
  }

  if (!branches.length) {
    return null
  }

  // find highest revenue among the 3 branches
  const maxRevenue = Math.max(...branches.map(b => b.revenue))

  return (
    <div className="chart-card col-span-12 mb-10">

      <div className="flex justify-between items-center mb-2">
        <h4 className="section-title">Underperforming Branches</h4>

        <span className="text-xs text-on-surface-variant">
          Detected using revenue threshold
        </span>
      </div>

      <p className="section-subtitle mb-8">
        Branches performing below expected revenue levels
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {branches.map(branch => {

          const pct = (branch.revenue / maxRevenue) * 100

          return (
            <div
              key={branch.branchId}
              className="bg-background border border-outline/20 rounded-xl p-6 flex flex-col justify-between"
            >

              <div>

                <div className="flex justify-between items-center mb-2">

                  <span className="font-semibold text-sm">
                    {branch.branchName}
                  </span>

                  <span className="text-xs text-error font-semibold">
                    Low Performance
                  </span>

                </div>

                <div className="text-2xl font-bold mb-3">
                  {format(Math.round(branch.revenue))}
                </div>

                <div className="progress-track mb-4">
                  <div
                    className="progress-fill bg-error"
                    style={{ width: `${pct}%` }}
                  />
                </div>

              </div>

              <button
                onClick={() => generateInsight(branch.branchId)}
                disabled={loadingId === branch.branchId}
                className="btn-primary text-xs flex items-center justify-center gap-2"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "16px" }}
                >
                  psychology
                </span>

                {loadingId === branch.branchId
                  ? "Generating..."
                  : "Generate AI Insight"}
              </button>

            </div>
          )
        })}

      </div>

    </div>
  )
}