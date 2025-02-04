import { Badge, Chip } from '@mui/material'
import { useCallback, useMemo, useState, memo, useEffect } from "react"
import { NEvent } from '../../withSocketContext'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
// import BookmarkIcon from '@mui/icons-material/Bookmark';
// import { CollapsibleBox } from '~/ui-kit.team-scoring-2019';
import classes from './ReportListItem.module.scss'
import clsx from 'clsx'
import InfoIcon from '@mui/icons-material/Info';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useSnapshot } from 'valtio'
import { vi } from '../../vi'
// import { getTimeDiff } from '~/utils/time-tools/getTimeDiff'
import { OverridableStringUnion } from '@mui/types'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import { TimeAgoLabel } from '~/components/SPSocketLab/components/ConnectedData/components'
import { capitalCase } from 'change-case'
import { replaceWords } from '~/utils/string-tools/replaceWords'
import { useGlobalTheming } from '~/hooks/useGlobalTheming';
// import { LeafletSection } from '~/components/SPSocketLab/components/ConnectedData/components/LeafletSection'

type TProps = {
  report: NEvent.TReport;
  onSetActiveReport: (rep: NEvent.TReport | null) => void;
}

const _badgeColorMap: {
  [key in NEvent.EReportType]: OverridableStringUnion<'default' | 'info' | 'error' | 'success' | 'warning'>
} = {
  [NEvent.EReportType.DEFAULT]: 'info',
  [NEvent.EReportType.INFO]: 'info',
  [NEvent.EReportType.SUCCESS]: 'info',
  [NEvent.EReportType.ERROR]: 'info',
  [NEvent.EReportType.WARNING]: 'info',
}

export const ReportListItem = memo((ps: TProps) => {
  const [isOpened, setIsOpened] = useState(false)
  const handleOpenToggle = useCallback(() => {
    setIsOpened((val) => !val)
  }, [setIsOpened])
  useEffect(() => {
    if (isOpened) {
      // NOTE: v1
      // if (!!ps.report._wService) ps.onSetActiveReport(ps.report)
      // else ps.onSetActiveReport(null)

      // NOTE: v2
      // if (!!ps.report.stepDetails || !!ps.report._wService) ps.onSetActiveReport(ps.report)
      // else ps.onSetActiveReport(null)

      // NOTE: v3 (set as active anyway)
      ps.onSetActiveReport(ps.report)
    }
    // else ps.onSetActiveReport(null)
  }, [isOpened])
  const { currentTheme } = useGlobalTheming()

  const Icon = useMemo(() => {
    switch (ps.report.reportType) {
      case NEvent.EReportType.DEFAULT: return <BookmarkBorderIcon color={currentTheme === 'dark' ? 'inherit' : 'disabled'} />
      case NEvent.EReportType.INFO: return <InfoIcon color='primary' />
      case NEvent.EReportType.SUCCESS: return <TaskAltIcon color='success' />
      case NEvent.EReportType.ERROR: return <ErrorIcon color='error' />
      case NEvent.EReportType.WARNING: return <WarningIcon color='warning' />
      default: return <BookmarkBorderIcon color={currentTheme === 'dark' ? 'inherit' : 'disabled'} />
    }
  }, [ps.report.reportType, currentTheme])

  const viSnap = useSnapshot(vi.FOR_EXAMPLE)
  const {
    report: {
      _wService,
      stepDetails,
      ...restReportProps
    },
  } = ps
  const uiDate = useMemo(() => new Date(ps.report.ts).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }), [ps.report.ts])
  const header = useMemo(
    () => `${ps.report._ip || 'No IP'} // ${replaceWords({ cfg: { imei: 'IMEI', tradein: 'Trade-In' }, input: capitalCase(ps.report.stateValue) })}`,
    [ps.report],
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        // border: '1px solid red',
        alignItems: 'flex-start',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          // flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          // paddingLeft: '16px',
          width: '100%',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        // className='desktop-sticky-top-job-header'
        onClick={handleOpenToggle}
        className={clsx(
          'fadeIn',
          {
            'backdrop-blur--lite': currentTheme !== 'dark',
            'backdrop-blur--dark': currentTheme === 'dark',
            [classes.isActive]: viSnap.activeReport?.ts === ps.report.ts,
          },
          classes.mainHeader,
        )}
      >
        <Badge
          color={_badgeColorMap[ps.report.reportType]}
          badgeContent={ps.report._wService?._perfInfo.tsList.length || 0}
        >
          {Icon}
        </Badge>
        <div
          style={{
            fontFamily: 'system-ui',
            textDecoration: isOpened ? 'none' : 'underline',
            fontWeight: 'bold',
            color: currentTheme === 'dark' ? '#FF9000' : 'inherit',
          }}
          className='truncate'
        >
          {header}
        </div>
        <div style={{ fontFamily: 'system-ui', marginLeft: 'auto', wordBreak: 'keep-all', whiteSpace: 'nowrap' }}>
          <Chip color={currentTheme === 'dark' ? 'secondary' : 'default'} label={<TimeAgoLabel ts={ps.report.ts} />} />
        </div>
      </div>

      <div
        style={{
          maxWidth: '100%',
          width: '100%',
          // paddingLeft: '8px',
          // borderLeft: '4px solid lightgray',
          display: isOpened ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/*
          !!ps.report._geoip && !!ps.report._geoip?.ll && Array.isArray(ps.report._geoip.ll) && (
            <div
              // className={acticeReportClasses.leafletMapContainer}
              style={{
                borderRadius: '16px',
                width: '100%',
                height: '250px',
              }}
            >
              <LeafletSection report={ps.report} />
            </div>
          )
        */}
        {
          isOpened &&
            (!!ps.report._wService
            ? ps.report._wService?._perfInfo.tsList.length > 0 && (
              <>
                {uiDate}
                <pre style={{ fontFamily: 'system-ui' }} className={classes.pre}>
                  {JSON.stringify(restReportProps, null, 4)}
                </pre>
                {/*
                  ps.report.stepDetails && (
                    <CollapsibleBox
                      label={`Step details${ps.report._wService?._perfInfo.tsList.length > 2 ? ` (${getTimeDiff({ startDate: new Date(ps.report._wService._perfInfo.tsList[1].ts), finishDate: new Date(ps.report._wService._perfInfo.tsList[ps.report._wService._perfInfo.tsList.length - 1].ts) }).message})` : ''}`}
                      descritpion={
                        <pre style={{ fontFamily: 'system-ui' }} className={classes.pre}>
                          {JSON.stringify(ps.report.stepDetails, null, 4)}
                        </pre>
                      }
                    />
                  )
                */}
                {/*
                  ps.report._wService?._perfInfo.tsList.map((item, i, a) => {
                    const isFirst = i === 0
                    const details = isFirst ? `${(item.p / 1000).toFixed(1)} s` : `+${((item.p - a[i - 1].p) / 1000).toFixed(1)} s`
                    return (
                      <div
                        key={`${item.ts}-${i}`}
                      >
                        <CollapsibleBox
                          label={`${item.name || item.descr} (${details})`}
                          descritpion={
                            <pre
                              style={{ fontFamily: 'system-ui' }}
                              className={classes.pre}
                            >
                              {JSON.stringify(item, null, 4)}
                            </pre>
                          }
                        />
                      </div>
                  )})
                */}
              </>
          ) : (
            <>
              {uiDate} (No special service info)
              {/* <pre
                style={{ fontFamily: 'system-ui' }}
                className={classes.pre}
              >
                {JSON.stringify(ps.report, null, 4)}
              </pre> */}
            </>
          ))
        }
      </div>
    </div>
  )
}, function areEqual(pp, np) {
  return pp.report.ts === np.report.ts
})
