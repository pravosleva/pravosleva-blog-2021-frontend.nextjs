import { useState, useCallback } from 'react'
import {
  // Box,
  Button,
  Grid,
  // Stack,
  TextField,
  // Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
// import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
// import CommentBankIcon from '@mui/icons-material/CommentBank'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useStyles } from './styles'
import { styled } from '@mui/material/styles'

type TProps<T> = {
  initialState: T;
  onSuccess: ({ state }: { state: T }) => void;
}

const CustomizedTextField = styled(TextField)({
  // '& label.Mui-focused': {
  //   color: 'green',
  // },
  // '& .MuiInput-underline:after': {
  //   borderBottomColor: 'green',
  // },
  '& .MuiOutlinedInput-root': {
    // '& fieldset': {
    //   borderColor: 'red',
    // },
    // '&:hover fieldset': {
    //   borderColor: 'yellow',
    // },
    // '&.Mui-focused fieldset': {
    //   borderColor: 'green',
    // },
    borderRadius: '8px',
  },
});

export const CommentBtn: React.FC<TProps<{ comment: string; }>> = ({
  initialState,
  onSuccess,
}) => {
  const classes = useStyles()
  const [comment, setComment] = useState<string>(initialState.comment)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const handleEditToggle = useCallback(() => {
    setIsEditMode((s) => !s)
  }, [])
  const handleReset = useCallback(() => {
    setComment(initialState.comment)
  }, [initialState.comment])

  const handleClose = useCallback(() => {
    setIsEditMode(false)
  }, [initialState.comment])
  
  const handleChange = useCallback((e) => {
    setComment(e.target.value)
  }, [])
  const handleSubmit = useCallback(() => {
    onSuccess({ state: { comment } })
    handleClose()
  }, [comment])

  const handleRemove = useCallback(() => {
    setComment('')
    onSuccess({ state: { comment: '' } })
    handleClose()
  }, [])

  return (
    <>
      {
        isEditMode ? (
          <Grid container spacing={2} sx={{ pb: 2 }}>
            <Grid item xs={12}>
              <CustomizedTextField
                size='small'
                // disabled={isLoading}
                value={comment}
                fullWidth
                variant='outlined'
                label="Comment"
                type="text"
                onChange={handleChange}
                multiline
                maxRows={4}
                // sx={{
                //   borderRadius: '8px',
                // }}
              />
            </Grid>

            <Grid item xs={6}>
              <Button
                // size='small'
                fullWidth
                disabled={!comment || comment === initialState.comment || comment.length > 200}
                variant='contained' onClick={handleSubmit} color='primary' startIcon={<SaveIcon />}
              >Сохранить</Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                // size='small'
                fullWidth variant='outlined' onClick={() => {
                  handleReset()
                  handleClose()
                }} color='error' startIcon={<CloseIcon />}
              >Отмена</Button>
            </Grid>
          </Grid>
        ) : (
          <>
            {!!comment ? (
              <Grid container spacing={2} sx={{ pb: 2 }}>
                <Grid item xs={12}>
                  <div className={classes.commentBox}>
    
                    <div className={classes.commentDescription}>
                      <pre
                        style={{
                          fontSize: '13px',
                          maxHeight: '150px',
                        }}
                        className='text-wrap'
                      >{comment}</pre></div>
                    <div className={classes.commentAction}>
                      <div>
                        <Button
                          // size='small'
                          // startIcon={<CommentBankIcon />}
                          // fullWidth
                          variant="outlined" color='primary' onClick={handleEditToggle}
                          // sx={{
                          //   borderRadius: (t) => t.spacing(1, 0, 1, 0)
                          // }}
                        >
                          <EditIcon fontSize='small' />
                        </Button>
                        <Button
                          // size='small'
                          // startIcon={<CommentBankIcon />}
                          // fullWidth
                          variant="outlined" color='error' onClick={handleRemove}
                          // sx={{
                          //   borderRadius: (t) => t.spacing(1, 0, 1, 0)
                          // }}
                        >
                          <DeleteIcon fontSize='small' />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2} sx={{ pb: 2 }}>
                <Grid item xs={12}>
                  <Button
                    // size='small'
                    startIcon={<AddIcon />}
                    fullWidth
                    variant="outlined" color='primary' onClick={handleEditToggle}

                  >
                    Добавить комментарий
                  </Button>
                </Grid>
              </Grid>
            )}
          </>
        )
      }
    </>
  )
}
