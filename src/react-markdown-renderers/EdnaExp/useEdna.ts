import { ednaEngine } from './ednaEngine'
import { useReactiveValue0 } from '~/utils/reactive-engine'
import { EdnaScriptService } from './EdnaScriptService'

export const useEdna = () => {
  const ednaService = ednaEngine.inject(EdnaScriptService)

  const status = useReactiveValue0(ednaService.status)
  const error = useReactiveValue0(ednaService.error)
  const warning = useReactiveValue0(ednaService.warning)
  const isWidgetApiReady = useReactiveValue0(ednaService.isWidgetApiReady)
  const isActionDisabled = useReactiveValue0(ednaService.isActionDisabled)
  
  // Добавляем новые подписки под новые методы контроля
  const widgetBadge = useReactiveValue0(ednaService.widgetBadge)
  const widgetTheme = useReactiveValue0(ednaService.widgetTheme)
  
  return {
    status,
    error,
    warning,
    isWidgetApiReady,
    isActionDisabled,
    widgetBadge,
    widgetTheme,
  }
}
