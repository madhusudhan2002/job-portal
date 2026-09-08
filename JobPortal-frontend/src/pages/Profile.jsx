import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-ink mb-8">Your profile</h1>
      <div className="space-y-4 text-sm">
        <div className="border-b border-line pb-3">
          <p className="text-slate">Full name</p>
          <p className="text-ink text-base">{user.fullName}</p>
        </div>
        <div className="border-b border-line pb-3">
          <p className="text-slate">Email</p>
          <p className="text-ink text-base">{user.email}</p>
        </div>
        <div className="border-b border-line pb-3">
          <p className="text-slate">Role</p>
          <p className="text-ink text-base">{user.role}</p>
        </div>
      </div>
    </div>
  )
}
