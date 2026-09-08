import React, { useEffect, useState } from 'react'
import api from '../api/axios'

function StatCard({ label, value }) {
  return (
    <div className="border border-line rounded-xl p-5">
      <p className="text-sm text-slate mb-1">{label}</p>
      <p className="font-display text-3xl text-ink">{value}</p>
    </div>
  )
}

function TopList({ title, entries }) {
  return (
    <div>
      <h3 className="font-display text-lg text-ink mb-3">{title}</h3>
      <ul className="space-y-2">
        {entries?.map(([key, count]) => (
          <li key={key} className="flex items-center justify-between text-sm">
            <span className="text-ink">{key}</span>
            <span className="text-slate">{count}</span>
          </li>
        ))}
        {(!entries || entries.length === 0) && <li className="text-sm text-slate">No data yet.</li>}
      </ul>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [scraping, setScraping] = useState(false)
  const [scrapeResult, setScrapeResult] = useState(null)

  const loadStats = () => {
    api.get('/dashboard').then((res) => setStats(res.data))
  }

  useEffect(() => { loadStats() }, [])

  const runScrape = async () => {
    setScraping(true)
    setScrapeResult(null)
    try {
      const res = await api.post('/scrape/jobs', null, { params: { limit: 50 } })
      setScrapeResult(res.data)
      loadStats()
    } catch (err) {
      setScrapeResult({ error: err.response?.data?.message || 'Scrape failed' })
    } finally {
      setScraping(false)
    }
  }

  // normalize entries which may arrive as [key, value] arrays or {key, value} objects
  const toEntries = (list) => (list || []).map((e) => Array.isArray(e) ? e : [e.key, e.value])

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl text-ink">Admin dashboard</h1>
        <button onClick={runScrape} disabled={scraping} className="px-5 py-2.5 rounded-full bg-moss text-white hover:bg-mossDark transition-colors disabled:opacity-60">
          {scraping ? 'Scraping…' : 'Run job scraper'}
        </button>
      </div>

      {scrapeResult && (
        <div className="mb-8 text-sm border border-line rounded-lg px-4 py-3">
          {scrapeResult.error
            ? <span className="text-clay">{scrapeResult.error}</span>
            : <span className="text-ink">Added {scrapeResult.added}, skipped {scrapeResult.duplicatesSkipped} duplicates, {scrapeResult.errors} errors.</span>}
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <StatCard label="Users" value={stats.totalUsers} />
            <StatCard label="Jobs" value={stats.totalJobs} />
            <StatCard label="Companies" value={stats.totalCompanies} />
            <StatCard label="Applications" value={stats.totalApplications} />
            <StatCard label="Scraped today" value={stats.jobsScrapedToday} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <TopList title="Top skills" entries={toEntries(stats.topSkills)} />
            <TopList title="Top companies" entries={toEntries(stats.topCompanies)} />
            <TopList title="Top locations" entries={toEntries(stats.topLocations)} />
          </div>
        </>
      )}
    </div>
  )
}
