// src/pages/Alerts.jsx
import { useState, useMemo, useRef, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import { alertApi } from '@/lib/api'
import { useOutletContext } from "react-router-dom"

import AlertFilterBar from '@/components/alerts/AlertFilterBar'
import AlertTable from '@/components/alerts/AlertTable'
import RegionalHeatmap from '@/components/alerts/RegionalHeatmap'
import ResponseEfficiencyCard from '@/components/alerts/ResponseEfficiencyCard'
import { useAuth } from '@/context/AuthContext'

const PAGE_SIZE = 4

export default function Alerts() {

  const { data: rawAlerts, loading, refetch } = useApi(alertApi.getAll)

  const { searchQuery } = useOutletContext()
  const {user} = useAuth()

  

  const [activeTab, setActiveTab]           = useState('All Alerts')
  const [activeSeverity, setActiveSeverity] = useState(null)
  const [activeType, setActiveType]         = useState(null)
  const [currentPage, setCurrentPage]       = useState(1)

  const tableRef = useRef(null)
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

  // Normalise API data
  const alerts = (rawAlerts || [])
    .filter(a => {

      if(user?.role === "ROLEMANAGER"){
        return a.branchId === user.branchId
      }

      return true

    })
    .map(a => ({
    id:       a.id,
    type:     a.alertType
      ? a.alertType.charAt(0).toUpperCase() + a.alertType.slice(1).toLowerCase()
      : 'Unknown',
    branch:   a.branchName || 'Unknown',
    title:    a.title || a.message || 'Alert',
    body:     a.message || '',
    severity: a.severity
      ? a.severity.charAt(0).toUpperCase() + a.severity.slice(1).toLowerCase()
      : 'Low',
    status:   a.status === 'RESOLVED' ? 'Resolved' : 'Unresolved',
    time:     a.createdAt
      ? new Date(a.createdAt).toLocaleString()
      : '—',
  }))

  const resolvedCount   = alerts.filter(a => a.status === 'Resolved').length
  const unresolvedCount = alerts.filter(a => a.status === 'Unresolved').length

  const efficiency = alerts.length > 0
    ? Math.round((resolvedCount / alerts.length) * 100)
    : 0

  // filter logic
  const filtered = useMemo(() => {

    let data = alerts.filter(a => {

      const tabMatch = activeTab === 'All Alerts'
        ? true
        : activeTab === 'Resolved'
        ? a.status === 'Resolved'
        : a.status === 'Unresolved'

      const sevMatch  = !activeSeverity || a.severity === activeSeverity
      const typeMatch = !activeType     || a.type === activeType

      return tabMatch && sevMatch && typeMatch

    })

    if (!searchQuery) return data

    const q = searchQuery.toLowerCase()

    return data.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.body.toLowerCase().includes(q) ||
      a.branch.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.severity.toLowerCase().includes(q)
    )

  }, [alerts, activeTab, activeSeverity, activeType, searchQuery])

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const pageRows = useMemo(() => {
    return filtered.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    )
  }, [filtered, currentPage])

  // reset page when searching
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleResolve = async (id) => {
    try {
      await alertApi.resolve(id)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleAutoResolve = async () => {
    const inventoryAlerts = alerts.filter(
      a => a.type === 'Inventory' && a.status === 'Unresolved'
    )

    await Promise.allSettled(
      inventoryAlerts.map(a => alertApi.resolve(a.id))
    )

    refetch()
  }

  const handleFilter = (setter) => (val) => {
    setter(val)
    setCurrentPage(1)
  }

  return (
    <div className="pt-24 px-14 pb-14 min-h-screen bg-surface-container-low">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight">
            System Alerts
          </h2>

          <p className="text-on-surface-variant mt-2 max-w-lg">
            Centralized intelligence monitoring. Resolve high-priority anomalies and inventory discrepancies in real-time.
          </p>
        </div>
      </div>

      <AlertFilterBar
        activeTab={activeTab}
        onTabChange={handleFilter(setActiveTab)}

        activeSeverity={activeSeverity}
        onSeverityChange={handleFilter(setActiveSeverity)}

        activeType={activeType}
        onTypeChange={handleFilter(setActiveType)}

        onAutoResolve={handleAutoResolve}
        alertData={alerts}
      />

      {/* table scroll target */}

      <div ref={tableRef}>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin mr-3">
              sync
            </span>
            Loading alerts…
          </div>
        ) : (
          <AlertTable
            rows={pageRows}
            onResolve={handleResolve}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            total={filtered.length}
          />
        )}

      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RegionalHeatmap />
        <ResponseEfficiencyCard percentage={efficiency} />
      </div>

    </div>
  )
}