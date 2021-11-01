import { createSymbiote } from 'redux-symbiote'
import intl from 'react-intl-universal'
import enUS from '~/public/static/locales/en-US.json'
import ruRU from '~/public/static/locales/ru-RU.json'
// Others...

const SUPPOER_LOCALES = [
  {
    label: 'RU',
    guLabel: 'RUS',
    name: 'Русский',
    value: 'ru-RU',
    svgSrc: '/static/img/covid-trash/gosuslugi-lang-rus.svg',
  },
  {
    label: 'EN',
    guLabel: 'ENG',
    name: 'English',
    value: 'en-US',
    svgSrc: '/static/img/covid-trash/gosuslugi-lang-eng.svg',
  },
  // Others...
]
const translateFnInit = (lang?: string) => {
  intl
    .init({
      currentLocale: lang || 'ru-RU',
      locales: {
        'ru-RU': ruRU,
        'en-US': enUS,
        // Others...
      },
    })
    .then(() => {
      // Default example comment: After loading CLDR locale data, start to render
      // For example: initDone -> true
    })
    .catch((_err) => {
      // console.log(err)
    })
  return (str: string) => intl.get(str)
}
translateFnInit() // First init

export const initialState = {
  current: 'ru-RU',
  suppoerLocales: SUPPOER_LOCALES,
}

export const { actions: langActions, reducer: lang } = createSymbiote(
  initialState,
  {
    set: (state, payload) => {
      translateFnInit(payload)

      return {
        ...state,
        current: payload,
      }
    },
    reset: () => {
      translateFnInit()

      return { ...initialState }
    },
  },
  'lang'
)
