import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function TopBar({ searchQuery, onSearchChange }) {

  const [menuOpen, setMenuOpen] = useState(false)

  const menuRef = useRef(null)

  const { user, logout } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {

  const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [])

  const handleFocus = () => {
    window.dispatchEvent(new Event("global-search-focus"))
  }

  return (
    <header className="topbar">

      <div className="search-bar">
        <span className="material-symbols-outlined text-slate-400">search</span>

        <input
          type="text"
          placeholder="Search franchise metrics..."
          value={searchQuery}
          onFocus={handleFocus}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-600">

          <button className="p-2 hover:bg-slate-50 rounded-lg transition-all relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="notif-dot" />
          </button>

          <button className="p-2 hover:bg-slate-50 rounded-lg transition-all">
            <span className="material-symbols-outlined">help_outline</span>
          </button>

        </div>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">

          <button className="text-sm font-semibold text-primary hover:bg-primary/5 px-4 py-2 rounded-lg transition-all">
            Support
          </button>

          

          <div className="relative" ref={menuRef}>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className=" h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white hover:ring-primary transition"
            >
              <div className="w-full h-full px-5 bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.name || "User"}
              </div>
            </button>

            {menuOpen && (

              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">

                <div className="px-4 py-3 border-b">

                  <p className="text-sm font-semibold text-slate-800">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {user?.email || ""}
                  </p>

                </div>

                <button
                  onClick={() => {
                    navigate("/settings")
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">settings</span>
                  Account Settings
                </button>

                <button
                  onClick={() => {
                    logout()
                    navigate("/login")
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Logout
                </button>

              </div>

            )}

          </div>

        </div>
      </div>

    </header>
  )
}