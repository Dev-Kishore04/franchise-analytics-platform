// src/pages/AIInsights.jsx
import { useState } from 'react'
import { useApi } from '@/hooks/useApi'
import { insightApi } from '@/lib/api'
import FeaturedInsightCard from '@/components/ai-insights/FeaturedInsightCard'
import SideInsightCard     from '@/components/ai-insights/SideInsightCard'
import InsightRowCard      from '@/components/ai-insights/InsightRowCard'
import ConfidenceChart     from '@/components/ai-insights/ConfidenceChart'
import BranchInsightPanel from '@/components/ai-insights/BranchInsightPanel'
import { useAuth } from '@/context/AuthContext'

export default function AIInsights() {
  const { data: insights, loading, refetch } = useApi(insightApi.getAll)
  const [generating, setGenerating] = useState(false)

  const params = new URLSearchParams(window.location.search)
  const branchId = params.get("branchId")

  const list = insights || []
  const {user} = useAuth()

  // Split into featured (highest impact), side (second), and row cards (rest)
  const highImpact = list.filter(i => i.impactLevel === 'High')
  const featured   = highImpact[0] || list[0]
  const side       = highImpact[1] || list[1]
  const rowItems   = list.slice(2)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await insightApi.generate()
      await refetch()
    } catch (e) {
      console.error('Generate failed', e)
      alert('Failed to generate insights: ' + (e?.response?.data?.message || e.message))
    } finally {
      setGenerating(false)
    }
  }

  const handleDeleteAll = async () => {

    if (!confirm("Delete all AI insights?")) return

    try {

      await insightApi.deleteAll()

      await refetch()

    } catch (err) {

      console.error("Delete failed", err)

    }

  }

  const handleAccept = async (id) => {
    try { await insightApi.updateStatus(id, 'Accepted'); refetch() } catch (e) { console.error(e) }
  }

  const handleDismiss = async (id) => {
    try { await insightApi.updateStatus(id, 'Dismissed'); refetch() } catch (e) { console.error(e) }
  }

  // Map API insight to component prop shape
  const toFeaturedProps = (i) => i ? {
    updatedAt:      i.createdAt ? new Date(i.createdAt).toLocaleString() : 'Just now',
    headline:       i.insightText,
    recommendation: i.recommendationText,
    branch:         i.branchName || 'All Branches',
  } : null

  const toSideProps = (i) => i ? {
    category:  i.category || 'Analysis',
    trendIcon: 'trending_down',
    headline:  i.insightText,
    body:      i.recommendationText,
    status:    i.status,
    time:      i.createdAt ? new Date(i.createdAt).toLocaleString() : 'Just now',
  } : null

  const toRowProps = (i) => ({
    id:       i.id,
    icon:     'auto_awesome',
    title:    i.insightText,
    body:     i.recommendationText || '',
    tag:      i.status || 'New',
    meta:     `${i.branchName || 'All Branches'} · ${i.createdAt ? new Date(i.createdAt).toLocaleTimeString() : ''}`,
    dismissed: i.status === 'Dismissed',
  })

  return (
    <div className="pt-24 pb-16 px-14 min-h-screen">
      <section className="mb-12 flex justify-between items-end">
        <div className="max-w-2xl">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
            Decision Support System
          </span>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-3">
            AI Intelligence Command
          </h2>
          <p className="text-on-surface-variant text-lg font-body leading-relaxed">
            Optimize franchise performance with real-time heuristic analysis and automated business recommendations.
          </p>
        </div>
        {user.role !== "ROLEMANAGER" && (
          <>
          <div className='flex flex-col items-end gap-2'>
          <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-3 bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 group disabled:opacity-70"
        >
          <span
            className={`material-symbols-outlined transition-transform duration-500 ${generating ? 'animate-spin' : 'group-hover:rotate-180'}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          {generating ? 'Generating…' : 'Generate Insights'}
        </button>
        <button
          onClick={handleDeleteAll}
          className="flex items-center gap-3 bg-gradient-to-br from-[#d83030] to-[#ff5454] text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-all active:scale-95 group disabled:opacity-70"
        >
          <span
            className={`material-symbols-outlined transition-transform duration-500 ${generating ? 'animate-spin' : 'group-hover:rotate-180'}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            delete
          </span>
          Delete All
        </button>
        </div>
          </>
        )}
        
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin mr-3">sync</span>Loading insights…
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl">auto_awesome</span>
          <p className="text-lg font-medium">No insights yet. Click "Generate Insights" to analyze your franchise data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          {branchId && <BranchInsightPanel branchId={branchId} />}
          {user.role !== "ROLEMANAGER" && (
            <>
              {featured && <FeaturedInsightCard insight={toFeaturedProps(featured)} />}
              {side && <SideInsightCard insight={toSideProps(side)} />}

              {rowItems.map(i => (
                <InsightRowCard
                  key={i.id}
                  insight={toRowProps(i)}
                  onAccept={handleAccept}
                  onDismiss={handleDismiss}
                />
              ))}

              <ConfidenceChart successRate="94.2%" roiImpact="+$12.4k" />
            </>
          )}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={generating}
        className="fixed bottom-10 right-10 bg-surface-container-lowest text-on-surface w-16 h-16 rounded-full shadow-2xl flex items-center justify-center border border-primary/10 hover:scale-110 transition-transform active:scale-95 group z-50 disabled:opacity-50"
      >
        <span
          className={`material-symbols-outlined text-primary transition-transform ${
            generating ? "animate-spin" : "group-hover:rotate-12"
          }`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>
      </button>
    </div>
  )
}
