'use client'

import { getJobById } from '@/lib/services/jobs'
import { Job } from '@/types'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { JobSubscribeForm } from '@/components/jobs/JobSubscribeForm'
import { useAuth } from '@clerk/nextjs'
import { formatSalary } from '@/lib/utils/currency';


export default function JobPage() {
  const { id } = useParams()
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJob() {
      try {
        const jobData = await getJobById(id as string)
        setJob(jobData)
      } catch (error) {
        console.error('Error fetching job:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const handleSignIn = useCallback(() => {
    const currentPath = `/jobs/${id}`;
    router.push(`/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
  }, [router, id])

  const handleApply = useCallback(() => {
    if (job?.application_url) {
      window.open(job.application_url, '_blank', 'noopener,noreferrer')
    }
  }, [job])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/5 rounded w-3/4"></div>
            <div className="h-4 bg-white/5 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded"></div>
              <div className="h-4 bg-white/5 rounded"></div>
              <div className="h-4 bg-white/5 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500">Job not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/5 rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <p className="text-xl text-gray-400 mb-4">
                {job.company} • {job.location}
              </p>
            </div>
            {job.company_logo && (
              <img
                src={job.company_logo}
                alt={`${job.company} logo`}
                className="w-16 h-16 object-contain rounded"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded">
              {job.location_type}
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded">
              {job.role_type}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-500 rounded">
              {job.experience_level}
            </span>
            {job.go_version && (
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-500 rounded">
                Go {job.go_version}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Salary</h2>
            <p>
              {job.salary_min && job.salary_max
              ? formatSalary(job.salary_min, job.salary_max, job.salary_currency)
              : 'Salary not specified'}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          {job.requirements.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Requirements</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.tech_stack.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {job.tech_stack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.application_url && (
            <div className="pt-4">
              {isSignedIn ? (
                <button
                  onClick={handleApply}
                  className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
                >
                  Apply for this position
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
                >
                  Sign in to apply
                </button>
              )}
              {!isSignedIn && (
                <p className="mt-2 text-sm text-gray-400">
                  You need to sign in to apply for this position
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          <JobSubscribeForm />
        </div>
      </div>
    </div>
  )
}