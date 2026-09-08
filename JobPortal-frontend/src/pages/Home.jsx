import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import JobCard from '../components/JobCard'

export default function Home() {
  const [recent, setRecent] = useState([])

  useEffect(() => {
    api.get('/jobs', { params: { page: 0, size: 5, sortBy: 'createdAt', direction: 'desc' } })
      .then((res) => setRecent(res.data.content || []))
      .catch(() => {})
  }, [])

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <p className="text-clay text-sm font-medium mb-4">A quieter way to job hunt</p>
        <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-ink max-w-3xl">
          Find the role that fits, not just the one that's open.
        </h1>
        <p className="text-slate text-lg mt-6 max-w-xl leading-relaxed">
          Fieldnote pulls together listings from employers and the open web, so you search
          one place instead of ten tabs.
        </p>
        <div className="flex gap-4 mt-8">
          <Link to="/jobs" className="px-6 py-3 rounded-full bg-moss text-white hover:bg-mossDark transition-colors">
            Browse open roles
          </Link>
          <Link to="/register" className="px-6 py-3 rounded-full border border-line hover:border-ink transition-colors">
            Create an account
          </Link>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl text-ink">Recently posted</h2>
            <Link to="/jobs" className="text-sm text-moss hover:text-mossDark">See all jobs</Link>
          </div>
          <div className="divide-y divide-line">
            {recent.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </section>
      )}
    </div>
  )
}
