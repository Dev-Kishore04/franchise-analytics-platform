// src/components/inventory/UpdateStockModal.jsx
import { useState, useEffect,useRef } from 'react'
import Modal from '@/components/ui/Modal'

const statusIconColor = {
  Normal:  { bg: 'bg-slate-100',    icon: 'text-slate-400' },
  Warning: { bg: 'bg-amber-100',    icon: 'text-amber-600' },
  Danger:  { bg: 'bg-tertiary/10',  icon: 'text-tertiary'  },
}

export default function UpdateStockModal({ open, onClose, product, onApply }) {
  const [form, setForm] = useState({ type: 'Restock (+)', quantity: '', reason: '' })

  const quantityRef = useRef(null)
  // Reset form when product changes
  useEffect(() => {
    setForm({ type: 'Restock (+)', quantity: '', reason: '' })
    if (open) {
      setTimeout(() => {
        quantityRef.current?.focus()
      }, 0)
    }
  }, [product])

  if (!product) return null

  const cfg = statusIconColor[product.status] || statusIconColor.Normal

  const handleApply = (e) => {
    e?.preventDefault()
    onApply?.({ product, ...form })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Stock"
      subtitle="Adjusting inventory levels for selected item"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="btn-primary px-8 py-2.5"
          >
            Apply Update
          </button>
        </>
      }
    >
      <form onSubmit={handleApply}>
      <div className="space-y-6">
        {/* Product read-only card */}
        <div className="p-4 bg-surface-container-low rounded-xl flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${cfg.bg}`}>
            <span className={`material-symbols-outlined ${cfg.icon}`} style={{ fontSize: '22px' }}>
              {product.icon}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product</p>
            <p className="font-bold text-slate-900">{product.name}</p>
            <p className="text-xs text-slate-400">Current: {product.quantity} Units</p>
          </div>
        </div>

        {/* Adjustment fields */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
              Adjustment Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              className="w-full bg-surface-container-highest border-none rounded-lg text-sm font-medium py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option>Restock (+)</option>
              <option>Adjustment (-)</option>
              <option>Damage/Loss (-)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
              Quantity Change
            </label>
            <input
              type="number"
              min="0"
              ref={quantityRef}
              value={form.quantity}
              onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
              placeholder="0"
              className="w-full bg-surface-container-highest border-none rounded-lg text-sm font-medium py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
            Change Reason
          </label>
          <textarea
            value={form.reason}
            onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
            placeholder="Explain why the stock level is being adjusted..."
            rows={3}
            className="w-full bg-surface-container-highest border-none rounded-lg text-sm py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
      </div>
      </form>
    </Modal>
  )
}
