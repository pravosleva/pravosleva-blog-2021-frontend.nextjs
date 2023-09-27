import YouTubeVideo from 'react-youtube'
import { useStyles } from './styles'

interface IProps {
  id?: string
  videoId: string
  opts: any
}

export const YoutubePlayer = ({ videoId, opts = {} }: IProps) => {
  const classes = useStyles()

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
