'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { authRedirect } from './auth-redirect'

function GetSearchParamsAndVerifyAuth() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  authRedirect({
    pathname,
    token,
  })

  return null
}

export function AuthWithSearchParams() {
  return (
    <Suspense>
      <GetSearchParamsAndVerifyAuth />
    </Suspense>
  )
}