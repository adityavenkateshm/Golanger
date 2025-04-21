'use client'

import { useState } from 'react'

interface JobSubscribeFormProps {
  inline?: boolean
}

export function JobSubscribeForm({ inline }: JobSubscribeFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          preferences: {
            location_type: [],
            role_type: [],
            experience_level: [],
            salary_min: undefined
          }
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to subscribe')
      }
      
      setSuccess(true)
      setEmail('')
    } catch (err: any) {
      console.error('Subscription error:', err)
      setError(err.message || 'Failed to subscribe - please try again')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={inline ? 'inline-block' : ''}>
        <p className="text-green-500">
          Thanks for subscribing! Check your inbox for job alerts.
        </p>
      </div>
    )
  }

  return (
    <div className={inline ? 'inline-block' : ''}>
      <form onSubmit={handleSubmit} className="flex gap-2 sm:flex-row flex-col items-center justify-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap sm:mt-0 mt-2 sm:ml-2 sm:w-auto w-full flex-shrink-0 flex items-center justify-center gap-2 text-white"
        >
          {loading ? 'Subscribing...' : 'Get Job Alerts'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}