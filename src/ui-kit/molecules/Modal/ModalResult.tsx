import React from 'react'
import styled, { keyframes } from 'styled-components'
// import { withScreenType } from '@/hocs/with-screen-type'
import { themeColor, themeShadow, themeTextStyle, themeMediaQuery } from '@/ui-kit'
import { Button } from '@/ui-kit/atoms/Button'
import { SuccessModalIcon } from '@/ui-kit/atoms/Icons/SuccessModalIcon'
import { FailureModalIcon } from '@/ui-kit/atoms/Icons/FailureModalIcon'

interface IProps {
  isSuccess: boolean
  title: string
  text: string | React.ReactNode
  buttonText: string
  handleButtonClick: () => void
  isMobile?: boolean
}

export const ModalResult = ({ isSuccess, title, text, buttonText, handleButtonClick, isMobile = true }: IProps) => {
  return (
    <ModalContainer>
      <IconContainer>
        {isSuccess && <SuccessModalIcon />}
        {!isSuccess && <FailureModalIcon colorName="Incorrect" />}
      </IconContainer>
      <Title>{title}</Title>
      <Text>{text}</Text>
      <ButtonContainer>
        <Button width={isMobile ? 'responsive' : 'medium'} size="small" typeName="blue" onClick={handleButtonClick}>
          {buttonText}
        </Button>
      </ButtonContainer>
    </ModalContainer>
  )
}

const IconContainer = styled('div')`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  @media (max-width: ${themeMediaQuery('mobile', 'max')}) {
    padding-top: 40px;
  }
`

const Title = styled('div')`
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  ${themeTextStyle('18B H4')}
  color: ${themeColor('Dark Black')};
  margin-bottom: 20px;
`

const Text = styled('div')`
  width: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  text-align: center;
  padding: 0 44px;
  ${themeTextStyle('14Medium Sub')}
  color: ${themeColor('Dark Black')};
  margin-bottom: 20px;

  word-break: break-word;
  white-space: pre-wrap;

  max-height: 300px;
  overflow-y: auto;
`

const ButtonContainer = styled('div')`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: ${themeMediaQuery('mobile', 'max')}) {
    flex-direction: column;
    margin-top: 50px;
  }
`

const fadeIn = keyframes`
  from { opacity: 0 };
  to { opacity: 1 };
`

const ModalContainer = styled('div')`
  box-sizing: border-box;
  > * {
    box-sizing: border-box;
  }
  padding: 28px 20px;
  width: 100%;
  background: ${themeColor('White')};
  border-radius: 6px;
  box-shadow: ${themeShadow('Main Shadow')};
  @media (max-width: ${themeMediaQuery('mobile', 'max')}) {
    padding: 40px 15px 20px 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  animation: ${fadeIn} 0.3s ease-in-out;
`
