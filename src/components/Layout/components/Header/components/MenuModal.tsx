import React, { useCallback } from 'react'
import { Modal } from '~/ui-kit.uremont'
import { FooterRow } from '~/ui-kit.uremont/molecules/Modal/FooterRow'
import { Button } from '~/ui-kit.uremont/atoms'
import Link from 'next/link'
import { isCurrentPath } from '~/utils/routing/isCurrentPath'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { withTranslator } from '@/hocs/withTranslator'
import Cookie from 'js-cookie'
// import { logout } from '@/helpers/services/restService'
import { useDispatch } from 'react-redux'
// import { showAsyncToast } from '@/actions'
import { useDebouncedCallback } from '~/hooks/useDebouncedCallback'
// import { userInfoActions } from '@/store/reducers/user-info'
import { useGlobalTheming } from '~/hooks/useGlobalTheming'
import { enable } from '~/store/reducers/cookieOffer'
import { ESize } from '~/ui-kit.uremont/organisms/Modal/components/ModalContent'

interface IProps {
  isOpened: boolean
  onHideModal: () => void
  isAuthenticated: boolean
  // t: (text: string) => string
  // resetLang: () => void
}

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const menuItems = ({ isCurrentPathCb, isAuthenticated, t, onHideModal }: any) => (
  <Wrapper>
    <h5 style={{ margin: '0 0 16px 0', fontFamily: 'Montserrat' }}>{t('MENU_MAIN')}</h5>

    {!isCurrentPathCb('/subprojects/audit-list') && (
      <Link href="/subprojects/audit-list" as="/subprojects/audit-list">
        <a onClick={onHideModal}>{t('AUDITLIST_OFFLINE')}</a>
      </Link>
    )}
    {!isCurrentPathCb('/blog/article/team-scoring') && (
      <Link href="/blog/article/team-scoring" as="/blog/article/team-scoring">
        <a onClick={onHideModal}>About Team Scoring 2019</a>
      </Link>
    )}
    {/* !isCurrentPathCb('/') && (
      <Link href="/" as="/">
        <a onClick={onHideModal}>{t('HOME')}</a>
      </Link>
    ) */}
    {!isCurrentPathCb('/blog') && (
      <Link href="/blog" as="/blog">
        <a onClick={onHideModal}>{t('BLOG')}</a>
      </Link>
    )}
    {!isCurrentPathCb('/feedback') && (
      <Link href="/feedback" as="/feedback">
        <a onClick={onHideModal}>{t('FEEDBACK')} & reCAPTCHA v3 testing</a>
      </Link>
    )}
    {/* !isAuthenticated && !isCurrentPathCb('/auth/login') && (
      <Link href="/auth/login" as="/auth/login">
        <a onClick={onHideModal}>{t('LOGIN')}</a>
      </Link>
    ) */}

    <h5 style={{ margin: '16px 0 16px 0', fontFamily: 'Montserrat' }}>{t('MENU_TAGS')}</h5>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      {/* -- NOTE: Target Articles */}
      {/* !isCurrentPathCb('/blog/article/nginx-logs') && (
        <Link href="/blog/article/nginx-logs" as="/blog/article/nginx-logs">
          <a onClick={onHideModal}>How to see NGINX logs</a>
        </Link>
      ) */}
      {/* !isCurrentPathCb('/blog/article/limp-bizkit-video') && (
        <Link href="/blog/article/limp-bizkit-video" as="/blog/article/limp-bizkit-video">
          <a onClick={onHideModal}>Клипы Limp Bizkit</a>
        </Link>
      ) */}
      {/* -- */}

      {/* -- NOTE: Target search by title */}
      {!isCurrentPathCb('/blog/q/краснаяАкула') && (
        <Link href="/blog/q/краснаяАкула" as="/blog/q/краснаяАкула">
          <a onClick={onHideModal}>#краснаяАкула</a>
        </Link>
      )}
      {!isCurrentPathCb('/blog/q/bash') && (
        <Link href="/blog/q/bash" as="/blog/q/bash">
          <a onClick={onHideModal}>#bash</a>
        </Link>
      )}
      {!isCurrentPathCb('/blog/q/git') && (
        <Link href="/blog/q/git" as="/blog/q/git">
          <a onClick={onHideModal}>#git</a>
        </Link>
      )}
      {!isCurrentPathCb('/blog/q/jsVanilla') && (
        <Link href="/blog/q/jsVanilla" as="/blog/q/jsVanilla">
          <a onClick={onHideModal}>#jsVanilla</a>
        </Link>
      )}
      {!isCurrentPathCb('/blog/q/mongodb') && (
        <Link href="/blog/q/mongodb" as="/blog/q/mongodb">
          <a onClick={onHideModal}>#mongodb</a>
        </Link>
      )}
      {!isCurrentPathCb('/blog/q/nginx') && (
        <Link href="/blog/q/nginx" as="/blog/q/nginx">
          <a onClick={onHideModal}>#nginx</a>
        </Link>
      )}
      {!isCurrentPathCb('/blog/q/ssl') && (
        <Link href="/blog/q/ssl" as="/blog/q/ssl">
          <a onClick={onHideModal}>#ssl</a>
        </Link>
      )}
      {/* !isCurrentPathCb('/blog/q/telegram') && (
        <Link href="/blog/q/telegram" as="/blog/q/telegram">
          <a onClick={onHideModal}>#telegram</a>
        </Link>
      ) */}
      {/* -- */}

      {isAuthenticated && !isCurrentPathCb('/profile') && (
        <Link href="/profile" as="/profile">
          <a>{t('PROFILE')}</a>
        </Link>
      )}
      {/* <a href="http://pravosleva.ru/storybook/index.html" rel="noreferrer" target="_blank">
        Storybook
      </a> */}
    </div>
  </Wrapper>
)

export const MenuModal = withTranslator<IProps>(({
  isOpened, onHideModal, isAuthenticated,
  t,
  resetLang,
}) => {
  const router = useRouter()
  // console.log(router)
  const isCurrentPathCb = useCallback((path) => isCurrentPath(router.pathname, path) || isCurrentPath(router.asPath, path), [router.pathname, router.asPath])
  const dispatch = useDispatch()
  const handleLogoutCb = useCallback(async () => {
    // const result = await logout()
    //   .then(() => {
    //     router.push('/auth/login')
    //   })
    //   .catch((text) => {
    //     dispatch(showAsyncToast({ text, delay: 20000, type: 'error' }))
    //   })
    // return result
    return Promise.reject({ message: 'In progress...' })
  }, [])
  const handleLogout = useDebouncedCallback(() => {
    handleLogoutCb()
      .then(() => {
        // dispatch(userInfoActions.fillDelta({ fromServer: null, isLoadedSuccessfully: true }))
      })
      .catch((err) => {
        console.warn(err)
      })
  }, 500)
  const { onReset: resetTheme } = useGlobalTheming()
  const removeAllCookie = useCallback(() => {
    Cookie.remove('lang')
    resetLang()
    resetTheme()
    Cookie.remove('cookie-confirmed')
    dispatch(enable())
    if (isAuthenticated) handleLogout()
    onHideModal()
  }, [])

  return (
    <>
      {isOpened && (
        <Modal
          size={ESize.SMALL}
          modalTitle={t('MENU')}
          // modalSubtitle="process.env"
          closeModal={onHideModal}
          renderBodyContent={() => menuItems({ isCurrentPathCb, isAuthenticated, t, onHideModal })}
          renderFooterContent={() => (
            <FooterRow>
              <Button typeName="orange" size="small" width="responsive" onClick={removeAllCookie}>
                {t('REMOVE_ALL_COOKIE_AND_CLOSE')}
              </Button>
            </FooterRow>
          )}
        />
      )}
    </>
  )
})
