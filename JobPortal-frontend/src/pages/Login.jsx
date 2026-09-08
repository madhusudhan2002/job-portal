import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      const path = data.role === 'ADMIN' ? '/admin' : data.role === 'EMPLOYER' ? '/employer' : '/candidate'
      navigate(path)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not log in. Check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-ink mb-2">Welcome back</h1>
      <p className="text-slate mb-8">Log in to continue.</p>

      {error && <div className="mb-4 text-sm text-clay bg-clay/10 border border-clay/30 rounded-lg px-4 py-3">{error}</div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate mb-1.5">Email</label>
          <input
            type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss"
          />
        </div>
        <div>
          <label className="block text-sm text-slate mb-1.5">Password</label>
          <input
            type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss"
          />
        </div>
        <button disabled={loading} className="w-full bg-moss text-white rounded-full py-2.5 hover:bg-mossDark transition-colors disabled:opacity-60">
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="text-sm text-slate mt-6">
        New here? <Link to="/register" className="text-moss hover:text-mossDark">Create an account</Link>
      </p>
    </div>
  )
}
