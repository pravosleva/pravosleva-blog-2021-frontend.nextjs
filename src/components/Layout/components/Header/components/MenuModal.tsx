import React, { useCallback, useMemo } from 'react'
import { Modal } from '~/ui-kit.uremont'
import { FooterRow } from '~/ui-kit.uremont/molecules/Modal/FooterRow'
import { Button } from '~/ui-kit.uremont/atoms'
import Link from 'next/link'
import { isCurrentPath } from '~/utils/routing/isCurrentPath'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { withTranslator } from '@/hocs/withTranslator'
import Cookie from 'js-cookie'
import { useDispatch } from 'react-redux'
import { useDebouncedCallback } from '~/hooks/useDebouncedCallback'
import { useGlobalTheming } from '~/hooks/useGlobalTheming'
import { enable } from '~/store/reducers/cookieOffer'
import { ESize } from '~/ui-kit.uremont/organisms/Modal/components/ModalContent'

interface IProps {
  isOpened: boolean
  onHideModal: () => void
  isAuthenticated: boolean
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
`

// Оптимизация 1: Выносим структуры данных в статичные массивы.
// Это разгружает память и убирает тонны дублирующего кода.
const MAIN_MENU_ITEMS = [
  { href: '/blog', translationKey: 'BLOG' },
  { href: '/p/protocols', translationKey: 'NETWORK_PROTOCOLS' },
  { href: '/feedback', translationKey: 'FEEDBACK', labelSuffix: ' & reCAPTCHA v3 testing' },
  { href: '/p/hacker-news-client-2024', label: 'Hacker News Client' },
  { href: '/p/estimate-corrector-2024', label: 'Estimate Corrector 2024' },
  { href: '/p/cv-ru', translationKey: 'CV' },
]

const TAG_ITEMS = [
  'сетевые_протоколы',
  'краснаяАкула',
  'bash',
  'git',
  'jsVanilla',
  'reactHook',
  'mongodb',
  'nginx',
  'ssl',
  'рабочие_моменты'
]

export const MenuModal = withTranslator<IProps>(({
  isOpened,
  onHideModal,
  isAuthenticated,
  t,
  resetLang,
}) => {
  const router = useRouter()
  const dispatch = useDispatch()

  // Мемоизируем проверку путей. 
  const isCurrentPathCb = useCallback((path: string) => {
    return isCurrentPath(router.pathname, path) || isCurrentPath(router.asPath, path)
  }, [router.pathname, router.asPath])

  const handleLogoutCb = useCallback(async () => {
    return Promise.reject({ message: 'In progress...' })
  }, [])

  const handleLogout = useDebouncedCallback(() => {
    handleLogoutCb().catch((err) => console.warn(err))
  }, 500)

  const { onReset: resetTheme } = useGlobalTheming()

  const removeAllCookie = useCallback(() => {
    if (typeof window === 'undefined') return
    
    const isConfirmed = window.confirm(`⚡ ${t('QN_SURE')}`)
    if (isConfirmed) {
      Cookie.remove('lang')
      resetLang()
      resetTheme()
      Cookie.remove('cookie-confirmed')
      dispatch(enable())
      if (isAuthenticated) handleLogout()
      onHideModal()
    }
  }, [t, resetLang, resetTheme, dispatch, isAuthenticated, handleLogout, onHideModal])

  // Оптимизация 2: Мемоизируем рендер контента body. 
  // Теперь функция рендера не пересоздается, защищая внутренности Modal от лишних перерисовок.
  const renderBody = useCallback(() => {
    return (
      <Wrapper>
        <h5 style={{ margin: '0 0 8px 0', fontFamily: 'Montserrat' }}>{t('MENU_MAIN')}</h5>
        {MAIN_MENU_ITEMS.map((item) => {
          if (isCurrentPathCb(item.href)) return null
          
          return (
            <Link key={item.href} href={item.href}>
              <a onClick={onHideModal}>
                {item.translationKey ? t(item.translationKey) : item.label}
                {item.labelSuffix || ''}
              </a>
            </Link>
          )
        })}

        <h5 style={{ margin: '8px 0 8px 0', fontFamily: 'Montserrat' }}>{t('MENU_TAGS')}</h5>
        <TagsContainer>
          {TAG_ITEMS.map((tag) => {
            const path = `/blog/q/${tag}`
            if (isCurrentPathCb(path)) return null
            
            return (
              <Link key={tag} href={path}>
                <a onClick={onHideModal}>#{tag}</a>
              </Link>
            )
          })}

          {isAuthenticated && !isCurrentPathCb('/profile') && (
            <Link href="/profile">
              <a onClick={onHideModal}>{t('PROFILE')}</a>
            </Link>
          )}
        </TagsContainer>
      </Wrapper>
    )
  }, [t, isCurrentPathCb, onHideModal, isAuthenticated])

  // Мемоизируем рендер футера
  const renderFooter = useCallback(() => {
    return (
      <FooterRow>
        <Button typeName="secondary" size="small" width="responsive" onClick={removeAllCookie}>
          {t('REMOVE_ALL_COOKIE_AND_CLOSE')}
        </Button>
      </FooterRow>
    )
  }, [removeAllCookie, t])

  // Если модалка закрыта, не пускаем код ниже и ничего не рендерим в виртуальный DOM
  if (!isOpened) return null

  return (
    <Modal
      size={ESize.SMALL}
      modalTitle={t('MENU')}
      closeModal={onHideModal}
      renderBodyContent={renderBody}
      renderFooterContent={renderFooter}
    />
  )
})

MenuModal.displayName = 'MenuModal'
