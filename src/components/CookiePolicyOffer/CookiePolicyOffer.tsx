import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from '~/ui-kit.uremont/atoms'
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
import classes from './CookiePolicyOffer.module.scss'

const confirmCookieExpiresDays = process.env.REACT_APP_CONFIRM_COOKIE_EXPIRES_IN_DAYS
  ? Number(process.env.REACT_APP_CONFIRM_COOKIE_EXPIRES_IN_DAYS)
  : 1

const CookiePolicyOfferWrapper = styled('div').attrs({
  className: 'backdrop-blur--dark',
})`
  z-index: 1000001;
  width: 100%;
  min-height: 70px;

  position: fixed;
  bottom: 0;
  // bottom: calc(0px + env(safe-area-inset-bottom, 0px));
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  // background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
`

const CookiePolicyOfferContent = styled('div').attrs({
  className: classes.content,
})`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  
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

export const CookiePolicyOffer = withTranslator(({ t }) => {
  const isOfferEnabled = useSelector((state: IRootState) => state.cookieOffer.isEnabled)
  const dispatch = useDispatch()
  
  // Добавляем флаг, чтобы дождаться монтирования в браузере (защита от Hydration Mismatch)
  const [isMounted, setIsMounted] = useState(false)

  // Оптимизация 1: Чистый перенос проверки куки в момент монтирования
  useEffect(() => {
    setIsMounted(true)
    const isConfirmed = Cookie.get('cookie-confirmed')
    if (!isConfirmed) {
      dispatch(enable())
    }
  }, [dispatch])

  // Оптимизация 2: Стабильная ссылка на обработчик клика
  const handleConfirm = useCallback(() => {
    Cookie.set('cookie-confirmed', '1', {
      expires: confirmCookieExpiresDays,
      sameSite: 'strict',
    })
    dispatch(disable())
  }, [dispatch])

  // Заглушка: На сервере возвращаем null, чтобы HTML совпадал при первой сборке
  if (!isMounted) return null

  return (
    <>
      {isOfferEnabled && (
        <CookiePolicyOfferWrapper>
          <CookiePolicyOfferContent className={classes.contentWrapper}>
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
              {/* Вместо динамического t('I_AGREE') / 'Ok' на основе ширины экрана (которая неизвестна на сервере), */}
              {/* теперь это безопасно рендерится в браузере, так как сработал if(!isMounted) */}
              <Button
                onClick={handleConfirm}
                typeName='orange'
                width='narrow'
                size='xsmall'
              >
                {/* Использование windowSize здесь теперь безопасно */}
                {window.innerWidth > 768 ? t('I_AGREE') : 'Ok'}
              </Button>
            </div>
          </CookiePolicyOfferContent>
        </CookiePolicyOfferWrapper>
      )}
    </>
  )
})
