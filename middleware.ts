// import { auth } from './auth'
// import { NextResponse } from 'next/server'

// export default auth((req) => {
//   const { pathname } = req.nextUrl

//   // Protect dashboard and form management routes
//   if (pathname.startsWith('/dashboard') || pathname.startsWith('/forms/create') || pathname.includes('/edit')) {
//     if (!req.auth) {
//       return NextResponse.redirect(new URL('/auth/login', req.url))
//     }
//   }

//   return NextResponse.next()
// })

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
//   ],
// }


import { auth } from './auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Protect dashboard and form management routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/forms/create') || pathname.includes('/edit')) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

// middleware.ts
// import { auth } from './auth'
// import { NextResponse } from 'next/server'

// export default auth((req) => {
//   const { pathname } = req.nextUrl
//   const isLoggedIn = !!req.auth

//   // Public routes - always allow
//   if (
//     pathname.startsWith('/api/auth') ||
//     pathname.startsWith('/auth/login') ||
//     pathname.startsWith('/auth/signup') ||
//     pathname.startsWith('/f/') ||
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/favicon.ico')
//   ) {
//     return NextResponse.next()
//   }

//   // Protected routes
//   const protectedRoutes = ['/dashboard', '/forms/create', '/admin']
//   const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

//   if (isProtectedRoute && !isLoggedIn) {
//     return NextResponse.redirect(new URL('/auth/login', req.url))
//   }

//   return NextResponse.next()
// })

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|public).*)',
//   ],
// }