/* eslint-disable no-extra-boolean-cast */
import { useCallback, memo } from 'react'
// import { FaCopy, FaRegCopy } from 'react-icons/fa'
import clsx from 'clsx'
import {
  useSnackbar,
  SnackbarMessage as TSnackbarMessage,
  OptionsObject as IOptionsObject,
  // SharedProps as ISharedProps,
  // closeSnackbar,
} from 'notistack'
import classes from './InlineActionTagWrapper.module.scss'

type TProps = {
  text: string;
  isActive: boolean;
  onClick?: () => void;
  showNotifOnClick?: boolean;
  endIcon?: {
    Inactive: React.ReactNode;
    Active: React.ReactNode;
  };
}

export const InlineActionTagWrapper = memo(({ isActive, onClick, text, showNotifOnClick, endIcon}: TProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const showNotif = useCallback((msg: TSnackbarMessage, opts?: IOptionsObject) => {
    if (!document.hidden) enqueueSnackbar(msg, opts)
  }, [enqueueSnackbar])
  // const showError = useCallback(({ message }: { message: string }) => {
  //   showNotif(message, { variant: 'default' })
  // }, [showNotif])
  // const showSuccess = useCallback(({ message }: { message: string }) => {
  //   showNotif(message, { variant: 'default' })
  // }, [showNotif])
  const showInfo = useCallback(({ message }: { message: string }) => {
    showNotif(message || 'No message', {
      variant: 'info',
      hideIconVariant: true,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      action: null,
    })
  }, [showNotif])
  const handleClick = useCallback(() => {
    if (showNotifOnClick) showInfo({ message: 'Clicked' })
    if (!!onClick) onClick()
  }, [showNotifOnClick, onClick, showInfo, text])

  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '0px',
      }}
      onClick={handleClick}
    >
      <span
        className={clsx([
          classes.wrapper,
          {
            [classes.danger]: !isActive,
            [classes.success]: isActive,
          },
        ])}
      >
        <code
          className={clsx([
            classes.inlineCode,
            classes.targetText,
          ])}
        >{text}</code>
        {
          !!endIcon && (
            !isActive ? (
              <span className={classes.copyIcon}>
                {endIcon.Inactive}
              </span>
            ) : (
              // <span className={classes.copyInfo}>Скопировано</span>
              <span className={classes.copyIcon}>
                {endIcon.Active}
              </span>
            )
          )
        }
      </span>
    </span>
  )
})
