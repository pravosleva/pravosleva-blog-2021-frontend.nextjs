import Cookie from 'js-cookie'
import { hasInSuppoerLocales } from '~/store/reducers/lang'

type TLang = {
  label: string;
  guLabel: string;
  name: string;
  value: string;
  svgSrc: string;
}

export const getDeafultLangFromCookieOrNavigator = (_SUPPOER_LOCALES: TLang[], defaultLang?: string | undefined) => {
  let _defaultLang = defaultLang || 'ru-RU'
  let detectedLang: string | undefined

  if (typeof window !== 'undefined') {
    detectedLang = Cookie.get('lang')
    if (!!detectedLang && !hasInSuppoerLocales(detectedLang)) detectedLang = undefined
    if (!detectedLang && !!navigator) {
      try {
        const fromNavigator = navigator.language // || navigator.userLanguage?

        if (hasInSuppoerLocales(fromNavigator)) detectedLang = fromNavigator
      } catch (err) {
        console.log(err)
      }
    }
  }

  return detectedLang || _defaultLang
}