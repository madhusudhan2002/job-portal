import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const dashboardPath = user?.role === 'ADMIN' ? '/admin'
    : user?.role === 'EMPLOYER' ? '/employer'
    : '/candidate'

  return (
    <header className="border-b border-line bg-canvas/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-tight text-ink">
          Fieldnote
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate">
          <Link to="/jobs" className="hover:text-ink transition-colors">Browse jobs</Link>
          {user && <Link to={dashboardPath} className="hover:text-ink transition-colors">Dashboard</Link>}
          {user && <Link to="/profile" className="hover:text-ink transition-colors">Profile</Link>}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate hidden sm:inline">{user.fullName}</span>
              <button
                onClick={() => { logout(); navigate('/') }}
                className="text-sm px-4 py-2 rounded-full border border-line hover:border-ink transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm px-4 py-2 rounded-full border border-line hover:border-ink transition-colors">
                Log in
              </Link>
              <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-moss text-white hover:bg-mossDark transition-colors">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
