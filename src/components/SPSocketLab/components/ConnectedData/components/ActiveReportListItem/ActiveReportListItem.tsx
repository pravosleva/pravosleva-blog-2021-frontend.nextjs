import { useCallback, memo, useMemo } from 'react'
import { CollapsibleBox, Fab } from '~/ui-kit.team-scoring-2019'
import clsx from 'clsx'
import classes from '~/components/SPSocketLab/components/ConnectedData/ConnectedData.module.scss'
import { useSnapshot } from 'valtio'
import { useProxy } from 'valtio/utils'
import { vi } from '~/components/SPSocketLab/components/ConnectedData/vi'
import { getTimeDiff } from '~/utils/time-tools/getTimeDiff'
import { CollapsibleBox as NewCollapsibleBox } from '~/ui-kit.sp-tradein2024-devtools'
import collapsibleBoxClasses from '~/ui-kit.sp-tradein2024-devtools/CollapsibleBox/CollapsibleBox.module.scss'
import baseClasses from '~/ui-kit.sp-tradein2024-devtools/Base.module.scss'
import { XHRReport } from '~/components/SPSocketLab/components/ConnectedData/components/XHRReport'
import CloseIcon from '@mui/icons-material/Close'
import { capitalCase } from 'change-case'
import acticeReportClasses from './ActiveReportListItem.module.scss'
import { replaceWords } from '~/utils/string-tools/replaceWords'

export const ActiveReportListItem = memo(() => {
  const viState = useSnapshot(vi.FOR_EXAMPLE)
  const viProxy = useProxy(vi.FOR_EXAMPLE)
  // const handleSetActiveReport = useCallback((report: NEvent.TReport | null) => {
  //   viProxy.activeReport = report
  // }, [])
  const handleResetActiveReport = useCallback(() => {
    viProxy.activeReport = null
  }, [])
  const header = useMemo(
    () => !!viProxy.activeReport
      ? replaceWords({ cfg: { imei: 'IMEI', tradein: 'Trade-In' }, input: capitalCase(viProxy.activeReport.stateValue.replace(/sm:/g, '')) })
      : null,
    [viProxy.activeReport],
  )

  if (!viState.activeReport) return null
  return (
    <>
      <div className={clsx(acticeReportClasses.fixedTop, acticeReportClasses.fixedTopActiveReport, 'backdrop-blur', 'fade-in-speed-2')}>
        
        <div className={clsx(classes.stickyTopHeader)}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              width: '100%',
              fontSize: 'small',
            }}
            className={clsx(acticeReportClasses.commonInfo)}
          >
            <b>{header}</b>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  // alignItems: 'flex-start',
                  gap: '0px',
                  // minWidth: '120px',
                  fontFamily: 'system-ui, monospace',
                }}
              >
                <div style={{ display: 'inline-flex', gap: '8px' }}><span>IMEI</span><b>{viState.activeReport.imei || 'No'}</b></div>
                {!!viState.activeReport._ip && <div style={{ display: 'inline-flex', gap: '8px' }}><span>IP</span><b>{viState.activeReport._ip}</b></div>}
                <div style={{ display: 'inline-flex', gap: '8px' }}>{viState.activeReport.appVersion}</div>
              </div>
              {
                !!viState.activeReport._userAgent && (
                  <>
                    <div
                      style={{ borderRight: '1px solid black', minHeight: '100%', alignSelf: 'normal' }}
                    />
                    <div>{viState.activeReport._userAgent}</div>
                  </>
                )
              }
            </div>
            {!!viState.activeReport._clientReferer && <div style={{ display: 'inline-flex', gap: '8px' }}><span>{viState.activeReport._clientReferer}</span></div>}
          </div>
        </div>
        
        {
          !!viState.activeReport.stepDetails && (
            <CollapsibleBox
              label={`Step details${
                !!viState.activeReport._wService
                ? viState.activeReport._wService?._perfInfo.tsList.length > 2
                  ? ` (${getTimeDiff({ startDate: new Date(viState.activeReport._wService._perfInfo.tsList[1].ts), finishDate: new Date(viState.activeReport._wService._perfInfo.tsList[viState.activeReport._wService._perfInfo.tsList.length - 1].ts) }).message})`
                  : ''
                : ''}`}
              descritpion={
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    // alignItems: 'flex-start',
                    gap: '16px',
                  }}
                >
                  
                  {/* <pre
                    style={{ fontFamily: 'system-ui' }}
                    className={classes.pre}
                  >
                    {JSON.stringify(viState.activeReport.stepDetails, null, 4)}
                  </pre> */}

                  <div
                    className={clsx(
                      // classes.wrapper,
                      baseClasses.stack0,
                      baseClasses.truncate,
                      collapsibleBoxClasses.wrapperV1,
                    )}
                    style={{
                      width: '100%',
                      // border: '1px solid red',
                      // maxHeight: '305px',
                      // overflowY: 'auto',
                      fontWeight: 'bold',
                    }}
                  >
                    <NewCollapsibleBox
                      title='stepDetails'
                      level={1}
                    >
                      {
                        Object.keys(viState.activeReport.stepDetails).map((key) => {
                          if (
                            typeof viState.activeReport?.stepDetails?.[key] === 'object'
                            && !!viState.activeReport?.stepDetails?.[key]
                            && Object.keys(viState.activeReport?.stepDetails?.[key]).length > 0
                          ) return (
                            <NewCollapsibleBox
                              title={key}
                              key={key}
                              level={2}
                            >
                              {
                                Object.keys(viState.activeReport?.stepDetails?.[key]).map((partOfNetwork) => {
                                  if (
                                    typeof viState.activeReport?.stepDetails?.[key][partOfNetwork] === 'string'
                                    || typeof viState.activeReport?.stepDetails?.[key][partOfNetwork] === 'number'
                                  ) return (
                                    <NewCollapsibleBox
                                      title={partOfNetwork}
                                      key={partOfNetwork}
                                      level={3}
                                    >
                                      <pre className={clsx(baseClasses.preStyled)}>
                                        {viState.activeReport?.stepDetails?.[key][partOfNetwork]}
                                      </pre>
                                    </NewCollapsibleBox>
                                  )
                                  else if (
                                    typeof viState.activeReport?.stepDetails?.[key][partOfNetwork] === 'object'
                                    && !!viState.activeReport?.stepDetails?.[key][partOfNetwork]
                                    && Object.keys(viState.activeReport?.stepDetails?.[key][partOfNetwork]).length > 0
                                  ) return (
                                    <NewCollapsibleBox
                                      title={partOfNetwork}
                                      key={partOfNetwork}
                                      level={3}
                                    >
                                      {
                                        Object.keys(viState.activeReport?.stepDetails?.[key][partOfNetwork]).map((tsstr) => {
                                          if (
                                            key === 'network'
                                            && partOfNetwork === 'xhr'
                                            && tsstr === 'state'
                                          ) return (
                                            <XHRReport
                                              xhr={viState.activeReport?.stepDetails?.[key][partOfNetwork]}
                                              level={4}
                                            />
                                          )
                                          else return (
                                            <NewCollapsibleBox
                                              title={tsstr}
                                              key={tsstr}
                                              level={4}
                                            >
                                              <pre className={clsx(baseClasses.preStyled)}>
                                                {JSON.stringify(viState.activeReport?.stepDetails?.[key][partOfNetwork][tsstr], null, 4)}
                                              </pre>
                                            </NewCollapsibleBox>
                                          )
                                        })
                                      }
                                    </NewCollapsibleBox>
                                  )
                                  else return (
                                    <NewCollapsibleBox
                                      title={partOfNetwork}
                                      key={partOfNetwork}
                                      level={3}
                                    >
                                      <pre className={clsx(baseClasses.preStyled)}>
                                        {String(viState.activeReport?.stepDetails?.[key][partOfNetwork])}
                                      </pre>
                                    </NewCollapsibleBox>
                                  )
                                })
                              }
                            </NewCollapsibleBox>
                          )
                          else return (
                            <NewCollapsibleBox
                              title={key}
                              key={key}
                              level={2}
                            >
                              <pre className={clsx(baseClasses.preStyled)}>
                                {String(viState.activeReport?.stepDetails?.[key])}
                              </pre>
                            </NewCollapsibleBox>
                          )
                        })
                      }
                    </NewCollapsibleBox>
                  </div>
                </div>
              }
            />
          )
        }
        {
          !!viState.activeReport._wService
            ? viState.activeReport._wService?._perfInfo.tsList.length > 0 && (
              <>
                {
                  viState.activeReport._wService?._perfInfo.tsList.map((item, i, a) => {
                    const isFirst = i === 0
                    const details = isFirst ? `${(item.p / 1000).toFixed(1)} s` : `+${((item.p - a[i - 1].p) / 1000).toFixed(1)} s`
                    return (
                      <div
                        key={`${item.ts}-${i}`}
                      >
                        <CollapsibleBox
                          label={`${details}: ${item.name || item.descr}`}
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
              </>
          ) : (
            <div>
              <pre
                style={{ fontFamily: 'system-ui' }}
                className={classes.pre}
              >
                {JSON.stringify(viState.activeReport, null, 4)}
              </pre>
            </div>
          )
        }
        <div className={clsx(classes.stickyBottomHeader)}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              width: '100%',
              fontSize: 'small',
            }}
            className={clsx(acticeReportClasses.commonInfo)}
          >
            <div>{new Date(viState.activeReport.ts).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}</div>
          </div>
        </div>
      </div>
      <Fab
        onClick={handleResetActiveReport}
        style={{
          position: 'fixed',
          zIndex: 7,
          top: '32px',
          right: '32px',
          color: '#000',
        }}
      >
        {/* <i className="fas fa-times-circle" style={{ fontSize: '35px' }} /> */}
        <CloseIcon fontSize='large' />
      </Fab>
    </>
  )
})
