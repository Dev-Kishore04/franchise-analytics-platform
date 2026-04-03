// src/components/branches/BranchTable.jsx
import StatusBadge from '@/components/ui/StatusBadge'
import { useEffect, useState } from 'react'
import { analyticsApi, branchApi } from '@/lib/api'
import { useCurrency } from '@/utils/currency'

const avatarColors = {
  'primary-fixed':        { bg: 'bg-primary-fixed',        text: 'text-on-primary-fixed' },
  'secondary-fixed':      { bg: 'bg-secondary-fixed',      text: 'text-on-secondary-fixed' },
  'outline-variant':      { bg: 'bg-outline-variant',      text: 'text-on-surface-variant' },
  'surface-container':    { bg: 'bg-surface-container',    text: 'text-on-surface' },
}

function AvatarInitials({ initials, colorKey = 'primary-fixed' }) {
  const cfg = avatarColors[colorKey] || avatarColors['primary-fixed']
  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-headline font-bold text-sm ${cfg.bg} ${cfg.text}`}>
      {initials}
    </div>
  )
}

function ManagerAvatar({ name }) {
  return (
    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 overflow-hidden">
      {name.split(' ').map((n) => n[0]).join('')}
    </div>
  )
}

function RowActions({ status, onEdit }) {
  return (
    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="p-2 hover:bg-primary/5 text-primary rounded-lg" title="View">
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
      </button>
      <button
        onClick={onEdit}
        className="p-2 hover:bg-on-surface-variant/5 text-on-surface-variant rounded-lg"
        title="Edit"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
      </button>
      {status === 'Inactive' ? (
        <button className="p-2 hover:bg-primary/5 text-primary rounded-lg" title="Activate">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
        </button>
      ) : (
        <button className="p-2 hover:bg-error/5 text-error rounded-lg" title="Deactivate">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>block</span>
        </button>
      )}
    </div>
  )
}

export default function BranchTable({ rows, currentPage, totalPages, onPageChange, onEditClick }) {

  const [revenue, setRevenue] = useState([])
  const {format}=useCurrency()
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const data = await analyticsApi.getRevenue()
        setRevenue(data)
      } catch (err) {
      }
    }
    fetchRevenue()
  }, [])

  return (
    <div className="col-span-12 overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
            {['Branch Name', 'Location', 'Manager', 'Status', 'Revenue (30d)', 'Actions'].map((col, i) => (
              <th
                key={col}
                className={`px-8 py-5 text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/70 font-label ${
                  i >= 4 ? 'text-center' : ''
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant/5">
          {rows.map((branch) => {
            const branchRevenue = revenue.find((r) => r.branchId === branch.id)
            return (
              <tr key={branch.id} className="hover:bg-surface-container-low/30 transition-colors group">
                {/* Branch Name */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <AvatarInitials initials={branch.initials} colorKey={branch.colorKey} />
                    <div>
                      <p className="font-headline font-bold text-on-surface">{branch.name}</p>
                      <p className="text-xs text-on-surface-variant">ID: {branch.id}</p>
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
                    <p className="text-sm font-medium">{branch.city}</p>
                  </div>
                </td>

                {/* Manager */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <ManagerAvatar name={branch.manager} />
                    <p className="text-sm font-semibold text-on-surface">{branch.manager}</p>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-6">
                  <StatusBadge status={branch.status} />
                </td>

                {/* Revenue */}
                <td className="px-6 py-6 text-right font-headline font-bold text-on-surface">
                  {format(branchRevenue?.revenue ?? 0)}
                </td>

                {/* Actions */}
                <td className="px-4 py-6 text-right">
                  <RowActions
                    status={branch.status}
                    onEdit={() => onEditClick?.(branch)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-8 py-4 bg-surface-container-low/30 border-t border-outline-variant/5 flex items-center justify-between">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
          Previous
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                p === currentPage ? 'bg-primary text-white' : 'hover:bg-surface-container text-on-surface-variant'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
        </button>
      </div>
    </div>
  )
}