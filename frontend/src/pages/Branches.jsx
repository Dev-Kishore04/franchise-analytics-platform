// src/pages/Branches.jsx

import { useState, useMemo } from "react"
import { useApi } from "@/hooks/useApi"
import { branchApi, analyticsApi } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { useOutletContext } from "react-router-dom"

import BranchFilterBar from "@/components/branches/BranchFilterBar"
import BranchTable from "@/components/branches/BranchTable"
import AIOptimizationBanner from "@/components/branches/AIOptimizationBanner"
import CreateBranchModal from "@/components/branches/CreateBranchModal"
import EditBranchModal from "@/components/branches/EditBranchModal"

import KpiCard from "@/components/ui/KpiCard"
import { useCurrency } from "@/utils/currency"

const PAGE_SIZE = 5

export default function Branches() {

  const { user } = useAuth()
  const isManager = user?.role === "ROLEMANAGER"
  console.log(user)
  const { searchQuery } = useOutletContext()

  const { data: branches, loading, refetch } = useApi(branchApi.getAll)
  console.log(branches)
  const { data: branchInsight } = useApi(
    () => analyticsApi.getBranchInsight(user.branchId),
    { enabled: isManager && !!user?.branchId }
  )

  const { format } = useCurrency()

  const [filter, setFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)

  const list = branches || []

  const normalised = list.map((b) => ({
    ...b,
    id: b.id,
    initials: b.name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || "")
      .join(""),
    city: b.location || "—",
    manager: b.managerName || "Unassigned",
    status: b.status
      ? b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase()
      : "Pending",
  }))

  const managerBranch = normalised.find(b => b.id === user?.branchId)

  const filtered = useMemo(() => {

    let data =
      filter === "All"
        ? normalised
        : normalised.filter(b => b.status === filter)

    if (!searchQuery) return data

    const q = searchQuery.toLowerCase()

    return data.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.manager.toLowerCase().includes(q)
    )

  }, [normalised, filter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const pageRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  function fmt(n) {
    if (n == null) return "—"
    if (n >= 1_000_000) return format(n / 1_000_000) + "M"
    if (n >= 1_000) return format(n / 1_000) + "K"
    return format(n)
  }

  const kpiData = branchInsight
    ? [
        {
          icon: "payments",
          iconFilled: true,
          iconColor: "text-primary",
          iconBg: "bg-primary/5",
          label: "Branch Revenue",
          value: fmt(branchInsight.revenue),
          badge: `Rank #${branchInsight.rank}`,
          badgeStyle: "green",
          progressColor: "bg-primary",
          progressWidth: Math.min(
            (branchInsight.revenue / branchInsight.topBranchRevenue) * 100,
            100
          ),
        },
        {
          icon: "shopping_cart",
          iconFilled: true,
          iconColor: "text-secondary",
          iconBg: "bg-secondary/5",
          label: "Orders",
          value: branchInsight.orders?.toLocaleString(),
          badge: "Orders",
          badgeStyle: "blue",
          progressColor: "bg-secondary",
          progressWidth: Math.min(
            (branchInsight.orders / branchInsight.topBranchOrders) * 100,
            100
          ),
        },
        {
          icon: "receipt_long",
          iconFilled: true,
          iconColor: "text-tertiary",
          iconBg: "bg-tertiary-container/10",
          label: "Avg Order Value",
          value: fmt(branchInsight.avgOrderValue),
          badge: "AOV",
          badgeStyle: "slate",
          progressColor: "bg-tertiary-container",
          progressWidth: Math.min(
            (branchInsight.avgOrderValue /
              branchInsight.topBranchAOV) *
              100,
            100
          ),
        },
        {
          icon: "inventory_2",
          iconFilled: true,
          iconColor: "text-on-secondary-container",
          iconBg: "bg-on-secondary-container/10",
          label: "Product Diversity",
          value: branchInsight.productDiversity,
          badge: "Products",
          badgeStyle: "blue",
          progressColor: "bg-on-secondary-container",
          progressWidth: Math.min(
            (branchInsight.productDiversity /
              branchInsight.topBranchProductTypes) *
              100,
            100
          ),
        },
      ]
    : []

  const handleEditClick = (branch) => {
    setSelectedBranch(branch)
    setEditModalOpen(true)
  }

  const handleCreateBranch = async (form) => {
    try {
      await branchApi.create({
        name: form.name,
        location: form.address,
        status: form.status,
        managerId: form.managerId || null
      })

      refetch()

    } catch (err) {
      console.error(err)
    }
  }
    const handleEditBranch = async (id, form) => {
    try {
      await branchApi.update(id, form)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  return (

    <div className="px-14 py-10 pb-12">

      <div className="flex justify-between items-end mb-10">
        <div>

          <nav className="flex items-center gap-2 text-xs font-label text-on-surface-variant mb-4 tracking-wide">
            <span className="hover:text-primary cursor-pointer">Organization</span>
            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>chevron_right</span>
            <span className="text-on-surface font-semibold">
              {isManager ? "Branch Overview" : "Branch Management"}
            </span>
          </nav>

          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-2">
            {isManager ? "Your Branch" : "Regional Hubs"}
          </h2>

          <p className="font-body text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            {isManager
              ? "Monitor performance and operations of your assigned branch."
              : "Oversee and optimize your distributed franchise network with real-time operational transparency."
            }
          </p>

        </div>


        {!isManager && (
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary gap-3 px-8 py-3.5"
          >
            <span className="material-symbols-outlined">add</span>
            Create Branch
          </button>
        )}

      </div>

      {/* MANAGER VIEW */}
      {isManager && managerBranch && (

        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {kpiData.map(kpi => (
              <KpiCard key={kpi.label} {...kpi}/>
            ))}
          </div>

          {/* Branch Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-8 mb-10">

            <div className="flex items-start gap-6">

              <div className="w-16 h-16 rounded-xl bg-primary-fixed flex items-center justify-center text-white font-bold text-xl">
                {managerBranch.initials}
              </div>

              <div>

                <h3 className="text-2xl font-bold">
                  {managerBranch.name}
                </h3>

                <p className="text-on-surface-variant">
                  {managerBranch.city}
                </p>

                <div className="grid grid-cols-3 gap-40 mt-6">

                  <div>
                    <p className="text-sm text-on-surface-variant">Manager</p>
                    <p className="font-semibold">{managerBranch.manager}</p>
                  </div>

                  <div>
                    <p className="text-sm text-on-surface-variant">Status</p>
                    <p className="font-semibold">{managerBranch.status}</p>
                  </div>

                  <div>
                    <p className="text-sm text-on-surface-variant">Revenue</p>
                    <p className="font-semibold">{fmt(branchInsight?.revenue)}</p>
                  </div>

                </div>

              </div>

            </div>

          </div>

          <AIOptimizationBanner branchData={[branchInsight]} />

        </>

      )}

      {/* ADMIN VIEW */}
      {!isManager && (

        <>

          <BranchFilterBar
            active={filter}
            onChange={(f) => {
              setFilter(f)
              setCurrentPage(1)
            }}
            total={list.length}
            showing={filtered.length}
          />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              Loading branches…
            </div>
          ) : (
            <BranchTable
              rows={pageRows}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onEditClick={handleEditClick}
            />
          )}

        </>

      )}

      <CreateBranchModal
        open={modalOpen}
        onConfirm={handleCreateBranch}
        onClose={() => setModalOpen(false)}
      />

      <EditBranchModal
        open={editModalOpen}
        branch={selectedBranch}
        onClose={() => setEditModalOpen(false)}
        onConfirm={handleEditBranch}
      />

    </div>

  )
}