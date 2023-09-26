import React from 'react'
import styled from 'styled-components'
import { Icon } from '@/ui-kit/atoms/Icon'
import { BorderlessButton } from '@/ui-kit/atoms/BorderlessButton'

export const ClearIcon = ({ onClick }) => (
  <ClearButton size="20px" onClick={onClick}>
    <Icon name="x-close-circle" sizeVariation="14px mobile" />
  </ClearButton>
)

const ClearButton = styled(BorderlessButton)`
  position: absolute;
  right: 9px;
  top: 9px;
`
