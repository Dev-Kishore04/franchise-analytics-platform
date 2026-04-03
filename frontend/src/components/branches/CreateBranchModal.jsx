// src/components/branches/CreateBranchModal.jsx
import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import { userApi } from '@/lib/api'



export default function CreateBranchModal({ open, onClose, onConfirm }) {

  const [managers, setmanager] = useState([])
  useEffect(()=>{
    const fetchManager= async ()=>{
      try{
        const data  = await userApi.getunmanagers()
        setmanager(data)
      } catch(err){
      }
    }
    fetchManager()
  },[])

  const [form, setForm] = useState({
    name: '',
    managerId : null,
    address: '',
    status: 'Pending',
  })

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = () => {
    onConfirm?.(form)
    setForm({ name: '', managerId:null, address: '', status: 'Pending' })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Establish New Branch"
      subtitle="Initialize operational parameters for the new franchise location."
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
            value={form.managerId}
            onChange={handleChange('managerId')}
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

        {/* Initial Status */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Initial Status
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
          System will automatically initialize localized inventory logs and staff hierarchy upon
          creation. You can adjust tax regional settings in the Next Step.
        </p>
      </div>
    </Modal>
  )
}
