// src/components/users/CreateUserModal.jsx
import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import { branchApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

const ROLES = [
  { id: 1, label: 'Admin' },
  { id: 2, label: 'Manager' },
  { id: 3, label: 'Staff' },
]

export default function CreateUserModal({ open, onClose, onConfirm }) {

  const { user } = useAuth()
  const isManager = user?.role === "ROLEMANAGER"

  const [branches, setBranches] = useState([])
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await branchApi.getAll()
        setBranches(data)
      } catch (err) {
      }
    }
    fetchBranches()
  }, [])

  const [form, setForm] = useState({
    name:     '',
    email:    '',
    password: '',
    phone:    '',
    jobTitle: '',
    roleId:   3,       // default Staff
    branchId: isManager ? user.branchId : null,
    status:   'ACTIVE',
  })

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async () => {
     try {
        await onConfirm?.({
        ...form,
        roleId: Number(form.roleId),
        branchId: form.branchId ? Number(form.branchId) : null,
        })

        setForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        jobTitle: '',
        roleId: 3,
        branchId: null,
        status: 'ACTIVE',
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
      title="Add New Staff Member"
      subtitle="Fill in the details to register a new user into the system."
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
            Confirm &amp; Create
          </button>
        </>
      }
    >
      
      <div className="grid grid-cols-2 gap-6">

        {/* Full Name */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="e.g. John Smith"
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Email */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="e.g. john@example.com"
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Password */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Set initial password"
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Phone */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Phone Number
          </label>
          <input
            type="text"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder="e.g. 9344327993"
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Job Title */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={form.jobTitle}
            onChange={handleChange('jobTitle')}
            placeholder="e.g. Store Manager"
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Branch */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Branch Assignment
          </label>
          <select
            value={form.branchId ?? ''}
            disabled={isManager}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                branchId: e.target.value ? Number(e.target.value) : null
              }))
            }
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
          >
            <option value="">Unassigned</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div className="col-span-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Role
          </label>
          <div className="flex gap-4">
            {!isManager && ROLES.map((r) => {
              const selected = Number(form.roleId) === r.id
              return (
                <label
                  key={r.id}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors
                    ${selected
                      ? 'border-primary/20 bg-primary/5'
                      : 'border-transparent bg-surface-container-low hover:bg-surface-container'
                    }`}
                >
                  <input
                    type="radio"
                    name="roleId"
                    value={r.id}
                    checked={selected}
                    onChange={handleChange('roleId')}
                    className="text-primary focus:ring-0"
                  />
                  <span className={`text-sm font-bold ${selected ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {r.label}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Status */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Initial Status
          </label>
          <div className="flex gap-4">
            {['ACTIVE', 'INACTIVE'].map((s) => {
              const selected = form.status === s
              return (
                <label
                  key={s}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors
                    ${selected
                      ? 'border-primary/20 bg-primary/5'
                      : 'border-transparent bg-surface-container-low hover:bg-surface-container'
                    }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={selected}
                    onChange={handleChange('status')}
                    className="text-primary focus:ring-0"
                  />
                  <span className={`text-sm font-bold ${selected ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

      </div>

      {/* Info banner */}
      <div className="p-4 bg-tertiary-container/5 rounded-xl border border-tertiary/5 flex gap-4">
        <span className="material-symbols-outlined text-tertiary shrink-0">info</span>
        <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed">
          The user will be able to log in immediately after creation using the credentials provided.
          Role and branch assignment can be updated later from the staff management page.
        </p>
      </div>
    </Modal>
  )
}