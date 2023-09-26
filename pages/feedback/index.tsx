import {
  Container,
  // Stack, Typography,
} from '@mui/material'
// import Link from '~/components/Link'
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Recaptcha } from '~/components/Recaptcha'
import { useInput } from '~/hooks/useInput'
import { Layout } from '~/components/Layout'
// import styled from 'styled-components'
import { useRouter } from 'next/router'
import { loadReCaptcha } from 'react-recaptcha-v3'
import { universalHttpClient } from '~/utils/universalHttpClient'
// import { showAsyncToast } from '@/actions'
import { withTranslator } from '~/hocs/withTranslator'
// import { metrics } from '@/constants'

const isProd = process.env.NODE_ENV === 'production'

const RECAPTCHAV3_CLIENT_KEY = process.env.RECAPTCHAV3_CLIENT_KEY || 'ERR:RECAPTCHAV3_CLIENT_KEY'
const RECAPTCHAV3_VERIFY_URL = process.env.RECAPTCHAV3_VERIFY_URL || 'ERR:RECAPTCHAV3_VERIFY_URL'
const recaptchaScoreLimit = 0.9

const Feedback = ({ t }: any) => {
  const router = useRouter()
  const [wasSent, setWasSent] = useState(false)
  const [isRecaptchaShowed, setIsRecaptchaShowed] = useState(false)
  const { value: companyName, bind: bindCompanyName } = useInput('')
  const { value: contactName, bind: bindContactName, reset: resetContactName } = useInput('')
  const { value: comment, bind: bindComment, reset: resetComment } = useInput('')
  const showRecaptcha = (e: any) => {
    e.preventDefault()
    setIsRecaptchaShowed(true)
  }
  const send = useCallback(
    async (token: string): Promise<string> => {
      const verifyResult = await universalHttpClient.post(
        RECAPTCHAV3_VERIFY_URL,
        new URLSearchParams({
          captcha: token,
        })
      )
      
      try {
        if (verifyResult.isOk) {
          if (verifyResult?.response.original?.score >= recaptchaScoreLimit) {
            if (typeof window !== 'undefined' && isProd) {
              // @ts-ignore
              // ym(
              //   metrics.yaCounter,
              //   'reachGoal',
              //   'send_feedback',
              //   undefined,
              //   () => {
              //     // eslint-disable-next-line no-console
              //     console.log('ym: [send_feedback] done')
              //   }
              // )
            }
            const newEntryResult = await universalHttpClient.post(
              '/express-helper/pravosleva-blog-2023/blog/feedback',
              new URLSearchParams({
                companyName,
                contactName,
                comment,
              })
            )

            if (newEntryResult.isOk)
              return Promise.resolve('New Entry created')
            else
              throw newEntryResult?.response || newEntryResult?.msg || 'No message'
          } else
            throw new Error(`Bot detected! Your score by Google ${verifyResult?.response.original?.score}. Humans limit was set to ${recaptchaScoreLimit}`)
        }
      } catch (err: any) {
        return Promise.reject(typeof err === 'string' ? err : (err?.message || 'ERR2: Что-то пошло не так...'))
      }

      return Promise.reject(verifyResult?.msg)
    },
    [comment, companyName, contactName]
  )
  const dispatch = useDispatch()
  const onResolved = useCallback(
    async(token) => {
      return await send(token)
        .then((_msg) => {
          // dispatch(showAsyncToast({ text: msg, delay: 7000, type: 'success' }))
          // resetCompanyName()
          resetContactName()
          resetComment()
        })
        .then(() => {
          setIsRecaptchaShowed(false)
          setWasSent(true)
        })
        .then(() => {
          router.push('/feedback/thanks')
        })
        .catch((text) => {
          try {
            if (!!text && typeof text === 'string') localStorage.setItem('_tmp.error-message', text)
          } catch (err) {
            console.log(err)
          }
          // dispatch(showAsyncToast({ text, delay: 10000, type: 'error' }))
          router.push('/feedback/sorry')
        })
    },
    [dispatch, resetComment, resetContactName, router, send]
  )
  useEffect(() => {
    if (process.browser) {
      loadReCaptcha(RECAPTCHAV3_CLIENT_KEY)
      // dispatch(
      //   showAsyncToast({
      //     text: t('FEEDBACK_PAGE_IN_PROGRESS'),
      //     delay: 60000,
      //     type: 'warning',
      //     isClosable: true,
      //     actions: [
      //       {
      //         label: t('GO_BACK_TO_THE_HOMEPAGE'),
      //         linkParams: {
      //           asButton: true,
      //           btnTypeName: 'secondaryWhite',
      //           path: '/',
      //           isInternalLink: true,
      //         },
      //       },
      //       // {
      //       //   label: t('GO_BACK_TO_THE_HOMEPAGE'),
      //       //   buttonParams: {
      //       //     cb: () => console.log('text'),
      //       //   },
      //       // },
      //       // {
      //       //   label: 'yandex',
      //       //   linkParams: {
      //       //     asButton: true,
      //       //     path: 'https://yandex.ru',
      //       //     isInternalLink: false,
      //       //   },
      //       // },
      //     ],
      //   })
      // )
    }
    return () => {
      if (process.browser) {
        // Derty hack =)
        if (!!document.querySelector('.grecaptcha-badge')?.parentElement) {
          // @ts-ignore
          document.querySelector('.grecaptcha-badge').parentElement.remove()
        }
      }
    }
  }, [])

  return (
    <Layout>
      <Container className="box" maxWidth='sm'>
        {!wasSent && (
          <form onSubmit={showRecaptcha}>
            <h2 className="gradient-animate-effect">{t('FEEDBACK')}</h2>
            <div className="inputBox">
              <input maxLength={50} name="companyName" placeholder="invisible" {...bindCompanyName} required />
              <label>{t('COMPANY_NAME')} / {50 - companyName.length} left</label>
            </div>
            <div className="inputBox">
              <input disabled={companyName.length === 0} maxLength={50} name="contactName" placeholder="invisible" {...bindContactName} required />
              <label>{t('YOUR_NAME')} / {50 - contactName.length} left</label>
            </div>
            <div className="inputBox">
              <textarea disabled={companyName.length === 0 || contactName.length === 0} maxLength={3000} name="comment" placeholder="invisible" {...bindComment} required />
              <label>{t('COMMENT')} / {3000 - comment.length} left</label>
            </div>
            <div className="special-link-wrapper fade-in-effect unselectable">
              <button className="rippled-btn" type="submit">
                {t('SUBMIT')}
              </button>
              {isRecaptchaShowed && <Recaptcha onSuccess={onResolved} action="feedback" />}
            </div>
          </form>
        )}
      </Container>
    </Layout>
  )
}

export default withTranslator(Feedback)
