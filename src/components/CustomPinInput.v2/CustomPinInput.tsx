import React from 'react'
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress' // Для лоадера внутри MUI кнопки
import { PinInput } from './PinInput'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { ReactiveEngine } from '@pravosleva/reactive-engine'
import { useReactiveValue0 } from '~/utils/reactive-engine'
import { CustomPinInputLogic } from './service.CustomPinInputLogic'

type TProps = {
  handlePinInputComplete: (_value: any, _index: any) => void;
  isLoading: boolean;
  apiErr?: string;
  onCancel: () => void;
  chat_id: string;
}

const engine = new ReactiveEngine()

export const CustomPinInput = ({
  handlePinInputComplete, // Внешний колбэк сабмита формы при успешном вводе всех цифр
  isLoading,               // Внешний флаг загрузки верификации пина из родительского компонента
  chat_id,
  apiErr: externalErr,
}: TProps) => {
  const logic = engine.inject(CustomPinInputLogic)

  // Читаем реактивные состояния
  const errMsg = useReactiveValue0(logic.errMsg)
  const successMsg = useReactiveValue0(logic.successMsg)
  const isSending = useReactiveValue0(logic.isSending)

  const handleSendPasswordClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    logic.sendPasswordToUser(chat_id)
  }

  return (
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
            type="numeric"
            inputMode="numeric"
            inputStyle={{ borderColor: '#ff715c', borderRadius: '50%', borderWidth: '2px' }}
            inputFocusStyle={{ borderColor: '#03A9F4' }}
            
            // 🔥 КЛЮЧЕВОЙ ФИКС: Верификация кода срабатывает автоматически, когда введены все 4 цифры
            onComplete={handlePinInputComplete}
            
            autoSelect={true}
            regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
            disabled={isLoading || isSending}
            style={{ padding: '0px' }}
          />
        </Box>

        {!!errMsg && (
          <Alert variant="filled" severity="error">
            {errMsg}
          </Alert>
        )}

        {!!externalErr && (
          <Alert variant="filled" severity="error">
            {externalErr}
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
          borderTop: '1px solid rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '16px',
        }}
      >
        {/* МЫ ИСПОЛЬЗУЕМ КНОПКУ ИЗ @MUI/MATERIAL */}
        {/* Кнопка теперь АКТИВНА. Она нужна ТОЛЬКО для генерации и отправки кода в Telegram */}
        <Button
          fullWidth
          // disabled={isLoading || isSending}
          disabled={true}
          endIcon={isSending ? <CircularProgress size={16} color="inherit" /> : <ArrowForwardIcon />}
          variant="contained"
          color="primary"
          onClick={handleSendPasswordClick}
        >
          {isSending ? 'Sending...' : 'Send Password'}
        </Button>
      </CardActions>
    </Card>
  )
}
