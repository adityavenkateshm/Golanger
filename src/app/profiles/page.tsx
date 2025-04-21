'use client'

import { ProfileCard } from '@/components/profile/ProfileCard'
import { Profile } from '@/lib/services/profiles'
import { useCallback, useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import debounce from 'lodash/debounce'

interface SearchResult {
  profiles: Profile[]
  pagination: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

function ProfilesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(true)

  const clearFilters = useCallback(() => {
    router.push('/profiles')
  }, [router])

  const updateSearch = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    router.push(`/profiles?${params.toString()}`)
  }, [searchParams, router])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Clear filters with Escape key
    if (e.key === 'Escape') {
      clearFilters()
    }
  }, [clearFilters])

  // Debounce search input to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => updateSearch({ query }), 300),
    [updateSearch]
  )

  async function fetchProfiles() {
    try {
      setLoading(true)
      const response = await fetch(`/api/profiles/search?${searchParams.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch profiles')
      const data = await response.json()
      setSearchResult(data)
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [searchParams])

  const hasActiveFilters = searchParams.toString().length > 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-2">Browse Golang Developers</h1>
            <p className="text-gray-400">
              Find and connect with talented Golang developers for your team
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div 
          className="mb-8 space-y-4"
          onKeyDown={handleKeyDown}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by name, headline, or bio... (Press Esc to clear)"
                defaultValue={searchParams.get('query') || ''}
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
              />
            </div>
            <div>
              <select
                value={searchParams.get('experienceLevel') || ''}
                onChange={(e) => updateSearch({ experienceLevel: e.target.value })}
                className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
                aria-label="Experience Level"
              >
                <option value="">Any experience level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Filter by location..."
                defaultValue={searchParams.get('location') || ''}
                onChange={(e) => updateSearch({ location: e.target.value })}
                className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
                aria-label="Location Filter"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Filter by skills (comma-separated)..."
              defaultValue={searchParams.get('skills') || ''}
              onChange={(e) => updateSearch({ skills: e.target.value })}
              className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
              aria-label="Skills Filter"
            />
            <p className="mt-1 text-xs text-gray-400">
              Example: go, docker, kubernetes
            </p>
          </div>

          {/* Search stats */}
          {searchResult && !loading && (
            <div className="text-sm text-gray-400">
              Found {searchResult.pagination.total} developer{searchResult.pagination.total !== 1 ? 's' : ''}
              {searchParams.get('query') && ` matching "${searchParams.get('query')}"`}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 rounded-lg p-6 space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-6 w-16 bg-white/10 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResult?.profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {searchResult && searchResult.profiles.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No profiles found</h3>
                <p className="text-gray-400">
                  Try adjusting your search criteria or{' '}
                  <button
                    onClick={clearFilters}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    clear all filters
                  </button>
                </p>
              </div>
            )}

            {/* Pagination */}
            {searchResult && searchResult.pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => updateSearch({ 
                    page: String(Math.max(1, searchResult.pagination.page - 1))
                  })}
                  disabled={searchResult.pagination.page === 1}
                  className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50"
                >
                  Previous
                </button>
                
                {[...Array(searchResult.pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateSearch({ page: String(i + 1) })}
                    className={`px-4 py-2 rounded ${
                      searchResult.pagination.page === i + 1
                        ? 'bg-blue-500'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => updateSearch({ 
                    page: String(Math.min(
                      searchResult.pagination.totalPages, 
                      searchResult.pagination.page + 1
                    ))
                  })}
                  disabled={searchResult.pagination.page === searchResult.pagination.totalPages}
                  className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function BrowseProfilesPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Browse Golang Developers</h1>
            <p className="text-gray-400">Loading...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/5 rounded-lg p-6 space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-6 w-16 bg-white/10 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProfilesContent />
    </Suspense>
  )
}