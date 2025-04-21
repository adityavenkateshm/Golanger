import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { Roles } from '@/types';

// Create route matchers for protected and public routes
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isPublicRoute = createRouteMatcher(['/sign-in(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Skip auth check for public routes
  if (isPublicRoute(req)) {
    return;
  }

  // Get session claims which includes role information
  const sessionClaims = await auth().then(session => session.sessionClaims);
  const userRole = sessionClaims?.metadata?.role as Roles | undefined;

  // Protect admin routes
  if (isAdminRoute(req)) {
    if (!sessionClaims) {
      // No valid session, redirect to sign in
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // Check for admin or moderator role
    if (!(userRole === 'admin' || userRole === 'moderator')) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Don't run middleware on static files
    '/', // Run middleware on index page
    '/admin(.*)', // Explicitly match admin routes
    '/(api|trpc)(.*)', // Run middleware on API routes
  ],
};