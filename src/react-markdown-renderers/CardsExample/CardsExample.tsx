import { memo, useState } from 'react'
import { Button } from '@mui/material'
import Link from '~/components/Link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { useStyles } from './styles'
import { TProps, TNormalizedItem } from './types'
import clsx from 'clsx'

export const CardsExample = memo(({ itemsJson }: TProps) => {
  const styles = useStyles()
  const [errMsg, _setErrMsg] = useState<string | null>(null)
  // const arePropsValid = ((str) => {
  //   try {
  //     switch (true) {
  //       case typeof str === 'string':
  //         // @ts-ignore
  //         JSON.parse(str)
  //         break
  //       default:
  //         throw new Error(`🚫 Incorrect type: ${typeof str}`)
  //     }
  //   } catch (e: any) {
  //     console.warn(e)
  //     setErrMsg(e?.message || 'Incorrect props')
  //     return false
  //   }
  //   return true
  // })(itemsJson)
  const normalizedItems: TNormalizedItem[] = JSON.parse(itemsJson)
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)

  return (
    <div className={clsx({ [styles.externalWrapper]: !errMsg })}>
      {
        !!errMsg && (
          <em>{errMsg}</em>
        )
      }
      {
        normalizedItems.length > 0 && (
          <div
            // style={wrapperStyles}
            className={styles.wrapper}
          >
            {
              normalizedItems.map((item) => {
                return (
                  <div className={styles.cardWrapper} key={item.id}>
                    <div
                      className={styles.card}
                      style={{
                        ...(!!item.bgUrl
                          ? {
                            objectFit: 'cover',
                            backgroundImage: `url(${item.bgUrl})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }
                          : {}),
                        border: !!item.bgUrl
                          ? 'none'
                          : '2px solid #959eaa',
                      }}
                    >

                      <div
                        className={styles.internalCardGradientSpace}
                        style={{
                          height: 'inherit',
                          // background: 'linear-gradient(rgba(1, 98, 200, 0.9) 30%, rgba(1, 98, 200, 0.65) 60%, rgba(255, 255, 255, 0) 100%)'
                          background: !!item.bgUrl
                            ? 'linear-gradient(rgba(0, 0, 0, 0.6) 30%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.4) 100%)'
                            : 'none',
                          color: !!item.bgUrl
                            ? '#FFF'
                            : 'inherit',
                        }}
                      >
                        <h3 style={{ margin: '0px', padding: '0px' }}>{item.title}</h3>
                        {!!item.descr && (
                          <span style={{ fontSize: '0.8em' }}>{item.descr}</span>
                        )}
                        {
                          !!item.links && item.links.length > 0 && (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '16px',
                                justifyContent: 'flex-end',
                                marginTop: 'auto',
                              }}
                            >
                              {
                                item.links.map(({ title, url }, i) => (
                                  <Button
                                    className={clsx({
                                      'backdrop-blur--lite': currentTheme === 'dark' || currentTheme === 'hard-gray',
                                    })}
                                    key={`${i}-${url}`}
                                    // fullWidth
                                    variant='contained'
                                    color='primary'
                                    component={Link}
                                    noLinkStyle

                                    // NOTE: v1
                                    href={url}
                                    target='_blank'

                                    // NOTE: v2
                                    // href='/blog/article/[slug]'
                                    // as={`/blog/article/${slugMap.get(_id)?.slug || ''}`}

                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                      color: !(currentTheme === 'dark' || currentTheme === 'hard-gray') ? '#000' : 'inherit',

                                      backgroundColor: currentTheme === 'dark' || currentTheme === 'hard-gray' ? 'transparent' : '#FFC800',
                                      '&:hover': {
                                        backgroundColor: currentTheme === 'dark' || currentTheme === 'hard-gray' ? 'transparent' : '#FF8E53',
                                      },
                                      '&:focus': {
                                        backgroundColor: currentTheme === 'dark' || currentTheme === 'hard-gray' ? 'transparent' : '#FF8E53',
                                      }
                                    }}
                                  >
                                    {title}
                                  </Button>
                                ))
                              }
                            </div>
                          )
                        }
                      </div>

                    </div>
                  </div>
                )
              })
            }
          </div>
        )
      }
    </div>
  )
})
