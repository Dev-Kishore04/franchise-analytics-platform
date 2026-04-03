// src/components/alerts/ResponseEfficiencyCard.jsx

export default function ResponseEfficiencyCard({ percentage = 75 }) {
  // SVG donut math
  const r = 70
  const circumference = 2 * Math.PI * r  // ~439.8
  const filled = (percentage / 100) * circumference
  const dashOffset = circumference - filled

  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col justify-between shadow-sm">
      <div>
        <h3 className="font-headline font-bold text-xl text-on-surface">Response Efficiency</h3>
        <p className="text-on-surface-variant text-sm mt-2">
          Current resolution velocity is 14% higher than last quarter.
        </p>
      </div>

      {/* Donut */}
      <div className="mt-8 flex items-center justify-center relative">
        <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
          {/* Track */}
          <circle cx="80" cy="80" r={r} fill="transparent" stroke="#e6e8ea" strokeWidth="12" />
          {/* Progress */}
          <circle
            cx="80" cy="80" r={r}
            fill="transparent"
            stroke="#004bcb"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${dashOffset}`}
            strokeDashoffset="0"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-on-surface">{percentage}%</span>
          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Target met</span>
        </div>
      </div>

      <button className="mt-8 w-full py-4 bg-surface-container-high text-on-surface font-bold text-sm rounded-xl hover:bg-surface-container-highest transition-all">
        View Analytics Report
      </button>
    </div>
  )
}
