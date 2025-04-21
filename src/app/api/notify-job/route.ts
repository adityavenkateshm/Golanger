import { Resend } from 'resend';
import { NewJobEmail } from '@/components/emails/NewJobEmail';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Job } from '@/types';

// Initialize Resend with logging
const RESEND_API_KEY = process.env.RESEND_API_KEY;
console.log('Initializing Resend with API key:', RESEND_API_KEY ? 'API key present' : 'API key missing');
const resend = new Resend(RESEND_API_KEY);

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const notifyJobSchema = z.object({
  job: z.object({
    id: z.string(),
    title: z.string(),
    company: z.string(),
    company_logo: z.string().nullable().optional(),
    description: z.string(),
    location: z.string(),
    location_type: z.enum(['remote', 'onsite', 'hybrid']),
    role_type: z.enum(['full-time', 'part-time', 'contract']),
    experience_level: z.enum(['entry', 'mid', 'senior', 'lead']),
    requirements: z.array(z.string()),
    tech_stack: z.array(z.string()),
    application_url: z.string().nullable().optional(),
    go_version: z.string().nullable().optional(),
    salary_min: z.number().nullable().optional(),
    salary_max: z.number().nullable().optional(),
    salary_currency: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    contact_email: z.string().email().optional(),
    company_url: z.string().url().optional(),
    posted_date: z.string(),
    status: z.enum(['pending', 'active', 'expired'])
  }),
  email: z.string().email(),
});

export async function POST(request: Request) {
  console.log('Received job notification request');
  
  try {
    const body = await request.json();
    console.log('Request body:', {
      ...body,
      job: body.job ? {
        ...body.job,
        description: body.job.description?.length + ' chars' // Truncate long description in logs
      } : undefined
    });

    const { job, email } = notifyJobSchema.parse(body);
    console.log('Validated data:', { 
      email,
      jobTitle: job.title,
      company: job.company
    });

    console.log('Attempting to send job notification email...');
    const data = await resend.emails.send({
      from: 'Resend <onboarding@resend.dev>', // Using Resend's sandbox domain
      to: email,
      subject: `New Golang Job: ${job.title} at ${job.company}`,
      react: NewJobEmail({ job, baseUrl: BASE_URL }),
    });
    console.log('Resend API response:', data);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in job notification route:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      details: error.details || 'No additional details',
      validation: error instanceof z.ZodError ? error.errors : 'Not a validation error'
    });

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof z.ZodError ? 'Invalid job notification data' : 'Failed to send job notification',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: error instanceof z.ZodError ? 400 : 500 }
    );
  }
}