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
import PinInput from './components/PinInput'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
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
api.interceptors.response.use(function (config) {
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
  apiErr: _apiErr,
  onCancel: _onCancel,
  chat_id,
}: TProps) => {
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const handleSendPasswordToUser = useCallback(() => {
    setErrMsg(null)
    setSuccessMsg(null)
    fetchSendCode({ chat_id })
      .then((res) => {
        if (res.ok) setSuccessMsg('Пароль отправлен в Telegram (Вы его можете получить от телеграм бота @pravosleva_bot - для этого нужно его найти в поиске и установить)')
        else setErrMsg(res.message || 'No res.message')
      })
      .catch((err) => {
        console.warn(err)
      })
  }, [chat_id, setErrMsg, setSuccessMsg])
  return (
    <>
      <Card sx={{ width: '100%' }}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography variant="h6" component="div" mb={1}>
            Введите одноразовый пароль
          </Typography>
          <Box>
            <PinInput
              length={4}
              initialValue=""
              secret
              // onChange={(value, index) => {}} 
              type="number"
              inputMode="numeric"
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
          {/* <Alert variant='standard' severity="info">
            <Typography variant="body2" component="h3" gutterBottom>
              Функция временно заблокирована в связи с нестабильной работой Telegram
            </Typography>
          </Alert> */}
          {/*!!apiErr && (
            <Alert
              // sx={{ mb: 2 }}
              variant="filled"
              severity="error"
            >
              <Typography variant="body2" component="h3" gutterBottom>
                {apiErr}
              </Typography>
            </Alert>
          ) */}
        </CardContent>
        <CardActions
          style={{
            borderTop: '1px solid rgba(0,0,0,0.2)',
            display: 'flex',
            // justifyContent: 'space-between',
            flexDirection: 'column',
            gap: '8px',
            padding: '16px',
          }}
        >
          <Button
            fullWidth
            disabled={true}
            endIcon={<ArrowForwardIcon />}
            variant="contained"
            color='primary'
            onClick={handleSendPasswordToUser}
          >
            Send Password
          </Button>
          {/* <Button style={{ marginLeft: '0px' }} fullWidth disabled={isLoading} variant="outlined" color='secondary' onClick={onCancel}>
            Close
          </Button> */}
        </CardActions>
      </Card>
    </>
  )
}
