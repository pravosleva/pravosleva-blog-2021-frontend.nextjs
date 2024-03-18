import { useCallback } from 'react'
// import { CreateNewProject } from './components'
import { Box, Button, Stack, IconButton } from '@mui/material'
import Link from '~/components/Link'
import axios from 'axios'
import {
  useSelector,
  useDispatch,
} from 'react-redux'
import { updateProjects } from '~/store/reducers/autopark'
import { IRootState } from '~/store/IRootState'
import DeleteIcon from '@mui/icons-material/Delete'

type TProps = {
  chat_id: string
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'https://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
const fetchRemoveProject = async ({ chat_id, project_id }: { chat_id: string, project_id: string }) => {
  const result = await api
    .post('/project/remove', {
      chat_id,
      project_id,
    })
    .then((res: any) => res.data)
    .catch((err: any) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}

export const ProjectList = ({
  chat_id,
}: TProps) => {
  const projects = useSelector((s: IRootState) => s.autopark.userCheckerResponse?.projects || {})
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)
  const dispatch = useDispatch()
  const handleRemove = useCallback((id: string) => () => {
    const isConfirmed = window.confirm('Уверены?')
    if (!isConfirmed) return
    fetchRemoveProject({
      chat_id,
      project_id: id,
    })
      .then((res) => {
        if (res.ok) {
          if (!!res.projects) dispatch(updateProjects(res.projects))
          // resetAll()
        }
        // else if (!!res.message) setApiErr(res.message)

        return res
      })
      .catch((err) => {
        // if (!!err.message) setApiErr(err.message)
        return err
      })
  }, [chat_id])

  if (Object.keys(projects).length === 0) return null
  return (
    <>
      <Box>
        {Object.keys(projects).map((id: string, _i, _a) => {
          return (
            // <ListItem key={id}>
            //   <ListItemButton>
            //     <ListItemText
            //       primary={projects[id].name}
            //       secondary={projects[id].description}
            //     />
            //   </ListItemButton>
            // </ListItem>
            <Stack
              key={id}
              direction='row'
              alignItems='start'
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Button
                fullWidth
                variant="contained"
                color='secondary'
                component={Link}
                noLinkStyle
                href={`/autopark-2022/${chat_id}/${id}`}
                shallow
              >
                {projects[id].name}{projects[id].items.length > 0 ? ` (${projects[id].items.length} jobs)` : ''}
              </Button>
              {
                (isOneTimePasswordCorrect || isDev) && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={handleRemove(id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
            </Stack>
          )
        })}
      </Box>
    </>
  )
}
