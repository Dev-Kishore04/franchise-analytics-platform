// src/pages/Staff.jsx
import { useState, useMemo, useEffect, useRef } from 'react'
import { useApi } from '@/hooks/useApi'
import { userApi } from '@/lib/api'
import RoleFilterPanel from '@/components/staff/RoleFilterPanel'
import AIPersonnelInsightCard from '@/components/staff/AIPersonnelInsightCard'
import StaffTable from '@/components/staff/StaffTable'
import CreateUserModal from '@/components/staff/CreateUserModal'
import EditUserModal from '@/components/staff/EditUserModal'
import { useOutletContext } from "react-router-dom"
import { useAuth } from '@/context/AuthContext'

export default function Staff() {
  const { data: users, loading, refetch } = useApi(userApi.getAll)
  const [selectedRole, setSelectedRole]     = useState('All Roles')
  const [selectedStatus, setSelectedStatus] = useState('Active')
  const [currentPage, setCurrentPage]       = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const { searchQuery } = useOutletContext()
  const { user } = useAuth()
  const isManager = user?.role === "ROLEMANAGER"

  const tableRef = useRef(null)
  // scroll when search bar clicked
  useEffect(() => {

    const handleSearchFocus = () => {
      tableRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }

    window.addEventListener("global-search-focus", handleSearchFocus)

    return () => {
      window.removeEventListener("global-search-focus", handleSearchFocus)
    }

  }, [])

  const handleCreateUser = async (form) => {
    try {
      await userApi.create(form)
      refetch()
    } catch (e) {
      console.error('Create user failed', e)
    }
  }

 
 const list = (users || [])
  .filter(u => {

    if (!isManager) return true

    return u.branchId === user.branchId
  })
  .map(u => ({
    id:      u.id,
    name:    u.name,
    email:   u.email,
    role:    u.role,
    branch:  u.branchName || '—',
    branchId: u.branchId,
    status: u.status?.toLowerCase() === 'active' ? 'Active' : 'Inactive',
    phone:   u.phone,
    jobTitle: u.jobTitle,
  }))
  

  const activeCount   = list.filter(s => s.status === 'Active').length
  const inactiveCount = list.filter(s => s.status === 'Inactive').length

  const filtered = useMemo(() => {

    let data = list.filter(s => {
      const roleMatch =
      selectedRole === 'All Roles'
        ? true
        : s.role === selectedRole
      const statusMatch = s.status === selectedStatus
      if (isManager && s.role === "ADMIN") return false
      return roleMatch && statusMatch
    })

    if (!searchQuery) return data

    const q = searchQuery.toLowerCase()

    return data.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.role?.toLowerCase().includes(q)
    )

  }, [list, selectedRole, selectedStatus, searchQuery])

  const PAGE_SIZE = 10
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, currentPage])

  const handleSuspend = async (id) => {
    try { await userApi.suspend(id); refetch() } catch (e) { console.error(e) }
  }

  const handleRestore = async (id) => {
    try { await userApi.restore(id); refetch() } catch (e) { console.error(e) }
  }

  const handleUpdateUser = async (id, form) => {
    try {
      await userApi.update(id, form)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])
  

  return (
    <div className="p-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
              Staff Directory
            </span>
          </div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">
            User / Staff Management
          </h2>
          <p className="text-on-surface-variant mt-2 max-w-2xl font-body">
            Manage organizational access, define granular roles, and monitor team activity across your franchise network.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary gap-2">
          <span className="material-symbols-outlined"  style={{ fontSize: '20px' }}>person_add</span>
          Add User
        </button>
        
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-3 space-y-8">
          <RoleFilterPanel
            selectedRole={selectedRole}
            isManager={isManager}
            onRoleChange={(r) => { setSelectedRole(r); setCurrentPage(1) }}
            activeCount={activeCount}
            inactiveCount={inactiveCount}
            selectedStatus={selectedStatus}
            onStatusChange={(s) => { setSelectedStatus(s); setCurrentPage(1) }}
          />
          <AIPersonnelInsightCard staffData={list} />
        </div>

        <div ref={tableRef} className="col-span-12 lg:col-span-9">
          {loading ? (
          <div className="col-span-9 flex items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin mr-3">sync</span>Loading staff…
          </div>
        ) : (
          <StaffTable
          rows={paginated}
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
          onPageChange={setCurrentPage}
          branchLabel="All Branches"
          onSuspend={handleSuspend}
          onRestore={handleRestore}
          onEdit={(user)=>setEditingUser(user)}
        />
        )}
        </div>
        <CreateUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleCreateUser}
        />
        <EditUserModal
        open={!!editingUser}
        users={editingUser}
        onClose={() => setEditingUser(null)}
        onConfirm={handleUpdateUser}
      />
      </div>
      
    </div>
  )
}
