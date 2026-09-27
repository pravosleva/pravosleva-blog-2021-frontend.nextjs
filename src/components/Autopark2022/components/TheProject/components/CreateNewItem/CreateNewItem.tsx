import { useCallback, useMemo, useState } from 'react'
import { Button, TextField, Box, Stack, Alert } from '@mui/material'
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { updateProjects, setActiveProject } from '~/store/reducers/autopark'
import AddIcon from '@mui/icons-material/Add'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import CloseIcon from '@mui/icons-material/Close'

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
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: () => true })

const fetchCreateProject = async ({ chat_id, project_id, item }: TReqArgs) => {
  try {
    const res = await api.post('/project/add-item', { chat_id, project_id, item });
    return res.data;
  } catch (err: any) {
    return typeof err === 'string' ? err : err.message || 'No err.message';
  }
}

export const CreateNewItem = ({ chat_id, project_id }: TProps) => {
  const dispatch = useDispatch()
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [mileageLast, setMileageLast] = useState<number>(0)
  const [mileageDelta, setMileageDelta] = useState<number>(0)
  
  const [isOpened, setIsOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiErr, setApiErr] = useState<string>('')

  const handleOpen = useCallback(() => setIsOpened(true), [])
  const handleClose = useCallback(() => setIsOpened(false), [])

  const resetAll = useCallback(() => {
    setName('')
    setDescription('')
    setMileageLast(0)
    setMileageDelta(0)
    setApiErr('')
    handleClose()
  }, [handleClose])

  // Обработчики ввода с типизацией и защитой от NaN
  const handleChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }, [])
  
  const handleChangeDescr = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }, [])
  
  const handleChangeMileageLast = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    setMileageLast(isNaN(val) ? 0 : val)
  }, [])
  
  const handleChangeMileageDelta = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    setMileageDelta(isNaN(val) ? 0 : val)
  }, [])

  // Валидация формы
  const isFormCorrect = useMemo(() => {
    return !!name.trim() && !!description.trim() && mileageLast >= 0 && mileageDelta > 0
  }, [name, description, mileageLast, mileageDelta])

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
          if (res.projects) {
            dispatch(updateProjects(res.projects))
            const targetProject = res.projects[project_id]
            if (targetProject) dispatch(setActiveProject(targetProject))
          }
          resetAll()
        } else if (res.message) {
          setApiErr(res.message)
        }
      })
      .catch((err) => {
        if (err.message) setApiErr(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [chat_id, project_id, name, description, mileageLast, mileageDelta, dispatch, resetAll])

  return (
    <Box width="100%">
      {isOpened ? (
        <Stack spacing={2}>
          {/* Первый ряд: Наименование и Описание */}
          <Stack direction="row" spacing={2}>
            <TextField 
              value={name} 
              size='small' 
              fullWidth 
              disabled={isLoading} 
              variant="outlined" 
              label="Наименование" 
              onChange={handleChangeName} 
            />
            <TextField 
              value={description} 
              size='small' 
              fullWidth 
              disabled={isLoading} 
              variant="outlined" 
              label="Описание" 
              onChange={handleChangeDescr} 
            />
          </Stack>

          {/* Второй ряд: Пробеги */}
          <Stack direction="row" spacing={2}>
            <TextField 
              value={mileageLast} 
              size='small' 
              fullWidth 
              disabled={isLoading} 
              variant="outlined" 
              label="Крайний пробег" 
              type="number" 
              onChange={handleChangeMileageLast} 
            />
            <TextField 
              value={mileageDelta} 
              size='small' 
              fullWidth 
              disabled={isLoading} 
              variant="outlined" 
              label="Интервал замены" 
              type="number" 
              onChange={handleChangeMileageDelta} 
            />
          </Stack>

          {/* Третий ряд: Действия */}
          <Stack direction="row" spacing={2}>
            <Button 
              fullWidth 
              disabled={isLoading || !isFormCorrect} 
              variant='contained' 
              onClick={handleSubmit} 
              color='primary' 
              startIcon={<LocalFireDepartmentIcon />}
            >
              Создать
            </Button>
            <Button 
              fullWidth 
              variant='outlined' 
              onClick={resetAll} 
              color='error' 
              startIcon={<CloseIcon />}
            >
              Отмена
            </Button>
          </Stack>

          {/* Красивый вызов системной ошибки */}
          {!!apiErr && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {apiErr}
            </Alert>
          )}
        </Stack>
      ) : (
        <Button 
          fullWidth 
          disabled={isLoading} 
          variant='contained' 
          onClick={handleOpen} 
          color='primary' 
          startIcon={<AddIcon />}
        >
          Добавить расходник
        </Button>
      )}
    </Box>
  )
}
