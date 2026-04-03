// src/pages/Products.jsx
import { useState, useMemo, useRef,useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import { productApi } from '@/lib/api'
import ProductFilterBar from '@/components/products/ProductFilterBar'
import ProductTable from '@/components/products/ProductTable'
import ProductSidebar from '@/components/products/ProductSidebar'
import CreateProduct from '@/components/products/CreateProduct'
import EditProduct from '@/components/products/EditProduct'
import DeleteProduct from '@/components/products/DeleteProduct'
import { useOutletContext } from "react-router-dom"
import { useAuth } from '@/context/AuthContext'

const PAGE_SIZE = 5

export default function Products() {
  const { data: products, loading, refetch } = useApi(productApi.getAll)
  const [activeCategory, setActiveCategory] = useState('All Items')
  const [currentPage, setCurrentPage]       = useState(1)
  const [openCreate, setOpenCreate] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [sort, setSort] = useState("priceAsc")
  const { searchQuery } = useOutletContext()
  const tableRef = useRef(null)
  const {user}= useAuth()
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

  const list = (products || []).map(p => ({
    id:          p.id,
    name:        p.name,
    sku:         p.sku || '—',
    category:    p.category,
    price:       `₹${Number(p.price).toFixed(2)}`,
    status:      p.status || 'Available',
    description: p.description || '',
    imageUrl:    p.imageUrl || null,
  }))

  const filtered = useMemo(() => {

    let data = activeCategory === 'All Items'
      ? list
      : list.filter(p => p.category === activeCategory)

    if (!searchQuery) return data

    const q = searchQuery.toLowerCase()

    return data.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
    )

  }, [list, activeCategory, searchQuery])

  const sorted = useMemo(() => {
  return [...filtered].sort((a, b) => {

    const priceA = Number(String(a.price).replace(/[^\d.]/g, ""))
    const priceB = Number(String(b.price).replace(/[^\d.]/g, ""))

    if (sort === "priceAsc") return priceA - priceB
    if (sort === "priceDesc") return priceB - priceA
    if (sort === "nameAsc") return a.name.localeCompare(b.name)
    if (sort === "nameDesc") return b.name.localeCompare(a.name)

    return 0
  })
}, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  
  return (
    <div className="p-14 max-w-[1600px] mx-auto space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
            Product Catalog
          </h2>
          <p className="text-on-surface-variant mt-2 font-body max-w-md">
            Manage your franchise-wide menu and product offerings with intelligent inventory tracking.
          </p>
        </div>
        <button disabled={user?.role === "ROLEMANAGER"} onClick={()=>setOpenCreate(true)} className="btn-primary gap-3 px-8 py-3.5">
          <span className="material-symbols-outlined">add_box</span>
          Add Product
        </button>
      </div>

      <ProductFilterBar
        activeCategory={activeCategory}
        onChange={(c) => { setActiveCategory(c); setCurrentPage(1) }}
        sort={sort}
        setSort={setSort}
      />

      <div ref={tableRef}>
        {loading ? (
        <div className="flex items-center justify-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin mr-3">sync</span>Loading products…
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-8">
          <ProductTable
            rows={pageRows}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
            total={filtered.length}
            onDelete={(product)=>setDeletingProduct(product)}
            onEdit={(product)=>setEditingProduct(product)}
          />
          <ProductSidebar productData={filtered}/>
          <CreateProduct
            open={openCreate}
            onClose={() => setOpenCreate(false)}
            onCreated={refetch}
          />
          <EditProduct
          open={!!editingProduct}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdated={refetch}
          />
          <DeleteProduct
          open={!!deletingProduct}
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onDeleted={refetch}
          />
        </div>
        
      )}
      </div>
      
    </div>
  )
}
