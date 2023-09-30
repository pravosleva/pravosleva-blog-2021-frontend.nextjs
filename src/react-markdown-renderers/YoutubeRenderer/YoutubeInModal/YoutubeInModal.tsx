import { useState } from 'react'
import clsx from 'clsx'
import { useStyles } from './styles'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { TransparentModal } from '~/components/TransparentModal'
import { YoutubePlayer } from '~/react-markdown-renderers/YoutubeRenderer/YoutubePlayer'
import { useWindowSize } from '~/hooks/useWindowSize'
import { makeStyles } from '@mui/styles'
import { useMemo } from 'react'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'


type TProps = {
  previewSrc?: string
  videoId: string
}

export const YoutubeInModal = ({ previewSrc, videoId }: TProps) => {
  const classes = useStyles()

  const [isOpened, setIsOpened] = useState<boolean>(false)
  const modalToggler = (val?: boolean) => {
    if (val === true || val === false) {
      setIsOpened(val)
    } else {
      setIsOpened((s) => !s)
    }
  }
  const { isDesktop } = useWindowSize()
  const useStyles2 = makeStyles({
    customBg: (props: { previewSrc?: string }) => ({
      backgroundImage: !!props.previewSrc
        ? `url(${props.previewSrc})`
        : 'url(/static/img/youtube-default-preview-0.jpeg)',
    }),
  })
  const classes2 = useStyles2({ previewSrc })
  const isServer = useMemo(() => typeof window === 'undefined', [typeof window])

  if (isServer) return <CircularIndeterminate />

  return (
    <>
      <div className={clsx(classes.wrapper, classes2.customBg)} onClick={() => modalToggler()}>
        <div className={classes.arrowBox}>
          <div className={clsx(classes.arrow, 'arrow-hover')}>
            <PlayArrowIcon fontSize="large" color="inherit" />
          </div>
        </div>
        <div className={clsx(classes.internalWrapper, 'dimmer')} />
      </div>

      <TransparentModal isOpened={isOpened} onClose={() => modalToggler(false)}>
        <div
          style={{
            width: isDesktop ? '850px' : '100vw',
          }}
        >
          <YoutubePlayer
            videoId={videoId}
            opts={{
              playerVars: {
                // NOTE: See also https://developers.google.com/youtube/player_parameters
                autoplay: 1,
              },
            }}
          />
        </div>
      </TransparentModal>
    </>
  )
}
