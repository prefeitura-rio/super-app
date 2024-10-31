'use client'

import { usePathname, useSearchParams } from 'next/navigation'

import { authRedirect } from './auth-redirect'

export function AuthWithSearchParams() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  authRedirect({
    pathname,
    token,
  })

  return null
}
