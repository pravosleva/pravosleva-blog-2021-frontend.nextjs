import { useCallback, useEffect, useMemo, useState } from 'react'
import { Autocomplete, Button, TextField, Box, Grid, Select, MenuItem, Alert, FormControl, InputLabel } from '@mui/material';
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

const getVendorOptions = () => marks.map((m) => ({ label: m.name, ...m }))

type TProps = {
  chat_id: string
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
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
const getGenerationsOptions = (byUremont: TUremontModelsData | null, selectedModel: string | null): { label: string }[] => {
  if (!byUremont || byUremont.success !== 1 || !selectedModel) return []
  const result = []
  for (const model of byUremont.models) {
    if (model.name === selectedModel) {
      for (const gName of model.generations.map((g: TUremontGeneration) => g.generation_name)) {
        result.push({ label: gName })
      }
    }
  }
  return result
}
const getYearsOptions = (byUremont: TUremontModelsData | null, selectedModel: string | null, selectedGeneration: string | null): number[] => {
  if (!byUremont || byUremont.success !== 1 || !selectedModel || !selectedGeneration) return []
  return byUremont.models.reduce((acc: number[], model: TUremontModel) => {
    if (model.name === selectedModel) {
      const targetIndex: number = model.generations.findIndex((gen: TUremontGeneration) => gen.generation_name === selectedGeneration)

      if (targetIndex !== -1)  {
        const min = model.generations[targetIndex].start_year
        const max = model.generations[targetIndex].finish_year || new Date().getFullYear()

        // @ts-ignore
        const years: number[] = Array.apply(null, { length: max + 1 - min }).map(function(_, idx) {
          return idx + min;
        })
        
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
  // const modelsOptions = useMemo(() => !!selectedBrand ? getModelsOptions(selectedBrand) : [], [selectedBrand])
  const modelsOptions = useMemo(() => !!selectedBrand ? modelsByServer.map((str) => ({ label: str })) : [], [selectedBrand, modelsByServer])
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [additionalServiceErr, setAdditionalServiceErr] = useState<string | null>(null)
  const [uremontModelsData, setUremontModelsData] = useState<TUremontModelsData | null>(null)
  const generationOptions = useMemo<{ label: string }[]>(() => getGenerationsOptions(uremontModelsData, selectedModel), [uremontModelsData, selectedModel])
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
  // const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const resetAll = useCallback(() => {
    // setName('')
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

  const handleSubmit = useCallback(() => {
    setIsLoading(true)
    setApiErr('')
    fetchCreateProject({
      chat_id,
      name: `${selectedBrand} ${selectedModel}, ${selectedTransmission}, ${selectedYear}`,
      description: `${selectedGeneration}${!!description ? ` / ${description}` : ''}`,
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
  }, [chat_id, description, selectedBrand, selectedModel, selectedTransmission, selectedGeneration, selectedYear])

  // const handleChangeName = useCallback((e) => {
  //   setName(e.target.value)
  // }, [])
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
                    // key={selectedModel || 'default-key'}
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
            {
              generationOptions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Autocomplete
                    // key={selectedModel || 'default-key'}
                    value={!selectedGeneration ? { label: '' } : { label: selectedGeneration }}
                    size='small'
                    disablePortal
                    id='generation'
                    options={generationOptions}
                    // isOptionEqualToValue={() => false}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Generation" required value={selectedGeneration} />}
                    onChange={(e: any) => {
                      setSelectYear(null)
                      setSelectedGeneration(e.target.textContent)
                    }}
                  />
                </Box>
              )
            }
            {
              yearsOptions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <FormControl size='small' fullWidth required>
                    <InputLabel id="year-select-label">Year</InputLabel>
                    <Select
                      size='small'
                      variant='outlined'
                      labelId="year-select-label"
                      id="year-select"
                      value={selectedYear}
                      label="Year"
                      fullWidth
                      onChange={(e: any) => {
                        setSelectYear(e.target.value)
                      }}
                    >
                      {
                        yearsOptions.map((year) => {
                          return (
                            <MenuItem value={year}>{year}</MenuItem>
                          )
                        })
                      }
                    </Select>
                  </FormControl>
                </Box>
              )
            }

            {/* <Box sx={{ mb: 2 }}>
              <TextField value={name} size='small' fullWidth disabled={isLoading} variant="outlined" label="Name" type="text" onChange={handleChangeName}></TextField>
            </Box> */}
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
                  disabled={isLoading || !selectedBrand || !selectedModel || !selectedTransmission || (generationOptions.length > 0 && !selectedGeneration) || !selectedYear}
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
