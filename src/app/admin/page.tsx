'use client'

import { getJobs, updateJob } from '@/lib/services/jobs'
import { Job } from '@/types'
import { useEffect, useState } from 'react'
import { useUser, useSession } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { session, isLoaded: isSessionLoaded } = useSession()
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isUserLoaded || !isSessionLoaded) return;

    // User not signed in
    if (!user || !session) {
      router.push('/sign-in')
      return
    }

    async function fetchJobs() {
      try {
        // Role check is now handled by middleware, just fetch jobs
        const jobData = await getJobs({ status: 'pending' })
        setJobs(jobData)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        // Show error state instead of redirecting since middleware handles auth
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [user, session, isUserLoaded, isSessionLoaded, router])

  async function handleApproveJob(jobId: string) {
    try {
      await updateJob(jobId, { status: 'active' })
      setJobs(jobs.filter(job => job.id !== jobId))
    } catch (error) {
      console.error('Error approving job:', error)
    }
  }

  // Show loading state while checking auth and fetching data
  if (!isUserLoaded || !isSessionLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-32 bg-white/5 rounded"></div>
            <div className="h-32 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show nothing if not authenticated (middleware will handle redirect)
  if (!user || !session) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Pending Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-400">No pending jobs found.</p>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white/5 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <p className="text-gray-400">{job.company}</p>
                  </div>
                  <button
                    onClick={() => handleApproveJob(job.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-400">Location: </span>
                    {job.location} ({job.location_type})
                  </div>
                  <div>
                    <span className="text-gray-400">Role: </span>
                    {job.role_type} - {job.experience_level}
                  </div>
                  {job.salary_min && job.salary_max && (
                    <div>
                      <span className="text-gray-400">Salary: </span>
                      {job.salary_currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="text-sm">
                  <h4 className="font-semibold mb-2">Description:</h4>
                  <p className="text-gray-300">{job.description.slice(0, 200)}...</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}