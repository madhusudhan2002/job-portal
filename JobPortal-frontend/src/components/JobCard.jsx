import React from 'react'
import { Link } from 'react-router-dom'

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block border-l-2 border-line hover:border-moss pl-5 py-4 transition-colors group"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg text-ink group-hover:text-moss transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-slate mt-1">
            {job.company?.name || 'Confidential'} · {job.location || 'Not specified'}
          </p>
        </div>
        {job.workMode && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-panel border border-line text-slate whitespace-nowrap">
            {job.workMode.replace('_', ' ')}
          </span>
        )}
      </div>
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {job.skills.slice(0, 5).map((s) => (
            <span key={s} className="text-xs text-slate bg-canvas border border-line rounded-full px-2.5 py-1">
              {s}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
