export interface Job {
  id: string
  title: string
  company: string
  company_logo?: string | null
  location: string
  location_type: 'remote' | 'onsite' | 'hybrid'
  description: string
  role_type: 'full-time' | 'part-time' | 'contract'
  experience_level: 'entry' | 'mid' | 'senior' | 'lead'
  application_url?: string | null
  go_version?: string | null
  requirements: string[]
  tech_stack: string[]
  salary_min?: number | null
  salary_max?: number | null
  salary_currency: string
  posted_date: string
  status: 'pending' | 'active' | 'expired'
}

export interface JobFilter {
  search?: string
  location?: string
  location_type?: Job['location_type']
  role_type?: Job['role_type']
  experience_level?: Job['experience_level']
  salary_min?: number
  salary_max?: number
}

export interface Application {
  id: string
  job_id: string
  user_id: string
  resume_url: string
  cover_letter?: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  applied_date: string
}

export type Roles = 'admin' | 'moderator' | 'user';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}