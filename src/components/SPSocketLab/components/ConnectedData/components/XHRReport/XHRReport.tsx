import { memo } from 'react'
import { CollapsibleBox } from '~/ui-kit.sp-tradein2024-devtools'
import { NViDevtools } from './types'
import { getNormalizedDateTime4 } from '~/utils/time-tools/timeConverter'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TimelapseIcon from '@mui/icons-material/Timelapse'
import WarningIcon from '@mui/icons-material/Warning'
// import CloseIcon from '@mui/icons-material/Close'
import clsx from 'clsx'
import baseClasses from '~/ui-kit.sp-tradein2024-devtools/Base.module.scss'

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
  if (typeof xhr.state === 'object' && !!xhr.state) return (
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
                ? <HighlightOffIcon color='error' fontSize='small' />
                : hasErrored
                  ? <WarningIcon color='warning' fontSize='small' />
                  : <CheckCircleOutlineIcon />
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
                        ? <CheckCircleOutlineIcon />
                        : <HighlightOffIcon color='error' fontSize='small' />
                    }
                  >
                    <pre className={clsx(baseClasses.preStyled)}>
                      {JSON.stringify(xhr.state[url][tsstr], null, 4)}
                    </pre>
                  </CollapsibleBox>
                ))
              }
            </CollapsibleBox>
          )
        })
      }
    </CollapsibleBox>
  )
  else return null
})
