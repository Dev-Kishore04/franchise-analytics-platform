// src/components/dashboard/RecentAlertsPanel.jsx

const typeIcon = {
  inventory: 'inventory_2',
  low_stock: 'inventory_2',
  sales:     'trending_down',
  anomaly:   'warning',
  security:  'lock',
}

export default function RecentAlertsPanel({ alerts = [] }) {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3">
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Recent Alerts</h4>
          {alerts.length > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-error text-white text-[10px] font-bold rounded-full">
              {Math.min(alerts.length, 9)}
            </span>
          )}
        </div>

        {alerts.length === 0 ? (
          <p className="text-xs text-on-surface-variant text-center py-4">No active alerts.</p>
        ) : (
          <div className="space-y-1">
            {alerts.map((a) => {
              const iconKey = a.alertType?.toLowerCase().replace('_', '') || 'anomaly'
              const icon = typeIcon[iconKey] || 'notifications'
              const isHigh = a.severity?.toUpperCase() === 'HIGH'
              return (
                <div key={a.id} className="alert-item">
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${isHigh ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{a.title || a.message}</p>
                    <p className="text-[10px] text-on-surface-variant">
                      {a.branchName} • {a.severity}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <a href="/alerts" className="mt-auto w-full py-2.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all text-center block">
          View All Alerts
        </a>
      </div>
    </div>
  )
}
