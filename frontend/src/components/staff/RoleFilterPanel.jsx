// src/components/staff/RoleFilterPanel.jsx

const ROLESADMIN = ['All Roles', 'ADMIN', 'MANAGER', 'STAFF']
const ROLESMANAGER = ['All Roles', 'MANAGER', 'STAFF']

export default function RoleFilterPanel({
  selectedRole,
  onRoleChange,
  activeCount,
  inactiveCount,
  selectedStatus,
  onStatusChange,
  isManager
}) {
  const ROLES = isManager ? ROLESMANAGER : ROLESADMIN
    return (
    <div className="bg-surface-container-low p-6 rounded-2xl">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">
        Role Filter
      </h3>

      <div className="space-y-2">
        {ROLES.map((role) => {
          const active = selectedRole === role
          return (
            <label
              key={role}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors
                ${active ? 'bg-surface-container-lowest' : 'hover:bg-surface-container-highest'}`}
            >
              <input
                type="radio"
                name="role"
                checked={active}
                onChange={() => onRoleChange(role)}
                className="w-4 h-4 text-primary focus:ring-primary border-outline-variant"
              />
              <span className="text-sm font-medium font-body">{role}</span>
            </label>
          )
        })}
      </div>

      {/* Status filter */}
      <div className="mt-8 pt-8 border-t border-outline-variant/20">
        <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-headline">
          Status
        </h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onStatusChange('Active')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors
              ${selectedStatus === 'Active' ? 'bg-surface-container-highest text-on-surface' : 'hover:bg-surface-container-highest text-on-surface-variant'}`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => onStatusChange('Inactive')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors
              ${selectedStatus === 'Inactive' ? 'bg-surface-container-highest text-on-surface' : 'hover:bg-surface-container-highest text-on-surface-variant'}`}
          >
            Inactive ({inactiveCount})
          </button>
        </div>
      </div>
    </div>
  )
}
