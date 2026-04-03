// src/components/alerts/AlertFilterBar.jsx
import { useEffect, useState } from "react"
import { insightApi } from "../../lib/api"
import { useNavigate } from "react-router-dom"
import { getAICache, setAICache, isAIEnabled } from "../../utils/aiCache"

const STATUS_TABS = ['All Alerts', 'Pending', 'Resolved']

const SEVERITY_CHIPS = [
  { label: 'High',   cls: 'bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20' },
  { label: 'Medium', cls: 'bg-orange-100 text-orange-700' },
  { label: 'Low',    cls: 'bg-green-100 text-green-700' },
]

const TYPE_CHIPS = [
  { label: 'Inventory', cls: 'bg-primary/10 text-primary' },
  { label: 'Sales',     cls: 'bg-slate-100 text-slate-600' },
  { label: 'Anomaly',   cls: 'bg-slate-100 text-slate-600' },
]

export default function AlertFilterBar({
  activeTab, onTabChange,
  activeSeverity, onSeverityChange,
  activeType, onTypeChange,
  alertData
}) {
  const [message,setMessage] = useState("Analyzing branch performance...")
  const navigate = useNavigate()

  useEffect(()=>{

    if(!alertData || alertData.length===0){
      setMessage("No Alerts Found")
      return
    }

    if(!isAIEnabled()){
      setMessage("AI recommendations are disabled. Enable them in Settings.")
      return
    }

    const cacheKey = "ai_alerts_" + JSON.stringify(alertData).length

    const cached = getAICache(cacheKey)

    if(cached){
      setMessage(cached)
      return
    }

    async function loadAI(){

      try{

        const res = await insightApi.recommendation(
          "alerts",
          {alerts:alertData}
        )


        const msg = res.data.message

        setMessage(msg)

        setAICache(cacheKey,msg)

      }catch(e){

        setMessage("AI recommendation unavailable.")

      }

    }

    loadAI()

  },[alertData])
  
  return (
    <>
      {/* Status tabs row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex bg-surface-container-highest p-1 rounded-full w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all
                ${activeTab === tab
                  ? 'bg-white text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filter chips grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Severity */}
        <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col gap-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 px-1">
            Filter by Severity
          </label>
          <div className="flex flex-wrap gap-2">
            {SEVERITY_CHIPS.map(({ label, cls }) => (
              <span
                key={label}
                onClick={() => onSeverityChange(activeSeverity === label ? null : label)}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all
                  ${cls} ${activeSeverity === label ? 'ring-2 ring-offset-1 ring-current' : ''}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col gap-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 px-1">
            Filter by Type
          </label>
          <div className="flex flex-wrap gap-2">
            {TYPE_CHIPS.map(({ label, cls }) => (
              <span
                key={label}
                onClick={() => onTypeChange(activeType === label ? null : label)}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all
                  ${cls} ${activeType === label ? 'ring-2 ring-offset-1 ring-current' : ''}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* AI Banner */}
        <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl flex items-center justify-between text-white shadow-lg gap-4">
          <div className="flex flex-col">
            <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">AI Recommendation</span>
            <p className="font-headline font-semibold text-base leading-tight">
             {message}
            </p>
          </div>
          
        </div>
      </div>
    </>
  )
}
