// src/pages/POS.jsx
import { useState, useEffect, useMemo, useRef } from 'react'
import { useApi } from '@/hooks/useApi'
import { productApi, orderApi, branchApi } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import MenuGrid from '@/components/pos/MenuGrid'
import RecentOrders from '@/components/pos/RecentOrders'
import OrderCart from '@/components/pos/OrderCart'
import { inventoryApi } from '@/lib/api'
import { useOutletContext } from "react-router-dom"

export default function POS() {

  const { user } = useAuth()
  const { data: products } = useApi(productApi.getAll)
  const { data: branches } = useApi(branchApi.getAll)

  const { searchQuery } = useOutletContext()

  const menuRef = useRef(null)

  const [cartItems, setCartItems] = useState([])
  const [inventory, setInventory] = useState([])
  const [activeCategory, setActiveCategory] = useState('All Items')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [selectedBranchId, setSelectedBranchId] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [orderSuccess, setOrderSuccess] = useState(null)

  const branchList = branches || []

  // scroll when search focused
  useEffect(() => {

    const handleSearchFocus = () => {
      menuRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }

    window.addEventListener("global-search-focus", handleSearchFocus)

    return () => {
      window.removeEventListener("global-search-focus", handleSearchFocus)
    }

  }, [])

  // load inventory
  useEffect(() => {

    if (!selectedBranchId) return

    inventoryApi
      .getByBranch(selectedBranchId)
      .then(setInventory)
      .catch(() => setInventory([]))

  }, [selectedBranchId])

  // set default branch
  useEffect(() => {

    if (!branchList.length) return

    // manager → lock branch
    if (user?.role === "ROLEMANAGER" && user?.branchId) {
      setSelectedBranchId(user.branchId)
      return
    }

    // admin → first branch
    if (!selectedBranchId) {
      setSelectedBranchId(branchList[0].id)
    }

  }, [branchList, selectedBranchId, user])

  // load recent orders
  useEffect(() => {

    if (!selectedBranchId) return

    orderApi.getRecentByBranch(selectedBranchId)
      .then(setRecentOrders)
      .catch(() => setRecentOrders([]))

  }, [selectedBranchId])

  // build menu items
  const menuItems = useMemo(() => {

    const base = (products || []).map(p => {

      const inv = inventory.find(i => i.productId === p.id)
      const stock = inv?.stockQuantity ?? 0

      return {
        id: p.id,
        name: p.name,
        price: p.price,
        desc: p.description || p.category,
        category: p.category,
        imageUrl: p.imageUrl,
        stock,
        tag: stock === 0 ? "OUT OF STOCK" : null,
        tagColor: "bg-error text-white"
      }
    })

    if (!searchQuery) return base

    const q = searchQuery.toLowerCase()

    return base.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.desc.toLowerCase().includes(q)
    )

  }, [products, inventory, searchQuery])

  const addToCart = (item) => {

    if (item.stock === 0) return

    setCartItems(prev => {

      const existing = prev.find(i => i.id === item.id)

      if (existing)
        return prev.map(i =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )

      return [...prev, { ...item, qty: 1, emoji: '🍽️' }]

    })

  }

  const completeOrder = async () => {

    if (!cartItems.length || !selectedBranchId) return

    try {

      const payload = {
        branchId: selectedBranchId,
        staffId: 1,
        paymentMethod: paymentMethod.toUpperCase(),
        items: cartItems.map(i => ({
          productId: i.id,
          quantity: i.qty
        })),
      }

      const order = await orderApi.create(payload)

      setOrderSuccess(order)
      setCartItems([])

      const fresh = await orderApi.getRecentByBranch(selectedBranchId)
      setRecentOrders(fresh)

    } catch (e) {

      console.error('Order failed', e)
      alert('Order failed: ' + (e?.response?.data?.message || e.message))

    }

  }

  return (
    <div className="ml-0 h-[calc(100vh-4rem)] bg-surface-container-low overflow-hidden">

      <div className="grid grid-cols-12 gap-8 h-full p-8">

        <div className="col-span-8 flex flex-col gap-0 overflow-y-auto no-scrollbar">

          {/* branch selector */}

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Branch:
            </span>

            <select
              value={selectedBranchId || ''}
              disabled={user?.role === "ROLEMANAGER"}
              onChange={e => setSelectedBranchId(Number(e.target.value))}
              className="bg-surface-container-lowest border-none rounded-lg text-sm font-medium px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {branchList.map(b =>
                <option key={b.id} value={b.id}>{b.name}</option>
              )}
            </select>
          </div>

          {/* MENU SECTION (scroll target) */}

          <div ref={menuRef}>

            <MenuGrid
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddToCart={addToCart}
              menuItems={menuItems}
            />

          </div>

          <RecentOrders orders={recentOrders} />

        </div>

        <div className="col-span-4 h-full overflow-y-auto">

          <OrderCart
            items={cartItems}
            onIncrement={id =>
              setCartItems(prev =>
                prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)
              )
            }
            onDecrement={id =>
              setCartItems(prev =>
                prev
                  .map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
                  .filter(i => i.qty > 0)
              )
            }
            onClear={() => setCartItems([])}
            paymentMethod={paymentMethod}
            onPaymentChange={setPaymentMethod}
            onCompleteOrder={completeOrder}
          />

        </div>

      </div>

    </div>
  )
}