import { useCallback, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import PinInput from './components/PinInput' // 'react-pin-input'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
// import Link from '~/components/Link'
// import LoadingButton from '@mui/lab/LoadingButton'
import axios from 'axios'
import { groupLog } from '~/utils/groupLog'
import axiosRetry from 'axios-retry'

type TProps = {
  handlePinInputComplete: (_value: any, _index: any) => void;
  isLoading: boolean;
  apiErr?: string;
  onCancel: () => void;
  chat_id: string;
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:2021'
  : 'http://pravosleva.pro/tg-bot-2021'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
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
const fetchSendCode = async ({ chat_id }: { chat_id: string }) => {
  const result = await api
    .post('/autopark-2022/send-code', {
      chat_id,
    })
    .then((res: any) => {
      // console.log(res)
      return res.data
    })
    .catch((err: any) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}


export const CustomPinInput = ({
  handlePinInputComplete,
  isLoading,
  apiErr,
  onCancel,
  chat_id,
}: TProps) => {
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const handleSendPasswordToUser = useCallback(() => {
    setErrMsg(null)
    setSuccessMsg(null)
    fetchSendCode({ chat_id })
      .then((res) => {
        if (res.ok) setSuccessMsg('Пароль отправлен в Telegram (Вы его можете получить только от @pravosleva_bot)')
        else setErrMsg(res.message || 'No res.message')
      })
      .catch((err) => {
        console.warn(err)
      })
  }, [chat_id, setErrMsg, setSuccessMsg])
  return (
    <>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            One time password
          </Typography> */}
          <Typography variant="h6" component="div" mb={1}>
            Введите одноразовый пароль
          </Typography>
          {/* <Typography sx={{ mb: 1 }} color="text.secondary">
            Пароль можно получить через Telegram bot
          </Typography> */}
          <Box sx={{ mb: 1 }}>
            <PinInput 
              length={4} 
              initialValue=""
              secret 
              // onChange={(value, index) => {}} 
              type="numeric" 
              inputMode="number"
              inputStyle={{ borderColor: '#ff715c', borderRadius: '50%', borderWidth: '2px' }}
              inputFocusStyle={{ borderColor: '#03A9F4' }}
              onComplete={handlePinInputComplete}
              autoSelect={true}
              regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
              disabled={isLoading}
              style={{
                padding: '0px',
                // border: '1px solid red'
              }}
            />
          </Box>
          {/* <Typography variant="body2">
            Пароль можно получить через Telegram bot
          </Typography> */}
          {!!errMsg && (
            <Alert variant="filled" severity="error">
              {errMsg}
            </Alert>
          )}
          {!!successMsg && (
            <Alert variant="filled" severity="success">
              {successMsg}
            </Alert>
          )}
        </CardContent>
        <CardActions
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {/* <Button size="small">Learn More</Button> */}
          {/*
          <LoadingButton
            // disabled={isLoading}
            loading={isLoading}
            endIcon={<ArrowForwardIcon />}
            variant="contained"
            color='primary'
            component={Link}
            noLinkStyle
            href='https://t.me/pravosleva_bot?start=autopark'
            target='_blank'
          >
            Get Password
          </LoadingButton>
          */}
          <Button
            disabled={isLoading}
            endIcon={<ArrowForwardIcon />}
            variant="contained"
            color='primary'
            onClick={handleSendPasswordToUser}
            // noLinkStyle
            // href='https://t.me/pravosleva_bot?start=autopark'
            // target='_blank'
          >
            Send Password
          </Button>
          <Button disabled={isLoading} variant="outlined" color='primary' onClick={onCancel}>
            Close
          </Button>
        </CardActions>
      </Card>
      {!!apiErr && (
        <Alert
          sx={{ mb: 2 }}
          variant="filled"
          severity="error"
        >
          <Typography variant="body2" component="h3" gutterBottom>
            {apiErr}
          </Typography>
        </Alert>
      )}
    </>
  )
}
