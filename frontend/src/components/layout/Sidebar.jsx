// src/components/layout/Sidebar.jsx

import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { branchApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import CreateBranchModal from '@/components/branches/CreateBranchModal'
import logo from '@/asset/Untitled-1.png'

const navItems = [

  { icon: 'dashboard', label: 'Dashboard', to: '/', fill: true, roles: ['ROLEADMIN'] },

  { icon: 'storefront', label: 'Branches', to: '/branches', roles: ['ROLEADMIN', "ROLEMANAGER"] },

  { icon: 'group', label: 'Staff', to: '/staff', roles: ['ROLEADMIN', "ROLEMANAGER"] },

  { icon: 'inventory_2', label: 'Products', to: '/products', roles: ['ROLEADMIN','ROLEMANAGER'] },

  { icon: 'inventory', label: 'Inventory', to: '/inventory', roles: ['ROLEADMIN','ROLEMANAGER','ROLESTAFF'] },

  { icon: 'point_of_sale', label: 'POS', to: '/pos', roles: ['ROLEADMIN','ROLEMANAGER','ROLESTAFF'] },

  { icon: 'analytics', label: 'Analytics', to: '/analytics', roles: ['ROLEADMIN'] },

  { icon: 'auto_awesome', label: 'AI Insights', to: '/ai-insights', roles: ['ROLEADMIN','ROLEMANAGER'] },

  { icon: 'notifications_active', label: 'Alerts', to: '/alerts', roles: ['ROLEADMIN','ROLEMANAGER','ROLESTAFF'] },

  { icon: 'settings', label: 'Settings', to: '/settings', roles: ['ROLEADMIN'] },
]

export default function Sidebar() {

  const { user } = useAuth()

  const [modalOpen, setModalOpen] = useState(false)

  const handleCreateBranch = async (form) => {
    try {
      await branchApi.create({
        name:      form.name,
        location:  form.address,
        status:    form.status,
        managerId: form.managerId,
      })
    } catch (e) {
      console.error('Create branch failed', e)
    }
  }

  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-xl  flex items-center justify-center shadow-lg">
            <img className='h-10 ' src={logo} alt="" />
          </div>
          <div>
            <h1 className="text-l font-bold text-slate-900 font-headline">
             Analytics Platfrom
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Franchise Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-hidden">

        {navItems
          .filter(item => item.roles.includes(user?.role))
          .map(({ icon, label, to, fill }) => {

            // 🔹 Dynamic path for AI Insights
            const path =
              to === '/ai-insights' && user?.role === 'ROLEMANAGER'
                ? `/ai-insights?branchId=${user.branchId}`
                : to

            return (
              <NavLink
                key={to}
                to={path}
                end={to === '/'}
                className={({ isActive }) =>
                  `sidebar-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span
                  className="material-symbols-outlined"
                  style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>

                <span>{label}</span>

              </NavLink>
            )
          })}

      </nav>

      {/* New Branch CTA (ADMIN ONLY) */}
      {user?.role === 'ROLEADMIN' && (
        <div className="mt-auto px-2 pt-4">
          <button onClick={() => setModalOpen(true)} className="btn-new-branch">
            <span className="material-symbols-outlined">add_circle</span>
            <span>New Branch</span>
          </button>
        </div>
      )}

      <CreateBranchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleCreateBranch}
      />

    </aside>
  )
}