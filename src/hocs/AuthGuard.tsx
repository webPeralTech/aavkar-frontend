'use client'

import { useEffect, useState } from 'react'
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'
import AuthRedirect from '@/components/AuthRedirect'
import { getToken } from '@/utils/auth'

export default function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const [hasToken, setHasToken] = useState<boolean | null>(null)

  useEffect(() => {
    setHasToken(!!getToken())
  }, [])
  console.log(hasToken)
  if (hasToken === null) {
    // Optionally show a loading spinner while checking
    return null
  }

  return <>{hasToken ? children : <AuthRedirect lang={locale} />}</>
}
