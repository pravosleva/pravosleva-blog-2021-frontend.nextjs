import { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material';
import axios from 'axios';
import { useDebounce } from '~/hooks/useDebounce'
import { ProjectList } from './components'
import { useSelector, useDispatch } from 'react-redux'
import { IRootState } from '~/store/IRootState';
import { updateProjects, setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import { CustomPinInput } from '~/components/CustomPinInput'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
const fetchCheckPassword = async ({ chat_id, password }: { chat_id: string, password: string }) => {
  const result = await api
    .post('/check-password', {
      chat_id,
      password,
    })
    .then((res) => {
      // console.log(res)
      return res.data
    })
    .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}

type TProps = {
  chat_id: string
}

export const Autopark2022 = ({
  chat_id
}: TProps) => {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const passwordRef = useRef<string>('')
  const debouncedCounter = useDebounce(count, 2000)
  // const [isPasswordCorrect, setIsPasswordCorrect] = useState(false)
  const [apiErr, setApiErr] = useState<string>('')
  const userCheckerResponse = useSelector((state: IRootState) => state.autopark.userCheckerResponse)
  const dispatch = useDispatch()
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)

  useEffect(() => {
    // console.log('debouncedCounter', debouncedCounter)
    if (userCheckerResponse?.ok && !!passwordRef.current) {
      setApiErr('')
      fetchCheckPassword({ chat_id, password: passwordRef.current })
        .then((data) => {
          console.log(data)
          if (data?.ok) {
            dispatch(setIsOneTimePasswordCorrect(true))
            if (!!data?.projects) {
              dispatch(updateProjects(data.projects))
            }
          }
          else if (!!data?.message) setApiErr(data.message)
          return data
        })
        .catch((err)=> {
          console.log(err)
          if (!!err?.message) setApiErr(err.message)
          return err
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [debouncedCounter, chat_id, setIsLoading, userCheckerResponse])

  const countInc = useCallback(() => {
    setCount((s) => ++s)
  }, [setCount])
  // const handleChange = useCallback((ev: any) => {
  //   // console.log(ev.target.value)
  //   passwordRef.current = ev.target.value
  //   countInc()
  // }, [countInc])
  const handlePinInputComplete = useCallback((value, _index) => {
    // console.log(value, index)
    setIsLoading(true)
    passwordRef.current = value
    countInc()
  }, [countInc])

  const autoparkData = useSelector((s: IRootState) => s.autopark)

  return (
    <>
      {/* <Button disabled={isLoading} variant='outlined' sx={{ mb: 2 }} onClick={countInc} color='secondary'>Count inc</Button> */}
      {/* <pre>{JSON.stringify(autoparkData, null, 2)}</pre> */}
      {!!autoparkData.userCheckerResponse?.projects && (
        <Box sx={{ mb: 2 }}>{Object.keys(autoparkData.userCheckerResponse?.projects).length} projects</Box>
      )}
      {
        isOneTimePasswordCorrect
        ? (
          <Box>
            <ProjectList chat_id={chat_id} />
          </Box>
        )
        : (
          <>
            {/* <Alert sx={{ mb: 2 }} variant="outlined" severity="info">
              <pre style={{ margin: 0 }}>{JSON.stringify(userCheckerResponse, null, 2)}</pre>
            </Alert> */}
            {/* <TextField disabled={isLoading} error={!!apiErr} helperText={apiErr || undefined} sx={{ mb: 2 }} variant="outlined" label="Password" type="text" onChange={handleChange}></TextField> */}
            {
              typeof window !== 'undefined' && (
                <Box sx={{ mb: 2 }}>
                  <CustomPinInput
                    handlePinInputComplete={handlePinInputComplete}
                    isLoading={isLoading}
                    apiErr={apiErr}
                  />
                </Box>
              )
            }
          </>
        )
      }
      {isLoading && (
        <Box sx={{ mb: 2 }}>
          <em>Loading...</em>
        </Box>
      )}
    </>
  )
}
