import React from 'react'
import { Button, TextField, Box, Stack, Alert } from '@mui/material'
import { useDispatch } from 'react-redux'
import { ReactiveEngine } from '@pravosleva/reactive-engine'
import { updateProjects, setActiveProject } from '~/store/reducers/autopark'
import AddIcon from '@mui/icons-material/Add'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import CloseIcon from '@mui/icons-material/Close'
import { CreateNewItemLogic, TProps } from './service.CreateNewItemLogic'
import { useReactiveValue0 } from '~/utils/reactive-engine'
import LoadingButton from '@mui/lab/LoadingButton'

// Инициализируем локальное ядро движка для этой изолированной фичи
const engine = new ReactiveEngine({
  logger: {
    isEnabled: true,
    instanceName: 'Create new list item form',
  }
})

export const CreateNewItem = ({ chat_id, project_id }: TProps) => {
  const dispatch = useDispatch()

  // Внедряем сервис логики
  const logic = engine.inject(CreateNewItemLogic)

  // Получаем реактивные значения полей формы
  const name = useReactiveValue0(logic.name)
  const description = useReactiveValue0(logic.description)
  const mileageLast = useReactiveValue0(logic.mileageLast)
  const mileageDelta = useReactiveValue0(logic.mileageDelta)
  
  // Получаем состояния отображения элементов управления
  const isOpened = useReactiveValue0(logic.isOpened)
  const isLoading = useReactiveValue0(logic.isLoading)
  const apiErr = useReactiveValue0(logic.apiErr)
  const isFormCorrect = useReactiveValue0(logic.isFormCorrect)

  const onSubmit = () => {
    logic.handleSubmit({
      chat_id,
      project_id,
      dispatch,
      updateProjects,
      setActiveProject
    })
  }

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
              onChange={(e) => { logic.name.value = e.target.value }} 
            />
            <TextField 
              value={description} 
              size='small' 
              fullWidth 
              disabled={isLoading} 
              variant="outlined" 
              label="Описание" 
              onChange={(e) => { logic.description.value = e.target.value }} 
            />
          </Stack>

          {/* Второй ряд: Пробеги */}
          <Stack direction="row" spacing={2}>
            <TextField 
              value={mileageLast || ''} 
              size='small' 
              fullWidth 
              disabled={isLoading} 
              variant="outlined" 
              label="Крайний пробег" 
              type="number" 
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                logic.mileageLast.value = isNaN(val) ? 0 : val
              }} 
            />
            <TextField 
              value={mileageDelta || ''} 
              size='small' 
              fullWidth 
              disabled={isLoading} 
              variant="outlined" 
              label="Интервал замены" 
              type="number" 
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                logic.mileageDelta.value = isNaN(val) ? 0 : val
              }} 
            />
          </Stack>

          {/* Третий ряд: Действия */}
          <Stack direction="row" spacing={2}>
            <LoadingButton 
              fullWidth 
              disabled={!isFormCorrect} // Убираем isLoading отсюда, LoadingButton сам задизейблит кнопку при загрузке
              
              loading={isLoading}       // Передаем наш реактивный сигнал из движка
              loadingPosition="start"   // Спиннер плавно заменит собой иконку LocalFireDepartmentIcon
              /* NOTE: Важные нюансы для версии 5.0.0-alpha.48
                1. Пропс loadingPosition="start" требует, чтобы у вас обязательно был передан пропс startIcon.
                Во время загрузки иконка огня плавно исчезнет,
                а на её месте появится вращающийся CircularProgress того же цвета, что и текст кнопки,
                не ломая общую ширину и верстку.

                2. Если вы хотите, чтобы при загрузке скрывался абсолютно весь текст, а спиннер вставал строго по центру,
                просто удалите пропсы loadingPosition и startIcon.
              */
              
              variant='contained' 
              onClick={onSubmit} 
              color='primary' 
              startIcon={<LocalFireDepartmentIcon />}
            >
              Создать
            </LoadingButton>
            <Button 
              fullWidth 
              variant='outlined' 
              onClick={logic.resetAll} 
              color='error' 
              startIcon={<CloseIcon />}
            >
              Отмена
            </Button>
          </Stack>

          {/* Системные алерты об ошибках сети/валидации API */}
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
          onClick={logic.handleOpen} 
          color='primary' 
          startIcon={<AddIcon />}
        >
          Добавить расходник
        </Button>
      )}
    </Box>
  )
}
