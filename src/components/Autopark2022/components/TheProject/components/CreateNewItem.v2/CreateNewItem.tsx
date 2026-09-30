import React, { useEffect, useRef } from 'react'
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
  const logic = engine.inject(CreateNewItemLogic)

  // Получаем состояния отображения элементов управления и флаги валидации
  const isOpened = useReactiveValue0(logic.isOpened)
  const isLoading = useReactiveValue0(logic.isLoading)
  const apiErr = useReactiveValue0(logic.apiErr)
  const isFormCorrect = useReactiveValue0(logic.isFormCorrect)

  // Подписываемся на сигналы данных, чтобы отслеживать момент вызова логического сброса формы (resetAll)
  const nameSignal = useReactiveValue0(logic.name)
  const descriptionSignal = useReactiveValue0(logic.description)

  // Ссылаемся на один общий реф формы целиком
  const formRef = useRef<HTMLFormElement>(null)

  // Если сигналы в ядре очистились (сработал resetAll), нативно сбрасываем состояние HTML-полей формы
  useEffect(() => {
    if (!nameSignal && !descriptionSignal && formRef.current) {
      formRef.current.reset()
    }
  }, [nameSignal, descriptionSignal])

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    logic.updateFieldsFromForm(e.currentTarget)
  }

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
        <form style={{ margin: 0 }} ref={formRef} onChange={handleFormChange} onSubmit={(e) => e.preventDefault()}>
          <Stack spacing={2}>
            {/* Первый ряд: Наименование и Описание */}
            <Stack direction="row" spacing={2}>
              <TextField 
                name="name"
                defaultValue={logic.name.value}
                size='small' 
                fullWidth 
                disabled={isLoading} 
                variant="outlined" 
                label="Наименование" 
              />
              <TextField 
                name="description"
                defaultValue={logic.description.value}
                size='small' 
                fullWidth 
                disabled={isLoading} 
                variant="outlined" 
                label="Описание" 
              />
            </Stack>

            {/* Второй ряд: Пробеги */}
            <Stack direction="row" spacing={2}>
              <TextField 
                name="mileageLast"
                defaultValue={logic.mileageLast.value || ''}
                size='small' 
                fullWidth 
                disabled={isLoading} 
                variant="outlined" 
                label="Крайний пробег" 
                type="number" 
              />
              <TextField 
                name="mileageDelta"
                defaultValue={logic.mileageDelta.value || ''}
                size='small' 
                fullWidth 
                disabled={isLoading} 
                variant="outlined" 
                label="Интервал замены" 
                type="number" 
              />
            </Stack>

            {/* Третий ряд: Действия */}
            <Stack direction="row" spacing={2}>
              <LoadingButton 
                fullWidth 
                disabled={!isFormCorrect || isLoading}
                loading={isLoading}       
                loadingPosition="start"   
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
                disabled={isLoading}
                startIcon={<CloseIcon />}
              >
                Отмена
              </Button>
            </Stack>

            {/* Системные алерты об ошибках сети/валидации API */}
            {!!apiErr && (
              <Alert severity="error" sx={{ mt: 1 }} onClose={() => { logic.apiErr.value = '' }}>
                {apiErr}
              </Alert>
            )}
          </Stack>
        </form>
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
