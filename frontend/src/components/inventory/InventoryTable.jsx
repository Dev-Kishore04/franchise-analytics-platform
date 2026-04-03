// src/components/inventory/InventoryTable.jsx

const statusConfig = {
  Normal:  { row: '',                        badge: 'bg-emerald-100 text-emerald-700',          icon: 'bg-slate-100',       iconColor: 'text-slate-400'  },
  Warning: { row: 'bg-amber-50/20',          badge: 'bg-amber-100 text-amber-700',              icon: 'bg-amber-100',       iconColor: 'text-amber-600'  },
  Danger:  { row: 'bg-tertiary-container/5', badge: 'bg-tertiary-container text-on-tertiary-container', icon: 'bg-tertiary/10', iconColor: 'text-tertiary' },
}

function StockBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Normal
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.badge}`}>
      {status}
    </span>
  )
}

export default function InventoryTable({ rows, currentPage,totalPages, total, onPageChange, onUpdateStock }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      {/* Table header */}
      <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 font-headline">Live Stock Status</h3>
        <div className="flex gap-3">
          {[
            { color: 'bg-emerald-500', label: 'Normal' },
            { color: 'bg-amber-500',   label: 'Warning' },
            { color: 'bg-tertiary',    label: 'Critical' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
              <span className={`w-2 h-2 rounded-full ${color}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              {['Product Name', 'Stock Quantity', 'Threshold', 'Status', 'Actions'].map((col, i) => (
                <th
                  key={col}
                  className={`px-8 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ${i === 4 ? 'text-right' : ''}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((item) => {
              const cfg = statusConfig[item.status] || statusConfig.Normal
              const qtyColor = item.status === 'Warning' ? 'text-amber-700 font-bold'
                             : item.status === 'Danger'  ? 'text-tertiary font-bold'
                             : 'text-on-surface font-medium'
              return (
                <tr key={item.sku} className={`hover:bg-slate-50/80 transition-colors group ${cfg.row}`}>
                  {/* Product */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cfg.icon}`}>
                        <span className={`material-symbols-outlined ${cfg.iconColor}`} style={{ fontSize: '20px' }}>
                          {item.icon}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-slate-400">SKU: {item.sku}</p>
                      </div>
                    </div>
                  </td>
                  {/* Quantity */}
                  <td className={`px-8 py-5 text-sm ${qtyColor}`}>{item.quantity} Units</td>
                  {/* Threshold */}
                  <td className="px-8 py-5 text-sm text-slate-500">{item.threshold}</td>
                  {/* Status */}
                  <td className="px-8 py-5"><StockBadge status={item.status} /></td>
                  {/* Actions */}
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => onUpdateStock(item)}
                      className="text-primary hover:text-primary-container text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="px-8 py-4 bg-slate-50/30 flex items-center justify-between text-xs text-slate-500 font-medium">
        <p>Showing {rows.length} of {total} products</p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 hover:bg-slate-200 rounded transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors
                ${p === currentPage ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1.5 hover:bg-slate-200 rounded transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
