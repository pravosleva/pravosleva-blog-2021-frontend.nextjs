import { IStyles, IColorsMapping } from './types'

// Like https://github.com/brunobertolini/styled-by
export const styledBy = (property: string, mapping: IColorsMapping) => (
  props: IStyles
) => mapping[props[property]]
