import { useEffect } from "react"
// import { useDispatch } from "react-redux"
import { useGlobalTheming } from "~/hooks/useGlobalTheming"
// import {
//   // SUPPOER_LOCALES, set,
//   reset,
// } from '~/store/reducers/lang'
// dispatch(reset())

export const useLightThemeAlways = () => {
  // const dispatch = useDispatch()
  const { onReset } = useGlobalTheming()

  useEffect(() => {
    onReset()
  }, [])
}
