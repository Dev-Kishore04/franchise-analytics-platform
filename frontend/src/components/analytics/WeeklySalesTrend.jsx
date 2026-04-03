// src/components/analytics/WeeklySalesTrend.jsx
import { useEffect, useMemo, useState } from "react"
import { analyticsApi } from "../../lib/api"

const WIDTH = 1000
const HEIGHT = 280
const CHART_PADDING = 20

function getLast7Days() {
  const days = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)

    days.push({
      key: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { weekday: "short" })
    })
  }

  return days
}

export default function WeeklySalesTrend() {

  const [northHub, setNorthHub] = useState([])
  const [southStation, setSouthStation] = useState([])
  const [branchNames, setBranchNames] = useState(["Branch 1","Branch 2"])
  const [days, setDays] = useState(getLast7Days())

  useEffect(() => {

    const load = async () => {

      try {

        const data = await analyticsApi.getWeeklyBranchRevenue()

        const grouped = {}
        const revenueMap = {}

        data.forEach(row => {

          const dateKey = row.date

          if (!grouped[row.branchName]) {
            grouped[row.branchName] = {}
          }

          grouped[row.branchName][dateKey] = row.revenue
        })

        const names = Object.keys(grouped)

        if (names.length > 0) {

          const branch1 = days.map(d =>
            grouped[names[0]][d.key] ?? 0
          )

          setNorthHub(branch1)
        }

        if (names.length > 1) {

          const branch2 = days.map(d =>
            grouped[names[1]][d.key] ?? 0
          )

          setSouthStation(branch2)
        }

        setBranchNames(names)

      } catch (err) {
        console.error("Weekly revenue load failed", err)
      }

    }

    load()

  }, [days])

  const MAX_VALUE = Math.max(...northHub, ...southStation, 1)

  const stepX = WIDTH / (days.length - 1)

  const getPoints = (data) =>
    data.map((value, i) => {
      const x = i * stepX

      const usableHeight = HEIGHT - CHART_PADDING * 2

      const y =
        HEIGHT -
        CHART_PADDING -
        (value / MAX_VALUE) * usableHeight

      return [x, y]
    })

  const northPoints = useMemo(() => getPoints(northHub), [northHub])
  const southPoints = useMemo(() => getPoints(southStation), [southStation])

  const buildSmoothPath = (points) => {

    if (points.length < 2) return ""

    let path = `M ${points[0][0]},${points[0][1]}`

    for (let i = 0; i < points.length - 1; i++) {

      const x_mid = (points[i][0] + points[i + 1][0]) / 2
      const y_mid = (points[i][1] + points[i + 1][1]) / 2

      const cp_x1 = (x_mid + points[i][0]) / 2
      const cp_x2 = (x_mid + points[i + 1][0]) / 2

      path += ` Q ${cp_x1},${points[i][1]} ${x_mid},${y_mid}`
      path += ` Q ${cp_x2},${points[i + 1][1]} ${points[i + 1][0]},${points[i + 1][1]}`
    }

    return path
  }

  const northPath = buildSmoothPath(northPoints)
  const southPath = buildSmoothPath(southPoints)

  const northFill = northPath
  ? `${northPath} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`
  : ""

  return (
    <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-2xl shadow-sm">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h3 className="text-xl font-headline font-bold text-on-surface">
            Weekly Sales Trend
          </h3>
          <p className="text-on-surface-variant text-sm">
            Performance comparison by top branch
          </p>
        </div>

        <div className="flex gap-4">

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary"/>
            <span className="text-xs font-semibold text-on-surface-variant">
              {branchNames[0]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-tertiary"/>
            <span className="text-xs font-semibold text-on-surface-variant">
              {branchNames[1]}
            </span>
          </div>

        </div>

      </div>

      <div className="relative h-64 w-full">

        {[0,25,50,75].map(pct => (
          <div
            key={pct}
            className="absolute w-full border-t border-outline-variant/20"
            style={{ bottom: `${pct}%` }}
          />
        ))}

        <svg
          className="w-full h-full"
          viewBox="0 0 1000 280"
          preserveAspectRatio="none"
        >

          <defs>

            <linearGradient id="grad-primary" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#004bcb"/>
              <stop offset="100%" stopColor="#0561ff"/>
            </linearGradient>

            <linearGradient id="grad-tertiary" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#9d3000"/>
              <stop offset="100%" stopColor="#c73f00"/>
            </linearGradient>

            <linearGradient id="fill-primary" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#004bcb" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#004bcb" stopOpacity="0"/>
            </linearGradient>

          </defs>

         {northFill && <path d={northFill} fill="url(#fill-primary)" />}

          <path
            d={northPath}
            fill="none"
            stroke="url(#grad-primary)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <path
            d={southPath}
            fill="none"
            stroke="url(#grad-tertiary)"
            strokeWidth="3"
            strokeDasharray="8 4"
            strokeLinecap="round"
          />

          {northPoints.map(([x,y],i)=>(
            <circle key={`n${i}`} cx={x} cy={y} r="5" strokeWidth="2" fill="#004bcb"/>
          ))}

          {southPoints.map(([x,y],i)=>(
            <circle key={`s${i}`} cx={x} cy={y} r="5" fill="#9d3000"/>
          ))}

        </svg>

      </div>

      <div className="flex justify-between mt-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter px-1">
        {days.map(d => (
          <span key={d.key}>{d.label}</span>
        ))}
      </div>

    </div>
  )
}