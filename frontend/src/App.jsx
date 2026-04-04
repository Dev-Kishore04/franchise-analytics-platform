// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'

import AppLayout   from '@/components/layout/AppLayout'
import Login       from '@/pages/Login'
import Dashboard   from '@/pages/Dashboard'
import Branches    from '@/pages/Branches'
import Staff       from '@/pages/Staff'
import Products    from '@/pages/Products'
import Inventory   from '@/pages/Inventory'
import POS         from '@/pages/POS'
import Analytics   from '@/pages/Analytics'
import AIInsights  from '@/pages/AIInsights'
import Alerts      from '@/pages/Alerts'
import Settings    from '@/pages/Settings'

function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function RoleRoute({ allowedRoles, children }) {

  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/pos" replace />
  }

  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >

        {/* ROLEADMIN ONLY */}
        <Route
          index
          element={
            <RoleRoute allowedRoles={["ROLEADMIN"]}>
              <Dashboard />
            </RoleRoute>
          }
        />

        <Route
          path="branches"
          element={
            <RoleRoute allowedRoles={["ROLEADMIN", "ROLEMANAGER"]}>
              <Branches />
            </RoleRoute>
          }
        />

        <Route
          path="staff"
          element={
            <RoleRoute allowedRoles={["ROLEADMIN","ROLEMANAGER"]}>
              <Staff />
            </RoleRoute>
          }
        />

        <Route
          path="ai-insights/*"
          element={
            <RoleRoute allowedRoles={["ROLEADMIN", "ROLEMANAGER"]}>
              <AIInsights />
            </RoleRoute>
          }
        />

        <Route
          path="settings"
          element={
            <RoleRoute allowedRoles={["ROLEADMIN"]}>
              <Settings />
            </RoleRoute>
          }
        />

        {/* ADMIN + ROLEMANAGER */}
        <Route
          path="products"
          element={
            <RoleRoute allowedRoles={["ROLEADMIN", "ROLEMANAGER"]}>
              <Products />
            </RoleRoute>
          }
        />

        <Route
          path="analytics"
          element={
            <RoleRoute allowedRoles={["ROLEADMIN"]}>
              <Analytics />
            </RoleRoute>
          }
        />

        {/* EVERYONE */}
        <Route
          path="inventory"
          element={
            <RoleRoute allowedRoles={["ROLEADMIN", "ROLEMANAGER", "ROLESTAFF"]}>
              <Inventory />
            </RoleRoute>
          }
        />

        <Route
          path="pos"
          element={
            <RoleRoute allowedRoles={["ROLEADMIN", "ROLEMANAGER", "ROLESTAFF"]}>
              <POS />
            </RoleRoute>
          }
        />

        <Route
          path="alerts"
          element={
            <RoleRoute allowedRoles={["ROLEADMIN", "ROLEMANAGER", "ROLESTAFF"]}>
              <Alerts />
            </RoleRoute>
          }
        />

      </Route>

      <Route path="*" element={<Navigate to="/pos" replace />} />

    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}