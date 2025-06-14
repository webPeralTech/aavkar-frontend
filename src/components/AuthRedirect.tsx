'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Type Imports
import type { Locale } from '@configs/i18n'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux-store'

const AuthRedirect = ({ lang }: { lang: Locale }) => {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const login = `/${lang}/login`
    const homePage = getLocalizedUrl(themeConfig.homePageUrl, lang)
    const redirectUrl = `/${lang}/login?redirectTo=${pathname}`

    if (pathname === login || pathname === homePage) {
      router.replace(login)
    } else {
      router.replace(redirectUrl)
    }
  }, [lang, pathname, router])

  return null
}

export default AuthRedirect
