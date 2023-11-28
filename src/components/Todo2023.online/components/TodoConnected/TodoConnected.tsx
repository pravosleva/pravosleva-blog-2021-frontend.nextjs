import { TSocketMicroStore, useStore } from '~/components/Todo2023.online/hocs'
import classes from './TodoConnected.module.scss'
import clsx from 'clsx'
import { IconButton, ListItemIcon, Menu, MenuItem, MenuList, Typography } from '@mui/material'
// import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { useCallback, useMemo, useState, useRef } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
// import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
// import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import {
  AddAnythingNewDialog,
  ConnectedFilters,
  InvertedStatusColors,
  // NamespaceListItem,
  TodoListItem,
  // VerticalTabs,
} from './components'
import baseClasses from '~/mui/baseClasses.module.scss'
// import DeleteIcon from '@mui/icons-material/Delete'
// import AddIcon from '@mui/icons-material/Add'
import { NTodo } from '~/components/audit-helper'
// import DoneIcon from '@mui/icons-material/Done'
// import CachedIcon from '@mui/icons-material/Cached'
// import ErrorIcon from '@mui/icons-material/Error'
// import ReportIcon from '@mui/icons-material/Report'
// import WarningIcon from '@mui/icons-material/Warning'
// import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import EditIcon from '@mui/icons-material/Edit'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import { sort } from '~/utils/sort-array-objects@3.0.0'
// import { useWindowSize } from '~/hooks/useWindowSize'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { useCompare } from '~/hooks/useDeepEffect'

type TProps = {
  onCreateNamespace: ({ label }: { label: string }) => void;
  // onResetTemporayNamespaces: () => void;
  onCreateTodo: ({ label, namespace, priority }: { label: string; namespace: string; priority: number; }) => void;
  onRemoveNamespace: ({ name }: { name: string }) => void;
  onRemoveTodo: ({ todoId, namespace }: { todoId: number; namespace: string; }) => void;
  onUpdateTodo: ({ todoId, namespace, newTodoItem }: { todoId: number; namespace: string; newTodoItem: NTodo.TItem }) => void;
}

export const TodoConnected = ({
  onCreateNamespace,
  // onResetTemporayNamespaces,
  // onRemoveNamespace,
  onCreateTodo,
  onRemoveTodo,
  onUpdateTodo,
}: TProps) => {
  const [isConnected] = useStore((store: TSocketMicroStore) => store.isConnected)

  // const [roomState, _setStore] = useStore((store) => store.common.roomState)
  const strapiTodos = useSelector((store: IRootState) => store.todo2023NotPersisted.strapiTodos || [])
  const temporaryNamespaces = useSelector((store: IRootState) => store.todo2023.temporaryNamespaces || [])
  const [todoPriorityFilter] = useStore((store) => store.todoPriorityFilter)
  const [todoStatusFilter] = useStore((store) => store.todoStatusFilter)
  const [namespacesFilter] = useStore((store) => store.namespacesFilter)
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
  // const handleOpenAddNewNamespaceDialog = useCallback(() => {
  //   setEditMode('namespace')
  // }, [setEditMode])
  // const [, setInitNamespaceForCreate] = useState<string>('')
  const initNamespaceForCreateRef = useRef<string>('')
  const getInitNamespaceForCreate = () => initNamespaceForCreateRef.current
  const handleOpenAddNewTodoDialog = useCallback(({ initNamespace }: { initNamespace?: string }) => () => {
    if (initNamespace) initNamespaceForCreateRef.current = initNamespace
    else initNamespaceForCreateRef.current = ''
    setEditMode('todo')
  }, [setEditMode])
  const handleOpenEditTodoDialog = useCallback(() => {
    setEditMode('todo:edit')
  }, [setEditMode])
  const handleCloseModal = useCallback(() => {
    setEditMode(null)
  }, [setEditMode])

  const handleCreateNewNamespace = useCallback((ev) => {
    const isNamespaceExists = strapiTodos.some(({ namespace }) => namespace === ev.namespaceLabel)
    if (isNamespaceExists) {
      window.alert('Придумайте другое имя!')
      return Promise.reject()
    }
    onCreateNamespace({ label: ev.namespaceLabel })
    handleMenuClose()
    return Promise.resolve()
  }, [onCreateNamespace, handleMenuClose, strapiTodos])
  // const handleRemoveNamespace = useCallback((ev: { name: string }) => {
  //   onRemoveNamespace({ name: ev.name })
  //   handleMenuClose()
  // }, [onRemoveNamespace, handleMenuClose])
  const handleCreateNewTodo = useCallback((ev) => {
    onCreateTodo({ label: ev.todoLabel, namespace: ev.namespace, priority: ev.priority })
    handleMenuClose()
    return Promise.resolve()
  }, [onCreateTodo, handleMenuClose])
  // const handleRemoveTodo = useCallback((ev: { id: number; namespace: string; }) => {
  //   onRemoveTodo({ todoId: ev.id, namespace: ev.namespace })
  //   handleMenuClose()
  // }, [onRemoveTodo, handleMenuClose])
  const handleErr = useCallback((err) => {
    console.log('-ERR')
    console.log(err)
  }, [])

  const handleUpdateTodo = useCallback(({ newPriority, newStatus }: {
    newPriority?: number;
    newStatus?: NTodo.EStatus;
  }) => ({ todoId, namespace, todo }: {
    todoId: number;
    namespace: string;
    todo: NTodo.TItem;
  }) => {
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

  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)
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
            disabled={!isConnected || !isOneTimePasswordCorrect}
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
            {/* <MenuItem
              selected={false}
              onClick={handleOpenAddNewNamespaceDialog}
              // disabled={}
            >
              <ListItemIcon><AddCircleIcon fontSize="small" color='primary' /></ListItemIcon>
              <Typography variant="inherit">Add namespace</Typography>
            </MenuItem> */}
            <MenuItem
              selected={false}
              onClick={handleOpenAddNewTodoDialog({})}
              // disabled={!roomState || Object.keys(roomState).length === 0}
            >
              <ListItemIcon><AddCircleOutlineIcon fontSize="small" color='primary' /></ListItemIcon>
              <Typography variant="inherit">Add Todo</Typography>
            </MenuItem>
            {/* <MenuItem
              selected={false}
              onClick={onResetTemporayNamespaces}
              // disabled={!roomState || Object.keys(roomState).length === 0}
            >
              <ListItemIcon><HighlightOffIcon fontSize="small" color='error' /></ListItemIcon>
              <Typography variant="inherit">Reset tmp namespaces</Typography>
            </MenuItem> */}
          </MenuList>
        </Menu>
      </>
    )
  }, [
    handleOpenAddNewTodoDialog,
    handleCreateNewNamespace,
    isMenuOpened,
    // roomState,
    handleMenuClose,
    anchorEl,

    isOneTimePasswordCorrect,
    isConnected,
  ])

  const memoizedNamespacesList = useMemo<{
    label: string;
    value: string;
    hasDividerAfter?: boolean;
  }[]>(() => {
    const localItems = temporaryNamespaces.reduce((acc: string[], str: string) => {
      if (!strapiTodos.map(({ namespace }) => namespace).includes(str)) acc.push(str)
      return acc
    }, []).map((value) => ({ label: value, value }))
  
    const existsItems = strapiTodos.reduce((acc: {
      label: string;
      value: string;
      hasDividerAfter?: boolean;
    }[], cur) => {
      const isExistsInAcc = acc.findIndex(({ value }) => value === cur.namespace) !== -1
      if (!isExistsInAcc) {
        switch (true) {
          case localItems.length > 0:
            acc.push({ label: cur.namespace, value: cur.namespace, /* hasDividerAfter: true */ })
            break
          default:
            acc.push({ label: cur.namespace, value: cur.namespace })
            break
        }
      }
      return acc
    }, [])

    return [
      ...existsItems,
      ...localItems,
    ]
  }, [useCompare([strapiTodos, temporaryNamespaces])])

  // - NOTE: Edit todo item
  const [editedTodo, setEditedTodo] = useState<NTodo.TTodo | null>(null)
  const openEditTodo = useCallback((todo: NTodo.TTodo) => {
    setEditedTodo(todo)
    handleOpenEditTodoDialog()
  }, [setEditedTodo, handleOpenEditTodoDialog])
  // -

  return (
    <>
      {/* <AddAnythingNewDialog
        isOpened={editMode === 'namespace'}
        label='Namespace'
        cfg={{
          namespaceLabel: {
            type: 'text',
            label: 'Название',
            inputId: 'namespace-name',
            placeholder: 'Название',
            defaultValue: '',
            reactHookFormOptions: { required: true, maxLength: 200, minLength: 3 },
            validate: (val: any) => !!val,
          },
        }}
        cb={{
          onClose: handleCloseModal,
          onError: handleErr,
          onSuccess: handleCreateNewNamespace,
        }}
      /> */}
      <AddAnythingNewDialog
        key={getInitNamespaceForCreate()}
        isOpened={editMode === 'todo'}
        label='Add'
        cfg={{
          namespace: {
            type: 'creatable-autocomplete',
            label: 'Выберите Namespace',
            // list: Object.keys(roomState || {}).map((value) => ({ value, label: value })),
            list: memoizedNamespacesList,
            inputId: 'namespaces-list',
            placeholder: '',
            defaultValue: getInitNamespaceForCreate(),
            // reactHookFormOptions: { required: true, maxLength: 100, minLength: 3 },
            isRequired: true,
            validate: (val: any) => !!val,
          },
          todoLabel: {
            type: 'text',
            label: 'Название',
            inputId: 'todo-name',
            placeholder: 'Название',
            defaultValue: '',
            reactHookFormOptions: { required: true, maxLength: 300, minLength: 3 },
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

      {
        !!editedTodo && (
          <AddAnythingNewDialog
            key={`${editedTodo.id}-${editedTodo.updatedAt}`}
            isOpened={editMode === 'todo:edit' && !!editedTodo}
            label={`Edit #${editedTodo.id}`}
            cfg={{
              namespace: {
                type: 'creatable-autocomplete',
                label: 'Выберите Namespace',
                // list: Object.keys(roomState || {}).map((value) => ({ value, label: value })),
                list: memoizedNamespacesList,
                inputId: 'namespaces-list',
                placeholder: '',
                defaultValue: editedTodo?.namespace,
                // reactHookFormOptions: { required: true, maxLength: 100, minLength: 3 },
                isRequired: true,
                validate: (val: any) => !!val,
              },
              todoLabel: {
                type: 'text',
                label: 'Название',
                inputId: 'todo-name',
                placeholder: 'Название',
                defaultValue: editedTodo?.label,
                reactHookFormOptions: { required: true, maxLength: 300, minLength: 3 },
                isRequired: true,
                validate: (val: any) => !!val,
              },
              description: {
                type: 'text',
                label: 'Description',
                inputId: 'todo-description',
                placeholder: '',
                defaultValue: editedTodo?.description,
                reactHookFormOptions: { required: false, maxLength: 300, minLength: 3 },
                isRequired: false,
                validate: (val: any) => !!val,
              },
            }}
            cb={{
              onClose: handleCloseModal,
              onError: handleErr,
              onSuccess: (val) => {
                // console.log(val)
                handleUpdateTodo({})({
                  todoId: editedTodo.id,
                  namespace: val.namespace,
                  todo: {
                    label: val.todoLabel,
                    description: val.description,
                    status: editedTodo.status,
                    priority: editedTodo.priority,
                  }
                })
                return Promise.resolve(val)
              },
            }}
          />
        )
      }

      <div
        className={classes.stack}
      >
        <div
          className={clsx(
            // 'backdrop-blur--lite',
            classes.head,
            classes.row2,
            classes.spaceBetween,
          )}
          style={{
            // overflowY: 'hidden',
            // border: '1px solid red',
            position: 'sticky',
            top: 0,
            backgroundColor: '#fff',
            zIndex: 1,
            boxShadow: '0px 10px 7px -8px rgba(34, 60, 80, 0.2)',
          }}
        >
          {
            isConnected
            ? strapiTodos.length > 0 ? (
                <ConnectedFilters />
              ) : (
                <div>¯\_(ツ)_/¯</div>
              )
            : <div>Connecting...</div>
          }
          {MemoizedMenu}
        </div>

        {/*
          !!roomState && Object.keys(roomState || {}).length > 0 && (
            <div
              style={{
                overflowY: 'auto',
                // border: '1px solid red',
              }}
            >
              <VerticalTabs
                defaultActiveIndex={0}
                cfg={memoizedTabsCfg}
              />
            </div>
          )
        */}

        {
          strapiTodos.length > 0 && (
            <div
              style={{
                // border: '1px dashed red',
                // padding: '0px 0px 0px 16px',
              }}
              className={clsx(
                classes.todolist,
                baseClasses.stack0,
              )}
            >
              {
                sort(strapiTodos, ['priority'], -1).map((todo, _i) => {
                  if (
                    typeof todoPriorityFilter === 'number'
                    && todo.priority !== todoPriorityFilter
                  ) return null
                  if (
                    !!todoStatusFilter
                    && todoStatusFilter !== todo.status
                  ) return null
                  if (
                    namespacesFilter.length > 0
                    && !namespacesFilter.includes(todo.namespace)
                  ) return null

                  return (
                    <TodoListItem
                      todo={todo}
                      key={todo.id}
                      controls={(isConnected && isOneTimePasswordCorrect) ? [
                        {
                          id: `remove-todo-${todo.id}`,
                          Icon: <CloseIcon
                            fontSize='small'
                            style={{ color: InvertedStatusColors[todo.status] }}
                          />,
                          // color: 'primary',
                          onClick: () => {
                            const isConfirmed = window.confirm(`🔥 Todo will be removed! It's Ok?`)
                            if (isConfirmed) onRemoveTodo({ todoId: todo.id, namespace: todo.namespace })
                          },
                        },
                        {
                          id: `edit-todo-${todo.id}`,
                          Icon: <DriveFileRenameOutlineIcon
                            fontSize='small'
                            style={{
                              color: InvertedStatusColors[todo.status],
                              // fontSize: '16px',
                            }}
                          />,
                          onClick: () => openEditTodo(todo),
                        }
                      ] : []}
                      onStarUpdate={(newPriority: number) => {
                        handleUpdateTodo({ newPriority })({ todoId: todo.id, namespace: todo.namespace, todo })
                      }}
                      onChangeStatus={(status) => {
                        handleUpdateTodo({ newStatus: status })({ todoId: todo.id, namespace: todo.namespace, todo })
                      }}
                    />
                  )
                })
              }
            </div>
          )
        }

      </div>
    </>
  )
}
