import { unsubscribeFromJobs } from '@/lib/services/email'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const unsubscribeSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = unsubscribeSchema.parse(body)

    await unsubscribeFromJobs(email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in unsubscribe route:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 400 }
    )
  }
}