import React, { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('jp_user')
    return stored ? JSON.parse(stored) : null
  })

  const persist = (data) => {
    localStorage.setItem('jp_token', data.token)
    localStorage.setItem('jp_user', JSON.stringify(data))
    setUser(data)
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    persist(res.data)
    return res.data
  }

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload)
    persist(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('jp_token')
    localStorage.removeItem('jp_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
