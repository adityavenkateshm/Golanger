'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { getJobById } from '@/lib/services/jobs'
import { Job } from '@/types'

const BREADCRUMB_MAPPING: { [key: string]: string } = {
  'post': 'Post Job',
  'profile': 'Profile',
  'profiles': 'Developers',
  'admin': 'Admin',
  'sign-in': 'Sign In',
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...'
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const [jobTitle, setJobTitle] = useState<string | null>(null)
  const [isLoadingJob, setIsLoadingJob] = useState(false)

  useEffect(() => {
    async function fetchJobTitle() {
      // Match both /jobs/[id] and just /[id] patterns since we're removing 'jobs' from display
      const match = pathname.match(/^\/(?:jobs\/)?([^\/]+)$/)
      if (!match) {
        setJobTitle(null)
        return
      }

      const jobId = match[1]
      
      // Skip fetching if this isn't actually a job page
      if (['post', 'profile', 'profiles', 'admin', 'sign-in'].includes(jobId)) {
        return
      }

      setIsLoadingJob(true)
      try {
        const job = await getJobById(jobId)
        setJobTitle(job.title)
      } catch (error) {
        console.error('Error fetching job title:', error)
      } finally {
        setIsLoadingJob(false)
      }
    }

    fetchJobTitle()
  }, [pathname])
  
  // Skip rendering breadcrumbs on home page
  if (pathname === '/') return null
  
  const pathSegments = pathname
    .split('/')
    .filter(segment => segment !== '' && segment !== 'jobs') // Filter out empty segments and 'jobs'
    .map(segment => {
      // Special handling for job detail pages - now matches the ID directly
      if (!['post', 'profile', 'profiles', 'admin', 'sign-in'].includes(segment)) {
        return {
          name: isLoadingJob ? 'Loading...' : (jobTitle ? truncateText(jobTitle, 40) : segment),
          href: pathname,
          current: true
        }
      }

      return {
        name: BREADCRUMB_MAPPING[segment] || segment,
        href: pathname.substring(0, pathname.indexOf(segment) + segment.length),
        current: pathname.endsWith(segment)
      }
    })

  return (
    <nav className="flex px-4 py-2 border-b border-white/5 bg-slate-900/50 backdrop-blur-sm" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2 text-sm">
        <li>
          <div>
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>
          </div>
        </li>
        {pathSegments.map((segment) => (
          <Fragment key={segment.href}>
            <li>
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
                {segment.current ? (
                  <span
                    className="ml-2 text-sm font-medium text-white truncate max-w-[200px]"
                    aria-current="page"
                  >
                    {segment.name}
                  </span>
                ) : (
                  <Link
                    href={segment.href}
                    className="ml-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {segment.name}
                  </Link>
                )}
              </div>
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}