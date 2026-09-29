import React, { useEffect } from 'react'
import { TextField, Box, Alert } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton' // Заменили обычную кнопку на LoadingButton с лоадером
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import { ReactiveEngine } from '@pravosleva/reactive-engine'
import { ReportTable } from './components'
import { ReportLogic, TProps } from './service.ReportLogic'
import { useReactiveValue0 } from '~/utils/reactive-engine'

// Создаем изолированный инстанс движка для виджета отчетов
const engine = new ReactiveEngine()

export const Report = ({ project_id, chat_id }: TProps) => {
  const logic = engine.inject(ReportLogic)

  // Подписываемся на реактивные сигналы и вычисления движка
  const isLoading = useReactiveValue0(logic.isLoading)
  const apiErr = useReactiveValue0(logic.apiErr)
  const isSubmitDisabled = useReactiveValue0(logic.isSubmitDisabled)
  const report = useReactiveValue0(logic.report)
  const hasAnyReport = useReactiveValue0(logic.hasAnyReport)

  // Читаем текущее реактивное состояние пробега (компонент перерендерится только при вводе)
  useReactiveValue0(logic.mileageState)
  const currentMileageValue = logic.getMileageValue(chat_id, project_id)

  // Инициализируем локальный кэш localStorage при монтировании компонента
  useEffect(() => {
    logic.initCache()
  }, [logic])

  const handleSubmit = () => {
    logic.fetchReport(chat_id, project_id)
  }

  return (
    <>
      {/* Поле ввода пробега */}
      <Box sx={{ mb: 1 }}>
        <TextField
          value={currentMileageValue}
          size='small'
          fullWidth
          disabled={isLoading}
          variant="outlined"
          label="Пробег"
          type="number"
          onChange={(e) => logic.changeMileage(chat_id, project_id, e.target.value)}
        />
      </Box>

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
