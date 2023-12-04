import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { Button } from '@/ui-kit/atoms'
import Cookie from 'js-cookie'
import { withTranslator } from '~/hocs/withTranslator'
import {
  enable,
  disable,
  // reset,
} from '~/store/reducers/cookieOffer'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { useWindowSize } from '~/hooks/useWindowSize'

const confirmCookieExpiresDays = process.env.REACT_APP_CONFIRM_COOKIE_EXPIRES_IN_DAYS
  ? Number(process.env.REACT_APP_CONFIRM_COOKIE_EXPIRES_IN_DAYS)
  : 1

const CookiePolicyOfferWrapper = styled('div').attrs({
  className: 'backdrop-blur--dark',
})`
  z-index: 1000001;
  width: 100%;
  min-height: 70px;

  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  // background-color: rgba(0, 0, 0, 0.9);
`

const CookiePolicyOfferContent = styled('div')`
  width: 100%;
  max-width: 1000px;
  padding: 10px 20px 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  > div:first-child {
    margin-right: 20px;
  }
  > div > span,
  > div > a {
    font-size: 0.9em;
  }
  > div > a {
    color: #ff9000;
  }
`

export const CookiePolicyOffer = withTranslator(({
  // Translator:
  t,
}) => {
  const isOfferEnabled = useSelector((state: IRootState) => state.cookieOffer.isEnabled)
  const dispatch = useDispatch()
  const handleConfirm = useCallback(() => {
    Cookie.set('cookie-confirmed', '1', {
      expires: confirmCookieExpiresDays,
      sameSite: 'strict',
    })
    dispatch(disable())
  }, [])

  const { upMd } = useWindowSize()

  useEffect(() => {
    if (!!window && !Cookie.get('cookie-confirmed')) dispatch(enable())
  }, [typeof window])

  return (
    <>
      {isOfferEnabled && (
        <CookiePolicyOfferWrapper>
          <CookiePolicyOfferContent>
            <div>
              <span>{t('COOKIE_POLICY_TEXT')}.</span>{' '}
              <a
                className='cookie-policy-offer'
                target='_blank'
                rel='noreferrer'
                href='https://ru.wikipedia.org/wiki/Cookie'
              >
                {t('READ_MORE_HERE')}
              </a>
            </div>
            <div>
              <Button
                onClick={handleConfirm}
                typeName='orange'
                width='narrow'
                size='xsmall'
              >
                {upMd ? t('I_AGREE') : 'Ok'}
              </Button>
            </div>
          </CookiePolicyOfferContent>
        </CookiePolicyOfferWrapper>
      )}
    </>
  )
})
