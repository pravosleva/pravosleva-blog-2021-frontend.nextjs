import { useCallback, useRef, useEffect } from 'react'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { WithSocketContextHOC, useStore, NEvent, TSocketMicroStore } from './withSocketContextHOC'
import io, { Socket } from 'socket.io-client'
import { useSnackbar, SnackbarMessage as TSnackbarMessage, OptionsObject as IOptionsObject } from 'notistack'
import { groupLog } from '~/utils/groupLog'
import { Button, Stack } from '@mui/material'

const NEXT_APP_SOCKET_API_ENDPOINT = process.env.NEXT_APP_SOCKET_API_ENDPOINT || 'https://pravosleva.pro'
const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

type TStandartTargetCallback = {
  ok: boolean;
  message: string;
}
type TStandartCommonEvent = {
  message: string;
}

export const Logic = () => {
  const [isConnected, setStore] = useStore((store: TSocketMicroStore) => store.isConnected)
  const socketRef = useRef<Socket | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const showNotif = useCallback((msg: TSnackbarMessage, opts?: IOptionsObject) => {
    if (!document.hidden) enqueueSnackbar(msg, opts)
  }, [])
  const handleWannaBeConnected = useCallback(() => {
    if (!!socketRef.current) {
      socketRef.current.emit(NEvent.ServerIncoming.WANNA_BE_CONNECTED_TO_ROOM, { roomId: 'sample' }, (data: TStandartTargetCallback) => {
        // console.log(data)
        if (data.ok) {
          setStore({ isConnected: true })
          showNotif(data?.message || 'Connected to private channel successfully (No message from backend)', { variant: 'success', autoHideDuration: 5000 })
        } else {
          setStore({ isConnected: false })
          showNotif(data?.message || 'Connection to private channel errored (No message from backend)', { variant: 'error', autoHideDuration: 7000 })
        }
      })
    } else {
      showNotif('FRON: Socket was not connected yet?', { variant: 'error', autoHideDuration: 7000 })
      groupLog({ spaceName: '⛔ FRONT: Socket was not connected yet?', items: ['socketRef.current', socketRef.current] })
    }
  }, [])

  useEffect(() => {
    const socket: Socket = io(isDev ? 'http://localhost:3000' : NEXT_APP_SOCKET_API_ENDPOINT, {
      reconnection: true,
      transports: ['websocket', 'polling'],
      secure: isProd,
    })
    socketRef.current = socket

    const onSomebodyConnectedToRoom = (data: TStandartCommonEvent) => {
      // groupLog({ spaceName: `-- ${NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM}`, items: [data] })

      showNotif(data?.message || 'Somebody connected', { variant: 'info', autoHideDuration: 5000 })
    }
    socket.on(NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM, onSomebodyConnectedToRoom)
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
      <h1>SocketLab exp</h1>
      <Stack spacing={1}>
      <div>isConnected: {String(isConnected)}</div>
      {
        !isConnected && (
          <Button
            size='small'
            // startIcon={<UploadIcon />}
            // fullWidth
            variant="outlined"
            color='primary'
            onClick={handleWannaBeConnected}
            endIcon={<b style={{ fontSize: 'smaller' }}><code>sample</code></b>}
          >
            Wanna be connected to room id
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
