import { useCallback, useState } from 'react'
import { Button, TextField, Box, Grid } from '@mui/material'
import axios from 'axios';
// import { useDebounce } from '~/hooks/useDebounce'
import {
  // useSelector,
  useDispatch,
} from 'react-redux'
// import { IRootState } from '~/store/IRootState';
import { updateProjects, setActiveProject } from '~/store/reducers/autopark'
import AddIcon from '@mui/icons-material/Add'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import CloseIcon from '@mui/icons-material/Close'
// import Slider from '@mui/material/Slider'

type TProps = {
  chat_id: string
  project_id: string
}
type TReqArgs = {
  chat_id: string,
  project_id: string,
  item: {
    name: string,
    description: string,
    mileage: {
      last: number,
      delta: number,
    }
  }
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
const fetchCreateProject = async ({ chat_id, project_id, item }: TReqArgs) => {
  const result = await api
    .post('/project/add-item', {
      chat_id,
      project_id,
      item,
    })
    .then((res) => {
      // console.log(res)
      return res.data
    })
    .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}

export const CreateNewItem = ({ chat_id, project_id }: TProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [mileageLast, setMileageLast] = useState<number>(0)
  const [mileageDelta, setMileageDelta] = useState<number>(0)
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
    setMileageLast(0)
    setMileageDelta(0)
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
      project_id,
      item: {
        description,
        name,
        mileage: {
          last: mileageLast,
          delta: mileageDelta,
        }
      },
    })
      .then((res) => {
        if (res.ok) {
          if (!!res.projects) {
            dispatch(updateProjects(res.projects))
            const targetProject = res.projects[project_id]

            if (!!targetProject) dispatch(setActiveProject(targetProject))
          }
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
  }, [chat_id, project_id, name, description, mileageLast, mileageDelta])

  const handleChangeName = useCallback((e) => {
    setName(e.target.value)
  }, [])
  const handleChangeDescr = useCallback((e) => {
    setDescription(e.target.value)
  }, [])
  const handleChangeMileageLast = useCallback((e) => {
    setMileageLast(parseInt(e.target.value))
  }, [])
  // const handleChangeMileageDelta = useCallback((event: Event, newValue: number | number[]) => {
  //   setMileageDelta(newValue as number);
  // }, [])
  const handleChangeMileageDelta = useCallback((e) => {
    setMileageDelta(parseInt(e.target.value))
  }, [])

  return (
    <>
      {
        isOpened ? (
          <>
            {/* <Box sx={{ mb: 2 }}>
              <em>Create item for {chat_id} in {project_id}</em>
            </Box> */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
              <TextField value={name} size='small' fullWidth disabled={isLoading} variant="outlined" label="Name" type="text" onChange={handleChangeName}></TextField>
              </Grid>
              <Grid item xs={6}>
              <TextField value={description} size='small' fullWidth disabled={isLoading} variant="outlined" label="Description" type="text" onChange={handleChangeDescr}></TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField value={mileageLast} size='small' fullWidth disabled={isLoading} variant="outlined" label="Mileage Last" type="number" onChange={handleChangeMileageLast}></TextField>
              </Grid>
              <Grid item xs={6}>
                {/* <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                  <b>100&nbsp;km</b>
                  <Slider
                    size="small"
                    defaultValue={100}
                    min={100}
                    max={150000}
                    step={100}
                    marks
                    aria-label="Delta"
                    valueLabelDisplay="auto"
                    onChange={handleChangeMileageDelta}
                  />
                  <b>{mileageDelta}&nbsp;km</b>
                </Stack> */}
                <TextField value={mileageDelta} size='small' fullWidth disabled={isLoading} variant="outlined" label="Mileage Delta" type="number" onChange={handleChangeMileageDelta}></TextField>
              </Grid>

              <Grid item xs={6}>
                <Button fullWidth disabled={isLoading || !name || !mileageLast || !mileageDelta || !description} variant='contained' onClick={handleSubmit} color='primary' startIcon={<LocalFireDepartmentIcon />}>Создать</Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant='outlined' onClick={handleClose} color='primary' startIcon={<CloseIcon />}>Отмена</Button>
              </Grid>
            </Grid>

            {
              !!apiErr && (
                <Box>
                  <em>{apiErr}</em>
                </Box>
              )
            }

            {/* <pre>{JSON.stringify({ name, description, mileageLast, mileageDelta }, null, 2)}</pre> */}
          </>
        ) : (
          <Box>
            <Button fullWidth disabled={isLoading} variant='contained' onClick={handleOpen} color='primary' startIcon={<AddIcon />}>Добавить расходник</Button>
          </Box>
        )
      }
    </>
  )
}
