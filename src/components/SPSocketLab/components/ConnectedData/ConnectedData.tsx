import classes from './ConnectedData.module.scss'
import { WithSocketContext } from './withSocketContext'
import { useCallback, useEffect, useRef, memo, useMemo, useState } from 'react'
import { groupLog } from '~/utils/groupLog'
import { NEvent, useStore, TSocketMicroStore, initialState } from './withSocketContext'
import {
  useSnackbar,
  SnackbarMessage as TSnackbarMessage,
  OptionsObject as IOptionsObject,
  // SharedProps as ISharedProps,
  closeSnackbar,
} from 'notistack'
import CloseIcon from '@mui/icons-material/Close'
import { io, Socket } from 'socket.io-client'
import { getRandomString } from '~/utils/getRandomString'
import { Alert, Button, IconButton, Stack, Typography } from '@mui/material'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import { useSnapshot } from 'valtio'
import { useProxy } from 'valtio/utils'
import { vi } from './vi'
import { ReportListItem } from './ReportListItem'
import { CollapsibleBox, Fab } from '~/ui-kit.special'
import clsx from 'clsx'
import { getTimeDiff } from '~/utils/time-tools/getTimeDiff'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { useWindowSize } from '~/hooks/useWindowSize'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { FiltersContent } from './FiltersContent'
import { testTextByAnyWord } from '~/utils/string-tools/testTextByAnyWord'
import { getNormalizedWordsArr } from '~/utils/string-tools/getNormalizedWords'
import sizeof from 'object-sizeof'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Brightness1Icon from '@mui/icons-material/Brightness1'

// const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
// const NEXT_APP_SOCKET_API_ENDPOINT = isDev ? 'http://localhost:3000' : (process.env.NEXT_APP_SOCKET_API_ENDPOINT || 'https://pravosleva.pro')
const NEXT_APP_SOCKET_API_ENDPOINT = 'http://pravosleva.pro'
const spReportRoomId = 'FOR_EXAMPLE'

const UI = memo(({ onConnClick, onDisconnClick }: {
  onConnClick: (ref: React.RefObject<HTMLButtonElement>) => void;
  onDisconnClick: (ref: React.RefObject<HTMLButtonElement>) => void;
}) => {
  const [isConnected] = useStore((store: TSocketMicroStore) => store.isConnected)
  const [isConnectedToPrivateRoom] = useStore((store: TSocketMicroStore) => store.isConnectedToPrivateRoom)
  const connectBtnRef = useRef<HTMLButtonElement>(null)
  const disconnectBtnRef = useRef<HTMLButtonElement>(null)

  const viState = useSnapshot(vi.FOR_EXAMPLE)
  const viProxy = useProxy(vi.FOR_EXAMPLE)
  const handleSetActiveReport = useCallback((report: NEvent.TReport | null) => {
    viProxy.activeReport = report
  }, [])
  const handleResetActiveReport = useCallback(() => {
    viProxy.activeReport = null
  }, [])

  const { isMobile, isDesktop } = useWindowSize()
  const isBrowser = useMemo(() => typeof window !== 'undefined', [typeof window])

  const [isFiltersOpened, setIsFiltersOpened] = useState(false)
  const filtersToggle = useCallback(() => {
    setIsFiltersOpened((s) => !s)
  }, [setIsFiltersOpened])

  const [imeiFilter] = useStore((store: TSocketMicroStore) => store.imeiFilter)

  const hasAnyFilter = useMemo(() => !!imeiFilter, [imeiFilter])
  const filteredReports = useMemo(() => {
    if (!!imeiFilter) return viState.items.filter(({ imei }) => !!imei ? testTextByAnyWord({ text: imei, words: getNormalizedWordsArr(imeiFilter.split(' ').filter(str => !!str)) }) : false)
    else return viState.items
  }, [imeiFilter, viState.items])

  const datasizeInfo = useMemo(() => {
    const inB = sizeof(viState.items)
    const inKB = inB * 0.0009765625
    const inMB = inB / 1048576
    switch (true) {
      case inMB > 1: return `${inMB.toFixed(1)} MB`
      case inKB > 1: return `${inKB.toFixed(1)} kB`
      default: return `${inB.toFixed(1)} B`
    }
  }, [viState.items])

  const [isTestedIFrameOpened, setIsTestedIFrameOpened] = useState(false)
  const handleGetTestedIframeToggle = useCallback(() => {
    setIsTestedIFrameOpened((s) => !s)
  }, [setIsTestedIFrameOpened])

  return (
    <>
      <div
        className='backdrop-blur--lite'
        style={{
          // borderTop: '1px solid lightgray',
          borderBottom: '1px solid lightgray',
          padding: '64px 0 32px 0',
          position: 'sticky',
          top: 0,
          zIndex: 2,
        }}
      >
        <ResponsiveBlock
          isLimited
          isPaddedMobile
        >
          <Typography
            variant="h5"
            display="block"
            // gutterBottom
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span style={{ fontFamily: 'Montserrat', fontWeight: 'bold' }}>SP exp</span>
            <Brightness1Icon color={isConnected ? 'success' : 'error'} />
          </Typography>
          <div>Cache size <b>{datasizeInfo}</b> | Total reports <b>{viState.items.length}</b>{!!hasAnyFilter ? <><br /><span>Displayed reports <b>{filteredReports.length}</b></span></> : ''}</div>
        </ResponsiveBlock>
      </div>
      <ResponsiveBlock
        isLimited
        isPaddedMobile
        style={{
          // borderTop: '1px solid lightgray',
          // borderBottom: '1px solid lightgray',
          padding: '32px 0 32px 0',
        }}
      >
        <Stack spacing={2}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              // border: '1px solid red',
              gap: '0px',
            }}
          >
            {filteredReports.map((ps) => (
              <ReportListItem
                key={`${ps.ts}-${ps.room}-${ps.appVersion}-${ps.stateValue}`}
                // @ts-ignore
                report={ps}
                onSetActiveReport={handleSetActiveReport}
              />
            ))}
            {
              filteredReports.length === 0 && (
                <Alert
                  // sx={{ mb: 2 }}
                  variant="standard"
                  severity="info"
                >
                  Список пуст
                </Alert>
              )
            }
          </div>
        </Stack>

        {
          isConnected && (
            <Fab
              className='fadeIn'
              onClick={handleGetTestedIframeToggle}
              style={{
                position: 'fixed',
                zIndex: 6,
                top: '32px',
                left: '32px',
                color: '#000',
              }}
            >
              {
                isTestedIFrameOpened ? (
                  <i className="fas fa-arrow-left" style={{ fontSize: '35px' }} />
                ) : (
                  <i className="fas fa-mobile" style={{ fontSize: '35px' }} />
                )
              }
            </Fab>
          )
        }
        <iframe
          src='https://pravosleva.pro/dist.sp-tradein-2023/'
          // height='500px'
          // width='500px'
          className={clsx(classes.fixedTop, classes.fixedTopSPClientFrame, { [classes.isOpened]: isTestedIFrameOpened })}
        ></iframe>

        {
          !!viState.activeReport && (
            <>
              <div className={clsx(classes.fixedTop, classes.fixedTopActiveReport, 'backdrop-blur', 'fade-in-speed-2')}>
                <div className={classes.stickyTopHeader}>
                  {!!viState.activeReport.imei && <div>{viState.activeReport.imei}</div>}
                  <div>{viState.activeReport.stateValue.replace('stepMachine:', '')}</div>
                </div>
                {
                  viState.activeReport.stepDetails && (
                    <CollapsibleBox
                      label={`⚙️ Step details${
                        !!viState.activeReport._wService
                        ? viState.activeReport._wService?._perfInfo.tsList.length > 2
                          ? ` (${getTimeDiff({ startDate: new Date(viState.activeReport._wService._perfInfo.tsList[1].ts), finishDate: new Date(viState.activeReport._wService._perfInfo.tsList[viState.activeReport._wService._perfInfo.tsList.length - 1].ts) }).message})`
                          : ''
                        : ''}`}
                      descritpion={
                        <pre
                          style={{ fontFamily: 'system-ui' }}
                          className={classes.pre}
                        >
                          {JSON.stringify(viState.activeReport.stepDetails, null, 4)}
                        </pre>
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
                <i className="fas fa-times-circle" style={{ fontSize: '35px' }} />
              </Fab>
            </>
          )
        }
      </ResponsiveBlock>
      {
        isMobile && isBrowser && isConnected && (
          <div
            style={{
              marginTop: 'auto',
              position: 'sticky',
              bottom: '0px',
              zIndex: 2,
              padding: '16px',
              // backgroundColor: '#fff',
              borderTop: '1px solid lightgray',

              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
            className='backdrop-blur--lite'
          >
            {
              !isTestedIFrameOpened && isFiltersOpened && <FiltersContent />
            }
            <div className='special-grid-actions'>
              {
                !isConnectedToPrivateRoom ? (
                  <Button
                    ref={connectBtnRef}
                    size='small'
                    startIcon={<ImportExportIcon />}
                    fullWidth
                    variant='contained'
                    color='primary'
                    onClick={() => onConnClick(disconnectBtnRef)}
                    // endIcon={<b style={{ fontSize: 'smaller' }}><code>{spReportRoomId}</code></b>}
                    endIcon={<Brightness1Icon />}
                    disabled={!isConnected}
                  >
                    <span className='truncate'>Online</span>
                  </Button>
                ) : (
                  <Button
                    ref={disconnectBtnRef}
                    size='small'
                    startIcon={<CloseIcon />}
                    fullWidth
                    variant="outlined"
                    color='primary'
                    onClick={() => onDisconnClick(connectBtnRef)}
                    // endIcon={<b style={{ fontSize: 'smaller' }}><code>{spReportRoomId}</code></b>}
                    endIcon={<Brightness1Icon color='success' />}
                    disabled={!isConnected}
                  >
                    <span className='truncate'>Disconnect</span>
                  </Button>
                )
              }
              <Button
                size='small'
                startIcon={<FilterAltIcon />}
                fullWidth
                variant={hasAnyFilter ? 'contained' : 'outlined'}
                color={isFiltersOpened ? 'error' : 'secondary'}
                onClick={filtersToggle}
                endIcon={isFiltersOpened ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                disabled={!isConnected || isTestedIFrameOpened}
              >
                <span className='truncate'>Filters</span>
              </Button>
            </div>
          </div>
        )
      }
      {
        isDesktop && isBrowser && (
          <div
            style={{
              marginTop: 'auto',
              // position: 'sticky',
              position: 'fixed',
              bottom: '0px',
              zIndex: 2,
              padding: '16px',
              width: '500px',
              boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 10px 4px',
              borderTopRightRadius: '16px',

              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
            className={clsx('backdrop-blur--lite')}
          >
            {
              isFiltersOpened && <FiltersContent />
            }
            <div className='special-grid-actions'>
              {
                !isConnectedToPrivateRoom ? (
                  <Button
                    ref={connectBtnRef}
                    size='small'
                    startIcon={<ImportExportIcon />}
                    fullWidth
                    variant='contained'
                    color='primary'
                    onClick={() => onConnClick(disconnectBtnRef)}
                    // endIcon={<b style={{ fontSize: 'smaller' }}><code>{spReportRoomId}</code></b>}
                    endIcon={<Brightness1Icon />}
                    disabled={!isConnected}
                  >
                    <span className='truncate'>Online</span>
                  </Button>
                ) : (
                  <Button
                    ref={disconnectBtnRef}
                    size='small'
                    startIcon={<CloseIcon />}
                    fullWidth
                    variant="outlined"
                    color='primary'
                    onClick={() => onDisconnClick(connectBtnRef)}
                    // endIcon={<b style={{ fontSize: 'smaller' }}><code>{spReportRoomId}</code></b>}
                    endIcon={<Brightness1Icon color='success' />}
                    disabled={!isConnected}
                  >
                    <span className='truncate'>Disconnect</span>
                  </Button>
                )
              }
              <Button
                size='small'
                startIcon={<FilterAltIcon />}
                fullWidth
                variant={hasAnyFilter ? 'contained' : 'outlined'}
                color={isFiltersOpened ? 'error' : 'secondary'}
                onClick={filtersToggle}
                endIcon={isFiltersOpened ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                disabled={!isConnected || isTestedIFrameOpened}
              >
                <span className='truncate'>Filters</span>
              </Button>
            </div>
          </div>
        )
      }
    </>
  )
})

type TStandartTargetCallback = {
  ok: boolean;
  message: string;
  notistackProps?: Partial<IOptionsObject>;
}
type TStandartCommonEvent = {
  message: string;
  notistackProps?: Partial<IOptionsObject>;
}

const Logic = () => {
  const [_isConnected, setStore] = useStore((store: TSocketMicroStore) => store.isConnected)
  const viState = useProxy(vi)
  const addReportItem = useCallback((report: NEvent.TReport) => {
    if (!!report) viState.FOR_EXAMPLE.items = [report, ...viState.FOR_EXAMPLE.items]
  }, [])
  const replaceReports = useCallback((items: NEvent.TReport[]) => {
    viState.FOR_EXAMPLE.items = items
  }, [])
  const socketRef = useRef<Socket | null>(null)
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
  
  const disableDelayToggler = useCallback(({ elm, ms }: { elm: HTMLButtonElement | null; ms: number }) => {
    if (!!elm) {
      elm.disabled = true
      elm.style.opacity = '0.5'
      setTimeout(() => {
        elm.disabled = false
        elm.style.opacity = '1'
      }, ms)
    } else console.log(`elm is ${typeof elm}`)
  }, [])

  const handleWannaBeConnected = useCallback((disconnectBtnRef: React.RefObject<HTMLButtonElement>) => {
    if (!!socketRef.current) {
      socketRef.current.emit(NEvent.ServerIncoming.WANNA_BE_CONNECTED_TO_ROOM, { roomId: spReportRoomId }, (data: TStandartTargetCallback) => {
        if (data.ok) {
          setStore({ isConnectedToPrivateRoom: true })
          showNotif(data?.message || 'Connected to private channel successfully (No message from backend)', { variant: 'success', autoHideDuration: 5000, ...(data?.notistackProps || {}) })
          disableDelayToggler({ elm: disconnectBtnRef.current, ms: 2000 })
        } else {
          setStore({ isConnectedToPrivateRoom: false })
          showNotif(data?.message || 'Connection to private channel errored (No message from backend)', { variant: 'error', autoHideDuration: 7000, ...(data?.notistackProps || {}) })
        }
      })
    } else {
      showNotif('FRONT: Socket was not connected yet?', { variant: 'error', autoHideDuration: 7000 })
      groupLog({ spaceName: '⛔ FRONT: Socket was not connected yet?', items: ['socketRef.current', socketRef.current] })
    }
  }, [])
  const handleWannaBeDisonnected = useCallback((connectBtnRef: React.RefObject<HTMLButtonElement>) => {
    if (!!socketRef.current) {
      socketRef.current.emit(NEvent.ServerIncoming.WANNA_BE_DISCONNECTED_FROM_ROOM, { roomId: spReportRoomId }, (data: TStandartTargetCallback) => {
        if (data.ok) {
          setStore({ isConnectedToPrivateRoom: false })
          showNotif(data?.message || 'Disconnected from private channel successfully (No message from backend)', { variant: 'success', autoHideDuration: 5000, ...(data?.notistackProps || {}) })
          disableDelayToggler({ elm: connectBtnRef.current, ms: 2000 })
        } else {
          // setStore({ isConnectedToPrivateRoom: false })
          showNotif(data?.message || 'Disconnection from private channel errored (No message from backend)', { variant: 'error', autoHideDuration: 7000, ...(data?.notistackProps || {}) })
        }
      })
    } else {
      showNotif('FRONT: Socket was not connected yet?', { variant: 'error', autoHideDuration: 7000 })
      groupLog({ spaceName: '⛔ FRONT: Socket was not connected yet?', items: ['socketRef.current', socketRef.current] })
    }
  }, [])

  useEffect(() => {
    let clientKey
    try {
      clientKey = window.localStorage.getItem('sp-tardein-report:uck')
      if (!clientKey) throw new Error('uniqueClientKey not found')
    } catch (err) {
      clientKey = getRandomString(10)
      try {
        window.localStorage.setItem('sp-tardein-report:uck', clientKey)
      } catch (err) {
        console.log(err)
      }
    }
    const uniqueClientKey = `${clientKey}.${new Date().getTime()}`
    // console.log(NEXT_APP_SOCKET_API_ENDPOINT)
    const socket: Socket = io(NEXT_APP_SOCKET_API_ENDPOINT, {
      reconnection: true,
      transports: ['websocket', 'polling'],
      secure: isProd,
      extraHeaders: {
        uniqueClientKey,
      },
      query: {
        uniqueClientKey,
        roomId: 'FOR_EXAMPLE',
      },
    })
    socketRef.current = socket

    // -- NOTE: Common
    const onConnectListener = () => {
      groupLog({ spaceName: '-- connect', items: ['no args'] })
      setStore({ isConnected: true })
    }
    socket.on('connect', onConnectListener)

    const onConnectErrorListener = (arg: any) => {
      groupLog({ spaceName: '-- connect_error', items: [arg] })
      showNotif('Connect error', { variant: 'error', autoHideDuration: 3000 })

      if (!!socketRef.current) {
        // NOTE: Revert to classic upgrade
        socketRef.current.io.opts.transports = ['polling', 'websocket']
      }
    }
    socket.on('connect_error', onConnectErrorListener)

    const onReconnectErrorListener = (arg: any) => {
      groupLog({ spaceName: '-- reconnect', items: [arg] })
      showNotif('Reconnect', { variant: 'success', autoHideDuration: 3000 })
    }
    socket.on('reconnect', onReconnectErrorListener)

    const onReconnectAttemptListener = (arg: any) => {
      groupLog({ spaceName: '-- reconnect_attempt', items: [arg] })
      showNotif('Reconnect attempt', { variant: 'info', autoHideDuration: 3000 })
    }
    socket.on('reconnect_attempt', onReconnectAttemptListener)

    const onDisonnectListener = () => {
      groupLog({ spaceName: '-- disconnect', items: ['no data'] })
      setStore(initialState)
    }
    socket.on('disconnect', onDisonnectListener)
    // --

    const onSomebodyConnectedToRoom = (data: TStandartCommonEvent) => {
      groupLog({ spaceName: `-- ${NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM}`, items: [data] })
      showNotif(data?.message || 'Somebody connected', { variant: 'info', autoHideDuration: 10000, ...(data?.notistackProps || {}) })
    }
    socket.on(NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM, onSomebodyConnectedToRoom)

    const onCommonMessage = (data: TStandartCommonEvent) => {
      groupLog({ spaceName: `-- ${NEvent.ServerOutgoing.COMMON_MESSAGE}`, items: [data] })
      showNotif(data?.message || 'Common message', { variant: 'info', autoHideDuration: 10000, ...(data?.notistackProps || {}) })
    }
    socket.on(NEvent.ServerOutgoing.COMMON_MESSAGE, onCommonMessage)

    const onTradeinCommonMessage = (data: TStandartCommonEvent) => {
      groupLog({ spaceName: `-- ${NEvent.ServerOutgoing.SP_TRADEIN_COMMON_MESSAGE}`, items: [data] })
      showNotif(data?.message, { variant: 'info', autoHideDuration: 10000, ...(data?.notistackProps || {}) })
    }
    socket.on(NEvent.ServerOutgoing.SP_TRADEIN_COMMON_MESSAGE, onTradeinCommonMessage)

    const onReceiveReportEvent = (data: NEvent.TIncomingDataFormat) => {
      groupLog({ spaceName: `-- ${NEvent.ServerOutgoing.SP_TRADEIN_REPORT_EV}`, items: [data] })
      // showNotif(data?.message || 'SP report', { variant: 'info', autoHideDuration: 10000, ...(data?.notistackProps || {}) })
      if (!!data.report) addReportItem(data.report)
    }
    socket.on(NEvent.ServerOutgoing.SP_TRADEIN_REPORT_EV, onReceiveReportEvent)

    const onReplaceTradeinRoomReports = (data: { items: NEvent.TReport[] }) => {
      groupLog({ spaceName: `-- ${NEvent.ServerOutgoing.SP_TRADEIN_REPLACE_REPORTS}`, items: [data] })
      replaceReports(data.items)
    }
    socket.on(NEvent.ServerOutgoing.SP_TRADEIN_REPLACE_REPORTS, onReplaceTradeinRoomReports)

    return () => {
      socket.emit(NEvent.ServerIncoming.WANNA_BE_DISCONNECTED_FROM_ROOM, handleWannaBeDisonnected)
      // - NOTE: See also https://socket.io/docs/v4/client-api/#socketoffeventname
      socket.off('disconnect', onDisonnectListener)
      socket.off(NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM, onSomebodyConnectedToRoom)
      socket.off(NEvent.ServerOutgoing.COMMON_MESSAGE, onCommonMessage)
      socket.off(NEvent.ServerOutgoing.SP_TRADEIN_COMMON_MESSAGE, onTradeinCommonMessage)
      socket.off(NEvent.ServerOutgoing.SP_TRADEIN_REPORT_EV, onReceiveReportEvent)
      socket.off(NEvent.ServerOutgoing.SP_TRADEIN_REPLACE_REPORTS, onReplaceTradeinRoomReports)
      socket.off('connect_error', onConnectErrorListener)
      socket.off('reconnect', onReconnectErrorListener)
      socket.off('reconnect_attempt', onReconnectAttemptListener)
      socket.off('connect', onConnectListener)
      // -
      if (!!socketRef.current) socketRef.current.close()
    }
  }, [])

  return (
    <UI
      onConnClick={(disconnectBtnRef) => handleWannaBeConnected(disconnectBtnRef)}
      onDisconnClick={(connectBtnRef) => handleWannaBeDisonnected(connectBtnRef)}
    />
  )
}

export const ConnectedData = () => {
  return (
    <WithSocketContext>
      <div
        // className={classes.wrapper}
      >
        <Logic />
      </div>
    </WithSocketContext>
  )
}
