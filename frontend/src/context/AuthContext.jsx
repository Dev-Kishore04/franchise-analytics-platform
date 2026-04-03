// src/context/AuthContext.jsx
import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password)
    // data = { token, email, role }
    localStorage.setItem('token', data.token)
    const userData = {
      id: data.id,
      email: data.email,
      role: data.role,
      name: data.name ,
      branchId: data.branchId
    }

    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
