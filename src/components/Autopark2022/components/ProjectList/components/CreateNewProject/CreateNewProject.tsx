import { useCallback, useState } from 'react'
import { Button, TextField, Box, Grid } from '@mui/material';
import axios from 'axios';
// import { useDebounce } from '~/hooks/useDebounce'
import {
  // useSelector,
  useDispatch,
} from 'react-redux'
// import { IRootState } from '~/store/IRootState';
import { updateProjects } from '~/store/reducers/autopark'
import AddIcon from '@mui/icons-material/Add'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import CloseIcon from '@mui/icons-material/Close'

type TProps = {
  chat_id: string
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
const fetchCreateProject = async ({ chat_id, name, description }: { chat_id: string, name: string, description: string }) => {
  const result = await api
    .post('/project/create', {
      chat_id,
      name,
      description,
    })
    .then((res) => {
      // console.log(res)
      return res.data
    })
    .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}

export const CreateNewProject = ({ chat_id }: TProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isOpened, setIsOpened] = useState(false)
  const handleOpen = useCallback(() => {
    setIsOpened(true)
  }, [setIsOpened])
  const handleClose = useCallback(() => {
    setIsOpened(false)
  }, [setIsOpened])
  const resetAll = useCallback(() => {
    setName('')
    setDescription('')
    handleClose()
  }, [])
  const [isLoading, setIsLoading] = useState(false)
  const [apiErr, setApiErr] = useState<string>('')
  const dispatch = useDispatch()

  const handleSubmit = useCallback(() => {
    setIsLoading(true)
    setApiErr('')
    fetchCreateProject({
      chat_id,
      name,
      description,
    })
      .then((res) => {
        if (res.ok) {
          if (!!res.projects) dispatch(updateProjects(res.projects))
          resetAll()
        }
        else if (!!res.message) setApiErr(res.message)

        return res
      })
      .catch((err) => {
        if (!!err.message) setApiErr(err.message)
        return err
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [chat_id, name, description])

  const handleChangeName = useCallback((e) => {
    setName(e.target.value)
  }, [])
  const handleChangeDescr = useCallback((e) => {
    setDescription(e.target.value)
  }, [])

  return (
    <>
      {
        isOpened ? (
          <>
            <Box sx={{ mb: 2 }}>
              <TextField value={name} size='small' fullWidth disabled={isLoading} variant="outlined" label="Name" type="text" onChange={handleChangeName}></TextField>
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField value={description} size='small' fullWidth disabled={isLoading} variant="outlined" label="Description" type="text" onChange={handleChangeDescr}></TextField>
            </Box>

            {
              !!apiErr && (
                <Box sx={{ mb: 2 }}>
                  <em>{apiErr}</em>
                </Box>
              )
            }

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Button fullWidth disabled={isLoading || !name} variant='contained' onClick={handleSubmit} color='primary' startIcon={<LocalFireDepartmentIcon />}>Создать</Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant='outlined' onClick={handleClose} color='primary' startIcon={<CloseIcon />}>Отмена</Button>
              </Grid>
            </Grid>
          </>
        ) : (
          <Box sx={{ mb: 2 }}>
            <Button fullWidth disabled={isLoading} variant='contained' onClick={handleOpen} color='primary' startIcon={<AddIcon />}>Create New Project</Button>
          </Box>
        )
      }
    </>
  )
}
