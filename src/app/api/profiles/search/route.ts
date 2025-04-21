import { NextResponse } from 'next/server'
import { searchProfiles } from '@/lib/services/profiles'
import { z } from 'zod'

const searchParamsSchema = z.object({
  query: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  location: z.string().optional(),
  page: z.number().default(1),
  per_page: z.number().default(12),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const skills = searchParams.get('skills')?.split(',').filter(Boolean) || []
    const experienceLevel = searchParams.get('experienceLevel') || undefined
    const location = searchParams.get('location') || undefined
    const page = Number(searchParams.get('page')) || 1
    const per_page = Number(searchParams.get('perPage')) || 12

    const validatedParams = searchParamsSchema.parse({
      query,
      skills,
      experienceLevel,
      location,
      page,
      per_page,
    })

    const { profiles, total } = await searchProfiles(validatedParams)

    return NextResponse.json({
      profiles,
      pagination: {
        total,
        page: validatedParams.page,
        per_page: validatedParams.per_page,
        totalPages: Math.ceil(total / validatedParams.per_page),
      },
    })
  } catch (error) {
    console.error('Error in profile search:', error)
    return NextResponse.json(
      { error: 'Failed to search profiles' },
      { status: 400 }
    )
  }
}