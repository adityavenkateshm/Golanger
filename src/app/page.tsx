'use client'

import { JobCard } from '@/components/jobs/JobCard'
import { JobFilters } from '@/components/jobs/JobFilter'
import { JobSubscribeForm } from '@/components/jobs/JobSubscribeForm'
import { getJobs } from '@/lib/services/jobs'
import { Job, JobFilter } from '@/types'
import { useEffect, useState } from 'react'

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<JobFilter>({})

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        const jobData = await getJobs(filter)
        setJobs(jobData)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [filter])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Your Next Golang Job</h1>
        <p className="text-xl text-gray-400 mb-6">
          Discover the best Golang jobs from companies around the world
        </p>
        <div className="max-w-xl mx-auto">
          <JobSubscribeForm inline />
        </div>
      </div>

      <JobFilters currentFilter={filter} onFilterChange={setFilter} />

      <div className="mt-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-white/5 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-gray-400">
              Try adjusting your search filters or check back later for new opportunities
            </p>
          </div>
        )}
      </div>

      <div className="mt-12 max-w-lg mx-auto">
        <JobSubscribeForm />
      </div>
    </div>
  )
}
