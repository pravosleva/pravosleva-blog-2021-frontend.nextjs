import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from '@mui/material'
import PinInput from 'react-pin-input'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Link from '~/components/Link'

type TProps = {
  handlePinInputComplete: (_value: any, _index: any) => void;
  isLoading: boolean;
  apiErr?: string;
  onCancel: () => void
}

export const CustomPinInput = ({
  handlePinInputComplete,
  isLoading,
  apiErr,
  onCancel,
}: TProps) => {
  return (
    <>
      <Card sx={{ width: '100%', mb: 2 }}>
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
              inputStyle={{ borderColor: '#ff715c', borderRadius: '10px', borderWidth: '2px' }}
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
        </CardContent>
        <CardActions
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {/* <Button size="small">Learn More</Button> */}
          <Button disabled={isLoading} endIcon={<ArrowForwardIcon />} variant="contained" color='primary' component={Link} noLinkStyle href='https://t.me/pravosleva_bot?start=autopark' target='_blank'>
            Get Password
          </Button>
          <Button disabled={isLoading} variant="outlined" color='secondary' onClick={onCancel}>
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
