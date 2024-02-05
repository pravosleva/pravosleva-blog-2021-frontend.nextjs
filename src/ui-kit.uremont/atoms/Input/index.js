import styled from 'styled-components'
import { getAttachedStyles, getBorderStyles, getCommonStyles, getEditableStyles } from './inputStyles'

export const Input = styled('input')` 
  ${(p) => getCommonStyles(p)}
  ${(p) => getBorderStyles(p)}
  ${(p) => getAttachedStyles(p)}
  ${(p) => getEditableStyles(p)}
`
