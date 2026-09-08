import React, { useEffect, useState } from 'react'
import api from '../api/axios'

const emptyForm = {
  title: '', companyName: '', location: '', workMode: 'REMOTE', employmentType: 'FULL_TIME',
  salaryMin: '', salaryMax: '', currency: 'USD', experience: '', skills: '', description: '', benefits: '', deadline: ''
}

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  const loadJobs = () => {
    api.get('/jobs', { params: { page: 0, size: 50, status: undefined } })
      .then((res) => setJobs(res.data.content || []))
  }

  const loadApplications = () => {
    api.get('/applications', { params: { page: 0, size: 50 } })
      .then((res) => setApplications(res.data.content || []))
  }

  useEffect(() => { loadJobs(); loadApplications() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const payload = { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) }
      await api.post('/jobs', payload)
      setMessage('Job posted.')
      setForm(emptyForm)
      setShowForm(false)
      loadJobs()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not post the job.')
    }
  }

  const closeJob = async (id) => {
    await api.patch(`/jobs/${id}/close`)
    loadJobs()
  }

  const deleteJob = async (id) => {
    await api.delete(`/jobs/${id}`)
    loadJobs()
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink">Employer dashboard</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 rounded-full bg-moss text-white hover:bg-mossDark transition-colors">
          {showForm ? 'Cancel' : 'Post a job'}
        </button>
      </div>

      {message && <p className="text-sm text-moss mb-6">{message}</p>}

      {showForm && (
        <form onSubmit={submit} className="border border-line rounded-xl p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Job title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-line rounded-lg px-4 py-2.5" />
          <input placeholder="Company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="border border-line rounded-lg px-4 py-2.5" />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="border border-line rounded-lg px-4 py-2.5" />
          <select value={form.workMode} onChange={(e) => setForm({ ...form, workMode: e.target.value })} className="border border-line rounded-lg px-4 py-2.5 bg-white">
            <option value="REMOTE">Remote</option>
            <option value="ONSITE">Onsite</option>
            <option value="HYBRID">Hybrid</option>
          </select>
          <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className="border border-line rounded-lg px-4 py-2.5 bg-white">
            <option value="FULL_TIME">Full time</option>
            <option value="PART_TIME">Part time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
          <input placeholder="Experience (e.g. 2-4 years)" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="border border-line rounded-lg px-4 py-2.5" />
          <input placeholder="Salary min" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} className="border border-line rounded-lg px-4 py-2.5" />
          <input placeholder="Salary max" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} className="border border-line rounded-lg px-4 py-2.5" />
          <input placeholder="Deadline (YYYY-MM-DD)" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="border border-line rounded-lg px-4 py-2.5" />
          <input placeholder="Skills, comma separated" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="border border-line rounded-lg px-4 py-2.5 md:col-span-2" />
          <textarea placeholder="Description" required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-line rounded-lg px-4 py-2.5 md:col-span-2" />
          <textarea placeholder="Benefits" rows={2} value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} className="border border-line rounded-lg px-4 py-2.5 md:col-span-2" />
          <button className="bg-ink text-white rounded-full py-2.5 md:col-span-2 hover:bg-black transition-colors">Publish job</button>
        </form>
      )}

      <h2 className="font-display text-xl text-ink mb-4">Your jobs</h2>
      <div className="divide-y divide-line mb-12">
        {jobs.map((job) => (
          <div key={job.id} className="py-4 flex items-center justify-between">
            <div>
              <p className="text-ink font-medium">{job.title}</p>
              <p className="text-sm text-slate">{job.status} · {job.location}</p>
            </div>
            <div className="flex gap-2">
              {job.status === 'OPEN' && (
                <button onClick={() => closeJob(job.id)} className="text-sm px-3 py-1.5 rounded-full border border-line hover:border-ink">Close</button>
              )}
              <button onClick={() => deleteJob(job.id)} className="text-sm px-3 py-1.5 rounded-full border border-clay/40 text-clay hover:bg-clay/10">Delete</button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-slate py-4">You haven't posted any jobs yet.</p>}
      </div>

      <h2 className="font-display text-xl text-ink mb-4">Applicants</h2>
      <div className="divide-y divide-line">
        {applications.map((a) => (
          <div key={a.id} className="py-4">
            <p className="text-ink font-medium">{a.candidate?.fullName} <span className="text-slate font-normal">applied to</span> {a.job?.title}</p>
            <p className="text-sm text-slate">{a.status} · {new Date(a.appliedAt).toLocaleDateString()}</p>
          </div>
        ))}
        {applications.length === 0 && <p className="text-slate py-4">No applications yet.</p>}
      </div>
    </div>
  )
}
