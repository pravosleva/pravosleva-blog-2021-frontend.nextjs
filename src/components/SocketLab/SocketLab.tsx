import { useCallback, useRef, useEffect } from 'react'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { WithSocketContextHOC, useStore, NEvent, TSocketMicroStore, initialState } from './withSocketContextHOC'
import io, { Socket } from 'socket.io-client'
import {
  useSnackbar,
  SnackbarMessage as TSnackbarMessage,
  OptionsObject as IOptionsObject,
  // SharedProps as ISharedProps,
  closeSnackbar,
} from 'notistack'
import { groupLog } from '~/utils/groupLog'
import { Button, Stack, IconButton } from '@mui/material'
import classes from './SocketLab.module.scss'
import clsx from 'clsx'

// import SyncAltIcon from '@mui/icons-material/SyncAlt'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import CloseIcon from '@mui/icons-material/Close'
import { getRandomString } from '~/utils/getRandomString'

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const NEXT_APP_SOCKET_API_ENDPOINT = isDev ? 'http://localhost:3000' : (process.env.NEXT_APP_SOCKET_API_ENDPOINT || 'https://pravosleva.pro')

type TStandartTargetCallback = {
  ok: boolean;
  message: string;
  notistackProps?: Partial<IOptionsObject>;
}
type TStandartCommonEvent = {
  message: string;
  notistackProps?: Partial<IOptionsObject>;
}

export const Logic = () => {
  const [isConnected, setStore] = useStore((store: TSocketMicroStore) => store.isConnected)
  const [isConnectedToPrivateRoom] = useStore((store: TSocketMicroStore) => store.isConnectedToPrivateRoom)
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
          <CloseIcon fontSize='small' style={{ color: '#fff' }} />,
        </IconButton>
      ),
    })
  }, [])

  const connectBtnRef = useRef<HTMLButtonElement>(null)
  const disconnectBtnRef = useRef<HTMLButtonElement>(null)
  const disableDelayToggler = useCallback(({ elm, ms }: { elm: HTMLButtonElement | null; ms: number }) => {
    if (!!elm) {
      elm.disabled = true
      elm.style.opacity = '0.5'
      setTimeout(() => {
        elm.disabled = false
        elm.style.opacity = '1'
      }, ms)
    } else {
      console.log(elm)
    }
  }, [])

  const handleWannaBeConnected = useCallback(() => {
    if (!!socketRef.current) {
      socketRef.current.emit(NEvent.ServerIncoming.WANNA_BE_CONNECTED_TO_ROOM, { roomId: 'sample' }, (data: TStandartTargetCallback) => {
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
  const handleWannaBeDisonnected = useCallback(() => {
    if (!!socketRef.current) {
      socketRef.current.emit(NEvent.ServerIncoming.WANNA_BE_DISCONNECTED_FROM_ROOM, { roomId: 'sample' }, (data: TStandartTargetCallback) => {
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
      clientKey = window.localStorage.getItem('socket-lab:uck')
      if (!clientKey) throw new Error('uniqueClientKey not found')
    } catch (err) {
      clientKey = getRandomString(10)
      try {
        window.localStorage.setItem('socket-lab:uck', clientKey)
      } catch (err) {
        console.log(err)
      }
    }
    const uniqueClientKey = `${clientKey}.${new Date().getTime()}`
    const socket: Socket = io(NEXT_APP_SOCKET_API_ENDPOINT, {
      reconnection: true,
      transports: ['websocket', 'polling'],
      secure: isProd,
      extraHeaders: {
        uniqueClientKey,
      },
      query: {
        uniqueClientKey,
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

    return () => {
      socket.emit(NEvent.ServerIncoming.WANNA_BE_DISCONNECTED_FROM_ROOM, handleWannaBeDisonnected)
      // - NOTE: See also https://socket.io/docs/v4/client-api/#socketoffeventname
      socket.off('disconnect', onDisonnectListener)
      socket.off(NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM, onSomebodyConnectedToRoom)
      socket.off(NEvent.ServerOutgoing.COMMON_MESSAGE, onCommonMessage)
      socket.off('connect_error', onConnectErrorListener)
      socket.off('reconnect', onReconnectErrorListener)
      socket.off('reconnect_attempt', onReconnectAttemptListener)
      socket.off('connect', onConnectListener)
      // -
      if (!!socketRef.current) socketRef.current.close()
    }
  }, [])
  return (
    <ResponsiveBlock
      isLimited
      isPaddedMobile
      style={{
        borderTop: '1px solid lightgray',
        borderBottom: '1px solid lightgray',
        padding: '32px 0 32px 0',
      }}
    >
      <h1>SocketLab exp 🧪</h1>
      <Stack spacing={1}>
        <div className='price-grid-2c'>
          <div><code>isConnected</code></div>
          <div>{isConnected ? '✅' : '⛔'} <b className={clsx(isConnected ? classes.success : classes.danger)}>{String(isConnected)}</b></div>
          <div><code>isConnectedToPrivateRoom</code></div>
          <div>{isConnectedToPrivateRoom ? '✅' : '⛔'} <b className={clsx(isConnectedToPrivateRoom ? classes.success : classes.danger)}>{String(isConnectedToPrivateRoom)}</b></div>
        </div>
        {
          !isConnectedToPrivateRoom ? (
            <Button
              ref={connectBtnRef}
              size='small'
              startIcon={<ImportExportIcon />}
              // fullWidth
              variant="outlined"
              color='primary'
              onClick={handleWannaBeConnected}
              endIcon={<b style={{ fontSize: 'smaller' }}><code>sample</code></b>}
            >
              <span className='truncate'>Wanna be connected to room id</span>
            </Button>
          ) : (
            <Button
              ref={disconnectBtnRef}
              size='small'
              startIcon={<CloseIcon />}
              // fullWidth
              variant="outlined"
              color='primary'
              onClick={handleWannaBeDisonnected}
              endIcon={<b style={{ fontSize: 'smaller' }}><code>sample</code></b>}
            >
              <span className='truncate'>Wanna be disconnected from room id</span>
            </Button>
          )
        }
      </Stack>
    </ResponsiveBlock>
  )
}

export const SocketLab = () => (
  <WithSocketContextHOC>
    <Logic />
  </WithSocketContextHOC>
)
