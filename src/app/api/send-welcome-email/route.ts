import { Resend } from 'resend';
import { WelcomeEmail } from '@/components/emails/WelcomeEmail';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Initialize Resend with logging
const RESEND_API_KEY = process.env.RESEND_API_KEY;
console.log('Initializing Resend with API key:', RESEND_API_KEY ? 'API key present' : 'API key missing');
const resend = new Resend(RESEND_API_KEY);

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const emailSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  console.log('Received welcome email request');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);

    const { email } = emailSchema.parse(body);
    console.log('Validated email:', email);

    console.log('Attempting to send welcome email...');
    const data = await resend.emails.send({
      from: 'Resend <onboarding@resend.dev>', // Using Resend's sandbox domain
      to: email,
      subject: 'Welcome to Golanger Job Alerts',
      react: WelcomeEmail({ email, baseUrl: BASE_URL }),
    });
    console.log('Resend API response:', data);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in welcome email route:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      details: error.details || 'No additional details',
      validation: error instanceof z.ZodError ? error.errors : 'Not a validation error'
    });

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof z.ZodError ? 'Invalid email format' : 'Failed to send welcome email',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: error instanceof z.ZodError ? 400 : 500 }
    );
  }
}