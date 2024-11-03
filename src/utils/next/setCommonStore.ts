import { enableBrowserMemoryMonitor } from '~/store/reducers/customDevTools'
import { set as setLang } from '~/store/reducers/lang'
import { setTheme } from '~/store/reducers/globalTheme'
import { TBaseProps } from './types'
import { setBaseProps } from '~/store/reducers/baseProps'

type TProps = {
  store: any;
  baseProps: TBaseProps;
}

export const setCommonStore = ({ store, baseProps }: TProps) => {
  // NOTE: 1. Client perf UI
  if (baseProps.devTools.isClientPerfWidgetOpened)
    store.dispatch(enableBrowserMemoryMonitor())

  // NOTE: 2. Lang
  if (!!baseProps.langData.fromCookies)
    store.dispatch(setLang(baseProps.langData.fromCookies))
  else store.dispatch(setLang(baseProps.langData.default))

  // NOTE: 3. Theme
  if (!!baseProps.themeData.fromCookies)
    store.dispatch(setTheme(baseProps.themeData.fromCookies))
  else store.dispatch(setTheme(baseProps.themeData.default))

  // NOTE: Other common props
  store.dispatch(setBaseProps(baseProps))
}
