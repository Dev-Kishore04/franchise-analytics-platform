// src/pages/Inventory.jsx
import { useState, useMemo, useEffect, useRef } from 'react'
import { useApi } from '@/hooks/useApi'
import { inventoryApi, branchApi, productApi } from '@/lib/api'
import InventoryStatsBar from '@/components/inventory/InventoryStatsBar'
import InventoryTable from '@/components/inventory/InventoryTable'
import UpdateStockModal from '@/components/inventory/UpdateStockModal'
import { useOutletContext } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"



const PAGE_SIZE = 5

function computeStatus(qty, threshold) {
  if (qty <= threshold * 0.25) return 'Danger'
  if (qty <= threshold)        return 'Warning'
  return 'Normal'
}

export default function Inventory() {
  const { data: branches } = useApi(branchApi.getAll)
  const { data: allProducts } = useApi(productApi.getAll)

  const [selectedBranchId, setSelectedBranchId] = useState(null)
  const [currentPage, setCurrentPage]            = useState(1)
  const [selectedItem, setSelectedItem]          = useState(null)
  const [modalOpen, setModalOpen]                = useState(false)
  const tableRef = useRef()
  const { searchQuery } = useOutletContext()
  const { user } = useAuth()


  const branchList = branches || []

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

  // Set default branch on load
  useEffect(() => {

    if (!branchList.length) return

    // Manager → lock to their branch
    if (user?.role === "ROLEMANAGER" && user?.branchId) {
      setSelectedBranchId(user.branchId)
      return
    }

    // Admin → default first branch
    if (!selectedBranchId) {
      setSelectedBranchId(branchList[0].id)
    }

  }, [branchList, selectedBranchId, user])

  const { data: rawInventory, loading, refetch } = useApi(
    () => selectedBranchId ? inventoryApi.getByBranch(selectedBranchId) : Promise.resolve([]),
    [selectedBranchId],
    !!selectedBranchId
  )

  // Enrich inventory with product info
  const productMap = useMemo(() => {
    const m = {}
    ;(allProducts || []).forEach(p => { m[p.id] = p })
    return m
  }, [allProducts])

  const inventory = useMemo(() => {

    const data = (rawInventory || []).map(item => {
      const product = productMap[item.productId] || {}

      return {
        id:        item.id,
        productId: item.productId,
        branchId:  item.branchId,
        name:      product.name || `Product #${item.productId}`,
        sku:       product.sku || '—',
        icon:      'inventory_2',
        quantity:  item.stockQuantity,
        threshold: item.lowStockThreshold,
        status:    computeStatus(item.stockQuantity, item.lowStockThreshold),
      }
    })

    if (!searchQuery) return data

    const q = searchQuery.toLowerCase()

    return data.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.sku.toLowerCase().includes(q) ||
      i.status.toLowerCase().includes(q)
    )

  }, [rawInventory, productMap, searchQuery])

  const lowStockCount = inventory.filter(i => i.status !== 'Normal').length
  const totalPages = Math.max(1, Math.ceil(inventory.length / PAGE_SIZE))

  const pageRows = useMemo(() => {
    return inventory.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    )
  }, [inventory, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleApply = async ({ product, type, quantity }) => {
    const qty = parseInt(quantity, 10)
    if (!qty) return
    const delta   = type.includes('+') ? qty : -qty
    const newQty  = Math.max(0, product.quantity + delta)
    try {
      await inventoryApi.update({
        branchId:         product.branchId,
        productId:        product.productId,
        stockQuantity:    newQty,
        lowStockThreshold: product.threshold,
      })
      refetch()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="pt-24 pb-16 px-14">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">
            Inventory Management
          </h2>
          <p className="text-on-surface-variant mt-2 font-body">
            Real-time stock monitoring across {branchList.length} active branches.
          </p>
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
              Branch Location
            </label>
            <select
              value={selectedBranchId || ''}
              disabled={user?.role === "ROLEMANAGER"}
              onChange={e => {
                setSelectedBranchId(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="bg-surface-container-lowest border-none rounded-lg text-sm font-medium px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-56"
            >
              {branchList.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest rounded-xl font-semibold">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>file_download</span>
            Export Report
          </button>
        </div>
      </div>

      <InventoryStatsBar
        totalValue={`$${inventory.reduce((s, i) => s + i.quantity, 0).toLocaleString()}`}
        lowStockCount={lowStockCount}
        inventoryData={inventory}
      />

      <div ref={tableRef}>
        {loading ? (
        <div className="flex items-center justify-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin mr-3">sync</span>Loading inventory…
        </div>
      ) : (
        <InventoryTable
          rows={pageRows}
          currentPage={currentPage}
          totalPages={totalPages  }
          total={inventory.length}
          onPageChange={setCurrentPage}
          onUpdateStock={(item) => { setSelectedItem(item); setModalOpen(true) }}
        />
      )}
      </div>

      <UpdateStockModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedItem}
        onApply={handleApply}
      />
    </div>
  )
}
