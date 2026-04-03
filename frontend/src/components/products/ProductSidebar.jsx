// src/components/products/ProductSidebar.jsx
import { useEffect, useState } from "react"
import { insightApi } from "../../lib/api"
import { useNavigate } from "react-router-dom"
import { getAICache, setAICache, isAIEnabled } from "../../utils/aiCache"

const shortcuts = [
  { icon: 'qr_code_2', label: 'QR Menus' },
  { icon: 'loyalty',   label: 'Discounts' },
  { icon: 'category',  label: 'Groups' },
  { icon: 'history',   label: 'Logs' },
]

export default function ProductSidebar({productData}) {

  const [message,setMessage] = useState("Analyzing branch performance...")
  const navigate = useNavigate()

  useEffect(()=>{

    if(!productData || productData.length===0) return

    if(!isAIEnabled()){
      setMessage("AI recommendations are disabled. Enable them in Settings.")
      return
    }

    const cacheKey = "ai_products_" + JSON.stringify(productData).length

    const cached = getAICache(cacheKey)

    if(cached){
      setMessage(cached)
      return
    }

    async function loadAI(){
      
      try{

        const res = await insightApi.recommendation(
          "products",
          {product:productData}
        )

        const msg = res.data.message

        setMessage(msg)

        setAICache(cacheKey,msg)

      }catch(e){

        setMessage("AI recommendation unavailable.")

      }

    }

    loadAI()

  },[productData])

  return (
    <div className="col-span-12 lg:col-span-3 space-y-8">
      {/* AI Recommendation */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-t-4 border-tertiary-container">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="material-symbols-outlined text-tertiary-container"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          <h4 className="font-headline font-bold text-sm uppercase tracking-wider">AI Recommendation</h4>
        </div>
        <p className="text-sm text-on-surface font-body leading-relaxed mb-6 italic">
          {message}
        </p>
       
      </div>

      {/* Quick Stats — dark card */}
      <div className="bg-slate-900 rounded-xl p-6 text-white overflow-hidden relative">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <h4 className="font-headline font-bold text-sm mb-4">Quick Stats</h4>
        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-label text-slate-400 uppercase tracking-widest">Active Menu</span>
            <span className="text-xl font-headline font-extrabold text-white">88%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full">
            <div className="bg-primary w-[88%] h-full rounded-full" />
          </div>
          <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 font-label uppercase">
            <span>Weekly Sales Growth</span>
            <span className="text-emerald-400 font-bold">+12.4%</span>
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="bg-surface-container-low rounded-xl p-6">
        <h4 className="font-headline font-bold text-sm mb-4">Shortcuts</h4>
        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map(({ icon, label }) => (
            <div
              key={label}
              className="bg-white p-3 rounded-lg flex flex-col items-center gap-1 cursor-pointer hover:shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>{icon}</span>
              <span className="text-[10px] font-bold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
