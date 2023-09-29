import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateProjects, setActiveProject } from '~/store/reducers/autopark'
import { IRootState } from '~/store/IRootState'
// import AddIcon from '@mui/icons-material/Add'
// import { CreateNewItem } from './components'
// import FolderIcon from '@mui/icons-material/Folder'
// import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios';
// import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import BuildIcon from '@mui/icons-material/Build'
// import EditIcon from '@mui/icons-material/Edit'
import { EditModal } from './components/EditModal'
import { ProjectMenu } from './components'

type TProps = {
  chat_id: string;
  project_id: string;
}
type TReqArgs = {
  chat_id: string;
  project_id: string;
  item_id: number;
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
const fetchRemoveItem = async ({ chat_id, project_id, item_id }: TReqArgs) => {
  const result = await api
    .post('/project/remove-item', {
      chat_id,
      project_id,
      item_id,
    })
    .then((res: any) => {
      // console.log(res)
      return res.data
    })
    .catch((err: any) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}
const defaultItem = {
  id: 777,
  name: '',
  description: '',
  mileage: {
    last: 0,
    delta: 0,
  }
}

export const TheProject = ({
  chat_id,
  project_id,
}: TProps) => {
  const activeProject = useSelector((state: IRootState) => state.autopark.activeProject)
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)
  // const handleEdit = useCallback(() => {
  //   if (typeof window !== 'undefined') window.alert('WIP #2:\nTODO: 1) API 2) front')
  // }, [])
  const items = useSelector((state: IRootState) => state.autopark.activeProject?.items || [])
  const dispatch = useDispatch()
  const handleDelete = useCallback((id: number) => {
    if (typeof window === 'undefined') return
    const isConfirmed = window.confirm('Уверены?')
    if (!isConfirmed) return

    fetchRemoveItem({
      chat_id,
      project_id,
      item_id: id,
    })
      .then((res) => {
        if (res.ok) {
          if (!!res.projects) {
            dispatch(updateProjects(res.projects))
            const targetProject = res.projects[project_id]

            if (!!targetProject) dispatch(setActiveProject(targetProject))
          }
          // resetAll()
        }
        // else if (!!res.message) setApiErr(res.message)

        return res
      })
  }, [chat_id, project_id])

  const [isEditModalOpened, setIsEditModalOpened] = useState(false)
  const handleEditModalOpen = useCallback(() => {
    setIsEditModalOpened(true)
  }, [])
  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpened(false)
  }, [])
  const [activeItem, setActiveItem] = useState(defaultItem)
  const handleEdit = useCallback((item)  => {
    setActiveItem(item)
    handleEditModalOpen()
  }, [])
  
  return (
    <>
      {!!activeProject?.description && <div>{activeProject.description}</div>}
      {/* <pre>{JSON.stringify(activeProject, null, 2)}</pre> */}

      <List dense>
        {items.map((item: any) => {
          const { id, name, description, mileage } = item

          return (
            <ListItem
              key={id}
              secondaryAction={
                (isOneTimePasswordCorrect || isDev)
                ? (
                  <>
                    <ProjectMenu
                      onDelete={() => {
                        handleDelete(id)
                      }}
                      onEdit={() => {
                        handleEdit(item)
                      }}
                    />
                    {/* <IconButton edge="end" aria-label="edit" onClick={} sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={()}>
                      <DeleteIcon />
                    </IconButton> */}
                  </>
                ) : null
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <BuildIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={name}
                secondary={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div>{description}</div>
                    <div>{mileage.last} / {mileage.delta}</div>
                  </div>
                }
              />
            </ListItem>
          )
        })}
      </List>

      <EditModal
        key={activeItem.id}
        isOpened={isEditModalOpened}
        initialState={activeItem}
        onClose={handleEditModalClose}
        chat_id={chat_id}
        project_id={project_id}
      />
    </>
  )
}
