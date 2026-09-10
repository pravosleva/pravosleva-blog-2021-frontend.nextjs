import { memo } from 'react'
import { QRCodeSVG } from 'qrcode.react' // Импортируем SVG-версию QR-кода
import { getNormalizedDate } from '~/utils/time-tools/timeConverter'
import { TArticle } from '~/components/Article/types'
import Link from '~/components/Link'
// import { slugMap } from '~/constants/blog/slugMap'
import { Button } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
// import clsx from 'clsx'
// import baseClasses from '~/ui-kit.sp-tradein2024-devtools/Base.module.scss'

type TProps = {
  article: TArticle;
}

const defaultBgUrl = '/static/img/blog/coming-soon-v3.jpg'

export const GridItem = memo(({ article }: TProps) => {
  const { original, bg, brief, slug } = article
  const { createdAt, title } = original
  const url = bg?.src || defaultBgUrl

  // 1. Формируем полную абсолютную ссылку для QR-кода
  const articleSlug = slug // slugMap.get(_id)?.slug || ''
  
  // Важно: QR-код должен содержать полный URL с доменом, чтобы телефон его распознал
  const host = typeof window !== 'undefined' ? window.location.origin : 'https://pravosleva.pro'
  const fullArticleUrl = `${host}/p/${articleSlug}`

  return (
    <div
      className='gridItemBg'
      style={{
        backgroundImage: `url(${url})`,
        filter: original.isPrivate
          ? 'grayscale(100%)'
          : !!bg?.src
            ? 'none'
            : 'grayscale(100%)',
        fontFamily: 'Montserrat, system-ui',
        position: 'relative', // Контекст для абсолютного позиционирования QR-кода
      }}
    >
      {/* 2. БЛОК С QR-КОДОМ (Показывается только если у статьи есть слаг) */}
      {!!articleSlug && (
        <div className="gridItemQrContainer" title="Сканируйте QR-код, чтобы читать с телефона">
          <QRCodeSVG 
            value={fullArticleUrl} 
            size={64} // Компактный размер для угла карточки
            bgColor="#ffffff"
            fgColor="#000000"
            level="L" // Низкий уровень избыточности для четкости мелкого кода
          />
        </div>
      )}

      <div className='gridItemBox'>
        <div className='gridItemTitle'><h3>{title}</h3></div>
        {
          !!brief
            ? <div className='gridItemDescription'>{brief}</div>
            : <div className='gridItemDescription'>...</div>
        }
        <div className='gridItemAction'>
          <div>
            <Button
              color='primary'
              component={Link}
              noLinkStyle
              href={`/p/${articleSlug}`}
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: '#FFC800',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#FF8E53',
                },
                '&:focus': {
                  backgroundColor: '#FF8E53',
                }
              }}
            >
              READ
            </Button>
          </div>
          <div style={{ fontSize: 'small' }}>{!!createdAt ? getNormalizedDate(createdAt) : 'No date'}</div>
        </div>
      </div>
    </div>
  )
})
