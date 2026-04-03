// src/components/analytics/AIStrategicInsight.jsx
import { useEffect, useState } from "react"
import { insightApi } from "../../lib/api"
import { useNavigate } from "react-router-dom"
import { getAICache, setAICache, isAIEnabled } from "../../utils/aiCache"

export default function AIStrategicInsight({analyticsData}) {

  const [message,setMessage] = useState("Analyzing branch performance...")
  const navigate = useNavigate()

  useEffect(()=>{

    if(!analyticsData || analyticsData.length===0) return

    if(!isAIEnabled()){
      setMessage("AI recommendations are disabled. Enable them in Settings.")
      return
    }

    const cacheKey = "ai_analytics_" + JSON.stringify(analyticsData).length

    const cached = getAICache(cacheKey)

    if(cached){
      setMessage(cached)
      return
    }

    async function loadAI(){

      try{

        const res = await insightApi.recommendation(
          "analytics",
          {analytics:analyticsData}
        )

        const msg = res.data.message

        setMessage(msg)

        setAICache(cacheKey,msg)

      }catch(e){

        setMessage("AI recommendation unavailable.")

      }

    }

    loadAI()

  },[analyticsData])

  return (
    <div className="mt-12 p-8 rounded-2xl border border-white/40 shadow-xl flex items-start gap-6"
         style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}>
      <div className="w-14 h-14 rounded-full bg-tertiary-container/20 flex items-center justify-center shrink-0">
        <span
          className="material-symbols-outlined text-tertiary"
          style={{ fontSize: '28px', fontVariationSettings: "'FILL' 0" }}
        >
          auto_awesome
        </span>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h4 className="text-xl font-headline font-bold text-on-surface">AI Strategic Insight</h4>
          <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
            Optimized
          </span>
        </div>
        <p className="text-on-surface-variant text-base leading-relaxed max-w-3xl">
         {message}
        </p>
        
      </div>
    </div>
  )
}
