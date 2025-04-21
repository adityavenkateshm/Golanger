import { supabase, getAuthenticatedClient } from '../supabase'

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  headline: string | null
  bio: string | null
  location: string | null
  website_url: string | null
  github_url: string | null
  linkedin_url: string | null
  resume_url: string | null
  experience_years: number | null
  preferred_role_types: string[]
  preferred_locations: string[]
  skills: string[]
  golang_experience: string | null
  created_at: string
  updated_at: string
}

export type ProfileFormData = Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export interface SearchParams {
  query?: string
  skills?: string[]
  experience_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  location?: string
  page: number
  per_page: number
}

// For public profile searches, we can use the regular supabase client
export async function searchProfiles(params: SearchParams) {
  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })

  // Full-text search on name, headline, bio
  if (params.query) {
    query = query.or(
      `full_name.ilike.%${params.query}%,` +
      `headline.ilike.%${params.query}%,` +
      `bio.ilike.%${params.query}%`
    )
  }

  // Filter by skills
  if (params.skills && params.skills.length > 0) {
    query = query.contains('skills', params.skills)
  }

  // Filter by experience level
  if (params.experience_level) {
    query = query.eq('golang_experience', params.experience_level)
  }

  // Filter by location
  if (params.location) {
    query = query.or(
      `location.ilike.%${params.location}%,` +
      `preferred_locations.cs.{${params.location}}`
    )
  }

  // Add pagination
  const from = (params.page - 1) * params.per_page
  const to = from + params.per_page - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('Error searching profiles:', error)
    throw error
  }

  return {
    profiles: data,
    total: count || 0,
  }
}

export async function getProfile(userId: string) {
  if (!userId) {
    throw new Error('User ID is required to fetch profile')
  }

  try {
    const client = await getAuthenticatedClient()
    
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      throw new Error(error.message || 'Failed to fetch profile')
    }

    if (!data) {
      // Return null for non-existent profile instead of throwing
      return null
    }

    return data as Profile
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }
    throw new Error('An unexpected error occurred while fetching profile')
  }
}

export async function updateProfile(userId: string, profile: Partial<ProfileFormData>) {
  if (!userId) {
    throw new Error('User ID is required to update profile')
  }

  try {
    const client = await getAuthenticatedClient()
    
    // Ensure arrays are properly initialized
    const formattedProfile = {
      ...profile,
      preferred_role_types: profile.preferred_role_types || [],
      preferred_locations: profile.preferred_locations || [],
      skills: profile.skills || []
    }

    // First check if a profile exists
    const { data: existing } = await client
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!existing) {
      const { data, error } = await client
        .from('profiles')
        .insert([{
          user_id: userId,
          ...formattedProfile
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        throw new Error(error.message || 'Failed to create profile')
      }

      return data as Profile
    }

    // If profile exists, update it
    const { data, error } = await client
      .from('profiles')
      .update(formattedProfile)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw new Error(error.message || 'Failed to update profile')
    }

    return data as Profile
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }
    throw new Error('An unexpected error occurred while updating profile')
  }
}