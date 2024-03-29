import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Button } from '@mui/material'
import { CustomPinInput } from '~/components/CustomPinInput'
import { useDebounce } from '~/hooks/useDebounce'
import { IRootState } from '~/store/IRootState'
import axios from 'axios'
// import KeyIcon from '@mui/icons-material/Key';
import axiosRetry from 'axios-retry'
import { groupLog } from '~/utils/groupLog'
import { useDispatch, useSelector } from 'react-redux'
import { updateProjects, setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import FingerprintIcon from '@mui/icons-material/Fingerprint'

type TProps = {
  chat_id: string;
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({
  baseURL,
  validateStatus: (_s: number) => true,
  withCredentials: true,
})
// NOTE: See also about axios interceptors https://axios-http.com/docs/interceptors
api.interceptors.response.use(function(config) {
  let count = 0
  count += 1

  groupLog({
    spaceName: `API interceptor: ${count}`,
    items: [count, config]
  })
  return config
})
// Exponential back-off retry delay between requests
axiosRetry(api, { retries: 10, retryDelay: axiosRetry.exponentialDelay })
const fetchCheckPassword = async ({ chat_id, password }: { chat_id: string, password: string }) => {
  const result = await api
    .post('/check-password', {
      chat_id,
      password,
    })
    .then((res: any) => {
      // console.log(res)
      return res.data
    })
    .catch((err: any) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}

export const OneTimeLoginFormBtn = ({ chat_id }: TProps) => {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const passwordRef = useRef<string>('')
  const debouncedCounter = useDebounce(count, 1000)
  // const [isPasswordCorrect, setIsPasswordCorrect] = useState(false)
  const [apiErr, setApiErr] = useState<string>('')
  const userCheckerResponse = useSelector((state: IRootState) => state.autopark.userCheckerResponse)
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)
  const [isFormOpened, setIsFormOpened] = useState(false)
  const handleOpenForm = useCallback(() => {
    setIsFormOpened(true)
  }, [])
  const handleCloseForm = useCallback(() => {
    setIsFormOpened(false)
  }, [])
  const dispatch = useDispatch()
  const isBrowser = useMemo(() => typeof window !== 'undefined', [typeof window])

  if (!isBrowser) return null

  useEffect(() => {
    // console.log('debouncedCounter', debouncedCounter)
    if (!!passwordRef.current) { // !userCheckerResponse?.ok
      setIsLoading(true)
      setApiErr('')
      fetchCheckPassword({ chat_id, password: passwordRef.current })
        .then((data) => {
          switch (true) {
            case data?.ok:
              dispatch(setIsOneTimePasswordCorrect(true))
              if (!!data?.projects) dispatch(updateProjects(data.projects))
              else {
                setApiErr(data?.message || 'No data.projects; No err.message')
              }

              setIsLoading(false)
              break
            case !!data?.message:
              setApiErr(data.message)

              setIsLoading(false)
              break
            default:
              setApiErr('ERROR 99; No err.message')
              setIsLoading(false)
              break
          }

          return data
        })
        .catch((err)=> {
          setApiErr(err?.message || 'ERROR 107; No err.message')
          setIsLoading(false)
          return err
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [debouncedCounter, chat_id, setIsLoading, userCheckerResponse?.ok, setApiErr])

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
  }, [countInc, setIsLoading])

  return (
    <>
      {
        !isOneTimePasswordCorrect && !isFormOpened && (
          <Button endIcon={<FingerprintIcon />} fullWidth variant="contained" color='primary' onClick={handleOpenForm}>
            Вход
          </Button>
        )
      }
      {
        isFormOpened && !isOneTimePasswordCorrect && (
          <CustomPinInput
            handlePinInputComplete={handlePinInputComplete}
            isLoading={isLoading}
            apiErr={apiErr}
            onCancel={handleCloseForm}
            chat_id={chat_id}
          />
        )
      }
      {/* isLoading && (
        <div>
          <em>Loading...</em>
        </div>
      ) */}
    </>
  )
}
