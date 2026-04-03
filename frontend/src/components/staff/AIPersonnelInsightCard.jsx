import { useEffect, useState } from "react"
import { insightApi } from "../../lib/api"
import { useNavigate } from "react-router-dom"
import { getAICache, setAICache, isAIEnabled } from "../../utils/aiCache"

export default function AIPersonnelInsightCard({ staffData }) {

  const [message, setMessage] = useState("Analyzing staff performance...")
  const navigate = useNavigate()

  useEffect(() => {

    if (!staffData || staffData.length === 0) return

    // ✅ Check if AI is enabled
    if (!isAIEnabled()) {
      setMessage("AI recommendations are disabled. Enable them in Settings.")
      return
    }

    // ✅ Create cache key
    const cacheKey = "ai_staff_" + JSON.stringify(staffData).length

    // ✅ Try cache first
    const cached = getAICache(cacheKey)

    if (cached) {
      setMessage(cached)
      return
    }

    async function loadAI() {

      try {

        const res = await insightApi.recommendation(
          "staff",
          { staff: staffData }
        )

        const msg = res.data.message

        setMessage(msg)

        // ✅ Save to cache
        setAICache(cacheKey, msg)

      } catch (e) {

        setMessage("AI recommendation unavailable.")

      }

    }

    loadAI()

  }, [staffData])
  return (
    <div className="bg-tertiary-container text-on-tertiary-container p-6 rounded-2xl relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest">AI Decision Support</span>
        </div>
        <h4 className="text-lg font-bold font-headline mb-2 leading-tight">
          Optimized Staffing Alert
        </h4>
        <p className="text-sm opacity-90 font-body mb-4">
         {message}
        </p>
      
      </div>

      {/* Decorative background icon */}
      <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        <span className="material-symbols-outlined" style={{ fontSize: '96px' }}>monitoring</span>
      </div>
    </div>
  )
}
