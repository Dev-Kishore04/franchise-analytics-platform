// src/components/branches/EditBranchModal.jsx
import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import { userApi } from '@/lib/api'

export default function EditBranchModal({ open, onClose, onConfirm, branch }) {

  const [managers, setManagers] = useState([])
  useEffect(() => {
    const fetchManager = async () => {
      try {
        const data = await userApi.getsorted("MANAGER")
        setManagers(data)
      } catch (err) {
      }
    }
    fetchManager()
  }, [])

  const [form, setForm] = useState({
    name:      '',
    managerId: null,
    address:   '',
    status:    'Pending',
  })

  useEffect(() => {
    if (!branch) return

    const matched = managers.find((m) => m.name === branch.manager)

    setForm({
      name: branch.name ?? '',
      managerId: matched?.id ?? null,
      address: branch.city ?? '',
      status: branch.status ?? 'Pending',
    })
  }, [branch, managers]) // re-run when managers load too

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async () => {
    await onConfirm?.(branch.id, form)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Branch"
      subtitle="Update the operational parameters for this franchise location."
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
        {/* Branch Name */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Branch Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="e.g. Skyline Plaza"
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Manager Assignment */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Manager Assignment
          </label>
          <select
            value={form.managerId ?? ''}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, managerId: e.target.value ? Number(e.target.value) : null }))
            }
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
          >
            <option value="">Unassigned</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Full Address */}
        <div className="col-span-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Full Address
          </label>
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant"
              style={{ fontSize: '20px' }}
            >
              map
            </span>
            <textarea
              value={form.address}
              onChange={handleChange('address')}
              placeholder="Street Address, City, State, ZIP"
              rows={3}
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* Status */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Status
          </label>
          <div className="flex gap-4">
            {['Pending', 'Active'].map((s) => {
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
                    {s}
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
          Changes will be reflected immediately across the system. Regional tax settings
          can be adjusted separately from the branch settings page.
        </p>
      </div>
    </Modal>
  )
}