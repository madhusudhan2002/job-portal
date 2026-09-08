import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import JobCard from '../components/JobCard'

export default function JobListing() {
  const [jobs, setJobs] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ keyword: '', location: '', workMode: '', employmentType: '' })

  const fetchJobs = async (p = 0) => {
    setLoading(true)
    try {
      const params = { page: p, size: 8, sortBy: 'createdAt', direction: 'desc' }
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
      const res = await api.get('/jobs', { params })
      setJobs(res.data.content || [])
      setTotalPages(res.data.totalPages || 0)
      setPage(p)
    } catch (e) {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs(0) }, []) // eslint-disable-line

  const submitFilters = (e) => {
    e.preventDefault()
    fetchJobs(0)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-ink mb-8">Browse open roles</h1>

      <form onSubmit={submitFilters} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10">
        <input
          placeholder="Title or keyword" value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          className="border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss"
        />
        <input
          placeholder="Location" value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border border-line rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss"
        />
        <select
          value={filters.workMode} onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
          className="border border-line rounded-lg px-4 py-2.5 bg-panel focus:outline-none focus:ring-2 focus:ring-moss/40 focus:border-moss"
        >
          <option value="">Any work mode</option>
          <option value="REMOTE">Remote</option>
          <option value="ONSITE">Onsite</option>
          <option value="HYBRID">Hybrid</option>
        </select>
        <button className="bg-ink text-white rounded-lg px-4 py-2.5 hover:bg-black transition-colors">
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-slate">Loading jobs…</p>
      ) : jobs.length === 0 ? (
        <p className="text-slate">No jobs match your search yet.</p>
      ) : (
        <div className="divide-y divide-line">
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i} onClick={() => fetchJobs(i)}
              className={`w-9 h-9 rounded-full text-sm border transition-colors ${i === page ? 'bg-moss text-white border-moss' : 'border-line text-slate hover:border-ink'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
