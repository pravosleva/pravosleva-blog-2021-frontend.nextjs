import React from 'react'
// import PropTypes from 'prop-types';
// import { keys } from 'ramda'
// import styled, { css } from 'styled-components'
// import ScrollLock, { TouchScrollable } from 'react-scrolllock';
import { ModalWindow } from './components/ModalWindow'
import { CloseBtnContainer } from './components/CloseBtnContainer'
// import { themeColor, themeShadow, themeMediaQuery } from '@/ui-kit.uremont/Theme'
import { Dimmer } from '~/ui-kit.uremont/atoms'
import { CloseButton } from '~/ui-kit.uremont/atoms/CloseButton'
import { ESize } from '../Modal/components/ModalContent'

// const sizes = {
//   small: 440,
//   large: 800,
//   superLarge: 1400,
// }

interface IProps {
  size?: ESize;
  width: number; // '440px' for example
  onCloseClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) &
    ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void);
  children: React.ReactNode;
  noBackground?: boolean;
  noCloseOnDimmerClick?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) &
    ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void);
}

const stopClickPropagation = (e: any) => {
  e.stopPropagation()
}

export const ModalBase = ({
  size = ESize.SMALL,
  width,
  onCloseClick,
  children,
  noBackground,
  noCloseOnDimmerClick,
}: IProps) => (
  <Dimmer
    onClick={!noCloseOnDimmerClick ? onCloseClick : undefined}
  >
    <ModalWindow
      size={size}
      width={width}
      onClick={stopClickPropagation}
      noBackground={noBackground}
    >
      <CloseBtnContainer>
        <CloseButton onClick={onCloseClick} />
      </CloseBtnContainer>
      {children}
    </ModalWindow>
  </Dimmer>
)
