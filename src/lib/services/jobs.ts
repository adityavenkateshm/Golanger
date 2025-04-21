import { Job, JobFilter } from '@/types'
import { supabase } from '../supabase'
import { notifySubscribersAboutNewJob } from './email'

export async function getJobs(filter?: JobFilter & { status?: Job['status'] }) {
  let query = supabase
    .from('jobs')
    .select('*')
    .order('posted_date', { ascending: false })
  
  // If no status filter is provided, only show approved jobs by default
  if (!filter?.status) {
    query = query.eq('status', 'approved')
  } else {
    query = query.eq('status', filter.status)
  }

  if (filter) {
    if (filter.search) {
      query = query.textSearch('search_vector', filter.search)
    }
    if (filter.location) {
      query = query.ilike('location', `%${filter.location}%`)
    }
    if (filter.location_type) {
      query = query.eq('location_type', filter.location_type)
    }
    if (filter.role_type) {
      query = query.eq('role_type', filter.role_type)
    }
    if (filter.experience_level) {
      query = query.eq('experience_level', filter.experience_level)
    }
    if (filter.salary_min) {
      query = query.gte('salary_min', filter.salary_min)
    }
    if (filter.salary_max) {
      query = query.lte('salary_max', filter.salary_max)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }

  return data as Job[]
}

export async function createJob(job: Omit<Job, 'id' | 'posted_date' | 'status'>) {
  const { data, error } = await supabase
    .from('jobs')
    .insert([
      {
        ...job,
        posted_date: new Date().toISOString(),
        status: 'pending' // New jobs start as pending
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating job:', error)
    throw error
  }

  // Send email notifications to subscribers
  try {
    await notifySubscribersAboutNewJob(data as Job)
  } catch (error) {
    console.error('Error sending job notifications:', error)
    // Don't throw here, as the job was created successfully
  }

  return data as Job
}

export async function getJobById(id: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching job:', error)
    throw error
  }

  return data as Job
}

export async function updateJob(id: string, job: Partial<Job>) {
  const { data, error } = await supabase
    .from('jobs')
    .update(job)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating job:', error)
    throw error
  }

  return data as Job
}