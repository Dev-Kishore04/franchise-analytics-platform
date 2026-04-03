// src/components/staff/StaffTable.jsx

import { useMemo } from "react"

const roleBadgeConfig = {
  'Branch Manager': 'bg-secondary-container text-on-secondary-fixed-variant',
  Admin:            'bg-primary/10 text-primary',
  Staff:            'bg-surface-container-highest text-on-surface-variant',
}

function RoleBadge({ role }) {
  const cls = roleBadgeConfig[role] || roleBadgeConfig.Staff
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${cls}`}>
      {role}
    </span>
  )
}

function StatusIndicator({ status }) {
  const active = status === 'Active'
  return (
    <div className={`flex items-center gap-1.5 ${active ? 'text-green-600' : 'text-on-surface-variant/60'}`}>
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
      >
        fiber_manual_record
      </span>
      <span className="text-xs font-bold uppercase tracking-tight">{status}</span>
    </div>
  )
}

function AvatarInitials({ name, inactive }) {
  const initials = name.split(' ').map((n) => n[0]).join('')
  return (
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold bg-surface-container-high text-on-surface-variant ${inactive ? 'opacity-60' : ''}`}>
      {initials}
    </div>
  )
}

export default function StaffTable({ rows, currentPage, totalPages, onPageChange, branchLabel, onEdit,onSuspend ,onRestore }) {

  

  return (
    <div className="col-span-12 lg:col-span-9 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              {['Name & Contact', 'Role', 'Assigned Branch', 'Status', 'Actions'].map((col, i) => (
                <th
                  key={col}
                  className={`px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant font-headline ${i === 4 ? 'text-right' : ''}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {rows.map((user) => {
              const inactive = user.status === 'Inactive'
              return (
                <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <AvatarInitials name={user.name} inactive={inactive} />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${inactive ? 'bg-slate-300' : 'bg-green-500'}`} />
                      </div>
                      <div>
                        <p className={`font-bold font-body ${inactive ? 'text-on-surface/60' : 'text-on-surface'}`}>{user.name}</p>
                        <p className={`text-xs font-body ${inactive ? 'text-on-surface-variant/60' : 'text-on-surface-variant'}`}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5"><RoleBadge role={user.role} /></td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center gap-2 ${inactive ? 'opacity-60' : ''}`}>
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>location_on</span>
                      <p className="text-sm font-medium text-on-surface font-body">{user.branch}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5"><StatusIndicator status={user.status} /></td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={()=> onEdit(user)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all" title="Edit">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit_square</span>
                      </button>
                      {inactive ? (
                        <button onClick={()=>onRestore(user.id)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all" title="Restore">
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>restore_from_trash</span>
                        </button>
                      ) : (
                        <button onClick={()=>onSuspend(user.id)} className="p-2 hover:bg-error/10 text-error rounded-lg transition-all" title="Suspend">
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>block</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-surface-container-low/30 px-8 py-4 flex items-center justify-between border-t border-surface-container">
        <p className="text-xs font-medium text-on-surface-variant font-body">
          Showing {rows.length} of {rows.length} members in <span className="text-on-surface font-bold">{branchLabel}</span>
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors disabled:opacity-30">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
          </button>
          <span className="text-xs font-bold font-body bg-white px-3 py-1 rounded border border-surface-container shadow-sm">{currentPage}</span>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors disabled:opacity-30">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
