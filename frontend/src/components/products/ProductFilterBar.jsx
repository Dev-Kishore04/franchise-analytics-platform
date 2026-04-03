import { useState } from "react"

const CATEGORIES = ['All Items', 'Beverage', 'Main Course', 'Dessert', 'Side Dish']

export default function ProductFilterBar({ activeCategory, onChange, sort ,setSort }) {

  const [highlight, setHighlight] = useState(false)
  const [openSort, setOpenSort] = useState(false)

  const triggerFilterHighlight = () => {
    setHighlight(true)
    setTimeout(() => setHighlight(false), 2000)
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

      {/* Category Filters */}
      <div
        className={`flex p-1 bg-surface-container-low rounded-full w-fit flex-wrap gap-1 transition-all duration-300
        ${highlight ? "shadow-[0_0_30px_rgba(0,0,0,0.45)] animate-pulse" : ""}`}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all
              ${activeCategory === cat
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">

        <button
          onClick={triggerFilterHighlight}
          className="bg-surface-container-low flex items-center px-4 py-2 rounded-lg gap-2 text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            filter_list
          </span>
          <span className="text-sm font-medium">Filter</span>
        </button>

        <div className="relative">

          <button
            onClick={() => setOpenSort(!openSort)}
            className="bg-surface-container-low flex items-center px-4 py-2 rounded-lg gap-2 text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              import_export
            </span>
            <span className="text-sm font-medium">Sort</span>
          </button>

          {openSort && (
            <div className="absolute right-0 mt-2 w-52 bg-surface-container-lowest border border-surface-container rounded-xl shadow-lg overflow-hidden">

              <button
                onClick={() => { setSort("priceAsc"); setOpenSort(false) }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container"
              >
                Price: Low → High
              </button>

              <button
                onClick={() => { setSort("priceDesc"); setOpenSort(false) }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container"
              >
                Price: High → Low
              </button>

              <button
                onClick={() => { setSort("nameAsc"); setOpenSort(false) }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container"
              >
                Name: A → Z
              </button>

              <button
                onClick={() => { setSort("nameDesc"); setOpenSort(false) }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container"
              >
                Name: Z → A
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  )
}