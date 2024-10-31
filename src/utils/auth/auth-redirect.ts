'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const publicPaths = ['/auth']

interface AuthRedirectProps {
  pathname: string
  token: string | null
}

export async function authRedirect({ pathname, token }: AuthRedirectProps) {
  const cookieStore = await cookies()
  const isAuthenticated = !!cookieStore.get('token')

  if (
    (isAuthenticated || token) &&
    publicPaths.some((authorizedPath) => pathname.startsWith(authorizedPath))
  ) {
    redirect('/')
  }

  if (
    !isAuthenticated &&
    !token &&
    !publicPaths.some((authorizedPath) => pathname.startsWith(authorizedPath))
  ) {
    redirect('/auth/sign-in')
  }
}
