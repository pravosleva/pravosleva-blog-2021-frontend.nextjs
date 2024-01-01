import { IconButton, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { TSocketMicroStore, useStore } from './withSocketContext'
import { useCallback } from 'react'
import CloseIcon from '@mui/icons-material/Close'

const CustomizedTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
})

export const FiltersContent = () => {
  const [imeiFilter, setStore] = useStore((store: TSocketMicroStore) => store.imeiFilter)
  const [isConnected] = useStore((store: TSocketMicroStore) => store.isConnected)
  const onChangeImei = useCallback((e: any) => {
    setStore({ imeiFilter: e.target.value })
  }, [])
  const handleClearImeiFilter = useCallback((_e: any) => {
    setStore({ imeiFilter: null })
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
      }}
    >
      <CustomizedTextField
        size='small'
        disabled={!isConnected}
        value={imeiFilter || ''}
        fullWidth
        variant='outlined'
        label='IMEI'
        type='text'
        onChange={onChangeImei}
        // multiline
        // maxRows={4}
      />
      <div>
        <IconButton
          color={!!imeiFilter ? 'error' : 'default'}
          aria-label='edit-audit'
          // size='small'
          // startIcon={<CloseIcon />}
          // fullWidth
          // variant='outlined'
          
          onClick={handleClearImeiFilter}
          // endIcon={<b style={{ fontSize: 'smaller' }}><code>{spReportRoomId}</code></b>}
          disabled={!isConnected || !imeiFilter}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  )
}
