import React, { useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import intl from 'react-intl-universal'
import { SUPPOER_LOCALES, set, reset } from '~/store/reducers/lang'
import { IRootState } from '~/store/IRootState'
import { getDeafultLangFromCookieOrNavigator } from '~/utils/multilingual/getDeafultLangFromCookieOrNavigator'
import Cookie from 'js-cookie'

const langCookieExpiresDays = process.env.REACT_APP_LANG_COOKIE_EXPIRES_IN_DAYS
  ? Number(process.env.REACT_APP_LANG_COOKIE_EXPIRES_IN_DAYS)
  : 1

interface ITranslatorProps {
  setLang: (l: string) => void;
  resetLang: () => void;
  currentLang: string;
  t: (str: string, opts?: any) => string;
  suppoerLocales: any; // Исправьте опечатку на supportLocales в будущем
}

export const withTranslator = <T,>(
  WrappedComponent: React.ComponentType<T & ITranslatorProps>
): React.FC<T> => {
  
  const Wrapper = (props: T): React.ReactElement => {
    const dispatch = useDispatch()

    // Оптимизация 1: Используем shallowEqual, чтобы useSelector не вызывал 
    // рендер, если структура объекта в Redux не изменилась
    const { current, suppoerLocales } = useSelector(
      (state: IRootState) => ({
        current: state.lang?.current,
        suppoerLocales: state.lang?.suppoerLocales || SUPPOER_LOCALES
      }),
      shallowEqual
    )

    const handleSetLang = useCallback((key: string) => {
      dispatch(set(key))
      Cookie.set('lang', key, {
        expires: langCookieExpiresDays,
        sameSite: 'strict',
      })
    }, [dispatch])

    const handleResetLang = useCallback(() => {
      dispatch(reset())
      Cookie.remove('lang')
    }, [dispatch])

    // Оптимизация 2: Убираем зависимость от [current]. 
    // Библиотека react-intl-universal берет текущий язык из своего внутреннего синглтона.
    // Сама функция перевода не должна менять свою ссылку в памяти.
    const getTranslatedText = useCallback((str: string, opts?: any) => {
      return intl.get(str, opts) || str
    }, [])

    // Оптимизация 3: Безопасная инициализация языка один раз при монтировании
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const fromCookieOfNavigator = getDeafultLangFromCookieOrNavigator(suppoerLocales)
        if (fromCookieOfNavigator) {
          dispatch(set(fromCookieOfNavigator))
        }
      }
    }, [dispatch, suppoerLocales])

    // Оптимизация 4: Мемоизируем пропсы переводчика, чтобы они не создавали 
    // новый объект при каждом рендере родительского компонента
    const translatorProps = useMemo(() => ({
      setLang: handleSetLang,
      resetLang: handleResetLang,
      currentLang: current,
      t: getTranslatedText,
      suppoerLocales: suppoerLocales
    }), [handleSetLang, handleResetLang, current, getTranslatedText, suppoerLocales])

    return <WrappedComponent {...props} {...translatorProps} />
  }

  // Задаем красивое имя для отладки в React DevTools
  Wrapper.displayName = `withTranslator(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return Wrapper
}
