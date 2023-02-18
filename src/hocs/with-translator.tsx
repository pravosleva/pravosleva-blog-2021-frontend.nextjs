import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Cookie from 'js-cookie'
import intl from 'react-intl-universal'
import { SUPPOER_LOCALES, langActions } from '~/store/reducers/lang'
import { IRootState } from '~/store/IRootState'
// import { getDeafultLangFromCookieOrNavigator } from '@/utils/multilingual/getDeafultLangFromCookieOrNavigator'

const langCookieExpiresDays = process.env.REACT_APP_LANG_COOKIE_EXPIRES_IN_DAYS
  ? Number(process.env.REACT_APP_LANG_COOKIE_EXPIRES_IN_DAYS)
  : 0

export const withTranslator = (WrappedComponent: any) => {
  const Wrapper = (props: any) => {
    const current = useSelector((state: IRootState) => state.lang?.current || 'ru-RU')
    const suppoerLocales = useSelector((state: IRootState) => state.lang?.suppoerLocales || SUPPOER_LOCALES)
    const dispatch = useDispatch()

    useEffect(() => {
      if (process.browser) {
        const fromCookie = Cookie.get('lang')
        // const fromCookieOfNavigator = getDeafultLangFromCookieOrNavigator(suppoerLocales)

        if (!!fromCookie) dispatch(langActions.set(fromCookie))
      }
    }, [process.browser])

    const handleSetLang = useCallback((key: string) => {
      dispatch(langActions.set(key))
      Cookie.set('lang', key, { expires: langCookieExpiresDays, sameSite: 'strict' })
    }, [])
    const handleResetLang = useCallback(() => {
      dispatch(langActions.reset())
      Cookie.remove('lang')
    }, [])
    const getTranslatedText = useCallback((str: string, opts: any) => intl.get(str, opts), [current])

    return (
      <WrappedComponent
        {...props}
        setLang={handleSetLang}
        resetLang={handleResetLang}
        currentLang={current}
        t={getTranslatedText}
        suppoerLocales={suppoerLocales}
      />
    )
  }

  return Wrapper
}
