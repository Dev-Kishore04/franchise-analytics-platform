import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import AlertWatcher from '@/components/alerts/AlertWatcher'

export default function AppLayout() {

  const location = useLocation()
  const isPOS = location.pathname === '/pos'

  const [searchQuery, setSearchQuery] = useState("")

  // clear search when page changes
  useEffect(() => {
    setSearchQuery("")
  }, [location.pathname])

  return (
    <>
      <AlertWatcher />

      <div className="app-layout">
        <Sidebar />

        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className={isPOS ? 'ml-64 mt-16' : 'main-content'}>
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </>
  )
}