import { Box } from '@mui/material'
import { ProjectList } from './components'
import { IRootState } from '~/store/IRootState'
import { useSelector } from 'react-redux'

type TProps = {
  chat_id: string
}

export const Autopark2022 = ({
  chat_id
}: TProps) => {
  const autoparkData = useSelector((s: IRootState) => s.autopark)
  
  return (
    <>
      {/* <Button disabled={isLoading} variant='outlined' sx={{ mb: 2 }} onClick={countInc} color='secondary'>Count inc</Button> */}
      {/* <pre>{JSON.stringify(autoparkData, null, 2)}</pre> */}
      {!!autoparkData.userCheckerResponse?.projects && (
        <Box sx={{ pt: 5, pb: 2 }}>
          {/* Object.keys(autoparkData.userCheckerResponse?.projects).length} project(s) */}
          <h1>Гараж</h1>
        </Box>
      )}
      <ProjectList chat_id={chat_id} />
    </>
  )
}
