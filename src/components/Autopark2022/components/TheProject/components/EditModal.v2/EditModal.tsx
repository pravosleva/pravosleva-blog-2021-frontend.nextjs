import React, { useEffect, useRef } from 'react'
import { Modal, Typography, Button, TextField, Paper, Stack, Alert } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setActiveProject, updateProjects } from '~/store/reducers/autopark'
import { EditModalLogic, TProps } from './service.EditModalLogic'
import { ReactiveEngine } from '@pravosleva/reactive-engine'
import { useReactiveValue0 } from '~/utils/reactive-engine'
import LoadingButton from '@mui/lab/LoadingButton'

const engine = new ReactiveEngine({
  logger: {
    isEnabled: true,
    instanceName: 'Edit list item form',
  }
})

export const EditModal = ({
  chat_id,
  project_id,
  isOpened,
  onClose,
  initialState,
}: TProps) => {
  const dispatch = useDispatch()
  const logic = engine.inject(EditModalLogic)

  // Читаем только управляющие флаги и состояние ошибок
  const isFormCorrect = useReactiveValue0(logic.isFormCorrect)
  const isSubmitting = useReactiveValue0(logic.isSubmitting)
  const apiErr = useReactiveValue0(logic.apiErr)

  // Один общий реф на всю HTML-форму целиком
  const formRef = useRef<HTMLFormElement>(null)

  // Синхронизируем реактивное состояние и сбрасываем нативные поля формы при открытии
  useEffect(() => {
    if (isOpened && initialState) {
      logic.syncInitialState(initialState)
      if (formRef.current) {
        formRef.current.reset() // Обновляет HTML-поля до актуальных значений defaultValue
      }
    }
  }, [isOpened, initialState, logic])

  /**
   * Сквозное делегирование событий. Любое изменение внутри формы 
   * автоматически и без лишних ререндеров обновляет реактивное ядро.
   */
  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    logic.updateFieldsFromForm(e.currentTarget)
  }

  const handleSubmit = () => {
    logic.submitForm({
      chat_id,
      project_id,
      dispatch,
      updateProjects,
      setActiveProject,
      onClose,
    })
  }

  return (
    <Modal open={isOpened} onClose={onClose}>
      <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 2 }}>
        <form style={{ margin: 0 }} ref={formRef} onChange={handleFormChange} onSubmit={(e) => e.preventDefault()}>
          <Stack spacing={2}>
            <Typography variant="h6" component="h2" fontWeight="bold">
              Редактировать
            </Typography>

            <div>
              <TextField
                name="name"
                defaultValue={initialState?.name || ''}
                size='small'
                fullWidth
                disabled={isSubmitting}
                variant="outlined"
                label="Наименование"
                type="text"
                multiline
                maxRows={3}
              />
            </div>
            <div>
              <TextField
                name="description"
                defaultValue={initialState?.description || ''}
                size='small'
                fullWidth
                disabled={isSubmitting}
                variant="outlined"
                label="Описание"
                type="text"
                multiline
                maxRows={10}
              />
            </div>

            <Stack direction="row" spacing={2}>
              <TextField 
                name="mileageLast"
                defaultValue={initialState?.mileage?.last ?? ''}
                size="small" 
                fullWidth 
                variant="outlined" 
                label="Крайний пробег" 
                type="number" 
                disabled={isSubmitting}
              />
              <TextField 
                name="mileageDelta"
                defaultValue={initialState?.mileage?.delta ?? ''}
                size="small" 
                fullWidth 
                variant="outlined" 
                label="Интервал замены" 
                type="number" 
                disabled={isSubmitting}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              {!!onClose && (
                <Button fullWidth variant="outlined" onClick={onClose} color="primary" disabled={isSubmitting}>
                  Закрыть
                </Button>
              )}
              <LoadingButton 
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={!isFormCorrect || isSubmitting}
                color="primary"
                loading={isSubmitting}
              >
                Отправить
              </LoadingButton>
            </Stack>

            {!!apiErr && (
              <Alert severity="error" sx={{ mt: 1 }} onClose={() => { logic.apiErr.value = '' }}>
                {apiErr}
              </Alert>
            )}
          </Stack>
        </form>
      </Paper>
    </Modal>
  )
}
