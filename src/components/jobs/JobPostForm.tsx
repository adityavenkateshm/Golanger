'use client'

import { createJob } from '@/lib/services/jobs'
import { Job } from '@/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type JobFormData = Omit<Job, 'id' | 'posted_date' | 'status'>

export function JobPostForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const requirements = formData.get('requirements')?.toString().split('\n').map(r => r.trim()).filter(Boolean) || []
    const tech_stack = formData.get('tech_stack')?.toString().split(',').map(t => t.trim()).filter(Boolean) || []

    try {
      const data: JobFormData = {
        title: formData.get('title')?.toString() || '',
        company: formData.get('company')?.toString() || '',
        company_logo: formData.get('company_logo')?.toString() || null,
        location: formData.get('location')?.toString() || '',
        location_type: formData.get('location_type')?.toString() as Job['location_type'] || 'remote',
        role_type: formData.get('role_type')?.toString() as Job['role_type'] || 'full-time',
        experience_level: formData.get('experience_level')?.toString() as Job['experience_level'] || 'mid',
        description: formData.get('description')?.toString() || '',
        application_url: formData.get('application_url')?.toString() || null,
        go_version: formData.get('go_version')?.toString() || null,
        requirements,
        tech_stack,
        salary_min: formData.get('salary_min') ? Number(formData.get('salary_min')) : null,
        salary_max: formData.get('salary_max') ? Number(formData.get('salary_max')) : null,
        salary_currency: formData.get('salary_currency')?.toString() || 'USD',
      }

      const job = await createJob(data)
      router.push(`/jobs/${job.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
            placeholder="Senior Golang Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Company
          </label>
          <input
            type="text"
            name="company"
            required
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Company Logo URL
          </label>
          <input
            type="url"
            name="company_logo"
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            required
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
            placeholder="San Francisco, CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Location Type
          </label>
          <select
            name="location_type"
            required
            defaultValue="remote"
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          >
            <option value="remote">Remote</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Role Type
          </label>
          <select
            name="role_type"
            required
            defaultValue="full-time"
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Experience Level
          </label>
          <select
            name="experience_level"
            required
            defaultValue="mid"
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          >
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="lead">Lead Level</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Go Version (optional)
          </label>
          <input
            type="text"
            name="go_version"
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
            placeholder="1.20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Application URL
          </label>
          <input
            type="url"
            name="application_url"
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Job Description (Markdown supported)
        </label>
        <textarea
          name="description"
          required
          rows={10}
          className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Requirements (one per line)
        </label>
        <textarea
          name="requirements"
          rows={5}
          className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none font-mono"
          placeholder="5+ years of Go experience
Experience with microservices
Strong understanding of algorithms"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tech Stack (comma-separated)
        </label>
        <input
          type="text"
          name="tech_stack"
          className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          placeholder="Go, Docker, Kubernetes, gRPC, PostgreSQL"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Salary Currency
          </label>
          <select
            name="salary_currency"
            required
            defaultValue="USD"
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Minimum Salary
          </label>
          <input
            type="number"
            name="salary_min"
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
            placeholder="80000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Maximum Salary
          </label>
          <input
            type="number"
            name="salary_max"
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
            placeholder="120000"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Job Post'}
        </button>
      </div>
    </form>
  )
}