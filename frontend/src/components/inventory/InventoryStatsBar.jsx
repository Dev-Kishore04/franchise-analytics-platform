// src/components/inventory/InventoryStatsBar.jsx
import { useEffect, useState } from "react"
import { insightApi } from "../../lib/api"
import { useNavigate } from "react-router-dom"
import { getAICache, setAICache, isAIEnabled } from "../../utils/aiCache"

export default function InventoryStatsBar({ totalValue, lowStockCount, inventoryData }) {

  const [message,setMessage] = useState("Analyzing branch performance...")
  const navigate = useNavigate()

  useEffect(()=>{

    if(!inventoryData || inventoryData.length===0) return

    if(!isAIEnabled()){
      setMessage("AI recommendations are disabled. Enable them in Settings.")
      return
    }

    const cacheKey = "ai_inventory_" + JSON.stringify(inventoryData).length

    const cached = getAICache(cacheKey)

    if(cached){
      setMessage(cached)
      return
    }

    async function loadAI(){

      try{

        const res = await insightApi.recommendation(
          "inventory",
          { inventory:inventoryData }
        )

        const msg = res.data.message

        setMessage(msg)

        setAICache(cacheKey,msg)

      }catch(e){

        setMessage("AI recommendation unavailable.")

      }

    }

    loadAI()

  },[inventoryData])

  return (
    <div className="grid grid-cols-12 gap-6 mb-10">
      {/* Total SKU Value */}
      <div className="col-span-12 md:col-span-3 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total SKU Value</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-headline">{totalValue}</span>
          <span className="text-xs text-emerald-600 font-semibold">+4.2%</span>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="col-span-12 md:col-span-3 bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-tertiary">
        <p className="text-xs font-bold text-tertiary uppercase tracking-widest mb-1">Low Stock Alerts</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-headline">{lowStockCount}</span>
          <span className="text-xs text-slate-400 font-medium">Critical Items</span>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-primary to-primary-container p-6 rounded-xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center gap-4 h-full">
          <div>
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">AI Recommendation</p>
            <h4 className="text-white text-base font-bold leading-tight max-w-xs">{message}</h4>
          </div>
          
        </div>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  )
}
