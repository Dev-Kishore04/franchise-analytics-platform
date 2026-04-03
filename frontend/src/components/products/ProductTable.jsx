// src/components/products/ProductTable.jsx

import { useAuth } from "../../context/AuthContext"

function ProductStatusBadge({ status }) {

  const cfg = {
    Available:    'bg-emerald-100 text-emerald-700',
    'Out of Stock': 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    Discontinued: 'bg-surface-container-highest text-on-surface-variant',
  }[status] || 'bg-surface-container-highest text-on-surface-variant'

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg}`}>
      {status}
    </span>
  )
}

function ProductAvatar({ name, sku }) {
  const colors = ['bg-blue-100', 'bg-amber-100', 'bg-emerald-100', 'bg-purple-100', 'bg-rose-100']
  const idx = sku.charCodeAt(0) % colors.length
  return (
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${colors[idx]} text-slate-600`}>
      {name[0]}
    </div>
  )
}

export default function ProductTable({ rows, currentPage, totalPages, onPageChange, total, onEdit,onDelete }) {
    const {user} = useAuth()
  return (
    <div className="col-span-12 lg:col-span-9 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-headline font-bold">Catalog List</h3>
        <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
          {total} Products Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-on-surface-variant text-[11px] font-label uppercase tracking-widest">
              <th className="px-4 pb-4 font-semibold">Product Details</th>
              <th className="px-4 pb-4 font-semibold">Category</th>
              <th className="px-4 pb-4 font-semibold text-right">Price</th>
              <th className="px-4 pb-4 font-semibold text-center">Status</th>
              <th className="px-4 pb-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.sku} className="group hover:bg-surface-container-low transition-colors rounded-xl">
                <td className="px-4 py-4 rounded-l-xl">
                  <div className="flex items-center gap-4">
                    <ProductAvatar name={product.name} sku={product.sku} />
                    <div>
                      <p className="font-bold text-on-surface text-sm">{product.name}</p>
                      <p className="text-[11px] text-on-surface-variant font-label">SKU: {product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-body text-on-surface-variant">{product.category}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-bold text-on-surface">{product.price}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <ProductStatusBadge status={product.status} />
                </td>
                <td className="px-4 py-4 text-right rounded-r-xl">
                  <div className="flex items-center justify-end gap-2">
                    <button disabled={user?.role === "ROLEMANAGER"} onClick={()=>onEdit(product)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </button>
                    <button disabled={user?.role === "ROLEMANAGER"} onClick={()=>onDelete(product)} className="p-2 text-on-surface-variant hover:text-error transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between pt-6 border-t border-surface-container">
        <span className="text-xs font-body text-on-surface-variant">
          Showing 1 to {rows.length} of {total} entries
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors
                ${p === currentPage ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
