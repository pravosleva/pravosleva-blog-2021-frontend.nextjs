import { useStore, WithSocketContext, TSocketMicroStore } from '~/components/Todo2023.online/hocs'
import {
  useCallback, useEffect,
  // useLayoutEffect,
  useMemo, useRef, useState,
} from 'react'
import io, { Socket } from 'socket.io-client'
import { groupLog } from '~/utils/groupLog'
import { NEvent, NEventData } from './types'
import { useSelector, useDispatch } from 'react-redux'
import {
  replaceAudits,
  fixVisitedPage,
  autoSyncToggle,
  addTemporayNamespace,
  // resetTemporayNamespaces,
  // replaceTodosRoomState,
} from '~/store/reducers/todo2023'
import { IRootState } from '~/store/IRootState'
import { useCompare } from '~/hooks/useDeepEffect'
import { /* VariantType, */ useSnackbar } from 'notistack'
import { /* AddNewBtn, */ AddNewBtn, AuditList, AuditGrid, NTodo } from '~/components/audit-helper'
import {
  Box,
  Button,
  // Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Typography,
 } from '@mui/material'
import { todo2023HttpClient } from '~/utils/todo2023HttpClient'
// import UploadIcon from '@mui/icons-material/Upload'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SendIcon from '@mui/icons-material/Send'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SaveIcon from '@mui/icons-material/Save'
import { useLastUpdatedAuditTs } from './hooks/useLastUpdatedAuditTs'
// import { useTimeAgo } from '~/hooks/useTimeAgo'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from '~/components/Link'
import { OneTimeLoginFormBtn } from '../Autopark2022/components/OneTimeLoginFormBtn'
import { autoparkHttpClient } from '~/utils/autoparkHttpClient'
import { setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import { useRouter } from 'next/router'
// import FolderIcon from '@mui/icons-material/Folder'
// import MuiLink from '@mui/material/Link'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { getNormalizedDateTime } from '~/utils/timeConverter'
import SyncIcon from '@mui/icons-material/Sync'
import { autoSyncDisable } from '~/store/reducers/todo2023'
import Brightness1Icon from '@mui/icons-material/Brightness1'
import { useWindowSize } from '~/hooks/useWindowSize'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { Widget } from '~/components/Widget'
import { TodoConnected } from './components'
import {
  addStrapiTodo,
  removeStrapiTodo,
  updateStrapiTodo,
  replaceStrapiTodo,
} from '~/store/reducers/todo2023NotPersisted'

const NEXT_APP_SOCKET_API_ENDPOINT = process.env.NEXT_APP_SOCKET_API_ENDPOINT || 'https://pravosleva.pro'
const isDev = process.env.NODE_ENV === 'development'

type TLogicProps = {
  room: number;
  // hasAuthenticatedOnSSR: boolean;
}

const Logic = ({ room }: TLogicProps) => {
  const router = useRouter()

  // -- NOTE: External logic
  const dispatch = useDispatch()
  // --
  const roomRef = useRef<number>(room)
  useEffect(() => {
    roomRef.current = Number(router.query.tg_chat_id)
  }, [router.query.tg_chat_id])
  const [isConnected, setStore] = useStore((store: TSocketMicroStore) => store.isConnected)
  const [remoteAudits] = useStore((store: TSocketMicroStore) => store.audits)
  const socketRef = useRef<Socket | null>(null)
  const localAudits = useSelector((store: IRootState) => store.todo2023.localAudits)
  const { enqueueSnackbar } = useSnackbar()
  const showStandartSocketErrMsg = useCallback(({ showSuccessMsg }: { showSuccessMsg: boolean }) => ({ isOk, message }: { isOk: boolean; message?: string }) => {
    if (!isOk) enqueueSnackbar(message || 'Что-то пошло не так', { variant: 'error', autoHideDuration: 7000 })
    else if (showSuccessMsg) enqueueSnackbar(message || 'Ok', { variant: 'success', autoHideDuration: 7000 })
  }, [enqueueSnackbar])

  useEffect(() => {
    // -- NOTE: Disable anyway!
    dispatch(autoSyncDisable())
    // --

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
      }, ({ data, ok, message }: NEventData.NServerIncoming.TCLIENT_CONNECT_TO_ROOM_CB_ARG) => {
        groupLog({ spaceName: `-- ${NEvent.EServerIncoming.CLIENT_CONNECT_TO_ROOM}:cb (ok: ${String(ok)}${!!message ? `, ${message}` : ''})`, items: [data] })
        setStore({
          // -- NOTE: Init anything (client 2/2)
          audits: data.audits,
          // common: {
          //   roomState: data.roomState || null,
          //   // NOTE: Etc.
          // },
          // --
        })
        // if (Array.isArray(data.strapiTodos) && data.strapiTodos.length > 0) {
        //   dispatch(replaceStrapiTodo(data.strapiTodos || []))
        // }
        if (!ok) enqueueSnackbar(`FRONT App init Error <- ${message || 'Что-то пошло не так'}`, { variant: 'error', autoHideDuration: 30000 })

        dispatch(replaceStrapiTodo(data?.strapiTodos || []))
        // if (data.audits.length > 0 && !document.hidden) enqueueSnackbar(`Получены аудиты (${data.audits.length})`, { variant: 'info', autoHideDuration: 2000 })
      })
    }
    socket.on('connect', onConnectListener)

    const onConnectErrorListener = (arg: any) => {
      groupLog({ spaceName: '-- connect_error', items: [arg] })
      if (!!document.hidden) enqueueSnackbar('Connect error', { variant: 'error', autoHideDuration: 3000 })
    }
    socket.on('connect_error', onConnectErrorListener)
    
    const onReconnectListener = (arg: any) => {
      groupLog({ spaceName: '-- reconnect', items: [arg] })
      if (!!document.hidden) enqueueSnackbar('Reconnect', { variant: 'success', autoHideDuration: 3000 })
    }
    socket.on('reconnect', onReconnectListener)

    const onReconnectAttemptListener = (arg: any) => {
      groupLog({ spaceName: '-- reconnect_attempt', items: [arg] })
      if (!!document.hidden) enqueueSnackbar('Reconnect attempt', { variant: 'info', autoHideDuration: 3000 })
    }
    socket.on('reconnect_attempt', onReconnectAttemptListener)

    const onAuditsReplace = (data: NEventData.NServerOutgoing.TAUDITLIST_REPLACE) => {
      // groupLog({ spaceName: `-- ${NEvent.EServerOutgoing.AUDITLIST_REPLACE}`, items: [data] })
      setStore({ audits: data.audits })
    }
    socket.on(NEvent.EServerOutgoing.AUDITLIST_REPLACE, onAuditsReplace)

    // NOTE: New 2023.11
    // const onTodo2023Replace = (data: NEventData.NServerOutgoing.TTodo2023ReplaceRoomState) => {
    //   groupLog({ spaceName: `-- ${NEvent.EServerOutgoing.TODO2023_REPLACE_ROOM_STATE}`, items: [data] })
    //   if (!!data.roomState) setStore({
    //     common: {
    //       roomState: data.roomState,
    //     },
    //   })
    // }
    // socket.on(NEvent.EServerOutgoing.TODO2023_REPLACE_ROOM_STATE, onTodo2023Replace)
    const onTodo2023ItemAdded = (data: { newTodo: NTodo.TTodo }) => {
      groupLog({ spaceName: `-- ${NEvent.EServerOutgoing.TODO2023_TODO_ITEM_ADDED}`, items: [data] })
      if (!!data) {
        console.log(data)
        // vi.strapiTodoItems.push(data.newTodo)
        dispatch(addStrapiTodo(data.newTodo))
      }
    }
    socket.on(NEvent.EServerOutgoing.TODO2023_TODO_ITEM_ADDED, onTodo2023ItemAdded)

    const onTodo2023ItemRemoved = (data: { removedTodoId: number }) => {
      groupLog({ spaceName: `-- ${NEvent.EServerOutgoing.TODO2023_TODO_ITEM_REMOVED}`, items: [data] })
      if (!!data) {
        console.log(data)
        // vi.strapiTodoItems = vi.strapiTodoItems.filter(({ id }) => id !== data.removedTodoId)
        dispatch(removeStrapiTodo(data.removedTodoId))
      }
    }
    socket.on(NEvent.EServerOutgoing.TODO2023_TODO_ITEM_REMOVED, onTodo2023ItemRemoved)

    const onTodo2023ItemUpdated = (data: { updatedTodo: NTodo.TTodo }) => {
      groupLog({ spaceName: `-- ${NEvent.EServerOutgoing.TODO2023_TODO_ITEM_UPDATED}`, items: [data] })
      if (!!data) {
        console.log(data)
        dispatch(updateStrapiTodo(data.updatedTodo))
      }
    }
    socket.on(NEvent.EServerOutgoing.TODO2023_TODO_ITEM_UPDATED, onTodo2023ItemUpdated)

    const onDisonnectListener = () => {
      groupLog({ spaceName: '-- disconnect', items: ['no data'] })
      setStore({ isConnected: false })
    }
    socket.on('disconnect', onDisonnectListener)
    return () => {
      socket.off('disconnect', onDisonnectListener)
      socket.off(NEvent.EServerOutgoing.AUDITLIST_REPLACE, onAuditsReplace)
      // socket.off(NEvent.EServerOutgoing.TODO2023_REPLACE_ROOM_STATE, onTodo2023Replace)
      socket.off(NEvent.EServerOutgoing.TODO2023_TODO_ITEM_ADDED, onTodo2023ItemAdded)
      socket.off(NEvent.EServerOutgoing.TODO2023_TODO_ITEM_REMOVED, onTodo2023ItemRemoved)
      socket.off(NEvent.EServerOutgoing.TODO2023_TODO_ITEM_UPDATED, onTodo2023ItemUpdated)
      socket.off('connect_error', onConnectErrorListener)
      socket.off('reconnect', onReconnectListener)
      socket.off('reconnect_attempt', onReconnectAttemptListener)
      socket.off('connect', onConnectListener)
    }
  }, [router.query.tg_chat_id])

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
  const handlePush = useCallback(({ noConfirmMessage }: { noConfirmMessage: boolean }) => () => {
    const doIt = () => {
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

    if (noConfirmMessage) doIt()
    else {
      const isConfirmed = window.confirm('⚠️ Удаленный кэш будет перезаписан! Вы уверены?')
      if (isConfirmed) doIt()
    }
  }, [useCompare([localAudits])])

  // const [roomState] = useStore((store) => store.common.roomState)
  // const __lastTodosRoomState = useSelector((store: IRootState) => store.todo2023.__lastTodosRoomState)
  // const handlePushTodos = useCallback(({ noConfirmMessage }: { noConfirmMessage: boolean }) => () => {
  //   console.log('--handlePushTodos')
  //   console.log(__lastTodosRoomState)
  //   console.log('--')
  //   const doIt = () => {
  //     try {
  //       if (!socketRef.current) throw new Error('socket err')
  //       socketRef.current.emit(NEvent.EServerIncoming.TODO2023_REPLACE_ROOM_STATE, {
  //         room: roomRef.current,
  //         roomState: __lastTodosRoomState,
  //       }, (ev: { isOk: boolean; message?: string; yourData: any }) => {
  //         console.log('-socket-inc:ev')
  //         console.log(ev)
  //         console.log('-')
  //         enqueueSnackbar(ev?.message || 'No ev.message', { variant: ev.isOk ? 'success' : 'error', autoHideDuration: 10000 })
  //       })
  //     } catch (err) {
  //       console.warn(err)
  //     }
  //   }

  //   if (noConfirmMessage) doIt()
  //   else {
  //     const isConfirmed = window.confirm('⚠️ Удаленный кэш будет перезаписан! Вы уверены?')
  //     if (isConfirmed) doIt()
  //   }
  // }, [
  //   // NOTE: Ext
  //   // useCompare([roomState]),
  //   useCompare([__lastTodosRoomState]),
  // ])
  const handleUpdateAuditComment = useCallback(({
    auditId,
    comment,
  }) => {
    if (!socketRef.current) throw new Error('socket err')
      socketRef.current.emit(NEvent.EServerIncoming.AUDIT_UPDATE_COMMENT, {
        room: roomRef.current,
        auditId,
        comment
      }, (ps : NEventData.NServerIncoming.TAUDIT_UPDATE_COMMENT_CB_ARG) => {
        const { data } = ps
        // setStore({ audits: data.audits })
        groupLog({ spaceName: `-- ${NEvent.EServerIncoming.AUDIT_UPDATE_COMMENT} | tst`, items: [data] })
      })
  }, [])
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
  // 803565425
  const handleError = useCallback((arg: any) => {
    console.warn(arg)
  }, [])
  const handleCopyLink = useCallback((text: string) => {
    // groupLog({ spaceName: 'copy link', items: [text] })
    enqueueSnackbar(text, { variant: 'info', autoHideDuration: 5000 })
  }, [])
  // const { timeAgoText } = useTimeAgo({ delay: 1000, date: })
  const handleLocalBackup = useCallback(() => {
    const isConfirmed = window.confirm('⚠️ Локальный кэш будет перезаписан! Вы уверены?')
    if (isConfirmed) {
      // groupLog({ spaceName: 'local backup', items: [`Local backup for ${room}`] })
      handleMenuClose()
      dispatch(replaceAudits({
        audits: remoteAudits,
      }))
      enqueueSnackbar('Local backup saved', { variant: 'success', autoHideDuration: 3000 })
    }
  }, [useCompare([remoteAudits])])

  const { last: lastLocalAudits } = useLastUpdatedAuditTs({ audits: localAudits })
  const { last: lastRemoteAudits } = useLastUpdatedAuditTs({ audits: remoteAudits })
  // const { timeAgoText: lastRemoteAuditsTsUpdateTimeAgo } = useTimeAgo({ date: lastRemoteAudits.tsUpdate.value, delay: 5000 })
  // const { timeAgoText: lastLocalAuditsTsUpdateTimeAgo } = useTimeAgo({ date: lastLocalAudits.tsUpdate.value, delay: 5000 })

  const isBrowser = useMemo(() => typeof window !== 'undefined', [typeof window])
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)

  useEffect(() => {
    if (isDev) {
      dispatch(setIsOneTimePasswordCorrect(true))
      return
    }
    autoparkHttpClient.checkJWT({
      tested_chat_id: String(roomRef.current),
    })
      .then((res: any) => {
        dispatch(setIsOneTimePasswordCorrect(res?.ok === true))
        
        if (!res?.ok && !!res?.message) enqueueSnackbar(res.message, { variant: 'error', autoHideDuration: 7000 })
      })
      .catch((err) => {
        dispatch(setIsOneTimePasswordCorrect(false))
        if (err?.message) enqueueSnackbar(err.message, { variant: 'error', autoHideDuration: 7000 })
        console.log(err.message || 'Unknown err (eff)')
      })
    // if (hasAuthenticatedOnSSR) dispatch(setIsOneTimePasswordCorrect(true))

    // NOTE: Remember this
    dispatch(fixVisitedPage({ tg_chat_id: room }))
  }, [])
  const lastVisitedOnlinePages = useSelector((state: IRootState) => state.todo2023.online?.lastVisitedPages || [])
  // const handleRoomClick = useCallback((tg_chat_id: number) => () => {
  //   router.push(`/subprojects/audit-list/${tg_chat_id}`)
  // }, [])

  // -- Automatic restore if necessary
  // const isEmpryRemoteListUpdatedInThisSessionRef = useRef<boolean>(false)
  const syncToolTimeoutRef = useRef<NodeJS.Timeout>()
  const lastLocalBackupTime = useSelector((store: IRootState) => store.todo2023.backupInfo?.ts)
  
  useEffect(() => {
    if (isConnected && remoteAudits.length === 0) { // && !isEmpryRemoteListUpdatedInThisSessionRef.current
      const doIt = () => {
        if (isOneTimePasswordCorrect) {
          if (localAudits.length > 0) {
            const isConfirmed = window.confirm(`🌐 Похоже, удаленный список пуст.\nХотите восстановить его тем что у вас есть${!!lastLocalBackupTime ? ` c ${getNormalizedDateTime(lastLocalBackupTime)}` : ''}?`)

            if (isConfirmed) {
              handlePush({ noConfirmMessage: true })()
              // handlePushTodos({ noConfirmMessage: true })()
            }
          }
        }
      }
      syncToolTimeoutRef.current = setTimeout(doIt, 5000)

      return () => {
        if (!!syncToolTimeoutRef.current) clearTimeout(syncToolTimeoutRef.current)
      }
    }
    return 
  }, [
    isOneTimePasswordCorrect,
    remoteAudits.length,
    localAudits.length,
    isConnected,
    handlePush,

    // NOTE: Ext
    // handlePushTodos,
    handlePush,
  ])

  // ---
  // const isMyPage = useMemo<boolean>(() => {
  //   return isOneTimePasswordCorrect
  // }, [isOneTimePasswordCorrect])
  // useEffect(() => {
  //   console.log('-1')
  //   if (!!roomState && Object.keys(roomState || {}).length > 0) {
  //     console.log('-1.1')
  //     console.log(roomState) // NOTE: Ok
  //     if (isMyPage) dispatch(replaceTodosRoomState(roomState))
  //   }
  // }, [
  //   replaceTodosRoomState,
  //   useCompare([roomState]),
  //   dispatch,
  //   isMyPage,
  // ])
  // ---
  // --

  // -- NOTE: Optional autosync with persist
  const isAutoSyncEnabled = useSelector((state: IRootState) => state.todo2023.online.isAutoSyncWithLocalEnabled)
  useEffect(() => {
    console.groupCollapsed('- EFF')
    console.log('isOneTimePasswordCorrect', isOneTimePasswordCorrect)
    console.log('isAutoSyncEnabled', isAutoSyncEnabled)
    console.log('remoteAudits.length', remoteAudits.length)
    if (isOneTimePasswordCorrect && isAutoSyncEnabled && remoteAudits.length > 0) {
      console.log('sunc: will be set to', remoteAudits)
      dispatch(replaceAudits({ audits: remoteAudits }))
    } else {
      console.log('sync: will be skiped', remoteAudits)
    }
    console.groupEnd()
  }, [isOneTimePasswordCorrect, isAutoSyncEnabled, useCompare([remoteAudits])])
  const autoSyncOptionToggle = useCallback(() => {
    dispatch(autoSyncToggle())
  }, [])
  // --

  const { isMobile, isDesktop } = useWindowSize()

  const MemoizedMenu = useMemo(() => {
    return (
      <>
        <span>
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
        </span>
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
          <MenuList>
            {
              isOneTimePasswordCorrect && (
                <>
                  <MenuItem selected={false} onClick={autoSyncOptionToggle}>
                    <ListItemIcon><SyncIcon fontSize="small" color={isAutoSyncEnabled ? 'success' : 'error'} /></ListItemIcon>
                    <Typography variant="inherit">Autosync {isAutoSyncEnabled ? 'ON' : 'Off'}</Typography>
                  </MenuItem>
                  <MenuItem
                    selected={false}
                    onClick={handlePush({ noConfirmMessage: false })}
                    disabled={localAudits.length === 0 || lastLocalAudits.tsUpdate.value === lastRemoteAudits.tsUpdate.value}
                  >
                    <ListItemIcon><SendIcon fontSize="small" color='error' /></ListItemIcon>
                    <Typography variant="inherit">Restore from local ({localAudits.length})</Typography>
                  </MenuItem>
                </>
              )
            }
            <CopyToClipboard
              text={`/subprojects/audit-list/${room}`}
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
              disabled={isAutoSyncEnabled || (remoteAudits.length === 0 || lastLocalAudits.tsUpdate.value === lastRemoteAudits.tsUpdate.value)}
            >
              <ListItemIcon><SaveIcon fontSize="small" color='error' /></ListItemIcon>
              <Typography variant="inherit">Local backup ({remoteAudits.length})</Typography>
            </MenuItem>
            {
              lastVisitedOnlinePages.length > 0 && (
                <>
                  <Divider />
                  {lastVisitedOnlinePages.map(({ tg_chat_id }) => (
                    <MenuItem
                      key={tg_chat_id}
                      selected={false}
                      // onClick={handleRoomClick(tg_chat_id)}
                      onClick={(e) => {
                        e.preventDefault()
                        window.location.href = `/subprojects/audit-list/${tg_chat_id}`
                      }}
                      disabled={String(tg_chat_id) === router.query.tg_chat_id}
                    >
                      <ListItemIcon><AccountTreeIcon fontSize="small" /></ListItemIcon>
                      <Typography variant="inherit">{tg_chat_id}</Typography>
                      {/* <Link href={`/subprojects/audit-list/${tg_chat_id}`} variant='overline' underline="hover">{tg_chat_id}</Link> */}
                    </MenuItem>
                  ))}
                </>
              )
            }
          </MenuList>
        </Menu>
      </>
    )
  }, [
    lastVisitedOnlinePages.length,
    remoteAudits.length,
    lastLocalAudits.tsUpdate.value,
    lastRemoteAudits.tsUpdate.value,
    localAudits.length,
    handlePush,
    isAutoSyncEnabled,
    autoSyncOptionToggle,
    isOneTimePasswordCorrect,
    isMenuOpened,
  ])

  const handleCreateNamespace = useCallback(({ label }) => {
    if (!label.trim()) throw new Error('Shoud not be empty!')
    // if (!socketRef.current) throw new Error('socket err')
    // socketRef.current.emit(NEvent.EServerIncoming.TODO2023_ADD_NAMESPACE, {
    //   room: roomRef.current,
    //   name: label,
    // }, showStandartSocketErrMsg({ showSuccessMsg: true }))

    dispatch(addTemporayNamespace(label))
  }, [])

  // const handleResetTemporayNamespaces = useCallback(() => {
  //   dispatch(resetTemporayNamespaces())
  // }, [])

  // resetTemporayNamespaces
  const handleRemoveNamespace = useCallback(({ name }) => {
    if (!name.trim()) throw new Error('Shoud not be empty!')
    if (!socketRef.current) throw new Error('socket err')
    socketRef.current.emit(NEvent.EServerIncoming.TODO2023_REMOVE_NAMESPACE, {
      room: roomRef.current,
      name,
    }, showStandartSocketErrMsg({ showSuccessMsg: false }))
  }, [])
  const handleCreateTodo = useCallback(({ label, namespace, priority }: { label: string; namespace: string; priority: number; }) => {
    if (!label.trim()) throw new Error('Shoud not be empty!')
    if (!socketRef.current) throw new Error('socket err')
    socketRef.current.emit(NEvent.EServerIncoming.TODO2023_ADD_TODO_ITEM, {
      room: roomRef.current,
      namespace,
      todoItem: {
        label,
        descr: '',
        status: NTodo.EStatus.NO_STATUS,
        priority,
      },
    }, showStandartSocketErrMsg({ showSuccessMsg: true }))
  }, [])
  const handleRemoveTodo = useCallback(({ todoId, namespace }: { todoId: number; namespace: string }) => {
    // console.log(todoId)
    if (!todoId) throw new Error(`todoId Shoud not be empty! received: ${String(todoId)}`)
    if (!socketRef.current) throw new Error('socket err')
    socketRef.current.emit(NEvent.EServerIncoming.TODO2023_REMOVE_TODO_ITEM, {
      room: roomRef.current,
      namespace,
      todoId,
    }, showStandartSocketErrMsg({ showSuccessMsg: false }))
  }, [])
  const handleUpdateTodo = useCallback(({ todoId, namespace, newTodoItem }: { todoId: number; namespace: string; newTodoItem: NTodo.TItem }) => {
    // console.log('- td:update-todo')
    // console.log(todoId)
    if (!todoId) throw new Error(`todoId Shoud not be empty! received: ${String(todoId)}`)
    if (!socketRef.current) throw new Error('socket err')
    socketRef.current.emit(NEvent.EServerIncoming.TODO2023_UPDATE_TODO_ITEM, {
      room: roomRef.current,
      namespace,
      todoId,
      newTodoItem,
    }, showStandartSocketErrMsg({ showSuccessMsg: false }))
  }, [])

  switch (true) {
    case isMobile: return (
      <>
        <Widget>
          <TodoConnected
            onCreateNamespace={handleCreateNamespace}
            // onResetTemporayNamespaces={handleResetTemporayNamespaces}
            onRemoveNamespace={handleRemoveNamespace}
            onCreateTodo={handleCreateTodo}
            onRemoveTodo={handleRemoveTodo}
            onUpdateTodo={handleUpdateTodo}
          />
        </Widget>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
          <Container maxWidth="xs">
            <Stack
              direction='column'
              alignItems='start'
              spacing={2}
              sx={{ pt: 2, pb: 2 }}
            >
              <Box
                sx={{
                  // pt: 2,
                  // pb: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
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
                  <Brightness1Icon color={isConnected ? 'success' : 'error'} />
                  <span style={{ fontFamily: 'system-ui' }}>{room}</span>
                </Typography>
                {/*
                <Button
                  startIcon={<UploadIcon />}
                  fullWidth
                  variant="contained"
                  color='secondary'
                  onClick={handlePush}
                >Push from LS (Save)</Button> */}
                <div>
                  <IconButton
                    aria-label="autosync-toggler"
                    id="autosync-toggler"
                    // aria-controls={isMenuOpened ? 'long-menu' : undefined}
                    // aria-expanded={isMenuOpened ? 'true' : undefined}
                    // aria-haspopup="true"
                    onClick={autoSyncOptionToggle}
                  >
                    <SyncIcon color={isAutoSyncEnabled ? 'success' : 'error'} />
                  </IconButton>
                  {MemoizedMenu}
                </div>
              </Box>
            </Stack>

            {/* <Box sx={{ pt: 2, pb: 2 }}>
              <em>Updated {lastRemoteAuditsTsUpdateTimeAgo}</em>
            </Box> */}
            <AuditList
              audits={remoteAudits}
              onRemoveAudit={handleRemoveAudit}
              onAddJob={handleAddJob}
              onAddSubjob={handleAddSubjob}
              onToggleJobDone={handleToggleJobDone}
              onRemoveJob={handleRemoveJob}
              onToggleSubjob={handleToggleSubjob}
              isEditable={isOneTimePasswordCorrect}
              onUpdateAuditComment={handleUpdateAuditComment}
            />
          </Container>
          {
            isBrowser && (
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
                {
                  isOneTimePasswordCorrect ? (
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
                  ) : (
                    <OneTimeLoginFormBtn
                      chat_id={String(room)}
                    />
                  )
                }
                <Box
                  sx={{
                    pt: 2,
                    // pb: 2,
                  }}
                >
                  <Button fullWidth startIcon={<ArrowBackIcon />} variant='outlined' color='primary' component={Link} noLinkStyle href='/subprojects/audit-list' target='_self'>
                    Onffline
                  </Button>
                </Box>
              </div>
            )
          }
        </div>
      </>
    )
    case isDesktop: return (
      <>
        <Widget>
          <TodoConnected
            onCreateNamespace={handleCreateNamespace}
            // onResetTemporayNamespaces={handleResetTemporayNamespaces}
            onRemoveNamespace={handleRemoveNamespace}
            onCreateTodo={handleCreateTodo}
            onRemoveTodo={handleRemoveTodo}
            onUpdateTodo={handleUpdateTodo}
          />
        </Widget>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
          <ResponsiveBlock
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              zIndex: 3,
              height: '50px',
              lineHeight: '50px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  lineHeight: 'inherit',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <span>
                  <Button
                    size='small'
                    startIcon={<ArrowBackIcon />}
                    variant='outlined'
                    color='primary'
                    component={Link}
                    noLinkStyle
                    href={'/subprojects/audit-list'}
                    target='_self'
                  >
                    Offline
                  </Button>
                </span>
                <Brightness1Icon color={isConnected ? 'success' : 'error'} />
                <span style={{ fontFamily: 'system-ui' }}>{room}</span>
              </div>
              <div>
                {
                  isOneTimePasswordCorrect && (
                    <IconButton
                      aria-label="autosync-toggler"
                      id="autosync-toggler"
                      // aria-controls={isMenuOpened ? 'long-menu' : undefined}
                      // aria-expanded={isMenuOpened ? 'true' : undefined}
                      // aria-haspopup="true"
                      onClick={autoSyncOptionToggle}
                    >
                      <SyncIcon color={isAutoSyncEnabled ? 'success' : 'error'} />
                    </IconButton>
                  )
                }
                {MemoizedMenu}
              </div>
            </div>
          </ResponsiveBlock>
          
          <AuditGrid
            onAddNewAudit={handleAddNewAudit}
            audits={remoteAudits}
            onRemoveAudit={handleRemoveAudit}
            onAddJob={handleAddJob}
            onAddSubjob={handleAddSubjob}
            onToggleJobDone={handleToggleJobDone}
            onRemoveJob={handleRemoveJob}
            onToggleSubjob={handleToggleSubjob}
            isEditable={isOneTimePasswordCorrect}
            onUpdateAuditComment={handleUpdateAuditComment}
          />
          
          {
            isBrowser && !isOneTimePasswordCorrect && (
              <div
                style={{
                  marginTop: 'auto',
                  // position: 'sticky',
                  position: 'fixed',
                  bottom: '0px',
                  zIndex: 2,
                  padding: '16px',
                }}
                className='backdrop-blur--lite'
              >
                {/* <pre>{JSON.stringify({ isOneTimePasswordCorrect, isBrowser }, null, 2)}</pre> */}
                <OneTimeLoginFormBtn chat_id={String(room)} />
              </div>
            )
          }
        </div>
      </>
    )
    default: return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - 50px)' }}>
        <CircularIndeterminate />
      </div>
    )
  }
}

type TProps = {
  room: number;
}

export const Todo2023Online = ({ room }: TProps) => (
  <WithSocketContext>
    <Logic room={room} />
  </WithSocketContext>
)
