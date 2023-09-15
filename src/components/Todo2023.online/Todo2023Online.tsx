import { useStore, WithSocketContext, TSocketMicroStore } from '~/components/Todo2023.online/hocs'
import { useCallback, useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { groupLog } from '~/utils/groupLog'
import { NEvent, NEventData } from './types'
import { useSelector, useDispatch } from 'react-redux'
import {
  replaceAudits,
} from '~/store/reducers/todo2023'
import { IRootState } from '~/store/IRootState'
import { useCompare } from '~/hooks/useDeepEffect'
import { /* VariantType, */ useSnackbar } from 'notistack'
import { /* AddNewBtn, */ AddNewBtn, AuditList } from '~/components/ToDo2023.offline/components'
import {
  Box,
  Button,
  // Button,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
 } from '@mui/material'
import { todo2023HttpClient } from '~/utils/todo2023HttpClient'
// import UploadIcon from '@mui/icons-material/Upload';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SendIcon from '@mui/icons-material/Send'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SaveIcon from '@mui/icons-material/Save'
import { useLastUpdatedAuditTs } from './hooks/useLastUpdatedAuditTs'
import { useTimeAgo } from '~/hooks/useTimeAgo'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from '~/components/Link';

const NEXT_APP_SOCKET_API_ENDPOINT = process.env.NEXT_APP_SOCKET_API_ENDPOINT || 'http://pravosleva.ru'

type TLogicProps = {
  room: number;
}

const Logic = ({ room }: TLogicProps) => {
  // -- NOTE: External logic
  const dispatch = useDispatch()
  // --
  const roomRef = useRef<number>(room)
  const [isConnected, setStore] = useStore((store: TSocketMicroStore) => store.isConnected)
  const [audits] = useStore((store: TSocketMicroStore) => store.audits)
  const socketRef = useRef<Socket | null>(null)
  const localAudits = useSelector((store: IRootState) => store.todo2023.localAudits)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const socket: Socket = io(NEXT_APP_SOCKET_API_ENDPOINT, {
      reconnection: true,
      transports: ['websocket', 'polling'],
      // secure: true,
    })
    socketRef.current = socket
    // const newStateDelta: Partial<TSocketMicroStore> = {}

    const onConnectListener = () => {
      groupLog({ spaceName: '-- connect', items: ['no args'] })
      setStore({ isConnected: true })

      socket.emit(NEvent.EServerIncoming.CLIENT_CONNECT_TO_ROOM, {
        room: roomRef.current,
      }, ({ data }: NEventData.NServerIncoming.TCLIENT_CONNECT_TO_ROOM_CB_ARG) => {
        groupLog({ spaceName: `-- ${NEvent.EServerIncoming.CLIENT_CONNECT_TO_ROOM}:cb`, items: [data] })
        setStore({ audits: data.audits })
        enqueueSnackbar(`Получены аудиты (${data.audits.length})`, { variant: 'success', autoHideDuration: 3000 })
      })
    }
    socket.on('connect', onConnectListener)

    const onConnectErrorListener = (arg: any) => {
      groupLog({ spaceName: '-- connect_error', items: [arg] })
      enqueueSnackbar('Connect error', { variant: 'error', autoHideDuration: 3000 })
    }
    socket.on('connect_error', onConnectErrorListener)
    
    const onReconnectErrorListener = (arg: any) => {
      groupLog({ spaceName: '-- reconnect', items: [arg] })
      enqueueSnackbar('Reconnect', { variant: 'success', autoHideDuration: 3000 })
    }
    socket.on('reconnect', onReconnectErrorListener)

    const onReconnectAttemptListener = (arg: any) => {
      groupLog({ spaceName: '-- reconnect_attempt', items: [arg] })
      enqueueSnackbar('Reconnect attempt', { variant: 'info', autoHideDuration: 3000 })
    }
    socket.on('reconnect_attempt', onReconnectAttemptListener)

    const onAuditsReplace = (data: NEventData.NServerOutgoing.TAUDITLIST_REPLACE) => {
      groupLog({ spaceName: `-- ${NEvent.EServerOutgoing.AUDITLIST_REPLACE}`, items: [data] })
      setStore({ audits: data.audits })
    }
    socket.on(NEvent.EServerOutgoing.AUDITLIST_REPLACE, onAuditsReplace);

    // TODO?

    socket.on('disconnect', () => {
      groupLog({ spaceName: '-- disconnect', items: ['no data'] })
      setStore({ isConnected: false })
    })

    // return () => {
    //   socket.off(NEvent.EServerOutgoing.AUDITLIST_REPLACE, onAuditsReplace)
    //   socket.off('connect_error', onConnectErrorListener)
    //   socket.off('reconnect', onReconnectErrorListener)
    //   socket.off('reconnect_attempt', onReconnectAttemptListener)
    // }
  }, [])

  //-- NOTE: Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpened = Boolean(anchorEl);
  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, [])
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, [])
  // --
  const handlePush = useCallback(() => {
    const isConfirmed = window.confirm('Удаленный кэш будет перезаписан! Вы уверены?')
    if (isConfirmed) {
      try {
        handleMenuClose()
        if (!socketRef.current) throw new Error('socket err')
        socketRef.current.emit(NEvent.EServerIncoming.AUDITLIST_REPLACE, {
          room: roomRef.current,
          audits: localAudits,
        }, (_ps: NEventData.NServerIncoming.TAUDITLIST_REPLACE_CB_ARG) => {
          // const { data } = ps
          // groupLog({ spaceName: `-- ${NEvent.EServerIncoming.AUDITLIST_REPLACE}:cb`, items: [data, 'Will be set to store'] })
          // setStore({ audits: data.audits })
          // enqueueSnackbar('Ok', { variant: 'success', autoHideDuration: 3000 })
        })
      } catch (err) {
        console.warn(err)
      }
    }
  }, [useCompare([localAudits])])
  const handleRemoveAudit = useCallback(({
    auditId,
  }) => {
    const isConfirmed = window.confirm('Вы уверены?')
    if (isConfirmed) {
      if (!socketRef.current) throw new Error('socket err')
      socketRef.current.emit(NEvent.EServerIncoming.AUDIT_REMOVE, {
        room: roomRef.current,
        auditId,
      }, (_ps : NEventData.NServerIncoming.TAUDIT_REMOVE_CB_ARG) => {
        // const { data } = ps
        // setStore({ audits: data.audits })
        // groupLog({ spaceName: `-- ${NEvent.EServerIncoming.AUDIT_REMOVE} SKIP: Wait fot emit from server...`, items: [data] })
      })
    }
  }, [])
  const handleAddJob = useCallback(({
    auditId,
    name,
    subjobs,
  }) => {
    if (!socketRef.current) throw new Error('socket err')
    socketRef.current.emit(NEvent.EServerIncoming.JOB_ADD, {
      room: roomRef.current,
      auditId,
      name,
      subjobs,
    })
  }, [])
  const handleAddSubjob = useCallback(({
    name,
    auditId,
    jobId,
  }) => {
    if (!socketRef.current) throw new Error('socket err')
    socketRef.current.emit(NEvent.EServerIncoming.SUBJOB_ADD, {
      room: roomRef.current,
      name,
      auditId,
      jobId,
    })
  }, [])
  const handleToggleJobDone = useCallback(({
    auditId,
    jobId,
  }) => {
    if (!socketRef.current) throw new Error('socket err')
    socketRef.current.emit(NEvent.EServerIncoming.JOB_TOGGLE_DONE, {
      room: roomRef.current,
      auditId,
      jobId,
    })
  }, [])
  const handleRemoveJob = useCallback(({
    auditId,
    jobId,
  }) => {
    const isConfirmed = window.confirm('Вы уверены?')
    if (isConfirmed) {
      if (!socketRef.current) throw new Error('socket err')
      socketRef.current.emit(NEvent.EServerIncoming.JOB_REMOVE, {
        room: roomRef.current,
        auditId,
        jobId,
      })
    }
  }, [])
  const handleToggleSubjob = useCallback(({
    auditId,
    jobId,
    subjobId,
  }) => {
    if (!socketRef.current) throw new Error('socket err')
    socketRef.current.emit(NEvent.EServerIncoming.SUBJOB_TOGGLE_DONE, {
      room: roomRef.current,
      auditId,
      jobId,
      subjobId,
    })
  }, [])

  const handleAddNewAudit = useCallback(async (arg: any) => {
    const { name, description } = arg
    if (!name) {
      // window.alert('Incorrect name')
      return
    }

    // NOTE: Get remote standardJobList -> Put to jobs
    const remoteJobs = await todo2023HttpClient.getJobs()
      .then((res) => {
        // @ts-ignore
        if (!res?.jobs) throw new Error('jobs was not received')
        // @ts-ignore
        enqueueSnackbar(`${res?.jobs.length} jobs received...`, { variant: 'success', autoHideDuration: 3000 })
        // @ts-ignore
        return res.jobs
      })
      .catch((err) => {
        console.log(err)
        return []
      })

    if (!socketRef.current) throw new Error('socket err')
    socketRef.current.emit(NEvent.EServerIncoming.AUDIT_ADD, {
      room: roomRef.current,
      name,
      description,
      jobs: remoteJobs,
    })
  }, [])
  const handleError = useCallback((arg: any) => {
    console.warn(arg)
  }, [])
  const handleCopyLink = useCallback((text: string) => {
    // groupLog({ spaceName: 'copy link', items: [text] })
    enqueueSnackbar(text, { variant: 'info', autoHideDuration: 5000 })
  }, [])
  // const { timeAgoText } = useTimeAgo({ delay: 1000, date: })
  const handleLocalBackup = useCallback(() => {
    const isConfirmed = window.confirm('Локальный кэш будет перезаписан! Вы уверены?')
    if (isConfirmed) {
      // groupLog({ spaceName: 'local backup', items: [`Local backup for ${room}`] })
      handleMenuClose()
      dispatch(replaceAudits({
        audits,
      }))
      enqueueSnackbar('Local backup saved', { variant: 'success', autoHideDuration: 3000 })
    }
  }, [useCompare([audits])])

  const { last: lastLocalAudits } = useLastUpdatedAuditTs({ audits: localAudits })
  const { last: lastRemoteAudits } = useLastUpdatedAuditTs({ audits })
  const { timeAgoText: lastRemoteAuditsTsUpdateTimeAgo } = useTimeAgo({ date: lastRemoteAudits.tsUpdate.value, delay: 1000 })
  const { timeAgoText: lastLocalAuditsTsUpdateTimeAgo } = useTimeAgo({ date: lastLocalAudits.tsUpdate.value, delay: 1000 })

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Container maxWidth="xs">
          <Box
            sx={{
              pt: 2,
              pb: 0,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h5" display="block" gutterBottom>
              Audit list | {isConnected ? 'connected' : 'disconnected'}
            </Typography>
            {/*
            <Button
              startIcon={<UploadIcon />}
              fullWidth
              variant="contained"
              color='secondary'
              onClick={handlePush}
            >Push from LS (Save)</Button>
          */}
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={isMenuOpened ? 'long-menu' : undefined}
              aria-expanded={isMenuOpened ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={isMenuOpened}
              onClose={handleMenuClose}
              PaperProps={{
                // style: {
                //   maxHeight: ITEM_HEIGHT * 4.5,
                //   width: '20ch',
                // },
              }}
            >
              <MenuItem
                selected={false}
                onClick={handlePush}
                disabled={localAudits.length === 0 || lastLocalAudits.tsUpdate.value === lastRemoteAudits.tsUpdate.value}
              >
                <ListItemIcon><SendIcon fontSize="small" color='error' /></ListItemIcon>
                <Typography variant="inherit">Restore from local ({localAudits.length})</Typography>
              </MenuItem>
              <CopyToClipboard
                text={`http://pravosleva.ru:9000/subprojects/todo/${room}`}
                onCopy={handleCopyLink}
              >
                <MenuItem selected={false}>
                  <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
                  <Typography variant="inherit">Copy link</Typography>
                </MenuItem>
              </CopyToClipboard>
              <MenuItem
                selected={false}
                onClick={handleLocalBackup}
                disabled={audits.length === 0 || lastLocalAudits.tsUpdate.value === lastRemoteAudits.tsUpdate.value}
              >
                <ListItemIcon><SaveIcon fontSize="small" color='error' /></ListItemIcon>
                <Typography variant="inherit">Local backup ({audits.length}) {lastLocalAuditsTsUpdateTimeAgo}</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Box
            sx={{
              pt: 0,
              pb: 0,
            }}
          >
            <Button fullWidth startIcon={<ArrowBackIcon />} variant='outlined' color='primary' component={Link} noLinkStyle href='/subprojects/todo' target='_self'>
              Onffline
            </Button>
          </Box>
          <Box
            sx={{
              pt: 2,
              pb: 2,
            }}
          >
            <em>Updated {lastRemoteAuditsTsUpdateTimeAgo}</em>
          </Box>
          <AuditList
            audits={audits}
            onRemoveAudit={handleRemoveAudit}
            onAddJob={handleAddJob}
            onAddSubjob={handleAddSubjob}
            onToggleJobDone={handleToggleJobDone}
            onRemoveJob={handleRemoveJob}
            onToggleSubjob={handleToggleSubjob}
          />
        </Container>
        {
          typeof window !== 'undefined' && (
            <div
              style={{
                marginTop: 'auto',
                position: 'sticky',
                bottom: '0px',
                zIndex: 2,
                padding: '16px',
                // backgroundColor: '#fff',
                // borderTop: '1px solid lightgray',
              }}
              className='backdrop-blur--lite'
            >
              <AddNewBtn
                cb={{
                  onSuccess: handleAddNewAudit,
                  onError: handleError,
                }}
                label='Добавить Аудит'
                muiColor='primary'
                cfg={{
                  name: {
                    type: 'text',
                    label: 'Название',
                    inputId: 'audit-name',
                    placeholder: 'Аудит',
                    defaultValue: '',
                    reactHookFormOptions: { required: true, maxLength: 20, minLength: 3 }
                  },
                  description: {
                    type: 'text',
                    label: 'Описание',
                    inputId: 'audit-description',
                    placeholder: 'Something',
                    defaultValue: '',
                    reactHookFormOptions: { required: false, maxLength: 50 }
                  }
                }}
              />
            </div>
          )
        }
      </div>
    </>
  )
}

type TProps = {
  room: number;
}

export const Todo2023Online = ({ room }: TProps) => (
  <WithSocketContext>
    <Logic room={room} />
  </WithSocketContext>
)
