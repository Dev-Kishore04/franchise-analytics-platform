import { useEffect, useState } from "react"
import { analyticsApi } from "@/lib/api"
import { useCurrency } from "../../utils/currency"

function TrendBadge({ growth }) {


  if (growth > 0) {
    return (
      <span className="flex items-center gap-1 text-green-600 font-semibold text-xs">
        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
          trending_up
        </span>
        +{growth.toFixed(1)}%
      </span>
    )
  }

  if (growth < 0) {
    return (
      <span className="flex items-center gap-1 text-red-500 font-semibold text-xs">
        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
          trending_down
        </span>
        {growth.toFixed(1)}%
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1 text-gray-500 text-xs">
      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
        trending_flat
      </span>
      0%
    </span>
  )
}

export default function BranchLeaderboard() {

  const [ranking, setRanking] = useState([])
  const {format}=useCurrency()

  useEffect(() => {
    loadRanking()
  }, [])

  const loadRanking = async () => {
    try {
      const data = await analyticsApi.getBranchRevenueGrowth()
      setRanking(data)
    } catch (err) {
      console.error("Leaderboard load error", err)
    }
  }

  return (
    <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">

      <div className="p-6 flex justify-between items-center bg-surface-container-low/50">
        <h4 className="section-title">Branch Ranking Leaderboard</h4>
        <button className="text-sm font-bold text-primary hover:underline">
          View Report
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">

        {ranking.length === 0 ? (
          <p className="px-6 py-10 text-sm text-on-surface-variant">
            No ranking data yet.
          </p>
        ) : (

          <table className="branch-table">

            <thead>
              <tr>
                <th>Rank</th>
                <th>Branch Name</th>
                <th>Revenue</th>
                <th>Trend</th>
              </tr>
            </thead>

            <tbody>
              {ranking.slice(0,5).map((b,i) => (
                <tr key={b.branchName}>

                  <td className="text-sm font-bold">
                    {String(i + 1).padStart(2,"0")}
                  </td>

                  <td>
                    <div className="flex items-center gap-3">

                      {i === 0 && (
                        <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined" style={{ fontSize:"16px" }}>
                            location_on
                          </span>
                        </div>
                      )}

                      <span className="text-sm font-semibold">
                        {b.branchName}
                      </span>

                    </div>
                  </td>

                  <td className="text-sm font-medium">
                    {b.revenue != null
                      ? format( Number(b.revenue)).toLocaleString(undefined,{
                          minimumFractionDigits:2,
                          maximumFractionDigits:2
                        })
                      : "—"}
                  </td>

                  <td>
                    <TrendBadge growth={b.growth} />
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  )
}