// src/components/branches/BranchFilterBar.jsx

const FILTERS = ['All', 'Active', 'Inactive', 'Pending']

export default function BranchFilterBar({ active, onChange, total, showing }) {
  return (
    <div className="col-span-12 bg-surface-container-lowest rounded-xl p-6 flex flex-wrap items-center justify-between gap-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Status tabs */}
        <div className="flex bg-surface-container-low rounded-xl p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => onChange(f)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all
                ${active === f
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-outline-variant/30 hidden sm:block" />

        {/* <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container rounded-lg text-sm font-semibold transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>filter_list</span>
          More Filters
        </button> */}
      </div>

      <p className="text-sm font-label text-on-surface-variant">
        Showing <span className="font-bold text-on-surface">{showing}</span> of {total} Branches
      </p>
    </div>
  )
}
