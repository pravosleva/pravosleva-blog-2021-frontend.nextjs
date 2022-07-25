import { Button } from '@mui/material';
import { useCallback } from 'react';
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState';
import AddIcon from '@mui/icons-material/Add'

type TProps = {
  chat_id: string;
  project_id: string;
}

export const TheProject = ({
  // chat_id,
  // project_id,
}: TProps) => {
  const activeProject = useSelector((state: IRootState) => state.autopark.activeProject)
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)
  const handleEdit = useCallback(() => {
    if (typeof window !== 'undefined') window.alert('WIP #2:\nTODO: 1) API 2) front')
  }, [])
  const handleAddItem = useCallback(() => {
    if (typeof window !== 'undefined') window.alert('WIP #1:\nTODO: 1) API 2) front')
  }, [])

  return (
    <>
      <div>Hello from Redux</div>
      <pre>{JSON.stringify(activeProject, null, 2)}</pre>

      {
        isOneTimePasswordCorrect && (
          <Button sx={{ mb: 2 }} fullWidth variant="outlined" color='secondary' onClick={handleEdit}>
            Edit
          </Button>
        )
      }

      {
        isOneTimePasswordCorrect && (
          <Button sx={{ mb: 2 }} fullWidth variant="contained" color='primary' onClick={handleAddItem} startIcon={<AddIcon />}>
            Добавить расходник
          </Button>
        )
      }
    </>
  )
}
