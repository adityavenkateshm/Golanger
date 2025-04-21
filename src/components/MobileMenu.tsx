'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }

    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [isOpen])

  return (
    <div className="flex items-center gap-4 md:hidden">
      {/* User button for mobile */}
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8" // Slightly smaller for mobile
            }
          }}
        />
      </SignedIn>

      {/* Hamburger menu */}
      <div ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-300 hover:text-white focus:outline-none transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Mobile menu panel */}
        <div
          className={`fixed right-0 top-0 h-full w-64 bg-slate-800 z-50 transform transition-transform duration-200 ease-in-out shadow-xl ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white focus:outline-none transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="p-6 pt-14 space-y-6">
            <div className="border-b border-white/10 pb-2">
              <Link
                href="/"
                className="block text-gray-300 hover:text-white py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/jobs/post"
                className="block text-gray-300 hover:text-white py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Post a Job
              </Link>
            </div>
            
            <div className="space-y-4">
              {/* <SignedIn>
                <Link
                  href="/profile"
                  className="block text-gray-300 hover:text-white py-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
              </SignedIn> */}
              <SignedOut>
                <div className="space-y-4">
                  <SignInButton mode="modal">
                    <button className="w-full text-left text-gray-300 hover:text-white py-2 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}