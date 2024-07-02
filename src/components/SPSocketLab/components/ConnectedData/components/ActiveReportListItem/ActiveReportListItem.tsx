import { useCallback, memo, useMemo, useState } from 'react'
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
import { GeoSection } from '~/components/SPSocketLab/components/ConnectedData/components/GeoSection'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
  const isBrowser = useMemo(() => typeof window !== 'undefined', [typeof window])

  const [isHeadInfoOpened, setIsHeadInfoOpened] = useState(false)
  const toggleHeadInfo = useCallback(() => {
    setIsHeadInfoOpened((s) => !s)
  }, [setIsHeadInfoOpened])

  const [isFooterInfoOpened, setIsFooterInfoOpened] = useState(false)
  const toggleFooterInfo = useCallback(() => {
    setIsFooterInfoOpened((s) => !s)
  }, [setIsFooterInfoOpened])

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
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                // alignItems: 'center',
                gap: '8px',
              }}
            >
              <button
                style={{
                  backgroundColor: 'rgb(1, 98, 200)',
                  color: '#FFF',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  
                  width: '20px',
                  height: '20px',
                  border: '2px solid #fff',
                  // boxShadow: 'rgba(7,7,7,.3) 0 0 10px',
                  outline: isHeadInfoOpened ? '2px solid rgb(1, 98, 200)' : 'none',
                  borderRadius: '50%',
                }}
                onClick={toggleHeadInfo}
              >
                {isHeadInfoOpened ? <ExpandLessIcon style={{ fontSize: '18px' }} /> : <ExpandMoreIcon style={{ fontSize: '18px' }} />}
              </button>
              <span>{new Date(viState.activeReport.ts).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}</span>
              <b>{header}</b>
            </div>

            {
              isHeadInfoOpened && (
                <>
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
                          <div style={{ borderRight: '1px solid black', minHeight: '100%', alignSelf: 'normal' }} />
                          <div>{viState.activeReport._userAgent}</div>
                        </>
                      )
                    }
                  </div>
                  {!!viState.activeReport._clientReferer && <div style={{ display: 'inline-flex', gap: '8px' }}><span>{viState.activeReport._clientReferer}</span></div>}
                </>
              )
            }
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

              // paddingTop: '0px',
              paddingBottom: isFooterInfoOpened ? '0px' : '8px',
            }}
            className={clsx(acticeReportClasses.commonInfo)}
          >
            {
              isBrowser && !!viState.activeReport._geoip && !!viState.activeReport._geoip?.ll && Array.isArray(viState.activeReport._geoip.ll) ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <button
                      style={{
                        backgroundColor: 'rgb(1, 98, 200)',
                        color: '#FFF',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        
                        width: '20px',
                        height: '20px',
                        border: '2px solid #fff',
                        // boxShadow: 'rgba(7,7,7,.3) 0 0 10px',
                        outline: isFooterInfoOpened ? '2px solid rgb(1, 98, 200)' : 'none',
                        borderRadius: '50%',
                      }}
                      onClick={toggleFooterInfo}
                    >
                      {isFooterInfoOpened ? <ExpandLessIcon style={{ fontSize: '18px' }} /> : <ExpandMoreIcon style={{ fontSize: '18px' }} />}
                    </button>
                    <b>Geo</b>
                    <div>{clsx([viState.activeReport._geoip.country, viState.activeReport._geoip.region, viState.activeReport._geoip.city]) || '(no data)'}</div>
                  </div>
                  {
                    isFooterInfoOpened && (
                      <div className={acticeReportClasses.leafletMapContainer}>
                        {/* @ts-ignore */}
                        <GeoSection report={viState.activeReport} />
                      </div>
                    )
                  }
                  </>
                ) : (
                  <div>No Geo data</div>
                )
              }
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
