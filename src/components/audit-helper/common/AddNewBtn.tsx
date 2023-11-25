import { useState, useCallback } from 'react'
import { Button, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useForm, RegisterOptions as TRegisterOptions } from 'react-hook-form'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

type TProps = {
  cb: {
    onSuccess: (values: any) => void;
    onError: (err: any) => void;
  };
  label: string;
  dialogDescription?: string;
  muiColor: 'primary' | 'secondary';
  cfg: {
    [key: string]: {
      inputId: string;
      label: string;
      placeholder: string;
      type: React.InputHTMLAttributes<unknown>['type'];
      defaultValue: string | boolean | number;
      reactHookFormOptions?: TRegisterOptions,
    }
  };
  isDisabled?: boolean;
}

export const AddNewBtn = ({
  cb,
  label,
  dialogDescription,
  muiColor,
  cfg,
  isDisabled,
}: TProps) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid,
    },
    reset,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: Object.keys(cfg).reduce((acc: { [key: string]: string | boolean | number }, key) => {
      acc[key] = cfg[key].defaultValue
      return acc
    }, {}),
  })

  const [isOpened, setIsOpened] = useState(false);
  const handleClickOpen = useCallback(() => {
    setIsOpened(true)
  }, [setIsOpened]);
  const handleClose = useCallback(() => {
    setIsOpened(false)
  }, [setIsOpened]);
  const handleSuccess = useCallback((vals: any) => {
    // console.log(formState)
    cb.onSuccess(vals)
    setIsOpened(false)
    reset()
  }, [cb, setIsOpened, reset])
  const handleError = useCallback((arg: any) => {
    cb.onError(arg)
  }, [cb])

  return (
    <>
      <Dialog open={isOpened} onClose={handleClose}>
        <DialogTitle>{label}</DialogTitle>
        <DialogContent>
          {
            !!dialogDescription && (
              <DialogContentText>
                {dialogDescription}
              </DialogContentText>
            )
          }
          {
            Object.keys(cfg).map((key, i) => (
              <TextField
                key={key}
                autoFocus={i === 0}
                margin="dense"
                id={cfg[key].inputId}
                label={cfg[key].label}
                type={cfg[key].type}
                fullWidth
                variant="standard"
                error={!!errors[key]}
                {...register(key, cfg[key].reactHookFormOptions || undefined)}
              />
            ))
          }
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant='contained'
            onClick={
              handleSubmit(handleSuccess, handleError)
            }
            disabled={Object.keys(errors).length !== 0 || !isValid}
          >Next</Button>
        </DialogActions>
      </Dialog>

      <Button
        startIcon={<AddIcon />}
        fullWidth
        variant='contained'
        color={muiColor}
        onClick={handleClickOpen}
        disabled={isDisabled}
      >{label}</Button>
    </>
  )
}
