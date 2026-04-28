// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import logo from '@/asset/Untitled-1.png'



export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-10 w-full max-w-md">
        {/* Brand */}
        <div className="flex relative items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl flex overflow-hidden items-center justify-center">
            <img className='h-10 w-10 scale-[1.1]' src={logo} alt="FAP" />
          </div>
          <div>
            <h1 className="text-l pb-0.5 font-bold font-headline text-on-surface">Franchise Analytics Platform</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Franchise Management</p>
          </div>
          {/* <img className='w-10 h-10 right-20 bottom-2 z-[1] rotate-0 opacity-100 absolute' src={logobg} alt="" /> */}
        </div>

        <h2 className="text-2xl font-extrabold font-headline text-on-surface mb-1">Welcome back</h2>
        <p className="text-on-surface-variant text-sm mb-8">Sign in to your franchise dashboard</p>

        {error && (
          <div className="mb-6 p-3 bg-error-container rounded-lg text-on-error-container text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@franchise.io"
              required
              className="w-full px-4 py-3 bg-surface-container-low rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-surface-container-low rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 justify-center text-sm disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        {/* Demo Note */}
        <div className="mt-6 p-4 bg-surface-container-low rounded-lg text-xs text-on-surface-variant">
          <p className="font-semibold mb-1 text-on-surface">Demo Access</p>
          <p>
            Email: <span className="font-mono font-medium">kishore062922@gmail.com</span><br/>
            Password: <span className="font-mono font-medium">0410</span>
          </p>
        
          <p className="mt-3 text-[11px] opacity-80">
            Note: The first login may take a short while because the backend is hosted on a free service and may need time to wake up (cold start).
          </p>
        </div>
      </div>
    </div>
  )
}
