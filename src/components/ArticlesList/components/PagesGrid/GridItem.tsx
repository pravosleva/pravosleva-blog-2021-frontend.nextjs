import { memo } from 'react'
import { getNormalizedDate } from '~/utils/time-tools/timeConverter'
import { TArticle } from '~/components/Article/types'
import Link from '~/components/Link'
import { slugMap } from '~/constants/blog/slugMap'
import { Button } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

type TProps = {
  article: TArticle;
}

const defaultBgUrl = '/static/img/blog/coming-soon-v3.jpg'

export const GridItem = memo(({ article }: TProps) => {
  const { original, bg, brief } = article
  const {
    _id,
    createdAt,
    // description,
    title,
  } = original
  const url = bg?.src || defaultBgUrl

  return (
    <div
      className='gridItemBg'
      style={{
        backgroundImage: `url(${url})`,
        filter: !!bg?.src ? 'none' : 'grayscale(100%)',
        fontFamily: 'Montserrat, system-ui',
      }}
    >
      <div className='gridItemBox'>
        <div className='gridItemTitle'><h3>{title}</h3></div>
        <div className='gridItemDescription'>{brief}</div>
        <div className='gridItemAction'>
          {
            slugMap.has(_id) ? (
              <div>
                <Button
                  variant='contained'
                  color='primary'
                  component={Link}
                  noLinkStyle

                  // NOTE: v1
                  href={`/p/${slugMap.get(_id)?.slug || ''}`}
                  // target='_self'

                  // NOTE: v2
                  // href='/p/[note_id]'
                  // as={`/p/${slugMap.get(_id)?.slug || ''}`}

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
            ) : null
          }
          <div style={{ fontSize: 'small' }}>{!!createdAt ? getNormalizedDate(createdAt) : 'No date'}</div>
        </div>
      </div>
    </div>
  )
})
