'use client'

import { Profile, ProfileFormData } from '@/lib/services/profiles'
import { useState } from 'react'

interface ProfileFormProps {
  profile?: Profile | null
  onSubmit: (data: ProfileFormData) => Promise<void>
}

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const skills = formData.get('skills')?.toString().split(',').map(s => s.trim()).filter(Boolean) || []
    const preferredLocations = formData.get('preferred_locations')?.toString().split(',').map(s => s.trim()).filter(Boolean) || []

    try {
      const data: ProfileFormData = {
        full_name: formData.get('full_name')?.toString() || null,
        headline: formData.get('headline')?.toString() || null,
        bio: formData.get('bio')?.toString() || null,
        location: formData.get('location')?.toString() || null,
        website_url: formData.get('website_url')?.toString() || null,
        github_url: formData.get('github_url')?.toString() || null,
        linkedin_url: formData.get('linkedin_url')?.toString() || null,
        resume_url: formData.get('resume_url')?.toString() || null,
        experience_years: formData.get('experience_years') ? Number(formData.get('experience_years')) : null,
        preferred_role_types: [formData.get('preferred_role_types')?.toString() || ''].filter(Boolean),
        preferred_locations: preferredLocations,
        skills: skills,
        golang_experience: formData.get('golang_experience')?.toString() || null,
      }

      await onSubmit(data)
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile')
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
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            defaultValue={profile?.full_name || ''}
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Headline
          </label>
          <input
            type="text"
            name="headline"
            defaultValue={profile?.headline || ''}
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
            placeholder="Senior Golang Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            defaultValue={profile?.location || ''}
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
            placeholder="San Francisco, CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Years of Experience
          </label>
          <input
            type="number"
            name="experience_years"
            defaultValue={profile?.experience_years || ''}
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Preferred Role Type
          </label>
          <select
            name="preferred_role_types"
            defaultValue={profile?.preferred_role_types?.[0] || ''}
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          >
            <option value="">Select Role Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Golang Experience Level
          </label>
          <select
            name="golang_experience"
            defaultValue={profile?.golang_experience || ''}
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          >
            <option value="">Select Experience Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          rows={4}
          defaultValue={profile?.bio || ''}
          className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          placeholder="A brief description about yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Skills (comma-separated)
        </label>
        <input
          type="text"
          name="skills"
          defaultValue={profile?.skills?.join(', ') || ''}
          className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          placeholder="Go, Docker, Kubernetes, gRPC, PostgreSQL"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Preferred Locations (comma-separated)
        </label>
        <input
          type="text"
          name="preferred_locations"
          defaultValue={profile?.preferred_locations?.join(', ') || ''}
          className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          placeholder="San Francisco, New York, Remote"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Website URL
          </label>
          <input
            type="url"
            name="website_url"
            defaultValue={profile?.website_url || ''}
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            name="github_url"
            defaultValue={profile?.github_url || ''}
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            LinkedIn URL
          </label>
          <input
            type="url"
            name="linkedin_url"
            defaultValue={profile?.linkedin_url || ''}
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Resume URL
          </label>
          <input
            type="url"
            name="resume_url"
            defaultValue={profile?.resume_url || ''}
            className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}