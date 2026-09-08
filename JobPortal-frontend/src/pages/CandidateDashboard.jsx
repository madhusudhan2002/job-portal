import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([])
  const [saved, setSaved] = useState([])

  useEffect(() => {
    api.get('/applications', { params: { page: 0, size: 50 } }).then((res) => setApplications(res.data.content || []))
    api.get('/saved-jobs').then((res) => setSaved(res.data || []))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-ink mb-10">Your dashboard</h1>

      <h2 className="font-display text-xl text-ink mb-4">Applications</h2>
      <div className="divide-y divide-line mb-12">
        {applications.map((a) => (
          <div key={a.id} className="py-4 flex items-center justify-between">
            <div>
              <Link to={`/jobs/${a.job?.id}`} className="text-ink font-medium hover:text-moss">{a.job?.title}</Link>
              <p className="text-sm text-slate">{a.job?.company?.name} · applied {new Date(a.appliedAt).toLocaleDateString()}</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-panel border border-line text-slate">{a.status}</span>
          </div>
        ))}
        {applications.length === 0 && <p className="text-slate py-4">You haven't applied to anything yet. <Link to="/jobs" className="text-moss">Browse jobs</Link></p>}
      </div>

      <h2 className="font-display text-xl text-ink mb-4">Saved jobs</h2>
      <div className="divide-y divide-line">
        {saved.map((s) => (
          <div key={s.id} className="py-4">
            <Link to={`/jobs/${s.job?.id}`} className="text-ink font-medium hover:text-moss">{s.job?.title}</Link>
            <p className="text-sm text-slate">{s.job?.company?.name} · {s.job?.location}</p>
          </div>
        ))}
        {saved.length === 0 && <p className="text-slate py-4">No saved jobs yet.</p>}
      </div>
    </div>
  )
}
