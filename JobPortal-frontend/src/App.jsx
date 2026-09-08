import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import JobListing from './pages/JobListing'
import JobDetails from './pages/JobDetails'
import EmployerDashboard from './pages/EmployerDashboard'
import CandidateDashboard from './pages/CandidateDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobListing />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/employer" element={<ProtectedRoute allow={['EMPLOYER']}><EmployerDashboard /></ProtectedRoute>} />
          <Route path="/candidate" element={<ProtectedRoute allow={['CANDIDATE']}><CandidateDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allow={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <footer className="border-t border-line py-8 text-center text-sm text-slate">
        Fieldnote — AI-Ready Job Portal
      </footer>
    </div>
  )
}
