'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { z } from 'zod'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    async function handleUnsubscribe() {
      const email = searchParams.get('email')
      if (!email) {
        setError('No email address provided')
        setStatus('error')
        return
      }

      try {
        // Validate email
        z.string().email().parse(email)

        const response = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })

        if (!response.ok) {
          throw new Error('Failed to unsubscribe')
        }

        setStatus('success')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to unsubscribe')
        setStatus('error')
      }
    }

    handleUnsubscribe()
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        {status === 'loading' && (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/5 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-white/5 rounded w-1/2 mx-auto"></div>
          </div>
        )}

        {status === 'success' && (
          <>
            <h1 className="text-3xl font-bold mb-4">Successfully Unsubscribed</h1>
            <p className="text-gray-400 mb-8">
              You have been unsubscribed from Golang job alerts. We're sorry to see you go!
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
            >
              Return to Homepage
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-red-500">Unsubscribe Failed</h1>
            <p className="text-gray-400 mb-8">
              {error || 'Something went wrong while trying to unsubscribe. Please try again.'}
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
            >
              Return to Homepage
            </a>
          </>
        )}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-white/5 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}