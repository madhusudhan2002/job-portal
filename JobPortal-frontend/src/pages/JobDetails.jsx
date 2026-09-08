import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function JobDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [status, setStatus] = useState('')
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data)).catch(() => {})
  }, [id])

  const apply = async () => {
    setApplying(true)
    setStatus('')
    try {
      await api.post(`/jobs/${id}/apply`, {})
      setStatus('applied')
    } catch (err) {
      setStatus(err.response?.data?.message || 'Could not submit your application.')
    } finally {
      setApplying(false)
    }
  }

  const save = async () => {
    try {
      await api.post(`/saved-jobs/${id}`)
      setStatus('saved')
    } catch (err) {
      setStatus(err.response?.data?.message || 'Could not save this job.')
    }
  }

  if (!job) return <div className="max-w-3xl mx-auto px-6 py-20 text-slate">Loading…</div>

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-sm text-slate mb-2">{job.company?.name || 'Confidential'} · {job.location}</p>
      <h1 className="font-display text-4xl text-ink mb-4">{job.title}</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {job.workMode && <span className="text-xs px-3 py-1 rounded-full bg-panel border border-line text-slate">{job.workMode.replace('_', ' ')}</span>}
        {job.employmentType && <span className="text-xs px-3 py-1 rounded-full bg-panel border border-line text-slate">{job.employmentType.replace('_', ' ')}</span>}
        {job.experience && <span className="text-xs px-3 py-1 rounded-full bg-panel border border-line text-slate">{job.experience} experience</span>}
      </div>

      {user?.role === 'CANDIDATE' && (
        <div className="flex gap-3 mb-10">
          <button onClick={apply} disabled={applying} className="px-6 py-2.5 rounded-full bg-moss text-white hover:bg-mossDark transition-colors disabled:opacity-60">
            {applying ? 'Applying…' : 'Apply now'}
          </button>
          <button onClick={save} className="px-6 py-2.5 rounded-full border border-line hover:border-ink transition-colors">
            Save for later
          </button>
        </div>
      )}
      {status && <p className="text-sm text-moss mb-8">{status === 'applied' ? 'Application submitted.' : status === 'saved' ? 'Job saved.' : status}</p>}

      <div className="prose-sm text-ink whitespace-pre-line leading-relaxed">
        {job.description}
      </div>

      {job.skills?.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-lg text-ink mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((s) => (
              <span key={s} className="text-xs text-slate bg-canvas border border-line rounded-full px-3 py-1.5">{s}</span>
            ))}
          </div>
        </div>
      )}

      {job.benefits && (
        <div className="mt-10">
          <h3 className="font-display text-lg text-ink mb-3">Benefits</h3>
          <p className="text-ink leading-relaxed whitespace-pre-line">{job.benefits}</p>
        </div>
      )}
    </div>
  )
}
