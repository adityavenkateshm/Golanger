'use client'

import { useUser } from '@clerk/nextjs'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { getProfile, updateProfile } from '@/lib/services/profiles'
import { useEffect, useState } from 'react'
import type { Profile, ProfileFormData } from '@/lib/services/profiles'

export default function ProfilePage() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      if (!isUserLoaded) return
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const profileData = await getProfile(user.id)
        setProfile(profileData)
        setError('')
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user?.id, isUserLoaded])

  async function handleSubmit(data: ProfileFormData) {
    if (!user?.id) return

    try {
      const updatedProfile = await updateProfile(user.id, data)
      setProfile(updatedProfile)
      setError('')
    } catch (err) {
      console.error('Error updating profile:', err)
      throw new Error(err instanceof Error ? err.message : 'Failed to update profile')
    }
  }

  if (!isUserLoaded) {
    return null
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-500/20 text-red-500 p-4 rounded-lg">
            Please sign in to view your profile
          </div>
        </div>
      </div>
    )
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
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        {error && (
          <div className="bg-red-500/20 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <ProfileForm profile={profile} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}