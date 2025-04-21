import { z } from 'zod'
import { subscribeToJobs } from '@/lib/services/email'
import { NextResponse } from 'next/server'

const subscriptionSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  preferences: z.object({
    location_type: z.array(z.string()).optional(),
    role_type: z.array(z.string()).optional(),
    experience_level: z.array(z.string()).optional(),
    salary_min: z.number().optional(),
  }).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    try {
      const { email, preferences } = subscriptionSchema.parse(body)
      const subscription = await subscribeToJobs(email, preferences)

      return NextResponse.json({
        success: true,
        data: subscription,
        message: 'Successfully subscribed to job alerts'
      })
    } catch (parseError: any) {
      if (parseError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid input',
            details: parseError.errors
          },
          { status: 400 }
        )
      }
      throw parseError
    }
  } catch (error: any) {
    console.error('Error in subscription route:', error)
    
    // Handle known error cases
    if (error.message === 'This email is already subscribed') {
      return NextResponse.json(
        { 
          success: false,
          error: error.message
        },
        { status: 400 }
      )
    }

    // Generic error response for unknown errors
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process subscription. Please try again.'
      },
      { status: 500 }
    )
  }
}