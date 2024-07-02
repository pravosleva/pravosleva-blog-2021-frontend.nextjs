import { memo, useCallback } from 'react'
import { CollapsibleBox } from '~/ui-kit.sp-tradein2024-devtools'
import { NViDevtools } from './types'
import { getNormalizedDateTime4 } from '~/utils/time-tools/timeConverter'
// import HighlightOffIcon from '@mui/icons-material/HighlightOff'
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import WarningIcon from '@mui/icons-material/Warning'
// import CloseIcon from '@mui/icons-material/Close'
import clsx from 'clsx'
import baseClasses from '~/ui-kit.sp-tradein2024-devtools/Base.module.scss'
import CopyToClipboard from 'react-copy-to-clipboard'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import {
  useSnackbar,
  SnackbarMessage as TSnackbarMessage,
  OptionsObject as IOptionsObject,
  // SharedProps as ISharedProps,
  closeSnackbar,
} from 'notistack'
import { IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import classes from './XHRReport.module.scss'

/*
<NewCollapsibleBox
  title={tsstr}
  key={tsstr}
  level={4}
>
  <pre className={clsx(baseClasses.preStyled)}>
    {JSON.stringify(viState.activeReport?.stepDetails?.[key][partOfNetwork][tsstr], null, 4)}
  </pre>
</NewCollapsibleBox>
*/

type TProps = {
  level:  1 | 2 | 3 | 4 | 5;
  xhr: NViDevtools.TNetworkXHR;
}

export const XHRReport = memo(({ xhr, level }: TProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const showNotif = useCallback((msg: TSnackbarMessage, opts?: IOptionsObject) => {
    if (!document.hidden) enqueueSnackbar(msg, {
      ...opts,
      action: (snackbarId) => (
        <IconButton
          onClick={() => closeSnackbar(snackbarId)}
          size='small'
        >
          <CloseIcon fontSize='small' style={{ color: '#fff' }} />
        </IconButton>
      ),
    })
  }, [])
  const handleCopy = useCallback((_text: string) => {
    showNotif('Copied', { variant: 'info', autoHideDuration: 5000 })
  }, [])

  if (typeof xhr.state === 'object' && !!xhr.state) return (
    <>
      <CollapsibleBox
        title='xhr.state'
        level={level}
      >
        {
          Object.keys(xhr.state).map((url) => {

            const isOk = Object.keys(xhr.state[url]).every((tsstr) => xhr.state[url]?.[tsstr]?.__resDetails?.res?.ok === true)
            const hasPending = Object.keys(xhr.state[url]).some((tsstr) => xhr.state[url]?.[tsstr]?.code === 'pending')

            let hasLastErrored = false
            const lastTs = Object.keys(xhr.state[url]).reduce((acc, cur) => {
              const ts = Number(cur)
              if (ts > acc) acc = ts
              return acc
            }, 0)
            hasLastErrored = !xhr.state[url]?.[String(lastTs)].__resDetails?.res.ok

            // IoIosWarning
            const hasErrored = !isOk
            return (
              <CollapsibleBox
                title={url}
                key={url}
                // @ts-ignore
                level={level + 1}
                StartIcon={
                hasPending
                ? <TimelapseIcon fontSize='small' />
                : hasLastErrored
                  ? <DoDisturbIcon color='error' fontSize='small' />
                  : hasErrored
                    ? <WarningIcon color='warning' fontSize='small' />
                    : <TaskAltIcon fontSize='small' />
                // : !isOk
                //   ? <IoIosCloseCircleOutline color='red' />
                //   : <IoIosCheckmarkCircleOutline />
                }
              >
                {
                  Object.keys(xhr.state[url]).map((tsstr) => (
                    <CollapsibleBox
                      title={getNormalizedDateTime4(Number(tsstr))}
                      key={tsstr}
                      // @ts-ignore
                      level={level + 2}
                      StartIcon={
                        xhr.state[url]?.[tsstr]?.code === 'pending'
                        ? <TimelapseIcon fontSize='small' />
                        : xhr.state[url]?.[tsstr]?.__resDetails?.res?.ok === true
                          ? <TaskAltIcon fontSize='small' />
                          : <DoDisturbIcon color='error' fontSize='small' />
                      }
                    >
                      <div className={classes.relativeBox}>
                        <CopyToClipboard
                          text={JSON.stringify(xhr.state[url][tsstr], null, 4)}
                          onCopy={handleCopy}
                        >
                          <Button size='small' variant='outlined' startIcon={<ContentCopyIcon />} className={classes.absoluteCopyBtn}>Copy</Button>
                        </CopyToClipboard>
                        <pre className={clsx(baseClasses.preStyled)}>
                          {JSON.stringify(xhr.state[url][tsstr], null, 4)}
                        </pre>
                      </div>
                    </CollapsibleBox>
                  ))
                }
              </CollapsibleBox>
            )
          })
        }
      </CollapsibleBox>
    </>
  )
  else return null
})
