import { useMemo } from 'react'
import { Box } from '@mui/material'
import { ProjectList } from './components'
import { IRootState } from '~/store/IRootState'
import { OneTimeLoginFormBtn } from './components'
import { useSelector } from 'react-redux'

type TProps = {
  chat_id: string
}

export const Autopark2022 = ({
  chat_id
}: TProps) => {
  const autoparkData = useSelector((s: IRootState) => s.autopark)
  const isBrowser = useMemo(() => typeof window !== 'undefined', [typeof window])
  
  return (
    <>
      {/* <Button disabled={isLoading} variant='outlined' sx={{ mb: 2 }} onClick={countInc} color='secondary'>Count inc</Button> */}
      {/* <pre>{JSON.stringify(autoparkData, null, 2)}</pre> */}
      {!!autoparkData.userCheckerResponse?.projects && (
        <Box sx={{ mb: 2 }}>{Object.keys(autoparkData.userCheckerResponse?.projects).length} project(s)</Box>
      )}
      <Box>
        <ProjectList chat_id={chat_id} />
      </Box>
      {
        isBrowser && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <OneTimeLoginFormBtn
              chat_id={chat_id}
            />
          </Box>
        )
      }
    </>
  )
}
