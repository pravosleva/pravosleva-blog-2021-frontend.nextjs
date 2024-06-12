import {
  // Autocomplete,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent as TSelectChangeEvent,
  TextField,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { TSocketMicroStore, useStore } from './withSocketContext'
import { useCallback, memo, useMemo } from 'react'
import CloseIcon from '@mui/icons-material/Close'
// import { clientAppVersionlistSupport } from '~/srv.socket-logic/withSP/constants'
// import { TOption } from '~/mui/CreatableAutocomplete'
import { groupLog } from '~/utils/groupLog'
import { useSnapshot } from 'valtio'
import { vi } from './vi'

// const appVersionList: TOption[] = clientAppVersionlistSupport.map((value) => ({ inputValue: value, value, label: value }))

const CustomizedTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
  },
})

export const FiltersContent = memo(() => {
  const [isConnected] = useStore((store: TSocketMicroStore) => store.isConnected)
  const viState = useSnapshot(vi.FOR_EXAMPLE)
  // viState

  const [imeiFilter, setStore] = useStore((store: TSocketMicroStore) => store.imeiFilter)
  const handleChangeImei = useCallback((e: any) => {
    setStore({ imeiFilter: e.target.value })
  }, [setStore])
  const handleClearImeiFilter = useCallback((_e: any) => {
    setStore({ imeiFilter: null })
  }, [setStore])

  const [appVersionFilter] = useStore((store: TSocketMicroStore) => store.clientAppVersionFilter)
  const appVersionList = useMemo(() => {
    return viState.items.reduce((acc, cur) => {
      // @ts-ignore
      if (!acc.includes(cur.appVersion)) acc.push(cur.appVersion)

    return acc;
    }, [])
  }, [viState.items])
  const handleChangeClientAppVersion = useCallback((e: TSelectChangeEvent) => {
    groupLog({ spaceName: '-> set to store', items: [e.target.value] })
    setStore({ clientAppVersionFilter: e.target.value })
    // @ts-ignore
    // if (!!appVersionInputRef.current) appVersionInputRef.current.value = val
  }, [setStore])
  const handleClearAppVersionFilter = useCallback((_e: any) => {
    setStore({ clientAppVersionFilter: null })
    // @ts-ignore
    // if (!!appVersionInputRef.current) appVersionInputRef.current.value = ''
  }, [setStore])

  const [ipFilter] = useStore((store: TSocketMicroStore) => store.ipFilter)
  const handleChangeIP = useCallback((e: any) => {
    setStore({ ipFilter: e.target.value })
  }, [setStore])
  const handleClearIPFilter = useCallback((_e: any) => {
    setStore({ ipFilter: null })
  }, [setStore])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
        <CustomizedTextField
          size='small'
          disabled={!isConnected}
          value={imeiFilter || ''}
          fullWidth
          variant='outlined'
          label='IMEI'
          type='text'
          onChange={handleChangeImei}
          // multiline
          // maxRows={4}
        />
        <div>
          <IconButton
            color={!!imeiFilter ? 'error' : 'default'}
            aria-label='imei'
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
      
      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>  
        {/* <Autocomplete
          onChange={(event, item) => {
            groupLog({ spaceName: 'onChange', items: [event, item] })
            switch (true) {
              case !!item?.value:
                groupLog({ spaceName: '-> check item', items: [item] })
                if (typeof item?.value === 'string') {
                  groupLog({ spaceName: '-> handleChangeClientAppVersion', items: [item.value] })
                  handleChangeClientAppVersion(item.value)
                }
                break
              default:
                handleClearAppVersionFilter(event)
                break
            }
          }}
          // onSelect={(e) => {
          //   groupLog({ spaceName: 'onSelect', items: [e.target] })
          // }}
          sx={{ width: '100%' }}
          options={appVersionList}
          groupBy={(option) => option.value.split('.')[0]}
          renderInput={(params) => (
            <CustomizedTextField
              {...params}
              label='Client app version'
              size='small'
              disabled={!isConnected}
              // value={appVersionFilter || ''}
              fullWidth
              variant='outlined'
              type='text'
            />
          )}
          onClose={handleClearAppVersionFilter}
        /> */}
        <FormControl
          sx={{ width: '100%' }}
          disabled={!isConnected}
          size='small'
        >
          <InputLabel id='app-ver-select-label'>Client app version</InputLabel>
          <Select
            size='small'
            sx={{
              borderRadius: '8px',
              // width: '100%',
            }}
            labelId='app-ver-select-label'
            id='app-ver-select'
            value={appVersionFilter || ''}
            renderValue={() => appVersionFilter}
            label='Client app version'
            // input={<CustomizedTextField label='Client app version' />}
            onChange={handleChangeClientAppVersion}
          >
            <MenuItem
              value=''
              // style={getStyles(name, personName, theme)}
            >
              <em>None</em>
            </MenuItem>
            {appVersionList.map((str) => (
              <MenuItem
                key={str}
                value={str}
                // style={getStyles(name, personName, theme)}
              >
                {str}
              </MenuItem>
            ))}
          </Select>
          {/* <FormHelperText>Disabled</FormHelperText> */}
        </FormControl>
        <div>
          <IconButton
            color={!!appVersionFilter ? 'error' : 'default'}
            aria-label='app-version'
            onClick={handleClearAppVersionFilter}
            disabled={!isConnected || !appVersionFilter}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>  
        <CustomizedTextField
          size='small'
          disabled={!isConnected}
          value={ipFilter || ''}
          fullWidth
          variant='outlined'
          label='IP'
          type='text'
          onChange={handleChangeIP}
        />
        <div>
          <IconButton
            color={!!ipFilter ? 'error' : 'default'}
            aria-label='ip'
            onClick={handleClearIPFilter}
            disabled={!isConnected || !ipFilter}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
})
