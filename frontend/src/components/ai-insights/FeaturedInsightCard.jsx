// src/components/ai-insights/FeaturedInsightCard.jsx

export default function FeaturedInsightCard({ insight }) {
  return (
    <div className="col-span-8 bg-surface-container-lowest rounded-[2rem] p-8 shadow-sm border border-transparent hover:border-primary/10 transition-all group relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex justify-between items-start mb-8">
          <span className="flex items-center gap-2 bg-tertiary-container text-on-tertiary-container px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1", fontSize: '16px' }}>bolt</span>
            High Impact
          </span>
          <span className="text-on-surface-variant text-xs font-medium">Updated {insight.updatedAt}</span>
        </div>

        {/* Headline */}
        <div className="mb-10">
          <p className="text-on-surface-variant font-label text-sm mb-2">Insight Analysis</p>
          <h3 className="text-2xl font-bold font-headline text-on-surface leading-snug">{insight.headline}</h3>
        </div>

        {/* Recommendation panel */}
        <div className="grid grid-cols-2 gap-8 bg-surface-container-low/50 p-6 rounded-2xl backdrop-blur-sm border border-white/40">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Recommendation</p>
            <p className="text-on-surface font-semibold text-lg leading-tight">{insight.recommendation}</p>
          </div>
          <div className="flex flex-col justify-between border-l border-outline-variant/30 pl-8">
            <div>
              <p className="text-xs font-medium text-on-surface-variant mb-1">Associated Branch</p>
              <p className="font-bold text-on-surface">{insight.branch}</p>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold">New</span>
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline transition-colors">
                Analyze Root Cause
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
