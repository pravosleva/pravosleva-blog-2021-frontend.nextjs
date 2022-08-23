import { useCallback, useEffect, useMemo, useState } from 'react'
import { Autocomplete, Button, TextField, Box, Grid, Select, MenuItem, Alert, FormControl, InputLabel, Typography, Card, CardMedia, CardContent, CardActions } from '@mui/material';
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
import { marks } from '~/components/Autopark2022/components/CarSelectSample/car-marks-list-by-uremont.json'
// import { ContentCut } from '@mui/icons-material'
import CheckIcon from '@mui/icons-material/Check'
import axiosRetry from 'axios-retry'

const getVendorOptions = () => marks.map((m) => ({ label: m.name, ...m }))

type TProps = {
  chat_id: string
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
// Exponential back-off retry delay between requests
axiosRetry(api, { retries: 10, retryDelay: axiosRetry.exponentialDelay })
const fetchCreateProject = async ({ chat_id, name, description }: { chat_id: string, name: string, description: string }) => {
  const result = await api
    .post('/project/create', {
      chat_id,
      name,
      description,
    })
    .then((res) => res.data)
    .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}
// -- NOTE: Additional service API
const baseURL2 = isDev
  ? 'http://localhost:5000/car-service'
  : 'http://pravosleva.ru/express-helper/car-service'
const api2 = axios.create({ baseURL: baseURL2, validateStatus: (_s: number) => true, })
// Exponential back-off retry delay between requests
axiosRetry(api2, { retries: 10, retryDelay: axiosRetry.exponentialDelay })
const fetchModelsData = async ({ vendor }: { vendor: string }) => {
  const result = await api2
    .get(`/get-models?vendor=${vendor}`)
    .then((res) => res.data)
    .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}
type TSpecialImage = {
  "id": number;
  "thumb_140_140": string;
  "thumb_34_34": string;
  "file_url": string;
}
type TUremontGeneration = {
  "id": number;
  "mark_name": string;
  "model_name": string;
  "generation_name": string;
  "start_year": number;
  "finish_year": number;
  "image": string;
  "images": TSpecialImage[];
}
type TUremontModel = {
  "id": number;
  "name": string;
  "mark_id": number;
  "sort_id": number;
  "rating": number;
  "is_seo_active": number;
  "rgs_code": any;
  "generations": TUremontGeneration[],
}
type TUremontModelsData = {
  "success": number;
	"models": TUremontModel[]
}
const getGenerationsOptions = (byUremont: TUremontModelsData | null, selectedModel: string | null): { label: string, image: string, descr: string }[] => {
  if (!byUremont || byUremont.success !== 1 || !selectedModel) return []
  const result: { label: string, image: string, descr: string }[] = []
  for (const model of byUremont.models) {
    if (model.name === selectedModel) {
      model.generations.forEach((g: TUremontGeneration) => {
        result.push({ label: g.generation_name, image: g.image, descr: `${g.start_year} - ${g.finish_year || 'Now'}` })
      })
    }
  }
  return result
}
// @ts-ignore
const getYears = (min: number, max: number): number[] => Array.apply(null, { length: max + 1 - min }).map(function(_, idx) {
  return idx + min;
})
const getYearsOptions = (byUremont: TUremontModelsData | null, selectedModel: string | null, selectedGeneration: string | null): number[] => {
  if (!byUremont || byUremont.success !== 1 || !selectedModel || !selectedGeneration) return []
  return byUremont.models.reduce((acc: number[], model: TUremontModel) => {
    if (model.name === selectedModel) {
      const targetIndex: number = model.generations.findIndex((gen: TUremontGeneration) => gen.generation_name === selectedGeneration)

      if (targetIndex !== -1)  {
        const min = model.generations[targetIndex].start_year
        const max = model.generations[targetIndex].finish_year || new Date().getFullYear()
        const years: number[] = getYears(min, max)
        
        return [...acc, ...years]
      }
    }

    return acc
  }, [])
}
// --

export const CreateNewProject = ({ chat_id }: TProps) => {
  const brandsOptions = getVendorOptions()
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [modelsByServer, setModelsByServer] = useState<string[]>([])
  const modelsOptions = useMemo(() => !!selectedBrand ? modelsByServer.map((str) => ({ label: str })) : [], [selectedBrand, modelsByServer])
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [additionalServiceErr, setAdditionalServiceErr] = useState<string | null>(null)
  const [uremontModelsData, setUremontModelsData] = useState<TUremontModelsData | null>(null)
  const generationOptions = useMemo<{ label: string, image: string, descr: string }[]>(() => getGenerationsOptions(uremontModelsData, selectedModel), [uremontModelsData, selectedModel])
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null)
  const yearsOptions = useMemo<number[]>(() => getYearsOptions(uremontModelsData, selectedModel, selectedGeneration), [uremontModelsData, selectedModel, selectedGeneration])
  const [selectedYear, setSelectYear] = useState<number | null>(null)
  useEffect(() => {
    if (!selectedBrand) return
    setAdditionalServiceErr(null)
    setModelsByServer([])
    setSelectedModel(null)
    setUremontModelsData(null)
    setSelectedGeneration(null)
    fetchModelsData({ vendor: selectedBrand })
      .then((res) => {
        if (!!res.models) setModelsByServer(res.models)
        if (!!res.byUremont) setUremontModelsData(res.byUremont)
        else throw new Error(res.message || 'Additional service ERR')
      })
      .catch((err) => {
        console.log(err)

        setAdditionalServiceErr(err.message || 'ERR')
      })
  }, [selectedBrand])
  const [selectedTransmission, setSelectedTransmission] = useState<'MT' | 'AT'>('MT')
  const [description, setDescription] = useState('')
  const resetAll = useCallback(() => {
    setDescription('')
    handleClose()
    setSelectedBrand(null)
    setSelectedModel(null)
    setSelectedGeneration(null)
    setSelectYear(null)
  }, [])
  const [isOpened, setIsOpened] = useState(false)
  const handleOpen = useCallback(() => {
    setIsOpened(true)
  }, [setIsOpened])
  const handleClose = useCallback(() => {
    setSelectedBrand(null)
    setSelectedModel(null)
    setSelectedGeneration(null)
    setSelectYear(null)
    setIsOpened(false)
  }, [setIsOpened])
  const [isLoading, setIsLoading] = useState(false)
  const [apiErr, setApiErr] = useState<string>('')
  const dispatch = useDispatch()
  const hasGenerationsByUremont = useMemo(() => generationOptions.length !== 0, [generationOptions])
  const defaultYearsOptions = getYears(1980, new Date().getFullYear())
  const handleSubmit = useCallback(() => {
    setIsLoading(true)
    setApiErr('')
    fetchCreateProject({
      chat_id,
      name: `${selectedBrand} ${selectedModel}, ${selectedTransmission}, ${selectedYear}`,
      description: `${(hasGenerationsByUremont && !!selectedGeneration) ? `${selectedGeneration} / ` : ''}${description || ''}`,
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
  }, [chat_id, description, selectedBrand, selectedModel, selectedTransmission, selectedGeneration, selectedYear, hasGenerationsByUremont])

  const handleChangeDescr = useCallback((e) => {
    setDescription(e.target.value)
  }, [])

  return (
    <>
      {
        isOpened ? (
          <>
            <Box sx={{ mb: 2 }}>
              <Autocomplete
                size='small'
                disablePortal
                id='vendors'
                options={brandsOptions}
                fullWidth
                renderInput={(params) => <TextField {...params} required label="Brand" />}
                onChange={(e: any) => {
                  setSelectedBrand(e.target.textContent)
                  setSelectedModel(null)
                  setSelectedGeneration(null)
                  setSelectYear(null)
                  try {
                    const modelInput: any = document.getElementById('models')
                    console.log(modelInput)
                    if (!!modelInput) modelInput.value = ''
                  } catch (err) {
                    console.log(err)
                  }
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              {
                !!additionalServiceErr
                ? (
                  <Alert severity="error" variant='filled'>{additionalServiceErr}</Alert>
                )
                : (
                  <Autocomplete
                    value={!selectedModel ? { label: '' } : { label: selectedModel }}
                    size='small'
                    disablePortal
                    id='models'
                    options={modelsOptions}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Model" required value={selectedModel} />}
                    onChange={(e: any) => {
                      setSelectedGeneration(null)
                      setSelectYear(null)
                      setSelectedModel(e.target.textContent)
                    }}
                  />
                )
              }
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth required>
                <InputLabel id="transmission-select-label">Transmission</InputLabel>
                <Select
                  size='small'
                  variant='outlined'
                  labelId="transmission-select-label"
                  id="transmission-select"
                  value={selectedTransmission}
                  label="Transmission"
                  fullWidth
                  onChange={(e: any) => {
                    setSelectedTransmission(e.target.value)
                  }}
                >
                  <MenuItem value='MT'>MT</MenuItem>
                  <MenuItem value='AT'>AT</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {generationOptions.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Alert severity='info' variant='standard'>Выберите поколение из списка ниже</Alert>
              </Box>
            )}
            {
              generationOptions.length > 0 && 
              generationOptions.map(({ label, image, descr }) => {
                const isSelected = label === selectedGeneration
                return (
                  <Card key={image} sx={{ maxWidth: '100%', mb: 2 }} variant='outlined'>
                    <CardMedia
                      sx={{
                        backgroundColor: '#F0F0F0',
                      }}
                      component="img"
                      height="160"
                      image={image}
                      alt=''
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {descr}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant={isSelected ? 'contained' : 'outlined'}
                        color='secondary'
                        onClick={() => {
                          setSelectYear(null)
                          setSelectedGeneration(label)
                        }}
                        startIcon={isSelected ? <CheckIcon /> : undefined}
                      >{isSelected ? 'This!' : 'Select'}</Button>
                      {/* <Button size="small">Learn More</Button> */}
                    </CardActions>
                  </Card>
                )
              })
            }
            <Box sx={{ mb: 2 }}>
              <FormControl size='small' fullWidth required>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  size='small'
                  variant='outlined'
                  labelId="year-select-label"
                  id="year-select"
                  value={selectedYear || undefined}
                  label="Year"
                  fullWidth
                  onChange={(e: any) => {
                    setSelectYear(e.target.value)
                  }}
                >
                  {
                    (hasGenerationsByUremont && yearsOptions.length > 0)
                    ? yearsOptions.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)
                    : defaultYearsOptions.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)
                  }
                </Select>
              </FormControl>
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
                <Button
                  fullWidth
                  disabled={isLoading || !selectedBrand || !selectedModel || !selectedTransmission || (hasGenerationsByUremont && !selectedGeneration) || !selectedYear}
                  variant='contained'
                  onClick={handleSubmit}
                  color='primary'
                  startIcon={<LocalFireDepartmentIcon />}
                >Создать</Button>
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
