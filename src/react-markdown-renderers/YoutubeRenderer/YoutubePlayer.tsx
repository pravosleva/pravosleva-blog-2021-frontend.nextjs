import YouTubeVideo from 'react-youtube'
import { useStyles } from './styles'
import { useMemo } from 'react'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'

interface IProps {
  id?: string
  videoId: string
  opts: any
}

export const YoutubePlayer = ({ videoId, opts = {} }: IProps) => {
  const classes = useStyles()

  const isServer = useMemo(() => typeof window === 'undefined', [typeof window])

  if (isServer) return <CircularIndeterminate />

  return (
    <>
      {!videoId ? (
        <div>Incorrect props: videoId required!</div>
      ) : (
        <div className={classes.externalWrapper}>
          <div className={classes.reactYoutubeContainer}>
            <YouTubeVideo videoId={videoId} className={classes.reactYoutube} {...opts} />
          </div>
        </div>
      )}
    </>
  )
}
