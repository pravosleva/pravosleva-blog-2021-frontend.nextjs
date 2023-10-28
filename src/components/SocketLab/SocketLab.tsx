import { useCallback, useRef, useEffect } from 'react'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { WithSocketContextHOC, useStore, NEvent, TSocketMicroStore, initialState } from './withSocketContextHOC'
import io, { Socket } from 'socket.io-client'
import { useSnackbar, SnackbarMessage as TSnackbarMessage, OptionsObject as IOptionsObject } from 'notistack'
import { groupLog } from '~/utils/groupLog'
import { Button, Stack } from '@mui/material'

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const NEXT_APP_SOCKET_API_ENDPOINT = isDev ? 'http://localhost:3000' : (process.env.NEXT_APP_SOCKET_API_ENDPOINT || 'https://pravosleva.pro')

type TStandartTargetCallback = {
  ok: boolean;
  message: string;
}
type TStandartCommonEvent = {
  message: string;
}

export const Logic = () => {
  const [isConnected, setStore] = useStore((store: TSocketMicroStore) => store.isConnected)
  const [isConnectedToPrivateRoom] = useStore((store: TSocketMicroStore) => store.isConnectedToPrivateRoom)
  const socketRef = useRef<Socket | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const showNotif = useCallback((msg: TSnackbarMessage, opts?: IOptionsObject) => {
    if (!document.hidden) enqueueSnackbar(msg, opts)
  }, [])
  const handleWannaBeConnected = useCallback(() => {
    if (!!socketRef.current) {
      socketRef.current.emit(NEvent.ServerIncoming.WANNA_BE_CONNECTED_TO_ROOM, { roomId: 'sample' }, (data: TStandartTargetCallback) => {
        if (data.ok) {
          setStore({ isConnectedToPrivateRoom: true })
          showNotif(data?.message || 'Connected to private channel successfully (No message from backend)', { variant: 'success', autoHideDuration: 5000 })
        } else {
          setStore({ isConnectedToPrivateRoom: false })
          showNotif(data?.message || 'Connection to private channel errored (No message from backend)', { variant: 'error', autoHideDuration: 7000 })
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
          showNotif(data?.message || 'Disconnected from private channel successfully (No message from backend)', { variant: 'success', autoHideDuration: 5000 })
        } else {
          // setStore({ isConnectedToPrivateRoom: false })
          showNotif(data?.message || 'Disconnection from private channel errored (No message from backend)', { variant: 'error', autoHideDuration: 7000 })
        }
      })
    } else {
      showNotif('FRONT: Socket was not connected yet?', { variant: 'error', autoHideDuration: 7000 })
      groupLog({ spaceName: '⛔ FRONT: Socket was not connected yet?', items: ['socketRef.current', socketRef.current] })
    }
  }, [])

  useEffect(() => {
    const socket: Socket = io(NEXT_APP_SOCKET_API_ENDPOINT, {
      reconnection: true,
      transports: ['websocket', 'polling'],
      secure: isProd,
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
      showNotif(data?.message || 'Somebody connected', { variant: 'info', autoHideDuration: 7000 })
    }
    socket.on(NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM, onSomebodyConnectedToRoom)

    const onCommonMessage = (data: TStandartCommonEvent) => {
      groupLog({ spaceName: `-- ${NEvent.ServerOutgoing.COMMON_MESSAGE}`, items: [data] })
      showNotif(data?.message || 'Common message', { variant: 'info', autoHideDuration: 7000 })
    }
    socket.on(NEvent.ServerOutgoing.COMMON_MESSAGE, onCommonMessage)

    return () => {
      socket.emit(NEvent.ServerIncoming.WANNA_BE_DISCONNECTED_FROM_ROOM, handleWannaBeDisonnected)
      // NOTE: See also https://socket.io/docs/v4/client-api/#socketoffeventname
      socket.off('disconnect', onDisonnectListener)
      socket.off(NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM, onSomebodyConnectedToRoom)
      socket.off(NEvent.ServerOutgoing.COMMON_MESSAGE, onCommonMessage)
      socket.off('connect_error', onConnectErrorListener)
      socket.off('reconnect', onReconnectErrorListener)
      socket.off('reconnect_attempt', onReconnectAttemptListener)
      socket.off('connect', onConnectListener)
      // socket.
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
      <div>isConnected: {String(isConnected)}</div>
      <div>isConnectedToPrivateRoom: {String(isConnectedToPrivateRoom)}</div>
      {
        !isConnectedToPrivateRoom ? (
          <Button
            size='small'
            // startIcon={<UploadIcon />}
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
            size='small'
            // startIcon={<UploadIcon />}
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
