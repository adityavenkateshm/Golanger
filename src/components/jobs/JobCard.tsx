'use client'

import { Job } from '@/types'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { formatSalary } from '@/lib/utils/currency'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const formattedSalary = job.salary_min && job.salary_max
    ? `${job.salary_currency || '$'}${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
    : 'Salary not specified'

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block p-6 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
          <p className="text-gray-400 mb-4">{job.company} • {job.location}</p>
        </div>
        {job.company_logo && (
          <img
            src={job.company_logo}
            alt={`${job.company} logo`}
            className="w-12 h-12 object-contain rounded"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-sm">
          {job.location_type}
        </span>
        <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-sm">
          {job.role_type}
        </span>
        <span className="px-2 py-1 bg-purple-500/20 text-purple-500 rounded text-sm">
          {job.experience_level}
        </span>
        {job.go_version && (
          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-500 rounded text-sm">
            Go {job.go_version}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-400">
        {/* <span>{formattedSalary}</span> */}
          <p>
            {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
          </p>
        <span>
          {formatDistanceToNow(new Date(job.posted_date), { addSuffix: true })}
        </span>
      </div>
    </Link>
  )
}