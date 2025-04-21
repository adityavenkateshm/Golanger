import { Job } from '@/types'
import { supabase } from '../supabase'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export interface EmailSubscription {
  id: string
  email: string
  preferences?: {
    location_type?: string[]
    role_type?: string[]
    experience_level?: string[]
    salary_min?: number
  }
  created_at?: string
  updated_at?: string
}

async function sendWelcomeEmail(email: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/send-welcome-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to send welcome email');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

async function notifyAboutJob(job: Job, email: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/notify-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job, email }),
    });

    if (!response.ok) {
      throw new Error('Failed to send job notification');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending job notification:', error);
    throw error;
  }
}

export async function subscribeToJobs(email: string, preferences: EmailSubscription['preferences'] = {}) {
  try {
    const { data: existingSubscription, error: checkError } = await supabase
      .from('email_subscriptions')
      .select()
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking existing subscription:', checkError)
      throw new Error('Failed to check subscription status')
    }

    if (existingSubscription) {
      // Update existing subscription
      const { data: updatedData, error: updateError } = await supabase
        .from('email_subscriptions')
        .update({ preferences })
        .eq('email', email)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating subscription:', updateError)
        throw new Error('Failed to update subscription')
      }

      return updatedData
    }

    // Create new subscription
    const { data: newData, error: insertError } = await supabase
      .from('email_subscriptions')
      .insert([{ email, preferences }])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating subscription:', insertError)
      if (insertError.code === '23505') { // unique_violation
        throw new Error('This email is already subscribed')
      }
      throw new Error('Failed to create subscription')
    }

    // Send welcome email for new subscriptions
    try {
      await sendWelcomeEmail(email);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError)
      // Don't throw here - we still want to return the subscription even if email fails
    }

    return newData
  } catch (error: any) {
    console.error('Subscription error:', error)
    throw error
  }
}

export async function unsubscribeFromJobs(email: string) {
  const { error } = await supabase
    .from('email_subscriptions')
    .delete()
    .eq('email', email)

  if (error) {
    console.error('Error unsubscribing from jobs:', error)
    throw error
  }
}

export async function updateSubscriptionPreferences(
  email: string,
  preferences: EmailSubscription['preferences']
) {
  const { data, error } = await supabase
    .from('email_subscriptions')
    .update({ preferences })
    .eq('email', email)
    .select()
    .single()

  if (error) {
    console.error('Error updating subscription preferences:', error)
    throw error
  }

  return data
}

export async function notifySubscribersAboutNewJob(job: Job) {
  // Get all subscribers
  const { data: subscriptions, error } = await supabase
    .from('email_subscriptions')
    .select('*')

  if (error) {
    console.error('Error fetching subscribers:', error)
    throw error
  }

  // Filter subscribers based on preferences
  const eligibleSubscribers = subscriptions.filter((subscription: EmailSubscription) => {
    const prefs = subscription.preferences
    
    if (!prefs) return true // No preferences means they want all jobs
    
    if (prefs.location_type && !prefs.location_type.includes(job.location_type)) {
      return false
    }
    
    if (prefs.role_type && !prefs.role_type.includes(job.role_type)) {
      return false
    }
    
    if (prefs.experience_level && !prefs.experience_level.includes(job.experience_level)) {
      return false
    }
    
    if (prefs.salary_min && (!job.salary_min || job.salary_min < prefs.salary_min)) {
      return false
    }

    return true
  })

  // Send emails to eligible subscribers
  const emailPromises = eligibleSubscribers.map((subscriber: EmailSubscription) => 
    notifyAboutJob(job, subscriber.email)
  )

  await Promise.allSettled(emailPromises)
}