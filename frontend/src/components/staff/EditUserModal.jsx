// src/components/users/EditUserModal.jsx
import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import { branchApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

const ROLES = [
  { id: 1, label: 'Admin' },
  { id: 2, label: 'Manager' },
  { id: 3, label: 'Staff' },
]

export default function EditUserModal({ open, onClose, users, onConfirm }) {

  const { user } = useAuth()
  const isManager = user?.role === "ROLEMANAGER"
  const [branches, setBranches] = useState([])

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    jobTitle: '',
    roleId: 3,
    branchId: null,
    status: 'ACTIVE',
  })

  // load branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await branchApi.getAll()
        setBranches(data)
      } catch (err) {
        console.error('Failed to load branches', err)
      }
    }
    fetchBranches()
  }, [])

  // populate form when editing
  useEffect(() => {
    if (!users) return

    setForm({
      name: users.name || '',
      email: users.email || '',
      password: '',
      phone: users.phone || '',
      jobTitle: users.jobTitle || '',
      roleId: users.roleId || 3,
      branchId: users.branchId ?? null,
      status: users.status || 'ACTIVE',
    })
  }, [users])

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async () => {
    try {
      await onConfirm?.(users.id, {
        ...form,
        roleId: Number(form.roleId),
        branchId: form.branchId ? Number(form.branchId) : null,
      })

      onClose()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Staff Member"
      subtitle="Update users details and permissions."
      footer={
        <>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary px-8 py-2.5"
          >
            Save Changes
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-6">

        {/* Name */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">
            Full Name
          </label>
          <input
            value={form.name}
            onChange={handleChange('name')}
            className="w-full bg-surface-container-low rounded-lg px-4 py-3"
          />
        </div>

        {/* Email */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">
            Email
          </label>
          <input
            value={form.email}
            onChange={handleChange('email')}
            className="w-full bg-surface-container-low rounded-lg px-4 py-3"
          />
        </div>

        {/* Phone */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">
            Phone
          </label>
          <input
            value={form.phone}
            onChange={handleChange('phone')}
            className="w-full bg-surface-container-low rounded-lg px-4 py-3"
          />
        </div>

        {/* Job Title */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">
            Job Title
          </label>
          <input
            value={form.jobTitle}
            onChange={handleChange('jobTitle')}
            className="w-full bg-surface-container-low rounded-lg px-4 py-3"
          />
        </div>

        {/* Branch */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">
            Branch
          </label>
          <select
            disabled={isManager}
            value={form.branchId ?? ''}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                branchId: e.target.value ? Number(e.target.value) : null
              }))
            }
            className="w-full bg-surface-container-low rounded-lg px-4 py-3"
          >
            <option value="">Unassigned</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div className="col-span-2">
          <label className="block text-xs font-bold uppercase tracking-widest mb-2">
            Role
          </label>

          <div className="flex gap-4">
            {!isManager && ROLES.map((r) => {
              const selected = Number(form.roleId) === r.id

              return (
                <label
                  key={r.id}
                  className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer
                  ${selected ? 'border-primary/20 bg-primary/5' : 'bg-surface-container-low'}`}
                >
                  <input
                    type="radio"
                    name="roleId"
                    value={r.id}
                    checked={selected}
                    onChange={handleChange('roleId')}
                    className="hidden"
                  />
                  {r.label}
                </label>
              )
            })}
          </div>
        </div>

      </div>
    </Modal>
  )
}