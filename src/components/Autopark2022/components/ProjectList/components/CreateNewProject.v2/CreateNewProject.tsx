import React, { useEffect } from 'react'
import { Autocomplete, Button, TextField, Box, Grid, Select, MenuItem, Alert, FormControl, InputLabel, Typography, Card, CardMedia, CardContent, CardActions, Chip } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton' // Заменили кнопку создания на LoadingButton
import { useDispatch } from 'react-redux'
import { ReactiveEngine } from '@pravosleva/reactive-engine'
import { updateProjects } from '~/store/reducers/autopark'
import AddIcon from '@mui/icons-material/Add'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import { CreateNewProjectLogic, TProps } from './service.CreateNewProjectLogic'
import { useReactiveValue0 } from '~/utils/reactive-engine'

const engine = new ReactiveEngine({
  logger: {
    isEnabled: true,
    instanceName: 'Create new project'
  }
})

export const CreateNewProject = ({ chat_id }: TProps) => {
  const dispatch = useDispatch()
  const logic = engine.inject(CreateNewProjectLogic)

  // Извлекаем реактивные стейты
  const selectedBrand = useReactiveValue0(logic.selectedBrand)
  const selectedModel = useReactiveValue0(logic.selectedModel)
  const selectedTransmission = useReactiveValue0(logic.selectedTransmission)
  const selectedGeneration = useReactiveValue0(logic.selectedGeneration)
  const selectedYear = useReactiveValue0(logic.selectedYear)
  const description = useReactiveValue0(logic.description)

  const isOpened = useReactiveValue0(logic.isOpened)
  const isLoading = useReactiveValue0(logic.isLoading)
  const apiErr = useReactiveValue0(logic.apiErr)
  // const { error: additionalServiceErr } = useReactiveValue0(logic.fetchModelsResource)
  const additionalServiceErr = useReactiveValue0(logic.additionalServiceErr)

  // Читаем вычисляемые свойства (computed)
  const modelsOptions = useReactiveValue0(logic.modelsOptions)
  const generationOptions = useReactiveValue0(logic.generationOptions)
  const yearsOptions = useReactiveValue0(logic.yearsOptions)

  const onSubmit = () => {
    logic.handleSubmit({ chat_id, dispatch, updateProjects })
  }

  const defaultYearsOptions = logic.getDefaultYears()

  return (
    <>
      {isOpened ? (
        <>
          {/* Выбор Бренда */}
          <Box sx={{ mb: 2 }}>
            <Autocomplete
              size='small'
              disablePortal
              id='vendors'
              options={logic.brandsOptions}
              // value={selectedBrand ? { label: selectedBrand } : null}
              getOptionLabel={(option) => option.label || ''}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              fullWidth
              renderInput={(params) => <TextField {...params} required label='Бренд' />}
              onChange={(_e, newValue) => {
                logic.selectedBrand.value = newValue ? newValue.label : null
                logic.selectedModel.value = null
                logic.selectedGeneration.value = null
                logic.selectedYear.value = null
              }}
            />
          </Box>

          {/* Выбор Модели */}
          <Box sx={{ mb: 2 }}>
            {!!additionalServiceErr ? (
              <Alert severity='error' variant='filled'>
                {additionalServiceErr}
              </Alert>
            ) : (
              <Autocomplete
                value={selectedModel ? { label: selectedModel, value: selectedModel } : null}
                getOptionLabel={(option) => option.label || ''}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                disabled={!selectedBrand}
                size='small'
                disablePortal
                id='models'
                options={modelsOptions}
                fullWidth
                renderInput={(params) => <TextField {...params} label='Модель' required />}
                onChange={(_e, newValue) => {
                  logic.selectedGeneration.value = null
                  logic.selectedYear.value = null
                  logic.selectedModel.value = newValue ? newValue.label : null
                }}
              />
            )}
          </Box>

          {/* Выбор Трансмиссии */}
          <Box sx={{ mb: 2 }}>
            <Autocomplete
              value={selectedTransmission ? { label: selectedTransmission } : null}
              getOptionLabel={(option) => option.label || ''}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              size='small'
              disablePortal
              id='transmission'
              options={[{ label: 'MT' }, { label: 'AT' }, { label: 'AMT' }, { label: 'CVT' }]}
              fullWidth
              renderInput={(params) => <TextField {...params} label='Трансмиссия' required />}
              onChange={(_e, newValue) => {
                logic.selectedTransmission.value = newValue ? (newValue.label as any) : ''
              }}
            />
          </Box>

          {/* Карточки поколений авто от Uremont */}
          {generationOptions.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Alert severity='info' variant='standard'>Выберите поколение из списка ниже</Alert>
            </Box>
          )}

          {generationOptions.length > 0 && 
            generationOptions.map(({ label, image, descr }) => {
              const isSelected = label === selectedGeneration
              return (
                <Card
                  key={image}
                  sx={{ maxWidth: '100%', mb: 2, borderRadius: 2, cursor: 'pointer', border: isSelected ? '2px solid #2e7d32' : '1px solid rgba(0,0,0,0.12)' }}
                  variant='outlined'
                  onClick={() => {
                    logic.selectedYear.value = null
                    logic.selectedGeneration.value = label
                  }}
                >
                  <CardMedia sx={{ backgroundColor: '#F0F0F0' }} component="img" height="160" image={image} alt='' />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">{label}</Typography>
                    <Typography variant="body2" color="text.secondary">{descr}</Typography>
                  </CardContent>
                  <CardActions>
                    <Chip
                      icon={isSelected ? <CheckIcon /> : undefined}
                      label={isSelected ? 'Выбрано' : 'Доступно'}
                      color={isSelected ? 'success' : 'default'}
                    />
                  </CardActions>
                </Card>
              )
            })
          }

          {/* Выбор Года выпуска */}
          <Box sx={{ mb: 2 }}>
            <FormControl size='small' fullWidth required disabled={!selectedModel}>
              <InputLabel id="year-select-label">Год</InputLabel>
              <Select
                size='small'
                variant='outlined'
                labelId="year-select-label"
                id='year-select'
                value={selectedYear || ''}
                label='Год'
                fullWidth
                onChange={(e) => { logic.selectedYear.value = Number(e.target.value) || null }}
              >
                {generationOptions.length > 0 && yearsOptions.length > 0
                  ? yearsOptions.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)
                  : defaultYearsOptions.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)
                }
              </Select>
            </FormControl>
          </Box>  

          {/* Кастомное имя / Метка */}
          <Box sx={{ mb: 2 }}>
            <TextField
              value={description}
              size='small'
              fullWidth
              disabled={isLoading}
              variant='outlined'
              label='Имя / Метка'
              type='text'
              onChange={(e) => { logic.description.value = e.target.value }}
            />
          </Box>

          {/* Алерт ошибок сохранения проекта */}
          {!!apiErr && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="error">{apiErr}</Alert>
            </Box>
          )}

          {/* Логи дебаг-панели */}
          <Box sx={{ mb: 2 }}>
            <pre style={{ fontSize: 'x-small' }}>{JSON.stringify({ selectedBrand, selectedModel, selectedTransmission, selectedGeneration, selectedYear }, null, 2)}</pre>
          </Box>

          {/* Нижняя панель действий */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <LoadingButton
                fullWidth
                disabled={!selectedBrand || !selectedModel || !selectedTransmission || (generationOptions.length > 0 && !selectedGeneration) || !selectedYear}
                loading={isLoading}
                loadingPosition="start"
                variant='contained'
                onClick={onSubmit}
                color='primary'
                startIcon={<LocalFireDepartmentIcon />}
              >
                Создать
              </LoadingButton>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant='outlined' onClick={logic.handleClose} color='error' startIcon={<CloseIcon />}>Отмена</Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Box>
          <Button fullWidth disabled={isLoading} variant='contained' onClick={logic.handleOpen} color='primary' startIcon={<AddIcon />}>Добавить авто</Button>
        </Box>
      )}
    </>
  )
}
