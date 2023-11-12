import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { useForm, RegisterOptions as TRegisterOptions } from 'react-hook-form'
import { useCallback, useState, Fragment, useLayoutEffect, useMemo } from 'react'
import { FieldAsMenuBtn } from './components'
import { useCompare } from '~/hooks/useDeepEffect'
import Rating from '@mui/material/Rating'

type TProps = {
  isOpened: boolean;
  cb: {
    onSuccess: (values: any) => void;
    onError: (err: any) => void;
    onClose: () => void;
  };
  label: string;
  dialogDescription?: string;
  // muiColor: 'primary' | 'secondary';
  cfg: {
    [key: string]: {
      inputId: string;
      label: string;
      placeholder: string;
      type: 'rating' | 'list' | React.InputHTMLAttributes<unknown>['type'];
      list?: { label: string; value: string; }[];
      defaultValue: string | boolean | number;
      reactHookFormOptions?: TRegisterOptions;
      isRequired?: boolean;
      validate: (val: any) => boolean;
    }
  };
}

export const AddAnythingNewDialog = ({
  isOpened,
  cb,
  label,
  dialogDescription,
  cfg,
}: TProps) => {
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: {
      errors,
      // isValid,
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

  const initialAuxState = useMemo(() => Object.keys(cfg).reduce((acc: { [key: string]: string | boolean | number }, key) => {
    acc[key] = cfg[key].defaultValue
    return acc
  }, {}), [useCompare([cfg])])
  const [auxState, setAuxState] = useState<{ [key: string]: any }>(initialAuxState)
  const resetAuxState = useCallback(() => {
    setAuxState(initialAuxState)
  }, [initialAuxState, setAuxState])


  const handleSuccess = useCallback((vals: any) => {
    cb.onSuccess(vals)
    cb.onClose()
    reset()
    resetAuxState()
    
  }, [cb, reset, resetAuxState])
  const handleError = useCallback((arg: any) => {
    cb.onError(arg)
  }, [cb])

  const handleClose = useCallback(() => {
    cb.onClose()
    reset()
    resetAuxState()
  }, [cb, reset, resetAuxState])

  const [isFormReady, setIsFormReady] = useState<boolean>(false)

  useLayoutEffect(() => {
    const subscription = watch((
      state,
      // { name, type }
    ) => {
      // console.log({ state, name, type })
      const counters = { ok: 0, fail: 0 }
      for (const key in cfg) {
        switch (key) {
          default:
            if (cfg[key].isRequired) {
              if (cfg[key].validate(state[key])) counters.ok += 1
              else counters.fail += 1
            } else counters.ok += 1
            break
        }
      }

      if (counters.ok === Object.keys(cfg).length && counters.fail === 0) setIsFormReady(true)
      else setIsFormReady(false)
    })
    return () => subscription.unsubscribe()
  }, [setIsFormReady])

  return (
    <Dialog open={isOpened} onClose={handleClose} maxWidth='sm'>
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
          Object.keys(cfg).map((key, i) => {
            switch (cfg[key].type) {
              case 'rating':
                return (
                  <Rating
                    key={`${key}-${i}`}
                    name='rating-controlled'
                    value={auxState[key]}
                    onChange={(_event, newValue) => {
                      setValue(key, newValue || 0)
                      setAuxState({ [key]: newValue || 0 })
                    }}
                  />
                )
              case 'list':
                return (
                  <Fragment key={`${key}-${i}`}>
                    {auxState[key] || cfg[key].placeholder}
                    <FieldAsMenuBtn
                      label={cfg[key].label}
                      items={cfg[key].list || []}
                      onSelect={({ value }: { label: string; value: string }) => {
                        setValue(key, value)
                        setAuxState({ [key]: value })
                      }}
                      placeholder={cfg[key].placeholder}
                    />
                  </Fragment>
                )
              default:
                return (
                  <TextField
                    key={`${key}-${i}`}
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
                )
            }
          })
        }
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant='contained'
          onClick={
            handleSubmit(handleSuccess, handleError)
          }
          // disabled={Object.keys(errors).length !== 0 || !isValid}
          disabled={!isFormReady}
        >Next</Button>
      </DialogActions>
    </Dialog>
  )
}
