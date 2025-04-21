'use client'

import { Profile, getProfile } from '@/lib/services/profiles'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PublicProfilePage() {
  const { userId } = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const userProfile = await getProfile(userId as string)
        setProfile(userProfile)
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Profile not found')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  async function handleShare() {
    try {
      await navigator.share({
        title: `${profile?.full_name}'s Golang Developer Profile`,
        text: `Check out ${profile?.full_name}'s Golang developer profile on GoBoard`,
        url: window.location.href,
      })
    } catch (err) {
      // Handle browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Profile link copied to clipboard!'))
        .catch(console.error)
    }
  }

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

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            {error || 'Profile not found'}
          </h1>
          <Link href="/" className="text-blue-500 hover:text-blue-400">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded font-medium transition-colors"
          >
            Share Profile
          </button>
        </div>
        
        <div className="bg-white/5 rounded-lg p-6 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
            {profile.headline && (
              <p className="text-xl text-gray-300">{profile.headline}</p>
            )}
            {profile.location && (
              <p className="text-gray-400 mt-2">{profile.location}</p>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div>
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          {/* Experience */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Experience</h2>
            <div className="space-y-2">
              {profile.golang_experience && (
                <p className="text-gray-300">
                  <span className="text-gray-400">Golang Experience:</span>{' '}
                  {profile.golang_experience}
                </p>
              )}
              {profile.experience_years && (
                <p className="text-gray-300">
                  <span className="text-gray-400">Total Experience:</span>{' '}
                  {profile.experience_years} years
                </p>
              )}
            </div>
          </div>

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preferences */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Job Preferences</h2>
            {profile.preferred_role_types.length > 0 && (
              <div className="mb-4">
                <h3 className="text-gray-400 mb-2">Preferred Role Types</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.preferred_role_types.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.preferred_locations.length > 0 && (
              <div>
                <h3 className="text-gray-400 mb-2">Preferred Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.preferred_locations.map((location) => (
                    <span
                      key={location}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Links</h2>
            <div className="space-y-2">
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300"
                >
                  Personal Website
                </a>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300"
                >
                  GitHub Profile
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300"
                >
                  LinkedIn Profile
                </a>
              )}
              {profile.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300"
                >
                  Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}