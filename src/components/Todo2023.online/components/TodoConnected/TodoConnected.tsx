import { useStore } from '~/components/Todo2023.online/hocs'
import classes from './TodoConnected.module.scss'
import clsx from 'clsx'
import { IconButton, ListItemIcon, Menu, MenuItem, MenuList, Typography } from '@mui/material'
// import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { useCallback, useMemo, useState, useRef } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import {
  AddAnythingNewDialog,
  ConnectedFilters,
  // NamespaceListItem,
  TodoListItem,
  VerticalTabs,
} from './components'
import baseClasses from '~/mui/baseClasses.module.scss'
import DeleteIcon from '@mui/icons-material/Delete'
// import AddIcon from '@mui/icons-material/Add'
import { NTodo } from '~/components/audit-helper'
// import DoneIcon from '@mui/icons-material/Done'
// import CachedIcon from '@mui/icons-material/Cached'
// import ErrorIcon from '@mui/icons-material/Error'
// import ReportIcon from '@mui/icons-material/Report'
// import WarningIcon from '@mui/icons-material/Warning'
// import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import { sort } from '~/utils/sort-array-objects@3.0.0'

type TProps = {
  onCreateNamespace: ({ label }: { label: string }) => void;
  onCreateTodo: ({ label, namespace, priority }: { label: string; namespace: string; priority: number; }) => void;
  onRemoveNamespace: ({ name }: { name: string }) => void;
  onRemoveTodo: ({ todoId, namespace }: { todoId: number; namespace: string; }) => void;
  onUpdateTodo: ({ todoId, namespace, newTodoItem }: { todoId: number; namespace: string; newTodoItem: NTodo.TItem }) => void;
}

export const TodoConnected = ({
  onCreateNamespace,
  onRemoveNamespace,
  onCreateTodo,
  onRemoveTodo,
  onUpdateTodo,
}: TProps) => {
  const [roomState, _setStore] = useStore((store) => store.common.roomState)
  const [todoPriorityFilter] = useStore((store) => store.todoPriorityFilter)
  const [todoStatusFilter] = useStore((store) => store.todoStatusFilter)
  // const [activeNamespace, setActiveNamespace] = useState<string | null>(null)

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

  const [editMode, setEditMode] = useState<null | 'namespace' | 'todo' | 'todo:edit'>(null)
  const handleOpenAddNewNamespaceDialog = useCallback(() => {
    setEditMode('namespace')
  }, [setEditMode])
  // const [, setInitNamespaceForCreate] = useState<string>('')
  const initNamespaceForCreateRef = useRef<string>('')
  const getInitNamespaceForCreate = () => initNamespaceForCreateRef.current
  const handleOpenAddNewTodoDialog = useCallback(({ initNamespace }: { initNamespace?: string }) => () => {
    if (initNamespace) initNamespaceForCreateRef.current = initNamespace
    else initNamespaceForCreateRef.current = ''
    setEditMode('todo')
  }, [setEditMode])
  // const handleOpenEditTodoDialog = useCallback(() => {})
  const handleCloseModal = useCallback(() => {
    setEditMode(null)
  }, [setEditMode])

  const handleCreateNewNamespace = useCallback((ev) => {
    onCreateNamespace({ label: ev.namespaceLabel })
    handleMenuClose()
  }, [onCreateNamespace, handleMenuClose])
  // const handleRemoveNamespace = useCallback((ev: { name: string }) => {
  //   onRemoveNamespace({ name: ev.name })
  //   handleMenuClose()
  // }, [onRemoveNamespace, handleMenuClose])
  const handleCreateNewTodo = useCallback((ev) => {
    onCreateTodo({ label: ev.todoLabel, namespace: ev.namespace, priority: ev.priority })
    handleMenuClose()
  }, [onCreateTodo, handleMenuClose])
  // const handleRemoveTodo = useCallback((ev: { id: number; namespace: string; }) => {
  //   onRemoveTodo({ todoId: ev.id, namespace: ev.namespace })
  //   handleMenuClose()
  // }, [onRemoveTodo, handleMenuClose])
  const handleErr = useCallback((err) => {
    console.log('-ERR')
    console.log(err)
  }, [])

  const handleUpdateTodo = useCallback(({ newPriority, newStatus }: { newPriority?: number; newStatus?: NTodo.EStatus }) => ({ todoId, namespace, todo }: { todoId: number; namespace: string; todo: NTodo.TItem; }) => {
    if (newPriority === todo.priority || newStatus === todo.status) {
      return
    }

    const newObj: any = {
      todoId,
      namespace,
      newTodoItem: {
        ...todo,
        status: newStatus,
      }
    }

    switch (true) {
      case typeof newPriority === 'number' && newPriority !== todo.priority:
        newObj.newTodoItem.priority = newPriority
        break
      case !!newStatus && newStatus !== todo.status:
        newObj.newTodoItem.status = newStatus
        break
      default:
        break
    }
    
    onUpdateTodo(newObj)
  }, [onUpdateTodo])

  const MemoizedMenu = useMemo(() => {
    return (
      <>
        <span>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={isMenuOpened ? 'TodoConnected-long-menu' : undefined}
            aria-expanded={isMenuOpened ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
        </span>
        <Menu
          id='TodoConnected-long-menu'
          MenuListProps={{ 'aria-labelledby': 'long-button' }}
          anchorEl={anchorEl}
          open={isMenuOpened}
          onClose={handleMenuClose}
          // PaperProps={{
          //   style: {},
          // }}
        >
          <MenuList>
            <MenuItem
              selected={false}
              onClick={handleOpenAddNewNamespaceDialog}
              // disabled={}
            >
              <ListItemIcon><AddCircleIcon fontSize="small" color='primary' /></ListItemIcon>
              <Typography variant="inherit">Add namespace</Typography>
            </MenuItem>
            <MenuItem
              selected={false}
              onClick={handleOpenAddNewTodoDialog({})}
              disabled={!roomState || Object.keys(roomState).length === 0}
            >
              <ListItemIcon><AddCircleOutlineIcon fontSize="small" color='primary' /></ListItemIcon>
              <Typography variant="inherit">Add Todo</Typography>
            </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }, [
    handleOpenAddNewTodoDialog,
    handleCreateNewNamespace,
    isMenuOpened,
    roomState,
    handleMenuClose,
    anchorEl,
  ])

  const memoizedTabsCfg = useMemo(() => {
    return Object.keys(roomState || {}).reduce((acc: any, cur) => {
      acc[cur] = {
        label: cur,
        Content: (
          <div
            key={cur}
            className={clsx(
              classes.internalTabSpace,
              baseClasses.stack2,
            )}
          >

            <div
              // className='backdrop-blur--lite'
              style={{
                backgroundColor: '#fff',
                // border: '1px dashed red',
                display: 'flex',
                alignItems: 'flex-start',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                boxShadow: '0px 10px 7px -8px rgba(34, 60, 80, 0.2)',
              }}
            >
              <Typography
                variant="body2"
                gutterBottom
                sx={{ textDecoration: 'underline' }}
              >
                <b style={{ marginTop: '4px' }}>{cur} ({roomState?.[cur].state.length || 0})</b>
              </Typography>
              <div
                style={{
                  // border: '1px solid red',
                  display: 'flex',
                  gap: '0px',
                  marginLeft: 'auto',
                }}
              >
                <IconButton
                  aria-label={`add todo in ${cur}`}
                  // disabled={isDisabled}
                  // color=
                  onClick={handleOpenAddNewTodoDialog({ initNamespace: cur })}
                  size='small'
                >
                  <AddCircleOutlineIcon color='primary' fontSize='small' />
                </IconButton>
                <IconButton
                  aria-label={`remove tab ${cur}`}
                  // disabled={isDisabled}
                  // color=
                  onClick={() => {
                    const isConfirmed = window.confirm('Уверены?')
                    if (isConfirmed) onRemoveNamespace({ name: cur })
                  }}
                  size='small'
                >
                  <DeleteIcon color='error' fontSize='small' />
                </IconButton>
              </div>
            </div>
            
            {
              !!roomState && (
                <div className={baseClasses.stack2}>
                  {
                    sort(roomState[cur].state, ['priority'], -1).map((todo) => {
                      if (
                        typeof todoPriorityFilter === 'number'
                        && todo.priority !== todoPriorityFilter
                      ) return null

                      if (
                        !!todoStatusFilter
                        && todoStatusFilter !== todo.status
                      ) return null

                      const controls = []

                      // controls.push({
                      //   id: '0',
                      //   Icon: <ReportIcon color={todo.status === NTodo.EStatus.DANGER ? 'error' : 'disabled'} fontSize='small' />,
                      //   onClick: () => {
                      //     handleUpdateTodo({ newStatus:todo.status === NTodo.EStatus.DANGER ? NTodo.EStatus.NO_STATUS :  NTodo.EStatus.DANGER })({ todoId: todo.id, namespace: cur, todo })
                      //   },
                      //   // isDisabled: todo.status === NTodo.EStatus.DANGER,
                      // })

                      // controls.push({
                      //   id: '1',
                      //   Icon: <WarningIcon color={todo.status === NTodo.EStatus.WARNING ? 'warning' : 'disabled'} fontSize='small' />,
                      //   onClick: () => {
                      //     handleUpdateTodo({ newStatus: todo.status === NTodo.EStatus.WARNING ? NTodo.EStatus.NO_STATUS : NTodo.EStatus.WARNING })({ todoId: todo.id, namespace: cur, todo })
                      //   },
                      //   // isDisabled: todo.status === NTodo.EStatus.WARNING
                      // })

                      // controls.push({
                      //   id: '2',
                      //   Icon: todo.status === NTodo.EStatus.IS_DONE
                      //     ? <CheckCircleIcon color={todo.status === NTodo.EStatus.IS_DONE ? 'success' : 'disabled'} fontSize='small' />
                      //     : <CheckCircleIcon color={NTodo.EStatus.NO_STATUS ? 'disabled' : 'primary' } fontSize='small' />,
                      //   onClick: () => {
                      //     handleUpdateTodo({ newStatus: todo.status === NTodo.EStatus.IS_DONE ? NTodo.EStatus.NO_STATUS : NTodo.EStatus.IS_DONE })({ todoId: todo.id, namespace: cur, todo })
                      //   },
                      // })

                      controls.push({
                        id: '3',
                        Icon: <CloseIcon color='error' fontSize='small' />,
                        // color: 'primary',
                        onClick: () => {
                          const isConfirmed = window.confirm(`Todo will be removed from namespace ${cur}.\nSure?`)
                          if (isConfirmed) onRemoveTodo({ todoId: todo.id, namespace: cur })
                        },
                      })
                      return (
                        <TodoListItem
                          id={todo.id}
                          key={todo.id}
                          label={todo.label}
                          descr={todo.descr}
                          priority={todo.priority}
                          status={todo.status}
                          controls={controls}
                          onStarUpdate={(newPriority: number) => {
                            handleUpdateTodo({ newPriority })({ todoId: todo.id, namespace: cur, todo })
                          }}
                          onChangeStatus={(status) => {
                            handleUpdateTodo({ newStatus: status })({ todoId: todo.id, namespace: cur, todo })
                          }}
                        />
                      )
                    })
                  }
                </div>
              )
            }
            
          </div>
        )
      }
      return acc
    }, {})
  }, [
    roomState,
    onRemoveNamespace,
    handleOpenAddNewTodoDialog,
    handleUpdateTodo,
    todoPriorityFilter,
    todoStatusFilter,
  ])

  return (
    <>
      <AddAnythingNewDialog
        isOpened={editMode === 'namespace'}
        label='Namespace'
        cfg={{
          namespaceLabel: {
            type: 'text',
            label: 'Название',
            inputId: 'namespace-name',
            placeholder: 'Название',
            defaultValue: '',
            reactHookFormOptions: { required: true, maxLength: 50, minLength: 3 },
            validate: (val: any) => !!val,
          },
        }}
        cb={{
          onClose: handleCloseModal,
          onError: handleErr,
          onSuccess: handleCreateNewNamespace,
        }}
      />
      <AddAnythingNewDialog
        key={getInitNamespaceForCreate()}
        isOpened={editMode === 'todo'}
        label='Новая заметка'
        cfg={{
          namespace: {
            type: 'list',
            label: 'Namespaces',
            list: Object.keys(roomState || {}).map((value) => ({ value, label: value })),
            inputId: 'namespaces-list',
            placeholder: '',
            defaultValue: getInitNamespaceForCreate(),
            reactHookFormOptions: { required: true, maxLength: 100, minLength: 3 },
            isRequired: true,
            validate: (val: any) => !!val,
          },
          todoLabel: {
            type: 'text',
            label: 'Название',
            inputId: 'todo-name',
            placeholder: 'Название',
            defaultValue: '',
            reactHookFormOptions: { required: true, maxLength: 100, minLength: 3 },
            isRequired: true,
            validate: (val: any) => !!val,
          },
          priority: {
            type: 'rating',
            label: 'Приоритет',
            inputId: 'todo-priority',
            placeholder: '',
            defaultValue: 0,
            isRequired: true,
            validate: (val: any) => val >= 1 && val <= 5,
          }
        }}
        cb={{
          onClose: handleCloseModal,
          onError: handleErr,
          onSuccess: handleCreateNewTodo,
        }}
      />

      <div
        className={classes.stack}
        style={{
          overflowY: 'hidden',
        }}
      >
        <div
          className={clsx(
            // 'backdrop-blur--lite',
            classes.head,
            classes.row2,
            classes.spaceBetween,
          )}
        >
          <ConnectedFilters />
          {MemoizedMenu}
        </div>

        {
          !!roomState && Object.keys(roomState || {}).length > 0 && (
            <div style={{ overflowY: 'auto' }}>
              <VerticalTabs
                defaultActiveIndex={0}
                cfg={memoizedTabsCfg}
              />
            </div>
          )
        }

      </div>
    </>
  )
}
