import React, { useEffect, useRef } from 'react'
import { TextField, Box, Alert } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import { ReactiveEngine } from '@pravosleva/reactive-engine'
import { ReportTable } from './components'
import { ReportLogic, TProps } from './service.ReportLogic'
import { useReactiveValue0 } from '~/utils/reactive-engine'

const engine = new ReactiveEngine()

export const Report = ({ project_id, chat_id }: TProps) => {
  const logic = engine.inject(ReportLogic)

  const isLoading = useReactiveValue0(logic.isLoading)
  const apiErr = useReactiveValue0(logic.apiErr)
  const isSubmitDisabled = useReactiveValue0(logic.isSubmitDisabled)
  const report = useReactiveValue0(logic.report)
  const hasAnyReport = useReactiveValue0(logic.hasAnyReport)

  // Ссылаемся на один общий реф формы
  const formRef = useRef<HTMLFormElement>(null)

  // Следим за изменениями кэша пробегов
  useReactiveValue0(logic.mileageState)
  const currentMileageValue = logic.getMileageValue(chat_id, project_id)

  // Инициализируем локальный кэш при монтировании
  useEffect(() => {
    logic.initCache()
  }, [logic])

  // Синхронизируем нативное HTML-поле формы, когда данные подгрузились из localStorage
  useEffect(() => {
    if (formRef.current && currentMileageValue !== '') {
      const input = formRef.current.elements.namedItem('mileage') as HTMLInputElement
      if (input && input.value !== String(currentMileageValue)) {
        input.value = String(currentMileageValue)
      }
    }
  }, [currentMileageValue])

  /**
   * Делегированный обработчик изменений формы.
   * Срабатывает при вводе символов в TextField без вызова лишних ререндеров React.
   */
  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    logic.updateMileageFromForm(e.currentTarget, chat_id, project_id)
  }

  const handleSubmit = () => {
    logic.fetchReport(chat_id, project_id)
  }

  return (
    <>
      {/* Обертка в форму для универсального сбора через FormData */}
      <form ref={formRef} onChange={handleFormChange} onSubmit={(e) => e.preventDefault()}>
        {/* Поле ввода пробега */}
        <Box sx={{ mb: 1 }}>
          <TextField
            name="mileage"
            key={`${chat_id}-${project_id}`} // Гарантирует сброс UI-слоя при переключении между авто
            defaultValue={currentMileageValue}
            size='small'
            fullWidth
            disabled={isLoading}
            variant="outlined"
            label="Пробег"
            type="number"
          />
        </Box>
      </form>

      {/* Атомарно скрываемая кнопка отправки с индикатором загрузки */}
      {!isSubmitDisabled && (
        <Box sx={{ mb: 1 }}>
          <LoadingButton 
            fullWidth 
            disabled={!currentMileageValue} 
            loading={isLoading}
            loadingPosition="start"
            variant='contained' 
            onClick={handleSubmit} 
            color='secondary' 
            startIcon={<LocalFireDepartmentIcon />}
          >
            Получить отчет
          </LoadingButton>
        </Box>
      )}

      {/* Оповещение о сетевых ошибках */}
      {!!apiErr && (
        <Alert sx={{ mb: 1 }} variant="filled" severity="error" onClose={() => { logic.apiErr.value = '' }}>
          {apiErr}
        </Alert>
      )}

      {/* Блок отображения результатов отчета */}
      {hasAnyReport && isSubmitDisabled ? (
        <Box>
          <ReportTable report={report || []} />
        </Box>
      ) : isSubmitDisabled ? (
        <Alert sx={{ mb: 1 }} variant="filled" severity="info">
          Пока нет расходников
        </Alert>
      ) : null}
    </>
  )
}
