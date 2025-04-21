'use client'

import { JobPostForm } from '@/components/jobs/JobPostForm'

export default function PostJobPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Post a Golang Job</h1>
          <p className="text-gray-400">
            Connect with talented Golang developers. Post your job listing below.
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <JobPostForm />
        </div>
      </div>
    </div>
  )
}