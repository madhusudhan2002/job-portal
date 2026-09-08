import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'CANDIDATE', companyName: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await register(form)
      const path = data.role === 'ADMIN' ? '/admin' : data.role === 'EMPLOYER' ? '/employer' : '/candidate'
      navigate(path)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-ink mb-2">Create your account</h1>
      <p className="text-slate mb-8">Takes less than a minute.</p>

      {error && <div className="mb-4 text-sm text-clay bg-clay/10 border border-clay/30 rounded-lg px-4 py-3">{error}</div>}

      <form onSubmit={submit} className="space-y-4">
        <div className="flex gap-3">
          {['CANDIDATE', 'EMPLOYER'].map((r) => (
            <button
              type="button" key={r}
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 py-2.5 rounded-full border text-sm transition-colors ${form.role === r ? 'bg-moss text-white border-moss' : 'border-line text-slate hover:border-ink'}`}
            >
              {r === 'CANDIDATE' ? "I'm job hunting" : "I'm hiring"}
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm text-slate mb-1.5">Full name</label>
          <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss" />
        </div>
        <div>
          <label className="block text-sm text-slate mb-1.5">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss" />
        </div>
        <div>
          <label className="block text-sm text-slate mb-1.5">Password</label>
          <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss" />
        </div>
        {form.role === 'EMPLOYER' && (
          <div>
            <label className="block text-sm text-slate mb-1.5">Company name</label>
            <input required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss" />
          </div>
        )}
        <button disabled={loading} className="w-full bg-moss text-white rounded-full py-2.5 hover:bg-mossDark transition-colors disabled:opacity-60">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-slate mt-6">
        Already have an account? <Link to="/login" className="text-moss hover:text-mossDark">Log in</Link>
      </p>
    </div>
  )
}
