import { useCallback, useEffect, useMemo, useState } from 'react'
import { Autocomplete, Button, TextField, Box, Grid, Select, MenuItem, Alert } from '@mui/material';
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
// import listOfCars from '~/components/Autopark2022/components/CarSelectSample/list-of-cars.json'

// declare module '*/list-of-cars.json' {
//   const value: any;
//   export default value;
// }

// type TListOfCars = {
//   Year: number;
//   Make: string;
//   Model: string;
//   Category: string;
// }
// type TModelResult = {
//   [key: string]: {
//     models: string[]
//   }
// }

const getVendorOptions = () => marks.map((m) => ({ label: m.name, ...m }))
// const getModelsMap = () => {
//   const result: TModelResult = {}

//   for (const car of listOfCars) {
//     if (!result[car.Make]?.models) {
//       result[car.Make] = {
//         models: [car.Model]
//       }
//     } else {
//       if (!result[car.Make].models.includes(car.Model)) {
//         result[car.Make].models.push(car.Model)
//       }
//     }
//   }

//   return result
// }
// const getModelsOptions = (vendor: string) => {
//   const modelsMap = getModelsMap()

//   if (!!modelsMap[vendor]) {
//     return modelsMap[vendor].models.map((m) => ({ label: m }))
//   }

//   return []
// }

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
// --

export const CreateNewProject = ({ chat_id }: TProps) => {
  const brandsOptions = getVendorOptions()
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [modelsByServer, setModelsByServer] = useState<string[]>([])
  // const modelsOptions = useMemo(() => !!selectedBrand ? getModelsOptions(selectedBrand) : [], [selectedBrand])
  const modelsOptions = useMemo(() => !!selectedBrand ? modelsByServer.map((str) => ({ label: str })) : [], [selectedBrand, modelsByServer])
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [additionalServiceErr, setAdditionalServiceErr] = useState<string | null>(null)
  useEffect(() => {
    if (!selectedBrand) return
    setAdditionalServiceErr(null)
    setModelsByServer([])
    setSelectedModel(null)
    fetchModelsData({ vendor: selectedBrand })
      .then((res) => {
        if (!!res.models) setModelsByServer(res.models)
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
  }, [])
  const [isOpened, setIsOpened] = useState(false)
  const handleOpen = useCallback(() => {
    setIsOpened(true)
  }, [setIsOpened])
  const handleClose = useCallback(() => {
    setSelectedBrand(null)
    setSelectedModel(null)
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
      name: `${selectedBrand} ${selectedModel}, ${selectedTransmission}`,
      description,
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
  }, [chat_id, description, selectedBrand, selectedModel, selectedTransmission])

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
                renderInput={(params) => <TextField {...params} label="Brand" />}
                onChange={(e: any) => {
                  setSelectedBrand(e.target.textContent)
                  setSelectedModel(null)
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
                    renderInput={(params) => <TextField {...params} label="Model" value={selectedModel} />}
                    onChange={(e: any) => {
                      setSelectedModel(e.target.textContent)
                    }}
                  />
                )
              }
            </Box>
            <Box sx={{ mb: 2 }}>
              <Select
                size='small'
                variant='outlined'
                fullWidth
                labelId="transmission-type-select-label"
                id="transmission-type-select"
                value={selectedTransmission}
                onChange={(e: any) => {
                  setSelectedTransmission(e.target.value)
                }}
                label="Transmission"
              >
                <MenuItem value='MT'>MT</MenuItem>
                <MenuItem value='AT'>AT</MenuItem>
              </Select>
            </Box>

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
                <Button fullWidth disabled={isLoading || !selectedBrand || !selectedModel || !selectedTransmission} variant='contained' onClick={handleSubmit} color='primary' startIcon={<LocalFireDepartmentIcon />}>Создать</Button>
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
