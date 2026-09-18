import { Layout } from '~/components/Layout'
import { SPSocketLab } from '~/components/SPSocketLab/SPSocketLab'
import Head from 'next/head'
import { getInitialPropsBase, IPageContext, setCommonStore } from '~/utils/next'
import { wrapper } from '~/store'
import { OnlineTradeinIntroSvg } from '~/components/special-svg-content/projects/tradein/OnlineTradeinIntroSvg'
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer'
import { Store } from 'redux'
import IconButton from '@mui/material/IconButton'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useCallback, useRef } from 'react'
import { scrollToIdFactory } from '~/utils/scrollToIdFactory'

const Page = () => {
  const scrollToIdRef = useRef(scrollToIdFactory({
    timeout: 0,
    offsetTop: 0,
    elementHeightCritery: 2, // NOTE: Все что больше 2px по высоте будет проскроллено в топ страницы
  }))
  const scrollToContent = useCallback((e: React.MouseEvent<unknown>) => {
    e.stopPropagation()
    scrollToIdRef.current({
      id: 'sp-tradein-target-content',
      _cfg: {
        getOffsetTop: ({ targetElm }) => {
          // НАДЕЖНЫЙ АБСОЛЮТНЫЙ РАСЧЕТ позиции элемента на странице с нуля
          let absoluteTop = 0
          let currentElm: HTMLElement | null = targetElm
          while (currentElm) {
            absoluteTop += currentElm.offsetTop
            currentElm = currentElm.offsetParent as HTMLElement | null
          }

          const elementHeight = targetElm.offsetHeight
          
          // Если блок свернут (меньше 200px)
          if (elementHeight <= 2) {
            const windowHeight = window.innerHeight
            // Вычисляем офсет сверху так, чтобы после вычитания в window.scrollTo 
            // элемент оказался ровно по центру экрана
            const targetCenterPos = absoluteTop - (windowHeight / 2) + (elementHeight / 2)
            
            // Нам нужно вернуть такое число, которое при вычитании из (getBoundingClientRect().top + pageYOffset)
            // даст точно targetCenterPos. 
            // Так как (getBoundingClientRect().top + pageYOffset) всегда равен нашему absoluteTop,
            // то специальный офсет равен:
            return absoluteTop - targetCenterPos
          }
          
          return 0 // Стандартный отступ для больших блоков
        }
      }
    })
  }, [])
  return (
    <>
      <Head>
        <title>SP exp</title>
        <meta name="robots" content="noindex, nofollow" />
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        <link rel="stylesheet" href="/static/css/min/mapbox-gl@2.6.1.min.css" />
      </Head>
      <Layout>
        <UniversalContainer
          isForLayout={true} hasBreadcrumbs={false}
          className='fade-in-effect'
        >
          <OnlineTradeinIntroSvg />
          <span>
            <IconButton
              // aria-label="more"
              // id="to-bottom"
              // aria-controls={isMenuOpened ? 'long-menu' : undefined}
              // aria-expanded={isMenuOpened ? 'true' : undefined}
              // aria-haspopup="true"
              onClick={scrollToContent}
              color='primary'
            >
              <ArrowDownwardIcon />
            </IconButton>
          </span>
        </UniversalContainer>
        <SPSocketLab />
      </Layout>
    </>
  )
}

const getInitialPropsWithStore = async ({
  ctx,
  store,
}: {
  ctx: IPageContext;
  store: Store;
}) => {
  const baseProps = await getInitialPropsBase(ctx)

  setCommonStore({ store, baseProps })

  return {
    ...baseProps,
  }
}

Page.getInitialProps = wrapper.getInitialPageProps(
  (store) => (ctx: IPageContext) => getInitialPropsWithStore({ ctx, store })
)

export default Page
