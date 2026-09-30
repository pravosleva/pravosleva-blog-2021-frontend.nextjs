import React, { useEffect, useRef } from 'react'
import { Modal, Typography, Button, TextField, Paper, Stack, Alert } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setActiveProject, updateProjects } from '~/store/reducers/autopark'
import { EditModalLogic, TProps } from './service.EditModalLogic'
import { ReactiveEngine } from '@pravosleva/reactive-engine'
import { useReactiveValue0 } from '~/utils/reactive-engine'
import LoadingButton from '@mui/lab/LoadingButton'

// Инициализируем локальный синглтон движка для управления этой формой
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
  const dispatch = useDispatch() // Автоматически выводится корректный тип Dispatch

  // Внедряем сервис логики
  const logic = engine.inject(EditModalLogic)

  // Читаем реактивные сигналы. Компонент перерендерится ТОЛЬКО если изменится конкретный инпут
  const name = useReactiveValue0(logic.name)
  const description = useReactiveValue0(logic.description)
  const mileageLast = useReactiveValue0(logic.mileageLast)
  const mileageDelta = useReactiveValue0(logic.mileageDelta)
  const isFormCorrect = useReactiveValue0(logic.isFormCorrect)
  const isSubmitting = useReactiveValue0(logic.isSubmitting)
  const apiErr = useReactiveValue0(logic.apiErr)

  // Синхронизируем внешние пропсы initialState с реактивными сигналами при открытии
  useEffect(() => {
    if (isOpened) logic.syncInitialState(initialState)
  }, [isOpened, initialState, logic])

  const handleSubmit = () => {
    logic.submitForm({
      chat_id,
      project_id,
      dispatch,             // Передается как Dispatch
      updateProjects,       // Передается как типизированный Action Creator
      setActiveProject,     // Передается как типизированный Action Creator
      onClose,
    })
  }

  const nameInputRef = useRef<HTMLInputElement>(null)
  const descInputRef = useRef<HTMLInputElement>(null)
  const mileageLastInputRef = useRef<HTMLInputElement>(null)
  const mileageDeltaInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!name && nameInputRef.current) nameInputRef.current.value = ''
    if (!description && descInputRef.current) descInputRef.current.value = ''
    if (!mileageLast && mileageLastInputRef.current) mileageLastInputRef.current.value = ''
    if (!mileageDelta && mileageDeltaInputRef.current) mileageDeltaInputRef.current.value = ''
  }, [name, description, mileageLast, mileageDelta])

  return (
    <Modal open={isOpened} onClose={onClose}>
      <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Редактировать
          </Typography>

          <div>
            <TextField
              // value={name}
              inputRef={nameInputRef}
              defaultValue={logic.name.value}
              size='small'
              fullWidth
              disabled={isSubmitting}
              variant="outlined"
              label="Наименование"
              type="text"
              onChange={(e) => { logic.name.value = e.target.value }}
              multiline
              maxRows={3}
            />
          </div>
          <div>
            <TextField
              // value={description}
              inputRef={descInputRef}
              defaultValue={logic.description.value}
              size='small'
              fullWidth
              disabled={isSubmitting}
              variant="outlined"
              label="Описание"
              type="text"
              onChange={(e) => { logic.description.value = e.target.value }}
              multiline
              maxRows={10}
            />
          </div>

          <Stack direction="row" spacing={2}>
            <TextField 
              // value={mileageLast || ''}
              inputRef={mileageLastInputRef}
              defaultValue={logic.mileageLast.value}
              size="small" 
              fullWidth 
              variant="outlined" 
              label="Крайний пробег" 
              type="number" 
              disabled={isSubmitting}
              onChange={(e) => { logic.mileageLast.value = parseInt(e.target.value) || 0 }} 
            />
            <TextField 
              // value={mileageDelta || ''}
              inputRef={mileageDeltaInputRef}
              defaultValue={logic.mileageDelta.value}
              size="small" 
              fullWidth 
              variant="outlined" 
              label="Интервал замены" 
              type="number" 
              disabled={isSubmitting}
              onChange={(e) => { logic.mileageDelta.value = parseInt(e.target.value) || 0 }} 
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
              disabled={!isFormCorrect}
              color="primary"
              
              loading={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить'}
            </LoadingButton>
          </Stack>

          {/* Системные алерты об ошибках сети/валидации API */}
          {!!apiErr && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {apiErr}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Modal>
  )
}
