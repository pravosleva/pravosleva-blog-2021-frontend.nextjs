import { useCallback } from 'react'
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemButton from '@mui/material/ListItemButton'
import { CreateNewProject } from './components'
import { Box, Button, Grid } from '@mui/material'
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from '~/components/Link'
import axios from 'axios';
// import { useDebounce } from '~/hooks/useDebounce'
import {
  useSelector,
  useDispatch,
} from 'react-redux'
// import { IRootState } from '~/store/IRootState';
import { updateProjects } from '~/store/reducers/autopark'
import { IRootState } from '~/store/IRootState'
// import CloseIcon from '@mui/icons-material/Close'

type TProps = {
  chat_id: string
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
const fetchRemoveProject = async ({ chat_id, project_id }: { chat_id: string, project_id: string }) => {
  const result = await api
    .post('/project/remove', {
      chat_id,
      project_id,
    })
    .then((res: any) => {
      // console.log(res)
      return res.data
    })
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
      .finally(() => {
        // setIsLoading(false)
      })
  }, [chat_id])

  return (
    <>
      <Box>
        {Object.keys(projects).map((id: string, i, a) => {
          return (
            // <ListItem key={id}>
            //   <ListItemButton>
            //     <ListItemText
            //       primary={projects[id].name}
            //       secondary={projects[id].description}
            //     />
            //   </ListItemButton>
            // </ListItem>
            <Grid container spacing={2} sx={{ mb: i !== a.length ? 2 : 0 }} key={id}>
              <Grid
                item
                xs={(isOneTimePasswordCorrect || isDev) ? 9 : 12}
                sm={(isOneTimePasswordCorrect || isDev) ? 10 : 12}
              >
                <Button fullWidth variant="contained" color='secondary' component={Link} noLinkStyle href={`/autopark-2022/${chat_id}/${id}`} shallow>
                  {projects[id].name}{projects[id].items.length > 0 ? ` (${projects[id].items.length} jobs)` : ''}
                </Button>
              </Grid>
              {
                (isOneTimePasswordCorrect || isDev) && (
                  <Grid item xs={3} sm={2}>
                    <Button fullWidth variant='outlined' onClick={handleRemove(id)} color='secondary'>DEL</Button>
                  </Grid>
                )
              }
            </Grid>
          )
        })}
      </Box>
      {(isOneTimePasswordCorrect || isDev) && (
        <Box>
          <CreateNewProject chat_id={chat_id} />
        </Box>
      )}
    </>
  )
}
