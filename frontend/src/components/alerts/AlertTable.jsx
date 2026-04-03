// src/components/alerts/AlertTable.jsx

const typeConfig = {
  Inventory: { icon: 'inventory_2' },
  Anomaly:   { icon: 'warning' },
  Sales:     { icon: 'point_of_sale' },
  Security:  { icon: 'lock' },
}

function SeverityDot({ severity }) {
  const cfg = {
    High:   { dot: 'bg-tertiary animate-pulse', text: 'text-tertiary' },
    Medium: { dot: 'bg-orange-500',             text: 'text-orange-600' },
    Low:    { dot: 'bg-green-500',              text: 'text-green-600' },
  }[severity] || { dot: 'bg-slate-400', text: 'text-slate-600' }

  return (
    <div className={`flex items-center gap-2 ${cfg.text}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
      <span className="font-bold text-xs">{severity}</span>
    </div>
  )
}

function StatusChip({ status }) {
  if (status === 'Resolved') {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-700 font-bold text-xs">
        <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        Resolved
      </span>
    )
  }
  const isHigh = status === 'Unresolved-High'
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold text-xs italic
      ${isHigh ? 'text-on-tertiary-fixed-variant' : 'text-on-surface-variant/60'}`}>
      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
        {isHigh ? 'error' : 'pending'}
      </span>
      Unresolved
    </span>
  )
}

export default function AlertTable({ rows, onResolve, currentPage, totalPages, onPageChange, total }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low/50">
              {['Alert Type', 'Branch Name', 'Message', 'Severity', 'Status', 'Created Time', 'Actions'].map((col, i) => (
                <th
                  key={col}
                  className={`px-${i === 0 || i === 6 ? '8' : '6'} py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60
                    ${i === 6 ? 'text-right' : ''} ${i === 2 ? 'w-1/3' : ''}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {rows.map((alert) => {
              const resolved   = alert.status === 'Resolved'
              const isHigh     = alert.severity === 'High'
              const icon       = typeConfig[alert.type]?.icon || 'notifications'
              const rowHover   = isHigh && !resolved ? 'hover:bg-tertiary/5' : 'hover:bg-surface-container-low'

              return (
                <tr key={alert.id} className={`transition-colors group ${rowHover} ${resolved ? 'opacity-75' : ''}`}>
                  {/* Type */}
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-extrabold uppercase tracking-tighter flex items-center gap-1.5 w-max">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{icon}</span>
                      {alert.type}
                    </span>
                  </td>
                  {/* Branch */}
                  <td className="px-6 py-6 font-semibold text-on-surface text-sm">{alert.branch}</td>
                  {/* Message */}
                  <td className="px-6 py-6 text-sm">
                    <span className="block text-on-surface font-medium">{alert.title}</span>
                    <span className="text-xs text-on-surface-variant/70 mt-1 block leading-relaxed">{alert.body}</span>
                  </td>
                  {/* Severity */}
                  <td className="px-6 py-6"><SeverityDot severity={alert.severity} /></td>
                  {/* Status */}
                  <td className="px-6 py-6">
                    <StatusChip status={resolved ? 'Resolved' : isHigh ? 'Unresolved-High' : 'Unresolved'} />
                  </td>
                  {/* Time */}
                  <td className="px-6 py-6 text-xs text-on-surface-variant font-medium">{alert.time}</td>
                  {/* Action */}
                  <td className="px-8 py-6 text-right">
                    {resolved ? (
                      <button className="px-4 py-2 text-on-surface-variant text-xs font-bold rounded-lg opacity-50 cursor-not-allowed">
                        Resolved
                      </button>
                    ) : (
                      <button
                        onClick={() => onResolve(alert.id)}
                        className={`px-4 py-2 text-xs font-bold rounded-lg hover:shadow-md active:scale-95 transition-all
                          ${isHigh
                            ? 'bg-primary text-white'
                            : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
                      >
                        Resolve Alert
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-4 bg-surface-container-low/30 flex items-center justify-between border-t border-surface-container-low">
        <span className="text-xs text-on-surface-variant font-medium">
          Showing {rows.length} of {total} active system alerts
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 hover:bg-white rounded-lg transition-all text-on-surface-variant disabled:opacity-30"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_left</span>
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors
                  ${p === currentPage ? 'bg-primary text-white' : 'hover:bg-white text-on-surface-variant'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-white rounded-lg transition-all text-on-surface-variant disabled:opacity-30"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
