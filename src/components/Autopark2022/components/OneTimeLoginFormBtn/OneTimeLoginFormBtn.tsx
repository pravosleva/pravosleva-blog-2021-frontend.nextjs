import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@mui/material'
import { CustomPinInput } from '~/components/CustomPinInput'
import { useDebounce } from '~/hooks/useDebounce'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { updateProjects, setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import axios from 'axios'

type TProps = {
  chat_id: string
}

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
  const debouncedCounter = useDebounce(count, 2000)
  // const [isPasswordCorrect, setIsPasswordCorrect] = useState(false)
  const [apiErr, setApiErr] = useState<string>('')
  const userCheckerResponse = useSelector((state: IRootState) => state.autopark.userCheckerResponse)
  const dispatch = useDispatch()
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)
  const [isFormOpened, setIsFormOpened] = useState(false)
  const handleOpenForm = useCallback(() => {
    setIsFormOpened(true)
  }, [])
  // const handleCloseForm = useCallback(() => {
  //   setIsFormOpened(false)
  // }, [])

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

  return (
    <>
      {
        !isOneTimePasswordCorrect && !isFormOpened && (
          <Button fullWidth variant="contained" color='primary' onClick={handleOpenForm}>
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
          />
        )
      }
      {isLoading && (
        <div>
          <em>Loading...</em>
        </div>
      )}
    </>
  )
}
