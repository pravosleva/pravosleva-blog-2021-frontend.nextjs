// import { TCRMPage } from '~/store/reducers/crmPages'
// import { useStyles } from './styles'
// import { Button } from '@material-ui/core'
// import {
//   setIsModalOpened,
//   loadPageData,
// } from '~/actions'
// import { useDispatch } from 'react-redux'
// import { useCallback } from 'react'
import { getNormalizedDate } from '~/utils/timeConverter'
import { TArticle } from '~/components/Article/types'
// import { ThemedButton, EPartnerCode } from '~/common/material/ThemedButton'
// import { useSpring, animated } from 'react-spring'
import Link from '~/components/Link'
import { slugMap } from '~/constants/blog/slugMap'
import { Button } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
// import PauseIcon from '@mui/icons-material/Pause'
// import HourglassFullIcon from '@mui/icons-material/HourglassFull'

type TProps = {
  article: TArticle;
}

// const defaultBgUrl = '/static/img/blog/coming-soon.avif'
const defaultBgUrl = '/static/img/blog/coming-soon-v3.jpg'

export const GridItem = ({ article }: TProps) => {
  const { original, bgSrc, brief } = article
  const {
    _id,
    createdAt,
    // description,
    title,
  } = original
  // const classes = useStyles()
  const url = bgSrc || defaultBgUrl
  // const dispatch = useDispatch()
  // const getProject = useCallback((id: string) => {
  //   dispatch(setIsModalOpened(true))
  //   dispatch(loadPageData(id))
  // }, [dispatch])

  return (
    <div
      // className={classes.gridItemBg}
      className='gridItemBg'
      style={{
        backgroundImage: `url(${url})`,
        filter: !!bgSrc? 'none' : 'grayscale(100%)',
      }}
    >
      <div className='gridItemBox'>
        {/* NOTE: h3 className='truncate' */}
        <div className='gridItemTitle'><h3>{title}</h3></div>
        <div className='gridItemDescription'>{brief}</div>
        <div className='gridItemAction'>
          {
            slugMap.has(_id) ? (
              <div>
                {/* <ThemedButton partnerCode={EPartnerCode.Yellow} size='small' onClick={() => getProject(id)} variant='outlined' color="primary">
                  Read
                </ThemedButton> */}
                <Button
                  // fullWidth
                  variant='contained'
                  color='primary'
                  component={Link}
                  noLinkStyle
                  href={`/blog/article/${slugMap.get(_id)?.slug}`}
                  target='_self'
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
          <div>{!!createdAt ? getNormalizedDate(createdAt) : 'No date'}</div>
        </div>
      </div>
    </div>
  )
}
