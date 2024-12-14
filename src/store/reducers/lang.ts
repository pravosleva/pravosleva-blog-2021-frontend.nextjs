import intl from 'react-intl-universal'
import enUS from '~/public/static/locales/en-US.json'
import ruRU from '~/public/static/locales/ru-RU.json'
// Others...
import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper"
// import { IRootState } from '~/store/IRootState'
import { getDeafultLangFromCookieOrNavigator } from '~/utils/multilingual/getDeafultLangFromCookieOrNavigator'

export const SUPPOER_LOCALES = [
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
export const hasInSuppoerLocales = (value: string): boolean => SUPPOER_LOCALES.some((l) => l.value === value)

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
translateFnInit(getDeafultLangFromCookieOrNavigator(SUPPOER_LOCALES, 'ru-RU')) // First init

export const initialState = {
  current: getDeafultLangFromCookieOrNavigator(SUPPOER_LOCALES, 'ru-RU'),
  suppoerLocales: SUPPOER_LOCALES,
}

export const langSlice: any = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    set: (state, action) => {
      state.current = action.payload
      translateFnInit(action.payload)
    },
    reset: (state) => {
      state.current = initialState.current
      translateFnInit()
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.lang,
      };
    },
  },
})

export const {
  set,
  reset,
} = langSlice.actions

export const reducer = langSlice.reducer
