import React, { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import intl from 'react-intl-universal'
import { SUPPOER_LOCALES, set, reset } from '~/store/reducers/lang'
import { IRootState } from '~/store/IRootState'
import { getDeafultLangFromCookieOrNavigator } from '~/utils/multilingual/getDeafultLangFromCookieOrNavigator'
import Cookie from 'js-cookie'

const langCookieExpiresDays = process.env.REACT_APP_LANG_COOKIE_EXPIRES_IN_DAYS
  ? Number(process.env.REACT_APP_LANG_COOKIE_EXPIRES_IN_DAYS)
  : 1

interface ITranslatorProps {
  setLang: (l: any) => void;
  resetLang: () => void;
  currentLang: string;
  t: (str: string, opts?: any) => string;
  suppoerLocales: any;
}

export const withTranslator = <T,>(
  WrappedComponent: React.FC<T & ITranslatorProps & { children?: React.ReactNode; }>
): React.FC<T> => {
  const Wrapper = (props: T): React.ReactElement<T, any> => {
    const current = useSelector((state: IRootState) => state.lang?.current)
    const suppoerLocales = useSelector((state: IRootState) => state.lang?.suppoerLocales || SUPPOER_LOCALES)
    const dispatch = useDispatch()

    const handleSetLang = useCallback((key: string) => {
      dispatch(set(key))

      const res = Cookie.set(
        'lang',
        key,
        {
          expires: langCookieExpiresDays,
          sameSite: 'strict',
        }
      )
      console.log(res)
    }, [])
    const handleResetLang = useCallback(() => {
      dispatch(reset())
      Cookie.remove('lang')
    }, [])
    const getTranslatedText = useCallback((str: string, opts: any) => {
      // console.groupCollapsed(`${str} <- ${current}`)
      const result = intl.get(str, opts)
      // console.log(result)
      // console.groupEnd()
      return result
    }, [current])

    useEffect(() => {
      if (process.browser) {
        // const fromCookie = Cookie.get('lang')
        const fromCookieOfNavigator = getDeafultLangFromCookieOrNavigator(suppoerLocales)

        if (!!fromCookieOfNavigator) dispatch(set(fromCookieOfNavigator))
      }
    }, [process.browser])

    return (
      <WrappedComponent
        {...(props as T)}
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
