// src/components/branches/AIOptimizationBanner.jsx

import { useEffect, useState } from "react"
import { insightApi } from "../../lib/api"
import { useNavigate } from "react-router-dom"
import { getAICache, setAICache, isAIEnabled } from "../../utils/aiCache"
import { useAuth } from "../../context/AuthContext"

export default function AIOptimizationBanner({
  title = 'Optimization Opportunity Detected',
  actionLabel = 'Analyze Insight',
  branchData
}) {

  const [message,setMessage] = useState("Analyzing branch performance...")
  const navigate = useNavigate()
  const {user}=useAuth()

  useEffect(()=>{

    if(!branchData || branchData.length === 0) return

    if(!isAIEnabled()){
      setMessage("AI recommendations are disabled. Enable them in Settings.")
      return
    }

    const cacheKey = "ai_branches_" + JSON.stringify(branchData).length

    const cached = getAICache(cacheKey)

    if(cached){
      setMessage(cached)
      return
    }

    async function loadAI(){

      try{

        const res = await insightApi.recommendation(
          "branches",
          {branches:branchData}
        )

        const msg = res.data.message

        setMessage(msg)

        // ✅ Save in cache
        setAICache(cacheKey,msg)

      }catch(e){

        setMessage("AI recommendation unavailable.")

      }

    }

    loadAI()

  },[branchData])

  return (
    <div className="mt-12 p-6 bg-tertiary-container/10 border border-tertiary/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 backdrop-blur-sm">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center text-white shrink-0">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
        </div>

        <div>
          <h4 className="font-headline font-bold text-on-surface">{title}</h4>
          <p className="font-body text-sm text-on-surface-variant mt-0.5 max-w-xl">
            {message}
          </p>
        </div>
      </div>

      <button
        onClick={()=>navigate(`/ai-insights?branchId=${user.branchId}`)}
        className="bg-tertiary text-white px-6 py-3 rounded-full font-headline font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap"
      >
        {actionLabel}
      </button>
    </div>
  )
}
