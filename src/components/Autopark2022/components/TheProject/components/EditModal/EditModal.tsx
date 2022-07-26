import { Modal, Box, Typography, Button, TextField, Grid } from '@mui/material'
import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveProject, updateProjects } from '~/store/reducers/autopark';

type TProps = {
  chat_id: string;
  project_id: string;
  isOpened: boolean;
  onClose?: () => void;
  initialState: {
    id: number;
    name: string;
    description: string;
    mileage: {
      last: number;
      delta: number;
    }
  }
}
type TReqArgs = {
  chat_id: string,
  project_id: string,
  item: {
    id: number,
    name: string,
    description: string,
    mileage: {
      last: number,
      delta: number,
    }
  }
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
const fetchUpdateItem = async ({ chat_id, project_id, item }: TReqArgs) => {
  const result = await api
    .post('/project/update-item', {
      chat_id,
      project_id,
      item,
    })
    .then((res: any) => {
      // console.log(res)
      return res.data
    })
    .catch((err: any) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '1px solid #000',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
}

export const EditModal = ({
  chat_id,
  project_id,
  isOpened,
  onClose,
  initialState,
}: TProps) => {
  const [name, setName] = useState(initialState.name)
  const [description, setDescription] = useState(initialState.description)
  const [mileageLast, setMileageLast] = useState<number>(initialState.mileage.last)
  const [mileageDelta, setMileageDelta] = useState<number>(initialState.mileage.delta)

  const handleChangeName = useCallback((e) => {
    setName(e.target.value)
  }, [])
  const handleChangeDescr = useCallback((e) => {
    setDescription(e.target.value)
  }, [])
  const handleChangeMileageLast = useCallback((e) => {
    setMileageLast(parseInt(e.target.value))
  }, [])
  // const handleChangeMileageDelta = useCallback((event: Event, newValue: number | number[]) => {
  //   setMileageDelta(newValue as number);
  // }, [])
  const handleChangeMileageDelta = useCallback((e) => {
    setMileageDelta(parseInt(e.target.value))
  }, [])

  const isFormCorrect = useMemo(() => !!name && !!initialState.id && !!description && !!mileageLast && !!mileageDelta, [name, initialState.id, description, mileageLast, mileageDelta])
  const dispatch = useDispatch()
  const handleSubmit = useCallback(() => {
    console.log({
      name, id: initialState.id, description, mileageLast, mileageDelta
    })
    fetchUpdateItem({
      chat_id,
      project_id,
      item: {
        id: initialState.id,
        name,
        description,
        mileage: {
          delta: mileageDelta,
          last: mileageLast,
        },
      },
    })
      .then((res) => {
        if (res.ok) {
          if (!!res.projects) {
            dispatch(updateProjects(res.projects))
            const targetProject = res.projects[project_id]

            if (!!targetProject) dispatch(setActiveProject(targetProject))
          }
          // resetAll()
          if (!!onClose) onClose()
        }
        // else if (!!res.message) setApiErr(res.message)

        return res
      })
  }, [name, initialState.id, description, mileageLast, mileageDelta, onClose])

  return (
    <Modal
      open={isOpened}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        <Box sx={style}>
          <Box sx={{ mb: 2 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit item
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              value={name}
              size='small'
              fullWidth
              // disabled={isLoading}
              variant="outlined"
              label="Name"
              type="text"
              onChange={handleChangeName}
            ></TextField>
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              value={description}
              size='small'
              fullWidth
              // disabled={isLoading}
              variant="outlined"
              label="Description"
              type="text"
              onChange={handleChangeDescr}
            ></TextField>
          </Box>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField value={mileageLast} size='small' fullWidth variant="outlined" label="Mileage Last" type="number" onChange={handleChangeMileageLast}></TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField value={mileageDelta} size='small' fullWidth variant="outlined" label="Mileage Delta" type="number" onChange={handleChangeMileageDelta}></TextField>
            </Grid>
          </Grid>

          {/* isDev && (
            <pre>{JSON.stringify(initialState, null, 2)}</pre>
          ) */}

          <Grid container spacing={2}>
            {!!onClose && (
              <Grid item xs={6}>
                <Button fullWidth variant='outlined' onClick={onClose} color='secondary' sx={{ mb: 2 }}>Close</Button>
              </Grid>
            )}
            <Grid item xs={6}>
              <Button fullWidth variant='contained' onClick={handleSubmit} disabled={!isFormCorrect} color='secondary'>Send</Button>
            </Grid>
          </Grid>
        </Box>
      </>
    </Modal>
  )
}
