import {
  Badge,
  Chip,
} from '@mui/material'
import { useCallback, useMemo, useState, memo, useEffect } from "react"
import { NEvent } from './withSocketContext'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { CollapsibleBox } from '~/ui-kit.special';
import classes from './ReportListItem.module.scss'
import clsx from 'clsx'
import InfoIcon from '@mui/icons-material/Info';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useSnapshot } from 'valtio'
import { vi } from './vi'
import { getTimeDiff } from '~/utils/time-tools/getTimeDiff';

type TProps = {
  report: NEvent.TReport;
  onSetActiveReport: (rep: NEvent.TReport | null) => void;
}

export const ReportListItem = memo((ps: TProps) => {
  const [isOpened, setIsOpened] = useState(false)
  const handleOpenToggle = useCallback(() => {
    setIsOpened((val) => !val)
  }, [setIsOpened])
  useEffect(() => {
    if (isOpened) {
      if (!!ps.report._wService) ps.onSetActiveReport(ps.report)
      else ps.onSetActiveReport(null)
    }
  }, [isOpened])

  const Icon = useMemo(() => {
    switch (ps.report.reportType) {
      case NEvent.EReportType.DEFAULT: return <BookmarkIcon />
      case NEvent.EReportType.INFO: return <InfoIcon color='info' />
      case NEvent.EReportType.SUCCESS: return <TaskAltIcon color='success' />
      default: return <BookmarkBorderIcon color='disabled' />
    }
  }, [ps.report.reportType])

  const viSnap = useSnapshot(vi.FOR_EXAMPLE)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        // border: '1px solid red',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          // flexWrap: 'wrap',
          alignItems: 'center',
          gap: '16px',
          // paddingLeft: '16px',
          width: '100%',
          cursor: 'pointer',
        }}
        // className='desktop-sticky-top-job-header'
        onClick={handleOpenToggle}
        className={clsx(classes.mainHeader, { [classes.isActive]: viSnap.activeReport?.ts === ps.report.ts })}
      >
        <Badge color='info' badgeContent={ps.report._wService?._perfInfo.tsList.length || 0}>
          {Icon}
        </Badge>
        <div
          style={{ fontFamily: 'system-ui', textDecoration: isOpened ? 'none' : 'underline', fontWeight: 'bold' }}
          className='truncate'
        >
          {!!ps.report.imei ? `${ps.report.imei} ${ps.report.stateValue.replace('stepMachine:', '')}` : ps.report.stateValue}
        </div>
        <div style={{ fontFamily: 'system-ui', marginLeft: 'auto', wordBreak: 'keep-all', whiteSpace: 'nowrap' }}>
          <Chip label={ps.report.appVersion} />
        </div>
      </div>
      <div
        style={{
          maxWidth: '100%',
          width: '100%',
          // paddingLeft: '8px',
          // borderLeft: '4px solid lightgray'
        }}
      >
        {
          isOpened &&
            (!!ps.report._wService
            ? ps.report._wService?._perfInfo.tsList.length > 0 && (
              <>
                {
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
                }
                <CollapsibleBox
                  label={`Full report${ps.report._wService?._perfInfo.tsList.length > 2 ? ` (${getTimeDiff({ startDate: new Date(ps.report._wService._perfInfo.tsList[1].ts), finishDate: new Date(ps.report._wService._perfInfo.tsList[ps.report._wService._perfInfo.tsList.length - 1].ts) }).message})` : ''}`}
                  descritpion={
                    <pre
                      style={{ fontFamily: 'system-ui' }}
                      className={classes.pre}
                    >
                      {JSON.stringify(ps.report, null, 4)}
                    </pre>
                  }
                />
              </>
          ) : (
            <div>
              <pre
                style={{ fontFamily: 'system-ui' }}
                className={classes.pre}
              >
                {JSON.stringify(ps.report, null, 4)}
              </pre>
            </div>
          ))
        }
      </div>
    </div>
  )
}, function areEqual(pp, np) {
  return pp.report.ts === np.report.ts
})
