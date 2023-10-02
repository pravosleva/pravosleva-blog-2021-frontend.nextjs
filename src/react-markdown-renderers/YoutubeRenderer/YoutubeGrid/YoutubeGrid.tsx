import { useMemo } from 'react'
import YouTubeVideo from 'react-youtube'
import { useStyles } from './styles'
import clsx from 'clsx'
// import { Alert, AlertTitle } from '@material-ui/lab'
import { Alert, AlertTitle } from '@mui/material'
import { YoutubeInModal } from '../YoutubeInModal'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'

type TProps = {
  json: string
  inModal?: boolean
}

function isJsonString(str: string) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

type TItem = string | {
  id: string;
  previewSrc?: string;
}

export const YoutubeGrid = ({ json, inModal }: TProps) => {
  const isServer = useMemo(() => typeof window === 'undefined', [typeof window])

  if (isServer) return <CircularIndeterminate />

  const classes = useStyles()
  const isValidJson = useMemo(() => isJsonString(json), [json])

  if (!isValidJson)
    return (
      <Alert variant="outlined" severity="error" style={{ marginBottom: '16px' }}>
        <AlertTitle>Incorrect JSON</AlertTitle>
        Should be like this:
        <pre style={{ margin: '0px !important' }}>
          {`<YoutubeGrid json='["l-EdCNjumvI", "oPssk0PEwtg", "hqgVYX3zhug", "_i_qxQztHRI", "6XQHpUiiKgc"]' />`}
        </pre>
      </Alert>
    )

  const parsedJson: TItem[] = JSON.parse(json)

  return (
    <>
      {!parsedJson && Array.isArray(parsedJson) ? (
        <Alert className="info" variant="outlined" severity="info" style={{ marginBottom: '16px' }}>
          <AlertTitle>Incorrect data</AlertTitle>
          Incorrect props: videoIds should be an Array of strings!
        </Alert>
      ) : (
        <div className={classes.grid}>
          {parsedJson.map((item, i: number) => {
            try {
              let id
              let previewSrc
              switch (typeof item) {
                case 'string':
                  id = item
                  break
                case 'object':
                  id = item.id
                  previewSrc = item.previewSrc
                  break
                default:
                  throw new Error(`Incorrect json: ${typeof item}`)
              }

              return (
                <div key={i} className={clsx('grid-item', classes.externalWrapper)}>
                  <div className={classes.reactYoutubeContainer}>
                    {inModal ? (
                      <YoutubeInModal videoId={id} previewSrc={previewSrc} />
                    ) : (
                      <YouTubeVideo videoId={id} className={classes.reactYoutube} />
                    )}
                  </div>
                </div>
              )
            } catch (err: any) {
              return (
                <div key={i} className={clsx('grid-item', classes.externalWrapper)}>
                  <Alert variant="outlined" severity="error" style={{ marginBottom: '16px' }}>
                    <AlertTitle>{err?.message || 'Oops! Fuckup detected. Incorrect format?'}</AlertTitle>
                    Should be like this:
                    <pre
                      style={{
                        marginBottom: '0px !important',
                        whiteSpace: 'pre-wrap',

                        color: '#FFF',
                        border: '2px solid #2D3748',
                        padding: '5px',
                        margin: 0,
                        // boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
                        backgroundColor: '#2D3748',
                        borderRadius: '8px',
                        overflowX: 'auto',
                      }}
                    >
                      {`<YoutubeGrid json='[{id:"l-EdCNjumvI",previewSrc:"/path"}, "oPssk0PEwtg", "hqgVYX3zhug", "_i_qxQztHRI", "6XQHpUiiKgc"]' />`}
                    </pre>
                  </Alert>
                </div>
              )
            }
          })}
        </div>
      )}
    </>
  )
}
