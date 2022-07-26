import { Alert, Typography } from '@mui/material'
import PinInput from 'react-pin-input'

type TProps = {
  handlePinInputComplete: (_value: any, _index: any) => void;
  isLoading: boolean;
  apiErr?: string;
}

export const CustomPinInput = ({
  handlePinInputComplete,
  isLoading,
  apiErr,
}: TProps) => {
  return (
    <Alert sx={{ mb: 2 }} variant="outlined" severity="info">
      <Typography variant="body2" component="h2" gutterBottom>
        Для входа в режим редактирования введите одноразовый пароль:
      </Typography>
      <PinInput 
        length={4} 
        initialValue=""
        secret 
        // onChange={(value, index) => {}} 
        type="numeric" 
        inputMode="number"
        style={{ padding: '0px' }}  
        inputStyle={{ borderColor: '#ff715c', borderRadius: '50%' }}
        inputFocusStyle={{ borderColor: '#03A9F4' }}
        onComplete={handlePinInputComplete}
        // autoSelect={true}
        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        disabled={isLoading}
      />
      {!!apiErr && (
        <Typography variant="body2" component="h3" gutterBottom>
          {apiErr}
        </Typography>
      )}
    </Alert>
  )
}
